webpackJsonp([47],{AUFe:function(e,a){},vacM:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var l=t("BO1k"),n=t.n(l),i={name:"admin_fxbglb",data:function(){return{cid:"",index:0,content:"",fmmdd:new Date,gateway:"",mobile:"",pageNum:1,pageSize:30,userName:"",checkIn:!0,loading:!1,sum:0,tableData:[],hassend:-1,options:[{value:-1,label:"所有"},{value:0,label:"未发送"},{value:1,label:"已发送"}]}},methods:{handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},checkData:function(){var e=this;this.tableData=[],this.checkIn=!0,this.loading=!0;var a=this;this.postRequest("admin/listWaitSubmit",{cid:this.cid,gateway:this.gateway,fmmdd:this.formatDate(this.fmmdd),hassend:this.hassend,userName:this.userName,pageNum:this.pageNum,pageSize:this.pageSize}).then(function(t){a.tableData=[],a.loading=!1,e.index=Number(t.data.data.page.pageNum-1)*Number(t.data.data.page.pageSize)+1,a.sum=t.data.data.page.totalCount;var l=!0,i=!1,r=void 0;try{for(var s,o=n()(t.data.data.data);!(l=(s=o.next()).done);l=!0){var c=s.value;a.tableData.push({index:a.index,userName:c.userName,serverNum:c.serverNum,cid:c.cid,code:c.code,content:c.content,count:c.count,gateway:c.gateway,operaid:c.operaid,operaidCn:1===c.operaid?"移动":2===c.operaid?"联通":"电信",hassend:c.hassend,hassendCn:0===c.hassend?"未发送":"已发送",createtime:c.createtime}),a.index++}}catch(e){i=!0,r=e}finally{try{!l&&o.return&&o.return()}finally{if(i)throw r}}})}}},r={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"container"},[t("el-form",{attrs:{"label-width":"120px",inline:"inline"},nativeOn:{keyup:function(a){return"button"in a||!e._k(a.keyCode,"enter",13,a.key,"Enter")?e.checkData(a):null}}},[t("el-form-item",{attrs:{label:"任务编号："}},[t("el-input",{model:{value:e.cid,callback:function(a){e.cid=a},expression:"cid"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"网关编号："}},[t("el-input",{model:{value:e.gateway,callback:function(a){e.gateway=a},expression:"gateway"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"用户名："}},[t("el-input",{model:{value:e.userName,callback:function(a){e.userName=a},expression:"userName"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"状态："}},[t("el-select",{model:{value:e.hassend,callback:function(a){e.hassend=a},expression:"hassend"}},e._l(e.options,function(e){return t("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),t("el-form-item",{attrs:{label:"时间："}},[t("el-date-picker",{attrs:{type:"date"},model:{value:e.fmmdd,callback:function(a){e.fmmdd=a},expression:"fmmdd"}})],1),e._v(" "),t("el-form-item",[t("el-button",{attrs:{type:"primary",plain:""},on:{click:e.checkData}},[e._v("查询")])],1)],1),e._v(" "),e.checkIn?t("el-card",[t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",attrs:{border:"",data:e.tableData,stripe:""}},[t("el-table-column",{attrs:{label:"序号",prop:"index"}}),e._v(" "),t("el-table-column",{attrs:{prop:"userName",label:"用户名"}}),e._v(" "),t("el-table-column",{attrs:{prop:"code",label:"特服号"}}),e._v(" "),t("el-table-column",{attrs:{prop:"cid",label:"任务编号"}}),e._v(" "),t("el-table-column",{attrs:{prop:"content",label:"短信内容"}}),e._v(" "),t("el-table-column",{attrs:{prop:"count",label:"号码数"}}),e._v(" "),t("el-table-column",{attrs:{prop:"gateway",label:"网关编号"}}),e._v(" "),t("el-table-column",{attrs:{prop:"operaidCn",label:"运营商"}}),e._v(" "),t("el-table-column",{attrs:{prop:"hassendCn",label:"状态"}}),e._v(" "),t("el-table-column",{attrs:{prop:"createtime",label:"提交时间"}})],1),e._v(" "),t("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":e.pageNum,"page-size":e.pageSize,layout:"sizes, prev, pager, next, jumper",total:e.sum},on:{"size-change":e.handleSizeChange,"current-change":e.handlePageChange,"update:currentPage":function(a){e.pageNum=a},"update:pageSize":function(a){e.pageSize=a}}}),e._v(" "),t("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[e._v("共"+e._s(e.sum)+"条，")])],1):e._e()],1)},staticRenderFns:[]};var s=t("VU/8")(i,r,!1,function(e){t("AUFe")},"data-v-68422b9d",null);a.default=s.exports}});