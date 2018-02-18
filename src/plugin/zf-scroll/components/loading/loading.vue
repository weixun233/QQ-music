<template>
  <div class="mf-loading-container">
    <img src="./loading.gif">
  </div>
</template>
<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'loading'

  export default {
    name: COMPONENT_NAME
  }
</script>
<style lang="sass" type="text/sass">
  .mf-loading-container
    width: 100%
    text-align: center
    img
      display: inline-block
      width: 20px
      height: 20px
</style>
