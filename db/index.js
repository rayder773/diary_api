const Sequelize = require('sequelize');
const {db} = require('../configs');

let connection;

const getConnection = () => {
  if (!connection) {

    try {
      connection = new Sequelize(
        db.database,
        db.username,
        db.password,
        db
      );
    } catch (ex) {
      process.exit(1);
    }
  }

  return connection;
};

const closeConnection = () => {
  if (connection && (typeof connection.close === 'function')) {
    try {
      connection.close();
      connection = null;
    } catch (ex) {
    }
  }
};

const describeSeeder = (tableName, data = []) => {
  return {
    up: queryInterface => queryInterface.bulkInsert(tableName, data, {}),
    down: queryInterface => queryInterface.bulkDelete(tableName, null)
  };
};

module.exports = {
  getConnection,
  closeConnection,
  describeSeeder
};
