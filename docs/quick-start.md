---
id: quick-start
title: "Install Are-Self"
sidebar_position: 3
---

# Install Are-Self

Welcome. If you can install two programs and double-click a file, you can run
Are-Self on your own computer.

That's the whole promise of this page. No credit card, no cloud account, no
CS degree. You'll install **Ollama** (which lets your computer run AI models
locally) and **Docker Desktop** (which runs the bits of Are-Self that talk to
databases and caches). Then you'll download Are-Self and double-click one
file.

If you've never done any of this before, that's fine. Go slowly. Grab a cup
of tea. The downloads are big and the first run takes a while, but the
installer tells you what it's doing at every step, and if anything goes
sideways there's a troubleshooting section at the bottom.

## Before you start

You'll need:

- A computer with **16 GB of RAM or more** and roughly **30 GB of free
  disk space** (for Docker images, the Ollama models, and Are-Self's own
  data).
- An internet connection for the first install — most of the time is
  spent downloading.
- About **30 to 60 minutes**, mostly waiting.

These instructions are written for **Windows 10 or 11**, because Are-Self
ships a one-click installer (`are-self-install.bat`) for Windows. It runs
just as well on **macOS** and **Linux** — you just have to run the steps
yourself. See the "On a Mac or Linux" section near the bottom.

## Step 1 — Install Ollama and say hello

**Ollama** is a tiny free program that runs AI models on your own machine.
Are-Self uses it for everything — reasoning, embeddings, the whole thing.
You install it first because, once it's running, you can actually use it
as a little helper: open a chat with a local model and paste this page in
if you get stuck. The model can walk you through anything you don't
understand.

### Download and install

Go to [ollama.com/download](https://ollama.com/download) and download the
installer for your operating system. Double-click it and follow the
prompts. On Windows, Ollama installs as a background service and a little
llama icon shows up in your system tray.

### Say hello

Open a terminal. On Windows, press **Windows key + R**, type `cmd`, and hit
Enter — a black window will appear. That's your terminal.

Type this and press Enter:

```bash
ollama run llama3.2
```

The first time you run this, Ollama will download the `llama3.2` model —
it's about 2 GB, so give it a few minutes. When it's done, you'll see a
`>>> Send a message` prompt. Type `hello` and hit Enter.

The model should reply. Congratulations — you have a real AI model running
on your own computer, not anyone else's. Type `/bye` to exit the chat.

:::tip Your new install buddy
From this point on, if anything on this page confuses you, you can open a
terminal, run `ollama run llama3.2` again, paste in the text of the step
you're stuck on, and ask it for help. It won't be perfect, but it's
patient, it's private, and it's yours.
:::

## Step 2 — Install Docker Desktop

**Docker Desktop** is a program that runs little self-contained "containers"
on your computer. Are-Self uses it to run a PostgreSQL database (with a
special vector extension for memory), a Redis cache, and an NGINX web
server — all pre-configured so you don't have to set any of them up by hand.

### Download and install

Go to [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
and download the installer for your operating system. Double-click it and
follow the prompts.

On Windows, Docker may ask to enable WSL 2 (Windows Subsystem for Linux).
Say yes. It may also ask you to restart your computer. Do that.

### Verify Docker is running

After installing, launch **Docker Desktop** from your Start menu. The first
launch takes a minute — you'll know it's ready when the whale icon in your
system tray goes steady and the Docker Desktop window says "Engine running."

To double-check, open a terminal and type:

```bash
docker --version
```

You should see something like `Docker version 27.x.x, build …`. If you do,
you're good.

## Step 3 — Get Are-Self

Are-Self lives in two separate GitHub repositories — one for the backend
brain, one for the frontend interface. You need both, next to each other
in the same parent folder.

### If you know Git

Open a terminal, navigate to wherever you keep your projects, and run:

```bash
git clone https://github.com/scipraxian/are-self-api
git clone https://github.com/scipraxian/are-self-ui
```

You'll end up with two folders side-by-side: `are-self-api` and
`are-self-ui`.

### If you don't know Git

No problem. Go to each of these pages in your browser, click the green
**Code** button, choose **Download ZIP**, and unzip both folders to the
same parent directory:

- [github.com/scipraxian/are-self-api](https://github.com/scipraxian/are-self-api)
- [github.com/scipraxian/are-self-ui](https://github.com/scipraxian/are-self-ui)

Rename the unzipped folders from `are-self-api-main` to `are-self-api` and
from `are-self-ui-main` to `are-self-ui` so the launcher can find them.

## Step 4 — Run the installer (Windows)

Open the `are-self-api` folder and find the file called
**`are-self-install.bat`**. Double-click it.

A terminal window will open and walk itself through ten steps:

1. Creates a Python virtual environment.
2. Installs the Python packages Are-Self needs.
3. Launches Docker Desktop (if it isn't already running) and waits for it.
4. Starts the PostgreSQL, Redis, and NGINX containers.
5. Turns on the `pgvector` extension that Are-Self uses for memory.
6. Runs the database migrations.
7. Checks that Ollama is running and pulls the `nomic-embed-text` embedding
   model that the Hippocampus (memory system) depends on.
8. Loads the starter data — the base identities, tools, and neural
   pathways Are-Self ships with.
9. Creates an admin account with username `admin` and password `admin`.
10. Runs `npm install` inside the sibling `are-self-ui` folder so the
    frontend is ready to launch.

When it prints **INSTALLATION COMPLETE**, you're done. Close that window.

:::note Prerequisites the installer assumes
The installer assumes you have **Python 3.12 or newer** and **Node.js 18
or newer** on your PATH. If you don't, it will error out in step 1 (for
Python) or warn you in step 10 (for Node). Install them from:

- [python.org/downloads](https://www.python.org/downloads/) — check the
  "Add Python to PATH" box during install
- [nodejs.org](https://nodejs.org/) — the LTS build is fine

Then re-run `are-self-install.bat`.
:::

## Step 5 — Launch Are-Self

In the `are-self-api` folder, find **`are-self.bat`** and double-click it.

This starts the Docker containers (if they aren't already), spins up a
Celery worker, starts the Django server, starts the Vite dev server for
the UI, and opens your browser to Are-Self automatically.

You should see the 3D brain landing page at
[http://localhost:5173](http://localhost:5173) within about 10 seconds. The
admin backend is at [http://localhost:8000/admin](http://localhost:8000/admin)
— log in with `admin` / `admin` if you ever need to poke around the raw
database.

**That's it. Are-Self is installed and running.**

Next up: open [the Getting Started guide](./getting-started) for a
guided first hour — create an environment, design an identity, and watch
a reasoning session happen in real time.

## On a Mac or Linux

The `are-self-install.bat` and `are-self.bat` scripts are Windows-only,
but every step they do works fine on macOS and Linux. You just run each
step by hand. Here's the equivalent sequence:

```bash
# Install Ollama, Docker Desktop, Python 3.12+, and Node 18+ first
# (use brew on macOS, apt/dnf on Linux)

# 1. Get the code
git clone https://github.com/scipraxian/are-self-api
git clone https://github.com/scipraxian/are-self-ui

# 2. Backend setup
cd are-self-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Start the infra containers (Postgres, Redis, NGINX)
docker compose up -d

# 4. Enable pgvector inside the Postgres container
docker exec -i are_self_db psql -U postgres -d postgres \
  -c "CREATE EXTENSION IF NOT EXISTS vector;"

# 5. Run migrations
python manage.py migrate

# 6. Pull the embedding model (Ollama must be running)
ollama pull nomic-embed-text

# 7. Load starter data
python manage.py loaddata genetic_immutables.json
python manage.py loaddata zygote.json
python manage.py loaddata initial_phenotypes.json

# 8. Create the admin account
DJANGO_SUPERUSER_USERNAME=admin \
DJANGO_SUPERUSER_EMAIL=admin@are-self.com \
DJANGO_SUPERUSER_PASSWORD=admin \
python manage.py createsuperuser --noinput

# 9. Frontend setup
cd ../are-self-ui
npm install
```

To run Are-Self after installing, you'll need three terminals open in the
`are-self-api` folder:

```bash
# Terminal 1 — Celery worker
source venv/bin/activate
celery -A config worker --loglevel=info --concurrency=4 -P threads -E

# Terminal 2 — Django server
source venv/bin/activate
python manage.py runserver

# Terminal 3 — Vite dev server (from are-self-ui)
cd ../are-self-ui
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Troubleshooting

### The installer says "Python is not recognized"

Python isn't installed, or it isn't on your PATH. Install it from
[python.org/downloads](https://www.python.org/downloads/), make sure to
check the **"Add Python to PATH"** box during installation, and re-run
`are-self-install.bat`.

### The installer says "Docker is not running"

Launch **Docker Desktop** from your Start menu and wait until the whale
icon in your system tray is steady. Then re-run `are-self-install.bat`.

### The installer hangs on "Waiting for Ollama daemon"

Ollama may not have started yet. On Windows, make sure the llama icon in
your system tray is present. If it's missing, launch Ollama from your
Start menu. The installer will pick up once Ollama answers.

### The browser opens but shows "Unable to connect"

The Vite dev server takes a few seconds to warm up. Give it 10 seconds and
refresh. If it still doesn't load, check the **Are-Self Django Server**
window for error messages.

### "Port 80 is already in use"

Something else on your computer (often Skype or IIS on Windows) is holding
port 80, which NGINX wants for the reverse proxy. Are-Self still works
without NGINX — you'll reach the UI at
[http://localhost:5173](http://localhost:5173) directly instead of through
`http://local.are-self.com`. If you want NGINX anyway, stop whatever is
holding port 80, or edit `docker-compose.yml` to map NGINX to a different
port.

### Memory forming isn't working

The Hippocampus needs the `nomic-embed-text` model. Run `ollama list` from
a terminal — you should see `nomic-embed-text` in the list. If you don't,
run `ollama pull nomic-embed-text` and restart `are-self.bat`.

### Something else broke and I don't know what

Open a new terminal, run `ollama run llama3.2`, paste in the error message
you saw, and ask the model what to do. It often knows. If it doesn't, file
an issue at
[github.com/scipraxian/are-self-api/issues](https://github.com/scipraxian/are-self-api/issues)
with the text of the error and we'll take a look.

## What's next

Now that Are-Self is running:

- [Getting Started](./getting-started) — a guided first hour, from empty
  system to watching an AI persona reason through a task.
- [Architecture Overview](./architecture) — how the brain regions connect
  and why the tick cycle is shaped the way it is.
- [UI Walkthroughs](./ui/blood-brain-barrier) — page-by-page tour of the
  interface.
- [OpenRouter](./openrouter) — optional: plug in a cloud model as
  failover for jobs your local hardware can't handle.
