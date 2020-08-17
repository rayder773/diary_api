const models = require('../models');
const db = require('../index');

models.sequelize
  .sync({forse: true})
  .then(() => console.info('Done!'))
  .catch(ex => console.error('ex: ', ex))
  .finally(() => {
    db.closeConnection();
    process.exit();
  });
