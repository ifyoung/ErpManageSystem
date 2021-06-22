<template>
  <div class="header-container">
    <div class="module-title">
      <h1>出库记录</h1>
    </div>

    <div class="content-container">
      <el-row>
        <el-col :span="10">
          <el-form :model="formData" ref="formData" label-width="100px" label-position="left">
            <el-form-item label="客户信息:" prop="customer_info">
              <el-autocomplete
                style="width:100%"
                v-model="formData.customer_info"
                :fetch-suggestions="querySearch"
                clearable
                id="formSearch"
                placeholder="请输入客户编号或公司名称，为空时查询所有"
              ></el-autocomplete>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col style="margin-left:30px;" :span="2">
          <el-button type="primary" @click="formSearch">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="info" @click="resetForm('formData')">重置</el-button>
        </el-col>
      </el-row>
      <el-row style="padding-top:5px">
        <el-col class="customer-table" :span="24">
             <el-table  height="455"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-custom-class="loading_color"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
           @selection-change="handleSelectionChange" :row-style="showRow" border stripe :data="computedQueryResData" ref="multipleTable">
            <el-table-column align="center" type="selection" width="100px"></el-table-column>
            <el-table-column align="center" label="客户编号" prop="customer_id"></el-table-column>
            <el-table-column align="center" label="公司名称" prop="company_name"></el-table-column>
            <el-table-column align="center" label="名称" prop="product_name" width="270px"></el-table-column>
            <el-table-column align="center" label="货品SKU" prop="product_sku"></el-table-column>
            <el-table-column align="center" label="出库时间" prop="out_time"></el-table-column>
            <el-table-column align="center" label="出库数量" prop="out_count"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row type="flex" class="padding_tb">
        <el-col :span="24">
          <el-pagination
            class="page-pagination"
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
          <el-button type="danger" :disabled="isDel" @click="deleteSubmit">删除</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { utcToCst } from "../utils/utcToCst";
export default {
  data() {
    return {
      times: 0, // 监听计数
      timer: null,
        loading:false, // 加载标识，默认为false,当调用接口时赋值为true
      isDel: true, // 删除是否禁用
      multipleSelection: [], // 勾选列表
      solidSelection: [], // 防渲染后勾选消失的列表
      outRecordReqUrl: "", // 货品信息请求地址
      outRecordReqData: {}, // 货品信息提交数据
      locateReqUrl: "/api/query/getLocateCustomerId", // 模糊查询地址
      locateReqData: {}, // 模糊查询客户信息
      nameTipsArray: [], // 提醒下拉框
      formData: {
        // 查询列表
        customer_info: "", // 客户信息,
      },
      queryResData: [], // 查询结果列表
      customer_info_list: [], // 模糊查询列表
      queryPage: {
        // 分页器
        pageSize: 10,
        currentPage: 1,
      },
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
    // 监听勾选
    handleSelectionChange(val) {
      if (val.length == 0) {
        this.isDel = true;
      } else {
        this.isDel = false;
      }
      this.multipleSelection = val;
    },
    // 重置
    resetForm(formName) {
      let form = this.$refs[formName];
      form.resetFields();
    },
    // 查询
    formSearch() {
      if (/^\d+$/.test(this.formData.customer_info)) {
        this.outRecordReqUrl = "/api/query/getOutRecordByCustomerId";
        this.outRecordReqData = { customer_id: this.formData.customer_info };
        this.getOutRecord();
      } else if (this.formData.customer_info == "") {
        this.getAllOutRecord();
      } else {
        this.outRecordReqUrl = "/api/query/getOutRecordByCompanyName";
        this.outRecordReqData = { company_name: this.formData.customer_info };
        this.getOutRecord();
      }
    },
    // 搜索框模糊查询
    querySearch(queruString, cb) {
      if (this.formData.customer_info != "") {
        var nameTipsArray = this.nameTipsArray;
        cb(nameTipsArray);
      } else {
        cb([{ value: "" }]);
      }
    },
    // 获取指定查询的货品信息
    getOutRecord() {
      this.loading = true
      this.$http({
        method: "post",
        url: this.outRecordReqUrl,
        data: this.outRecordReqData,
      })
        .then((res) => {
          this.loading = false
          if (res.data.length != 0) {
            this.$message.success("查询成功");
            for (let item of res.data) {
              item.out_time = utcToCst(item.out_time)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "");
            }
            this.queryResData = res.data;
          } else {
            this.$message.warning("未查询到相关数据");
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    // 获取所有的货品信息
    getAllOutRecord() {
      this.loading = true
      this.$http({
        method: "post",
        url: "/api/query/getAllOutRecord",
      })
        .then((res) => {
          this.loading = false
          if (res.data.length != 0) {
            this.$message.success("查询成功");
            for (let item of res.data) {
              item.out_time = utcToCst(item.out_time)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "");
            }
            this.queryResData = res.data;
          } else {
            this.$message.warning("未查询到相关数据");
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 获取所有的 出品信息 信息,不提示查询成功
    refreshGetAllOutRecord() {
      this.$http({
        method: "post",
        url: "/api/query/getAllOutRecord",
      })
        .then((res) => {
          for (let item of res.data) {
            item.out_time = utcToCst(item.out_time)
              .slice(0, 10)
              .replace(/上|下|中|午|晚|早|凌|晨/g, "");
          }
          this.queryResData = res.data;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    // 删除提交
    deleteSubmit() {
      this.$confirm("确定删除出库记录信息?")
        .then(() => {
          this.solidSelection = this.multipleSelection;
          while (this.solidSelection.length != 0) {
            this.deleteOutRecord();
            this.solidSelection.shift();
          }
          this.$message.success("删除出库记录信息成功!");
        })
        .catch((err) => {
          this.$message.warning("取消删除");
        });
    },
    // 删除 出库记录 信息
    deleteOutRecord() {
      this.$http({
        method: "post",
        url: "api/delete/deleteOutRecord",
        data: {
          customer_id: this.solidSelection[0].customer_id,
          product_name: this.solidSelection[0].product_name,
          product_sku: this.solidSelection[0].product_sku,
          out_time: this.solidSelection[0].out_time,
          out_count: this.solidSelection[0].out_count,
        },
      })
        .then((res) => {
          this.refreshGetAllOutRecord();
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    // 查询
    refreshFormSearch() {
      if (/^\d+$/.test(this.formData.customer_info)) {
        this.boxReqUrl = "/api/query/getBoxByCustomerId";
        this.boxReqData = { customer_id: this.formData.customer_info };
      } else if ((this.formData.customer_info = "")) {
        this.boxReqUrl = "/api/query/getAllBox";
        this.boxReqData = {};
      } else {
        this.boxReqUrl = "/api/query/getBoxByCompanyName";
        this.boxReqData = { company_name: this.formData.customer_info };
      }
      this.refreshGetOutRecord();
    },

    // 监听输入框，有变动就触发防抖函数
    getData() {
      this.$http({
        method: "post",
        url: this.locateReqUrl,
        data: this.locateReqData,
      })
        .then((res) => {
          this.customer_info_list = res.data;
          if (this.formData.customer_info != "") {
            this.nameTipsArray = [];
            for (let item of this.customer_info_list) {
              let obj = { value: "" };
              obj.value = String(Object.values(item)[0]);
              this.nameTipsArray.push(obj);
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
  watch: {
    formData: {
      handler: function(nV, oV) {
        // 对输入框的值做判断，为数字则请求id，为汉字则请求公司名称
        if (/^\d+$/.test(this.formData.customer_info)) {
          this.locateReqUrl = "/api/query/getLocateCustomerId";
          this.locateReqData = { customer_id: nV.customer_info };
        } else {
          this.locateReqUrl = "api/query/getLocateCompanyName";
          this.locateReqData = { company_name: nV.customer_info };
        }
        this.debounce(this.getData, 1000);
      },
      deep: true,
    },
  },
  computed: {
    computedQueryResData() {
      let size = this.queryPage.pageSize;
      let current = this.queryPage.currentPage;
      return this.queryResData.slice(size * (current - 1), size * current);
    },
  },
  mounted() {
    this.refreshGetAllOutRecord();
    var today = new Date();
    today.setTime(today.getTime());
    var today_date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    this.today_date = today_date;
  },
};
</script>

<style lang="less" scoped>
.productPage-addForm {
  margin-top: -80px;
  /deep/ .el-form-item__error {
    padding-left: 20px;
  }
}
.sa-container {
  display: inline-block;
  margin-left: -15px;
  min-width: 90px;
}
</style>
