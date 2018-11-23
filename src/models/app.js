import { query, logout, getHash, fetchCurrencies, fetchCoutrys } from '../services/app'
import * as menusService from '../services/menus'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import store from 'store'
import { EnumRoleType } from 'enums'
const { prefix } = config
import Cookies from 'universal-cookie'
const cookies = new Cookies();

export default {
  namespace: 'app',
  state: {
    userInfo: {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: '',
        name: 'nav_footer_label_accounts',
      },
      {
        id: 2,
        icon: '',
        mpid: 1,
        name: 'general_menu_text_mywallets',
        route: '/myWallets',
      },
      {
        id: 3,
        icon: '',
        mpid: 1,
        name: 'general_menu_text_send_receive',
        route: '/sendreceive',
      },
      {
        id: 4,
        icon: '',
        name: 'nav_footer_label_support',
      },
      {
        id: 5,
        bpid: 3,
        mpid: 4,
        name: 'nav_footer_link_fees',
        route: 'https://www.mobi.me/fees',
        redirect: true,
      },
      {
        id: 6,
        bpid: 3,
        mpid: 4,
        name: 'nav_footer_link_faq',
        route: 'https://www.mobi.me/faq',
        redirect: true,
      },
      {
        id: 7,
        bpid: 3,
        mpid: 4,
        name: 'nav_footer_link_tos',
        route: 'https://www.mobi.me/terms',
        redirect: true,
      },
      {
        id: 8,
        bpid: 3,
        mpid: 4,
        name: 'nav_footer_link_pp',
        route: 'https://www.mobi.me/privacy-policy',
        redirect: true,
      },
      {
        id: 9,
        bpid: 3,
        mpid: 4,
        name: 'nav_footer_link_contact',
        route: 'mailto:support@mobi.me',
        redirect: true,
      },
    ],
    menuPopoverVisible: false,
    siderFold: false,
    darkTheme: true,
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({ type: 'getUserInfo' })
      dispatch({ type: 'fetchCurrency' })
      dispatch({ type: 'fetchCountrys' })
    }
  },
  effects: {
    *getUserInfo ({ payload }, { call, put, select }) {
      const userInfo = store.get('userInfo');
      const userToken = cookies.get('mobi_token');
      const locationBeforeTransitions = yield select(state => state.routing.locationBeforeTransitions)
      if(locationBeforeTransitions.pathname === '/register'){
        return;
      }else {
        if (userInfo && userToken) {
          yield put({ type: 'showUserInfo', payload: userInfo })
          if (locationBeforeTransitions.pathname === '/') {
            yield put(routerRedux.push('/myWallets'))
          }
        } else {
          yield put(routerRedux.push('/login'))
        }
      }
    },
    *fetchCurrency ({}, { call, put }) {
      const currencies = yield call(fetchCurrencies)
      store.set('currencies', currencies.currencies)
    },
    *fetchCountrys ({}, { call, put }) {
      const counrtys = yield call(fetchCoutrys)
      store.set('countrys', counrtys.countries)
    }
  },
  reducers: {
    showUserInfo (state, { payload: userInfo }) {
      return {
        ...state,
        userInfo,
      }
    },
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
