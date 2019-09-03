<template>
  <div class="container">
    <el-form
      inline="inline"
      label-width="100px"
      :model="form1"
      :rules="rule1"
      ref="form1"
      v-on:keyup.enter.native="checkData"
    >
     <el-form-item label="用户名：" prop="userName">
        <el-input  v-model="form1.userName"></el-input>
      </el-form-item>
      <el-form-item label="短信内容：" prop="content">
        <el-input  v-model="form1.content"></el-input>
      </el-form-item>
      <el-form-item label="网关编号：">
        <el-input  v-model="form1.gatewayId"></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="form1.status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信类型：">
        <el-select v-model="form1.type" placeholder="请选择">
          <el-option
            v-for="item in typeOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期：">
        <el-date-picker type="date" v-model="form1.fdate"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="状态" prop="zt"></el-table-column>
        <el-table-column label="数量" prop="num"></el-table-column>
      </el-table>
      <!--<div>-->
      <!--<el-pagination class="fr"-->
      <!--style="margin:10px 0"-->
      <!--@size-change="handleSizeChange"-->
      <!--@current-change="handlePageChange"-->
      <!--:current-page.sync="currentPage"-->
      <!--:page-size="[30,60,120,150]"-->
      <!--:page-size.sync="currentSize"-->
      <!-- layout="sizes, prev, pager, next, jumper"-->
      <!--:total=sum>-->
      <!--</el-pagination>-->
      <!--<span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>-->
      <!--</div>-->
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
      checkIn: true,
      loading: false,
      form1: {
        userName: "",
        content: "",
        gatewayId: "",
        status: 1,
        type: 1,
        fdate: new Date()
      },
      rule1: {
        content: { required: true, message: "请输入短信内容", trigger: "blur" }
      },
      tableData: [],
      totalPage: 1000,
      options: [
        {
          value: 1,
          label: "成功"
        }
      ],
      typeOpt: [
        {
          label: "普通",
          value: 1
        },
        {
          label: "彩信",
          value: 0
        }
      ]
    };
  },
  methods: {
    checkData() {
      this.tableData = [];
      let self = this;
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.checkIn = true;
          this.loading = true;
          this.postRequest("admin/reportNumSearch", {
            userName: this.form1.userName,
            content: this.form1.content,
            gatewayId: this.form1.gatewayId,
            status: this.form1.status,
            type: this.form1.type,
            fdate: this.formatDate(this.form1.fdate)
          }).then(res => {
            self.tableData = [];
            self.loading = false;
            // this.sum = res.data.data.page.totalCount;
            self.tableData.push({
              num: res.data.data.num,
              zt: res.data.data.zt
            });
          });
        }
      });
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    getParams() {
      let routerParams = this.$route.query;
      this.cid = routerParams.cid;
      this.mobile = routerParams.mobile;
    }
  },
  watch: {
    $route: "getParams"
  }
};
</script>

<style scoped>
</style>
