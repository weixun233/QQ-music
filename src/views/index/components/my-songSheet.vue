<template>
  <div class="my-songSheet">
    <h3 @click="fullList">
      <i class="iconfont icon-jiantouxia" :class="titleIcon"></i>
      <span>{{title}}</span>
    </h3>
    <ul>
      <li v-for="(item, index) in songSheet" :key="index" @click="selectItem(item, index)">
        <img class="img" :src="imgurl(item)" alt="">
        <div class="text">
          <div class="left">
            <p class="title" v-if="item.title">{{item.title}}</p>
            <p class="title" v-else>{{item.dissname}}</p>
            <p class="info">
              <span>{{item.songLength}}首</span>
              <span v-if="item.nickname">{{item.nickname}}</span>
            </p>
          </div>
          <div class="gengduo" @click.stop="deleteConfirm(item)">
            <i class="iconfont icon-gengduo"></i>
          </div>
        </div>
      </li>
    </ul>
    <zf-no-result class="no-result" v-show="fullSongSheet" v-if="songSheet.length === 0" :title="noTitle"></zf-no-result>
  </div>
</template>
<script>
  import {mapMutations, mapActions} from 'vuex'

  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      songSheet: {
        type: Array,
        default: () => []
      },
      noTitle: {
        type: String,
        default: '没有任何东西'
      }
    },
    data() {
      return {
        fullSongSheet: true
      }
    },
    computed: {
      titleIcon() {
        return this.fullSongSheet ? 'show' : 'hide'
      }
    },
    methods: {
      ...mapMutations('home', [
        'delete_collectSheet',
        'noNew_songSheet'
      ]),
      // 歌单hide/show
      fullList() {
        this.fullSongSheet = !this.fullSongSheet
      },
      imgurl(item) {
        if (item.imgurl) {
          return item.imgurl
        } else if (item.logo) {
          return item.logo
        }
      },
      // 歌单跳转
      selectItem(item, index) {
        // 收藏的歌单跳转
        if (item.dissid) {
          this.$router.push({
            path: `/index/songSheet?id=${item.disstid}`
          })
        } else {
          this.$router.push({
            path: `/index/my-songSheet?index=${index}`
          })
        }
      },
      deleteConfirm(item) {
        this.$emit('deleteConfirm', item)
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .my-songSheet
    h3
      height: .3rem
      display: flex
      align-items: center
      background: $color-e7e7e7
      color: $color-666
      font-size: $font-size-1_2
      i
        padding: 0 .1rem
        transition: transform .3s
        &.show
          transform: rotate(0)
        &.hide
          transform: rotate(-90deg)
    li
      padding-top: .03rem
      display: flex
      height: .6rem
      align-items: center
      justify-content: center
      .img
        width: .6rem
        height: 100%
      .text
        display: flex
        flex: 1
        height: 100%
        box-sizing: border-box
        padding: .1rem 0
        margin-left: .1rem
        border-bottom: 1px solid $color-00001
        .left
          flex: 1
          .title
            max-width: 2rem
            @include no-warp
            padding-bottom: .1rem
          .info
            color: $color-999
            font-size: $font-size-1_0
        .gengduo
          width: .6rem
          text-align: center
          line-height: .4rem
          i
            display: inline-block
    .no-result
      padding: .2rem 0
</style>
