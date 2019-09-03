<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="任务编号：">
        <el-input  v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="号码：">
        <el-input  v-model="mobile"></el-input>
      </el-form-item>

      <el-form-item label="网关编号：">
        <el-input  v-model="gateway"></el-input>
      </el-form-item>

      <el-form-item label="时间：">
       <el-date-picker v-model="fmmdd" type="date"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="mobile" label="号码"></el-table-column>
        <el-table-column prop="operaid" label="运营商"></el-table-column>
        <el-table-column prop="gateway" label="网关编号"></el-table-column>
        <el-table-column prop="sostatus" label="原始状态"></el-table-column>
        <el-table-column prop="mostatus" label="修改状态"></el-table-column>
        <el-table-column prop="count" label="拆分条数"></el-table-column>
        <el-table-column prop="receivetime" label="接收时间"></el-table-column>
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
      gateway: "",
      fmmdd: new Date(),
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
      this.postRequest("admin/listReportdefined", {
        cid: this.cid,
        userName: this.userName,
        mobile: this.mobile,
        gateway: this.gateway,
        fmmdd: this.formatDate(this.fmmdd),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.rdlList) {
          self.tableData.push({
            index: self.index,
            id: item.id,
            cid: item.cid,
            code: item.code,
            mobile: item.mobile,
            userName: item.userName,
            operaid: item.operaid,
            gateway: item.gateway,
            sostatus: item.sostatus,
            mostatus: item.mostatus,
            count: item.count,
            receivetime: item.receivetime
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
