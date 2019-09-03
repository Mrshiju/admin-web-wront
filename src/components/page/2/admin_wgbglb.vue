<template>
  <div class="container">
    <el-form label-width="120px" inline="inline" v-on:keyup.enter.native="checkData">
      <el-form-item label="任务编号：">
        <el-input  v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="发送号码：">
        <el-input  v-model="mobile"></el-input>
      </el-form-item>
      <el-form-item label="网关编号：">
        <el-input  v-model="gateway"></el-input>
      </el-form-item>
      <el-form-item label="seqid：">
        <el-input  v-model="seqId"></el-input>
      </el-form-item>
      <el-form-item label="网关报告：">
        <el-select v-model="status">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间：">
        <el-date-picker type="date" v-model="fmmdd"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker type="date" v-model="tmmdd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column prop="mobile" label="发送号码"></el-table-column>
        <el-table-column prop="seqid" label="seqid"></el-table-column>
        <el-table-column prop="status" label="网关报告"></el-table-column>
        <el-table-column prop="operaid" label="运营商"></el-table-column>
        <el-table-column prop="cid" label="网关编号"></el-table-column>
        <el-table-column prop="returntime" label="报告时间"></el-table-column>
        <el-table-column prop="receivetime" label="接收时间"></el-table-column>
        <el-table-column prop="status" label="更正状态"></el-table-column>
        <el-table-column prop="statusj" label="网关代码"></el-table-column>
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
  name: "admin_fxbglb",
  data() {
    return {
      cid: "",
      index:0,
      fmmdd: new Date(),
      tmmdd: new Date(),
      gateway: "",
      mobile: "",
      pageNum: 1,
      pageSize: 30,
      seqId: "",
      userName: "",
      checkIn: false,
      sum: 0,
      tableData: [],
      status: 0,
      options: [
        {
          value: 0,
          label: "所有"
        },
        {
          value: 1,
          label: "发送成功"
        },
        {
          value: 2,
          label: "发送失败"
        }
      ]
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
      this.postRequest("admin/listGatewayReport", {
        cid: this.cid,
        fmmdd: this.formatDate(this.fmmdd),
        tmmdd: this.formatDate(this.tmmdd),
        gateway: this.gateway,
        mobile: this.mobile,
        seqId: this.seqId,
        userName: this.userName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: this.status
      }).then(res => {
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index:self.index,
            userName: item.userName,
            cid: item.cid,
            mobile: item.mobile,
            seqid: item.seqid,
            status: item.status,
            statusj: item.statusj,
            operaid: item.operaid,
            returntime: item.returntime,
            receivetime: item.receivetime
            //网关ID和任务ID分不清
          });
          self.index++
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
