import { parse } from 'qs'
import store from 'store';
import pathToRegexp from 'path-to-regexp'
import { getTransaction, fetchAnyUserInfo, fetchWalletInfo, queryWalletInfo } from '../services/transaction';
import { getcurrencyBycode } from '../utils'
import lodash from 'lodash'
export default {
  namespace: 'transaction',
  state: {
    showDetail: false,
    isLoading: true,
    currencyInfo: {
      id: 0,
      countryimg: '',
      countryName: '',
      balance: 0,
      currencyCode: '',
      equivalentBTC: 0,
      displayDecimalPlace: 0,
      address: '',
      walletType: '',
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        const match =  pathToRegexp('/myWallets/transaction/:code').exec(location.pathname)
        if (match) {
          dispatch({ type: 'isLoading' })
          dispatch({ type: 'fetchTransaction', payload: { currencyCode: match[1], limit: 100 } })
        }
      })
    }
  },
  effects: {
    *fetchTransaction ({
      payload,
    }, { call, put, select }) {
      const data = yield call(getTransaction, payload);
      const resWallet = yield call(queryWalletInfo, payload)
      const currency = getcurrencyBycode(resWallet.currencyCode);
      const currencyInfo = {
        abbr: currency.abbr,
        id: resWallet.Id,
        countryimg: currency.image_url,
        countryName: currency.name,
        balance: resWallet.balance,
        currencyCode: resWallet.currencyCode,
        equivalentBTC: resWallet.equivalentBTC,
        displayDecimalPlace: currency.client_display_decimal_place,
        address: resWallet.latestAddr,
        walletType: resWallet.type,
      }
      if (data.transactions) {
        const transactions = data.transactions
        let anyUserArray = [];
        transactions.map(tradeInfo => {
          if (tradeInfo.type === 5) {
            anyUserArray.push({
            mobile: tradeInfo.someone.split('-')[1],
            country_code: tradeInfo.someone.split('-')[0],
            });
          }
        })
        const anyUserInfo = yield call(fetchAnyUserInfo, { mobile_list_json: JSON.stringify(lodash.uniqBy(anyUserArray, 'mobile')) })
        const userInfoList = anyUserInfo.user_info_list;
        let newTradeList = transactions.map(data => {
          if (data.type === 5) {
            data.userInfo = userInfoList.filter(
              userInfoData =>
                userInfoData.mobile === data.someone.split('-')[1],
            );
          }
          return data;
        })
        newTradeList = lodash.sortBy(newTradeList, (n)=> {
          return n.updatedAt
        }).reverse()
        yield put({ type: 'showTransactionList', payload: { newTradeList, currencyInfo }})
      }
    },
    *displayDialog ({ payload }, { call, put }) {
      yield put({ type: 'dispaydialog' })
    },
    *showRecordDetail ({ payload }, { call, put }) {
      yield put({ type: 'showDetailRecord', payload })
    }
  },
  reducers: {
    isLoading (state, action) {
      return {
        ...state,
        isLoading: true,
      }
    },
    showDetailRecord (state, action) {
      return {
        ...state,
        record: action.payload,
      }
    },
    dispaydialog (state) {
      return {
        ...state,
        showDetail: !state.showDetail,
      }
    },
    saveCurrencyInfo (state, action) {
      return {
        ...state,
        ...action.paylod,
      }
    },
    showTransactionList (state, action) {
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      }
    }
  },
}
