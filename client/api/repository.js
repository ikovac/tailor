import { extractData } from './helpers';
import request from './request';

const urls = {
  root: '/repositories',
  resource: id => `${urls.root}/${id}`,
  contentElements: id => `${urls.resource(id)}/content-elements`,
  publish: id => `${urls.resource(id)}/publish`,
  users: (id, userId = '') => `${urls.resource(id)}/users/${userId}`,
  tags: (id, tagId = '') => `${urls.resource(id)}/tags/${tagId}`
};

function save(repository) {
  return request.post(urls.root, repository).then(extractData);
}

function getRepositories(params) {
  return request.get(urls.root, { params }).then(extractData);
}

function getContentElements({ id, ...params }) {
  return request.get(urls.contentElements(id), { params }).then(extractData);
}

function getUsers(repositoryId, params) {
  return request
    .get(urls.users(repositoryId), { params })
    .then(extractData);
}

function upsertUser(repositoryId, data) {
  return request
    .post(urls.users(repositoryId), data)
    .then(res => extractData(res).user);
}

function removeUser(repositoryId, userId) {
  return request
    .delete(urls.users(repositoryId, userId))
    .then(res => res.data);
}

function publishRepositoryMeta(id) {
  return request.post(urls.publish(id)).then(res => res.data);
}

function addTag({ name, repositoryId }) {
  return request.post(urls.tags(repositoryId), { repositoryId, name })
    .then(extractData);
}

function removeTag({ repositoryId, tagId }) {
  return request.delete(urls.tags(repositoryId, tagId))
    .then(extractData);
}

export default {
  getRepositories,
  getContentElements,
  save,
  getUsers,
  upsertUser,
  removeUser,
  publishRepositoryMeta,
  addTag,
  removeTag
};
