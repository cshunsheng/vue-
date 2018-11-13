import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/common.css'
Vue.config.productionTip = false
// axios的绑定
Vue.prototype.axios = axios
// axios配置
// axios.defaults.baseURL = 'http://192.168.47.35:8888/api/private/v1/'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 拦截器
// 请求拦截器：拦截请求
// 响应拦截器：拦截响应
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = localStorage.getItem('token')
    // config.baseURL = 'http://localhost:8888/api/private/v1/'
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
