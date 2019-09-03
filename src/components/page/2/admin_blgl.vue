<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="特服号：">
        <el-input  v-model="code"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>

      <el-form-item label="用户名：">
        <el-select v-model="userName" filterable>
          <el-option
            v-for="item in options"
            :key="item.key"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="">
        <el-input  v-model="userName" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="saveBatchRelate" type="primary" plain>关联</el-button>
      </el-form-item>
    </el-form>

    <el-card v-if="checkIn">
      <el-table
        border
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        stripe
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelection"
      >
        <el-table-column
          type="selection"
          width="55">
      </el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="pcnName" label="主账号"></el-table-column>
        <el-table-column prop="agentName" label="代理商"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
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
// import axios from '../common/axios.js'
export default {
  data() {
    return {
      code: "",
      userName: "",
      id: "",
      options: [],
      formLabelWidth: "120px",
      multipleSelection: [],
      index: 0,
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      tableData: [],
      checkIn: false,
      loading: false
    };
  },
  watch :{
  },
  methods: {
    handleSelection(val) {
      if (val.length) {
        this.multipleSelection = val;
        this.id = val[0].code;
      }else {
        this.multipleSelection = ''
      }
    },
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
    saveBatchRelate() {
      let self = this;
       if(this.multipleSelection.length == 0){
         return  self.$message.warning('请选择特服号')
       }
      this.postRequest("/admin/saveBatchRelate", {
        type: this.userName,
        name: this.userName,
        id: this.id
      }).then(res => {
        if (res.data.success) {
          self.succeed(res.data.resultMsg);
          self.checkData();
        } else {
          self.failed(res.data.resultMsg);
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
      this.multipleSelection = '';
      this.options = [];
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("/admin/batchRelate", {
        code: this.code,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum * res.data.data.page.pageSize);
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.customerList) {
          self.options.push({
            label: item.userName,
            value: item.accountID,
            key: item.id
          });
        }
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index++,
            accountID: item.accountID,
            agentID: item.agentID,
            agentName: item.agentName,
            code: item.code,
            createtime: item.createtime,
            id: item.id,
            pcnID: item.pcnID,
            pcnName: item.pcnName,
            status: item.status,
            statusCn:
              item.status === 0 ? "所有" : item.status === 1 ? "可用" : "已用",
            userName: item.userName,
            userName: item.userName,
            id: item.id
          });
        }
        self.index++;
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
