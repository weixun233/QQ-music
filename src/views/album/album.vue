<template>
  <div class="album">
    <son-header title="数字专辑"></son-header>
    <zf-scroll class="scroll" :data="dataCont" ref="scroll">
      <!--banner-->
      <div class="banner-wrapper" @touchstart.stop>
        <zf-banner v-if="banner.length">
          <div v-for="(item, index) in banner" :key="index">
            <a :href="item.jumpurl">
              <img :src="item.picurl" @load="loadImage">
            </a>
          </div>
        </zf-banner>
      </div>
      <!--cont-->
      <album-list :data="album" :title="title" @buy="buy" @selectAlbum="selectAlbum"></album-list>
    </zf-scroll>
    <!--购买-->
    <album-buy ref="albumBuy" :albumData="albumItem" @selectPrice="selectPrice"></album-buy>
    <!--支付成功-->
    <zf-hint ref="promptBox" position="middle">一个假的支付成功</zf-hint>
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'
  import {getAlbum} from 'api/index'
  import AlbumList from './components/album-list'
  import AlbumBuy from 'components/album-buy'
  import {playListMixin} from 'common/js/mixin'

  export default {
    mixins: [playListMixin],
    components: {AlbumList, AlbumBuy},
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
        banner: [],
        album: [],
        title: [
          '最新上架',
          '本周热销',
          '音乐人专区',
          '2017华语乐坛精选推荐',
          '2017华语乐坛女王风范',
          '2017韩国年度流行专辑',
          '2017欧美金曲经典回顾',
          '2017内地豪华钜制OST',
          '2017韩国最美爱情旋律OST'
        ],
        albumItem: {}       // 点击的专辑数据
      }
    },
    computed: {
      dataCont() {
        return this.banner.concat(this.album)
      }
    },
    methods: {
      ...mapMutations('music', [
        'set_playShowHide'
      ]),
      init() {
        this.$emit('load')
        getAlbum().then((res) => {
          console.log(res)
          if (res.code === 0) {
            this.banner = res.data.banner
            this.album = res.data.content
            this.$emit('loadOk')
          } else {
            this.$emit('loadNo', this.init)
          }
        }).catch(err => {
          console.log(err)
          this.$emit('loadNo', this.init)
        })
      },
      // banner 图片加载后 重新scroll
      loadImage() {
        if (!this.checkLoaded) {
          this.checkLoaded = true
        }
      },
      buy(item) {
        this.albumItem = item
        this.$refs.albumBuy.show()
      },
      selectPrice() {
        this.$refs.promptBox.show()
      },
      // 跳转专辑详情
      selectAlbum(item) {
        this.$router.push({
          path: `/index/album-details?album_id=${item.album_id}`
        })
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .album
    @include container
  .scroll
    position: fixed
    top: .4rem
    bottom: 0
    overflow: hidden
    width: 100%
    .banner-wrapper
      position: relative
      overflow: hidden
</style>
