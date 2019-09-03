<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="批次号：">
        <el-input v-model="cid"></el-input>
      </el-form-item>

      <el-form-item label="用户名：">
        <el-input v-model="userName"></el-input>
      </el-form-item>

      <el-form-item label="开始时间：">
        <el-date-picker v-model="startDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间：">
        <el-date-picker v-model="endDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column prop="cid" label="批次号"></el-table-column>
        <el-table-column prop="cmgateway" label="移动网关"></el-table-column>
        <el-table-column prop="cmgatewayname" label="移动网关名称"></el-table-column>
        <el-table-column prop="cugateway" label="联通网关"></el-table-column>
        <el-table-column prop="cugatewayname" label="联通网关名称"></el-table-column>
        <el-table-column prop="ctgateway" label="电信网关"></el-table-column>
        <el-table-column prop="ctgatewayname" label="电信网关名称"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
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
  name: "admin_fsyhwg",
  data() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      cid: "",
      options: [],
      options1: [],
      label_level: 0,
      label_type: 0,
      userName: "",
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      index: 0,
      tableData: [],
      checkIn: false,
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
      let self = this;
      this.postRequest("admin/labelSendUserGatewayList", {
        // this.postRequest("admin/labelSendBatchList", {
        startDate: this.formatDate2(this.startDate),
        endDate: this.formatDate2(this.endDate),
        cid: this.cid,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userName: this.userName
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index =
          Number(res.data.data.page.pageNum - 1) *
            Number(res.data.data.page.pageSize) +
          1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.userGateways) {
          self.tableData.push({
            index: self.index,
            id: item.id,
            cid: item.cid,
            userName:item.userName,
            cmgateway: item.cmgateway,
            cmgatewayname: item.cmgatewayname,
            cugateway: item.cugateway,
            cugatewayname: item.cugatewayname,
            ctgateway: item.ctgateway,
            ctgatewayname: item.ctgatewayname,
            createtime: item.createtime
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


