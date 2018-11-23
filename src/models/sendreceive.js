import { fetchWalletAddress, fetchUserFriend, sendSubmit, onSendConfirm, getDetailtx, fetchIncomingFee, genAddress } from '../services/sendreceive'
import { fetchWalletList } from '../services/myWallets.js';
import { routerRedux } from 'dva/router'
import { apiURL, socketURL, cyptoOrder } from '../utils/config.js'
import socketIoClient from 'socket.io-client';
import store from 'store';
import bg from 'bignumber.js';
import { getMobileCodeByCountryCode, logout, getcurrencyBycode } from '../utils'
import Cookies from 'universal-cookie'
import queryString from 'query-string'
import { message } from 'antd';
const cookies = new Cookies();
export default {
  namespace: 'sendreceive',
  state: {
    showReceive: '1',
    loading: true,
    resultPage: null,
    cryptocurrencys: [],
    selectedCrypto: 'btc',
    walletsInfo: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/sendreceive' || location.pathname === '/sendreceive/') {
          if (store.get('SNcode')) {
            dispatch(routerRedux.push('/sendreceive/sendConfirm'))
          } else {
            dispatch({ type: 'showDefault',
              payload: {
                status: '1',
                ...queryString.parse(location.search)
              }
            })
            dispatch({ type: 'getNeedData' })
          }
        }
      })
    }
  },
  effects: {
  *onConfirm ({ payload }, { call, put }) {
    const confirmInfo = yield call(onSendConfirm)
    if (confirmInfo.ret === 0) {
      yield put(routerRedux.push(`/sendreceive/sendSuccess/${confirmInfo.sn}`))
    }
  },
  *getNeedData ({ payload }, { call, put, select }) {
    let userFriendList = [];
    let walletInfo = yield select(state => state.myWallets);
    const data = yield call(fetchUserFriend)
    if (data.friend_list) {
      userFriendList = data.friend_list.map(friendInfo => {
        friendInfo.mobileCode = getMobileCodeByCountryCode(friendInfo.country_code)
        return friendInfo;
      });
    }

    if (!walletInfo) {
      const needTagCurrency = ['xrp', 'eos']
      const walletList = yield call(fetchWalletList)
      let wallets = walletList.wallets.map(wallet => {
        const currentCurrency = getcurrencyBycode(wallet.currencyCode);
        return {
          id: wallet.Id,
          abbr: currentCurrency.abbr,
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
      let cyptoWallets = wallets.filter( wallet => wallet.walletType === 'C')
      let flatWallets = wallets.filter( wallet => wallet.walletType !== 'C')
      flatWallets = _.sortBy(flatWallets, (item) => {
        return item.id
      })
      const orderedWallets = _.sortBy(wallets, 'walletType');
      yield put({ type: 'showReceiveInfo', payload: { walletsInfo: orderedWallets ,cryptocurrencys: cyptoWallets, userFriendList } })
      return
    }
    yield put({ type: 'showReceiveInfo', payload: { walletsInfo: walletInfo.wallets ,cryptocurrencys: walletInfo.wallets.filter( wallet => wallet.walletType === 'C'), userFriendList } })
  },
  *getAddressByCode({ payload }, { call, put, select }) {
    const cryptocurrencys = yield select(state => state.sendreceive.cryptocurrencys);
    const getCrypytoByCode = cryptocurrencys.find(crypto => crypto.currencyCode === payload)
    if (!getCrypytoByCode.address) {
      const resAddress = yield call(genAddress, payload)
      if (resAddress.error) {
        message.error(sendres.error)
      } else {
        const address = resAddress.address
        const newCryptocurrencys = cryptocurrencys.map(crypto => {
          if (crypto.currencyCode === payload) {
            crypto.address = address
          }
          return crypto
        })
        yield put({ type: 'showReceiveInfo', payload: { cryptocurrencys: newCryptocurrencys, selectedCrypto: payload } })
        return
      }
    }
    yield put({ type: 'showReceiveInfo', payload: { cryptocurrencys: cryptocurrencys, selectedCrypto: payload } })
  },
  *subSend({ payload }, { call, put }) {
    const isCyptoCurrency = getcurrencyBycode(payload.currency).type === 'C'
    if(isCyptoCurrency){
      const transferFees = yield call(fetchIncomingFee, payload.currency);
      payload.fee = transferFees.onchain_fee.low
      payload.extraFee = transferFees.incoming_fee;
    }
    const sendres = yield call(sendSubmit, payload)
    if(sendres.error) {
      message.error(sendres.error)
    } else {
      store.set('SNcode', sendres.SN);
      yield put(routerRedux.push('/sendreceive/sendConfirm'))
    }
  },
  *getSNstatus({ payload }, { call, put }) {
    let transactionDetail = yield call(getDetailtx, { SN: store.get('SNcode') })
    transactionDetail = transactionDetail.transactions[0];
    if (transactionDetail.status !== 4 ) {
      yield put(routerRedux.push('/sendreceive/sendConfirm'))
    } else {
      store.remove('SNcode')
      yield put({ type: 'getNeedData' })
    }
  },
},
  reducers: {
    isLoading(state, action) {
      return {
        ...state,
        loading: true,
      }
    },
    showDefault(state, action) {
      return {
        ...state,
        showReceive: action.payload.status,
      };
    },
    showUserFriend(state, { payload: { userFriendList } }) {
      return {
        ...state,
        userFriendList,
        loading: false,
      }
    },
    showReceiveInfo(state, action) {
      return {
        ...state,
        ...action.payload,
        loading: false,
      }
    }
  },
}
