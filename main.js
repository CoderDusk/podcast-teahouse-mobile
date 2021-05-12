import Vue from 'vue'
import App from './App'

// 引入 uView
import uView from "uview-ui";
Vue.use(uView);

// 引入工具函数
import tools from 'common/tools.js'
Vue.prototype.tools = tools

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
