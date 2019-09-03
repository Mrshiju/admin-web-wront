<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" :model="userReportDefined" inline="inline" label-width="120px" :rules="rules" ref="userReportDefined">
      <el-form-item label="用户名：">
        <el-select v-model="userReportDefined.userName" filterable>
          <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="调整比例：" prop="definedProportion">
        <el-input  v-model="userReportDefined.definedProportion"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="userReportDefined.remark"></el-input>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('userReportDefined')">保存</el-button>
      <el-button @click="resetForm('userReportDefined')">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userReportDefined: {
        userName: "",
        accountID: "",
        definedProportion: "",
        remark: ""
      },
      rules: {
        definedProportion: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      },
      options: [],
      index: 0,
      sum: 0,
      pageSize: 30,
      pageNum: 1,
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
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postRequest("admin/saveAddUserReportDefined", {
            userReportDefined: this.userReportDefined
          }).then(res => {
            console.log(res);
            if (res.data.success) {
              self.succeed(res.data.data);
              self.userReportDefined = {}
            }else{
              self.failed(res.data.data)
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.resetSetItem('watchTagClose', this.$route.path);
      this.$router.push({ path: sessionStorage.getItem("mainPage") });
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
      this.options = [];
      let self = this;
      this.postRequest("admin/addUserReportDefined", {}).then(res => {

        for (let item of res.data.data.customerList) {
          self.options.push({
            id: item.id,
            label: item.userName,
            value: item.userName,
            accountID:item.accountID
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
