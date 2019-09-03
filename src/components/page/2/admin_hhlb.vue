<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px">
      <el-form-item label="黑号：">
        <el-input v-model="mobile"></el-input>
      </el-form-item>
      <!--<el-form-item label="用户名：">-->
        <!--<el-input v-model="userName"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="所属网关：">
        <el-input v-model="gateway"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="add">+添加黑号</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index" :indexs="index"></el-table-column>
        <el-table-column width="50px" label="操作">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="号码" prop="mobile"></el-table-column>
        <el-table-column label="级别（系统级）">
          <template
            slot-scope="scope"
          >{{scope.row.blackLevel===1?'一级':scope.row.blackLevel===2?'二级':'三级'}}</template>
        </el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="黑名单类型">
          <template
            slot-scope="scope"
          >{{scope.row.blacktype===-1?'系统级':scope.row.blacktype===1?'客户级':'网关级'}}</template>
        </el-table-column>
        <el-table-column label="所属网关" prop="gateway"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="创建时间" prop="createtime"></el-table-column>
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
      <el-dialog title="添加黑号" :visible.sync="addData.visible" width="500px">
        <el-form
          :model="addData"
          :rules="rule1"
          ref="addData"
          label-width="120px"
          style="width: 400px"
        >
          <el-form-item label="黑号：" prop="mobile">
            <el-input v-model="addData.mobile" type="textarea"></el-input>
            <div class="el-upload__tip">多个黑词用半角符逗号","分隔</div>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select v-model="addData.type">
              <el-option v-for="(item,i) of typeOpt" :label="item.label" :value="item.value" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="系统级黑号级别：">
            <el-select v-model="addData.level">
              <el-option v-for="(item,i) of levelOpt" :label="item.label" :value="item.value" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="黑名单所属网关编号：" prop="gateway">
            <el-input v-model="addData.gateway" type="textarea" placeholder="网关级必填，其他请填0"></el-input>
          </el-form-item>
          <el-form-item label="用户名：" prop="userName">
            <el-input v-model="addData.userName" type="textarea" placeholder="系统级和网关级为：SYS"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="addData.note" type="textarea"></el-input>
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
      mobile: "",
      userName: "",
      gateway: "",
      addData: {
        visible: false,
        level: 1,
        type: 0,
        gateway: "",
        mobile: "",
        userName: "",
        note: ""
      },
      rule1: {
        mobile: { required: true, message: "请输入黑号", trigger: "blur" },
        gateway: {
          required: true,
          message: "请输入黑号所属网关编号",
          trigger: "blur"
        },
        userName: { required: true, message: "请输入用户名", trigger: "blur" }
      },
      typeOpt: [
        {
          label: "系统级",
          value: 0
        },
        {
          label: "客户级",
          value: 1
        },
        {
          label: "网关级",
          value: 2
        }
      ],
      levelOpt: [
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
    indexs(index) {
      return index + 1;
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listSensitiveMobile", {
        mobile: this.mobile,
        userName: this.userName,
        gateway: this.gateway,
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
            mobile: item.mobile,
            blackLevel: item.blackLevel,
            userName: item.userName,
            blacktype: item.blacktype,
            gateway: item.gateway,
            remark: item.remark,
            createtime: item.createtime,
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
          this.postRequest("admin/saveAddSensitiveMobile", this.addData).then(
            res => {
              self.resAlert(res.data);
              self.checkData();
              self.addData = {
                visible: false,
                level: -1,
                type: 0,
                gateway: "",
                mobile: "",
                userName: "",
                note: ""
              };
            }
          );
        } else {
          return false;
        }
      });
    },
    del(row) {
      let self = this;
      this.$confirm("确认删除【" + row.mobile + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/updateSensitiveMobileStatus", {
            id: row.id,
            status: 0
          }).then(res => {
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
