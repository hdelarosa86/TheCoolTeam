const express = require('express');
const path = require('path');
const { db } = require('./db');
const chalk = require('chalk');

//if (process.env.NODE_ENV !== 'production') require('dotenv').config();

//initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// body parsing middleware
app.use(express.json());

//adding this middleware just to keep track of api calls as our app gets larger
app.use((req, res, next) => {
  console.log(chalk.magenta(`${req.method} ${req.path}`));
  next();
});

// static middleware
app.use(express.static(path.join(__dirname, '../dist')));


// api routes
//app.use('/api', require('./api'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
}); // Send index.html for any other requests

const startServer = () =>
  new Promise(res => {
    app.listen(PORT, () => {
      console.log(chalk.cyan(`I'm running on http://localhost:${PORT}`));
      res(true);
    });
  });

if (process.env.NODE_ENV === 'production') {
  db.sync()
    .then(startServer)
    .then(() => {
      console.log(
        chalk.greenBright('Application successfully started in production')
      );
    })
    .catch(e => {
      console.log(
        chalk.magentaBright('Application failed to start in production')
      );
      console.error(e);
      process.exit(1);
    });
} else {
  db.sync()
    //.then(seed)
    .then(startServer)
    .then(() => {
      console.log(
        chalk.greenBright('Application successfully started in development')
      );
    })
    .catch(e => {
      console.log(
        chalk.magentaBright('Application failed to start in development')
      );
      console.error(e);
      process.exit(1);
    });
}
