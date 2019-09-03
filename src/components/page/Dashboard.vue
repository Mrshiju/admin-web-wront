<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-row :gutter="20" class="mgb20">
                    <!--<el-col :span="6">-->
                    <!--<el-card shadow="hover" :body-style="{padding: '0px'}">-->
                    <!--<div class="grid-content grid-con-1">-->
                    <!--<i class="el-icon-lx-people grid-con-icon"></i>-->
                    <!--<div class="grid-cont-right">-->
                    <!--<div class="grid-num">{{count1}}</div>-->
                    <!--<div>代理商总数</div>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</el-card>-->
                    <!--</el-col>-->
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{count2}}</div>
                                    <div>终端客户总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <!--<el-col :span="6">-->
                    <!--<el-card shadow="hover" :body-style="{padding: '0px'}">-->
                    <!--<div class="grid-content grid-con-3">-->
                    <!--<i class="el-icon-lx-goods grid-con-icon"></i>-->
                    <!--<div class="grid-cont-right">-->
                    <!--<div class="grid-num">{{count3}}</div>-->
                    <!--<div>直销客户总数</div>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</el-card>-->
                    <!--</el-col>-->
                    <el-col :span="12">
                        <el-card shadow="hover" :body-style="{padding:'0px'}">
                            <div class="grid-content grid-con-4">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{count4}}</div>
                                    <div>通道总数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card>
                    <div class="content-title">短信通道占比</div>
                    <schart ref="ring" class="schart" canvasId="ring" :data="data1" type="ring"
                    ></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <div class="content-title">网关发送量统计分布</div>
                    <div id="bar" style="width: 100%; height: 300px"></div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="hover">
                    <div class="content-title">短信请求走势图</div>
                    <schart ref="line" class="schart" canvasId="line" :data="data3" type="line"
                    ></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import bus from '../common/bus';

    export default {
        name: 'dashboard',
        data() {
            return {
                // count1: 'loading',
                count2: 'loading',
                // count3: 'loading',
                count4: 'loading',
                data1: [],
                data2: [],
                data4:[],
                // option2: {},
                data3: [],
            }
        }
        ,
        components: {
            Schart
        }
        ,
        beforeCreate() {
            let self = this;
            this.postRequest('admin/main', {
                token: ''
            }).then(res => {
                if(res.data.success) {
                    if(res.data.data){
                        self.count2 = res.data.data.custCount;
                        self.count4 = res.data.data.pipeCount;
                        for (let item of res.data.data.pipeRate) {
                            self.data1.push({
                                name: item.typeName,
                                value: parseInt(item.count)
                            })
                        }
                        for (let item of res.data.data.gatewaySubmitDay) {
                            self.data2.push(item.gatewayName);
                            self.data4.push(item.submitSum);
                        }
                        // console.log(self.data2);
                        for (let item of res.data.data.custSubmitMonth) {
                            this.data3.push({
                                name: item.statDay,
                                value: item.custSubm
                            })
                        }
                        let myChart = this.echarts.init(document.getElementById('bar'));

                        // 指定图表的配置项和数据
                        let option = {
                            title: {},
                            tooltip: {},
                            // legend: {},
                            xAxis: {
                                data: this.data2
                            },
                            yAxis: {},
                            series: [{
                                name: '发送数',
                                type: 'bar',
                                data: this.data4
                            }]
                        };

                        // 使用刚指定的配置项和数据显示图表。
                        myChart.setOption(option);
                    }else{
                        return null  //如何提醒没有请求道数据？？？
                    }
                }

            })
            // this.$axios({
            //     method:'post',
            //     url:'http://192.168.1.245:8010/admin/main',
            //     headers: {
            //         token: sessionStorage.ms_token
            //     },
            //     data:{
            //         token: ''
            //     }
            // }).then(res=>{
            //     console.log(res)
            // })
        }
        ,
        created() {
            this.handleListener();
        }
        ,
        activated() {
            this.handleListener();
        }
        ,
        deactivated() {
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        }
        ,
        methods: {
            handleListener() {
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            }
            ,
            handleBus(msg) {
                    this.renderChart()
            }
            ,
            renderChart() {
                setTimeout(() => {
                    this.$refs.ring.renderChart();
                    this.$refs.line.renderChart();
                }, 300);

                // this.data.chartData=[];
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .grid-con-4 .grid-con-icon {
        background-color: mediumpurple;
    }

    .grid-con-4 .grid-num {
        color: mediumpurple;
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

</style>
