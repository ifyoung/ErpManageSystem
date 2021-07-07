<template>
  <div class="header-container">
    <div class="module-title">
      <h1>费用中心</h1>
    </div>
    <div class="content-container">
      <el-row>
        <el-col style="width:40%">
          <el-form :model="formData" ref="formData" :rules="rules" label-width="120px" label-position="left">
            <el-form-item label="客户信息" prop="customer_info">
              <el-autocomplete
                style="width:100%"
                v-model="formData.customer_info"
                :fetch-suggestions="querySearch"
                clearable
                id="formSearch"
                placeholder="请搜索客户编号或公司名称,空白查询所有"
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
      </el-row>

      <el-row style="padding-top:5px;">
        <el-col class="customer-table" :span="24">
          <el-table
            height="405"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-custom-class="loading_color"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.5)"
            @selection-change="handleSelectionChange"
            :row-style="showRow"
            border
            stripe
            :data="queryResData_trading_pagination"
          >
            <el-table-column align="center" type="selection" width="100px"></el-table-column>
            <el-table-column align="center" label="客户编号" prop="customer_id"></el-table-column>
            <el-table-column align="center" label="公司名称" prop="company_name"></el-table-column>
            <el-table-column align="center" label="交易日期" prop="trading_date"></el-table-column>
            <el-table-column align="center" label="内容" prop="trading_content"></el-table-column>
            <el-table-column align="center" label="金额" prop="trading_amount"></el-table-column>
            <el-table-column align="center" label="转账状态" prop="status"></el-table-column>
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
            :page-sizes="[4, 10, 20, 50]"
            :page-size="queryPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="queryResData_trading.length"
          >
          </el-pagination>
        </el-col>
      </el-row>

      <el-row type="flex" class="padding_tb padding_lr">
        <el-col :span="2">
          <el-button class="add-btn" @click="addOpen">添加</el-button>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" :disabled="isModify" plain @click="modifyOpen">修改</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" :disabled="isDel" @click="deleteSubmit">撤回</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="info" plain @click="toggleSelection()">取消选择</el-button>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="-添加货品信息-" :visible.sync="addDV" width="35%" class="productPage-addForm" :before-close="handleClose">
      <el-form :model="addForm" ref="addForm" :rules="addRules" label-width="150px">
        <el-row type="flex" justify="center" style="margin-bottom:10px;margin-top:25px">
          <el-form-item prop="customer_id" label="客户编号:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.customer_id"></el-input>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row type="flex" justify="center" style="margin-bottom:10px;margin-top:25px">
          <el-form-item prop="trading_date" label="日期:">
            <el-col :span="24" style="padding-left:20px">
              <el-date-picker
                :picker-options="pickerOption"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd-HH-ss"
                v-model="addForm.trading_date"
              ></el-date-picker>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row type="flex" justify="center" style="margin-bottom:10px;margin-top:25px">
          <el-form-item prop="trading_content" label="内容:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.trading_content"></el-input>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row type="flex" justify="center" style="margin-bottom:10px;margin-top:25px">
          <el-form-item prop="trading_amount" label="收入/支出金额:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.trading_amount"></el-input>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row type="flex" justify="center" style="margin-bottom:25px;margin-top:25px">
          <el-form-item prop="status" label="转账状态:">
            <el-col :span="24" style="padding-left:20px">
              <el-select v-model="addForm.status">
                <el-option label="已转账" value="已转账"></el-option>
                <el-option label="已充值" value="已充值"></el-option>
                <el-option label="未转账" value="未转账"></el-option>
                <el-option label="未充值" value="未充值"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkCustomerId()">提 交</el-button>
        <el-button type="primary" plain @click="addDV = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="-修改货品信息-" :visible.sync="modifyDV" width="35%" class="productPage-addForm" :before-close="handleClose">
      <el-form :model="modifyForm" ref="modifyForm" :rules="modifyRules" label-width="150px">
        <el-row type="flex" justify="center" style="margin-bottom:10px;margin-top:25px">
          <el-form-item prop="customer_id" label="客户编号:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="modifyForm.customer_id"></el-input>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row type="flex" justify="center" style="margin-bottom:10px;margin-top:25px">
          <el-form-item prop="trading_date" label="日期:">
            <el-col :span="24" style="padding-left:20px">
              <el-date-picker
                :picker-options="pickerOption"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd-HH-ss"
                v-model="modifyForm.trading_date"
              ></el-date-picker>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row type="flex" justify="center" style="margin-bottom:10px;margin-top:25px">
          <el-form-item prop="trading_content" label="内容:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="modifyForm.trading_content"></el-input>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row type="flex" justify="center" style="margin-bottom:10px;margin-top:25px">
          <el-form-item prop="trading_amount" label="收入/支出金额:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="modifyForm.trading_amount"></el-input>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row type="flex" justify="center" style="margin-bottom:25px;margin-top:25px">
          <el-form-item prop="status" label="转账状态:">
            <el-col :span="24" style="padding-left:20px">
              <el-select v-model="modifyForm.status">
                <el-option label="已转账" value="已转账"></el-option>
                <el-option label="已充值" value="已充值"></el-option>
                <el-option label="未转账" value="未转账"></el-option>
                <el-option label="未充值" value="未充值"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifySubmit()">提 交</el-button>
        <el-button type="primary" plain @click="modifyDV = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { utcToCst } from "../utils/utcToCst";
export default {
  data() {
    return {
      times: 0, // 监听计数
      timer: null,
      loading: false, // 加载标识，默认为false,当调用接口时赋值为true
      isDel: true,
      isModify: true,
      multipleSelection: [], // 勾选列表
      solidSelection: [], // 防渲染后勾选消失的列表
      today_date: "", // 今天的日期
      pickerOption: {
        disabledDate: (time) => {
          return time.getTime() > Date.now(); /*今天及之前，注意数字不一样*/
        },
      },
      addDV: false, // 对话框默认不显示
      modifyDV: false, // 对话框默认不显示
      tradingReqUrl: "", // 交易信息请求地址
      tradingReqData: {}, // 交易信息请求数据
      leaveAmountReqUrl: "", // 剩余金额请求地址
      leaveAmountReqData: {}, // 剩余金额请求数据
      rechargeReqUrl: "", // 充值记录请求地址
      rechargeReqData: {}, // 充值记录请求数据
      locateReqUrl: "/api/query/getLocateCustomerId", // 模糊查询地址
      locateReqData: {}, // 模糊查询客户信息
      nameTipsArray: [], // 提醒下拉框
      formData: {
        // 查询列表
        customer_info: "", // 客户信息,
      },
      queryResData_leaveAmount: [], // 转账查询结果列表
      queryResData_recharge: [], // 转账查询结果列表
      queryResData_trading: [], // 转账查询结果列表
      customer_info_list: [], // 模糊查询列表
      addForm: {
        customer_id: "",
        trading_date: "",
        trading_content: "",
        trading_amount: "",
        status: "",
        trading_code: "",
      },
      modifyForm: {
        customer_id: "",
        trading_date: "",
        trading_content: "",
        trading_amount: "",
        status: "",
        trading_code: "",
      },
      loutianForm: {
        // 提醒漏填项时用的列表，用来提醒字段
        customer_id: "客户编号",
        trading_date: "日期",
        trading_content: "内容",
        trading_amount: "收入/支出金额",
        status: "转账状态",
      },
      rules: {
        customer_info: [{ message: "请输入客户信息", required: true, trigger: ["blur", "change"] }],
      },
      addRules: {
        customer_id: [{ message: "请输入客户编号", required: true, trigger: ["blur", "change"] }],
        trading_date: [{ message: "请选择转账时间", required: true, trigger: ["blur", "change"] }],
        trading_content: [{ message: "请输入交易内容", required: true, trigger: ["blur", "change"] }],
        trading_amount: [{ message: "请输入支出/收入金额", required: true, trigger: ["blur", "change"] }],
        status: [{ message: "请选择转账状态", required: true, trigger: ["blur", "change"] }],
      },
      modifyRules: {
        customer_id: [{ message: "请输入客户编号", required: true, trigger: ["blur", "change"] }],
        trading_date: [{ message: "请选择转账时间", required: true, trigger: ["blur", "change"] }],
        trading_content: [{ message: "请输入交易内容", required: true, trigger: ["blur", "change"] }],
        trading_amount: [{ message: "请输入支出/收入金额", required: true, trigger: ["blur", "change"] }],
        status: [{ message: "请选择转账状态", required: true, trigger: ["blur", "change"] }],
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
        this.isModify = true;
      } else if (val.length == 1) {
        this.isModify = false;
        this.isDel = false;
      } else {
        this.isModify = true;
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
      if (/[0-9a-z]/i.test(this.formData.customer_info)) {
        this.tradingReqUrl = "/api/query/getTradingByCustomerId";
        this.tradingReqData = { customer_id: this.formData.customer_info };
      } else if (this.formData.customer_info == "") {
        this.tradingReqUrl = "/api/query/getAllTrading";
        this.tradingReqData = {};
      } else {
        this.tradingReqUrl = "/api/query/getTradingByCompanyName";
        this.tradingReqData = { company_name: this.formData.customer_info };
      }

      this.getTrading();
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
    // 获取交易信息的接口方法
    getTrading() {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.tradingReqUrl,
        data: this.tradingReqData,
      })
        .then((res) => {
          this.loading = false;
          if (res.data.length != 0) {
            this.$message.success("查询成功");
            for (let item of res.data) {
              let come = Date.parse(new Date(item.come_time));
              let today = Date.parse(new Date(this.today_date));
              var day = parseInt((today - come) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
              item.save_days = day;
              item.trading_date = utcToCst(item.trading_date)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "");
            }

            this.queryResData_trading = res.data;
          } else {
            this.queryResData_trading = [];
            this.$message.warning("查询结果为空");
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 刷新查询
    refreshFormSearch() {
      if (/[0-9a-z]/i.test(this.formData.customer_info)) {
        this.tradingReqUrl = "/api/query/getTradingByCustomerId";
        // this.leaveAmountReqUrl = "/api/query/getLeaveAmountByCustomerId";
        // this.rechargeReqUrl = "/api/query/getRechargeByCustomerId";

        this.tradingReqData = { customer_id: this.formData.customer_info };
        // this.leaveAmountReqData = { customer_id: this.formData.customer_info };
        // this.rechargeReqData = { customer_id: this.formData.customer_info };
      } else if (this.formData.customer_info == "") {
        this.tradingReqUrl = "/api/query/getAllTrading";

        this.tradingReqData = {};
      } else {
        this.tradingReqUrl = "/api/query/getTradingByCompanyName";
        // this.leaveAmountReqUrl = "/api/query/getLeaveAmountByCompanyName";
        // this.rechargeReqUrl = "/api/query/getRechargeByCompanyName";

        this.tradingReqData = { company_name: this.formData.customer_info };
        // this.leaveAmountReqData = { company_name: this.formData.customer_info };
        // this.rechargeReqData = { company_name: this.formData.customer_info };
      }

      // this.getLeaveAmount();
      // this.getRecharge();
      this.refreshGetTrading();
    },
    // 刷新获取交易信息
    refreshGetTrading() {
      this.loading = true;
      this.$http({
        method: "post",
        url: this.tradingReqUrl,
        data: this.tradingReqData,
      })
        .then((res) => {
          this.loading = false;
          if (res.data.length != 0) {
            for (let item of res.data) {
              let come = Date.parse(new Date(item.come_time));
              let today = Date.parse(new Date(this.today_date));
              var day = parseInt((today - come) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
              item.save_days = day;
              item.trading_date = utcToCst(item.trading_date)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "");
            }

            this.queryResData_trading = res.data;
          } else {
            this.queryResData_trading = [];
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 插入交易信息表
    insertTrading() {
      this.$http({
        method: "post",
        url: "api/insert/insertTrading",
        data: this.addForm,
      })
        .then((res) => {
          this.$message.success("添加成功!");
          this.refreshGetTrading();
          this.addDV = false;
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
    // 提交货品信息
    addSubmit() {
      // 为交易码添加随机4位
      this.addForm.trading_code = Math.floor(Math.random() * 8999 + 1000);
      // 对货品添加列表进行校验，如果有漏填项则提示
      for (let key in this.addForm) {
        if (this.addForm[key] == "") {
          this.$message.error(`存在漏缺项:${this.loutianForm[key]}`);
          return;
        }
      }

      this.insertTrading();
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
    // 打开添加信息框
    addOpen() {
      if (this.queryResData_leaveAmount.length != 0) {
        this.addForm.customer_id = this.queryResData_leaveAmount[0].customer_id;
      }
      this.addDV = true;
    },
    // 打开修改信息框
    modifyOpen() {
      this.modifyForm.customer_id = this.queryResData_leaveAmount[0].customer_id;

      this.modifyForm.trading_code = this.multipleSelection[0].trading_code;
      this.modifyForm.trading_amount = this.multipleSelection[0].trading_amount;
      this.modifyForm.trading_content = this.multipleSelection[0].trading_content;
      this.modifyForm.trading_date = this.multipleSelection[0].trading_date;
      this.modifyForm.status = this.multipleSelection[0].status;
      this.modifyDV = true;
    },
    // 修改提交
    modifySubmit() {
      // 对货品修改列表进行校验，如果有漏填项则提示
      for (let key in this.modifyForm) {
        if (this.modifyForm[key] == "") {
          this.$message.error(`存在漏缺项:${this.loutianForm[key]}`);
          return;
        }
      }
      this.modifyTrading();
    },

    // 修改交易信息
    modifyTrading() {
      this.$http({
        method: "post",
        url: "api/update/updateTrading",
        data: this.modifyForm,
      })
        .then((res) => {
          this.$message.success("修改成功");
          this.modifyDV = false;
          this.refreshGetTrading();
        })
        .catch((err) => {});
    },
    // 删除交易信息
    deleteTrading(arr) {
      let data = {};
      data.trading_code = this.solidSelection[0].trading_code;
      data.customer_id = this.solidSelection[0].customer_id;
      this.$http({
        method: "post",
        url: "api/delete/deleteTrading",
        data: data,
      })
        .then((res) => {
          this.refreshGetTrading();
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 撤回提交
    deleteSubmit() {
      if (this.multipleSelection.length != 0) {
        this.solidSelection = this.multipleSelection;
      }
      while (this.solidSelection.length != 0) {
        this.deleteTrading();
        this.solidSelection.shift();
      }
    },
    // 取消所有勾选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
  watch: {
    formData: {
      handler: function(nV, oV) {
        // 对输入框的值做判断，为数字则请求id，为汉字则请求公司名称
        if (/[0-9a-z]/i.test(this.formData.customer_info)) {
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
      handler: function(nV, oV) {},
      deep: true,
    },
  },
  computed: {
    queryResData_trading_pagination() {
      let size = this.queryPage.pageSize;
      let current = this.queryPage.currentPage;
      return this.queryResData_trading.slice(size * (current - 1), size * current);
    },
    queryResData_recharge_pagination() {
      let size = this.queryPage.pageSize;
      let current = this.queryPage.currentPage;
      return this.queryResData_recharge.slice(size * (current - 1), size * current);
    },
  },
  mounted() {
    var today = new Date();
    today.setTime(today.getTime());
    var today_date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    this.today_date = today_date;

    this.refreshFormSearch();
  },
};
</script>

<style lang="less" scoped>
.productPage-addForm {
  margin-top: -35px;
  /deep/ .el-form-item__error {
    padding-left: 20px;
  }
}


</style>
