const {DataTypes, literal} = require('sequelize');
const tableName = require('path').basename(__filename, '.js');
const {DOMAIN_STATUSES} = require('../../util/constants');

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
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        isIn: [Object.values(DOMAIN_STATUSES)],
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: literal(`ROUND(UNIX_TIMESTAMP(NOW(3)) * 1000)`),
    },
    updatedAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: literal(`ROUND(UNIX_TIMESTAMP(NOW(3)) * 1000)`),
    },
  }, {
    sequelize,
    tableName,
  });

  return Model;
};


