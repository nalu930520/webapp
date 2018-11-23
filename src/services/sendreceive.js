import { request, config } from 'utils'
const { api, socketURL } = config
const { getWalletAddress, getUserFriend } = api
import socketIoClient from 'socket.io-client';
const io = socketIoClient(socketURL);
import Cookies from 'universal-cookie'
const cookies = new Cookies();

export async function fetchWalletAddress () {
  return request({
    url: getWalletAddress,
  })
}

export async function fetchUserFriend () {
  return request({
    url: getUserFriend,
  })
}

export async function sendSubmit (parmas) {
    return request({
      url: `/transfer/${parmas.currency}/send`,
      data: parmas,
      method: 'post',
    })
}

export async function AuthSocket(child) {
  return new Promise ((resolve, reject) => {
    io.emit('authenticate', cookies.get('mobi_token'));
    setInterval(()=> {
      io.emit('authenticate', cookies.get('mobi_token'));
    }, 1000 *60)
    io.on(child, (msg) => {
        resolve(msg.data)
    })
  })
}

export async function onSendConfirm() {
  return AuthSocket('tx')
}

export async function onLogOut() {
  return AuthSocket('logout')
}

export async function getDetailtx(parmas) {
  return request({
    url: '/transaction',
    data: parmas,
    method: 'get'
  })
}

export async function fetchIncomingFee(parmas) {
  return request({
    url: `/transfer/fees?currency=${parmas}`,
    method: 'get',
  })
}

export async function genAddress(currencyCode) {
  return request({
    url: `/address/${currencyCode}`,
    method: 'post'
  })
}