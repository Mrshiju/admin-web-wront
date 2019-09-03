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
      <el-form-item label="网关列表：">
        <el-input v-model="gateway"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="hassend">
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
      <el-form-item label="时间：">
        <el-date-picker type="date" v-model="fmmdd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <!--<el-button @click="exportData" type="text">+导出</el-button>-->
      <el-table border  ref="table" v-loading="loading" :data="table" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="serverNum" label="特服号"></el-table-column>
        <el-table-column prop="content" label="短信内容"></el-table-column>
        <el-table-column prop="count" label="号码数"></el-table-column>
        <el-table-column prop="operaName" label="切分条数"></el-table-column>
        <el-table-column prop="operaName" label="扣费数"></el-table-column>
        <el-table-column prop="gateway" label="网关编号"></el-table-column>
        <el-table-column prop="operaid" label="运营商"></el-table-column>
        <el-table-column prop="rank" label="状态"></el-table-column>
        <el-table-column prop="submittime" label="提交时间"></el-table-column>
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
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  name: "admin_dxtjjl",
  data() {
    return {
      cid: "",
      index:0,
      content: "",
      fmmdd: new Date(),
      pageNum: 1,
      pageSize: 30,
      mobileType: 1,
      userName: "",
      checkIn: false,
      loading: false,
      gateway: "",
      hassend: -1,
      table: [],
      option: [
        {
          value: -1,
          label: "所有"
        },
        {
          value: 0,
          label: "未发生"
        },
        {
          value: 1,
          label: "已发送"
        }
      ],
      sum: 0
    };
  },
  methods: {
    exportData() {},
    checkData() {
      this.table = [];
      let self = this;
      this.checkIn = true;
      this.postRequest("admin/listSmsSend", {
        cid: this.cid,
        gateway: this.gateway,
        hassend: this.hassend,
        content: this.content,
        fmmdd: this.formatDate(this.fmmdd),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userName: this.userName
      }).then(res => {
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.table.push({
            index: self.index,
            userName: item.userName,
            cid: item.cid,
            content: item.content,
            mobile: item.mobile,
            cnMobileType: item.cnMobileType,
            mobileCount: item.mobileCount,
            operaName: item.operaName,
            submittime: item.submittime
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
