<template>
  <div class="header-container">
    <div class="module-title">
      <h1>财务系统</h1>
    </div>
    <div class="content-container">
      <el-row>
        <el-col style="width:31%">
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
                placeholder="请搜索客户编号或公司名称"
              ></el-autocomplete>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col style="margin-left:30px;" :span="2">
          <el-button type="primary" @click="formSearch">查询</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="info" @click="resetForm('formData')">重置</el-button>
        </el-col>

        <el-col :span="2">
          <div style="padding-top:5px">时间选择</div>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            :picker-options="pickerOption"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-M-d"
            v-model="choose_time"
          ></el-date-picker>
        </el-col>
      </el-row>

      <el-row style="padding-top:5px">
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
            :data="computedQueryResData"
            ref="multipleTable"
          >
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
              label="日期"
              prop="trading_date"
            ></el-table-column>
            <el-table-column
              align="center"
              label="内容"
              prop="trading_content"
            ></el-table-column>
            <el-table-column
              align="center"
              label="金额"
              prop="trading_amount"
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
    </div>
  </div>
</template>

<script>
import { utcToCst } from "@/utils/utcToCst";
import { getNowFormatDate } from "@/utils/getCurrentTime";
export default {
  data() {
    return {
      tableHeight: window.innerHeight * 0.65,
      loading: false, // 加载标识，默认为false,当调用接口时赋值为true
      queryPage: {
        pageSize: 10,
        currentPage: 1,
      },
      formData: {
        // 查询列表
        customer_info: "", // 客户信息,
      },
      choose_time: "",
      pickerOption: {
        disabledDate: (time) => {
          return time.getTime() > Date.now(); /*今天及之前，注意数字不一样*/
        },
      },
      queryResData: [], // 查询结果列表
      locateReqUrl: "/api/query/getLocateCustomerId", // 模糊查询地址
      locateReqData: {}, // 模糊查询客户信息
      nameTipsArray: [], // 提醒下拉框
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
        url: "api/query/getTradingLocate",
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
    // 查询
    formSearch() {
      if (this.choose_time == null) {
        this.choose_time = "";
      }

      this.loading = true;

      // if (this.choose_time != "" || this.choose_time != null) {
      this.$http({
        method: "post",
        url: "api/query/getTradingByName",
        data: {
          customer_info: this.formData.customer_info,
        },
      })
        .then((res) => {
          this.loading = false; this.queryResData=[];
          if (res.data.length == 0 && this.choose_time != "") {
            this.$message.warning(`没有查到日期${this.choose_time}的数据`);
            return;
          } else if (res.data.length == 0 && this.choose_time == "") {
            this.$message.warning("未查询到相关数据");
            return;
          }

          if (res.data.length != 0) {
            console.log("查询结果不为空");
            this.$message.success("查询成功");
            for (let item of res.data) {
              item.trading_date = utcToCst(item.trading_date)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "")
                .replace(/\//g, "-");
            }

            if (this.choose_time != "") {
              this.queryResData = [];

              // 对匹配到的时间，向结果列表推进数据
              for (let item of res.data) {
                if (item.trading_date == this.choose_time) {
                  this.queryResData.push(item);
                }
              }
              //  如果推进的数据为空，则提示唔该日期数据
              if (this.queryResData.length == 0) {
                if (this.choose_time != "" && this.choose_time != null) {
                  this.$message.warning(
                    `没有查到日期${this.choose_time}的数据`
                  );
                }
                return;
              }
            } else {
              // 如果时间为空，查询字段不为空，那么直接将数据倾倒进来
              this.queryResData = res.data;
            }
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
      //  }
      //   else {
      //   this.refreshFormSearch();
      // }
    },
    // 刷新查询
    refreshFormSearch() {
      if (this.choose_time == null) {
        this.choose_time = "";
      }

      this.loading = true;
      this.$http({
        method: "post",
        url: "api/query/getTradingByName",
        data:{
          customer_info:this.formData.customer_info
        },
      })
        .then((res) => {
          console.log(res);
          this.loading = false; this.queryResData=[];
          if (
            res.data.length == 0 &&
            (this.choose_time != "" || this.choose_time != null)
          ) {
            this.$message.warning(`没有查到日期${this.choose_time}的数据`);
            return;
          } else if (
            res.data.length == 0 &&
            (this.choose_time == "" || this.choose_time == null)
          ) {
            this.$message.warning("未查询到相关数据");
            return;
          }
          this.loading = false; this.queryResData=[];
          if (res.data.length != 0) {
            for (let item of res.data) {
              item.trading_date = utcToCst(item.trading_date)
                .slice(0, 10)
                .replace(/上|下|中|午|晚|早|凌|晨/g, "")
                .replace(/\//g, "-");
            }
            // this.queryResData = res.data;
            if (this.choose_time != "") {
              this.queryResData = [];

              // 对匹配到的时间，向结果列表推进数据
              for (let item of res.data) {
                if (item.trading_date == this.choose_time) {
                  this.queryResData.push(item);
                }
              }
              //  如果推进的数据为空，则提示唔该日期数据
              if (this.queryResData.length == 0) {
                if (this.choose_time != "" && this.choose_time != null) {
                  this.$message.warning(
                    `没有查到日期${this.choose_time}的数据`
                  );
                }
                return;
              }
            } else {
              // 如果时间为空，查询字段不为空，那么直接将数据倾倒进来
              console.log("时间未选择，直接搜索全部");
              this.queryResData = res.data;
            }
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 重置
    resetForm(formName) {
      let form = this.$refs[formName];
      form.resetFields();
    },
  },
  watch: {
    formData: {
      handler: function(nV, oV) {
        this.debounce(this.getData, 1000);
      },
      deep: true,
    },
    choose_time(nV, oV) {
      if (nV != "") {
        this.refreshFormSearch();
      }
    },
  },
  mounted() {
    this.refreshFormSearch();
  },
  computed: {
    computedQueryResData() {
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
      this.$router.push("/");
    }
  },
};
</script>

<style lang="less"></style>
