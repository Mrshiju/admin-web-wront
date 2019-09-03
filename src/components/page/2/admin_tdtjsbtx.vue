<template>
  <div class="container">
    <el-button type="text" @click="addRemind">+添加通道提交失败提醒</el-button>
    <!-- 添加通道提交失败提醒弹出框 -->
    <el-dialog title="添加通道提交失败提醒" :visible.sync="dialogFormVisible">
      <el-form
        :model="remindGatewayError"
        :rules="rules"
        ref="remindGatewayError"
        label-width="120px"
      >
        <el-form-item label="通道名称：">
          <el-select v-model="remindGatewayError.gatewayName">
            <el-option
              v-for="item in options"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="提醒阈值：" :label-width="formLabelWidth" prop="sendErrorCount">
          <el-input v-model="remindGatewayError.sendErrorCount" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="提醒邮箱：" :label-width="formLabelWidth" prop="mailUrl">
          <el-input
            type="textarea"
            autosize
            placeholder="邮箱之间请用英文逗号分割"
            v-model="remindGatewayError.mailUrl"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAdd('remindGatewayError')">保存</el-button>
        <el-button @click="cancelAdd('remindGatewayError')">取消</el-button>
      </div>
    </el-dialog>

    <!-- 修改信息操作弹出框 -->
    <el-dialog title="添加通道提交失败提醒" :visible.sync="modifyDataVisible">
      <el-form
        :model="remindGatewayError"
        :rules="rules"
        ref="remindGatewayError"
        label-width="120px"
      >
        <el-form-item label="通道名称：">
          <el-input placeholder="请输入内容" v-model="remindGatewayError.gatewayName" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="提醒阈值：" :label-width="formLabelWidth" prop="sendErrorCount">
          <el-input v-model="remindGatewayError.sendErrorCount" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="提醒邮箱：" :label-width="formLabelWidth" prop="mailUrl">
          <el-input
            type="textarea"
            autosize
            placeholder="邮箱之间请用英文逗号分割"
            v-model="remindGatewayError.mailUrl"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('remindGatewayError')">保存</el-button>
        <el-button @click="resetForm('remindGatewayError')">取消</el-button>
      </div>
    </el-dialog>

    <el-form label-width="120px" inline="inline" v-on:keyup.enter.native="checkData">
      <el-form-item label="通道名：">
        <el-input  v-model="gatewayName"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getData" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="oprations" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="changeStatus(scope.row)">{{scope.row.status?"启用":"禁用"}}</el-button>
            <el-button type="text" @click="modifyData(scope.row)">修改信息</el-button>
            <el-button type="text" @click="deleteDate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="gateway" label="通道编号"></el-table-column>
        <el-table-column prop="gatewayName" label="通道名称"></el-table-column>
        <el-table-column prop="sendErrorCount" label="提交失败提醒阈值
"></el-table-column>
        <el-table-column prop="mailUrl" label="邮箱地址"></el-table-column>
        <el-table-column prop="statusCn" label="状态"></el-table-column>
        <el-table-column prop="createUserName" label="创建人"></el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
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
      gatewayList: [],
      remindGatewayError: {
        gateway: "",
        gatewayName: "",
        sendErrorCount: "",
        mailUrl: "",
        id: ""
      },
      rules: {
        sendErrorCount: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        mailUrl: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,
      modifyDataVisible: false,
      gateway: "",
      gatewayName: "",
      sendErrorCount: "",
      mailUrl: "",
      status: "",
      createUserName: "",
      createDate: "",
      index: 0,
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      tableData: [],
      checkIn: true,
      loading: false
    };
  },
  methods: {
    //修改表单操作
    modifyData(row) {
      this.remindGatewayError = {};
      let self = this;
      this.modifyDataVisible = true;
      this.remindGatewayError.gateway = row.gateway;
      this.remindGatewayError.gatewayName = row.gatewayName;
      this.remindGatewayError.sendErrorCount = row.sendErrorCount;
      this.remindGatewayError.mailUrl = row.mailUrl;
      this.postRequest("admin/updateRemindGatewayError", {
        gateway: row.gateway
      }).then(res => {
        self.remindGatewayError.id = res.data.data.remindGatewayError.id;
      });
    },
    //删除操作
    deleteDate(row) {
      let self = this;
      this.$confirm(
        `此操作将删除通道提交失败：${row.gatewayName} 的提醒 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self
            .postRequest("admin/deleteRemindGatewayError", {
              id: row.id
            })
            .then(res => {
              if (res.data.success) {
                this.succeed(res.data.data);
                this.getData();
              } else {
                this.failed(res.data.data);
              }
            });
        })
        .catch(() => {});
    },
    //禁用/启用操作
    changeStatus(row) {
      let self = this;
      this.$confirm(`此操作将禁用网关：${row.gatewayName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/changeGatewayErrorStatus", {
              id: row.id,
              status: row.status === 1 ? 0 : 1
            })
            .then(res => {
              if (res.data.success) {
                self.succeed(res.data.data);
                self.getData();
                for (let item of self.tableData) {
                  return;
                }
              } else {
                self.failed(res.data.data);
              }
            });
        })
        .catch(() => {});
    },
    //修改操作表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.modifyDataVisible = false;
          let self = this;
          this.postRequest("admin/saveUpdateRemindGatewayError", {
            remindGatewayError: this.remindGatewayError
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.data);
              self.getData();
            } else {
              self.failed(res.data.data);
            }
          });
        } else {
          return false;
        }
      });
    },
    //修改操作表单取消提交
    resetForm(formName) {
      this.modifyDataVisible = false;
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
    //提交添加通道提交失败提醒表单
    saveAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          for (let item of this.gatewayList) {
            if (this.remindGatewayError.gatewayName === item.gatewayname) {
              this.remindGatewayError.gateway = item.gateway;
            }
          }
          let self = this;
          this.postRequest("admin/saveAddRemindGatewayError", {
            remindGatewayError: this.remindGatewayError
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.data);
              self.getData();
            } else {
              self.failed(res.data.resultMsg);
            }
          });
          this.remindGatewayError = {
            gateway: "",
            gatewayName: "",
            sendErrorCount: "",
            mailUrl: "",
            id: ""
          };
        } else {
          return false;
        }
      });
    },
    cancelAdd(formName) {
      this.dialogFormVisible = false;
      this.remindGatewayError = {
        gateway: "",
        gatewayName: "",
        sendErrorCount: "",
        mailUrl: "",
        id: ""
      };
    },
    addRemind() {
      this.dialogFormVisible = true;
      let self = this;
      this.postRequest("admin/addRemindGatewayError", null).then(res => {
        self.gatewayList = res.data.data.gatewayList;
        for (let item of res.data.data.gatewayList) {
          if (item.gatewayname) {
            self.options.push({
              value: item.gatewayname,
              label: `${item.gateway}_${item.gatewayname}`,
              index: self.index
            });
          }
          self.index++;
        }
      });
    },
    handleSizeChange() {
      this.getData();
    },
    handlePageChange() {
      this.getData();
    },
    getData() {
      this.tableData = [];
      this.loading = true;
      let self = this;
      this.postRequest("admin/listRemindGatewayError", {
        gateway: this.gateway,
        gatewayName: this.gatewayName,
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
            gateway: item.gateway,
            gatewayName: item.gatewayName,
            sendErrorCount: item.sendErrorCount,
            mailUrl: item.mailUrl,
            status: item.status,
            statusCn: item.status === 0 ? "启用" : "禁用", //0:启用;1:禁用
            createUserName: item.createUserName,
            createDate: item.createDate,
            createAccountID: item.createAccountID,
            id: item.id
          });
          self.index++;
        }
      });
    },
    cancel() {}
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped>
</style>
