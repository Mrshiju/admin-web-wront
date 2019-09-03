<template>
  <div class="container">
    <el-form>
      <el-form-item label="筛选时间：" v-on:keyup.enter.native="checkData">
        <el-date-picker type="date" v-model="date1"></el-date-picker>
        <el-button @click="checkData" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border  ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column label="敏感词" prop="keyword"></el-table-column>
        <el-table-column label="出现次数" prop="appear"></el-table-column>
        <el-table-column label="级别" prop="keylevel"></el-table-column>
      </el-table>
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: "admin_dshrwmgc",
  data() {
    return {
      index:0,
      date1: new Date(),
      sum: 0,
      currentSize: 30,
      currentPage: 1,
      checkIn: true,
      loading: false,
      tableData: [],
      totalPage: 1000
    };
  },
  methods: {
    checkData() {
      this.tableData = [];

      let self = this;
      if (this.date1 !== null) {
        this.checkIn = true;
        this.loading = true;
        this.postRequest("admin/listCheckTaskKeyword", {
          fmmdd: this.formatDate(this.date1)
        }).then(res => {
          self.tableData = [];
          self.loading = false;
          this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
          self.sum = res.data.data.page.totalCount;
          self.totalPage = res.data.data.page.totalPage;
          for (let item of res.data.data.data) {
            self.tableData.push({
              index: self.index,
              keyword: item.keyword,
              keylevel: item.keylevel,
              appear: item.apear
            });
            self.index++;
          }
        });
      } else this.$message.warning("请输入筛选时间");
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    }
  }
};
</script>

<style scoped>
</style>
