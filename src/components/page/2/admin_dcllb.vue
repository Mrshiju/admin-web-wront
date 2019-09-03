<template>
  <div class="container">
    <el-form label-width="100px" :inline="true" v-on:keyup.enter.native="checkData">
      <el-form-item label="任务编号：">
        <el-input v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="号码：">
        <el-input v-model="mobile"></el-input>
      </el-form-item>
      <el-form-item label="网关列表：">
        <el-input v-model="gateway"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="hassend">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form label-width="100px" :inline="true">
      <el-form-item label="时间：">
        <el-date-picker type="date" v-model="fmmdd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
        <el-button @click="exportData" type="primary" plain>导出</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="table" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="resend(scope.$index,scope.row)">重发</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="serverNum" label="特服号"></el-table-column>
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column prop="content" label="短信内容"></el-table-column>
        <el-table-column prop="mobile" label="号码"></el-table-column>
        <el-table-column prop="operaName" label="运营商"></el-table-column>
        <el-table-column prop="createtime" label="提交时间"></el-table-column>
        <el-table-column prop="cnMobileType" label="类型"></el-table-column>
        <el-table-column prop="cnHassend" label="状态"></el-table-column>
        <el-table-column width="240" label="网关">
          <template slot-scope="scope">
            <el-select v-model="scope.row.chooseGateway">
              <el-option
                v-for="item in scope.row.gatewayOption"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
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
  name: "admin_dxtjjl",
  data() {
    return {
      cid: "",
      index:0,
      mobile: "",
      fmmdd: new Date(),
      pageNum: 1,
      pageSize: 30,
      mobileType: 1,
      userName: "",
      checkIn: false,
      loading: false,
      gateway: "",
      hassend: -1,
      tableDate: [
        {
          id: 86018261,
          cid: 18101909231000320,
          userCid: "18101909231000320",
          accountID: 108907,
          userName: "yaotl",
          code: "1001",
          rank: 0,
          agentID: 100000,
          agentName: "SYS",
          content: "22【测试】",
          mobile: "15720681560",
          count: 1,
          pktotal: 0,
          pknumber: 0,
          pid: 0,
          gateway: 444444444,
          msgfmt: 15,
          udhi: 0,
          operaid: 1,
          createtime: "2018-10-19 09:23:50",
          hassend: 0,
          mmdd: "1019",
          serverNum: "539001",
          cnMobileType: "黑号",
          cnHassend: "未发送",
          operaName: "移动",
          gatewayName: "死通道_DELIVRD"
        }
      ],
      option: [
        {
          key: -1,
          value: -1,
          label: "所有"
        },
        {
          value: 0,
          label: "未发生"
        },
        {
          value: 1,
          label: "已发送"
        }
      ],
      sum: 0,
      //
      gatewayList: [],
      num: 0 //没有可以作为主键的不冲突参数
    };
  },
  methods: {
    exportData() {},
    checkData() {
      // this.table = [];
      let self = this;
      this.checkIn = true;
      this.loading = true;
      this.postRequest("admin/listWaitHandle", {
        fmmdd: this.formatDate(this.fmmdd),
        hassend: this.hassend,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        cid: this.cid,
        userName: this.userName,
        mobile: this.mobile,
        gateway: this.gateway
      }).then(res => {
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.getGatewayList().then(response => {
          for (let n in response.data.data) {
            for (let item of response.data.data[n]) {
              self.num++;
              self.gatewayList.push({
                key: self.num,
                value: item.gateway,
                label: item.gatewayname
              });
            } //写一半需求取消了
          }
          //  for (let item of res.data.data.data){
          //     self.tableData.push({
          //         userName:item.userName,
          //         serverNum:item.serverNum,
          //         cid:item.cid,
          //         content:item.content,
          //         mobile:item.mobile,
          //         operaName:item.operaName,
          //         cnMobileType:item.cnMobileType,
          //         cnHassend:item.cnHassend,
          //         gatewayOption:gatewayList
          //         chooseGateway:
          //     })
          // }
        });
      });
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    resend(n, c) {
      let self = this;
      // console.log(n);
      // console.log(c);
      this.postRequest("admin/smsWaitHandleRetry", {
        cid: c.cid,
        gateway: c.gateway,
        mmdd: c.mmdd,
        mobile: c.mobile
      }).then(res => {
        // console.log(res.data);
        if (res.data.success !== true) self.$message.error(res.data.message);
        else self.$message.success(res.data.message);
      });
    }
  }
};
</script>

<style scoped>
</style>
