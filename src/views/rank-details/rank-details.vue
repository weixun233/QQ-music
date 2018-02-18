<template>
  <music-list
      :data="rank"
      :bgimage="bgimage"
      :title="title"
      :typeData="typeData"
      :follow="follow">
  </music-list>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {createSong} from 'common/js/song'
  import {singer, playListMixin} from 'common/js/mixin'

  export default {
    mixins: [singer, playListMixin],
    name: 'rank-details',
    created() {
      this.follow = true
      this.typeData = 'rank'
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
        rank: [],
        title: '',
        bgimage: ''
      }
    },
    computed: {
    },
    methods: {
      init() {
        this.id = this.$route.query.id
        this.$emit('load')
        getMusicList(this.id).then((res) => {
          if (res.code === 0) {
            this.rank =  this._normalize(res.songlist)
            this.title = res.topinfo.ListName
            this.bgimage = `${this.songImage(res.songlist[0].data.albummid)}`
            console.log(res)
            this.$emit('loadOk')
          } else {
            this.$emit('loadNo', this.init)
          }
        }).catch(err => {
          console.log(err)
          this.$emit('loadNo', this.init)
        })
      },
      _normalize(list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>
