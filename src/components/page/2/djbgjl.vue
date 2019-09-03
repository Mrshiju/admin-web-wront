<template>
    <div class="container">
        <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
            <el-form-item label="开始时间：">
                <el-date-picker type="date" v-model="startTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：">
                <el-date-picker type="date" v-model="endTime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
            </el-form-item>
        </el-form>
        <el-card v-if="checkIn">
            <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
                <el-table-column label="用户名" prop="userName"></el-table-column>
                <el-table-column label="变更前单价（元）" prop="beforePrice"></el-table-column>
                <el-table-column prop="afterPrice" label="变更后单价（元）"></el-table-column>
                <el-table-column prop="operatorName" label="操作人"></el-table-column>
                <el-table-column prop="changeTime" label="变更时间"></el-table-column>
                <el-table-column label="原因">
                    <template slot-scope="scope">
                        {{scope.row.reason===1?'手动修改':scope.row.reason===2?'充值自动计算':scope.row.reason===3?'补款自动计算':'未知'}}
                    </template>
                </el-table-column>
            </el-table>
            <div>
                <el-pagination
                    class="fr"
                    style="margin:10px 0"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                    :current-page.sync="currentPage"
                    :page-size.sync="currentSize"
                     layout="sizes, prev, pager, next, jumper"
                    :total="sum"
                ></el-pagination>
                <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "A",
        data() {
            return {
                sum: 0,
                totalPage: 1000,
                currentSize: 30,
                currentPage: 1,
                checkIn: false,
                loading: false,
                tableData: [],
                startTime: new Date(),
                endTime: new Date()
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
                this.postRequest("admin/unitPriceChangeRecord", {
                    pageNum: this.currentPage,
                    pageSize: this.currentSize,
                    startTime: this.formatDate2(this.startTime),
                    endTime: this.formatDate2(this.endTime),
                    userName: this.$route.query.userName,
                }).then(res => {
                    self.totalPage = res.data.data.page.totalPage;
                    self.loading = false;
                    self.sum = res.data.data.page.totalCount;
                    for (let item of res.data.data.data.list) {
                        self.tableData.push({
                            id: item.id,
                            userName: item.userName,
                            beforePrice: Number(item.beforePrice) / 10000,
                            afterPrice: Number(item.afterPrice) / 10000,
                            operatorName: item.operatorName,
                            changeTime: item.changeTime,
                            reason: item.reason
                        });
                    }
                });
            }
        }
    };
</script>

<style scoped>
</style>
