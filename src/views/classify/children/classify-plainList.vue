<template>
  <div class="classify-wholeList">
    <!--header-->
    <son-header :title="title"></son-header>
    <zf-scroll class="scroll"
               ref="scroll"
               :data="songSheet"
               :pullUpLoad="pullUpLoad"
               @pullingUp="pullingUp">
      <!--歌单-->
      <songSheet-list
        :data="songSheet"
        :titleBar="titleBar"
        :typeData="typeData"
        :navTitle="navTitle"
        :display="display"
        @selectSwitch="selectSwitch"></songSheet-list>
    </zf-scroll>
  </div>
</template>
<script>
  import {getSongSheet} from 'api/index'
  import {playListMixin} from 'common/js/mixin'

  export default {
    mixins: [playListMixin],
    name: 'classify-plainList',
    created() {
      this.display = 2
      this.titleBar = true
      this.pullUpLoad = true
      this.typeData = 'classify-plainList'
    },
    mounted() {
      setTimeout(() => {
        this.init()
      }, 20)
    },
    activated() {
      this.$emit('activatedLoad')
    },
    // keep-alive组件停用时调用
    deactivated() {
      this.$emit('leave')
    },
    // 页面卸载时停止调用
    beforeDestroy() {
      this.$emit('leave')
    },
    data() {
      return {
        title: this.$route.query.title,
        total: '',
        songSheet: [],
        sin: 0,           // 最热请求数量
        ein: 19,
        newestSin: 0,     // 最新请求数量
        newestEin: 19,
        hotSongSheet: [],   // 最热
        NewestSongSheet: [],  // 最新
        sortId: 5
      }
    },
    computed: {
      navTitle() {
        return `${this.title}(${this.total})`
      }
    },
    methods: {
      init() {
        this.$emit('load')
        this.id = this.$route.query.id
        getSongSheet({
          sin: this.sin,
          ein: this.ein,
          songSheetId: this.id,
          sortId: this.sortId
        }).then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.songSheet = res.data.list
            this.total = res.data.sum
            this.hotSongSheet = this.songSheet
            this.$emit('loadOk')
          } else {
            this.$emit('loadNo', this.init)
          }
        }).catch(err => {
          console.log(err)
          this.$emit('loadNo', this.init)
        })
      },
      // nav切换
      selectSwitch(sortId) {
        this.sortId = sortId
        if (this.hotSongSheet.length && this.NewestSongSheet.length) {
          if (sortId === 5) {
            this.songSheet = this.hotSongSheet
          } else if (sortId === 2) {
            this.songSheet = this.NewestSongSheet
          }
          return
        }
        getSongSheet({
          sin: this.newestSin,
          ein: this.newestEin,
          sortId: this.sortId
        }).then((res) => {
          if (res.code === 0) {
            this.songSheet = res.data.list
            if (sortId === 2) {
              this.NewestSongSheet = this.songSheet
            }
            this.$emit('loadOk')
          } else {
            this.$emit('loadNo', this.init)
          }
        }).catch(err => {
          console.log(err)
          this.$emit('loadNo', this.init)
        })
      },
      pullingUp() {
        let sin, ein, num
        if (this.sortId === 5) {
          num = this.sin
          this.sin = num + 1
          this.ein = num + this.ein
          sin = this.sin
          ein = this.ein
        } else if (this.sortId === 2) {
          num = this.newestSin
          this.newestSin = num + 1
          this.newestEin = num + this.newestEin
          sin = this.newestSin
          ein = this.newestEin
        }
        getSongSheet({
          sin,
          ein,
          sortId: this.sortId
        }).then((res) => {
          if (res.code === 0) {
            this.songSheet = this.songSheet.concat(res.data.list)
            if (this.sortId === 5) {
              this.hotSongSheet = this.songSheet
            } else if (this.sortId === 2) {
              this.NewestSongSheet = this.songSheet
            }
          } else {
            console.log('no')
          }
        })
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .classify-wholeList
    @include container
  .scroll
    position: fixed
    top: .4rem
    bottom: 0
    overflow: hidden
    width: 100%
</style>
