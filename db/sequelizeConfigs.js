const {db} = require('../configs');

module.exports = {
  development: db,
  test: db,
  production: db
};
