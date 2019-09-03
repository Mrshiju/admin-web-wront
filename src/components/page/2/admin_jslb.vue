<template>
  <div class="container">
    <el-button type="text" @click="addManageAuthRole">+添加系统角色</el-button>
    <el-button type="text" @click="addAgentRole">+添加代理商角色</el-button>
    <el-button type="text" @click="addClientRole">+添加客户角色</el-button>
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="角色：">
        <el-input v-model="roleName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加系统角色操作弹出框 -->
    <el-dialog title="添加系统角色" :visible.sync="manageRoleVisible">
      <el-form :model="role" :rules="rules" ref="role" label-width="120px">
        <el-form-item label="角色ID：" prop="roleID">
          <el-select v-model="role.roleID">
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 级别 -->
        <el-form-item label="角色级别：" prop="level">
          <el-select v-model="role.level">
            <el-option
              v-for="item in options1"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色简称：" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="role.roleName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="roleNameCn">
          <el-input v-model="role.roleNameCn" autocomplete="off" placeholder="如：客服账号"></el-input>
        </el-form-item>

        <el-form-item label="备注：" :label-width="formLabelWidth" prop="info">
          <el-input type="textarea" :rows="2" placeholder="如：级别为3的客服" v-model="role.info"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddAuthRole('role')">添加</el-button>
        <el-button @click="resetForm('role')">取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加代理商角色操作弹出框 -->
    <!--  -->
    <!-- 添加客户角色操作弹出框 -->
    <el-dialog title="添加客户角色" :visible.sync="clientRoleVisible">
      <el-form :model="clientRole" :rules="rules" ref="clientRole" label-width="120px">
        <el-form-item label="角色ID：" prop="roleID">
          <el-select v-model="clientRole.roleID">
            <el-option
              v-for="item in clientRoleOptions"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色级别：" :label-width="formLabelWidth" prop="level">
          <el-input v-model="clientRole.level" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="角色简称：" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="clientRole.roleName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色名称：" :label-width="formLabelWidth" prop="roleNameCn">
          <el-input v-model="clientRole.roleNameCn" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注：" :label-width="formLabelWidth" prop="info">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="clientRole.info"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddClientRole('clientRole')">添加</el-button>
        <el-button @click="resetForm('clientRole')">取消</el-button>
      </div>
    </el-dialog>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column prop="index" label="序号" width="60px" align="center"></el-table-column>
        <el-table-column prop="operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="permission(scope.row)">权限分配</el-button>
            <el-button type="text" @click="deleteDate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色" align="center"></el-table-column>
        <el-table-column prop="roleNameCn" label="角色名" align="center"></el-table-column>
        <el-table-column prop="level" label="角色等级" width="160px" align="center"></el-table-column>
        <el-table-column prop="info" label="备注" align="center"></el-table-column>
      </el-table>
      <el-pagination
        class="fr"
        style="margin:10px 0"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="pageNum"
        :page-size.sync="pageSize"
        layout="sizes, prev, pager, next, jumper"
      ></el-pagination>
      <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
    </el-card>
    <!-- 权限分配 -->

    <el-dialog title="提示" :visible.sync="dialogVisibleT" width="600px">
      <span>权限管理</span>
      <el-tree
        ref="tree"
        default-expand-all
        :data="treeData"
        show-checkbox
        node-key="listIndex"
        :props="defaultProps"
        :default-checked-keys="checkedArr"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisibleT: false,
      treeData: [],
      listIndex: "",
      checkedArr: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      clientRoleOptions: [
        {
          key: 1,
          label: "web主账号",
          value: 1201
        },
        {
          key: 2,
          label: "web子账号",
          value: 1202
        },
        {
          key: 3,
          label: "接口主账号",
          value: 1203
        },
        {
          key: 4,
          label: "接口子账号",
          value: 1204
        }
      ],
      index: 0,
      options: [],
      options1: [],
      manageRoleVisible: false,
      agentRoleVisible: false,
      clientRoleVisible: false,
      roleName: "",
      roleNameCn: "",
      info: "",
      role: {
        roleID: "",
        roleNameCn: "",
        roleName: "",
        info: "",
        level: ""
      },
      clientRole: {
        roleID: "",
        roleNameCn: "",
        roleName: "",
        info: "",
        level: "5"
      },
      rules: {
        roleID: [{ required: true, message: "不能为空", trigger: "blur" }],
        level: [{ required: true, message: "不能为空", trigger: "blur" }],
        roleName: [{ required: true, message: "不能为空", trigger: "blur" }],
        roleNameCn: [{ required: true, message: "不能为空", trigger: "blur" }],
        info: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      //属性图参数
      spreadFlag: false, //点击node 阻止展开
      index: 0,
      id: "",
      formLabelWidth: "120px",
      sum: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: false,
      loading: false,
      tableData: []
    };
  },
  methods: {
    //权限分配操作
    setRights() {},
    //  permission(role) {

    //   let levelOneList = [];
    //   let levelTwoList = [];
    //   let levelZeroList = [];
    //   let self = this;
    //   this.postRequest("admin/listAuthMenuManage", {
    //     t: ""
    //   }).then(res => {
    //     for (let item of res.data.data.menuList) {
    //       if (item.level === 1) {
    //         //第一级菜单
    //         levelOneList.push(item);
    //       }
    //       if (item.level === 2) {
    //         //第二级菜单
    //         levelTwoList.push(item);
    //       }
    //       if (item.level === 0) {
    //         //第三级菜单
    //         levelZeroList.push(item);
    //       }
    //     }

    //     for (let i of levelOneList) {
    //       self.menuList[0].children.push({
    //         label: i.menuNameCn,
    //         menuNameCn: i.menuNameCn,
    //         menuName: i.menuName,
    //         url: i.url,
    //         level: i.level,
    //         parentMenuName: i.parentMenuName,
    //         seq: i.seq,
    //         isShow: i.isShow,
    //         isFastNav: i.isFastNav,
    //         info: i.info,
    //         id: i.menuName,
    //         children: []
    //       });
    //     }
    //     for (let i of self.menuList[0].children) {
    //       for (let j of levelTwoList) {
    //         if (j.parentMenuName === i.menuName) {
    //           //双层循环，j.parentMenuName === i.menuName说明j是i的儿子
    //           i.children.push({
    //             label: j.menuNameCn,
    //             menuNameCn: j.menuNameCn,
    //             menuName: j.menuName,
    //             url: j.url,
    //             level: j.level,
    //             parentMenuName: j.parentMenuName,
    //             seq: j.seq,
    //             isShow: j.isShow,
    //             isFastNav: j.isFastNav,
    //             info: j.info,
    //             id: j.menuName,
    //             children: []
    //           });
    //         }
    //       }
    //     }
    //     for (let i of self.menuList[0].children) {
    //       for (let j of i.children) {
    //         for (let k of levelZeroList) {
    //           if (k.parentMenuName === j.menuName) {
    //             //三层循环，k.parentMenuName === j.menuName说明k是j的儿子
    //             j.children.push({
    //               label: k.menuNameCn,
    //               menuNameCn: k.menuNameCn,
    //               menuName: k.menuName,
    //               url: k.url,
    //               level: 3, //三级菜单渲染level为3
    //               parentMenuName: k.parentMenuName,
    //               seq: k.seq,
    //               isShow: k.isShow,
    //               isFastNav: k.isFastNav,
    //               info: k.info,
    //               id: k.menuName,
    //               children: []
    //             });
    //           }
    //         }
    //       }
    //     }
    //   });
    //   // console.log(tempArr);
    // },

    //获取所有权限
    async findAllroles() {},
    permission(row) {
      this.treeDataList = [
        {
          label: "菜单列表",
          menuNameCn: "菜单列表",
          level: 0,
          seq: 0,
          info: "",
          children: []
        }
      ];
      let levelOneList = [];
      let levelTwoList = [];
      let levelZeroList = [];
      // //console.log(row);
      let self = this;
      this.$router.push({
        path: "/admin_xtglcdlb",
        query: {
          roleName: row.roleName,
          roleID: row.roleID,
          title: "分配权限"
        }
      });
    },
    //删除操作
    deleteDate(row) {
      let self = this;
      this.$confirm(`此操作将删除角色：${row.roleName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/deleteAuthRole", {
              id: row.id
            })
            .then(res => {
              if (res.data.success) {
                this.succeed(res.data.data);
                this.checkData();
              } else {
                this.failed(res.data.resultMsg);
              }
            });
        })
        .catch(() => {});
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
    // 添加系统角色操作
    addManageAuthRole() {
      this.options = [];
      this.manageRoleVisible = true;
      let self = this;
      this.postRequest("admin/addManageAuthRole", {}).then(res => {
        // //console.log(res);
        for (let item of res.data.data.deptList) {
          self.options.push({
            value: item.id,
            label: item.deptName,
            key: item.id
          });
        }
      });
    },
    //保存添加系统角色操作
    saveAddAuthRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.manageRoleVisible = false;
          let self = this;
          this.postRequest("admin/saveAddAuthRole", {
            role: this.role
          }).then(res => {
            //console.log(res);
            if (res.data.success) {
              self.succeed("角色添加成功");
              self.checkData();
              self.role = {};
            } else {
              self.failed("角色添加失败或角色已经存在");
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.role = {};
      this.clientRole = {
        level: 5
      };
      this.manageRoleVisible = false;
      this.agentRoleVisible = false;
      this.clientRoleVisible = false;
    },
    //添加代理商角色操作
    addAgentRole() {
      this.agentRoleVisible = true;
    },
    //添加客户角色操作
    addClientRole() {
      this.clientRoleVisible = true;
    },
    //保存添加客户角色操作
    saveAddClientRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.clientRoleVisible = false;
          let self = this;
          this.postRequest("admin/saveAddAuthRole", {
            role: this.clientRole
          }).then(res => {
            //console.log(res);
            if (res.data.success) {
              self.succeed("角色添加成功");
              self.checkData();
              this.clientRole = {};
            } else {
              self.failed("角色添加失败");
            }
          });
        } else {
          return false;
        }
      });
    },
    handleSizeChange() {
      // this.tableData = [];
      this.checkData();
    },
    handlePageChange() {
      // this.tableData = [];
      this.checkData();
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listAuthRole", {
        roleName: this.roleName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        let setLevel = "";
        for (let item of res.data.data.roleList) {
          if (item.roleName == res.data.data.roleName) {
            setLevel = item.level;
          }
        }
        self.options1 = [];
        for (let i = setLevel+1; i < 5; i++) {
          self.options1.push({
            value: i,
            label: i
          });
        }
        self.tableData = [];
        self.loading = false;
        this.index =
          Number(res.data.data.page.pageNum - 1) *
            Number(res.data.data.page.pageSize) +
          1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.roleList) {
          if (sessionStorage.saleName == "admin") {
            self.tableData.push({
              index: self.index,
              roleName: item.roleName,
              roleNameCn: item.roleNameCn,
              roleID: item.roleID,
              info: item.info,
              id: item.id,
              level:item.level
            });
            self.index++;
          } else {
            if (item.roleName != "admin") {
              self.tableData.push({
                index: self.index,
                roleName: item.roleName,
                roleNameCn: item.roleNameCn,
                roleID: item.roleID,
                info: item.info,
                id: item.id,
                level:item.level
              });
              self.index++;
            }
          }
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
