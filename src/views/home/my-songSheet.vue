<template>
  <div class="my-songSheet">
    <music-list
      ref="musicList"
      :data="data"
      :title="title"
      :bgimage="bgimage"
      @pullingUp="pullingUp"
      :songSheet="songSheets"></music-list>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Song from 'common/js/song'

  export default {
    mounted() {
      this.init()
    },
    data() {
      return {
        data: {},
        title: '',
        songSheets: [],
        bgimage: ''
      }
    },
    computed: {
      ...mapState('home', [
        'songSheet'
      ])
    },
    methods: {
      // 歌单歌曲 请求
      init() {
        this.index = this.$route.query.index
        this.songSheets = this.songSheet[this.index]
        this.data = this._normalize(this.songSheet[this.index].songlist)
        this.title = this.songSheet[this.index].title
        this.bgimage = this.songSheet[this.index].songlist[0].image
      },
      // 格式化数据
      _normalize(list) {
        let ret = []
        list.forEach((item) => {
          if (item.songId && item.songMid) {
            ret.push(
              new Song({
                songId: item.songId,
                songMid: item.songMid,
                songName: item.songName,
                singerId: item.singerId,
                singerMid: item.singerMid,
                singerName: item.singerName,
                albumId: item.albumId,
                albumMid: item.albumMid,
                albumName: item.albumName,
                duration: item.duration,
                image: item.image,
                url: item.url
              })
            )
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
  .my-songSheet
    @include container
</style>
