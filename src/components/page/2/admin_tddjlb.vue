<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px">
      <el-form-item label="通道编号：">
        <el-input v-model="gatewayId"></el-input>
      </el-form-item>
      <el-form-item label="通道名称：">
        <el-input v-model="gatewayName"></el-input>
      </el-form-item>
      <el-form-item label="开始时间：">
       <el-date-picker type="date" v-model="fdate"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：">
       <el-date-picker type="date" v-model="tdate"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column prop="gateway" label="通道编号"></el-table-column>
        <el-table-column prop="gatewayname" label="通道名称"></el-table-column>
        <el-table-column prop="unitprice" label="单价（元）"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="updatetime" label="更新时间"></el-table-column>
      </el-table>
      <el-pagination
        class="fr"
        style="margin:10px 0"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="pageNum"
        :page-size.sync="pageSize"
         layout="sizes, prev, pager, next, jumper"
        :total="sum"
      ></el-pagination>
      <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "A",
  data() {
    return {
      gatewayId: "",
      gatewayName: "",
      fdate: "",
      tdate: "",
      sum: 0,
      index: 0,
      totalPage: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: true,
      loading: false,
      tableData: []
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
      this.postRequest("admin/listGatewayPrice", {
        gatewayId: this.gatewayId,
        gatewayName: this.gatewayName,
        fdate: this.formatDate(this.fdate),
        tdate: this.formatDate(this.tdate),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        self.totalPage = res.data.data.page.totalPage;
        for (let item of res.data.data.gps) {
          self.tableData.push({
            index: self.index,
            id: item.id,
            gateway: item.gateway,
            gatewayname: item.gatewayname,
            unitprice: item.unitprice,
            createtime: item.createtime,
            updatetime: item.updatetime
          });
          self.index++;
        }
      });
    }
  },
  mounted(){
  }
};
</script>

<style scoped>
</style>
