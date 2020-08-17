require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const sanitizer = require('express-sanitizer');
// const db = require('./db');
// const rateLimiter = require('./util/rateLimiter');
// const checkCountries = require('./util/checkCountries')
const router = require('./routes');
const {server, middlewares, db: dbConfig} = require('./configs');
const app = express();
// const cookieParser = require('cookie-parser');

// app.use(rateLimiter);
// app.use(checkCountries);
app.use(logger('combined'));
app.use(cors());
// app.use(bodyParser.urlencoded(middlewares.bodyParser.urlencoded));
// app.use(bodyParser.json(middlewares.bodyParser.json));
app.use(helmet());
app.use(sanitizer());
// app.use(express.static('client/dist'));
// app.use(cookieParser());
app.use(router);

app.use((err, req, res, next) => {
  if (!err) {
    err = {};
  }

  let status = err.status || 500
  status = parseInt(status);
  status = (typeof status !== 'number') ? 500 : status;

  return res
    .status(status)
    .json({
      success: false,
      error: err.error || err.message || 'Internal Server Error'
    });
});

const start = async () => {
  // try {
  //   if(dbConfig.auth) {
  //     await db.getConnection().authenticate();
  //   }

  //   console.log('Connection to database is established');
  // } catch (ex) {
  //   console.error('Unable to connect to the database:', ex);
  // }

  app.listen(server.port, () => console.log(`Server has started: http://${server.host}:${server.port}`));
};

start();
