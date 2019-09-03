<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px">
      <el-form-item label="用户名：">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="白词：">
        <el-input v-model="word"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="add">+添加白词</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="text">删除</el-button>
            <el-button @click="forbidden(scope.row)" type="text">{{scope.row.status===1?'禁用':'启用'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="白词" prop="keyword"></el-table-column>
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
      <el-dialog title="添加白词" :visible.sync="addData.visible" width="500px">
        <el-form
          :model="addData"
          label-width="120px"
          style="width: 400px"
          ref="addData"
          :rules="rules"
        >
          <el-form-item label="用户名：">
            <el-input v-model="addData.userName"></el-input>
          </el-form-item>
          <el-form-item label="白词：" prop="word">
            <el-input type="textarea" v-model="addData.word"></el-input>
            <div class="el-upload__tip">多个白词用半角符逗号","分隔</div>
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
      userName: "",
      word: "",
      addData: {
        visible: false,
        userName: "",
        word: "",
        level: 0
      },
      rules: {
        word: [{ required: true, message: "不能为空", trigger: "blur" }]
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
      this.postRequest("admin/listWhiteKeyword", {
        userName: this.userName,
        word: this.word,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.keywordList) {
          self.tableData.push({
            index:self.index,
            keyword: item.keyword,
            status: item.status,
            userName: item.userName,
            id: item.id
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
          this.postRequest("admin/saveAddWhiteKeyword", this.addData).then(
            res => {
              self.addData.visible = false;
              self.checkData();
              self.resAlert(res.data);
            }
          );
        } else {
          return false;
        }
      });
    },
    del(row) {
      let self = this;
      this.$confirm("确认删除【" + row.userName + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deleteWhiteKeyword", {
            id: row.id
          }).then(res => {
            self.resAlert(res.data);
            self.addData.visible = false;
            self.checkData();
          });
        })
        .catch(() => {});
    },
    forbidden(row) {
      let self = this;
      this.$confirm(
        "确认" + row.status === 1
          ? "启动"
          : "禁用" + "【" + row.keyword + "】?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          self
            .postRequest("admin/updateWhiteKeywordStatus", {
              id: row.id,
              status: row.status === 1 ? 2 : 1
            })
            .then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
</style>
