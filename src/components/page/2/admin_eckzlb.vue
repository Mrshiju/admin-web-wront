<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="客户账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="签名：">
        <el-input  v-model="sign"></el-input>
      </el-form-item>
      <el-form-item label="网关扩展号：">
        <el-input  v-model="gwCode"></el-input>
      </el-form-item>
      <el-form-item label="网关编号：">
        <el-input  v-model="gateway"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <!-- <el-button type="text" @click="addGateway">+二次扩展添加</el-button> -->
      <!--<el-button type="text" @click="bulkModify">+批量修改</el-button>-->
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="50px" prop="index" :indexs="index"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改</el-button>
            <el-button @click="del(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户账号"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="sign" label="签名"></el-table-column>
        <el-table-column prop="gateway" label="网关编号"></el-table-column>
        <el-table-column prop="gatewayName" label="网关名称"></el-table-column>
        <el-table-column prop="gwcode" label="网关扩展号"></el-table-column>
        <el-table-column prop="terminalId" label="网关计费号"></el-table-column>
        <el-table-column prop="creater" label="创建人"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="modifier" label="修改人"></el-table-column>
        <el-table-column prop="modifytime" label="修改时间"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
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
    <!-- <el-dialog title="二次扩展添加" :visible.sync="addGwRouteData.visible" width="500px">
      <el-form
        label-width="150px"
        style="width: 400px;"
        :model="addGwRouteData.gwRoute"
        ref="form1"
        :rules="rule1"
      >
        <el-form-item label="客户账号：" prop="accountID">
          <el-select
            filterable
            v-model="addGwRouteData.gwRoute.accountID"
            @change="getCode"
            ref="userName"
          >
            <el-option v-for="item in userList" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网关：" prop="gateway">
          <el-select filterable v-model="addGwRouteData.gwRoute.gateway">
            <el-option
              v-for="item in gatewayList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网关扩展号：" prop="gwcode">
          <el-input v-model="addGwRouteData.gwRoute.gwcode"></el-input>
        </el-form-item>
        <el-form-item label="网关计费号：">
          <el-input v-model="addGwRouteData.gwRoute.terminalId"></el-input>
        </el-form-item>
        <el-form-item label="用户扩展号：">
          <div>{{ addGwRouteData.gwRoute.code}}</div>
        </el-form-item>
        <el-form-item label="签名：" prop="sign">
          <el-input v-model="addGwRouteData.gwRoute.sign"></el-input>
        </el-form-item>
        <el-form-item label="移动是否去签：">
          <el-radio-group v-model="addGwRouteData.gwRoute.isCmLeft">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联通是否去签：">
          <el-radio-group v-model="addGwRouteData.gwRoute.isCuLeft">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电信是否去签：">
          <el-radio-group v-model="addGwRouteData.gwRoute.isCtLeft">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="addGwRouteData.gwRoute.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGwRouteData.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">保存</el-button>
      </span>
    </el-dialog> -->
    <el-dialog title="二次扩展修改" :visible.sync="modifyData.visible" width="500px">
      <el-form
        label-width="150px"
        style="width: 400px;"
        :model="modifyData.gwRoute"
        ref="form1"
        :rules="rule2"
      >
        <el-form-item label="客户账号：">
          <el-input disabled v-model="modifyData.gwRoute.userName"></el-input>
        </el-form-item>
        <el-form-item label="网关：">
          <el-select v-model="modifyData.gwRoute.gateway">
            <el-option v-for="(item,i) of gatewayList" :value="item.value" :label="item.label" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网关扩展号：" prop="gwcode">
          <el-input v-model="modifyData.gwRoute.gwcode"></el-input>
        </el-form-item>
        <el-form-item label="网关计费号：">
          <el-input disabled v-model="modifyData.gwRoute.terminalId"></el-input>
        </el-form-item>
        <el-form-item label="用户扩展号：">
          <el-input v-model="modifyData.gwRoute.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="签名：" prop="sign">
          <el-input v-model="modifyData.gwRoute.sign"></el-input>
        </el-form-item>
        <el-form-item label="移动是否去签：">
          <el-radio-group v-model="modifyData.gwRoute.isCmLeft">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联通是否去签：">
          <el-radio-group v-model="modifyData.gwRoute.isCuLeft">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电信是否去签：">
          <el-radio-group v-model="modifyData.gwRoute.isCtLeft">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="modifyData.gwRoute.remark" type="textarea"></el-input>
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
      totalPage: 1000,
      userName: "",
      sign: "",
      gwCode: "",
      gateway: "",
      gatewayList: [],
      userList: [],
      // addGwRouteData: {
      //   visible: false,
      //   gwRoute: {
      //     id: "",
      //     accountID: "",
      //     userName: "",
      //     code: "",
      //     gwcode: "",
      //     gateway: "",
      //     companyName: "",
      //     sign: "",
      //     isCmLeft: 0,
      //     isCuLeft: 0,
      //     isCtLeft: 0,
      //     terminalId: "",
      //     remark: "",
      //     createtime: "",
      //     creater: "",
      //     modifytime: "",
      //     modifier: ""
      //   }
      // },
      modifyData: {
        visible: false,
        gwRoute: {
          id: "",
          accountID: "",
          userName: "",
          code: "",
          gwcode: "",
          gateway: "",
          companyName: "",
          sign: "",
          isCmLeft: 0,
          isCuLeft: 0,
          isCtLeft: 0,
          terminalId: "",
          remark: "",
          createtime: "",
          creater: "",
          modifytime: "",
          modifier: ""
        }
      },
      rule1: {
        gateway: { required: true, message: "请选择网关", trigger: "change" },
        accountID: {
          required: true,
          message: "请选择客户账号",
          trigger: "change"
        },
        gwcode: {
          required: true,
          message: "请输入网关扩展号",
          trigger: "blur"
        },
        // code: {required: true, message: '请选择客户账号', trigger: 'blur'},
        sign: { required: true, message: "请输入签名", trigger: "blur" }
      },
      rule2: {
        gwcode: {
          required: true,
          message: "请输入网关扩展号",
          trigger: "blur"
        },
        sign: { required: true, message: "请输入签名", trigger: "blur" }
      }
    };
  },
  methods: {
    succeed(message){
      this.$message({
          message: message,
          type: 'success'
        });
    },
    failed(message){
      this.$message.error(message);
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    indexs(index) {
      return index + 1;
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listGwRoute", {
        userName: this.userName,
        sign: this.sign,
        gwCode: this.gwCode,
        gateway: this.gateway,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index:self.index,
            id: item.id,
            accountID: item.accountID,
            userName: item.userName,
            code: item.code,
            gwcode: item.gwcode,
            gateway: item.gateway,
            companyName: item.companyName,
            sign: item.sign,
            remark: item.remark,
            terminalId: item.terminalId,
            createtime: item.createtime,
            creater: item.creater,
            modifytime: item.modifytime,
            modifier: item.modifier,
            gatewayName: item.gatewayName
          });
          self.index++;
        }
      });
    },
    // addGateway() {
    //   let self = this;
    //   this.userList = [];
    //   this.gatewayList = [];
    //   this.postRequest("admin/addGwRoute", {
    //     accountID:this.addGwRouteData.accountID
    //   }).then(res => {
    //     for (let item of res.data.data.cList) {
    //       self.userList.push({
    //         label: item.userName,
    //         value: item.accountID
    //       });
    //     }
    //     for (let item of res.data.data.gatewayList) {
    //       self.gatewayList.push({
    //         label: item.gatewayname,
    //         value: item.gateway
    //       });
    //     }
    //     self.addGwRouteData.visible = true;
    //   });
    // },
    // getCode() {
    //   let self = this;
    //   this.userList.forEach(item => {
    //     // console.log(item);
    //     if (item.value === this.addData.gwRoute.accountID)
    //       this.addData.gwRoute.userName = item.label;
    //   });
    //   // console.log(self.$refs.userName.$el.getElementsByTagName('input')[0].html());
    //   this.postRequest("admin/ajaxGwRoute", {
    //     userName: this.addData.gwRoute.userName
    //   }).then(res => {
    //     self.addData.gwRoute.code = res.data.data.code;
    //   });
    // },
    // submitAdd() {
    //   let self = this;
    //   this.$refs.form1.validate(valid => {
    //     if (valid) {
    //       self
    //         .postRequest("admin/saveAddGwRoute", {
    //           gwRoute: self.addData.gwRoute
    //         })
    //         .then(res => {
    //           if (res.data.success === true) {
    //             self.checkData();
    //             self.addData.visible = false;
    //             self.$message.success(res.data.data);
    //           } else self.$message.error("添加二次扩展失败");
    //         });
    //     } else return false;
    //   });
    // },
    bulkModify() {},
    submitBulkModify() {},
    modify(row) {
      let self = this;
      this.postRequest("admin/editGwRoute", {
        id: row.id
      }).then(res => {
        self.gatewayList = [];
        self.gatewayList.push({
          value: res.data.data.gwr.gateway,
          label: res.data.data.gwr.gatewayname
        });
        self.modifyData = {
          visible: true,
          gwRoute: {
            id: res.data.data.gwr.id,
            accountID: res.data.data.gwr.accountID,
            userName: res.data.data.gwr.userName,
            code: res.data.data.gwr.code,
            gwcode: res.data.data.gwr.gwcode,
            gateway: res.data.data.gwr.gateway,
            companyName: res.data.data.gwr.companyName,
            sign: res.data.data.gwr.sign,
            isCmLeft: res.data.data.gwr.isCmLeft,
            isCuLeft: res.data.data.gwr.isCuLeft,
            isCtLeft: res.data.data.gwr.isCtLeft,
            terminalId: res.data.data.gwr.terminalId,
            remark: res.data.data.gwr.remark,
            createtime: res.data.data.gwr.createtime,
            creater: res.data.data.gwr.creater,
            modifytime: res.data.data.gwr.modifytime,
            modifier: res.data.data.gwr.modifier
          }
        };
      });
    },
    async submitModify() {
      let self = this;
      let res = await this.postRequest("admin/saveEditGwRoute", {gwRoute:this.modifyData.gwRoute})
      if(res.data.success){
        self.checkData();
        self.modifyData.visible = false;
        self.succeed(res.data.data)
      }else{
         self.failed(rea.data.resultMsg)
      }
         
        
    },
    del(row) {
      let self = this;
      this.$confirm("确认删除【" + row.userName + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deleteGwRoute", {
            id: row.id
          }).then(res => {
            if(res.data.success){
              self.succeed(res.data.data)
              self.checkData();
            }else{
              self.failed(rea.data.resultMsg)
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
</style>
