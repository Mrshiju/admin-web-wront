webpackJsonp([31],{ITVU:function(t,a){},t7o3:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=e("BO1k"),r=e.n(s),l={data:function(){return{submitSum:0,submitSucSum:0,reportSucSum:0,gateway:"",dayStart:new Date,dayEnd:new Date,month:new Date,isFirst:!1,index:0,pageNum:1,pageSize:30,sum:0,tableData:[],checkIn:!0,loading:!1}},methods:{succeed:function(){this.$message({message:"导出成功",type:"success"})},failed:function(){this.$message.error("导出失败")},exportData:function(){var t=this;this.postRequest("/admin/exportGatewayReportDayReport",{gateway:this.gateway,dayStart:this.formatDate(this.dayStart),dayEnd:this.formatDate(this.dayEnd),month:this.formatDate(this.month),isFirst:this.isFirst,pageNum:this.pageNum,pageSize:this.pageSize}).then(function(a){a.data.success?t.succeed():t.failed()})},handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},checkData:function(){var t=this;this.tableData=[],this.checkIn=!0,this.loading=!0;var a=this;this.postRequest("/admin/listGatewayReportDayReport",{gateway:this.gateway,dayStart:this.formatDate(this.dayStart),dayEnd:this.formatDate(this.dayEnd),month:this.formatDate(this.month),isFirst:this.isFirst,pageNum:this.pageNum,pageSize:this.pageSize}).then(function(e){a.tableData=[],a.loading=!1,t.index=Number(e.data.data.page.pageNum-1)*Number(e.data.data.page.pageSize)+1,a.sum=e.data.data.page.totalCount,a.submitSum=e.data.data.commonSum.submitSum,a.submitSucSum=e.data.data.commonSum.submitSucSum,a.reportSucSum=e.data.data.commonSum.reportSucSum;var s=!0,l=!1,n=void 0;try{for(var i,o=r()(e.data.data.data);!(s=(i=o.next()).done);s=!0){var u=i.value;a.tableData.push({index:a.index,id:u.id,gateway:u.gateway,gatewayName:u.gatewayName,submitSum:u.submitSum,submitSuccess:u.submitSuccess,submitFailed:u.submitFailed,submitSuccessRate:u.submitSuccessRate?(100*u.submitSuccessRate).toFixed(4)+"%":0,reportSum:u.reportSum,reportSuccess:u.reportSuccess,reportFailed:u.reportFailed,reportUnknow:u.submitSuccess-u.reportSum,reportSuccessRate:u.reportSuccessRate?(100*u.reportSuccessRate).toFixed(4)+"%":0,reportReturnRate:u.reportReturnRate?(100*u.reportReturnRate).toFixed(4)+"%":0,statDay:u.statDay,created:u.created,updated:u.updated}),a.index++}}catch(t){l=!0,n=t}finally{try{!s&&o.return&&o.return()}finally{if(l)throw n}}})},cancel:function(){}}},n={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"container"},[e("el-form",{attrs:{"label-width":"120px",inline:"inline"},nativeOn:{keyup:function(a){return"button"in a||!t._k(a.keyCode,"enter",13,a.key,"Enter")?t.checkData(a):null}}},[e("el-form-item",{attrs:{label:"通道编号"}},[e("el-input",{model:{value:t.gateway,callback:function(a){t.gateway=a},expression:"gateway"}})],1),t._v(" "),e("el-form-item",{attrs:{label:"起始日"}},[e("el-date-picker",{attrs:{type:"date",placeholder:"选择日期"},model:{value:t.dayStart,callback:function(a){t.dayStart=a},expression:"dayStart"}})],1),t._v(" "),e("el-form-item",{attrs:{label:"截止日"}},[e("el-date-picker",{attrs:{type:"date",placeholder:"选择日期"},model:{value:t.dayEnd,callback:function(a){t.dayEnd=a},expression:"dayEnd"}})],1),t._v(" "),e("el-form-item",{attrs:{label:"按月"}},[e("el-date-picker",{attrs:{type:"month",placeholder:"选择月"},model:{value:t.month,callback:function(a){t.month=a},expression:"month"}})],1),t._v(" "),e("el-form-item",[e("el-button",{attrs:{type:"primary",plain:""},on:{click:t.checkData}},[t._v("查询")])],1)],1),t._v(" "),t.checkIn?e("el-card",[e("el-button",{attrs:{type:"text"},on:{click:t.exportData}},[t._v("+导出")]),t._v(" "),e("div",{staticClass:"dataWrap"},[e("span",{staticClass:"count"},[t._v("\n        网关提交数：\n        "),e("span",{staticClass:"data"},[t._v(t._s(t.submitSum))])]),t._v(" "),e("span",{staticClass:"count"},[t._v("\n        提交成功数：\n        "),e("span",{staticClass:"data"},[t._v(t._s(t.submitSucSum))])]),t._v(" "),e("span",{staticClass:"count"},[t._v("\n        报告成功数：\n        "),e("span",{staticClass:"data"},[t._v(t._s(t.reportSucSum))])])]),t._v(" "),e("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"table",attrs:{border:"",data:t.tableData,stripe:""}},[e("el-table-column",{attrs:{label:"序号",prop:"index"}}),t._v(" "),e("el-table-column",{attrs:{prop:"gateway",label:"通道编号"}}),t._v(" "),e("el-table-column",{attrs:{prop:"gatewayName",label:"通道名称"}}),t._v(" "),e("el-table-column",{attrs:{prop:"submitSum",label:"网关提交数"}}),t._v(" "),e("el-table-column",{attrs:{prop:"submitSuccess",label:"提交成功数"}}),t._v(" "),e("el-table-column",{attrs:{prop:"submitFailed",label:"提交失败数"}}),t._v(" "),e("el-table-column",{attrs:{prop:"submitSuccessRate",label:"提交成功率"}}),t._v(" "),e("el-table-column",{attrs:{prop:"reportSum",label:"网关报告数"}}),t._v(" "),e("el-table-column",{attrs:{prop:"reportSuccess",label:"报告成功"}}),t._v(" "),e("el-table-column",{attrs:{prop:"reportFailed",label:"报告失败"}}),t._v(" "),e("el-table-column",{attrs:{prop:"reportUnknow",label:"报告未知"}}),t._v(" "),e("el-table-column",{attrs:{prop:"reportSuccessRate",label:"报告成功率"}}),t._v(" "),e("el-table-column",{attrs:{prop:"reportReturnRate",label:"报告返回率"}}),t._v(" "),e("el-table-column",{attrs:{prop:"statDay",label:"统计时间"}}),t._v(" "),e("el-table-column",{attrs:{prop:"created",label:"创建时间"}}),t._v(" "),e("el-table-column",{attrs:{prop:"updated",label:"更新时间"}})],1),t._v(" "),e("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":t.pageNum,"page-size":t.pageSize,total:t.sum,layout:"sizes, prev, pager, next, jumper"},on:{"size-change":t.handleSizeChange,"current-change":t.handlePageChange,"update:currentPage":function(a){t.pageNum=a},"update:pageSize":function(a){t.pageSize=a}}}),t._v(" "),e("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[t._v("共"+t._s(t.sum)+"条，")])],1):t._e()],1)},staticRenderFns:[]};var i=e("VU/8")(l,n,!1,function(t){e("ITVU")},"data-v-7b807bf9",null);a.default=i.exports}});