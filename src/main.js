// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import GeneralUtils from './utils/GeneralUtils'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueClipboard from 'vue-clipboard2';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.axios=axios;
Vue.use(GeneralUtils);
Vue.use( VueClipboard )
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  render: h => h(App)
})
