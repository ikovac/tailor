import { extractData } from './helpers';
import request from './request';

const urls = {
  root: '/tags'
};

function getTags() {
  return request.get(urls.root).then(extractData);
}

export default {
  getTags
};
