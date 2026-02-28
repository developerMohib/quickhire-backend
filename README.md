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

## Explainatin 
- Video() 
- live Link([quickhire-backend.vercel.app](https://quickhire-backend.vercel.app/))


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
git clone https://github.com/developerMohib/quickhire-backend.git
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
├── config/      # Database connection, environment variable configurations
├── controllers/ # Express request handlers, manages request/response flow
├── services/    # Business logic layer (interacts with models)
├── routes/      # API route definitions
├── middleware/  # Authentication, validation, and error handling middleware
├── models/      # Mongoose schemas and data models
├── utils/       # Helper functions and reusable utilities
├── validations/ # Zod validation schemas for request data
├── app.ts       # Express application setup (middlewares, routes config)
└── server.ts    # Entry point: Database connection & server listening


🌐 Deployment
Works with Vercel
Build: npm run build
Start: npm start
- vercel
- vercel --prod
go to dashboard and use the domain
