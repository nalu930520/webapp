import { request, config } from 'utils'
const { api } = config
const { getTransactionList, getAnyUserInfo } = api

export async function getTransaction (params) {
  return request({
    url: getTransactionList,
    data: params,
  })
}

export async function fetchAnyUserInfo (parmas) {
  return request({
    url: getAnyUserInfo,
    data: parmas,
    method: 'post',
  })
}

export async function queryWalletInfo (parmas) {
  return request({
    url: `/wallet/${parmas.currencyCode}`,
    method: 'get',
  })
}
