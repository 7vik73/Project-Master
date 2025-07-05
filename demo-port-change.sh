#!/bin/bash

# Demonstration script showing how easy it is to change ports
# This script shows the new centralized port configuration system in action

echo "🎯 Port Configuration System Demo"
echo "=================================="
echo ""

# Function to show current configuration
show_config() {
    echo "📊 Current Configuration:"
    echo "   Backend Port: $(grep BACKEND_PORT backend/.env | cut -d'=' -f2)"
    echo "   Frontend Port: $(grep FRONTEND_PORT client/.env | cut -d'=' -f2)"
    echo "   MongoDB Port: $(grep MONGODB_PORT backend/.env | cut -d'=' -f2)"
    echo ""
}

# Function to show what would change
show_changes() {
    local new_backend_port=$1
    local new_frontend_port=$2
    
    echo "🔄 If you change ports to:"
    echo "   Backend: $new_backend_port"
    echo "   Frontend: $new_frontend_port"
    echo ""
    echo "The system would automatically update:"
    echo "   ✅ Backend CORS origin: http://localhost:$new_frontend_port"
    echo "   ✅ Frontend API URL: http://localhost:$new_backend_port/api"
    echo "   ✅ Google OAuth callbacks"
    echo "   ✅ All related configurations"
    echo ""
}

# Show current config
show_config

# Show what would change with different ports
show_changes "3000" "3001"

echo "🚀 To change ports, simply edit the .env files:"
echo ""
echo "   # backend/.env"
echo "   BACKEND_PORT=3000"
echo "   FRONTEND_PORT=3001"
echo ""
echo "   # client/.env"
echo "   FRONTEND_PORT=3001"
echo "   BACKEND_PORT=3000"
echo ""
echo "✨ Then restart the services and everything works automatically!"
echo ""
echo "💡 No more manual updates in multiple files!" 