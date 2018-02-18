<template>
  <div class="classify">
    <son-header title="分类歌单"></son-header>
    <zf-scroll :data="dataCont"
               ref="scroll"
               class="scroll"
               :pullUpLoad="pullUpLoad"
               @pullingUp="pullingUp">
      <h3>热门分类</h3>
      <ul class="songSheetClass">
        <li v-for="(item, index) in HotList" :key="index" v-if="index < 12" @click="selectClass(item)">{{item.item_name}}</li>
      </ul>
      <div class="songSheetClassWhole" @click="selectClassWhole">
        <p>查看全部分类</p>
      </div>
      <!--精选歌单-->
      <songSheet-list
        :data="choiceSongSheet"
        :titleBar="titleBar"
        :typeData="typeData"
        navTitle="精选歌单"
        :display="display"
        @selectSwitch="selectSwitch"></songSheet-list>
    </zf-scroll>
  </div>
</template>
<script>
  import {mapMutations, mapActions} from 'vuex'
  import {getIndex, getSongSheet} from 'api/index'
  import {playListMixin} from 'common/js/mixin'
  const sin = 0
  const ein = 9

  export default {
    mixins: [playListMixin],
    created() {
      this.display = 2
      this.titleBar = true
      this.typeData = 'classify'
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
        pullUpLoad: true,
        HotList: [],
        choiceSongSheet: [],  // 精选歌单
        hotSongSheet: [],     // 最热歌单缓存
        NewestSongSheet: [],  // 最新歌单缓存
        sinNewest: 0,
        einNewest: 9,
        sortId: 5
      }
    },
    computed: {
      dataCont() {
        return this.HotList.concat(this.choiceSongSheet)
      }
    },
    methods: {
      init() {
        this.$emit('load')
        getIndex().then((res) => {
          if (res.code === 0) {
            this.HotList = res.category.data.category[0].items
            this.$emit('loadOk')
          } else {
            this.$emit('loadNo', this.init)
          }
        }).catch(err => {
          console.log(err)
          this.$emit('loadNo', this.init)
        })

        getSongSheet({sin, ein}).then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.choiceSongSheet = res.data.list
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
        this.pullUpLoad = true
        if (this.hotSongSheet.length && this.NewestSongSheet.length) {
          if (sortId === 5) {
            this.choiceSongSheet = this.hotSongSheet
          } else if (sortId === 2) {
            this.choiceSongSheet = this.NewestSongSheet
          }
          return
        }
        getSongSheet({sin, ein, sortId}).then((res) => {
          if (res.code === 0) {
            this.choiceSongSheet = res.data.list
            if (sortId === 2) {
              this.NewestSongSheet = this.choiceSongSheet
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
        if (this.sortId === 5) {
          this.pullUpLoad = false
          return
        }
        let ein = this.einNewest
        this.sinNewest = ein + 1
        this.einNewest = ein + this.sinNewest
        getSongSheet({
          sin: this.sinNewest,
          ein: this.einNewest,
          sortId: this.sortId
        }).then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.choiceSongSheet = this.choiceSongSheet.concat(res.data.list)
            this.NewestSongSheet = this.choiceSongSheet
          } else {
            console.log('no')
          }
        })
      },
      // 跳转歌单列表
      selectClass(item) {
        this.$router.push({
          path: `/index/classify-list?item_id=${item.item_id}&title=${item.item_name}`
        })
      },
      // 跳转全部分类
      selectClassWhole() {
        this.$router.push({
          path: `/index/classify-whole`
        })
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .classify
    @include container
  .scroll
    position: fixed
    top: .4rem
    bottom: 0
    width: 100%
    max-width: 640px
    overflow: hidden
    h3
      padding-left: .2rem
      height: .4rem
      line-height: .4rem
    .songSheetClass
      margin: 0 .2rem
      display: flex
      flex-wrap: wrap
      justify-content: space-between
      li
        flex: 0 0 32%
        margin-bottom: .05rem
        text-align: center
        height: .3rem
        line-height: .3rem
        background: $color-f8f8f8
        border-radius: .03rem
    .songSheetClassWhole
      margin: 0 .2rem
      p
        width: 100%
        box-sizing: border-box
        height: .3rem
        line-height: .3rem
        text-align: center
        border-radius: .03rem
        background: $color-f8f8f8
</style>
