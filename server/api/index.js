const router = require('express').Router();
const chalk = require('chalk');
const { Player } = require('../db/index');

router.get('/', (req, res, next) => {
  Player.findAll({
    limit: 1,
    order: [['createdAt', 'DESC']],
  })
    .then(games => res.status(200).send(games))
    .catch(err => {
      res.status(404);
      chalk.red(console.error(err));
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { body } = req;
  Player.create(body)
    .then( () => res.status(200).send('Success'))
    .catch(err => {
      res.status(404);
      chalk.red(console.error(err));
      next(err);
    });
});

module.exports = router;
