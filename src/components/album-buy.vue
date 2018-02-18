<template>
  <zf-eject-bottom ref="ejectBottom" @hide="setPlayShow">
    <div class="buy-content" @touchstate.stop>
      <!--专辑信息-->
      <div class="info">
        <img :src="songImage(albumData.album_mid)">
        <div class="text">
          <h3>{{albumData.album_name}}</h3>
          <p v-if="albumData.singer_name">{{albumData.singer_name}}</p>
          <p v-else-if="albumData.singerinfo">{{albumData.singerinfo[0].singername}}</p>
        </div>
        <i @click="hide" class="iconfont icon-shanchu"></i>
      </div>
      <!--支付相关-->
      <div class="num">
        <span>购买数量</span>
        <div class="numControl">
          <i :class="numClass" @click="prev">-</i>
          <input type="text" v-model="num">
          <i @click="next">+</i>
        </div>
      </div>
      <div class="price">
        <span>支付金额</span>
        <p>￥{{price}}.00</p>
      </div>
      <h3 class="goPrice" @click="goPrice">立即支付</h3>
    </div>
  </zf-eject-bottom>
</template>
<script>
  import {mapMutations} from 'vuex'
  import {singer} from 'common/js/mixin'
  import {filterPrice} from 'common/js/util'

  export default {
    mixins: [singer],
    props: {
      albumData: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        num: 1      // 数量
      }
    },
    computed: {
      // 总价
      price() {
        return filterPrice(this.num * this.albumData.price)
      },
      // 数量为1 -号为disable
      numClass() {
        return this.num <= 1 ? 'disable' : ''
      }
    },
    methods: {
      ...mapMutations('music', [
        'set_playShowHide'
      ]),
      setPlayShow() {
        this.set_playShowHide(true)
      },
      // 显示
      show() {
        this.set_playShowHide(false)
        this.$refs.ejectBottom.show()
      },
      // 隐藏
      hide() {
        this.set_playShowHide(true)
        this.$refs.ejectBottom.hide()
      },
      // 支付
      goPrice() {
        this.hide()
        this.$emit('selectPrice')
      },
      // 数量-
      prev() {
        if (this.num === 1) {
          return
        }
        this.num--
      },
      // 数量+
      next() {
        this.num++
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .buy-content
    width: 100%
    height: 2.9rem
    position: absolute
    bottom: 0
    left: 0
    background: $color-fff
  .info
    display: flex
    align-items: center
    padding: 0 .1rem
    img
      width: 1rem
      padding-right: .2rem
      position: relative
      top: -.2rem
    .text
      width: 1.6rem
      margin: -.2rem .2rem 0 0
      line-height: .25rem
      h3
        @include no-warp
      p
        @include no-warp
        color: $color-999
    i
      flex: 1
      font-size: $font-size-2_2
      text-align: right
      margin-top: -.5rem
      @include extend-click
  .num
    padding: 0 .1rem .2rem .1rem
    display: flex
    align-items: center
    border-bottom: 1px solid $color-00001
    span
      flex: 1
    .numControl
      width: 1.2rem
      display: flex
      align-items: center
      line-height: .3rem
      i
        flex: 0 0 .3rem
        height: .3rem
        box-sizing: border-box
        text-align: center
        border: 1px solid $color-999
        background: $color-f8f8f8
        &.disable
          color: $color-999
      input
        width: .6rem
        height: .3rem
        box-sizing: border-box
        border-top: 1px solid $color-999
        border-bottom: 1px solid $color-999
        text-align: center
  .price
    padding: .2rem .1rem
    display: flex
    align-items: center
    span
      flex: 1
      text-align: left
    p
      flex: 1
      font-size: $font-size-1_6
      text-align: right
  .goPrice
    margin: 0 .1rem
    height: .4rem
    line-height: .4rem
    background: $color-d93f30
    text-align: center
    color: $color-fff
    border-radius: .05rem
</style>
