import { routerRedux } from 'dva/router';
import { accountLogin, accountLogout } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {staticFn} from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: response.success,
          currentAuthority: 'user', // 权限控制
        },
        // payload: response,
      });
      // Login successfully
      if (response.success) {
        const projectKey = staticFn().project_key;
        localStorage.setItem(`${projectKey}_uid`, response.data.id);
        localStorage.setItem(`${projectKey}_secret`, response.data.secret);
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { call, put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        const response = yield call(accountLogout);
        const projectKey = staticFn().project_key;
        localStorage.setItem(`${projectKey}_uid`, '');
        localStorage.setItem(`${projectKey}_secret`, '');
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: '',
            currentAuthority: '',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
