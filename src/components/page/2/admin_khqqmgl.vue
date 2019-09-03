<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="addGateway">+添加客户去签名</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="100px" label="操作">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="text">删除</el-button>
            <el-button @click="forbidden(scope.row)" type="text">{{scope.row.status==1?'禁用':'启用'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column label="移动是否去签">
          <template slot-scope="scope">{{scope.row.isCmLeft===1?'是':'否'}}</template>
        </el-table-column>
        <el-table-column label="联通是否去签">
          <template slot-scope="scope">{{scope.row.isCtLeft===1?'是':'否'}}</template>
        </el-table-column>
        <el-table-column label="电信是否去签">
          <template slot-scope="scope">{{scope.row.isCuLeft===1?'是':'否'}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.status===1?'启用':'禁用'}}</template>
        </el-table-column>
        <el-table-column prop="createdUserName" label="创建人"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间"></el-table-column>
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
    <el-dialog title="添加客户去签名" :visible.sync="addData.visible" width="500px">
      <el-form label-width="150px" style="width: 400px" :model="addData">
        <el-form-item label="用户名：">
          <el-select filterable v-model="addData.userName">
            <el-option v-for="(item,i) in userNameList" :label="item.label" :value="item.value" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="移动是否去签：">
          <el-radio-group v-model="addData.isCmLeft">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联通是否去签：">
          <el-radio-group v-model="addData.isCuLeft">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电信是否去签：">
          <el-radio-group v-model="addData.isCtLeft">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addData.visible=false">取消</el-button>
        <el-button type="primary" @click="submitAdd">保存</el-button>
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
      userNameList: [],
      addData: {
        visible: false,
        userName: "",
        isCmLeft: 0,
        isCuLeft: 0,
        isCtLeft: 0
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
      this.postRequest("admin/listUserLeftSign", {
        userName: this.userName
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index:self.index,
            accountId: item.accountId,
            createdAccountId: item.createdAccountId,
            id: item.id,
            userName: item.userName,
            isCmLeft: item.isCmLeft,
            isCuLeft: item.isCuLeft,
            isCtLeft: item.isCtLeft,
            status: item.status,
            createdUserName: item.createdUserName,
            createdTime: item.createdTime
          });
          self.index++
        }
      });
    },
    addGateway() {
      let self = this;
      this.userNameList = [];
      this.postRequest("admin/addUserLeftSign", {
        t: ""
      }).then(res => {
        for (let item of res.data.data.customerList) {
          self.userNameList.push({
            label: item.userName,
            value: item.userName + "_" + item.id
          });
        }
        self.addData.visible = true;
      });
    },
    submitAdd() {
      let self = this;
      if (this.addData.userName !== "") {
        this.postRequest("admin/saveUserLeftSign", this.addData).then(res => {
          self.checkData();
          self.addData.visible = false;
          self.resAlert(res.data);
        });
      } else this.$message.warning("请选择用户名");
    },
    del(row) {
      let self = this;
      this.$confirm("确认删除【" + row.userName + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deleteUserLeftSign", {
            id: row.id
          }).then(res => {
            self.checkData();
            self.resAlert(res.data);
          });
        })
        .catch(() => {});
    },
    forbidden(row) {
      let self = this;
      this.$confirm(
        row.status === 0
          ? "启用【" + row.userName + "】?"
          : "禁用【" + row.userName + "】?",
        "提示",
        {
          // '确认' + row.status === 0 ? '启用' : '禁用' + '【' + row.userName + '】?', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.postRequest("admin/changeUserLeftSignStatus", {
            id: row.id,
            status: row.status === 0 ? 1 : 0
          }).then(res => {
            self.checkData();
            self.resAlert(res.data);
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
</style>
