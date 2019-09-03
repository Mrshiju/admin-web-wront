<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="公司名称：">
        <el-input  v-model="companyName"></el-input>
      </el-form-item>
      <el-form-item label="客户用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="申请时间：">
        <el-date-picker type="date" v-model="applyTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态：">
        <el-select v-model="auditStatus">
          <el-option
            v-for="item in auditStatusOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="addAudit">+添加签名申请</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改</el-button>
            <el-button @click="modify(scope.row)" type="text">审核</el-button>
            <el-button @click="delData(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司名称 "></el-table-column>
        <el-table-column prop="userName" label="客户用户名"></el-table-column>
        <el-table-column prop="recordCompanyName" label="备案公司名称"></el-table-column>
        <el-table-column prop="saleName" label="所属销售"></el-table-column>
        <el-table-column prop="agentName" label="代理名称"></el-table-column>
        <el-table-column prop="signeName" label="签名"></el-table-column>
        <el-table-column prop="auditStatusCn" label="审核状态"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="applyUserName" label="申请人"></el-table-column>
        <el-table-column prop="applyTime" label="申请时间"></el-table-column>
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
      <el-dialog title="添加签名申请" :visible.sync="addData.visible" width="500px">
        <el-form
          :model="addData"
          label-width="120px"
          inline="inline"
          style="width: 400px"
          ref="form1"
          :rules="rule1"
        >
          <el-form-item label="公司名称：">
            <el-select
              v-model="modifyData.companyName"
              filterable
              @change="getCustomer(modifyData.companyName)"
            >
              <el-option v-for="(item,i) of userList" :label="item.label" :value="item.label" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户用户名：">
            <el-select v-model="modifyData.userName" filterable>
              <el-option v-for="(item,i) of list" :label="item.label" :value="item.label" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备案公司名称：" prop="recordCompanyName">
            <el-input v-model="addData.recordCompanyName"></el-input>
          </el-form-item>
          <el-form-item label="签名：" prop="signeName">
            <el-input v-model="addData.signeName"></el-input>
          </el-form-item>
          <!--<el-form-item label="营业执照附件：" prop="docAttachment">-->
          <!--<el-input v-model="addData.docAttachment"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="身份证正面：">-->
          <!--<el-input v-model="addData.idcardFront"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="身份证反面：">-->
          <!--<el-input v-model="addData.idcardBack"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="授权书：">-->
          <!--<el-input v-model="addData.authBook"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="责任书：">-->
          <!--<el-input v-model="addData.responBook"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="备注：">
            <el-input v-model="addData.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addData.visible=false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改签名申请" :visible.sync="modifyData.visible" width="500px">
        <el-form
          :model="modifyData"
          label-width="120px"
          inline="inline"
          style="width: 400px"
          ref="form2"
          :rules="rule3"
        >
          <el-form-item label="公司名称：">
            <el-select
              v-model="modifyData.companyName"
              filterable
              @change="getCustomer(modifyData.companyName)"
            >
              <el-option v-for="(item,i) of userList" :label="item.label" :value="item.label" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户用户名：">
            <el-select v-model="modifyData.userName" filterable>
              <el-option v-for="(item,i) of list" :label="item.label" :value="item.label" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备案公司名称：" prop="recordCompanyName">
            <el-input v-model="modifyData.recordCompanyName"></el-input>
          </el-form-item>
          <el-form-item label="签名：" prop="signeName">
            <el-input v-model="modifyData.signeName"></el-input>
          </el-form-item>
          <!--<el-form-item label="营业执照附件：">-->
          <!--<el-input v-model="modifyData.docAttachment"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="身份证正面：">-->
          <!--<el-input v-model="modifyData.idcardFront"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="身份证反面：">-->
          <!--<el-input v-model="modifyData.idcardBack"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="授权书：">-->
          <!--<el-input v-model="modifyData.authBook"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="责任书：">-->
          <!--<el-input v-model="modifyData.responBook"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="备注：">
            <el-input v-model="modifyData.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyData.visible=false">取 消</el-button>
          <el-button type="primary" @click="submitModify">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="签名申请审核" :visible.sync="aduitData.visible" width="500px">
        <el-form
          :model="aduitData"
          label-width="120px"
          inline="inline"
          style="width: 400px"
          ref="form3"
          :rules="rule3"
        >
          <el-form-item label="公司名称：">
            <el-input v-model="aduitData.companyName" disabled></el-input>
          </el-form-item>
          <el-form-item label="客户用户名：">
            <el-input v-model="aduitData.userName" disabled></el-input>
          </el-form-item>
          <el-form-item label="备案公司名称：" prop="recordCompanyName">
            <el-input v-model="aduitData.recordCompanyName"></el-input>
          </el-form-item>
          <el-form-item label="签名：">
            <el-input v-model="aduitData.signeName" disabled></el-input>
          </el-form-item>
          <el-form-item label="营业执照附件：">
            <el-input v-model="aduitData.docAttachment"></el-input>
          </el-form-item>
          <el-form-item label="身份证正面：">
            <el-input v-model="aduitData.idcardFront"></el-input>
          </el-form-item>
          <el-form-item label="身份证反面：">
            <el-input v-model="aduitData.idcardBack"></el-input>
          </el-form-item>
          <el-form-item label="授权书：">
            <el-input v-model="aduitData.authBook"></el-input>
          </el-form-item>
          <el-form-item label="责任书：">
            <el-input v-model="aduitData.responBook"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="aduitData.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="aduitData.visible=false">取 消</el-button>
          <el-button type="primary" @click="submitAudit">驳回</el-button>
          <el-button type="primary" @click="submitAudit">保存</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  data() {
    return {
      index:0,
      sum: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: false,
      loading: false,
      tableData: [],
      companyName: "",
      userName: "",
      applyTime: new Date(),
      auditStatus: 0,
      auditStatusOpt: [
        {
          value: 0,
          label: "所有"
        },
        {
          value: 1,
          label: "待审核"
        },
        {
          value: 2,
          label: "审核驳回"
        },
        {
          value: 3,
          label: "审核通过"
        }
      ],
      userList: [],
      list: [],
      addData: {
        visible: false,
        id: "",
        companyName: "",
        userName: "",
        accountID: "",
        recordCompanyName: "",
        signeName: "",
        docAttachment: "",
        idcardFront: "",
        idcardBack: "",
        authBook: "",
        responBook: "",
        remark: ""
      },
      modifyData: {
        visible: false,
        id: "",
        companyName: "",
        userName: "",
        accountID: "",
        recordCompanyName: "",
        signeName: "",
        docAttachment: "",
        idcardFront: "",
        idcardBack: "",
        authBook: "",
        responBook: "",
        remark: ""
      },
      aduitData: {
        visible: false
      },
      rule1: {
        companyName: {
          required: true,
          message: "请输入备案公司名称",
          trigger: "blur"
        },
        userName: {
          required: true,
          message: "请输入备案公司名称",
          trigger: "blur"
        },
        recordCompanyName: {
          required: true,
          message: "请输入备案公司名称",
          trigger: "blur"
        },
        signeName: { required: true, message: "请输入签名", trigger: "blur" }
        // docAttachment: {required: true, message: '请输入签名', trigger: 'blur'},
      },
      rule2: {
        recordCompanyName: {
          required: true,
          message: "请输入备案公司名称",
          trigger: "blur"
        },
        signeName: { required: true, message: "请输入签名", trigger: "blur" }
      },
      rule3: {
        recordCompanyName: {
          required: true,
          message: "请输入备案公司名称",
          trigger: "blur"
        }
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
      this.postRequest("admin/listAllCustomerSign", {
        // pageNum: this.pageNum,
        // pageSize: this.pageSize,
        userName: this.userName,
        companyName: this.companyName,
        applyTime: this.formatDate(this.applyTime),
        auditStatus: this.auditStatus
      }).then(res => {
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            id: item.id,
            index:self.index,
            companyName: item.companyName,
            recordCompanyName: item.recordCompanyName,
            saleName: item.saleName,
            auditStatusCn: item.auditStatusCn,
            remark: item.remark,
            applyUserName: item.applyUserName,
            userName: item.userName,
            agentName: item.agentName,
            signeName: item.signeName,
            applyTime: item.applyTime
          });
          self.index++
        }
      });
    },
    addAudit() {
      this.addData.visible = true;
      let self = this;
      this.postRequest("admin/editCustomerSign", {
        id: ""
      }).then(res => {
        for (let item of res.data.data.userList) {
          self.userList.push({
            label: item.companyName
          });
        }
      });
    },
    submitAdd() {},
    delData(row) {
      let self = this;
      this.$confirm(
        "确认删除扩展对应签名【" + row.userName + "," + row.signeName + "】?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self
            .postRequest("admin/deleteCustomerSign", {
              id: row.id
            })
            .then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
        })
        .catch(() => {});
    },
    getCustomer(cus) {
      this.list = [];
      let self = this;
      this.postRequest("admin/selectUserByCompanyNameToSign", {
        companyName: cus
      }).then(res => {
        for (let item of res.data.data) {
          self.list.push({
            label: item.userName
          });
        }
      });
    },
    modify(row) {
      let self = this;
      this.postRequest("admin/editCustomerSign", {
        id: row.id
      }).then(res => {
        for (let item of res.data.data.userList) {
          self.userList.push({
            label: item.companyName
          });
        }
        self.modifyData = {
          visible: true,
          id: res.data.data.singe.id,
          companyName: res.data.data.singe.companyName,
          userName: res.data.data.singe.userName,
          accountID: res.data.data.singe.accountID,
          recordCompanyName: res.data.data.singe.recordCompanyName,
          signeName: res.data.data.singe.signeName,
          docAttachment: res.data.data.singe.docAttachment,
          idcardFront: res.data.data.singe.idcardFront,
          idcardBack: res.data.data.singe.idcardBack,
          authBook: res.data.data.singe.authBook,
          responBook: res.data.data.singe.responBook,
          remark: res.data.data.singe.remark,
          versionNo: res.data.data.singe.versionNo
        };
      });
    },
    submitModify() {},
    submitAudit() {}
  }
};
</script>

<style scoped >

</style>
