import { getCountries, authMobile, getCaptcha, verifyCaptcha, setPin } from '../services/register'
import { routerRedux } from 'dva/router'
import { message } from 'antd';
import { apiURL } from '../utils/config.js'
import socketIoClient from 'socket.io-client';
import store from 'store';
import pathToRegexp from 'path-to-regexp'
import Cookies from 'universal-cookie'
const cookies = new Cookies();

export default {
  namespace: 'register',
  state: {
    countries: '',
    mobileStatus: '',
    captchaStatus: '',
    token: '',
    step: 0,
    registerLoading: false,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/register').exec(pathname)
        if (match) {
          dispatch({ type: 'getCountriesCode'})
        }
      })
    },
  },
  effects: {
    *getCountriesCode ({}, { put, call }) {
      const { countries } = yield call(getCountries);
      if(countries){
        yield put({
          type: 'getCountriesSuccess',
          payload: {
            countries: countries,
          },
        })
      }
    },
    *authMobile({ payload: params }, { put, call, select }) {
      const captcha = yield call(authMobile, params);
      const i18n = yield select(state => state.i18n)
      if(captcha.ret === 1 ){
        yield put({
          type: 'authMobileSuccess',
          payload: {
            mobileStatus: captcha.set_pin ? 'success' : i18n.messages.register_error_already_register,
          }
        })
        cookies.set('mobi_token', captcha.token, { domain: '.mobi.me' });
        cookies.set('mobi_token', captcha.token, { domain: '.mobiapp.cn' });
      }else{
        message.error(captcha.error);
      }

    },
    *getCaptcha({ payload: params }, { put, call }) {
      const captcha = yield call(getCaptcha, params);
      if(captcha.ret === 1){
        yield put({
          type: 'getCaptchaSuccess',
        })
      }else{
        message.error(captcha.error);
      }
    },
    *verifyCaptcha({ payload: params }, { put, call, select}) {
      const captcha = yield call(verifyCaptcha, params);
      const i18n = yield select(state => state.i18n)
      if(captcha.ret !== 1){
        yield put({
          type: 'verifyCaptchaBack',
          payload: {
            captchaStatus: i18n.messages.register_error_captcha,
          }
        })
      }else{
        yield put({
          type: 'verifyCaptchaBack',
          payload: {
            captchaStatus: 'success',
          }
        })
      }
    },
    *setPin({ payload: params }, { put, call }) {
      yield put({
        type: 'save',
        payload: {
          registerLoading: true,
        }
      })
      const pin = yield call(setPin, params);
      yield put({
        type: 'save',
        payload: {
          registerLoading: false,
        }
      })
      if(pin.ret !== 1){
        message.config({
          top: 100,
        });
        message.error(pin.error);
      }else{
        yield put({
          type: 'setPinSuccess',
          payload :{
            step: 2,
          }
        })
        cookies.remove('mobi_token', { domain: '.mobi.me' });
        cookies.remove('mobi_token', { domain: '.mobiapp.cn' });
      }
    }
  },
  reducers: {
    save (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    getCountriesSuccess (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    authMobileSuccess (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    getCaptchaSuccess (state, action) {
      return {
        ...state,
      }
    },
    verifyCaptchaBack (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    setPinSuccess (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    retStatus(state) {
      return {
        ...state,
        mobileStatus: '',
        captchaStatus: '',
      }
    },
    nextStep(state, action){
      return{
        ...state,
        ...action.payload,
      }
    }
  },
}
