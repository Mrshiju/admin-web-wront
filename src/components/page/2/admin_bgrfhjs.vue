<template>
  <div class="container">
    <el-form
      inline="inline"
      label-width="100px"
      :model="form"
      ref="form"
      :rules="rule"
      v-on:keyup.enter.native="checkData"
    >
     <el-form-item label="用户名：" prop="userName">
        <el-input  v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="网关编号：" prop="gatewayId">
        <el-input  v-model="form.gatewayId"></el-input>
      </el-form-item>
      <el-form-item label="日期：">
        <el-date-picker type="date" v-model="form.fdate"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="状态" prop="zt"></el-table-column>
        <el-table-column label="数量" prop="num"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "A",
  data() {
    return {
      sum: 0,
      currentSize: 30,
      currentPage: 1,
      checkIn: true,
      loading: false,
      form: {
        userName: "",
        gatewayId: "",
        fdate: new Date()
      },
      tableData: [],
      totalPage: 1000,
      rule: {
        gatewayId: {
          required: true,
          message: "请输入网关编号",
          trigger: "blur"
        }
      },
      options: [
        {
          value: 1,
          label: "成功"
        },
        {
          value: 0,
          label: "失败"
        }
      ]
    };
  },
  methods: {
    checkData() {
      this.tableData = [];
      let self = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.checkIn = true;
          this.loading = true;
          this.postRequest("admin/reportNumDayReturnSearch", {
            userName: this.form.userName,
            gatewayId: this.form.gatewayId,
            fdate: this.formatDate(this.form.fdate)
          }).then(res => {
            self.tableData = [];
            self.loading = false;
            self.tableData.push({
              num: res.data.data.num,
              zt: res.data.data.zt
            });
          });
        }
      });
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    getParams() {
      let routerParams = this.$route.query;
      this.cid = routerParams.cid;
      this.mobile = routerParams.mobile;
    }
  },
  watch: {
    $route: "getParams"
  }
};
</script>

<style scoped>
</style>
