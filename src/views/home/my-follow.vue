<template>
  <div class="my-follow">
    <son-header title="我的关注"></son-header>
    <zf-scroll ref="scroll"
               class="scroll"
               :data="followSinger">
      <ul>
        <li v-for="(item, index) in followSinger"
            :key="index"
            @click.stop="selectItem(item)">
          <img v-lazy="image(item.singer_mid)">
          <div class="text">
            <p>{{item.singer_name}}</p>
            <i>&gt;</i>
          </div>
        </li>
      </ul>
    </zf-scroll>
    <zf-no-result class="no-result" v-if="!followSinger.length" title="你还没有关注哦!"></zf-no-result>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {singer, playListMixin} from 'common/js/mixin'

  export default {
    mixins: [singer, playListMixin],
    computed: {
      ...mapState('home', [
        'followSinger'
      ])
    },
    methods: {
      selectItem(item) {
        this.$router.push({
          path: `/index/singer-details?singermid=${item.singer_mid}`
        })
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import "~common/css/variable"
  @import "~common/css/mixin"
  .my-follow
    @include container
    .scroll
      max-width: 640px
      position: fixed
      width: 100%
      top: .4rem
      bottom: 0
      overflow: hidden
      ul
        li
          display: flex
          padding: .2rem 0 0 .2rem
          align-items: center
          img
            width: .6rem
            height: .6rem
            border-radius: 50%
          .text
            display: flex
            flex: 1
            height: .5rem
            line-height: .5rem
            margin-left: .2rem
            border-bottom: 1px solid $color-00001
            p
              flex: 1
            i
              padding: 0 .2rem
              font-size: $font-size-2_2
              font-family: 宋体
              font-style: normal
    .no-result
      position: absolute
      left: 50%
      top: 50%
      transform: translate3d(-50%, -50%, 0)
</style>
