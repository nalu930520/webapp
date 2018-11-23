import { myCity, queryWeather, query, fetchWalletList } from '../services/myWallets'
import { onLogOut } from '../services/sendreceive'
import { AuthSocket } from '../services/sendreceive'
import { parse } from 'qs'
import { getcurrencyBycode, logout, formatNumber } from '../utils';
import { cyptoOrder } from '../utils/config';
import store from 'store';
import defaultWalletImg from '../../public/on-chain@2x.png';
import _ from 'lodash';
import  { numberFormat } from '../utils';
export default {
  namespace: 'myWallets',
  state: {
    totalBalance: 0,
    wallets: [],
    loading: true,
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({ type: 'fetchWalletList' })
      dispatch({ type: 'watchLogout' })
    }
  },
  effects: {
    *fetchWalletList ({}, { call, put}) {
      const needTagCurrency = ['xrp', 'eos']
      const walletList = yield call(fetchWalletList)
      if (walletList.ret === 1) {
        const totalBalance = numberFormat(walletList.all_available_fiat, 2, 2);
        let wallets = walletList.wallets.map(wallet => {
          const currentCurrency = getcurrencyBycode(wallet.currencyCode);
          return {
            abbr: currentCurrency.abbr,
            id: wallet.Id,
            countryimg: currentCurrency.image_url ,
            countryName: currentCurrency.name,
            balance: wallet.balance,
            currencyCode: wallet.currencyCode,
            equivalentBTC: wallet.equivalentBTC,
            displayDecimalPlace: currentCurrency.client_display_decimal_place,
            address: needTagCurrency.indexOf(wallet.currencyCode) > -1 ? wallet.latestAddr.split('-')[0] : wallet.latestAddr,
            addrQRCode: wallet.addrQRCode,
            tag: needTagCurrency.indexOf(wallet.currencyCode) > -1 ? wallet.latestAddr.split('-')[1] : '',
            walletType: currentCurrency.type,
            visible: wallet.visible,
            is_erc20_token: currentCurrency.is_erc20_token
          }
        })
        const orderedWallets = _.sortBy(wallets, 'walletType')
        yield put({ type: 'showWalletList', payload: { wallets: orderedWallets, totalBalance } })
      }
    },
    *setCurrencyInfo ({
      payload
    }, { call, put }) {
      store.set('currencyInfo', payload.currencyInfo)
      yield put({ type: 'saveCurrencyInfo', payload: { currencyInfo: payload.currencyInfo } })
    },
    *watchLogout({}, { call, put }) {
      const logoutData = yield call(onLogOut);
      if (logoutData.ret === 0) {
        logout()
      }
    },
  },
  reducers: {
    showWalletList (state, { payload: { wallets, totalBalance }}) {
      return {
        ...state,
        wallets,
        totalBalance,
        loading: false,
      }
    },
    saveCurrencyInfo (state, { payload: { currencyInfo } }) {
      return {
        ...state,
        currencyInfo,
      }
    }
  },
}
