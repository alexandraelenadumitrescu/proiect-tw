const express = require('express');
// const cors = require('cors')

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

require('dotenv').config(); //incarca variabilele din .env

const usersController = require('./controllers/usersController');
const registrationController = require('./controllers/registrationController');
const loginController = require('./controllers/loginController');
const rolesController = require('./controllers/rolesController');
const conferencesController = require('./controllers/conferencesController');
const papersController = require('./controllers/papersController');

const { authenticateToken } = require('./middleware/loginUser');
const requireRole = require('./middleware/requireRole');

const { ORGANIZER_ROLE, AUTHOR_ROLE, REVIEWER_ROLE } = require('./constants/roles');

const app = express();

// app.use(cors())
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 6666;

app.get('/users', usersController.getUsers);

app.post('/login', loginController.loginUser);
app.post('/register', registrationController.registerUser);

app.get('/users/:userId/roles', rolesController.getRolesForUser);
app.post('/users/assign-roles-to-self', authenticateToken, rolesController.assignRoleToUser);

app.post(
  '/conferences',
  authenticateToken,
  requireRole(ORGANIZER_ROLE),
  conferencesController.createConference
);
app.post(
  '/conferences/:conferenceId/allocate-reviewer',
  authenticateToken,
  requireRole(ORGANIZER_ROLE),
  conferencesController.allocateReviewerToConference
);
app.post(
  '/conferences/:conferenceId/join-as-author',
  authenticateToken,
  requireRole(AUTHOR_ROLE),
  conferencesController.joinConferenceAsAuthor
);

app.post(
  '/conferences/:conferenceId/submit-paper',
  authenticateToken,
  requireRole(AUTHOR_ROLE),
  papersController.submitPaper
);

app.post(
  '/conferences/:conferenceId/papers/:paperId/approve',
  authenticateToken,
  requireRole(REVIEWER_ROLE),
  papersController.approvePaper
);

app.get('/', (req, res) => {
  res.send('Serverul backend functioneaza corect!');
});

app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe portul http://localhost:${PORT}`);
  console.log(`Documentatie disponibila la: http://localhost:${PORT}/api-docs`);
});
