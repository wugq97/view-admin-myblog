import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import store from '@/store'
// 创建axios实例
const service = axios.create({
  baseURL: window.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// axios.defaults.withCredentials = true // 携带cookie

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      if (!config.params) {
        config.params = {}
      }
      config.params[window.TokenKey] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
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
      if (res.code >= 10000) {
        Message({
          message: res.data + res.code || 'error',
          type: 'error',
          duration: 5 * 1000
        })
        store.dispatch('LogOut').then(() => {
          window.location.href = `http://localhost:9528/#/login?redirect=%2Fdashboard`
        })
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
