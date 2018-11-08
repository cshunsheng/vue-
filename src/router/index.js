import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Category from '@/components/Category'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/category',
      component: Category
    }
  ]
})
