# APU Bridge - University Social Network Platform

![TypeScript](https://img.shields.io/badge/code-TypeScript-blue.svg)
![React](https://img.shields.io/badge/frontend-React18-blue)
![TailwindCSS](https://img.shields.io/badge/styling-TailwindCSS-38bdf8)
![Backend](https://img.shields.io/badge/backend-Express.js-green)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791)
![ORM](https://img.shields.io/badge/ORM-Drizzle%20ORM-lightgrey)
![Authentication](https://img.shields.io/badge/auth-Replit%20OIDC-yellowgreen)
![Status](https://img.shields.io/badge/status-Active--Dev-orange)

# APU-Bridge

📘 APU Bridge - University Social Network Platform
APU Bridge is a LinkedIn-style platform designed for APU’s students, alumni, faculty, and staff to network, share opportunities, and engage in meaningful interactions.

🚀 Features
👤 Role-based user profiles (student, alumni, faculty, admin)

📰 Social feed with posts, likes, and comments

📬 Real-time messaging via WebSockets

💼 Job postings and applications

🔒 Secure authentication using Replit OIDC

🎨 Modern UI with dark/light mode

🛠️ Tech Stack
Layer	Stack
Frontend	React 18, TypeScript, Vite, Tailwind CSS
UI Components	shadcn/ui, Radix UI
State Mgmt	TanStack Query (React Query)
Routing	Wouter
Backend	Node.js, Express.js, TypeScript
Database	PostgreSQL + Drizzle ORM
Auth	Replit OIDC, Express Session
Real-Time	WebSockets
Dev Environment	Monorepo, HMR, Proxy, Vite

🧩 Core Modules
🔐 Authentication
Role-based access

OIDC with Replit Auth

Session persistence with PostgreSQL

👥 Social Networking
Profile customization

Search & discover users

Rich content feed

Real-time chat

💼 Job Platform
Job posts with filters

Applications with cover letters

Internship/full-time support

📦 Development
Prerequisites
Node.js (v18+)

PostgreSQL (v13+)

Git

Vite (dev build)

Install & Run
bash
Copy
Edit
git clone https://github.com/YOUR_USERNAME/apu-bridge.git
cd apu-bridge
npm install
npm run dev
🌐 Deployment Strategy
Static assets served from Express

Drizzle for schema migrations

Neon serverless PostgreSQL

CDN-ready frontend via Vite

WebSocket server can be horizontally scaled

📂 Folder Structure
bash
Copy
Edit
apu-bridge/
├── client/           # Frontend
│   ├── src/
│   └── vite.config.ts
├── server/           # Backend
│   ├── routes/
│   ├── db/
│   └── index.ts
└── README.md
✅ Status
🚧 Under active development.
