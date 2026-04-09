---
id: prefrontal-cortex
title: "Prefrontal Cortex — Planning"
description: "Epics, stories, tasks, Definition of Ready, and work organization"
slug: /brain-regions/prefrontal-cortex
---

# Prefrontal Cortex — Planning

Have you ever had a *really big* project? Like building a treehouse, or putting on a school talent show? Your brain doesn't just say "go do it." Instead, you break it down: first I'll get the wood and tools, then I'll build the platform, then I'll add the railings. Each step makes sense, and each one has to be done before you can move on. Your real prefrontal cortex does exactly this — it's the part of your brain that takes huge, vague goals and turns them into a neat ladder of smaller steps you can actually tackle.

Are-Self's Prefrontal Cortex does the same thing, except instead of treehouses, it organizes work for an AI team. When the system has something to do, the Prefrontal Cortex breaks it into a clean hierarchy: a big **Epic** (like "build a new feature"), which splits into **Stories** (smaller features), which split into **Tasks** (the actual work someone does right now). Each task has clear success criteria, someone assigned to do it, and a timeline. Before any task gets started, it has to pass a **Definition of Ready** — which is like a checklist that makes sure the task is actually ready to go.

It's like a project manager's toolbox. The [Temporal Lobe](./temporal-lobe) knows *when* things should happen (morning shift, afternoon shift), and the Prefrontal Cortex knows *what* should happen and *how to organize* it. Together, they make sure work flows smoothly.

## How the Hierarchy Works

Think of it like Russian nesting dolls, but for projects:

**Epic** — This is the big picture. A massive strategic goal. "Build an e-commerce recommendation system" or "design a new mobile experience." Usually, one person (a PM identity) owns the whole epic and makes sure all the pieces fit together.

**Story** — This is one piece of that epic. A user-facing feature that actually does something cool. "Show product recommendations on the home page" or "let users save favorites." Multiple stories add up to one epic.

**Task** — This is the smallest unit: the actual work. "Write the API endpoint for recommendations" or "design the saved favorites icon." This is what gets assigned to a worker identity, and it has to fit inside one shift. A task has acceptance criteria — a checklist of "when is this done?"

Each level tracks its own status (open, in-progress, blocked, done, etc.), can have comments, and has a full detailed view if you need to dig deeper. Everything's connected, so if you finish all the tasks, you automatically finish the story. If you finish all the stories, you automatically finish the epic.

## Definition of Ready — The Checklist Before You Start

Before a task can get picked up by a worker identity and started, it has to pass a checklist called the **Definition of Ready**. It's like a bouncer at the door — the task has to have the right stuff or it doesn't get in.

Typical checks might be:
- Does the task have clear acceptance criteria?
- Is there someone assigned to do it?
- Do we have all the info the worker needs?
- Is it actually doable in one shift?

If a task fails the checklist, it stays in "open" status and the [Frontal Lobe](./frontal-lobe) won't pick it up. That forces someone (usually the PM) to finish prepping the task.

## How the System Wakes Up

When the [Frontal Lobe](./frontal-lobe) starts a reasoning session for a worker, it doesn't ask "what's everything you could do?" Instead, it comes straight to the Prefrontal Cortex and asks, "what tasks are ready and assigned to me right now?" The Cortex searches for all tasks in "ready" status owned by that identity and hands back a list.

The [Frontal Lobe](./frontal-lobe) picks one and reasons through it. If it gets blocked or needs help, the reasoning session pauses. The next time a shift starts, the [Frontal Lobe](./frontal-lobe) asks again: what's ready now?

This is why the hierarchy matters. You can't have sprawling ambiguous goals — everything has to be broken down to the task level, and everything at the task level has to be actually doable in one shift.

## API Endpoints

### Epics

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/pfc-epics/` | List epics (lightweight) |
| `POST` | `/api/v2/pfc-epics/` | Create epic |
| `GET` | `/api/v2/pfc-epics/{id}/` | Retrieve epic (lightweight) |
| `GET` | `/api/v2/pfc-epics/{id}/full/` | Retrieve epic (full details) |
| `PATCH` | `/api/v2/pfc-epics/{id}/` | Update epic |
| `DELETE` | `/api/v2/pfc-epics/{id}/` | Delete epic |

### Stories

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/pfc-stories/` | List stories (lightweight) |
| `POST` | `/api/v2/pfc-stories/` | Create story |
| `GET` | `/api/v2/pfc-stories/{id}/` | Retrieve story (lightweight) |
| `GET` | `/api/v2/pfc-stories/{id}/full/` | Retrieve story (full details) |
| `PATCH` | `/api/v2/pfc-stories/{id}/` | Update story |
| `DELETE` | `/api/v2/pfc-stories/{id}/` | Delete story |

### Tasks

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/pfc-tasks/` | List tasks (lightweight) |
| `POST` | `/api/v2/pfc-tasks/` | Create task |
| `GET` | `/api/v2/pfc-tasks/{id}/` | Retrieve task (lightweight) |
| `GET` | `/api/v2/pfc-tasks/{id}/full/` | Retrieve task (full details) |
| `PATCH` | `/api/v2/pfc-tasks/{id}/` | Update task |
| `DELETE` | `/api/v2/pfc-tasks/{id}/` | Delete task |

## How It Connects

- **[Temporal Lobe](./temporal-lobe)** — Tasks are scoped to shifts. During the Executing shift, worker [IdentityDiscs](./identity) ask the Prefrontal Cortex for tasks in "ready" status.
- **[Identity](./identity)** — Epics and tasks are assigned to [IdentityDiscs](./identity). Each identity has their own list of work.
- **[Frontal Lobe](./frontal-lobe)** — When a reasoning session starts in a worker context, it fetches assigned tasks from the Prefrontal Cortex to populate the reasoning goal.
- **[Central Nervous System](./central-nervous-system)** — Task status changes fire signal events through the [Synaptic Cleft](./synaptic-cleft), keeping the UI in sync with work progress.
