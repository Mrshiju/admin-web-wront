<template>
  <div class="container">
    <el-form>
      <el-form-item label="文件上传: ">
        <el-upload action accept=".xlsx" :on-change="sub" :http-request="submit">
          <el-button>选择上传文件</el-button>
          <span class="el-upload__tip">&nbsp;只能上传xlsx文件</span>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // uploadUrl: `${sessionStorage.base}admin/uploadlabelCallMobileResult`,
      // uploadUrl: 'http://192.168.1.244:8010/admin/uploadlabelCallMobileResult',
      file: {},
      formData: new FormData()
    };
  },
  methods: {
    sub(file) {
      this.file = file.raw;
    },
    async submit(raw) {
      let self = this;
      this.formData.set("file", this.file);
      let res = await this.postRequest(
        "admin/uploadlabelCallMobileResult",
        self.formData
      );

      if (res.data.success) {
        this.$message.success(res.data.message);
      } else {
        this.$message.warning(res.data.resultMsg);
      }
    }
  },
  mounted() {}
};
</script>
<style scoped>
</style>


