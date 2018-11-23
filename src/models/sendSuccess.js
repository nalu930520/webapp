import pathToRegexp from 'path-to-regexp'
import { getDetailtx } from '../services/sendreceive.js'
import { routerRedux } from 'dva/router'
import store from 'store'

export default {
  namespace: 'sendSuccess',
  state: {
    transactionDetail: {
      amount: 0,
      currencyCode: 'btc',
      payeeMobiName: '',
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      if(!store.get('SNcode')) {
        dispatch(routerRedux.push('/sendreceive'))
      }
      history.listen((location) => {
        const match =  pathToRegexp('/sendreceive/sendSuccess/:SNcode').exec(location.pathname)
        if (match) {
          dispatch({ type: 'fetchTransaction', payload: { SN: match[1] } })
        }
      })
    }
  },
  effects: {
    *fetchTransaction ({ payload }, { call, put }) {
      const resTransactionDetail = yield call(getDetailtx, payload)
      if (resTransactionDetail.ret === 1) {
        const transactionDetail = resTransactionDetail.transactions[0]

        if ( transactionDetail.status !== 2
             && transactionDetail.status !== 4
             && transactionDetail.status !== 8
             && transactionDetail.status !== 9
           ) {
          yield put(routerRedux.push('/sendreceive'))
          return
        }
        yield put({ type: 'showTransactionDetail', payload: transactionDetail })
        store.remove('SNcode')
      }
    }
  },
  reducers: {
    showTransactionDetail(state, action) {
      return {
        ...state, 
        transactionDetail: {
          ...action.payload
        }
      }
    }
  }
};
