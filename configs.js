require('dotenv').config();
const {MAILER, DB, ALLOWED_COUNTRIES} = require('./util/constants');
const normalizePort = require('./util/normalizePort');

const {
  PORT = '3000',
  DB_HOST = '0.0.0.0',
  DB_USERNAME = 'root',
  DB_PASSWORD = 1,
  DB_DATABASE = 'diary',
  DB_PORT = '5432',
  DB_AUTH = true,
  MAILER_ENABLED = MAILER.ENABLED.YES,
  MAILER_API_KEY = null,
  MAILER_DOMAIN = null,
  MAILER_TO = null,
} = process.env;

const port = normalizePort(PORT);
const dbPort = normalizePort(DB_PORT);

if ((PORT && !port) || (DB_PORT && !dbPort)) {
  console.error(23, __filename, '"PORT" or "DB_PORT" environment variable is specified with wrong value');
  process.exit(1);
  return;
}

module.exports = {
  server: {
    host: '0.0.0.0',
    port: port
  },
  db: {
    dialect: 'postgres',
    host: DB_HOST,
    port: dbPort,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    logging: false,
    timeout: 30 * 1000,  // ms
    timezone: '+00:00',
    migrationStorageTableName: 'migrations',
    define: {
      dialectOptions: {
        collate: 'utf8mb4_general_ci',
        useUTC: true
      },
      charset: 'utf8mb4',  // this charset is required for storing any special chars in DB
      underscored: false,
      timestamps: false,
      paranoid: false
    },
    pool: {
      max: 10,  // maximum opened active connections to DB
      min: 1,  // minimum opened active connections to DB
      idle: 30000  // after this time an inactive connection will be closed, ms
    },
    auth: DB_AUTH.toString() === DB.AUTH.YES.toString(),
  },
  middlewares: {
    rateLimit: {  // https://www.npmjs.com/package/rate-limiter-flexible
      points: 100,
      duration: 60,  // seconds
      blockDuration: 86400  // seconds
    },
    bodyParser: {  // https://www.npmjs.com/package/body-parser
      json: {
        limit: '4kb'
      },
      urlencoded: {
        limit: '4kb',
        parameterLimit: 2,
        extended: false
      }
    },
  },
  mailer: {
    enabled: MAILER_ENABLED.toString() === MAILER.ENABLED.YES.toString(),
    apiKey: MAILER_API_KEY,
    domain: MAILER_DOMAIN,
    to: MAILER_TO,
  },
  other: {
    testPrice: 200000,
    allowedCountries: ALLOWED_COUNTRIES
  }
}
