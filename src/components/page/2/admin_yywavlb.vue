<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="wav编号：">
        <el-input  v-model="wavId"></el-input>
      </el-form-item>
      <el-form-item label="wav名称：">
        <el-input  v-model="wavName"></el-input>
      </el-form-item>
      <el-form-item label="wav路径：">
        <el-input  v-model="wavPath"></el-input>
      </el-form-item>
      <el-form-item label="拥有者：">
        <el-input  v-model="owner"></el-input>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select v-model="status">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间：">
       <el-date-picker v-model="startDate" type="date"></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间：">
       <el-date-picker v-model="endDate" type="date"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 修改信息操作弹出框 -->
    <el-dialog title="修改信息" :visible.sync="modifyDataVisible">
      <el-form :model="modifyDataForm" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="wav名称：" :label-width="formLabelWidth" prop="wavName">
          <el-input v-model="modifyDataForm.wavName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="wav路径：" :label-width="formLabelWidth" prop="wavPath">
          <el-input v-model="modifyDataForm.wavPath" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="拥有者：" :label-width="formLabelWidth" prop="owner">
          <el-input v-model="modifyDataForm.owner" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态：">
          <el-select v-model="modifyDataForm.status">
            <el-option
              v-for="item in modifyDataForm.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('modifyDataForm')">保存</el-button>
        <el-button @click="resetForm('modifyDataForm')">取消</el-button>
      </div>
    </el-dialog>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="modifyData(scope.row)">修改信息</el-button>
            <el-button type="text" @click="deleteDate(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column width="150px" prop="wavId" label="wav编号"></el-table-column>
        <el-table-column prop="wavName" label="wav名称"></el-table-column>
        <el-table-column prop="wavPath" label="wav路径"></el-table-column>
        <el-table-column prop="owner" label="拥有者"></el-table-column>
        <el-table-column prop="statusCn" label="状态"></el-table-column>
        <el-table-column prop="createUser" label="创建人"></el-table-column>
        <el-table-column width="150px" prop="createTime" label="创建时间"></el-table-column>
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
      modifyDataVisible: false,
      modifyDataForm: {
        id: "",
        wavName: "",
        wavPath: "",
        owner: "",
        status: "",
        statusCn: "",
        options: [
          {
            value: "1",
            label: "可用"
          },
          {
            value: "0",
            label: "不可用"
          }
        ]
      },
      rules: {
        wavName: [{ required: true, message: "不能为空", trigger: "blur" }],
        wavPath: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      id: "",
      startDate: new Date(),
      endDate: new Date(),
      formLabelWidth: "120px",
      pageNum: 1,
      pageSize: 30,
      wavId: "",
      wavName: "",
      wavPath: "",
      owner: "",
      status: "",
      sum: 0,
      index: 0,
      tableData: [],
      checkIn: false,
      loading: false,
      options: [
        {
          value: "2",
          label: "所有"
        },
        {
          value: "1",
          label: "可用"
        },
        {
          value: "0",
          label: "不可用"
        }
      ]
    };
  },
  methods: {
    //修改操作
    modifyData(row) {
      this.modifyDataVisible = true;
      this.modifyDataForm.id = row.id;
      this.modifyDataForm.wavName = row.wavName;
      this.modifyDataForm.wavPath = row.wavPath;
      this.modifyDataForm.owner = row.owner;
      this.modifyDataForm.status = row.status === 0 ? "不可用" : "可用";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.modifyDataVisible = false;
          let self = this;
          this.postRequest("admin/updateCallWav", {
            id: self.modifyDataForm.id,
            wavName: self.modifyDataForm.wavName,
            wavPath: self.modifyDataForm.wavPath,
            owner: self.modifyDataForm.owner,
            status: self.modifyDataForm.status
          }).then(res => {
            if (res.data.success) {
              self.succeed(res.data.message);
              self.checkData();
            } else {
              self.failed(res.data.message);
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.modifyDataVisible = false;
    },
    //删除操作
    deleteDate(row) {
      let self = this;
      this.$confirm(`此操作将删除wav：${row.wavName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/deleteCallWav", {
              id: row.id
            })
            .then(res => {
              if (res.data.success) {
                this.succeed(res.data.message);
                this.checkData();
              } else {
                this.failed(res.data.message);
              }
            });
        })
        .catch(() => {});
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
      this.postRequest("admin/callwavlist", {
        wavId: this.wavId,
        wavName: this.wavName,
        wavPath: this.wavPath,
        owner: this.owner,
        status: this.status,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        createUser: this.createUser,
        createTime: this.createTime,
        startDate: this.formatDate(this.startDate),
        endDate: this.formatDate(this.endDate)
      }).then(res => {
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            wavId: item.wav_id,
            wavName: item.wav_name,
            wavPath: item.wav_path,
            owner: item.owner,
            status: item.status,
            statusCn:
              item.status === 0
                ? "不可用"
                : item.status === 1
                ? "可用"
                : "所有", //判断状态：0：不可用 1：可用 2：所有
            createUser: item.create_user,
            createTime: item.create_time,
            id: item.id
          });
          self.index++;
        }
      });
    },
    cancel() {}
  }
};
</script>

<style scoped>
</style>
