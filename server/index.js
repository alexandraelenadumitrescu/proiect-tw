const express = require('express');
const cors = require('cors');

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

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 7878;

app.post(
  '/conferences/:conferenceId/submit-paper',
  authenticateToken,
  requireRole(AUTHOR_ROLE),
  papersController.submitPaper
);
app.post(
  '/conferences/:conferenceId/papers/:paperId/upload-new-paper-version',
  authenticateToken,
  requireRole(AUTHOR_ROLE),
  papersController.submitNewVersionOfPaper
);

app.use(express.json());

app.get('/users', usersController.getUsers);

app.post('/login', loginController.loginUser);
app.post('/register', registrationController.registerUser);

app.get('/users/:userId/roles', rolesController.getRolesForUser);
app.post('/users/assign-roles-to-self', authenticateToken, rolesController.assignRoleToUser);

app.get('/conferences', authenticateToken, conferencesController.getConferencesAccordingToRole);

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

app.get(
  '/conferences/:conferenceId/see-paper-statuses',
  authenticateToken,
  requireRole(ORGANIZER_ROLE),
  papersController.seePaperStatuses
);

app.get(
  '/conferences/:conferenceId/papers/:paperId/versions/:versionNumber/download',
  authenticateToken,
  papersController.downloadPaperVersionFile
);

app.post(
  '/conferences/:conferenceId/papers/:paperId/approve',
  authenticateToken,
  requireRole(REVIEWER_ROLE),
  papersController.approvePaper
);
app.post(
  '/conferences/:conferenceId/papers/:paperId/request-changes',
  authenticateToken,
  requireRole(REVIEWER_ROLE),
  papersController.requestChangesForPaper
);

app.get(
  '/conferences/:conferenceId/papers/:paperId/timeline',
  authenticateToken,
  papersController.getPaperTimeline
);

app.get('/', (_req, res) => {
  res.send('Serverul backend functioneaza corect!');
});

app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe portul http://localhost:${PORT}`);
  console.log(`Documentatie disponibila la: http://localhost:${PORT}/api-docs`);
});
