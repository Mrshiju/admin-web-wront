<template>
    <div class="container">
        <el-form v-on:keyup.enter.native="checkData" inline="inline" :model="form" label-width="120px" :rules="rules"
                 ref="form">
            <el-form-item label="用户名：">
                <el-input disabled v-model="form.userName"></el-input>
            </el-form-item>
            <el-form-item label="特服号：">
                <el-input v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item label="网关编号：" prop="gatewayId">
                <el-select filterable v-model="form.gatewayId" placeholder="请选择">
                    <el-option
                        v-for="item in gatewayList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号码：" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="短信内容：" prop="content">
                <el-input v-model="form.content" type="textarea" style="width: 220px;"></el-input>
            </el-form-item>
            <el-form-item label="所属运营商：">
                <el-radio-group v-model="form.operaid">
                    <el-radio :label="1">移动</el-radio>
                    <el-radio :label="2">联通</el-radio>
                    <el-radio :label="3">电信</el-radio>
                </el-radio-group>
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
                    userName: "test_sms",
                    code: 31288,
                    gatewayId: "",
                    mobile: "",
                    content: "",
                    operaid: 1,
                },
                gatewayList: [],
                rules: {
                    gatewayId: [{required: true, message: "不能为空", trigger: "blur"}],
                    mobile: [{required: true, message: "不能为空", trigger: "blur"}],
                    content: [{required: true, message: "不能为空", trigger: "blur"}]
                }
            };
        },
        methods: {
            submit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let self = this;
                        this.postRequest("admin/testPipe", {
                            userName: this.form.userName,
                            code: this.form.code,
                            gatewayId: this.form.gatewayId,
                            mobile: this.form.mobile,
                            content: this.form.content,
                            operaid: this.form.operaid
                        }).then(res => {
                            self.resAlert(res.data);
                            self.form = {
                                userName: "test_sms",
                                code: 31288,
                                gatewayId: "",
                                mobile: "",
                                content: "",
                                 operaid: 1,
                            };
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        created() {
            let self = this;
            this.gatewayList = [];
            let XXX = [];
            this.postRequest("admin/getGatewayList", {t: ""}).then(res => {
                for (let list in res.data.data) {
                    for (let item of res.data.data[list]) {
                        if (XXX.indexOf(item.gateway) === -1) {
                            XXX.push(item.gateway);
                            self.gatewayList.push({
                                value: item.gateway,
                                label: item.gatewayname
                            });
                        }
                    }
                }
            });
        }
    };
</script>

<style scoped>
</style>
