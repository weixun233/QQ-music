import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

Router.prototype.go = function() {
  this.isBack = true
  window.history.go(-1)
}

const index = () => import('views/index/index')
const singer = () => import('views/singer/singer')
const singerDetails = () => import('views/singer-details/singer-details')
const rank = () => import('views/rank/rank')
const rankDetails = () => import('views/rank-details/rank-details')
const classify = () => import('views/classify/classify')
const classifyWhole = () => import('views/classify/children/classify-whole')
const classifyList = () => import('views/classify/children/classify-list')
const classifyPlainList = () => import('views/classify/children/classify-plainList')
const songSheet = () => import('views/songSheet/songSheet')
const album = () => import('views/album/album')
const albumDetails = () => import('views/album-details/album-details')
const mySongSheet = () => import('views/home/my-songSheet')
const myLive = () => import('views/home/my-live')
const myFollow = () => import('views/home/my-follow')
const myLatelyPlay = () => import('views/home/my-latelyPlay')

export default new Router({
  routes: [
    {
      path: '',
      name: '/index',       // 默认选中页面
      redirect: '/index'
    },
    {
      path: '/index',
      component: index
    },
    {
      path: '/index/singer',
      component: singer
    },
    {
      path: '/index/singer-details',
      component: singerDetails
    },
    {
      path: '/index/rank',
      component: rank
    },
    {
      path: '/index/rank-details',
      component: rankDetails
    },
    {
      path: '/index/classify',
      component: classify
    },
    {
      path: '/index/classify-whole',
      component: classifyWhole
    },
    {
      path: '/index/classify-list',
      component: classifyList
    },
    {
      path: '/index/classify-plainList',
      component: classifyPlainList
    },
    {
      path: '/index/songSheet',
      component: songSheet
    },
    {
      path: '/index/album',
      component: album
    },
    {
      path: '/index/album-details',
      component: albumDetails
    },
    {
      path: '/index/my-songSheet',
      component: mySongSheet
    },
    {
      path: '/index/my-live',
      component: myLive
    },
    {
      path: '/index/my-follow',
      component: myFollow
    },
    {
      path: '/index/my-latelyPlay',
      component: myLatelyPlay
    },
    {
      path: '*',
      redirect: '/index'
    }
  ]
})
