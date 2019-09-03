<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px">
      <el-form-item label="通道分组名：">
        <el-input v-model="gwGroupName"></el-input>
      </el-form-item>
      <el-form-item label="通道编号：">
        <el-input v-model="gatewayId"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="add">+添加通道分组</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">编辑</el-button>
            <el-button @click="del(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="gwGroupName" label="通道分组名"></el-table-column>
        <el-table-column prop="operaName" label="所属运营商"></el-table-column>
        <el-table-column prop="gwId1" label="通道编号1"></el-table-column>
        <el-table-column prop="score1" label="通道得分1"></el-table-column>
        <el-table-column prop="isKey1Cn" label="是否启用1"></el-table-column>

        <el-table-column prop="gwId2" label="通道编号2"></el-table-column>
        <el-table-column prop="score2" label="通道得分2"></el-table-column>
        <el-table-column prop="isKey2Cn" label="是否启用2"></el-table-column>

        <el-table-column prop="gwId3" label="通道编号3"></el-table-column>
        <el-table-column prop="score3" label="通道得分3"></el-table-column>
        <el-table-column prop="isKey3Cn" label="是否启用3"></el-table-column>

        <el-table-column prop="gwId4" label="通道编号4"></el-table-column>
        <el-table-column prop="score4" label="通道得分4"></el-table-column>
        <el-table-column prop="isKey4Cn" label="是否启用4"></el-table-column>

        <el-table-column prop="gwId5" label="通道编号5"></el-table-column>
        <el-table-column prop="score5" label="通道得分5"></el-table-column>
        <el-table-column prop="isKey5Cn" label="是否启用5"></el-table-column>
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
    <!-- //添加通道分组 -->
    <el-dialog title="添加通道分组" :visible.sync="addDataFlag" width="500px">
      <el-form
        :model="addData"
        label-width="120px"
        style="width: 400px"
        :rules="rule1"
        ref="addData"
      >
        <el-form-item label="通道分组名：" prop="gwGroupName">
          <el-input v-model="addData.gwGroupName"></el-input>
        </el-form-item>

        <el-form-item label="所属运营商：">
          <el-select v-model="addData.operaid" filterable>
            <el-option
              v-for="item of operaidList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addData')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addData')">保存</el-button>
      </span>
    </el-dialog>

    <!-- 修改弹出框 -->
    <el-dialog title="添加通道分组" :visible.sync="modifyDataFlag" width="500px">
      <el-form
        :model="modifyData"
        label-width="120px"
        style="width: 400px"
        :rules="rule1"
        ref="modifyData"
      >
        <el-form-item label="通道分组名：" prop="gwGroupName">
          <el-input v-model="modifyData.gwGroupName"></el-input>
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input v-model="modifyData.userName"></el-input>
        </el-form-item>
        <el-form-item label="所属运营商：">
          <el-input v-model="modifyData.operaName"></el-input>
        </el-form-item>

        <el-form-item label="通道编号1：">
          <el-select v-model="modifyData.gwId1" filterable>
            <el-option
              v-for="item of gatewayList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道得分1：">
          <el-input v-model="modifyData.score1" placeholder="[0,100]"></el-input>
        </el-form-item>
        <el-form-item label="是否启用1：">
          <el-select v-model="modifyData.isKey1" filterable>
            <el-option
              v-for="item of isKeyList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通道编号2：">
          <el-select v-model="modifyData.gwId2" filterable>
            <el-option
              v-for="item of gatewayList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道得分2：">
          <el-input v-model="modifyData.score2" placeholder="[0,100]"></el-input>
        </el-form-item>
        <el-form-item label="是否启用2：">
          <el-select v-model="modifyData.isKey2" filterable>
            <el-option
              v-for="item of isKeyList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通道编号3：">
          <el-select v-model="modifyData.gwId3" filterable>
            <el-option
              v-for="item of gatewayList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道得分3：">
          <el-input v-model="modifyData.score2" placeholder="[0,100]"></el-input>
        </el-form-item>
        <el-form-item label="是否启用3：">
          <el-select v-model="modifyData.isKey3" filterable>
            <el-option
              v-for="item of isKeyList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通道编号4：">
          <el-select v-model="modifyData.gwId4" filterable>
            <el-option
              v-for="item of gatewayList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道得分4：">
          <el-input v-model="modifyData.score4" placeholder="[0,100]"></el-input>
        </el-form-item>
        <el-form-item label="是否启用4：">
          <el-select v-model="modifyData.isKey4" filterable>
            <el-option
              v-for="item of isKeyList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通道编号5：">
          <el-select v-model="modifyData.gwId5" filterable>
            <el-option
              v-for="item of gatewayList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道得分5：">
          <el-input v-model="modifyData.score5" placeholder="[0,100]"></el-input>
        </el-form-item>
        <el-form-item label="是否启用5：">
          <el-select v-model="modifyData.isKey5" filterable>
            <el-option
              v-for="item of isKeyList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('modifyData')">取 消</el-button>
        <el-button type="primary" @click="submitModify('modifyData')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "A",
  data() {
    return {
      addDataFlag: false,
      modifyDataFlag: false,
      gwGroupName: "",
      gatewayId: "",
      index: 0,
      sum: 0,
      totalPage: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: false,
      loading: false,
      tableData: [],
      operaidList: [
        //   1:移动，2：联通，3：电信
        {
          key: 1,
          label: "移动",
          value: 1
        },
        {
          key: 2,
          label: "联通",
          value: 2
        },
        {
          key: 3,
          label: "电信",
          value: 3
        }
      ],
      gatewayList: [],
      isKeyList: [
        {
          key: 0,
          label: "否",
          value: 0
        },
        {
          key: 1,
          label: "是",
          value: 1
        }
      ],
      modifyData: {
        id: "",
        gwGroupName: "",
        userName: "",
        operaid: "",
        operaName:"",
        gwId1: "",
        score1: "",
        isKey1: "",
        gwId2: "",
        score2: "",
        isKey2: "",
        gwId3: "",
        score2: "",
        isKey3: "",
        gwId4: "",
        score4: "",
        isKey4: "",
        gwId5: "",
        score5: "",
        isKey5: ""
      },
      addData: {
        gwGroupName: "",
        operaid: ""
      },
      rule1: {
        gwGroupName: [{ required: true, message: "不能为空", trigger: "blur" }]
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
    handleCommand(command) {
      this[command.name] = true;
    },
    handleSelectionChange(val) {
      this.choosedGateway = val;
      // console.log(this.choosedGateway);
    },
    resetForm(formName) {
      this.modifyDataFlag = false;
      this.addDataFlag = false;
      this.addData = {};
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listPipeGroup", {
        gwGroupName: this.gwGroupName,
        gatewayId: this.gatewayId
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            id: item.id,
            index: self.index,
            userName: item.userName,
            gwGroupName: item.gwGroupName,
            operaName: item.operaName,
            operaid: item.operaid,
            gwId1: item.gwId1 ? item.gwId1 : "",
            score1: item.gwId1 ? item.score1 : "",
            isKey1Cn: item.isKey1Cn,
            isKey1: item.isKey1,

            gwId2: item.gwId2 ? item.gwId2 : "",
            score2: item.gwId2 ? item.score2 : "",
            isKey2Cn: item.isKey2Cn,
            isKey2: item.isKey2,

            gwId3: item.gwId3 ? item.gwId3 : "",
            score3: item.gwId3 ? item.score3 : "",
            isKey3Cn: item.isKey3Cn,
            isKey3: item.isKey3,

            gwId4: item.gwId4 ? item.gwId4 : "",
            score4: item.gwId4 ? item.score4 : "",
            isKey4Cn: item.isKey4Cn,
            isKey4: item.isKey4,

            gwId5: item.gwId5 ? item.gwId5 : "",
            score5: item.gwId5 ? item.score5 : "",
            isKey5Cn: item.isKey5Cn,
            isKey5: item.isKey5
          });
          self.index++;
        }
      });
    },
    modify(row) {
      this.gatewayList = [];
      this.modifyDataFlag = true;
      let self = this;
      this.postRequest("admin/editPipeGroup", {
        gwGroupId: row.id,
        operaid: row.operaid
      }).then(res => {

        for (let item of res.data.data.pipeList) {
          self.gatewayList.push({
            key: item.gateway,
            label: item.gatewayname,
            value: item.gateway
          });
        }
        let dataObj = res.data.data.pipeGroup;
        self.modifyData.gwGroupName = dataObj.gwGroupName;
        self.modifyData.operaid = dataObj.operaid;
        self.modifyData.gwId1 = dataObj.gwId1 ? dataObj.gwId1 : "";
        self.modifyData.score1 = dataObj.score1 ? dataObj.score1 : "";
        self.modifyData.isKey1 = dataObj.isKey1;
        self.modifyData.gwId2 = dataObj.gwId2 ? dataObj.gwId2 : "";
        self.modifyData.score2 = dataObj.score2 ? dataObj.score2 : "";
        self.modifyData.isKey2 = dataObj.isKey2;
        self.modifyData.gwId3 = dataObj.gwId3 ? dataObj.gwId3 : "";
        self.modifyData.score2 = dataObj.score3 ? dataObj.score3 : "";
        self.modifyData.isKey3 = dataObj.isKey3;
        self.modifyData.gwId4 = dataObj.gwId4 ? dataObj.gwId4 : "";
        self.modifyData.score4 = dataObj.score4 ? dataObj.score4 : "";
        self.modifyData.isKey4 = dataObj.isKey4;
        self.modifyData.gwId5 = dataObj.gwId5 ? dataObj.gwId5 : "";
        self.modifyData.score5 = dataObj.score5 ? dataObj.score5 : "";
        self.modifyData.isKey5 = dataObj.isKey5;
        self.modifyData.id = dataObj.id;
        self.modifyData.userName = dataObj.userName;
        self.modifyData.operaName = dataObj.operaName;
      });
    },
    add() {
      this.addDataFlag = true;
    },
    submitAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          this.postRequest("admin/saveAddPipeGroup", this.addData).then(res => {
            console.log(res);
            self.resAlert(res.data);
            self.checkData();
            this.addDataFlag = false;
            self.addData = {
              gwGroupName: "",
              operaid: ""
            };
          });
        } else {
          return false;
        }
      });
    },
    submitModify(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          this.postRequest("admin/saveEditPipeGroup", this.modifyData).then(
            res => {
              self.resAlert(res.data);
              self.modifyDataFlag = false;
              self.checkData();
            }
          );
        } else {
          return false;
        }
      });
    },
    del(row) {
      console.log(row);
      let self = this;
      this.$confirm(`确认删除【${row.gwGroupName}】?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deletePipeGroup", {
            gwGroupId: row.id
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
          });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.checkData();
  }
};
</script>

<style scoped>
</style>
