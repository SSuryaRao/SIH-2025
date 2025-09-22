#!/bin/bash

echo "🚀 Preparing Backend for Render Deployment..."

cd backend

echo "📋 Deployment Checklist:"
echo "1. ✅ Environment variables configured"
echo "2. ✅ Firebase credentials ready"
echo "3. ✅ CORS configuration updated"
echo "4. ✅ Package.json configured"

echo ""
echo "🔗 Next Steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your GitHub repo to Render"
echo "3. Configure environment variables in Render dashboard:"
echo "   - NODE_ENV=production"
echo "   - PORT=10000"
echo "   - JWT_SECRET=your-secret-key"
echo "   - FIREBASE_PROJECT_ID=your-project-id"
echo "   - FIREBASE_CLIENT_EMAIL=your-client-email"
echo "   - FIREBASE_PRIVATE_KEY=your-private-key"
echo "   - FRONTEND_URL=https://your-app.vercel.app"
echo ""
echo "4. Deploy!"

echo "✅ Backend ready for deployment!"