webpackJsonp([38],{"u/3C":function(e,a){},uPLU:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var l=t("BO1k"),n=t.n(l),r={data:function(){return{userName:"",mobile:"",index:0,sum:0,pageSize:30,pageNum:1,checkIn:!1,loading:!1,tableData:[]}},methods:{handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},checkData:function(){var e=this;this.tableData=[],this.checkIn=!0,this.loading=!0;var a=this;this.postRequest("admin/listDeliverFailed",{userName:this.userName,mobile:this.mobile,pageSize:this.pageSize,pageNum:this.pageNum}).then(function(t){a.tableData=[],a.loading=!1,e.index=Number(t.data.data.page.pageNum-1)*Number(t.data.data.page.pageSize)+1,a.sum=t.data.data.page.totalCount;var l=!0,r=!1,i=void 0;try{for(var s,o=n()(t.data.data.dfvList);!(l=(s=o.next()).done);l=!0){var u=s.value;a.tableData.push({index:a.index,code:u.code,repush:u.repush,cnrepushFlag:u.cnrepushFlag,errMsg:u.errMsg,userName:u.userName,mobile:u.mobile,content:u.content,gatewayName:u.gatewayNam,sendTime:u.sendTime,deliverTime:u.deliverTime,cnsource:u.cnsource,id:u.id}),a.index++}}catch(e){r=!0,i=e}finally{try{!l&&o.return&&o.return()}finally{if(r)throw i}}})}},mounted:function(){this.checkData()}},i={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"container"},[t("el-form",{attrs:{inline:"inline","label-width":"120px"},nativeOn:{keyup:function(a){return"button"in a||!e._k(a.keyCode,"enter",13,a.key,"Enter")?e.checkData(a):null}}},[t("el-form-item",{attrs:{label:"用户名："}},[t("el-input",{model:{value:e.userName,callback:function(a){e.userName=a},expression:"userName"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"手机号码"}},[t("el-input",{model:{value:e.mobile,callback:function(a){e.mobile=a},expression:"mobile"}})],1),e._v(" "),t("el-form-item",[t("el-button",{staticClass:"fr",attrs:{type:"primary",plain:""},on:{click:e.checkData}},[e._v("查询")])],1)],1),e._v(" "),e.checkIn?t("el-card",[t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",attrs:{border:"",data:e.tableData,stripe:""}},[t("el-table-column",{attrs:{prop:"index",label:"序号"}}),e._v(" "),t("el-table-column",{attrs:{prop:"userName",label:"用户名"}}),e._v(" "),t("el-table-column",{attrs:{prop:"code",label:"特服号"}}),e._v(" "),t("el-table-column",{attrs:{prop:"mobile",label:"号码"}}),e._v(" "),t("el-table-column",{attrs:{prop:"content",label:"上行内容"}}),e._v(" "),t("el-table-column",{attrs:{prop:"gatewayName",label:"网关名称"}}),e._v(" "),t("el-table-column",{attrs:{prop:"sendTime",label:"上行时间"}}),e._v(" "),t("el-table-column",{attrs:{prop:"deliverTime",label:"推送时间"}}),e._v(" "),t("el-table-column",{attrs:{prop:"repush",label:"推送次数"}}),e._v(" "),t("el-table-column",{attrs:{prop:"cnrepushFlag",label:"是否重推"}}),e._v(" "),t("el-table-column",{attrs:{prop:"errMsg",label:"原因"}}),e._v(" "),t("el-table-column",{attrs:{prop:"cnsource",label:"客户来源"}})],1),e._v(" "),t("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":e.pageNum,"page-size":e.pageSize,total:e.sum,layout:"sizes, prev, pager, next, jumper"},on:{"size-change":e.handleSizeChange,"current-change":e.handlePageChange,"update:currentPage":function(a){e.pageNum=a},"update:pageSize":function(a){e.pageSize=a}}}),e._v(" "),t("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[e._v("共"+e._s(e.sum)+"条，")])],1):e._e()],1)},staticRenderFns:[]};var s=t("VU/8")(r,i,!1,function(e){t("u/3C")},"data-v-772d78b1",null);a.default=s.exports}});