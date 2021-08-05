import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './utils/rem'
import 'element-ui/lib/theme-chalk/index.css' //element-ui样式引入
import element from './element-ui/index' //element-ui文件夹下
// import element from "element-ui"
Vue.use(element)
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
