# ⚡ Quick Deployment Guide

## 🎯 Deploy in 15 Minutes

### Step 1: Backend (Render) - 5 minutes
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: Add deployment configuration"
   git push origin main
   ```

2. **Create Render Service**:
   - Go to [render.com](https://render.com)
   - Connect GitHub repo
   - Select backend folder
   - Configure:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`

3. **Add Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-super-secret-jwt-key-here
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. **Deploy & Test**:
   - Wait for deployment
   - Test: `https://your-backend.onrender.com/api/health`

### Step 2: Frontend (Vercel) - 5 minutes
1. **Create Vercel Project**:
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repo
   - Select frontend folder

2. **Add Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```

3. **Deploy & Test**:
   - Auto-deploys from GitHub
   - Test: `https://your-app.vercel.app`

### Step 3: Integration Test - 5 minutes
1. **Update CORS**:
   - Add your Vercel URL to backend environment:
   ```env
   FRONTEND_URL=https://your-app.vercel.app
   ```

2. **Test Complete Flow**:
   - Visit frontend URL
   - Register new account
   - Take quiz
   - Check recommendations
   - Verify all features work

## 🔧 Quick Fixes

### CORS Errors
```bash
# Update backend FRONTEND_URL in Render dashboard
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```

### API Not Found
```bash
# Update frontend API URL in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-actual-render-url.onrender.com
```

### Firebase Errors
- Double-check all Firebase environment variables
- Ensure private key includes `\n` characters
- Verify project ID matches Firebase console

## 🚀 Production URLs

After deployment, update these in your documentation:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/api/health`

## 📱 Test Production

Run the complete user flow:
1. **Register**: Create new account
2. **Login**: Verify authentication
3. **Quiz**: Complete assessment
4. **Dashboard**: Check recommendations
5. **All Pages**: Verify navigation works

## 🎯 Success Criteria

✅ Backend health check returns 200
✅ Frontend loads without errors
✅ User registration works
✅ Login authentication works
✅ Quiz submission saves results
✅ Recommendations display properly
✅ No CORS errors in browser console

---

**Total Time: ~15 minutes** ⏱️

Need help? Check the full deployment guide in `DEPLOYMENT.md`