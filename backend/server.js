require('dotenv').config();
const app    = require('./app');
const db     = require('./config/database');

const PORT = process.env.PORT || 5000;

db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  connection.release();
  console.log('Database connected successfully');

  app.listen(PORT, () => {
    console.log(`WildSmiles API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
});
