# Project Management SaaS Platform

## Overview

This is a full-stack B2B project management platform built with the MERN stack (MongoDB, Express, React, Node.js, TypeScript). The application supports multi-tenancy, workspace management, project and task tracking, role-based permissions, and team collaboration features. It is designed for organizations to efficiently manage projects, teams, and workflows.

---

## Key Features

- User authentication (email/password, Google OAuth)
- Create and manage multiple workspaces
- Project and task management (CRUD, status, priority, assignee)
- Role-based permissions (Owner, Admin, Member)
- Invite members to workspaces
- Filters and search for tasks and projects
- Analytics dashboard
- Pagination and data loading
- Session management and secure authentication
- Data seeding for test/demo purposes
- Built with modern tools: Node.js, React, MongoDB, TypeScript, TailwindCSS

---

## Getting Started

### 1. Set Up Environment Variables

Create a `.env` file in the backend and client directories as needed. Example variables:

```plaintext
PORT=8000
NODE_ENV=development
MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<db_name>"
SESSION_SECRET="your_session_secret"
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback
FRONTEND_ORIGIN=http://localhost:3000
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:3000/google/callback
```

### 2. Install Dependencies

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd ../client
npm install
```

### 3. Run the Application

Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend development server:
```bash
cd ../client
npm run dev
```

The backend will be available at `http://localhost:8000` and the frontend at `http://localhost:3000` by default.

---

## Deployment

- Add your environment variables to your chosen hosting platform (e.g., Vercel, Render, Railway, MongoDB Atlas).
- Deploy the backend and frontend according to your platform's instructions.

---

## Customization

You are encouraged to customize the project by:
- Changing the branding, UI, and color scheme
- Adding or removing features
- Refactoring code to fit your own style and requirements
- Writing your own documentation and tests

---

## License

This project is provided for educational and personal use. Please ensure you comply with your institution's academic integrity policies and do not claim work you did not author as your own.

Hi