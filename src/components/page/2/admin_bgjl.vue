<template>
  <div class="container">
    <!-- 修改备注弹出框 -->
    <el-dialog title="修改备注" :visible.sync="updateRemarkFlage">
      <el-form :model="updateRemarkForm" ref="form" label-width="120px" v-on:keyup.enter.native="checkData">
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

    <el-form label-width="120px" inline="inline">
      <el-form-item label="账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>

      <el-form-item label="客户类型：">
        <el-select v-model="type">
          <el-option
            v-for="item in cusOptions"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="操作类型：">
        <el-select v-model="opttype">
          <el-option
            v-for="item in optOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
      <el-button type="text" @click="exportRecord">+导出</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="updateRemark(scope.row)">修改备注</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="账号"></el-table-column>
        <el-table-column prop="typeCn" label="客户类型"></el-table-column>
        <el-table-column prop="opttypeCn" label="操作类型"></el-table-column>
        <el-table-column prop="amount" label="操作金额(元)"></el-table-column>
        <el-table-column prop="beforebalance" label="操作前余额(元)"></el-table-column>
        <el-table-column prop="afterbalance" label="操作后余额(元)"></el-table-column>
        <el-table-column prop="oper" label="操作人"></el-table-column>
        <el-table-column prop="opertime" label="操作时间"></el-table-column>
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
      updateRemarkForm: {
        userName: "",
        remark: ""
      },
      index:0,
      updateRemarkFlage: false,
      userName: "",
      type: "",
      opttype: "",
      fmmddhms: "",
      tmmddhms: "",
      id: "",
      cusOptions: [
        {
          key: 0,
          label: "所有",
          value: ""
        },
        {
          key: 1,
          label: "客户",
          value: 1
        },
        {
          key: 2,
          label: "代理商",
          value: 2
        }
      ],
      optOptions: [
        {
          key: 0,
          label: "所有",
          value: ""
        },
        {
          key: 1,
          label: "赠送",
          value: 1
        },
        {
          key: 2,
          label: "补款",
          value: 2
        },
        {
          key: 3,
          label: "扣款",
          value: 3
        },
        {
          key: 4,
          label: "审核退费",
          value: 4
        }
      ],
      index: 0,
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      tableData: [],
      checkIn: false,
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
      this.postRequest("/admin/updateBalanceOptRemark", {
        id: row.id
      }).then(res => {
        return;
      });
    },
    //保存修改
    saveUpdateRemark(formName) {
      this.updateRemarkFlage = false;
      let self = this;
      this.postRequest("/admin/saveBalanceOptRemark", {
        id: this.updateRemarkForm.id,
        remark: this.updateRemarkForm.remark
      }).then(res => {
        console.log(res);
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
      this.updateRemarkForm = {};
      this.updateRemarkFlage = false;
    },
    //导出操作
    exportRecord() {
      let self = this;
      this.postRequest("/admin/exportBalanceOptRecord", {
        userName: this.userName,
        opttype: this.opttype,
        type: this.type,
        fmmddhms: this.formatDate(this.fmmddhms),
        tmmddhms: this.formatDate(this.tmmddhms),
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        if (res.data.success) {
          self.succeed(res.data.data);
        } else {
          self.failed("导出失败");
        }
      });
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
      this.postRequest("/admin/listBalanceOptRecord", {
        userName: this.userName,
        opttype: this.opttype,
        type: this.type,
        fmmddhms: this.formatDate(this.fmmddhms),
        tmmddhms: this.formatDate(this.tmmddhms),
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        self.tableData = [];
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.loading = false;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            userName: item.userName,
            typeCn: item.typeCn,
            type: item.type,
            opttypeCn: item.opttypeCn,
            opttype: item.opttype,
            amount: item.amount?(item.amount / 10000):0,
            beforebalance: item.beforebalance?(item.beforebalance / 10000):0,
            // afterbalance: item.afterbalanc?(item.afterbalance / 10000):0,
            afterbalance:Number(item.afterbalance/10000)?Number(item.afterbalance/10000):0,
            oper: item.oper,
            opertime: item.opertime,
            remark: item.remark,
            id: item.id
          });
          self.index++;
        }
      });
    }
  },
  mounted() {
    this.checkData();
  }
};
</script>

<style scoped>

</style>
