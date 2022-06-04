const chalk = require('chalk');
const Sequelize = require('sequelize');
const pkg = require('../../package.json');

const dbName = process.env.NODE_ENV === 'test' ? `${pkg.name}-test` : pkg.name;

console.log(chalk.yellow(`Opening database connection to ${dbName}`));

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`,
  {
    logging: false,
    dialectOptions: {
      ssl: {
        require: true, // This will help you. But you will see nwe error
        rejectUnauthorized: false, // This line will fix new error
      },
   },
  }
);

module.exports = db;
