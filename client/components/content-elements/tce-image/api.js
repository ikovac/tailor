import axios from 'axios';

const urls = {
  base: 'http://localhost:3300/api/v1/images'
};

function upload(formData) {
  const headers = {
    'Content-Type': 'multipart/form-data'
  };
  return axios.post(urls.base, formData, { headers }).then(res => res.data);
}

export default { upload };
