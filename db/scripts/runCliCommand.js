const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = command => {
  exec(`sequelize-cli ${command}`, {maxBuffer: 1024 * 500})
    .then(() => console.info('Done!'))
    .catch(ex => {
      console.error('ex: ', ex);
    });
};
