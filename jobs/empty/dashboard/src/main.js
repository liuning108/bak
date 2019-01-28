import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/reset.css'
import './assets/styles/border.css'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/element.css';
import './assets/styles/sprite.sass'
import './assets/loginfont/iconfont.css'
import './assets/menufont/iconfont.css'
import './assets/dashfont/iconfont.css'
import './assets/styles/loading.css'
import './assets/styles/vue-grid-layout.css'
import  './assets/styles/common.sass'
import echarts from 'echarts'

Vue.prototype.$echarts = echarts
import ElementUI from 'element-ui';
Vue.use(ElementUI, {
  size: 'small',
  zIndex: 3000
});

Vue.config.productionTip = false

Vue.component('Node1', () => import('./components/graphs/Node1.vue'))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')