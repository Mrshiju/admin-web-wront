<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="账号(从/到)：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>

      <el-form-item label="转账类型：">
        <el-select v-model="category">
          <el-option
            v-for="item in options"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
      <el-button type="text" @click="exportRecord">+导出</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="fromUserName" label="从(账号)"></el-table-column>
        <el-table-column prop="toUserName" label="到(账号)"></el-table-column>
        <el-table-column prop="categoryCn" label="转账类型"></el-table-column>
        <el-table-column prop="amount" label="转账数(元)"></el-table-column>
        <el-table-column prop="creatorUserName" label="操作人"></el-table-column>
        <el-table-column prop="created" label="转账时间"></el-table-column>
        <el-table-column prop="note" label="备注"></el-table-column>
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
      category: "",
      fmmddhms: "",
      tmmddhms: "",
      id: "",
      options: [
        {
          key: 0,
          label: "所有",
          value: ""
        },
        {
          key: 1,
          label: "代理商到代理商",
          value: "aTa"
        },
        {
          key: 2,
          label: "代理商到客户",
          value: "aTc"
        },
        {
          key: 3,
          label: "代理商到系统",
          value: "aTs"
        },
        {
          key: 4,
          label: "客户到代理商",
          value: "cTa"
        },
        {
          key: 5,
          label: "客户到客户",
          value: "cTc"
        },
        {
          key: 6,
          label: "客户到系统",
          value: "cTs"
        },
        {
          key: 7,
          label: "系统到客户",
          value: "sTc"
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
    //   操作成功提示
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    // 操作失败提示
    failed(message) {
      this.$message.error(message);
    },
    //导出操作
    exportRecord() {
      let self = this;
      this.postRequest("/admin/exportTransferRecord", {
        userName: this.userName,
        category: this.category,
        fmmddhms: this.formatDate(this.fmmddhms),
        tmmddhms: this.formatDate(this.tmmddhms)
      }).then(res => {
        if (res.data.success) {
          self.succeed(res.data.data);
        } else {
          self.failed("导出失败");
        }
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
      this.postRequest("/admin/listTransferRecord", {
        userName: this.userName,
        category: this.category,
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
            amount: item.amount?(item.amount/10000):0,
            category: item.category,
            categoryCn: item.categoryCn,
            created: item.created,
            creatorAccountID: item.creatorAccountID,
            creatorUserName: item.creatorUserName,
            fromAccountID: item.fromAccountID,
            fromUserName: item.fromUserName,
            note: item.note,
            toAccountID: item.toAccountID,
            toUserName: item.toUserName,
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
