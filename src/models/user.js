import { queryCurrent } from '../services/api';
import { staticFn } from '../utils/utils';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const projectKey = staticFn().project_key;
      const _secret = localStorage.getItem(`${projectKey}_secret`);
      const params = {
        secret: _secret
      }
      const response = yield call(queryCurrent, { params: params });
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
