<template>
  <div class="header-container">
    <div class="module-title">
      <h1>客户信息表</h1>
    </div>
    <div class="content-container">
      <el-row>
        <el-col class="customer-table" :span="14">
          <el-table
           height="435"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-custom-class="loading_color"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
           @selection-change="handleSelectionChange" :row-style="showRow" border stripe :data="computedqueryResData" ref="multipleTable">
            <el-table-column align="center" type="selection" width="100px"></el-table-column>
            <el-table-column align="center" label="客户编号" prop="customer_id"></el-table-column>
            <el-table-column align="center" label="公司名称" prop="company_name"></el-table-column>
            <el-table-column align="center" label="首次入库时间" prop="first_come_time"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row type="flex" class="padding_tb">
        <el-col :span="14">
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
        <el-col :span="10">
          <el-button class="add-btn" @click="addCustomer">添加</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" :disabled="isDel" @click="deleteSubmit">删除</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="info" plain @click="toggleSelection()">取消选择</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="-添加客户信息-" class="page-dialog" :visible.sync="addDV" width="35%" :before-close="handleClose">
      <el-form v-model="addForm" ref="addForm" :rules="addRules" label-width="120px">
        <el-row type="flex" justify="center" style="margin-bottom:10px;margin-top:25px">
          <el-form-item label="客户编号:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.customer_id"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="center" style="margin-bottom:25px;margin-top:25px">
          <el-form-item label="公司名称:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.company_name"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="center" style="margin-bottom:10px;margin-top:15px">
          <el-form-item label="首次入库时间:">
            <el-col :span="24" style="padding-left:20px">
              <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="addForm.first_come_time"></el-date-picker>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmit">提 交</el-button>
        <el-button type="primary" plain @click="addDV = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { utcToCst } from "../../utils/utcToCst";
export default {
  data() {
    return {
      addDV: false, // 是否开启添加的会话框
      isDel: true, // 是否禁用删除按键
      loading:false, // 是否加载
      queryPage: {
        pageSize: 10,
        currentPage: 1,
      },
      queryResData: [], // 查询结果列表
      addForm: {
        customer_id: "", // 客户编号
        company_name: "", // 公司名称
        first_come_time: "", // 首次入库日期
      }, // 添加列表
      multipleSelection: [], // 勾选列表
      solidSelection: [], // 防渲染后勾选消失的列表
      addRules: {},
    };
  },
  methods: {
    handleClose() {
      this.addDV = false;
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
        this.isDel = true;
      } else {
        this.isDel = false;
      }
      this.multipleSelection = val;
    },
    // 刷新客户信息表但不提示
    refreshGetCustomer() {
      this.loading = true
      this.$http({
        method: "get",
        url: "api/query/getCustomer",
      }).then((res) => {
        this.loading=false;
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

    // 添加客户信息窗口显示
    addCustomer() {
      this.addDV = true;
    },
    // 添加提交
    addSubmit() {
      this.checkCustomerId();
    },

    // 检查客户表id是否已存在的接口方法
    checkCustomerId() {
      this.$http({
        method: "post",
        url: "api/query/getCustomerId",
        data: {
          customer_id: this.addForm.customer_id,
        },
      })
        .then((res) => {
          if (res.data.length == 0) {
            this.insertCustomer();
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
    //
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
  },
  mounted() {
    var today = new Date();
    today.setTime(today.getTime());
    var today_date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    this.today_date = today_date;
    this.refreshGetCustomer();
  },
  computed: {
    computedqueryResData() {
      return this.queryResData.slice((this.queryPage.currentPage - 1) * this.queryPage.pageSize, this.queryPage.currentPage * this.queryPage.pageSize);
    },
  },
};
</script>

<style lang="less"></style>
