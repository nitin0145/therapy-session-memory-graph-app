# Therapy Session Memory Graph - Interview Handover Document

This document serves as a comprehensive guide to the project, specifically designed for technical interviews. It explains the architecture, the technology choices, and the reasoning behind them.

## 1. Project Overview
The **Therapy Session Memory Graph** is a full-stack web application designed for therapists. It allows them to log unstructured therapy session notes (transcripts) and uses AI to automatically extract key entities (Emotions, Medications, People, Risk Flags). These entities are then visualized in an interactive, drag-and-drop neural tree graph to help the therapist track patient progress over time.

---

## 2. Tech Stack & Justifications (The "Why")

### Frontend & Framework
* **Next.js (App Router, v15)**
  * *Why:* Next.js provides a unified full-stack environment. We use Server Components (RSC) for the dashboard to fetch database records directly, resulting in zero client-side loading spinners and excellent performance. API Routes allow us to securely hide the OpenAI API keys from the frontend.
* **React Flow (`@xyflow/react`)**
  * *Why:* We needed a highly interactive canvas to visualize cognitive patterns. React Flow provides out-of-the-box support for draggable nodes, zoom/pan controls, and customizable SVG edges.
* **Tailwind CSS & Shadcn/UI Concepts**
  * *Why:* For rapid UI development. Tailwind allows us to build a premium, modern SaaS aesthetic without maintaining bulky CSS files. We use custom utility classes to dynamically color-code graph nodes based on memory types (e.g., Purple for Medication, Red for Risk Flags).

### Backend & Database
* **PostgreSQL (via Neon Serverless)**
  * *Why:* The data is inherently relational (A `Patient` has many `Sessions`, a `Session` has many `Memories`). A SQL database enforces strict schemas and foreign-key constraints, ensuring data integrity compared to NoSQL. Neon provides serverless scalability, meaning the DB sleeps when not in use and scales instantly.
* **Prisma ORM**
  * *Why:* Prisma offers end-to-end type safety. When we query `prisma.patient.findMany()`, TypeScript instantly knows the exact shape of the returned data. It also makes schema migrations incredibly simple.

### Artificial Intelligence
* **OpenAI API (GPT-4o)**
  * *Why:* Traditional Regex or NLP models struggle to extract context from messy, conversational transcripts. By using LLMs with a strictly enforced `JSON Object` response format, we can reliably parse emotions, people, and risks from unstructured speech.
  * *Graceful Degradation (Mock Fallback):* We implemented a `try/catch` fallback mechanism. If the OpenAI API key runs out of quota or fails, the system automatically injects realistic mock data. This ensures the frontend UI pipeline never breaks during testing or demos.

---

## 3. Data Flow Architecture

1. **Input:** The therapist submits a raw text transcript via the UI.
2. **API Route (`/api/analyze`):** The frontend sends the text to the Next.js server.
3. **AI Processing:** The server sends a system prompt and the transcript to OpenAI, asking it to return a JSON array of specific memory categories.
4. **Database Storage:** The parsed JSON is mapped to Prisma models and saved into PostgreSQL (`TherapySession` and `MemoryEntity` tables).
5. **Visualization:** The frontend fetches the session data. The `memory-graph.tsx` component iterates through the data and calculates X/Y coordinates to render a clean, top-down **Tree Structure**, preventing intersecting lines and ensuring high readability.

---

## 4. Key Engineering Decisions
* **Per-Session Tree Graph:** We initially experimented with deduplicating memories across the entire graph. However, UX testing revealed that therapists prefer to see isolated events *per session*. Thus, we opted for a strict tree structure where each session clearly displays its own generated nodes directly beneath it.
* **Interactive Canvas:** Nodes are fully draggable via `useNodesState`, allowing the user to organically organize their workspace.

---

*This document can be exported as PDF, shared directly with technical reviewers, or kept open on another screen during your interview.*
