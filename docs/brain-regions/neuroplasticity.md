---
id: neuroplasticity
title: "Neuroplasticity — Adding New Abilities"
description: "NeuralModifiers, contribution-based installs, manifest hashing, and how Are-Self grows new abilities without touching INSTALLED_APPS"
slug: /brain-regions/neuroplasticity
---

# Neuroplasticity — Adding New Abilities

When you learn to ride a bike, your brain doesn't grow a whole new lobe. It rewires. Neurons that were strangers form new synapses. Pathways that didn't exist yesterday are normal today. The brain stays the same shape — it just does more. That's **neuroplasticity**: the brain's ability to learn new tricks without rebuilding itself.

Are-Self works the same way. When you want it to drive Unreal Engine, or talk to a new service, or run a workflow nobody imagined when the system was written, you don't fork the codebase or add a new Django app to `INSTALLED_APPS`. You install a **NeuralModifier** — a package of new abilities that hooks into the regions that already exist. The [Central Nervous System](./central-nervous-system) gets new [Effector](./central-nervous-system) types it can fire. [Environments](../ui/environments) get new context variables. The [Parietal Lobe](./parietal-lobe) gets new tools. The brain didn't change shape. It just learned a new skill.

And here's the part that matters: the system can forget the skill too. Every row a modifier added is tagged with a little sticky note saying "this came from me." When you uninstall, Are-Self walks the sticky notes in reverse and removes exactly what the modifier added — nothing more, nothing less. No leftovers. No broken references. The brain forgets cleanly, the way it learned cleanly.

## What a NeuralModifier Is

A NeuralModifier is a bundle that ships with a manifest describing what it does and a payload describing the rows it wants to add. It's registered in `neuroplasticity/models.py` as `NeuralModifier` with a handful of identity fields — `slug` (unique), `version`, `author`, `license` — plus two fields that matter a lot: `manifest_hash` and `manifest_json`.

`manifest_json` is a cached copy of the manifest itself, stored right on the row. `manifest_hash` is a SHA-256 of that manifest, frozen at install time. If anyone edits the files on disk after install — even a single character — the hash stops matching, and the next check fires a `HASH_MISMATCH` event. That's tamper detection for free: you always know whether the thing that's installed is still the thing you installed.

Bundles live in the codebase at `neuroplasticity/modifier_genome/[slug]/` (committed, versioned, reviewable) and install into `neural_modifiers/[slug]/` at repo root (gitignored, per-machine). The separation is intentional: the committed tree is the genome — the source material, the same on every checkout. The runtime tree is what's actually plugged in *here*, on *this* machine, right now.

## The Lifecycle — Five Stages

Every NeuralModifier moves through a lifecycle tracked by the `NeuralModifierStatus` enum in `neuroplasticity/models.py`. Think of it as the modifier's progress bar:

| Status | What It Means |
|--------|---------------|
| **Discovered** | The files exist on disk. The manifest parsed. Nothing's been loaded into the database yet. |
| **Installed** | The manifest validated, the payload loaded, every row it created has a `NeuralModifierContribution` on file. |
| **Enabled** | Actively contributing. The modifier's effectors, tools, and pathways are live in the system. |
| **Disabled** | Installed but skipped. Rows are still in the database, but the system behaves as if they weren't. |
| **Broken** | Something went wrong and can't be auto-fixed. Terminal state — needs human attention. |

The interesting transition is **Enabled ↔ Disabled**. You can flip a modifier off without uninstalling it. The rows stay in place, the uninstall manifest stays intact, but the system stops honoring its contributions. Flip it back on and nothing had to be reloaded — it was just sleeping.

## Contributions — The Uninstall Manifest

Here's the clever bit. When a modifier installs, every row it adds to the database gets a partner row in the `neuroplasticity_neuralmodifiercontribution` table. That partner row is just three things: a reference to the modifier, a `ContentType` pointing at whatever kind of model was created (say, an [Effector](./central-nervous-system) or an [Executable](../ui/environments)), and a `UUIDField` pointing at the specific row. That's a Django generic foreign key — one sticky note that can point at any model in the system, as long as the model uses UUID primary keys.

And every model that a modifier could ever contribute to *does* use UUID primary keys. That's not an accident — it's the whole point of the immutability directive. Effectors, Neurons, Axons, Executables, ContextVariables, ToolDefinitions, NeuralPathways, the entire [Hypothalamus](./hypothalamus) model catalog — all UUID. Which means a single generic foreign key can reach any of them.

When you uninstall, the `NeuralModifier.iter_contributed_objects()` method walks the contributions in order, pulls each live object through the GFK, and yields them for deletion. Orphaned contributions (where the target row was deleted some other way) get skipped gracefully. The code is under forty lines and it's the entire uninstall engine.

This design choice has a consequence worth saying out loud: **`INSTALLED_APPS` is never mutated at runtime**. Contributions are data, not code. Installing a modifier doesn't reach into Django settings, doesn't reload the app registry, doesn't restart workers. It just writes rows. Uninstalling just deletes rows. The whole system stays stable because the only thing that ever changes is the database — and databases are good at change.

## The Manifest Hash

Every install freezes a SHA-256 of the manifest on the `NeuralModifier.manifest_hash` field. Every periodic check rehashes the on-disk manifest and compares. If they don't match, the system logs a `HASH_MISMATCH` event and, depending on policy, refuses to trust the modifier until a human approves the change.

That means you get tamper detection for free. If someone edits the committed bundle to add a new effector, the hash changes, and the system notices. If a bad actor swaps the files on a running machine, the hash changes, and the system notices. If you yourself hand-edit the manifest during development, the hash changes, and the system notices — that's a good reminder to rebuild before trusting the result.

## The Installation Log

Every install, uninstall, enable, disable, and load attempt writes to `NeuralModifierInstallationLog`. That log owns its own `installation_manifest` — a frozen snapshot of the manifest as it looked at the moment of the event — so you can compare what *is* against what *was* even if the files on disk have drifted since.

Each log row has child `NeuralModifierInstallationEvent` rows typed by the `NeuralModifierInstallationEventType` enum:

| Event | Fires When |
|-------|-----------|
| **Install** | A modifier moved from Discovered to Installed. |
| **Uninstall** | All the contributions were walked and deleted. |
| **Enable** | A Disabled modifier was turned back on. |
| **Disable** | An Installed modifier was turned off without uninstalling. |
| **Load Failed** | The manifest or payload couldn't be parsed, or contribution creation blew up mid-transaction. |
| **Hash Mismatch** | The on-disk manifest no longer matches the stored hash. |

Each event carries a JSON `event_data` blob with whatever detail the reporter thought was worth keeping — stack traces on `Load Failed`, diff summaries on `Hash Mismatch`, contribution counts on `Install`. The log is append-only. Nothing gets edited; new rows just keep arriving.

## Why the Registry Keeps Integer PKs

You might notice that `NeuralModifier`, `NeuralModifierStatus`, and the installation log tables themselves use integer primary keys, not UUIDs. That's on purpose. The immutability directive says *anything a NeuralModifier could ever contribute to* uses UUIDs. The neuroplasticity registry is one level up — it's the thing that *owns* the contributions. It's core infrastructure, never extended by plugins, so integer PKs are fine here. You install modifiers; modifiers don't install neuroplasticity.

## The First Bundle — Unreal Engine

The first NeuralModifier being extracted is the Unreal Engine build orchestration flow that used to live in the `ue_tools/` app. That flow adds a specific set of effectors, executables, context variables, and neural pathways to the system — everything you need to drive `UnrealBuildTool`, `UnrealAutomationTool`, staging, packaging, and release testing from a [CNS pathway](./central-nervous-system).

The extraction is staged. The fixture data that describes Unreal's contributions already lives at `central_nervous_system/fixtures/unreal_modifier.json` and `environments/fixtures/unreal_modifier.json` as a sibling to the four biological-tier fixtures. Those files are the payload the bundle will ship. The committed source tree at `neuroplasticity/modifier_genome/unreal/` is where the rest of the bundle — manifest, Python code, assets — will come to rest as extraction completes. Once the bundle is whole, `ue_tools/` can be removed entirely, because nothing in core will depend on it anymore.

In parallel, the generic log-merge utilities that used to live in `ue_tools/` have already moved to `occipital_lobe/`, and the log parser has been split into a generic core plus Unreal-specific strategies registered through a `LogParserFactory`. That's the pattern for every future extraction: the *generic* bits go back to their rightful core region, the *specific* bits ship in the bundle. Core owns the framework; the modifier owns the flavor.

## The Four Fixture Tiers and Where Modifiers Fit

Are-Self's core fixtures load in four biological tiers — `genetic_immutables.json` → `zygote.json` → `initial_phenotypes.json` → `petri_dish.json`. The first three are for everyone (install, Docker, and production); the last is test-only. The neuroplasticity app follows the same convention: it ships a `genetic_immutables.json` that seeds the five statuses and six event types, and nothing in the other tiers — the registry is empty at first boot. A fresh install has zero installed modifiers; modifiers arrive later, by invitation.

A NeuralModifier bundle's own fixture-like payload — the Effectors, Executables, NeuralPathways it wants to contribute — ships inside the bundle, not as part of the core tiers. The contribution-aware loader (planned) will walk the payload, create each row, and write the matching `NeuralModifierContribution` in the same transaction so the uninstall manifest is always consistent with the install.

## What's Already Built, What's Next

Being honest about the stage: the **models are live** (NeuralModifier, NeuralModifierContribution, NeuralModifierInstallationLog, NeuralModifierInstallationEvent), the **enums are seeded** (five statuses, six event types), the **uninstall walker exists** (`iter_contributed_objects()`), and the **first bundle's payload fixtures are staged** (the two `unreal_modifier.json` files). The architectural shape — contributions as data, `INSTALLED_APPS` as immutable, manifest hashing for tamper detection — is committed in code and in the project's standing rules.

What comes next is the glue: the `./manage.py build_modifier` command that packages a `modifier_genome/` source tree into a distributable bundle, the contribution-aware loader that creates `NeuralModifierContribution` rows in lockstep with each payload object it creates, and the completion of the Unreal extraction so the bundle ships whole. There's no REST API for neuroplasticity yet — this is an install-time backend concern, not something a frontend calls during a reasoning turn.

Think of the current state as the blueprint being fully drawn and the frame being stood up. The house isn't livable yet, but you can walk the rooms and see where every wall will be.

## How It Connects

- **[Central Nervous System](./central-nervous-system)**: The biggest customer. Modifiers ship new Effector types, new EffectorContexts, new NeuralPathways, and new Axons — all UUID-keyed so contribution GFKs can reach them.
- **[Environments](../ui/environments)**: Modifiers routinely ship new ContextVariables so their effectors can resolve paths and settings from the active environment.
- **[Parietal Lobe](./parietal-lobe)**: New ToolDefinitions, ToolParameters, and ParameterEnums can ride along in a modifier, giving the [Frontal Lobe](./frontal-lobe) new tools to call.
- **[Hypothalamus](./hypothalamus)**: The entire model catalog is UUID-keyed, so a modifier could theoretically ship new model families, providers, or failover strategies — though in practice the catalog syncs from Ollama and OpenRouter, not from bundles.
- **[Temporal Lobe](./temporal-lobe)**: IterationDefinitions and IterationShiftDefinitions are UUID-keyed and contributable. A modifier focused on a specific workflow shape (say, a game-dev cadence) could ship its own definitions.
- **[Identity](./identity)**: IdentityAddons are UUID-keyed. A modifier could ship new addon phases specific to its domain — though the addon's underlying Python function still has to live somewhere the bundle loads as importable code.
- **[Synaptic Cleft](./synaptic-cleft)**: Install, uninstall, enable, and disable events are candidates for real-time broadcast so UIs can reflect modifier state without polling.
