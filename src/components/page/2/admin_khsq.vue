<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <!-- <el-form-item label="用户名：">
        <el-input v-model="userName"></el-input>
      </el-form-item>-->
      <el-form-item label="用户名：">
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="userName"
          :fetch-suggestions="querySearch"
          placeholder="请输入用户名"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
            <span class="addr">{{ item.address }}</span>
          </template>
        </el-autocomplete>
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
        <el-button @click="checkData" type="primary" plain>查询</el-button>
        <el-button @click="addClient" type="primary" plain v-if="adminKhsqAdd">添加客户</el-button>
      </el-form-item>
    </el-form>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="modify(scope.row)" v-if="scope.row.ischeck===2">修改信息</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="userName" label="客户名称"></el-table-column>
        <el-table-column prop="sourceCn" label="客户来源"></el-table-column>
        <el-table-column prop="unitprice" label="单价（元）"></el-table-column>
        <el-table-column prop="accountTpyeCn" label="账号类型"></el-table-column>
        <!-- <el-table-column prop="saleName" label="指定销售"></el-table-column> -->
        <el-table-column prop="ischeckCn" label="审核状态"></el-table-column>
        <el-table-column label="营业执照" width="150">
          <template slot-scope="scope" v-if="scope.row.businessLicense">
            <img v-image-preview :src="scope.row.businessLicense" style="width:150px;height:120px">
          </template>
        </el-table-column>
        <el-table-column label="合同" width="150">
          <template slot-scope="scope" v-if="scope.row.contract">
            <img v-image-preview :src="scope.row.contract" style="width:150px;height:120px">
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
    <!-- //申请弹出 -->
    <el-dialog title="添加客户申请" :visible.sync="addClientDataFlag" width="500px" ref="addClientData">
      <el-form
        inline="inline"
        :model="addClientData"
        :rules="rule1"
        label-width="120px"
        ref="addClientData"
        style="width: 450px"
        action="#"
        encytype="multipart/form-data"
      >
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
          <el-select filterable v-model="addClientData.accountTpye">
            <el-option
              v-for="item in accountTypeOpt"
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

        <el-form-item label="营业执照：" prop="businessLicense">
          <img
            :src="addClientData.businessLicense"
            alt="营业执照"
            style="width:220px;height:400px"
            v-if="addClientData.businessLicense"
          >
          <el-upload
            action
            accept=".jpg, .png, .word"
            :on-change="function (res,file) {return fileChange(res,file,1)}"
            :http-request="businessLicenseChange2"
            :file-list="fileList1"
            id="businessLicense"
            ref="uploadFile1"
            :on-success="Licenseds"
          >
            <el-button>上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/word文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="合同：" prop="contract">
          <img
            :src="addClientData.contract"
            alt="营业执照"
            style="width:220px;height:400px"
            v-if="addClientData.contract"
          >
          <el-upload
            action
            accept=".jpg, .png, .word"
            :on-change="function (res,file) {return fileChange(res,file,2)}"
            :http-request="contractChange2"
            :file-list="fileList2"
            ref="uploadFile2"
            :on-success="contractsSize"
          >
            <el-button>上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/word文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addClientData')">取 消</el-button>
        <el-button type="primary" @click="submitAddClientData(addClientData)">确认添加</el-button>
      </span>
    </el-dialog>
    <!-- //修改弹出 -->
    <el-dialog
      title="修改客户申请"
      :visible.sync="modifyClientDataFlag"
      width="500px"
      ref="modifyClientForm"
    >
      <el-form
        inline="inline"
        :model="modifyClientData"
        :rules="rule1"
        label-width="120px"
        ref="modifyClientForm"
        style="width: 450px"
        action="#"
        encytype="multipart/form-data"
      >
        <el-form-item label="公司名称：" prop="companyName">
          <el-input v-model="modifyClientData.companyName" placeholder="请输入公司名称全程"></el-input>
        </el-form-item>
        <el-form-item label="客户来源：">
          <el-select filterable v-model="modifyClientData.source">
            <el-option
              v-for="item in sourceOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型：">
          <el-select filterable v-model="modifyClientData.accountTpye">
            <el-option
              v-for="item in accountTypeOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单价(元)：" prop="unitprice">
          <el-input v-model.number="modifyClientData.unitprice"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="nickName">
          <el-input v-model="modifyClientData.nickName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="mobile">
          <el-input v-model="modifyClientData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="营业执照：" prop="businessLicense">
          <img
            :src="modifyClientData.businessLicense"
            alt="营业执照"
            style="width:220px;height:400px"
            v-if="modifyClientData.businessLicense"
          >
          <el-upload
            action
            accept=".jpg, .png, .word"
            :on-change="function (res,file) {return fileChange(res,file,3)}"
            ref="uploadFile3"
            :http-request="businessLicenseChange1"
            :file-list="fileList3"
          >
            <el-button>重新上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/word文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="合同：" prop="contract">
          <img
            :src="modifyClientData.contract"
            alt="合同"
            style="width:220px;height:400px"
            v-if="modifyClientData.contract"
          >
          <el-upload
            action
            accept=".jpg, .png, .word"
            :on-change="function (res,file) {return fileChange(res,file,4)}"
            ref="uploadFile4"
            :http-request="contractChange1"
            :file-list="fileList4"
          >
            <el-button>重新上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/word文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close('modifyClientData')">取 消</el-button>
        <el-button type="primary" @click="submitModifyClientData">确认修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "admin_khsq",
  data() {
    return {
      userName: "",
      ischeck: "",
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
      formData: new FormData(),
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      index: 0,
      tableData: [],
      checkIn: true,
      loading: false,
      addClientDataFlag: false,
      addClientData: {
        userName: "",
        // companyName: "",
        companyName: "",
        agentName: "",
        agentID: "",
        source: 1,
        accountTpye: 1,
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
        remarks: "",
        id: ""
      },
      modifyClientDataFlag: false,
      modifyClientData: {
        userName: "",
        // companyName: "",
        companyName: "",
        agentName: "",
        agentID: "",
        source: 1,
        accountTpye: 1,
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
        remarks: "",
        id: ""
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
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: this.validPhone, trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入联系地址", trigger: "blur" }
        ],
        unitprice: [
          { required: true, message: "请输入单价", trigger: "blur" },
          { type: "number", min: 0, message: "请输入数字" }
        ],
        businessLicense: [
          { required: true, message: "营业执照不能为空", trigger: "blur" }
        ],
        contract: [{ required: true, message: "合同不能为空", trigger: "blur" }]
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
        }
        // {
        //   value: 31,
        //   label: "sgip客户"
        // },
        // {
        //   value: 32,
        //   label: "smgp客户"
        // }
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
      saleNameOpt: [],
      contract: "",
      Licensed: "",
      name: "",
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      adminKhsqAdd: false,
      restaurants: [],
      historyLists: []
    };
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    loadAll() {
      return this.historyLists;
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
    modify(row) {
      this.modifyClientDataFlag = true;
      let self = this;
      this.postRequest("admin/findSaleCustomerInfo", {
        id: row.id
      }).then(res => {
        // console.log(res)
        self.modifyClientData = {
          // res.data.data.saleCustomerInfo;
          userName: res.data.data.saleCustomerInfo.userName,
          companyName: res.data.data.saleCustomerInfo.companyName,
          agentName: res.data.data.saleCustomerInfo.agentName,
          agentID: res.data.data.saleCustomerInfo.agentID,
          source: 1,
          accountTpye: 1,
          unitprice: Number(res.data.data.saleCustomerInfo.unitprice) / 10000,
          nickName: res.data.data.saleCustomerInfo.nickName,
          mobile: res.data.data.saleCustomerInfo.mobile,
          businessLicense: res.data.data.saleCustomerInfo.businessLicense,
          contract: res.data.data.saleCustomerInfo.contract,
          address: res.data.data.saleCustomerInfo.address,
          phone: res.data.data.saleCustomerInfo.phone
            ? res.data.data.saleCustomerInfo.phone
            : "",
          qq: res.data.data.saleCustomerInfo.qq
            ? res.data.data.saleCustomerInfo.qq
            : "",
          mail: res.data.data.saleCustomerInfo.mail,
          accountID: res.data.data.saleCustomerInfo.accountID, //???
          isPCN: res.data.data.saleCustomerInfo.isPCN,
          ischeckCn: res.data.data.saleCustomerInfo.ischeckCn,
          remarks: res.data.data.saleCustomerInfo.remarks,
          id: res.data.data.saleCustomerInfo.id
        };
      });
    },
    submitModifyClientData() {
      this.modifyClientDataFlag = false;
      let self = this;
      this.$refs.modifyClientForm.validate(valid => {
        if (valid) {
          this.postRequest("admin/updateSaleCustomerInfo", {
            id: this.modifyClientData.id,
            companyName: this.modifyClientData.companyName,
            source: this.modifyClientData.source,
            accountTpye: this.modifyClientData.accountTpye,
            saleName: window.sessionStorage.saleName,
            nickName: this.modifyClientData.nickName,
            mobile: this.modifyClientData.mobile,
            businessLicense: this.modifyClientData.businessLicense,
            contract: this.modifyClientData.contract,
            address: this.modifyClientData.address,
            phone: this.modifyClientData.phone,
            QQ: this.modifyClientData.qq,
            mail: this.modifyClientData.mail,
            unitprice: Number(this.modifyClientData.unitprice) * 10000
          })
            .then(res => {
              // self.$refs.modifyClientForm.resetFields();
              self.checkData();
              self.succeed("修改成功");
              self.modifyClientData = {
                companyName: "",
                agentName: "",
                agentID: "",
                source: 1,
                accountTpye: 1,
                nickName: "",
                mobile: "",
                businessLicense: "",
                contract: "",
                address: "",
                phone: "",
                qq: "",
                mail: "",
                accountID: ""
              };
            })
            .catch(err => {
              self.failed("修改失败，请联系后台");
            });
        } else {
          self.failed("修改失败，请联系后台");
        }
      });
    },
    resetForm(formName) {
      this.addClientDataFlag = false;
    },
    fileChange(file, fileList, fileFlg) {
      if (file.status === "success") {
        if (fileFlg === 1) {
          //清除文件对象
          this.$refs.uploadFile1.clearFiles();
          // 重新手动赋值filstList， 免得自定义上传成功了, 而fileList并没有动态改变， 这样每次都是上传一个对象
          this.fileList1 = [{ name: file.name, url: file.url }];
        } else if (fileFlg === 2) {
          this.$refs.uploadFile2.clearFiles();
          this.fileList2 = [{ name: file.name, url: file.url }];
        } else if (fileFlg === 3) {
          this.$refs.uploadFile3.clearFiles();
          this.fileList3 = [{ name: file.name, url: file.url }];
        } else {
          this.$refs.uploadFile4.clearFiles();
          this.fileList4 = [{ name: file.name, url: file.url }];
        }
      }
    },
    // beforeupload(file) {
    //     this.formData.append('file', file)
    //     return false
    // },
    contractsSize(response, file, fileList) {
      this.contract = file.status;
    },
    Licenseds(response, file, fileList) {
      this.Licensed = file.status;
    },
    submitAddClientData() {
      let self = this;
      this.$refs.addClientData.validate(valid => {
        if (valid) {
          this.addClientDataFlag = false;
          this.postRequest("admin/saveSaleCustomerInfo", {
            companyName: this.addClientData.companyName,
            source: this.addClientData.source,
            accountTpye: this.addClientData.accountTpye,
            saleName: window.sessionStorage.saleName,
            nickName: this.addClientData.nickName,
            mobile: this.addClientData.mobile,
            businessLicense: this.addClientData.businessLicense,
            contract: this.addClientData.contract,
            address: this.addClientData.address,
            phone: this.addClientData.phone,
            QQ: this.addClientData.qq,
            mail: this.addClientData.mail,
            unitprice: Number(this.addClientData.unitprice) * 10000
          }).then(res => {
            self.resetForm();
            self.checkData();
            self.succeed(res.data.data);
            self.addClientData = {
              companyName: "",
              agentName: "",
              agentID: "",
              source: 1,
              accountTpye: 1,
              nickName: "",
              mobile: "",
              businessLicense: "",
              contract: "",
              address: "",
              phone: "",
              qq: "",
              mail: "",
              accountID: "" //???
            };
            self.$refs["uploadFile1"].clearFiles();
            self.$refs["uploadFile2"].clearFiles();
          });
        } else {
          self.failed("请填写完整信息");
        }
      });
    },
    handleClose() {
      this.addClientDataFlag = false;
      this.addClientData = {
        // companyName: "",
        companyName: "",
        agentName: "",
        agentID: "",
        source: 1,
        accountTpye: 1,
        unitprice: "",
        nickName: "",
        mobile: "",
        businessLicense: "",
        contract: "",
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
      // console.log(raw);
      let self = this;
      this.formData.set("file", raw.file);
      this.postRequest("admin/uploadPic", this.formData).then(res => {
        self.addClientData.businessLicense = res.data.url;
        raw.onSuccess(res.data);
      });
    },
    contractChange2(raw) {
      let self = this;
      this.formData.set("file", raw.file);
      this.postRequest("admin/uploadPic", this.formData).then(res => {
        self.addClientData.contract = res.data.url;
        raw.onSuccess(res.data);
      });
    },
    businessLicenseChange1(raw) {
      //文件对象：file.raw//这里是独立对象
      let self = this;
      this.formData.set("file", raw.file);
      this.postRequest("admin/uploadPic", this.formData).then(res => {
        self.modifyClientData.businessLicense = res.data.url;
      });
    },
    contractChange1(raw) {
      let self = this;
      this.formData.set("file", raw.file);
      this.postRequest("admin/uploadPic", this.formData).then(res => {
        self.modifyClientData.contract = res.data.url;
      });
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    async getlistAllCustomers() {
      let res = await this.postRequest("admin/listAllCustomers", {
        t: ""
      });
      for (let i of res.data.data) {
        this.historyLists.push({
          value: i.userName
        });
      }
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listAllSaleCustomerInfo", {
        userName: this.userName,
        ischeck: this.ischeck,
        saleName: window.sessionStorage.saleName
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
            unitprice: item.unitprice ? Number(item.unitprice) / 10000 : 0,
            accountTpye: item.accountTpye,
            accountTpyeCn: item.accountTpye === 1 ? "行业短信" : "营销短信",
            // saleName: item.saleName,
            businessLicense: item.businessLicense,
            contract: item.contract,
            isPCN: item.isPCN,
            ischeck: item.ischeck,
            ischeckCn:
              item.ischeck === 0
                ? "待审核"
                : item.ischeck === 1
                ? "审核通过"
                : item.ischeck === 2
                ? "审核拒绝"
                : "已提交",
            mail: item.mail,
            mobile: item.mobile,
            nickName: item.nickName,
            phone: item.phone,
            qq: item.qq,
            remarks: item.remarks,
            companyName: item.companyName
          });
          self.index++;
        }
      });
    },
    checkButtonRole() {
      let self = this;
      this.postRequest("admin/clickShowCheck", {
        token: ""
      }).then(res => {
        if (res.data.success) {
          let codes = res.data.data.codes;
          self.adminKhsqAdd = codes.includes("admin_khsq_add");
        } else {
          self.failed();
        }
      });
    },
    cancel() {},
    addClient() {
      this.addClientDataFlag = true;
    },
    close(formName) {
      this.modifyClientDataFlag = false;
    }
  },
  mounted() {
    // this.getSaleList();
    let name = sessionStorage.getItem("saleName");
    this.name = name;
    this.restaurants = this.loadAll();
    this.getlistAllCustomers();
  },
  created() {
    this.checkButtonRole();
  }
};
</script>
<style scoped>
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete li.addr {
  font-size: 12px;
  color: #b4b4b4;
}

.my-autocomplete li.highlighted .addr {
  color: #ddd;
}
</style>

