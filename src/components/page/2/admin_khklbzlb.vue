<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="用户名">
        <el-input  v-model="userName"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
        <el-button @click="add" type="primary" plain>添加客户扣量标准</el-button>
      </el-form-item>
    </el-form>

    <!-- 修改信息操作弹出框 -->
    <el-dialog title="修改随机路由" :visible.sync="modifyDataVisible">
      <el-form
        :model="userAmountDeducted"
        :rules="rule1"
        ref="userAmountDeducted"
        label-width="120px"
      >
        <el-form-item label="用户名：">
          <el-select v-model="userAmountDeducted.userName" filterable>
            <el-option
              v-for="item in userNameList"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="网关：">
          <el-select v-model="userAmountDeducted.gateway" filterable>
            <el-option
              v-for="item in gatewayList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="调整比例：" :label-width="formLabelWidth" prop="deductedProportion">
          <el-input v-model="userAmountDeducted.deductedProportion" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="扣量标准：" :label-width="formLabelWidth" prop="deductNum">
          <el-input v-model.number="userAmountDeducted.deductNum" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="免白省份：">
          <el-checkbox-group v-model="userAmountDeducted.checkedCities">
            <el-checkbox v-for="item of areaList" :key="item" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="userAmountDeducted.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('userAmountDeducted')">保存</el-button>
        <el-button @click="resetForm('userAmountDeducted')">取消</el-button>
      </div>
    </el-dialog>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="options" label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="text" @click="modifyData(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteDate(scope.row)">删除</el-button>
            <el-button type="text" @click="changeStatus(scope.row)">{{scope.row.status?"禁用":"启用"}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column width="100px" prop="gateway" label="网关编码"></el-table-column>
        <el-table-column prop="gatewayName" label="网关名称"></el-table-column>
        <el-table-column prop="deductedProportion" label="调整比例"></el-table-column>
        <el-table-column prop="deductNum" label="扣量标准"></el-table-column>
        <el-table-column prop="undeductedArea" label="免白省份"></el-table-column>

        <el-table-column prop="cnStatus" label="状态"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="createdUserName" label="创建人"></el-table-column>
        <el-table-column width="150px" prop="createdTime" label="创建时间"></el-table-column>
        <el-table-column prop="modifyUserName" label="修改人"></el-table-column>
        <el-table-column width="150px" prop="modifyTime" label="修改时间"></el-table-column>
      </el-table>
      <el-pagination
        class="fr"
        style="margin:10px 0"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="pageNum"
        :page-size.sync="pageSize"
        :total="sum"
         layout="sizes, prev, pager, next, jumper"
      ></el-pagination>
      <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
    </el-card>

    <!-- 添加客户扣量标准弹出框 -->
    <el-dialog title="添加客户扣量标准" :visible.sync="addDataFormFlag">
      <el-form
        label-width="120px"
        inline="inline"
        :model="addDataForm"
        :rules="rules"
        ref="addDataForm"
      >
        <el-form-item label="用户名：" prop="userName">
          <el-select v-model="addDataForm.userName" filterable>
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="网关：" prop="gateway">
          <el-select v-model="addDataForm.gateway" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="调整比例：" prop="deductedProportion">
          <el-input  v-model="addDataForm.deductedProportion" clearable></el-input>
        </el-form-item>
        <el-form-item label="扣量标准：" prop="deductNum">
          <el-input  v-model.number="addDataForm.deductNum" clearable></el-input>
        </el-form-item>

        <el-form-item label="免白省份：">
          <el-checkbox-group v-model="addAreaList">
            <el-checkbox v-for="item of checkList" :key="item" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="备注：">
          <el-input type="textarea" autosize placeholder="请输入内容" v-model="addDataForm.remark"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddDeducted('addDataForm')">保存添加</el-button>
        <el-button @click="resetForm2('addDataForm')">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "admin_fxbglb",
  data() {
    return {
      //修改操作数据
      userAmountDeducted: {
        checkedCities: [],
        accountId: "",
        userName: "",
        gateway: "",
        gatewayname: "",
        deductedProportion: "",
        deductNum: "",
        undeductedArea: "",
        createdAccountId: "",
        createdUserName: "",
        createdTime: "",
        modifyTime: "",
        modifyAccountId: "",
        modifyUserName: "",
        status: "",
        remark: ""
      },
      areaList: [
        "北京",
        "安徽",
        "福建",
        "重庆",
        "甘肃",
        "广东",
        "广西",
        "贵州",
        "海南",
        "河北",
        "河南",
        "湖北",
        "湖南",
        "黑龙江",
        "宁夏",
        "江苏",
        "江西",
        "吉林",
        "辽宁",
        "内蒙古",
        "青海",
        "陕西",
        "山西",
        "山东",
        "上海",
        "四川",
        "天津",
        "新疆",
        "西藏",
        "云南",
        "浙江",
        "台湾",
        "香港",
        "澳门"
      ],
      rules: {
        userName: [
          { required: true, message: "请输入有效值", trigger: "blur" }
        ],
        gateway: [{ required: true, message: "请输入有效值", trigger: "blur" }],
        deductedProportion: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        deductNum: [
          { required: true, message: "不能为空", trigger: "blur" },
          { type: "number", message: "请输入0-999999999的数字" }
        ]
      },
      rule1: {
        deductedProportion: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        deductNum: [
          { required: true, message: "不能为空", trigger: "blur" },
          { type: "number", message: "请输入0-999999999的数字" }
        ]
      },
      modifyDataVisible: false,
      userName: "",
      formLabelWidth: "120px",
      index: 0,
      userNameList: [],
      gatewayList: [],
      /////
      addDataFormFlag: false,
      options1: [],
      options2: [],
      checkList: [
        "北京",
        "安徽",
        "福建",
        "重庆",
        "甘肃",
        "广东",
        "广西",
        "贵州",
        "海南",
        "河北",
        "河南",
        "湖北",
        "湖南",
        "黑龙江",
        "宁夏",
        "江苏",
        "江西",
        "吉林",
        "辽宁",
        "内蒙古",
        "青海",
        "陕西",
        "山西",
        "山东",
        "上海",
        "四川",
        "天津",
        "新疆",
        "西藏",
        "云南",
        "浙江",
        "台湾",
        "香港",
        "澳门"
      ],
      addAreaList: [],
      addCustomerList: [],
      addGatewayList: [],
      addDataForm: {
        accountId: "",
        userName: "",
        gateway: "",
        gatewayname: "",
        deductedProportion: "",
        deductNum: "",
        undeductedArea: "",
        createdAccountId: "",
        createdUserName: "",
        createdTime: "",
        modifyTime: "",
        modifyAccountId: 0,
        modifyUserName: "",
        status: "",
        remark: ""
      },
      ////
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      tableData: [],
      checkIn: false,
      loading: false
    };
  },
  methods: {
    //修改表单操作
    modifyData(row) {
      this.gatewayList = [];
      this.userNameList = [];
      this.userAmountDeducted.checkedCities = [];
      let self = this;
      this.modifyDataVisible = true;
      this.userAmountDeducted.userName = row.userName;
      this.userAmountDeducted.gateway = `${row.gateway}(${row.gatewayName})`;
      this.postRequest("admin/updateUserAmountDeducted", {
        id: row.id
      }).then(res => {
        for (let item of res.data.data.gatewayList) {
          self.gatewayList.push({
            id: item.id,
            label: `${item.gateway}(${item.gatewayname})`,
            value: item.gateway
          });
        }
        for (let item of res.data.data.customerList) {
          self.userNameList.push({
            id: item.id,
            label: item.userName,
            value: item.accountID
          });
        }
        for (let prop in res.data.data.date) {
          self.userAmountDeducted[prop] = res.data.data.date[prop];
        }
        // self.userAmountDeducted = {
        //   checkedCities: [],
        //   accountId: res.data.data.date.accountId,
        //   userName: res.data.data.date.userName,
        //   gateway: res.data.data.date.gateway,
        //   gatewayname: res.data.data.date.gatewayname,
        //   deductedProportion: res.data.data.date.deductedProportion,
        //   deductNum: res.data.data.date.deductNum,
        //   undeductedArea: res.data.data.date.undeductedArea,
        //   createdAccountId: res.data.data.date.createdAccountId,
        //   createdUserName: res.data.data.date.createdUserName,
        //   createdTime: res.data.data.date.createdTime,
        //   modifyTime: res.data.data.date.modifyTime,
        //   modifyAccountId: res.data.data.date.modifyAccountId,
        //   modifyUserName: res.data.data.date.modifyUserName,
        //   status: res.data.data.date.status,
        //   remark: res.data.data.date.remark
        // };
        if (self.userAmountDeducted.undeductedArea) {
          self.userAmountDeducted.checkedCities = self.userAmountDeducted.undeductedArea.split(
            ","
          );
        }
      });
    },
    //表单提交
    submitForm(formName) {
      this.userAmountDeducted.deductedProportion = Number(
        this.userAmountDeducted.deductedProportion
      );
      this.userAmountDeducted.deductNum = Number(
        this.userAmountDeducted.deductNum
      );
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.modifyDataVisible = false;
          this.userAmountDeducted.undeductedArea = this.userAmountDeducted.checkedCities.join(
            ","
          );
          let self = this;
          this.postRequest("admin/saveUpdateUserAmountDeducted", {
            userAmountDeducted: this.userAmountDeducted
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.resultMsg);
              self.checkData();
            } else {
              self.failed(res.data.resultMsg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //删除操作
    deleteDate(row) {
      let self = this;
      this.$confirm(`此操作将删除用户：${row.userName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/deleteUserAmountDeducted", {
              id: row.id
            })
            .then(res => {
              if (res.data.success) {
                this.succeed(res.data.resultMsg);
                this.checkData();
              } else {
                this.failed(res.data.resultMsg);
              }
            });
        })
        .catch(() => {});
    },
    //禁用/启用操作
    changeStatus(row) {
      let self = this;
      if (row.status === 1) {
        this.$confirm(
          `此操作将禁用用户：${row.userName} 的随机路由, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            self
              .postRequest("admin/changeUserAmountDeductedStatus", {
                id: row.id,
                status: row.status === 1 ? 0 : 1
              })
              .then(res => {
                if (res.data.success) {
                  self.succeed(res.data.resultMsg);
                  self.checkData();
                } else {
                  self.failed(res.data.resultMsg);
                }
              });
          })
          .catch(() => {});
      } else {
        this.postRequest("admin/changeUserAmountDeductedStatus", {
          id: row.id,
          status: row.status === 0 ? 1 : 0
        }).then(res => {
          if (res.data.success) {
            self.succeed(res.data.resultMsg);
            self.checkData();
          } else {
            self.failed(res.data.resultMsg);
          }
        });
      }
    },
    //取消提交
    resetForm(formName) {
      this.modifyDataVisible = false;
    },
    resetForm2(formName) {
      this.addDataFormFlag = false;
      this.addDataForm = {
        accountId: "",
        userName: "",
        gateway: "",
        gatewayname: "",
        deductedProportion: "",
        deductNum: "",
        undeductedArea: "",
        createdAccountId: "",
        createdUserName: "",
        createdTime: "",
        modifyTime: "",
        modifyAccountId: 0,
        modifyUserName: "",
        status: "",
        remark: ""
      };
    },
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    failed(message) {
      this.$message.error(message);
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      this.userNameList = [];
      let self = this;
      this.postRequest("admin/listUserAmountDeducted", {
        userName: this.userName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            userName: item.userName,
            gateway: item.gateway,
            gatewayName: item.gatewayname,
            deductedProportion: item.deductedProportion
              ? item.deductedProportion + "%"
              : 0,
            deductNum: item.deductNum,
            undeductedArea: item.undeductedArea,
            cnStatus: item.cnStatus,
            status: item.status,
            remark: item.remark,
            createdUserName: item.createdUserName,
            createdTime: item.createdTime,
            modifyUserName: item.modifyUserName,
            modifyTime: item.modifyTime,
            id: item.id
          });
          self.userNameList.push({
            index: self.index,
            id: item.id,
            value: item.userName
          });
          self.index++;
        }
      });
    },
    ////////////////////////////
    add() {
      this.addDataFormFlag = true;
    },
    saveAddDeducted(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.addDataForm.undeductedArea = self.addAreaList.join(",");
          for (let i = 0; i < this.addCustomerList.length; i++) {
            if (
              this.addCustomerList[i].userName === this.addDataForm.userName
            ) {
              this.addDataForm.accountId = this.addCustomerList[i].accountID;
              this.addDataForm.createdUserName = this.addCustomerList[
                i
              ].userName;
              this.addDataForm.createdAccountId = this.addCustomerList[
                i
              ].accountID;
            }
          }
          for (let i = 0; i < this.addGatewayList.length; i++) {
            if (this.addGatewayList[i].gateway === this.addDataForm.gateway) {
              this.addDataForm.gatewayname = this.addGatewayList[i].gatewayname;
              this.addDataForm.modifyTime = this.addGatewayList[i].modifytime;
              this.addDataForm.modifyUserName = this.addGatewayList[
                i
              ].modifyoper;
              this.addDataForm.status = 0;
            }
          }
          this.addDataForm.deductedProportion = Number(
            this.addDataForm.deductedProportion
          );
          this.addDataForm.deductNum = Number(this.addDataForm.deductNum);

          this.tableData = [];
          this.postRequest("admin/saveAddUserAmountDeducted", {
            userAmountDeducted: this.addDataForm
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.resultMsg);
              //提交成功 表单置空
              self.resetForm2(formName);
              self.addAreaList = [];
              self.checkData();
            } else {
              self.failed(res.data.resultMsg);
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.checkData();
  },
  beforeCreate() {
    let self = this;
    this.postRequest("admin/addUserAmountDeducted", null).then(res => {
      self.addGatewayList = [];
      self.addCustomerList = [];
      self.addCustomerList = res.data.data.customerList;
      self.addGatewayList = res.data.data.gatewayList;

      for (let item of self.addCustomerList) {
        self.options1.push({
          label: item.userName,
          value: item.userName,
          id: item.id
        });
      }
      for (let item of self.addGatewayList) {
        self.options2.push({
          label: `${item.gateway}(${item.gatewayname})`,
          value: item.gateway,
          id: item.id
        });
      }
    });
  }
};
</script>

<style scoped>
.el-checkbox {
  margin-left: 0 !important;
  margin-right: 30px;
}
</style>
