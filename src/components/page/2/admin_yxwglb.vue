<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px">
      <el-form-item label="网关名称：">
        <el-input v-model="gatewayName"></el-input>
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
        <el-table-column prop="gatewayId" label="网关代码"></el-table-column>
        <el-table-column prop="gatewayName" label="网关名称"></el-table-column>
        <el-table-column prop="note" label="备注"></el-table-column>
        <el-table-column label="运行状态">
          <template slot-scope="scope">{{scope.row.status===1?'正在运行':'未运行'}}</template>
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
      <el-dialog title="添加网关协议" :visible.sync="addData.visible" width="500px">
        <el-form
          :model="addData"
          :rules="rule1"
          label-width="120px"
          style="width: 400px"
          ref="addData"
        >
          <el-form-item label="网关编号：" prop="gatewayId">
            <el-input v-model="addData.gatewayId"></el-input>
          </el-form-item>
          <el-form-item label="网关名称：" prop="gatewayName">
            <el-input v-model="addData.gatewayName"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select v-model="addData.status">
              <el-option
                v-for="(item,i) of statusOpt"
                :value="item.value"
                :label="item.label"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="note">
            <el-input v-model="addData.note"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd('addData')">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="网关协议修改" :visible.sync="modifyData.visible" width="500px">
        <el-form :model="modifyData" label-width="120px" style="width: 400px" ref="modifyData">
          <el-form-item label="网关编号：">
            <el-input v-model="modifyData.gatewayId"></el-input>
          </el-form-item>
          <el-form-item label="网关名称：">
            <el-input v-model="modifyData.gatewayName"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="modifyData.status">
              <el-option
                v-for="(item,i) of statusOpt"
                :value="item.value"
                :label="item.label"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="modifyData.note"></el-input>
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
      index: 0,
      totalPage: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: true,
      loading: false,
      tableData: [],
      gatewayName: "",
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
      addData: {
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
      statusOpt: [
        {
          value: 0,
          label: "停止运行"
        },
        {
          value: 1,
          label: "正在运行"
        }
      ],
      rule1: {
        gatewayId: {
          required: true,
          message: "请输入网关编号",
          trigger: "blur"
        },
        gatewayName: {
          required: true,
          message: "请输入网关名称",
          trigger: "blur"
        },
        status: { required: true, message: "请输入网关状态", trigger: "blur" },
        note: { required: true, message: "请输入备注", trigger: "blur" }
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
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listRunGateway", {
        gatewayName: this.gatewayName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index =
          Number(res.data.data.page.pageNum - 1) *
            Number(res.data.data.page.pageSize) +
          1;
        self.sum = res.data.data.page.totalCount;
        self.totalPage = res.data.data.page.totalPage;
        for (let item of res.data.data.data) {
          self.tableData.push({
            id: item.id,
            index: self.index,
            gatewayId: item.gatewayId,
            gatewayName: item.gatewayName,
            note: item.note,
            status: item.status
          });
          self.index++;
        }
      });
    },
    modify(row) {
      this.modifyData = {
        visible: true,
        id: row.id,
        gatewayId: row.gatewayId,
        gatewayName: row.gatewayName,
        status: row.status,
        note: row.note
      };
    },
    submitModify(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          this.postRequest("admin/saveEditRunGateway", this.modifyData).then(
            res => {
              self.resAlert(res.data);
              self.modifyData.visible = false;
              self.checkData();
            }
          );
        } else {
          return false;
        }
      });
    },
    add() {
      this.addData.visible = true;
    },
    submitAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          this.postRequest("admin/saveAddRunGateway", this.addData).then(
            res => {
              self.resAlert(res.data);
              self.checkData();
              self.addData = {
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
