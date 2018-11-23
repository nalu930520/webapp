import pathToRegexp from 'path-to-regexp'
import { onSendConfirm } from '../services/sendreceive.js'
import { routerRedux } from 'dva/router'
import store from 'store'

export default {
  namespace: 'sendConfirm',
  state: {
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        const match =  pathToRegexp('/sendreceive/sendConfirm').exec(location.pathname)
        if (match) {
          dispatch({ type: 'onConfirm' })
        }
      })
      
    }
  },
  effects: {
    *onConfirm ({ payload }, { call, put }) {
      const confirmInfo = yield call(onSendConfirm)
      if (confirmInfo.ret === 0) {
        if (confirmInfo.sn === store.get('SNcode')) {
          yield put(routerRedux.push(`/sendreceive/sendSuccess/${confirmInfo.sn}`))
        }
      }
    },
  },
  reducers: {
  }
};
