<template>
  <div class="container">
    <el-form label-width="100px" :inline="true" v-on:keyup.enter.native="checkData">
      <el-form-item label="任务编号：">
        <el-input v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="短信内容：">
        <el-input v-model="content"></el-input>
      </el-form-item>
      <el-form-item label="任务类型：">
        <el-select v-model="rank">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form label-width="100px" :inline="true">
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
      <el-button @click="exportData" type="text">+导出</el-button>
      <el-table border ref="table" v-loading="loading" :data="table" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="serverNum" label="特服号"></el-table-column>
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column prop="content" label="短信内容"></el-table-column>
        <el-table-column prop="contentLen" label="内容长度"></el-table-column>
        <el-table-column prop="mobileCount" label="号码数"></el-table-column>
        <el-table-column prop="count" label="扣费条数"></el-table-column>
        <el-table-column prop="submittime" label="提交时间"></el-table-column>
        <el-table-column prop="definittime" label="定时时间"></el-table-column>
        <el-table-column prop="agentID" label="接收编号"></el-table-column>
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
  name: "admin_dxtjjl",
  data() {
    return {
      cid: "",
      index:0,
      content: "",
      fmmdd: new Date(),
      tmmdd: new Date(),
      pageNum: 1,
      pageSize: 30,
      rank: 1,
      userName: "",
      checkIn: false,
      loading: false,
      table: [],
      option: [
        {
          value: 1,
          label: "所有"
        },
        {
          value: 2,
          label: "测试任务"
        }
      ],
      // totalPage: 1000,
      sum: 0
    };
  },
  methods: {
    exportData() {},
    checkData() {
      let self = this;
      this.checkIn = true;
      this.table = [];
      this.postRequest("admin/listSmsSubmit", {
        cid: this.cid,
        content: this.content,
        fmmdd: this.formatDate(this.fmmdd),
        tmmdd: this.formatDate(this.tmmdd),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        rank: this.rank,
        userName: this.userName
      }).then(res => {
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        // self.totalPage = res.data.data.page.totalPage;
        for (let item of res.data.data.data) {
          self.table.push({
            index: self.index,
            userName: item.userName,
            serverNum: item.serverNum,
            cid: item.cid,
            content: item.content,
            contentLen: item.contentLen,
            mobileCount: item.mobileCount,
            count: item.count,
            submittime: item.submittime,
            definittime: item.definittime,
            agentID: item.agentID
          });
        }
      });
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    }
  }
};
</script>

<style scoped>
</style>
