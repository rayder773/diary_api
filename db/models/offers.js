const {DataTypes, literal} = require('sequelize');
const tableName = require('path').basename(__filename, '.js');

module.exports = sequelize => {
  const Model = sequelize.define(tableName, {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offer: {
      type: DataTypes.FLOAT,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    laundryRegulation: {
      type: DataTypes.STRING,
    },
    beneficialBuyer: {
      type: DataTypes.STRING,
    },
    company: {
      type: DataTypes.STRING,
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



