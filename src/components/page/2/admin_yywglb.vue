<template>
  <div class="container">
    <el-button type="text" @click="dialogFormVisible = true">+添加网关</el-button>
    <!-- 添加网关弹出框 -->
    <el-dialog title="添加网关" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="网关编号：" prop="gatewayId">
          <el-input v-model="form.gatewayId" autocomplete="off" placeholder="1-3协议;4-6供应商;7-9序号"></el-input>
        </el-form-item>

        <el-form-item label="网关名称：" prop="gatewayName">
          <el-input v-model="form.gatewayName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="网关内容：" prop="gatewayContent">
          <el-input v-model="form.gatewayContent" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select v-model="form.status">
            <el-option
              v-for="item in addGatewayOptions"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addGateway('form')">添加</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </div>
    </el-dialog>

    <!-- 修改信息操作弹出框 -->
    <el-dialog title="修改信息" :visible.sync="modifyDataVisible">
      <el-form :model="modifyDataForm" :rules="rules" ref="modifyDataForm" label-width="120px">
        <el-form-item label="网关名称：" prop="gatewayName">
          <el-input v-model="modifyDataForm.gatewayName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="网关内容：" prop="gatewayContent">
          <el-input v-model="modifyDataForm.gatewayContent" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select v-model="modifyDataForm.status">
            <el-option
              v-for="item in modifyDataForm.options"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('modifyDataForm')">保存</el-button>
        <el-button @click="resetForm('modifyDataForm')">取消</el-button>
      </div>
    </el-dialog>

    <el-form label-width="120px" inline="inline">
      <el-form-item label="网关编号：">
        <el-input  v-model="gatewayId"></el-input>
      </el-form-item>
      <el-form-item label="网关名称：">
        <el-input  v-model="gatewayName"></el-input>
      </el-form-item>
      <el-form-item label="网关内容：">
        <el-input  v-model="gatewayContent"></el-input>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select v-model="status">
          <el-option
            v-for="item in options"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="forbidData(scope.row)">{{scope.row.status===0?"启用":"禁用"}}</el-button>
            <el-button type="text" @click="modifyData(scope.row)">修改信息</el-button>
            <el-button type="text" @click="deleteDate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="gatewayId" label="网关编号"></el-table-column>
        <el-table-column prop="gatewayName" label="网关名称"></el-table-column>
        <el-table-column prop="gatewayContent" label="网关内容"></el-table-column>
        <el-table-column prop="statusCn" label="状态"></el-table-column>
        <el-table-column prop="createUser" label="创建人"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      modifyDataVisible: false,
      rules: {
        gatewayId: [{ required: true, message: "不能为空", trigger: "blur" }],
        gatewayName: [{ required: true, message: "不能为空", trigger: "blur" }],
        gatewayContent: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      },
      //添加网关表单数据
      form: {
        gatewayId: "",
        gatewayName: "",
        gatewayContent: "",
        status: ""
      },
      addGatewayOptions: [
        { key: 0, value: 0, label: "不可用" },
        { key: 1, value: 1, label: "可用" }
      ],
      //修改操作表单数据
      modifyDataForm: {
        id: "",
        gatewayName: "",
        gatewayContent: "",
        status: "",
        options: [
          { key: 0, value: 0, label: "不可用" },
          { key: 1, value: 1, label: "可用" }
        ]
      },
      index: 0,
      pageNum: 1,
      pageSize: 30,
      gatewayId: "",
      gatewayName: "",
      gatewayContent: "",
      status: 99,
      sum: 0,
      tableData: [],
      checkIn: false,
      loading: false,
      options: [
        {
          key: 99,
          value: 99,
          label: "所有"
        },
        {
          key: 1,
          value: 1,
          label: "可用"
        },
        {
          key: 0,
          value: 0,
          label: "不可用"
        }
      ]
    };
  },
  methods: {
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    failed(message) {
      this.$message.error(message);
    },
    //禁用、启用操作
    forbidData(row) {
      let self = this;
      this.$confirm(
        `此操作将禁用/启用网关：${row.gatewayName}, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self
            .postRequest("admin/startCallGateway", {
              id: row.id,
              status: row.status === 0 ? 1 : 0
            })
            .then(res => {
              if (res.data.success) {
                self.succeed(res.data.message);
                self.checkData();
              } else {
                self.failed(res.data.message);
              }
            });
        })
        .catch(() => {});
    },
    //删除操作
    deleteDate(row) {
      let self = this;
      this.$confirm(`此操作将删除网关：${row.gatewayName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/deleteCallGateway", {
              id: row.id
            })
            .then(res => {
              if (res.data.success) {
                self.succeed(res.data.message);
                self.checkData();
              } else {
                self.failed(res.data.message);
              }
            });
        })
        .catch(() => {});
    },
    //修改操作
    modifyData(row) {
      this.modifyDataVisible = true;
      this.modifyDataForm.id = row.id;
      this.modifyDataForm.gatewayName = row.gatewayName;
      this.modifyDataForm.gatewayContent = row.gatewayContent;
      this.modifyDataForm.status = row.status;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.modifyDataVisible = false;
          let self = this;
          this.postRequest("admin/updateCallGateway", {
            id: self.modifyDataForm.id,
            gatewayName: self.modifyDataForm.gatewayName,
            gatewayContent: self.modifyDataForm.gatewayContent,
            status: self.modifyDataForm.status
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.message);
              self.checkData();
            } else {
              self.failed(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.modifyDataVisible = false;
      this.form = {};
    },

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
      this.postRequest("admin/callgatewaylist", {
        createUser: this.createUser,
        createTime: this.createTime,
        gatewayId: this.gatewayId,
        gatewayName: this.gatewayName,
        gatewayContent: this.gatewayContent,
        status: this.status,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            createUser: item.create_user,
            createTime: item.create_time,
            gatewayId: item.gateway_id,
            gatewayName: item.gateway_name,
            gatewayContent: item.gateway_content,
            id: item.id,
            status: item.status,
            statusCn:
              item.status === 0 ? "不可用" : item.status === 1 ? "可用" : "" //判断状态：0：不可用 1：可用 2：所有
          });
          self.index++;
        }
      });
    },
    //添加网关
    addGateway(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          this.dialogFormVisible = false;
          this.postRequest("admin/saveAddCallGateway", {
            gatewayId: this.form.gatewayId,
            gatewayName: this.form.gatewayName,
            gatewayContent: this.form.gatewayContent,
            status: this.form.status
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.message);
              self.checkData();
            } else {
              self.failed(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.checkData();
  }
};
</script>

<style scoped>
</style>
