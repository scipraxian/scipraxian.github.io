---
id: temporal-lobe
title: "Temporal Lobe — Scheduling"
description: "Iterations, shifts, the metronome, and work cycles"
slug: /brain-regions/temporal-lobe
---

# Temporal Lobe — Scheduling

Your real temporal lobe handles time — not like reading a clock, but like remembering the order of things. "First this happened, then that, then that." It's how you know a story has a beginning, middle, and end. It's the part of your brain that says "wait, we already did that, so next comes..."

Are-Self's Temporal Lobe does something similar, but for *work*. When the [Frontal Lobe](./frontal-lobe) needs to solve a problem or answer a question, it doesn't just jump in randomly. The Temporal Lobe divides the work into **Iterations** (like chapters in a book, or acts in a play) and **Shifts** (the individual scenes within each act). Each shift knows: "Who's supposed to work right now? How many turns do they get? When are we done?"

The Temporal Lobe is the metronome — the steady heartbeat that keeps everything moving forward in the right order. It wakes up each shift at the right time, keeps track of who's acting, and signals when it's time to move to the next phase.

## How It Organizes Work

Think of staging a school play. Before you perform it, you write a **script blueprint** — acts, scenes, who's in each scene. That's an **Iteration Definition**. Then you actually *perform* the play — that's a live **Iteration**. During the performance, you move from Scene 1 to Scene 2 to Scene 3. Each scene is a **Shift**. And the director might say "Scene 1 actors, you have 3 minutes to perform, then hand off to Scene 2."

The Temporal Lobe works exactly like that:

- **Iteration Definition**: A template saying "here's how work flows: Sifting → Pre-Planning → Planning → Executing → Post-Execution → Sleeping." Each phase has a name and a turn limit.
- **Iteration**: A real, live run of that template. "We're on Iteration 47, currently in the Planning phase."
- **Shift Definition**: The template for a phase — "Planning phase, 10 turn limit, PM identity should act."
- **Shift**: The actual running phase. "We're in Planning right now, turn 5 of 10 used, these three identities are working."

## The Heartbeat — The Metronome

Deep in the system, there's a clock that ticks every few seconds. When it ticks, the [Peripheral Nervous System](./peripheral-nervous-system) wakes up and asks the Temporal Lobe: "Hey, what should happen now?"

The Temporal Lobe checks:
- Are we still in the current shift? Keep going.
- Did the shift run out of turns? Close it and move to the next shift.
- Is there a next shift ready? Wake it up and tell the [Central Nervous System](./central-nervous-system) to fire spikes for the identities assigned to that shift.

It's like a play director saying "Scene 1 is done, Scene 2 actors, you're up!" and ringing a bell.

## Phases in an Iteration

A typical iteration runs through these shifts in order:

| Shift | What Happens | Who Works |
|-------|-------------|-----------|
| **Sifting** | Look at the incoming work. What needs doing? | Analysis identity |
| **Pre-Planning** | Break down the work. What's the strategy? | Planning identity |
| **Planning** | Dive deeper. What are the exact steps? | Planning identity |
| **Executing** | Do the work. Solve the problem. | Worker identities |
| **Post-Execution** | Review. Did it work? Any cleanup? | Review identity |
| **Sleeping** | Rest and consolidate. Get ready for next iteration. | System cooldown |

Each shift has a turn limit — how many times an identity can "think" before handing off. If Planning gets 10 turns but only needs 5, it closes early and moves on.

## Key Concepts

- **Iteration Definition**: A reusable blueprint template defining a sequence of shift definitions (columns) with turn counts and metadata. Think of it as a production schedule you write once and use many times.
- **Iteration**: A *live instance* of an Iteration Definition, bound to an Environment. It tracks which shift is currently active, how many turns have been used, and what's the current state.
- **Shift Definition**: The blueprint for a phase: its name, turn limit, and the type of identity expected to work in it (like "PM" or "Worker").
- **Shift**: The live, running instance. It knows which [IdentityDisc](./identity) instances are participating, how many turns they've used so far, and when to close.
- **Metronome**: The heartbeat trigger — a clock that ticks every N seconds. It fires the [Peripheral Nervous System](./peripheral-nervous-system), which calls the Temporal Lobe to advance iterations and trigger spikes.

## How It Connects

- **[Peripheral Nervous System](./peripheral-nervous-system)**: The PNS heartbeat (Celery Beat) ticks at regular intervals and calls the Temporal Lobe to advance iterations and wake up shifts.
- **[Central Nervous System](./central-nervous-system)**: The Temporal Lobe signals the CNS to fire spike trains for the current shift's active participants — tells them "you're up, start thinking."
- **[Identity](./identity)**: Shift columns contain assigned [IdentityDisc](./identity) instances. The shift knows who should act next and tracks their turn usage.
- **[Prefrontal Cortex](./prefrontal-cortex)**: Tasks are scoped to shifts. During the Executing shift, worker identities pick up assigned tasks and run them.
- **[Frontal Lobe](./frontal-lobe)**: When a spike fires for a shift, the [Frontal Lobe](./frontal-lobe) wakes up and starts reasoning for that phase.

## API Endpoints

### Iterations (Live Instances)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/iterations/` | List all iterations |
| `POST` | `/api/v2/iterations/` | Create live iteration from definition |
| `GET` | `/api/v2/iterations/{id}/` | Retrieve iteration state |
| `PATCH` | `/api/v2/iterations/{id}/` | Update iteration metadata |
| `DELETE` | `/api/v2/iterations/{id}/` | Delete iteration |

### Iteration Definitions (Blueprints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/iteration-definitions/` | List templates |
| `POST` | `/api/v2/iteration-definitions/` | Create definition template |
| `GET` | `/api/v2/iteration-definitions/{id}/` | Retrieve definition |
| `PATCH` | `/api/v2/iteration-definitions/{id}/` | Update definition |
| `DELETE` | `/api/v2/iteration-definitions/{id}/` | Delete definition |

### Shift Definitions & Shifts

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/iteration-shift-definitions/` | List shift templates |
| `POST` | `/api/v2/iteration-shift-definitions/` | Create shift definition |
| `GET` | `/api/v2/shifts/` | List live shift instances |
| `POST` | `/api/v2/shifts/` | Create shift instance |
| `GET` | `/api/v2/shifts/{id}/` | Retrieve shift state |
| `PATCH` | `/api/v2/shifts/{id}/` | Update shift |
| `DELETE` | `/api/v2/shifts/{id}/` | Delete shift |

### Visualization

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/temporal_lobe/graph_data/` | 3D visual graph of iteration and shift structure |
