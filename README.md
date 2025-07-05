# Project Master - Full Stack Project Management Platform

A comprehensive project management platform built with Node.js, Express, React, TypeScript, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization**
- **Session Management with MongoDB Store**
- **CORS Configuration**
- **Port Management System**
- **Google OAuth Integration** (optional)
- **Project & Task Management**
- **Real-time Notifications**
- **Responsive UI with Tailwind CSS**

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Project-Master
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Configuration

#### Backend Environment (.env)

Create a `.env` file in the `backend` directory:

```env
# Backend Environment Configuration
NODE_ENV=development

# Port Configuration (can be overridden by environment variables)
BACKEND_PORT=5002
FRONTEND_PORT=8081
MONGODB_PORT=34567

# Database Configuration
MONGO_URI=mongodb://localhost:34567/project-master

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
SESSION_EXPIRES_IN=3y

# Google OAuth Configuration (optional - for Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5002/api/auth/google/callback

# Frontend Configuration (automatically derived from FRONTEND_PORT)
FRONTEND_ORIGIN=http://localhost:8081
FRONTEND_GOOGLE_CALLBACK_URL=http://localhost:8081/auth/callback
```

#### Frontend Environment (.env)

Create a `.env` file in the `client` directory:

```env
# Frontend Environment Configuration

# Port Configuration (can be overridden by environment variables)
FRONTEND_PORT=8081
BACKEND_PORT=5002

# API Configuration (automatically derived from BACKEND_PORT)
VITE_API_BASE_URL=http://localhost:5002/api
```

### 4. Start MongoDB

```bash
# Create MongoDB data directory
mkdir -p /tmp/mongodb_34567

# Start MongoDB on port 34567
mongod --port 34567 --dbpath /tmp/mongodb_34567
```

### 5. Start the Application

#### Option 1: Manual Start

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd client
npm run dev
```

#### Option 2: Using Setup Scripts

```bash
# Setup environment
./setup-env.sh

# Start all services
./env-manager.sh
```

## 🌐 Port Configuration

The application uses the following default ports:

- **Frontend (Vite)**: `http://localhost:8081`
- **Backend (Express)**: `http://localhost:5002`
- **MongoDB**: `localhost:34567`

### Port Management

The application includes a centralized port configuration system:

- **Shared Config**: `shared-config.js` - Central configuration for all ports
- **Environment Variables**: Can override default ports
- **Automatic Fallback**: If a port is in use, the system will try the next available port

## 🔧 Configuration Files

### Shared Configuration (`shared-config.js`)

```javascript
const config = {
    backend: {
        port: process.env.BACKEND_PORT || 5002,
        host: process.env.BACKEND_HOST || 'localhost'
    },
    frontend: {
        port: process.env.FRONTEND_PORT || 8081,
        host: process.env.FRONTEND_HOST || 'localhost'
    },
    mongodb: {
        port: process.env.MONGODB_PORT || 34567,
        host: process.env.MONGODB_HOST || 'localhost'
    }
};
```

### CORS Configuration

The backend is configured to allow requests from the frontend origin:

```javascript
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN, // http://localhost:8081
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);
```

## 📁 Project Structure

```
Project-Master/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Main server file
│   ├── .env               # Backend environment variables
│   └── package.json
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # API and utility functions
│   │   ├── pages/         # Page components
│   │   └── main.tsx       # Main React entry
│   ├── .env              # Frontend environment variables
│   └── package.json
├── shared-config.js       # Shared configuration
├── setup-env.sh          # Environment setup script
├── env-manager.sh        # Service management script
└── README.md
```

## 🔐 Authentication & Sessions

### Session Configuration

- **Store**: MongoDB session store
- **TTL**: 3 years
- **Cleanup**: Every 60 minutes
- **Security**: HTTP-only cookies with SameSite lax

### Session Management

```javascript
// Session store configuration
const mongoStore = MongoStore.create({
  mongoUrl: config.MONGO_URI,
  collectionName: 'sessions',
  ttl: 24 * 60 * 60 * 365 * 3, // 3 years
  autoRemove: 'interval',
  autoRemoveInterval: 60, // Check every 60 minutes
  touchAfter: 24 * 3600, // Update once per day
  crypto: {
    secret: config.SESSION_SECRET
  }
});
```

## 🚀 Available Scripts

### Backend Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
```

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Check if ports are available: `lsof -i :5002 -i :8081 -i :34567`
   - Kill processes: `pkill -f "ts-node-dev"` or `pkill -f "vite"`

2. **CORS Errors**
   - Ensure frontend and backend ports match in `.env` files
   - Check `FRONTEND_ORIGIN` in backend `.env`
   - Clear browser cache and cookies

3. **MongoDB Connection Issues**
   - Ensure MongoDB is running on port 34567
   - Check if data directory exists: `/tmp/mongodb_34567`

4. **Session Issues**
   - Clear browser cookies
   - Check session store configuration
   - Verify MongoDB connection

### Debug Scripts

```bash
# Debug login issues
./debug-login.sh

# Demo port changes
./demo-port-change.sh

# Environment management
./env-manager.sh
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### User Management
- `GET /api/user/current` - Get current user
- `PUT /api/user/profile` - Update user profile

### Projects & Tasks
- `GET /api/project` - Get all projects
- `POST /api/project` - Create project
- `GET /api/task` - Get all tasks
- `POST /api/task` - Create task

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the configuration files

---

**Note**: Make sure to update the Google OAuth credentials and session secret for production use.
