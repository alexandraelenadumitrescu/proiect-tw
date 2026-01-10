const { Pool } = require('pg');

module.exports = {
  adapter: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
};
