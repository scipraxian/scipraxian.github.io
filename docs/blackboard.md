---
id: blackboard
title: "The Blackboard — Shared Memory for a Spike Train"
description: "How neurons talk to each other without being wired together"
slug: /cns/blackboard
---

# The Blackboard — Shared Memory for a Spike Train

When a signal travels through your real nervous system, it isn't just a tiny electric jolt skipping from neuron to neuron. It *leaves things behind*. Each neuron that fires releases chemicals into the space around it, and the next neuron doesn't just hear a "bang!" — it arrives into a little cloud of leftover stuff from whatever fired before. That cloud is how one neuron tells the next one what just happened without being hard-wired to it. It's messy and alive and kind of magical.

Are-Self's **blackboard** is that same idea, turned into code. It's a shared scribble pad — a plain JSON dictionary — that every [neuron](../brain-regions/central-nervous-system) in a running spike train can read from and write to. One neuron drops a note on it ("the artist LLM wrote a prompt: `a cat wearing a spacesuit`"), and the next neuron downstream picks that note up and acts on it ("okay, I'll POST that to the image generator and write the file path back"). No neuron has to know who comes next. They just trust the board.

That's the whole trick. It's why you can rearrange a pathway in the graph editor and things still work. It's why a [Frontal Lobe](../brain-regions/frontal-lobe) reasoning session can hand off to a logic node which hands off to a remote agent without anyone passing function arguments around. The blackboard is how a flowchart full of strangers cooperates.

## Who Owns the Blackboard?

Today, the blackboard is a field on the [Spike](../brain-regions/central-nervous-system) itself — `Spike.blackboard` is a Django `JSONField(default=dict)` defined in `central_nervous_system/models.py`. Every single spike carries its own dict. When a new spike is born further down the graph, it gets a **deepcopy** of the previous spike's blackboard as its starting state, then runs its effector, maybe writes a few new keys, and hands that copy forward to whatever fires next.

So the mental model is: each spike is a snapshot in time of the blackboard at that neuron. The train doesn't have a single shared pointer — it has a **chain of snapshots**, one per spike, each one deepcopied from its provenance. That matters for debugging: if you open any spike in CNS Spike Forensics, you see exactly what the blackboard looked like at that moment. Frozen. The next spike's view is a whole new object.

This is also why the system feels safe when you fan out. If one neuron spawns three downstream spikes in parallel, each of those three gets its own deepcopy — no shared mutation, no race condition, no accidental "neuron A clobbered neuron B's notes." The deepcopy is deliberate.

## How the Board Gets Filled

There are four ways something lands on a spike's blackboard, and they happen in this order as a spike is about to run:

**1. Deepcopy from the previous spike.** This is the default. When `_create_spike_from_node` (`central_nervous_system/central_nervous_system.py`) builds a new spike, the very first thing it does is `copy.deepcopy(provenance.blackboard)`. If there's no provenance — meaning this is the root of the graph — and the train was launched with a seed dict (from the MCP `launch_spike_train` tool or a Celery kickoff), the seed gets deepcopied instead.

**2. Subgraph entry layering.** When a spike with an `invoked_pathway` delegates to a child [SpikeTrain](../brain-regions/central-nervous-system), the child's root spike starts from a deepcopy of `parent_spike.blackboard` — *and then* every NeuronContext key on the parent neuron is layered on top. This lets a subgraph-calling neuron pre-load its child with per-call parameters from the graph editor without a custom effector.

**3. Effector write-back via stdout.** Native Python effectors and remote agents can both emit a line of the form `::blackboard_set key::value` in their output. `NeuromuscularJunction` (`central_nervous_system/effectors/effector_casters/neuromuscular_junction.py`) scans every line of execution log with the `BLACKBOARD_SET_KEY_REGEX`, pulls the key/value out, sets `spike.blackboard[key] = value`, strips the line from the log so it doesn't pollute forensics, and fires an `Acetylcholine` neurotransmitter with `activity='blackboard_updated'` so the UI can flash. That's how a shell script or a remote agent on another machine participates without importing any Are-Self Python.

**4. Direct writes from the Parietal MCP tool.** When the [Frontal Lobe](../brain-regions/frontal-lobe) is in the middle of a reasoning loop, it can call the `mcp_update_blackboard(spike_id, key, value)` Parietal tool to scribble on its own currently-running spike. The tool does a targeted `save(update_fields=['blackboard'])` so it never races with the execution log writer. This is the cleanest way for an LLM to hand a concrete value to the rest of the graph.

## How the Board Gets Read

Reading is the other half of the story, and it's governed by one function you should bookmark: `resolve_environment_context` in `central_nervous_system/utils.py`. That function builds the full context dictionary that gets handed to template rendering (for things like `{{prompt}}` or `{{project_root}}`), to the [Frontal Lobe](../brain-regions/frontal-lobe) reasoning session initializer, and to the logic node's gate evaluator.

The current resolution order (lowest precedence first, highest last — later writes win on key collisions) is:

1. **Environment variables** from the active [ProjectEnvironment](../brain-regions/central-nervous-system) via `VariableRenderer.extract_variables`. These are the static project roots, build paths, and context variables configured in the Environments editor.
2. **The spike's blackboard.** Everything in `spike.blackboard` gets merged in — runtime state, effector output, MCP tool writes, the whole pad.
3. **EffectorContext.** Per-effector default key/values configured on the effector definition.
4. **NeuronContext.** Per-neuron overrides set in the graph editor (the `gate_key`, `max_retries`, `debug_label`, etc.). Highest precedence today, which means **a NeuronContext entry will win over a blackboard entry of the same name.**

That last detail is worth stopping on. It means if a spike's blackboard has `prompt: "draw a cat"` and the neuron's NeuronContext also has a `prompt` entry, the NeuronContext wins. For the prompt variable injection path into `FrontalLobe._get_rendered_objective` (`frontal_lobe/frontal_lobe.py`) this is usually what you want — the graph editor controls the prompt — but it also means the blackboard is not a way to *override* graph-editor settings, only to *supply* values the graph editor didn't pin.

## Reading from the Board, Programmatically

A few places read the blackboard directly rather than going through `resolve_environment_context`:

- **Logic Gate neurons** (`pathway_logic_node._handle_gate`). The gate node's entire job is to branch on blackboard state. It reads `spike.blackboard[gate_key]`, compares it against `gate_value` with an `exists` / `equals` / `not_equals` / `gt` / `lt` operator, and returns `200` (SUCCESS axon) or `500` (FAIL axon) accordingly. This is how a pathway says "if the artist wrote a prompt, go to the image branch; otherwise go to the code branch."
- **Logic Retry neurons** (`_handle_retry`). Retry mode reads `spike.blackboard['loop_count']`, increments it, and writes it back with a `save(update_fields=['blackboard'])` — and because the next successor spike will deepcopy from this one, the counter naturally threads through the loop without any extra bookkeeping.
- **Debug neurons** (`central_nervous_system/effectors/effector_casters/debug_node.py`, Effector PK 9). Drop a Debug node into any pathway and it logs `spike.blackboard.keys()` plus each key/value preview at INFO level, tagged with a `debug_label` you can override via NeuronContext. This is the first thing to reach for when a value isn't landing where you expect.
- **Forensics.** `GET /api/v2/spikes/` and the spike-detail endpoint return the blackboard field in the serializer, so the CNS Spike Forensics view can show it in the inspector panel next to the execution log and the result code.

## Where the Story Gets Interesting (And Incomplete)

The current model — "blackboard lives on the spike, deepcopied forward" — is a great fit for a single path through a single graph. It gets wobbly in two places, and those are the places the design conversation is alive right now.

**The subgraph return.** When a neuron calls into a child pathway via `invoked_pathway`, the CNS puts the parent spike to sleep (`DELEGATED` status) and spawns a child [SpikeTrain](../brain-regions/central-nervous-system) that deepcopies the parent's blackboard into its root. Beautiful — information flows *down*. But when that child train finalizes (`_finalize_spawn_unsafe` flips the status to `SUCCESS` and fires `spawn_success`), **nothing from the child's final blackboard propagates back up to the parent spike.** The parent wakes up with the same dict it went to sleep with. Any work the child did, any values it wrote, any memories it collected — none of that reaches the rest of the parent graph. Today, if you want to return values from a subgraph, the subgraph has to write to an engram in the [Hippocampus](../brain-regions/hippocampus) or send a [Thalamus](../brain-regions/thalamus) message. That's coming.

**The train-level blackboard.** Today the blackboard is purely per-spike, and there's no `SpikeTrain.blackboard` field. That works for most patterns, but it forces every piece of shared state through the deepcopy chain, which means two parallel branches of the same train can drift apart and never reconcile. A planned change is a **new `SpikeTrain.blackboard` field** alongside the existing per-spike one. The resolution rule will be: **spikes win** — on a key collision, whatever is on the current spike's blackboard overrides the train-level value. That keeps the fast, local, per-spike snapshot behavior intact while giving the train a single place for "values that should survive parallel branches and subgraph delegation." The `_seed_blackboard` mechanism used today for MCP launches will move onto `SpikeTrain.blackboard` as the natural home for pre-loaded context.

Both of these are tracked as open design questions, not committed code. If you're reading this and thinking "wait, which way does the resolution actually go?" — the answer right now is **only the per-spike blackboard exists, and NeuronContext beats it on same-key collisions.** Anything else on this page describing the train-level board is the plan, not the product.

## The Rules of Thumb

If you're writing a new effector or reviewing a PR, these are the rules the codebase is already following. Keep following them.

- **Never mutate a blackboard you received.** Deepcopy happens on spike creation, not on write. If you mutate `spike.blackboard` you're mutating *this spike's snapshot*, which is fine — but never reach across to a provenance spike's blackboard and mutate that.
- **Always save with `update_fields=['blackboard']`.** The execution log writer and the blackboard writer run in overlapping code paths. A full `.save()` will clobber log writes. This rule is enforced in `mcp_update_blackboard` and in the logic retry handler — copy that pattern.
- **Don't put giant objects on the board.** It gets deepcopied on every successor spike. A 10-megabyte JSON blob copied through a 50-spike train is a 500-megabyte nightmare. For anything large, store it in the [Hippocampus](../brain-regions/hippocampus) or write it to disk and put the path on the board.
- **Treat keys like a public API.** Gate nodes read them, Debug nodes print them, the `prompt` injection reads `prompt`, the image generator reads `image_gen_endpoint`. Give them clear names and don't rename them without a grep.
- **Use Debug nodes early.** The first time a new blackboard key doesn't land where you expected, drop a Debug node in front of the consumer and read the `BB[...]` lines in the worker log. The answer is almost always "the key wasn't there" or "NeuronContext was overriding it."

## How It Connects

- **[Central Nervous System](../brain-regions/central-nervous-system)**: the blackboard is a field on `Spike`, and the CNS is what deepcopies it forward, hands it to effectors, parses write-back lines, and serves it through the spike serializers to the UI.
- **[Frontal Lobe](../brain-regions/frontal-lobe)**: reasoning sessions read the blackboard via `resolve_environment_context` to assemble the `prompt` and other runtime variables, and write to it via the `mcp_update_blackboard` Parietal tool during the reasoning loop.
- **[Parietal Lobe](../brain-regions/parietal-lobe)**: hosts the `mcp_update_blackboard` MCP tool so the reasoning LLM can scribble on its own spike.
- **[Synaptic Cleft](../brain-regions/synaptic-cleft)**: every blackboard write fires an `Acetylcholine` neurotransmitter with `activity='blackboard_updated'` and a `vesicle` containing the key and value, so the UI can update in real time.
- **[Hippocampus](../brain-regions/hippocampus)**: for anything bigger than a note or longer-lived than a single spike train, the blackboard hands off to the engram store.

---

## Field Reference

| Field | Type | Where | Notes |
|-------|------|-------|-------|
| `Spike.blackboard` | `JSONField(default=dict)` | `central_nervous_system/models.py` | Per-spike. Deepcopied forward. The only blackboard field that exists today. |
| `SpikeTrain.blackboard` | *planned* | — | Train-level board for values that should survive parallel branches and subgraph delegation. Spike-level overrides it on collision. |

## Write Paths

| Path | Location | Mechanism |
|------|----------|-----------|
| Effector stdout protocol | `neuromuscular_junction.py` | Lines matching `::blackboard_set key::value` are parsed, set on `spike.blackboard`, and stripped from the execution log. |
| Parietal MCP tool | `parietal_lobe/parietal_mcp/mcp_update_blackboard.py` | `mcp_update_blackboard(spike_id, key, value)` — direct write with `save(update_fields=['blackboard'])`. |
| Logic Retry counter | `pathway_logic_node._handle_retry` | Increments `spike.blackboard['loop_count']` and saves. |
| Subgraph entry layering | `central_nervous_system._create_spike_from_node` | NeuronContext of the parent neuron is layered onto the child train's root spike blackboard after the deepcopy. |
| Seed at launch | `CNS.__init__(seed_blackboard=...)` | MCP `launch_spike_train`, Celery kickoffs, and tests can pre-load the root spike. |

## Read Paths

| Consumer | Location | How it reads |
|----------|----------|--------------|
| Template rendering / `prompt` injection | `central_nervous_system/utils.py::resolve_environment_context` | Merged into `raw_context` under env vars, above EffectorContext, below NeuronContext. |
| Frontal Lobe reasoning objective | `frontal_lobe/frontal_lobe.py::_get_rendered_objective` | Reads `KEY_PROMPT` from the merged `raw_context`. |
| Logic Gate neurons | `pathway_logic_node._handle_gate` | Direct `spike.blackboard[gate_key]` lookup with operator comparison. |
| Logic Retry neurons | `pathway_logic_node._handle_retry` | Direct read of `spike.blackboard['loop_count']`. |
| Debug neurons | `effectors/effector_casters/debug_node.py` | Logs keys and value previews at INFO. |
| CNS Spike Forensics UI | `/api/v2/spikes/` serializer | Returned as a field on the Spike resource. |

## Resolution Order (Current)

1. Environment variables (`VariableRenderer.extract_variables`)
2. `spike.blackboard`
3. `EffectorContext`
4. `NeuronContext` ← wins on collision

## Resolution Order (Planned — pending final decision)

1. Environment variables
2. `SpikeTrain.blackboard` *(new)*
3. `spike.blackboard` ← wins over train-level
4. `EffectorContext`
5. `NeuronContext` ← still top, or flipped below spike blackboard? **Open question.**
