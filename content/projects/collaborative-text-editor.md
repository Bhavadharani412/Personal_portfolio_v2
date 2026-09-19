# Collaborative Text Editor

## Overview

Collaborative Text Editor is a real-time, multi-user document editor inspired by Google Docs.

The project was built to explore how collaborative applications handle simultaneous editing, distributed document state, synchronization, offline editing, and consistent state across multiple clients.

It combines rich-text editing with Yjs CRDTs, WebSockets, live collaborator presence, offline persistence, document management, and document export.

## Problem

Traditional text editors are primarily designed around a single user's document state.

Allowing multiple users to edit the same document simultaneously introduces additional engineering challenges:

- Concurrent edits
- Document synchronization
- Conflict handling
- Maintaining consistent state across clients
- Offline editing
- Real-time collaborator presence
- Persistence and document management

The project addresses these challenges by allowing each client to maintain a local representation of the shared document and synchronize changes using Yjs CRDTs and WebSockets.

## Core Collaboration Flow

A user edit travels through the system as:

```text
User Types
    ↓
Quill Editor
    ↓
Quill text-change Event
    ↓
Yjs Shared Document
    ↓
CRDT Update
    ↓
WebSocket
    ↓
Node.js Server
    ↓
Other Connected Clients
    ↓
Yjs Applies Update
    ↓
Quill Renders Change