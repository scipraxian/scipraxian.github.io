---
id: architecture
title: "Architecture — The Brain"
sidebar_position: 4
---

# Architecture — The Brain of Are-Self

Are-Self is built as a brain. Not metaphorically — structurally. Each Django app is a brain region, and each region does what its biological namesake actually does. This document is your map.

## Why a Brain?

Because brains are the best architecture for autonomous reasoning that we know of. The separation of concerns in a real brain — memory formation separate from motor control separate from decision-making separate from sensory relay — maps almost perfectly onto the engineering problems of an AI swarm manager.

It also makes the system teachable. When someone asks "where do memories live?", the answer is the same whether you're talking about a brain or about Are-Self: the [Hippocampus](./brain-regions/hippocampus).

## The Tick Cycle

Everything in Are-Self exists to support one loop: **the tick cycle**. This is one heartbeat of the system.

```
PNS (Celery Beat ticks)
  → Temporal Lobe (wakes the active iteration, picks the current shift)
    → CNS (fires a spike train through the neural pathway)
      → Spikes cascade through neurons
        → Frontal Lobe (starts a reasoning session)
          → The LLM reasons in a while-True loop
            → Parietal Lobe (executes tools)
            → Hippocampus (stores and retrieves memories)
            → Hypothalamus (selects the right model)
          → Session concludes or yields
        → Control returns up the spike chain
      → Next spike fires
    → Shift turn count increments
  → Next tick
```

```
celery beat schedule (periodic task)
  → temporal_lobe/temporal_lobe.py → trigger_temporal_metronomes()
    → fetch_canonical_temporal_pathway() → returns NeuralPathway
      → central_nervous_system/central_nervous_system.py → CNS builds SpikeTrain
        → neuromuscular_junction.py → fire_spike() (Celery task entry point)
          → _execute_spike() → dispatches to effector
            → frontal_lobe/ → ReasoningSession while-True loop
              → identity/identity_prompt.py → build_identity_prompt()
              → _build_turn_payload() → LLM call via LiteLLM
              → parietal_lobe/parietal_mcp/mcp_*.py → ParietalMCP gateway
              → hippocampus/hippocampus.py → Hippocampus.save_engram() / read_engram()
              → hypothalamus/ → model selection + budget gating
            → mcp_done() or mcp_respond_to_user(yield_turn=True)
          → spike.result_code set → synaptic_cleft/ → fire_neurotransmitter()
        → next spike in train fires
      → shift turn count increments
    → iteration advances or sleeps
  → next beat tick
```

The tick is a **Celery Beat schedule**. Every N seconds, the [PNS](./brain-regions/peripheral-nervous-system) fires. If there's an active iteration in the current environment, the [Temporal Lobe](./brain-regions/temporal-lobe) wakes it and the cascade begins. If nothing's active, the tick is a no-op.

## The Regions

### [Identity](./brain-regions/identity) (`identity/`)

Think of an **Identity** as a character sheet in a role-playing game. It defines who this AI agent *is* — a system prompt template, a set of enabled tools, addon phases that layer context during prompt assembly, and model routing preferences.

But Identities don't do work directly. They get **forged** into **IdentityDiscs** — deployed instances with their own level, XP, success/failure record, and memory. One Identity blueprint can produce many Discs, each accumulating their own experience. Like a class and its instances in code.

The system prompt template supports Django template syntax. Variables like `&#123;&#123;identity_disc.name&#125;&#125;` and `&#123;&#123;iteration.name&#125;&#125;` are rendered at runtime with the full ORM context.

IdentityDiscs are vector-embedded (768-dim, nomic-embed-text). The vector auto-regenerates when the prompt, type, tags, or addons change. This embedding is what the [Hypothalamus](./brain-regions/hypothalamus) uses for model matching — it finds the model whose personality best fits the identity.

### [Temporal Lobe](./brain-regions/temporal-lobe) (`temporal_lobe/`)

Your temporal lobe keeps track of time — when things happened, what order, what's next. Are-Self's [Temporal Lobe](./brain-regions/temporal-lobe) is the scheduler. It manages **Iterations** — work cycles divided into **Shifts**.

An **Iteration Definition** is a blueprint: a sequence of shift columns (Sifting → Pre-Planning → Planning → Executing → Post-Execution → Sleeping), each with a turn limit. You drag IdentityDiscs into shift columns to assign participants.

**Incepting** a definition creates a live **Iteration** bound to an **Environment**. The iteration tracks which shift is current and how many turns have been consumed. The [Temporal Lobe](./brain-regions/temporal-lobe) advances through shifts as turn limits are reached.

Shifts correspond to project phases. During Sifting, the PM identity refines the backlog. During Executing, worker identities tackle assigned stories. During Sleeping, identities review their memories and grow. The shift type determines what the [Identity](./brain-regions/identity) is expected to do — enforced by the system prompt template, not by code.

### [Central Nervous System](./brain-regions/central-nervous-system) (`central_nervous_system/`)

In a real brain, the central nervous system is the highway that carries signals everywhere. In Are-Self, the [CNS](./brain-regions/central-nervous-system) is the execution engine. Everything that actually happens passes through it as spikes.

A **Neural Pathway** is a graph of **Neurons** connected by **Axons**. Each neuron has an **Effector** — either a native Python handler or a Celery task. A **Spike Train** is a single traversal of a pathway. As the train moves through the graph, it creates **Spikes** — one per neuron — which execute their effectors.

The CNS doesn't know about reasoning or AI. It's a generic directed-graph execution engine. The fact that one of its effectors happens to start a reasoning session in the [Frontal Lobe](./brain-regions/frontal-lobe) is just configuration. Other effectors launch processes, push code, or call APIs.

Spikes carry a **blackboard** — a JSON dict that accumulates data as the train passes through neurons. Each effector can read from and write to the blackboard. This is how context flows through the execution graph without tight coupling between neurons.

### [Frontal Lobe](./brain-regions/frontal-lobe) (`frontal_lobe/`)

The frontal lobe is the part of your brain that *thinks* — not quick reactions, but the kind of thinking where you sit down, focus, and work through a problem step by step. Are-Self's [Frontal Lobe](./brain-regions/frontal-lobe) runs **Reasoning Sessions** — the actual LLM inference loop.

A session is a `while True` loop: assemble the prompt (identity + addons + history + terminal), call the LLM, parse tool calls, dispatch to the [Parietal Lobe](./brain-regions/parietal-lobe), record the turn, repeat. The loop breaks when the LLM calls `mcp_done` (terminal) or `mcp_respond_to_user` with `yield_turn=True` (pauses for human input).

Each turn is a **Reasoning Turn** with full telemetry: token counts, inference time, model used, tool calls made. The frontend watches turns appear in real time via WebSocket.

Sessions have a **Focus** economy — a budget that decreases with each turn and tool call. When focus runs out, the session must conclude. But saving a genuinely new memory to the [Hippocampus](./brain-regions/hippocampus) earns focus *back*. The system literally rewards itself for learning.

### [Parietal Lobe](./brain-regions/parietal-lobe) (`parietal_lobe/`)

If the [Frontal Lobe](./brain-regions/frontal-lobe) is the brain, the [Parietal Lobe](./brain-regions/parietal-lobe) is the hands. It executes tools on behalf of the Frontal Lobe.

Tool definitions live in the database as `ToolDefinition` records with typed parameters. The **ParietalMCP** gateway dynamically imports and calls the matching Python function from `parietal_mcp/mcp_*.py`. Each function receives `session_id` and `turn_id` injected by the gateway.

The gateway includes **hallucination armor** — validation that the tool name exists, parameters match their types, and required parameters are present. LLMs hallucinate tool calls; the [Parietal Lobe](./brain-regions/parietal-lobe) catches them before they do damage.

### [Hippocampus](./brain-regions/hippocampus) (`hippocampus/`)

Your hippocampus is where memories form. Are-Self's [Hippocampus](./brain-regions/hippocampus) stores **Engrams** — vector-embedded facts extracted during reasoning.

Each engram has a name (a unique hash for dedup), a description (the actual fact), tags, a relevance score, and a 768-dimensional vector embedding. On save, the [Hippocampus](./brain-regions/hippocampus) checks cosine similarity against existing engrams — if a new memory is 90% or more similar to an existing one, the save is rejected with a message pointing to the duplicate. This prevents the LLM from endlessly re-saving things it already knows.

Engrams are linked to sessions, turns, spikes, and IdentityDiscs. This provenance chain lets you trace any memory back to exactly when and why it was formed. The vector embedding auto-regenerates when an engram's description or tags change, using nomic-embed-text via Ollama. Future sessions retrieve relevant engrams by vector similarity search.

### [Hypothalamus](./brain-regions/hypothalamus) (`hypothalamus/`)

In your brain, the hypothalamus manages resources — body temperature, hunger, energy levels. It doesn't think; it makes sure the thinker has what it needs. Are-Self's [Hypothalamus](./brain-regions/hypothalamus) does the same thing for AI models.

When the [Frontal Lobe](./brain-regions/frontal-lobe) needs to make an LLM call, it asks the [Hypothalamus](./brain-regions/hypothalamus) to select a model. Selection uses vector-similarity matching between the [IdentityDisc](./brain-regions/identity)'s embedding and the model catalog embeddings, filtered by budget constraints and circuit breaker status.

The [Hypothalamus](./brain-regions/hypothalamus) tracks model health with three mechanisms: **circuit breakers** (escalating timeouts for provider failures, capping at 5 minutes), **resource cooldowns** (flat 60-second pause when the host runs out of memory — not the provider's fault), and **scar tissue** (permanent capability disablement when a model can't do function calling at all). See the [Hypothalamus docs](./brain-regions/hypothalamus) for the full breakdown.

### [Synaptic Cleft](./brain-regions/synaptic-cleft) (`synaptic_cleft/`)

Neurons in your brain don't actually touch each other — there's a tiny gap between them called the synaptic cleft. Signals jump across that gap using chemicals called neurotransmitters. Are-Self's [Synaptic Cleft](./brain-regions/synaptic-cleft) works the same way: it's the real-time event bus built on Django Channels (WebSocket).

Events are typed as **neurotransmitters**, each carrying a specific kind of signal: **Dopamine** (success), **Cortisol** (errors), **Acetylcholine** (data sync), **Glutamate** (streaming data), **Norepinephrine** (monitoring/heartbeats).

The frontend subscribes via `useDendrite(receptorClass, dendriteId)`. When a signal fires, the hook returns a new ref, triggering a React effect that refetches data. No polling anywhere in the system.

### [Prefrontal Cortex](./brain-regions/prefrontal-cortex) (`prefrontal_cortex/`)

Your prefrontal cortex is the planner — it decides what to work on next, keeps track of priorities, and holds the big picture. Are-Self's [Prefrontal Cortex](./brain-regions/prefrontal-cortex) does project management: Epics → Stories → Tasks, assigned to IdentityDiscs. The [Frontal Lobe](./brain-regions/frontal-lobe) picks up tasks from the [PFC](./brain-regions/prefrontal-cortex) backlog when a reasoning session starts.

### [Peripheral Nervous System](./brain-regions/peripheral-nervous-system) (`peripheral_nervous_system/`)

Your peripheral nervous system is the network of nerves that extends out from your brain and spinal cord to the rest of your body. It's how the central brain stays connected to everything happening at the edges. Are-Self's [PNS](./brain-regions/peripheral-nervous-system) manages the fleet of Celery workers, monitoring them via in-process signals (`task_prerun`, `task_postrun`, `worker_ready`) that fire Norepinephrine through the [Synaptic Cleft](./brain-regions/synaptic-cleft).

Celery Beat is the PNS heartbeat — the metronome that drives the tick cycle.

### [Thalamus](./brain-regions/thalamus) (`thalamus/`)

Your thalamus is the relay station — sensory signals come in from your eyes and ears, and the thalamus routes them to the right part of the cortex. Are-Self's [Thalamus](./brain-regions/thalamus) translates between the internal reasoning format and the chat UI. The ThalamusChat bubble on every page lets you talk to a standing session — inject messages, ask questions, get status. It's the human-facing surface of the entire system.

### Environments (`environments/`)

Environments are project context. An environment has a name and a set of context variables (key-value pairs). When the [CNS](./brain-regions/central-nervous-system) resolves executable paths, Django's template engine renders the variables: `&#123;&#123;project_root&#125;&#125;\build.bat` becomes a real path.

Only one environment is active at a time. Switching environments changes what every view shows — different iterations, different pathways, different sessions.

## Data Flow Principles

These rules govern how data moves through the system. They're non-negotiable.

- **The frontend adapts to the API, never the reverse.** If the UI needs data in a different shape, transform it in the frontend.
- **The URL is the single source of truth.** Every navigation action changes the URL. F5 returns exactly where you were.
- **No polling.** All real-time updates flow through the [Synaptic Cleft](./brain-regions/synaptic-cleft) via WebSocket. The frontend uses `useDendrite` hooks, never `setInterval`.
- **Spikes are the unit of work.** Everything that happens passes through the [CNS](./brain-regions/central-nervous-system) as a spike. If you can't find it in the spike log, it didn't happen.
- **Engrams are the unit of memory.** Everything the system learns is an engram in the [Hippocampus](./brain-regions/hippocampus) with full provenance — linked to the session, turn, spike, and [IdentityDisc](./brain-regions/identity) that created it.
