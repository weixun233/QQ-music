<template>
  <div id="app" class="gules">
    <!--动画效果-->
    <transition :name="transitionName">
      <!--公共组件不缓存-->
      <keep-alive exclude="rank-details,singer-details,songSheet,classify-plainList,classify-list">
        <router-view
          class="router"
          @load="load"
          @loadOk="loadOk"
          @loadNo="loadNo"
          @leave="leave"
          @activatedLoad="activatedLoad"></router-view>
      </keep-alive>
    </transition>
    <zf-loading v-show="loading"
                :visible="loadVisible"
                :title="loadTitle"
                :reload="loadReload"></zf-loading>
    <!--播放器-->
    <player></player>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import {setHtmlSize} from 'common/js/util'
  export default {
    name: 'App',
    computed: {
      ...mapState('load', [
        'loading',
        'loadVisible',
        'loadTitle',
        'loadReload'
      ])
    },
    data() {
      return {
        transitionName: 'slide-right'  // 默认动态路由变化为slide-right
      }
    },
    watch: {
      $route(to, from) {
        let isBack = this.$router.isBack  //  监听路由变化时的状态为前进还是后退
        if (isBack) {
          this.transitionName = 'slide-right'
        } else {
          this.transitionName = 'slide-left'
        }
        this.$router.isBack = false
      }
    },
    mounted() {
      setHtmlSize()
      window.onresize = () => setHtmlSize()
    },
    methods: {
      ...mapMutations('load', [
        'set_loading',
        'set_loadVisible',
        'set_loadReload'
      ]),
      // 加载中
      load() {
        this.set_loading(true)
      },
      // 加载成功
      loadOk() {
        this.set_loading(false)
        this.set_loadVisible(true)
      },
      // 加载失败 显示重新加载load
      loadNo(init) {
        this.set_loadVisible(false)
        this.set_loadReload(init)
      },
      // 退出页面隐藏load
      leave() {
        this.set_loading(false)
      },
      // 缓存失败后 再次进入页面 显示重新加载
      activatedLoad() {
        if (!this.loadVisible) {
          this.set_loading(true)
        }
      }
    }
  }
</script>
<style lang='sass' type="text/sass">
  @import '~common/css/variable'

  #app
    position: relative
    width: 100%
    height: 100%
    color: $color-222
    .router
      transition: all .3s ease
      // 红色主题
    &.gules
      .header
        color: $color-fff05
        background: $color-d93f30
        li
          &.active
            color: $color-fff
      .search
        .search-input
          background: $color-d93f30
          >i
            color: $color-fff
          >input
            background: $color-d93f30
            color: $color-fff08
            &::placeholder
              color: $color-fff05
          >span
            color: $color-fff
        .scroll-cont
          .hot-key
            li
              background: $color-d93f30
              color: $color-fff
      .search-result
        border-top: 1px solid $color-d93f30
      .son-header
        background: $color-d93f30
        color: $color-fff
</style>
