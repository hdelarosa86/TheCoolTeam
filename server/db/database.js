const chalk = require('chalk');
const Sequelize = require('sequelize');
const pkg = require('../../package.json');

const dbName = process.env.NODE_ENV === 'test' ? `${pkg.name}-test` : pkg.name;

let dbConfig;

if (process.env.NODE_ENV === 'production') {
  dbConfig = {
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
} else {
  dbConfig = {
    logging: false,
  };
}

console.log(chalk.yellow(`Opening database connection to ${dbName}`));

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`,
  dbConfig
);

module.exports = db;
