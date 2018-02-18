<template>
  <transition name="list-fade">
    <ul class="control">
      <li @click.stop="selectNext">
        <i class="iconfont icon-yinlemusic214"></i>
        <p>下一首播放</p>
      </li>
      <li @click.stop="selectJoin">
        <i class="iconfont icon-jiarugedan"></i>
        <p>加入歌单</p>
      </li>
    </ul>
  </transition>
</template>
<script>
  import {mapMutations, mapActions} from 'vuex'

  export default {
    methods: {
      selectNext() {
        this.$emit('selectNext')
      },
      selectJoin() {
        this.$emit('selectJoin')
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .control
    display: flex
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    align-items: center
    justify-content: center
    background: #fff
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: transform 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      transform: translate3d(0, 100%, 0)
    li
      flex: 1
      padding: .05rem 0
      text-align: center
      i
        display: block
        font-size: $font-size-2_0
      p
        font-size: $font-size-1_0
        color: $color-999
        padding-top: .05rem
</style>
