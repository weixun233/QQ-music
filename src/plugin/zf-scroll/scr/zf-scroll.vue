<template>
  <div ref="wrapper" class="list-wrapper">
    <div class="scroll-content">
      <div ref="listWrapper">
        <slot></slot>
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{pullUpTxt}}</span>
          </div>
          <div class="pullup-wrapper" v-else>
            <loading></loading>
          </div>
        </div>
      </div>
      <!--上拉刷新-->
    </div>
    <!--下拉刷新-->
    <slot name="pulldown"
          :pullDownRefresh="pullDownRefresh"
          :pullDownStyle="pullDownStyle"
          :beforePullDown="beforePullDown"
          :isPullingDown="isPullingDown"
          :bubbleY="bubbleY">
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="isPullingDown" class="loading">
            <loading></loading>
          </div>
          <div v-else><span>{{refreshTxt}}</span></div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Loading from '../components/loading/loading.vue'
  import Bubble from '../components/bubble.vue'
  import { getRect } from 'common/js/dom'

  const COMPONENT_NAME = 'zfScroll'
  const DIRECTION_H = 'horizontal'
  const DIRECTION_V = 'vertical'
  export default {
    name: COMPONENT_NAME,
    props: {
      data: {
        type: [Array, Object],
        default: () => []
      },
      probeType: {
        type: Number,
        default: 1
      },
      // 是否监听scroll的scroll事件
      listenScroll: {
        type: Boolean,
        default: false
      },
      // 是否开启滚动条
      scrollbar: {
        type: null,
        default: false
      },
      // 是否下拉刷新
      pullDownRefresh: {
        type: null,
        default: false
      },
      // 是否上拉刷新
      pullUpLoad: {
        type: null,
        default: false
      },
      // 是否派发beforeScroll事件，(滚动开始之前 收起键盘)
      listenBeforeScroll: {
        type: Boolean,
        default: false
      },
      click: {
        type: Boolean,
        default: true
      },
      direction: {
        type: String,
        default: DIRECTION_V
      },
      // 纵轴方向初始化位置
      startY: {
        type: Number,
        default: 0
      },
      // 更新dom延迟时间
      refreshDelay: {
        type: Number,
        default: 20
      },
      // 需要支持横向和纵向同时滚动，设置为true
      freeScroll: {
        type: Boolean,
        default: false
      },
      // 是否开启PC 端的鼠标滚轮
      mouseWheel: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        pullUpTxt: '已加载全部',
        beforePullDown: true,
        isRebounding: false,
        isPullingDown: false,
        isPullUpLoad: false,
        pullUpDirty: true,
        pullDownStyle: '',
        bubbleY: 0
      }
    },
    computed: {
      refreshTxt() {
        return this.pullDownRefresh && this.pullDownRefresh.txt
      }
    },
    created() {
      this.pullDownInitTop = -50
    },
    mounted() {
      setTimeout(() => {
        this.initScroll()
      }, 20)
    },
    methods: {
      initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
          this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`
        }
        let options = {
          probeType: this.probeType,
          click: this.click,
          scrollY: this.freeScroll || this.direction === DIRECTION_V,
          scrollX: this.freeScroll || this.direction === DIRECTION_H,
          scrollbar: this.scrollbar,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad,
          startY: this.startY,
          freeScroll: this.freeScroll,
          mouseWheel: this.mouseWheel
        }
        this.scroll = new BScroll(this.$refs.wrapper, options)
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }
        if (this.listenBeforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScrollStart')
          })
        }
        if (this.pullDownRefresh) {
          this._initPullDownRefresh()
        }
        if (this.pullUpLoad) {
          this._initPullUpLoad()
        }
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      clickItem(e, item) {
        this.$emit('click', item)
      },
      destroy() {
        this.scroll.destroy()
      },
      // 数据加载后调用该方法
      forceUpdate(dirty, text) {
        // 下拉刷新
        if (text) {
          this.pullUpTxt = text
        }
        if (this.pullDownRefresh && this.isPullingDown) {
          this.isPullingDown = false
          this._reboundPullDown().then(() => {
            this._afterPullDown()
          })
          // 上拉
        } else if (this.pullUpLoad && this.isPullUpLoad) {
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.pullUpDirty = dirty
          this.refresh()
        } else {
          this.refresh()
        }
      },
      // 下拉
      _initPullDownRefresh() {
        this.scroll.on('pullingDown', () => {
          this.beforePullDown = false
          this.isPullingDown = true
          this.$emit('pullingDown')
        })
        this.scroll.on('scroll', (pos) => {
          if (this.beforePullDown) {
            this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
            this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
          } else {
            this.bubbleY = 0
          }
          if (this.isRebounding) {
            this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`
          }
        })
      },
      // 上拉
      _initPullUpLoad() {
        this.scroll.on('pullingUp', () => {
          this.isPullUpLoad = true
          this.$emit('pullingUp')
        })
      },
      _noResult() {
        this.isPullUpLoad = false
      },
      // 当下拉刷新数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载
      _reboundPullDown() {
        const {stopTime = 600} = this.pullDownRefresh
        return new Promise((resolve) => {
          setTimeout(() => {
            this.isRebounding = true
            this.scroll.finishPullDown()
            resolve()
          }, stopTime)
        })
      },
      _afterPullDown() {
        setTimeout(() => {
          this.pullDownStyle = `top:${this.pullDownInitTop}px`
          this.beforePullDown = true
          this.isRebounding = false
          this.refresh()
        }, this.scroll.options.bounceTime)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.forceUpdate(true)
        }, this.refreshDelay)
      }
    },
    components: {
      Loading,
      Bubble
    }
  }
</script>

<style scoped lang="sass" type="text/sass">
  .list-wrapper
    /*position: relative*/
    /*position: absolute*/
    /*left: 0*/
    /*top: 0*/
    /*right: 0*/
    /*bottom: 0*/
    .scroll-content
      position: relative
      .list-content
        position: relative
        z-index: 10
        background: #fff
        .list-item
          height: 60px
          line-height: 60px
          font-size: 18px
          padding-left: 20px
          border-bottom: 1px solid #e5e5e5
      .pulldown-wrapper
        position: absolute
        width: 100%
        left: 0
        display: flex
        justify-content: center
        align-items: center
        transition: all
        .after-trigger
          margin-top: 10px
      .pullup-wrapper
        width: 100%
        display: flex
        justify-content: center
        align-items: center
        padding: 16px 0
      .before-trigger
        width: 100%
        padding: 16px 0
        text-align: center
</style>
