'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const origin = require('./shared/origin');
const path = require('path');
// eslint-disable-next-line require-sort/require-sort
require('express-async-errors');

/* eslint-disable require-sort/require-sort */
const auth = require('./shared/auth');
const config = require('../config/server');
const logger = require('./shared/logger')();
const router = require('./router');
/* eslint-enable */

const {
  STORAGE_PATH,
  RETOUCH_STORAGE_STRATEGY,
  RETOUCH_LOCAL_STORAGE_STORE_PATH,
  RETOUCH_LOCAL_STORAGE_SERVE_PATH
} = process.env;

const app = express();
app.use(helmet());
app.use(cors({ origin: config.auth.corsAllowedOrigins, credentials: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth.initialize());
app.use(origin());
app.use(express.static(path.join(__dirname, '../dist/')));
if (STORAGE_PATH) app.use(express.static(STORAGE_PATH));
if (RETOUCH_STORAGE_STRATEGY === 'local') {
  const storagePath = path.join(__dirname, '../', RETOUCH_LOCAL_STORAGE_STORE_PATH);
  const staticServePath = path.join('/', RETOUCH_LOCAL_STORAGE_SERVE_PATH);
  app.use(staticServePath, express.static(storagePath));
}

// Mount main router.
app.use('/api/v1', requestLogger, router);

// Global error handler.
app.use(errorHandler);

// Handle non-existing routes.
app.use((req, res, next) => res.status(404).end());

module.exports = app;

function requestLogger(req, res, next) {
  logger.info({ req });
  next();
}

function errorHandler(err, req, res, next) {
  if (!err.status || err.status === 500) {
    res.status(500).end();
    logger.error({ err });
    return;
  }
  const { status, message } = err;
  res.status(err.status).json({ error: { status, message } });
}
