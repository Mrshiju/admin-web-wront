<template>
  <div class="container">
    <el-form inline="inline" label-width="100px" v-on:keyup.enter.native="checkData">
      <el-form-item label="客户账户：">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="所属代理：">
        <el-select v-model="agentName">
          <el-option
            v-for="item in agentOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属销售：">
        <el-select v-model="saleName">
          <el-option value label="所有"></el-option>
          <el-option
            v-for="item in saleOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="余额：">
        <el-select v-model="fbalance">
          <el-option value label="余额起"></el-option>
          <el-option
            v-for="item in fbOpt"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="tbalance">
          <el-option value label="余额止"></el-option>
          <el-option
            v-for="item in tbOpt"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index" :index="indexs"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              @click="withhold(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.status===1"
            >扣款</el-button>
            <el-button
              @click="supplement(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.status===1"
            >补款</el-button>
            <el-button
              @click="recharge(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.status===1"
            >客户充值</el-button>
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button type="text">
                其他管理
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!--<el-dropdown-item :command="{name:'Subaccount',data:scope.row}">子账号</el-dropdown-item>-->
                <el-dropdown-item :command="{name:'modeifyPara',data:scope.row}">修改参数</el-dropdown-item>
                <el-dropdown-item :command="{name:'contactInfo',data:scope.row}">联系信息</el-dropdown-item>
                <el-dropdown-item :command="{name:'reset',data:scope.row}">重置密码</el-dropdown-item>
                <el-dropdown-item
                  :command="{name:'forbidden',data:scope.row}"
                  v-if="scope.row.status===1"
                >禁用</el-dropdown-item>
                <el-dropdown-item
                  :command="{name:'blackList',data:scope.row}"
                  v-if="scope.row.status!==-1"
                >转黑名单</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="userName" label="客户账号"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="saleNickName" label="所属销售"></el-table-column>
        <el-table-column prop="agentName" label="所属代理"></el-table-column>
        <el-table-column prop="leftPrice" label="余额（元）"></el-table-column>
        <el-table-column prop="returnableAmount" label="可返补（元）"></el-table-column>
        <el-table-column prop="nickName" label="联系人"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="phone" label="固话"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="QQ" label="QQ"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="modifyUserName" label="修改人"></el-table-column>
        <el-table-column prop="modifytimes" label="修改时间"></el-table-column>
        <el-table-column prop="creatorUserName" label="创建人"></el-table-column>
        <el-table-column prop="created" label="创建时间"></el-table-column>
        <el-table-column prop="cnStatus" label="状态"></el-table-column>
      </el-table>
      <div>
        <el-dialog
          title="客户扣款"
          :visible.sync="withholdData.visible"
          width="500px"
          :before-close="handleClose"
        >
          <el-form
            :model="withholdData"
            :rules="rule1"
            label-width="120px"
            inline="inline"
            ref="withhold"
            style="width: 400px"
          >
            <el-form-item label="扣款账号：">
              <el-input disabled="disabled" v-model="withholdData.userName"></el-input>
            </el-form-item>
            <el-form-item label="当前余额：">
              <el-input disabled="disabled" v-model="withholdData.beforebalance"></el-input>
            </el-form-item>
            <el-form-item label="扣款（元）：" prop="amount">
              <el-input v-model="withholdData.amount"></el-input>
            </el-form-item>
            <el-form-item label="扣款原因：" prop="remark">
              <el-input v-model="withholdData.remark"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="withholdData.visible = false">取消</el-button>
            <el-button type="primary" @click="submitWithhold">保存</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="客户补款"
          :visible.sync="supplementData.visible"
          width="500px"
          :before-close="handleClose"
        >
          <el-form
            :model="supplementData"
            :rules="rule2"
            label-width="120px"
            style="width: 400px"
            ref="supplement"
          >
            <el-form-item label="补款账号：">
              <el-input disabled="disabled" v-model="supplementData.userName"></el-input>
            </el-form-item>
            <el-form-item label="当前余额：">
              <el-input disabled="disabled" v-model="supplementData.beforebalance"></el-input>
            </el-form-item>
            <el-form-item label="补款（元）：" prop="amount">
              <el-input v-model="supplementData.amount"></el-input>
            </el-form-item>
            <el-form-item label="补款原因：" prop="remark">
              <el-input v-model="supplementData.remark"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="supplementData.visible = false">取消</el-button>
            <el-button type="primary" @click="submitSupplement">保存</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="客户充值"
          :visible.sync="rechargeData.visible"
          width="500px"
          :before-close="handleClose"
        >
          <el-form
            label-width="120px"
            inline="inline"
            style="width: 400px"
            :model="rechargeData"
            ref="recharge"
            :rules="rule4"
          >
            <el-form-item label="客户：">
              <el-input disabled="disabled" v-model="rechargeData.userName"></el-input>
            </el-form-item>
            <el-form-item label="充值金额（元）：" prop="rechargeMoney">
              <el-input v-model="rechargeData.rechargeMoney"></el-input>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input v-model="rechargeData.remark" type="textarea"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="rechargeData.visible=false">取消</el-button>
            <el-button type="primary" @click="submitRecharge">保存</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="财务修改客户参数"
          :visible.sync="modeifyParaData.visible"
          width="500px"
          :before-close="handleClose"
        >
          <el-form label-width="120px" inline="inline" style="width: 400px">
            <el-form-item label="客户账号：">
              <el-input disabled="disabled" v-model="modeifyParaData.userName"></el-input>
            </el-form-item>
            <el-form-item label="所属销售：">
              <el-select v-model="modeifyParaData.saleName">
                <el-option v-for="(item,index) of empList" :label="item.label" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属代理：">
              <el-select v-model="modeifyParaData.agentName">
                <el-option v-for="(item,index) of agentList" :label="item.label" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户等级：">
              <el-select v-model="modeifyParaData.rank">
                <el-option v-for="(item,index) of rankOpt" :label="item.label" :value="item.label" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="modeifyParaData.visible= false">取消</el-button>
            <el-button type="primary" @click="submitModeifyPara">保存</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="客户信息修改"
          :visible.sync="contactInfoData.visible"
          width="500px"
          :before-close="handleClose"
        >
          <el-form
            label-width="120px"
            inline="inline"
            style="width: 400px"
            :rules="rule3"
            :model="contactInfoData"
          >
            <el-form-item label="用户名：">
              <el-input disabled="disabled" v-model="contactInfoData.userDetail.userName"></el-input>
            </el-form-item>
            <el-form-item label="公司名称：">
              <el-input v-model="contactInfoData.userDetail.companyName"></el-input>
            </el-form-item>
            <el-form-item label="联系地址：">
              <el-input v-model="contactInfoData.userDetail.address"></el-input>
            </el-form-item>
            <el-form-item label="联系人：">
              <el-input v-model="contactInfoData.userDetail.nickName"></el-input>
            </el-form-item>
            <el-form-item label="手机号码：">
              <el-input v-model="contactInfoData.userDetail.mobile"></el-input>
            </el-form-item>
            <el-form-item label="固定电话：">
              <el-input v-model="contactInfoData.userDetail.phone1"></el-input>
            </el-form-item>
            <el-form-item label="QQ号码：">
              <el-input v-model="contactInfoData.userDetail.QQ"></el-input>
            </el-form-item>
            <el-form-item label="企业邮箱：">
              <el-input v-model="contactInfoData.userDetail.email"></el-input>
            </el-form-item>
            <!--<el-form-item label="营业执照：" class="fl" label-width="170px">-->
            <!--<el-upload class="fl">-->
            <!--<el-button type="text">选择上传文件</el-button>-->
            <!--</el-upload>-->
            <!--<el-button type="text" class="fl">下载</el-button>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="合同：" class="fl" label-width="170px">-->
            <!--<el-upload class="fl">-->
            <!--<el-button type="text">选择上传文件</el-button>-->
            <!--</el-upload>-->
            <!--<el-button type="text" class="fl">下载</el-button>-->
            <!--</el-form-item>-->
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="contactInfoData.visible = false">取消</el-button>
            <el-button type="primary" @click="submitContactInfo">保存</el-button>
          </span>
        </el-dialog>
      </div>
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
      userName: "",
      agentName: "SYS",
      agentOpt: [],
      saleName: "",
      saleOpt: [],
      fbalance: "",
      fbOpt: [
        {
          value: 0
        },
        {
          value: 10
        },
        {
          value: 100
        },
        {
          value: 1000
        },
        {
          value: 10000
        },
        {
          value: 100000
        },
        {
          value: 1000000
        }
      ],
      tbalance: "",
      tbOpt: [
        {
          value: 0
        },
        {
          value: 10
        },
        {
          value: 100
        },
        {
          value: 1000
        },
        {
          value: 10000
        },
        {
          value: 100000
        },
        {
          value: 1000000
        }
      ],
      rankOpt: [
        {
          label: 0
        },
        {
          label: 1
        },
        {
          label: 2
        },
        {
          label: 3
        },
        {
          label: 4
        },
        {
          label: 5
        },
        {
          label: 6
        },
        {
          label: 7
        },
        {
          label: 8
        },
        {
          label: 9
        }
      ],
      rule1: {
        amount: { required: true, message: "请输入扣款金额", trigger: "blur" },
        remark: { required: true, message: "请输入扣款备注", trigger: "blur" }
      },
      rule2: {
        amount: { required: true, message: "请输入补款金额", trigger: "blur" },
        remark: { required: true, message: "请输入补款备注", trigger: "blur" }
      },
      rule3: {},
      rule4: {
        rechargeMoney: {
          required: true,
          message: "请输入充值金额",
          trigger: "blur"
        },
        rechargeUnit: {
          required: true,
          message: "请输入单价",
          trigger: "blur"
        },
        rechargeCount: {
          required: true,
          message: "请输入充值条数",
          trigger: "blur"
        }
      },
      withholdData: {
        visible: false,
        accountID: "",
        opttype: 3,
        userName: "",
        beforebalance: "",
        amount: "",
        remark: ""
      },
      supplementData: {
        visible: false,
        userName: "",
        beforebalance: "",
        amount: "",
        remark: "",
        accountID: "",
        opttype: 2
      },
      rechargeData: {
        visible: false,
        userName: "",
        accountID: "",
        rechargeMoney: "",
        remark: ""
      },
      empList: [],
      agentList: [],
      customer: [],
      modeifyParaData: {
        visible: false,
        accountID: "",
        userName: "",
        saleName: "",
        agentName: "",
        rank: ""
      },
      contactInfoData: {
        visible: false,
        account: {
          id: "",
          accountType: ""
        },
        userDetail: {
          accountID: "",
          userName: "",
          companyName: "",
          address: "",
          nickName: "",
          mobile: "",
          phone1: "",
          QQ: "",
          email: "",
          businessLicenes: "",
          contract: ""
        }
      }
    };
  },
  computed: {
    rechargeCount: function() {
      this.rechargeData.rechargeCount = Math.floor(
        this.rechargeData.rechargeMoney / this.rechargeData.rechargeUnit
      );
      return this.rechargeData.rechargeCount;
    }
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
      this.postRequest("admin/listPcnCustomer", {
        userName: this.userName,
        agentName: this.agentName,
        saleName: this.saleName,
        fbalance: this.fbalance,
        tbalance: this.tbalance,
        pageNum: this.pageNum,
        pageSize: this.pageSize
        // userName: this.userName,
        // agentName: this.agentName,
        // saleName: this.saleName,
        // fbalance: this.fbalance,
        // tbalance: this.tbalance,
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index:self.index,
            companyName: item.userDetail.companyName,
            userName: item.userBalance.userName,
            accountID: item.accountID,
            code: item.code,
            saleNickName: item.saleNickName,
            agentName: item.agentName,
            balance: item.userBalance.balance,
            returnableAmount: item.userBalance.returnableAmount,
            nickName: item.userDetail.nickName,
            mobile: item.userDetail.mobile,
            phone: item.userDetail.phone1,
            address: item.userDetail.address,
            QQ: item.userDetail.QQ,
            email: item.userDetail.email,
            modifyUserName: item.userDetail.modifyUserName,
            modifytimes: item.userDetail.modifytimes,
            creatorUserName: item.userDetail.creatorUserName,
            created: item.userDetail.created,
            status: item.status,
            cnStatus: item.cnStatus,
            saleID: item.saleID,
            leftPrice:
              Number(item.userBalance.leftPrice) / 10000
                ? (Number(item.userBalance.leftPrice) / 10000)
                : 0
          });
          self.index++
        }
      });
    },
    indexs(index) {
      return index + 1;
    },
    handleClose(done) {
      done();
    },
    handleCommand(command) {
      let self = this;
      switch (command.name) {
        case "modeifyPara":
          this.modeifyPara(command.data);
          break;
        case "contactInfo":
          this.contactInfo(command.data);
          break;
        case "reset":
          this.$confirm(
            "确定重置【" + command.data.userName + "】的密码？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              self
                .postRequest("admin/resetPassword", {
                  accountID: command.data.accountID
                })
                .then(res => {
                  self.$notify({
                    title: "密码重置成功",
                    message: `${res.data.message}`,
                    type: "success",
                    duration: 0
                  });
                  self.checkData();
                });
            })
            .catch(() => {});
          break;
        case "forbidden":
          this.$confirm("确定禁用【" + command.data.userName + "】？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              self
                .postRequest("admin/updateStatus", {
                  accountID: command.data.accountID,
                  status: 2,
                  type: command.data.type
                    ? command.data.type
                    : "update_customer_status"
                })
                .then(res => {
                  self.resAlert(res.data);
                  self.checkData();
                });
            })
            .catch(() => {});
          break;
        case "blackList":
          this.$confirm(
            "确定将【" + command.data.userName + "】转入黑名单？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              self
                .postRequest("admin/updateStatus", {
                  accountID: command.data.accountID,
                  status: -1,
                  type: command.data.type
                    ? command.data.type
                    : "update_customer_status" // type不是必须？
                })
                .then(res => {
                  self.resAlert(res.data);
                  self.checkData();
                });
            })
            .catch(() => {});
          break;
      }
    },
    withhold(row) {
      // console.log(row);
      this.withholdData = {
        visible: true,
        userName: row.userName,
        opttype: 3,
        accountID: row.accountID,
        beforebalance: row.leftPrice,
        amount: "",
        remark: ""
      };
    },
    submitWithhold() {
      let self = this;
      this.$refs.withhold.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveDeduct", {
            accountID: this.withholdData.accountID,
            opttype: "3",
            userName: this.withholdData.userName,
            beforebalance: Number(this.withholdData.beforebalance) * 10000,
            amount: Number(this.withholdData.amount) * 10000,
            remark: this.withholdData.remark
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
            self.withholdData.visible = false;
          });
        } else return false;
      });
    },
    supplement(row) {
      this.supplementData = {
        visible: true,
        userName: row.userName,
        opttype: 2,
        accountID: row.accountID,
        beforebalance: row.leftPrice,
        amount: "",
        remark: ""
      };
    },
    submitSupplement() {
      let self = this;
      this.$refs.supplement.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveRefund", {
            accountID: this.supplementData.accountID,
            opttype: "2",
            userName: this.supplementData.userName,
            beforebalance: Number(this.supplementData.beforebalance) * 10000,
            amount: Number(this.supplementData.amount) * 10000,
            remark: this.supplementData.remark
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
            self.supplementData.visible = false;
          });
        }
      });
    },
    recharge(row) {
      // let self = this;
      // this.postRequest('admin/recharge', {
      //     accountID: row.accountID,
      //     userName: row.userName
      // }).then()
      this.rechargeData = {
        visible: true,
        userName: row.userName,
        accountID: row.accountID,
        rechargeMoney: "",
        remark: ""
      };
    },
    submitRecharge() {
      let self = this;
      this.$refs.recharge.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveRecharge", {
            userName: this.rechargeData.userName,
            accountID: this.rechargeData.accountID,
            rechargeMoney: Number(this.rechargeData.rechargeMoney) * 10000,
            remark: this.rechargeData.remark
          }).then(res => {
            self.rechargeData.visible = false;
            if (res.data.success === true) {
              self.checkData();
              self.$message.success(res.data.data);
            } else self.$message.error("充值失败");
          });
        }
      });
    },
    modeifyPara(row) {
      let self = this;
      // this.modeifyParaData.visible = true;
      this.postRequest("admin/listFinanaceUpdateParams", {
        accountID: row.accountID
      }).then(res => {
        // for (let list in res.data.data) {
        //     switch (list) {
        //         case 'empList':
        //所谓脑子进水就是指这个了
        self.empList = [];
        for (let item of res.data.data.empList) {
          self.empList.push({
            label: item.nickName,
            value: item.userName
          });
        }
        // break;
        // case 'agentList':
        self.agentList = [];
        for (let item of res.data.data.agentList) {
          self.agentList.push({
            label: item.saleUserName,
            value: item.accountID
          });
        }
        // break;
        // case  'customer':
        self.modeifyParaData = {
          visible: true,
          accountID: row.accountID,
          userName: row.userName,
          saleName: res.data.data.customer.saleName,
          agentName: row.agentName,
          rank: res.data.data.customer.rank
        };
        // break;
        // }
        // }
      });
    },
    submitModeifyPara() {
      let self = this;
      this.postRequest(
        "admin/saveFinanaceUpdateParams",
        this.modeifyParaData
      ).then(res => {
        self.checkData();
        self.modeifyParaData.visible = false;
        self.resAlert(res.data);
      });
    },
    contactInfo(row) {
      this.contactInfoData = {
        visible: true,
        account: {
          id: row.id,
          accountType: row.accountType
        },
        userDetail: {
          accountID: row.accountID,
          userName: row.userName,
          companyName: row.companyName,
          address: row.address,
          nickName: row.nickName,
          mobile: row.mobile,
          phone1: row.phone,
          QQ: row.QQ,
          email: row.email,
          businessLicenes: row.businessLicenes,
          contract: row.contract
        }
      };
    },
    submitContactInfo() {
      let self = this;
      this.postRequest("admin/saveUpdateUserDetail", this.contactInfoData).then(
        res => {
          self.resAlert(res.data);
          self.checkData();
          self.contactInfoData.visible = false;
        }
      );
    }
  },
  beforeCreate() {
    let self = this;
    this.saleOpt = [];
    this.postRequest("admin/listPcnCustomer", {
      userName: "",
      agentName: "",
      saleName: "",
      fbalance: "",
      tbalance: "",
      pageNum: "",
      pageSize: ""
    }).then(res => {
      // console.log(res)
      for (let item of res.data.data.empList) {
        self.saleOpt.push({
          value: item.userName,
          label: `${item.userName}(${item.nickName})`
        });
      }
    });
  },
  mounted(){
  }
};
</script>

<style scoped>
</style>
