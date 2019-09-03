<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="通道编号">
        <el-input  v-model="gateway"></el-input>
      </el-form-item>
      <el-form-item label="起始日">
        <el-date-picker v-model="dayStart" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="截止日">
        <el-date-picker v-model="dayEnd" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="按月">
        <el-date-picker v-model="month" type="month" placeholder="选择月"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="exportData">+导出</el-button>
      <div class="dataWrap">
        <span class="count">
          网关提交数：
          <span class="data">{{submitSum}}</span>
        </span>
        <span class="count">
          提交成功数：
          <span class="data">{{submitSucSum}}</span>
        </span>
        <span class="count">
          报告成功数：
          <span class="data">{{reportSucSum}}</span>
        </span>
        <span class="count">
          报告未知数：
          <span class="data">{{reportUnknowSum}}</span>
        </span>
      </div>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="gateway" label="通道编号"></el-table-column>
        <el-table-column prop="gatewayName" label="通道名称"></el-table-column>
        <el-table-column prop="submitSum" label="网关提交数"></el-table-column>
        <el-table-column prop="submitSuccess" label="提交成功数"></el-table-column>
        <el-table-column prop="submitFailed" label="提交失败数"></el-table-column>
        <el-table-column prop="submitSuccessRate" label="提交成功率"></el-table-column>
        <el-table-column prop="reportSum" label="网关报告数"></el-table-column>
        <el-table-column prop="reportSuccess" label="报告成功"></el-table-column>
        <el-table-column prop="reportFailed" label="报告失败"></el-table-column>
        <el-table-column prop="reportUnknow" label="报告未知"></el-table-column>
        <el-table-column prop="reportSuccessRate" label="报告成功率"></el-table-column>
        <el-table-column prop="reportReturnRate" label="报告返回率"></el-table-column>
        <el-table-column prop="statDay" label="统计时间"></el-table-column>
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
      submitSum: 0,
      submitSucSum: 0,
      reportSucSum: 0,
      reportUnknowSum: 0,
      gateway: "",
      dayStart: new Date(),
      dayEnd: new Date(),
      month: new Date(),
      isFirst: false,
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
    // 导出数据操作
    exportData() {
      let self = this;
      this.postRequest("/admin/exportGatewaySubmitDayReport", {
        gateway: this.gateway,
        dayStart: this.formatDate(this.dayStart),
        dayEnd: this.formatDate(this.dayEnd),
        month: this.formatDate(this.month),
        isFirst: this.isFirst,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        if (res.data.success) {
          self.succeed();
        } else {
          self.failed();
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
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("/admin/listGatewaySubmitDayReport", {
        gateway: this.gateway,
        dayStart: this.formatDate(this.dayStart),
        dayEnd: this.formatDate(this.dayEnd),
        month: this.formatDate(this.month),
        isFirst: this.isFirst,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        self.submitSum = res.data.data.commonSum.submitSum;
        self.submitSucSum = res.data.data.commonSum.submitSucSum;
        self.reportSucSum = res.data.data.commonSum.reportSucSum;
        self.reportUnknowSum = res.data.data.commonSum.reportUnknowSum;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            id: item.id,
            gateway: item.gateway,
            gatewayName: item.gatewayName,
            submitSum: item.submitSum,
            submitSuccess: item.submitSuccess,
            submitFailed: item.submitFailed,
            submitSuccessRate: item.submitSuccessRate
              ? (item.submitSuccessRate * 100).toFixed(4) + "%"
              : 0,
            reportSum: item.reportSum,
            reportSuccess: item.reportSuccess,
            reportFailed: item.reportFailed,
            reportUnknow: item.reportUnknow,
            reportSuccessRate: item.reportSuccessRate
              ? (item.reportSuccessRate * 100).toFixed(4) + "%"
              : 0,
            reportReturnRate: item.reportReturnRate
              ? (item.reportReturnRate * 100).toFixed(4) + "%"
              : 0,
            statDay: item.statDay,
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
.dataWrap {
  float: right;
}
.dataWrap::after {
  content: "";
  clear: both;
}
.count {
  font-size: 14px;
  color: #606266;
}
.data {
  font-size: 14px;
  color: red;
}
</style>
