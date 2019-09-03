webpackJsonp([35],{DamU:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a("BO1k"),d=a.n(o),n={data:function(){return{addCodeForm:{code:""},updateCodeForm:{code:"",sourceCode:""},rules:{code:[{required:!0,message:"不能为空",trigger:"blur"}]},addCodeFormFlag:!1,updateCodeFlage:!1,code:"",userName:"",pcnName:"",agentName:"",status:"",options:[{key:0,label:"所有",value:""},{key:1,label:"可用",value:1},{key:2,label:"已用",value:2}],formLabelWidth:"120px",index:0,pageNum:1,pageSize:30,sum:0,tableData:[],checkIn:!1,loading:!1}},methods:{succeed:function(e){this.$message({message:e,type:"success"})},failed:function(e){this.$message.error(e)},saveAddCode:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;t.addCodeFormFlag=!1;var a=t;t.postRequest("/admin/saveAddCode",{code:t.addCodeForm.code}).then(function(e){e.data.success?(a.succeed(e.data.resultMsg),a.checkData(),a.addCodeForm={}):a.failed(e.data.resultMsg)})})},updateCode:function(e){var t=this;this.updateCodeFlage=!0,this.updateCodeForm={code:e.code,sourceCode:""},this.postRequest("/admin/updateCode",{code:e.code}).then(function(e){t.updateCodeForm.sourceCode=e.data.data.code})},saveupdateCode:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;t.updateCodeFlage=!1;var a=t;t.postRequest("/admin/saveUpdateCode",{targetCode:t.updateCodeForm.code,sourceCode:t.updateCodeForm.sourceCode}).then(function(e){e.data.success?(a.succeed(e.data.resultMsg),a.checkData()):a.failed(e.data.resultMsg)})})},resetForm:function(e){this.updateCodeFlage=!1,this.addCodeForm={},this.addCodeFormFlag=!1},delCode:function(e){var t=this;this.$confirm("确定要删除："+e.code+"?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.postRequest("/admin/deleteCode",{code:e.code}).then(function(e){e.data.success?(t.succeed(e.data.resultMsg),t.checkData()):t.failed(e.data.resultMsg)})})},handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},checkData:function(){var e=this;this.tableData=[],this.checkIn=!0,this.loading=!0;var t=this;this.postRequest("/admin/listCode",{code:this.code,userName:this.userName,pcnName:this.pcnName,agentName:this.agentName,status:this.status,pageSize:this.pageSize,pageNum:this.pageNum}).then(function(a){t.tableData=[],t.loading=!1,e.index=Number(a.data.data.page.pageNum-1)*Number(a.data.data.page.pageSize)+1,t.sum=a.data.data.page.totalCount;var o=!0,n=!1,l=void 0;try{for(var s,r=d()(a.data.data.data);!(o=(s=r.next()).done);o=!0){var i=s.value;t.tableData.push({index:t.index,accountID:i.accountID,agentID:i.agentID,agentName:i.agentName,code:i.code,createtime:i.createtime,pcnID:i.pcnID,pcnName:i.pcnName,status:i.status,statusCn:0===i.status?"所有":1===i.status?"可用":"已用",userName:i.userName,id:i.id}),t.index++}}catch(e){n=!0,l=e}finally{try{!o&&r.return&&r.return()}finally{if(n)throw l}}})}},mounted:function(){this.checkData()}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("el-button",{attrs:{type:"text"},on:{click:function(t){e.addCodeFormFlag=!0}}},[e._v("+添加特服号")]),e._v(" "),a("el-dialog",{attrs:{title:"添加特服号（一行一个，不能有空行）",visible:e.addCodeFormFlag},on:{"update:visible":function(t){e.addCodeFormFlag=t}}},[a("el-form",{ref:"addCodeForm",attrs:{model:e.addCodeForm,rules:e.rules,"label-width":"120px"}},[a("el-form-item",{attrs:{label:"特服号：","label-width":e.formLabelWidth,prop:"code"}},[a("el-input",{attrs:{type:"textarea",autocomplete:"off",resize:"both"},model:{value:e.addCodeForm.code,callback:function(t){e.$set(e.addCodeForm,"code",t)},expression:"addCodeForm.code"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.saveAddCode("addCodeForm")}}},[e._v("保存")]),e._v(" "),a("el-button",{on:{click:function(t){e.resetForm("addCodeForm")}}},[e._v("取消")])],1)],1),e._v(" "),a("el-dialog",{attrs:{title:"修改特服号",visible:e.updateCodeFlage},on:{"update:visible":function(t){e.updateCodeFlage=t}}},[a("el-form",{ref:"updateCodeForm",attrs:{model:e.updateCodeForm,rules:e.rules,"label-width":"120px"}},[a("el-form-item",{attrs:{label:"特服号：",prop:"code"}},[a("el-input",{attrs:{autocomplete:"off"},model:{value:e.updateCodeForm.code,callback:function(t){e.$set(e.updateCodeForm,"code",t)},expression:"updateCodeForm.code"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.saveupdateCode("updateCodeForm")}}},[e._v("保存")]),e._v(" "),a("el-button",{on:{click:function(t){e.resetForm("updateCodeForm")}}},[e._v("取消")])],1)],1),e._v(" "),a("el-form",{attrs:{"label-width":"120px",inline:"inline"},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.checkData(t):null}}},[a("el-form-item",{attrs:{label:"特服号："}},[a("el-input",{model:{value:e.code,callback:function(t){e.code=t},expression:"code"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"用户名："}},[a("el-input",{model:{value:e.userName,callback:function(t){e.userName=t},expression:"userName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"主账号："}},[a("el-input",{model:{value:e.pcnName,callback:function(t){e.pcnName=t},expression:"pcnName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"代理商："}},[a("el-input",{model:{value:e.agentName,callback:function(t){e.agentName=t},expression:"agentName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"状态："}},[a("el-select",{model:{value:e.status,callback:function(t){e.status=t},expression:"status"}},e._l(e.options,function(e){return a("el-option",{key:e.key,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary",plain:""},on:{click:e.checkData}},[e._v("查询")])],1)],1),e._v(" "),e.checkIn?a("el-card",[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",attrs:{border:"",data:e.tableData,stripe:""}},[a("el-table-column",{attrs:{label:"序号",prop:"index"}}),e._v(" "),a("el-table-column",{attrs:{prop:"operation",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text"},on:{click:function(a){e.updateCode(t.row)}}},[e._v("修改")]),e._v(" "),a("el-button",{attrs:{type:"text"},on:{click:function(a){e.delCode(t.row)}}},[e._v("删除")])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"userName",label:"用户名"}}),e._v(" "),a("el-table-column",{attrs:{prop:"code",label:"特服号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"pcnName",label:"主账号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"agentName",label:"代理商"}}),e._v(" "),a("el-table-column",{attrs:{prop:"createtime",label:"创建时间"}}),e._v(" "),a("el-table-column",{attrs:{prop:"statusCn",label:"状态"}})],1),e._v(" "),a("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":e.pageNum,"page-size":e.pageSize,total:e.sum,layout:"sizes, prev, pager, next, jumper"},on:{"size-change":e.handleSizeChange,"current-change":e.handlePageChange,"update:currentPage":function(t){e.pageNum=t},"update:pageSize":function(t){e.pageSize=t}}}),e._v(" "),a("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[e._v("共"+e._s(e.sum)+"条，")])],1):e._e()],1)},staticRenderFns:[]};var s=a("VU/8")(n,l,!1,function(e){a("o8UT")},"data-v-78d43155",null);t.default=s.exports},o8UT:function(e,t){}});