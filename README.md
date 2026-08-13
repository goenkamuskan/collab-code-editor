# CollabCode

A real-time collaborative code editor with live cursors, multi-file rooms, and in-browser code execution.

## Features

- Real-time collaborative editing powered by CRDTs (Yjs) — multiple people can type in the same file simultaneously with no conflicts
- Live cursor and selection presence — see exactly where collaborators are working
- Multi-file rooms with a file sidebar, each file independently synced
- In-browser code execution (Python, JavaScript, C++, Java) via a self-hosted Piston sandbox
- Email/password authentication and persistent rooms via Supabase

## Tech stack

**Frontend:** React, Vite, Tailwind CSS, Monaco Editor, Yjs
**Backend:** Node.js, Hocuspocus (WebSocket server for Yjs sync)
**Code execution:** Self-hosted [Piston](https://github.com/engineer-man/piston), proxied through an Express server
**Auth & data:** Supabase (Postgres, Auth, Row Level Security)
**Deployment:** Railway (backend + execution engine), Vercel (frontend)

## Architecture

- The frontend connects to a Hocuspocus WebSocket server; each browser tab holds a local Yjs document that syncs deltas over the socket.
- Each file in a room is its own `Y.Text`, all stored inside a shared `Y.Map`, so switching files or adding new ones doesn't require a page reload or separate room.
- Presence (cursors, names, colors) is broadcast via Yjs Awareness and rendered by `y-monaco`.
- Code execution calls a self-hosted Piston instance through a small Express proxy — Piston has no CORS support, so the browser can't call it directly.
- Rooms and users are managed through Supabase, with Row Level Security controlling who can create or view rooms.

## Running locally

```bash
# Backend
cd backend
npm install
npm start          # Hocuspocus server (ws://localhost:1234)
node piston-proxy.js   # Piston proxy (http://localhost:3001)

# Piston (separate terminal, requires Docker)
docker run -d --name piston_api -p 2000:2000 -v piston_data:/piston --privileged ghcr.io/engineer-man/piston

# Frontend
cd frontend
npm install
npm run dev
```

## Live demo

[link once deployed]

## What I'd build next

- Persistent file storage (currently in-memory per session)
- Room permissions / invite-only rooms
- More languages for execution