'use strict';

const { authenticate } = require('./shared/auth');
const express = require('express');
const repository = require('./repository');
const storage = require('./shared/storage/storage.router');
const tag = require('./tag');
const user = require('./user');

const retouchOptions = {
  storage: {
    strategy: 's3',
    s3: {
      awsAccessKey: 'AKIAIIH5RHA5ACI7TKIA',
      awsSecretKey: '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',
      awsBucket: 'ee-image-service'
    }
  }
};
const retouchRoutes = require('image-service')(retouchOptions);

const router = express.Router();
router.use(processBody);

// Public routes:
router.use(user.path, user.router);
// Retouch public routes
router.use('/images', retouchRoutes.get);

// Protected routes:
router.use(authenticate('jwt'));
router.use(repository.path, repository.router);
router.use(storage.path, storage.router);
router.use(tag.path, tag.router);
// Retouch private routes
router.use('/images', retouchRoutes.upload);

module.exports = router;

function processBody(req, _res, next) {
  const { body } = req;
  if (body && body.email) body.email = body.email.toLowerCase();
  next();
}
