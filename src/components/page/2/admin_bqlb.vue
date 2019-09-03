<template>
  <div class="container">
    <el-form inline="inline" label-width="120px">
      <el-form-item label="手机号码：">
        <el-input v-model="mobile"></el-input>
      </el-form-item>
      <!-- <el-form-item label="客户源：">
        <el-input v-model="label_source"></el-input>
      </el-form-item>-->

      <!-- 无用删除 -->
      <!-- <el-form-item label="类型：">
        <el-checkbox label="金融" v-model="label_jr"></el-checkbox>
        <el-checkbox label="信用卡" v-model="label_xyk"></el-checkbox>
        <el-checkbox label="电商" v-model="label_ds"></el-checkbox>
      </el-form-item>-->
      <el-form-item label="开始时间：">
        <el-date-picker type="datetime" v-model="startDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：">
        <el-date-picker type="datetime" v-model="endDate"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <!-- <el-upload 
      :action="uploadUrl" 
      accept=".csv" 
      :on-success="uploadXls" 
      with-credentials 
      :headers="importHeaders"
      multiple
      :file-list="fileList"
      >-->
      <el-upload
        :action="uploadUrl"
        accept=".csv"
        :with-credentials="true"
        :headers="{token:admin_token}"
        multiple
      >
        <el-button>选择上传文件</el-button>
        <span class="el-upload__tip">&nbsp;只能上传csv文件</span>
      </el-upload>
      <div style="margin-top: 10px">
        <el-button type="text" @click="bulkSend">+个性短信发送</el-button>
        <el-button type="text" @click="voiceSends">+语音发送</el-button>
        <!-- <el-button type="text" @click="send">+普通短信发送</el-button>
        <el-button type="text" @click="sendSMS">+彩信发送</el-button>-->
      </div>
      <el-table
        style="margin-top: 20px;"
        ref="table"
        v-loading="loading"
        :data="tableData"
        border
        stripe
      >
        <el-table-column label="序号" align="center" width="50px" prop="index"></el-table-column>
        <el-table-column width="100px" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="del(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="号码" align="center"></el-table-column>
        <el-table-column prop="label_time" label="时间" align="center"></el-table-column>
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
    </el-card>
    <el-dialog title="个性短信发送" :visible.sync="bulkSendData.visible">
      <el-form :rules="rule1" :model="bulkSendData" ref="bulkSendData" label-width="120px">
        <el-form-item label="查询结果：">
          <el-input v-model="bulkSendData.sms_count" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="bulkSendData.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="开始时间：">
          <el-date-picker type="datetime" v-model="bulkSendData.startDate" disabled></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker type="datetime" v-model="bulkSendData.endDate" disabled></el-date-picker>
        </el-form-item>
        <el-form-item label="短信内容：" prop="content">
          <el-input type="textarea" v-model="bulkSendData.content"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSend">保存</el-button>
        <el-button @click="bulkSendData.visible=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="个性短信发送" :visible.sync="SendData.visible">
      <el-form :rules="rule1" :model="SendData" ref="bulkSendData" label-width="120px">
        <el-form-item label="用户名：" prop="userNames">
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
          <el-input v-model="SendData.sms_count" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="SendData.mobile" disabled></el-input>
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
          <el-date-picker type="datetime" v-model="SendData.startDate" disabled></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker type="datetime" v-model="SendData.endDate" disabled></el-date-picker>
        </el-form-item>
        <el-form-item label="短信内容：" prop="content">
          <el-input type="textarea" v-model="SendData.content"></el-input>
        </el-form-item>

         <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="SendData.remark"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitSend">发送</el-button> -->
        <el-button type="primary" @click="submitBulkSend('bulkSendData')">发送</el-button>

        <el-button @click="SendData.visible=false">取消</el-button>
      </div>
    </el-dialog>

    <!--语音发送-->

    <el-dialog title="语音发送" :visible.sync="voiceSend.visible">
      <el-form :rules="rule1" :model="voiceSend" ref="voiceSend" label-width="120px">
        <el-form-item label="查询结果：">
          <el-input v-model="voiceSend.sms_count" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="voiceSend.mobile" disabled></el-input>
        </el-form-item>

        <el-form-item label="标签类型：" prop="label_type">
          <el-select v-model="voiceSend.label_type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标签等级：" prop="label_level">
          <el-select v-model="voiceSend.label_level" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间：">
          <el-date-picker type="datetime" v-model="voiceSend.startDate" disabled></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker type="datetime" v-model="voiceSend.endDate" disabled></el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="voiceBulkSend('voiceSend')">发送</el-button>

        <el-button @click="SendData.visible=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="彩信发送" :visible.sync="sendSMSData.visible">
      <el-form :rules="rule1" :model="sendSMSData" ref="sendSmsData" label-width="120px">
        <el-form-item label="查询结果：">
          <el-input v-model="sendSMSData.sms_count" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="sendSMSData.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="源客户：">
          <el-input v-model="sendSMSData.label_source" disabled></el-input>
        </el-form-item>
        <el-form-item label="开始时间：">
          <el-date-picker type="datetime" v-model="sendSMSData.startDate" disabled></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <el-date-picker type="datetime" v-model="sendSMSData.endDate" disabled></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="类型：">
          <el-checkbox label="金融" v-model="sendSMSData.label_jr" disabled></el-checkbox>
          <el-checkbox label="信用卡" v-model="sendSMSData.label_xyk" disabled></el-checkbox>
          <el-checkbox label="电商" v-model="sendSMSData.label_ds" disabled></el-checkbox>
        </el-form-item>-->
        <el-form-item label="上传文件：">
          <el-upload
            action="#"
            accept=".jpg, .png, .jpeg, .gif，.csv"
            :limit="1"
            :http-request="uploadFile"
            :with-credentials="true"
            :headers="{token:admin_token}"
          >
            <el-button>上传文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传gif/jpeg/jpg/png文件，且只能上传一条</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="短信内容：" prop="content">
          <el-input type="textarea" v-model="sendSMSData.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSendSMS">保存</el-button>
        <el-button @click="sendSMSData.visible=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改标签信息" :visible.sync="modifyData.visible">
      <el-form :model="modifyData" ref="modifyData" label-width="120px">
        <el-form-item label="手机号码：">
          <el-input v-model="modifyData.mobile"></el-input>
        </el-form-item>
        <!-- <el-form-item label="源客户：">
          <el-input v-model="modifyData.label_source"></el-input>
        </el-form-item>-->
        <el-form-item label="开始时间：">
          <el-date-picker type="datetime" v-model="modifyData.label_time"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="类型：">
          <el-checkbox label="金融" v-model="modifyData.label_jr"></el-checkbox>
          <el-checkbox label="信用卡" v-model="modifyData.label_xyk"></el-checkbox>
          <el-checkbox label="电商" v-model="modifyData.label_ds"></el-checkbox>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitModify">保存</el-button>
        <el-button @click="modifyData.visible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "admin_bqlb",
  data() {
    return {
      admin_token: `${sessionStorage.admin_token}`,
      sum: 0,
      pageSize: 30,
      pageNum: 1,
      index: 0,
      // checkIn: false,
      checkIn: true,
      loading: false,
      mobile: "",
      label_source: "",
      label_jr: false,
      label_xyk: false,
      label_ds: false,
      startDate: new Date(),
      endDate: new Date(),
      uploadUrl: `${sessionStorage.base}admin/uploadlabellistFile`,
      // uploadUrl: `http://192.168.1.246:8010/admin/uploadlabellistFile`,
      importHeaders: { token: sessionStorage.admin_token },
      formData: new FormData(),
      fileList: [],
      tableData: [],
      modifyData: {
        visible: false,
        id: "",
        mobile: "",
        label_jr: "",
        label_xyk: "",
        label_ds: "",
        label_time: ""
      },
      bulkSendData: {
        visible: false,
        mobile: "",
        label_source: "",
        startDate: "",
        endDate: "",
        label_jr: "",
        label_xyk: "",
        label_ds: "",
        content: "",
        sms_count: ""
      },
      SendData: {
        visible: false,
        mobile: "",
        label_source: "",
        startDate: "",
        endDate: "",
        label_jr: "",
        label_xyk: "",
        label_ds: "",
        content: "",
        sms_count: "",
        label_level: "",
        label_type: "",
        userNames: "",
        remark:""
      },
      sendSMSData: {
        visible: false,
        file1: "",
        mobile: "",
        label_source: "",
        startDate: "",
        endDate: "",
        label_jr: "",
        label_xyk: "",
        label_ds: "",
        content: "",
        sms_count: ""
      },
      voiceSend: {
        visible: false,
        file1: "",
        mobile: "",
        label_source: "",
        startDate: "",
        endDate: "",
        label_jr: "",
        label_xyk: "",
        label_ds: "",
        content: "",
        sms_count: ""
      },
      options: [],
      options1: [],
      options2: [],
      sendSmsFormData: new FormData(),
      rule1: {
        userNames: [
          {
            required: true,
            message: "请选择用户名",
            trigger: "change"
          }
        ],
        content: [
          { required: true, message: "请输入短信内容", trigger: "blur" }
        ],
        label_type: [
          { required: true, message: "请选择标签类型", trigger: "change" }
        ],
        label_level: [
          { required: true, message: "请选择标签等级", trigger: "change" }
        ]
      }
      // totalPage: 1000,
    };
  },
  methods: {
    // businessLicenseChange(raw) {
    //   //文件对象：file.raw//这里是独立对象
    //   console.log(raw);
    //   let self = this;
    //   this.formData.set("file", raw.file);
    //   this.axios.post("http://192.168.1.246:8010/admin/uploadlabellistFile", this.formData).then(res => {
    //     console.log(this.formData);
    //     console.log(res);
    //   });
    // },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    uploadXls(response, file, fileList) {
      this.resAlert(response);
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/labellist", {
        mobile: this.mobile,
        startDate: this.formatDate2(this.startDate),
        endDate: this.formatDate2(this.endDate),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        if (res.data.success == true) {
          self.loading = false;
          this.index =
            Number(res.data.data.page.pageNum - 1) *
              Number(res.data.data.page.pageSize) +
            1;
          self.sum = res.data.data.page.totalCount;
          // self.totalPage = res.data.page.totalPage;
          for (let item of res.data.data.labels) {
            self.tableData.push({
              index: self.index,
              id: item.id,
              mobile: item.mobile,
              label_time: item.label_time,
              label_source: item.label_source,
              mmdd: item.mmdd
            });
            self.index++;
          }
        } else {
        }
      });
    },
    modify(row) {
      this.postRequest("admin/getUpdateLabelMobileData", {
        id: row.id
      }).then(res => {
        this.modifyData = {
          visible: true,
          id: res.data.data.labelMobile.id,
          mobile: res.data.data.labelMobile.mobile,
          label_source: res.data.data.labelMobile.label_source,
          label_time: res.data.data.label_time
        };
      });
    },
    submitModify() {
      this.postRequest("admin/saveUpdateLabelMobileData", {
        id: this.modifyData.id,
        mobile: this.modifyData.mobile,
        label_source: this.modifyData.label_source,
        label_jr: this.modifyData.label_jr === true ? 1 : 0,
        label_xyk: this.modifyData.label_xyk === true ? 1 : 0,
        label_ds: this.modifyData.label_ds === true ? 1 : 0,
        label_time: this.modifyData.label_time
      }).then(res => {
        this.modifyData.visible = false;
        this.checkData();
        this.resAlert(res.data);
      });
    },
    del(row) {
      this.$confirm("确认删除【" + row.mobile + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deleteLabelMobile", {
            id: row.id
          }).then(res => {
            this.checkData();
            this.resAlert(res.data);
          });
        })
        .catch(() => {});
    },
    bulkSend() {
      if (this.sum > 0) {
        this.postRequest("admin/getlabelSendData", {
          // this.postt("admin/getlabelSendData", {
          mobile: this.mobile,
          label_source: this.label_source,
          startDate: this.formatDate2(this.startDate),
          endDate: this.formatDate2(this.endDate),
          count: this.sum
        }).then(res => {
          this.SendData = {
            visible: true,
            mobile: res.data.data.mobile,
            label_source: res.data.data.label_source,
            startDate: res.data.data.startDate,
            endDate: res.data.data.endDate,
            content: "",
            sms_count: res.data.data.count
          };
        });
      } else this.$message.warning("查询结果为空，无法批量发送");
    },
    //语音发送
    voiceSends() {
      if (this.sum > 0) {
        this.postRequest("admin/getlabelSendData", {
          // this.postt("admin/getlabelSendData", {
          mobile: this.mobile,
          label_source: this.label_source,
          startDate: this.formatDate2(this.startDate),
          endDate: this.formatDate2(this.endDate),
          count: this.sum
        }).then(res => {
          this.voiceSend = {
            visible: true,
            mobile: res.data.data.mobile,
            label_source: res.data.data.label_source,
            startDate: res.data.data.startDate,
            endDate: res.data.data.endDate,
            sms_count: res.data.data.count
          };
        });
      } else this.$message.warning("查询结果为空，无法批量发送");
    },
    //语音发送提交
    voiceBulkSend(voiceSend) {
      this.$refs[voiceSend].validate(valid => {
        if (valid) {
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
          this.postRequest("admin/shenshiCallSend", {
            mobile: this.voiceSend.mobile,
            startDate: this.voiceSend.startDate,
            endDate: this.voiceSend.endDate,
            sms_count: this.voiceSend.sms_count,
            label_type: this.voiceSend.label_type,
            label_level: this.voiceSend.label_level
          }).then(res => {
            this.checkData();
            this.voiceSend.visible = false;
            this.resAlert(res.data);
          });
        } else {
          this.$message.warning("请输入完整信息");
          return false;
        }
      });
    },
    submitBulkSend(bulkSendData) {
      // this.postRequest(
      //   "admin/labelSend",
      // this.$axios('192.168.1.246/admin/labelSend',
      this.$refs[bulkSendData].validate(valid => {
        if (valid) {
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
            mobile: this.SendData.mobile,
            label_source: this.SendData.label_source,
            startDate: this.SendData.startDate,
            endDate: this.SendData.endDate,
            content: this.SendData.content,
            sms_count: this.SendData.sms_count,
            label_type: this.SendData.label_type,
            label_level: this.SendData.label_level,
            userName: this.SendData.userNames,
            remark: this.SendData.remark,
          }).then(res => {
            this.checkData();
            this.SendData.visible = false;
            this.resAlert(res.data);
          });
        } else {
          this.$message.warning("请输入完整信息");
          return false;
        }
      });
    },

    send() {
      if (this.sum > 0) {
        this.postRequest(
          "admin/getlabelSendData",
          // this.$axios.post('http://192.168.1.246:8010/admin/getlabelSendData',
          {
            mobile: this.mobile,
            label_source: this.label_source,
            startDate: this.formatDate2(this.startDate),
            endDate: this.formatDate2(this.endDate),
            label_jr: this.label_jr ? 1 : 0,
            label_xyk: this.label_xyk ? 1 : 0,
            label_ds: this.label_ds ? 1 : 0,
            count: this.sum
          }
        ).then(res => {
          this.SendData = {
            visible: true,
            mobile: res.data.data.mobile,
            label_source: res.data.data.label_source,
            startDate: res.data.data.startDate,
            endDate: res.data.data.endDate,
            label_jr: res.data.data.label_jr === 1,
            label_xyk: res.data.data.label_xyk === 1,
            label_ds: res.data.data.label_ds === 1,
            content: "",
            sms_count: res.data.data.count
          };
        });
      } else this.$message.warning("查询结果为空，无法批量发送");
    },
    submitSend() {
      this.postRequest(
        "admin/commonLabelSend",
        // this.$axios.post('http://192.168.1.246:8010/admin/commonLabelSend',
        {
          mobile: this.SendData.mobile,
          label_source: this.SendData.label_source,
          startDate: this.SendData.startDate,
          endDate: this.SendData.endDate,
          label_jr: this.SendData.label_jr ? 1 : 0,
          label_xyk: this.SendData.label_xyk ? 1 : 0,
          label_ds: this.SendData.label_ds ? 1 : 0,
          content: this.SendData.content,
          sms_count: this.SendData.sms_count
        }
      ).then(res => {
        this.checkData();
        this.SendData.visible = false;
        this.resAlert(res.data);
      });
    },
    sendSMS() {
      if (this.sum > 0) {
        this.postRequest(
          "admin/getlabelSendData",
          // this.$axios.post('http://192.168.1.246:8010/admin/getlabelSendData',
          {
            mobile: this.mobile,
            label_source: this.label_source,
            startDate: this.formatDate2(this.startDate),
            endDate: this.formatDate2(this.endDate),
            label_jr: this.label_jr ? 1 : 0,
            label_xyk: this.label_xyk ? 1 : 0,
            label_ds: this.label_ds ? 1 : 0,
            count: this.sum
          }
        ).then(res => {
          this.sendSMSData = {
            visible: true,
            file1: "",
            mobile: res.data.data.mobile,
            label_source: res.data.data.label_source,
            startDate: res.data.data.startDate,
            endDate: res.data.data.endDate,
            label_jr: res.data.data.label_jr === 1,
            label_xyk: res.data.data.label_xyk === 1,
            label_ds: res.data.data.label_ds === 1,
            content: "",
            sms_count: res.data.data.count
          };
          this.sendSmsFormData.set("mobile", res.data.data.mobile);
          this.sendSmsFormData.set("label_source", res.data.data.label_source);
          this.sendSmsFormData.set("startDate", res.data.data.startDate);
          this.sendSmsFormData.set("endDate", res.data.data.endDate);
          this.sendSmsFormData.set("label_jr", res.data.data.label_jr);
          this.sendSmsFormData.set("label_xyk", res.data.data.label_xyk);
          this.sendSmsFormData.set("label_ds", res.data.data.label_ds);
          this.sendSmsFormData.set("sms_count", res.data.data.count);
        });
      } else this.$message.warning("查询结果为空，无法批量发送");
    },
    uploadFile(raw) {
      this.sendSmsFormData.set("file1", raw.file);
    },
    submitSendSMS() {
      this.$refs.sendSmsData.validate(valid => {
        if (valid) {
          this.sendSmsFormData.set("content", this.sendSMSData.content);
          this.postRequest(
            "admin/mmsLabelSend",
            // this.$axios.post('http://192.168.1.246:8010/admin/mmsLabelSend',
            this.sendSmsFormData
          ).then(res => {
            this.checkData();
            this.sendSMSData = {
              visible: false,
              file1: "",
              mobile: "",
              label_source: "",
              startDate: "",
              endDate: "",
              label_jr: "",
              label_xyk: "",
              label_ds: "",
              content: "",
              sms_count: ""
            };
            this.resAlert(res.data);
          });
        } else return false;
      });
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
    //get username
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
    }
  },
  mounted() {
    this.takeOpation();
    this.takeOpation1();
    this.getuserName();
  }
};
</script>

<style scoped>
</style>
