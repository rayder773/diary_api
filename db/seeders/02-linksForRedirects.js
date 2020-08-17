const data = require('../seeds/linksForRedirects.json');
const db = require('../index');

module.exports = db.describeSeeder('linksForRedirects', data);
