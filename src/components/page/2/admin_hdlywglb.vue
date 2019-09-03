<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="号段：">
        <el-input v-model="mobile"></el-input>
      </el-form-item>
      <el-form-item label="源网关：">
        <el-input v-model="sourceGateway"></el-input>
      </el-form-item>
      <el-form-item label="路由网关：">
        <el-input v-model="targetGateway"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="addGateway">+添加号码路由</el-button>
      <el-button type="text" @click="bulkDel">+批量删除号码路由</el-button>
      <!--<el-button type="text" @click="addGateway">+批量修改号码路由</el-button>-->
      <el-table
        border
        ref="table"
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSlectionChange"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="50px" prop="index" :indexs="index"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改</el-button>
            <el-button @click="del(scope.row)" type="text">删除</el-button>
            <el-button @click="forbidden(scope.row)" type="text">{{scope.row.status===1?'禁用':'启用'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sourceGatewayName" label="源网关"></el-table-column>
        <el-table-column prop="mobile" label="号段"></el-table-column>
        <el-table-column prop="gatewayName" label="路由网关"></el-table-column>
        <el-table-column prop="cnStatus" label="状态"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加号码路由" :visible.sync="addData.visible" width="500px">
      <el-form
        label-width="120px"
        inline="inline"
        style="width: 400px"
        :model="addData"
        :rules="rule1"
        ref="add"
      >
        <el-form-item label="源网关：" prop="sourceGateway">
          <el-select filterable v-model="addData.sourceGateway ">
            <el-option v-for="(item,i) in gatewayList" :label="item.label" :value="item.value" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="号段：" prop="mobile">
          <el-input v-model="addData.mobile"></el-input>
          <div class="el-upload__tip">多个号段用半角符','分割</div>
        </el-form-item>
        <el-form-item label="路由网关：" prop="targetGateway">
          <el-select filterable v-model="addData.targetGateway ">
            <el-option v-for="(item,i) in gatewayList" :label="item.label" :value="item.value" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" style="width: 220px" v-model="addData.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addData.visible=false">取消</el-button>
        <el-button type="primary" @click="submitAdd">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="号码路由修改" :visible.sync="modifyData.visible" width="500px">
      <el-form
        label-width="120px"
        inline="inline"
        style="width: 400px"
        :model="modifyData"
        :rules="rule1"
        ref="modify"
      >
        <el-form-item label="源网关：">
          <el-select filterable v-model="modifyData.sourceGateway ">
            <el-option v-for="(item,i) in gatewayList" :label="item.label" :value="item.value" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="号段：" prop="mobile">
          <el-input v-model="modifyData.mobile"></el-input>
          <div class="el-upload__tip">只允许填写一个号段</div>
        </el-form-item>
        <el-form-item label="路由网关：">
          <el-select filterable v-model="modifyData.targetGateway ">
            <el-option v-for="(item,i) in gatewayList" :label="item.label" :value="item.value" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" style="width: 220px" v-model="modifyData.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyData.visible=false">取消</el-button>
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
      totalPage: 1000,
      mobile: "",
      sourceGateway: "",
      targetGateway: "",
      remark: "",
      ids: "",
      gatewayList: [],
      addData: {
        visible: false,
        mobile: "",
        sourceGateway: "",
        targetGateway: "",
        remark: ""
      },
      modifyData: {
        id: "",
        visible: false,
        mobile: "",
        sourceGateway: "",
        targetGateway: "",
        remark: ""
      },
      rule1: {
        mobile: [{ required: true, message: "请输入号段", trigger: "blur" }],
        sourceGateway: [
          { required: true, message: "请选择源网关", trigger: "change" }
        ],
        targetGateway: [
          { required: true, message: "请选择路由网关", trigger: "change" }
        ]
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
    indexs(index) {
      return index + 1;
    },
    handleSlectionChange(val) {
      this.ids = "";
      for (let item of val) {
        this.ids += item.id + ",";
      }
      this.ids = this.ids.substring(0, this.ids.length - 1);
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listMobileGatewayRoute", {
        mobile: this.mobile,
        sourceGateway: this.sourceGateway,
        targetGateway: this.targetGateway,
        remark: this.remark,
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
        for (let item of res.data.data.data) {
          self.tableData.push({
            id: item.id,
            sourceGatewayName: item.sourceGatewayName,
            mobile: item.mobile,
            gatewayName: item.gatewayName,
            cnStatus: item.cnStatus,
            remark: item.remark,
            createtime: item.createtime,
            sourceGateway: item.sourceGateway,
            targetGateway: item.targetGateway,
            status: item.status
          });
        }
      });
    },
    addGateway() {
      let self = this;
      this.postRequest("admin/addMobileGatewayRoute", {
        t: ""
      }).then(res => {
        self.gatewayList = [];
        for (let item of res.data.data.gatewayList) {
          if (item.status === 1) {
            self.gatewayList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        this.addData.visible = true;
      });
    },
    submitAdd() {
      let self = this;
      this.$refs.add.validate(valid => {
        if (valid) {
          this.postRequest(
            "admin/saveAddMobileGatewayRoute",
            this.addData
          ).then(res => {
            self.checkData();
            self.addData.visible = false;
            self.resAlert(res.data);
          });
        } else return false;
      });
    },
    bulkDel() {
      let self = this;
      if (this.ids !== "") {
        this.$confirm("确认删除选中的号码路由?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.postRequest("admin/deleteBatchGatewayMobileLocalRoute", {
              ids: this.ids
            }).then(res => {
              self.checkData();
              self.resAlert(res.data);
            });
          })
          .catch(() => {});
      } else this.$message.warning("请选择批量删除号码路由");
    },
    modify(row) {
      let self = this;
      this.postRequest("admin/editMobileGatewayRoute", { id: row.id }).then(
        res => {
          self.gatewayList = [];
          for (let item of res.data.data.gatewayList) {
            if (item.status === 1) {
              self.gatewayList.push({
                value: item.gateway,
                label: item.gatewayname
              });
            }
          }
          self.modifyData = {
            id: row.id,
            visible: true,
            mobile: row.mobile,
            sourceGateway: row.sourceGateway,
            targetGateway: row.targetGateway,
            remark: row.remark
          };
        }
      );
    },
    submitModify() {
      let self = this;
      this.$refs.modify.validate(valid => {
        if (valid) {
          this.postRequest(
            "admin/saveEditMobileGatewayRoute",
            this.modifyData
          ).then(res => {
            self.checkData();
            self.modifyData.visible = false;
            self.resAlert(res.data);
          });
        } else return false;
      });
    },
    del(row) {
      let self = this;
      this.$confirm("确认删除【" + row.mobile + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deleteMobileGatewayRoute", {
            id: row.id
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
          });
        })
        .catch(() => {});
    },
    forbidden(row) {
      let self = this;
      if (row.status === 1) {
        this.$confirm("确认禁用" + "【" + row.mobile + "】?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            self
              .postRequest("admin/enableMobileGatewayRoute", {
                id: row.id,
                status: row.status === 0 ? 1 : 0
              })
              .then(res => {
                self.resAlert(res.data);
                self.checkData();
              });
          })
          .catch(() => {});
      } else {
        this.postRequest("admin/enableMobileGatewayRoute", {
          id: row.id,
          status: row.status === 0 ? 1 : 0
        }).then(res => {
          self.resAlert(res.data);
          self.checkData();
        });
      }
    }
  }
};
</script>

<style scoped>
</style>
