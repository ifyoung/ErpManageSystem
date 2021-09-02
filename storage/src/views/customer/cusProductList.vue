<template>
  <div class="header-container">
    <div class="module-title">
      <h1>货品清单</h1>
    </div>

    <div class="content-container">
      <el-row>
        <el-col style="width:auto">
          <span class="customer_id_style">客户编号:{{ customer_id }}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7">
          <el-form
            :model="formData"
            ref="formData"
            label-width="0"
            label-position="left"
          >
            <el-form-item prop="customer_info">
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
        <el-col style="margin-left:10px;" :span="2">
          <el-button type="primary" @click="formSearch">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="info" @click="resetForm('formData')">重置</el-button>
        </el-col>

        <el-col :span="3" style="margin-left:1%">
          <el-button
            :class="[isNoClick == true ? 'disabled-btn' : 'add-btn']"
            :disabled="isNoClick"
            @click="addOpen"
            >点击填写地址(勾选后点击,若多选则提交同一地址)</el-button
          >
        </el-col>
      </el-row>

      <el-row>
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
              label="产品名称"
              prop="product_name"
            ></el-table-column>
            <el-table-column
              align="center"
              label="产品sku"
              prop="product_sku"
            ></el-table-column>
            <el-table-column
              align="center"
              label="入仓数量"
              prop="storage_count"
            ></el-table-column>
            <el-table-column
              align="center"
              label="剩余数量"
              prop="leave_count"
            ></el-table-column>
            <el-table-column align="center" label="下单数量">
              <template slot-scope="scope">
                <div class="sa-container">
                  <el-input
                    placeholder="请输入"
                    v-model="scope.row.count"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="入库时间"
              prop="come_time"
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
    </div>

    <el-dialog
      :close-on-click-modal="false"
      title="-填写地址信息-"
      class="cus-dialog-style"
      :visible.sync="addDV"
      width="55%"
      :before-close="handleClose"
    >
      <el-form v-model="addForm" ref="addForm" label-width="340px">
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:25px"
        >
          <el-form-item required label="买家地址 Enter customer address:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.customer_address"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item required label="全名 Full name:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.full_name"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item required label="街道地址1 Street address1:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.street_address1"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item required label="街道地址2 Street address2:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.street_address2"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item required label="城市 City:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.city"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item required label="州/省 State/Province:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.province"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item required label="邮编 Zip / Postal code:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.zip"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item label="手机电话(可选) Phone number:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.phone_number"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:15px"
        >
          <el-form-item label="邮箱地址(可选) Email address:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.email_address"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addToSubmit">提 交</el-button>
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
      customer_id: "", // 获取当前登录账号的客户编号
      level: "", // 用户身份
      isNoClick: true, // 禁止添加
      times: 0, // 监听计数
      timer: null,
      loading: false, // 加载标识，默认为false,当调用接口时赋值为true
      today_date: "", // 今天的日期
      pickerOption: {
        disabledDate: (time) => {
          return time.getTime() > Date.now(); /*今天及之前，注意数字不一样*/
        },
      },
      addDV: false, // 是否开启添加的会话框
      addForm: {
        // 添加列表
        customer_address: "", //客户地址
        full_name: "", // 地址全称
        street_address1: "", // 街道地址1
        street_address2: "", // 街道地址2
        city: "", // 城市
        province: "", // 省份
        zip: "", // 邮编
        phone_number: "", // 手机电话
        email_address: "", // 邮箱地址
        product_code: "", // 货品码
        box_code: "", // 箱子码
        record_code: "", // 记录码
      },
      productReqUrl: "", // 货品信息请求地址
      productReqData: {}, // 货品信息提交数据
      nameTipsArray: [], // 提醒下拉框
      formData: {
        // 查询列表
        customer_info: "", // 客户信息,
      },
      queryResData: [], // 查询结果列表
      customer_info_list: [], // 模糊查询列表
      rules: {
        customer_info: [
          {
            message: "请输入客户信息",
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
      solidSelection: [], // 固定勾选列表
      solidSelection: [], // 防渲染后勾选消失的列表
    };
  },
  methods: {
    handleSizeChange(val) {
      this.queryPage.pageSize = val;
    },
    handleCurrentChange(val) {
      this.queryPage.currentPage = val;
    },
    handleClose() {
      this.addDV = false;
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
      console.log(val);
      if (val.length == 0) {
        this.isNoClick = true;
      } else {
        this.isNoClick = false;
      }
      this.multipleSelection = val;
    },
    // 重置
    resetForm(formName) {
      let form = this.$refs[formName];
      form.resetFields();
    },

    // 搜索框模糊查询
    querySearch(queruString, cb) {
      if (this.formData.customer_info != "") {
        var nameTipsArray = this.nameTipsArray;
        cb(nameTipsArray);
      } else {
        cb([
          {
            value: "",
          },
        ]);
      }
    },

    // 查询
    formSearch() {
      this.loading = true;
      this.$http({
        method: "post",
        url: "/api/query/getSingleProductLocateByTime",
        data: {
          customer_info: this.formData.customer_info,
          customer_id: this.customer_id,
        },
      })
        .then((res) => {
          console.log(res);
          this.loading = false;
          this.queryResData = [];
          if (res.data.length != 0) {
            console.log(res);
            this.queryResData = [];
            for (let item of res.data) {
              let come = Date.parse(new Date(item.come_time));
              let today = Date.parse(new Date(this.today_date));
              var day = parseInt((today - come) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
              item.save_days = day;
              item.come_time = utcToCst(item.come_time)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "");

              item.leave_count =
                Number(item.storage_count) - Number(item.out_count);
              item.count = "";
              this.queryResData.push(item);
            }
            console.log(this.queryResData);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    // 刷新查询
    refreshFormSearch() {
      this.loading = true;
      this.$http({
        method: "post",
        url: "/api/query/getProductLocateByTime",
        data: {
          customer_info: this.customer_id,
        },
      })
        .then((res) => {
          console.log(res);
          this.loading = false;
          this.queryResData = [];
          if (res.data.length != 0) {
            console.log(res);
            this.queryResData = [];
            for (let item of res.data) {
              let come = Date.parse(new Date(item.come_time));
              let today = Date.parse(new Date(this.today_date));
              var day = parseInt((today - come) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
              item.save_days = day;
              item.come_time = utcToCst(item.come_time)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "");

              item.leave_count =
                Number(item.storage_count) - Number(item.out_count);
              item.count = "";
              this.queryResData.push(item);
            }
            console.log(this.queryResData);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    // 添加按钮
    addOpen() {
      this.solidSelection = this.multipleSelection;
      for (let item of this.solidSelection) {
        if (item.count == "") {
          this.$message.warning("存在未填写'下单数量'的勾选项,请检查！");
          return;
        }

        if (item.count < 0) {
          this.$message.warning("下单数量不能为负数!");
          return;
        }

        if (item.count > item.leave_count) {
          this.$message.warning("下单数量超额!");
          return;
        }
        if (isNaN(Number(item.count))) {
          this.$message.warning("存在非数字字符!");
          return;
        }
      }
      this.addDV = true;
    },

    // 添加提交
    addToSubmit() {
      if (
        this.addForm.customer_address == "" ||
        this.addForm.street_address1 == "" ||
        this.addForm.street_address2 == "" ||
        this.addForm.zip == "" ||
        this.addForm.city == "" ||
        this.addForm.province == ""
      ) {
        this.$message.warning("存在未填写出库的勾选项,请检查！");
        return;
      }

      while (this.solidSelection.length != 0) {
        let random = String(Math.floor(Math.random() * 1000 + 8999));
        this.solidSelection[0].out_time = getNowFormatDate();
        this.updateProduct(this.solidSelection[0], random);
        this.insertOutRecord(this.solidSelection[0], random);
        this.insertAddress(random, this.addForm);

        this.solidSelection.shift();
      }
      this.refreshFormSearch();
      this.addDV = false;
    },

    // 添加 出库记录 信息
    insertOutRecord(data, random) {
      this.$http({
        method: "post",
        url: "api/insert/insertOutRecord",
        data: {
          customer_id: data.customer_id,
          product_name: data.product_name,
          product_sku: data.product_sku,
          out_time: data.out_time,
          out_count: data.count,
          record_code: random,
          status: "false",
          out_source: "客户",
        },
      })
        .then((res) => {
          console.log("添加出库记录信息成功");
        })
        .catch((err) => {});
    },

    // 添加 地址 信息
    insertAddress(random, data) {
      data.record_code = random;
      data.product_code = this.solidSelection[0].product_code;
      console.log(data);
      this.$http({
        method: "post",
        url: "api/insert/insertAddress",
        data: data,
      })
        .then((res) => {
          console.log("添加地址成功");
          this.$message.success("添加地址成功");
        })
        .catch((err) => {});
    },

    // 更新 货品信息
    updateProduct(data, random) {
      data.record_code = random;
      data.out_count = String(Number(data.out_count) + Number(data.count));
      this.$http({
        method: "post",
        url: "api/update/updateProduct",
        data: data,
      })
        .then((res) => {
          this.refreshGetAllProduct();
        })
        .catch((err) => {});
    },

    // 监听输入框，有变动就触发防抖函数
    getData() {
      this.$http({
        method: "post",
        url: "api/query/getSingleProductLocate",
        data: {
          customer_info: this.formData.customer_info,
          customer_id: this.customer_id,
        },
      })
        .then((res) => {
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
                    if (prop == "company_name") {
                      continue;
                    }
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
  },
  watch: {
    formData: {
      handler: function(nV, oV) {
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
    this.customer_id = sessionStorage.getItem("userName");
    this.level = sessionStorage.getItem("userLevel");
  },
};
</script>
<style lang="less" scoped>
.customer_id_style {
  margin: 0;
  font-size: 20px;
}
.cus-dialog-style {
  /deep/ .el-dialog {
    margin-top: 1vh !important;
  }
  .el-input {
    width: 300px !important;
  }
}
</style>
