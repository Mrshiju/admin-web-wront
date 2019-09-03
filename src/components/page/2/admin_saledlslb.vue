<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="代理商账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" type="index" :index="index"></el-table-column>
        <el-table-column label="公司名称"></el-table-column>
        <el-table-column label="代理商账号"></el-table-column>
        <el-table-column label="余额（条）"></el-table-column>
        <el-table-column label="联系人"></el-table-column>
        <el-table-column label="手机"></el-table-column>
        <el-table-column label="固话"></el-table-column>
        <el-table-column label="地址"></el-table-column>
        <el-table-column label="QQ"></el-table-column>
        <el-table-column label="邮箱"></el-table-column>
        <el-table-column label="创建时间"></el-table-column>
        <el-table-column label="状态"></el-table-column>
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
  name: "A",
  data() {
    return {
      sum: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: false,
      loading: false,
      tableData: [],
      totalPage: 1000,
      userName: ""
    };
  },
  methods: {
    handleSizeChange() {
      // this.tableData = [];
      this.checkData();
    },
    handlePageChange() {
      // this.tableData = [];
      this.checkData();
    },
    index(index) {
      return index + 1;
    },
    handleCommand(command) {
      // console.log(command);
      this[command.name] = true;
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listClientGwScene", {
        userName: this.userName
      }).then(res => {
        self.loading = false;
        self.sum = [res.data.data].length - 1;
        self.totalPage = res.data.data.page.totalPage;
        for (let item of res.data.data) {
          self.tableData.push();
        }
      });
    },
    addGateway() {}
  }
};
</script>

<style scoped>
</style>
