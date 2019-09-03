<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>

      <el-form-item label="开始时间：">
       <el-date-picker v-model="fmmddhms" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间：">
       <el-date-picker v-model="tmmddhms" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="userName" label="账号"></el-table-column>
        <el-table-column prop="optAmount" label="补款金额"></el-table-column>
        <el-table-column prop="beforebalance" label="操作前余额"></el-table-column>
        <el-table-column prop="afterbalance" label="操作后余额"></el-table-column>
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
        :total="sum"
         layout="sizes, prev, pager, next, jumper"
      ></el-pagination>
      <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      updateRemarkForm: {
        userName: "",
        remark: ""
      },
      updateRemarkFlage: false,
      userName: "",
      fmmddhms: "",
      tmmddhms: "",
      options: [
        {
          key: 0,
          label: "所有",
          value: ""
        },
        {
          key: 1,
          label: "赠送",
          value: 1
        },
        {
          key: 2,
          label: "补款",
          value: 2
        },
        {
          key: 3,
          label: "扣款",
          value: 3
        }
      ],
      index: 0,
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
    //判断操作类型函数
    opttypeFunc(opttype) {
      switch (opttype) {
        case 0:
          return "所有";
          break;
        case 1:
          return "赠送";
          break;
        case 2:
          return "补款";
          break;
        case 3:
          return "扣款";
          break;
      }
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("/admin/listFailRefundBalanceOpt", {
        userName: this.userName,
        fmmddhms: this.formatDate(this.fmmddhms),
        tmmddhms: this.formatDate(this.tmmddhms),
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            afterbalance: item.afterbalance ? Number(item.afterbalance).toFixed(1) : 0,
            beforebalance: item.beforebalance
              ? (item.beforebalance *1).toFixed(1)
              : 0,
            optAmount:
              item.afterbalance - item.beforebalance
                ? (item.afterbalance - item.beforebalance).toFixed(1)
                : 0,
            createtime: item.createtime,
            oper: item.oper,
            opertime: item.opertime,
            refundnum: item.refundnum,
            userName: item.userName,
            id: item.id
          });
          self.index++;
        }
      });
    }
  },
  mounted() {
    this.checkData();
  }
};
</script>

<style scoped>
</style>
