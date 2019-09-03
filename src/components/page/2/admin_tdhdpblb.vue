<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px">
      <el-form-item label="网关：">
        <el-input v-model="gateway"></el-input>
      </el-form-item>
      <el-form-item label="号段：">
        <el-input v-model="mobileSection"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="add">+添加通道号段屏蔽</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改</el-button>
            <el-button @click="del(scope.row)" type="text">删除</el-button>
            <el-button @click="forbidden(scope.row)" type="text">{{scope.row.status===1?'禁用':'启用'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="gateway" label="通道网关"></el-table-column>
        <el-table-column prop="mobileSection" label="号段"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.status==1?'正常':'禁用'}}</template>
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
      <el-dialog title="修改通道号段屏蔽（只允许填写一个号段）" :visible.sync="modifyData.visible" width="500px">
        <el-form
          :model="modifyData"
          label-width="120px"
          style="width: 400px"
          :rules="rule1"
          ref="modifyData"
        >
          <el-form-item label="号段：" prop="mobileSection">
            <el-input v-model="modifyData.mobileSection"></el-input>
          </el-form-item>
          <el-form-item label="网关通道：">
            <el-select v-model="modifyData.gateway" filterable>
              <el-option v-for="(item,i) of gatewayList" :label="item.label" :value="item.value" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="modifyData.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitModify('modifyData')">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加通道号码屏蔽" :visible.sync="addData.visible" width="500px">
        <el-form
          :model="addData"
          label-width="120px"
          style="width: 400px"
          :rules="rule1"
          ref="addData"
        >
          <el-form-item label="号段：" prop="mobileSection">
            <el-input v-model="addData.mobileSection"></el-input>
            <div class="el-upload__tip">多个号段用半角符逗号","分隔</div>
          </el-form-item>
          <el-form-item label="网关通道：" prop="gateway">
            <el-select v-model="addData.gateway" filterable>
              <el-option v-for="(item,i) of gatewayList" :label="item.label" :value="item.value" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="addData.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd('addData')">保存</el-button>
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
      gateway: "",
      mobileSection: "",
      tableData: [],
      gatewayList: [],
      modifyData: {
        visible: false
      },
      addData: {
        visible: false,
        mobileSection: "",
        gateway: "",
        remark: ""
      },
      rule1: {
        mobileSection: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        gateway: [{ required: true, message: "不能为空", trigger: "blur" }]
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
      this.postRequest("admin/listGatewayMobileSection", {
        gateway: this.gateway,
        mobileSection: this.mobileSection,
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
            gateway: item.gateway,
            mobileSection: item.mobileSection,
            remark: item.remark,
            createtime: item.createtime,
            status: item.status
          });
          self.index++
        }
      });
    },
    modify(row) {
      this.modifyData = {
        id: row.id,
        mobileSection: row.mobileSection,
        gateway: row.gateway,
        remark: row.remark,
        visible: true
      };
    },
    add() {
      this.addData.visible = true;
    },
    submitAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          this.postRequest(
            "admin/saveAddGatewayMobileSection",
            this.addData
          ).then(res => {
            self.resAlert(res.data);
            self.checkData();
            this.addData = {
              visible: false,
              mobileSection: "",
              gateway: "",
              remark: ""
            };
          });
        } else {
          return false;
        }
      });
    },
    submitModify(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          this.postRequest(
            "admin/saveAddGatewayMobileSection",
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
    del(row) {
      let self = this;
      this.$confirm("确认删除【" + row.mobileSection + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deleteGatewayMobileSection", {
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
      this.$confirm(
        `确认${row.status === 0 ? "启用" : "禁用"}【${row.mobileSection}】?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self
            .postRequest("admin/lockGatewayMobileSectionStatus", {
              id: row.id,
              status: row.status === 0 ? 1 : 0
            })
            .then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
        })
        .catch(() => {});
    }
  },
  beforeCreate() {
    let self = this;
    this.postRequest("admin/getGatewayList", { t: "" }).then(res => {
      self.gatewayList = [];
      let XXX = [];
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
  }
};
</script>

<style scoped>
</style>
