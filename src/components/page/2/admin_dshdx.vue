<template>
  <div class="container">
    <el-form label-width="100px" inline="inline" v-on:keyup.enter.native="checkData">
      <el-form-item label="任务编号：">
        <el-input  v-model="cid"></el-input>
      </el-form-item>
      <el-form-item label="短信内容：">
        <el-input  v-model="content"></el-input>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="rank" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker type="date" v-model="fmmdd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button @click="bulkApproveApply" type="text">+批量审核通过</el-button>
      <el-button @click="bulkRejectApply" type="text">+批量审核拒绝</el-button>
      <el-table
        border
        @selection-change="handleSelectionChange"
        ref="table"
        v-loading="loading"
        :data="tableData"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button @click="approveApply(scope.row)" type="text">审核通过</el-button>
            <el-button @click="rejectApply(scope.row)" type="text">审核拒绝</el-button>
            <el-dropdown trigger="click">
              <el-button type="text">
                其他管理
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!--<el-dropdown-item @click.native="refund(scope.row)">审核退费</el-dropdown-item>-->
                <el-dropdown-item @click.native="edit(scope.row)">修改内容</el-dropdown-item>
                <el-dropdown-item @click.native="SCI(scope.row)">加入敏感短信</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column width="320px" label="网关路由">
          <template slot-scope="scope">
            <!--//数据结构必须完整-->
            <el-checkbox v-model="scope.row.cmCheck" v-if="scope.row.cmcount>0">移动：</el-checkbox>
            <el-select v-model="scope.row.cm " filterable v-if="scope.row.cmcount>0">
              <el-option
                :value="scope.row.cmgateway"
                :label="`${scope.row.cmGatewayName}_${scope.row.cmgateway}`"
              ></el-option>
              <el-option
                v-for="(item,i) in scope.row.cmlist"
                :label="`${item.gatewayname}_${item.gateway}`"
                :value="item.gateway"
                :key="i"
              ></el-option>
            </el-select>
            <el-checkbox v-model="scope.row.cuCheck" v-if="scope.row.cucount>0">联通：</el-checkbox>
            <el-select v-model="scope.row.cu " filterable v-if="scope.row.cucount>0">
              <el-option
                :value="scope.row.cugateway"
                :label="`${scope.row.cuGatewayName!==null?scope.row.cuGatewayName:''}_${scope.row.cugateway}`"
              ></el-option>
              <el-option
                v-for="(item,i) in scope.row.culist"
                :label="`${item.gatewayname}_${item.gateway}`"
                :value="item.gateway"
                :key="i"
              ></el-option>
            </el-select>
            <el-checkbox v-model="scope.row.ctCheck" v-if="scope.row.ctcount>0">电信：</el-checkbox>
            <el-select v-model="scope.row.ct" filterable v-if="scope.row.ctcount>0">
              <el-option
                :value="scope.row.ctgateway"
                :label="`${scope.row.ctGatewayName}_${scope.row.ctgateway}`"
              ></el-option>
              <el-option
                v-for="(item,i) in scope.row.ctlist"
                :label="`${item.gatewayname}_${item.gateway}`"
                :value="item.gateway"
                :key="i"
              ></el-option>
            </el-select>
            <!--</el-checkbox-group>-->
          </template>
        </el-table-column>
        <el-table-column label="短信内容" width="300px">
          <template slot-scope="scope">
            <span v-html="scope.row.content"></span>
          </template>
        </el-table-column>
        <el-table-column prop="contentLen" label="长度"></el-table-column>
        <el-table-column label="号码数">
          <template slot-scope="scope">{{scope.row.cmcount+scope.row.cucount+scope.row.ctcount}}</template>
        </el-table-column>
        <el-table-column prop="createtime" label="提交时间"></el-table-column>
        <el-table-column prop="definitetime" label="定时时间"></el-table-column>
        <el-table-column prop="cid" label="任务编号"></el-table-column>
        <el-table-column label="原因" prop="cnCheckSource"></el-table-column>
      </el-table>
      <div>
        <el-pagination
          class="fr"
          style="margin:10px 0"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page.sync="currentPage"
                    :page-size.sync="currentSize"
           layout="sizes, prev, pager, next, jumper"
          :total="count"
        ></el-pagination>
        <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{count}}条，</span>
      </div>
      <el-dialog
        title="批量审核拒绝"
        ref="bulkReject"
        :visible.sync="bulkRejectData.visible"
        width="500px"
      >
        <el-form
          label-width="120px"
          inline="inline"
          style="width: 400px"
          :rules="rule1"
          ref="bulkReject"
          :model="bulkRejectData"
        >
          <el-form-item label="拒绝原因：" prop="reason">
            <el-input type="textarea" v-model="bulkRejectData.reason" style="width: 220px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="bulkRejectData.visible=false">取消</el-button>
          <el-button type="primary" @click="submitBulkReject()">提交</el-button>
        </span>
      </el-dialog>
      <el-dialog title="审核拒绝" ref="reject" :visible.sync="rejectData.visible" width="500px">
        <el-form
          label-width="120px"
          inline="inline"
          style="width: 400px"
          :model="rejectData"
          :rules="rule2"
          ref="reject"
        >
          <el-form-item label="任务编号：">
            <el-input disabled="disabled" v-model="rejectData.cid"></el-input>
          </el-form-item>
          <el-form-item label="拒绝原因：" prop="remark">
            <el-input type="textarea" style="width: 220px" v-model="rejectData.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rejectData.visible=false">取消</el-button>
          <el-button type="primary" @click="submitReject()">提交</el-button>
        </span>
      </el-dialog>
      <el-dialog title="审核退费" ref="refundCase" :visible.sync="refundCase.visiable" width="500px">
        <el-form
          label-width="120px"
          inline="inline"
          style="width: 400px"
          :rules="rule3"
          ref="refund"
          :model="refundCase"
        >
          <el-form-item label="任务编号：">
            <el-input disabled="disabled" v-model="refundCase.cid"></el-input>
          </el-form-item>
          <el-form-item label="退费条数：">
            <el-input style="width: 220px" disabled v-model="refundCase.count"></el-input>
          </el-form-item>
          <el-form-item label="退费原因：" prop="remark">
            <el-input type="textarea" style="width: 220px" v-model="refundCase.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose2('refundCase')">取消</el-button>
          <!--//中途改数据结构的问题在于，改通用函数很糟心-->
          <el-button type="primary" @click="submitRefund">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改内容" :visible.sync="editCase.visiable" width="500px">
        <el-form
          label-width="120px"
          inline="inline"
          style="width: 400px"
          :rules="rule4"
          :model="editCase"
          ref="editCase"
        >
          <el-form-item label="用户名：">
            <el-input disabled="disabled" v-model="editCase.userName"></el-input>
          </el-form-item>
          <el-form-item label="任务编号：">
            <el-input disabled="disabled" v-model="editCase.cid"></el-input>
          </el-form-item>
          <el-form-item label="内容：">
            <el-input type="textarea" style="width: 220px" v-model="editCase.content"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" style="width: 220px" v-model="editCase.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose2('editCase')">取消</el-button>
          <!--//中途改数据结构的问题在于，改通用函数很糟心-->
          <el-button type="primary" @click="submitEdit">保存</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  name: "A",
  data() {
    return {
      count: 0,
      currentSize: 30,
      currentPage: 1,
      cid: "",
      userName: "",
      content: "",
      rank: "",
      fmmdd: new Date(),
      options1: [
        {
          value: 1,
          label: "所有"
        },
        {
          value: 0,
          label: "测试任务"
        }
      ],
      checkIn: true,
      loading: false,
      tableData: [],
      sum: "",
      totalPage: 1000,
      selection: "",
      rejectData: {
        visible: false,
        cid: "",
        mapid: "",
        remark: "",
        mmdd: ""
      },
      rejectCase: "",
      bulkRejectData: {
        visible: false,
        reason: ""
      },
      refundCase: {
        visiable: false,
        cid: "",
        mapid: "",
        mmdd: "",
        count: 1,
        remark: ""
      },
      editCase: {
        visiable: false,
        cid: "",
        userName: "",
        content: "",
        remark: "",
        mmdd: ""
      },
      rule1: {
        reason: { required: true, message: "请输入拒绝原因", trigger: "blur" }
      },
      rule2: {
        remark: { required: true, message: "请输入拒绝原因", trigger: "blur" }
      },
      rule3: {
        remark: { required: true, message: "请输入退费原因", trigger: "blur" }
      },
      rule4: {
        remark: { required: true, message: "请输入备注", trigger: "blur" }
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
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/checkSms", {
        pageNum: this.currentPage,
        pageSize: this.currentSize,
        fmmdd: this.formatDate(this.fmmdd),
        cid: this.cid,
        userName: this.userName,
        content: this.content,
        rank: this.rank,
        sensitiveStatus: "" //*是否敏感词
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        // self.totalPage = res.data.data.page.totalPage;
        self.count = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            userName: item.userName,
            serverNum: item.serverNum,
            content: item.content,
            contentLen: item.contentLen,
            definitetime: item.definitetime,
            cid: item.cid,
            cmcount: item.cmcount,
            cucount: item.cucount,
            ctcount: item.ctcount,
            cmgateway: item.cmgateway,
            cugateway: item.cmgateway,
            ctgateway: item.ctgateway,
            cmGatewayName: item.cmGatewayName,
            cuGatewayName: item.cuGatewayName,
            ctGatewayName: item.ctGatewayName,
            cmlist: item.cmlist,
            culist: item.culist,
            ctlist: item.ctlist,
            mapid: item.mapid,
            cm: item.cmGatewayName,
            cu: item.cuGatewayName,
            ct: item.ctGatewayName,
            cmCheck: false,
            cuCheck: false,
            ctCheck: false,
            mmdd: item.mmdd,
            remark: item.remark,
            createtime: item.createtime,
            cnCheckSource: item.cnCheckSource
          });
        }
      });
    },
    approveApply(row) {
      let self = this;
      console.log(row);
      this.$confirm("确定审核通过该短信？", "确认信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/smsCheckPass", {
            cid: row.cid,
            mapid: row.mapid,
            cm: row.cmCheck === true ? row.cm : "",
            cu: row.cuCheck === true ? row.cu : "",
            ct: row.ctCheck === true ? row.ct : "",
            mmdd: row.mmdd
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
          });
        })
        .catch(() => {});
    },
    rejectApply(row) {
      this.rejectData = {
        visible: true,
        cid: row.cid,
        mapid: row.mapid,
        remark: row.remark,
        mmdd: row.mmdd
      };
    },
    submitReject() {
      let self = this;
      this.$refs.reject.validate(valid => {
        if (valid) {
          this.postRequest("admin/smsCheckNoPass", this.rejectData).then(
            res => {
              self.resAlert(res.data);
              self.rejectData.visible = false;
              self.checkData();
            }
          );
        } else return false;
      });
    },
    refund(row) {
      // console.log(row);
      this.refundCase = {
        visiable: true,
        cid: row.cid,
        mapid: row.mapid,
        count: 1,
        remark: "",
        mmdd: row.mmdd
      };
    },
    submitRefund() {
      let self = this;
      this.$refs.refund.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveSmsCheckRefund", this.refundCase).then(
            res => {
              // console.log(res);
              this.refundCase.visiable = false;
              self.resAlert(res.data);
              self.checkData();
            }
          );
        } else return false;
      });
    },
    edit(row) {
      this.editCase = {
        userName: row.userName,
        visiable: true,
        cid: row.cid,
        content: row.content,
        mapid: row.mapid,
        mmdd: row.mmdd,
        remark: row.remark
      };
    },
    submitEdit() {
      let self = this;
      // console.log(this.$refs['editCase']);
      this.$refs.editCase.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveEditCheckSmsContent", this.editCase).then(
            res => {
              self.resAlert(res.data);
              self.editCase.visiable = false;
              self.checkData();
            }
          );
        } else return false;
      });
    },
    SCI(row) {
      let self = this;
      this.$confirm("确定将该短信加入敏感短信？", "确认信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        self
          .postRequest("admin/addSensitiveSms", {
            cis: row.cid,
            mapid: row.mapid,
            mmdd: row.mmdd
          })
          .then(res => {
            self.resAlert(res.data);
          });
      });
    },
    handleSelectionChange(val) {
      // console.log(val);
      this.selection = "";
      for (let item of val) {
        // console.log(item);
        this.selection +=
          item.cid +
          "_" +
          item.mapid +
          "_" +
          item.mmdd +
          "_" +
          item.cmgateway +
          "_" +
          item.cugateway +
          "_" +
          item.ctgateway +
          ",";
      }
      this.selection = this.selection.substring(0, this.selection.length - 1);
      // console.log(this.selection);
    },
    bulkApproveApply() {
      let self = this;
      if (this.selection !== "") {
        this.postRequest("admin/smsBatchCheckPass", {
          ids: this.selection
        }).then(res => {
          self.resAlert(res.data);
          self.checkData();
        });
      } else this.$message.warning("请选择需要审核的记录");
    },
    bulkRejectApply() {
      if (this.selection !== "") {
        this.bulkRejectData.visible = true;
      } else this.$message.warning("请选择需要审核的记录");
    },
    submitBulkReject() {
      let self = this;
      this.$refs.bulkReject.validate(valid => {
        if (valid) {
          this.postRequest("admin/smsBatchCheckNoPass", {
            ids: this.selection,
            remark: this.bulkRejectData.reason
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
          });
        } else return false;
      });
    },
    handleClose(dialog) {
      // this.$refs[dialog].resetFields();//its not a function
      //验证相关，似乎同样要求prop，v-model，form-model一一对应
      this[dialog] = false;
    },
    handleClose2(dialog) {
      // console.log(dialog + 'Case');
      // console.log(this[dialog + 'Case']);
      // console.log(this[dialog]);//变量名设计失误的结果
      // console.log(this.$refs[dialog]);
      // this.$refs[dialog].resetFields();//its not a function
      this[dialog].visiable = false;
    }
  }
};
</script>

<style scoped>
/*注：scoped style*/
.el-dropdown-link {
  color: dodgerblue;
  cursor: pointer;
  font-size: 9px !important;
}
</style>
