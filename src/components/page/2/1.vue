<template>
    <div class="container">
        <el-form inline="inline" label-width="120px">
            <el-form-item label="任务编号：">
                <el-input  v-model="cid"></el-input>
            </el-form-item>
            <el-form-item label="开始时间：">
               <el-date-picker type="date" v-model="date1"></el-date-picker>
            </el-form-item>
            <el-form-item label="网关报告：">
                <el-select v-model="value1" placeholder="请选择">
                    <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
            </el-form-item>
        </el-form>
        <el-card v-if="checkIn">
            <el-table
                ref="table"
                v-loading="loading"
                :data="tableData"
                stripe>
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    label="序号"
                    width="50px"
                    type="index"
                    :index="index">
                </el-table-column>
                <el-table-column
                    width="150px"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="modify(scope.row)" type="text">修改</el-button>
                        <el-button @click="del(scope.row)" type="text">删除</el-button>
                        <el-button @click="forbidden(scope.row)" type="text">禁用</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="fr"
                           style="margin:10px 0"
                           @size-change="handleSizeChange"
                           @current-change="handlePageChange"
                           :current-page.sync="pageNum"
                           :page-size.sync="pageSize"
                            layout="sizes, prev, pager, next, jumper"
                           :total=sum>
            </el-pagination>
            <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
        </el-card>
    </div>
</template>

<script>

    export default {
        name: "A",
        data() {
            return {
                sum: 0,
                pageSize: 30,
                pageNum: 1,
                checkIn: false,
                loading: false,
                tableData: [],
                rule1: {
                    XXX: [{required: true, message: '请输入活动名称', trigger: 'blur'},]
                }
                // totalPage: 1000,
            }
        },
        methods: {
            handleSizeChange() {
                this.checkData();
            },
            handlePageChange() {
                this.checkData();
            },
            index(index) {
                return index + 1;
            },
            handleCommand(command) {
                this[command.name] = true;
            },
            handleSelectionChange(val) {
                this.ids = '';
                for (let item of val) {
                    this.ids += item.id + ',';
                }
                this.ids = this.ids.substr(0, this.ids.length - 1)
            },
            addGateway() {
                let self = this;
                this.postRequest('admin/getGatewayList', {
                    t: ''
                }).then(res => {
                    self.cmList = [];
                    self.cuList = [];
                    self.ctList = [];
                    for (let item of res.data.data.cmList) {
                        if (item.status === 1) {
                            self.cmList.push({
                                value: item.gateway,
                                label: item.gatewayname
                            })
                        }
                    }
                    for (let item of res.data.data.cuList) {
                        if (item.status === 1) {
                            self.cuList.push({
                                value: item.gateway,
                                label: item.gatewayname
                            })
                        }
                    }
                    for (let item of res.data.data.ctList) {
                        if (item.status === 1) {
                            self.ctList.push({
                                value: item.gateway,
                                label: item.gatewayname
                            })
                        }
                    }
                })

                let XXX = [];
                this.postRequest('admin/getGatewayList', {t: ''}).then(res => {
                    for (let list in res.data.data) {
                        for (let item of res.data.data[list]) {
                            if (item.status === 1) {
                                if (XXX.indexOf(item.gateway) === -1) {
                                    XXX.push(item.gateway);
                                    self.gatewayList.push({
                                        value: item.gateway,
                                        label: item.gatewayname
                                    })
                                }
                            }
                        }
                    }
                });

                this.addData.visible = true;
            },
            checkData() {
                this.tableData = [];
                this.checkIn = true;
                this.loading = true;
                let self = this;
                this.postRequest(url, params).then((res) => {
                    self.loading = false;
                    self.sum = res.data.page.totalCount;
                    // self.totalPage = res.data.page.totalPage;
                    for (let item of res.data.data) {
                        self.tableData.push();
                    }
                })
            },
            reject() {
                this.$refs.formName.validate(valid => {
                    if (valid) {

                    } else return false
                })
            },
            getGatewayList() {
                this.gatewayList = [];
                let XXX = [];
                this.postRequest('admin/getGatewayList', {t: ''}).then(res => {
                    for (let list in res.data.data) {
                        for (let item of res.data.data[list]) {
                            if (item.status === 1) {
                                if (XXX.indexOf(item.gateway) === -1) {
                                    XXX.push(item.gateway);
                                    self.gatewayList.push({
                                        value: item.gateway,
                                        label: item.gatewayname
                                    })
                                }
                            }
                        }
                    }
                });
            }
        },
        test() {
            console.log(1);
        }
    }
</script>

<style scoped>

</style>
