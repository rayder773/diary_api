const models = require('../models');
const db = require('../index');
const {db: dbConfig} = require('../../configs')

models.sequelize
  .sync(false)
  .then(() => console.info('Done!'))
  .catch(ex => console.error('ex: ', ex))
  .finally(() => {
    db.closeConnection();
    process.exit();
  });
