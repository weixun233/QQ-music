<template>
  <music-list
      ref="musicList"
      :data="song"
      :singer="singer"
      :title="title"
      :bgimage="bgimage"
      :follow="follow"
      @pullingUp="pullingUp">
  </music-list>
</template>
<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {createSong} from 'common/js/song'
  import {singer} from 'common/js/mixin'

  export default {
    mixins: [singer],
    name: 'singer-details',
    created() {
      this.follow = true
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
        song: [],
        singer: {},
        title: '',
        bgimage: '',
        begin: 40
      }
    },
    // 离开路由钩子
    beforeRouteLeave(to, from, next) {
      next() // 一定要调用next() 不然路由不会跳转
    },
    // 重复调用组件的钩子
    beforeRouteUpdate(to, from, next) {
      next()
    },
    watch: {
      $route(val) {
        if (val.query.singermid) {
          this.init() // 自己调用自己，重新初始化
        }
      }
    },
    computed: {
    },
    methods: {
      ...mapMutations('home', [
        'set_singer'
      ]),
      init() {
        this.singermid = this.$route.query.singermid
        this.$emit('load')
        getSingerDetail(this.singermid).then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.song = this._normalize(res.data.list)
            this.singer = res.data
            this.title = res.data.singer_name
            this.bgimage = `${this.image(res.data.singer_mid)}`
            this.set_singer(this.singer)
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
          let {musicData} = item
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      pullingUp() {
        getSingerDetail(this.singermid, this.begin).then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.song = this.song.concat(this._normalize(res.data.list))
            this.set_singer(this.song)
            this.begin += this.begin
          } else {
            this.$refs.musicList.forceUpdate('网络错误')
          }
        }).catch(err => {
          console.log(err)
          this.$refs.musicList.forceUpdate('网络错误')
        })
      }
    }
  }
</script>
