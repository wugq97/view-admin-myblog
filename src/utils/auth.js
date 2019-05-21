import Cookies from 'js-cookie'

const TokenKey = window.TokenKey

const expire = 1

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: expire })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
