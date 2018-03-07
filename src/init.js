import request from './utils/request';
import {setAuthority} from './utils/authority';

export function init(callback) {
  const _uid = localStorage.getItem('CXTravel_uid');
  if (_uid) {
    request('/business/public/api/islogin', {
      method: 'get',
      params: {
        uid: _uid,
      },
    })
      .then((res) => {
        if (res.success) {
          setAuthority('user');
        } else {
          setAuthority('');
        }
        callback();
      });
  } else {
    setAuthority('');
    callback();
  }
}
