import { request, config } from 'utils'
const { api } = config
const { getWalletList } = api

export async function fetchWalletList () {
  return request({
    url: getWalletList,
    method: 'get',
  })
}
