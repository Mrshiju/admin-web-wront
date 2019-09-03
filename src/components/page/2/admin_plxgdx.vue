<template>
    <div class="container">
        <el-form :model="ruleForm" :rules="rules" label-width="120px" inline="inline" ref="form1" v-on:keyup.enter.native="checkData">
            <el-form-item label="用户名：" prop="userName">
                <el-input  v-model="ruleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="时间筛选：" prop="fmmdd">
                <el-date-picker type="date" v-model="ruleForm.fmmdd"></el-date-picker>
            </el-form-item>
             
            <el-form-item label="原内容：" prop="oldContent">
                <el-input type="textarea" v-model="ruleForm.oldContent" style="width: 220px"></el-input>
            </el-form-item>
             
            <el-form-item label="修改后内容：" prop="newContent">
                <el-input type="textarea" v-model="ruleForm.newContent" style="width: 220px"></el-input>
            </el-form-item>
             
            <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" v-model="ruleForm.remark" style="width: 220px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" type="primary" plain class="fr">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'

    export default {
        name: "A",
        data() {
            return {
                ruleForm: {
                    userName: '',
                    content: '',
                    fmmdd: new Date(),
                    oldContent: '',
                    newContent: '',
                    remark: '',
                },
                rules: {
                    fmmdd: [
                        {required: true, message: '时间筛选不能为空', trigger: 'blur'},
                    ],
                    userName: [
                        {required: true, message: '用户名不能为空', trigger: 'blur'},
                    ],
                    oldContent: [
                        {required: true, message: '原内容不能为空', trigger: 'blur'}
                    ],
                    newContent: [
                        {required: true, message: '修改后内容不能为空', trigger: 'blur'}
                    ],
                    remark:
                        [
                            {required: true, message: '备注不能为空', trigger: 'blur'},
                        ]
                }
            };
        },
        methods: {
            submit() {
                let self = this;
                this.$refs.form1.validate(valid => {
                    if (valid) {
                        this.postRequest('admin/batchContnetSaveEdit', {
                            userName: this.ruleForm.userName,
                            fmmdd: this.formatDate(this.ruleForm.fmmdd),
                            oldContent: this.ruleForm.oldContent,
                            newContent: this.ruleForm.newContent,
                            remark: this.ruleForm.remark
                        }).then((res) => {
                            self.resAlert(res.data)
                        })
                    } else return false
                })
            }
        }
    }
</script>

<style scoped>

</style>
