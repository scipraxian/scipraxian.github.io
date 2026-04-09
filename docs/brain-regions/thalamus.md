---
id: thalamus
title: "Thalamus — Chat Interface"
description: "Standing sessions, human-AI relay, and the chat bubble"
slug: /brain-regions/thalamus
---

# Thalamus — Chat Interface

In your actual brain, the thalamus is like a mail room. Sensory signals come in — light from your eyes, sounds from your ears, touch on your skin — and the thalamus sorts them and relays them to the right part of the cortex. "Light information → visual cortex, sound → auditory cortex." It's the relay station that gets information where it needs to go.

Are-Self's Thalamus works the same way, except instead of sensory signals, it relays *chat messages*. You type something in the chat bubble on the screen. The Thalamus catches that message, sends it to the [Frontal Lobe](./frontal-lobe) to be reasoned about, then relays the response back to you on the screen. You're talking to an AI identity through a persistent chat thread called a **standing session**. The Thalamus keeps that conversation alive, flowing back and forth.

It's the human-facing window into the whole Are-Self system. Every page has a chat bubble. Click it anytime and you can ask questions, inject new work, or check on what's happening inside the system. The Thalamus makes sure your messages get in and responses get back to you in real time.

## Standing Sessions — Your Conversation Thread

A **standing session** is an ongoing chat with an AI identity. It stays "alive" across page refreshes, browser reloads, even when you close the tab and come back later. It's not like a one-time question-answer; it's a persistent conversation.

When you start a standing session, you're paired with an [IdentityDisc](./identity) — a specific AI personality. All your messages go to that identity. It builds a memory of your conversation and can reference back to earlier messages: "Remember when you asked about X? Let me expand on that..."

The Thalamus keeps track of every standing session. If you have multiple conversations going with different identities, the Thalamus knows them all and keeps them separate.

## How Messages Flow

The flow is simple but powerful:

1. **You type** in the chat bubble: "Can you help me debug this?"
2. **Thalamus receives** the message and records it in the standing session.
3. **Thalamus relays** the message to the [Frontal Lobe](./frontal-lobe) using the `/api/v2/thalamus/interact/` endpoint.
4. **Frontal Lobe thinks** about it, reasons through the problem, generates a response.
5. **Response streams back** to the Thalamus via WebSocket in real time. You see the answer appearing in the chat bubble word by word.
6. **Thalamus records** the full response in the standing session, so next time you chat, the AI can remember this exchange.

## Real-Time Streaming

Responses don't come all at once. As the [Frontal Lobe](./frontal-lobe) generates text, it streams back character by character, sentence by sentence. The Thalamus pushes this via WebSocket (the same technology used for live multiplayer games). You see the response appearing in real time, like the AI is thinking out loud.

This happens through two kinds of signals:

- **Glutamate signals** carry the actual response text — the words the AI is generating.
- **Norepinephrine signals** carry logs and status updates — "Calling external API", "Thinking about architecture", etc.

## Key Concepts

- **Standing Session**: A persistent chat thread with an assigned [IdentityDisc](./identity). Stays "alive" across page refreshes and session resumptions. Maintains conversation history.
- **Human-AI Relay**: A bidirectional pipe. Human message → Thalamus → [Frontal Lobe](./frontal-lobe) → reasoning → [Frontal Lobe](./frontal-lobe) → Thalamus → chat UI. Questions flow in, answers flow out.
- **Chat Bubble**: The always-present UI widget on every page. Click it to interact with the standing session from anywhere in the system.
- **Real-Time Streaming**: Responses arrive live via WebSocket. You don't wait for a full response; you see it building character by character.
- **Conversation Memory**: The standing session stores the full history. The [IdentityDisc](./identity) can reference earlier messages in the conversation: "When you asked about X before..."

## The Chat Bubble

Every page in Are-Self has a chat bubble — usually in the bottom right corner. It's always there, always ready. Click it and a panel opens with your current standing session. You can:

- Type new messages
- See your conversation history
- Watch responses stream in real time
- Switch between standing sessions if you have multiple
- Start a new standing session with a different [IdentityDisc](./identity)

It's a quick way to ask questions about what's happening elsewhere in the system without leaving your current page.

## How It Connects

- **[Frontal Lobe](./frontal-lobe)**: When the Thalamus receives a message, it injects it into the [Frontal Lobe](./frontal-lobe)'s reasoning session. The [Frontal Lobe](./frontal-lobe) generates a response, which streams back through the Thalamus.
- **[Synaptic Cleft](./synaptic-cleft)**: Streaming responses flow via WebSocket. Glutamate signals carry response text, Norepinephrine signals carry logs.
- **[Identity](./identity)**: Standing sessions are tied to [IdentityDisc](./identity) instances. Each conversation is with a specific AI personality.
- **All regions**: The Thalamus is the human's sensory relay and window into the entire system. When something happens anywhere — the [Hypothalamus](./hypothalamus) picks a model, the [Parietal Lobe](./parietal-lobe) executes a tool, the [Temporal Lobe](./temporal-lobe) advances a shift — you can ask about it through the chat bubble.

## API Endpoints

### Thalamus Chat Relay

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/v2/thalamus/interact/` | Inject message into standing session |
| `GET` | `/api/v2/thalamus/standing-sessions/` | List standing sessions |
| `POST` | `/api/v2/thalamus/standing-sessions/` | Create standing session |
| `GET` | `/api/v2/thalamus/standing-sessions/{id}/` | Retrieve session details |
