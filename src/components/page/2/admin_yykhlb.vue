<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="用户名">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="status">
          <el-option
            v-for="item in statusOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户类型：">
        <el-select v-model="source">
          <el-option
            v-for="item in sourceOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计费类型：">
        <el-select v-model="feetype">
          <el-option
            v-for="item in feetypeOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="checkData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="addClient=true">添加客户</el-button>
        <el-dialog title="添加客户" :visible.sync="addClient" width="500px" :before-close="handleClose">
          <el-form
            :model="mod"
            :rules="rule1"
            label-width="150px"
            inline="inline"
            style="width: 400px"
            ref="form1"
          >
            <el-form-item label="客户用户名：" prop="username">
              <el-input v-model="mod.username"></el-input>
            </el-form-item>
            <el-form-item label="客户类型：" prop="source">
              <el-select v-model="mod.source">
                <el-option
                  v-for="item in sourceOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色：" prop="roleName">
              <el-select v-model="mod.roleName">
                <el-option
                  v-for="item in rollOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计费类型：" prop="feetype">
              <el-select v-model="mod.feetype">
                <el-option
                  v-for="item in feetypeOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-select v-model="mod.status">
                <el-option
                  v-for="item in statusOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="IP绑定：" prop="userip">
              <el-input v-model="mod.userip"></el-input>
            </el-form-item>
            <el-form-item label="余额（通）：" prop="balance">
              <el-input v-model="mod.balance"></el-input>
            </el-form-item>
            <el-form-item label="单价（元/通）：" prop="unitprice">
              <el-input v-model="mod.unitprice"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addClient = false">取 消</el-button>
            <el-button type="primary" @click="submitAdd">确认添加</el-button>
          </span>
        </el-dialog>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="200px" label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text">修改信息</el-button>
            <el-button @click="delClient(scope.row)" type="text">删除</el-button>
            <el-button @click="withhold(scope.row)" type="text">扣款</el-button>
            <el-button @click="supplement(scope.row)" type="text">补款</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户用户名"></el-table-column>
        <el-table-column prop="balance" label="余额（通）"></el-table-column>
        <el-table-column prop="unitprice" label="单价（元/通）"></el-table-column>
        <el-table-column label="客户类型">
          <template slot-scope="scope">{{scope.row.source==1?'web客户':'api客户'}}</template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色"></el-table-column>
        <el-table-column label="计费类型">
          <template
            slot-scope="scope"
          >{{scope.row.feetype===1?'按次':scope.row.feetype===2?'按秒':scope.row.feetype===3?'按分':'分段'}}</template>
        </el-table-column>
        <el-table-column label="客户状态">
          <template slot-scope="scope">{{scope.row.status===1?'正常':'禁用'}}</template>
        </el-table-column>
        <el-table-column prop="userip" label="绑定IP"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column prop="update_time" label="修改时间"></el-table-column>
      </el-table>
      <el-pagination
        class="fr"
        style="margin:10px 0"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="pageNum"
        :page-size.sync="PageSize"
         layout="sizes, prev, pager, next, jumper"
        :total="sum"
      ></el-pagination>
      <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
      <el-dialog title="修改信息" :visible.sync="modify" width="500px" :before-close="handleClose">
        <!--神奇的是修改信息不是通过row直接获取而是通过row.id访问接口-->
        <el-form
          :model="editClient"
          :rules="rule2"
          label-width="150px"
          inline="inline"
          style="width: 400px"
          ref="modify"
        >
          <el-form-item label="客户用户名：" prop="username">
            <el-input v-model="editClient.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="客户类型：">
            <el-select v-model="editClient.source">
              <el-option
                v-for="item in sourceOpt2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色：">
            <el-select v-model="editClient.roleName">
              <el-option
                v-for="item in rollOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计费类型：">
            <el-select v-model="editClient.feetype">
              <el-option
                v-for="item in feetypeOpt2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="editClient.status">
              <el-option
                v-for="item in statusOpt2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="IP绑定：">
            <el-input v-model="editClient.userip"></el-input>
          </el-form-item>
          <el-form-item label="余额（通）：">
            <el-input v-model="editClient.balance"></el-input>
          </el-form-item>
          <el-form-item label="单价（元/通）：">
            <el-input v-model="editClient.unitprice"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modify = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">确认修改</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="语音客户扣款"
        :visible.sync="withholdClient.visiable"
        width="500px"
        :before-close="handleClose"
      >
        <el-form
          :model="withholdClient"
          :rules="rule3"
          label-width="120px"
          inline="inline"
          ref="withhold"
          style="width: 400px"
        >
          <el-form-item label="扣款账号：">
            <el-input disabled="disabled" v-model="withholdClient.userName"></el-input>
          </el-form-item>
          <el-form-item label="当前余额：">
            <el-input disabled="disabled" v-model="withholdClient.balance"></el-input>
          </el-form-item>
          <el-form-item label="扣款条数：" prop="count">
            <el-input v-model="withholdClient.count"></el-input>
          </el-form-item>
          <el-form-item label="扣款原因：" prop="remark">
            <el-input v-model="withholdClient.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="withholdClient.visiable = false">取消</el-button>
          <el-button type="primary" @click="submitWithhold">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="语音客户补款"
        :visible.sync="supplementClient.visiable"
        width="500px"
        :before-close="handleClose"
      >
        <el-form
          :model="supplementClient"
          :rules="rule4"
          label-width="120px"
          inline="inline"
          ref="supplement"
          style="width: 400px"
        >
          <el-form-item label="补款账号：">
            <el-input disabled v-model="supplementClient.userName"></el-input>
          </el-form-item>
          <el-form-item label="当前余额：">
            <el-input disabled="disabled" v-model="supplementClient.balance"></el-input>
          </el-form-item>
          <el-form-item label="补款条数：" prop="count">
            <el-input v-model="supplementClient.count"></el-input>
          </el-form-item>
          <el-form-item label="补款原因：" prop="remark">
            <el-input v-model="supplementClient.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="supplementClient.visiable = false">取消</el-button>
          <el-button type="primary" @click="submitSupplement">保存</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "admin_dlslb",
  data() {
    return {
      sum: 0,
      index:0,
      pageNum: 1,
      PageSize: 30,
      checkIn: false,
      loading: false,
      tableData: [],
      status: 0,
      statusOpt: [
        {
          value: 0,
          label: "所有"
        },
        {
          value: 1,
          label: "正常"
        },
        {
          value: 2,
          label: "禁用"
        }
      ],
      source: 0,
      sourceOpt: [
        {
          value: 0,
          label: "所有"
        },
        {
          value: 1,
          label: "web客户"
        },
        {
          value: 2,
          label: "api用户"
        }
      ],
      feetype: 0,
      feetypeOpt: [
        {
          value: 0,
          label: "所有"
        },
        {
          value: 1,
          label: "按次"
        },
        {
          value: 2,
          label: "按秒"
        },
        {
          value: 3,
          label: "按分"
        },
        {
          value: 4,
          label: "分段"
        }
      ],
      rollOpt: [
        {
          value: "pcn_call_1",
          label: "pcn_call_1"
        },
        {
          value: "pcn_call_api",
          label: "pcn_call_api"
        }
      ],
      sourceOpt2: [
        {
          value: 1,
          label: "web客户"
        },
        {
          value: 2,
          label: "api用户"
        }
      ],
      feetypeOpt2: [
        {
          value: 1,
          label: "按次"
        },
        {
          value: 2,
          label: "按秒"
        },
        {
          value: 3,
          label: "按分"
        },
        {
          value: 4,
          label: "分段"
        }
      ],
      statusOpt2: [
        {
          value: 1,
          label: "正常"
        },
        {
          value: 2,
          label: "禁用"
        }
      ],
      userName: "",
      addClient: false,
      modify: false,
      del: false,
      mod: {
        username: "",
        source: 1,
        roleName: "pcn_call_1",
        feetype: 1,
        status: 1,
        userip: "",
        balance: "",
        unitprice: ""
      },
      editClient: {
        id: "",
        username: "",
        source: 0,
        roleName: 0,
        feetype: 0,
        status: 0,
        userip: "",
        balance: "",
        unitprice: ""
      },
      withholdClient: {
        visiable: false,
        id: "",
        count: "",
        remark: "",
        opttype: 3 //
      },
      supplementClient: {
        visiable: false,
        id: "",
        balance: "",
        count: "",
        remark: "",
        opttype: "2"
      },
      rule1: {
        username: [
          { required: true, message: "请输入客户用户名", trigger: "blur" }
        ]
      },
      rule2: {
        username: [
          { required: true, message: "请输入客户用户名", trigger: "blur" }
        ]
      },
      rule3: {
        count: [{ required: true, message: "请输入扣款数量", trigger: "blur" }],
        remark: [{ required: true, message: "请输入扣款原因", trigger: "blur" }]
      },
      rule4: {
        count: [{ required: true, message: "请输入补款数量", trigger: "blur" }],
        remark: [{ required: true, message: "请输入补款原因", trigger: "blur" }]
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
      this.postRequest("admin/listAllCustomerCall", {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: this.status,
        username: this.userName,
        source: this.source,
        feetype: this.feetype
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
            userip: item.userip,
            source: item.source,
            feetype: item.feetype,
            status: item.status,
            roleName: item.roleName,
            create_time: item.create_time,
            update_time: item.update_time,
            balance: item.balance,
            unitprice: item.unitprice
          });
          self.index++
        }
      });
    },
    submitAdd() {
      let self = this;
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveAddCustomerCall", {
            username: this.mod.username,
            source: this.mod.source,
            roleName: this.mod.roleName,
            feetype: this.mod.feetype,
            status: this.mod.status,
            userip: this.mod.userip,
            balance: this.mod.balance,
            unitprice: this.mod.unitprice
          }).then(res => {
            self.addClient = false;
            self.checkData();
            self.resAlert(res.data);
            self.mod = {
              username: "",
              source: 0,
              roleName: 0,
              feetype: 0,
              status: 0,
              userip: "",
              balance: "",
              unitprice: ""
            };
          });
        } else return false;
      });
    },
    edit(row) {
      let self = this;
      this.modify = true;
      this.postRequest("admin/getUpdateCustomerCall", {
        id: row.id
      }).then(res => {
        self.editClient = {
          id: res.data.data.cusomerCall.id,
          username: res.data.data.cusomerCall.userName,
          source: res.data.data.cusomerCall.source,
          roleName: res.data.data.cusomerCall.roleName,
          feetype: res.data.data.cusomerCall.feetype,
          status: res.data.data.cusomerCall.status,
          userip: res.data.data.cusomerCall.userip,
          balance: res.data.data.customerCallBalance.balance,
          unitprice: res.data.data.customerCallBalance.unitprice,
          rollOpt: []
        };
      });
    },
    submitEdit() {
      let self = this;
      this.$refs.modify.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveUpdateCustomerCall", {
            id: this.editClient.id,
            source: this.editClient.source,
            roleName: this.editClient.roleName,
            feetype: this.editClient.feetype,
            status: this.editClient.status,
            userip: this.editClient.userip,
            balance: this.editClient.balance,
            unitprice: this.editClient.unitprice
          }).then(res => {
            self.resAlert(res.data);
            self.modify = false;
            self.checkData();
          });
        } else return false;
      });
    },
    delClient(row) {
      let self = this;
      this.$confirm("确认删除【" + row.userName + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //提交删除接口同时把数据从tabledata里删除
          self
            .postRequest("admin/deleteCustomerCall", {
              id: row.id
            })
            .then(res => {
              if (res.data.success == true) {
                self.$message.success(res.data.message);
                self.tableData.forEach((item, i) => {
                  //循环,或者通过过滤
                  if (item.id == row.id) {
                    self.tableData.splice(i, 1);
                  }
                });
              } else self.$message.error(res.data.message);
              // self.checkData();//微妙的无效,且效率低下
            });
        })
        .catch(() => {});
    },
    withhold(row) {
      this.withholdClient.visiable = true;
      let self = this;
      this.postRequest("admin/getCallDeduct", {
        id: row.id
      }).then(res => {
        self.withholdClient = {
          //一次性赋值会直观反映在UI界面上，分别赋值不会
          id: row.id,
          userName: res.data.data.customerCallBalance.userName,
          balance: res.data.data.customerCallBalance.balance,
          visiable: true,
          count: "",
          remark: "",
          opttype: 3 //
        };
      });
    },
    submitWithhold() {
      let self = this;
      this.$refs.withhold.validate(valid => {
        if (valid) {
          this.withholdClient.visiable = false;
          this.postRequest("admin/saveCallDeduct", {
            id: self.withholdClient.id,
            count: self.withholdClient.count,
            remark: self.withholdClient.remark,
            opttype: 3
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
          });
        } else return false;
      });
    },
    supplement(row) {
      this.supplementClient.visiable = true;
      let self = this;
      this.postRequest("admin/getCallRefund", {
        id: row.id
      }).then(res => {
        self.supplementClient = {
          visiable: true,
          id: res.data.data.customerCallBalance.customerID,
          userName: res.data.data.customerCallBalance.userName,
          balance: res.data.data.customerCallBalance.balance,
          count: "",
          remark: "",
          opttype: 2
        };
      });
    },
    submitSupplement() {
      let self = this;
      this.$refs.supplement.validate(valid => {
        if (valid) {
          this.supplementClient.visiable = false;
          this.postRequest("admin/saveCallRefund", {
            id: this.supplementClient.id,
            count: this.supplementClient.count,
            remark: this.supplementClient.remark,
            opttype: 2
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
          });
        } else return false;
      });
    },
    handleClose(done) {
      done();
      // this.$confirm('确认关闭？') //如果传refs的话可以用于表单重置
      //     .then(_ => {
      //         done();
      //     })
      //     .catch(_ => {
      //     });
    }
  },
  mounted() {
    this.checkData();
  }
};
</script>

<style scoped>
</style>
