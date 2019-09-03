<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="客户账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="bulkChange">+选择性批量修改网关</el-button>
      <el-button type="text" @click="bulkChange2">+批量修改网关</el-button>
      <el-table
        border
        @selection-change="handleSelectionChange"
        handle
        ref="table"
        v-loading="loading"
        :data="tableData"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改</el-button>
            <el-button @click="del(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户账号"></el-table-column>
        <el-table-column prop="cmgatewayname" label="移动网关"></el-table-column>
        <el-table-column prop="cugatewayname" label="联通网关"></el-table-column>
        <el-table-column prop="ctgatewayname" label="电信网关"></el-table-column>
        <el-table-column prop="creater" label="创建人"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="modifier" label="修改人"></el-table-column>
        <el-table-column prop="modifytime" label="修改时间"></el-table-column>
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
    <el-dialog title="审核路由修改" :visible.sync="modifyData.visible" width="500px">
      <el-form label-width="150px" style="width: 400px;">
        <el-form-item label="客户账号：">
          <el-input disabled v-model="modifyData.userName"></el-input>
        </el-form-item>
        <el-form-item label="移动网关：">
          <el-select filterable v-model="modifyData.cmgateway">
            <el-option
              v-for="item in cmList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联通网关：">
          <el-select filterable v-model="modifyData.cugateway">
            <el-option
              v-for="item in cuList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电信网关：">
          <el-select filterable v-model="modifyData.ctgateway">
            <el-option
              v-for="item in ctList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="modifyData.memo" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyData.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify">确认修改</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择性批量修改网关" :visible.sync="bulkChangeData.visible" width="500px">
      <el-form label-width="150px" style="width: 400px;">
        <el-form-item label="移动网关：">
          <el-select filterable v-model="bulkChangeData.cm">
            <el-option
              v-for="item in cmList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联通网关：">
          <el-select filterable v-model="bulkChangeData.cu">
            <el-option
              v-for="item in cuList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电信网关：">
          <el-select filterable v-model="bulkChangeData.ct">
            <el-option
              v-for="item in ctList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bulkChangeData.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitBulkChange">确认修改</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量修改网关" :visible.sync="bulkChange2Data.visible" width="500px">
      <el-form label-width="150px" style="width: 400px;">
        <el-form-item label="运营商：">
          <el-select filterable v-model="bulkChange2Data.oper" @change="getOper">
            <el-option v-for="(item,i) in operList" :label="item.label" :value="item.value" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修改前网关：">
          <el-select filterable v-model="bulkChange2Data.beforeBatGW">
            <el-option v-for="(item,i) in beforeList" :label="item.label" :value="item.value" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修改后网关：">
          <el-select filterable v-model="bulkChange2Data.afterBatGW">
            <el-option v-for="(item,i) in afterList" :label="item.label" :value="item.value" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="bulkChange2Data.memo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bulkChange2Data.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitBulkChange2">确认修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "A",
  data() {
    return {
      sum: 0,
      index:0,
      pageSize: 30,
      pageNum: 1,
      checkIn: true,
      loading: false,
      tableData: [],
      totalPage: 1000,
      userName: "",
      cuList: [],
      ctList: [],
      cmList: [],
      modifyData: {
        visible: false,
        id: "",
        cmgateway: "",
        cugateway: "",
        ctgateway: "",
        memo: ""
      },
      ids: "",
      bulkChangeData: {
        visible: false,
        cm: "",
        cu: "",
        ct: ""
      },
      operList: [
        {
          label: "中国移动",
          value: 1
        },
        {
          label: "中国联通",
          value: 2
        },
        {
          label: "中国电信",
          value: 3
        }
      ],
      beforeList: [],
      afterList: [],
      bulkChange2Data: {
        visible: false,
        oper: "",
        beforeBatGW: "",
        beforeBatGWName: "",
        afterBatGW: "",
        afterBatGWName: "",
        memo: ""
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
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listClientGwScene", {
        userName: this.userName
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            id: item.id,
            index:self.index,
            userName: item.userName,
            cmgatewayname: item.cmgatewayname,
            cugatewayname: item.cugatewayname,
            ctgatewayname: item.ctgatewayname,
            creater: item.creater,
            createtime: item.createtime,
            modifier: item.modifier,
            modifytime: item.modifytime
          });
          self.index++
        }
      });
    },
    modify(row) {
      let self = this;
      this.postRequest("admin/editClientGwScene", {
        id: row.id
      }).then(res => {
        self.cmList = [];
        self.cuList = [];
        self.ctList = [];
        for (let item of res.data.data.cuList) {
          self.cuList.push({
            label: item.gatewayname,
            value: item.gateway
          });
        }
        for (let item of res.data.data.ctList) {
          self.ctList.push({
            label: item.gatewayname,
            value: item.gateway
          });
        }
        for (let item of res.data.data.cmList) {
          self.cmList.push({
            label: item.gatewayname,
            value: item.gateway
          });
        }
        self.modifyData = {
          visible: true,
          userName: res.data.data.clientGwScene.userName,
          id: res.data.data.clientGwScene.id,
          cmgateway: res.data.data.clientGwScene.cmgateway,
          cugateway: res.data.data.clientGwScene.cugateway,
          ctgateway: res.data.data.clientGwScene.ctgateway,
          memo: res.data.data.clientGwScene.memo
        };
      });
    },
    submitModify() {
      let self = this;
      this.postRequest("admin/saveEditClientGwScene", this.modifyData).then(
        res => {
          self.modifyData.visible = false;
          self.resAlert(res.data);
          self.checkData();
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
          this.postRequest("admin/deleteClientGwScene", {
            id: row.id
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
          });
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.ids = "";
      for (let item of val) {
        this.ids += item.id + ",";
      }
      this.ids = this.ids.substr(0, this.ids.length - 1);
    },
    bulkChange() {
      let self = this;
      if (this.ids !== "") {
        this.postRequest("admin/selectBatGateWayScence", {
          t: ""
        }).then(res => {
          self.cmList = [];
          self.cuList = [];
          self.ctList = [];
          for (let item of res.data.data.cmList) {
            if (item.status === 1) {
              self.cmList.push({
                value: item.gateway,
                label: item.gatewayname
              });
            }
          }
          for (let item of res.data.data.cuList) {
            if (item.status === 1) {
              self.cuList.push({
                value: item.gateway,
                label: item.gatewayname
              });
            }
          }
          for (let item of res.data.data.ctList) {
            if (item.status === 1) {
              self.ctList.push({
                value: item.gateway,
                label: item.gatewayname
              });
            }
          }
          self.bulkChangeData.visible = true;
        });
      } else this.$message.warning("请选择需要修改的记录");
    },
    bulkChange2() {
      // if (this.ids !== '') {
      this.bulkChange2Data.visible = true;
      // } else this.$message.warning('请选择需要修改的网关')
    },
    getOper() {
      let self = this;
      self.beforeList = [];
      self.afterList = [];
      this.postRequest("admin/getGatewayBySp", {
        oper: this.bulkChange2Data.oper
      }).then(res => {
        for (let item of res.data.before) {
          self.beforeList.push({
            value: item.gateway,
            label: item.gatewayName
          });
        }
        for (let item of res.data.after) {
          self.afterList.push({
            value: item.gateway,
            label: item.gatewayName
          });
        }
      });
    },
    submitBulkChange2() {
      let self = this;
      // this.bulkChange2Data.beforeBatGW = this.bulkChange2Data.before.beforeBatGW;
      this.beforeList.forEach(item => {
        if (item.value === this.bulkChange2Data.beforeBatGW)
          this.bulkChange2Data.beforeBatGWName = item.label;
      });
      this.afterList.forEach(item => {
        if (item.value === this.bulkChange2Data.afterBatGW)
          this.bulkChange2Data.afterBatGWName = item.label;
      });
      // this.bulkChange2Data.afterBatGW = this.bulkChange2Data.after.afterBatGW;
      // this.bulkChange2Data.afterBatGWName = this.bulkChange2Data.after.afterBatGWName;
      this.postRequest("admin/saveBatModifyGwScene", this.bulkChange2Data).then(
        res => {
          self.checkData();
          self.bulkChange2Data.visible = false;
          self.resAlert(res.data);
        }
      );
    },
    submitBulkChange() {
      let self = this;
      this.postRequest("admin/saveSelBatGatewayScence", {
        ids: this.ids,
        cm: this.bulkChangeData.cm ? this.bulkChangeData.cm : 0,
        cu: this.bulkChangeData.cu ? this.bulkChangeData.cu : 0,
        ct: this.bulkChangeData.ct ? this.bulkChangeData.ct : 0
      }).then(res => {
        if (res.data.success === true) {
          self.checkData();
          self.bulkChangeData.visible = false;
          self.$message.success(res.data.data);
        } else {
          self.bulkChangeData.visible = false;
          self.$message.error("修改失败");
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
