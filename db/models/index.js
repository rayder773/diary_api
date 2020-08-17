const fs = require('fs');
const path = require('path');
const sequelize = require('../index').getConnection();
const files = fs.readdirSync(__dirname);
const excludedFiles = ['.', '..', 'index.js'];
const models = {};

for (const fileName of files) {
  if (!excludedFiles.includes(fileName) && (path.extname(fileName) === '.js')) {
    const modelFile = require(path.join(__dirname, fileName))(sequelize);
    models[modelFile.getTableName()] = modelFile;
  }
}

Object
  .values(models)
  .forEach(model => {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  });

models.sequelize = sequelize;

module.exports = models;
