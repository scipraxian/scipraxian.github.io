---
id: identity
title: "Identity — Personas"
description: "Persona templates, identity discs, addons, tools, and vector embeddings"
slug: /brain-regions/identity
---

# Identity — Personas

You are different people in different places. The you at home with your family is a little different than the you at school. The you playing soccer is different from the you doing homework. Your brain keeps a "core you" — your values, your personality, the things that make you *you* — but it also knows how to activate different versions of yourself depending on what you're doing. The [Prefrontal Cortex](./prefrontal-cortex) in the front of your brain is the manager that holds onto that core self, and it makes sure all your different selves are still *you*.

Are-Self's Identity region works exactly the same way. It stores templates — think of them like blueprints or recipes — that define what an AI persona is like. But here's the cool part: when you actually *need* to use a persona, the Identity region doesn't just pull out the blueprint. It **forges** it into a living, working copy called an **IdentityDisc**. One blueprint can create dozens of discs, and each disc learns and grows on its own — gaining experience, remembering what worked and what didn't, leveling up like a character in a video game. When you're done, those memories get filed away, and the template stays the same, ready to forge new discs again.

## Key Concepts

**Identity Template** (`identity/models.py → Identity`) — This is the blueprint. It contains the `system_prompt_template` (Django template syntax with variables like `&#123;&#123;identity_disc.name&#125;&#125;`), the `enabled_tools` it's allowed to use, and personality metadata (tags, type, name). Templates are immutable — once made, they don't change. If you want a different version, you fork it and make a new one, just like branching off from a tree.

**IdentityDisc** (`identity/models.py → IdentityDisc`) — This is a living, working instance of a template. It has a `level` (calculated from `total_xp // 100 + 1`), XP (experience points earned via `turn.apply_efficiency_bonus()` and engram saves), success/failure counters, and a `VectorField(dimensions=768)` embedding — a mathematical fingerprint that captures what the disc is really about. The [Hypothalamus](./hypothalamus) uses this fingerprint to find the perfect AI model for the job.

**Vector Embedding** — Imagine every persona and every AI model in the world described as a point in a huge mathematical space. That description is the embedding. It's auto-generated from the persona's prompt, tags, and type. When the [Hypothalamus](./hypothalamus) needs to pick a model, it looks at embeddings to find the best match — kind of like finding your doppelgänger in a crowd.

**Addons** (`identity/models.py → IdentityAddon`) — These are optional power-ups you can attach to a persona. Each addon has a `function_slug` and an `IdentityAddonPhase` — `IDENTIFY`, `CONTEXT`, `HISTORY`, or `TERMINAL` — that controls *when* during prompt assembly it fires. The Focus Addon (`identity/addons/focus_addon.py`) is one example, injecting focus budget status at the terminal phase. Think of them like special abilities you can equip at specific moments.

**Tool Binding** — Each Identity has `enabled_tools` — a many-to-many link to `ToolDefinition` records. It's like a police officer having a badge and a radio, but not a medical kit. The [Parietal Lobe](./parietal-lobe) enforces this — it makes sure discs can only access the tools they're allowed to use.

## How It All Fits Together

When you create a template, you're making a mold. You set the persona's name, personality, system prompt, and which tools it should have. You might tag it — "customer service", "writer", "teacher" — so the system knows what kind of disc it's creating.

Then when you need to actually *use* that persona, you forge a disc from the template. Each disc is stateful — it keeps track of its own experience, learns from its successes and failures, and levels up. Multiple discs from the same template don't interfere with each other. They're like twins raised in different countries — same blueprint, totally different lives.

The disc's embedding is generated automatically and sent to the [Hypothalamus](./hypothalamus). The Hypothalamus uses it to say: "I see this persona is a thoughtful writer. These writing-focused models are going to be a perfect fit." Smart matching.

Addons are optional flavoring. You might add a memory addon that reminds the persona of past conversations, or a style addon that says "always be super friendly." Addons inject their text at known spots during reasoning, so the [Frontal Lobe](./frontal-lobe) knows exactly where to expect them.

## API Endpoints

### Identity Templates

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/identities/` | List all identity templates |
| `POST` | `/api/v2/identities/` | Create new identity template |
| `GET` | `/api/v2/identities/{id}/` | Retrieve template details |
| `PATCH` | `/api/v2/identities/{id}/` | Update template |
| `DELETE` | `/api/v2/identities/{id}/` | Delete template |

### Identity Discs (Instances)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/identity-discs/` | List all discs (stateful instances) |
| `POST` | `/api/v2/identity-discs/` | Forge new disc from template |
| `GET` | `/api/v2/identity-discs/{id}/` | Retrieve disc with level, XP, stats |
| `PATCH` | `/api/v2/identity-discs/{id}/` | Update disc metadata |
| `DELETE` | `/api/v2/identity-discs/{id}/` | Delete disc |
| `GET` | `/api/v2/identity-discs/{id}/model-preview/` | Preview current model selection for this disc |

### Addons & Extensions

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/identity_addons/` | List available addons |
| `POST` | `/api/v2/identity_addons/` | Create addon |
| `GET` | `/api/v2/identity_addons/{id}/` | Retrieve addon |
| `PATCH` | `/api/v2/identity_addons/{id}/` | Update addon |
| `DELETE` | `/api/v2/identity_addons/{id}/` | Delete addon |

### Tags & Types

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/identity_tags/` | List available tags |
| `POST` | `/api/v2/identity_tags/` | Create tag |
| `GET` | `/api/v2/identity_types/` | List identity types |
| `POST` | `/api/v2/identity_types/` | Create type |

### Budgets

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/identity-budgets/` | List token/cost budgets |
| `POST` | `/api/v2/identity-budgets/` | Create budget constraint |
| `PATCH` | `/api/v2/identity-budgets/{id}/` | Update budget |

## How It Connects

- **[Hypothalamus](./hypothalamus)** — Requests the IdentityDisc's vector embedding to match against model embeddings for intelligent routing. Uses the disc's personality fingerprint to find the perfect model for the job.
- **[Frontal Lobe](./frontal-lobe)** — Loads the IdentityDisc's system prompt and addons when it starts thinking. Asks "who am I?" and the Identity region answers with the full persona.
- **[Parietal Lobe](./parietal-lobe)** — Respects the IdentityDisc's tool binding — only tools linked to the disc are available for use. Acts as the bouncer.
- **[Temporal Lobe](./temporal-lobe)** — Assigns IdentityDiscs to specific shift columns during iteration design. Keeps track of which persona is working when.
- **[Central Nervous System](./central-nervous-system)** — Discs exist within spike execution and messaging. Signals flow through them.
- **[Synaptic Cleft](./synaptic-cleft)** — Discs report their state and signals here so the system knows what each persona is doing.
