---
id: peripheral-nervous-system
title: "Peripheral Nervous System — Fleet"
description: "Workers, Celery Beat heartbeat, nerve terminals, and system control"
slug: /brain-regions/peripheral-nervous-system
---

# Peripheral Nervous System — Fleet

Your real peripheral nervous system is like your body's messenger service and alarm system rolled into one. When you touch a hot stove, nerve endings in your fingertips scream "OUCH!" and send that message racing back to your brain in milliseconds. At the same time, your heart keeps beating steadily, your lungs keep breathing, and all your automatic systems keep humming along without you having to think about them. That's the peripheral nervous system doing its job — getting messages in and out, keeping everything connected, and maintaining that constant heartbeat that keeps you alive.

Are-Self's Peripheral Nervous System works almost exactly the same way. It's the fleet of worker machines that run all the behind-the-scenes tasks. It carries alert signals (called Norepinephrine) back and forth through the [Synaptic Cleft](./synaptic-cleft). And most importantly, it has a **heartbeat** — a metronome that ticks every N seconds to keep the whole system synchronized and running smoothly.

## The Heartbeat: Celery Beat

Imagine a conductor with a baton standing in front of an orchestra. Every time the baton taps, the musicians know it's time to play the next note. That's what Celery Beat does for Are-Self.

Celery Beat is the system's metronome. It fires on a schedule — maybe every second, maybe every 10 seconds, depending on how you set it up. Each time it ticks, it wakes up the [Temporal Lobe](./temporal-lobe) and says "it's time to advance the iteration. Fire off the next round of spike trains." Without that steady heartbeat, the whole system would lose track of time and everything would fall apart.

You can start the metronome, stop it, or pause it. The frontend shows you whether the heartbeat is running or not.

## The Fleet: Celery Workers

A Celery worker is a background task processor — think of it as a dedicated helper that runs jobs for you without blocking the main system. When the [Temporal Lobe](./temporal-lobe) says "execute this spike," a worker grabs the job and runs it in the background. Multiple workers can run at the same time, which means multiple spikes can execute in parallel. Way faster than doing them one at a time.

The Peripheral Nervous System keeps track of every worker — how many are running right now, what tasks are queued up waiting for a worker, whether each worker is healthy and responsive. This is fleet management: knowing your army of workers, what they're doing, and making sure they're all ready to go.

## Nerve Terminals: Keeping the Workers Wired In

A nerve terminal is where a worker connects to the system — it's the handshake point that registers a worker so the system knows it exists. All the terminals are tracked in a registry. When a worker comes online, it registers itself. When it goes offline, it gets marked inactive. The system is always watching to make sure all the nerve terminals are in good shape.

## The Alert Signal: Norepinephrine

When something important happens in a worker — a task starts, a task finishes, a worker comes online — the system fires a Norepinephrine signal through the [Synaptic Cleft](./synaptic-cleft) to the WebSocket bus. This is how the frontend knows to update its display in real time. Worker cards light up, status badges change color, queue depths update instantly. It's all powered by these alert signals bouncing through the system.

## Putting It All Together

When Celery Beat ticks:
1. It calls the [Temporal Lobe](./temporal-lobe) to trigger the metronomes
2. The [Temporal Lobe](./temporal-lobe) launches spike trains through the [Central Nervous System](./central-nervous-system)
3. Workers execute those spikes in parallel
4. When workers start, finish, or change status, they fire Norepinephrine signals
5. The frontend listens to those signals and shows you what's happening in real time

It's a beautiful feedback loop: the heartbeat ticks, work happens, status messages flow back, and you see it all happening. That's the peripheral nervous system keeping everything connected and alive.

## System Control

You have three ways to manage the system:

- **Start the metronome**: Turn on Celery Beat and get the heartbeat ticking
- **Stop the metronome**: Turn it off completely
- **Pause without stopping**: Pause gracefully without a hard stop
- **Emergency stop**: Hard stop all spikes immediately (use this only if something goes really wrong)
- **Soft restart**: Gracefully restart the system

The difference between stopping and pausing is important: stopping means everything shuts down cold. Pausing means "let current jobs finish, but don't start new ones."

## API Endpoints

### Worker Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/celery-workers/` | List active Celery workers |
| `POST` | `/api/v2/celery-workers/` | Register worker |
| `GET` | `/api/v2/celery-workers/{id}/` | Retrieve worker status |

### Heartbeat & Beat Control

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/beat/` | Celery Beat status |
| `POST` | `/api/v2/beat/start/` | Start the metronome |
| `POST` | `/api/v2/beat/stop/` | Stop the metronome |
| `POST` | `/api/v2/beat/pause/` | Pause without fully stopping |

### System Control

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/system-control/` | System state (running, paused, stopped) |
| `POST` | `/api/v2/system-control/restart/` | Soft restart |
| `POST` | `/api/v2/system-control/emergency-stop/` | Hard stop all spikes |

### Nerve Terminal Registry

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/nerve_terminal_registry/` | List nerve terminals (worker connections) |
| `POST` | `/api/v2/nerve_terminal_registry/` | Register terminal |
| `DELETE` | `/api/v2/nerve_terminal_registry/{id}/` | Deregister terminal |

## How It Connects

- **[Temporal Lobe](./temporal-lobe)**: Celery Beat calls the Temporal Lobe's `trigger_temporal_metronomes()` every tick to advance iterations and fire spike trains.
- **[Central Nervous System](./central-nervous-system)**: The spike trains launched by the Temporal Lobe run through the CNS, and workers execute them.
- **[Synaptic Cleft](./synaptic-cleft)**: Worker events (startup, task completion) fire Norepinephrine signals to the WebSocket bus so the frontend sees updates in real time.
- **All regions**: All system components depend on the Peripheral Nervous System's heartbeat to stay synchronized.
