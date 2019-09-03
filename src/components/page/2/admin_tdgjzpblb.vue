<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="网关：">
        <el-input v-model="gateway"></el-input>
      </el-form-item>
      <el-form-item label="关键字：">
        <el-input v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="add">+添加通道关键字屏蔽</el-button>
      <el-button type="text" @click="batchDel">+批量删除通道关键字屏蔽</el-button>
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
        <el-table-column prop="gateway" label="通道网关"></el-table-column>
        <el-table-column prop="keyword" label="关键字"></el-table-column>
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
      <el-dialog title="修改通道关键字屏蔽（只允许填写一个关键字）" :visible.sync="modifyData.visible" width="500px">
        <el-form
          :model="modifyData"
          label-width="120px"
          style="width: 400px"
          :rules="rule1"
          ref="modifyData"
        >
          <el-form-item label="关键字：" prop="keyword">
            <el-input v-model="modifyData.keyword"></el-input>
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
      <el-dialog title="添加通道关键字屏蔽" :visible.sync="addData.visible" width="500px">
        <el-form
          :model="addData"
          label-width="120px"
          style="width: 400px"
          :rules="rule1"
          ref="addData"
        >
          <el-form-item label="关键字：">
            <el-input v-model="addData.gatewayKeywordSections.keyword"></el-input>
            <div class="el-upload__tip">多个关键字用半角符逗号","分隔</div>
          </el-form-item>
          <el-form-item label="网关通道：">
            <el-select v-model="addData.gatewayKeywordSections.gateway" filterable>
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
      keyword: "",
      tableData: [],
      gatewayList: [],
      choosed: [],
      modifyData: {
        visible: false
      },
      addData: {
        visible: false,
        gatewayKeywordSections: {
          keyword: "",
          gateway: ""
        },
        remark: ""
      },
      rule1: {
        keyword: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      ids: ""
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
      let idsArr = [];
      // this.choosed = val;
      if (val.length) {
        for (let item of val) {
          idsArr.push(item.id);
        }
      }
      this.ids = idsArr.join(",");
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listGatewayKeywordSection", {
        gateway: this.gateway,
        keyword: this.keyword,
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
            keyword: item.keyword,
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
        keyword: row.keyword,
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
          this.postRequest("admin/saveAddGatewayKeywordSections", {
            gatewayKeywordSections: [
              {
                gateway: this.addData.gatewayKeywordSections.gateway,
                keyword: this.addData.gatewayKeywordSections.keyword
              }
            ],
            remark: this.addData.remark
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
            self.addData = {
              visible: false,
              gatewayKeywordSections: {
                keyword: "",
                gateway: ""
              },
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
            "admin/saveAddGatewayKeywordSection",
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
      this.$confirm("确认删除【" + row.keyword + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deleteGatewayKeywordSection", {
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
        `确认${row.status === 0 ? "启用" : "禁用"}【${row.keyword}】?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self
            .postRequest("admin/lockGatewayKeywordSectionStatus", {
              id: row.id,
              status: row.status === 0 ? 1 : 0
            })
            .then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
        })
        .catch(() => {});
    },
    batchDel() {
      let self = this;
      if (this.ids !== "") {
        this.postRequest("admin/deleteGatewayKeywordSections", {
          ids: this.ids
        }).then(res => {
          self.resAlert(res.data);
          self.checkData();
        });
      } else this.$message.warning("请选择需要删除的通道关键字");
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
