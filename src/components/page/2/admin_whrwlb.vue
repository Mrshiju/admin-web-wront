<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="批次号：">
        <el-input  v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="外呼任务编号：">
        <el-input  v-model="taskId"></el-input>
      </el-form-item>
      <el-form-item label="模板编号：">
        <el-input  v-model="tid"></el-input>
      </el-form-item>
      <el-form-item label="外呼号码：">
        <el-input  v-model="mobile"></el-input>
      </el-form-item>
      <el-form-item label="网关编号：">
        <el-input  v-model="gatewayId"></el-input>
      </el-form-item>
      <el-form-item label="客户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>

      <el-form-item label="开始时间：">
       <el-date-picker v-model="startDate" type="date"></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间：">
       <el-date-picker v-model="endDate" type="date"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="cid" label="批次号"></el-table-column>
        <el-table-column prop="taskId" label="外呼任务编号"></el-table-column>
        <el-table-column prop="serviceId" label="模板编号"></el-table-column>
        <el-table-column prop="templetName" label="模板名称"></el-table-column>
        <el-table-column prop="mobile" label="外呼号码"></el-table-column>
        <el-table-column prop="gatewayId" label="网关编号"></el-table-column>
        <el-table-column prop="userName" label="客户名"></el-table-column>
        <el-table-column prop="submitTime" label="提交时间"></el-table-column>
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
  name: "admin_fxbglb",
  data() {
    return {
      index:0,
      startDate:new Date(),
      endDate:new Date(),
      cid: "",
      taskId: "",
      tid: "",
      templetName: "",
      mobile: "",
      gatewayId: "",
      userName: "",
      submitTime: "",
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
      
      this.postRequest('admin/calltasklist',{
         cid: this.cid,
          taskId: this.taskId,
          tid: this.tid,
          templetName: this.templetName,
          mobile: this.mobile,
          gatewayId: this.gatewayId,
          userName: this.userName,
          submitTime: this.submitTime,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          startDate: this.formatDate(this.startDate),
          endDate: this.formatDate(this.endDate)
      }).then(res => {
        console.log(res);
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.data.length;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            cid: item.cid,
            taskId: item.task_id,
            serviceId: item.service_id,
            templetName: item.templet_name,
            mobile: item.mobile,
            gatewayId: item.gateway_id,
            userName: item.username,
            submitTime: item.submittime
          });
          self.index++;
        }
      });
    },
    cancel() {}
  },
};
</script>

<style scoped>
</style>
