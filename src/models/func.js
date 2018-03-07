import {queryFunc} from '../services/api';

export default {
  namespace: 'func',

  state: {
    data: [],
    total: '',
  },

  effects: {
    * fetch({payload}, {call, put}) {
      const response = yield call(queryFunc, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add({payload, callback}, {call, put}) {
      const response = yield call(queryFunc, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * remove({payload, callback}, {call, put}) {
      const response = yield call(queryFunc, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
        total: action.payload.total,
      };
    },
  },
};
