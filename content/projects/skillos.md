# SkillOS

## Overview

SkillOS is a personal learning operating system designed around long-term skill development and learning management.

The project evolved through three versions because each implementation exposed a different limitation:

```text
V1 — CLI
Simple + Focused
        ↓
Limited Flexibility
        ↓
V2 — Web
Flexible + Extensible
        ↓
Learning Scope Became Less Focused
        ↓
V3 — Android
Focused + Flexible
````

Rather than treating the project as a simple platform migration, each version was used to address a product or engineering limitation discovered in the previous implementation.

## Problem

Managing long-term learning requires more than maintaining a list of topics.

A useful learning system needs to support:

* Planning
* Execution
* Progress tracking
* Reflection
* Study-time tracking
* Learning resources
* Notes
* Goals
* Analytics

The project explored how to build such a system while keeping the learning workflow focused instead of allowing the product to become a generic productivity application.

---

# V1 — Student Operating System

## Overview

The first version was a terminal-based Student Operating System built with Rust and Ratatui.

The goal was to create a simple, distraction-free environment for managing study sessions and daily productivity.

It focused on:

* Study-session planning
* Countdown timers
* Progress tracking
* Daily streaks
* Daily reflection
* Journaling
* Markdown journal export
* Keyboard-first interaction

The system was intentionally minimal and focused on execution rather than feature complexity.

## V1 Architecture

The terminal application was built around:

* Application state
* Terminal UI rendering
* Timers
* Keyboard interaction
* Local persistence

The keyboard-first interface was designed to keep interaction efficient and reduce unnecessary distractions during study sessions.

## V1 Limitation

The terminal approach provided focus and simplicity, but it became restrictive for a larger learning-management system.

The CLI limited:

* UI flexibility
* Visual organization
* Navigation
* Data presentation
* Expansion into a broader learning-management experience

This motivated the transition to a web implementation.

---

# V2 — Web Version

## Overview

V2 moved the core concept from the terminal into a web application.

The web platform provided greater flexibility for designing the interface and organizing information.

Compared with the CLI, the web version improved:

* UI flexibility
* Visual presentation
* Navigation
* Information organization
* Interaction possibilities
* Extensibility

The browser environment made it easier to experiment with broader learning and productivity workflows.

## V2 Limitation

The increased flexibility introduced a different problem.

The original learning-focused scope became less clear.

The system had started as a focused Student Operating System, but the web version could expand in many directions.

The resulting product had:

```text
More Flexibility
      ↓
More Possibilities
      ↓
Less Defined Scope
      ↓
Learning Workflow Becomes Less Focused
```

At this stage, the primary challenge was no longer only technical.

It became a product-design problem:

**How can the system remain flexible without losing its core purpose?**

This motivated the transition to a dedicated native application.

---

# V3 — SkillOS Android Application

## Overview

V3 restructured SkillOS as a native Android personal learning operating system.

The goal was to combine the strengths of the previous versions:

```text
V1
Focused + Structured

        +

V2
Flexible + Extensible

        ↓

V3
Focused + Flexible
```

The application is designed specifically around long-term skill development and learning management rather than general productivity.

---

# Core Learning Structure

SkillOS organizes learning through a hierarchical model:

```text
Plan
  ↓
Category
  ↓
Subject
  ↓
Topic
  ↓
Learning Session
```

This structure provides a defined learning scope while still allowing complex learning plans to be represented.

## Learning Management

The application supports:

* Learning plans
* Categories
* Subjects
* Topics
* Skills
* Learning resources
* Notes
* Study sessions
* Time-based goals
* Progress tracking
* Learning analytics

---

# Focused Study Sessions

Study sessions connect actual time spent learning with specific topics.

The workflow is:

```text
Topic
  ↓
Start Session
  ↓
Study
  ↓
Pause / Resume
  ↓
Complete
  ↓
Recorded Learning Time
```

This preserves the execution-oriented philosophy of V1 while providing a richer learning-management system around it.

The system therefore connects planning with actual execution:

```text
Learning Plan
     ↓
Learning Topic
     ↓
Study Session
     ↓
Recorded Time
     ↓
Progress
     ↓
Analytics
```

---

# Offline-First Architecture

V3 introduces a stronger local persistence architecture using Room.

The main data flow is:

```text
Compose UI
    ↓
ViewModel
    ↓
Repository
    ↓
DAO
    ↓
Room Database
```

The offline-first approach allows the core learning workflow and data management to remain available without depending on network connectivity.

This architecture also separates responsibilities between:

* UI
* State management
* Repository logic
* Database access
* Local persistence

---

# Android Architecture

The V3 application follows an MVVM-oriented architecture.

```text
Jetpack Compose UI
        ↓
    ViewModel
        ↓
   Repository
        ↓
       DAO
        ↓
  Room Database
```

### UI Layer

Jetpack Compose provides the native Android interface.

### ViewModel Layer

ViewModels manage application state between the UI and underlying data operations.

### Repository Layer

The repository acts as the data-access boundary between application logic and persistence.

### DAO Layer

The Data Access Object layer provides database operations.

### Database Layer

Room provides local structured persistence for the learning system.

---

# Technology Evolution

## V1

* Rust
* Ratatui
* Crossterm
* Chrono

## V2

* Web-based implementation

## V3

* Kotlin
* Jetpack Compose
* Room
* MVVM
* StateFlow
* Coroutines

---

# Version Evolution

| Version      | Main Strength                               | Main Limitation                    | Reason for Next Version                 |
| ------------ | ------------------------------------------- | ---------------------------------- | --------------------------------------- |
| V1 — CLI     | Simple, focused, distraction-free           | Limited flexibility                | Need richer interaction and UI          |
| V2 — Web     | Highly flexible and extensible              | Learning scope became less focused | Need flexibility without losing purpose |
| V3 — Android | Focused learning scope + flexible native UI | —                                  | Combines the strengths of V1 and V2     |

The evolution is therefore driven by limitations discovered during implementation rather than by changing technology for its own sake.

---

# Product Evolution

The product direction can be summarized as:

```text
V1
"Help me execute my study plan."

        ↓

V2
"Make the system more flexible."

        ↓

V3
"Build a focused system that lets me
plan, execute, track, and improve learning."
```

SkillOS V3 therefore represents a product evolution rather than simply:

```text
CLI → Web → Android
```

Each version changed the product in response to a limitation discovered in the previous implementation.

---

# Engineering Focus

SkillOS explores several areas of software engineering:

* Product evolution
* Native application architecture
* Local persistence
* Offline-first systems
* MVVM architecture
* State management
* Repository patterns
* Database access
* Study-session tracking
* Time-based workflows
* Progress tracking
* Learning analytics
* Keyboard-first interaction
* Product scope and feature focus

One of the most important lessons from the project is that increasing technical flexibility does not automatically produce a better product.

The V2 experience demonstrated that additional flexibility can also increase product scope and weaken the original workflow.

V3 therefore focuses on preserving a clear product purpose while retaining enough flexibility for structured learning management.

---

# Final Product Direction

The final direction combines:

```text
V1
Simplicity
+
Focus
+
Execution

        +

V2
Flexibility
+
Extensibility

        ↓

V3
Structured Learning
+
Native UI
+
Offline Persistence
+
Study-Time Tracking
+
Goals
+
Resources
+
Notes
+
Progress
+
Analytics
```

The result is a focused personal learning operating system intended to support the complete learning workflow:

```text
Plan
  ↓
Learn
  ↓
Track
  ↓
Reflect
  ↓
Improve
```

---

# Project Outcome

SkillOS demonstrates how a software project can evolve through repeated implementation rather than attempting to design the final product in a single iteration.

The project progressed from:

* A focused terminal productivity tool
* To a flexible web application
* To a structured native learning operating system

The most important engineering outcome is the connection between technical implementation and product learning.

Each version exposed a different limitation:

```text
V1
Technical / Interaction Limitation

        ↓

V2
Product Scope Limitation

        ↓

V3
Focused Product + Native Architecture
```

The final direction combines the simplicity and focus of the terminal version with the flexibility of the web version while adding structured learning management, persistent local data, study-time tracking, goals, resources, notes, progress tracking, and analytics.

## Links

* GitHub: Not documented in the available SkillOS source material.
* Live: Not documented in the available SkillOS source material.
* Article: [https://projects-explained.hashnode.dev/building-study-system-101-a-rust-powered-terminal-productivity-os-for-deep-evening-execution](https://projects-explained.hashnode.dev/building-study-system-101-a-rust-powered-terminal-productivity-os-for-deep-evening-execution)

## Grounding Rules

* Treat this file as the source of truth for SkillOS-related chatbot answers.
* SkillOS evolved through three documented versions: CLI, Web, and Android.
* Do not describe V1, V2, and V3 as separate unrelated projects; they represent iterations of the same product direction.
* Do not claim that the Android version is simply a platform migration; the documented evolution includes changes in product scope and architecture.
* V1 should be described as a Rust and Ratatui terminal-based Student Operating System.
* V1 functionality includes study-session planning, countdown timers, progress tracking, daily streaks, daily reflection, journaling, Markdown journal export, and keyboard-first interaction.
* V2 should be described as a web implementation that increased flexibility and extensibility but weakened the original learning-focused scope.
* V3 should be described as a native Android personal learning operating system.
* The documented V3 hierarchy is Plan → Category → Subject → Topic → Learning Session.
* Do not invent additional entities or relationships beyond the documented learning structure.
* The documented V3 persistence architecture is Compose UI → ViewModel → Repository → DAO → Room Database.
* Describe V3 as offline-first based on the documented Room architecture.
* Do not claim cloud synchronization or online collaboration unless separately documented.
* Do not invent performance, user-count, adoption, productivity, learning-outcome, or retention metrics.
* Do not claim that SkillOS uses a backend or remote database unless separately documented.
* Distinguish documented implemented functionality from possible future features.
* If a question requires implementation details not documented here, state that the available project documentation does not provide enough information.
