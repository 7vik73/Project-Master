# Port Configuration System

This project now uses a **centralized port configuration system** that automatically handles port changes across the entire application. No more manual updates in multiple files!

## 🎯 How It Works

The system automatically:
- Reads port configuration from environment variables
- Derives all URLs from port settings
- Updates CORS, API endpoints, and callback URLs automatically
- Maintains consistency across frontend, backend, and database

## 🚀 Quick Setup

1. **Run the setup script:**
   ```bash
   ./setup-env.sh
   ```

2. **Start the services:**
   ```bash
   # Terminal 1: MongoDB
   mongod --port 34567 --dbpath /tmp/mongodb_34567
   
   # Terminal 2: Backend
   cd backend && npm run dev
   
   # Terminal 3: Frontend
   cd client && npm run dev
   ```

## 🔧 Changing Ports

### Option 1: Environment Variables (Recommended)
Edit the `.env` files:

**backend/.env:**
```env
BACKEND_PORT=5002
FRONTEND_PORT=8080
MONGODB_PORT=34567
```

**client/.env:**
```env
FRONTEND_PORT=8080
BACKEND_PORT=5002
```

### Option 2: Command Line
```bash
# Start backend on different port
BACKEND_PORT=3000 cd backend && npm run dev

# Start frontend on different port
FRONTEND_PORT=3001 cd client && npm run dev
```

## 🔄 Automatic Updates

When you change a port, the system automatically updates:

| Component | What Updates | How |
|-----------|-------------|-----|
| **Backend** | CORS origin, Google callback URLs | Reads `FRONTEND_PORT` from env |
| **Frontend** | API base URL, Vite dev server | Reads `BACKEND_PORT` from env |
| **Database** | MongoDB connection string | Reads `MONGODB_PORT` from env |
| **OAuth** | Google callback URLs | Derived from port settings |

## 📁 Configuration Files

### Shared Configuration
- `shared-config.js` - Central configuration for both frontend and backend

### Backend Configuration
- `backend/src/config/app.config.ts` - Backend app configuration
- `backend/.env` - Backend environment variables

### Frontend Configuration
- `client/vite.config.ts` - Vite configuration with dynamic port
- `client/src/lib/axios-client.ts` - Dynamic API base URL
- `client/.env` - Frontend environment variables

## 🎨 Example: Changing Frontend Port

1. **Edit client/.env:**
   ```env
   FRONTEND_PORT=3000
   ```

2. **Restart frontend:**
   ```bash
   cd client && npm run dev
   ```

3. **That's it!** The system automatically:
   - Starts frontend on port 3000
   - Updates backend CORS to allow `http://localhost:3000`
   - Updates Google OAuth callback URLs
   - Updates all related configurations

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :5002

# Kill the process
pkill -f "ts-node-dev"
```

### CORS Errors
- Ensure `FRONTEND_PORT` in backend/.env matches your frontend port
- Check that frontend is running on the expected port
- Verify `FRONTEND_ORIGIN` in backend logs

### API Connection Errors
- Ensure `BACKEND_PORT` in client/.env matches your backend port
- Check that backend is running on the expected port
- Verify the API base URL in browser network tab

## 🛠️ Advanced Configuration

### Custom Hosts
```env
# backend/.env
BACKEND_HOST=0.0.0.0
FRONTEND_HOST=192.168.1.100
```

### Production Settings
```env
# backend/.env
NODE_ENV=production
FRONTEND_ORIGIN=https://yourdomain.com
```

## 📊 Default Ports

| Service | Default Port | Environment Variable |
|---------|-------------|---------------------|
| Backend | 5002 | `BACKEND_PORT` |
| Frontend | 8080 | `FRONTEND_PORT` |
| MongoDB | 34567 | `MONGODB_PORT` |

## ✨ Benefits

- **No more manual updates** - Change one port, everything updates automatically
- **Consistent configuration** - All services use the same port settings
- **Easy deployment** - Different ports for different environments
- **Reduced errors** - No more mismatched port configurations
- **Better development experience** - Quick port changes without breaking things

## 🔗 Related Files

- `shared-config.js` - Central configuration
- `setup-env.sh` - Setup script
- `backend/src/config/app.config.ts` - Backend config
- `client/vite.config.ts` - Frontend config
- `client/src/lib/axios-client.ts` - API client 