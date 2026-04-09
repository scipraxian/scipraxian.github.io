---
id: frontal-lobe
title: "Frontal Lobe — Reasoning"
description: "Reasoning sessions, the while-True loop, turns, tool calling, and focus economy"
slug: /brain-regions/frontal-lobe
---

# Frontal Lobe — Reasoning

Your frontal lobe is the part of your brain that *thinks*. Not just quick reactions — that's deeper brain stuff — but the kind of thinking where you sit down, focus, work through a problem step by step, maybe use some tools along the way, and eventually come to a conclusion. It's your ability to hold a thought, build on it, and know when you're done.

Are-Self's Frontal Lobe does exactly that. It runs **Reasoning Sessions** — conversations with an AI model where the system thinks through a problem across multiple rounds. Each round is called a **turn**: the system assembles everything the model needs to know (who it is, what it's working on, what happened so far), sends it to the model, gets a response, and then decides what to do next. Maybe the model wants to use a tool — search the web, read a file, query a database. The Frontal Lobe hands that off to the [Parietal Lobe](./parietal-lobe) (which handles all the hands-on tool work), gets the result back, and loops again.

This keeps going — think, act, think, act — until one of two things happens: the model decides it's done and calls `mcp_done`, or it needs to ask a human something and pauses with `mcp_respond_to_user`. That's when the [Thalamus](./thalamus) relay takes over to wait for human input.

## Focus — You Can't Think Forever

Just like you can't concentrate on homework for 12 hours straight, the Frontal Lobe has a **focus budget**. Every turn costs a little focus. Every tool call costs a little more. When focus runs out, the session has to wrap up — no more turns, time to conclude.

But here's the fun part: focus can come *back*. When the model discovers something genuinely new and saves it to memory (an engram in the [Hippocampus](./hippocampus)), it earns focus back. The system is literally rewarding itself for learning. The more it learns, the longer it can keep thinking. Just like how you can read for hours when a book is interesting, but your attention dies after five minutes on something boring.

## What a Turn Looks Like

Every reasoning turn has full telemetry — you can see exactly what happened:

- How many tokens went in (the prompt) and came out (the response)
- How long inference took
- Which model was used (this can change mid-session if failover kicks in)
- What tool calls were made, if any
- The focus budget before and after

Turns are recorded as `ReasoningTurn` objects and you can browse them in the [Frontal Lobe UI](../ui/frontal-lobe) — there's even a 3D graph visualization that shows the reasoning process as a neural network.

## Getting a Model — Talking to the Hypothalamus

The Frontal Lobe doesn't pick its own model. Before each turn, it asks the [Hypothalamus](./hypothalamus) to choose one. The [Hypothalamus](./hypothalamus) knows about every available model, their health, their cost, how well they match the identity — and it picks the best fit. The Frontal Lobe just says "I need a brain for this turn" and the [Hypothalamus](./hypothalamus) hands one over.

The selected model gets wired up through the **Synapse Client**, which is the Frontal Lobe's actual connection to the AI provider. The Synapse Client wraps the call to `litellm.completion()`, sends the request, and either gets a response back or catches an error.

## When the Model Fails — Failover

Models fail sometimes. The server might be down, you might be rate-limited, your machine might be out of memory. When that happens, the Frontal Lobe doesn't panic. It has a failover loop with up to 8 attempts.

Here's how it works: the first attempt uses attempt number 0, which means the [Hypothalamus](./hypothalamus) tries the preferred model. If that fails, the Synapse Client figures out *what kind* of failure it was and responds appropriately:

**Scar Tissue** — The model returned a 404 on a tool-calling endpoint. It literally can't do function calling. The Synapse Client permanently disables that capability on the provider. The model can still be used for regular chat, but it won't be offered for tool-heavy work again. This one doesn't heal.

**Resource Cooldown** — The machine is out of memory. The model is fine; your computer just needs a breather. The provider gets a flat 60-second cooldown — no escalation, no grudge. After a minute, it's eligible again.

**Circuit Breaker** — Anything else (timeouts, server errors, rate limits). The provider goes on an escalating timeout — 60 seconds the first time, doubling each time, capping at 5 minutes. See the [Hypothalamus circuit breaker docs](./hypothalamus#when-things-go-wrong--circuit-breakers) for the full breakdown.

After any of these, the Frontal Lobe bumps the attempt counter and asks the [Hypothalamus](./hypothalamus) for the next candidate. The [Hypothalamus](./hypothalamus) walks down the identity's failover strategy — try the same family, try a local backup, do an open search — until either something works or all 8 attempts are used up.

If all 8 fail, the session status gets set to `MAXED_OUT` and the turn is marked `ERROR`. At that point, something is seriously wrong and it needs human attention.

## The Reasoning Loop — Putting It All Together

A full reasoning session looks like this:

1. A spike from the [Central Nervous System](./central-nervous-system) triggers a reasoning effector
2. The Frontal Lobe creates a new `ReasoningSession` tied to the [IdentityDisc](./identity)
3. **Loop starts:**
   - Assemble the prompt: identity template + addons + conversation history + any terminal input
   - Ask the [Hypothalamus](./hypothalamus) to pick a model
   - Send the prompt through the Synapse Client
   - If the model calls tools, hand them to the [Parietal Lobe](./parietal-lobe) for execution
   - Record the turn (tokens, time, model, tools, focus spent)
   - Check focus budget — if it's gone, conclude
   - If the model called `mcp_done`, conclude
   - If the model called `mcp_respond_to_user` with `yield_turn=True`, pause for human input via the [Thalamus](./thalamus)
   - Otherwise, loop again
4. Session concludes — fire a Dopamine signal through the [Synaptic Cleft](./synaptic-cleft)

## Session Statuses

A session moves through these states during its life:

| Status | What It Means |
|--------|--------------|
| **Pending** | Created but hasn't started yet |
| **Active** | Currently reasoning (the loop is running) |
| **Paused** | Waiting for human input via the [Thalamus](./thalamus) |
| **Completed** | Finished successfully — the model called `mcp_done` |
| **Maxed Out** | All 8 failover attempts failed, or the model couldn't be selected |
| **Error** | Something crashed during execution |
| **Attention Required** | The session flagged itself as needing a human to look at it |
| **Stopped** | Manually stopped by a user |

## API Endpoints

### Reasoning Sessions

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/reasoning_sessions/` | List sessions (lightweight) |
| `POST` | `/api/v2/reasoning_sessions/` | Create session |
| `GET` | `/api/v2/reasoning_sessions/{id}/` | Retrieve session (full payload) |
| `PATCH` | `/api/v2/reasoning_sessions/{id}/` | Update session metadata |
| `DELETE` | `/api/v2/reasoning_sessions/{id}/` | Delete session |
| `GET` | `/api/v2/reasoning_sessions/{id}/graph_data/` | Complete graph (turns, engrams, conclusion) |
| `POST` | `/api/v2/reasoning_sessions/{id}/rerun/` | Restart the originating spike train |
| `POST` | `/api/v2/reasoning_sessions/{id}/attention_required/` | Pause and signal human input needed |
| `POST` | `/api/v2/reasoning_sessions/{id}/resume/` | Inject human message and wake the session |
| `GET` | `/api/v2/reasoning_sessions/{id}/messages/` | Chat pipeline for UI |
| `GET` | `/api/v2/reasoning_sessions/{id}/summary_dump/` | Forensic text dump |
| `GET` | `/api/v2/reasoning_sessions/{id}/narrative_dump/` | Compact human-readable briefing |
| `GET` | `/api/v2/latest-sessions/` | Latest 10 sessions |

### Reasoning Turns

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/reasoning_turns/` | List turns |
| `POST` | `/api/v2/reasoning_turns/` | Create turn |
| `GET` | `/api/v2/reasoning_turns/{id}/` | Retrieve turn (includes tool calls) |
| `PATCH` | `/api/v2/reasoning_turns/{id}/` | Update turn |
| `DELETE` | `/api/v2/reasoning_turns/{id}/` | Delete turn |

## How It Connects

- **[Hypothalamus](./hypothalamus)**: Picks the model for each turn. Gets asked again (with a higher attempt number) on failures. Handles all the model-health and budget logic so the Frontal Lobe doesn't have to.
- **Synapse Client**: The actual wire to the AI provider. Wraps `litellm.completion()`, classifies errors into scar tissue, resource cooldown, or circuit breaker, and reports back.
- **[Identity](./identity)**: The [IdentityDisc](./identity)'s prompt template, addons, and configuration shape every turn's prompt assembly.
- **[Parietal Lobe](./parietal-lobe)**: Executes tool calls. The Frontal Lobe thinks, the Parietal Lobe acts — then the results come back and the Frontal Lobe thinks again.
- **[Hippocampus](./hippocampus)**: Reads relevant memories during prompt assembly. Saves new memories when the model learns something. Saving memories earns focus back.
- **[Central Nervous System](./central-nervous-system)**: Reasoning sessions are spike effectors. A spike says "reason about this" and the Frontal Lobe takes it from there.
- **[Thalamus](./thalamus)**: When a session pauses for human input (`yield_turn=True`), the Thalamus relay captures the message and resumes the session.
- **[Synaptic Cleft](./synaptic-cleft)**: Fires Dopamine on session conclusion, Glutamate as tokens stream in, and Cortisol when things go wrong.
