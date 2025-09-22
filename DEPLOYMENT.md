# 🚀 Deployment Guide

## Frontend Deployment (Vercel)

### 1. Prerequisites
- Vercel account
- GitHub repository connected

### 2. Environment Variables for Vercel
Add these in your Vercel dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### 3. Deploy to Vercel
```bash
# Option 1: Using Vercel CLI
npm i -g vercel
cd frontend
vercel --prod

# Option 2: GitHub Integration
# Push to main branch and Vercel will auto-deploy
```

### 4. Vercel Configuration
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

---

## Backend Deployment (Render)

### 1. Prerequisites
- Render account
- GitHub repository

### 2. Environment Variables for Render
Add these in Render dashboard:

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-here
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FRONTEND_URL=https://your-app.vercel.app
```

### 3. Render Service Configuration
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Auto-Deploy**: Enabled

### 4. Get Firebase Credentials
1. Go to Firebase Console → Project Settings
2. Service Accounts tab
3. Generate new private key
4. Copy the values to Render environment variables

---

## 📋 Deployment Checklist

### ✅ Frontend (Vercel)
- [ ] `vercel.json` created
- [ ] `next.config.js` configured for CORS
- [ ] Environment variables set in Vercel
- [ ] All API calls use `NEXT_PUBLIC_API_URL`
- [ ] Domain connected (optional)

### ✅ Backend (Render)
- [ ] `render.yaml` created
- [ ] Environment variables configured
- [ ] Firebase credentials added
- [ ] CORS allows frontend domain
- [ ] JWT secret is secure
- [ ] Port configuration correct

### ✅ Integration Testing
- [ ] Frontend can reach backend
- [ ] Authentication works
- [ ] CORS configured properly
- [ ] Database connections work
- [ ] All API endpoints functional

---

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update `FRONTEND_URL` in Render
   - Check `corsOptions` in `server.js`

2. **Firebase Connection Failed**
   - Verify all Firebase env vars
   - Check private key formatting

3. **JWT Issues**
   - Ensure `JWT_SECRET` matches between services
   - Check token expiration

4. **API Not Found**
   - Verify `NEXT_PUBLIC_API_URL` in Vercel
   - Check Render service is running

### Health Check URLs
- Backend: `https://your-backend.onrender.com/`
- Frontend: `https://your-frontend.vercel.app/`

---

## 📱 Testing Deployment

1. **Visit Frontend**: `https://your-app.vercel.app`
2. **Register Account**: Test user registration
3. **Login**: Verify authentication
4. **Take Quiz**: Test quiz functionality
5. **View Recommendations**: Check backend integration
6. **Admin Features**: Test admin dashboard (if applicable)

---

## 🔄 Updates and Maintenance

### Updating Frontend
```bash
git push origin main  # Auto-deploys via Vercel
```

### Updating Backend
```bash
git push origin main  # Auto-deploys via Render
```

### Database Updates
- Use the seeding script for initial data
- Admin dashboard for ongoing management