webpackJsonp([105],{apv8:function(e,a){},"jO2/":function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=t("BO1k"),l=t.n(r),n={data:function(){return{updateRemarkForm:{userName:"",remark:""},updateRemarkFlage:!1,userName:"",category:"",fmmddhms:"",tmmddhms:"",id:"",options:[{key:0,label:"所有",value:""},{key:1,label:"代理商到代理商",value:"aTa"},{key:2,label:"代理商到客户",value:"aTc"},{key:3,label:"代理商到系统",value:"aTs"},{key:4,label:"客户到代理商",value:"cTa"},{key:5,label:"客户到客户",value:"cTc"},{key:6,label:"客户到系统",value:"cTs"},{key:7,label:"系统到客户",value:"sTc"}],index:0,pageNum:1,pageSize:30,sum:0,tableData:[],checkIn:!1,loading:!1}},methods:{succeed:function(e){this.$message({message:e,type:"success"})},failed:function(e){this.$message.error(e)},exportRecord:function(){var e=this;this.postRequest("/admin/exportTransferRecord",{userName:this.userName,category:this.category,fmmddhms:this.formatDate(this.fmmddhms),tmmddhms:this.formatDate(this.tmmddhms)}).then(function(a){a.data.success?e.succeed(a.data.data):e.failed("导出失败")})},handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},checkData:function(){var e=this;this.tableData=[],this.checkIn=!0,this.loading=!0;var a=this;this.postRequest("/admin/listTransferRecord",{userName:this.userName,category:this.category,fmmddhms:this.formatDate(this.fmmddhms),tmmddhms:this.formatDate(this.tmmddhms),pageSize:this.pageSize,pageNum:this.pageNum}).then(function(t){a.tableData=[],a.loading=!1,e.index=Number(t.data.data.page.pageNum-1)*Number(t.data.data.page.pageSize)+1,a.sum=t.data.data.page.totalCount;var r=!0,n=!1,s=void 0;try{for(var o,c=l()(t.data.data.data);!(r=(o=c.next()).done);r=!0){var i=o.value;a.tableData.push({index:a.index,amount:i.amount?i.amount/1e4:0,category:i.category,categoryCn:i.categoryCn,created:i.created,creatorAccountID:i.creatorAccountID,creatorUserName:i.creatorUserName,fromAccountID:i.fromAccountID,fromUserName:i.fromUserName,note:i.note,toAccountID:i.toAccountID,toUserName:i.toUserName,id:i.id}),a.index++}}catch(e){n=!0,s=e}finally{try{!r&&c.return&&c.return()}finally{if(n)throw s}}})}},mounted:function(){this.checkData()}},s={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"container"},[t("el-form",{attrs:{"label-width":"120px",inline:"inline"},nativeOn:{keyup:function(a){return"button"in a||!e._k(a.keyCode,"enter",13,a.key,"Enter")?e.checkData(a):null}}},[t("el-form-item",{attrs:{label:"账号(从/到)："}},[t("el-input",{model:{value:e.userName,callback:function(a){e.userName=a},expression:"userName"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"转账类型："}},[t("el-select",{model:{value:e.category,callback:function(a){e.category=a},expression:"category"}},e._l(e.options,function(e){return t("el-option",{key:e.key,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),t("el-form-item",{attrs:{label:"开始时间："}},[t("el-date-picker",{attrs:{type:"date",placeholder:"选择日期"},model:{value:e.fmmddhms,callback:function(a){e.fmmddhms=a},expression:"fmmddhms"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"结束时间："}},[t("el-date-picker",{attrs:{type:"date",placeholder:"选择日期"},model:{value:e.tmmddhms,callback:function(a){e.tmmddhms=a},expression:"tmmddhms"}})],1),e._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary",plain:""},on:{click:e.checkData}},[e._v("查询")])],1)],1),e._v(" "),e.checkIn?t("el-card",[t("el-button",{attrs:{type:"text"},on:{click:e.exportRecord}},[e._v("+导出")]),e._v(" "),t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",attrs:{border:"",data:e.tableData,stripe:""}},[t("el-table-column",{attrs:{label:"序号",prop:"index"}}),e._v(" "),t("el-table-column",{attrs:{prop:"fromUserName",label:"从(账号)"}}),e._v(" "),t("el-table-column",{attrs:{prop:"toUserName",label:"到(账号)"}}),e._v(" "),t("el-table-column",{attrs:{prop:"categoryCn",label:"转账类型"}}),e._v(" "),t("el-table-column",{attrs:{prop:"amount",label:"转账数(元)"}}),e._v(" "),t("el-table-column",{attrs:{prop:"creatorUserName",label:"操作人"}}),e._v(" "),t("el-table-column",{attrs:{prop:"created",label:"转账时间"}}),e._v(" "),t("el-table-column",{attrs:{prop:"note",label:"备注"}})],1),e._v(" "),t("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":e.pageNum,"page-size":e.pageSize,total:e.sum,layout:"sizes, prev, pager, next, jumper"},on:{"size-change":e.handleSizeChange,"current-change":e.handlePageChange,"update:currentPage":function(a){e.pageNum=a},"update:pageSize":function(a){e.pageSize=a}}}),e._v(" "),t("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[e._v("共"+e._s(e.sum)+"条，")])],1):e._e()],1)},staticRenderFns:[]};var o=t("VU/8")(n,s,!1,function(e){t("apv8")},"data-v-079b685f",null);a.default=o.exports}});