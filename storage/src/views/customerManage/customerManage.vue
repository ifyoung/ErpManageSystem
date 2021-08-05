<template>
  <div class="header-container">
    <div class="module-title">
      <h1>客户信息表</h1>
    </div>
    <div class="content-container">
      <el-row>
        <el-col class="customer-table" :span="20">
          <el-table
            :height="tableHeight"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-custom-class="loading_color"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
            @selection-change="handleSelectionChange"
            :row-style="showRow"
            border
            stripe
            :data="computedqueryResData"
            ref="multipleTable"
          >
            <el-table-column
              align="center"
              type="selection"
              width="100px"
            ></el-table-column>
            <el-table-column
              align="center"
              label="客户编号"
              prop="customer_id"
            ></el-table-column>
            <el-table-column
              align="center"
              label="公司名称"
              prop="company_name"
            ></el-table-column>
            <el-table-column
              align="center"
              label="首次入库时间"
              prop="first_come_time"
            ></el-table-column>
            <el-table-column
              align="center"
              label="自生成密码"
              prop="auto_pwd"
            ></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row type="flex" class="padding_tb">
        <el-col :span="20">
          <el-pagination
            class="customer-pagination"
            :background="true"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryPage.currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="queryPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryResData.length"
          >
          </el-pagination>
        </el-col>
      </el-row>
      <el-row type="flex" class="padding_tb padding_lr">
        <el-col :span="2">
          <el-button class="add-btn" @click="addDialogOpen">添加</el-button>
        </el-col>
        <el-col :span="14">
          <el-button
            type="warning"
            :disabled="isForbiddenMod"
            @click="modifyDialogOpen"
            >修改</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button
            type="danger"
            :disabled="isForbiddenDel"
            @click="deleteSubmit"
            >删除</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button type="info" plain @click="toggleSelection()"
            >取消选择</el-button
          >
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="-添加客户信息-"
      class="page-dialog"
      :visible.sync="addDV"
      width="35%"
      :before-close="handleCloseAdd"
    >
      <el-form
        v-model="addForm"
        ref="addForm"
        :rules="addRules"
        label-width="120px"
      >
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:25px"
        >
          <el-form-item label="客户编号:">
            <el-col :span="24" style="padding-left:20px">
              <el-autocomplete
                style="width:100%"
                v-model="addForm.customer_id"
                :fetch-suggestions="querySearch"
                clearable
                id="formSearch"
              ></el-autocomplete>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item label="公司名称:">
            <el-col :span="24" style="padding-left:20px">
              <el-autocomplete
                style="width:100%"
                v-model="addForm.company_name"
                :fetch-suggestions="querySearch"
                clearable
                id="formSearch"
              ></el-autocomplete>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:15px"
        >
          <el-form-item label="首次入库时间:" labelWidth="150px">
            <el-col :span="24" style="padding-left:20px">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                v-model="addForm.first_come_time"
              ></el-date-picker>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit">提 交</el-button>
        <el-button type="primary" plain @click="addDV = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="-修改客户信息-"
      class="page-dialog"
      :visible.sync="modifyDV"
      width="35%"
      :before-close="handleCloseModify"
    >
      <el-form v-model="modifyForm" ref="modifyForm" label-width="120px">
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:25px"
        >
          <el-form-item label="客户编号:">
            <el-col :span="24" style="padding-left:20px">
              <el-autocomplete
                style="width:100%"
                v-model="modifyForm.customer_id"
                :fetch-suggestions="querySearch"
                clearable
                id="formSearch"
              ></el-autocomplete>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item label="公司名称:">
            <el-col :span="24" style="padding-left:20px">
              <el-autocomplete
                style="width:100%"
                v-model="modifyForm.customer_id"
                :fetch-suggestions="querySearch"
                clearable
                id="formSearch"
              ></el-autocomplete>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:15px"
        >
          <el-form-item label="首次入库时间:" labelWidth="150px">
            <el-col :span="24" style="padding-left:20px">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                v-model="modifyForm.first_come_time"
              ></el-date-picker>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item label="剩余金额:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="modifyForm.leave_amount"></el-input>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item label="密码:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="modifyForm.auto_pwd"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifySubmit">提 交</el-button>
        <el-button type="primary" plain @click="modifyDV = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { utcToCst } from "@/utils/utcToCst";
import { getNowFormatDate } from "@/utils/getCurrentTime";
export default {
  data() {
    return {
      tableHeight: window.innerHeight * 0.65,
      addDV: false, // 是否开启添加的会话框
      modifyDV: false, // 是否开启修改的会话框
      isForbiddenDel: true, // 是否禁用删除按键
      isForbiddenMod: true, // 是否禁用修改按键
      loading: false, // 是否加载
      customer_id_list: [], // 添加 模糊查询列表
      addNameTipsArray: [], // 添加 提醒下拉框
      queryPage: {
        pageSize: 10,
        currentPage: 1,
      },
      queryResData: [], // 查询结果列表
      addForm: {
        // 添加列表
        customer_id: "", // 客户编号
        company_name: "", // 公司名称
        first_come_time: "", // 首次入库日期
      },
      modifyForm: {
        // 修改列表
        customer_id: "", // 客户编号
        company_name: "", // 公司名称
        first_come_time: "", // 首次入库日期是
        leave_amount: "", // 账户余额
        auto_pwd: "", // 密码
      },
      multipleSelection: [], // 勾选列表
      solidSelection: [], // 防渲染后勾选消失的列表
      addRules: {},
    };
  },
  methods: {
    handleCloseAdd() {
      this.addDV = false;
    },
    handleCloseModify() {
      this.modifyDV = false;
    },
    handleSizeChange(val) {
      this.queryPage.pageSize = val;
    },
    handleCurrentChange(val) {
      this.queryPage.currentPage = val;
    },
    // 设置表格行样式
    showRow({ row, rowIndwx }) {
      let styleJson = {
        "background-color": "#E4F9E5",
        "font-weight": "400",
        "font-size": "15px",
        color: "#000000",
      };

      return styleJson; // 返回对象
    },
    // 全选与反选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      if (val.length == 0) {
        this.isForbiddenDel = true;
        this.isForbiddenMod = true;
      } else if (val.length == 1) {
        this.isForbiddenMod = false;
        this.isForbiddenDel = false;
      } else {
        this.isForbiddenDel = false;
        this.isForbiddenMod = true;
      }
      this.multipleSelection = val;
    },
    // 刷新客户信息表但不提示
    refreshGetCustomer() {
      this.loading = true;
      this.$http({
        method: "get",
        url: "api/query/getCustomer",
      }).then((res) => {
        this.loading = false;
        this.queryResData = [];
        if (res.data.length != 0) {
          for (let item of res.data) {
            item.first_come_time = utcToCst(item.first_come_time)
              .slice(0, 10)
              .replace(/上|下|中|午|晚|早|凌|晨/g, "");
          }
          this.queryResData = res.data;
        } else {
          this.$message.warning("未查询到相关数据");
        }
      });
    },

    // 修改客户信息窗口显示
    modifyDialogOpen() {
      this.$http({
        method: "post",
        url: "api/query/getSpecificCustomer",
        data: {
          customer_id: this.multipleSelection[0].customer_id, // 客户编号
        },
      })
        .then((res) => {
          if (res.data.length == 0) {
            this.$message.error("服务器出错");
            return;
          } else {
            for (let item of res.data) {
              item.first_come_time = utcToCst(item.first_come_time)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "");
            }

            console.log(res.data[0]);
            this.modifyForm = res.data[0];
            this.modifyDV = true;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    // 搜索框模糊查询
    querySearch(queruString, cb) {
      if (this.addForm.customer_id != "" || this.addForm.company_name != "") {
        var addNameTipsArray = this.addNameTipsArray;

        cb(addNameTipsArray);
      } else {
        cb([{ value: "" }]);
      }
    },

    // 修改提交
    modifySubmit() {
      this.checkCustomerId("modify");
    },

    // 添加客户信息窗口显示
    addDialogOpen() {
      this.addDV = true;
    },
    // 添加提交
    addSubmit() {
      this.checkCustomerId("add");
    },

    // 检查客户表id是否已存在的接口方法
    checkCustomerId(exc) {
      this.$http({
        method: "post",
        url: "api/query/getCustomerId",
        data: {
          customer_id: this.addForm.customer_id,
        },
      })
        .then((res) => {
          if (res.data.length == 0) {
            if (exc == "add") {
              this.insertCustomer();
            } else if (exc == "modify") {
              this.modifyCustomer();
            }
          } else {
            this.$message.warning("客户编号已存在，请重新输入！");
            return;
          }
        })
        .catch((err) => {});
    },

    // 插入客户表信息的接口方法
    insertCustomer() {
      this.$http({
        method: "post",
        url: "api/insert/insertCustomer",
        data: {
          customer_id: this.addForm.customer_id, // 客户编号
          company_name: this.addForm.company_name, // 公司名称
          first_come_time: this.addForm.first_come_time, // 首次入库日期
          leave_amount: "0", // 剩余金额
          auto_pwd: String(Math.floor(Math.random() * 1000 + 8999)), // 随机生产的客户密码
        },
      })
        .then((res) => {
          this.$message.success("添加客户信息成功!");
          this.addDV = false;
          this.refreshGetCustomer();
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    // 修改客户表信息的接口方法
    modifyCustomer() {
      this.$http({
        method: "post",
        url: "api/update/updateSpecificCustomer",
        data: {
          customer_id: this.modifyForm.customer_id, // 客户编号
          company_name: this.modifyForm.company_name, // 公司名称
          first_come_time: this.modifyForm.first_come_time, // 首次入库日期
          leave_amount: this.modifyForm.leave_amount, // 剩余金额
          auto_pwd: this.modifyForm.auto_pwd, // 客户密码
        },
      })
        .then((res) => {
          this.$message.success("修改客户信息成功!");
          this.modifyDV = false;
          this.refreshGetCustomer();
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    // 删除客户信息
    deleteCustomer() {
      this.$http({
        method: "post",
        url: "api/delete/deleteCustomer",
        data: {
          customer_id: this.solidSelection[0].customer_id,
        },
      })
        .then((res) => {
          this.refreshGetCustomer();
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 删除客户信息
    deleteSubmit() {
      this.$confirm("确定删除客户信息?")
        .then(() => {
          this.solidSelection = this.multipleSelection;
          while (this.solidSelection.length != 0) {
            this.deleteCustomer();
            this.solidSelection.shift();
          }
          this.$message.success("删除客户信息成功!");
        })
        .catch((err) => {
          this.$message.warning("取消删除");
        });
    },

    // 监听添加输入框，有变动就触发防抖函数
    getDialogData() {
      let prop;
      if (this.modifyDV == true) {
        prop = this.modifyForm.customer_id;
      } else if (this.addDV == true) {
        prop = this.addForm.customer_id;
      }
      this.$http({
        method: "post",
        url: "api/query/getCustomerDialogLocate",
        data: {
          customer_info: prop,
        },
      })
        .then((res) => {
          this.customer_info_list = [];
          this.customer_id_list = res.data;
          if (this.addForm.customer_id != "") {
            this.addNameTipsArray = [];
            let avoidSameArr = [];
            // 遍历模糊查询返回的列表,获取包含输入框关键字的字段,添加到历史列表中
            // 并且,当历史列表已存在相同字段,则跳过此遍历阶段
            for (let item of this.customer_id_list) {
              let flag = 0; // 用于标记是否需要跳过
              // 遍历每个item对象
              for (let prop in item) {
                if (
                  String(item[prop]).indexOf(this.addForm.customer_id) != -1
                ) {
                  // 对防重数组遍历,若存在与历史列表对象中完全匹配的属性,则跳过此遍历
                  for (let val of avoidSameArr) {
                    if (val == item[prop]) {
                      flag = 1;
                      break;
                    }
                  }
                  if (flag == 0) {
                    this.addNameTipsArray.push({
                      value: String(item[prop]),
                    });
                    avoidSameArr.push(String(item[prop]));
                  } else {
                    continue;
                  }
                }
              }
            }
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    // 防抖函数
    debounce(fn, wait) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        fn();
      }, wait);
    },
  },
  mounted() {
    var today = new Date();
    today.setTime(today.getTime());
    var today_date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    this.today_date = today_date;
    this.refreshGetCustomer();
  },
  computed: {
    computedqueryResData() {
      return this.queryResData.slice(
        (this.queryPage.currentPage - 1) * this.queryPage.pageSize,
        this.queryPage.currentPage * this.queryPage.pageSize
      );
    },
  },
  created() {
    if (sessionStorage.getItem("userLevel") == "管理员") {
    } else {
      this.$message.warning("你没有权限使用此功能!");
      this.$router.push("/home");
    }
  },

  watch: {
    addForm: {
      handler: function(nV, oV) {
        this.debounce(this.getDialogData, 1000);
      },
      deep: true,
    },
    modifyForm: {
      handler: function(nV, oV) {
        this.debounce(this.getDialogData, 1000);
      },
      deep: true,
    },
  },
};
</script>

<style lang="less"></style>
