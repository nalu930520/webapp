import { request, config } from 'utils'
const { api, socketURL } = config
const { getHashcode } = api
import socketIoClient from 'socket.io-client';
const io = socketIoClient(socketURL);

export async function getHash () {
  return request({
    url: getHashcode,
    method: 'get',
  })
}

export function connectSocket(authToken, child) {
  return new Promise ((resolve, reject) => {
    io.emit('auth:public', authToken);
    io.on('connect', () => {
    })
    io.on(child, (msg) => {
      resolve(msg.data);
    })
  })
}
export function getuUserInfo ({authToken}) {
  return connectSocket(authToken, 'scan_succeed')
}

export function confirmLogin ({authToken}) {
  return connectSocket(authToken, 'login_succeed')
}