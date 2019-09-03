<template>
  <div class="container">
    <el-button type="text" @click="addCodeFormFlag = true">+添加特服号</el-button>
    <!-- 添加特服号弹出框 -->
    <el-dialog title="添加特服号（一行一个，不能有空行）" :visible.sync="addCodeFormFlag">
      <el-form :model="addCodeForm" :rules="rules" ref="addCodeForm" label-width="120px">
        <el-form-item label="特服号：" :label-width="formLabelWidth" prop="code">
          <el-input type="textarea" v-model="addCodeForm.code" autocomplete="off" resize="both"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddCode('addCodeForm')">保存</el-button>
        <el-button @click="resetForm('addCodeForm')">取消</el-button>
      </div>
    </el-dialog>

    <!-- 修改弹出框 -->
    <el-dialog title="修改特服号" :visible.sync="updateCodeFlage">
      <el-form :model="updateCodeForm" :rules="rules" ref="updateCodeForm" label-width="120px">
        <el-form-item label="特服号：" prop="code">
          <el-input v-model="updateCodeForm.code" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveupdateCode('updateCodeForm')">保存</el-button>
        <el-button @click="resetForm('updateCodeForm')">取消</el-button>
      </div>
    </el-dialog>

    <el-form label-width="120px" inline="inline" v-on:keyup.enter.native="checkData">
      <el-form-item label="特服号：">
        <el-input  v-model="code"></el-input>
      </el-form-item>

      <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>

      <el-form-item label="主账号：">
        <el-input  v-model="pcnName"></el-input>
      </el-form-item>

      <el-form-item label="代理商：">
        <el-input  v-model="agentName"></el-input>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select v-model="status">
          <el-option
            v-for="item in options"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="updateCode(scope.row)">修改</el-button>
            <el-button type="text" @click="delCode(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="pcnName" label="主账号"></el-table-column>
        <el-table-column prop="agentName" label="代理商"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="statusCn" label="状态"></el-table-column>
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
      addCodeForm: {
        code: ""
      },
      updateCodeForm: {
        code: "",
        sourceCode: ""
      },
      rules: {
        code: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      addCodeFormFlag: false,
      updateCodeFlage: false,
      code: "",
      userName: "",
      pcnName: "",
      agentName: "",
      status: "",
      options: [
        {
          key: 0,
          label: "所有",
          value: ""
        },
        {
          key: 1,
          label: "可用",
          value: 1
        },
        {
          key: 2,
          label: "已用",
          value: 2
        }
      ],
      formLabelWidth: "120px",
      index: 0,
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      tableData: [],
      checkIn: false,
      loading: false
    };
  },
  methods: {
    //   操作成功提示
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    // 操作失败提示
    failed(message) {
      this.$message.error(message);
    },
    //保存添加特服号
    saveAddCode(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addCodeFormFlag = false;
          let self = this;
          this.postRequest("/admin/saveAddCode", {
            code: this.addCodeForm.code
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.resultMsg);
              self.checkData();
              self.addCodeForm = {};
            } else {
              self.failed(res.data.resultMsg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //修改特服号操作
    updateCode(row) {
      let self = this;
      this.updateCodeFlage = true;
      this.updateCodeForm = {
        code: row.code,
        sourceCode: ""
      };
      this.postRequest("/admin/updateCode", {
        code: row.code
      }).then(res => {
        
        self.updateCodeForm.sourceCode = res.data.data.code;
      });
    },
    //保存修改特服号
    saveupdateCode(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateCodeFlage = false;
          let self = this;
          this.postRequest("/admin/saveUpdateCode", {
            targetCode: this.updateCodeForm.code,
            sourceCode: this.updateCodeForm.sourceCode
          }).then(res => {
            // console.log(res)
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
    //取消表单提交
    resetForm(formName) {
      this.updateCodeFlage = false;
      this.addCodeForm = {};
      this.addCodeFormFlag = false;
    },
    //删除操作
    delCode(row) {
      let self = this;
      this.$confirm(`确定要删除：${row.code}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        self
          .postRequest("/admin/deleteCode", {
            code: row.code
          })
          .then(res => {
            if (res.data.success) {
              self.succeed(res.data.resultMsg);
              self.checkData();
            } else {
              self.failed(res.data.resultMsg);
            }
          });
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
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("/admin/listCode", {
        code: this.code,
        userName: this.userName,
        pcnName: this.pcnName,
        agentName: this.agentName,
        status: this.status,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            accountID: item.accountID,
            agentID: item.agentID,
            agentName: item.agentName,
            code: item.code,
            createtime: item.createtime,
            pcnID: item.pcnID,
            pcnName: item.pcnName,
            status: item.status,
            statusCn:
              item.status === 0 ? "所有" : item.status === 1 ? "可用" : "已用",
            userName: item.userName,
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
