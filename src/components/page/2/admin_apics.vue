<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" inline="inline" label-width="120px" :model="form" :rules="rules" ref="form">
      <el-form-item label="提交地址：">
        <el-input v-model="form.submitUrl"></el-input>
      </el-form-item>
      <el-form-item label="用户名：" prop="userName">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="手机号码：" prop="mobile">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="短信内容：" prop="content">
        <el-input v-model="form.content" type="textarea" style="width: 220px;"></el-input>
      </el-form-item>
      <el-form-item label="扩展号：">
        <el-input v-model="form.ext"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="submit('form')" type="primary" plain>提交</el-button>
  </div>
</template>

<script>
export default {
  name: "admin_tgcs",
  data() {
    return {
      form: {
        submitUrl: "http://120.55.248.18/smsSend.do",
        userName: "",
        password: "",
        mobile: "",
        content: "",
        ext: ""
      },
      rules: {
        userName: [{ required: true, message: "不能为空", trigger: "blur" }],
        mobile: [{ required: true, message: "不能为空", trigger: "blur" }],
        password: [{ required: true, message: "不能为空", trigger: "blur" }],
        content: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          this.postRequest("admin/testSmsApi", {
            submitUrl: this.form.submitUrl,
            userName: this.form.userName,
            password: this.form.password,
            mobile: this.form.mobile,
            content: this.form.content,
            ext: this.form.ext
          }).then(res => {
            self.resAlert(res.data);
            self.form = {
              submitUrl: "http://120.55.248.18/smsSend.do",
              userName: "",
              password: "",
              mobile: "",
              content: "",
              ext: ""
            };
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
</style>
