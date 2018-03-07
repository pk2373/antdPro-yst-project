import {queryWorkOrder} from '../services/api';

export default {
  namespace: 'workOrder',

  state: {
    data: [],
    total: '',
    detail: {
      advancedOperation1: [],
      advancedOperation2: [],
      advancedOperation3: [],
    },
  },

  effects: {
    * fetch({payload}, {call, put}) {
      payload.api = 'list';
      const response = yield call(queryWorkOrder, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * fetchDetail({payload}, {call, put}) {
      payload.api = 'load';
      const response = yield call(queryWorkOrder, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
    },
    * add({payload, callback}, {call, put}) {
      const response = yield call(queryWorkOrder, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    * remove({payload, callback}, {call, put}) {
      const response = yield call(queryWorkOrder, payload);
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
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload.data,
      };
    },
  },
};
