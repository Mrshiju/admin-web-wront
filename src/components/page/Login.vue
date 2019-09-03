<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="username">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" autocomplete="new-password">
          <el-input
            type="password"
            placeholder="password"
            autocomplete="new-password"
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="baseUrl">
          <el-button icon="el-icon-setting"></el-button>
          <el-select v-model="ruleForm.baseUrl" @change="getBaseUrl(ruleForm.baseUrl)">
            <el-option
              v-for="(item,i) of baseUrlList"
              :label="item.label"
              :value="item.value"
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="login-btn">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            element-loading-background="rgba(0, 0, 0, 0.6)"
            :disabled="loading"
            :loading="loading"
          >{{loading !== true ? '登录' : '登录中...'}}</el-button>
        </div>
        <p class="login-tips" :class="{active:isActive}">提示：{{errorMsg}}</p>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      loading: false,
      isActive: false,
      errorMsg: "lalala",
      ruleForm: {
        username: "",
        password: "",
        baseUrl: localStorage.base ? localStorage.base : ""
      },
      baseUrlList: [
        {
          label: "营销账号",
          value: "yxBaseUrl"
        }
        // {
        //   label: "行业账号",
        //   value: "hyBaseUrl"
        // }
      ],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        baseUrl: [
          { required: true, message: "请选择账号类型", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    getBaseUrl(baseUrl) {
      localStorage.setItem("base", baseUrl);
    },
    submitForm(formName) {
      let self = this; //注意这里三层的this，前两层指这个组件（page？）第三层，then里的this是undefined
      // console.log(this);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$axios.get("requestUrl.json").then(res => {
            self.loading = false;
            sessionStorage.base = res.data[localStorage.base];
            // console.log(res.data);
            // console.log(localStorage.base);
            // console.log(res.data[localStorage.base]);
            self
              .postRequest("web/login", {
                userName: this.ruleForm.username,
                password: this.ruleForm.password,
                source: "admin"
              })
              .then(response => {
                self.loading = false;
                if (response.data.success === true) {
                  sessionStorage.setItem("admin_token", response.data.data);
                  sessionStorage.setItem("saleName", self.ruleForm.username);
                  // document.cookie=`saleName = ${this.ruleForm.username}`
                  // if() {
                  //
                  // }
                  self.loading = true;
                  let leftMenu = [];
                  self
                    .postRequest("admin/loginAfter", {
                      menuName: "admin_dashboard_show"
                    })
                    .then(function(response) {
                      let dashboardFlg = false;
                      if (response.data.success) {
                        let mainPage = response.data.data.menuName;
                        let mainTitle = response.data.data.menuNameCn;
                        self.$router.push(mainPage);
                        sessionStorage.setItem("mainPage", "/" + mainPage);
                        sessionStorage.setItem("mainTitle", mainTitle);
                      }
                    });
                } else {
                  // console.log(self.isActive);
                  // console.log(self.errorMsg);
                  self.isActive = true;
                  self.errorMsg = response.data.resultMsg;
                }
              });
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/login.jpg);
  background-size: 100%;
  font-size: 40px;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
  line-height: 100%;
}

.login-btn button {
  width: 100%;
  height: 36px;
}

.login-tips {
  display: none;
  font-size: 12px;
  line-height: 30px;
  color: red;
}

.active {
  display: block;
}
</style>
