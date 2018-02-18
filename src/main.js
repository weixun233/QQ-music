import 'babel-polyfill' // 转义ES6语法
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick' // 点击无300ms延迟
import VueLazyLoad from 'vue-lazyload' // 图片懒加载

import 'common/css/_index.sass'
// 自定义组件库
import plugin from 'plugin/index'

// 自定义组件
import SongSheetList from 'components/songSheet-list'
import SongSheetAdd from 'components/songSheet-add'
import ejectTool from 'components/eject-tool'
import sonHeader from 'components/son-header'
import musicList from 'components/music-list'
import player from 'components/player'
import playlist from 'components/playlist'

Vue.component('songSheet-list', SongSheetList)
Vue.component('songSheet-add', SongSheetAdd)
Vue.component('eject-tool', ejectTool)
Vue.component('son-header', sonHeader)
Vue.component('music-list', musicList)
Vue.component('player', player)
Vue.component('playlist', playlist)

fastclick.attach(document.body)
Vue.use(plugin)
Vue.use(VueLazyLoad, {
  loading: 'https://y.gtimg.cn/mediastyle/mobile/yqq_v5/img/loading.gif?max_age=2592000'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
