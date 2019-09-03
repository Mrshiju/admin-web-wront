<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="客户账号：">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="特服号：">
        <el-input v-model="code"></el-input>
      </el-form-item>
      <!--<el-form-item label="匹配类型：">-->
      <!--<el-select v-model="type" placeholder="请选择">-->
      <!--<el-option-->
      <!--v-for="item in typeOpt"-->
      <!--:key="item.value"-->
      <!--:label="item.label"-->
      <!--:value="item.value">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="关键字级别：">
        <el-select v-model="keyLevel" placeholder="请选择">
          <el-option
            v-for="item in keyLevelOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="信息类型：">
        <el-select v-model="smstype" placeholder="请选择">
          <el-option
            v-for="item in smstypeOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="匹配模板：">
        <el-select v-model="templateFlag" placeholder="请选择">
          <el-option
            v-for="item in templateFlagOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户类型：">
        <el-select v-model="source" placeholder="请选择">
          <el-option
            v-for="item in sourceOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button @click="bulkChangeChosed()" type="text">+批量修改已选择网关</el-button>
      <el-button @click="modifyALLGateway" type="text">+批量修改网关</el-button>
      <el-table
        border
        @selection-change="handleSelectionChange"
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
            <el-button @click="forbidden(scope.row)" type="text">{{scope.row.status===1?'禁用':'启用'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户账号"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="signature" label="对应签名"></el-table-column>
        <el-table-column prop="sourceCn" label="客户类型"></el-table-column>
        <el-table-column prop="cnType" label="匹配类型"></el-table-column>
        <el-table-column prop="cnSmsType" label="信息类型"></el-table-column>
        <el-table-column prop="cnKeyLevel" label="关键字级别"></el-table-column>
        <el-table-column prop="cnTemplateflag" label="匹配模板"></el-table-column>
        <el-table-column prop="checkcount" label="免审条数"></el-table-column>
        <el-table-column prop="cmGatewayName" label="移动网关"></el-table-column>
        <el-table-column prop="cuGatewayName" label="联通网关"></el-table-column>
        <el-table-column prop="ctGatewayName" label="电信网关"></el-table-column>
        <el-table-column prop="oper" label="操作人"></el-table-column>
        <el-table-column prop="modifytime" label="修改时间"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
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
    <el-dialog title="选择性批量修改网关" :visible.sync="bulkChangeChosedData.visible" width="500px">
      <el-form
        :model="bulkChangeChosedData"
        label-width="150px"
        style="width: 400px"
        ref="trialFree"
      >
        <el-form-item label="移动网关：" prop="cm">
          <el-select filterable v-model="bulkChangeChosedData.cm">
            <el-option
              v-for="(item,index) in cmList"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联通网关：" prop="cu">
          <el-select filterable v-model="bulkChangeChosedData.cu">
            <el-option
              v-for="(item,index) in cuList"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电信网关：" prop="ct">
          <el-select filterable v-model="bulkChangeChosedData.ct">
            <el-option
              v-for="(item,index) in ctList"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bulkChangeChosedData.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitBulkChangeChosed">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="批量网关修改" :visible.sync="modifyALLGatewayData.visible" width="500px">
      <el-form
        :model="modifyALLGatewayData"
        label-width="150px"
        style="width: 400px"
        ref="trialFree"
      >
        <el-form-item label="网关类型：" prop="cm">
          <el-select
            filterable
            v-model="modifyALLGatewayData.oper"
            @change="selectGatewayByGatewayType"
          >
            <el-option
              v-for="(item,index) in operOpt"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="切换前网关：" prop="cu">
          <el-select filterable v-model="modifyALLGatewayData.bat_before">
            <el-option
              v-for="(item,index) in beforeList"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="切换后网关：" prop="ct">
          <el-select filterable v-model="modifyALLGatewayData.bat_after">
            <el-option
              v-for="(item,index) in afterList"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyALLGatewayData.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitModifyALLGateway">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="客户免审信息修改" :visible.sync="trialFreeData.visible" width="500px">
      <el-form :model="trialFreeData" label-width="150px" style="width: 400px" ref="trialFree">
        <el-form-item label="客户账号：">
          <el-input disabled v-model="trialFreeData.userName"></el-input>
        </el-form-item>
        <el-form-item label="当前特服号：">
          <el-input disabled v-model="trialFreeData.code"></el-input>
        </el-form-item>
        <el-form-item label="对应签名：">
          <el-input v-model="trialFreeData.sign" disabled></el-input>
        </el-form-item>
        <el-form-item label="移动网关：" prop="cm">
          <el-select filterable v-model="trialFreeData.cm">
            <el-option
              v-for="(item,index) in cmList"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联通网关：" prop="cu">
          <el-select filterable v-model="trialFreeData.cu">
            <el-option
              v-for="(item,index) in cuList"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电信网关：" prop="ct">
          <el-select filterable v-model="trialFreeData.ct">
            <el-option
              v-for="(item,index) in ctList"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义关键词开关：">
          <el-radio-group v-model="trialFreeData.keySwitch">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义关键词：" v-if="trialFreeData.keySwitch===1">
          <el-input v-model="trialFreeData.userDefinedKeyWord"></el-input>
        </el-form-item>
        <el-form-item label="自定义关键词级别：">
          <el-select filterable v-model="trialFreeData.userDefinedKeyLevel">
            <el-option
              v-for="(item,index) in userDefinedKeyLevelOpt"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词级别：">
          <el-select filterable v-model="trialFreeData.keyflag">
            <el-option
              v-for="(item,index) in keyflagOpt"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="免审条数：">
          <el-input v-model="trialFreeData.checkcount"></el-input>
        </el-form-item>
        <el-form-item label="信息类型：">
          <el-radio-group v-model="trialFreeData.smtype">
            <el-radio :label="1">短信</el-radio>
            <el-radio :label="2">彩信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="匹配模板：">
          <el-radio-group v-model="trialFreeData.templateflag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="trialFreeData.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify">保存</el-button>
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
      index: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: true,
      loading: false,
      tableData: [],
      userName: "",
      code: "",
      type: "",
      templateFlag: "",
      source: "",
      keyLevel: "",
      smstype: "",
      typeOpt: [
        {
          label: "所有",
          value: ""
        },
        {
          label: "特服号",
          value: 1
        },
        {
          label: "用户名",
          value: 2
        }
      ],
      keyLevelOpt: [
        {
          label: "所有",
          value: ""
        },
        {
          label: "不过滤",
          value: 0
        },
        {
          label: "特级",
          value: 1
        },
        {
          label: "一级",
          value: 2
        },
        {
          label: "二级",
          value: 3
        },
        {
          label: "三级",
          value: 4
        }
      ],
      smstypeOpt: [
        {
          label: "短信",
          value: 1
        },
        {
          label: "彩信",
          value: 2
        }
      ],
      templateFlagOpt: [
        {
          label: "所有",
          value: ""
        },
        {
          label: "不匹配",
          value: 0
        },
        {
          label: "匹配",
          value: 1
        }
      ],
      sourceOpt: [
        {
          value: "",
          label: "所有"
        },
        {
          value: 2,
          label: "普通接口客户"
        },
        {
          value: 1,
          label: "web用户"
        },
        {
          value: 3,
          label: "cmpp客户"
        }
      ],
      ids: "",
      cmList: [],
      cuList: [],
      ctList: [],
      userDefinedKeyLevelOpt: [
        {
          label: "不过滤",
          value: 0
        },
        {
          label: "特级",
          value: 1
        },
        {
          label: "一级",
          value: 2
        },
        {
          label: "二级",
          value: 3
        },
        {
          label: "三级",
          value: 4
        }
      ],
      keyflagOpt: [
        {
          label: "不过滤",
          value: 0
        },
        {
          label: "特级",
          value: 1
        },
        {
          label: "一级",
          value: 2
        },
        {
          label: "二级",
          value: 3
        },
        {
          label: "三级",
          value: 4
        }
      ],
      trialFreeData: {
        visible: false,
        id: "",
        userName: "",
        code: "",
        cm: "",
        cu: "",
        ct: "",
        keySwitch: "",
        userDefinedKeyWord: "",
        userDefinedKeyLevel: "",
        keyflag: "",
        checkcount: "",
        smtype: "",
        templateflag: ""
      },
      bulkChangeChosedData: {
        visible: false,
        ids: "",
        cm: "",
        cu: "",
        ct: ""
      },
      beforeList: [],
      afterList: [],
      operOpt: [
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
      ],
      modifyALLGatewayData: {
        oper: 1,
        visible: false,
        bat_before: "",
        bat_after: ""
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
      this.postRequest("admin/listCheckManage", {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userName: this.userName,
        code: this.code,
        type: this.type,
        keyLevel: this.keyLevel,
        smstype: this.smstype,
        templateFlag: this.templateFlag,
        source: this.source
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index =
          Number(res.data.data.page.pageNum - 1) *
            Number(res.data.data.page.pageSize) +
          1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            id: item.id,
            index: self.index,
            createtime: item.createtime,
            modifytime: item.modifytime,
            oper: item.oper,
            cuGatewayName: item.cuGatewayName,
            ctGatewayName: item.ctGatewayName,
            cmGatewayName: item.cmGatewayName,
            checkcount: item.checkcount,
            cnTemplateflag: item.cnTemplateflag,
            cnKeyLevel: item.cnKeyLevel,
            cnSmsType: item.cnSmsType,
            cnType: item.cnType,
            sourceCn: item.sourceCn,
            signature: item.signature,
            code: item.code,
            userName: item.userName,
            status: item.status
          });
          self.index++;
        }
      });
    },
    modify(row) {
      let self = this;
      this.cuList = [];
      this.ctList = [];
      this.cmList = [];
      this.postRequest("admin/editCheckManage", {
        id: row.id
      }).then(res => {
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
        self.trialFreeData = {
          visible: true,
          id: res.data.data.checkInfo.id,
          userName: res.data.data.checkInfo.userName,
          code: res.data.data.checkInfo.code,
          cm: res.data.data.checkInfo.cm,
          cu: res.data.data.checkInfo.cu,
          ct: res.data.data.checkInfo.ct,
          keySwitch: res.data.data.checkInfo.keySwitch,
          userDefinedKeyWord: res.data.data.checkInfo.userDefinedKeyWord,
          userDefinedKeyLevel: res.data.data.checkInfo.userDefinedKeyLevel,
          keyflag: res.data.data.checkInfo.keyflag,
          checkcount: res.data.data.checkInfo.checkcount,
          smtype: res.data.data.checkInfo.smtype,
          templateflag: res.data.data.checkInfo.templateflag
        };
      });
    },
    submitModify() {
      let self = this;
      this.postRequest("admin/saveEditCheckManage", this.trialFreeData).then(
        res => {
          self.trialFreeData.visible = false;
          self.checkData();
          self.resAlert(res.data);
        }
      );
    },
    del(row) {
      let self = this;
      this.$confirm(
        "确认删除免审【" + row.userName + ",特服号：" + row.code + "】？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self
            .postRequest("admin/deleteCheckManage", {
              id: row.id
            })
            .then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
        })
        .catch(() => {});
    },
    forbidden(row) {
      let self = this;
      this.$confirm(
        "确认" + row.status === 0
          ? "启动"
          : "禁用" + "【" + row.userName + ",特服号：" + row.code + "】?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self
            .postRequest("admin/enableCheckManage", {
              id: row.id,
              status: row.status === 1 ? 0 : 1
            })
            .then(res => {
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
    bulkChangeChosed() {
      if (this.ids !== "") {
        let self = this;
        this.postRequest("admin/selectBatCheckManage", {
          token: ""
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
          this.bulkChangeChosedData.visible = true;
        });
      } else this.$message.warning("请选择需要修改的网关");
    },
    submitBulkChangeChosed() {
      let self = this;
      this.postRequest("admin/saveSelBatCheckManage", {
        ids: this.ids,
        cm: this.bulkChangeChosedData.cm ? this.bulkChangeChosedData.cm : 0,
        cu: this.bulkChangeChosedData.cu ? this.bulkChangeChosedData.cu : 0,
        ct: this.bulkChangeChosedData.ct ? this.bulkChangeChosedData.ct : 0
      }).then(res => {
        if (res.data.success === true) {
          self.checkData();
          self.bulkChangeChosedData.visible = false;
          self.$message.success(res.data.data);
        } else self.$message.error("网关修改失败");
      });
    },
    modifyALLGateway() {
        let self = this;
        this.beforeList = [];
        this.afterList = [];
        this.modifyALLGatewayData.visible = true;
        this.postRequest("admin/selectGatewayByGatewayType", {
          gatewayType: 1
        }).then(res => {
          for (let item of res.data.data.before) {
            self.beforeList.push({
              label: item.gatewayname,
              value: item.gateway
            });
          }
          for (let item of res.data.data.after) {
            self.afterList.push({
              label: item.gatewayname,
              value: item.gateway
            });
          }
        });
    },
    selectGatewayByGatewayType() {
      let self = this;
      this.beforeList = [];
      this.afterList = [];
      this.postRequest("admin/selectGatewayByGatewayType", {
        gatewayType: this.modifyALLGatewayData.oper
      }).then(res => {
        for (let item of res.data.data.before) {
          self.beforeList.push({
            label: item.gatewayname,
            value: item.gateway
          });
        }
        for (let item of res.data.data.after) {
          self.afterList.push({
            label: item.gatewayname,
            value: item.gateway
          });
        }
      });
    },
    submitModifyALLGateway() {
      let self = this;
      this.postRequest("admin/saveBatCheckManage", {
        batg: {
          oper: this.modifyALLGatewayData.oper,
          bat_before: this.modifyALLGatewayData.bat_before,
          bat_after: this.modifyALLGatewayData.bat_after
        }
      }).then(res => {
        self.modifyALLGatewayData.visible = false;
        self.checkData();
        if (res.data.success === true) {
          self.$message.success(res.data.data);
        } else self.$message.error(res.data.resultMsg);
      });
    }
  }
};
</script>

<style scoped>
</style>
