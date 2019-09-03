<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="网关名：">
        <el-select v-model="gateway" filterable>
          <el-option
            v-for="item in gatewayList"
            :key="item.id"
            :label="item.lebal"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间：">
        <el-date-picker v-model="fmmdd" type="datetime"></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间：">
        <el-date-picker v-model="tmmdd" type="datetime"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="gateway" label="网关编号"></el-table-column>
        <el-table-column prop="gatewayName" label="网关名称"></el-table-column>
        <el-table-column prop="submitSuccess" label="提交成功数"></el-table-column>
        <el-table-column prop="submitFailed" label="提交失败数"></el-table-column>
        <el-table-column prop="reportSuccess" label="报告成功数"></el-table-column>
        <el-table-column prop="reportFailed" label="报告失败数"></el-table-column>
        <el-table-column prop="submitSuccessRate" label="提交成功率"></el-table-column>
        <el-table-column prop="reportSuccessRate" label="报告成功率"></el-table-column>
        <el-table-column prop="reportReturnRate" label="提交返回率"></el-table-column>
        <el-table-column prop="created" label="检测时间"></el-table-column>
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
  name: "admin_wgzllb",
  data() {
    return {
      gatewayList: [
        {
          id: "allGateway",
          lebal: "所有",
          value: ""
        }
      ],
      gateway: "",
      index: 0,
      fmmdd: new Date(),
      tmmdd: new Date(),
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      tableData: [],
      checkIn: true,
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
      this.postRequest("admin/listGatewayQuality", {
        gateway: this.gateway,
        fmmdd: this.formatDate2(this.fmmdd),
        tmmdd: this.formatDate2(this.tmmdd)
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.gqvList) {
          self.tableData.push({
            index: self.index,
            gateway: item.gateway,
            gatewayName: item.gatewayName,
            submitSuccess: item.submitSuccess,
            submitFailed: item.submitFailed,
            reportSuccess: item.reportSuccess,
            reportFailed: item.reportFailed,
            submitSuccessRate: item.submitSuccessRate,
            reportSuccessRate: item.reportSuccessRate,
            reportReturnRate: item.reportReturnRate,
            created: item.created,
            id: item.id
          });
          self.index++;
        }
      });
    }
  },
  mounted() {
    let self = this;
    this.postRequest("admin/listGatewayQuality", {
      gateway: this.gateway,
      fmmdd: this.fmmdd,
      tmmdd: this.tmmdd
    }).then(res => {
      for (let item of res.data.data.gatewayList) {
        if (!self.gatewayList[item.gatewayname]) {
          self.gatewayList.push({
            id: item.id,
            lebal: item.gatewayname,
            value: item.gateway
          });
        }
      }
    });
  }
};
</script>

<style scoped>
</style>
