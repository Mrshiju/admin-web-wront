<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="按月份">
       <el-date-picker v-model="month" type="month" placeholder="选择月"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="callTaskSum" label="话单总数"></el-table-column>
        <el-table-column prop="talkTimeSum" label="通话时长"></el-table-column>
        <el-table-column prop="feeTimeSum" label="计费时长"></el-table-column>
        <el-table-column prop="statMonth" label="统计时间"></el-table-column>
        <el-table-column prop="created" label="创建时间"></el-table-column>
        <el-table-column prop="updated" label="更新时间"></el-table-column>
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
      userName: "",
      month: new Date(),
      isFirst: false,
      isInit: 1,
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
    succeed() {
      this.$message({
        message: "导出成功",
        type: "success"
      });
    },
    failed() {
      this.$message.error("导出失败");
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
      this.postRequest("/admin/callCustomerMonthSendList", {
        userName: this.userName,
        cid: this.cid,
        month: this.formatDate(this.month),
          
        isFirst: this.isFirst,
        isInit: this.isInit,
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
            id: item.id,
            userName: item.userName,
            cid: item.cid,
            callTaskSum: item.callTaskSum,
            talkTimeSum: item.talkTimeSum,
            feeTimeSum: item.feeTimeSum,
            userName: item.userName,
            statMonth: item.statMonth,
            created: item.created,
            updated: item.updated
          });
          self.index++;
        }
      });
    },
    cancel() {}
  }
};
</script>

<style scoped>
</style>
