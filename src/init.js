import request from './utils/request';
import { setAuthority } from './utils/authority';

export function init(callback) {
  request('/public/api/getAuths', {
    method: 'POST',
    body: {},
  })
    .then(() => {
      setAuthority('admin');
      callback();
    });
}
