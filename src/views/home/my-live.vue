<template>
  <div class="my-songSheet">
    <music-list
      :data="data"
      title="我喜欢的"
      :pullUpLoad="pullUpLoad"
      :bgimage="bgimage"></music-list>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Song from 'common/js/song'

  export default {
    created() {
      this.pullUpLoad = false
    },
    mounted() {
      this.init()
    },
    data() {
      return {
        data: {},
        bgimage: ''
      }
    },
    computed: {
      ...mapState('home', [
        'favoriteList'
      ])
    },
    methods: {
      // 歌单歌曲 请求
      init() {
        this.data = this._normalize(this.favoriteList)
        this.bgimage = this.favoriteList[0].image
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
