<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px">
      <el-form-item label="用户名：">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="模板：">
        <el-input v-model="template"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="status">
          <el-option v-for="(item,index) of statusOpt" :label="item.label" :value="item.value" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型：">
        <el-select v-model="type">
          <el-option v-for="(item,index) of typeOpt" :label="item.label" :value="item.value" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="add">+添加内容模板</el-button>
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
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="template" label="模板"></el-table-column>
        <el-table-column prop="statusCn" label="状态"></el-table-column>
        <el-table-column prop="typeCn" label="类型"></el-table-column>
        <el-table-column prop="oper" label="操作人"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="modifytime" label="最后操作时间"></el-table-column>
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
      <el-dialog title="修改通道号段屏蔽" :visible.sync="modifyData.visible" width="500px">
        <el-form
          :model="modifyData"
          label-width="120px"
          style="width: 400px"
          :rules="rule1"
          ref="modifyData"
        >
          <el-form-item label="用户名：" prop="userName">
            <el-select v-model="modifyData.userName" filterable>
              <el-option
                v-for="item of cosList"
                :label="item.label+'_'+item.value"
                :value="item.label+'_'+item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板：" prop="template">
            <el-input type="textarea" v-model="modifyData.template"></el-input>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select v-model="modifyData.type">
              <el-option
                v-for="item of typeOpt"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitModify('modifyData')">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加内容模板" :visible.sync="addData.visible" width="500px">
        <el-form
          :model="addData"
          label-width="120px"
          style="width: 400px"
          :rules="rule1"
          ref="addData"
        >
          <el-form-item label="用户名：">
            <el-select v-model="addData.userName" filterable>
              <el-option
                v-for="item of cosList"
                :label="item.label+'_'+item.value"
                :value="item.label+'_'+item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板：" prop="template">
            <el-input type="textarea" v-model="addData.template"></el-input>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select v-model="addData.type">
              <el-option
                v-for="item of typeOpt"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
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
      userName: "",
      template: "",
      status: "",
      type: "",
      cosList: [],
      statusOpt: [
        { label: "全部", value: "" },
        { label: "禁用", value: 0 },
        { label: "启用", value: 1 }
      ],
      typeOpt: [{ label: "拒绝", value: 0 }, { label: "通过", value: 1 }],
      choosed: [],
      mobileSection: "",
      tableData: [],
      gatewayList: [],
      modifyData: {
        visible: false
      },
      addData: {
        visible: false,
        userName: "",
        template: "",
        type: ""
      },
      rule1: {
        template: [{ required: true, message: "不能为空", trigger: "blur" }]
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
    handleCommand(command) {
      this[command.name] = true;
    },
    handleSelectionChange(val) {
      this.choosed = val;
      // console.log(this.choosedGateway);
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listCheckContent", {
        userName: this.userName,
        template: this.template,
        status: this.status,
        type: this.type,
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
            index:self.index,
            id: item.id,
            accountID: item.accountID,
            userName: item.userName + "_" + item.id,
            template: item.template,
            type: item.type,
            status: item.status,
            createtime: item.createtime,
            modifytime: item.modifytime,
            oper: item.oper,
            typeCn: item.typeCn,
            statusCn: item.statusCn
          });
          self.index++;
        }
      });
    },
    modify(row) {
      this.modifyData = {
        id: row.id,
        userName: row.userName,
        template: row.template,
        type: row.type,
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
          this.postRequest("admin/saveBatchAddCheckContent", {
            userName: self.addData.userName,
            checkContents: [
              {
                template: self.addData.template,
                type: self.addData.type
              }
            ]
          }).then(res => {
            self.resAlert(res.data);
            self.addData = {
              visible: false,
              userName: "",
              template: "",
              type: ""
            };
            self.checkData();
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
            "admin/saveUpdateCheckContent",
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
      this.$confirm("确认删除【" + row.template + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deleteCheckContent", {
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
        `确认${row.status === 0 ? "启用" : "禁用"}【${row.template}】?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self
            .postRequest("admin/changeStartCheckContent", {
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
    this.postRequest("admin/listAllCustomers", { t: "" }).then(res => {
      for (let item of res.data.data) {
        self.cosList.push({
          value: item.id,
          label: item.userName
        });
      }
    });
  }
};
</script>

<style scoped>
</style>
