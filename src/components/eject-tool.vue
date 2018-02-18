<template>
  <div class="eject-control">
    <!--歌曲控件-->
    <zf-eject-bottom class="tool" ref="tool" @hide="playShow">
      <div class="control" @click.stop="hide">
        <h3 v-if="songItem.songName">歌曲：{{songItem.songName}}</h3>
        <ul class="control-list">
          <li class="byReady" @click="selectAddSong" v-if="Song">
            <i class="iconfont icon-tianjia"></i>
            <span>下一首播放</span>
          </li>
          <li class="byReady" @click="selectAddSongSheet" v-if="SongSheet">
            <i class="iconfont icon-shoucang"></i>
            <span>收藏到歌单</span>
          </li>
          <li @click="selectXiazai" v-if="Xiazai">
            <i class="iconfont icon-xiazai"></i>
            <span>下载</span>
          </li>
          <li @click="selectPinglun" v-if="Pinglun">
            <i class="iconfont icon-pinglun"></i>
            <span>评论</span>
          </li>
          <li class="byReady" @click="selectShare" v-if="Share">
            <i class="iconfont icon-iconfontzhizuobiaozhun20"></i>
            <span>分享</span>
          </li>
          <li class="byReady" @click="selectSinger" v-if="Singer">
            <i class="iconfont icon-geshou"></i>
            <span>歌手：{{songItem.singerName | getSinger}}</span>
          </li>
          <li class="byReady" @click="selectAlbum" v-if="Album">
            <i class="iconfont icon-zhuanjiguangpan" ></i>
            <span>专辑：{{songItem.albumName}}</span>
          </li>
          <li class="byReady" @click="selectDelete" v-if="Delete">
            <i class="iconfont icon-lajitong" ></i>
            <span>删除</span>
          </li>
        </ul>
      </div>
    </zf-eject-bottom>
    <!--歌手选择-->
    <zf-eject-bottom ref="ejectSinger">
      <div class="control" @touchstate.stop @click.stop>
        <p class="singer">查看歌手</p>
        <ul class="singer-list">
          <li v-for="(item, index) in songItem.singerName" :key="index" @click="selectSonSinger(index)">
            <img :src="image(songItem.singerMid[index])" alt="">
            <span>{{item}}</span>
          </li>
        </ul>
      </div>
    </zf-eject-bottom>
  </div>
</template>
<script>
  import {getSinger} from 'common/js/util'
  import {singer} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [singer],
    props: {
      songItem: {
        type: Object,
        default: () => {}
      },
      Song: {
        type: Boolean,
        default: false
      },
      SongSheet: {
        type: Boolean,
        default: false
      },
      Xiazai: {
        type: Boolean,
        default: false
      },
      Pinglun: {
        type: Boolean,
        default: false
      },
      Share: {
        type: Boolean,
        default: false
      },
      Singer: {
        type: Boolean,
        default: false
      },
      Album: {
        type: Boolean,
        default: false
      },
      Delete: {
        type: Boolean,
        default: false
      }
    },
    filters: {
      getSinger
    },
    methods: {
      ...mapMutations('music', [
        'set_playShowHide'
      ]),
      show() {
        this.set_playShowHide(false)
        this.$refs.tool.show()
      },
      hide() {
        this.set_playShowHide(true)
        this.$refs.tool.hide()
      },
      playShow() {
        this.set_playShowHide(true)
      },
      selectAddSong() {
        this.$emit('addSong')
      },
      selectAddSongSheet() {
        this.$emit('addSongSheet')
      },
      selectXiazai() {
        this.$emit('Xiazai')
      },
      selectPinglun() {
        this.$emit('Pinglun')
      },
      selectShare() {
        this.$emit('Share')
      },
      // 歌手点击
      selectSinger() {
        // 如果是多个歌手
        if (this.songItem.singerMid.length > 1) {
          this.$refs.ejectSinger.show()
        }
        // 一个歌手
        this.$router.push({
          path: `/index/singer-details?&singermid=${this.songItem.singerMid[0]}`
        })
      },
      // 选择某个歌手
      selectSonSinger(index) {
        this.$refs.ejectSinger.hide()
        this.$router.push({
          path: `/index/singer-details?&singermid=${this.songItem.singerMid[index]}`
        })
      },
      // 专辑点击
      selectAlbum() {
        this.$router.push({
          path: `/index/album-details?&album_id=${this.songItem.albumId}`
        })
      },
      selectDelete() {
        this.$emit('Delete')
      },
      _bottom(bottom) {
        this.$refs.tool.$el.style.bottom = bottom + 'px'
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'

  .control
    width: 100%
    position: absolute
    left: 0
    bottom: 0
    background: $color-f8f8f8
    box-sizing: border-box
    padding: .05rem
    h3
      @include no-warp
      height: .3rem
      width: 80%
      padding-left: .1rem
      line-height: .3rem
      color: $color-999
      font-size: $font-size-1_2
    .control-list
      max-height: 31rem
      overflow: hidden
      li
        display: flex
        align-items: center
        color: $color-999
        &.byReady
          color: $color-333
        i
          width: .4rem
          padding-right: .05rem
          text-align: center
        span
          flex: 1
          height: 40px
          line-height: 40px
          box-sizing: border-box
          border-bottom: 1px solid $color-00001
          @include no-warp
    .singer
      height: .6rem
      line-height: .6rem
      text-align: center
    .singer-list
      li
        display: flex
        align-items: center
        border-top: 1px solid $color-00001
        img
          width: .6rem
          height: .6rem
          padding: .1rem 0
          border-radius: 50%
        span
          padding-left: .2rem
          font-size: $font-size-1_6
          flex: 1
</style>
