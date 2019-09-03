<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form
        inline="inline"
        :model="addClientData"
        :rules="rule1"
        label-width="120px"
        ref="addClientForm"
      >
        <el-form-item label="客户用户名：" prop="userName">
          <el-input v-model="addClientData.userName" placeholder="一般使用公司名称简称"></el-input>
        </el-form-item>
        <el-form-item label="公司名称：" prop="companyName">
          <el-input v-model="addClientData.companyName" placeholder="请输入公司名称全程"></el-input>
        </el-form-item>
        <el-form-item label="单价(元)：" prop="unitprice">
          <el-input v-model.number="addClientData.unitprice"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="nickName">
          <el-input v-model="addClientData.nickName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="mobile">
          <el-input v-model="addClientData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="联系地址：" prop="address">
          <el-input v-model="addClientData.address"></el-input>
        </el-form-item>
        <el-form-item label="固定电话：">
          <el-input v-model="addClientData.phone"></el-input>
        </el-form-item>
        <el-form-item label="QQ/msn：">
          <el-input v-model="addClientData.QQ"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="addClientData.mail"></el-input>
        </el-form-item>
      </el-form>
      <el-form-item label="客户来源：">
        <el-select filterable v-model="addClientData.source">
          <el-option
            v-for="item in sourceOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号类型：">
        <el-select filterable v-model="addClientData.accountType">
          <el-option
            v-for="item in accountTypeOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指定销售：" prop="saleName">
        <el-select filterable v-model="addClientData.saleName">
          <el-option
            v-for="item in saleNameOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="营业执照：">
        <el-upload action accept=".jpg, .png, .word" :http-request="businessLicenseChange2">
          <!--:auto-upload="false"-->
          <el-button>上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png/word文件，且不超过2M</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="合同：">
        <el-upload action accept=".jpg, .png, .word" :http-request="contractChange2">
          <!--:auto-upload="false"-->
          <el-button>上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png/word文件，且不超过2M</div>
        </el-upload>
      </el-form-item>
      <br>

      <el-button @click="handleClose">重置</el-button>
      <el-button type="primary" @click="submitAddClientData">确认提交</el-button>
    </el-form>
    <el-dialog title="添加客户" :visible.sync="addClientDataFlag" width="500px" ref="addClientForm">
      <el-form
        inline="inline"
        :model="addClientData"
        :rules="rule1"
        label-width="120px"
        ref="addClientForm"
        style="width: 450px"
      >
        <el-form-item label="客户用户名：" prop="userName">
          <el-input v-model="addClientData.userName" placeholder="一般使用公司名称简称"></el-input>
        </el-form-item>
        <el-form-item label="公司名称：" prop="companyName">
          <el-input v-model="addClientData.companyName" placeholder="请输入公司名称全程"></el-input>
        </el-form-item>
        <el-form-item label="客户来源：">
          <el-select filterable v-model="addClientData.source">
            <el-option
              v-for="item in sourceOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型：">
          <el-select filterable v-model="addClientData.accountType">
            <el-option
              v-for="item in accountTypeOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指定销售：" prop="saleName">
          <el-select filterable v-model="addClientData.saleName">
            <el-option
              v-for="item in saleNameOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单价(元)：" prop="unitprice">
          <el-input v-model.number="addClientData.unitprice"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="nickName">
          <el-input v-model="addClientData.nickName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="mobile">
          <el-input v-model="addClientData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="营业执照：">
          <el-upload action accept=".jpg, .png, .word" :http-request="businessLicenseChange2">
            <!--:auto-upload="false"-->
            <el-button>上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/word文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="合同：">
          <el-upload action accept=".jpg, .png, .word" :http-request="contractChange2">
            <!--:auto-upload="false"-->
            <el-button>上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/word文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系地址：" prop="address">
          <el-input v-model="addClientData.address"></el-input>
        </el-form-item>
        <el-form-item label="固定电话：">
          <el-input v-model="addClientData.phone"></el-input>
        </el-form-item>
        <el-form-item label="QQ/msn：">
          <el-input v-model="addClientData.QQ"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="addClientData.mail"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitAddClientData">确认添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "admin_dshkhlb",
  data() {
    return {
      addClientData: {
        addClientDataFlag:false,
        userName: "",
        companyName: "",
        agentName: "",
        agentID: "",
        source: 1,
        accountType: 1,
        saleName: "",
        unitprice: "",
        nickName: "",
        mobile: "",
        businessLicense: "",
        contract: "",
        address: "",
        phone: "",
        QQ: "",
        mail: "",
        accountID: "" //???
      },
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
          label: "sgmp客户"
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
    getSaleList() {
      // let self = this;
      // this.postRequest("admin/listAllEmployee", {
      //   t: ""
      // }).then(res => {
      //   self.saleNameOpt = [];
      //   for (let item of res.data.data) {
      //     self.saleNameOpt.push({
      //       value: item.userName,
      //       label: `${item.userName}(${item.nickName})`
      //     });
      //   }
      // });
    },
    submitAddClientData() {
      let self = this;
      this.$refs.addClientForm.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveAddCustomer", {
            userName: this.addClientData.userName,
            companyName: this.addClientData.companyName,
            agentName: this.addClientData.agentName,
            agentID: this.addClientData.agentID,
            source: this.addClientData.source,
            accountType: this.addClientData.accountType,
            saleName: this.addClientData.saleName,
            nickName: this.addClientData.nickName,
            mobile: this.addClientData.mobile,
            businessLicense: this.addClientData.businessLicense,
            contract: this.addClientData.contract,
            address: this.addClientData.address,
            phone: this.addClientData.phone,
            QQ: this.addClientData.QQ,
            mail: this.addClientData.mail,
            accountID: this.addClientData.accountID,
            unitprice: Number(this.addClientData.unitprice) * 10000
          }).then(res => {
            self.$refs.addClientForm.resetFields();
            self.checkData();
            self.resAlert(res.data);
            self.addClientData = {
              visible: false,
              userName: "",
              companyName: "",
              agentName: "",
              agentID: "",
              source: 1,
              accountType: 1,
              saleName: "",
              nickName: "",
              mobile: "",
              businessLicense: "",
              contract: "",
              address: "",
              phone: "",
              QQ: "",
              mail: "",
              accountID: "" //???
            };
          });
        } else return false;
      });
    },
    handleClose() {
      this.addClientData = {
        userName: "",
        companyName: "",
        agentName: "",
        agentID: "",
        source: 1,
        accountType: 1,
        saleName: "",
        unitprice: "",
        nickName: "",
        mobile: "",
        businessLicense: "",
        contract: "",
        address: "",
        phone: "",
        QQ: "",
        mail: "",
        accountID: "" //???
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
    }
  },
  mounted() {
    this.getSaleList();
  }
};
</script>
<style scoped>
</style>

