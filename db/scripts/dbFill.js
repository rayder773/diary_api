const runCliCommand = require('./runCliCommand');

try {
  runCliCommand('db:seed:all');
} catch (ex) {
  console.error('Exception:', ex);
}
