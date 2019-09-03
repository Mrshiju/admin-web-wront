<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="通道编号：">
        <el-input v-model="gateway"></el-input>
      </el-form-item>
      <el-form-item label="网关：">
        <el-input v-model="channel"></el-input>
      </el-form-item>
      <el-form-item label="通道类型：">
        <el-select v-model="gatewayType">
          <el-option v-for="(item,i) of typeOpt" :label="item.label" :value="item.value" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="add">+新增通道资费</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="100px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改</el-button>
            <el-button @click="del(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="gateway" label="通道编号"></el-table-column>
        <el-table-column prop="gatewayName" label="通道名称"></el-table-column>
        <el-table-column prop="gatewayName" label="网关"></el-table-column>
        <el-table-column prop="feeMethod" label="下发规则"></el-table-column>
        <el-table-column prop="operator_id" label="网关单价"></el-table-column>
        <el-table-column prop="begin_count" label="接入号"></el-table-column>
        <el-table-column prop="end_count" label="通道类型"></el-table-column>
        <el-table-column prop="price" label="计费方式"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
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
      <el-dialog title="新增通道资费" :visible.sync="addData.visible" width="500px">
        <el-form :model="addData" label-width="120px" style="width: 400px">
          <el-form-item label="通道名称：">
            <el-select v-model="addData.gatewayName" @change="change">
              <el-option v-for="(item,i) of gatewayList" :label="item.label" :value="item.value" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通道编号：">
            <el-input v-model="addData.gateway" disabled></el-input>
          </el-form-item>
          <el-form-item label="运营商：">
            <el-select v-model="addData.operator_id">
              <el-option v-for="(item,i) of gwList" :label="item.label" :value="item.value" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计费方式：">
            <el-radio disabled v-model="addData.feeMethod" label="成功">1</el-radio>
          </el-form-item>
          <el-form-item label="大于等于：">
            <el-input v-model="addData.begin_count"></el-input>
          </el-form-item>
          <el-form-item label="小于等于：">
            <el-input v-model="addData.end_count"></el-input>
          </el-form-item>
          <el-form-item label="费率：">
            <el-input v-model="addData.price"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="addData.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="网关协议修改" :visible.sync="modifyData.visible" width="500px">
        <el-form v-model="modifyData" label-width="120px" style="width: 400px">
          <el-form-item label="协议名称：">
            <el-input v-model="modifyData.protocal"></el-input>
          </el-form-item>
          <el-form-item label="协议组类：">
            <el-input v-model="modifyData.channelClassName"></el-input>
          </el-form-item>
          <el-form-item label="初始化处理类：">
            <el-input v-model="modifyData.loadClassName"></el-input>
          </el-form-item>
          <el-form-item label="短信发送类：">
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
          <el-button type="primary" @click="submitModify">保存</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "admin_tdgl_tdsxlb",
  data() {
    return {
      sum: 0,
      index:0,
      totalPage: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: false,
      loading: false,
      typeOpt: [
        {
          label: "所有",
          value: -1
        },
        {
          label: "行业",
          value: 1
        },
        {
          label: "营销",
          value: 2
        },
        {
          label: "未知",
          value: 0
        }
      ],
      tableData: [],
      gateway: "",
      channel: "",
      gatewayType: -1,
      gatewayList: [],
      addData: {
        visible: false,
        gatewayName: "",
        gateway: "",
        operator_id: "",
        feeMethod: "",
        begin_count: "",
        end_count: "",
        price: "",
        remark: ""
      },
      modifyData: {
        visible: false,
        id: "",
        protocal: "",
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
        protocal: {
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
      },
      gwList: [
        {
          value: 1,
          label: "移动"
        },
        {
          value: 2,
          label: "联通"
        },
        {
          value: 3,
          label: "电信"
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
    handleSelectionChange(val) {
      this.choosedGateway = val;
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listGatewayProperty", {
        gateway: this.gateway,
        channel: this.channel,
        gatewayType: this.gatewayType,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        self.totalPage = res.data.data.page.totalPage;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index:self.index,
            gateway: item.gateway,
            gatewayName: item.gatewayName,
            feeMethod: item.feeMethod,
            operator_id: item.operator_id,
            begin_count: item.begin_count,
            end_count: item.end_count,
            price: item.price,
            remark: item.remark
          });
          self.index++
        }
      });
    },
    modify(row) {
      let self = this;
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
    submitModify() {
      let self = this;
      this.postRequest("admin/saveEditGatewayProtocol", this.modifyData).then(
        res => {
          self.resAlert(res.data);
          self.modifyData.visible = false;
          self.checkData();
        }
      );
    },
    add() {
      let self = this;
      this.gatewayList = [];
      let XXX = [];
      this.postRequest("admin/getGatewayList", { t: "" }).then(res => {
        for (let list in res.data.data) {
          for (let item of res.data.data[list]) {
            if (item.status === 1) {
              if (XXX.indexOf(item.gateway) === -1) {
                XXX.push(item.gateway);
                self.gatewayList.push({
                  value: item.gateway,
                  label: item.gatewayname
                });
              }
            }
          }
        }
      });
      this.addData.visible = true;
    },
    change(val) {
      this.addData.gateway = val;
    },
    submitAdd() {
      let self = this;
      this.postRequest("admin/saveAddGatewayProtocol", this.addData).then(
        res => {
          self.resAlert(res.data);
          self.checkData();
          self.addData.visible = false;
        }
      );
    },
    del(row) {
      let self = this;
      this.$confirm("确认删除【" + row.userName + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest().then(res => {
            self.resAlert(res.data);
            self.checkData();
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
</style>

