const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env. DB_NAME || 'conference_management',
  port: process. env.DB_PORT || 3306,
};

const connectDB = async () => {
  try {
    console.log('📦 Database connection will be implemented here');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error. message);
    process.exit(1);
  }
};

module.exports = { dbConfig, connectDB };
