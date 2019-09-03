<template>
  <div class="container">
    <!--<el-form inline="inline" label-width="100px" v-on:keyup.enter.native="checkData">-->
    <!--<el-form-item label="任务编号：">-->
    <!--<el-input  v-model="cid"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="号码：">-->
    <!--<el-input  v-model="mobile"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="来源：">-->
    <!--<el-input  v-model="source"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="结果：">-->
    <!--<el-select v-model="res" placeholder="请选择">-->
    <!--<el-option-->
    <!--v-for="item in options1"-->
    <!--:key="item.value"-->
    <!--:label="item.label"-->
    <!--:value="item.value">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="操作时间：">-->
    <!--<el-date-picker type="date" v-model="date"></el-date-picker>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="服务器编号：">-->
    <!--<el-input  v-model="serverNum"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="操作：">-->
    <!--<el-input  v-model="action"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="去向：">-->
    <!--<el-input  v-model="target"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item>-->
    <!--<el-button @click="checkData" type="primary" plain class="fr">查询</el-button>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column label="服务器编号" prop="servernum"></el-table-column>
        <el-table-column label="任务编号" prop="cid"></el-table-column>
        <el-table-column label="号码" prop="mobile"></el-table-column>
        <el-table-column label="操作" prop="action"></el-table-column>
        <el-table-column label="描述" prop="desc"></el-table-column>
        <el-table-column label="来源" prop="source"></el-table-column>
        <el-table-column label="去向" prop="target"></el-table-column>
        <el-table-column label="信息" prop="msg"></el-table-column>
        <!-- <el-table-column
                    label="结果"
                    prop={{success==1?'成功':'失败'}}>
        </el-table-column>-->
        <el-table-column label="创建时间" prop="created"></el-table-column>
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
      index:0,
      cid: "",
      currentSize: 30,
      currentPage: 1,
      checkIn: false,
      loading: false,
      tableData: [],
      mobile: "",
      res: "",
      serverNum: "",
      action: "",
      target: "",
      source: "",
      totalPage: 1000,
      date: "",
      options1: [
        {
          value: 1,
          label: "成功"
        },
        {
          value: 2,
          label: "失败"
        }
      ]
    };
  },
  methods: {
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/indexMsgTrace", {
        pageNum: this.currentPage,
        pageSize: this.currentSize,
        mobile: this.mobile,
        mmdd: this.date,
        cid: this.cid,
        source: this.source,
        target: this.target,
        action: this.action,
        serverNum: this.serverNum,
        res: this.res,
        isInit: 1
      }).then(res => {
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        this.totalPage = res.data.data.page.totalPage;
        this.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.msgTrace) {
          self.tableData.push({
            cid: item.cid,
            servernum: item.servernum,
            created: item.created,
            mobile: item.mobile,
            action: item.action,
            success: item.success,
            source: item.source,
            target: item.target,
            msg: item.msg,
            desc: item.desc
          });
        }
      });
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    }
    // getParams() {
    //   let routerParams = this.$route.query;
    //   this.cid = routerParams.cid;
    //   this.mobile = routerParams.mobile;
    // }
  },
  watch: {
    $route(to, from) {
      // console.log(this.$route.query);
      this.cid = this.$route.query.cid;
      this.mobile = this.$route.query.mobile;
    }
  },
  // mounted() {
  //   this.tableData = [];
  //   this.checkIn = true;
  //   this.loading = true;
  //   let self = this;
  //   this.postRequest("admin/indexMsgTrace", {
  //     pageNum: this.currentPage,
  //     pageSize: this.currentSize,
  //     mobile: this.mobile,
  //     mmdd: this.formatDate(this.date),
  //     cid: this.cid,
  //     source: this.source,
  //     target: this.target,
  //     action: this.action,
  //     serverNum: this.serverNum,
  //     res: this.res
  //   }).then(res => {
  //     console.log(res);
  //     self.loading = false;
  //     this.totalPage = res.data.data.page.totalPage;
  //     this.sum = res.data.data.page.totalCount;
  //     for (let item of res.data.data.msgTrace) {
  //       self.tableData.push({
  //         cid: item.cid,
  //         servernum: item.servernum,
  //         created: item.created,
  //         mobile: item.mobile,
  //         action: item.action,
  //         success: item.success,
  //         source: item.source,
  //         target: item.target,
  //         msg: item.msg,
  //         desc: item.desc
  //       });
  //     }
  //   });
  // },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.cid = vm.$route.query.cid;
      vm.mobile = vm.$route.query.mobile;
      vm.date = vm.$route.query.userSubmitTime;
      vm.checkData();
    });
    // next()
  }
};
</script>

<style scoped>
</style>
