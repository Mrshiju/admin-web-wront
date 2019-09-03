<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="任务编号：">
        <el-input  v-model="cid"></el-input>
      </el-form-item>
       <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="短信内容：">
        <el-input  v-model="content"></el-input>
      </el-form-item>
      <el-form-item label="审核人：">
        <el-input  v-model="checker"></el-input>
      </el-form-item>
      <el-form-item label="审核结果：">
        <el-select v-model="checkStatus" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间：">
        <el-date-picker type="date" v-model="fmmdd" :picker-options="pickOptions"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker type="date" v-model="tmmdd" :picker-options="pickOptions"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="任务编号" prop="cid"></el-table-column>
        <el-table-column prop="createTime" label="提交时间"></el-table-column>
        <el-table-column width="300px" label="短信内容">
            <template slot-scope="scope">
                <span v-html="scope.row.content"></span>
            </template>
        </el-table-column>
        <el-table-column prop="contentLen" label="长度"></el-table-column>
        <el-table-column prop="pknumber" label="号码数"></el-table-column>
        <el-table-column prop="definitetime" label="定时时间"></el-table-column>
        <el-table-column label="网关路由" width="150px">
          <template slot-scope="scope">
            <!--slot官方文档-->
            <p>移动：{{scope.row.cmgateway}}</p>
            <p>联通：{{scope.row.cugateway}}</p>
            <p>电信：{{scope.row.ctgateway}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="cnCheckSource" label="来源"></el-table-column>
        <el-table-column prop="checker" label="审核人"></el-table-column>
        <el-table-column prop="checkTime" label="审核时间"></el-table-column>
        <el-table-column prop="cnCheckStatus" label="结果"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
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
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  name: "A",
  data() {
    return {
      sum: 0,
      index:0,
      currentSize: 30,
      currentPage: 1,
      checkIn: true,
      loading: false,
      totalPage: 1000,
      tableData: [],
      cid: "",
      userName: "",
      content: "",
      checker: "",
      checkStatus: "",
      fmmdd: new Date(),
      tmmdd: new Date(),
      options1: [
        {
          value: 1,
          label: "所有"
        },
        {
          value: 2,
          label: "通过"
        },
        {
          value: 3,
          label: "拒绝"
        }
      ],
      pickOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let one = 30 * 24 * 3600 * 1000;
          let Months = curDate - one;
          return time.getTime() > Date.now() || time.getTime() < Months;
        }
      }
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
      this.postRequest("admin/listCheckedSms", {
        pageNum: this.currentPage,
        pageSize: this.currentSize,
        fmmdd: this.formatDate(this.fmmdd),
        tmmdd: this.formatDate(this.tmmdd),
        checker: this.checker,
        checkStatus: this.checkStatus,
        cid: this.cid,
        content: this.content,
        userName: this.userName
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        self.totalPage = res.data.data.page.totalPage;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            userName: item.userName,
            cid: item.cid,
            createTime: item.createtime,
            content: item.content,
            contentLen: item.contentLen,
            pknumber: item.pknumber,
            definitetime: item.definitetime,
            checker: item.checker,
            checkSource: item.checkSource,
            checkTime: item.checktime,
            cnCheckStatus: item.cnCheckStatus,
            remark: item.remark,
            cmgateway: item.cmgateway,
            cugateway: item.cugateway,
            ctgateway: item.ctgateway,
            cnCheckSource: item.cnCheckSource
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
