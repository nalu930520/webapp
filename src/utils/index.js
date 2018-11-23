import config from './config'
import request from './request'
import classnames from 'classnames'
import { color } from './theme'
import lodash from 'lodash'
import store from 'store'
import bg from 'bignumber.js'
import Cookies from 'universal-cookie'
const cookies = new Cookies();

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

const codeTocurrencyCode = (code) => {
  if (code === 'btc') {
    return 'bits';
  }
  if (code === 'ltc') {
    return 'lites';
  }
  if (code === 'eth') {
    return 'ether'
  }
  if (code === 'bcc') {
    return 'BCH'
  }
  if (code === 'cny') {
    return 'BTY'
  }
  return code.toUpperCase();
}
const getcurrencyBycode = (currencyCode) => {
  const currentCurrency = store.get('currencies').find( currency => currency.code === currencyCode)
  if (currencyCode === 'ltc') {
    return {
      ...currentCurrency,
      decimal_place: 5,
      client_display_decimal_place: 5,
    }
  }
  if (currencyCode === 'btc') {
    return {
      ...currentCurrency,
      decimal_place: 2,
      client_display_decimal_place: 2,
    }
  }
  return currentCurrency
}

const getMobileCodeByCountryCode = (countryCode) => {
  return store.get('countrys')
    .find( country => country.iso2 === countryCode )
    .mobile_code
}

const logout = () => {
  store.clearAll();
  cookies.remove('mobi_token', { domain: '.mobi.me' });
  cookies.remove('mobi_token', { domain: '.mobiapp.cn' });
  request({
    method: 'post',
    url: '/v2/web/logout',
  })
  window.location.href='/login';
}

const  formatNumber = (value, dec) => {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  let getDec = (dec) => {
    let zero = ''
    if (dec === 0) {
      return '';
    }
    while(dec>0) {
      zero += '0'
      dec --;
    }
    return zero
  }

  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }

  return `${prefix}${result}${list[1] ? `.${list[1]}${getDec(dec - list[1].length)}` :`${getDec(dec) ? `.${getDec(dec)}` : ''}`}`;
}

const amountFormat = (value, dec) => {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  if (value.split('.').length === 1) {
    // 是整数 没有点
    return `${prefix}${result}`
  }
  if (value.split('.').length === 2 && !value.split('.')[1]) {
    // 整数 有点
    return `${prefix}${result}.`
  }

  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

const numberFormat = (amount, dec, displayDec) => {
  bg.config({ ERRORS: false })
  return new bg(amount).dividedBy(Math.pow(10, dec)).toFormat(displayDec, 1)
}
const formatCurrency = (amount, currencyCode) => {
  const currencyInfo = getcurrencyBycode(currencyCode);
  if (!currencyInfo) return '';

  bg.config({ ERRORS: false })
  if (currencyInfo.type === 'F') {
    return new bg(amount).dividedBy(10 ** currencyInfo.decimal_place).toFormat(currencyInfo.client_display_decimal_place, 1)
  }
  return new bg(amount).dividedBy(10 ** currencyInfo.decimal_place).round(currencyInfo.client_display_decimal_place, 1).toFormat(null, 1)
}
const sendNumDec = (amount, dec) => {
  bg.config({ ERRORS: false })
  return new bg(amount).times(Math.pow(10, dec)).toString(10)
}

module.exports = {
  config,
  request,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  codeTocurrencyCode,
  getcurrencyBycode,
  getMobileCodeByCountryCode,
  logout,
  formatNumber,
  amountFormat,
  numberFormat,
  sendNumDec,
  formatCurrency
}
