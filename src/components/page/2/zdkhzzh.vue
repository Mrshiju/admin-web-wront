<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="客户账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改参数</el-button>
            <el-button @click="reset(scope.row)" type="text">重置密码</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户账号"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="pcnName" label="主账号"></el-table-column>
        <el-table-column prop="saleName" label="所属销售"></el-table-column>
        <el-table-column prop="agentName" label="所属代理"></el-table-column>
        <el-table-column prop="balance" label="余额(条)"></el-table-column>
        <el-table-column label="联系信息" width="160px">
          <template slot-scope="scope">
            <div v-if="scope.row.nickName">联系人：{{scope.row.nickName}}</div>
            <div v-if="scope.row.mobile">手机：{{scope.row.mobile}}</div>
            <div v-if="scope.row.companyName">公司：{{scope.row.companyName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="modifyUserName" label="修改人"></el-table-column>
        <el-table-column prop="modifytimes" label="修改时间"></el-table-column>
        <el-table-column prop="creatorUserName" label="创建人"></el-table-column>
        <el-table-column prop="created" label="创建时间"></el-table-column>
        <el-table-column prop="accountTypeCn" label="账号类型"></el-table-column>
        <el-table-column prop="cnStatus" label="状态"></el-table-column>
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
    <el-dialog
      title="终端客户修改参数"
      :visible.sync="modifyData.visible"
      width="500px"
      ref="addClientForm"
    >
      <el-form :model="modifyData" label-width="120px" ref="modifyData" style="width: 400px">
        <el-form-item label="客户账号：" prop="userName">
          <el-input v-model="modifyData.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属销售：" prop="saleName">
          <el-select filterable v-model="modifyData.saleName">
            <el-option
              v-for="item in saleNameOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户等级：">
          <el-select filterable v-model="modifyData.rank">
            <el-option
              v-for="item in rankOpt"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyData.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify">保存</el-button>
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
      checkIn: false,
      loading: false,
      tableData: [],
      userName: "",
      modifyData: {
        visible: false,
        accountID: "",
        userName: "",
        saleName: "",
        agentName: "SYS",
        rank: ""
      },
      saleNameOpt: [],
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
        }
      ]
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
      this.postRequest("admin/listSubAccount", {
        accountID: this.$route.query.accountID,
        userName: this.userName
      }).then(res => {
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index:self.index,
            accountID: item.accountID,
            accountType: item.accountType,
            accountTypeCn:
              item.accountType === 1
                ? "行业"
                : item.accountType === 2
                ? "营销"
                : "未知",
            userName: item.userName,
            code: item.code,
            pcnName: item.pcnName,
            saleName: item.saleName,
            agentName: item.agentName,
            balance: item.userBalance.balance,
            nickName: item.userDetail.nickName,
            mobile: item.userDetail.mobile,
            companyName: item.userDetail.companyName,
            modifyUserName: item.userDetail.modifyUserName,
            modifytimes: item.userDetail.modifytimes,
            creatorUserName: item.userDetail.creatorUserName,
            created: item.userDetail.created,
            cnStatus: item.cnStatus
          });
          self.index++
        }
      });
    },
    modify(row) {
      let self = this;
      this.saleNameOpt = [];
      this.postRequest("admin/listFinanaceUpdateParams", {
        accountID: row.accountID
      }).then(res => {
        for (let item of res.data.data.empList) {
          self.saleNameOpt.push({
            label: item.userName + "(" + item.nickName + ")",
            value: item.userName
          });
        }
        self.modifyData = {
          visible: true,
          accountID: res.data.data.customer.accountID,
          userName: res.data.data.customer.userName,
          saleName: res.data.data.customer.saleName,
          agentName: "SYS",
          rank: res.data.data.customer.rank
        };
      });
    },
    submitModify() {
      let self = this;
      this.postRequest("admin/saveFinanaceUpdateParams", this.modifyData).then(
        res => {
          self.checkData();
          self.modifyData.visible = false;
          self.resAlert(res.data);
        }
      );
    },
    reset(row) {
      let self = this;
      this.$confirm("确认重置【" + row.userName + "】的密码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/resetPassword", {
              accountID: row.accountID
            })
            .then(res => {
              self.checkData();
              if (res.data.success === true) {
                self.$notify({
                  title: "重置密码成功",
                  message: res.data.message,
                  type: "success",
                  duration: 0
                });
              } else self.$message.error("重置密码失败");
            });
        })
        .catch(() => {});
    }
  },
  beforeRouteEnter(from, to, next) {
    next(vm => {
      vm.accountID = vm.$route.query.accountID;
      vm.checkData();
    });
  }
};
</script>

<style scoped>
</style>
