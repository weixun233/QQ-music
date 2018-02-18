<template>
  <div class="singer">
    <son-header title="歌手"></son-header>
    <singer-list :data="singer" ref="singer"></singer-list>
  </div>
</template>
<script>
  import {mapMutations, mapActions} from 'vuex'
  import SingerList from './components/singer-list'
  import {getSingerList} from 'api/singer'
  import {playListMixin} from 'common/js/mixin'

  export default {
    components: {SingerList},
    created() {
      this.hot = '热门'
      this.hot_len = 10
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
        singer: []
      }
    },
    methods: {
      init() {
        this.$emit('load')
        getSingerList().then((res) => {
          if (res.code === 0) {
            this.singer = this._normalizeSinger(res.data.list)
            this.$emit('loadOk')
          } else {
            this.$emit('loadNo', this.init)
          }
        }).catch(err => {
          console.log(err)
          this.$emit('loadNo', this.init)
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: this.hot,
            items: []
          }
        }
        list.forEach((item, index) => {
          // 热门歌手数据
          if (index < this.hot_len) {
            map.hot.items.push(item)
          }
          const key = item.Findex
          // 如果key名不存在则创建[A-Z]
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          // [A-Z]数据
          map[key].items.push(item)
        })
        // 排序为有序列表
        let hot = [], ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === this.hot) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/mixin'
  .singer
    @include container
</style>
