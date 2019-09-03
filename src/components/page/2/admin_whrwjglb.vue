<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="批次号：">
        <el-input  v-model="cid"></el-input>
      </el-form-item>
       <el-form-item label="用户名：">
        <el-input  v-model="username"></el-input>
      </el-form-item>
      <el-form-item label="外呼任务编号：">
        <el-input  v-model="task_id"></el-input>
      </el-form-item>
      <el-form-item label="模板编号：">
        <el-input  v-model="service_id"></el-input>
      </el-form-item>
      <el-form-item label="外呼编号：">
        <el-input  v-model="mobile"></el-input>
      </el-form-item>
      <el-form-item label="网关编号：">
        <el-input  v-model="gateway_id"></el-input>
      </el-form-item>
      <el-form-item label="按键类型：">
        <el-select v-model="typekey" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交开始时间：">
        <el-date-picker type="date" v-model="startDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="提交结束时间：">
        <el-date-picker type="date" v-model="endDate"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column label="批次号" prop="cid"></el-table-column>
        <el-table-column prop="task_id" label="外呼任务编号"></el-table-column>
        <el-table-column prop="service_id" label="模板编号"></el-table-column>
        <el-table-column prop="templet_name" label="模板名称"></el-table-column>
        <el-table-column prop="gateway_id" label="网关编号"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="TYPEKEY" label="按键类型"></el-table-column>
        <el-table-column prop="submittime" label="任务提交时间"></el-table-column>
        <el-table-column label="呼叫标识" prop="CALLID"></el-table-column>
        <el-table-column label="外呼号码" prop="CALLEDNO"></el-table-column>
        <el-table-column prop="CALLBEGIN" label="呼叫开始时间"></el-table-column>
        <el-table-column prop="ANSWERTIME" label="应答时间"></el-table-column>
        <el-table-column prop="CALLEND" label="呼叫结束时间"></el-table-column>
        <el-table-column label="通话时长" prop="COMMUNICATETIME"></el-table-column>
        <el-table-column label="呼叫结果" prop="CALLRESULT"></el-table-column>
      </el-table>
      <div>
        <el-pagination
          class="fr"
          style="margin:10px 0"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page.sync="currentPage"
                    :page-size.sync="currentSize"
           layout="sizes, prev, pager, next, jumper"
          :total="sum"
        ></el-pagination>
        <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "A",
  data() {
    return {
      sum: 0,
      currentSize: 30,
      currentPage: 1,
      checkIn: true,
      loading: false,
      tableData: [],
      index: 1,
      startDate: new Date(),
      endDate: new Date(),
      cid: "",
      task_id: "",
      service_id: "",
      mobile: "",
      gateway_id: "",
      username: "",
      typekey: null,
      totalPage: 1000,
      options1: [
        {
          value: null,
          label: "所有"
        },
        {
          value: 0,
          label: "按键0"
        },
        {
          value: 1,
          label: "按键1"
        },
        {
          value: 2,
          label: "按键2"
        },
        {
          value: 3,
          label: "按键3"
        },
        {
          value: 4,
          label: "按键4"
        },
        {
          value: 5,
          label: "按键5"
        },
        {
          value: 6,
          label: "按键6"
        },
        {
          value: 7,
          label: "按键7"
        },
        {
          value: 8,
          label: "按键8"
        },
        {
          value: 9,
          label: "按键9"
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
      this.postRequest("admin/calltaskresultlist", {
        pageNum: this.currentPage,
        pageSize: this.currentSize,
        startDate: this.formatDate(this.startDate),
        endDate: this.formatDate(this.endDate),
        cid: this.cid,
        task_id: this.task_id,
        service_id: this.service_id,
        mobile: this.mobile,
        gateway_id: this.gateway_id,
        username: this.username,
        typekey: this.typekey
      }).then(res => {
        self.tableData = [];
        self.totalPage = res.data.data.page.totalPage;
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            cid: item.cid,
            task_id: item.task_id,
            service_id: item.service_id,
            templet_name: item.templet_name,
            gateway_id: item.gateway_id,
            username: item.username,
            TYPEKEY: item.TYPEKEY,
            submittime: item.submittime,
            CALLID: item.CALLID,
            CALLEDNO: item.CALLEDNO,
            CALLBEGIN: item.CALLBEGIN,
            ANSWERTIME: item.ANSWERTIME,
            CALLEND: item.CALLEND,
            COMMUNICATETIME: item.COMMUNICATETIME,
            CALLRESULT: item.CALLRESULT
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
