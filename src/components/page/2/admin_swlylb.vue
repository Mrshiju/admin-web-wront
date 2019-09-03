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
      <el-button type="text" @click="addGateway">+添加省网路由</el-button>
      <el-button type="text" @click="bulkDel">+批量删除省网路由</el-button>
      <el-table
        border
        ref="table"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :data="tableData"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modify(scope.row)" type="text">修改</el-button>
            <el-button @click="del(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="客户账号"></el-table-column>
        <el-table-column prop="mobileArea" label="省份"></el-table-column>
        <el-table-column prop="cnIsRouter" label="是否路由"></el-table-column>
        <el-table-column prop="cmGatewayName" label="移动网关"></el-table-column>
        <el-table-column prop="cuGatewayName" label="联通网关"></el-table-column>
        <el-table-column prop="ctGatewayName" label="电信网关"></el-table-column>
        <el-table-column prop="createoper" label="创建人"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="modifyoper" label="修改人"></el-table-column>
        <el-table-column prop="modifytime" label="修改时间"></el-table-column>
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
    <el-dialog title="添加省网路由" :visible.sync="addData.visible" width="500px">
      <el-form :model="addData" label-width="150px" style="width: 400px">
        <el-form-item label="客户账号：">
          <el-input v-model="addData.userName"></el-input>
        </el-form-item>
        <el-form-item label="省份路由：">
          <el-select filterable v-model="addData.mobileArea">
            <el-option
              v-for="item in mobileAreaOpt"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否路由：">
          <el-radio-group v-model="addData.isRoute">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
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
        <el-button type="primary" @click="submitAdd">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog title="省网路由修改" :visible.sync="modifyData.visible" width="500px">
      <el-form :model="modifyData" label-width="150px" style="width: 400px">
        <el-form-item label="客户账号：">
          <el-input disabled v-model="modifyData.userName"></el-input>
        </el-form-item>
        <el-form-item label="省份路由：">
          <el-select filterable v-model="modifyData.mobileArea">
            <el-option
              v-for="item in mobileAreaOpt"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否路由：">
          <el-radio-group v-model="modifyData.isRoute">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
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
        <el-button type="primary" @click="submitModify">确认修改</el-button>
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
      ids: "",
      mobileAreaOpt: [
        {
          label: "北京",
          value: "北京",
          key: 1
        },
        {
          label: "天津",
          value: "天津",
          key: 2
        },
        {
          label: "上海",
          value: "上海",
          key: 3
        },
        {
          label: "重庆",
          value: "重庆",
          key: 4
        },
        {
          label: "河北",
          value: "河北",
          key: 5
        },
        {
          label: "山西",
          value: "山西",
          key: 6
        },
        {
          label: "辽宁",
          value: "辽宁",
          key: 7
        },
        {
          label: "吉林",
          value: "吉林",
          key: 8
        },
        {
          label: "黑龙江",
          value: "黑龙江",
          key: 9
        },
        {
          label: "江苏",
          value: "江苏",
          key: 10
        },
        {
          label: "浙江",
          value: "浙江",
          key: 11
        },
        {
          label: "安徽",
          value: "安徽",
          key: 12
        },
        {
          label: "福建",
          value: "福建",
          key: 13
        },
        {
          label: "江西",
          value: "江西",
          key: 14
        },
        {
          label: "山东",
          value: "山东",
          key: 15
        },
        {
          label: "河南",
          value: "河南",
          key: 16
        },
        {
          label: "湖北",
          value: "湖北",
          key: 17
        },
        {
          label: "湖南",
          value: "湖南",
          key: 18
        },
        {
          label: "广东",
          value: "广东",
          key: 19
        },
        {
          label: "海南",
          value: "海南",
          key: 20
        },
        {
          label: "四川",
          value: "四川",
          key: 21
        },
        {
          label: "贵州",
          value: "贵州",
          key: 22
        },
        {
          label: "云南",
          value: "云南",
          key: 23
        },
        {
          label: "陕西",
          value: "陕西",
          key: 24
        },
        {
          label: "甘肃",
          value: "甘肃",
          key: 25
        },
        {
          label: "青海",
          value: "青海",
          key: 26
        },
        {
          label: "台湾",
          value: "台湾",
          key: 27
        },
        {
          label: "内蒙古",
          value: "内蒙古",
          key: 28
        },
        {
          label: "广西",
          value: "广西",
          key: 29
        },
        {
          label: "西藏",
          value: "西藏",
          key: 30
        },
        {
          label: "宁夏",
          value: "宁夏",
          key: 31
        },
        {
          label: "新疆",
          value: "新疆",
          key: 32
        },
        {
          label: "香港",
          value: "香港",
          key: 33
        },
        {
          label: "澳门",
          value: "澳门",
          key: 34
        }
      ],
      cmList: [],
      cuList: [],
      ctList: [],
      modifyData: {
        visible: false,
        id: "",
        accountID: "",
        code: "",
        userName: "",
        mobileArea: "",
        isRoute: "",
        cm: "",
        cu: "",
        ct: ""
      },
      addData: {
        visible: false,
        id: "",
        accountID: "",
        code: "",
        userName: "",
        mobileArea: "",
        isRoute: "",
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

    handleSelectionChange(val) {
      this.ids = "";
      for (let item of val) {
        this.ids += item.id + ",";
      }
      this.ids = this.ids.substr(0, this.ids.length - 1);
    },
    bulkDel() {
      let self = this;
      if (this.ids !== "") {
        this.$confirm("确认批量删除选中的省网路由？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.postRequest("admin/deleteBatchProvinceRoute", {
              ids: this.ids
            }).then(res => {
              if (res.data.success === true)
                self.$message.success(res.data.data);
              else self.$message.error(res.data.resultMsg);
              self.checkData();
            });
          })
          .catch(() => {});
      }else this.$message.warning('请选择省网路由')
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listProvinceRoute", {
        userName: this.userName
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            id: item.id,
            index:self.index,
            userName: item.userName,
            mobileArea: item.mobileArea,
            cnIsRouter: item.cnIsRouter,
            cmGatewayName: item.cmGatewayName,
            cuGatewayName: item.cuGatewayName,
            ctGatewayName: item.ctGatewayName,
            createoper: item.createoper,
            createtime: item.createtime,
            modifyoper: item.modifyoper,
            modifytime: item.modifytime
          });
          self.index++
        }
      });
    },
    addGateway() {
      let self = this;
      this.postRequest("admin/getGatewayList", {
        t: ""
      }).then(res => {
        self.cmList = [];
        self.cuList = [];
        self.ctList = [];
        for (let item of res.data.data.cmList) {
          if (item.status === 1) {
            self.cmList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.cuList) {
          if (item.status === 1) {
            self.cuList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.ctList) {
          if (item.status === 1) {
            self.ctList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
      });
      this.addData.visible = true;
    },
    submitAdd() {
      let self = this;
      this.postRequest("admin/saveAddProvinceRoute", this.addData).then(res => {
        self.checkData();
        self.addData = {
          visible: false,
          id: "",
          accountID: "",
          code: "",
          userName: "",
          mobileArea: "",
          isRoute: "",
          cm: "",
          cu: "",
          ct: ""
        };
        // console.log(res);
        if (res.data.success === true) {
          self.$message.success(res.data.data);
          self.addData.visible = false;
        } else self.$message.error(res.data.resultMsg);
      });
    },
    modify(row) {
      let self = this;
      this.postRequest("admin/editProvinceRoute", {
        id: row.id
      }).then(res => {
        self.cmList = [];
        self.cuList = [];
        self.ctList = [];
        for (let item of res.data.data.cmList) {
          if (item.status === 1) {
            self.cmList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.cuList) {
          if (item.status === 1) {
            self.cuList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.ctList) {
          if (item.status === 1) {
            self.ctList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        self.modifyData = {
          visible: true,
          id: res.data.data.mobileLocalRoute.id,
          accountID: res.data.data.mobileLocalRoute.accountID,
          code: res.data.data.mobileLocalRoute.code,
          userName: res.data.data.mobileLocalRoute.userName,
          mobileArea: res.data.data.mobileLocalRoute.mobileArea,
          isRoute: res.data.data.mobileLocalRoute.isRoute,
          cm: res.data.data.mobileLocalRoute.cm,
          cu: res.data.data.mobileLocalRoute.cu,
          ct: res.data.data.mobileLocalRoute.ct
        };
      });
    },
    submitModify() {
      let self = this;
      this.postRequest("admin/saveEditProvinceRoute", this.modifyData).then(
        res => {
          self.modifyData.visible = false;
          self.checkData();
          self.resAlert(res.data);
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
          this.postRequest("admin/deleteProvinceRoute", {
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
