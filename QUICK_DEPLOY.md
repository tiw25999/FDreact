# Quick Vercel Deployment Guide

## 🚀 Fast Track Deployment

### Option 1: Vercel Dashboard (Recommended for beginners)

1. **Push your code to GitHub** (if not already done)
2. **Go to [vercel.com](https://vercel.com)** and sign in
3. **Click "New Project"**
4. **Import your repository**
5. **Vercel will auto-detect Vite settings:**
   - Framework: Vite
   - Build Command: `npm run build:prod`
   - Output Directory: `dist`
6. **Click "Deploy"**

### Option 2: Vercel CLI (For developers)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to Freact directory
cd Freact

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

### Option 3: Using the deployment script

```bash
cd Freact
node deploy-vercel.js
```

## ⚙️ Configuration

Your project is already configured with:
- ✅ `vercel.json` - Vercel configuration
- ✅ Environment variables set
- ✅ Build scripts optimized
- ✅ Routing configured for React Router

## 🔧 Environment Variables

The following is already configured:
- `VITE_API_BASE_URL`: `https://bdnode.onrender.com/api`

## 📱 Testing Your Deployment

After deployment, test these features:
- [ ] Home page loads
- [ ] Product listing works
- [ ] Product details display
- [ ] Cart functionality
- [ ] User authentication
- [ ] API calls to backend

## 🆘 Troubleshooting

### Build fails?
```bash
# Install dependencies
npm install

# Test build locally
npm run build:prod
```

### API not working?
- Check if backend is running
- Verify CORS settings
- Check environment variables

### Routing issues?
- Ensure `vercel.json` has rewrites configuration
- Test all routes manually

## 📞 Need Help?

- Check the full guide: `VERCEL_DEPLOYMENT.md`
- Vercel docs: https://vercel.com/docs
- Vite docs: https://vitejs.dev/

---

**Ready to deploy?** Choose one of the options above and you'll be live in minutes! 🎉
