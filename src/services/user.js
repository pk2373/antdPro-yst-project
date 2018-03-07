import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/public/api/getAuths', {
    params: {
      secret: localStorage.getItem('CXTravel_secret'),
    },
  });
}
