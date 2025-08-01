# APU Bridge - University Social Network Platform

[![TypeScript](https://img.shields.io/badge/code-TypeScript-blue)](https://www.typescriptlang.org/)
[![React 18](https://img.shields.io/badge/frontend-React%2018-61DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/styling-TailwindCSS-38B2AC)](https://tailwindcss.com/)
[![Backend](https://img.shields.io/badge/backend-Express.js-green)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-336791)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle%20ORM-lightgray)](https://orm.drizzle.team/)
[![OIDC Auth](https://img.shields.io/badge/auth-Replit%20OIDC-yellowgreen)](https://docs.replit.com)
[![MIT License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 🧩 Overview

**APU Bridge** is a LinkedIn-style social network tailored for Asia Pacific University (APU), connecting students, alumni, faculty, and staff. It fosters community through user profiles, job boards, real-time messaging, and academic networking.

---

## 🌟 Features

- 👥 **University Profiles** — Role-based student, faculty, alumni profiles  
- 📰 **Social Feed** — Post, like, comment with real-time updates  
- 🌐 **Networking** — Connect with peers and alumni  
- 💼 **Job Board** — Post jobs, apply, and filter by role/type  
- 💬 **Real-Time Chat** — Instant messaging via WebSockets  
- 🔐 **Secure Auth** — OIDC-based authentication (Replit)

---

## 🛠 Tech Stack

### Frontend
- **React 18 + TypeScript**
- **Tailwind CSS** (custom APU theme)
- **shadcn/ui + Radix UI**
- **TanStack Query**
- **Vite + Wouter**

### Backend
- **Node.js + Express**
- **Drizzle ORM + PostgreSQL**
- **Replit OIDC Auth**
- **WebSockets for messaging**

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- Replit (for auth)

### Installation

```bash
git clone https://github.com/your-username/apu-bridge.git
cd apu-bridge
npm install
cp .env.example .env
# Edit .env with your secrets
npm run dev


Example .env
DATABASE_URL=postgres://user:pass@localhost:5432/apubridge
REPLIT_CLIENT_ID=your_client_id
REPLIT_CLIENT_SECRET=your_secret
SESSION_SECRET=supersecret
PORT=3000

🧭 Project Structure
apu-bridge/
├── client/           # React frontend
│   ├── public/
│   └── src/
├── server/           # Express backend
│   ├── controllers/
│   ├── middleware/
│   └── routes/
├── shared/           # Shared types + logic
├── types/
├── lib/
├── .env.example
├── package.json
└── README.md

🌍 Deployment
Frontend: Vercel

Backend: Render or Railway.app

Dev/Test: Replit

Full-stack deployable on Railway in minutes.

🤝 Contributing
Fork the repo

Create a new branch: git checkout -b feature/YourFeature

Commit changes: git commit -m 'Add feature'

Push to branch: git push origin feature/YourFeature

Open a Pull Request 🎉

📄 License
Distributed under the MIT License.



 
