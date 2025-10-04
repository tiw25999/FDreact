#!/usr/bin/env node

/**
 * Vercel Deployment Script for Freact
 * This script helps prepare and deploy the application to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel deployment preparation...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the Freact directory.');
  process.exit(1);
}

// Check if vercel.json exists
if (!fs.existsSync('vercel.json')) {
  console.error('❌ Error: vercel.json not found. Please ensure Vercel configuration exists.');
  process.exit(1);
}

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n🔨 Building production version...');
  execSync('npm run build:prod', { stdio: 'inherit' });
  
  console.log('\n✅ Build completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Install Vercel CLI: npm install -g vercel');
  console.log('2. Login to Vercel: vercel login');
  console.log('3. Deploy: vercel');
  console.log('4. For production: vercel --prod');
  console.log('\n🌐 Or deploy via Vercel Dashboard:');
  console.log('1. Go to https://vercel.com');
  console.log('2. Import your GitHub repository');
  console.log('3. Vercel will auto-detect Vite configuration');
  console.log('4. Deploy!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
