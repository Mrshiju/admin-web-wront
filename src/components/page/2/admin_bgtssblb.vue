<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px">
      <el-form-item label="任务编号：">
        <el-input  v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input  v-model="mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column prop="index" label="序号"></el-table-column>
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="mobile" label="号码"></el-table-column>
        <el-table-column prop="errorCode" label="状态"></el-table-column>
        <el-table-column prop="gatewayName" label="网关名称"></el-table-column>
        <el-table-column prop="submitTime" label="提交时间"></el-table-column>
        <el-table-column prop="doneTime" label="接收时间"></el-table-column>
        <el-table-column prop="deliverTime" label="推送时间"></el-table-column>
        <el-table-column prop="repushTime" label="重推时间"></el-table-column>
        <el-table-column prop="repush" label="推送次数"></el-table-column>
        <el-table-column prop="cnrepushFlag" label="是否重推"></el-table-column>
        <el-table-column prop="errMsg" label="原因"></el-table-column>
        <el-table-column prop="cnsource" label="客户来源"></el-table-column>
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
      cid: "",
      userName: "",
      mobile: "",
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
      this.postRequest("admin/listReportFailed", {
        cid: this.cid,
        userName: this.userName,
        mobile: this.mobile,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.rfvList) {
          self.tableData.push({
            cid: item.cid,
            userName: item.userName,
            code: item.code,
            mobile: item.mobile,
            cnrepushFlag: item.cnrepushFlag,
            errorCode: item.errorCode,
            gatewayName: item.gatewayName,
            submitTime: item.submitTime,
            doneTime: item.doneTime,
            deliverTime: item.deliverTime,
            repushTime: item.repushTime,
            repush: item.repush,
            cnqueryFlag: item.cnqueryFlag,
            queryTime: item.queryTime,
            cnsource: item.cnsource,
            errMsg: item.errMsg,
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
