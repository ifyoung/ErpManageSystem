<template>
  <div id="app">
    <el-row>
      <el-col   :style="{ height: app_height + 'px',width:'20%'}">
        <Aside></Aside>
      </el-col>
      <el-col style="width:80%">
        <Main></Main>
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
    _this.app_height = window.document.documentElement.offsetHeight * 0.92;
    window.onresize = function() {
      _this.app_height = window.document.documentElement.offsetHeight * 0.92;
    };
    

  },
};
</script>
<style scoped>
</style>
