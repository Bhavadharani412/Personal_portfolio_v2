# TalentGraph AI

## Overview

TalentGraph AI is an AI-powered candidate discovery and ranking system developed for the **India Runs × Redrob AI Hackathon**.

The project is designed to help recruiters identify suitable candidates from a dataset of **100,000 candidates** for a Senior AI Engineer role.

It combines candidate data processing, multi-factor scoring, semantic matching, filtering, candidate profiling, anomaly detection, and an interactive recruiter dashboard.

## Problem

Recruiters may need to evaluate a large candidate pool while considering multiple factors simultaneously:

- Skills
- Experience
- Location
- Availability
- Overall suitability

Manually evaluating these factors across 100,000 candidates can make candidate discovery time-consuming and make it difficult to quickly identify suitable profiles.

TalentGraph AI addresses this by processing the candidate dataset and presenting candidates through an interactive ranking and discovery system.

## Core Candidate Ranking

The central component of TalentGraph AI is its multi-factor candidate scoring system.

The system evaluates candidates using factors such as:

```text
Candidate
    ↓
Experience
Skills
Location
Availability
    ↓
Multi-Factor Scoring
    ↓
Candidate Ranking
    ↓
Recruiter Dashboard
````

The ranking system is designed around semantic matching and intelligent scoring rather than relying only on simple keyword search.

## Custom Scoring Weights

Recruiters can adjust scoring weights based on the requirements of a particular role.

For example:

```text
Role A
Skills       → High importance
Experience   → Medium importance
Location     → Low importance


Role B
Experience   → High importance
Availability → High importance
Skills       → Medium importance
```

This allows the ranking system to adapt to different recruitment priorities instead of relying on one fixed scoring configuration.

## Semantic Matching

The system uses semantic matching as part of its candidate-ranking approach.

This allows candidate discovery to consider the relationship between candidate information and role requirements beyond a simple keyword lookup.

Semantic matching is combined with other ranking signals to produce a broader candidate suitability assessment.

## Large-Scale Candidate Dataset

The system works with a dataset containing **100,000 candidates**.

The original candidate data is provided as JSONL:

```text
candidates.jsonl
      ↓
   ingest.py
      ↓
SQLite candidates.db
      ↓
FastAPI Backend
```

The ingestion script processes the candidate dataset and creates the SQLite database used by the application.

## Honeypot Detection

TalentGraph AI also provides a signal for potentially inconsistent candidate profiles.

The system can flag potential honeypot candidates whose histories or candidate information contain subtle inconsistencies that may require additional scrutiny.

This adds another dimension to candidate discovery:

```text
Candidate Data
      ↓
Suitability Ranking
      +
Potential Inconsistency Detection
      ↓
Recruiter Review
```

The honeypot signal is intended as an additional indicator for recruiter review rather than a replacement for human evaluation.

## Recruiter Dashboard

The React dashboard provides an interactive interface for exploring the candidate pool.

It supports:

* Candidate search
* Candidate filtering
* Candidate ranking
* Custom scoring weights
* Candidate profile viewing
* Export functionality
* Recruitment statistics

Candidate information is presented through dedicated candidate-detail components, while dashboard statistics provide an overview of the candidate pool.

## System Architecture

The overall architecture is:

```text
candidates.jsonl
      │
      ▼
   ingest.py
      │
      ▼
 SQLite Database
      │
      ▼
 FastAPI Backend
      │
      ▼
   RAM Cache
      │
      ▼
   REST API
      │
      ▼
 React / Vite Dashboard
      │
 ┌────┼──────────────┐
 ▼    ▼              ▼
Search Filters      Ranking
      │    │          │
      └────┼──────────┘
           ▼
    Candidate Profiles
```

The repository separates the system into backend, frontend, data ingestion, and documentation components.

## Data Flow

The complete system flow is:

```text
100,000 Candidates
        ↓
Data Ingestion
        ↓
SQLite Database
        ↓
FastAPI
        ↓
Candidate Processing
        ↓
Multi-Factor Ranking
        ↓
RAM Cache
        ↓
REST API
        ↓
React Dashboard
        ↓
Recruiter
        ↓
Search / Filter / Rank / Inspect / Export
```

## Backend

The backend is implemented using Python and FastAPI.

Its responsibilities include:

* Loading candidate data
* Providing REST APIs
* Candidate retrieval
* Ranking-related processing
* Serving processed data to the frontend
* Maintaining an in-memory cache

The documented backend structure is:

```text
backend/
├── app/
│   ├── config.py
│   ├── main.py
│   └── services.py
├── scripts/
│   └── ingest.py
├── requirements.txt
└── run.py
```

## Frontend

The frontend is built using React and Vite.

Important components include:

```text
frontend/
└── src/
    ├── components/
    │   ├── CandidateDetail.jsx
    │   ├── CandidateRow.jsx
    │   └── DashboardStats.jsx
    ├── App.jsx
    ├── index.css
    └── main.jsx
```

The frontend communicates with the FastAPI backend through REST endpoints and presents the processed candidate information through the recruiter dashboard.

## Caching

The backend maintains an in-memory RAM cache to support faster access to processed candidate information.

The documented architecture is:

```text
SQLite
   ↓
FastAPI
   ↓
RAM Cache
   ↓
REST API
   ↓
React Dashboard
```

The available project documentation describes the use of in-memory caching but does not document specific cache hit rates, latency measurements, or performance benchmarks.

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Python
* FastAPI
* REST APIs

### Data

* JSONL
* SQLite
* In-memory caching

### AI / Ranking

* Semantic matching
* Multi-factor candidate scoring
* Intelligent ranking
* Candidate anomaly / honeypot flagging

## Engineering Focus

TalentGraph AI combines several engineering concerns into one recruitment-focused system:

* Large-scale candidate data processing
* Data ingestion
* REST API design
* Candidate retrieval
* Multi-factor ranking
* Semantic matching
* Configurable scoring
* Anomaly detection
* In-memory caching
* Interactive data exploration

The project is particularly useful for understanding how an AI-assisted workflow can be connected to a conventional backend and data-processing architecture rather than treating AI as an isolated feature.

## Project Outcome

TalentGraph AI brings together:

* Large-scale candidate data processing
* Intelligent candidate ranking
* Semantic matching
* Anomaly detection
* REST APIs
* In-memory caching
* Interactive React dashboard
* Candidate profiling
* Search and filtering
* Custom scoring
* Export functionality

The main goal is to reduce the effort required to shortlist candidates by turning a large candidate dataset into an interactive, ranked, and recruiter-oriented discovery system.

## Links

* GitHub: [https://github.com/Bhavadharani412/TalentGraph_optimize_recruitment](https://github.com/Bhavadharani412/TalentGraph_optimize_recruitment)

## Grounding Rules

* Treat this file as the source of truth for TalentGraph AI-related chatbot answers.
* The system processes a documented dataset of 100,000 candidates for a Senior AI Engineer role.
* Describe the project as an AI-powered candidate discovery and ranking system.
* Do not claim that the system automatically makes hiring decisions.
* Describe ranking as a recruiter-support mechanism.
* Do not invent ranking accuracy, precision, recall, latency, throughput, or performance benchmarks.
* Do not claim a specific machine-learning model or embedding model unless documented elsewhere.
* Semantic matching is documented, but the available project documentation does not specify the exact semantic-matching implementation.
* Do not claim that honeypot detection definitively identifies fraudulent candidates; describe it as flagging potentially inconsistent histories or profiles for additional scrutiny.
* Do not describe SQLite as a distributed production database.
* Distinguish SQLite persistence from the separate in-memory RAM cache.
* Do not claim that the system processes live recruitment data unless separately documented.
* Do not invent recruiter adoption, hiring outcomes, time savings, or business metrics.
* Distinguish implemented functionality from potential future improvements.
* If a question requires implementation details not documented here, state that the available project documentation does not provide enough information.
