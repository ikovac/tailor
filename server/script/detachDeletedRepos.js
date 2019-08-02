const { getRepositoryAttrs, getRepositoryCatalog } = require('../shared/publishing/helpers');
const { Course } = require('../shared/database');
const each = require('lodash/each');
const omit = require('lodash/omit');
const find = require('lodash/find');
const storage = require('../shared/storage');

Course.findAll({ paranoid: false })
  .then(repositories => repositories.length && updateRepositoryCatalog(repositories))
  .then(() => console.info('Catalog updated!'))
  .finally(() => process.exit(0));

function updateRepositoryCatalog(repositories) {
  console.info('Fetching repo catalog from S3...');
  return getRepositoryCatalog().then(catalog => {
    console.info('Catalog fetched ...');
    console.info('Updating deleted repos ...');
    each(catalog, repo => {
      let existing = find(repositories, { id: repo.id });
      const repositoryData = {
        ...getRepositoryAttrs(existing),
        detachedAt: existing.deletedAt
      };
      Object.assign(repo, omit(repositoryData, ['id']));
    });
    const data = Buffer.from(JSON.stringify(catalog), 'utf8');
    return storage.saveFile('repository/index.json', data);
  });
}
