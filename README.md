# Issue Tracker App

A full-stack issue tracker application built with:

- **React (Vite)** for the frontend
- **Express + Node.js** for the backend
- **PostgreSQL + Prisma** for the database
- **JWT (via HTTP-only cookies)** for authentication
- **Tailwind CSS** for UI styling

---

## ✨ Features

- User authentication (login with email + password)
- Project creation, viewing, and deletion
- Issue creation, viewing, status toggling (open/solved)
- Secure API with protected routes
- Responsive modern UI (no rounded corners)

---

## 🛠 Tech Stack

| Layer     | Technology             |
|---------- |------------------------|
| Frontend  | React, Vite, TypeScript, Tailwind CSS, React Router |
| Backend   | Node.js, Express, Prisma, JWT |
| Database  | PostgreSQL |
| Auth      | JWT with HTTP-only cookies |

---

## 🔐 Authentication

This app uses **JWT-based authentication** with cookies:

- Upon successful login, the server issues a **JWT token**.
- The token is stored as a **secure, HTTP-only cookie**.
- The server uses a custom `authenticate` middleware to decode and validate the token on protected routes.

Example middleware:

```ts
const token = req.cookies.token;
const decoded = verifyJwt(token);
req.user = decoded; // contains userId and email
```

---

## 🧩 Database Schema (Prisma)

```prisma
model User {
  id       String   @id @default(uuid())
  email    String   @unique
  password String
  name     String
  projects Project[]
  issues   Issue[]
}

model Project {
  id        String   @id @default(uuid())
  name      String
  owner     User     @relation(fields: [ownerId], references: [id])
  ownerId   String
  issues    Issue[]
  createdAt DateTime @default(now())
}

model Issue {
  id          String   @id @default(uuid())
  title       String
  description String
  status      String   @default("open")
  project     Project  @relation(fields: [projectId], references: [id])
  projectId   String
  author      User     @relation(fields: [authorId], references: [id])
  authorId    String
  createdAt   DateTime @default(now())
}
```

---

## 📦 API Endpoints (Protected)

| Method | Endpoint                     | Description              |
|--------|------------------------------|--------------------------|
| POST   | `/api/login`                 | Login and get token      |
| GET    | `/api/projects`              | List all projects        |
| POST   | `/api/projects`              | Create a project         |
| DELETE | `/api/projects/:id`          | Delete a project         |
| GET    | `/api/issues?projectId=xxx`  | Get issues for a project |
| POST   | `/api/issues`                | Create a new issue       |
| PATCH  | `/api/issues/:id/status`     | Toggle issue status      |

---

## 🧪 Running Locally

### Backend

```bash
cd backend
cp .env.example .env
npx prisma migrate dev
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment

- Frontend: Can be deployed with Vercel, Netlify, etc.
- Backend: Can be hosted on platforms like Render, Railway, or any VPS.
- Make sure to configure `DATABASE_URL` and `JWT_SECRET` in production.

---

## 📄 License

MIT License – Open-source and free to use.