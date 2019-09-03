<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="批次号：">
        <el-input v-model="cid"></el-input>
      </el-form-item>

      <el-form-item label="url：">
        <el-input v-model="url"></el-input>
      </el-form-item>

      <el-form-item label="内容：">
        <el-input v-model="content"></el-input>
      </el-form-item>

      <el-form-item label="开始时间：">
        <el-date-picker v-model="startDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间：">
        <el-date-picker v-model="endDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>

    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="send(scope.row)">已点击发送</el-button>
            <el-button type="text" @click="unsend(scope.row)">未点击发送</el-button>-->
            <el-button type="text" @click="update(scope.row)">修改</el-button>
            <el-button type="text" @click="changesend(scope.row)">选择性合并修改</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="cid" label="批次号"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="url" label="url"></el-table-column>
        <el-table-column prop="click_num" label="点击数"></el-table-column>
        <el-table-column prop="unclick_num" label="未点击数1（批次总号码数-点击数）"></el-table-column>
        <el-table-column prop="all_num" label="批次总号码数"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="updatetime" label="更新时间"></el-table-column>
        <el-table-column prop="success_num" label="发送成功数"></el-table-column>
        <el-table-column prop="real_unclick_num" label="未点击数2（批次发送成功数-点击数）"></el-table-column>
        <el-table-column prop="real_transfor_rate" label="转换率1（点击数/发送成功数）"></el-table-column>
        <el-table-column prop="fake_transfor_rate" label="转换率2（点击数/批次号码数）"></el-table-column>
        <el-table-column prop="register_num" label="注册数"></el-table-column>
      </el-table>
      <!-- 修改弹框  -->
      <el-dialog title="修改" :visible.sync="dialogVisible" width="30%">
        <el-form :inline="true" :model="updateN" class="demo-form-inline">
          <el-form-item label="注册数">
            <el-input v-model="updateN.register_num"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateNum">确认修改</el-button>
        </span>
      </el-dialog>
      <!-- 选择性合并发送 -->
      <el-dialog title="选择性合并修改" :visible.sync="dialogVisible1" width="30%">
        <el-form
          :inline="true"
          :model="changesendlist"
          class="demo-form-inline"
          label-width="120px"
          ref="changesendlist"
          :rules="rules1"
        >
          <el-form-item label="内容" prop="content">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="changesendlist.content"
            ></el-input>
          </el-form-item>

          <el-form-item label="标签等级：" prop="label_level">
            <el-select v-model="changesendlist.label_level" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="标签类型：" prop="label_type">
            <el-select v-model="changesendlist.label_type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="点击率" prop="send_click_percent">
            <el-input
              type="send_click_percent"
              v-model.number="changesendlist.send_click_percent"
              autocomplete="off"
              placeholder="请输入0-100数字"
            ></el-input>
          </el-form-item>

          <el-form-item prop="radio" label="选择">
            <el-radio-group v-model="changesendlist.radio" @change="change">
              <el-radio label="1">未点击率</el-radio>
              <el-radio label="2">真实未点击率</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="未点击率"
            prop="send_uclick_unreal_percent"
            v-if="changesendlist.radio==1"
          >
            <el-input
              type="send_uclick_unreal_percent"
              v-model.number="changesendlist.send_uclick_unreal_percent"
              autocomplete="off"
              placeholder="请输入0-100数字"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="真实未点击率"
            prop="send_uclick_real_percent"
            v-if="changesendlist.radio==2"
          >
            <el-input
              type="text"
              show-word-limit
              v-model.number="changesendlist.send_uclick_real_percent"
              autocomplete="off"
              placeholder="请输入0-100数字"
            ></el-input>
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
  name: "admin_bqrtjlb",
  data() {
    // 自定义验证规则  可以单独提取  暂时方便没做处理
    var checkNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("必填信息"));
      } else {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 0) {
            callback(new Error("不能小于0"));
          } else if (value > 100) {
            callback(new Error("不能大于100"));
          } else {
            callback();
          }
        }
      }
    };
    return {
      cid: "",
      url: "",
      content: "",
      startDate: new Date(),
      endDate: new Date(),

      pageNum: 1,
      pageSize: 30,
      sum: 0,
      index: 0,
      tableData: [],
      checkIn: false,
      loading: false,
      dialogVisible: false,
      dialogVisible1: false,
      updateN: {
        id: "",
        register_num: ""
      },
      changesendlist: {
        content: "",
        send_click_percent: "",
        send_uclick_unreal_percent: "",
        send_uclick_real_percent: "",
        cid: "",
        mmdd: "",
        label_level: 0,
        label_type: 0,
        radio: ""
      },
      options: [],
      options1: [],
      rules1: {
        content: [
          { required: true, message: "请输入短信内容", trigger: "blur" }
        ],
        label_level: [
          { required: true, message: "请选择标签等级", trigger: "change" }
        ],
        label_type: [
          { required: true, message: "请选择标签类型", trigger: "change" }
        ],
        radio: [
          { required: true, message: "请选择点击类型", trigger: "change" }
        ],
        send_click_percent: [
          { required: true, message: "数字不能为空", trigger: "change" },
          // { type: "number", message: "点击率必须为数字值" },
          { validator: checkNum, trigger: "change" }
        ],
        send_uclick_unreal_percent: [
          { required: true, message: "数字不能为空", trigger: "change" },
          // { type: "number", message: "点击率必须为数字值" },
          { validator: checkNum, trigger: "change" }
        ],
        send_uclick_real_percent: [
          { required: true, message: "数字不能为空", trigger: "change" },
          // { type: "number", message: "点击率必须为数字值" },
          { validator: checkNum, trigger: "change" }
        ]
      }
    };
  },
  methods: {
    change() {},
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
    formatD(e) {
      var myDate = new Date(e);
      var month =
        myDate.getMonth() + 1 < 9
          ? `0${myDate.getMonth() + 1}`
          : myDate.getMonth + 1;
      var day =
        myDate.getDate() < 9 ? `0${myDate.getDate()}` : myDate.getDate();
      return `${month}${day}`;
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/labelDayReportList", {
        // this.postRequest("admin/labelDayReportList", {
        startDate: this.formatDate2(this.startDate),
        endDate: this.formatDate2(this.endDate),
        cid: this.cid,
        url: this.url,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        content: this.content
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index =
          Number(res.data.data.page.pageNum - 1) *
            Number(res.data.data.page.pageSize) +
          1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.labels) {
          var mmdd = self.formatD(item.createtime);
          self.tableData.push({
            index: self.index,
            id: item.id,
            cid: item.cid,
            remark: item.remark,
            url: item.url,
            click_num: item.click_num,
            unclick_num: item.unclick_num,
            all_num: item.all_num,
            createtime: item.createtime,
            updatetime: item.updatetime,
            success_num: item.success_num,
            real_unclick_num: item.real_unclick_num,
            real_transfor_rate: item.real_transfor_rate,
            fake_transfor_rate: item.fake_transfor_rate,
            register_num: item.register_num,
            mmdd: mmdd
          });
          self.index++;
        }
      });
    },
    update(row) {
      this.dialogVisible = true;
      this.updateN = {
        id: row.id,
        register_num: row.register_num
      };
    },
    updateNum() {
      this.postRequest("admin/saveUpdateRegisterNum", {
        id: this.updateN.id,
        register_num: this.updateN.register_num
      }).then(res => {
        this.dialogVisible = false;
        this.checkData();
        this.resAlert(res.data);
      });
    },
    changesend(row) {
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
          this.postRequest("admin/combineLabelSend", {
            content: this.changesendlist.content,
            label_level: this.changesendlist.label_level,
            label_type: this.changesendlist.label_type,
            send_click_percent: this.changesendlist.send_click_percent,
            send_uclick_unreal_percent: this.changesendlist
              .send_uclick_unreal_percent,
            send_uclick_real_percent: this.changesendlist
              .send_uclick_real_percent,
            cid: this.changesendlist.cid,
            mmdd: this.changesendlist.mmdd
          }).then(res => {
            self.resAlert(res.data);
          });
        } else {
          self.$message.warning("输入完整并正确信息");
          return false;
        }
      });
    },

    cancel() {},
    send() {},
    unsend() {}
  },

  mounted() {
    this.checkData();
    this.takeOpation();
    this.takeOpation1();
  }
};
</script>
<style scoped>
input .el-input-group__prepend {
  background-color: white;
}
</style>


