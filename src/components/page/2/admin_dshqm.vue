<template>
  <div class="container">
    <el-form inline="inline" label-width="100px" v-on:keyup.enter.native="checkData">
      <el-form-item label="签名：">
        <el-input  v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="企业ID：">
        <el-input  v-model="checker"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="checkStatus" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" style="index"></el-table-column>
        <el-table-column label="操作"></el-table-column>
        <el-table-column label="企业ID" prop="userName"></el-table-column>
        <el-table-column label="签名" prop="cid"></el-table-column>
        <el-table-column prop="createTime" label="状态"></el-table-column>
        <el-table-column prop="content" label="操作时间"></el-table-column>
        <el-table-column prop="contentLen" label="提交时间"></el-table-column>
        <el-table-column prop="pknumber" label="备注"></el-table-column>
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
export default {
  name: "A",
  data() {
    return {
      sum: 0,
      currentSize: 30,
      currentPage: 1,
      checkIn: false,
      loading: false,
      totalPage: 1000,
      tableData: [
        {
          index: 0,
          userName: "qwqwqw",
          ctgateway: 1,
          cmgateway: 2,
          cugateway: 3
        }
      ], //后台又没数据，自己填
      cid: "",
      userName: "",
      content: "",
      checker: "",
      checkStatus: "",
      fmmdd: new Date(),
      tmmdd: new Date(),
      options1: [
        {
          value: "0",
          label: "所有"
        },
        {
          value: "1",
          label: "未处理"
        },
        {
          value: "2",
          label: "成功"
        },
        {
          value: "3",
          label: "拒绝"
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
      // this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/???", {
        pageNum: this.currentPage,
        pageSize: this.currentSize,
        fmmdd: this.fmmdd,
        tmmdd: this.tmmdd,
        checker: this.checker,
        checkStatus: this.checkStatus,
        cid: this.cid,
        content: this.content,
        userName: this.userName
      }).then(res => {
        self.loading = false;
        self.sum = res.data.page.totalCount;
        self.totalPage = res.data.page.totalPage;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            userName: item.userName,
            cid: item.cid,
            createTime: item.createTime,
            content: item.content,
            contentLen: item.contentLen,
            pknumber: item.pknumber,
            definitetime: item.definitetime,
            checker: item.checker,
            checkSource: item.checkSource,
            checkTime: item.checkTime,
            cnCheckStatus: item.cnCheckStatus,
            remark: item.remark,
            cmgateway: item.cmgateway,
            cugateway: item.cugateway,
            ctgateway: item.ctgateway
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
