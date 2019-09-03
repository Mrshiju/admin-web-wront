<template>
  <div class="container">
    <el-button type="text" @click="dialogFormVisible = true">+添加号段</el-button>
    <el-form label-width="120px" inline="inline" v-on:keyup.enter.native="checkData">
      <el-form-item label="号段：">
        <el-input v-model="mobile"></el-input>
      </el-form-item>

      <el-form-item label="所属运营商：">
        <el-select v-model="operaid">
          <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加号段弹出框 -->
    <el-dialog title="添加号段" :visible.sync="dialogFormVisible">
      <el-form :model="addGatewayForm" :rules="rules" ref="addGatewayForm" label-width="120px">
        <el-form-item label="号段：" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addGatewayForm.mobile" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="运营商：" prop="operaid">
          <el-select v-model="addGatewayForm.operaid">
            <el-option
              v-for="item in dialogOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddNumSeg('addGatewayForm')">添加</el-button>
        <el-button @click="resetForm('addGatewayForm')">取消</el-button>
      </div>
    </el-dialog>

    <!-- 修改号段弹出框 -->
    <el-dialog title="号段修改" :visible.sync="modifyNumSegFlag">
      <el-form :model="modifyNumSegForm" :rules="rules" ref="modifyNumSegForm" label-width="120px">
        <el-form-item label="号段：" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="modifyNumSegForm.mobile" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="运营商：" prop="operaid">
          <el-select v-model="modifyNumSegForm.operaid">
            <el-option
              v-for="item in dialogOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveModifyGateway('modifyNumSegForm')">保存</el-button>
        <el-button @click="resetForm('modifyNumSegForm')">取消</el-button>
      </div>
    </el-dialog>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="modifyData(scope.row)">修改</el-button>
            <el-button type="text" @click="deleteDate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column width="150px" prop="mobile" label="号段"></el-table-column>
        <el-table-column prop="operaidCn" label="运营商"></el-table-column>
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
      index: 0,
      modifyNumSegFlag: false,
      dialogFormVisible: false,
      addGatewayForm: {
        mobile: "",
        operaid: ""
      },
      modifyNumSegForm: {},
      rules: {
        mobile: [{ required: true, message: "不能为空", trigger: "blur" }],
        operaid: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      options: [
        {
          label: "全部",
          id: 0,
          value: null
        },
        {
          label: "移动",
          id: 1,
          value: 1
        },
        {
          label: "联通",
          id: 2,
          value: 2
        },
        {
          label: "电信",
          id: 3,
          value: 3
        }
      ],
      dialogOptions: [
        {
          label: "移动",
          id: 1,
          value: 1
        },
        {
          label: "联通",
          id: 2,
          value: 2
        },
        {
          label: "电信",
          id: 3,
          value: 3
        }
      ],
      mobile: "",
      operaid: "",
      id: "",
      formLabelWidth: "120px",
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      index: 0,
      tableData: [],
      checkIn: false,
      loading: false
    };
  },
  methods: {
    //修改操作
    modifyData(row) {
      this.modifyNumSegForm = {};
      this.modifyNumSegFlag = true;
      this.modifyNumSegForm = {
        id: row.id,
        mobile: row.mobile,
        operaid: row.operaid,
        operaidCn: row.operaidCn
      };
    },
    //保存添加号段
    saveAddNumSeg(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          let self = this;
          this.postRequest("admin/saveAddNumSeg", {
            mobile: this.addGatewayForm.mobile,
            operaid: this.addGatewayForm.operaid
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.data);
              self.checkData();
            } else {
              self.failed(res.data.resultMsg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //号段修改
     async saveModifyGateway() {
      let res = await this.postRequest("admin/saveUpdateNumSeg", {
        id: this.modifyNumSegForm.id,
        mobile: this.modifyNumSegForm.mobile,
        operaid: this.modifyNumSegForm.operaid
      })
      if(res.data.success){
        this.succeed(res.data.data)
      }else{
        this.failed(res.data.resultMsg)
      }
      this.modifyNumSegFlag = false;
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.addGatewayForm = {
        mobile: "",
        operaid: ""
      };
      this.modifyNumSegFlag = false;
    },
    //删除操作
    deleteDate(row) {
      let self = this;
      this.$confirm(`此操作将删除号段：${row.mobile}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/deleteNumSeg", {
              id: row.id
            })
            .then(res => {
              if (res.data.success) {
                this.succeed(res.data.data);
                this.checkData();
              } else {
                this.failed(res.data.message);
              }
            });
        })
        .catch(() => {
          return;
        });
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
      this.postRequest("admin/listNumSeg", {
        mobile: this.mobile,
        operaid: this.operaid,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index =
          Number(res.data.data.page.pageNum - 1) *
            Number(res.data.data.page.pageSize) +
          1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.numsegList) {
          self.tableData.push({
            index: self.index,
            mobile: item.mobile,
            operaid: item.operaid,
            operaidCn:
              item.operaid === 1
                ? "移动"
                : item.operaid === 2
                ? "联通"
                : "电信",
            id: item.id
          });
          self.index++;
        }
      });
    },
    cancel() {}
  },
  mounted() {
    this.checkData();
  }
};
</script>

<style scoped>
</style>
