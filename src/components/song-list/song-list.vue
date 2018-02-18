<template>
    <div class="song-list" ref="songList">
      <zf-scroll class="scroll-wrapper"
                 ref="scrollWrapper"
                 :data="data"
                 :probeType="probeType"
                 :pullUpLoad="pullUpLoad"
                 :listenScroll="listenScroll"
                 @pullingUp="pullingUp"
                 @scroll="scroll">
        <div class="scroll-content">
          <div class="hr3_5"></div>
          <!--歌曲-->
          <ul>
            <!--// 点击播放歌曲-->
            <li class="item"
                v-for="(item, index) in data"
                :key="index"
                :class="getCurrentIcon(index, item)"
                @click.stop="selectItemEvent(item, index)" >
              <div class="item-wrapper">
                <!--// 点击添加歌曲到队列 + -->
                <div class="rank rankIndex" v-show="!select" @click.stop="insertOneSong(item)">
                  <i class="iconfont icon-jia" ></i>
                </div>
                <!--// 单选-->
                <div class="rank rankIndex" @click.stop="selectFrame(item)" v-show="select">
                  <i class="iconfont" :class="iconCheck(item)"></i>
                </div>
                <!--// 歌曲排行-->
                <div class="rank" v-show="rank">
                  <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
                </div>
                <!--歌曲信息-->
                <div class="info">
                  <div class="content">
                    <!--// 歌名-->
                    <h3>{{item.songName}}</h3>
                    <!--// 作者-->
                    <p>{{item.singerName | getSinger}}</p>
                  </div>
                  <!--// 更多控件-->
                  <div class="more" @click.stop="more(item)">
                    <i class="icon-gengduo iconfont"></i>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </zf-scroll>
      <!-- 导航控件-->
      <song-control ref="songControl"
                    :select="select"
                    :songs="data"
                    :selects="selects"
                    @selectCheckAll="selectCheckAll"
                    @selectMany="selectMany"
                    @selectMode="changeMode"></song-control>
      <!-- 底部控件-->
      <check-bok ref="checkBook"
                 v-show="select"
                 @selectNext="nextPlay"
                 @selectJoin="addPrompt"></check-bok>
      <!-- 歌单选择-->
      <songSheet-add
        ref="ejectSongSheet"
        :songs="selects"
        :song="songItem"
        @selectItem="selectItemHint"
      ></songSheet-add>
      <!--歌曲控件-->
      <eject-tool class="tool"
                  ref="ejectTool"
                  :songItem="songItem"
                  :Song="Song"
                  :SongSheet="SongSheet"
                  :Xiazai="Xiazai"
                  :Pinglun="Pinglun"
                  :Share="Share"
                  :Singer="Singer"
                  :Album="Album"
                  @selectAddSongSheet="selectAddSongSheet"></eject-tool>
      <!--// 提示语-->
      <zf-hint ref="promptHint" position="middle">{{Hint}}</zf-hint>
    </div>
</template>
<script>
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
  import {playerMixin, playListMixin} from 'common/js/mixin'
  import {getSinger} from 'common/js/util'

  import CheckBok from './components/check-box.vue'
  import SongControl from './components/song-control.vue'

  export default {
    mixins: [playerMixin, playListMixin],
    components: {CheckBok, SongControl},
    created() {
      this.Song = true
      this.SongSheet = true
      this.Xiazai = true
      this.Pinglun = true
      this.Share = true
      this.Singer = true
      this.Album = true
    },
    filters: {
      getSinger
    },
    props: {
      // song数据 (必须
      data: {
        type: [Array, Object],
        default: () => []
      },
      // 歌曲排行
      rank: {
        type: Boolean,
        default: false
      },
      // scroll 类型
      probeType: {
        type: Number,
        default: 3
      },
      // 是否监听end 执行上拉刷新
      pullUpLoad: {
        type: Boolean,
        default: true
      },
      // 是否监听scroll滚动
      listenScroll: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        title: '',
        selects: [],        // 选中数组
        select: false,      // 是否多选
        check: false,        // 是否选中
        Hint: null,          // 提示语
        songItem: {}          // 点击的歌曲数据
      }
    },
    computed: {
      ...mapState('music', [
        'mode',
        'playlist',
        'currentIndex'
      ]),
      ...mapGetters('music', [
        'currentSong'
      ])
    },
    methods: {
      ...mapMutations('music', [
        'set_mode',
        'set_playShowHide'
      ]),
      ...mapActions('music', [
        'selectPlay',
        'insertSongQueue',
        'batchInsertSongQueue'
      ]),
      handlePlaylist(playlist) {
        let offBottom = playlist.length > 0 ? this.offBottom : ''
        this.$refs.scrollWrapper.$el.style.bottom = offBottom
        this.$refs.scrollWrapper.refresh()
      },
      // 单曲添加到队列
      insertOneSong(item) {
        this.$refs.ejectTool.hide()
        this.insertSongQueue(item)
        this.selectItemHint(1, '队列')
      },
      // 全选 (选中/取消)
      selectCheckAll() {
        let songsItem = this.data.slice()
        let len = songsItem.length
        if (this.selects.length !== len) {
          for (let i = 0; i < len; i++) {
            songsItem[i].type = 'select'
          }
        } else {
          songsItem = []
        }
        this.selects = songsItem
      },
      // 多选/取消
      selectMany() {
        this.select = !this.select
        if (this.select) {
          this.playHide()
        } else {
          this.playShow()
        }
      },
      // 单选 (选中/取消)
      selectFrame(item) {
        let index = this.selects.findIndex((sle) => {
          return sle.songId === item.songId
        })
        // 取消
        if (index > -1) {
          this.selects.splice(index, 1)
        } else {
        // 选中
          this.selects.push(item)
        }
      },
      // 单选框图标切换
      iconCheck(item) {
        // 如果没有选中的return no
        if (!this.selects.length) {
          return 'icon-weixuanze'
        }
        let index = this.selects.findIndex((sle) => {
          return sle.songId === item.songId
        })
        if (index > -1) {
          return 'icon-yixuanze'
        } else {
          return 'icon-weixuanze'
        }
      },
      // 批量添加到播放队列
      nextPlay() {
        let len = this.selects.length
        if (!len) {
          this.Hint = '请选择要播放的歌曲'
          this.$refs.promptHint.show()
          return
        }
        this.Hint = '播放队列'
        this.batchInsertSongQueue(this.selects)
        this.selectItemHint(len, this.Hint)
        this.select = !this.select
        this.selects = []
      },
      // 弹出歌单选择
      addPrompt() {
        if (!this.selects.length) {
          this.Hint = '请选择要加入的歌曲'
          this.$refs.promptHint.show()
          return
        }
        this.$refs.ejectSongSheet.show()
      },
      // 单首添加收藏
      selectAddSongSheet() {
        this.$refs.ejectTool.hide()
        this.$refs.ejectSongSheet.show()
        setTimeout(() => {
          this.playHide()
        }, 20)
      },
      // 点击更多控件 赋值songItem
      more(item) {
        this.songItem = item
        this.$refs.ejectTool.show()
      },
      // 显示播放器
      playShow() {
        this.set_playShowHide(true)
      },
      // 隐藏播放器
      playHide() {
        this.set_playShowHide(false)
      },
      // 添加完成提示
      selectItemHint(selectLen, Hint) {
        this.Hint = `${selectLen}首歌曲已添加到${Hint}`
        this.$refs.promptHint.show()
        this.playShow()
      },
      // 播放歌曲加icon
      getCurrentIcon(index, item) {
        if (this.currentIndex === index && this.currentSong.songId === item.songId) {
          return 'active'
        }
        return 'default'
      },
      // 歌曲点击
      selectItemEvent(item, index) {
        this.selectPlay({
          list: this.data,
          index
        })
      },
      // 歌曲排行class 图片/文字 (前3图片、后面文字)
      getRankCls(index) {
        if (index <= 2) {
          return `icon icon${index}`
        } else {
          return `text`
        }
      },
      // 歌曲排行 文字 (后面文字)
      getRankText(index) {
        if (index > 2) {
          return index + 1
        }
      },
      // 设置List元素距top距离
      scrollWrapperTop(top) {
        this.$refs.songList.style.top = top + 'px'
      },
      // 设置控件距top距离
      listControl(top) {
        this.$refs.songControl._top(top)
      },
      // 该事件 执行上拉刷新
      pullingUp() {
        this.$emit('pullingUp')
      },
      scroll(pos) {
        this.$emit('scroll', pos)
      },
      forceUpdate(text) {
        this.$refs.scrollWrapper.forceUpdate(true, text)
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'

  .song-list
    width: 100%
    background: $color-fafafa
    position: fixed
    top: .4rem
    bottom: 0
    .scroll-wrapper
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      .scroll-content
        .hr3_5
          height: .35rem
        .item
          .item-wrapper
            display: flex
            align-items: center
            box-sizing: border-box
            font-size: $font-size-1_4
          &.active
            border-left: .03rem solid $color-d93f30
          &.default
            border-left: .03rem solid $color-transparent
          & + .item
            .item-wrapper
              .info
                border-top: 1px solid $color-00001
          .rank
            flex: 0 0 .2rem
            width: .25rem
            margin-right: .3rem
            text-align: center
            .icon
              display: inline-block
              width: .25rem
              height: .24rem
              background-size: 25px 24px
              &.icon0
                @include bg-image('first')
              &.icon1
                @include bg-image('second')
              &.icon2
                @include bg-image('third')
            .icon-check
              color: $color-d93f30
          .rankIndex
            padding: .2rem 0
            margin: 0 .16rem 0 .1rem
            >i
              @include extend-click
              color: $color-999
              font-size: $font-size-2_0
          .info
            flex: 1
            display: flex
            align-items: center
            line-height: .2rem
            padding: .1rem 0
            overflow: hidden
            .content
              flex: 1
              >h3
                @include no-warp
                width: 80%
                font-size: $font-size-1_6
              >p
                @include no-warp
                margin-top: .04rem
                font-size: $font-size-1_1
                color: $color-999
            .more
              flex: 0 0 .4rem
              text-align: center
              padding: .1rem 0
</style>
