<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="客户账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="模板内容：">
        <el-input  v-model="template"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="bulkDel">+批量客户模板删除</el-button>
      <el-button type="text" @click="pre">+批量短信签名前置</el-button>
      <el-button type="text" @click="postposition">+批量短信签名后置</el-button>
      <el-table
        border
        ref="table"
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
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
        <el-table-column prop="cnIsMobileLimit" label="号码限制"></el-table-column>
        <el-table-column prop="mobileLimit" label="限制次数"></el-table-column>
        <el-table-column prop="limitMins" label="时间段（分）"></el-table-column>
        <el-table-column prop="mobileLimitHour" label="每小时号码限制"></el-table-column>
        <el-table-column prop="mobileLimitDay" label="每天号码限制"></el-table-column>
        <el-table-column prop="template" label="模板内容"></el-table-column>
        <el-table-column prop="cnIsRouter" label="模板路由"></el-table-column>
        <el-table-column width="150" prop="cmGatewayName" label="移动网关"></el-table-column>
        <el-table-column width="150" prop="cuGatewayName" label="联通网关"></el-table-column>
        <el-table-column width="150" prop="ctGatewayName" label="电信网关"></el-table-column>
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
         layout="sizes, prev, pager, next, jumper"
        :total="sum"
      ></el-pagination>
      <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
    </el-card>
    <el-dialog title="模板修改" :visible.sync="modifyData.visible" width="500px">
      <el-form
        label-width="150px"
        style="width: 400px;"
        :model="modifyData"
        ref="form1"
        :rules="rule1"
      >
        <el-form-item label="客户账号：">
          <el-input disabled v-model="modifyData.userName"></el-input>
        </el-form-item>
        <el-form-item label="模板路由：">
          <el-radio-group v-model="modifyData.isRoute">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="移动网关：">
          <el-select filterable v-model="modifyData.cm">
            <el-option
              v-for="item in cmList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联通网关：">
          <el-select filterable v-model="modifyData.cu">
            <el-option
              v-for="item in cuList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电信网关：">
          <el-select filterable v-model="modifyData.ct">
            <el-option
              v-for="item in ctList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="号码限制：">
          <el-radio-group v-model="modifyData.isMobileLimit">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="限制条数：">
          <el-input v-model="modifyData.mobileLimit"></el-input>
        </el-form-item>
        <el-form-item label="时间间隔：">
          <el-input v-model="modifyData.limitMins"></el-input>
        </el-form-item>
        <el-form-item label="每小时号码限制：" prop="mobileLimitHour">
          <el-input v-model="modifyData.mobileLimitHour"></el-input>
        </el-form-item>
        <el-form-item label="每天号码限制：" prop="mobileLimitDay">
          <el-input v-model="modifyData.mobileLimitDay"></el-input>
        </el-form-item>
        <el-form-item label="模板：">
          <el-input v-model="modifyData.template" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyData.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify">确认修改</el-button>
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
      cmList: [],
      cuList: [],
      ctList: [],
      totalPage: 1000,
      userName: "",
      template: "",
      selection: "",
      modifyData: {
        visible: false,
        id: "",
        userName: "",
        isRoute: "",
        cm: "",
        cu: "",
        ct: "",
        isMobileLimit: "",
        mobileLimit: "",
        limitMins: "",
        mobileLimitHour: "",
        mobileLimitDay: "",
        template: ""
      },
      rule1: {
        mobileLimitHour: {
          required: true,
          message: "请输入每小时号码限制",
          trigger: "blur"
        },
        mobileLimitDay: {
          required: true,
          message: "请输入每天号码限制",
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
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listCheckTemplate", {
        userName: this.userName,
        template: this.template,
        pageNum: this.pageNum,
        pageSize: this.pageSize
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
            cnIsMobileLimit: item.cnIsMobileLimit,
            mobileLimit: item.mobileLimit,
            limitMins: item.limitMins,
            mobileLimitHour: item.mobileLimitHour,
            mobileLimitDay: item.mobileLimitDay,
            template: item.template,
            cnIsRouter: item.cnIsRouter,
            cmGatewayName: item.cmGatewayName,
            ctGatewayName: item.ctGatewayName,
            cuGatewayName: item.cuGatewayName,
            oper: item.oper,
            modifytime: item.modifytime,
            createtime: item.createtime
          });
          self.index++
        }
      });
    },
    handleSelectionChange(val) {
      this.selection = "";
      for (let item of val) {
        this.selection += item.id + ",";
      }
      this.selection = this.selection.substr(0, this.selection.length - 1);
    },
    bulkDel() {
      let self = this;
      if (this.selection !== "") {
        this.$confirm("确认批量删除勾选的客户模板吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.postRequest("admin/deleteBatchCheckTemplate", {
              ids: self.selection
            }).then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
          })
          .catch(() => {});
      } else this.$message.warning("请选择需要删除的客户模板");
    },
    pre() {
      let self = this;
      if (this.selection !== "") {
        this.$confirm("确认批量前置勾选的客户模板吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.postRequest("admin/updateBatchCheckTemplate", {
              ids: self.selection,
              operation: "before"
            }).then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
          })
          .catch(() => {});
      } else this.$message.warning("请选择需要前置的客户模板");
    },
    postposition() {
      let self = this;
      if (this.selection !== "") {
        this.$confirm("确认批量后置勾选的客户模板吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.postRequest("admin/updateBatchCheckTemplate", {
              ids: self.selection,
              operation: "after"
            }).then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
          })
          .catch(() => {});
      } else this.$message.warning("请选择需要后置的客户模板");
    },
    modify(row) {
      let self = this;
      this.postRequest("admin/editCheckTemplate", {
        id: row.id
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
        self.modifyData = {
          visible: true,
          id: res.data.data.template.id,
          userName: res.data.data.template.userName,
          isRoute: res.data.data.template.isRoute,
          cm:
            res.data.data.template.cm === 0
              ? res.data.data.template.cmGatewayName
              : res.data.data.template.cm,
          cu:
            res.data.data.template.cu === 0
              ? res.data.data.template.cuGatewayName
              : res.data.data.template.cu,
          ct:
            res.data.data.template.ct === 0
              ? res.data.data.template.ctGatewayName
              : res.data.data.template.ct,
          isMobileLimit: res.data.data.template.isMobileLimit,
          mobileLimit: res.data.data.template.mobileLimit,
          limitMins: res.data.data.template.limitMins,
          mobileLimitHour: res.data.data.template.mobileLimitHour,
          mobileLimitDay: res.data.data.template.mobileLimitDay,
          template: res.data.data.template.template
        };
      });
    },
    submitModify() {
      let self = this;
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveEditCheckTemplate", this.modifyData).then(
            res => {
              self.checkData();
              self.modifyData.visible = false;
              self.resAlert(res.data);
            }
          );
        } else return false;
      });
    },
    del(row) {
      let self = this;
      this.$confirm("确认删除【" + row.userName + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deleteCheckTemplate", {
            id: row.id
          }).then(res => {
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
