webpackJsonp([48],{"5Mhb":function(e,t){},YdtC:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=a("BO1k"),n=a.n(l),i=(a("jBVs"),a("uXZL"),{name:"admin_tjsblb",data:function(){return{sum:0,pageNum:1,PageSize:30,checkIn:!0,loading:!1,tableData:[],fmmdd:new Date,tmmdd:new Date,mobile:"",content:"",gateway:"",userName:"",cid:"",chooseGateway:"",gatewayList:[],multipleSelection:""}},methods:{handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},checkData:function(){this.tableData=[],this.checkIn=!0,this.loading=!0;var e=this;this.gatewayList=[];var t=[];this.postRequest("admin/getGatewayList",{t:""}).then(function(a){for(var l in e.gatewayList=[],a.data.data){var i=!0,r=!1,o=void 0;try{for(var c,s=n()(a.data.data[l]);!(i=(c=s.next()).done);i=!0){var m=c.value;1===m.status&&-1===t.indexOf(m.gateway)&&(t.push(m.gateway),e.gatewayList.push({value:m.gateway,label:m.gatewayname}))}}catch(e){r=!0,o=e}finally{try{!i&&s.return&&s.return()}finally{if(r)throw o}}}}),e.postRequest("admin/listSubmitFailed",{fmmdd:e.formatDate(e.fmmdd),tmmdd:e.formatDate(e.tmmdd),pageNum:e.pageNum,pageSize:e.pageSize,mobile:e.mobile,content:e.content,gateway:e.gateway,userName:e.userName,cid:e.cid}).then(function(t){e.tableData=[],e.sum=t.data.data.page.totalCount,e.loading=!1;var a=!0,l=!1,i=void 0;try{for(var r,o=n()(t.data.data.data);!(a=(r=o.next()).done);a=!0){var c=r.value;e.tableData.push({userName:c.userName,code:c.code,cid:c.cid,content:c.content,mobile:c.mobile,gateway:c.gateway,operaName:c.operaName,errcode:c.errcode,err:c.err,createtime:c.createtime})}}catch(e){l=!0,i=e}finally{try{!a&&o.return&&o.return()}finally{if(l)throw i}}})},resend:function(){var e=this;this.postRequest("admin/submitFailedRetry",{ids:this.multipleSelection,gateway:this.chooseGateway}).then(function(t){!0===t.data.success?e.$message.success(t.data.data):e.$message.error(t.data.resultMsg)})},handleSelectionChange:function(e){this.multipleSelection="";var t=!0,a=!1,l=void 0;try{for(var i,r=n()(e);!(t=(i=r.next()).done);t=!0){var o=i.value;this.multipleSelection=this.multipleSelection.concat(o.cid,"_",o.mobile,",")}}catch(e){a=!0,l=e}finally{try{!t&&r.return&&r.return()}finally{if(a)throw l}}this.multipleSelection=this.multipleSelection.substr(0,this.multipleSelection.length-1)}}}),r={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("el-form",{attrs:{"label-width":"100px",inline:"inline",size:"mini"},on:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.chechData(t):null}}},[a("el-form-item",{attrs:{label:"任务编号："}},[a("el-input",{model:{value:e.cid,callback:function(t){e.cid=t},expression:"cid"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"用户名："}},[a("el-input",{model:{value:e.userName,callback:function(t){e.userName=t},expression:"userName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"号码："}},[a("el-input",{model:{value:e.mobile,callback:function(t){e.mobile=t},expression:"mobile"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"短信内容："}},[a("el-input",{model:{value:e.content,callback:function(t){e.content=t},expression:"content"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"网关编号："}},[a("el-input",{model:{value:e.gateway,callback:function(t){e.gateway=t},expression:"gateway"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"开始时间："}},[a("el-date-picker",{attrs:{type:"date"},model:{value:e.fmmdd,callback:function(t){e.fmmdd=t},expression:"fmmdd"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"结束时间："}},[a("el-date-picker",{attrs:{type:"date"},model:{value:e.tmmdd,callback:function(t){e.tmmdd=t},expression:"tmmdd"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary",plain:""},on:{click:e.checkData}},[e._v("查询")])],1)],1),e._v(" "),e.checkIn?a("el-card",[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",attrs:{border:"",data:e.tableData,stripe:""},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection"}}),e._v(" "),a("el-table-column",{attrs:{label:"用户名",prop:"userName"}}),e._v(" "),a("el-table-column",{attrs:{prop:"code",label:"特服号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"cid",label:"任务编号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"content",label:"短信内容"}}),e._v(" "),a("el-table-column",{attrs:{prop:"mobile",label:"号码"}}),e._v(" "),a("el-table-column",{attrs:{prop:"gateway",label:"网关编号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"operaName",label:"运营商"}}),e._v(" "),a("el-table-column",{attrs:{prop:"errcode",label:"错误码"}}),e._v(" "),a("el-table-column",{attrs:{prop:"err",label:"错误信息"}}),e._v(" "),a("el-table-column",{attrs:{prop:"createtime",label:"提交时间"}})],1),e._v(" "),a("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":e.pageNum,"page-size":e.PageSize,layout:"sizes, prev, pager, next, jumper",total:e.sum},on:{"size-change":e.handleSizeChange,"current-change":e.handlePageChange,"update:currentPage":function(t){e.pageNum=t},"update:pageSize":function(t){e.PageSize=t}}}),e._v(" "),a("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[e._v("共"+e._s(e.sum)+"条，")])],1):e._e()],1)},staticRenderFns:[]};var o=a("VU/8")(i,r,!1,function(e){a("5Mhb")},"data-v-6642e39f",null);t.default=o.exports}});