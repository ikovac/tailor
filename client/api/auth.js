import request from './request';

const urls = {
  login: '/users/login',
  forgotPassword: '/users/forgot-password',
  resetPassword: '/users/reset-password'
};

function login(credentials) {
  return request
    .post(urls.login, credentials)
    .then(res => res.data.data)
    .then(({ token, user }) => {
      window.localStorage.setItem('JWT_TOKEN', token);
      return user;
    });
}

function logout() {
  window.localStorage.removeItem('JWT_TOKEN');
  // TODO(underscope): Add server side invalidation
  return Promise.resolve(true);
}

function forgotPassword(email) {
  return request.post(urls.forgotPassword, { email });
}

function resetPassword(token, password) {
  return request.post(urls.resetPassword, { token, password });
}

export default {
  login,
  logout,
  forgotPassword,
  resetPassword
};
