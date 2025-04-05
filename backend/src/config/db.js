const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.YUGABYTE_DB,
  process.env.YUGABYTE_USER,
  process.env.YUGABYTE_PASSWORD,
  {
    host: process.env.YUGABYTE_HOST,
    port: process.env.YUGABYTE_PORT || 5433,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

// Connect to YugabyteDB
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`YugabyteDB Connected: ${process.env.YUGABYTE_HOST}`);
    
    // Sync models with database (in development only)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synced');
    }
    
    return sequelize;
  } catch (error) {
    console.error(`Error connecting to YugabyteDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize }; 