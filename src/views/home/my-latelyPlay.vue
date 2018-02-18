<template>
  <div class="my-latelyPlay">
    <son-header title="最近播放" :clear="clear" @clear="clearHistory"></son-header>
    <song-list class="songLists"
               :data="songs"
               :pullUpLoad="pullUpLoad"
               ref="songList"></song-list>
    <!--选择框-->
    <zf-confirm ref="confirm" @confirm="confirmClear" title="清空所有最近播放历史?" confirmBtnText="清空"></zf-confirm>
    <zf-no-result class="no-result" title="最近还没听过歌曲哦!" v-if="playHistory.length === 0"></zf-no-result>
  </div>
</template>
<script>
  import SongList from 'components/song-list/song-list'
  import {mapState, mapMutations} from 'vuex'
  import Song from 'common/js/song'

  export default {
    components: {SongList},
    created() {
      this.clear = true
      this.pullUpLoad = false
    },
    mounted() {
      this.init()
    },
    data () {
      return {
        songs: []
      }
    },
    computed: {
      ...mapState('home', [
        'playHistory'
      ])
    },
    methods: {
      ...mapMutations('home', [
        'clear_playHistory'
      ]),
      init() {
        console.log(this.playHistory.length)
        this.songs = this._normalize(this.playHistory)
      },
      // song实例化
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
      // 清空历史弹出
      clearHistory() {
        this.$refs.confirm.show()
      },
      // 清空历史
      confirmClear() {
        this.clear_playHistory()
        this.songs = []
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .my-latelyPlay
    @include container
  .no-result
    position: absolute
    top: 50%
    left: 50%
    transform: translate3d(-50%, -50%, 0)
</style>
