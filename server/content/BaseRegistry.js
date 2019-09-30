const Promise = require('bluebird');

const PATHS = {
  CUSTOM: '../../client/components',
  EXTENSION: '../../extensions'
};

module.exports = class {
  constructor(type, extensions, basePath) {
    this._registry = [];
    this._type = type;
    this._extensions = extensions;
    this._basePath = basePath;
  }

  async initialize() {
    await Promise.map(this._extensions, path => this.load(path));
    const extensions = await this.loadExtensionList();
    await Promise.map(extensions, path => this.load(path, true));
  }

  async load(path, isExtension) {
    try {
      this._registry.push(await require(this.getFullPath(path, isExtension)));
    } catch (_) {
      console.info(`${path} does not have a custom statics method.`);
    }
  }

  getFullPath(path, isExtension) {
    const basePath = isExtension ? PATHS.EXTENSION : PATHS.CUSTOM;
    return `${basePath}/content-${this._type}s/${path}/util`;
  }

  loadExtensionList() {
    try {
      return require(this._basePath);
    } catch (_) {
      console.log(`No ${this._type} extensions loaded!`);
      return [];
    }
  }
};
