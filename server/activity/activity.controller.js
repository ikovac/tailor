'use strict';

const BaseController = require('../base.controller');
const activityModel = require('./activity.model').model;
const io = require('../shared/io');
const locals = io.locals;

class ActivityController extends BaseController {
  constructor(model = activityModel, resourceKey = 'activityKey') {
    super(model, resourceKey);

    this.reorder = this.reorder.bind(this);
  }

  create(req, res, next) {
    const courseKey = locals.load(req, 'course._key');
    const activity = {
      name: req.body.name,
      type: req.body.type,
      courseKey,
      parentKey: req.body.parentKey,
      position: req.body.position
    };
    this.model
      .create(activity)
      .then(data => {
        io.setCreated(res, data);
        next();
      })
      .catch(next);
  }

  show(req, res, next) {
    const courseKey = locals.load(req, 'course._key');
    this.model
      .getByKey(courseKey, req.params.activityKey)
      .then(data => {
        if (data) {
          io.setOK(res, data);
          return next();
        }

        // TODO(matej): if other model methods return empty results, add a new
        // error class, make an instance, and pass it to next().
        return res.status(404).json();
      })
      .catch(next);
  }

  list(req, res, next) {
    const courseKey = locals.load(req, 'course._key');
    this.model
      .getMany(courseKey)
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  remove(req, res, next) {
    const courseKey = locals.load(req, 'course._key');
    this.model
      .removeByKey(courseKey, req.params.activityKey)
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  reorder(req, res, next) {
    const courseKey = locals.load(req, 'course._key');
    this.model
      .reorder(courseKey, req.params.activityKey, req.body.position)
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }
}

module.exports = {
  Controller: ActivityController,
  controller: new ActivityController()
};