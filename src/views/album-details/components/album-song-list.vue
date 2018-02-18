<template>
  <ul class="list">
    <li v-for="(item, index) in data" :key="index" @click="selectSong(item, index)">
      <div class="name">
        <span class="songName">0{{index + 1}}.{{item.songName}}</span>
      </div>
      <i class="icon-music" :class="iconBtn(index, item)"></i>
    </li>
  </ul>
</template>
<script>
  import {mapState, mapGetters} from 'vuex'
  export default {
    props: {
      data: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      ...mapState('music', [
        'currentIndex',
        'playing'
      ]),
      ...mapGetters('music', [
        'currentSong'
      ])
    },
    methods: {
      iconBtn(index, item) {
        console.log(this.currentIndex === index && this.currentSong.songId === item.songId && this.playing)
        if (this.currentIndex === index && this.currentSong.songId === item.songId && this.playing) {
          return 'icon-pause-mini'
        }
        return 'icon-play-mini'
      },
      selectSong(item, index) {
        this.$emit('selectSong', item, index)
      }
    },
    components: {}
  }
</script>
<style scoped lang="sass" type="text/sass">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .list
    margin: 0 .1rem
    li
      display: flex
      border-bottom: 1px solid #323027
      align-items: center
      .name
        flex: 1
        display: flex
        align-items: center
        height: .5rem
        line-height: .5rem
        .songName
          flex: 0 0 80%
          @include no-warp
          font-size: $font-size-1_6
      i
        padding-right: .1rem
        @include extend-click
        font-size: $font-size-2_2
</style>
