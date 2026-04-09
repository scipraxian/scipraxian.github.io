---
id: parietal-lobe
title: "Parietal Lobe — Tools"
description: "Tool definitions, ParietalMCP gateway, hallucination armor, and tool types"
slug: /brain-regions/parietal-lobe
---

# Parietal Lobe — Tools

Your real parietal lobe sits in the middle-back part of your brain, and it does something pretty cool: it takes your sensory world (what you feel, see, hear) and connects it to your movements. It's where your brain says "I can reach that," "my hand can hold a pencil," or "I can throw a ball to someone three steps away." It's the reason you don't accidentally high-five the air when you mean to high-five your friend — your parietal lobe knows your body's position and what your arms can do.

Are-Self's Parietal Lobe works like that too, except instead of coordinating your arms, it's coordinating *tools*. When the [Frontal Lobe](./frontal-lobe) thinks it needs to take an action — "let me search the web" or "let me read that file" — it sends a tool call to the Parietal Lobe. The Parietal Lobe doesn't just blindly execute it. First, it checks: "Does this tool actually exist? Do I have the right equipment to run it? Are all the pieces (parameters) the right shape and size?" Only then does it actually run the tool.

Think of it like this: if you're baking cookies and you need to blend something, you first check that you have a blender (tool exists), that it's plugged in (parameters are correct), and that what you're about to put in it isn't, say, a hammer (type matching). The Parietal Lobe is constantly doing these checks before taking action. When the [Frontal Lobe](./frontal-lobe) hallucinates — makes up a tool that doesn't exist or gets the parameters wrong — the Parietal Lobe catches it and says "hey, that's not going to work" instead of crashing.

## How It Actually Works

Every tool in the system lives as a **Tool Definition** in the database. It's like a blueprint: the tool's name, what it does, what inputs it needs (and what type those inputs should be), and what it returns.

When a tool call comes in, the **ParietalMCP gateway** takes over. It's the bouncer at the door, and it runs three checks:

1. **Does the tool exist?** If the name doesn't match anything in the database, it stops right there.
2. **Do the parameters have the right shape?** Each parameter has a declared type (text, number, true/false, etc.). The gateway checks that what was passed matches that type.
3. **Are the required fields actually there?** Some parameters are optional (you can skip them), but others are mandatory. The gateway makes sure nothing important is missing.

If anything fails, the gateway sends back an error message explaining what went wrong. The [Frontal Lobe](./frontal-lobe) gets the feedback and can try again with better information.

If everything passes, the gateway calls the Python function that actually does the work. The function gets some automatic help: the `session_id` (which conversation this is) and `turn_id` (which step in the conversation) are injected automatically, so the function always knows the context.

## Built-in Tools

The system comes with some tools already built in:

- **`mcp_respond_to_user`** — Send a message back to the user.
- **`mcp_done`** — Tell the system the conversation is finished.
- **`mcp_engram_save`**, **`mcp_engram_read`**, **`mcp_engram_search`**, **`mcp_engram_update`** — These talk to the [Hippocampus](./hippocampus) to save, load, and search memories.

You can also create custom tools by adding new Tool Definitions to the database.

## How It Connects

- **[Frontal Lobe](./frontal-lobe)** — Sends tool calls when it needs to take an action. The Parietal Lobe validates and executes them, then hands the result back to the reasoning loop.
- **[Hippocampus](./hippocampus)** — The memory tools (`mcp_engram_*`) are Parietal Lobe handlers that call into the Hippocampus to store and retrieve memories.
- **[Central Nervous System](./central-nervous-system)** — Tool execution is a side effect of spike execution. If something goes wrong, failure signals flow through the system.
- **[Identity](./identity)** — Identities have permission lists. The ParietalMCP gateway checks the [IdentityDisc](./identity)'s tool permissions before executing anything.
- **[Synaptic Cleft](./synaptic-cleft)** — Tool results and errors flow back through the [Synaptic Cleft](./synaptic-cleft) to the [Frontal Lobe](./frontal-lobe).

## API Endpoints

### Tool Definitions

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/tool-definitions/` | List tool definitions |
| `POST` | `/api/v2/tool-definitions/` | Create tool |
| `GET` | `/api/v2/tool-definitions/{id}/` | Retrieve tool definition |
| `PATCH` | `/api/v2/tool-definitions/{id}/` | Update tool |
| `DELETE` | `/api/v2/tool-definitions/{id}/` | Delete tool |
| `GET` | `/api/v2/tool-parameters/` | List tool parameters |
| `POST` | `/api/v2/tool-parameters/` | Create parameter |
| `PATCH` | `/api/v2/tool-parameters/{id}/` | Update parameter |

### Tool Calls & Execution

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/tool-calls/` | List all tool calls (audit trail) |
| `POST` | `/api/v2/tool-calls/` | Record tool call |
| `GET` | `/api/v2/tool-calls/{id}/` | Retrieve tool call details |
