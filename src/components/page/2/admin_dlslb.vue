<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="代理商用户名：" >
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="公司名称：" >
        <el-input v-model="companyName"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="status">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="checkData">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="dialog1=true">添加代理商</el-button>
        <!--需求又改了-->
        <el-dialog title="添加代理商" :visible.sync="dialog1" width="500px" :before-close="handleClose">
          <el-form
            :v-model="form1"
            :rules="rule1"
            label-width="120px"
            inline="inline"
            style="width: 400px"
          >
            <el-form-item label="代理商用户名：" prop="userName">
              <el-input v-model="form1.userName"></el-input>
            </el-form-item>
            <el-form-item label="公司名称：" prop="companyName">
              <el-input v-model="form1.companyName"></el-input>
            </el-form-item>
            <el-form-item label="账号类型：" prop="type">
              <el-input v-model="form1.type"></el-input>
            </el-form-item>
            <el-form-item label="联系人：" prop="contact">
              <el-input v-model="form1.contact"></el-input>
            </el-form-item>
            <el-form-item label="联系人手机：" prop="mobile">
              <el-input v-model="form1.mobile"></el-input>
            </el-form-item>
            <el-form-item label="联系地址：" prop="address">
              <el-input v-model="form1.address"></el-input>
            </el-form-item>
            <el-form-item label="固定电话：" prop="phone">
              <el-input v-model="form1.phone"></el-input>
            </el-form-item>
            <el-form-item label="QQ/msn：" prop="qq">
              <el-input v-model="form1.qq"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="form1.email"></el-input>
            </el-form-item>
            <el-form-item label="营业执照：" prop="wtf1">
              <el-input v-model="form1.wtf1"></el-input>
            </el-form-item>
            <el-form-item label="合同：" prop="wtf2">
              <el-input v-model="form1.wtf2"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialog1 = false">取 消</el-button>
            <el-button type="primary" @click="dialog1 = false">确 定</el-button>
          </span>
        </el-dialog>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号：" prop="index"></el-table-column>
        <el-table-column width="180px" label="操作">
          <template slot-scope="scope">
            <el-button @click="dialog2=true" type="text">修改信息</el-button>
            <el-button type="text">扣款</el-button>
            <el-dropdown trigger="click">
              <el-button type="text">其他管理</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>补款</el-dropdown-item>
                <el-dropdown-item>修改权限</el-dropdown-item>
                <el-dropdown-item>重置密码</el-dropdown-item>
                <el-dropdown-item>禁用</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="belongAgentUserName" label="代理商用户名"></el-table-column>
        <el-table-column label="余额（条）"></el-table-column>
        <el-table-column label="可返补（条）"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="账号类型"></el-table-column>
        <el-table-column prop="contract" label="联系人"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="phone" label="固话"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="qq" label="QQ"></el-table-column>
        <el-table-column prop="mail" label="邮箱"></el-table-column>
        <el-table-column label="所属销售"></el-table-column>
        <el-table-column label="创建时间"></el-table-column>
        <el-table-column prop="modifyUserName" label="修改人"></el-table-column>
        <el-table-column prop="modifyTime" label="修改时间"></el-table-column>
      </el-table>
      <el-pagination
        class="fr"
        style="margin:10px 0"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="pageNum"
        :page-size.sync="pageSize"
         layout="sizes, prev, pager, next, jumper"
        :total="1000"
      ></el-pagination>
      <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
      <el-dialog title="代理商信息修改" :visible.sync="dialog2" width="500px" :before-close="handleClose">
        <el-form :rules="rule1" label-width="120px" inline="inline" style="width: 400px">
          <el-form-item label="代理商用户名：">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="所属销售：">
            <el-select v-model="status2">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业名称：">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="账号类型：">
            <el-select v-model="status3">
              <el-option
                v-for="item in options3"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系地址：">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="固定电话：">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="QQ号码：">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="企业邮箱：">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="主账号主页：">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="子账号主页：">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="营业执照："></el-form-item>
          <el-form-item label="合同：">
            <el-button type="text">下载</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog2 = false">取 消</el-button>
          <el-button type="primary" @click="dialog2 = false">修改</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "admin_dlslb",
  data() {
    return {
      sum: 0,
      pageNum: 1,
      PageSize: 30,
      checkIn: false,
      loading: false,
      tableData: [
        {
          index: 0
        },
        {
          index: 1
        }
      ],
      userName: "",
      dialog1: false,
      dialog2: false,
      companyName: "",
      rule1: {},
      status: 0,
      options1: [
        {
          value: 0,
          label: "所有"
        },
        {
          value: 1,
          label: "正常"
        },
        {
          value: 2,
          label: "禁用"
        }
      ],
      status2: 0,
      options2: [
        {
          value: 0,
          label: "qwqw"
        }
      ],
      status3: 0,
      options3: [
        {
          value: 0,
          label: "wewe"
        }
      ],
      form1: {}
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
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listAgent", {
        companyName: this.companyName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: this.status,
        userName: this.userName
      }).then(res => {
        self.loading = false;
        self.sum = res.data.data.data.length;
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style scoped>
</style>
