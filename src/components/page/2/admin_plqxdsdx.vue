<template>
    <div class="container">
        <el-form label-width="100px" :model="form" :rules="rules" inline="inline" ref="form" v-on:keyup.enter.native="checkData">
            <el-form-item label="用户名：" prop="userName">
                <el-input v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="定时时间：" prop="fmmdd">
                <el-date-picker type="datetime" v-model="form.fmmdd"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" type="primary" plain>确定取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "admin_plqxdsdx",
        data() {
            return {
                form: {
                    userName: '',
                    fmmdd: new Date(),
                },
                rules: {
                    userName: [
                        {
                            required: true,
                            message: '用户名不得为空',
                            trigger: 'blur'
                        }
                    ],
                    fmmdd: [
                        {
                            required: true,
                            message: '时间不得为空',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            submit() {
                let self = this;
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.postRequest('admin/smsTimeBatchDelete', {
                            definitetime: this.formatDate2(this.form.fmmdd),
                            userName: this.form.userName,
                        }).then((res) => {
                            if (res.data.success !== true) self.$message.error(res.data.message);
                            else self.$message.success(res.data.message)
                        })
                    } else return false
                })
            }
        }
    }
</script>

<style scoped>

</style>
