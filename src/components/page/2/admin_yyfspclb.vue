<template>
    <div class="container">
        <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
            <el-form-item label="批次号：">
                <el-input v-model="cid"></el-input>
            </el-form-item>

            <el-form-item label="标签类型：">
                <el-select v-model="label_type" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="标签等级：">
                <el-select v-model="label_level" placeholder="请选择">
                    <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
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
                <el-table-column prop="cid" label="批次号" align="center"></el-table-column>
                <el-table-column prop="label_type" label="标签类型" align="center"></el-table-column>
                <el-table-column prop="label_level" label="标签等级" align="center"></el-table-column>
                <el-table-column prop="phonenum" label="号码数量" align="center"></el-table-column>
                <el-table-column prop="sendtime" label="发送时间" align="center"></el-table-column>
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
        name: "admin_yyfspclb",
        data() {
            return {
                startDate: new Date(),
                endDate: new Date(),
                cid: "",
                url: "",
                content: "",
                type: "",
                leave: "",
                options: [],

                options1: [],
                label_level: 0,
                label_type: 0,

                pageNum: 1,
                pageSize: 30,
                sum: 0,
                index: 0,
                tableData: [],
                checkIn: false,
                loading: false
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
                this.postRequest("admin/labelCallSendBatchList", {
                    // this.postRequest("admin/labelSendBatchList", {
                    startDate: this.formatDate2(this.startDate),
                    endDate: this.formatDate2(this.endDate),
                    cid: this.cid,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    label_type: this.label_type,
                    label_level: this.label_level
                }).then(res => {
                    self.tableData = [];
                    self.loading = false;
                    this.index =
                        Number(res.data.data.page.pageNum - 1) *
                        Number(res.data.data.page.pageSize) +
                        1;
                    self.sum = res.data.data.page.totalCount;
                    for (let item of res.data.data.labels) {

                        // 转化，公共的，可以提取成公共组件没弄
                        var label_type = item.label_type;
                        switch (label_type) {
                            case 0:
                                label_type = "无";
                                break;
                            case 1:
                                label_type = "网贷";
                                break;
                            case 2:
                                label_type = "信用卡";
                                break;
                            case 3:
                                label_type = "电商";
                                break;
                            case 4:
                                label_type = "游戏";
                                break;
                            case 5:
                                label_type = "汽车";
                                break;
                            case 6:
                                label_type = "母婴";
                                break;
                            case 7:
                                label_type = "教育";
                                break;
                        }
                        var label_level = item.label_level;
                        switch (label_level) {
                            case 0:
                                label_level = "无";
                                break;
                            case 1:
                                label_level = "A";
                                break;
                            case 2:
                                label_level = "B";
                                break;
                            case 3:
                                label_level = "C";
                                break;
                            case 4:
                                label_level = "D";
                                break;
                            case 5:
                                label_level = "E";
                                break;
                            case 6:
                                label_level = "F";
                                break;
                            case 7:
                                label_level = "G";
                                break;
                            case 8:
                                label_level = "H";
                                break;
                            case 9:
                                label_level = "I";
                                break;
                        }
                        self.tableData.push({
                            index: self.index,
                            id: item.id,
                            cid: item.cid,
                            label_type: label_type,
                            label_level: label_level,
                            phonenum: item.phonenum,
                            sendtime: item.sendtime,
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


