<template>
  <div style="height: 100%">
    <zf-scroll :data="dataCont"
                 class="scroll"
                 ref="scroll"
                 :style="windowWidth">
        <!--banner-->
        <div class="banner-wrapper" @touchstart.stop>
          <zf-banner v-if="banner.length" :bindToWrapper="bindToWrapper">
            <div v-for="(item, index) in banner" :key="index">
              <a :href="item.jump_info.url">
                <img :src="item.pic_info.url" @load="loadImage">
              </a>
            </div>
          </zf-banner>
        </div>
        <!--nav-->
        <ul class="nav">
          <li v-for="(item, index) in nav" :class="navIndexActive(index)" :key="index" @click="selectItem(index)">{{item}}</li>
        </ul>
        <!--歌单list-->
        <h3>热门歌单推荐</h3>
        <songSheet-list :data="songSheet" :len="len" :typeData="typeData"></songSheet-list>
    </zf-scroll>
  </div>
</template>
<script>
  import {mapMutations, mapActions} from 'vuex'
  import {getIndex} from 'api/index'
  import {singer, playListMixin} from 'common/js/mixin'

  export default {

    mixins: [singer, playListMixin],
    components: {},
    created() {
      this.len = 9
      this.bindToWrapper = true
      this.typeData = 'index'
    },
    mounted() {
      setTimeout(() => {
        this.init()
      }, 20)
    },
    props: {
      // navIndex
      navIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        nav: ['歌手', '排行', '电台', '分类歌单', '视频MV', '数字专辑'],
        banner: [],
        songSheet: []
      }
    },
    watch: {
      navIndex() {
        this.init()
      }
    },
    computed: {
      dataCont() {
        return this.banner.concat(this.songSheet)
      }
    },
    methods: {
      init() {
        if (this.navIndex === 1 && this.dataCont.length === 0) {
          this.$emit('load')
          getIndex().then((res) => {
            if (res.code === 0) {
              this.banner = res.focus.data.content
              this.songSheet = res.recomPlaylist.data.v_hot
              this.$emit('loadOk')
            } else {
              this.$emit('loadNo', this.init)
            }
          }).catch(err => {
            console.log(err)
            this.$emit('loadNo', this.init)
          })
        }
      },
      // banner 图片加载后 重新scroll
      loadImage() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
      selectItem(index) {
        console.log(index)
        switch (index) {
          case 0:
            this.$router.push({
              path: `/index/singer`
            })
            break
          case 1:
            this.$router.push({
              path: `/index/rank`
            })
            break
          case 2:
            this.$router.push({
              path: `/index/radio`
            })
            break
          case 3:
            this.$router.push({
              path: `/index/classify`
            })
            break
          case 5:
            this.$router.push({
              path: `/index/album`
            })
            break
          default:
            break
        }
      },
      navIndexActive(index) {
        if (index === 4 || index === 2) {
          return 'noReady'
        }
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .scroll
    position: fixed
    top: 0
    bottom: 0
    overflow: hidden
    .banner-wrapper
      overflow: hidden
      position: relative
    h3
      height: .5rem
      line-height: .5rem
      text-align: center
    .nav
      margin-top: .1rem
      display: flex
      font-size: $font-size-1_6
      flex-wrap: wrap
      align-items: center
      justify-content: space-between
      li
        flex: 0 0 33%
        padding: .1rem 0
        text-align: center
        &.noReady
          color: $color-999
</style>
