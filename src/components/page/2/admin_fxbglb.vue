<template>
  <div class="container">
    <el-form label-width="120px" inline="inline" v-on:keyup.enter.native="checkData">
      <el-form-item label="任务编号：">
        <el-input  v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="短信内容：">
        <el-input  v-model="content"></el-input>
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
      <el-form-item label="开始时间：">
        <el-date-picker type="date" v-model="fymdhms"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker type="date" v-model="tymdhms"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
        <el-button type="primary" plain>导出</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column prop="mobile" label="发送号码"></el-table-column>
        <el-table-column prop="content" label="短信内容"></el-table-column>
        <el-table-column prop="count" label="条数"></el-table-column>
        <el-table-column prop="seqid" label="seqid"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="operaName" label="运营商"></el-table-column>
        <el-table-column prop="gateway" label="网关编号"></el-table-column>
        <el-table-column prop="createtime" label="提交时间"></el-table-column>
        <el-table-column prop="returntime" label="报告时间"></el-table-column>
        <el-table-column prop="receivetime" label="更正状态"></el-table-column>
        <el-table-column prop="errorcode" label="网关代码"></el-table-column>
        <el-table-column prop="mmdd" label="耗时时间（秒）"></el-table-column>
      </el-table>
      <el-pagination
        class="fr"
        style="margin:10px 0"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="pageNum"
        :page-size.sync="pageSize"
         layout="sizes, prev, pager, next, jumper"
        :total="1000"
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
      content: "",
      fymdhms: new Date(),
      tymdhms: new Date(),
      gateway: "",
      mobile: "",
      pageNum: 1,
      pageSize: 30,
      seqId: "",
      userName: "",
      checkIn: false,
      sum: "",
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
      this.postRequest("admin/listGatewaySend", {
        cid: this.cid,
        content: this.content,
        fymdhms: this.formatDate(this.fymdhms),
        tymdhms: this.formatDate(this.tymdhms),
        gateway: this.gateway,
        mobile: this.mobile,
        seqId: this.seqId,
        userName: this.userName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.loading = false;
        self.sum = res.data.data.data.length;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            userName: item.userName,
            cid: item.cid,
            mobile: item.mobile,
            content: item.content,
            count: item.count,
            seqid: item.seqid,
            status: item.status,
            operaName: item.operaName,
            gateway: item.gateway,
            createtime: item.createtime,
            returntime: item.returntime,
            receivetime: item.receivetime,
            errorcode: item.errorcode,
            mmdd: item.mmdd
          });
          self.index++;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
