import { request } from 'utils'

export async function fetchUserTos (params) {
  return request({
    url: '/user/tos',
  })
}

export async function acceptTos (parmas) {
  return request({
    url: '/user/tos',
    method: 'post',
    data: parmas,
  })
}
