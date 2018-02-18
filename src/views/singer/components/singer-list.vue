<template>
  <div class="singer-list">
    <zf-scroll @scroll="scroll"
               :listen-scroll="listenScroll"
               :probeType="probeType"
               :data="data"
               class="singer-list"
               ref="scroll">
      <!--歌手-->
      <ul class="singer-info">
        <li v-for="(groupItem, groupIndex) in data" ref="listGroup" :key="groupIndex">
          <h3>{{groupItem.title}}</h3>
          <ul class="singer-item">
            <li @click="selectItem(item)" v-for="(item, index) in groupItem.items"  :key="index">
              <img v-lazy="image(item.Fsinger_mid)">
              <span>{{item.Fsinger_name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!--滑块-->
      <div class="singer-fixed" ref="fixed" v-show="fixedTitle">
        <p>{{fixedTitle}} </p>
      </div>
    </zf-scroll>
    <!--右导航-->
    <div class="singer-shortcut"
         @touchstart.stop="onStartShortcut"
         @touchmove.stop="onMoveShortcut">
      <ul>
        <li v-for="(item, index) in shortcutList"
            :data-index="index"
            :class="{'current':currentIndex===index}" :key="index">{{item}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {getData} from 'common/js/dom'
  import {getHtmlSize} from 'common/js/util'
  import {singer, playListMixin} from 'common/js/mixin'

  const SLIDER_HEIGHT_REM = 0.18
  const TITLE_HEIGHT_REM = 0.3

  export default {
    mixins: [singer, playListMixin],
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      // 右导航tit
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      // 滑块tit
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    created() {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = [] // 每个元素的高度区间
      this.probeType = 3
    },
    mounted() {
      setTimeout(() => {
        let HTMLSIZE = parseInt(getHtmlSize())
        this.slider_height = Math.round(HTMLSIZE * SLIDER_HEIGHT_REM)
        this.title_height = Math.round(HTMLSIZE * TITLE_HEIGHT_REM)
      }, 20)
    },
    data() {
      return {
        scrollY: -1, // 元素滚动的距离(负数)
        currentIndex: 0, // 滚动到元素的index
        slider_height: 0,
        diff: -1 // title元素距导航条的距离
      }
    },
    methods: {
      selectItem(item) {
        this.$router.push({
          path: `/index/singer-details?singermid=${item.Fsinger_mid}`
        })
      },
      onStartShortcut(e) {
        let Index = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = Index
        this._scrollTo(Index)
      },
      onMoveShortcut(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / this.slider_height | 0
        let Index = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(Index)
      },
      // 返回元素滚动的距离
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0)
      },
      // 元素滚动的判断区间生成
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += Math.floor(item.clientHeight)
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      // 监听data变化
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      // 监听元素滚动距离变化
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if ((-newY >= height1 && -newY < height2)) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < this.title_height) ? newVal - this.title_height : 0
        // 如果fixedTop 为 0 (即没有变化,则return,减少DOM操作)
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'

  .singer-list
    position: fixed
    width: 100%
    top: .4rem
    bottom: 0
    overflow: hidden
    background: $color-fff
    .singer-info
      li
        padding-bottom: .3rem
        h3
          height: .3rem
          line-height: .3rem
          padding-left: .2rem
          font-size: $font-size-1_2
          background: $color-e7e7e7
        .singer-item
          li
            display: flex
            align-items: center
            padding: .2rem 0 0 .3rem
            img
              width: .5rem
              height: .5rem
              border-radius: 50%
            span
              margin-left: .2rem
              font-size: $font-size-1_4
    .singer-shortcut
      position: absolute
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: .2rem
      padding: .2rem 0
      border-radius: .1rem
      text-align: center
      background: $color-d93f30
      font-family: Helvetica
      li
        padding: .03rem
        line-height: 1
        color: $color-fff05
        font-size: $font-size-1_2
        &.current
          color: $color-fff
    .singer-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      p
        height: .3rem
        line-height: .3rem
        padding-left: .2rem
        font-size: $font-size-1_2
        background: $color-e7e7e7
</style>
