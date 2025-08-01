# APU Bridge - University Social Network Platform

![TypeScript](https://img.shields.io/badge/code-TypeScript-blue.svg)
![React](https://img.shields.io/badge/frontend-React18-blue)
![TailwindCSS](https://img.shields.io/badge/styling-TailwindCSS-38bdf8)
![Backend](https://img.shields.io/badge/backend-Express.js-green)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791)
![ORM](https://img.shields.io/badge/ORM-Drizzle%20ORM-lightgrey)
![Authentication](https://img.shields.io/badge/auth-Replit%20OIDC-yellowgreen)
![Status](https://img.shields.io/badge/status-Active--Dev-orange)

APU Bridge - University Social Network Platform
https://via.placeholder.com/150x50?text=APU+Bridge (Add your logo here)

A LinkedIn-style social network platform for Asia Pacific University (APU) community, connecting students, alumni, faculty, and staff.

🌟 Features
University Profiles: Tailored profiles with academic details

Social Feed: Share posts, like, and comment

Networking: Connect with peers and alumni

Job Board: Post and apply for opportunities

Real-time Chat: Instant messaging system

🛠️ Tech Stack
Frontend:

React + TypeScript

Tailwind CSS + shadcn/ui

Vite

TanStack Query

Backend:

Node.js + Express

PostgreSQL (Drizzle ORM)

WebSockets

🚀 Quick Start
Prerequisites
Node.js (v18+)

PostgreSQL database

Replit account (for auth)

Installation
# Clone the repository
git clone https://github.com/your-username/apu-bridge.git
cd apu-bridge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

Running Locally
# Start development server
npm run dev

# Build for production
npm run build
npm run start

🔧 Configuration
Edit the .env file with your settings:
DATABASE_URL="postgres://user:pass@localhost:5432/apubridge"
REPLIT_CLIENT_ID=your_replit_client_id
REPLIT_CLIENT_SECRET=your_replit_secret
SESSION_SECRET=your_session_secret
PORT=3000

📂 Project Structure
apu-bridge/
├── client/            # Frontend code
├── server/            # Backend code
├── shared/            # Shared types and utilities
├── .env.example       # Environment template
├── package.json       # Project dependencies
└── README.md          # This file

🌍 Deployment
Free Hosting Options:
Vercel (Frontend) + Render (Backend)

Railway.app (Fullstack)

Replit (Dev/Testing)

https://vercel.com/button

🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License.
