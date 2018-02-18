<template>
  <div class="songSheet">
    <music-list
      ref="musicList"
      :data="data"
      :title="title"
      :bgimage="bgimage"
      :songSheet="songSheet"
      :Collection="Collection"
      @pullingUp="pullingUp">
    </music-list>
  </div>
</template>
<script>
  import {mapMutations, mapActions} from 'vuex'
  import {createSong} from 'common/js/song'
  import {getSongSheetList} from 'api/index'

  export default {
    name: 'songSheet',
    created() {
      this.Collection = true
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
    props: {},
    data() {
      return {
        data: [],
        title: '',
        bgimage: '',
        songSheet: {}
      }
    },
    methods: {
      ...mapMutations('home', [
        'set_sheet'
      ]),
      init() {
        this.id = this.$route.query.id
        this.$emit('load')
        getSongSheetList(this.id).then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.data = this._normalize(res.cdlist[0].songlist)
            this.songSheet = res.cdlist[0]
            this.title = res.cdlist[0].dissname
            this.bgimage = res.cdlist[0].logo
            this.set_sheet(res.cdlist[0])
            this.$emit('loadOk')
          } else {
            this.$emit('loadNo', this.init)
          }
        }).catch(err => {
          console.log(err)
          this.$emit('loadNo', this.init)
        })
      },
      // 格式化数据
      _normalize(list) {
        let ret = []
        list.forEach((item) => {
          if (item.songid && item.albummid) {
            ret.push(createSong(item))
          }
        })
        return ret
      },
      pullingUp() {
        // 没有数据时调用
        setTimeout(() => {
          this.$refs.musicList.forceUpdate()
        }, 1000)
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .songSheet
    @include container
</style>
