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
        saveData: {
          data: response.data,
          total: response.total
        }
      });
    },
    * fetchDetail({payload}, {call, put}) {
      payload.api = 'load';
      const response = yield call(queryWorkOrder, payload);
      yield put({
        type: 'save',
        saveData: {
          detail: response.data
        }
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
        ...action.saveData
      };
    },
  },
};
