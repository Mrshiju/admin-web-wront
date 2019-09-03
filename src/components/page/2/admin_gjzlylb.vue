<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="客户账号：">
        <el-input  v-model="userName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <!-- <el-button type="text" @click="add">+添加关键字路由</el-button> -->
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <!--<el-table-column-->
        <!--type="selection"-->
        <!--width="55">-->
        <!--</el-table-column>-->
        <el-table-column label="序号" width="50px" prop="index" :index="indexs"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改</el-button>
            <el-button @click="del(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户账号"></el-table-column>
        <el-table-column prop="keyword" label="关键字"></el-table-column>
        <el-table-column prop="keywordLevelStr" label="关键字等级"></el-table-column>
        <el-table-column prop="cmGatewayName" label="移动网关"></el-table-column>
        <el-table-column prop="ctGatewayName" label="联通网关"></el-table-column>
        <el-table-column prop="cuGatewayName" label="电信网关"></el-table-column>
        <!--<el-table-column-->
        <!--prop="creater"-->
        <!--label="创建人">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="createtime"-->
        <!--label="创建时间">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="modifier"-->
        <!--label="修改人">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="modifytime"-->
        <!--label="修改时间">-->
        <!--</el-table-column>-->
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
    <!-- <el-dialog title="添加关键字路由" :visible.sync="addData.visible" width="500px">
      <el-form :model="addData" label-width="150px" style="width: 400px;" ref="add" :rules="rule1">
        <el-form-item label="客户账号：" prop="userName">
          <el-input v-model="addData.userName"></el-input>
        </el-form-item>
        <el-form-item label="关键字：" prop="keyword">
          <el-input v-model="addData.keyword"></el-input>
        </el-form-item>
        <el-form-item label="关键字等级：" prop="keylevel">
          <el-select filterable v-model="addData.keylevel">
            <el-option v-for="item of keyLevelOpt" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="移动网关：">
          <el-select filterable v-model="addData.cm">
            <el-option
              v-for="item in cmList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联通网关：">
          <el-select filterable v-model="addData.cu">
            <el-option
              v-for="item in cuList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电信网关：">
          <el-select filterable v-model="addData.ct">
            <el-option
              v-for="item in ctList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addData.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">保存</el-button>
      </span>
    </el-dialog> -->
    <el-dialog title="关键字路由修改" :visible.sync="modifyData.visible" width="500px">
      <el-form :model="modifyData" label-width="150px" style="width: 400px;">
        <el-form-item label="客户账号：">
          <el-input v-model="modifyData.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input disabled v-model="modifyData.keyword"></el-input>
        </el-form-item>
        <el-form-item label="关键字等级：">
          <el-select filterable v-model="modifyData.keylevel">
            <el-option v-for="(item,index) of keyLevelOpt" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="移动网关：">
          <el-select filterable v-model="modifyData.cm">
            <el-option
              v-for="item in cmList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联通网关：">
          <el-select filterable v-model="modifyData.cu">
            <el-option
              v-for="item in cuList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电信网关：">
          <el-select filterable v-model="modifyData.ct">
            <el-option
              v-for="item in ctList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyData.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "A",
  data() {
    return {
      sum: 0,
      index:0,
      pageSize: 30,
      pageNum: 1,
      checkIn: true,
      loading: false,
      tableData: [],
      totalPage: 1000,
      userName: "",
      cuList: [],
      ctList: [],
      cmList: [],
      keyLevelOpt: [
        {
          label: "一级关键字",
          value: 1
        },
        {
          label: "二级关键字",
          value: 2
        },
        {
          label: "三级关键字",
          value: 3
        }
      ],
      // rule1: {
      //   userName: [
      //     { required: true, message: "请输入用户名", trigger: "blur" }
      //   ],
      //   keyword: [{ required: true, message: "请输入关键字", trigger: "blur" }],
      //   keylevel: [
      //     { required: true, message: "请选择关键字级别", trigger: "change" }
      //   ]
      // },
      // addData: {
      //   visible: false,
      //   userName: "",
      //   keyword: "",
      //   keylevel: 1,
      //   cm: "",
      //   cu: "",
      //   ct: ""
      // },
      modifyData: {
        visible: false,
        id: "",
        accountID: "",
        status: "",
        userName: "",
        keyword: "",
        keylevel: "",
        cm: "",
        cu: "",
        ct: ""
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
      this.postRequest("admin/listKeywordRoute", {
        userName: this.userName //？
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index:self.index,
            id: item.id,
            userName: item.userName,
            cmGatewayName: item.cmGatewayName,
            ctGatewayName: item.ctGatewayName,
            cuGatewayName: item.cuGatewayName,
            creater: item.creater,
            createtime: item.createtime,
            modifier: item.modifier,
            modifytime: item.modifytime,
            keyword: item.keyword,
            keylevel: item.keylevel,
            keywordLevelStr: item.keywordLevelStr
          });
          self.index++;
        }
      });
    },
    // add() {
    //   let self = this;
    //   this.cmList = [];
    //   this.cuList = [];
    //   this.ctList = [];
    //   this.postRequest("admin/getGatewayList").then(res => {
    //     for (let item of res.data.data.cuList) {
    //       if (item.status === 1) {
    //         self.cuList.push({
    //           label: item.gatewayname,
    //           value: item.gateway
    //         });
    //       }
    //     }
    //     for (let item of res.data.data.ctList) {
    //       if (item.status === 1) {
    //         self.ctList.push({
    //           label: item.gatewayname,
    //           value: item.gateway
    //         });
    //       }
    //     }
    //     for (let item of res.data.data.cmList) {
    //       if (item.status === 1) {
    //         self.cmList.push({
    //           label: item.gatewayname,
    //           value: item.gateway
    //         });
    //       }
    //     }
    //     self.addData.visible = true;
    //     self.addData.cm = self.cmList[0];
    //     self.addData.cu = self.cuList[0];
    //     self.addData.ct = self.ctList[0];
    //   });
    // },
    // submitAdd() {
    //   let self = this;
    //   this.$refs.add.validate(valid => {
    //     if (valid) {
    //       this.postRequest("admin/saveAddKeywordRoute", self.addData).then(
    //         res => {
    //           self.checkData();
    //           self.addData.visible = false;
    //           self.resAlert(res.data);
    //         }
    //       );
    //     }
    //   });
    // },
    modify(row) {
      this.cmList = [];
      this.cuList = [];
      this.ctList = [];
      let self = this;
      this.postRequest("admin/editKeywordRoute", {
        id: row.id
      }).then(res => {
        for (let item of res.data.data.cuList) {
          if (item.status === 1) {
            self.cuList.push({
              label: item.gatewayname,
              value: item.gateway
            });
          }
        }
        for (let item of res.data.data.ctList) {
          if (item.status === 1) {
            self.ctList.push({
              label: item.gatewayname,
              value: item.gateway
            });
          }
        }
        for (let item of res.data.data.cmList) {
          if (item.status === 1) {
            self.cmList.push({
              label: item.gatewayname,
              value: item.gateway
            });
          }
        }
        self.modifyData = {
          visible: true,
          id: res.data.data.keywordRoute.id,
          accountID: res.data.data.keywordRoute.accountID,
          status: res.data.data.keywordRoute.status,
          userName: res.data.data.keywordRoute.userName,
          keyword: res.data.data.keywordRoute.keyword,
          keylevel: res.data.data.keywordRoute.keylevel,
          cm: res.data.data.keywordRoute.cm,
          cu: res.data.data.keywordRoute.cu,
          ct: res.data.data.keywordRoute.ct
        };
      });
    },
    submitModify() {
      let self = this;
      this.postRequest("admin/saveEditKeywordRoute", this.modifyData).then(
        res => {
          self.modifyData.visible = false;
          self.resAlert(res.data);
          self.checkData();
        }
      );
    },
    del(row) {
      let self = this;
      this.$confirm("确认删除【" + row.userName + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.postRequest("admin/deleteKeywordRoute", {
            id: row.id
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
