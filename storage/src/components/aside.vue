<template>
  <div class="aside">
    <el-row class="height_percent_100">
      <el-col :span="24" class="height_percent_100">
        <div class="aside-title">ERP系统</div>
        <div style="border:1px solid black;display:inline-block;min-width:100%;background-color:#66798C;color:white">
          <div style="display:inline-block">用户:{{ this.userName }}</div>
          <span style="margin-left:20px"> 身份:{{ this.userLevel }}</span>
          <div style="display:inline-block;margin-left:10%;transform:translateY(-2.5px)">
            <el-link type="success" class="el-icon-s-custom" @click="exit">登出</el-link>
          </div>
        </div>

        <el-menu
          :default-active="this.$router.path"
          router
          :default-openeds="openeds"
          class="aside-menu"
          @open="handleOpen"
          @close="handleClose"
          text-color="#fff"
          background-color="#3c3f42"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/noticeCenter">
            <i class="el-icon-message-solid"></i>
            <span class="menu-title">通知中心</span>
          </el-menu-item>
          <el-menu-item index="/payCenter">
            <i class="el-icon-bank-card"></i>
            <span class="menu-title">费用中心</span>
          </el-menu-item>
          <el-menu-item index="/customerManage">
            <i class="el-icon-user"></i>
            <span class="menu-title">客户管理</span>
          </el-menu-item>
          <el-menu-item index="/possessSystem">
            <i style="padding-left:4px;padding-right:13px;font-size:19px;">$</i>
            <span class="menu-title">财务系统</span>
          </el-menu-item>
          <el-menu-item index="/outRecord">
            <i class="el-icon-s-order"></i>
            <span class="menu-title">出库记录</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-goods"></i>
              <span class="menu-title">货品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/productCome">货品入库</el-menu-item>
              <el-menu-item index="/productList">货品清单</el-menu-item>
              <el-menu-item index="/productOut">货品出库</el-menu-item>
              <el-menu-item index="/productOutList">出库清单</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-box"></i>
              <span class="menu-title">箱子管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/boxCome">箱子入库</el-menu-item>
              <el-menu-item index="/boxList">箱子清单</el-menu-item>
              <el-menu-item index="/boxOut">箱子出库</el-menu-item>
              <el-menu-item index="/boxOutList">出库清单</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: "",
      userLevel: "",
      openeds: [],
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      this.openeds = [String(key)];
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    exit() {
      this.$confirm("确定退出当前账号吗？")
        .then(() => {
          sessionStorage.clear();
          this.$router.push("/");
        })
        .catch(() => {
          // this.$message.info("取消退出");
        });
    },
  },
  mounted() {
    console.log(sessionStorage.getItem("userName"));
    if (sessionStorage.getItem("userName") == null && sessionStorage.getItem("userLevel") == null) {
      this.$message.warning("请先登录用户");
      this.$router.push("/");
    } else {
      this.userName = sessionStorage.getItem("userName");
      this.userLevel = sessionStorage.getItem("userLevel");
    }
  },
};
</script>
<style lang="less" scoped>
.aside {
  height: 100%;
  .height_percent_100 {
    height: 100%;
  }
  .aside-title {
    padding: 5px 0px;
    font-size: 30px;
    text-align: center;
    background-color: rgba(226, 148, 3, 0.993);
    color: rgb(255, 254, 254);
  }
  .aside-menu {
    font-size: 20px;
    height: 96.4%;
    .menu-title {
      font-size: 20px;
    }

    /deep/ .el-menu-item-group__title {
      padding: 0px;
    }
    /deep/ .el-submenu .el-menu-item {
      min-width: 0px;
      font-size: 16px;
      background-color: rgb(87, 85, 83) !important;
    }
    /deep/ .el-submenu .el-menu-item:hover {
      min-width: 0px;
      background-color: rgb(48, 47, 47) !important;
    }
  }
}
</style>
