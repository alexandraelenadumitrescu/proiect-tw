const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (JWT_SECRET === undefined || JWT_SECRET === '') {
  console.error('FATAL ERROR: JWT_SECRET is not defined. Please check your .env file');
  server.exit(1);
}

exports.JWT_SECRET = JWT_SECRET;
