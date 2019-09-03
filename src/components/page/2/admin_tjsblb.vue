<template>
  <div class="container">
    <el-form label-width="100px" inline="inline" size="mini" v-on:keyup.enter="chechData">
      <el-form-item label="任务编号：">
        <el-input v-model="cid"></el-input>
      </el-form-item>
       <el-form-item label="用户名：">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="号码：">
        <el-input v-model="mobile"></el-input>
      </el-form-item>
      <el-form-item label="短信内容：">
        <el-input v-model="content"></el-input>
      </el-form-item>
      <el-form-item label="网关编号：">
        <el-input v-model="gateway"></el-input>
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
      <!-- <el-button @click="exportData" type="text">+导出</el-button>//暂时不需要 -->
      <!-- <el-form inline="inline">
        <el-form-item label="选择网关：">
          <el-select v-model="chooseGateway" filterable>
            <el-option
              v-for="item in gatewayList"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="resend" type="primary" plain>批量重发</el-button>
        </el-form-item>
      </el-form> -->
      <el-table
        border
        ref="table"
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column prop="content" label="短信内容"></el-table-column>
        <el-table-column prop="mobile" label="号码"></el-table-column>
        <el-table-column prop="gateway" label="网关编号"></el-table-column>
        <el-table-column prop="operaName" label="运营商"></el-table-column>
        <el-table-column prop="errcode" label="错误码"></el-table-column>
        <el-table-column prop="err" label="错误信息"></el-table-column>
        <el-table-column prop="createtime" label="提交时间"></el-table-column>
      </el-table>
      <el-pagination
        class="fr"
        style="margin:10px 0"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="pageNum"
        :page-size.sync="PageSize"
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
  name: "admin_tjsblb",
  data() {
    return {
      sum: 0,
      pageNum: 1,
      PageSize: 30,
      checkIn: true,
      loading: false,
      tableData: [],
      fmmdd: new Date(),
      tmmdd: new Date(),
      mobile: "",
      content: "",
      gateway: "",
      userName: "",
      cid: "",
      chooseGateway: "",
      gatewayList: [],
      multipleSelection: ""
    };
  },
  methods: {
    // exportData() {

    // },
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
      this.gatewayList = [];
      let XXX = [];
      this.postRequest("admin/getGatewayList", { t: "" }).then(res => {
        self.gatewayList = [];
        for (let list in res.data.data) {
          for (let item of res.data.data[list]) {
            if (item.status === 1) {
              if (XXX.indexOf(item.gateway) === -1) {
                XXX.push(item.gateway);
                self.gatewayList.push({
                  value: item.gateway,
                  label: item.gatewayname
                });
              }
            }
          }
        }
      });
      self
        .postRequest("admin/listSubmitFailed", {
          fmmdd: self.formatDate(self.fmmdd),
          tmmdd: self.formatDate(self.tmmdd),
          pageNum: self.pageNum,
          pageSize: self.pageSize,
          mobile: self.mobile,
          content: self.content,
          gateway: self.gateway,
          userName: self.userName,
          cid: self.cid
        })
        .then(res => {
          self.tableData = [];
          self.sum = res.data.data.page.totalCount;
          self.loading = false;
          for (let item of res.data.data.data) {
            self.tableData.push({
              userName: item.userName,
              code: item.code,
              cid: item.cid,
              content: item.content,
              mobile: item.mobile,
              gateway: item.gateway,
              operaName: item.operaName,
              errcode: item.errcode,
              err: item.err,
              createtime: item.createtime
            });
          }
        });
    },
    resend() {
      let self = this;
      this.postRequest("admin/submitFailedRetry", {
        ids: this.multipleSelection,
        gateway: this.chooseGateway
      }).then(res => {
        if (res.data.success === true) self.$message.success(res.data.data);
        else self.$message.error(res.data.resultMsg);
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = "";
      for (let item of val) {
        this.multipleSelection = this.multipleSelection.concat(
          item.cid,
          "_",
          item.mobile,
          ","
        );
      }
      this.multipleSelection = this.multipleSelection.substr(
        0,
        this.multipleSelection.length - 1
      );
      // console.log(this.multipleSelection);
    }
  }
};
</script>

<style scoped>
</style>
