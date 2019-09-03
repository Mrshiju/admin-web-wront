<template>
  <div class="container">
    <el-form label-width="120px" inline="inline" v-on:keyup.enter.native="checkData">
      <el-form-item label="任务编号：">
        <el-input  v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="网关编号：">
        <el-input  v-model="gateway"></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="hassend">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker type="date" v-model="fmmdd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column prop="content" label="短信内容"></el-table-column>
        <el-table-column prop="count" label="号码数"></el-table-column>
        <el-table-column prop="gateway" label="网关编号"></el-table-column>
        <el-table-column prop="operaidCn" label="运营商"></el-table-column>
        <el-table-column prop="hassendCn" label="状态"></el-table-column>
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
export default {
  name: "admin_fxbglb",
  data() {
    return {
      cid: "",
      index:0,
      content: "",
      fmmdd: new Date(),
      gateway: "",
      mobile: "",
      pageNum: 1,
      pageSize: 30,
      userName: "",
      checkIn: true,
      loading: false,
      sum: 0,
      tableData: [],
      hassend: -1,
      options: [
        {
          value: -1,
          label: "所有"
        },
        {
          value: 0,
          label: "未发送"
        },
        {
          value: 1,
          label: "已发送"
        }
      ]
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
      this.postRequest("admin/listWaitSubmit", {
        cid: this.cid,
        gateway: this.gateway,
        fmmdd: this.formatDate(this.fmmdd),
        hassend: this.hassend,
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
            serverNum: item.serverNum,
            cid: item.cid,
            code: item.code,
            content: item.content,
            count: item.count,
            gateway: item.gateway,
            operaid: item.operaid,
            //运营商区分1移动，2联通，3电信
            operaidCn:
              item.operaid === 1
                ? "移动"
                : item.operaid === 2
                ? "联通"
                : "电信",
            //发送状态,默认0未发，1已发送
            hassend: item.hassend,
            hassendCn: item.hassend === 0 ? "未发送" : "已发送",
            createtime: item.createtime
            //网关ID和任务ID分不清
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
