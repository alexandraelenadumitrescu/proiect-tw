const express = require('express');
// const cors = require('cors')

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

require('dotenv').config(); //incarca variabilele din .env

const usersController = require('./controllers/usersController');
const registrationController = require('./controllers/registrationController');

const app = express();

// app.use(cors())
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 6666;

app.get('/users', usersController.getUsers);

app.post('/register', registrationController.registerUser);

app.get('/', (req, res) => {
  res.send('Serverul backend functioneaza corect!');
});

app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe portul http://localhost:${PORT}`);
  console.log(`Documentatie disponibila la: http://localhost:${PORT}/api-docs`);
});
