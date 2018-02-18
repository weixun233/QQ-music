import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
// 共享的方法属性 歌手
export const singer = {
  computed: {
    windowWidth() {
      return `width: ${window.innerWidth}px`
    }
  },
  methods: {
    // 歌手头像
    image(mid) {
      return `https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`
    },
    // 歌曲图片 专辑图片
    songImage(albummid) {
      return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
    }
  }
}
// load方法
export const transmitLoad = {
  methods: {
    load() {
      this.$emit('load')
    },
    loadOk() {
      this.$emit('loadOk')
    },
    loadNo(init) {
      this.$emit('loadNo', init)
    },
    leave() {
      this.$emit('leave')
    }
  }
}

// 喜欢切换/mode切换
export const playerMixin = {
  computed: {
    ...mapState('music', [
      'mode'
    ]),
    ...mapState('home', [
      'favoriteList'
    ]),
    ...mapGetters('music', [
      'currentSong'
    ]),
    // 播放模式图标切换
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-music icon-sequence' : this.mode === playMode.loop ? 'icon-music icon-loop' : 'icon-music icon-random'
    }
  },
  methods: {
    ...mapMutations('music', [
      'set_mode'
    ]),
    ...mapMutations('home', [
      'set_favoriteList',
      'delete_favoriteList'
    ]),
    // 判断是否为喜欢
    ifLive(song) {
      const index = this.favoriteList.findIndex((item) => {
        return song.songId === item.songId
      })
      return index > -1
    },
    // 修改播放模式mode
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.set_mode(mode)
    },
    // 喜欢按钮样式切换
    getFavoriteIcon(song) {
      if (this.ifLive(song)) {
        return 'icon-music icon-favorite'
      } else {
        return 'icon-music icon-not-favorite'
      }
    },
    // 喜欢/取消喜欢
    toggleFavorite(song) {
      if (this.ifLive(song)) {
        this.delete_favoriteList(song)
      } else {
        this.set_favoriteList(song)
      }
    }
  }
}

// 有scroll页面需引用 (底部播放器出现 更新scroll)
export const playListMixin = {
  data() {
    return {
      offBottom: 60 + 'px'
    }
  },
  computed: {
    ...mapState('music', [
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist(playlist) {
      let offBottom = playlist.length > 0 ? this.offBottom : ''
      this.$refs.scroll.$el.style.bottom = offBottom
      this.$refs.scroll.refresh()
    }
  }
}
