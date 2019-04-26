import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      if (!config.params) {
        config.params = {}
      }
      config.params[window.TokenKey] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      config.params[window.CidKey] = getCid() // 让每个请求携带自定义cid 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.request.readyState === 4 && response.request.status === 200) {
      if (res.errorId) {
        Message({
          message: res.message || 'error',
          type: 'error',
          duration: 5 * 1000
        })

        if (res.errorId === 10002 || res.errorId === 10003) {
          MessageBox.confirm(
            '你已被登出，可以取消继续留在该页面，或者重新登录',
            '确定登出',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            window.location.href = `/login?redirect=${window.location.href}` // 否则全部重定向到登录页
          })
        }
        return Promise.reject(res)
      } else {
        return res
      }
    } else {
      Message({
        message: `${response.status}接口错误！`,
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
