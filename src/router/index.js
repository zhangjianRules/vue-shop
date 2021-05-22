import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '@/components/Home.vue'
// import Welcome from '@/components/Welcome.vue'
// import Users from '@/components/user/Users.vue'
// import Permission from '@/components/permission/Permission.vue'
// import Roles from '@/components/permission/Roles.vue'
// import Cate from '@/components/goods/Cate.vue'
// import Params from '@/components/goods/Params.vue'
// import List from '@/components/goods/List.vue'
// import AddGoods from '@/components/goods/AddGoods.vue'
// import Order from '@/components/order/Order.vue'
// import Report from '@/components/report/Report.vue'

const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/Welcome.vue')
const Users = () => import(/* webpackChunkName: "Users_Permission_Roles" */ '@/components/user/Users.vue')
const Permission = () => import(/* webpackChunkName: "Users_Permission_Roles" */ '@/components/permission/Permission.vue')
const Roles = () => import(/* webpackChunkName: "Users_Permission_Roles" */ '@/components/permission/Roles.vue')
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '@/components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '@/components/goods/Params.vue')
const List = () => import(/* webpackChunkName: "List_AddGoods" */ '@/components/goods/List.vue')
const AddGoods = () => import(/* webpackChunkName: "List_AddGoods" */ '@/components/goods/AddGoods.vue')
const Order = () => import(/* webpackChunkName: "Order_Report" */ '@/components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '@/components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Permission },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  // next 一个函数，表示放行
  // next() 放行，  next('/login') 强制跳转
  if (to.path === '/login') { return next() }
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
