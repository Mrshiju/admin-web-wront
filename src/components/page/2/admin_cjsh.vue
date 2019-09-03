<template>
    <div class="container">
        <el-form :model="ruleForm" :rules="rules" label-width="100px" inline="inline" ref="form1" v-on:keyup.enter.native="checkData">
            <el-form-item label="用户名：" prop="userName">
                <el-input  v-model="ruleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="内容筛选：" prop="content">
                <el-input  v-model="ruleForm.content"></el-input>
            </el-form-item>
            <el-form-item label="时间筛选：" prop="fmmdd">
                <el-date-picker type="date" v-model="ruleForm.fmmdd"></el-date-picker>
            </el-form-item>

            <el-form-item label="移动网关：">
                <el-select v-model="ruleForm.cm" placeholder="请选择" filterable>
                    <el-option
                        v-for="item in ruleForm.options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="联通网关：">
                <el-select v-model="ruleForm.cu" placeholder="请选择" filterable>
                    <el-option
                        v-for="item in ruleForm.options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="电信网关：">
                <el-select v-model="ruleForm.ct" placeholder="请选择" filterable>
                    <el-option
                        v-for="item in ruleForm.options3"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="审核结果：" required>
                <el-select v-model="ruleForm.checkStatus" placeholder="请选择">
                    <el-option
                        v-for="item in ruleForm.options4"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否退费：">
                <el-select v-model="ruleForm.refund" placeholder="请选择">
                    <el-option
                        v-for="item in ruleForm.options5"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <span>针对审核拒绝</span>
            </el-form-item>

            <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" style="width: 220px" v-model="ruleForm.remark"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" type="primary" plain class="fr">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "A",
        data() {
            return {
                ruleForm: {
                    userName: '',
                    content: '',
                    fmmdd: new Date(),
                    cm: '',
                    cu: '',
                    ct: '',
                    checkStatus: 2,
                    refund: 1,
                    remark: '',
                    options1: [],
                    options2: [],
                    options3: [],
                    options4: [{
                        value: 2,
                        label: '审核通过'
                    }, {
                        value: 3,
                        label: '审核拒绝'
                    }],
                    options5: [{
                        value: 1,
                        label: '否'
                    }, {
                        value: 2,
                        label: '是'
                    }],
                },
                rules: {
                    // userMame:[//我瞎了呀
                    //艹NM这个弱智分辨率,这是M不是N，m不是n
                    fmmdd: [
                        {required: true, message: '时间筛选不能为空', trigger: 'blur'},
                    ],
                    userName: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'},
                    ],
                    remark:
                        [
                            {required: true, message: '备注不能为空', trigger: 'blur'},
                        ],
                    // content: [
                    //     {required: true, message: '内容筛选不能为空', trigger: 'blur'},
                    // ],
                }
            };
        },
        methods: {
            submit() {
                let self = this;
                this.$refs.form1.validate(valid => {
                    if (valid) {
                        this.postRequest('admin/superCheck', {
                            userName: this.ruleForm.userName,
                            content: this.ruleForm.content,
                            fmmdd: this.formatDate(this.ruleForm.fmmdd),
                            cm: this.ruleForm.cm,
                            cu: this.ruleForm.cm,
                            ct: this.ruleForm.ct,
                            checkStatus: this.ruleForm.checkStatus,
                            refund: this.ruleForm.refund,
                            remark: this.ruleForm.remark
                        }).then((res) => {
                            // console.log(res);
                            self.resAlert(res.data);
                        })
                    } else return false
                })
            }
        }
        ,
        beforeCreate() {
            let self = this;
            this.postRequest('admin/gatewayList', {
                token: ''
            }).then((res) => {
                for (let item of res.data.data.cmList) {
                    self.ruleForm.options1.push({
                        value: item.gateway,
                        label: item.gatewayname
                    })
                }
                for (let item of res.data.data.cuList) {
                    self.ruleForm.options2.push({
                        value: item.gateway,
                        label: item.gatewayname
                    })
                }
                for (let item of res.data.data.ctList) {
                    self.ruleForm.options3.push({
                        value: item.gateway,
                        label: item.gatewayname
                    })
                }
                self.ruleForm.cm = self.ruleForm.options1[0].value;
                self.ruleForm.cu = self.ruleForm.options2[0].value;
                self.ruleForm.ct = self.ruleForm.options3[0].value;
            })
        }
    }
</script>

<style scoped>

</style>
