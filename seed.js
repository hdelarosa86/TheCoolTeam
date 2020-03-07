const { db, Player } = require('./server/db');
const chalk = require('chalk');

const seed = () => {
  return db.sync({ force: true }).then(() =>
    Player.create({
      x: 600,
      y: 250,
      texture: 'atlas',
      frame: 3,
      name: 'Student',
      health: 20,
      maxHp: 0,
      points: 0,
      badge: 'Ultimate Badge',
      notify: 'on',
      level: '',
    })
  );
};

module.exports = seed;

// if (require.main === module) {
//   seed()
//     .then(() => {
//       console.log(chalk.greenBright("Successful seeding in pothos."));
//       db.close();
//     })
//     .catch(err => {
//       console.error(chalk.redBright("Error with seeding pothos!"));
//       console.error(err);
//       db.close();
//     });
// }