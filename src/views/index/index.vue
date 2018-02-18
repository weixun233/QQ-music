<template>
  <div class="index">
    <!--header-->
    <header class="header">
      <ul>
        <li v-for="index in 3" :key="index" :class="icon(index)" @click="selectNav(index - 1)"></li>
      </ul>
    </header>
    <zf-scroll-container class="scroll" ref="scrollContainer" @scrollEnd="scrollEnd">
      <index-home :navIndex="navIndex"
                  @load="load"
                  @loadOk="loadOk"
                  @loadNo="loadNo"
                  @leave="leave"></index-home>
      <index-info :navIndex="navIndex"
                  @load="load"
                  @loadOk="loadOk"
                  @loadNo="loadNo"
                  @leave="leave"></index-info>
      <index-search :navIndex="navIndex"
                    @load="load"
                    @loadOk="loadOk"
                    @loadNo="loadNo"
                    @leave="leave"></index-search>
    </zf-scroll-container>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import IndexHome from './components/index_home'
  import IndexSearch from './components/index_search'
  import IndexInfo from './components/index_info'
  import {transmitLoad} from 'common/js/mixin'

  export default {
    mixins: [transmitLoad],
    components: {IndexHome, IndexSearch, IndexInfo},
    // keep-alive组件停用时调用
    deactivated() {
      this.$emit('leave')
    },
    // 页面卸载时停止调用
    beforeDestroy() {
      this.$emit('leave')
    },
    mounted() {
      this.$refs.scrollContainer._bannerTo(1, 0, 0)
    },
    data() {
      return {
        navIndex: 1
      }
    },
    methods: {
      icon(index) {
        switch (index) {
          case 1:
            return this.navIndex === 0 ? 'iconfont icon-icon- active' : 'iconfont icon-icon-'
          case 2:
            return this.navIndex === 1 ?  'iconfont icon-icon-3 active' : 'iconfont icon-icon-3'
          case 3:
            return this.navIndex === 2 ?  'icon-music icon-search active' : 'icon-music icon-search'
          default:
            break
        }
      },
      selectNav(index) {
        this.navIndex = index
        this.$refs.scrollContainer._bannerTo(index, 0, 300)
      },
      // 列表滚动
      scrollEnd(index) {
        this.navIndex = index
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'

  .index
    @include container
    .header
      ul
        width: 80%
        margin: 0 auto
        display: flex
        align-items: center
        justify-content: space-between
        li
          flex: 1
          height: .5rem
          line-height: .5rem
          font-size: $font-size-2_6
          text-align: center
    .scroll
      position: fixed
      width: 100%
      top: .5rem
      bottom: 0
      height: auto
      overflow: hidden
</style>
