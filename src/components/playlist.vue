<template>
  <zf-eject-bottom ref="ejectBottom" @click.native ="hide">
    <!--// 点击listWrapper 阻止事件冒泡-->
    <div class="playlist" @click.stop>
      <!--header-->
      <div class="list-header">
        <h3 class="title">
          <div class="mode" @click.stop="changeMode">
            <i class="icon" :class="iconMode"></i>
            <span>{{modeText}}</span>
          </div>
          <span class="text"></span>
          <span class="clear" @click="showConfirm">
                <i class="icon-music icon-clear"></i>
              </span>
        </h3>
      </div>
      <!--cont-->
      <zf-scroll class="list-content" :data="playlist" ref="listContent" :refreshDelay="refreshDelay">
        <transition-group name="list" tag="ul">
          <li class="item"
              v-for="(item, index) in playlist"
              :key="index"
              @click="selectItem(index)" ref="listItem">
            <i class="icon-music current" :class="getCurrentIcon(index, item)"></i>
            <span class="text" :class="getCurrentTxt(index)">{{item.songName}}</span>
            <span class="like" @click.stop="toggleFavorite(item)">
              <i :class="getFavoriteIcon(item)"></i>
            </span>
            <span class="delete" @click.stop="deleteOne(item)">
              <i class="icon-music icon-delete"></i>
            </span>
          </li>
        </transition-group>
      </zf-scroll>
      <p class="list-close" @click="hide">关闭</p>
    </div>
    <zf-confirm
      ref="confirm"
      title="是否清空播放列表"
      confirmBtnText="清空"
      @confirm="confirmClear"></zf-confirm>
  </zf-eject-bottom>
</template>
<script>
  import {mapState, mapActions, mapMutations, mapGetters} from 'vuex'
  import {playMode} from 'common/js/config'
  import {playerMixin} from 'common/js/mixin'

  export default {
    mixins: [playerMixin],
    data () {
      return {
        showFlag: false, // 显示隐藏
        refreshDelay: 100
      }
    },
    computed: {
      ...mapState('music', [
        'playlist',
        'currentIndex'
      ]),
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      }
    },
    methods: {
      ...mapMutations('music', [
        'set_playing',
        'set_currentIndex'
      ]),
      ...mapActions('music', [
        'deleteSong',
        'clearSong'
      ]),
      // 显示
      show() {
        this.showFlag = true
        this.$refs.ejectBottom.show()
        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent()
        }, 20)
      },
      // 隐藏
      hide () {
        this.showFlag = false
        this.$refs.ejectBottom.hide()
      },
      // 播放歌曲加icon
      getCurrentIcon(index, item) {
        if (this.currentIndex === index) {
          return 'icon-play'
        } else if (item.type === 'insert' && index > this.currentIndex) {
          return 'add icon-add'
        }
        return ''
      },
      getCurrentTxt(index) {
        if (this.currentIndex === index) {
          return 'Txt-play'
        }
        return ''
      },
      // 点击切换播放歌曲
      selectItem(index) {
        // 随机播放
        this.set_currentIndex(index)
        this.set_playing(true)
      },
      // 滚动到播放歌曲处
      scrollToCurrent() {
        if (this.currentIndex < 4) {
          return
        }
        const index = this.currentIndex - 3
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
      },
      // 删除列表歌曲
      deleteOne(item) {
        this.deleteSong(item)
        if (!this.playlist.length) {
          this.hide()
        }
      },
      // 垃圾桶
      showConfirm() {
        this.$refs.confirm.show()
      },
      // 确定清空列表
      confirmClear() {
        this.clearSong()
        this.hide()
      }
    },
    watch: {
      currentIndex(newSong, oldSong) {
        // 如果组件没有显示 或者歌曲单曲循环
        if (!this.showFlag || newSong === oldSong) {
          return
        }
        this.scrollToCurrent()
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .playlist
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    color: $color-fff08
    .list-header
      position: relative
      padding: .2rem .3rem .1rem .2rem
      background: $color-333
      .title
        display: flex
        align-items: center
        .mode
          display: flex
          align-items: center
          span
            font-size: $font-size-1_4
          .icon
            margin-right: .1rem
            font-size: .3rem
            color: $color-999
        .text
          flex: 1
        .clear
          @include extend-click
          .icon-clear
            font-size: $font-size-1_4
    .list-content
      max-height: 3.1rem
      overflow: hidden
      background: $color-333
      .item
        display: flex
        align-items: center
        height: .4rem
        padding: 0 .3rem 0 .2rem
        overflow: hidden
        &.list-enter-active, &.list-leave-active
          transition: height 0.1s
        &.list-enter, &.list-leave-to
          height: 0
        .current
          flex: 0 0 .2rem
          width: .2rem
          font-size: $font-size-1_2
          color: $color-d93f30
        .text
          flex: 1
          height: .2rem
          line-height: .2rem
          padding-right: .2rem
          @include no-warp
          font-size: $font-size-1_4
        .Txt-play
          color: $color-d93f30
        .like
          @include extend-click
          margin-right: .15rem
          font-size: $font-size-1_2
          color: $color-fff03
          .icon-favorite
            color: $color-d93f30
        .delete
          @include extend-click
          font-size: $font-size-1_2
          color: $color-fff03
    .list-close
      height: .4rem
      line-height: .4rem
      text-align: center
      background: $color-00008
</style>
