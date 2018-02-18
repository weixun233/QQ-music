<template>
  <div class="rank">
    <son-header title="排行"></son-header>
    <zf-scroll class="scroll" :data="rank" ref="scroll">
      <ul class="rank-cont">
        <li v-for="(listItem, listIndex) in rank" :key="listIndex" @click="selectItem(listItem)">
          <div class="icon">
            <img width="100%" height="100%" v-lazy="listItem.picUrl" alt="">
          </div>
          <ul class="rank-item">
            <li v-for="(song, index) in listItem.songList" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.songname}} - {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </zf-scroll>
  </div>
</template>
<script>
  import {mapMutations, mapActions} from 'vuex'
  import {getTopList} from 'api/rank'
  import {playListMixin} from 'common/js/mixin'

  export default {
    mixins: [playListMixin],
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
        rank: []
      }
    },
    methods: {
      init() {
        this.$emit('load')
        getTopList().then((res) => {
          if (res.code === 0) {
            this.rank = res.data.topList
            this.$emit('loadOk')
          } else {
            this.$emit('loadNo', this.init)
          }
        }).catch(err => {
          console.log(err)
          this.$emit('loadNo', this.init)
        })
      },
      selectItem(item) {
        this.$router.push({
          path: `/index/rank-details?id=${item.id}`
        })
      }
    }
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import '~common/css/variable'
  @import '~common/css/mixin'
  .rank
    @include container
    .scroll
      position: fixed
      width: 100%
      top: .4rem
      bottom: 0
      overflow: hidden
      background: $color-fff
      .rank-cont
        >li
          display: flex
          margin: 0 .2rem
          padding-top: .2rem
          height: 1rem
          &:last-child
            padding-bottom: .2rem
          .icon
            flex: 0 0 1rem
            width: 1rem
            height: 1rem
          .rank-item
            flex: 1
            display: flex
            flex-direction: column
            justify-content: center
            padding: 0 .2rem
            height: 1rem
            overflow: hidden
            box-sizing: border-box
            border-bottom: 1px solid $color-999
            font-size: $font-size-1_2
            >li
              @include no-warp
              line-height: .26rem
</style>
