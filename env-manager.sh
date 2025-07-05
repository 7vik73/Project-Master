#!/bin/bash

# Environment file manager script

echo "🔧 Environment File Manager"
echo "=========================="
echo ""

# Function to show file contents
show_env_file() {
    local file=$1
    local name=$2
    echo "📄 $name:"
    echo "   Path: $file"
    echo "   Size: $(ls -lh $file | awk '{print $5}')"
    echo "   Last modified: $(ls -l $file | awk '{print $6, $7, $8}')"
    echo "   Contents:"
    echo "   ┌─────────────────────────────────────────────────────────"
    cat $file | sed 's/^/   │ /'
    echo "   └─────────────────────────────────────────────────────────"
    echo ""
}

# Function to edit file
edit_env_file() {
    local file=$1
    local name=$2
    echo "✏️  Editing $name..."
    echo "   Opening $file in your default editor..."
    echo "   Press Ctrl+X, then Y, then Enter to save in nano"
    echo "   Or press Ctrl+C to cancel"
    echo ""
    sleep 2
    nano $file
}

# Show current environment files
show_env_file "backend/.env" "Backend Environment"
show_env_file "client/.env" "Frontend Environment"

echo "🔧 Actions:"
echo "   1. Edit backend .env file"
echo "   2. Edit frontend .env file"
echo "   3. View backend .env file"
echo "   4. View frontend .env file"
echo "   5. Run debug script"
echo "   6. Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        edit_env_file "backend/.env" "Backend Environment"
        ;;
    2)
        edit_env_file "client/.env" "Frontend Environment"
        ;;
    3)
        show_env_file "backend/.env" "Backend Environment"
        ;;
    4)
        show_env_file "client/.env" "Frontend Environment"
        ;;
    5)
        ./debug-login.sh
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac 