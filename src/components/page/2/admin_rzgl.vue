<template>
  <div class="container">
    <el-form label-width="120px" inline="inline">
      <el-form-item label="操作用户：">
        <el-input v-model="userName"></el-input>
      </el-form-item> 


      <el-form-item label="日志类型：">
        <el-select v-model="listSysLogTpyed">
          <el-option
            v-for="(item,i) in listSysLogTpye"
            :key="i"
            :label="item.codeNameCn"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="模块类型：">
        <el-select v-model="mudelTpyed">
          <el-option v-for="(item,i) in mudelTpye" :key="i" :label="item.value" :value="item.label"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="日志内容：">
        <el-input v-model="content"></el-input>
      </el-form-item>

      <el-form-item label="开始时间">
        <el-date-picker type="datetime" v-model="fdate"></el-date-picker>
      </el-form-item>

      <el-form-item label="操作时间">
        <el-date-picker v-model="tdate" type="datetime" ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-table border ref="table" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="typeIDCn" label="日志类型"></el-table-column>
        <el-table-column prop="content" label="日志内容"></el-table-column>
        <el-table-column prop="callMethodPath" label="调用路径"></el-table-column>
        <el-table-column prop="ipaddr" label="请求地址"></el-table-column>
        <el-table-column prop="moduleType" label="模块类型"></el-table-column>
        <el-table-column prop="creatorUserName" label="操作用户"></el-table-column>
        <el-table-column prop="createtime" label="操作时间"></el-table-column>
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
      userName: "",
      listSysLogTpye: [],
      listSysLogTpyed: "",
      sum: 0,
      pageNum: 1,
      pageSize: 30,
      mudelTpye: [
        {
          label: "",
          value: "全部"
        },
        {
          label: 1,
          value: "系统"
        },
        {
          label: 3,
          value: "客户"
        }
      ],
      mudelTpyed: "",
      content: "",
      fdate: new Date(new Date(new Date().toLocaleDateString()).getTime()),
      tdate: "",
      tableData: [],
      index: 0,
      typeID:''
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
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    checkData() {
      let self = this;
      this.tableData = [];
      this.postRequest("admin/listSysLog", {
        userName: this.userName,
        typeID: this.typeID,
        content: this.content,
        callMethodPath: this.listSysLogTpyed,
        ipaddr: this.ipaddr,
        moduleType: this.mudelTpyed,
        fdate: this.formatDate2(this.fdate),
        tdate: this.tdate,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        this.index =
          Number(res.data.data.page.pageNum - 1) *
            Number(res.data.data.page.pageSize) +
          1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data.list) {
          self.tableData.push({
            id: item.id,
            index: this.index,
            userName: item.userName,
            typeIDCn: item.typeIDCn,
            typeID: item.typeID,
            content: item.content,
            callMethodPath: item.callMethodPath,
            ipaddr: item.ipaddr,
            moduleType: item.moduleType == "1" ? "系统" : "客户",
            createtime: item.createtime,
            creatorUserName: item.creatorUserName
          });
          self.index++;
        }
      });
    },
    async getlistSysLogTpye() {
      this.listSysLogTpye = [];
      let res = await this.postRequest("admin/listSysLogTpye", {
        token: ""
      });
      console.log(res);
      for (let item of res.data.data) {
        this.listSysLogTpye.push({
          id: item.id,
          codeNameCn: item.codeNameCn
        });
      }
      this.listSysLogTpye.unshift({
        id:'',
        codeNameCn:'所有'
      })
    }
  },
  mounted() {
    this.getlistSysLogTpye();
  }
};
</script>

<style scoped>
</style>
