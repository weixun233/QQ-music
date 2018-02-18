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
  import {getHotSongSheet} from 'api/index'
  import {playListMixin} from 'common/js/mixin'
  export default {
    mixins: [playListMixin],
    name: 'classify-list',
    created() {
      this.display = 2
      this.titleBar = true
      this.pullUpLoad = true
      this.typeData = 'classify-list'
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
        size: 20,         // 最热
        newSize: 20,     // 最新请求数量
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
        this.item_id = this.$route.query.item_id
        getHotSongSheet({
          id: this.item_id,
          sortId: this.sortId,
          size: this.size
        }).then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.songSheet = res.playlist.data.v_playlist
            this.total = res.playlist.data.total
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
      // sort切换
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
        getHotSongSheet({
          id: this.item_id,
          sortId: this.sortId,
          size: this.size
        }).then((res) => {
          if (res.code === 0) {
            this.songSheet = res.playlist.data.v_playlist
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
      // 上拉加载
      pullingUp() {
        let size, num
        if (this.sortId === 5) {
          num = this.size
          this.size = num + 20
          size = this.size
        } else if (this.sortId === 2) {
          num = this.newSize
          this.newSize = num + 20
          size = this.newSize
        }
        getHotSongSheet({
          id: this.item_id,
          sortId: this.sortId,
          size
        }).then((res) => {
          if (res.code === 0) {
            this.songSheet = res.playlist.data.v_playlist
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
