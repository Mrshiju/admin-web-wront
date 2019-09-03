<template>
  <div class="container">
    <el-form inline="inline" label-width="120px">
      <!-- <el-form-item label="用户名:">
          <el-input v-model="userName">

          </el-input>
      </el-form-item>-->

      <el-form-item>
        <el-button @click="sendUserPage" type="primary" plain>上传用户名</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-form inline="inline" label-width="80px">
        <el-form-item label="用户名:">
          <el-input v-model="userName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="checkData" type="primary" plain>查询</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-button @click="saveLabelSendUser" type="text">+上传发送账号</el-button> -->
      <!-- <el-button @click="sendUserPage" type="text">+发送账号分页</el-button> -->
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="delet(scope)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
      </el-table>
      <!-- 修改弹框  -->
      <el-dialog title="删除发送账号" :visible.sync="dialogVisible" width="30%">
        <el-form :inline="true" :model="updateN" class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="updateN.userName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleted">确认删除</el-button>
        </span>
      </el-dialog>

      <!-- 上传发送账号 -->
      <el-dialog title="上传发送账号" :visible.sync="dialogVisible2">
        <el-form :model="SendData" ref="bulkSendData" label-width="120px">
          <el-form-item label="用户名：" prop="userName">
            <el-select v-model="SendData.userNames" placeholder="请选择">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="查询结果：">
            <el-input v-model="SendData.sms_count"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input v-model="SendData.mobile"></el-input>
          </el-form-item>

          <el-form-item label="标签类型：" prop="label_type">
            <el-select v-model="SendData.label_type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="标签等级：" prop="label_level">
            <el-select v-model="SendData.label_level" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="开始时间：">
            <el-date-picker type="datetime" v-model="SendData.startDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker type="datetime" v-model="SendData.endDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="短信内容：" prop="content">
            <el-input type="textarea" v-model="SendData.content"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <!-- <el-button type="primary" @click="submitSend">发送</el-button> -->
          <el-button type="primary" @click="submitBulkSend('bulkSendData')">发送</el-button>

          <el-button @click="dialogVisible2=false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 发送账号分页 -->
      <el-dialog title="发送账号分页" :visible.sync="dialogVisible1" width="40%">
        <el-form
          :inline="true"
          :model="changesendlist"
          class="demo-form-inline"
          label-width="120px"
          ref="changesendlist"
          :rules="rules1"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="changesendlist.userName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="changesends('changesendlist')">提交</el-button>
        </span>
      </el-dialog>

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
  name: "admin_scfszh",
  data() {
    return {
      cid: "",
      url: "",
      content: "",
      startDate: new Date(),
      endDate: new Date(),
      index: 1,
      pageNum: 1,
      pageSize: 30,
      userName: "",
      sum: 0,
      index: 0,
      tableData: [],
      checkIn: false,
      loading: false,
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      updateN: {
        userName: ""
      },
      changesendlist: {
        userName: "",
        pageNum: "",
        pageSize: ""
      },
      options: [],
      options1: [],
      options2: [],
      rules1: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "change" }
        ],
        pageNum: [{ required: true, message: "请输入页数", trigger: "change" }],
        pageSize: [
          { required: true, message: "请输入每页数", trigger: "change" }
        ]
      },
      SendData: {
        userNames: "",
        startDate: "",
        endDate: ""
      },
      id:'',
    };
  },
  methods: {
    change() {},
    indexs(index) {
      return index + 1;
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
      this.postRequest("admin/labelSendUserPageQuery", {
        userName: self.userName,
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        self.sum = res.data.data.curPageCount;
        for (let item of res.data.data.users) {
          self.tableData.push({
            id: item.id,
            userName: item.userName,
            password: item.password
          });
          self.index++;
        }
      });
    },
    delet(row) {
      this.dialogVisible = true;
      this.updateN = {
        userName: row.row.userName
      };
    },
    saveLabelSendUser() {
      this.dialogVisible2 = true;
      this.SendData = {};
    },
    SendUser() {
      this.postRequest("admin/saveLabelSendUser", {
        userName: this.updateN.userName
      }).then(res => {
        this.dialogVisible2 = false;
        this.checkData();
        this.resAlert(res.data);
      });
    },
    deleted() {
      this.postRequest("admin/delLabelSendUser", {
        userName: this.updateN.userName
      }).then(res => {
        this.dialogVisible = false;
        this.checkData();
        this.resAlert(res.data);
      });
    },
    sendUserPage(row) {
      this.dialogVisible1 = true;

      // changesend(row) {
      //   (this.dialogVisible1 = true),
      this.changesendlist = {
        cid: row.cid,
        mmdd: row.mmdd
      };
      let self = this;
    },
    takeOpation() {
      let self = this;
      this.postRequest("admin/getLabelType", {}).then(res => {
        for (let i in res.data.data) {
          self.options.push({
            label: res.data.data[i],
            value: i
          });
        }
      });
    },
    takeOpation1() {
      let self = this;
      this.postRequest("admin/getLabelLevel", {}).then(res => {
        for (let i in res.data.data) {
          self.options1.push({
            label: res.data.data[i],
            value: i
          });
        }
      });
    },
    changesends(changesendlist) {
      let self = this;
      this.$refs[changesendlist].validate(valid => {
        if (valid) {
          this.dialogVisible1 = false;
          this.postRequest("admin/saveLabelSendUser", {
            userName: this.changesendlist.userName
          }).then(res => {
            if (res.data.success) {
              self.$message.success("添加成功");
              self.checkData();
            } else {
              self.$message.warning(res.data.message);
            }
          });
        } else {
          self.$message.warning("输入完整并正确信息");
          return false;
        }
      });
    },

    cancel() {},
    send() {},
    unsend() {},
    async getuserName() {
      let res = await this.postRequest("admin/getLabelSendUserList", {
        token: ""
      });
      for (let i of res.data.data.userList) {
        this.options2.push({
          label: i.userName,
          value: i.userName
        });
      }
    },
    submitBulkSend(bulkSendData) {
      let self = this;
      var label_type = this.label_type;
      switch (label_type) {
        case 1:
          label_type = "网贷";
          break;
        case 2:
          label_type = "信用卡";
          break;
        case 3:
          label_type = "电商";
          break;
        case 4:
          label_type = "游戏";
          break;
        case 5:
          label_type = "汽车";
          break;
        case 6:
          label_type = "母婴";
          break;
        case 7:
          label_type = "教育";
          break;
      }
      var label_level = this.label_level;
      switch (label_level) {
        case 1:
          label_level = "A";
          break;
        case 2:
          label_level = "B";
          break;
        case 3:
          label_level = "C";
          break;
        case 4:
          label_level = "D";
          break;
        case 5:
          label_level = "E";
          break;
        case 6:
          label_level = "F";
          break;
        case 7:
          label_level = "G";
          break;
        case 8:
          label_level = "H";
          break;
        case 9:
          label_level = "I";
          break;
      }
      this.postRequest("admin/labelSend", {
        userName: this.SendData.userNames,
        mobile: this.SendData.mobile,
        label_source: this.SendData.label_source,
        startDate: this.SendData.startDate,
        endDate: this.SendData.endDate,
        content: this.SendData.content,
        sms_count: this.SendData.sms_count,
        label_type: this.SendData.label_type,
        label_level: this.SendData.label_level
      }).then(res => {
        this.checkData();
        this.dialogVisible2 = false;
        if (res.data.success) {
          self.$message.success("发送账号成功");
        } else {
          self.$message.warning("发送账号失败");
        }
      });
    }
  },

  mounted() {
    let selg = this;
    this.checkData();
    this.takeOpation();
    this.takeOpation1();
    this.getuserName();
  }
};
</script>
<style scoped>
input .el-input-group__prepend {
  background-color: white;
}
</style>


