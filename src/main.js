import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import { Form, FormItem, Input, Button, Alert, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://localhost:10006/'

Vue.prototype.$http = axios
Vue.prototype.$message = Message

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Alert)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
