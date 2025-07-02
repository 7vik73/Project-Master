# Project Manager

## Overview
A modern, full-stack project management platform for teams and organizations. Built with the MERN stack (MongoDB, Express, React, Node.js, TypeScript), it supports multi-workspace collaboration, project and task management, real-time chat, notifications, and role-based access control.

---

## Features (Current Version)
- **Authentication:** Email/password and Google OAuth login
- **Workspaces:**
  - Create, edit, and delete workspaces
  - Invite and manage members
  - Workspace analytics and settings
- **Projects:**
  - Projects tab in workspace sidebar
  - List, create, edit, and delete projects
  - Project cards show owner, emoji, description, created date, task count, and progress bar
  - Click a project for detailed view
- **Tasks:**
  - Create, edit, delete, and assign tasks to members
  - Task status tracking ("done" and others)
  - Task table with filters and search
- **Members:**
  - Invite members to workspace
  - View all and recent members
  - Role-based permissions (Owner, Admin, Member)
- **Messages:**
  - Workspace chat with polling
  - Edit and delete your own messages
  - @mention users with autocomplete
  - Mentioned messages are only visible to sender and mentioned user
- **Notifications:**
  - In-app notification bell with unread count and dropdown
  - Notifications for mentions and new messages
  - Mark all as read
- **UI/UX:**
  - Responsive, modern design (React + TailwindCSS)
  - Sidebar navigation for Dashboard, Projects, Tasks, Members, Messages, Settings
  - Skeleton loaders and toasts for feedback
- **Other:**
  - Analytics dashboard
  - Pagination and data loading
  - Secure session management

---

## Pages & Navigation
- **/auth/sign-in, /auth/sign-up:** User authentication
- **/workspace/:workspaceId:** Workspace dashboard/overview
- **/workspace/:workspaceId/projects:** Projects list (tab in sidebar)
- **/workspace/:workspaceId/projects/:projectId:** Project details
- **/workspace/:workspaceId/tasks:** Task management
- **/workspace/:workspaceId/members:** Member management
- **/workspace/:workspaceId/messages:** Workspace chat
- **/workspace/:workspaceId/settings:** Workspace settings (delete, edit)
- **/invite/:inviteCode:** Accept workspace invitation
- **/errors/NotFound, /errors/Unauthorized:** Error pages

---

## Getting Started (Local Setup)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Project-Master
```

### 2. Set Up Environment Variables
#### Backend (`backend/.env`):
```
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/project_manager
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback
FRONTEND_ORIGIN=http://localhost:5173
```

#### Frontend (`client/.env`):
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Install Dependencies
#### Backend:
```bash
cd backend
npm install
```
#### Frontend:
```bash
cd ../client
npm install
```

### 4. Run the Application
#### Start Backend:
```bash
cd backend
npm run dev
```
#### Start Frontend:
```bash
cd ../client
npm run dev
```
- Backend: [http://localhost:8000](http://localhost:8000)
- Frontend: [http://localhost:5173](http://localhost:5173)

### 5. (Optional) Seed the Database
- Import sample data from `mongo-backup/` using MongoDB tools if desired.

---

## Free Cloud Deployment

### **Database (MongoDB):**
- Use [MongoDB Atlas](https://www.mongodb.com/atlas) for a free cloud MongoDB database.
- Update your `MONGO_URI` in the backend `.env` to the Atlas connection string.

### **Frontend/Backend Hosting:**
- You can use any Node.js/React hosting provider (e.g., Vercel, Netlify, Render, Railway, Glitch) for your backend and frontend.
- Set environment variables as needed and point your backend to your MongoDB Atlas cluster.

### **Steps:**
1. Push your code to GitHub
2. Deploy backend and frontend to your chosen provider
3. Set environment variables (including MongoDB Atlas URI)
4. Update CORS and OAuth callback URLs as needed

---

## License
This project is for educational and personal use. Please comply with academic integrity policies and do not claim work you did not author as your own.

Hi
