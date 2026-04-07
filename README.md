<div align="center">

# IronSync ERP

**A specialized ERP platform for small machining shops — built for precision, speed, and operational control.**

![Status](https://img.shields.io/badge/status-active%20development-blue?style=flat-square)
![Version](https://img.shields.io/badge/version-2.0-informational?style=flat-square)
![License](https://img.shields.io/badge/license-proprietary-red?style=flat-square)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20NestJS%20%7C%20PostgreSQL-informational?style=flat-square)
![Monorepo](https://img.shields.io/badge/monorepo-TurboRepo-blueviolet?style=flat-square)

</div>

---

## Overview

IronSync ERP is a modular management system designed specifically for small machining and metalworking companies. It addresses a critical gap in the market: existing ERP solutions are either too generic, too expensive, or too complex for businesses in this sector.

The platform centralizes operations that are typically managed through fragmented manual processes — eliminating spreadsheet dependencies, reducing calculation errors, and giving managers real-time visibility over production, inventory, and budget workflows.

The project was originally developed as an academic work at Faculdade de Tecnologia de Tatuí (FATEC Tatuí) and is currently evolving into its second version, incorporating multi-tenant support and more granular production tracking capabilities.

---

## Problem

Small machining shops face a recurring set of operational challenges that manual processes cannot sustainably solve:

- Fragmented information across departments with no unified view of operations
- Material calculation errors that directly impact production costs and profit margins
- Missed deadlines caused by lack of visibility into job and order progress
- Excessive management time spent on spreadsheet maintenance instead of operations
- Difficulty scaling workflows as production volume increases

As companies grow, these problems compound. Manual methods that worked at smaller scale become a hard ceiling on business expansion.

---

## Solution

IronSync ERP provides only what machining shops actually need — no unnecessary modules, no steep learning curve, no months-long onboarding process.

The system covers the full operational cycle: from customer registration and budget creation through parts and tooling control, operation tracking, and service order execution. Each module is designed around the real workflows of metalworking operations.

---

## Target Market

The initial focus is on small machining and metalworking companies with up to 20 employees that have already recognized the limitations of manual processes and are actively seeking a solution. This segment is underserved by both large-scale generic ERPs (too complex and expensive) and basic tools (too limited to handle production workflows).

---

## Functional Requirements

### Customer and Company Management
- Full customer registration including corporate data, contact, and address
- Customer listing, editing, and removal
- Company registration screen enabling multi-tenant support *(v2)*

### Materials and Tooling
- Material registration with technical specifications, supplier, and pricing
- Tool registration and association with parts and operations
- Inventory listing and editing

### Operations and Production
- Operation registration with name, description, and hourly rate
- Association of operations to parts through relational mapping
- Parts registration including material, weight, quantity, and linked operations

### Budget Management
- Budget creation linked to customers, tools, and operations
- Detailed cost breakdown per budget item
- PDF export of budgets
- Service order generation from approved budgets *(v2)*

### Service Orders *(v2)*
- Service order creation from accepted budget items
- Employee assignment to service orders for traceability
- Employee-facing execution interface for real-time order tracking
- Machine time tracking per employee and operation

### Employee Management *(v2)*
- Employee registration and profile management
- Role-based assignment to service orders
- Execution history and traceability per employee

---

## Non-Functional Requirements

- **Usability:** Intuitive interface accessible to users with limited ERP experience
- **Security:** Data protection via authentication and access control
- **Scalability:** Modular architecture allowing new features to be added incrementally
- **Performance:** System queries processed in under 2 seconds
- **Multi-tenancy:** Company-level data isolation to support multiple organizations *(v2)*

---

## Features Deferred to Future Phases

- Direct CNC machine integration for automated production monitoring
- Native mobile application for remote access
- AI-powered predictive analysis for demand forecasting and inventory optimization
- Advanced custom report builder for end users

---

## Competitive Positioning

IronSync competes against three types of alternatives:

**Large generic ERPs** (e.g., SAP Business One, TOTVS, Senior) are built for multiple industries, resulting in high complexity, long onboarding periods, and features irrelevant to machining operations — at a significantly higher cost. IronSync focuses exclusively on the workflows that metalworking businesses actually use, enabling onboarding in days rather than months.

**Spreadsheets and manual methods** are the current default for most small shops. They work at low volume but break down under growth, creating the exact bottlenecks IronSync is designed to eliminate.

**Generic small-business software** covers basic accounting and inventory but lacks domain-specific workflows such as operation sequencing, job-order management, and parts-based cost estimation.

---

## Architecture

The system is built using a **monorepo architecture**, allowing the frontend, backend, and shared packages to coexist in a single repository with clearly defined boundaries.

### Architectural Principles

- Modular monolith with domain-driven backend structure
- Clear separation of concerns across layers
- Reusable shared packages (types, utilities, configs)
- Scalable folder and code organization
- Incremental evolution towards microservices if needed

### Backend Structure

```
Domain-driven modules (users, orders, inventory, budgets, ...)
└── Layered architecture
    ├── Controllers  → HTTP layer
    ├── Services     → Business logic
    └── Repositories → Data access (via Prisma ORM)
```

### Frontend Structure

```
Feature-based organization
├── API consumption layer (services)
├── Reusable UI components
└── Scalable routing (App Router)
```

---

## Technology Stack

| Layer        | Technology                                |
|--------------|-------------------------------------------|
| **Frontend** | Next.js (App Router) + TypeScript + Axios |
| **Backend**  | NestJS + TypeScript + Prisma ORM          |
| **Database** | PostgreSQL (via Supabase)                 |
| **Monorepo** | TurboRepo + npm Workspaces                |
| **Config**   | Environment-based configuration           |

> The first version of the system was built with Laravel (PHP 11.x), React 18.x, and MySQL. The current version adopts a TypeScript-first stack across frontend and backend.

---

## Development Methodology

The project follows an agile workflow inspired by Scrum, with weekly sprints, incremental feature delivery, and continuous refactoring. Version control is managed via Git with trunk-based development and Conventional Commits for a consistent and readable history.

- **Trunk-based development** — `main` branch + short-lived feature branches
- **Conventional Commits** — clear and consistent version history
- Continuous refactoring and improvement
- Focus on maintainability and readability

---

## Scalability Strategy

### Phase 1 — Initial Growth
- Modular monolith architecture
- Query optimization and strategic indexing
- Redis caching layer for frequently accessed data

### Phase 2 — Expansion
- Migration of high-write components to dedicated relational database instances
- Read replicas for analytics queries
- Microservices for resource-intensive features (cost estimation, report generation)
- Message queues for asynchronous processing

### Phase 3 — Scale
- Full microservices architecture across production, inventory, CRM, and analytics domains
- Container orchestration with Kubernetes
- Multi-region deployment for reliability and latency
- Dedicated data warehouse for business intelligence

---

## Deployment Strategy

Each component is deployed independently:

| Component    | Deployment                             |
|--------------|----------------------------------------|
| **Frontend** | Web application (Vercel / custom)      |
| **Backend**  | API service (Railway / Docker / cloud) |
| **Database** | Managed PostgreSQL via Supabase        |

> The architecture supports **continuous deployment** and **independent scaling** of all components.

---

## Roadmap

- [ ] Customer and contact management
- [ ] Materials and tooling registration
- [ ] Operations management
- [ ] Budget creation and PDF export
- [ ] Company registration and multi-tenant support *(v2)*
- [ ] Service order management from approved budgets *(v2)*
- [ ] Employee registration and assignment *(v2)*
- [ ] Employee-facing service order execution interface *(v2)*
- [ ] Machine time tracking per operation and employee *(v2)*
- [ ] CNC machine integration *(future)*
- [ ] Mobile application *(future)*
- [ ] AI-powered predictive analysis *(future)*

---

## Academic Context

This project was originally developed as a graduation work (*Trabalho de Graduação*) at **Faculdade de Tecnologia de Tatuí — FATEC Tatuí**, under the Technology in Systems Analysis and Development program, with guidance from Prof. Me. Rafael de Sá Mascarenhas.

**Authors:** Caique Martins dos Santos, Gustavo Ferreira Cordeiro, João Gabriel de Moura Franco, Joaquim André.

---

## Disclaimer

This project is currently under **active development**. It is being built following production-level standards with the intention of evolving into a commercially available platform for the machining and metalworking industry.

---

<div align="center">

*Transforming machining operations — one workflow at a time.*

</div>
