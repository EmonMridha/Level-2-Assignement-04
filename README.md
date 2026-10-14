# 🏠 RentNest Backend

A robust RESTful API for the RentNest property rental platform. This backend handles authentication, property management, rental requests, user management, and database operations.

---

## 🔗 Live API

https://assignment-04-orpin.vercel.app/

---

## 📖 Overview

The RentNest Backend provides secure APIs for managing users, properties, rental requests, and authentication. It is built with Node.js, Express.js, Prisma ORM, and PostgreSQL, following a clean and scalable architecture.

---

## 🚀 Features

- JWT Authentication
- Role-based Authorization (Admin, Landlord, Tenant)
- User Registration & Login
- Property CRUD Operations
- Rental Request Management
- Property Availability Management
- Protected Routes
- Input Validation
- Error Handling Middleware
- Secure Password Hashing
- RESTful API Architecture

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL
- Prisma ORM

### Authentication
- JWT (JSON Web Token)
- bcryptjs

### Development Tools
- Nodemon
- ESLint
- Git
- GitHub

---

## 📦 Dependencies

### Main Dependencies

- express
- prisma
- @prisma/client
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- cookie-parser

### Development Dependencies

- nodemon
- eslint

---

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/EmonMridha/Level-2-Assignement-04
```

### 2. Go to the project directory

```bash
cd rentnest-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory.

```env
DATABASE_URL=your_database_url

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRES=1d
REFRESH_TOKEN_EXPIRES=30d

CLIENT_URL=http://localhost:3000

PORT=5000
```

---

### 5. Generate Prisma Client

```bash
npx prisma generate
```

---

### 6. Run Database Migrations

```bash
npx prisma migrate dev
```

---

### 7. Seed Database (Optional)

```bash
npm run seed
```

---

### 8. Start the Development Server

```bash
npm run dev
```

The server will start on:

```
http://localhost:5000
```

---

## 📂 Project Structure

```
src/
│
├── app/
│   ├── modules/
│   ├── middleware/
│   ├── config/
│   ├── routes/
│   ├── utils/
│   └── errors/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── server.ts
└── app.ts
```

---

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| JWT_ACCESS_SECRET | JWT access token secret |
| JWT_REFRESH_SECRET | JWT refresh token secret |
| ACCESS_TOKEN_EXPIRES | Access token expiration |
| REFRESH_TOKEN_EXPIRES | Refresh token expiration |
| CLIENT_URL | Frontend application URL |
| PORT | Server port |

---

## 👨‍💻 Author

**Emon Mridha**

- GitHub: https://github.com/EmonMridha
- LinkedIn: https://www.linkedin.com/in/emon-mridha

---

## 📄 License

This project is licensed under the MIT License.
