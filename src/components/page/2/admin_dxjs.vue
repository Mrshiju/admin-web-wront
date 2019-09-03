<template>
  <div class="container">
    <el-form inline="inline" label-width="100px" v-on:keyup.enter.native="checkData">
      <el-form-item label="任务编号：">
        <el-input v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="发送号码：">
        <el-input v-model="mobile"></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="网关编号：">
        <el-input v-model="gatewayId"></el-input>
      </el-form-item>
      <el-form-item label="网关报告：">
        <el-select v-model="report" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间：">
        <el-date-picker type="date" v-model="date1"></el-date-picker>
      </el-form-item>
      <el-form-item label="截止时间：">
        <el-date-picker type="date" v-model="date2"></el-date-picker>
      </el-form-item>

      <el-form-item label="号码类型：">
        <el-select v-model="mobileType" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营商：">
        <el-select v-model="operaid" placeholder="请选择">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="客户提交：">
        <el-select v-model="submitRes" placeholder="请选择">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信内容：">
        <el-input v-model="content"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button @click="exp" type="text">+导出</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column prop="index" label="序号"></el-table-column>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button type="text" @click="detail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column label="短信内容" prop="content" height="40px">
          <template slot-scope="scope">
            <div v-html="scope.row.content" height="40px"></div>
          </template>
        </el-table-column>
        <el-table-column label="发送号码" prop="mobile"></el-table-column>
        <el-table-column label="运营商" prop="operaName" width="50"></el-table-column>
        <el-table-column label="号码类型" prop="mobileType" width="50"></el-table-column>
        <el-table-column label="拆分条数" prop="splitCount" width="50"></el-table-column>
        <el-table-column label="网关编号" prop="gatewayId"></el-table-column>
        <el-table-column label="网关报告">
          <template slot-scope="scope">
            <span v-html="scope.row.gatewayReport"></span>
          </template>
        </el-table-column>
        <el-table-column label="客户提交" prop="userSubmitTime"></el-table-column>
        <el-table-column label="报告时间" prop="gatewayReportTime"></el-table-column>
        <el-table-column label="信息" prop="resMsg"></el-table-column>
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
      index: 0,
      checkIn: true,
      loading: false,
      tableData: [],
      cid: "",
      userName: "",
      mobile: "",
      gatewayId: "",
      content: "",
      date1: new Date(),
      date2: new Date(),
      currentSize: 30,
      currentPage: 1,
      totalPage: 1000,
      options1: [
        {
          value: "",
          label: "所有"
        },
        {
          value: "ACCEPTD",
          label: "提交成功"
        },
        {
          value: "REJECTD",
          label: "提交失败"
        },
        {
          value: "DELIVRD",
          label: "发送成功"
        },
        {
          value: "UNDELIV",
          label: "发送失败"
        },
        {
          value: "UNKNOWN",
          label: "状态未知"
        }
      ],
      options2: [
        {
          value: "",
          label: "所有"
        },
        {
          value: 1,
          label: "普通"
        },
        {
          value: 2,
          label: "白号"
        },
        {
          value: 3,
          label: "黑号"
        },
        {
          value: 4,
          label: "shield"
        },
        {
          value: 5,
          label: "小时限制"
        },
        {
          value: 6,
          label: "单日限制"
        },
        {
          value: 7,
          label: "模板限制"
        }
      ],
      options3: [
        {
          value: "",
          label: "所有"
        },
        {
          value: 1,
          label: "移动"
        },
        {
          value: 2,
          label: "联通"
        },
        {
          value: 3,
          label: "电信"
        }
      ],
      options4: [
        {
          value: "",
          label: "所有"
        },
        {
          value: 1,
          label: "成功"
        },
        {
          value: 0,
          label: "失败"
        }
      ],
      report: "",
      mobileType: "",
      operaid: "",
      submitRes: ""
    };
  },
  methods: {
    exp() {
      let self = this;
      this.postRequest("admin/exportSmsTask", {
        cid: this.cid,
        userName: this.userName,
        mobile: this.mobile,
        gatewayId: this.gatewayId,
        content: this.content,
        fmmdd: this.formatDate(this.date1),
        tmmdd: this.formatDate(this.date2),
        report: this.report,
        mobileType: this.mobileType,
        operaid: this.operaid,
        submitRes: this.submitRes,
        pageSize: this.currentSize,
        pageNum: this.currentPage
      }).then(res => {
        if (res.data.success === true)
          self.$message.success("加入下载列表成功");
        else self.$message.error("加入下载列表失败");
      });
    },
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
      this.postRequest("admin/indexSmsTask", {
        pageNum: this.currentPage,
        pageSize: this.currentSize,
        fmmdd: this.formatDate(this.date1),
        tmmdd: this.formatDate(this.date2),
        cid: this.cid,
        userName: this.userName,
        mobile: this.mobile,
        gatewayId: this.gatewayId,
        content: this.content,
        report: this.report,
        mobileType: this.mobileType,
        operaid: this.operaid,
        submitRes: this.submitRes
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index =
          Number(res.data.data.page.pageNum - 1) *
            Number(res.data.data.page.pageSize) +
          1;
        this.totalPage = res.data.data.page.totalPage;
        this.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.smsView) {
          self.tableData.push({
            index: self.index,
            userName: item.userName,
            cid: item.cid,
            content: item.content,
            splitCount: item.splitCount,
            mobile: item.mobile,
            operaName: item.operaName,
            mobileType: item.mobileType,
            gatewayId: item.gatewayId,
            gatewayReport: item.gatewayReport,
            userSubmitTime: item.userSubmitTime,
            gatewayReportTime: item.gatewayReportTime,
            resMsg: item.resMsg
          });
          self.index++;
        }
      });
    },
    detail(row) {
      // console.log(row);
      this.$router.push({
        path: "/admin_rwzz", //如果提供了path，params会被忽略，可以通过提供路由的name或者手写完整带有参数的path
        query: {
          cid: row.cid,
          mobile: row.mobile,
          userSubmitTime: row.userSubmitTime
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
