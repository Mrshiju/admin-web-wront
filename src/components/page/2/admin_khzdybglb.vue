<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px">
      <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 修改信息操作弹出框 -->
    <el-dialog title="修改自定义报告" :visible.sync="modifyDataVisible">
      <el-form :model="userReportDefined" :rules="rules" ref="userReportDefined" label-width="120px">
        <el-form-item label="用户名：" :label-width="formLabelWidth">
          <el-select v-model="userReportDefined.userName">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="调整比例：" :label-width="formLabelWidth" prop="definedProportion">
          <el-input v-model="userReportDefined.definedProportion" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" v-model="userReportDefined.remark"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('userReportDefined')">添加</el-button>
        <el-button @click="resetForm('userReportDefined')">取消</el-button>
      </div>
    </el-dialog>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column prop="index" label="序号"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="changeStatus(scope.row)"
            >{{scope.row.status === 1?"禁用":"启用"}}</el-button>
            <el-button type="text" @click="modifyData(scope.row)">修改信息</el-button>
            <el-button type="text" @click="deleteDate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="definedProportion" label="调整比例"></el-table-column>

        <el-table-column prop="cnStatus" label="状态"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="createdUserName" label="创建人"></el-table-column>
        <el-table-column prop="modifyUserName" label="修改人"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间"></el-table-column>
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
  data() {
    return {
      userReportDefined: {},
      modifyDataVisible: false,
      rules: {
        definedProportion: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      },
      formLabelWidth: "120px",
      options: [],
      customerList: [],
      userName: "",
      index: 0,
      sum: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: false,
      loading: false,
      tableData: []
    };
  },
  methods: {
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    failed(message) {
      this.$message.error(message);
    },
    //禁用、启用操作
    changeStatus(row) {

      let self = this;
      this.$confirm(
        `此操作将${row.status === 1 ? "禁用" : "启用"}用户：${
          row.userName
        } 的自定义报告, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self
            .postRequest("admin/changeUserReportDefinedStatus", {
              id: row.id,
              status: row.status === 1 ? 0 : 1
            })
            .then(res => {

              if (res.data.success) {
                self.succeed(res.data.data);
                self.checkData();
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
            .postRequest("admin/deleteUserReportDefined", {
              id: row.id
            })
            .then(res => {
 
              if (res.data.success) {
                self.checkData();
                self.succeed(res.data.data);
              } else {
                self.failed(res.data.data);
              }
            });
        })
        .catch(() => {});
    },
    //修改操作
    modifyData(row) {
      this.userReportDefined = {
        definedProportion: parseInt(row.definedProportion),
        remark: row.remark,
        userName: row.userName,
        id:row.id
      };
      this.options = [];
      this.modifyDataVisible = true;
      let self = this;

      this.postRequest("admin/updateUserReportDefined", {
        id: row.id
      }).then(res => {

        for (let item of res.data.data.customerList) {
          this.options.push({
            value: item.userName,
            id: item.id,
            label: item.userName
          });
          this.customerList.push({
            userName: item.userName,
            accountID: item.accountID
          });
        }
      });
    },
    //保存修改
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for (let item of this.customerList) {
            if (item.userName === this.userReportDefined.userName) {
              this.userReportDefined.accountID = item.accountID;
            }
          }
          this.modifyDataVisible = false;
          let self = this;
          this.postRequest("admin/saveUpdateUserReportDefined", {
            userReportDefined: this.userReportDefined
          }).then(res => {

            if (res.data.success) {
              self.succeed(res.data.data);
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
    resetForm(formName) {
      this.modifyDataVisible = false;
    },
    handleSizeChange() {
      // this.tableData = [];
      this.checkData();
    },
    handlePageChange() {
      // this.tableData = [];
      this.checkData();
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listUserReportDefined", {
        userName: this.userName,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.userRdList) {
          self.tableData.push({
            userName: item.userName,
            definedProportion: item.definedProportion
              ? `${item.definedProportion}%`
              : 0,
            cnStatus: item.cnStatus,
            status: item.status,
            remark: item.remark,
            createdUserName: item.createdUserName,
            modifyUserName: item.modifyUserName,
            modifyTime: item.modifyTime,
            index: self.index,
            id: item.id
          });
          self.index++;
        }
      });
    }
  },
  mounted() {
    this.checkData();
  }
};
</script>

<style scoped>
</style>
