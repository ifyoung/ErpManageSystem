<template>
  <div>
    <router-view />
  </div>
</template>

<script>

export default ({
  methods: {
    test() {
      this.$message.success("test")
    }
  }
})
</script>

<style lang="less">
@import "./assets/less/main.less";
@import "./assets/less/queryPage.less";
@import "./assets/less/elementUi.less";

</style>
