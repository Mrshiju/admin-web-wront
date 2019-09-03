<template>
  <div class="container">

    <!-- 修改备注弹出框 -->
    <el-dialog title="修改备注" :visible.sync="updateRemarkFlage">
      <el-form :model="updateRemarkForm" ref="form" label-width="120px">
        <el-form-item label="客户账号：">
          <el-input v-model="updateRemarkForm.userName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="备注：">
          <el-input type="textarea" v-model="updateRemarkForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveUpdateRemark('updateRemarkForm')">保存</el-button>
        <el-button @click="resetForm('updateRemarkForm')">取消</el-button>
      </div>
    </el-dialog>

    <el-form label-width="120px" inline="inline" v-on:keyup.enter.native="checkData">
      <el-form-item label="账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>

      <el-form-item label="开始时间：">
       <el-date-picker v-model="fmmddhms" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间：">
       <el-date-picker v-model="tmmddhms" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="updateRemark(scope.row)">修改备注</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="账号"></el-table-column>
        <el-table-column prop="rechargeMoney" label="充值金额(元)"></el-table-column>
        <!-- <el-table-column prop="rechargeUnit" label="单价(元)"></el-table-column> -->
        <!-- <el-table-column prop="rechargeCount" label="充值条数"></el-table-column> -->
        <el-table-column prop="oper" label="创建人"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="remark" label="操作备注"></el-table-column>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      index:0,
        updateRemarkForm: {
          userName: "",
          remark: ""
        },
        updateRemarkFlage: false,
      userName: "",
      fmmddhms: "",
      tmmddhms: "",
      index: 0,
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      tableData: [],
      checkIn: true,
      loading: false
    };
  },
  methods: {
    //   操作成功提示
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    // 操作失败提示
    failed(message) {
      this.$message.error(message);
    },
    //修改备注信息操作
    updateRemark(row) {
      this.updateRemarkFlage = true;
      this.updateRemarkForm = {
        userName: row.userName,
        remark: row.remark,
        id: row.id
      };
    },
    //保存修改
    saveUpdateRemark(formName) {
      this.updateRemarkFlage = false;
      let self = this;
      this.postRequest("/admin/saveUpdateRechargeRemark", {
        id: this.updateRemarkForm.id,
        remark: this.updateRemarkForm.remark
      }).then(res => {
        if (res.data.success) {
          self.succeed(res.data.data);
          self.checkData();
        } else {
          self.failed(res.data.resultMsg);
        }
      });
    },
    //取消表单提交
    resetForm(formName) {
      this.updateRemarkFlage = false;
    },
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
      this.postRequest("/admin/listRecharge", {
        userName: this.userName,
        opttype: this.opttype,
        type: this.type,
        fmmddhms: this.formatDate(this.fmmddhms),
        tmmddhms: this.formatDate(this.tmmddhms),
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            userName: item.userName,
            accountID: item.accountID,
            createtime: item.createtime,
            oper: item.oper,
            rechargeCount: item.rechargeCount,
            rechargeMoney: Number(item.rechargeMoney)/10000,
            rechargeUnit: item.rechargeUnit,
            remark: item.remark,
            id: item.id
          });
          self.index++;
        }
      });
    }
  },
  mounted() {
  }
};
</script>

<style scoped>
</style>
