webpackJsonp([99],{OXag:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("bOdI"),i=a.n(n),l=a("BO1k"),s=a.n(l),c={data:function(){return{code:"",userName:"",id:"",options:[],formLabelWidth:"120px",multipleSelection:[],index:0,pageNum:1,pageSize:30,sum:0,tableData:[],checkIn:!1,loading:!1}},watch:{},methods:{handleSelection:function(e){e.length?(this.multipleSelection=e,this.id=e[0].code):this.multipleSelection=""},succeed:function(e){this.$message({message:e,type:"success"})},failed:function(e){this.$message.error(e)},saveBatchRelate:function(){var e=this;if(0==this.multipleSelection.length)return e.$message.warning("请选择特服号");this.postRequest("/admin/saveBatchRelate",{type:this.userName,name:this.userName,id:this.id}).then(function(t){t.data.success?(e.succeed(t.data.resultMsg),e.checkData()):e.failed(t.data.resultMsg)})},handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},checkData:function(){var e=this;this.multipleSelection="",this.options=[],this.tableData=[],this.checkIn=!0,this.loading=!0;var t=this;this.postRequest("/admin/batchRelate",{code:this.code,pageSize:this.pageSize,pageNum:this.pageNum}).then(function(a){t.tableData=[],t.loading=!1,e.index=Number(a.data.data.page.pageNum*a.data.data.page.pageSize),t.sum=a.data.data.page.totalCount;var n=!0,l=!1,c=void 0;try{for(var r,o=s()(a.data.data.customerList);!(n=(r=o.next()).done);n=!0){var u=r.value;t.options.push({label:u.userName,value:u.accountID,key:u.id})}}catch(e){l=!0,c=e}finally{try{!n&&o.return&&o.return()}finally{if(l)throw c}}var d=!0,p=!1,m=void 0;try{for(var h,g=s()(a.data.data.data);!(d=(h=g.next()).done);d=!0){var f,v=h.value;t.tableData.push((f={index:t.index++,accountID:v.accountID,agentID:v.agentID,agentName:v.agentName,code:v.code,createtime:v.createtime,id:v.id,pcnID:v.pcnID,pcnName:v.pcnName,status:v.status,statusCn:0===v.status?"所有":1===v.status?"可用":"已用",userName:v.userName},i()(f,"userName",v.userName),i()(f,"id",v.id),f))}}catch(e){p=!0,m=e}finally{try{!d&&g.return&&g.return()}finally{if(p)throw m}}t.index++})}},mounted:function(){this.checkData()}},r={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("el-form",{attrs:{"label-width":"120px",inline:"inline"},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.checkData(t):null}}},[a("el-form-item",{attrs:{label:"特服号："}},[a("el-input",{model:{value:e.code,callback:function(t){e.code=t},expression:"code"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary",plain:""},on:{click:e.checkData}},[e._v("查询")])],1),e._v(" "),a("el-form-item",{attrs:{label:"用户名："}},[a("el-select",{attrs:{filterable:""},model:{value:e.userName,callback:function(t){e.userName=t},expression:"userName"}},e._l(e.options,function(e){return a("el-option",{key:e.key,attrs:{label:e.label,value:e.label}})}))],1),e._v(" "),a("el-form-item",{attrs:{label:""}},[a("el-input",{attrs:{disabled:!0},model:{value:e.userName,callback:function(t){e.userName=t},expression:"userName"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary",plain:""},on:{click:e.saveBatchRelate}},[e._v("关联")])],1)],1),e._v(" "),e.checkIn?a("el-card",[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"multipleTable",staticStyle:{width:"100%"},attrs:{border:"",data:e.tableData,stripe:"","tooltip-effect":"dark"},on:{"selection-change":e.handleSelection}},[a("el-table-column",{attrs:{type:"selection",width:"55"}}),e._v(" "),a("el-table-column",{attrs:{prop:"code",label:"特服号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"pcnName",label:"主账号"}}),e._v(" "),a("el-table-column",{attrs:{prop:"agentName",label:"代理商"}}),e._v(" "),a("el-table-column",{attrs:{prop:"createtime",label:"创建时间"}}),e._v(" "),a("el-table-column",{attrs:{prop:"statusCn",label:"状态"}})],1),e._v(" "),a("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":e.pageNum,"page-size":e.pageSize,total:e.sum,layout:"sizes, prev, pager, next, jumper"},on:{"size-change":e.handleSizeChange,"current-change":e.handlePageChange,"update:currentPage":function(t){e.pageNum=t},"update:pageSize":function(t){e.pageSize=t}}}),e._v(" "),a("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[e._v("共"+e._s(e.sum)+"条，")])],1):e._e()],1)},staticRenderFns:[]};var o=a("VU/8")(c,r,!1,function(e){a("aOUV")},"data-v-156b80d4",null);t.default=o.exports},aOUV:function(e,t){}});