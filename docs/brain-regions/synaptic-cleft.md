---
id: synaptic-cleft
title: "Synaptic Cleft — Real-Time Events"
description: "WebSocket, neurotransmitter types, and the useDendrite hook"
slug: /brain-regions/synaptic-cleft
---

# Synaptic Cleft — Real-Time Events

Imagine your brain as a city full of buildings (neurons). Buildings need to talk to each other, but they're not touching — there's a tiny gap between them. That gap is called the synaptic cleft, and it's where the real communication happens. One building releases special chemicals called neurotransmitters into that gap. The other building's wall has doors (receptors) that only open when the right chemical shows up. When the right chemical finds the right door, a message gets through.

Are-Self's Synaptic Cleft works exactly like this, except instead of brain buildings talking with chemicals, it's different parts of your AI system talking with **typed signals** called **neurotransmitters**. Every signal means something specific — like Dopamine for "yay, it worked!" or Cortisol for "uh oh, something broke." The frontend (the part you see in your browser) listens for these signals and instantly knows when something important happens, without having to constantly ask "is anything new yet? how about now?"

This is built on WebSockets (a special way for computers to stay connected and chat in real-time), so there's **no annoying polling** — no sitting around waiting for updates. Updates come to you the moment they happen.

## How Real-Time Signals Work

When something big happens inside Are-Self — a task finishes, an error occurs, data gets saved — the part that handles it doesn't yell into the void. It fires a specific neurotransmitter that says exactly what kind of event just happened. React (the framework that builds the frontend) listens for these signals using a hook called `useDendrite`. When a signal arrives, React knows to go grab the latest data.

Here's an example: The [Frontal Lobe](./frontal-lobe) finishes streaming tokens to you and completes your entire reasoning session. It fires a **Dopamine** signal that says "ReasoningSession with id 123 just succeeded!" The frontend is listening for Dopamine signals on reasoning sessions. It gets the signal, knows to refetch the session data, and suddenly you see the final answer.

## The Neurotransmitter Types

Each signal carries a specific meaning. Here's what each one does:

**Dopamine** — The "success" chemical. Fires when a task completes, a session ends, or something you wanted to happen actually happened. Payload: `{entity_type, entity_id, status}`

**Cortisol** — The "stress alarm" chemical. Fires when something breaks — a spike failed, the circuit breaker kicked in, or the system ran out of focus. Payload: `{entity_type, entity_id, error_code, message}`

**Acetylcholine** — The "attention/data sync" chemical. Fires when important data changes — a model gets refreshed in the catalog, a new turn is recorded, or a memory (engram) gets saved. Payload: `{entity_type, entity_id, change_type}`

**Glutamate** — The "streaming data" chemical. Fires rapidly when data flows in real-time — like log lines appearing, tokens streaming in from the model, or execution output. Payload: `{entity_id, log_line}` or `{entity_id, token_text}`

**Norepinephrine** — The "alertness/monitoring" chemical. Fires for system-level awareness like worker heartbeats or orchestration updates that keep the whole machine running smoothly. Payload: `{worker_id, status}` or `{narrative_text}`

## The useDendrite Hook

`useDendrite` is the React hook that lets your frontend listen for signals. You tell it what kind of signal you care about and which specific thing you're interested in. It looks like this:

```javascript
const { data: sessionData, isLoading } = useDendrite(
  'ReasoningSessionTurn',  // I'm listening for turns in reasoning sessions
  sessionId                // specifically, THIS session
);

// When a new turn is recorded, the Synaptic Cleft fires Acetylcholine
// The hook gets the signal and refetches the latest turn data
```

The moment a signal matches what you're listening for, the hook hands back a fresh ref, which triggers a React effect that refetches your data. No manual refresh. No polling loop. Just instant updates.

## How It Connects

- **Frontend (React)**: Uses `useDendrite()` to subscribe to specific neurotransmitter types. Instantly refetches data when signals arrive.
- **[Central Nervous System](./central-nervous-system)**: Fires Dopamine when a spike succeeds, fires Cortisol when a spike fails.
- **[Frontal Lobe](./frontal-lobe)**: Fires Glutamate as tokens stream out, fires Dopamine when a reasoning session wraps up.
- **[Hypothalamus](./hypothalamus)**: Fires Cortisol when it blocks a model due to circuit breaker status.
- **[Peripheral Nervous System](./peripheral-nervous-system)**: Fires Norepinephrine for worker heartbeats to keep the system alive.
- **[Hippocampus](./hippocampus)**: Fires Acetylcholine when it saves a new memory.
- **[Identity](./identity)**: Uses Acetylcholine to announce when an identity's state changes.
- **All regions**: The Synaptic Cleft is the announcement system. Anything important that happens anywhere can fire a signal so everyone who cares knows about it instantly.

## API Endpoints

### WebSocket Connection

| Endpoint | Purpose |
|----------|---------|
| `ws://localhost:8000/ws/dendrites/` | Main WebSocket endpoint for real-time signals |

### Signal Publishing (Internal)

Events are published internally by spike executors, the [Frontal Lobe](./frontal-lobe), [Hypothalamus](./hypothalamus), and other regions. The frontend subscribes via WebSocket and receives them in real time.

### Neurotransmitter Types

| Type | Fired When | Payload |
|------|-----------|---------|
| **Dopamine** | Task completed, session concluded, spike succeeded | `{entity_type, entity_id, status}` |
| **Cortisol** | Spike failed, circuit breaker tripped, focus exhausted | `{entity_type, entity_id, error_code, message}` |
| **Acetylcholine** | Model refreshed, turn recorded, engram saved | `{entity_type, entity_id, change_type}` |
| **Glutamate** | Log line appended, output streamed, token generated | `{entity_id, log_line}` or `{entity_id, token_text}` |
| **Norepinephrine** | Worker heartbeat, orchestration narrative, alert | `{worker_id, status}` or `{narrative_text}` |
