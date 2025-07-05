#!/bin/bash

# Setup script for Project Master environment configuration
# This script creates .env files from examples and sets up the project

echo "🚀 Setting up Project Master environment configuration..."

# Function to copy env file if it doesn't exist
copy_env_if_not_exists() {
    local example_file=$1
    local env_file=$2
    
    if [ ! -f "$env_file" ]; then
        echo "📝 Creating $env_file from $example_file..."
        cp "$example_file" "$env_file"
        echo "✅ Created $env_file"
    else
        echo "ℹ️  $env_file already exists, skipping..."
    fi
}

# Copy environment files
copy_env_if_not_exists "backend/env.example" "backend/.env"
copy_env_if_not_exists "client/env.example" "client/.env"

echo ""
echo "🎯 Environment files created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env and client/.env if you want to change ports"
echo "2. Start MongoDB: mongod --port 34567 --dbpath /tmp/mongodb_34567"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd client && npm run dev"
echo ""
echo "🔧 Port Configuration:"
echo "   - Backend: 5002 (change with BACKEND_PORT in backend/.env)"
echo "   - Frontend: 8080 (change with FRONTEND_PORT in client/.env)"
echo "   - MongoDB: 34567 (change with MONGODB_PORT in backend/.env)"
echo ""
echo "✨ The system will automatically update all URLs when you change ports!" 