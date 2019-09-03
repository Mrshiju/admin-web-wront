<template>
    <div class="container">
        <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
            <el-form-item label="批次号：">
                <el-input v-model="cid"></el-input>
            </el-form-item>

          

            <el-form-item label="呼叫结果：">
               <el-input v-model="call_result"></el-input>
            </el-form-item>

            <el-form-item label="开始时间：">
                <el-date-picker v-model="startDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>

            <el-form-item label="结束时间：">
                <el-date-picker v-model="endDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button @click="checkData" type="primary" plain>查询</el-button>
            </el-form-item>
        </el-form>

        <el-card v-if="checkIn">
            <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
                <el-table-column label="序号" prop="index" align="center"></el-table-column>
                <el-table-column prop="cid" label="批次号" align="center" width="160px"></el-table-column>
                <el-table-column prop="id" label="id" align="center" width="160px"></el-table-column>
                <el-table-column prop="call_result" label="呼叫结果" align="center"></el-table-column>
                <el-table-column prop="all_num" label="呼叫总数" align="center"></el-table-column>
                <el-table-column prop="unall_num" label="未呼叫总数" align="center"></el-table-column>
                <el-table-column prop="creattime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="sendtime" label="更新时间" align="center"></el-table-column>
            </el-table>
            <el-pagination
                class="fr"
                style="margin:10px 0"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
                :current-page.sync="pageNum"
                :page-size.sync="pageSize"
                :total="sum"
                layout="sizes, prev, pager, next, jumper"
            ></el-pagination>
            <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
        </el-card>
    </div>
</template>
<script>
    export default {
        name: "admin_yyhjjglb",
        data() {
            return {
                startDate: new Date(),
                endDate: new Date(),
                cid: "",
                url: "",
                content: "",
                type: "",
                leave: "",
                mobile:'',
                call_result:'',
                options: [],

                options1: [],
                label_level: 0,
                label_type: 0,
                label_result:'所有',
                pageNum: 1,
                pageSize: 30,
                sum: 0,
                index: 0,
                tableData: [],
                checkIn: false,
                loading: false,
                options2:[
                    {label:'所有'},
                    {label:'A'},
                    {label:'B'},
                    {label:'C'},
                    {label:'D'},
                ]


            };
        },
        methods: {
            succeed(message) {
                this.$message({
                    message: message,
                    type: "success"
                });
            },
            failed(message) {
                this.$message.error(message);
            },
            handleSizeChange() {
                this.checkData();
            },
            handlePageChange() {
                this.checkData();
            },
            checkData() {
                this.tableData = [];
                this.checkIn = true;
                this.loading = true;
                let self = this;
                this.postRequest("admin/labelCallBatchResultList", {
                    startDate: this.formatDate2(this.startDate),
                    endDate: this.formatDate2(this.endDate),
                    cid: this.cid,
                    mobile: this.mobile,
                    pageSize: this.pageSize,
                    call_result:this.label_result == '所有'? '':this.label_result,
                }).then(res => {
                    self.tableData = [];
                    self.loading = false;
                    this.index =
                        Number(res.data.data.page.pageNum - 1) *
                        Number(res.data.data.page.pageSize) +
                        1;
                    self.sum = res.data.data.curPageCount;
                    for (let item of res.data.data.batchResults) {
                        self.tableData.push({
                            index: self.index,
                            id: item.id,
                            cid: item.cid,
                            all_num:item.all_num,
                            unall_num:item.uncall_num,
                            mobile: item.mobile,
                            sendtime: item.updatetime,
                            creattime:item.createtime,
                            call_result:item.call_result,
                        });
                        self.index++;
                    }
                });
            },
            takeOpation() {
                let self = this;
                // this.postRequest("admin/getLabelType", {}).then(
                this.postRequest("admin/getLabelType", {}).then(
                    res => {
                        for (let i in res.data.data) {
                            self.options.push({
                                label: res.data.data[i],
                                value: i
                            });
                        }
                        self.options.unshift({
                            label: "所有",
                            value: 0
                        });
                    }

                );
            },
            takeOpation1() {
                let self = this;
                // this.postRequest("admin/getLabelLevel", {}).then(
                this.postRequest("admin/getLabelLevel", {}).then(
                    res => {
                        for (let i in res.data.data) {
                            self.options1.push({
                                label: res.data.data[i],
                                value: i
                            });
                        }
                        self.options1.unshift({
                            label: "所有",
                            value: 0
                        });
                    }
                );
            },
            cancel() {}
        },
        mounted() {
            this.checkData();
            this.takeOpation();
            this.takeOpation1();
        }
    };
</script>
<style scoped>
</style>


