import { getHash, getuUserInfo, confirmLogin } from '../services/login'
import { routerRedux } from 'dva/router'
import { apiURL, socketURL } from '../utils/config.js'
import socketIoClient from 'socket.io-client';
import store from 'store';
import Cookies from 'universal-cookie'
const cookies = new Cookies();
export default {
  namespace: 'login',
  state: {
    qrcodeUrl: '',
    userInfo: {},
  },
  subscriptions: {
    getHash ({ dispatch }) {
       dispatch({ type: 'getHashcode' })
    },
  },
  effects: {
    *getHashcode ({}, { put, call }) {
      const { value, expire } = yield call(getHash);
      if (value) {
        const qrcodeUrl= `${apiURL}/web/action?action=qrlogin&key=${value}`;
        yield put({ type: 'showQRcode', payload: { qrcodeUrl, expire } });
        yield put({ type: 'connectSocket', payload: { authToken: value} });
        yield put({ type: 'confirmLogin', payload: { authToken: value} });
      }
    },
    *connectSocket({ payload: authToken }, { call, put }) {
      const userInfo = yield call(getuUserInfo, authToken);
      store.set('userInfo', {
        userName: userInfo.nickname,
        userAvatar: userInfo.avatar,
        userMobile: userInfo.mobile,
        userCountryCode: userInfo.country_code,
      });
      yield put({ type: 'showuserInfo', payload: { userInfo }});
    },
    *confirmLogin({ payload: authToken }, { call, put }) {
      const getToken = yield call(confirmLogin,  authToken);
      cookies.set('mobi_token', getToken.token, { domain: '.mobi.me' });
      cookies.set('mobi_token', getToken.token, { domain: '.mobiapp.cn' });
      yield put(routerRedux.push('/myWallets'))
    }
  },
  reducers: {
    showQRcode (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    showuserInfo (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    }
  },
}
