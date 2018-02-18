<template>
  <ul class="album-list">
    <!--每个块-->
    <li v-for="(albumItem, albumIndex) in data" :key="albumIndex">
      <!---->
      <h3>{{title[albumIndex]}}</h3>
      <!--每个块的内容-->
      <ul class="album-item">
        <li v-for="(item, index) in albumItem.albumlist" v-if="ifAlbum(index, albumIndex)" :key="index" @click="selectAlbum(item)">
          <div class="img">
            <img v-lazy="songImage(item.album_mid)">
          </div>
          <div class="text">
            <p class="title">{{item.album_name}}</p>
            <p class="name">{{item.singer_name}}</p>
            <div class="price">
              <span>¥{{item.price | filterPrice}}</span>
              <span class="buy" @click.stop="buy(item)">购买</span>
            </div>
          </div>
        </li>
      </ul>
    </li>
  </ul>
</template>
<script>
  import {filterPrice} from 'common/js/util'
  import {singer} from 'common/js/mixin'

  export default {
    mixins: [singer],
    props: {
      title: {
        type: Array,
        default: () => []
      },
      data: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        len: [6, 3, 6, 3, 6, 6, 6, 6, 6]
      }
    },
    filters: {
      filterPrice
    },
    methods: {
      // 显示长度
      ifAlbum(index, albumIndex) {
        return index < this.len[albumIndex]
      },
      // 点击触发事件
      selectAlbum(item) {
        this.$emit('selectAlbum', item)
      },
      buy(item) {
        this.$emit('buy', item)
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import "~common/css/mixin"
  @import "~common/css/variable"

  .album-list
    >li
      >h3
        height: .4rem
        line-height: .4rem
        text-align: center
      .album-item
        display: flex
        flex-wrap: wrap
        justify-content: space-between
        >li
          width: 33%
          padding-bottom: .12rem
          .img
            height: 1.2rem
            background: rgba(204, 164, 112, 0.84)
            text-align: center
            img
              height: 100%
          .text
            padding: 0 .1rem
            font-size: $font-size-1_1
            line-height: .2rem
            .title
              @include no-warp
            .name
              @include no-warp
              color: $color-999
            .price
              display: flex
              color: $color-999
              span
                flex: 1
                text-align: left
              .buy
                text-align: right
                color: $color-d93f30
</style>
