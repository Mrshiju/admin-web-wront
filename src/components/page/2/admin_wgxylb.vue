<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px">
      <el-form-item label="协议名称：">
        <el-input v-model="protocolName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="add">+添加网关协议</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="50px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="protocol" label="协议名称"></el-table-column>
        <el-table-column prop="channelClassName" label="协议组类"></el-table-column>
        <el-table-column prop="loadClassName" label="初始化处理类"></el-table-column>
        <el-table-column prop="sendClassName" label="短信发送类"></el-table-column>
        <el-table-column prop="reportClassName" label="报告接受类"></el-table-column>
        <el-table-column prop="deliverClassName" label="上行接受类"></el-table-column>
        <el-table-column prop="reportQueryClassName" label="报告查询类"></el-table-column>
        <el-table-column prop="deliverQueryClassName" label="上行查询类"></el-table-column>
        <el-table-column prop="balanceQueryClassName" label="余额查讯类"></el-table-column>
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
      <el-dialog title="添加网关协议" :visible.sync="addData.visible" width="500px">
        <el-form
          :model="addData"
          :rules="rule1"
          label-width="120px"
          style="width: 400px"
          ref="addData"
          class="gatewayForm1"
        >
          <el-form-item label="协议名称：" prop="protocol">
            <el-input v-model="addData.protocol"></el-input>
          </el-form-item>
          <el-form-item label="协议组类：" prop="channelClassName">
            <el-input v-model="addData.channelClassName"></el-input>
          </el-form-item>
          <el-form-item label="初始化处理类：" prop="loadClassName">
            <el-input v-model="addData.loadClassName"></el-input>
          </el-form-item>
          <el-form-item label="短信发送类：" prop="sendClassName">
            <el-input v-model="addData.sendClassName"></el-input>
          </el-form-item>
          <el-form-item label="报告接受类：">
            <el-input v-model="addData.reportClassName"></el-input>
          </el-form-item>
          <el-form-item label="上行接受类：">
            <el-input v-model="addData.deliverClassName"></el-input>
          </el-form-item>
          <el-form-item label="报告查讯类：">
            <el-input v-model="addData.reportQueryClassName"></el-input>
          </el-form-item>
          <el-form-item label="上行查讯类：">
            <el-input v-model="addData.deliverQueryClassName"></el-input>
          </el-form-item>
          <el-form-item label="余额查询类：">
            <el-input v-model="addData.balanceQueryClassName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd('addData')">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="网关协议修改" :visible.sync="modifyData.visible" width="500px">
        <el-form
          :model="modifyData"
          label-width="120px"
          style="width: 400px"
          :rules="rule1"
          ref="modifyData"
          class="gatewayForm1"
        >
          <el-form-item label="协议名称：" prop="protocol">
            <el-input v-model="modifyData.protocol"></el-input>
          </el-form-item>
          <el-form-item label="协议组类：" prop="channelClassName">
            <el-input v-model="modifyData.channelClassName"></el-input>
          </el-form-item>
          <el-form-item label="初始化处理类：" prop="loadClassName">
            <el-input v-model="modifyData.loadClassName"></el-input>
          </el-form-item>
          <el-form-item label="短信发送类：" prop="sendClassName">
            <el-input v-model="modifyData.sendClassName"></el-input>
          </el-form-item>
          <el-form-item label="报告接受类：">
            <el-input v-model="modifyData.reportClassName"></el-input>
          </el-form-item>
          <el-form-item label="上行接受类：">
            <el-input v-model="modifyData.deliverClassName"></el-input>
          </el-form-item>
          <el-form-item label="报告查讯类：">
            <el-input v-model="modifyData.reportQueryClassName"></el-input>
          </el-form-item>
          <el-form-item label="上行查讯类：">
            <el-input v-model="modifyData.deliverQueryClassName"></el-input>
          </el-form-item>
          <el-form-item label="余额查询类：">
            <el-input v-model="modifyData.balanceQueryClassName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitModify('modifyData')">保存</el-button>
        </span>
      </el-dialog>
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
      totalPage: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: true,
      loading: false,
      tableData: [],
      protocolName: "",
      modifyData: {
        visible: false,
        id: "",
        protocol: "",
        channelClassName: "",
        loadClassName: "",
        sendClassName: "",
        reportClassName: "",
        deliverClassName: "",
        reportQueryClassName: "",
        deliverQueryClassName: "",
        balanceQueryClassName: ""
      },
      addData: {
        visible: false,
        id: "",
        protocol: "",
        channelClassName: "",
        loadClassName: "",
        sendClassName: "",
        reportClassName: "",
        deliverClassName: "",
        reportQueryClassName: "",
        deliverQueryClassName: "",
        balanceQueryClassName: ""
      },
      rule1: {
        protocol: {
          required: true,
          message: "请输入协议名称",
          trigger: "blur"
        },
        channelClassName: {
          required: true,
          message: "请输入协议组类",
          trigger: "blur"
        },
        loadClassName: {
          required: true,
          message: "请输入初始化处理类",
          trigger: "blur"
        },
        sendClassName: {
          required: true,
          message: "请输入短信发送类",
          trigger: "blur"
        }
      }
    };
  },
  methods: {
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    handleCommand(command) {
      this[command.name] = true;
    },
    handleSelectionChange(val) {
      this.choosedGateway = val;
      // console.log(this.choosedGateway);
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listGatewayProtocol", {
        protocolName: this.protocolName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        self.totalPage = res.data.data.page.totalPage;
        for (let item of res.data.data.data) {
          self.tableData.push({
            id: item.id,
            index:self.index,
            protocol: item.protocol,
            channelClassName: item.channelClassName,
            loadClassName: item.loadClassName,
            sendClassName: item.sendClassName,
            reportClassName: item.reportClassName,
            deliverClassName: item.deliverClassName,
            reportQueryClassName: item.reportQueryClassName,
            deliverQueryClassName: item.deliverQueryClassName,
            balanceQueryClassName: item.balanceQueryClassName
          });
          self.index++
        }
      });
    },
    modify(row) {
      // console.log(row);
      this.modifyData = {
        visible: true,
        id: row.id,
        protocol: row.protocol,
        channelClassName: row.channelClassName,
        loadClassName: row.loadClassName,
        sendClassName: row.sendClassName,
        reportClassName: row.reportClassName,
        deliverClassName: row.deliverClassName,
        reportQueryClassName: row.reportQueryClassName,
        deliverQueryClassName: row.deliverQueryClassName,
        balanceQueryClassName: row.balanceQueryClassName
      };
    },
    submitModify(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          this.postRequest(
            "admin/saveEditGatewayProtocol",
            this.modifyData
          ).then(res => {
            self.resAlert(res.data);
            self.modifyData.visible = false;
            self.checkData();
          });
        } else {
          return false;
        }
      });
    },
    // del(row) {
    //   let self = this;
    //   this.$confirm("确认删除【" + row.userName + "】?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this.postRequest().then(res => {
    //         self.resAlert(res.data);
    //         self.checkData();
    //       });
    //     })
    //     .catch(() => {});
    // },
    add() {
      this.addData.visible = true;
    },
    submitAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          this.postRequest("admin/saveAddGatewayProtocol", this.addData).then(
            res => {
              self.resAlert(res.data);
              self.checkData();
              self.addData = {
                visible: false,
                id: "",
                protocol: "",
                channelClassName: "",
                loadClassName: "",
                sendClassName: "",
                reportClassName: "",
                deliverClassName: "",
                reportQueryClassName: "",
                deliverQueryClassName: "",
                balanceQueryClassName: ""
              };
            }
          );
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
