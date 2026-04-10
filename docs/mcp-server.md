---
id: mcp-server
title: "MCP Server"
sidebar_position: 45
---

# Are-Self as an MCP Server

Are-Self speaks the [Model Context Protocol](https://modelcontextprotocol.io). Any MCP-compatible client — Claude Code, your own tooling, a custom agent — can connect to a running Are-Self instance and drive the brain: launch neural pathways, search engrams, list identity discs, query environments, and more.

This guide walks through what's exposed, how the endpoint is wired, and how to connect from the clients that work today.

## The Endpoint

Are-Self exposes a single MCP endpoint through NGINX, which reverse-proxies to the Django/Daphne ASGI server.

- **HTTP (default):** `http://127.0.0.1/mcp`
- **HTTPS (if you've dropped a cert into `nginx\certs\`):** `https://127.0.0.1/mcp`

The endpoint implements MCP over Streamable HTTP using JSON-RPC 2.0. It supports:

- `initialize` — protocol handshake
- `tools/list` — enumerate the available tools
- `tools/call` — invoke a tool with arguments
- `ping` — liveness check

Phase 1 is request/response only. Phase 2 will stream execution updates through the neurotransmitter system (Dopamine for success, Cortisol for errors, Glutamate for token streaming).

## Phase 1 Tools

| Tool | What it does |
| --- | --- |
| `list_neural_pathways` | Enumerates every CNS neural pathway available to execute. |
| `get_neural_pathway` | Returns the node/wire structure of a specific pathway. |
| `launch_spike_train` | Fires a neural pathway and returns the spike train ID. |
| `get_spike_train_status` | Reads current execution state for a running or finished spike train. |
| `stop_spike_train` | Sends a stop signal to a running spike train. |
| `list_effectors` | Lists the effector types available in the CNS. |
| `list_identity_discs` | Lists reasoning agents (IdentityDiscs) and their types. |
| `list_environments` | Lists project environments (working directories, credentials, context). |
| `search_engrams` | Full-text search over the Hippocampus memory store. |
| `read_engram` | Reads a single engram by ID. |
| `save_engram` | Writes a new memory to the Hippocampus. |
| `list_pfc_tasks` | Lists tasks from the Prefrontal Cortex project manager. |
| `create_pfc_task` | Creates a new PFC task. |
| `send_thalamus_message` | Sends a message into the Thalamus standing session. |

The big one is `launch_spike_train`. Combined with `list_neural_pathways` it means any MCP client can trigger the same reasoning runs the Are-Self UI triggers — all the PFC tasks, all the workflows, all of it.

## Running the Stack

The NGINX reverse proxy is part of the Docker Compose stack. Nothing special to configure and **no certificate required** — HTTP is the default:

```bat
.\are-self.bat
```

Docker Compose brings up Postgres, Redis, and NGINX. Daphne runs on the host at `127.0.0.1:8000`, and NGINX inside Docker proxies to it via `host.docker.internal`. You hit `http://127.0.0.1/mcp` and it Just Works.

### How the cert autodetect works

Inside the nginx container, an init script runs on every start. It looks at `/etc/nginx/certs/` (which is your `are-self-api\nginx\certs\` folder, bind-mounted read-only) and decides what config to write:

- **`cert.pem` and `key.pem` both present** → writes an HTTPS-mode config with a 443 listener and a permanent redirect from port 80.
- **Either file missing** → writes a plain HTTP config on port 80.

That's it. No flags, no env vars, no Cloudflare, no Let's Encrypt, no domain name. The presence of the files decides. **You should never run the script yourself** — it lives inside the container and the docker-compose entrypoint calls it for you.

If you ever *do* want HTTPS (for example, you're tunneling through ngrok and want TLS termination at your edge), drop a matching `cert.pem` and `key.pem` into `are-self-api\nginx\certs\` and restart just the nginx container:

```bat
docker compose restart nginx
```

The HTTPS path is opt-in and optional. For normal local development you will never touch it.

## Port Collisions on Windows

NGINX wants port 80. On Windows the usual suspects are IIS, Skype-for-Business legacy services, and occasionally "World Wide Web Publishing Service." If `docker compose up -d` reports that the nginx container died, check from an admin prompt:

```bat
netstat -ano | findstr :80
```

Stop whatever's holding the port, or edit `docker-compose.yml` to publish on a different host port (for example `"8080:80"`) and hit `http://127.0.0.1:8080/mcp` instead.

## Connecting a Client

### Claude Code

Claude Code can connect to a local HTTP MCP server — no TLS gymnastics required. Add Are-Self as a remote MCP server pointing at `http://127.0.0.1/mcp`.

### Testing with curl

You can poke the endpoint by hand. A minimal handshake:

```bat
curl -X POST http://127.0.0.1/mcp ^
  -H "Content-Type: application/json" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{\"protocolVersion\":\"2024-11-05\",\"capabilities\":{},\"clientInfo\":{\"name\":\"curl\",\"version\":\"1.0\"}}}"
```

List the available tools:

```bat
curl -X POST http://127.0.0.1/mcp ^
  -H "Content-Type: application/json" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"tools/list\"}"
```

Launch a pathway:

```bat
curl -X POST http://127.0.0.1/mcp ^
  -H "Content-Type: application/json" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":3,\"method\":\"tools/call\",\"params\":{\"name\":\"launch_spike_train\",\"arguments\":{\"pathway_id\":\"PASTE-UUID-HERE\"}}}"
```

### Cowork / Claude Desktop

Cowork's custom-connector dialog currently requires a publicly-trusted HTTPS URL. It rejects `http://localhost` outright, and rejects self-signed certificates even over HTTPS. For a local-first project like Are-Self, that's not a workable path — every user would need a public domain and a CA-signed cert just to talk to their own machine.

We treat this as a dead issue for the application itself. The bug is tracked upstream at [anthropics/claude-ai-mcp#9](https://github.com/anthropics/claude-ai-mcp/issues/9). If Anthropic adds a localhost exception, Are-Self will already be ready for it — the `/mcp` endpoint is fully compliant.

In the meantime, Claude Code is the recommended Anthropic client for Are-Self's MCP server.

## Security Posture

The MCP endpoint is **unauthenticated** in Phase 1. This is fine for a local-only deployment on a machine only you use — the same threat model as the Django admin on `127.0.0.1:8000`. Do not expose it to a network you don't trust. Token-based auth is on the Phase 2 roadmap and is required before any public deployment.

NGINX does no authentication of its own — it's a plain reverse proxy with optional TLS termination. The certs you drop into `nginx\certs\` are never read by the rest of the stack; they're only used by the NGINX worker.

## Phase 2 Roadmap

- **Streaming via neurotransmitters.** Dopamine → MCP success notifications, Cortisol → error notifications, Glutamate → token streaming. Wires the Synaptic Cleft into MCP's SSE channel.
- **Blackboard writes.** Pre-load arbitrary key/value context onto a spike train before launch. This is the unlock for really interesting programmatic orchestration — a client can stage a whole scenario on the blackboard, then fire the pathway.
- **Vector engram search.** Swap text search for pgvector cosine similarity. Requires embedding the query through Ollama/Nomic first.
- **Full Thalamus integration.** Wire `send_thalamus_message` into the real message pipeline with WebSocket delivery via Channels.
- **Authentication.** Token-based auth before any non-local exposure.
