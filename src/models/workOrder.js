import {queryWorkOrder} from '../services/api';

export default {
  namespace: 'workOrder',

  state: {
    data: [],
    total: '',
    detail: {
      cardamagesChange: [],
      cardamagesRepair: [],
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
          total: response.total,
        }
      });
    },
    * fetchDetail({payload}, {call, put}) {
      payload.api = 'load';
      payload.params.loadRelate = true;
      const response = yield call(queryWorkOrder, payload);
      const cardamagesChange = response.data.cardamagesChange;
      const cardamagesRepair = response.data.cardamagesRepair;
      for (let i = 0, len = cardamagesChange.length; i < len; i++) {
        cardamagesChange[i].key = cardamagesChange[i].id;
      }
      for (let i = 0, len = cardamagesRepair.length; i < len; i++) {
        cardamagesRepair[i].key = cardamagesRepair[i].id;
      }
      yield put({
        type: 'save',
        saveData: {
          detail: response.data,
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
