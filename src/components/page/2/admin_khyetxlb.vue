<template>
  <div class="container">
    <el-button type="text" @click="addRemindUserBalance">+添加客户余额提醒</el-button>

    <!-- 添加客户余额提醒弹出框 -->
    <el-dialog title="添加客户余额提醒" :visible.sync="dialogFormVisible">
      <el-form
        :model="remindUserBalance"
        :rules="rules"
        ref="remindUserBalance"
        label-width="120px"
      >
        <el-form-item label="用户名：">
          <el-select v-model="remindUserBalance.userName" filterable>
            <el-option
              v-for="item in options"
              :key="item.index"
              :label="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="提醒标准：" :label-width="formLabelWidth" prop="balance">
          <el-input v-model="remindUserBalance.balance" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="提醒号码：" :label-width="formLabelWidth" prop="mobiles">
          <el-input
            type="textarea"
            autosize
            placeholder="手机号码之间请用英文逗号分割"
            v-model="remindUserBalance.mobiles"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('remindUserBalance')">保存</el-button>
        <el-button @click="resetForm('remindUserBalance')">取消</el-button>
      </div>
    </el-dialog>

    <!-- 修改信息操作弹出框 -->
    <el-dialog title="修改余额提醒" :visible.sync="modifyDataVisible">
      <el-form
        :model="remindUserBalance"
        :rules="rules"
        ref="remindUserBalance"
        label-width="120px"
      >
        <el-form-item label="用户名：">
          <el-input v-model="remindUserBalance.userName" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="提醒标准：" :label-width="formLabelWidth" prop="balance">
          <el-input v-model="remindUserBalance.balance" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="提醒号码：" :label-width="formLabelWidth" prop="mobiles">
          <el-input
            type="textarea"
            autosize
            placeholder="手机号码之间请用英文逗号分割"
            v-model="remindUserBalance.mobiles"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitModifyForm('remindUserBalance')">保存</el-button>
        <el-button @click="resetForm('remindUserBalance')">取消</el-button>
      </div>
    </el-dialog>

    <el-form label-width="120px" inline="inline" v-on:keyup.enter.native="checkData">
      <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="checkData" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="oprations" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="modifyData(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteDate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="createUserName" label="创建用户"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop="balance" label="提醒标准"></el-table-column>
        <el-table-column prop="mobiles" label="提醒号码"></el-table-column>
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
  </div>
</template>

<script>
export default {
  name: "admin_fxbglb",
  data() {
    return {
      options: [],
      accountIDList: [],
      remindUserBalance: {
        userName: "",
        balance: "",
        mobiles: "",
        accountID: ""
      },
      rules: {
        balance: [{ required: true, message: "不能为空", trigger: "blur" },{ type: 'number', message: '请输入0-999999999的数字'}],
        mobiles: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,
      modifyDataVisible: false,
      modifyDataForm: {},
      userName: "",
      index: 0,
      fmmdd: new Date(),
      tmmdd: new Date(),
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      index: 0,
      tableData: [],
      checkIn: true,
      loading: false
    };
  },
  methods: {
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    failed() {
      this.$message.error(message);
    },

    //修改操作
    modifyData(row) {
      let self = this;
      this.remindUserBalance = {};
      this.modifyDataVisible = true;
      this.postRequest("admin/updateRemindUserBalance", {
        accountID: row.accountID
      }).then(res => {
        self.remindUserBalance = {
          accountID: res.data.data.remindBalance.accountID,
          balance: res.data.data.remindBalance.balance,
          mobiles: res.data.data.remindBalance.mobiles,
          userName: res.data.data.remindBalance.userName
        };
      });
    },
    //删除操作
    deleteDate(row) {
      let self = this;
      this.$confirm(`此操作将删除wav：${row.wavName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/deleteRemindUserBalance", {
              id: row.id
            })
            .then(res => {
              if (res.data.success) {
                this.succeed(res.data.data);
                this.checkData();
              } else {
                this.failed(res.data.data);
              }
            });
        })
        .catch(() => {});
    },
    //提交修改操作表单
    submitModifyForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.modifyDataVisible = false;
          let self = this;
          this.postRequest("admin/saveUpdateRemindUserBalance", {
            remindUserBalance: this.remindUserBalance
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.data);
              self.checkData();

            } else {
              self.failed(res.data.data);
            }
          });
        } else {
          return false;
        }
      });
    },
    //提交添加客户余额提醒表格
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for (let item of this.accountIDList) {
            if (this.remindUserBalance.userName === item.userName) {
              this.remindUserBalance.accountID = item.accountID;
            }
          }
          this.dialogFormVisible = false;
          let self = this;
          this.postRequest("admin/saveAddRemindUserBalance", {
            remindUserBalance: this.remindUserBalance
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.data);
              self.checkData();
              self.remindUserBalance = {
                userName: "",
                balance: "",
                mobiles: "",
                accountID: ""
              };
            } else {
              self.failed(res.data.data);
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.remindUserBalance = {};
      this.dialogFormVisible = false;
      this.modifyDataVisible = false;
    },
    addRemindUserBalance() {
      this.dialogFormVisible = true;
      let self = this;
      this.postRequest("admin/addRemindUserBalance", null).then(res => {
        for (let item of res.data.data.customerList) {
          self.options.push({
            value: item.userName,
            index: self.index,
            id: item.id
          });
          self.accountIDList.push({
            accountID: item.accountID,
            userName: item.userName
          });
          self.index++;
        }
      });
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    checkData() {
      this.tableData = [];
      this.loading = true;
      let self = this;
      this.postRequest("admin/listRemindUserBalance", {
        userName: this.userName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.rublist) {
          self.tableData.push({
            index: self.index,
            userName: item.userName,
            createUserName: item.createUserName,
            createDate: item.createDate,
            balance: item.balance,
            mobiles: item.mobiles,
            id: item.id,
            accountID: item.accountID
          });
          self.index++;
        }
      });
    },
    cancel() {}
  },

  mounted() {
    this.checkData();
  }
};
</script>

<style scoped>
</style>
