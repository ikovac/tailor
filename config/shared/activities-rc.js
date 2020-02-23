'use strict';

const CONTENT_CONTAINERS = [{
  type: 'INTRO',
  label: 'Introduction',
  types: ['HTML', 'IMAGE', 'VIDEO'],
  displayHeading: true
}, {
  type: 'PAGE',
  label: 'Page'
}, {
  type: 'PERSPECTIVE',
  label: 'Perspective',
  multiple: true
}, {
  type: 'EXAM',
  templateId: 'EXAM',
  label: 'Exam',
  displayHeading: true,
  multiple: true,
  required: false,
  publishedAs: 'exam',
  config: {
    objectives: ['DEFAULT_SCHEMA/TOPIC']
  }
}];

const SCHEMAS = [{
  id: 'DEFAULT_SCHEMA',
  name: 'Sample course',
  meta: [],
  structure: [{
    level: 1,
    type: 'COMPETENCY',
    subLevels: ['OBJECTIVE'],
    label: 'Competency',
    color: '#42A5F5',
    contentContainers: ['INTRO', 'EXAM'],
    hasAssessments: false,
    relationships: [{
      type: 'prerequisites',
      label: 'Prerequisites',
      placeholder: 'Select prerequisites'
    }],
    meta: [{
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description',
      placeholder: 'Click to add...',
      validate: { max: 250 }
    }]
  }, {
    level: 2,
    type: 'OBJECTIVE',
    subLevels: ['TOPIC'],
    label: 'Learning Objective',
    color: '#66BB6A',
    contentContainers: [],
    hasAssessments: false,
    relationships: [{
      type: 'prerequisites',
      label: 'Prerequisites',
      placeholder: 'Select prerequisites'
    }],
    meta: [{
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description',
      placeholder: 'Click to add...',
      validate: { required: false, max: 250 }
    }]
  }, {
    level: 3,
    type: 'TOPIC',
    label: 'Topic',
    color: '#EC407A',
    isObjective: true,
    contentContainers: ['PERSPECTIVE'],
    hasAssessments: true,
    relationships: [{
      type: 'prerequisites',
      label: 'Prerequisites',
      placeholder: 'Select prerequisites'
    }],
    meta: [{
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description',
      placeholder: 'Click to add...',
      validate: { required: false, max: 250 }
    }]
  }],
  tesMeta: [{
    type: 'ASSESSMENT',
    label: 'Assessment',
    meta: [{
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description'
    }]
  }]
}];

module.exports = {
  CONTENT_CONTAINERS,
  SCHEMAS
};
