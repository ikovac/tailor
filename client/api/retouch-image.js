import request from './request';

const urls = {
  root: '/images'
};

function upload(formData) {
  const headers = {
    'Content-Type': 'multipart/form-data'
  };
  return request.post(urls.root, formData, { headers }).then(res => res.data);
}

export default { upload };
