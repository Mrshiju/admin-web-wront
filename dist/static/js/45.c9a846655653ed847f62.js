webpackJsonp([45],{Ehpd:function(e,a){},as4g:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var n=t("bOdI"),i=t.n(n),l=t("BO1k"),s=t.n(l),r={data:function(){return{userName:"",month:new Date,isFirst:!1,isInit:1,index:0,pageNum:1,pageSize:30,sum:0,tableData:[],checkIn:!0,loading:!1}},methods:{succeed:function(){this.$message({message:"导出成功",type:"success"})},failed:function(){this.$message.error("导出失败")},handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},checkData:function(){var e=this;this.tableData=[],this.checkIn=!0,this.loading=!0;var a=this;this.postRequest("/admin/callCustomerMonthSendList",{userName:this.userName,cid:this.cid,month:this.formatDate(this.month),isFirst:this.isFirst,isInit:this.isInit,pageNum:this.pageNum,pageSize:this.pageSize}).then(function(t){a.tableData=[],a.loading=!1,e.index=Number(t.data.data.page.pageNum-1)*Number(t.data.data.page.pageSize)+1,a.sum=t.data.data.page.totalCount;var n=!0,l=!1,r=void 0;try{for(var u,c=s()(t.data.data.data);!(n=(u=c.next()).done);n=!0){var o,m=u.value;a.tableData.push((o={index:a.index,id:m.id,userName:m.userName,cid:m.cid,callTaskSum:m.callTaskSum,talkTimeSum:m.talkTimeSum,feeTimeSum:m.feeTimeSum},i()(o,"userName",m.userName),i()(o,"statMonth",m.statMonth),i()(o,"created",m.created),i()(o,"updated",m.updated),o)),a.index++}}catch(e){l=!0,r=e}finally{try{!n&&c.return&&c.return()}finally{if(l)throw r}}})},cancel:function(){}}},u={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"container"},[t("el-form",{attrs:{"label-width":"120px",inline:"inline"},nativeOn:{keyup:function(a){return"button"in a||!e._k(a.keyCode,"enter",13,a.key,"Enter")?e.checkData(a):null}}},[t("el-form-item",{attrs:{label:"用户名："}},[t("el-input",{model:{value:e.userName,callback:function(a){e.userName=a},expression:"userName"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"按月份"}},[t("el-date-picker",{attrs:{type:"month",placeholder:"选择月"},model:{value:e.month,callback:function(a){e.month=a},expression:"month"}})],1),e._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary",plain:""},on:{click:e.checkData}},[e._v("查询")])],1)],1),e._v(" "),e.checkIn?t("el-card",[t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",attrs:{border:"",data:e.tableData,stripe:""}},[t("el-table-column",{attrs:{label:"序号",prop:"index"}}),e._v(" "),t("el-table-column",{attrs:{prop:"userName",label:"用户名"}}),e._v(" "),t("el-table-column",{attrs:{prop:"callTaskSum",label:"话单总数"}}),e._v(" "),t("el-table-column",{attrs:{prop:"talkTimeSum",label:"通话时长"}}),e._v(" "),t("el-table-column",{attrs:{prop:"feeTimeSum",label:"计费时长"}}),e._v(" "),t("el-table-column",{attrs:{prop:"statMonth",label:"统计时间"}}),e._v(" "),t("el-table-column",{attrs:{prop:"created",label:"创建时间"}}),e._v(" "),t("el-table-column",{attrs:{prop:"updated",label:"更新时间"}})],1),e._v(" "),t("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":e.pageNum,"page-size":e.pageSize,total:e.sum,layout:"sizes, prev, pager, next, jumper"},on:{"size-change":e.handleSizeChange,"current-change":e.handlePageChange,"update:currentPage":function(a){e.pageNum=a},"update:pageSize":function(a){e.pageSize=a}}}),e._v(" "),t("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[e._v("共"+e._s(e.sum)+"条，")])],1):e._e()],1)},staticRenderFns:[]};var c=t("VU/8")(r,u,!1,function(e){t("Ehpd")},"data-v-6918d9bc",null);a.default=c.exports}});