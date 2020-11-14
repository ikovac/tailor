'use strict';

const { authenticate } = require('./shared/auth');
const express = require('express');
const repository = require('./repository');
const retouchRoutes = require('image-service');
const storage = require('./shared/storage/storage.router');
const tag = require('./tag');
const user = require('./user');

const router = express.Router();
router.use(processBody);

// Public routes:
router.use(user.path, user.router);
// Retouch public routes
router.get(...getRetouchRoute('getOriginal'));
router.get(...getRetouchRoute('getTransformer'));

// Protected routes:
router.use(authenticate('jwt'));
router.use(repository.path, repository.router);
router.use(storage.path, storage.router);
router.use(tag.path, tag.router);
// Retouch private routes
router.post(...getRetouchRoute('upload'));

module.exports = router;

function processBody(req, _res, next) {
  const { body } = req;
  if (body && body.email) body.email = body.email.toLowerCase();
  next();
}

function getRetouchRoute(name) {
  const { path, routes } = retouchRoutes;
  return [path + routes[name].path, ...routes[name].handler];
}
