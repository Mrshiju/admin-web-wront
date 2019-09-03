<template>
  <div class="container">
    <el-form label-width="120px" inline="inline">
      <el-form-item label="文件名">
        <el-input v-model="fileName" @keyup.enter.native="checkData"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="options" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="download(scope.row)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名"></el-table-column>
        <el-table-column prop="exportCount" label="下载次数"></el-table-column>
        <el-table-column prop="created" label="创建时间"></el-table-column>
        <el-table-column prop="statusCn" label="状态"></el-table-column>
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
import axios from "axios";

export default {
  name: "admin_fxbglb",
  data() {
    return {
      fileName: "",
      index: 0,
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      tableData: [],
      checkIn: true,
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
    // 下载操作
    download(row) {
      let url = `${sessionStorage.base}/download?id=${row.id}`;
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "excel.xlsx");
      document.body.appendChild(link);
      link.click();
      // this.checkData();
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
      this.postRequest("admin/listExport", {
        fileName: this.fileName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        self.index =
          Number(res.data.data.page.pageNum - 1) *
            Number(res.data.data.page.pageSize) +
          1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            id: item.id,
            index: self.index,
            fileName: item.fileName,
            exportCount: item.exportCount,
            created: item.created,
            status: item.status,
            statusCn: item.status === 1 ? "正常" : "未完成"
          });
          self.index++;
        }

        // } else {
        // return self.message.warning(res.data.message)
        // }
        // return  self.resAlert(res);
      });
    },
    cancel() {
      alert(1);
    }
  },
  mounted() {}
};
</script>

<style scoped>
</style>
