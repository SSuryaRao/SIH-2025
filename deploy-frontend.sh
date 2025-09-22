#!/bin/bash

echo "🚀 Deploying Frontend to Vercel..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "☁️ Deploying to Vercel..."
npx vercel --prod

echo "✅ Frontend deployment complete!"
echo "🌐 Check your Vercel dashboard for the deployed URL"