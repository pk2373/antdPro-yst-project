import request from './utils/request';
import { setAuthority } from './utils/authority';

export function init(callback) {
  request('/api/login/account', {
    method: 'POST',
    body: {},
  })
    .then(() => {
      setAuthority('admin');
      callback();
    });
}
