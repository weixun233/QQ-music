<template>
  <div class="song-control" ref="songControl">
    <!--mode-->
    <div class="mode" v-if="!select" @click.stop="selectMode">
      <i :class="iconMode"></i>
      <span>{{getModeText}}</span>
    </div>
    <!--全选-->
    <div class="checkAll" @click.stop="selectCheckAll" v-if="select">
      <i class="iconfont" :class="iconCheckAll"></i>
      <span>全选</span>
    </div>
    <p class="songSelectNumber" v-if="select">{{selectNumber}}</p>
    <!--// 多选/取消-->
    <span @click.stop="selectMany">{{getSelect}}</span>
  </div>
</template>
<script>
  import {mapMutations, mapActions} from 'vuex'
  import {playerMixin} from 'common/js/mixin'
  import {playMode} from 'common/js/config'

  export default {
    mixins: [playerMixin],
    props: {
      songs: {
        type: Array,
        default: () => []
      },
      selects: {
        type: Array,
        default: () => []
      },
      select: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    computed: {
      // 播放模式txt
      getModeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '循环播放' : '随机播放'
      },
      // 多选txt
      getSelect() {
        if (this.select) {
          return '取消'
        } else {
          return '多选'
        }
      },
      // 已选num
      selectNumber() {
        return `已选${this.selects.length}首`
      },
      // 全选框图标切换
      iconCheckAll() {
        if (this.songs.length === this.selects.length) {
          return 'iconfont icon-yixuanze'
        } else {
          return 'iconfont icon-weixuanze'
        }
      }
    },
    methods: {
      // mode
      selectMode() {
        this.$emit('selectMode')
      },
      // 全选
      selectCheckAll() {
        this.$emit('selectCheckAll')
      },
      // 多选
      selectMany() {
        this.$emit('selectMany')
      },
      _top(top) {
        this.$refs.songControl.style.top = top + 'px'
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .song-control
    position: absolute
    left: 0
    top: 0
    width: 100%
    display: flex
    height: .35rem
    padding: 0 .15rem
    box-sizing: border-box
    align-items: center
    border-bottom: 1px solid  $color-00001
    background: $color-fafafa
    .mode
      flex: 1
      display: flex
      align-items: center
      span
        padding-left: .05rem
    .checkAll
      .icon-check
        color: $color-d93f30
    .songSelectNumber
      flex: 1
      text-align: center
      color: $color-999
    >span
      @include extend-click
</style>
