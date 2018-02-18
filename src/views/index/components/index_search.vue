<template>
  <div class="search">
    <!--输入框-->
    <div class="search-input">
      <i class="icon-music icon-search"></i>
      <input type="text"
             v-model="query"
             placeholder="搜索歌曲、歌手"
             ref="query">
      <span class="iconfont icon-icon-cross-empty" @click="clear" v-show="query"></span>
    </div>
    <!--热门搜索-->
    <div class="hot-key">
      <h3 class="title">
        <span>热门搜索</span>
        <span @click="setHotKey">换一换</span>
      </h3>
      <ul>
        <li v-for="(item, index) in hotKey" :key="index" @click="setQuery(item.k)">{{item.k}}</li>
      </ul>
    </div>
    <!--搜索历史-->
    <div class="search-history" v-show="searchHistory.length">
      <h3 class="title">
        <span>搜索历史</span>
        <i class="iconfont icon-lajitong" @click="clearSearch"></i>
      </h3>
    </div>
    <zf-scroll :data="searchHistory" class="scroll-cont" ref="scrollCont" :style="windowWidth">
      <ul>
        <li v-for="(item, index) in searchHistory" :key="index" @click="setQuery(item)">
          <span>{{item}}</span>
          <i class="iconfont icon-shanchu" @click.stop="delete_searchHistory(index)"></i>
        </li>
      </ul>
    </zf-scroll>
    <zf-confirm
      class="confirm"
      ref="confirm"
      title="是否清空所有搜索历史"
      confirmBtnText="清空"
      @confirm="clear_searchHistory">
    </zf-confirm>
    <!--搜索结果-->
    <zf-scroll :data="result"
               ref="searchResult"
               class="search-result"
               :probeType="probeType"
               :pullUpLoad="pullUpLoad"
               :listenBeforeScroll="listenBeforeScroll"
               @pullingUp="pullingUp"
               :style="windowWidth"
               @beforeScrollStart="beforeScrollStart" v-show="query">
      <div>
        <ul>
          <li v-for="(item, index) in result" :key="index" @click="selectResult(item)">
            <i class="iconfont" :class="resultIcon(item)"></i>
            <span v-html="getDisplayName(item)"></span>
          </li>
        </ul>
      </div>
    </zf-scroll>
  </div>
</template>
<script>
  import {mapState, mapMutations, mapActions} from 'vuex'
  import {funcThrottle, getRandomInt, getSinger} from 'common/js/util'
  import {getHotKey, getSearch} from 'api/search'
  import {singer, playListMixin} from 'common/js/mixin'
  import {createSong} from 'common/js/song'

  const Singer = 'singer'

  export default {
    mixins: [singer, playListMixin],
    components: {},
    created() {
      this.zhida = true
      this.listenBeforeScroll = true
      this.pullUpLoad = true
      this.perpage = 20

      this.pullup = true
      this.probeType = 3
    },
    mounted() {
      setTimeout(() => {
        this.init()
      }, 20)
    },
    props: {
      // navIndex
      navIndex: {
        type: Number,
        default: 0
      }
    },
    watch: {
      navIndex() {
        this.init()
      },
      query() {
        funcThrottle(this._search(), 200)
        this.$nextTick(() => {
          this.$refs.scrollCont.refresh()
        })
      }
    },
    data() {
      return {
        loadTitle: '资源加载中...',
        whole: true,   // 是否有数据
        query: '',      // 关键词
        hot: [],        // 全部hot关键词
        hotKey: [],     // 显示的hot关键词
        result: []      // 搜索结果
      }
    },
    computed: {
      ...mapState('search', [
        'searchHistory'
      ])
    },
    methods: {
      ...mapMutations('search', [
        'clear_searchHistory',
        'delete_searchHistory',
        'set_searchHistory'
      ]),
      ...mapActions('music', [
        'insertSong'
      ]),
      handlePlaylist(playlist) {
        let offBottom = playlist.length > 0 ? this.offBottom : ''
        this.$refs.scrollCont.$el.style.bottom = offBottom
        this.$refs.searchResult.$el.style.bottom = offBottom
        this.$refs.scrollCont.refresh()
        this.$refs.searchResult.refresh()
      },
      init() {
        if (this.navIndex === 2 && this.hot.length === 0) {
          this.$emit('load')
          getHotKey().then((res) => {
            if (res.code === 0) {
              console.log(res)
              this.hot = res.data.hotkey
              this.setHotKey()
              this.$emit('loadOk')
            } else {
              this.$emit('loadNo', this.init)
            }
          }).catch(err => {
            console.log(err)
            this.$emit('loadNo', this.init)
          })
        }
      },
      // 搜索
      _search() {
        this.$emit('load')
        this.page = 1
        if (this.query) {
          this.set_searchHistory(this.query)
        }
        getSearch({
          query: this.query,
          page: this.page,
          zhida: this.zhida,
          perpage: this.perpage
        }).then(res => {
          if (res.code === 0) {
            this.result = this._getResult(res.data)
            console.log(this.result)
            this.$emit('loadOk')
          } else {
            this.$emit('loadNo', this._search)
          }
        }).catch(err => {
          console.log(err)
          this.$emit('loadNo', this._search)
        })
      },
      // 处理请求的数据格式
      _getResult(data) {
        let ret = []
        // 如果是歌手
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: Singer}})
        }
        // 如果是歌曲
        if (data.song) {
          ret = ret.concat(this._normalize(data.song.list))
        }
        return ret
      },
      // 把数据转化为Song实例
      _normalize(list) {
        let ret = []
        list.forEach((item) => {
          if (item.songid && item.albumid) {
            ret.push(createSong(item))
          }
        })
        return ret
      },
      // 设置query
      setQuery(query) {
        this.query = query
      },
      // 设置hot
      setHotKey() {
        let len = this.hot.length - 10
        let min = getRandomInt(0, len)
        this.hotKey = this.hot.slice(min, min + 6)
      },
      // 搜索结果icon
      resultIcon(item) {
        if (item.type === Singer) {
          return 'icon-geshou'
        } else {
          return 'icon-yinlemusic214'
        }
      },
      // 返回歌手名 / 歌曲名-作者
      getDisplayName(item) {
        if (item.type === Singer) {
          return item.singername
        } else {
          return `${item.songName} - ${item.singerName}`
        }
      },
      clearSearch() {
        this.$refs.confirm.show()
      },
      // 上拉刷新
      pullingUp () {
        if (!this.whole) {
          return
        }
        this.page++
        getSearch({
          query: this.query,
          page: this.page,
          zhida: this.zhida,
          perpage: this.perpage
        }).then(res => {
          if (res.code === 0) {
            this.result = this.result.concat(this._getResult(res.data))
            this._checkMore(res.data)
          } else {
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 清空输入框
      clear() {
        this.query = ''
      },
      // 如果没有数据，则修改hasMore
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * this.perpage) > song.totalnum) {
          this.whole = true
          this.bottomLoad = false
        }
      },
      beforeScrollStart() {
        this.$refs.query.blur()
      },
      // 点击搜索结果
      selectResult(item) {
        // 如果是歌手 跳转到歌手主页
        if (item.type === Singer) {
          this.$router.push({
            path: `/index/singer-details?singermid=${item.singermid}`
          })
        } else {
          // 是歌曲 播放
          this.insertSong(item)
        }
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'

  .search
    position: relative
    height: 100%
    .search-input
      display: flex
      margin: .28rem .24rem
      align-items: center
      box-sizing: border-box
      padding: 0 .06rem
      height: .44rem
      border-radius: .06rem
      i
        font-size: .24rem
      input
        flex: 1
        margin: 0 .05rem
        line-height: .18rem
        font-size: $font-size-1_4
      span
        font-size: $font-size-2_2
    .hot-key
      margin: 0 .24rem .1rem .24rem
      h3
        display: flex
        align-items: center
        margin-bottom: .2rem
        color: $color-666
        span
          flex: 1
        span:last-child
          text-align: right
      li
        display: inline-block
        padding: .07rem .1rem .05rem
        margin: 0 .2rem .1rem 0
        border-radius: .06rem
    .title
      display: flex
      align-items: center
      margin-bottom: .2rem
      color: $color-666
      span
        flex: 1
      i
        flex: 1
        @include extend-click
        text-align: right
    .search-history
      margin: 0 .24rem
    .scroll-cont
      position: fixed
      top: 3rem
      bottom: 0
      overflow: hidden
      ul
        margin: 0 .24rem
        li
          display: flex
          padding: .05rem 0
          align-items: center
          color: $color-666
          span
            flex: 1
          i
            flex: 1
            @include extend-click
            text-align: right
    .search-result
      position: fixed
      top: 1rem
      bottom: 0
      width: 100%
      overflow: hidden
      background: $color-fff
      ul
        padding: 0 .3rem
        li
          display: flex
          align-items: center
          padding: .12rem 0
          i
            flex: 0 0 .3rem
            font-size: $font-size-1_8
          span
            max-width: 2.8rem
            flex: 1
            overflow: hidden
            @include no-warp
    .confirm
      position: absolute
</style>
