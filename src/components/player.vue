<template>
  <section class="player" v-show="playlist.length>0">
    <!--// 展开的播放器-->
    <transition name="normal">
      <section class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <!--top-->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-music icon-back"></i>
          </div>
          <h3 class="title" v-html="currentSong.songName"></h3>
          <h4 class="subtitle" @click="selectSinger" v-html="getSinger(currentSong.singerName)"></h4>
        </div>
        <!--middle-->
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <!--cd-->
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" alt="">
              </div>
            </div>
            <!--歌词-->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric" v-if="playingLyric">
                <p v-for="(item, index) in playingLyric"
                   :key="index"
                   :class="{'current': currentLineNum === item.index}">{{item.txt}}</p>
              </div>
            </div>
          </div>
          <div class="lyricListCont" ref="lyricListCont">
            <zf-scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
              <div class="lyric-wrapper">
                <div v-if="currentLyric">
                  <p ref="lyricLine"
                     class="text"
                     :class="{'current': currentLineNum === index}"
                     v-for="(item, index) in currentLyric.lines" :key="index">{{item.txt}}</p>
                </div>
              </div>
            </zf-scroll>
          </div>
        </div>
        <!--bottom-->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <!--进度条-->
          <div class="progress-wrapper">
            <span class="time-l">{{playTime(currentTime)}}</span>
            <zf-slider  class="slider"
                         v-model="sliderValue"
                         @touchstart.native="sliderStart"
                         @touchend.native="sliderEnd">
            </zf-slider>
            <span class="time-r">{{playTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="topTipMode">
              <i :class="iconMode" @click="changeMode"></i>
              <zf-hint ref="topTip" :delay="1000">
                <span>{{modeTip}}</span>
              </zf-hint>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-music icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i class="icon-music" :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-music icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon"
                 @click="toggleFavorite(currentSong)"
                 :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </section>
    </transition>
    <!--// 收起的播放器-->
    <transition name="mini">
      <section class="mini-player" v-show="!fullScreen && playShowHide" @click="open">
        <div class="icon">
          <img width="100%" height="100%"
               :src="currentSong.image"
               ref="iconImg"
               :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.songName"></h2>
          <p class="desc" v-html="getSinger(currentSong.singerName)"></p>
        </div>
        <div class="control">
          <zf-progress-circle :percent="sliderValue">
            <i class="icon-music icon-mini" :class="minPlayIcon" @click.stop="togglePlaying"></i>
          </zf-progress-circle>
        </div>
        <div class="control">
          <i class="icon-music icon-next" @click.stop="next"></i>
        </div>
        <div class="control" @click.stop="sowPlaylist">
          <i class="icon-music icon-playlist"></i>
        </div>
      </section>
    </transition>
    <!--// 列表-->
    <playlist ref="playlist"></playlist>
    <!--// 歌曲加载完成时派发canplay事件-->
    <!--// 歌曲发生错误时派发error事件-->
    <!--// 歌曲播放时派发timeupdate事件-->
    <audio ref="audio"
           :src="songUrl"
           @play="ready"
           @error="error"
           @timeupdate="updateTime" @ended="end"></audio>
  </section>
</template>
<script>
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
  import Lyric from 'lyric-parser'
  import {prefixStyle} from 'common/js/dom'
  import {playerMixin} from 'common/js/mixin'
  import {playMode} from 'common/js/config'
  import {getHtmlSize, getPlayTime, getRandomInt, getSinger} from 'common/js/util'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  export default {
    mixins: [playerMixin],
    created () {
      this.touch = {}
    },
    data () {
      return {
        songUrl: '',
        audioReady: false, // 歌曲是否准备完毕
        currentTime: 0,    // 歌曲当前播放时间
        sliderValue: 0,      // 进度
        sliderTouch: true,  // 进度条是否随播放同步
        currentLyric: null,  // 格式化好的歌词数据
        currentShow: 'cd',     // 当前页面
        currentLineNum: 0,     // 当前播放歌曲歌词的index
        playingLyric: [],      // cd页歌曲歌词
        cdLyric: true        // cd歌词格式判断
      }
    },
    watch: {
      // 监听歌曲变化
      currentSong(newSong, oldSong) {
        this.songUrl = this.currentSong.url
        // 没有歌曲return
        if (!newSong.songId) {
          return
        }
        // 歌曲id没变 则跳出
        if (newSong.songId === oldSong.songId) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
          this.currentTime = 0
          this.playingLyric = []
          this.currentLineNum = 0
        }
        clearTimeout(this.timer)
        // 歌曲变化后,等待dom更新完毕后 再执行
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      // 监听歌曲index 如歌曲id相同, index不同重新播放
      currentIndex(newIndex, oldIndex) {
        if (newIndex === -1) {
          return 0
        }
        this.deleteInsertIcon()
        if (newIndex === -1 || oldIndex === -1) {
          return
        }
        if (newIndex !== oldIndex && this.playlist[newIndex].songId === this.playlist[oldIndex].songId) {
          this.loop()
          return
        }
      },
      // 监听播放状态
      playing(val) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          val ? audio.play() : audio.pause()
        })
      },
      // 播放器收起展开时 歌词refresh
      fullScreen(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.$refs.lyricList.refresh()
          }, 20)
        }
      }
    },
    computed: {
      ...mapState('music', [
        'fullScreen',
        'playing',
        'playlist',
        'currentIndex',
        'playShowHide'
      ]),
      ...mapGetters('music', [
        'currentSong'
      ]),
      // 返回播放模式
      modeTip() {
        return this.mode === 0 ? '顺序播放' : this.mode === 1 ? '循环播放' : '随机播放'
      },
      // 是否歌曲封面旋转
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      // 播放图标切换(大)
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      // (小)
      minPlayIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      // 加载时，图标禁止点击 色
      disableCls() {
        return this.audioReady ? '' : 'disable'
      }
    },
    methods: {
      ...mapMutations('music', [
        'set_fullScreen',
        'set_playing',
        'set_currentIndex'
      ]),
      ...mapMutations('home', [
        'set_playHistory'
      ]),
      ...mapActions('music', [
        'deleteInsertIcon'
      ]),
      selectSinger() {
        this.back()
        this.$router.push({
          path: `/index/singer-details?singermid=${this.currentSong.singerMid[0]}`
        })
      },
      // 收起的播放器
      back() {
        this.set_fullScreen(false)
      },
      // 打开的播放器
      open() {
        this.set_fullScreen(true)
      },
      // 歌曲准备完毕audioReady：true
      ready() {
        this.audioReady = true
        this.set_playHistory(this.currentSong)
      },
      // 如果歌曲加载失败(网络错误，歌曲不存在)
      error() {
        // 如果歌曲报错 切换来源
        if (this.currentSong.songMid) {
          this.songUrl = `http://thirdparty.gtimg.com/C100${this.currentSong.songMid}.m4a?fromtag=38`
          this.$refs.audio.currentTime = 0
          this.$refs.audio.play()
          this.set_playing(true)
          this.audioReady = true
          if (this.currentLyric) {
            this.currentLyric.seek(0)
          }
        } else {
          this.next()
          this.audioReady = true
        }
      },
      // 歌曲播放时执行 设置当前时间
      updateTime(e) {
        this.currentTime = e.target.currentTime
        // 进度条同步
        if (this.sliderTouch) {
          let percent = this.currentTime / this.currentSong.duration * 100
          this.sliderValue = percent
        }
      },
      // 触摸时 进度条不同步
      sliderStart() {
        this.sliderTouch = false
      },
      // 不触摸时 进度条同步 设置当前时间
      sliderEnd() {
        this.currentTime = this.sliderValue * this.currentSong.duration / 100
        this.$refs.audio.currentTime = this.currentTime
        this.currentLyric.seek(this.currentTime * 1000)
        this.sliderTouch = true
      },
      // 音频时间处理
      playTime(time) {
        return getPlayTime(time)
      },
      // 作者处理
      getSinger(singer) {
        return getSinger(singer)
      },
      // 获取歌词并格式化，play时歌词播放
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          // 如果歌词不是这首歌的歌词 return
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          // 播放时启动 歌词播放
          if (this.playing) {
            this.currentLyric.play()
            this.currentLyric.seek(this.currentTime * 1000)
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ['该歌曲暂无歌词']
          this.currentLineNum = 0
        })
      },
      // 参数为(当前播放歌曲的歌词index, txt)
      handleLyric({ lineNum, txt }) {
        if (txt === 'undefined') {
          return
        }
        this.currentLineNum = lineNum
        // 歌词元素滚动
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        // cd歌词
        if (this.cdLyric) {
          this.playingLyric.push(
            {index: lineNum, txt},
            {index: lineNum + 1, txt: this.currentLyric.lines[lineNum + 1].txt}
          )
        } else {
          this.playingLyric.push(
            {index: lineNum + 1, txt: this.currentLyric.lines[lineNum + 1].txt},
            {index: lineNum, txt}
          )
        }
        if (this.playingLyric.length > 2) {
          this.playingLyric.splice(0, 2)
        }
        this.cdLyric = !this.cdLyric
      },
      // 显示歌曲列表
      sowPlaylist() {
        this.$refs.playlist.show()
      },
      // 播放暂停切换
      togglePlaying() {
        if (!this.audioReady) {
          return
        }
        this.set_playing(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      // 歌曲播放完成 播放下一首
      end() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      // 单曲循环方法
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.set_playing(true)
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      // 上一首
      prev() {
        if (!this.audioReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playlist.length - 1
          }
          // 随机播放mode
          if (this.mode === playMode.random) {
            let max = this.playlist.length
            let min = 0
            index = getRandomInt(min, max)
          }
          this.set_currentIndex(index)
          // 如果在暂停状态下切换,togglePlaying
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.audioReady = false
      },
      // 下一首
      next() {
        if (!this.audioReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          // 随机播放mode
          if (this.mode === playMode.random) {
            let max = this.playlist.length
            let min = 0
            index = getRandomInt(min, max)
          }
          this.set_currentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.audioReady = false
      },
      // 弹出播放模式
      topTipMode() {
        this.$refs.topTip.show()
      },
      middleTouchStart(e) {
        this.touch.initiated = true
        // 用来判断是否是一次移动
        this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        // Y轴拖动 return
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
        let windowWidth = -window.innerWidth
        windowWidth = windowWidth < -640 ? -640 : windowWidth
        const left = this.currentShow === 'cd' ? 0 : windowWidth
        let offsetWidth = Math.min(0, Math.max(windowWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / windowWidth)
        this.$refs.lyricListCont.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricListCont.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd() {
        if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
        let windowWidth = -window.innerWidth
        windowWidth = windowWidth < -640 ? -640 : windowWidth
//        从左向右
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = windowWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
//          从右向左
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = windowWidth
            opacity = 0
          }
        }
        const time = 300
        offsetWidth = offsetWidth < -640 ? -640 : offsetWidth
        this.$refs.lyricListCont.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricListCont.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .player
    .normal-player
      @include maxWidth
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: $zIndex_30
      background: $color-222
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: .25rem
        .back
          position: absolute
          top: 0
          left: .06rem
          z-index: 50
          .icon-back
            display: block
            padding: .09rem
            font-size: $font-size-1_8
            color: $color-d93f30
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: .4rem
          text-align: center
          @include no-warp
          font-size: $font-size-1_8
          color: $color-fff
        .subtitle
          line-height: .2rem
          text-align: center
          font-size: $font-size-1_4
          color: $color-fff
      .middle
        overflow: hidden
        height: 66%
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 72%
          .cd-wrapper
            position: absolute
            left: 50%
            top: 0
            width: 65%
            transform: translateX(-50%)
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: .6rem
              line-height: .3rem
              font-size: $font-size-1_4
              color: $color-fff05
              .current
                color: $color-fff
        .lyricListCont
          display: inline-block
          overflow: hidden
          width: 100%
          height: 84%
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: .3rem
              color: $color-fff05
              font-size: $font-size-1_4
              &.current
                color: $color-fff
      .bottom
        position: absolute
        bottom: .2rem
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 .04rem
            width: .1rem
            height: .1rem
            border-radius: 50%
            background: $color-fff05
            &.active
              width: .2rem
              border-radius: .05rem
              background: $color-fff08
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: .1rem 0
          >span
            font-size: $font-size-1_2
            color: #fff
            flex: 0 0 .4rem
            line-height: .3rem
            width: .4rem
          .time-l
            text-align: left
          .time-r
            text-align: right
          .slider
            flex: 1
            margin: 0 .05rem
          .time
            color: $color-fff
            font-size: $font-size-1_0
            flex: 0 0 .3rem
            line-height: .3rem
            width: .3rem
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-d93f30
            &.disable
              color: $color-d93f30-05
            i
              font-size: .3rem
          .i-left
            text-align: right
          .i-center
            padding: 0 .2rem
            text-align: center
            i
              font-size: .4rem
          .i-right
            text-align: left
          .icon-favorite
            color: $color-d93f30
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -1rem, 0)
        .bottom
          transform: translate3d(0, 1rem, 0)
    .mini-player
      max-width: 640px
      margin: 0 auto
      position: fixed
      left: 0
      bottom: 0
      right: 0
      display: flex
      align-items: center
      z-index: $zIndex_30
      width: 100%
      height: 60px
      background: $color-fff
      box-shadow: 0 10px 15px #000
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        margin: 0 20px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          @include no-warp
          font-size: $font-size-1_2
        .desc
          @include no-warp
          font-size: $font-size-1_0
      .control
        flex: 0 0 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist, .icon-next
          font-size: 30px
          color: $color-d93f30-05
        .icon-mini
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
