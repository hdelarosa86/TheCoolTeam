const router = require('express').Router();
const chalk = require('chalk');
const { Player } = require('../db/index');

router.get('/', (req, res, next) => {
  Player.findAll()
    .then(games => res.status(200).send(games))
    .catch(err => {
      res.status(404);
      console.error(err);
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { body } = req;
  console.log(req.body);
  Player.create({ body })
    .then(games => res.status(200).send('Success'))
    .catch(err => {
      res.status(404);
      console.error(err);
      next(err);
    });
});

module.exports = router;
