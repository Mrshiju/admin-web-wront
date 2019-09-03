<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="客户账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="特服号：">
        <el-input  v-model="code"></el-input>
      </el-form-item>
      <el-form-item label="签名：">
        <el-input  v-model="sign"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改</el-button>
            <el-button @click="delData(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户账号 "></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="sign" label="签名"></el-table-column>
        <el-table-column prop="matchModelCN" label="匹配模式"></el-table-column>
        <el-table-column prop="typeCn" label="匹配类型"></el-table-column>
        <el-table-column prop="oper" label="操作人"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="modifytime" label="修改时间"></el-table-column>
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
      <div>
        <el-dialog title="修改扩展绑定签名" :visible.sync="modifyData.visible" width="500px">
          <el-form v-model="modifyData" label-width="120px" inline="inline" style="width: 400px">
            <el-form-item label="客户账号：">
              <el-input disabled v-model="modifyData.userName"></el-input>
            </el-form-item>
            <el-form-item label="特服号：">
              <el-input disabled v-model="modifyData.code"></el-input>
            </el-form-item>
            <el-form-item label="对应签名：">
              <el-input v-model="modifyData.sign"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="modifyData.visible = false">取 消</el-button>
            <el-button type="primary" @click="submitModify">保存</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  name: "A",
  data() {
    return {
      index:0,
      sum: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: true,
      loading: false,
      tableData: [],
      userName: "",
      code: "",
      sign: "",
      modifyData: {
        visible: false,
        id: "",
        userName: "",
        code: "",
        sign: ""
      }
    };
  },
  methods: {
    exportData() {},
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    delData(row) {
      this.$confirm(
        "确认删除扩展对应签名【用户名：" +
          row.userName +
          ",扩展号：" +
          row.code +
          ",签名：" +
          row.sign +
          "】?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let self = this;
          this.postRequest("admin/deleteExtBindSign", {
            id: row.id,
            accountID: row.accountID,
            code: row.code ? row.code : ""
          }).then(res => {
            self.checkData();
            self.resAlert(res.data);
          });
        })
        .catch(() => {});
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listExtBindSign", {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userName: this.userName,
        code: this.code,
        sign: this.sign
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
            accountID: item.accountID,
            code: item.code,
            sign: item.sign,
            matchModelCN: item.matchModelCN,
            typeCn: item.typeCn,
            oper: item.oper,
            createtime: item.createtime,
            modifytime: item.modifytime
          });
          self.index++
        }
      });
    },
    modify(row) {
      this.modifyData = {
        visible: true,
        id: row.id,
        userName: row.userName,
        code: row.code,
        sign: row.sign
      };
    },
    submitModify() {
      let self = this;
      this.postRequest("admin/saveEditExtBindSign", this.modifyData).then(
        res => {
          self.checkData();
          self.resAlert(res.data);
          self.modifyData.visible = false;
        }
      );
    }
  }
};
</script>

<style scoped>
</style>
