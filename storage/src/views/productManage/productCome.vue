<template>
  <div class="header-container">
    <div class="module-title">
      <h1>货品入库</h1>
    </div>

    <div class="content-container">
      <el-row>
        <el-col style="width:43%">
          <el-form
            :model="formData"
            ref="formData"
            label-width="120px"
            label-position="left"
          >
            <el-form-item label="客户信息" prop="customer_info">
              <el-autocomplete
                style="width:100%"
                v-model="formData.customer_info"
                :fetch-suggestions="querySearch"
                clearable
                id="formSearch"
                placeholder="请搜索客户编号或公司名称,为空时查询所有"
              ></el-autocomplete>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col style="margin-left:10px;" :span="2">
          <el-button type="primary" @click="formSearch">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="info" @click="resetForm('formData')">重置</el-button>
        </el-col>
        <el-col :span="2">
          <el-button class="add-btn" @click="addOpen">录入信息</el-button>
        </el-col>
      </el-row>
      <el-row style="padding-top:10px">
        <el-col class="customer-table" :span="24">
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
            :data="computedQueryResData"
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
              label="入库时间"
              prop="come_time"
              width="130px"
            ></el-table-column>
            <el-table-column
              align="center"
              label="货品名称"
              prop="product_name"
            ></el-table-column>
            <el-table-column
              align="center"
              label="货品SKU"
              prop="product_sku"
            ></el-table-column>
            <el-table-column
              align="center"
              label="数量"
              prop="storage_count"
            ></el-table-column>
            <el-table-column
              align="center"
              label="仓储天数"
              prop="save_days"
            ></el-table-column>
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
          <el-button type="danger" :disabled="isDel" @click="deleteSubmit"
            >删除</el-button
          >
        </el-col>
      </el-row>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      title="-添加货品信息-"
      :visible.sync="addDV"
      width="35%"
      class="productPage-addForm"
      :before-close="handleClose"
    >
      <el-form
        :model="addForm"
        ref="addForm"
        :rules="addRules"
        label-width="120px"
      >
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:25px"
        >
          <el-form-item prop="customer_id" label="客户编号:">
            <el-col :span="24" style="padding-left:20px">
              <el-autocomplete
                style="width:100%"
                v-model="addForm.customer_id"
                :fetch-suggestions="dialogQuerySearch"
                clearable
                placeholder="模糊查询"
              ></el-autocomplete>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:25px"
        >
          <el-form-item prop="come_time" label="入库时间:">
            <el-col :span="24" style="padding-left:20px">
              <el-date-picker
                :picker-options="pickerOption"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                v-model="addForm.come_time"
              ></el-date-picker>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:25px"
        >
          <el-form-item prop="product_name" label="货品名称:">
            <el-col :span="24" style="padding-left:20px">
              <el-autocomplete
                style="width:100%"
                v-model="addForm.product_name"
                :fetch-suggestions="dialogQuerySearch"
                clearable
                placeholder="模糊查询"
              ></el-autocomplete>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:25px"
        >
          <el-form-item prop="product_sku" label="货品SKU:">
            <el-col :span="24" style="padding-left:20px">
              <el-autocomplete
                style="width:100%"
                v-model="addForm.product_sku"
                :fetch-suggestions="dialogQuerySearch"
                clearable
                placeholder="模糊查询"
              ></el-autocomplete>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item prop="storage_count" label="初始数量:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.storage_count"></el-input>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item prop="save_days" label="仓储天数:">
            <el-col :span="24" style="padding-left:20px">
              <el-input disabled v-model="addForm.save_days"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkCustomerId()">提 交</el-button>
        <el-button type="primary" plain @click="addDV = false">取 消</el-button>
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
      times: 0, // 监听计数
      timer: null,
      loading: false, // 加载标识，默认为false,当调用接口时赋值为true
      addCount: 0,
      today_date: "", // 今天的日期
      pickerOption: {
        disabledDate: (time) => {
          return time.getTime() > Date.now(); /*今天及之前，注意数字不一样*/
        },
      },
      isDel: true, // 删除禁用
      addDV: false, // 对话框默认不显示
      productReqUrl: "", // 货品信息请求地址
      productReqData: {}, // 货品信息提交数据
      nameTipsArray: [], // 提醒下拉框
      customer_id_list: [], // 添加 模糊查询列表
      addNameTipsArray: [], // 添加 提醒下拉框
      formData: {
        // 查询列表
        customer_info: "", // 客户信息,
      },
      queryResData: [], // 查询结果列表
      customer_info_list: [], // 模糊查询列表
      addForm: {
        customer_id: "",
        come_time: "",
        product_name: "",
        product_sku: "",
        storage_count: "",
        save_days: "",
        out_count: "0",
        record_code: "",
        status: "待出库",
        product_code: "",
        out_time: "1970-01-01",
      },
      updateForm: {
        customer_id: "",
        come_time: "",
        product_name: "",
        product_sku: "",
        storage_count: "",
        save_days: "",
        out_count: "0",
        status: "待出库",
        product_code: "",
        record_code: "",
      },
      louqueForm: {
        customer_id: "客户编号",
        come_time: "入库时间",
        product_name: "货品名称",
        product_sku: "货品SKU",
        storage_count: "初始数量",
        save_days: "仓储天数",
        out_count: "出库数量",
        status: "状态",
        record_code: "出库码",
      },
      rules: {
        customer_info: [
          {
            message: "请输入客户信息",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
      },
      addRules: {
        customer_id: [
          {
            message: "请输入客户编号",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
        come_time: [
          {
            message: "请输入入库时间",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
        product_name: [
          {
            message: "请输入货品名称",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
        product_sku: [
          {
            message: "请输入货品SKU",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
        storage_count: [
          {
            message: "请输入初始数量",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
        out_count: [
          {
            message: "请输入出库数量",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
        status: [
          {
            message: "请选择货品状态",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
      },
      queryPage: {
        // 分页器
        pageSize: 10,
        currentPage: 1,
      },
      multipleSelection: [], // 勾选列表
      solidSelection: [], // 防渲染后勾选消失的列表
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
      this.loading = true;

      this.$http({
        method: "post",
        url: "api/query/getProductLocateByTime",
        data: {
          customer_info: this.formData.customer_info,
        },
      })
        .then((res) => {
          this.loading = false;
          this.queryResData = [];
          this.queryResData = [];
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

    // 查询
    refreshFormSearch() {
      this.loading = true;
      this.$http({
        method: "post",
        url: "api/query/getProductLocateByTime",
        data: {
          customer_info: this.formData.customer_info,
        },
      })
        .then((res) => {
          this.loading = false;
          this.queryResData = [];
          this.queryResData = [];
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
            console.log(res.data);
            this.queryResData = res.data;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 添加 搜索框模糊查询
    dialogQuerySearch(queruString, cb) {
      if (this.addForm.customer_id != "") {
        var addNameTipsArray = this.addNameTipsArray;
        cb(addNameTipsArray);
      } else {
        cb([{ value: "" }]);
      }
    },

    // 监听添加输入框，有变动就触发防抖函数
    getDialogData() {
      let payload;
      if (
        this.addDV == true &&
        this.addForm.product_name == "" &&
        this.addForm.product_sku == ""
      ) {
        payload = this.addForm.customer_id;
      } else if (
        this.addDV == true &&
        this.addForm.customer_id != "" &&
        this.addForm.product_sku == ""
      ) {
        payload = this.addForm.product_name;
      } else if (
        this.addDV == true &&
        this.addForm.customer_id != "" &&
        this.addForm.product_name != ""
      ) {
        payload = this.addForm.product_sku;
      }
      console.log(payload);
      this.$http({
        method: "post",
        url: "api/query/getProductDialogLocate",
        data: {
          customer_info: payload,
        },
      })
        .then((res) => {
          console.log(res);
          this.customer_id_list = [];
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
                  String(item[prop]).indexOf(payload) != -1
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
        url: "api/query/getProductLocate",
        data: {
          customer_info: this.formData.customer_info,
        },
      })
        .then((res) => {
          console.log(res);
          this.customer_info_list = res.data;
          if (this.formData.customer_info != "") {
            this.nameTipsArray = [];
            let avoidSameArr = [];
            // 遍历模糊查询返回的列表,获取包含输入框关键字的字段,添加到历史列表中
            // 并且,当历史列表已存在相同字段,则跳过此遍历阶段
            for (let item of this.customer_info_list) {
              let flag = 0; // 用于标记是否需要跳过
              // 遍历每个item对象
              for (let prop in item) {
                console.log(item[prop]);
                if (
                  String(item[prop]).indexOf(this.formData.customer_info) != -1
                ) {
                  // 对防重数组遍历,若存在与历史列表对象中完全匹配的属性,则跳过此遍历
                  for (let val of avoidSameArr) {
                    if (val == item[prop]) {
                      flag = 1;
                      break;
                    }
                  }
                  if (flag == 0) {
                    this.nameTipsArray.push({
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
    // 删除提交
    deleteSubmit() {
      this.$confirm("确定删除客户信息?")
        .then(() => {
          this.solidSelection = this.multipleSelection;
          while (this.solidSelection.length != 0) {
            this.deleteProduct();
            this.solidSelection.shift();
          }
          this.$message.success("删除客户信息成功!");
        })
        .catch((err) => {
          this.$message.warning("取消删除");
        });
    },
    // 删除货物信息
    deleteProduct() {
      this.$http({
        method: "post",
        url: "api/delete/deleteProduct",
        data: {
          customer_id: this.solidSelection[0].customer_id,
          product_code: this.solidSelection[0].product_code,
        },
      })
        .then((res) => {
          this.refreshFormSearch();
        })
        .catch((err) => {
          this.$message.error(err);
        });
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
      /**
       *  为添加提交设置一个条件
       *  如果数据库表存在提交的sku，则转为更新数量
       * */
      let flag = false;
      console.log(this.addForm);
      // 对货品添加列表进行校验，如果有漏填项则提示
      for (let key in this.addForm) {
        if (
          key == "product_code" ||
          key == "out_time" ||
          key == "record_code"
        ) {
          continue;
        }
        if (this.addForm[key] == "") {
          this.$message.error(`存在漏缺项 “${this.louqueForm[key]}” `);
          return;
        }
      }

      console.log(this.addForm.product_name);

      this.$http({
        method: "post",
        url: "api/query/getSameSku",
        data: {
          customer_id: this.addForm.customer_id,
          product_name: this.addForm.product_name,
          product_sku: this.addForm.product_sku,
        },
      })
        .then((res) => {
          console.log(res);

          if (res.data.length == 0) {
            flag = true;
            console.log(res);
          } else {
            flag = false;
            console.log("结果不为0");
          }

          if (flag) {
            this.addForm.product_code = Math.floor(Math.random() * 8999 + 1000);
            this.$http({
              method: "post",
              url: "api/insert/insertProduct",
              data: this.addForm,
            })
              .then((res) => {
                this.$message.success("添加成功!");
                this.addDV = false;
                console.log(res);
                this.refreshFormSearch();
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.updateForm = this.addForm;
            this.updateForm.product_code = res.data[0].product_code;
            this.updateForm.storage_count = String(
              Number(res.data[0].storage_count) +
                Number(this.addForm.storage_count)
            );
            this.updateForm.out_count = String(Number(res.data[0].out_count));
            console.log(this.updateForm);

            this.$http({
              method: "post",
              url: "api/update/updateProduct",
              data: this.updateForm,
            })
              .then((res) => {
                this.$message.success("更新数据成功");
                this.addDV = false;
                this.refreshFormSearch();
                console.log(this.updateForm);
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
            this.$message.warning(
              `不存在编号为${this.addForm.customer_id}的客户，请重新输入！`
            );
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
        this.debounce(this.getData, 1000);
      },
      deep: true,
    },
    addForm: {
      handler: function(nV, oV) {
        // nV.save_days = nV.come_time;
        if (this.addForm.come_time != "") {
          var a1 = Date.parse(new Date(nV.come_time));
          var a2 = Date.parse(new Date(this.today_date));
          var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
          nV.save_days = day + 1;
        }
        this.debounce(this.getDialogData, 1000);
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
    var today_date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    this.today_date = today_date;

    this.refreshFormSearch();
  },
  created() {
    if (sessionStorage.getItem("userLevel") == "管理员") {
    } else {
      this.$message.warning("你没有权限使用此功能!");
      this.$router.push("/");
    }
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
</style>
