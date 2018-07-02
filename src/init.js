import request from './utils/request';
import {staticFn} from './utils/utils';
import {setAuthority} from './utils/authority';

export async function init(callback) {
  const projectKey = staticFn().project_key;
  const _uid = localStorage.getItem(`${projectKey}_uid`);
  if (_uid) {
    callback();  // 测试测试
    return;
    const res = await request('/business/public/api/islogin', {
      method: 'get',
      params: {
        uid: _uid,
      },
    });
    if (res.success) {
      setAuthority('user');
    } else {
      setAuthority('');
    }
    callback();
  } else {
    setAuthority('');
    callback();
  }
}
