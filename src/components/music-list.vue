<template>
  <div class="music-list">
    <div class="back" @click="$router.go(-1)">
      <i class="icon-music icon-back"></i>
    </div>
    <h1 class="title" ref="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <!--随机播放-->
        <div ref="playBtn" class="play" @click="random">
          <i class="icon-music icon-play"></i>
        </div>
        <!--收藏-->
        <div v-if="Collection" class="collect" ref="collect" @click.stop="toggleCollectSheet">
          <i :class="iconCollect"></i>
          <p>{{textCollect}}</p>
        </div>
        <!-- 关注-->
        <div v-if="follow" class="collect" ref="collect" @click.stop="toggleFollowSinger">
          <i :class="iconFollow"></i>
          <p>{{textFollow}}</p>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <!--歌曲list-->
    <song-list ref="list"
               :data="data"
               :rank="rank"
               @scroll="scroll"
               :pullUpLoad="pullUpLoad"
               @pullingUp="pullingUp"></song-list>
  </div>
</template>
<script>
  import SongList from 'components/song-list/song-list'
  import {prefixStyle} from 'common/js/dom'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {singer} from 'common/js/mixin'

  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    mixins: [singer],
    props: {
      data: {
        type: [Array, Object],
        default: () => []
      },
      title: {
        type: String,
        default: ''
      },
      bgimage: {
        type: String,
        default: ''
      },
      // 排名
      rank: {
        type: Boolean,
        default: false
      },
      // 歌单数据
      songSheet: {
        type: [Object, Array],
        default: () => {}
      },
      //      歌手
      singer: {
        type: [Object, Array],
        default: () => {}
      },
      // 是否显示收藏
      Collection: {
        type: Boolean,
        default: false
      },
      pullUpLoad: {
        type: Boolean,
        default: true
      },
      // 是否显示关注
      follow: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        // 标题高
        this.title_height = this.$refs.title.clientHeight
        // bgImg高
        let imageHeight = this.$refs.bgImage.clientHeight
        // List元素距title的距离
        this.listOffsetTop = -imageHeight + this.title_height
        console.log(this.title_height, imageHeight)
        this.$refs.list.scrollWrapperTop(imageHeight)
      }, 20)
    },
    data() {
      return {
        scrollY: -1,        // 滚动scroll坐标
        title_height: -1,   // title高度
        listOffsetTop: -1
      }
    },
    computed: {
      ...mapGetters('home', [
        'ifFollow',
        'ifCollect'
      ]),
      bgStyle() {
        return `background-image:url(${this.bgimage})`
      },
      // 收藏图标切换
      iconCollect() {
        if (this.ifCollect) {
          return 'iconfont icon-shoucang1'
        } else {
          return 'iconfont icon-shoucang'
        }
      },
      // 收藏文字切换
      textCollect() {
        if (this.ifCollect) {
          return '已收藏'
        } else {
          return '收藏'
        }
      },
      // 关注图标切换
      iconFollow() {
        if (this.ifFollow) {
          return 'iconfont icon-shoucang1'
        } else {
          return 'iconfont icon-shoucang'
        }
      },
      // 关注文字切换
      textFollow() {
        if (this.ifFollow) {
          return '已关注'
        } else {
          return '关注'
        }
      }
    },
    methods: {
      ...mapActions('music', [
        'randomPlay',
        'selectPlay'
      ]),
      ...mapMutations('home', [
        'set_collectSheet',
        'delete_collectSheet',
        'set_followSinger',
        'delete_followSinger'
      ]),
      // 加载事件
      pullingUp() {
        this.$emit('pullingUp')
      },
      forceUpdate(text) {
        this.$refs.list.forceUpdate(text)
      },
      scroll(value) {
        this.scrollY = value
      },
      // 随机播放
      random() {
        this.randomPlay({
          list: this.data
        })
      },
      // 收藏
      toggleCollectSheet() {
        if (this.ifCollect) {
          this.delete_collectSheet(this.songSheet)
        } else {
          this.set_collectSheet({
            songSheet: this.songSheet,
            len: this.songSheet.songlist.length
          })
        }
      },
      // 关注
      toggleFollowSinger() {
        if (this.ifFollow) {
          this.delete_followSinger(this.singer)
        } else {
          this.set_followSinger(this.singer)
        }
      }
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(this.listOffsetTop, newY.y)
        let zIndex = 0
        let height = 0
        let scale = 1
        let blur = 0
        let percent = Math.abs(newY.y / this.listOffsetTop)
        // 向下滚动
        if (newY.y > 0) {
          zIndex = 10
          scale += percent
        } else {
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style[backdrop] = `blur${blur}px`
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
        this.$refs.list.listControl(translateY)
        // 超出顶部
        if (newY.y < this.listOffsetTop) {
          zIndex = 10
          height = this.title_height
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.playBtn.style.display = 'none'
          if (this.$refs.collect) {
            this.$refs.collect.style.display = 'none'
          }
        } else {
          // 在中间部分滚动
          height = 0
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.playBtn.style.display = 'block'
          if (this.$refs.collect) {
            this.$refs.collect.style.display = 'block'
          }
        }
        this.$refs.bgImage.style.height = height + 'px'
        this.$refs.bgImage.style.transform = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
      }
    },
    components: {
      SongList
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .music-list
    @include maxWidth
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-e7e7e7
    .back
      position: absolute
      top: 0
      left: .06rem
      z-index: 20
      .icon-back
        display: block
        padding: .1rem
        font-size: $font-size-2_0
        color: $color-fff
    .title
      position: absolute
      top: 0
      left: 15%
      width: 70%
      @include no-warp
      z-index: 20
      text-align: center
      height: .4rem
      line-height: .4rem
      font-size: $font-size-1_8
      color: $color-fff
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        display: flex
        align-items: center
        justify-content: center
        position: absolute
        bottom: .2rem
        z-index: 20
        width: 100%
        .play
          display: inline-block
          box-sizing: border-box
          text-align: center
          color: $color-fff
          .icon-play
            display: inline-block
            vertical-align: middle
            font-size: $font-size-2_6
        .collect
          width: .4rem
          display: inline-block
          margin-left: .2rem
          font-size: $font-size-1_8
          color: $color-fff
          text-align: center
          p
            padding-top: .03rem
            font-size: $font-size-1_0
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-fafafa
</style>
