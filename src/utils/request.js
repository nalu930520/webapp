import axios from 'axios'
import qs from 'qs'
import { apiURL, appVersion } from './config'
import jsonp from 'jsonp'
import lodash from 'lodash'
import store from 'store'
import Cookies from 'universal-cookie'
import { Modal } from 'antd';
const cookies = new Cookies();
axios.defaults.baseURL = apiURL;


const fetch = (options) => {
  let {
    method = 'get',
    data,
    url,
  } = options

axios.defaults.headers.common['token'] = cookies.get('mobi_token') || '';
axios.defaults.headers.common['app-version'] = appVersion;
axios.defaults.headers.common['app-language'] = store.get('locale') || '';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
if(url === '/auth/mobile'){
  delete axios.defaults.headers.common.token
}
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(`${url}${!lodash.isEmpty(data) ? `?${qs.stringify(data)}` : ''}`)
    case 'post':
      const paramsObj = new URLSearchParams()
      for(const key in data) {
        paramsObj.append(`${key}`, data[key])
      }
      return axios.post(url, paramsObj)
    default:
      return axios(options)
  }
}

export default function request (options) {
  return fetch(options).then((response) => {
    const { statusText, status } = response
    let data = response.data
    if(data.ret === -10009 || data.ret === -1001) {
      store.clearAll()
      cookies.remove('mobi_token')
      window.location.href="/login"
    }
    if(data.ret === -1025) {
      Modal.info({
        title: (<p style={{ width: '100%', textAlign: 'center' }}>{store.get('locale') === 'zh' ? 'Mobi服务协议' : 'Mobi Terms of Service'}</p>),
        iconType: false,
        width: '80%',
        height: '70%',
        onOk: () => {
          window.location.href = '/agree-tos'
        },
        okText: store.get('locale') === 'zh' ? '接受' : 'Accept',
        content: (<span>
          <iframe
            style={{ width: '100%', minHeight: '600px', border: 'none' }}
            src="https://www.mobi.me/simple-terms"></iframe>
        </span>)
      })
    }
    return {
      success: true,
      message: statusText,
      status,
      ...data,
    }
  }).catch((error) => {
    console.log(error)
    const { response } = error
    let message
    let status
    if (response) {
      status = response.status
      const { data, statusText } = response
      message = data.message || statusText
    } else {
      status = 600
      message = 'Network Error'
    }
    return { success: false, status, message }
  })
}
