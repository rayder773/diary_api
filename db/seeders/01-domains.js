const data = require('../seeds/domains.json');
const db = require('../index');

module.exports = db.describeSeeder('domains', data);
