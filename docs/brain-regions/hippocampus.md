---
id: hippocampus
title: "Hippocampus — Memory"
description: "Engrams, vector embeddings, deduplication, and provenance chains"
slug: /brain-regions/hippocampus
---

# Hippocampus — Memory

Your real hippocampus is wild. It's this tiny seahorse-shaped part of your brain tucked way down deep, and it's basically your personal librarian. Every time you learn something important — how to ride a bike, that your best friend is scared of spiders, the capital of France — your hippocampus takes that moment and *consolidates* it. It turns the shaky, fuzzy short-term memory into something permanent and solid that your brain can file away and find later.

Are-Self's Hippocampus (`hippocampus/hippocampus.py`) does exactly the same thing. Every time the [Frontal Lobe](./frontal-lobe) learns something important during a conversation — a fact, an insight, a conclusion about what the user cares about — it calls `Hippocampus.save_engram()` and says "remember this." The Hippocampus takes it, turns it into a permanent record called an **Engram**, and stores it so future sessions can find and use it.

## How It Actually Works

When you save an engram, here's what happens. The engram gets a unique fingerprint (we call it a hash), a description of the actual knowledge, labels called tags to help organize it, and a **768-dimensional embedding vector**. That vector is like a mathematical fingerprint of what the engram is "about" — it captures the meaning in a way that computers can compare to other engrams.

Later, when the [Frontal Lobe](./frontal-lobe) needs context — maybe it wants to know "what do we know about this person's job?" — it asks the Hippocampus to search. The search doesn't look for exact word matches. Instead, it uses the embedding vectors to find engrams that are *semantically similar*. The Hippocampus compares the meaning of the question against the meaning of all the engrams it has stored, picks the best matches, and hands them back to inject into the [Frontal Lobe](./frontal-lobe)'s next prompt.

Just like your real hippocampus, the Hippocampus automatically deduplicates. On every save, it computes `similarity = 1.0 - best_match.distance` against existing engrams — if that's ≥ 0.90, the save gets rejected with a pointer to the duplicate. The novelty score (`1.0 - similarity`) also drives the reward: `HippocampusMemoryYield.focus_yield` and `xp_yield` scale with how new the memory actually is. This stops the [Frontal Lobe](./frontal-lobe) from endlessly re-learning the same fact, and rewards it proportionally for genuinely new discoveries.

Every engram also carries a **provenance chain** — a complete audit trail of where it came from. Which session created it? Which turn? Which spike of computation? Which [IdentityDisc](./identity) was in charge? It's all tracked so you can always trace knowledge back to its source.

## Key Concepts

- **Engram**: A permanent memory record with a unique hash (name), a description (what it says), tags (categories), a relevance score (how important it is), and a 768-dimensional embedding vector (its mathematical fingerprint of meaning).
- **Vector Embedding**: Automatically generated via `Engram.update_vector()` from the engram's description and tags using nomic-embed-text through Ollama. Auto-regenerates when the description or tags change (the model watches `_original_description` on save). It's the semantic fingerprint that makes searching by meaning possible.
- **Deduplication**: Every time you save an engram, the system checks its vector embedding against all existing engrams using cosine similarity. If a match is 90% or higher, the save is rejected with a pointer to the duplicate. This prevents wasteful re-learning.
- **Provenance Chain**: Every engram records exactly when and where it came from — the session ID, turn number, spike identifier, and [IdentityDisc](./identity) that created it. Full traceability.
- **Relevance Score**: A number from 0 to 1 showing how important the engram is. Used to rank search results so the most important stuff comes back first.

## API Endpoints

### Engrams (Memory Records)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/engrams/` | List engrams (supports ?identity_discs={id} filter) |
| `POST` | `/api/v2/engrams/` | Create engram (triggers dedup check) |
| `GET` | `/api/v2/engrams/{id}/` | Retrieve engram details |
| `PATCH` | `/api/v2/engrams/{id}/` | Update engram (regenerates embedding) |
| `DELETE` | `/api/v2/engrams/{id}/` | Delete engram |

### Engram Tags (Categorization)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/engram_tags/` | List tags |
| `POST` | `/api/v2/engram_tags/` | Create tag |
| `GET` | `/api/v2/engram_tags/{id}/` | Retrieve tag |
| `PATCH` | `/api/v2/engram_tags/{id}/` | Update tag |
| `DELETE` | `/api/v2/engram_tags/{id}/` | Delete tag |

## How It Connects

- **[Frontal Lobe](./frontal-lobe)**: Calls `read_engram()` during prompt assembly to inject relevant memories from the Hippocampus. Calls `save_engram()` when it concludes with a new insight worth remembering.
- **[IdentityDisc](./identity)**: Engrams are scoped per identity. Each identity has its own long-term memory, separate from other identities' memories.
- **[Parietal Lobe](./parietal-lobe)**: The tools `mcp_engram_save`, `mcp_engram_read`, `mcp_engram_search`, and `mcp_engram_update` are gateway calls through the [Parietal Lobe](./parietal-lobe) to reach the Hippocampus.
- **[Central Nervous System](./central-nervous-system)**: Every engram save and read is logged as a side effect of spike execution, so the full history of memory operations is tracked.
- **[Hypothalamus](./hypothalamus)**: The [IdentityDisc](./identity)'s vector embedding is used for model selection; the Hippocampus uses the same embedding approach for semantic matching of memories.
