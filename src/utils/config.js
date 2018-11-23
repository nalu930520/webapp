const APIV1 = '/api/v2'
export const APIV2 = '/v2'

module.exports = {
  appVersion: 'web:1.0.0', // 禁止修改
  cyptoOrder: ['btc', 'ltc', 'eth', 'bcc'],
  name: 'Mobi',
  prefix: 'mobi',
  footerText: 'Copyright © 2017 Mobi Me Limited',
  logo: 'https://static.mobiapp.cn/static/img/mobi.ico?v=4e95ba9e535c3b6a66811ba378018406',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  apiURL: process.env.NODE_ENV === 'production' ? 'https://api.mobimecdn.com/' : 'https://staging-wallet-api.mobiapp.cn',
  socketURL: process.env.NODE_ENV === 'production' ? 'https://websocket.mobi.me/qr-login' : 'https://staging-websocket.mobiapp.cn/qr-login',
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  qrcodeUel: '',
  iosDownloadUrl: 'https://itunes.apple.com/us/app/mobi-your-money-anywhere./id1180017272',
  androidDownloadUrl: 'https://play.google.com/store/apps/details?id=com.btcc.wallet',
  api: {
    getHashcode: `/web/hash_code`,
    pubCurrency: `/public/currency`,
    publicCountry: `/public/country`,
    getWalletList: `/wallets`,
    getTransactionList: `/transaction`,
    getAnyUserInfo: `/user/info/any_user_info`,
    getWalletAddress: `/wallet/btc`,
    getUserFriend: `/user/friend`,
    authMobileURL: `/auth/mobile`,
    getCaptchaURL: `/auth/send_verify_code`,
    verifyCaptchaURL: '/auth/verify_code',
    setPinURL: '/auth/set_pin'
  },
  aid: process.env.NODE_ENV === 'production' ? '2092543326' : '2007617261',
}
