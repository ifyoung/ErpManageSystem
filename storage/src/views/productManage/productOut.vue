<template>
  <div class="header-container">
    <div class="module-title">
      <h1>货品出库</h1>
    </div>
    <div class="content-container">
      <el-row>
        <el-col :span="10">
          <el-form :model="formData" ref="formData" label-width="100px" label-position="left">
            <el-form-item label="客户信息:" prop="customer_info">
              <el-autocomplete
                style="width:380px"
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
      <el-row style="padding-top:20px">
        <el-col class="customer-table" :span="24">
          <el-table @selection-change="handleSelectionChange" :row-style="showRow" border stripe :data="computedQueryResData" ref="multipleTable">
            <el-table-column align="center" type="selection" width="100px"></el-table-column>
            <el-table-column align="center" label="客户编号" prop="customer_id"></el-table-column>
            <el-table-column align="center" label="货品名称" prop="product_name"></el-table-column>
            <el-table-column align="center" label="货品SKU" prop="product_sku"></el-table-column>
            <el-table-column align="center" label="入库时间" prop="come_time"></el-table-column>
            <el-table-column align="center" label="初始数量" prop="storage_count"></el-table-column>
            <el-table-column align="center" label="仓储天数" prop="save_days"></el-table-column>
            <el-table-column align="center" label="出库数量" prop="out_count"></el-table-column>
            <el-table-column align="center" label="出库操作" width="220px">
              <template slot-scope="scope">
                <div class="sa-container">
                  <el-input placeholder="请输入" v-model="scope.row.count"></el-input>
                </div>
                <el-button style="margin-left:5px" class="modify-btn small-btn" @click="outSubmit(scope.row)">数据提交</el-button>
              </template>
            </el-table-column>
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
    </div>
  </div>
</template>

<script>
import { utcToCst } from "../../utils/utcToCst";
import { getNowFormatDate } from "../../utils/getCurrentTime";
export default {
  data() {
    return {
      times: 0, // 监听计数
      timer: null,
      productReqUrl: "", // 货品信息请求地址
      productReqData: {}, // 货品信息提交数据
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
    handleSelectionChange(val) {},
    // 重置
    resetForm(formName) {
      let form = this.$refs[formName];
      form.resetFields();
    },
    // 查询
    formSearch() {
      if (/^\d+$/.test(this.formData.customer_info)) {
        this.productReqUrl = "/api/query/getProductByCustomerId";
        this.productReqData = { customer_id: this.formData.customer_info };
        this.getProduct();
      } else if (this.formData.customer_info == "") {
        this.getAllProduct();
      } else {
        this.productReqUrl = "/api/query/getProductByCompanyName";
        this.productReqData = { company_name: this.formData.customer_info };
        this.getProduct();
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
    getProduct() {
      this.$http({
        method: "post",
        url: this.productReqUrl,
        data: this.productReqData,
      })
        .then((res) => {
          if (res.data.length != 0) {
            this.$message.success("查询成功");
            for (let item of res.data) {
              let come = Date.parse(new Date(item.come_time));
              let today = Date.parse(new Date(this.today_date));
              var day = parseInt((today - come) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
              item.save_days = day;
              item.come_time = utcToCst(item.come_time)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "");
              item.count = "";
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
    getAllProduct() {
      this.$http({
        method: "post",
        url: "/api/query/getAllProduct",
      })
        .then((res) => {
          if (res.data.length != 0) {
            this.$message.success("查询成功");
            for (let item of res.data) {
              let come = Date.parse(new Date(item.come_time));
              let today = Date.parse(new Date(this.today_date));
              var day = parseInt((today - come) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
              item.save_days = day;
              item.come_time = utcToCst(item.come_time)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "");
              item.count = "";
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
    // 获取所有的货品信息,不提示查询成功
    refreshGetAllProduct() {
      this.$http({
        method: "post",
        url: "/api/query/getAllProduct",
      })
        .then((res) => {
          for (let item of res.data) {
            let come = Date.parse(new Date(item.come_time));
            let today = Date.parse(new Date(this.today_date));
            var day = parseInt((today - come) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
            item.save_days = day;
            item.come_time = utcToCst(item.come_time)
              .slice(0, 10)
              .replace(/上|下|中|午|晚|早|凌|晨/g, "");
            item.count = "";
          }
          this.queryResData = res.data;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    // 出库提交修改
    outSubmit(row) {
      if (row.count == "") {
        this.$message.warning("输入不能为空!");
        return;
      }

      if (Number(row.out_count) + Number(row.count) > Number(row.storage_count)) {
        this.$message.warning("出货的数量已超过初始仓储数量");
        return;
      } else if (Number(row.storage_count) < 0) {
        this.$message.warning("出货的数量不能为负数");
        return;
      }

      this.$confirm("确认提交吗?")
        .then(() => {
          row.out_count = String(Number(row.out_count) + Number(row.count));
          let data = {};
          for (let name in row) {
            if (name == "count") {
              continue;
            }
            data[name] = row[name];
          }
          data.out_time = getNowFormatDate();

          this.updateProduct(data);
          this.insertOutRecord(data,row);
        })
        .catch((err) => {
          console.log(err);
          this.$message.info("取消提交");
        });
    },

    // 更新货品信息
    updateProduct(data) {
      this.$http({
        method: "post",
        url: "api/update/updateProduct",
        data: data,
      })
        .then((res) => {
          this.refreshGetAllProduct();
          this.$message.success("提交成功");
        })
        .catch((err) => {});
    },

    // 添加 出库记录 信息
    insertOutRecord(data,row) {
      this.$http({
        method: "post",
        url: "api/insert/insertOutRecord",
        data: {
          customer_id: data.customer_id,
          product_name: data.product_name,
          product_sku: data.product_sku,
          out_time: data.out_time,
          out_count: row.count,
        },
      })
        .then((res) => {
          console.log("添加出库记录信息成功");
        })
        .catch((err) => {});
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
    var today = new Date();
    today.setTime(today.getTime());
    var today_date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    this.today_date = today_date;

    this.refreshGetAllProduct();
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
  max-width: 80px;
}
</style>
