import { request, config } from 'utils'
const { api, socketURL } = config
const { publicCountry, authMobileURL, getCaptchaURL, verifyCaptchaURL, setPinURL } = api

export async function getCountries () {
  return request({
    url: publicCountry,
    method: 'get',
  })
}


export async function authMobile (params) {
  return request({
    url: authMobileURL,
    method: 'post',
    data: params,
  })
}

export async function getCaptcha (params) {
  return request({
    url: getCaptchaURL,
    method: 'post',
    data: params,
  })
}

export async function verifyCaptcha (params) {
  return request({
    url: verifyCaptchaURL,
    method: 'post',
    data: params,
  })
}

export async function setPin (params) {
  return request({
    url: setPinURL,
    method: 'post',
    data: params,
  })
}
