<template>
  <div class="header-container">
    <div class="module-title">
      <h1>箱子入库</h1>
    </div>
    <div class="content-container">
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
              label="公司名称"
              prop="company_name"
              width="150px"
            ></el-table-column>
            <el-table-column
              align="center"
              label="入库时间"
              prop="come_time"
              width="200px"
            ></el-table-column>
            <el-table-column
              align="center"
              label="名称"
              prop="product_name"
              width="200px"
            ></el-table-column>
            <el-table-column
              align="center"
              label="规格(cm)"
              prop="length_width_height"
              width="150px"
            ></el-table-column>
            <el-table-column
              align="center"
              label="抛重重量(lb)"
              prop="weight"
              width="150px"
            ></el-table-column>
            <el-table-column
              align="center"
              label="实际重量(lb)"
              prop="real_weight"
              width="150px"
            ></el-table-column>
            <el-table-column
              align="center"
              label="数量"
              prop="save_days"
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
      title="-添加箱子信息-"
      :visible.sync="addDV"
      width="35%"
      class="productPage-addForm"
      :before-close="handleClose"
    >
      <el-form
        :model="addForm"
        ref="addForm"
        :rules="addRules"
        label-width="140px"
      >
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:25px"
        >
          <el-form-item prop="customer_id" label="客户编号:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.customer_id"></el-input>
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
          <el-form-item prop="product_name" label="箱子名称:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.product_name"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:10px;margin-top:25px"
        >
          <el-form-item prop="length_width_height" label="规格(cm):">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.length_width_height"></el-input>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item prop="weight" label="抛重重量(lb):">
            <el-col :span="24" style="padding-left:20px">
              <el-input disabled v-model="addForm.weight"></el-input>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item prop="real_weight" label="实际重量(lb):">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.real_weight"></el-input>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row
          type="flex"
          justify="center"
          style="margin-bottom:25px;margin-top:25px"
        >
          <el-form-item prop="count" label="仓储数量:">
            <el-col :span="24" style="padding-left:20px">
              <el-input v-model="addForm.count"></el-input>
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
        weight: "抛重重量(lb)",
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
        real_weight: "",
        count: "",
        save_days: "",
        out_count: "0",
        box_code: "",
        status: "待出库",
        out_time: "1970-01-01",
        record_code: "",
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
            message: "请选择入库时间",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
        product_name: [
          {
            message: "请输入箱子名称",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
        length_width_height: [
          {
            message: "请输入规格(cm),例如'30*40*50'",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
        real_weight: [
          {
            message: "请输入实际重量(lb)",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
        count: [
          {
            message: "请输入初始数量",
            required: true,
            trigger: ["blur", "change"],
          },
        ],
        save_days: [
          {
            message: "请输入仓储天数",
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
            message: "请选择库存状态",
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
      this.getBox();
    },

    // 查询
    refreshFormSearch() {
      this.refreshGetBox();
    },

    // 获取箱子信息
    getBox() {
      this.$http({
        method: "post",
        url: "api/query/getBoxLocateByTime",
        data: {
          customer_info: this.formData.customer_info,
        },
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
            }
            console.log(res.data);
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
      this.loading = true;
      this.$http({
        method: "post",
        url: "api/query/getBoxLocateByTime",
        data: {
          customer_info:  sessionStorage.getItem("userName"),
        },
      })
        .then((res) => {
          this.loading = false;
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
    // 删除货物信息
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
        url: "api/query/getBoxLocate",
        data: {
          customer_info: this.formData.customer_info,
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
    addForm: {
      handler: function(nV, oV) {
        // 获取库存天数
        if (this.addForm.come_time != "") {
          var a1 = Date.parse(new Date(nV.come_time));
          var a2 = Date.parse(new Date(this.today_date));
          var day = parseInt((a2 - a1) / (1000 * 60 * 60 * 24)); //核心：时间戳相减，然后除以天数
          nV.save_days = day + 1;
        }

        // 根据规格获取抛重重量
        if (this.addForm.length_width_height.length > 4) {
          let lwhArr = this.addForm.length_width_height.split("*");
          if (lwhArr.length == 3) {
            let result = Math.floor(
              (lwhArr[0] * lwhArr[1] * lwhArr[2]) / 6000 / 0.452
            );
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
    var today_date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    this.today_date = today_date;

    this.refreshGetBox();
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
