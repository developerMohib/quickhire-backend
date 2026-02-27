# QuickHire Backend API

RESTful API for QuickHire Job Board built with **Node.js + Express + TypeScript + MongoDB + Zod**.

## 🚀 Features
- ✅ TypeScript with strict mode
- ✅ MongoDB + Mongoose
- ✅ Input validation with **Zod**
- ✅ Error handling middleware
- ✅ Admin token authentication
- ✅ Pagination, filtering, search
- ✅ Clean architecture (Controller → Service → Model)

## 📋 API Endpoints

### Jobs
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/jobs` | Public |
| GET | `/api/jobs/:id` | Public |
| GET | `/api/jobs/categories` | Public |
| GET | `/api/jobs/locations` | Public |
| POST | `/api/jobs` | Admin |
| PUT | `/api/jobs/:id` | Admin |
| DELETE | `/api/jobs/:id` | Admin |

### Applications
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/applications` | Public |
| GET | `/api/applications/job/:jobId` | Admin |
| PATCH | `/api/applications/:id/status` | Admin |

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB

### Installation
```bash
git clone <your-repo>
cd quickhire-backend
npm install
cp .env.example .env  # Edit with your config
npm run dev
```

🔐 Admin Auth
Add header to admin requests:
Authorization: Bearer your-admin-token

📁 Structure
src/
├── config/      # DB & env config
├── controllers/ # Request handlers
├── services/    # Logic
├── routes/      # API routes
├── middleware/  # Auth, validation, error
├── models/      # Mongoose schemas
├── utils/       # Helpers utils
├── validations/ # Zod validation schemas
├── app.ts       # Express setup
└── server.ts    # Entry point


🌐 Deployment
Works with Vercel, Railway, Render:
Build: npm run build
Start: npm start
Set env vars in platform dashboard