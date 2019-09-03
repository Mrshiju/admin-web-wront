<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData(true)" label-width="120px" inline="inline">
      <el-form-item label="客户名称：">
        <el-select v-model="userName">
          <el-option
            v-for="item in saleNameOpt"
            :key="item.value"
            :label="item.value"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="指定销售：">
        <el-input v-model="saleName"></el-input>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select v-model="ischeck">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData(true)" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="audit(scope.row)" v-if="scope.row.ischeck===0">审核</el-button>
            <el-button type="text" @click="show(scope.row)" v-if="scope.row.ischeck===1">提交</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="userName" label="客户名称"></el-table-column>
        <el-table-column prop="sourceCn" label="客户来源"></el-table-column>
        <el-table-column prop="unitprice" label="单价（元）"></el-table-column>
        <el-table-column prop="accountTpyeCn" label="账号类型"></el-table-column>
        <el-table-column prop="saleName" label="指定销售"></el-table-column>
        <el-table-column prop="ischeckCn" label="审核状态"></el-table-column>
        <el-table-column width="200px" label="营业执照">
          <template slot-scope="scope" v-if="scope.row.businessLicense">
            <img v-image-preview :src="scope.row.businessLicense" style="width:200px;height:200px">
          </template>
        </el-table-column>
        <el-table-column width="200px" label="合同">
          <template slot-scope="scope" v-if="scope.row.contract">
            <img v-image-preview :src="scope.row.contract" style="width:200px;height:200px">
          </template>
        </el-table-column>
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
    <!-- //审核弹出 -->
    <el-dialog title="审核客户申请" :visible.sync="addClientDataFlag" width="500px" ref="addClientForm">
      <el-form
        inline="inline"
        :model="addClientData"
        :rules="rule1"
        label-width="120px"
        ref="addClientForm"
        style="width: 450px"
      >
        <el-form-item label="公司名称：">
          <el-input v-model="addClientData.companyName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="是否是主账号：">
          <el-input v-model="addClientData.isPCN" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="审核结果：">
          <el-input v-model="addClientData.ischeckCn" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="客户来源：">
          <el-input v-model="addClientData.source" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账号类型：">
          <el-input v-model="addClientData.accountTpye" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="指定销售：">
          <el-input v-model="addClientData.saleName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单价(元)：">
          <el-input v-model.number="addClientData.unitprice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input v-model="addClientData.nickName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="addClientData.mobile" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="营业执照：" width="150px">
          <img
            :src="addClientData.businessLicense"
            style="width:200px;height:200px"
            v-show="addClientData.businessLicense"
          >
        </el-form-item>
        <br>
        <el-form-item label="合同：">
          <img
            :src="addClientData.contract"
            style="width:200px;height:200px"
            v-show="addClientData.contract"
          >
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="addClientData.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">关 闭</el-button>
        <el-button type="primary" @click="auditPass">审核通过</el-button>
        <el-button type="primary" @click="auditReject">审核拒绝</el-button>
      </span>
    </el-dialog>

    <!-- //确认提交弹出 -->
    <el-dialog
      title="确认客户申请"
      :visible.sync="saveAddClientDataFlag"
      width="500px"
      ref="addClientForm"
    >
      <el-form
        inline="inline"
        :model="saveAddClientData"
        :rules="rule1"
        label-width="120px"
        ref="addClientForm"
        style="width: 450px"
      >
        <el-form-item label="客户用户名：">
          <el-input v-model="saveAddClientData.userName"></el-input>
        </el-form-item>
        <el-form-item label="公司名称：">
          <el-input v-model="saveAddClientData.companyName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="是否是主账号：">
          <el-input v-model="saveAddClientData.isPCN" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="审核结果：">
          <el-input v-model="saveAddClientData.ischeckCn" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="客户来源：">
          <el-input v-model="saveAddClientData.source" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账号类型：">
          <el-input v-model="saveAddClientData.accountTpye" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="指定销售：">
          <el-input v-model="saveAddClientData.saleName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单价(元)：">
          <el-input v-model.number="saveAddClientData.unitprice" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input v-model="saveAddClientData.nickName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="saveAddClientData.mobile" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="营业执照：" width="150px">
          <img
            :src="saveAddClientData.businessLicense"
            v-show="saveAddClientData.businessLicense"
            style="width:120px;height:120px"
          >
        </el-form-item>
        <br>
        <el-form-item label="合同：">
          <img
            :src="saveAddClientData.contract"
            style="width:120px;height:120px"
            v-show="saveAddClientData.contract"
          >
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="saveAddClientData.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveAddClientDataFlag = false">关 闭</el-button>
        <el-button
          type="primary"
          @click="submitAddClientData(saveAddClientData)"
          :disabled="issend"
        >确认提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "admin_dshkhlb",
  data() {
    return {
      isShowSubmitButton: false,
      userName: "",
      ischeck: "",
      saleName: "",
      options: [
        {
          label: "所有",
          value: ""
        },
        {
          label: "未审核",
          value: 0
        },
        {
          label: "审核通过",
          value: 1
        },
        {
          label: "审核拒绝",
          value: 2
        },
        {
          label: "已提交",
          value: 3
        }
      ],
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      index: 0,
      tableData: [],
      checkIn: false,
      loading: false,
      addClientDataFlag: false,
      saveAddClientDataFlag: false,
      addClientData: {
        id: "",
        userName: "全部",
        companyName: "",
        agentName: "SYS",
        agentID: 100000,
        source: "",
        accountTpye: "",
        saleName: "",
        unitprice: "",
        nickName: "",
        mobile: "",
        businessLicense: "",
        contract: "",
        address: "",
        phone: "",
        qq: "",
        mail: "",
        accountID: "", //???
        isPCN: "",
        ischeckCn: "",
        remarks: ""
      },
      saveAddClientData: {
        userName: "",
        companyName: "",
        isPCN: "",
        ischeckCn: "",
        source: "",
        accountTpye: "",
        saleName: "",
        unitprice: "",
        nickName: "",
        mobile: "",
        businessLicense: "",
        contract: "",
        address: "",
        phone: "",
        qq: "",
        mail: "",
        remarks: "",
        agentID: 100000,
        agentName: "SYS"
      },
      issend: false,
      rule1: {
        userName: [
          { required: true, message: "请输入客户用户名", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        saleName: [
          { required: true, message: "请选择指定销售", trigger: "change" }
        ],
        nickName: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入联系地址", trigger: "blur" }
        ],
        unitprice: [
          { required: true, message: "请输入单价", trigger: "blur" },
          { type: "number", min: 0, message: "请输入数字" }
        ]
      },
      sourceOpt: [
        {
          value: 1,
          label: "web客户"
        },
        {
          value: 2,
          label: "普通接口"
        },
        {
          value: 3,
          label: "cmpp客户"
        },
        {
          value: 31,
          label: "sgip客户"
        },
        {
          value: 32,
          label: "smgp客户"
        }
      ],
      accountTypeOpt: [
        {
          value: 1,
          label: "行业短信"
        },
        {
          value: 2,
          label: "营销短信"
        }
      ],
      saleNameOpt: []
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
    show(row) {
      this.saveAddClientData = {};
      this.saveAddClientDataFlag = true;
      this.saveAddClientData.companyName = row.companyName;
      this.saveAddClientData.isPCN = row.isPCN == 1 ? "是" : "否";
      this.saveAddClientData.ischeckCn = row.ischeckCn;
      this.saveAddClientData.ischeckCn = row.ischeckCn;
      this.saveAddClientData.source =
        row.source === 1
          ? "web客户"
          : row.source === 1
          ? "普通客户"
          : "cmpp客户";
      this.saveAddClientData.accountTpye =
        row.accountTpye == 1 ? "行业短信" : "营销短信";
      this.saveAddClientData.saleName = row.saleName;
      this.saveAddClientData.unitprice = row.unitprice;
      this.saveAddClientData.nickName = row.nickName;
      this.saveAddClientData.mobile = row.mobile;
      this.saveAddClientData.businessLicense = row.businessLicense;
      this.saveAddClientData.contract = row.contract;
      this.saveAddClientData.address = row.address;
      this.saveAddClientData.phone = row.phone;
      this.saveAddClientData.qq = row.qq;
      this.saveAddClientData.mail = row.mail;
      this.saveAddClientData.remarks = row.remarks;
      this.saveAddClientData.id = row.id;
      this.saveAddClientData.agentID = row.agentID;
    },
    modifyData(row) {},
    getSaleList() {
      let self = this;
      // this.postRequest("admin/listAllEmployee", {
      this.postRequest("admin/listAllSaleCustomerInfo", {
        t: ""
      }).then(res => {
        self.saleNameOpt = [];
        for (let item of res.data.data.data) {
          if (item.userName != null) {
            self.saleNameOpt.push({
              value: item.userName,
              // label: `${item.userName}${item.nickName}`
              label: item.userName
            });
          }
        }
        self.saleNameOpt.unshift({
          value: "全部",
          label: ""
        });
      });
    },
    submitAddClientData() {
      this.issend = true;
      this.saveAddClientDataFlag = false;
      let self = this;
      this.$refs.addClientForm.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveAddCustomer", {
            userName: this.saveAddClientData.userName,
            companyName: this.saveAddClientData.companyName,
            isPCN: this.saveAddClientData.isPCN,
            ischeckCn: this.saveAddClientData.ischeckCn,
            source: this.saveAddClientData.source === "web客户" ? 1 : 2,
            accountType:
              this.saveAddClientData.accountTpye === "营销短信" ? 2 : 1,
            saleName: this.saveAddClientData.saleName,
            unitprice: this.saveAddClientData.unitprice * 10000,
            nickName: this.saveAddClientData.nickName,
            mobile: this.saveAddClientData.mobile,
            businessLicense: this.saveAddClientData.businessLicense,
            contract: this.saveAddClientData.contract,
            address: this.saveAddClientData.address,
            phone: this.saveAddClientData.phone,
            qq: this.saveAddClientData.qq,
            mail: this.saveAddClientData.mail,
            remarks: this.saveAddClientData.remarks,
            id: this.saveAddClientData.id,
            agentID: 100000,
            agentName: "SYS"
          }).then(res => {
            self.issend = false;
            // self.$refs.addClientForm.resetFields();
            // self.checkData();
            // self.resAlert(res.data);
            if (res.data.success) {
              self.succeed(res.data.message);
              self.checkData(true);
            } else {
              self.failed(res.data.message);
            }
          });
        } else return false;
      });

      // this.$axios({
      //   url:'http://192.168.1.245:8010/admin/saveAddCustomer',
      //   method:'post',
      //   headers: {
      //       token: sessionStorage.ms_token
      //   },
      //   data:{
      //           userName: this.saveAddClientData.userName,
      //       companyName: this.saveAddClientData.companyName,
      //       isPCN: this.saveAddClientData.isPCN,
      //       ischeckCn: this.saveAddClientData.ischeckCn,
      //       source: this.saveAddClientData.source,
      //       accountType: this.saveAddClientData.accountTpye,
      //       saleName: this.saveAddClientData.saleName,
      //       unitprice: this.saveAddClientData.unitprice * 10000,
      //       nickName: this.saveAddClientData.nickName,
      //       mobile: this.saveAddClientData.mobile,
      //       businessLicense: this.saveAddClientData.businessLicense,
      //       contract: this.saveAddClientData.contract,
      //       address: this.saveAddClientData.address,
      //       phone: this.saveAddClientData.phone,
      //       qq: this.saveAddClientData.qq,
      //       mail: this.saveAddClientData.mail,
      //       remarks: this.saveAddClientData.remarks,
      //       id: this.saveAddClientData.id,
      //       agentID:100000,
      //       agentName:"SYS"
      //   }

      // }).then(res=>{
      //   console.log(res)
      // })
    },
    handleClose() {
      this.addClientData = {
        userName: "",
        companyName: "",
        agentName: "",
        agentID: "",
        source: "",
        accountTpye: "",
        saleName: "",
        unitprice: "",
        nickName: "",
        mobile: "",
        businessLicense: "",
        contract: "",
        address: "",
        phone: "",
        qq: "",
        mail: "",
        accountID: "", //???
        isPCN: "",
        ischeckCn: "",
        remarks: ""
      };
    },
    businessLicenseChange2(raw) {
      //文件对象：file.raw//这里是独立对象
      let self = this;
      this.formData.set("file", raw.file);
      this.postRequest("admin/uploadContractFile", this.formData).then(res => {
        // console.log(res.data.message.match(/{"filePath":"(\S*)","/)[1]);
        self.addClientData.businessLicense = res.data.message.match(
          /{"filePath":"(\S*)","/
        )[1];
      });
    },
    contractChange2(raw) {
      let self = this;
      this.formData.set("file", raw.file);
      this.postRequest("admin/uploadContractFile", this.formData).then(res => {
        // console.log(res.data.message.match(/{"filePath":"(\S*)","/)[1]);
        self.addClientData.contract = res.data.message.match(
          /{"filePath":"(\S*)","/
        )[1];
      });
    },
    handleSizeChange() {
      this.checkData(true);
    },
    handlePageChange() {
      this.checkData(true);
    },
    checkData(loadFlg) {
      this.tableData = [];
      this.checkIn = true;
      if (loadFlg) {
        let self = this;
        this.loading = true;
        this.postRequest("admin/listAllSaleCustomerInfo", {
          userName: this.userName,
          ischeck: this.ischeck,
          saleName: this.saleName
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
              index: self.index,
              id: item.id,
              userName: item.userName,
              source: item.source,
              sourceCn:
                item.source === 1
                  ? "web"
                  : item.source === 2
                  ? "普通接口"
                  : item.source === 3
                  ? "cmpp"
                  : item.source === 31
                  ? "sgip"
                  : "smgp",
              unitprice: Number(item.unitprice) / 10000,
              accountTpye: item.accountTpye,
              accountTpyeCn: item.accountTpye === 1 ? "行业短信" : "营销短信",
              saleName: item.saleName,
              businessLicense: item.businessLicense,
              contract: item.contract,
              isPCN: item.isPCN,
              ischeck: item.ischeck,
              ischeckCn:
                item.ischeck === 0
                  ? "未审核"
                  : item.ischeck === 1
                  ? "已审核"
                  : item.ischeck === 2
                  ? "审核拒绝"
                  : "已提交",
              mail: item.mail,
              mobile: item.mobile,
              nickName: item.nickName,
              phone: item.phone,
              qq: item.qq,
              remarks: item.remarks,
              companyName: item.companyName,
              agentID: 100000,
              agentName: "SYS"
            });
            self.index++;
          }
        });
      }
    },
    cancel() {},
    audit(row) {
      let self = this;
      this.addClientDataFlag = true;
      this.postRequest("admin/findSaleCustomerInfo", {
        id: row.id
      }).then(res => {
        self.addClientData = {
          accountID: res.data.data.saleCustomerInfo.accountID,
          accountTpye:
            res.data.data.saleCustomerInfo === 1 ? "行业短信" : "营销短信",
          address: res.data.data.saleCustomerInfo.address,
          businessLicense: res.data.data.saleCustomerInfo.businessLicense,
          contract: res.data.data.saleCustomerInfo.contract,
          id: res.data.data.saleCustomerInfo.id,
          isPCN: res.data.data.saleCustomerInfo.isPCN === 0 ? "非" : "是",
          ischeckCn:
            res.data.data.saleCustomerInfo.ischeck === 0
              ? "未审核"
              : res.data.data.saleCustomerInfo.ischeck === 1
              ? "审核通过"
              : "审核拒绝",
          mail: res.data.data.saleCustomerInfo.mail,
          mobile: res.data.data.saleCustomerInfo.mobile,
          nickName: res.data.data.saleCustomerInfo.nickName,
          phone: res.data.data.saleCustomerInfo.phone,
          qq: res.data.data.saleCustomerInfo.qq,
          remarks: res.data.data.saleCustomerInfo.remarks,
          saleName: res.data.data.saleCustomerInfo.saleName,
          source:
            res.data.data.saleCustomerInfo.source === 1
              ? "web"
              : res.data.data.saleCustomerInfo.source === 2
              ? "普通接口"
              : res.data.data.saleCustomerInfo.source === 3
              ? "cmpp"
              : res.data.data.saleCustomerInfo.source === 31
              ? "sgip"
              : "smgp",
          unitprice: Number(res.data.data.saleCustomerInfo.unitprice) / 10000,
          userName: res.data.data.saleCustomerInfo.userName,
          companyName: res.data.data.saleCustomerInfo.companyName
        };
      });
    },
    auditPass() {
      this.addClientDataFlag = false;
      let self = this;
      this.postRequest("admin/checkCustomerInfo", {
        ischeck: 1,
        id: this.addClientData.id,
        remarks: this.addClientData.remarks
      }).then(res => {
        if (res.data.success) {
          self.succeed(res.data.data);
          self.checkData(true);
          self.isShowSubmitButton = true;
        } else {
          self.failed(res.data.resultMsg);
        }
      });
    },
    auditReject() {
      this.addClientDataFlag = false;
      let self = this;
      this.postRequest("admin/checkCustomerInfo", {
        ischeck: 2,
        id: this.addClientData.id,
        remarks: this.addClientData.remarks
      }).then(res => {
        if (res.data.success) {
          self.succeed(res.data.data);
          self.checkData(true);
        } else {
          self.failed(res.data.resultMsg);
        }
      });
    },
    close() {
      this.addClientDataFlag = false;
    }
  },
  mounted() {
    this.getSaleList();

    this.checkData();
  }
};
</script>
<style scoped>
</style>

