<template>
  <div class="son-header">
    <i class="iconfont icon-zuojiantou1" @click="$router.go(-1)"></i>
    <h3>{{title}}</h3>
    <span class="clear" @click="clearHistory" v-if="clear">清空</span>
  </div>
</template>
<script>
  import {mapMutations, mapActions} from 'vuex'

  export default {
    props: {
      // title
      title: {
        type: String,
        default: ''
      },
      // 是否开启清空按钮
      clear: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      clearHistory() {
        this.$emit('clear')
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  .son-header
    display: flex
    padding: 0 .05rem
    align-items: center
    overflow: hidden
    vertical-align: middle
    i
      flex: 0 0 .4rem
      height: .4rem
      text-align: center
      line-height: .4rem
    h3
      flex: 1
      text-align: center
      margin-left: -.4rem
    .clear
      flex: 0 0 .4rem
      height: .4rem
      line-height: .4rem
</style>
