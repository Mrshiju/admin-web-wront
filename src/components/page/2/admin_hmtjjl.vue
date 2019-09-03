<template>
  <div class="container">
    <el-form label-width="100px" :inline="true" v-on:keyup.enter.native="checkData">
      <el-form-item label="任务编号：">
        <el-input v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="号码：">
        <el-input v-model="mobile"></el-input>
      </el-form-item>
      <el-form-item label="任务类型：">
        <el-select v-model="mobileType">
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
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column prop="mobile" label="号码"></el-table-column>
        <el-table-column prop="content" label="短信内容"></el-table-column>
        <el-table-column prop="cnMobileType" label="号码类型"></el-table-column>
        <el-table-column prop="operaName" label="运营商"></el-table-column>
        <el-table-column prop="createtime" label="提交时间"></el-table-column>
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
      mobile: "",
      fmmdd: new Date(),
      tmmdd: new Date(),
      pageNum: 1,
      pageSize: 30,
      mobileType: 1,
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
          label: "正常"
        },
        {
          value: 3,
          label: "白名单"
        },
        {
          value: 4,
          label: "黑名单"
        },
        {
          value: 5,
          label: "shield"
        },
        {
          value: 6,
          label: "小时限制"
        },
        {
          value: 7,
          label: "单日限制"
        },
        {
          value: 8,
          label: "模板限制"
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
      this.postRequest("admin/listMobileSubmit", {
        cid: this.cid,
        mobile: this.mobile,
        fmmdd: this.formatDate(this.fmmdd),
        tmmdd: this.formatDate(this.tmmdd),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        mobileType: this.mobileType,
        userName: this.userName
      }).then(res => {
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.table.push({
            userName: item.userName,
            cid: item.cid,
            content: item.content,
            mobile: item.mobile,
            cnMobileType: item.cnMobileType,
            mobileCount: item.mobileCount,
            operaName: item.operaName,
            createtime: item.createtime
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
