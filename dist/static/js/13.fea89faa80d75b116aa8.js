webpackJsonp([13],{"3LVj":function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var l=t("BO1k"),i=t.n(l),n={data:function(){return{cid:"",userName:"",mobile:"",gateway:"",fmmdd:new Date,index:0,pageNum:1,pageSize:30,sum:0,tableData:[],checkIn:!1,loading:!1}},methods:{handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},checkData:function(){var e=this;this.tableData=[],this.checkIn=!0,this.loading=!0;var a=this;this.postRequest("admin/listReportdefined",{cid:this.cid,userName:this.userName,mobile:this.mobile,gateway:this.gateway,fmmdd:this.formatDate(this.fmmdd),pageNum:this.pageNum,pageSize:this.pageSize}).then(function(t){a.tableData=[],a.loading=!1,e.index=Number(t.data.data.page.pageNum-1)*Number(t.data.data.page.pageSize)+1,a.sum=t.data.data.page.totalCount;var l=!0,n=!1,r=void 0;try{for(var o,s=i()(t.data.data.rdlList);!(l=(o=s.next()).done);l=!0){var c=o.value;a.tableData.push({index:a.index,id:c.id,cid:c.cid,code:c.code,mobile:c.mobile,userName:c.userName,operaid:c.operaid,gateway:c.gateway,sostatus:c.sostatus,mostatus:c.mostatus,count:c.count,receivetime:c.receivetime}),a.index++}}catch(e){n=!0,r=e}finally{try{!l&&s.return&&s.return()}finally{if(n)throw r}}})}},mounted:function(){this.checkData()}},r={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"container"},[t("el-form",{attrs:{"label-width":"120px",inline:"inline"},nativeOn:{keyup:function(a){return"button"in a||!e._k(a.keyCode,"enter",13,a.key,"Enter")?e.checkData(a):null}}},[t("el-form-item",{attrs:{label:"任务编号："}},[t("el-input",{model:{value:e.cid,callback:function(a){e.cid=a},expression:"cid"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"用户名："}},[t("el-input",{model:{value:e.userName,callback:function(a){e.userName=a},expression:"userName"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"号码："}},[t("el-input",{model:{value:e.mobile,callback:function(a){e.mobile=a},expression:"mobile"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"网关编号："}},[t("el-input",{model:{value:e.gateway,callback:function(a){e.gateway=a},expression:"gateway"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"时间："}},[t("el-date-picker",{attrs:{type:"date"},model:{value:e.fmmdd,callback:function(a){e.fmmdd=a},expression:"fmmdd"}})],1),e._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary",plain:""},on:{click:e.checkData}},[e._v("查询")])],1)],1),e._v(" "),e.checkIn?t("el-card",[t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",attrs:{border:"",data:e.tableData,stripe:""}},[t("el-table-column",{attrs:{label:"序号",prop:"index"}}),e._v(" "),t("el-table-column",{attrs:{prop:"cid",label:"任务编号"}}),e._v(" "),t("el-table-column",{attrs:{prop:"userName",label:"用户名"}}),e._v(" "),t("el-table-column",{attrs:{prop:"code",label:"特服号"}}),e._v(" "),t("el-table-column",{attrs:{prop:"mobile",label:"号码"}}),e._v(" "),t("el-table-column",{attrs:{prop:"operaid",label:"运营商"}}),e._v(" "),t("el-table-column",{attrs:{prop:"gateway",label:"网关编号"}}),e._v(" "),t("el-table-column",{attrs:{prop:"sostatus",label:"原始状态"}}),e._v(" "),t("el-table-column",{attrs:{prop:"mostatus",label:"修改状态"}}),e._v(" "),t("el-table-column",{attrs:{prop:"count",label:"拆分条数"}}),e._v(" "),t("el-table-column",{attrs:{prop:"receivetime",label:"接收时间"}})],1),e._v(" "),t("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":e.pageNum,"page-size":e.pageSize,total:e.sum,layout:"sizes, prev, pager, next, jumper"},on:{"size-change":e.handleSizeChange,"current-change":e.handlePageChange,"update:currentPage":function(a){e.pageNum=a},"update:pageSize":function(a){e.pageSize=a}}}),e._v(" "),t("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[e._v("共"+e._s(e.sum)+"条，")])],1):e._e()],1)},staticRenderFns:[]};var o=t("VU/8")(n,r,!1,function(e){t("FltV")},"data-v-d821b9a2",null);a.default=o.exports},FltV:function(e,a){}});