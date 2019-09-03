<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px">
      <el-form-item label="黑词：">
        <el-input v-model="word"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="add">+添加黑词</el-button>
      <el-button type="text" @click="exportWord">导出</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index" :indexs="index"></el-table-column>
        <el-table-column width="50px" label="操作">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="黑词" prop="keyword"></el-table-column>
        <el-table-column label="级别">
          <template
            slot-scope="scope"
          >{{scope.row.keylevel===-1?'特级黑词':scope.row.keylevel===1?'一级黑词':scope.row.keylevel===2?'二级黑词':'三级黑词'}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.status===1?'正常':'禁用'}}</template>
        </el-table-column>
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
      <el-dialog title="添加黑词" :visible.sync="addData.visible" width="500px">
        <el-form
          :model="addData"
          label-width="120px"
          style="width: 400px"
          ref="addData"
          :rules="rules"
        >
          <el-form-item label="黑词：" prop="word">
            <el-input v-model="addData.word" type="textarea"></el-input>
            <div class="el-upload__tip">多个黑词用半角符逗号","分隔</div>
          </el-form-item>
          <el-form-item label="级别：" prop="level">
            <el-select v-model="addData.level">
              <el-option v-for="(item,i) of levelOpt" :label="item.label" :value="item.value" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd('addData')">保存</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "A",
  data() {
    return {
      sum: 0,
      index:0,
      totalPage: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: true,
      loading: false,
      tableData: [],
      word: "",
      addData: {
        visible: false,
        level: "",
        word: ""
      },
      levelOpt: [
        {
          label: "特级",
          value: -1
        },
        {
          label: "一级",
          value: 1
        },
        {
          label: "二级",
          value: 2
        },
        {
          label: "三级",
          value: 3
        }
      ],
      rules: {
        word: [{ required: true, message: "不能为空", trigger: "blur" }],
        level: [{ required: true, message: "不能为空", trigger: "blur" }]
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
    indexs(index) {
      return index + 1;
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listSensitiveWord", {
        word: this.word,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index:self.index,
            id: item.id,
            keyword: item.keyword,
            keylevel: item.keylevel,
            status: item.status
          });
          self.index++;
        }
      });
    },
    add() {
      this.addData.visible = true;
    },
    submitAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          this.postRequest("admin/saveAddSensitiveWord", this.addData).then(
            res => {
              self.resAlert(res.data);
              self.checkData();
              self.addData.visible = false;
            }
          );
        } else {
          return false;
        }
      });
    },
    del(row) {
      let self = this;
      this.$confirm("确认删除【" + row.keyword + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/updateSensitiveWordStatus", {
            id: row.id,
            status: 2
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
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
    exportWord() {
      let self = this;
      this.postRequest("/admin/exportSensitiveWord", {
        word: this.word,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res=>{
        if(res.data.success){
          self.succeed("导出成功，请稍后到下载列表中下载")
        }else{
          self.failed("操作失败")
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
