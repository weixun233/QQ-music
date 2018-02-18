<template>
  <div class="album-details">
    <son-header title="QQ音乐数字专辑"></son-header>
    <zf-scroll class="scroll" ref="scroll" :data="dataCont">
      <!--专辑top-->
      <div class="album-content">
        <div class="album-bg">
          <img :src="songImage(album.album_mid)">
        </div>
        <!--封面-->
        <div class="img">
          <img :src="songImage(album.album_mid)">
          <i class="album_bg"></i>
        </div>
        <!--text-->
        <div class="text">
          <p v-html="album.album_name"></p>
          <p class="name" v-if="album.singerinfo" v-html="album.singerinfo[0].singername"></p>
        </div>
      </div>
      <!--价格-->
      <div class="info">
        <div class="information" v-if="album.price">
          <p class="price">¥{{album.price | filterPrice}}.00</p>
          <p class="album_count" v-if="album.sale_info">已售{{album.sale_info.album_count}}张</p>
        </div>
        <div class="information" v-else>
          <p class="price">该专辑已下架或免费</p>
        </div>
        <div class="buy" v-if="album.price" @click="buy">购买</div>
      </div>
      <!--标签-->
      <ul class="buyright">
        <li v-for="(item, index) in album.buyright" :key="index">
          {{item}}
        </li>
      </ul>
      <!--简介-->
      <div class="desc">
        <h3>简介</h3>
        <p>唱片公司：{{album.companyname}}</p>
        <p>发行时间：{{album.publictime}}</p>
        <p :class="discInfo" v-html="album.desc"></p>
        <p class="disc-btn" @click="discSwitch">{{discText}}</p>
      </div>
      <h3 class="songEject">偷偷听一下(喜欢请支持正版!)</h3>
      <!--歌曲-->
      <album-song-list :data="albumSong" @selectSong="selectSong"></album-song-list>
    </zf-scroll>
    <!--购买-->
    <album-buy ref="albumBuy" :albumData="album" @selectPrice="selectPrice"></album-buy>
    <!--支付成功-->
    <zf-hint ref="promptBox" position="middle">一个假的支付成功</zf-hint>
  </div>
</template>
<script>
  import {mapMutations, mapActions} from 'vuex'
  import {getAlbumCont, getAlbumContSong} from 'api/index'
  import {singer, playListMixin} from 'common/js/mixin'
  import {filterPrice} from 'common/js/util'
  import AlbumSongList from './components/album-song-list.vue'
  import AlbumBuy from 'components/album-buy'
  import {createAlbumSong} from 'common/js/song'

  export default {
    mixins: [singer, playListMixin],
    name: 'album-details',
    components: {AlbumSongList, AlbumBuy},
    mounted() {
      setTimeout(() => {
        this.init()
      }, 20)
    },
    filters: {
      filterPrice
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
        disc: false,     // 简介
        album: {},
        albumSong: []
      }
    },
    computed: {
      dataCont() {
        return this.albumSong.concat(this.album)
      },
      discInfo() {
        return this.disc ? 'disc-show' : 'disc-hide'
      },
      discText() {
        return this.disc ? '[收起全文]' : '[展开全文]'
      }
    },
    methods: {
      ...mapMutations('music', [
        'set_playShowHide'
      ]),
      ...mapActions('music', [
        'selectPlay'
      ]),
      init() {
        this.$emit('load')
        this.album_id = this.$route.query.album_id
        getAlbumCont(this.album_id).then((res) => {
          if (res.code === 0) {
            this.album = res.data
            console.log(res)
            this.albumSong = this._normalize(res.data.songlist)
            this.$emit('loadOk')
          } else {
            this.$emit('loadNo', this.init)
          }
        }).catch(err => {
          console.log(err)
          this.$emit('loadNo', this.init)
        })
      },
      // 实例化song数据
      _normalize(list) {
        let ret = []
        list.forEach((item) => {
          if (item.albummid && item.songid) {
            ret.push(createAlbumSong(item))
          }
        })
        return ret
      },
      selectSong(item, index) {
        this.selectPlay({
          list: this.albumSong,
          index
        })
      },
      // 切换disc
      discSwitch() {
        this.disc = !this.disc
      },
      // 购买
      buy() {
        this.set_playShowHide(false)
        this.$refs.albumBuy.show()
      },
      selectPrice() {
        this.$refs.promptBox.show()
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .album-details
    @include container
  .scroll
    position: fixed
    top: .4rem
    bottom: 0
    width: 100%
    overflow: hidden
    color: $color-dcdcdc
    background: $color-212121
    .album-content
      position: relative
      padding: .2rem 0
      .album-bg
        width: 100%
        position: absolute
        left: 0
        top: 0
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(30px)
        img
          width: 100%
          height: 100%
      .img
        position: relative
        left: -.1rem
        width: 240px
        margin: 0 auto
        img
          width: 100%
        i
          width: 270px
          height: 240px
          position: absolute
          right: -30px
          top: 0
          background: url("https://y.gtimg.cn/mediastyle/yqq/img/album_cover.png") 0 0 no-repeat
          background-size: cover
      .text
        margin-top: .2rem
        color: $color-fff
        text-align: center
        font-size: $font-size-1_6
        line-height: .25rem
        .name
          font-size: $font-size-1_2
    .info
      margin: 0 .1rem
      padding-bottom: .05rem
      display: flex
      align-items: center
      .information
        flex: 1
        line-height: .25rem
        .price
          color: $color-ffce6b
          font-size: $font-size-1_8
        .album_count
          font-size: $font-size-1_3
      .buy
        width: .7rem
        height: .3rem
        line-height: .3rem
        text-align: center
        color: #7d3809
        border-radius: .05rem
        background: $color-ffce6b
    .buyright
      margin: 0 .1rem
      padding: .1rem 0
      display: flex
      align-items: center
      flex-wrap: wrap
      border-top: 1px solid $color-fff03
      li
        flex: 0 0 50%
        font-size: $font-size-1_1
    .desc
      margin: 0 .1rem
      h3
        height: .8rem
        line-height: .8rem
        font-size: $font-size-2_0
        text-align: center
      p
        line-height: .22rem
      .disc-hide
        @include no-warp-box(3)
      .disc-btn
        margin-top: .2rem
        color: $color-ffce6b
        text-align: center
    .songEject
      margin-top: .1rem
      height: .3rem
      line-height: .3rem
      text-align: center
</style>
