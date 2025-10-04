# Vercel Deployment Guide for Freact Frontend

## Overview
This guide will help you deploy the Freact frontend application to Vercel.

## Prerequisites
- Vercel account (free tier available)
- GitHub repository with your code
- Node.js installed locally (for testing)

## Deployment Steps

### 1. Prepare Your Repository
Make sure your code is pushed to a GitHub repository. The project is already configured for Vercel deployment.

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project
5. Configure the following settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build:prod`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Option B: Deploy via Vercel CLI
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory:
   ```bash
   cd Freact
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. For production deployment:
   ```bash
   vercel --prod
   ```

### 3. Environment Variables
The following environment variable is already configured in `vercel.json`:
- `VITE_API_BASE_URL`: `https://bdnode.onrender.com/api`

If you need to change the API URL, you can:
1. Update it in the Vercel dashboard under Project Settings > Environment Variables
2. Or update the `vercel.json` file and redeploy

### 4. Custom Domain (Optional)
1. Go to your project dashboard on Vercel
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

## Configuration Details

### Build Configuration
- **Build Command**: `npm run build:prod`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x (automatically detected)

### Routing
The application uses React Router with client-side routing. The `vercel.json` configuration includes:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures all routes are handled by the React application.

### Performance Optimizations
- Vite build optimizations are enabled
- Assets are properly chunked
- Static assets are served from CDN

## Testing the Deployment

### Local Testing
Before deploying, test the production build locally:

```bash
cd Freact
npm run build:prod
npm run preview
```

### Post-Deployment Testing
1. Test all major routes:
   - Home page
   - Product listing
   - Product details
   - Cart functionality
   - User authentication
   - Admin dashboard (if applicable)

2. Test API connectivity:
   - Verify API calls are working
   - Check for CORS issues
   - Test error handling

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (should be 18.x or higher)
   - Verify all dependencies are in `package.json`
   - Check for TypeScript errors

2. **Routing Issues**
   - Ensure `vercel.json` has proper rewrites configuration
   - Verify React Router setup

3. **API Connection Issues**
   - Check environment variables
   - Verify CORS configuration on backend
   - Test API endpoints directly

4. **Environment Variables**
   - Ensure variables are prefixed with `VITE_`
   - Check variable names match exactly
   - Redeploy after changing variables

### Debug Commands
```bash
# Check build locally
npm run build:prod

# Test production build
npm run preview

# Check Vercel deployment logs
vercel logs [deployment-url]
```

## Monitoring and Analytics

### Vercel Analytics
1. Enable Vercel Analytics in your project dashboard
2. Monitor performance metrics
3. Track user interactions

### Error Monitoring
Consider integrating error monitoring services like:
- Sentry
- LogRocket
- Bugsnag

## Continuous Deployment

### Automatic Deployments
- Pushes to `main` branch trigger production deployments
- Pull requests create preview deployments
- Configure branch protection rules in GitHub

### Manual Deployments
```bash
# Deploy specific branch
vercel --prod

# Deploy with specific environment
vercel --env production
```

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to repository
   - Use Vercel's environment variable management
   - Rotate API keys regularly

2. **CORS Configuration**
   - Ensure backend CORS allows Vercel domain
   - Use specific domains instead of wildcards in production

3. **HTTPS**
   - Vercel provides HTTPS by default
   - Ensure all API calls use HTTPS

## Performance Optimization

1. **Image Optimization**
   - Use Vercel's Image Optimization API
   - Implement lazy loading
   - Use appropriate image formats

2. **Code Splitting**
   - Vite handles automatic code splitting
   - Consider manual splitting for large components

3. **Caching**
   - Leverage Vercel's CDN
   - Set appropriate cache headers
   - Use service workers for offline functionality

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)

## Next Steps

After successful deployment:
1. Set up monitoring and analytics
2. Configure custom domain (if needed)
3. Set up CI/CD pipeline
4. Implement error tracking
5. Optimize performance based on real user data
