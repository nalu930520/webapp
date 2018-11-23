import pathToRegexp from 'path-to-regexp'
import { fetchUserTos, acceptTos } from '../services/tos'

export default {
  namespace: 'agree-tos',
  state: {
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        const match =  pathToRegexp('/agree-tos').exec(location.pathname)
        if (match) {
          dispatch({ type: 'agreeTos' })
        }
      })
      
    }
  },
  effects: {
    *agreeTos({ payload }, { call, put }) {
      const userVersion = yield call(fetchUserTos)
      if(userVersion.ret === 1) {
        const acceptTosRes = yield call(acceptTos, { version: userVersion.tos.version })
        if (acceptTosRes.ret === 1) {
          window.location.href= '/'
        }
      }
    },
  },
  reducers: {

  }
};
