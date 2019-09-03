<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="任务编号：">
        <el-input  v-model="cid"></el-input>
      </el-form-item>
       <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="网关编号：">
        <el-input  v-model="gateway"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="status">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间：">
        <el-date-picker v-model="fymdhms" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker v-model="tymdhms" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="cancel(scope.row)" type="text" v-if="scope.row.status===0">取消</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column prop="content" label="短信内容"></el-table-column>
        <el-table-column prop="count" label="号码数"></el-table-column>
        <el-table-column prop="gateway" label="网关编号"></el-table-column>
        <el-table-column label="运营商">
          <template
            slot-scope="scope"
          >{{scope.row.operaid===1?'移动':scope.row.operaid===2?'联通':'电信'}}</template>
        </el-table-column>
        <el-table-column prop="definitetime" label="定时时间"></el-table-column>
        <el-table-column prop="createtime" label="提交时间"></el-table-column>
        <el-table-column label="状态">
          <template
            slot-scope="scope"
          >{{scope.row.status===0?'未处理':scope.row.status===1?'已处理':scope.row.status===2?'已取消':""}}</template>
        </el-table-column>
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
  name: "admin_fxbglb",
  data() {
    return {
      cid: "",
      index:0,
      content: "",
      fymdhms: "",
      tymdhms: "",
      gateway: "",
      mobile: "",
      pageNum: 1,
      pageSize: 30,
      userName: "",
      checkIn: true,
      sum: 0,
      tableData: [],
      status: -1,
      //-1:所有,0:未处理,1:已处理,2:已取消
      options: [
        {
          value: -1,
          label: "所有"
        },
        {
          value: 0,
          label: "未处理"
        },
        {
          value: 1,
          label: "已处理"
        },
        {
          value: 2,
          label: "已取消"
        }
      ],
      loading: false
    };
  },
  methods: {
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    failed(message) {
      this.$message.error(message);
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
      this.postRequest("admin/listTimeTask", {
        cid: this.cid,
        gateway: this.gateway,
        fymdhms: this.formatDate2(this.fymdhms),
        tymdhms: this.formatDate2(this.tymdhms),
        status: this.status,
        userName: this.userName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index:self.index,
            userName: item.userName,
            code: item.code,
            cid: item.cid,
            content: item.content,
            count: item.count,
            gateway: item.gateway,
            operaid: item.operaid,
            rank: item.rank,
            createtime: item.createtime,
            definitetime: item.definitetime,
            status: item.status,
            id: item.id
          });
          self.index++;
        }
      });
    },
    cancel(row) {
      let self = this;
      this.$confirm(`确定取消定时任务：【${row.cid}】, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/timeTaskCancel", {
              id: row.id
            })
            .then(res => {
              if (res.data.success) {
                self.succeed(res.data.message);
                self.checkData();
              } else {
                self.failed(res.data.message);
              }
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
</style>
