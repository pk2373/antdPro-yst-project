import {query as queryUsers, queryCurrent} from '../services/user';
import { getReachStoreQrcode } from '../services/api';
import { getImgHost } from '../utils/utils';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    reachStoreQrcodeLink: '',
  },

  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        // payload: response,
        saveData: { list: response }
      });
    },
    * fetchCurrent(_, {call, put}) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'save',
        // payload: response.data,
        saveData: { currentUser: response.data }
      });
    },
    * getReachStoreQrcode( {payload, callback}, {call, put}) {
      const response = yield call(getReachStoreQrcode, payload);
      yield put({
        type: 'save',
        saveData: { reachStoreQrcodeLink: getImgHost() + response.data }
      });
      callback ? callback() : '';
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.saveData,
        // list: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
