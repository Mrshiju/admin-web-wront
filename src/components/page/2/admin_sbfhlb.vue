<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <!-- <el-form-item label="开始时间：">
        <el-date-picker type="datetime" v-model="fdate"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker type="datetime" v-model="tdate"></el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="100px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改</el-button>
            <el-button @click="del(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="账号"></el-table-column>
        <el-table-column label="网关提交失败">
          <template slot-scope="scope">{{scope.row.failGatewaySubmit?'是':'否'}}</template>
        </el-table-column>
        <el-table-column label="网关报告失败">
          <template slot-scope="scope">{{scope.row.failReportSubmit?'是':'否'}}</template>
        </el-table-column>
        <el-table-column prop="oper" label="操作人"></el-table-column>
        <el-table-column prop="opertime" label="操作时间"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
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
    <el-dialog title="修改信息" :visible.sync="modifyData.visible" width="500px">
      <el-form label-width="120px" style="width: 400px" :model="modifyData">
        <el-form-item label="客户账号：">
          <el-input v-model="modifyData.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="失败类型：">
          <el-checkbox v-model="modifyData.gateSubmitFail">网关提交失败</el-checkbox>
          <el-checkbox v-model="modifyData.gateReportFail">网关报告失败</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyData.visible=false">取消</el-button>
        <el-button type="primary" @click="submitModify">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "A",
  data() {
    return {
      sum: 0,
      index:0,
      pageSize: 30,
      pageNum: 1,
      checkIn: true,
      loading: false,
      tableData: [],
      userName: "",
      fdate: new Date(),
      tdate: new Date(),
      modifyData: {
        visible: false,
        accountID: "",
        userName: "",
        gateSubmitFail: false,
        gateReportFail: false
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
      this.postRequest("admin/listFailRefund", {
        userName: this.userName,
        // fdate: this.formatDate2(this.fdate),
        // tdate: this.formatDate2(this.tdate)
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            id: item.id,
            index:self.index,
            accountID: item.accountID,
            userName: item.userName,
            // failPlatformSubmit: item.failPlatformSubmit,
            failGatewaySubmit: item.failGatewaySubmit === 1,
            failReportSubmit: item.failReportSubmit === 1,
            createtime: item.createtime,
            oper: item.oper,
            opertime: item.opertime
          });
          self.index++
        }
      });
    },
    modify(row) {
      let self = this;
      this.modifyData.visible = true;
      this.postRequest("admin/updateFailRefund", {
        accountID: row.accountID
      }).then(res => {
        self.modifyData = {
          visible: true,
          accountID: res.data.data.failRefund.accountID,
          userName: res.data.data.failRefund.userName,
          gateSubmitFail: res.data.data.failRefund.failGatewaySubmit === 1,
          gateReportFail: res.data.data.failRefund.failReportSubmit === 1
        };
      });
    },
    submitModify() {
      let self = this;
      this.postRequest("admin/saveUpdatefailrefund", {
        accountID: this.modifyData.accountID,
        userName: this.modifyData.userName,
        gateSubmitFail: this.modifyData.gateSubmitFail ? 1 : 0,
        gateReportFail: this.modifyData.gateReportFail ? 1 : 0
      }).then(res => {
        self.checkData();
        self.modifyData.visible = false;
        self.resAlert(res.data);
      });
    },
    del(row) {
      let self = this;
      this.$confirm("确认删除【" + row.userName + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deleteFailRefund", {
            accountID: row.accountID
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
</style>
