const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

app.use('/api-docs', swaggerUi. serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Conference Management API',
    version: '1.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
  });
});

app.use('/api/auth', authRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
