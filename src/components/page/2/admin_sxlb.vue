<template>
    <div class="container">
        <el-form label-width="120px" inline="inline" v-on:keyup.enter.native="checkData">
            <el-form-item label="号码：">
                <el-input v-model="mobile"></el-input>
            </el-form-item>
            <el-form-item label="内容：">
                <el-input v-model="content"></el-input>
            </el-form-item>
            <el-form-item label="用户名：">
                <el-input v-model="userName"></el-input>
            </el-form-item>
            <el-form-item label="网关编号：">
                <el-input v-model="gateway"></el-input>
            </el-form-item>
            <el-form-item label="开始时间：">
                <el-date-picker type="date" v-model="fmmdd"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
                <el-date-picker type="date" v-model="tmmdd"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="checkData" type="primary" plain>查询</el-button>
            </el-form-item>
        </el-form>
        <el-card v-if="checkIn">
            <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
                <el-table-column label="序号" prop="index"></el-table-column>
                <el-table-column prop="userName" label="用户名"></el-table-column>
                <el-table-column prop="serverNum" label="特服号"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="mobile" label="号码"></el-table-column>
                <el-table-column prop="gateway" label="网关编号"></el-table-column>
                <el-table-column prop="operaidCn" label="运营商"></el-table-column>
                <el-table-column prop="createtime" label="上行时间"></el-table-column>
            </el-table>
            <el-pagination
                class="fr"
                style="margin:10px 0"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
                :current-page.sync="pageNum"
                :page-size.sync="pageSize"
                 layout="sizes, prev, pager, next, jumper"
                :total="sum"
            ></el-pagination>
            <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "admin_fxbglb",
        data() {
            return {
                index:0,
                content: "",
                fmmdd: new Date(),
                tmmdd: new Date(),
                gateway: "",
                mobile: "",
                pageNum: 1,
                pageSize: 30,
                userName: "",
                checkIn: true,
                sum: 0,
                tableData: [],
                loading: false,
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
                this.tableData = [];
                this.checkIn = true;
                this.loading = true;
                let self = this;
                this.postRequest("admin/listDeliverMsg", {
                    gateway: this.gateway,
                    content: this.content,
                    fmmdd: this.formatDate(this.fmmdd),
                    tmmdd: this.formatDate(this.tmmdd),
                    userName: this.userName,
                    mobile: this.mobile,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                }).then(res => {
                    self.tableData = [];
                    self.loading = false;
                    this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
                    self.sum = res.data.data.page.totalCount;
                    for (let item of res.data.data.data) {
                        self.tableData.push({
                            index:self.index,
                            userName: item.userName,
                            serverNum: item.serverNum,
                            content: item.content,
                            mobile: item.mobile,
                            gateway: item.gateway,
                            operaid: item.operaid,
                            operaidCn: item.operaidCn,
                            createtime: item.createtime
                            //网关ID和任务ID分不清
                        });
                        self.index++;
                    }
                });
            },
            cancel() {
            }
        }
    };
</script>

<style scoped>
</style>
