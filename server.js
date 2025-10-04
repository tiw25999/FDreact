import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Get the correct dist path (go up one level from src to project root)
const distPath = path.join(__dirname, '..', 'dist');

console.log('🔍 Looking for dist folder at:', distPath);

// Serve static files from the dist directory
app.use(express.static(distPath));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('🔍 Looking for index.html at:', indexPath);
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:${PORT}`);
  console.log(`📁 Dist path: ${distPath}`);
});
