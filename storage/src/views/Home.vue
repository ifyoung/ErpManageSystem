<template>
  <div id="app">
    <el-row>
      <el-col :style="{ height: app_height + 'px', width: '15%' }">
        <Aside class="aside-style"></Aside>
      </el-col>
      <el-col style="width:85%">
        <Main class="main-style"></Main>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Aside from "../components/aside.vue";

import Main from "../components/main.vue";
export default {
  name: "Home",
  components: {
    Aside,
    Main,
  },
  data() {
    return {
      app_height: "",
    };
  },
  mounted() {
    let _this = this;
    _this.app_height = window.document.documentElement.offsetHeight * 0.89;
    window.onresize = function() {
      _this.app_height = window.document.documentElement.offsetHeight * 0.89;
    };
  },
};
</script>
<style scoped>
.main-style {
  padding-left: 2%;
  padding-right: 1%;
}
.aside-style{
  box-shadow: 0px 0px 10px 2px rgb(162, 162, 162);
}
</style>
