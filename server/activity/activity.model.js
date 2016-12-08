'use strict';

const Joi = require('joi');
const database = require('../shared/database');
const BaseModel = require('../base.model');
const action = require('./action');

const db = database.db;
const ACTIVITY_COLLECTION = database.collection.ACTIVITY;

const activitySchema = Joi.object().keys({
  name: Joi.string().min(3).max(100).required(),
  type: Joi.string(), // TODO(matej): type should be one of predefined types
  courseKey: Joi.string().regex(/[0-9]+/).required(),
  parentKey: Joi.string().allow(null).regex(/[0-9]+/).required(),
  position: Joi.number().integer().min(0)
});

class ActivityModel extends BaseModel {
  constructor(db, collectionName = ACTIVITY_COLLECTION, schema = activitySchema) {
    super(db, collectionName, schema);
  }

  create(activity) {
    return this
      .validate(activity)
      .then(validActivity => this.db.transaction(
        {
          read: ACTIVITY_COLLECTION,
          write: ACTIVITY_COLLECTION
        },
        String(action.INSERT),
        {
          newActivity: validActivity,
          activityCollection: ACTIVITY_COLLECTION
        }));
  }

  getByKey(courseKey, activityKey) {
    const query = `
      FOR activity IN @@activityCollection
        FILTER activity.courseKey == @courseKey AND
               activity._key == @activityKey
        RETURN activity`;
    const bindVars = {
      courseKey,
      activityKey,
      '@activityCollection': ACTIVITY_COLLECTION
    };

    return this.db
      .query(query, bindVars)
      .then(cursor => cursor.next());
  }

  getMany(courseKey) {
    const query = `
      FOR activity IN @@activityCollection
        FILTER activity.courseKey == @courseKey
        RETURN activity`;
    const bindVars = {
      courseKey,
      '@activityCollection': ACTIVITY_COLLECTION
    };

    return this.db
      .query(query, bindVars)
      .then(cursor => cursor.all());
  }
}

module.exports = {
  schema: activitySchema,
  Model: ActivityModel,
  model: new ActivityModel(db)
};
