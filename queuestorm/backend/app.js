const express = require('express');
const app = express();
const path = require('path');

const cors = require('cors');
const requestLogger = require('./src/middleware/requestLogger');
const errorHandler = require('./src/middleware/errorHandler');
const healthRoutes = require('./src/routes/health.routes');
const analyzeRoutes = require('./src/routes/analyze.routes');

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/', healthRoutes);
app.use('/', analyzeRoutes);

// Serve frontend static files in production
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback for React Router client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/analyze-ticket') || req.path.startsWith('/health') || req.path.includes('.')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.use(errorHandler);

module.exports = app;
