<template>
  <div class="container">
    <el-form
      label-width="120px"
      inline="inline"
      :model="addDataForm"
      :rules="rules"
      ref="addDataForm"
    >
      <el-form-item label="用户名" prop="userName">
        <el-select v-model="addDataForm.userName" filterable>
          <el-option
            v-for="item in options1"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="网关" prop="gateway">
        <el-select v-model="addDataForm.gateway" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="调整比例：" prop="deductedProportion">
        <el-input  v-model="addDataForm.deductedProportion" clearable></el-input>
      </el-form-item>
      <el-form-item label="扣量标准：" prop="deductNum">
        <el-input  v-model="addDataForm.deductNum" clearable></el-input>
      </el-form-item>

      <el-form-item label="免白省份：">
        <el-checkbox-group v-model="addAreaList">
          <el-checkbox v-for="item of checkList" :key="item" :label="item" :value="item"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="备注：">
        <el-input type="textarea" autosize placeholder="请输入内容" v-model="addDataForm.remark"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveAddDeducted('addDataForm')">保存</el-button>
        <el-button @click="resetForm('addDataForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "admin_fxbglb",
  data() {
    return {
      options1: [],
      options2: [],
      checkList: [
        "北京",
        "安徽",
        "福建",
        "重庆",
        "甘肃",
        "广东",
        "广西",
        "贵州",
        "海南",
        "河北",
        "河南",
        "湖北",
        "湖南",
        "黑龙江",
        "宁夏",
        "江苏",
        "江西",
        "吉林",
        "辽宁",
        "内蒙古",
        "青海",
        "陕西",
        "山西",
        "山东",
        "上海",
        "四川",
        "天津",
        "新疆",
        "西藏",
        "云南",
        "浙江",
        "台湾",
        "香港",
        "澳门"
      ],
      rules: {
        userName: [
          { required: true, message: "请输入有效值", trigger: "blur" }
        ],
        gateway: [{ required: true, message: "请输入有效值", trigger: "blur" }],
        deductedProportion: [
          { required: true, message: "请输入有效值", trigger: "blur" }
        ],
        deductNum: [
          { required: true, message: "请输入有效值", trigger: "blur" }
        ]
      },
      addAreaList: [],
      addCustomerList: [],
      addGatewayList: [],
      addDataForm: {
        accountId: "",
        userName: "",
        gateway: "",
        gatewayname: "",
        deductedProportion: "",
        deductNum: "",
        undeductedArea: "",
        createdAccountId: "",
        createdUserName: "",
        createdTime: "",
        modifyTime: "",
        modifyAccountId: 0,
        modifyUserName: "",
        status: "",
        remark: ""
      },

      pageNum: 1,
      pageSize: 30,
      sum: 0,
      tableData: [],
      checkIn: false
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
    //提交表单保存添加
    saveAddDeducted(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          self.addDataForm.undeductedArea = self.addAreaList.join(",");
          for (let i = 0; i < this.addCustomerList.length; i++) {
            if (
              this.addCustomerList[i].userName === this.addDataForm.userName
            ) {
              this.addDataForm.accountId = this.addCustomerList[
                i
              ].accountID;
              this.addDataForm.createdUserName = this.addCustomerList[
                i
              ].userName;
              this.addDataForm.createdAccountId = this.addCustomerList[
                i
              ].accountID;
            }
          }
          for (let i = 0; i < this.addGatewayList.length; i++) {
            if (
              this.addGatewayList[i].gateway === this.addDataForm.gateway
            ) {
              this.addDataForm.gatewayname = this.addGatewayList[
                i
              ].gatewayname;
              this.addDataForm.modifyTime = this.addGatewayList[
                i
              ].modifytime;
              this.addDataForm.modifyUserName = this.addGatewayList[
                i
              ].modifyoper;
              this.addDataForm.status = 0;
            }
          }

          this.tableData = [];
          this.postRequest("admin/saveAddUserAmountDeducted", {
            userAmountDeducted: this.addDataForm
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.resultMsg);
              //提交成功 表单置空
              self.$refs[formName].resetFields();
              self.addAreaList = [];
              self.addDataForm.remark = "";
            } else {
              self.failed(res.data.resultMsg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //取消提交
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    cancel() {}
  },
  beforeCreate() {
    let self = this;
    this.postRequest("admin/addUserAmountDeducted", null).then(res => {
      self.addGatewayList = [];
      self.addCustomerList = [];
      self.addCustomerList = res.data.data.customerList;
      self.addGatewayList = res.data.data.gatewayList;

      for (let item of self.addCustomerList) {
        self.options1.push({
          label: item.userName,
          value: item.userName,
          id: item.id
        });
      }
      for (let item of self.addGatewayList) {
        self.options2.push({
          label: `${item.gateway}(${item.gatewayname})`,
          value: item.gateway,
          id: item.id
        });
      }
    });
  }
};
</script>

<style scoped>
</style>
