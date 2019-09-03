<template>
  <div class="container">
    <el-button type="text" @click="addEmployee">+新建系统账号</el-button>
    <el-form label-width="120px" inline="inline" v-on:keyup.enter.native="checkData">
      <el-form-item label="账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>

      <el-form-item label="所属部门：">
        <el-select v-model="deptID">
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

    <!-- 新建系统账号弹出框 -->
    <el-dialog title="新建系统账号" :visible.sync="dialogFormVisible">
      <div class="el-dialog__body" width="600" height="540px">
        <div class="Tree">
          <el-tree
            :data="deptList"
            :props="defaultProps"
            @node-click="handleNodeClick"
            default-expand-all
            :expand-on-click-node="false"
          ></el-tree>
        </div>
        <div class="infoForm">
          <div class="formWrap" v-if="formFlag">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
              <el-form-item label="登录用户名：" :label-width="formLabelWidth" prop="userName">
                <el-input v-model="form.userName" autocomplete="off" placeholder="英文或数字"></el-input>
              </el-form-item>
              <el-form-item label="部门名称：" :label-width="formLabelWidth" prop="deptName">
                <el-input v-model="form.deptName" autocomplete="off" :disabled="true"></el-input>
              </el-form-item>

              <el-form-item label="用户姓名：" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="联系电话：" :label-width="formLabelWidth" prop="mobile">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>

            <el-button type="primary" @click="saveAdd('form')" class="btn">更新菜单</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 修改权限弹出框 -->
    <el-dialog title="系统账号权限修改" :visible.sync="updateAuthRoleFlag">
      <div class="el-dialog__body" height="540px">
        <div class="formWrap">
          <el-form
            :model="updateAuthRoleForm"
            :rules="rules"
            ref="updateAuthRoleForm"
            label-width="120px"
          >
            <el-form-item label="用户账号：" :label-width="formLabelWidth">
              <el-input v-model="updateAuthRoleForm.userName" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="当前角色：" :label-width="formLabelWidth">
              <el-input v-model="updateAuthRoleForm.roleName" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="新角色："  prop="newRoleName">
              <el-select v-model="updateAuthRoleForm.newRoleName">
                <el-option
                  v-for="item in updateAuthRoleOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveUpdateAuthRole('updateAuthRoleForm')">保存</el-button>
        <el-button @click="resetForm('updateAuthRoleForm')">取消</el-button>
      </div>
    </el-dialog>

    <!-- 修改信息弹出框 -->
    <el-dialog title="系统账号信息修改" :visible.sync="updateEmployeeFlag">
      <div class="el-dialog__body" height="540px">
        <div class="formWrap">
          <el-form
            :model="updateEmployeeForm"
            :rules="rules"
            ref="updateEmployeeForm"
            label-width="120px"
          >
            <el-form-item label="用户账号：" :label-width="formLabelWidth">
              <el-input v-model="updateEmployeeForm.userName" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="用户姓名：" :label-width="formLabelWidth" prop="nickName">
              <el-input v-model="updateEmployeeForm.nickName" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="联系电话：" :label-width="formLabelWidth" prop="mobile">
              <el-input v-model="updateEmployeeForm.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveUpdateEmployee('updateEmployeeForm')">保存</el-button>
        <el-button @click="resetForm('updateEmployeeForm')">取消</el-button>
      </div>
    </el-dialog>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="operation" label="操作" width="250px">
          <template slot-scope="scope">
            <el-button type="text" @click="updateAuthRole(scope.row)">修改权限</el-button>
            <el-button type="text" @click="updateEmployee(scope.row)">修改信息</el-button>
            <el-button type="text" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button
              type="text"
              @click="updateStatus(scope.row)"
            >{{scope.row.cnStatus==="正常"?"禁用":"启用"}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="deptName" label="所属部门"></el-table-column>
        <el-table-column prop="roleName" label="权限角色"></el-table-column>
        <el-table-column prop="name" label="用户姓名"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="creatorUserName" label="创建人"></el-table-column>
        <el-table-column prop="created" label="创建时间"></el-table-column>
        <el-table-column prop="modifyUserName" label="修改人"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间"></el-table-column>
        <!-- 1:正常;2:禁用 -->
        <el-table-column prop="cnStatus" label="状态"></el-table-column>
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
      updateEmployeeFlag: false,
      updateAuthRoleFlag: false,
      dialogFormVisible: false,
      formFlag: false,
      deptList: [
        {
          label: "部门列表",
          deptName: "部门列表",
          seq: 0,
          children: []
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      form: {
        id: "",
        deptName: "",
        userName: "",
        deptID: "",
        name: "",
        mobile: ""
      },
      updateAuthRoleForm: {
        userName: "",
        roleName: "",
        newRoleName: ""
      },
      updateEmployeeForm: {
        userName: "",
        nickName: "",
        mobile: "",
        accountID: ""
      },
      formLabelWidth: "120px",
      rules: {
        deptName: [{ required: true, message: "不能为空", trigger: "blur" }],
        newRoleName: [{ required: true, message: "不能为空", trigger: "blur" }],
        mobile: [{ required: true, message: "不能为空", trigger: "blur" }],
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        nickName: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      options: [
        {
          key: 0,
          label: "所有",
          value: ""
        }
      ],
      updateAuthRoleOptions: [],
      userName: "",
      deptID: "",

      id: "",
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      tableData: [],
      checkIn: false,
      loading: false,
      index: 0
    };
  },
  methods: {
    //新建系统账号
    addEmployee() {
      this.form = {};
      this.deptList = [
        {
          label: "部门列表",
          deptName: "部门列表",
          seq: '',
          children: []
        }
      ];
      this.dialogFormVisible = true;
      let self = this;
      let fathers = [];
      let children = [];
      this.postRequest("admin/getAddEmployeeDeptList", {}).then(res => {
          for (let item of res.data.data.deptList) {
              if (item.pdeptName == '') {
                  fathers.push({
                      label: item.deptName,
                      deptName: item.deptName,
                      id: item.id,
                      seq: item.seq,
                      note: item.note,
                      zid: item.zid,
                      zpid: item.zpid,
                      children: []
                  })
              } else {
                  children.push({
                      label: item.deptName,
                      deptName: item.deptName,
                      id: item.id,
                      seq: item.seq,
                      note: item.note,
                      pdeptName: item.pdeptName,
                      zid: item.zid,
                      zpid: item.zpid,
                      children: []
                  })
              }
          }
          for (let child of children) {
              for (let fatherItem of fathers) {
                  if (child.zpid == fatherItem.zid) {
                      fatherItem.children.push(child);
                  }
              }
          }
          for (let father of fathers) {
              self.deptList[0].children.push({
                  label: father.deptName,
                  deptName: father.deptName,
                  id: father.id,
                  pdeptId: father.pdeptId,
                  seq: father.seq,
                  zid: father.zid,
                  zpid: father.zpid,
                  note: father.note,
                  children: father.children
              });
          }
          ;
      });
    },
    //节点点击事件
    handleNodeClick(data) {
      this.formFlag = true;

      if(data.seq ==='') {
          this.formFlag = false;
          return;
      }

      if (data.children.length >0) {
          this.formFlag = false;
          return;
      }

      this.form = {
        id: data.id,
        deptName: data.deptName,
        userName: "",
        deptID: data.deptID,
        name: "",
        mobile: ""
      };
    },
    //保存新建系统账号
    saveAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formFlag = false;
          let self = this;
          let params = `${this.form.userName},${this.form.deptName},${
            this.form.name
          },${this.form.mobile},`;
          this.postRequest("/admin/saveAddEmployee", { params: params }).then(
            res => {
              if (res.data.success) {
                this.succeed(res.data.message);
                this.checkData();
              } else {
                this.failed(res.data.message);
              }
            }
          );
        } else {
          return false;
        }
      });
    },
    //修改权限操作
    updateAuthRole(row) {
      this.updateAuthRoleForm = {
        userName: row.userName,
        roleName: row.roleName,
        newRole: ""
      };
      this.updateAuthRoleFlag = true;
      this.updateAuthRoleOptions = [];
      let self = this;
      this.postRequest("admin/getUpdateAuthRole", {
        userName: row.userName,
        roleName: row.roleName,
        type: "sys_update_roleName"
      }).then(res => {
        for (let item of res.data.data.roleList) {
          self.updateAuthRoleOptions.push({
            key: item.id,
            label: item.roleName,
            value: item.roleName
          });
        }
      });
    },
    //保存修改权限操作
    saveUpdateAuthRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateAuthRoleFlag = false;
          let self = this;
          this.postRequest("admin/saveUpdateAuthRole", {
            userName: this.updateAuthRoleForm.userName,
            roleName: this.updateAuthRoleForm.roleName,
            newRoleName: this.updateAuthRoleForm.newRoleName,
            type: "sys_update_roleName"
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
    //修改信息操作
    updateEmployee(row) {
      this.updateEmployeeFlag = true;
      let self = this;
      this.updateEmployeeForm = {
        userName: row.userName,
        accountID: row.accountID,
        nickName: row.name,
        mobile: row.mobile
      };
      this.postRequest("admin/getListUpdateEmployee", {
        accountID: row.accountID
      }).then(res => {
        let userDetail = res.data.data.userDetail;
        // self.updateEmployeeForm = {
        //   userName: userDetail.userName,
        //   accountID: userDetail.accountID,
        //   nickName: userDetail.nickName,
        //   mobile: userDetail.mobile
        // };
      });
    },
    // 保存修改信息操作
    saveUpdateEmployee(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateEmployeeFlag = false;
          let self = this;
          this.postRequest("admin/saveUpdateEmployee", {
            userDetailView: this.updateEmployeeForm
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
    //重置密码操作
    resetPassword(row) {
      let self = this;
      this.$confirm(`确定要重置用户：${row.userName} 的密码？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/resetPassword", {
              accountID: row.accountID,
              type: "sys_reset_password"
            })
            .then(res => {
              if (res.data.success) {
                let messageArr = res.data.message.split(",");
                self.open(`用户名：${messageArr[0]} 新密码：${messageArr[1]}`);
              } else {
                self.failed(res.data.message);
              }
            });
        })
        .catch(() => {
          return;
        });
    },
    //禁用、启用操作
    updateStatus(row) {
      let self = this;
      this.$confirm(
        `确定要${row.cnStatus === "正常" ? "禁用" : "启用"}：${row.userName} ?`,
        "提示",
        {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          type: "warning"
        }
      )
        .then(() => {
          self
            .postRequest("admin/updateStatus", {
              accountID: row.accountID,
              status: row.status === 1 ? 2 : 1,
              type: "admin"
            })
            .then(res => {
              if (res.data.success) {
                this.succeed(res.data.message);
                this.checkData();
              } else {
                this.failed(res.data.message);
              }
            });
        })
        .catch(() => {
          return;
        });
    },
    //取消提交
    resetForm(formName) {
      this.modifyDataVisible = false;
      this.updateAuthRoleFlag = false;
      this.updateEmployeeFlag = false;
    },
    open(message) {
      this.$alert(message, "密码重置成功", {
        confirmButtonText: "确定",
        callback: action => {
          this.checkData();
        }
      });
    },
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    failed(message) {
      this.$message.error(message);
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
      this.postRequest("admin/listEmployee", {
        userName: this.userName,
        deptID: this.deptID,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            userName: item.userName,
            deptName: item.deptName,
            roleName: item.roleName,
            name: item.name,
            mobile: item.mobile,
            creatorUserName: item.creatorUserName,
            created: item.created,
            modifyUserName: item.modifyUserName,
            modifyTime: item.modifyTime,
            status: item.status,
            cnStatus: item.cnStatus,
            accountID: item.accountID,
            id: item.id
          });
          self.index++;
        }
        for (let item of res.data.data.deptList) {
          self.options.push({
            // key: item.id,
            label: item.deptName,
            value: item.id
          });
        }
      });
    },
    cancel() {}
  },
  mounted() {
    this.checkData();
  }
};
</script>

<style scoped>
.el-dialog__body {
  width: 500px;
  display: flex;
  height: 90%;
}
.infoForm {
  overflow: auto;
  height: 300px;
  position: relative;
  left:50px;
}
.infoForm form {
  border-bottom: 1px solid rgb(220, 220, 220);
}
.infoForm button {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 20px;
}
</style>
