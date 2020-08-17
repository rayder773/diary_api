const {DataTypes} = require('sequelize');
const tableName = require('path').basename(__filename, '.js');

module.exports = sequelize => {
  const Model = sequelize.define(tableName, {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName,
  });

  return Model;
};


