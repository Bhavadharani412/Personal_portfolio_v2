# WebTrack

## Overview

WebTrack is a privacy-first Chrome extension designed to help users understand their actual active web usage and maintain better browser hygiene.

Instead of measuring how long Chrome is open, WebTrack tracks browsing time only when the user is actively using a webpage. It also categorizes websites, provides daily and weekly usage reports, and identifies inactive tabs that may be suitable for cleanup.

The project is built with Chrome Manifest V3 and vanilla JavaScript, with usage data stored locally in the browser.

## Problem

People can spend significant amounts of time browsing the web without having a clear understanding of where their active browsing time goes. Long browsing sessions can also result in large numbers of unused browser tabs.

WebTrack addresses both problems through:

- Active browsing-time tracking
- Website categorization
- Daily and weekly usage analytics
- Inactive-tab detection
- User-controlled tab cleanup
- Local-first, privacy-focused data storage

## Core Tracking System

WebTrack uses an event-driven approach rather than relying on a continuously running timer.

The tracking state is modeled as:

```text
INACTIVE
   ↓
TRACKING
   ↓
PAUSED
   ↓
TRACKING / INACTIVE
````

Tracking begins when the required conditions are satisfied, such as the browser window being focused and the tab being active.

Tracking pauses when the user:

* Switches to another tab
* Moves to another application or window
* Becomes idle
* Leaves the relevant browsing state

Elapsed active time is calculated using timestamps and accumulated usage is persisted locally.

This design is particularly important for Manifest V3 because the background service worker is not guaranteed to remain continuously active.

## Website Classification

WebTrack does not treat every individual URL as a separate website.

The classification pipeline is:

```text
URL
 ↓
Domain Normalization
 ↓
Site Rules
 ↓
Classification
 ↓
Website / Category / Page Type
```

This allows related pages from the same service to contribute to the same website-level usage statistics instead of appearing as unrelated URLs.

The classification system includes:

* Domain normalization
* Website-specific rules
* Page-type identification
* Fallback handling for unknown websites

## Daily Usage Dashboard

The extension provides a daily view of browsing activity containing:

* Total active browsing time
* Most-used websites
* Usage breakdowns
* Visual usage bars
* Number of inactive tabs

The dashboard provides an overview of browsing activity without requiring an external account or service.

## Weekly Reports

WebTrack aggregates usage into a weekly dashboard containing:

* Total weekly active time
* Daily average
* Daily usage visualization
* Top websites
* Week-over-week changes
* Usage insights
* Tab-hygiene statistics

The insights describe usage patterns rather than judging the user's behavior.

## Intelligent Tab Cleanup

WebTrack identifies tabs that have remained inactive beyond a configurable threshold and presents them as cleanup suggestions.

The extension does not automatically close tabs.

```text
Inactive Tabs
     ↓
Cleanup Suggestions
     ↓
User Reviews
     ↓
Keep / Close
```

Certain tabs are protected from cleanup:

* Pinned tabs
* Tabs currently playing audio
* Whitelisted or protected domains

Previous keep/close decisions are also stored by domain so that the cleanup system can become less repetitive.

## Privacy Architecture

Privacy is a central part of WebTrack.

The current design does not use:

* A backend server
* User accounts
* Analytics
* Telemetry
* Browsing-history uploads
* Page-content collection

Usage information is stored locally using:

```text
chrome.storage.local
```

The system stores the information required for usage analysis rather than sending browsing information to an external service.

## Architecture

```text
Chrome Browser Events
        ↓
   Service Worker
        ↓
 ┌──────┼─────────┐
 ↓      ↓         ↓
Tracker  Tab      Idle
         Manager  Manager
        ↓
  Classification
        ↓
   Aggregation
        ↓
   Local Storage
        ↓
 ┌───────────────┐
 ↓               ↓
Popup         Dashboard
```

### Main Components

| Component              | Responsibility                                       |
| ---------------------- | ---------------------------------------------------- |
| `service-worker.js`    | Coordinates browser events and application messaging |
| `tracker.js`           | Handles active-time tracking and state transitions   |
| `tab-manager.js`       | Handles tab activity and inactivity                  |
| `idle-manager.js`      | Handles browser/user idle states                     |
| `aggregation.js`       | Handles usage aggregation and periodic persistence   |
| `classifier.js`        | Classifies URLs and websites                         |
| `domain-normalizer.js` | Normalizes domains                                   |
| `site-rules.js`        | Contains website-specific classification rules       |
| `storage.js`           | Handles local data persistence                       |
| `popup/`               | Provides the daily usage interface                   |
| `dashboard/`           | Provides reports and settings                        |
| `cleanup/`             | Handles inactive-tab review and cleanup              |

## Technology Stack

### Extension

* JavaScript
* ES Modules
* HTML
* CSS
* Chrome Manifest V3

### Chrome APIs

* `chrome.tabs`
* `chrome.windows`
* `chrome.idle`
* `chrome.alarms`
* `chrome.storage.local`

### Engineering Concepts

* Event-driven architecture
* Service-worker-based background processing
* State-machine-based tracking
* Local-first data persistence
* Data aggregation
* Website classification
* Browser automation

## Engineering Focus

WebTrack was built as an exploration of how browser events, state transitions, data aggregation, classification, and local persistence can work together inside a Manifest V3 extension.

The main engineering challenge was defining **active browsing time** correctly rather than treating browser uptime as usage time.

The project also demonstrates a product decision around privacy: usage analysis is performed locally without requiring accounts, telemetry, or uploading browsing history.

## Key Engineering Ideas

* Event-driven tracking instead of continuous timers
* Explicit state transitions for active/inactive browsing
* Timestamp-based duration calculation
* Domain normalization and rule-based classification
* Local-first persistence
* Aggregation of raw activity into useful reports
* User-controlled automation instead of automatic tab deletion
* Privacy-conscious browser architecture

## Links

* GitHub: [https://github.com/Bhavadharani412/Web-Usage-Tracker](https://github.com/Bhavadharani412/Web-Usage-Tracker)
* Article: [https://projects-explained.hashnode.dev/webtrack-building-a-privacy-first-active-web-usage-tracker-with-chrome-manifest-v3](https://projects-explained.hashnode.dev/webtrack-building-a-privacy-first-active-web-usage-tracker-with-chrome-manifest-v3)

## Grounding Rules

* Treat this file as the source of truth for WebTrack-related chatbot answers.
* Do not claim that WebTrack has a backend, user accounts, telemetry, or remote browsing-history storage.
* Do not describe tab cleanup as automatic; cleanup is suggestion-based and user-controlled.
* Do not claim that every URL is tracked as a separate website; classification normalizes and groups websites.
* Do not invent performance metrics, user counts, adoption numbers, or benchmarks.
* Distinguish implemented functionality from possible future improvements.
* If a question requires implementation details not documented here, state that the available project documentation does not provide enough information.
