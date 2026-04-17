---
id: occipital-lobe
title: "Occipital Lobe — Seeing the World"
description: "Log parsing, concern filtering, N-way stream correlation, and (coming soon) file-watcher event detection"
slug: /brain-regions/occipital-lobe
---

# Occipital Lobe — Seeing the World

Your occipital lobe is your visual cortex. It sits at the back of your head, right above your neck, and it does something ridiculous: it takes the raw light hitting your eyeballs — just a jumble of brightness and color — and turns it into *seeing*. Faces. Words. A ball flying toward you. A friend waving from across the street. It doesn't decide what to do about any of those things; that's for other parts of the brain. The occipital lobe's job is just to convert raw sensory input into meaningful perception, and to do it fast enough that the rest of you has time to react.

Are-Self's Occipital Lobe (`occipital_lobe/`) does exactly the same thing, just with text instead of light. It takes raw streams — log files pouring out of build tools, output from running processes, eventually file-change events from your disk — and turns them into structured perception. A million lines of log output become a list of `LogEntry` objects with timestamps, severity levels, and metadata. Noisy chatter gets filtered down to just the lines you actually need to see. Multiple log streams from different sources get correlated into a single coherent timeline. And soon, folder changes out in the real world will get converted into signals that fire [Neural Pathways](./central-nervous-system) in the associated [Environment](../ui/environments) — the digital version of spotting movement out of the corner of your eye.

## Reading the Stream

The heart of the occipital lobe today is `log_parser.py`. It defines a tiny, tight data model — `LogEntry` (one moment of perception: a timestamp, a process, a category, a level, a message, plus a raw and a metadata bag) and `LogSession` (a whole viewing: a list of entries plus a `LogStats` accumulator for error counts, warning counts, duration, and format-specific stats like GPU frame counts and cook memory). That's it for the nouns. The verbs live on `LogParserStrategy`, an abstract base class that gives you a stateful streaming parser: feed it a chunk of lines, get back a list of completed entries, call `flush()` at the end to drain the last pending one.

The trick that keeps this useful across totally different log formats is the registry in `LogParserFactory`. Format-specific strategies — Unreal Engine's build logs, Unreal's runtime logs, future parsers for Python tracebacks or cook output — register themselves at module import time with a simple `LogParserFactory.register(LogConstants.TYPE_RUN, UERunLogStrategy)`. Callers just ask for a parser by type key (`LogParserFactory.create(LogConstants.TYPE_RUN, 'local')`) and get back a strategy that knows how to read that particular visual language.

It's the same trick your brain uses for reading. The machinery that turns symbols into meaning is the same whether you're reading English, French, sheet music, or a traffic sign. What changes is the registered decoder for each symbol system. The occipital lobe doesn't have to know Unreal's log format; it just has to know there's a way to ask for one.

This separation is the reason the Unreal log parser used to live inside `ue_tools/` and now has its core generic skeleton in `occipital_lobe/log_parser.py` with the Unreal-specific strategies staying behind in `ue_tools/log_parser.py`. Generic perception moves to the occipital lobe. Unreal-specific decoding stays with the Unreal extraction — on its way to becoming the first [NeuralModifier bundle](./neuroplasticity) at `neuroplasticity/modifier_genome/unreal/`. Core owns the framework; modifiers own the flavor.

## Concerns vs Noise — The Attention Filter

Your visual system is a ruthless attention filter. Every second, it throws away most of what your eyes see. The things it *flags* — motion, faces, a flicker at the edge of your view — are the things evolution decided might matter. Everything else gets backgrounded so you can still think.

`readers.py` does the same thing for log output. It carries two regex catalogs: a `CONCERN_PATTERNS` list of killer signatures (generic `Log\w+:\s+Error:`, fatal lines, C++ compiler errors `error C\d+:`, linker errors `error LNK\d+:`, Python exceptions, "BEWARE:" memory warnings, "Ensure condition failed:" for engine logic breaks) and an `IGNORE_PATTERNS` list of known false positives ("0 Error(s)" from success summaries, the "LogAutomationController:" test noise, "LogAudioCaptureCore:" spam). When `extract_error_blocks()` scans a log, it checks each line against the concerns, then runs a sanity check against the noise list, and only if it's a real concern does it pull the surrounding context — five lines before, ten lines after — into a reported block.

The output is a compact summary of the five most important things the log contained, packaged with enough neighboring context that the [Frontal Lobe](./frontal-lobe) can actually reason about them. That's perception as compression: billions of photons down to the three faces in the room, millions of log lines down to the five things that went wrong and what was happening around each of them.

`read_build_log()` wires this into the [Central Nervous System](./central-nervous-system): give it a SpikeTrain ID and a token budget, and it pulls the failed spike logs, runs the concern filter, and returns a sanitized summary that fits inside whatever context window the current reasoning turn has available. A [Frontal Lobe](./frontal-lobe) session that's about to diagnose a failed build doesn't see the raw logs — it sees the perceptual summary the occipital lobe prepared for it, the same way you see "a cat on the couch," not the raw photon count per retinal cone.

## Binocular Vision — Correlating Streams

You have two eyes. They see almost the same thing, but from slightly different angles. Your brain correlates those two views and builds depth perception — a single 3D scene from two 2D streams. Lose one eye and you can still function, but you lose real distance cues; the world gets a little flatter.

`merge_logs.py` does exactly this with two log streams. You're running a build on your local machine and you're also driving an Unreal agent on a remote host. Both produce logs. Both describe the same build, but from different vantage points — the editor sees what it asked for, the agent sees what actually ran. The two clocks are in the same ballpark but not microsecond-synced, and agent logs drop the milliseconds (HH:MM:SS where the editor gives you HH:MM:SS.nnn). So `merge_logs()` parses both streams through `LogParserFactory`, then does a zipper merge with a `TOLERANCE_SECONDS = 0.1` window: any pair of entries within a tenth of a second of each other gets merged into a single row showing both messages side by side. Depth perception from two log streams.

`merge_logs_nway.py` generalizes that to any number of sources. It uses a heapq to keep all incoming entries in strict chronological order across however many streams you hand it, then clusters entries within the same tolerance window into `MergedRow` objects with per-source columns. Four build agents, five spike logs, the local editor — same idea, more eyes. The `NWayMergeResult` it returns is what the CNS spike forensics view paints on screen: every source is a column, every row is a moment, and you can see the correlated reality across all of them.

## Seeing Change — What's Coming Soon

The occipital lobe today perceives text streams. It doesn't yet perceive the world — meaning the live filesystem on your machine. That's the next capability, and it's the natural extension of the visual-cortex metaphor: your visual system is especially tuned to detect *change*. A flicker in your peripheral vision gets instant attention, even when you can't yet name what moved.

The planned **file-watcher intake** will give Are-Self the same reflex. When a folder tied to an [Environment](../ui/environments) changes — a new file dropped in, an existing file edited, a file deleted — the occipital lobe will see the event and fire a [spike train](./central-nervous-system) through the neural pathway associated with that environment. The watched folders, the kinds of events that matter, and the pathway they route into will all be configured per-environment, so "something changed in my Unreal project's Content folder" and "something changed in my screenplay drafts folder" trigger completely different responses.

This is visual-cortex-style event detection: raw filesystem events come in, the occipital lobe turns them into meaningful perception (was this a save, an add, a delete? is it in a watched folder? what environment owns it?), and the [CNS](./central-nervous-system) takes it from there. It's the last piece that completes the sensory story — the [Peripheral Nervous System](./peripheral-nervous-system) watches the worker fleet, the [Thalamus](./thalamus) watches for human messages, and the Occipital Lobe will watch the world.

When that lands, an artist dropping a texture into their project folder can trigger an auto-import pathway. A dev committing code can trigger a validation pathway. A writer saving a chapter can trigger a review pathway. The brain won't have learned a new trick — it'll have grown a new sense.

## What's Already Built, What's Next

Being honest about the stage: the **generic log parser core is live** (`LogParserStrategy`, `LogParserFactory`, `LogEntry`, `LogSession`, `LogStats`, `merge_sessions`), the **concern-vs-noise reader is live** (`readers.py` with `extract_error_blocks` and `read_build_log`), the **two-way and N-way stream merges are live** (`merge_logs.py`, `merge_logs_nway.py`), and there are **real tests** covering the merge behavior.

What's next is the file-watcher intake — the sensory channel that will route filesystem events into the [CNS](./central-nervous-system). The occipital lobe has no REST API yet and may not grow one; its customers are other brain regions (CNS spike forensics, Frontal Lobe log summarization) that call it as a library, not a network service.

## How It Connects

- **[Central Nervous System](./central-nervous-system)**: The biggest customer. `read_build_log()` pulls a `SpikeTrain`'s failed spike output, runs it through the concern filter, and hands back a token-budgeted summary. The N-way merge powers the multi-source spike forensics view in the UI. When the file-watcher lands, it will fire spike trains on watched-folder events.
- **[Frontal Lobe](./frontal-lobe)**: Indirect customer through the CNS. The reasoning session that's asked "what went wrong with this build?" reads the occipital lobe's summary, not the raw logs. Perception-as-compression keeps the context window focused on what matters.
- **[Environments](../ui/environments)**: The file-watcher will be scoped per-environment. Which folders are watched, which events matter, and which neural pathway fires on a change are all environment-level configuration.
- **[Neuroplasticity](./neuroplasticity)**: Format-specific parser strategies are candidates to ship inside a [NeuralModifier](./neuroplasticity). The Unreal Engine log strategies are the canonical example — they'll ride along in the Unreal bundle at `neuroplasticity/modifier_genome/unreal/` and register themselves with `LogParserFactory` at import time.
- **[Peripheral Nervous System](./peripheral-nervous-system)** and **[Thalamus](./thalamus)**: Sibling sensory channels. PNS watches the Celery worker fleet. Thalamus watches human conversation. Occipital will watch the filesystem. Three different kinds of "what just happened out there."
- **[Synaptic Cleft](./synaptic-cleft)**: File-watcher events, once they land, are a natural fit for neurotransmitter broadcast so UIs can reflect "new file detected" in real time without polling.
