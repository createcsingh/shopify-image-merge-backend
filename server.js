require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const customBuilderRoutes = require('./src/routes/customBuilderRoutes');

const app = express();

/* app.use(cors({
  origin: process.env.FRONTEND_ORIGIN === '*' ? true : process.env.FRONTEND_ORIGIN?.split(',').map(v => v.trim()),
  credentials: false
})); */

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Custom Builder backend is running'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.use('/api/custom-builder', customBuilderRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
