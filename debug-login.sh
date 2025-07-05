#!/bin/bash

# Debug script for login issues and configuration verification

echo "🔍 Login Debug Script"
echo "====================="
echo ""

# Check if services are running
echo "📊 Service Status:"
echo "   Backend (5002): $(curl -s http://localhost:5002/api > /dev/null && echo "✅ Running" || echo "❌ Not running")"
echo "   Frontend (8080): $(curl -s http://localhost:8080 > /dev/null && echo "✅ Running" || echo "❌ Not running")"
echo "   MongoDB (34567): $(nc -z localhost 34567 2>/dev/null && echo "✅ Running" || echo "❌ Not running")"
echo ""

# Show current configuration
echo "⚙️  Current Configuration:"
echo "   Backend Port: $(grep BACKEND_PORT backend/.env | cut -d'=' -f2)"
echo "   Frontend Port: $(grep FRONTEND_PORT client/.env | cut -d'=' -f2)"
echo "   API Base URL: $(grep VITE_API_BASE_URL client/.env | cut -d'=' -f2)"
echo "   CORS Origin: $(grep FRONTEND_ORIGIN backend/.env | cut -d'=' -f2)"
echo ""

# Test API endpoints
echo "🧪 API Endpoint Tests:"
echo "   Login endpoint: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:5002/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test"}')"
echo "   Register endpoint: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:5002/api/auth/register -X POST -H "Content-Type: application/json" -d '{"email":"debug@test.com","name":"Debug User","password":"test"}')"
echo ""

# Test with valid credentials
echo "🔐 Testing with valid credentials:"
if curl -s http://localhost:5002/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"password123"}' | grep -q "Logged in successfully"; then
    echo "   ✅ Login with valid credentials: SUCCESS"
else
    echo "   ❌ Login with valid credentials: FAILED"
fi
echo ""

# Show environment files (readable format)
echo "📁 Environment Files:"
echo "   Backend .env: $(ls -la backend/.env | awk '{print $1, $3, $4, $9}')"
echo "   Client .env: $(ls -la client/.env | awk '{print $1, $3, $4, $9}')"
echo ""

echo "💡 Troubleshooting Tips:"
echo "   1. If you get 404 errors, check that the API base URL is correct"
echo "   2. If you get CORS errors, ensure FRONTEND_ORIGIN matches your frontend port"
echo "   3. If login fails, try registering a new user first"
echo "   4. Check browser console for detailed error messages"
echo ""
echo "🔧 To view .env files:"
echo "   cat backend/.env"
echo "   cat client/.env"
echo ""
echo "🚀 To restart services:"
echo "   pkill -f ts-node-dev && cd backend && npm run dev"
echo "   pkill -f vite && cd client && npm run dev" 