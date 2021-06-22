<template>
  <div class="header-container">
    <div class="module-title">
      <h1>箱子清单</h1>
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
             <el-table height="455"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-custom-class="loading_color"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
           @selection-change="handleSelectionChange" :row-style="showRow" border stripe :data="computedQueryResData" ref="multipleTable">
            <el-table-column align="center" type="selection" width="100px"></el-table-column>
            <el-table-column align="center" label="客户编号" prop="customer_id" width="150px"></el-table-column>
   <el-table-column align="center" label="公司名称" prop="company_name" width="150px"></el-table-column>
            <el-table-column align="center" label="名称" prop="product_name" width="200px"></el-table-column>
            <el-table-column align="center" label="规格(cm)" prop="length_width_height" width="150px"></el-table-column>
            <el-table-column align="center" label="抛重重量(lb)" prop="weight" width="150px"></el-table-column>
            <el-table-column align="center" label="实际重量(lb)" prop="real_weight" width="150px"></el-table-column>
            <el-table-column align="center" label="仓储数量" prop="count"></el-table-column>
            <el-table-column align="center" label="入库时间" prop="come_time" width="100px"></el-table-column>
            <el-table-column align="center" label="仓储天数" prop="save_days"></el-table-column>
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
import { utcToCst } from "../../utils/utcToCst";
export default {
  data() {
    return {
      times: 0, // 监听计数
      timer: null,
        loading:false, // 加载标识，默认为false,当调用接口时赋值为true
      today_date: "", // 今天的日期
      isDel: true, // 删除禁用
      multipleSelection: [], // 勾选列表
      solidSelection: [], // 防渲染后勾选消失的列表
      pickerOption: {
        disabledDate: (time) => {
          return time.getTime() > Date.now(); /*今天及之前，注意数字不一样*/
        },
      },
      addDV: false, // 对话框默认不显示
      boxReqUrl: "", // 货品信息请求地址
      boxReqData: {}, // 货品信息提交数据
      locateReqUrl: "/api/query/getLocateCustomerId", // 模糊查询地址
      locateReqData: {}, // 模糊查询客户信息
      nameTipsArray: [], // 提醒下拉框
      formData: {
        // 查询列表
        customer_info: "", // 客户信息,
      },
      queryResData: [], // 查询结果列表
      customer_info_list: [], // 模糊查询列表
      louqueForm: {
        customer_id: "客户编号",
        come_time: "入库时间",
        product_name: "箱子名称",
        length_width_height: "规格(cm)",
        weight: "重量(lb)",
        count: "初始数量",
        save_days: "仓储天数",
        out_count: "出库数量",
        box_code: "箱子码",
        status: "状态",
      },
      addForm: {
        customer_id: "",
        come_time: "",
        product_name: "",
        length_width_height: "",
        weight: "",
        count: "",
        save_days: "",
        out_count: "",
        box_code: "",
        status: "",
      },
      rules: {
        customer_info: [{ message: "请输入客户信息", required: true, trigger: ["blur", "change"] }],
      },
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
        this.boxReqUrl = "/api/query/getBoxByCustomerId";
        this.boxReqData = { customer_id: this.formData.customer_info };
      } else if (this.formData.customer_info == "") {
        this.boxReqUrl = "/api/query/getAllBox";
        this.boxReqData = {};
      } else {
        this.boxReqUrl = "/api/query/getBoxByCompanyName";
        this.boxReqData = { company_name: this.formData.customer_info };
      }
      this.getBox();
    },

    // 刷新查询
    refreshFormSearch() {
      if (/^\d+$/.test(this.formData.customer_info)) {
        this.boxReqUrl = "/api/query/getBoxByCustomerId";
        this.boxReqData = { customer_id: this.formData.customer_info };
      } else if (this.formData.customer_info == "") {
        this.boxReqUrl = "/api/query/getAllBox";
        this.boxReqData = {};
      } else {
        this.boxReqUrl = "/api/query/getBoxByCompanyName";
        this.boxReqData = { company_name: this.formData.customer_info };
      }
      this.refreshGetBox();
    },
    // 获取箱子信息
    getBox() {
      this.loading = true
      this.$http({
        method: "post",
        url: this.boxReqUrl,
        data: this.boxReqData,
      })
        .then((res) => {
          this.loading = false
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
    // 刷新箱子信息列表
    refreshGetBox() {
      this.loading = true
      this.$http({
        method: "post",
        url: this.boxReqUrl,
        data: this.boxReqData,
      })
        .then((res) => {
          this.loading = false
          if (res.data.length != 0) {
            for (let item of res.data) {
              let come = Date.parse(new Date(item.come_time));
              let today = Date.parse(new Date(this.today_date));
              var day = parseInt((today - come) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
              item.save_days = day;

              item.come_time = utcToCst(item.come_time)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "");
            }
            this.queryResData = res.data;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    // 删除提交
    deleteSubmit() {
      this.$confirm("确定删除客户信息?")
        .then(() => {
          this.solidSelection = this.multipleSelection;
          while (this.solidSelection.length != 0) {
            this.deleteBox();
            this.solidSelection.shift();
          }
          this.$message.success("删除客户信息成功!");
        })
        .catch((err) => {
          this.$message.warning("取消删除");
        });
    },
    // 删除箱子信息
    deleteBox() {
      this.$http({
        method: "post",
        url: "api/delete/deleteBox",
        data: {
          customer_id: this.solidSelection[0].customer_id,
          box_code: this.solidSelection[0].box_code,
        },
      })
        .then((res) => {
          this.refreshFormSearch();
        })
        .catch((err) => {
          this.$message.error(err);
        });
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
    // 添加货物信息(打开添加框)
    addOpen() {
      if (this.formData.customer_info != "") {
        this.addForm.customer_id = this.formData.customer_info;
      }
      this.addDV = true;
    },
    // 提交货品信息
    addSubmit() {
      // 对货品添加列表进行校验，如果有漏填项则提示
      for (let key in this.addForm) {
        if (key == "box_code") {
          continue;
        }
        if (this.addForm[key] == "") {
          this.$message.error(`存在漏缺项--${this.louqueForm[key]}--`);
          return;
        }
      }
      this.addForm.box_code = Math.floor(Math.random() * 8999 + 1000);
      this.$http({
        method: "post",
        url: "api/insert/insertBox",
        data: this.addForm,
      })
        .then((res) => {
          this.$message.success("添加成功!");
          this.refreshGetBox();
          this.addDV = false;
        })
        .catch((err) => {});
    },
    // 检查货品信息中客户id是否已存在的接口方法
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
            this.$message.warning(`不存在编号为${this.addForm.customer_id}的客户，请重新输入！`);
          } else {
            this.addSubmit();
          }
        })
        .catch((err) => {});
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
    addForm: {
      handler: function(nV, oV) {
        // nV.save_days = nV.come_time;

        // 获取库存天数
        if (this.addForm.come_time != "") {
          var a1 = Date.parse(new Date(nV.come_time));
          var a2 = Date.parse(new Date(this.today_date));
          var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
          nV.save_days = day + 1;
        }

        // 根据规格获取重量
        if (this.addForm.length_width_height.length > 4) {
          let lwhArr = this.addForm.length_width_height.split("*");
          if (lwhArr.length == 3) {
            let result = Math.floor((lwhArr[0] * lwhArr[1] * lwhArr[2]) / 6000 / 0.452);
            this.addForm.weight = result;
          }
        }
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

    this.refreshFormSearch();
  },
  created() {
    let that = this;
  },
};
</script>

<style lang="less" scoped>
.productPage-addForm {
  margin-top: -95px;
  /deep/ .el-form-item__error {
    padding-left: 20px;
  }
}
</style>
