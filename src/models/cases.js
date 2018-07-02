import { commonQuery } from '../services/api';

export default {
  namespace: 'cases',

  state: {
    data: {
      list:[],
    },
    total: '',
  },

  effects: {
    *fetch(payload, { call, put }) {
      payload.url = '/ServiceBaseController/Cases/list';
      const response = yield call(commonQuery, payload);
      yield put({
        type: 'save',
        payload: {
          data: {
            list: response.data,
          },
          total: response.total,
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
