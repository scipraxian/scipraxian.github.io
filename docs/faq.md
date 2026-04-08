---
id: faq
title: Frequently Asked Questions
sidebar_position: 12
---

# Frequently Asked Questions

## Getting Started

### What hardware do I need to run Are-Self?

Are-Self is designed for consumer hardware — a modern laptop or desktop with at least 8GB of RAM will work. For best performance with larger models, we recommend 16GB+ RAM. See the [Getting Started Guide](./getting-started.md) for specific system requirements.

### Do I need an internet connection?

No. After initial setup, Are-Self runs 100% locally on your hardware via Ollama. This is one of Are-Self's core strengths — perfect for homes, churches, and schools where internet reliability or privacy concerns matter.

### What's the difference between Ollama and OpenRouter?

Ollama runs models locally on your machine with zero cloud dependency. OpenRouter is a cloud service for accessing larger models when you have internet access. Learn more in our [OpenRouter Guide](./openrouter.md).

### How do I install Are-Self?

We provide Docker-based installation for simplicity. Check the [Getting Started Guide](./getting-started.md) for step-by-step instructions. You'll need Docker, PostgreSQL, and Ollama running alongside the Django API and React frontend.

---

## How It Works

### What is the tick cycle?

The tick cycle is Are-Self's core reasoning loop: **PNS** (Peripheral Nervous System) → **Temporal Lobe** → **CNS** (Central Nervous System) → **Frontal Lobe** → tools/memory/routing. Each tick allows the agent to perceive, process, decide, and act. See the [Architecture Overview](./architecture.md) for details.

### What are brain regions?

Brain regions are Django apps that mimic neurological structures. The **Hippocampus** handles memory with pgvector, the **Prefrontal Cortex** manages reasoning, and others handle perception, language, and motor control. This modular design keeps Are-Self flexible and human-like. Read more in the [Architecture Overview](./architecture.md).

### What is an IdentityDisc?

An IdentityDisc is a persistent identifier for an agent's mind — like a digital soul. It ensures continuity across sessions and allows agents to build long-term personality and memory. Check the [Features Overview](./features.md) for more.

### What is an Engram?

An Engram is a memory trace in Are-Self — a structured record of learning that updates the agent's weights and vectors. Over time, Engrams form the agent's lived experience and reasoning capacity. See the [Architecture Overview](./architecture.md) for details.

### What is the Focus Economy?

In Are-Self, agents earn execution budget by forming novel memories and making intelligent decisions. This "economy" encourages efficient reasoning and prevents wasteful computation. Learn more in the [Features Overview](./features.md).

---

## Safety & Privacy

### Is Are-Self safe for children?

Yes. Are-Self runs locally with no cloud calls by default, giving you full control over content and interactions. Parents and educators can sandbox agents, monitor reasoning, and curate knowledge. We designed this for "a 10-year-old with no money (or their grandma)" — see our [Security Documentation](./security.md).

### Does Are-Self send data to the cloud?

Not by default. Local Ollama inference is the primary mode. If you enable OpenRouter for cloud models, only your current query goes to the cloud — no historical data. You control this choice entirely. Read our [Security Documentation](./security.md).

### Can I run Are-Self completely offline?

Yes, this is a core feature. After initial setup, Are-Self can run air-gapped (disconnected from the internet). No cloud services required. This is ideal for schools, churches, and families concerned about digital privacy and independence.

### Can I feed it my own documents (Bible, textbooks, etc.)?

Absolutely. Use the **Hippocampus** (pgvector memory layer) to inject documents, creating custom knowledge bases. Agents will integrate these documents into reasoning and memory formation. See the [Architecture Overview](./architecture.md) for more on how memory works.

---

## Contributing & Community

### How was Are-Self built? (AI transparency)

Are-Self was architected by Michael with Claude (AI) as an active collaboration tool — not just for code review, but for research, design, and problem-solving. Michael remains the human architect; AI is a force multiplier. We believe in transparency about how modern open-source is built. See our [Acknowledgments](./acknowledgments.md).

### How can I contribute?

Are-Self is open-source (MIT license) on GitHub at [github.com/scipraxian](https://github.com/scipraxian). We welcome bug reports, feature requests, documentation improvements, and research contributions. Join our [Discord community](https://discord.gg/nGFFcxxV) to connect with other contributors.

### How can I support the project financially?

Michael released Are-Self freely for the community. If you'd like to support, consider sponsoring on GitHub Sponsors, contributing to the research papers, or helping others get Are-Self running in their communities. Every share multiplies impact.

### Where can I find the community?

Join our **Discord server** at [discord.gg/nGFFcxxV](https://discord.gg/nGFFcxxV) to chat with other users, ask questions, and stay updated on releases. We also track issues and discussions on [GitHub](https://github.com/scipraxian).

---

## Additional Resources

- **[Getting Started](./getting-started.md)** — Get Are-Self running on your machine
- **[Architecture Overview](./architecture.md)** — Understand the neurologically-inspired design
- **[Features Overview](./features.md)** — Deep dive into IdentityDiscs, Engrams, and more
- **[Security](./security.md)** — Best practices for families and schools
- **[Research Papers](./research.md)** — Academic background and theory
