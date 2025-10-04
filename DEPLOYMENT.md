# E-Tech Store Frontend - Deployment Guide

## Render Deployment

### Prerequisites
1. GitHub repository with the code
2. Backend API deployed (https://bdnode.onrender.com)
3. Render account

### Environment Variables
Set these in Render dashboard:

```
VITE_API_BASE_URL=https://bdnode.onrender.com/api
```

### Deployment Steps

1. **Connect to GitHub**
   - Go to Render dashboard
   - Click "New" → "Static Site"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: etech-store-frontend
   - **Environment**: Static Site
   - **Build Command**: `npm install && npm run build:prod`
   - **Publish Directory**: `dist`

3. **Set Environment Variables**
   - Add `VITE_API_BASE_URL=https://bdnode.onrender.com/api`

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete

### Alternative: Docker Deployment

1. **Use Dockerfile**
   - Select "Docker" as environment
   - Render will use the provided Dockerfile

2. **Environment Variables**
   - Same as above

### Health Check
- **Frontend URL**: `https://your-app.onrender.com`
- **API Integration**: Connected to `https://bdnode.onrender.com/api`

### Troubleshooting
- Check build logs if deployment fails
- Verify environment variables are set correctly
- Ensure backend API is accessible
- Check nginx configuration for routing issues

### Features
- ✅ **Static Site Generation** - Fast loading
- ✅ **Client-side Routing** - React Router support
- ✅ **Gzip Compression** - Optimized delivery
- ✅ **Security Headers** - XSS protection
- ✅ **Asset Caching** - Long-term caching
- ✅ **Responsive Design** - Mobile-first approach
