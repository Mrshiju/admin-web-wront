webpackJsonp([88],{HQJw:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var l=t("BO1k"),i=t.n(l),n={name:"A",data:function(){return{sum:0,index:0,totalPage:0,pageSize:30,pageNum:1,checkIn:!0,loading:!1,tableData:[],mobile:"",userName:"",gateway:"",addData:{visible:!1,level:1,type:0,gateway:"",mobile:"",userName:"",note:""},rule1:{mobile:{required:!0,message:"请输入黑号",trigger:"blur"},gateway:{required:!0,message:"请输入黑号所属网关编号",trigger:"blur"},userName:{required:!0,message:"请输入用户名",trigger:"blur"}},typeOpt:[{label:"系统级",value:0},{label:"客户级",value:1},{label:"网关级",value:2}],levelOpt:[{label:"一级",value:1},{label:"二级",value:2},{label:"三级",value:3}]}},methods:{handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},indexs:function(e){return e+1},checkData:function(){var e=this;this.tableData=[],this.checkIn=!0,this.loading=!0;var a=this;this.postRequest("admin/listSensitiveMobile",{mobile:this.mobile,userName:this.userName,gateway:this.gateway,pageNum:this.pageNum,pageSize:this.pageSize}).then(function(t){a.tableData=[],a.loading=!1,e.index=Number(t.data.data.page.pageNum-1)*Number(t.data.data.page.pageSize)+1,a.sum=t.data.data.page.totalCount;var l=!0,n=!1,r=void 0;try{for(var s,o=i()(t.data.data.data);!(l=(s=o.next()).done);l=!0){var u=s.value;a.tableData.push({index:a.index,id:u.id,mobile:u.mobile,blackLevel:u.blackLevel,userName:u.userName,blacktype:u.blacktype,gateway:u.gateway,remark:u.remark,createtime:u.createtime,status:u.status}),a.index++}}catch(e){n=!0,r=e}finally{try{!l&&o.return&&o.return()}finally{if(n)throw r}}})},add:function(){this.addData.visible=!0},submitAdd:function(e){var a=this;this.$refs[e].validate(function(e){if(!e)return!1;var t=a;a.postRequest("admin/saveAddSensitiveMobile",a.addData).then(function(e){t.resAlert(e.data),t.checkData(),t.addData={visible:!1,level:-1,type:0,gateway:"",mobile:"",userName:"",note:""}})})},del:function(e){var a=this,t=this;this.$confirm("确认删除【"+e.mobile+"】?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){a.postRequest("admin/updateSensitiveMobileStatus",{id:e.id,status:0}).then(function(e){t.resAlert(e.data),t.checkData()})}).catch(function(){})}}},r={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"container"},[t("el-form",{attrs:{inline:"inline","label-width":"120px"},nativeOn:{keyup:function(a){return"button"in a||!e._k(a.keyCode,"enter",13,a.key,"Enter")?e.checkData(a):null}}},[t("el-form-item",{attrs:{label:"黑号："}},[t("el-input",{model:{value:e.mobile,callback:function(a){e.mobile=a},expression:"mobile"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"所属网关："}},[t("el-input",{model:{value:e.gateway,callback:function(a){e.gateway=a},expression:"gateway"}})],1),e._v(" "),t("el-form-item",[t("el-button",{staticClass:"fr",attrs:{type:"primary",plain:""},on:{click:e.checkData}},[e._v("查询")])],1)],1),e._v(" "),e.checkIn?t("el-card",[t("el-button",{attrs:{type:"text"},on:{click:e.add}},[e._v("+添加黑号")]),e._v(" "),t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",attrs:{border:"",data:e.tableData,stripe:""}},[t("el-table-column",{attrs:{label:"序号",width:"50px",prop:"index",indexs:e.index}}),e._v(" "),t("el-table-column",{attrs:{width:"50px",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(a){return[t("el-button",{attrs:{type:"text"},on:{click:function(t){e.del(a.row)}}},[e._v("删除")])]}}])}),e._v(" "),t("el-table-column",{attrs:{label:"号码",prop:"mobile"}}),e._v(" "),t("el-table-column",{attrs:{label:"级别（系统级）"},scopedSlots:e._u([{key:"default",fn:function(a){return[e._v(e._s(1===a.row.blackLevel?"一级":2===a.row.blackLevel?"二级":"三级"))]}}])}),e._v(" "),t("el-table-column",{attrs:{label:"用户名",prop:"userName"}}),e._v(" "),t("el-table-column",{attrs:{label:"黑名单类型"},scopedSlots:e._u([{key:"default",fn:function(a){return[e._v(e._s(-1===a.row.blacktype?"系统级":1===a.row.blacktype?"客户级":"网关级"))]}}])}),e._v(" "),t("el-table-column",{attrs:{label:"所属网关",prop:"gateway"}}),e._v(" "),t("el-table-column",{attrs:{label:"备注",prop:"remark"}}),e._v(" "),t("el-table-column",{attrs:{label:"创建时间",prop:"createtime"}}),e._v(" "),t("el-table-column",{attrs:{label:"状态"},scopedSlots:e._u([{key:"default",fn:function(a){return[e._v(e._s(1===a.row.status?"正常":"禁用"))]}}])})],1),e._v(" "),t("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":e.pageNum,"page-size":e.pageSize,layout:"sizes, prev, pager, next, jumper",total:e.sum},on:{"size-change":e.handleSizeChange,"current-change":e.handlePageChange,"update:currentPage":function(a){e.pageNum=a},"update:pageSize":function(a){e.pageSize=a}}}),e._v(" "),t("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[e._v("共"+e._s(e.sum)+"条，")]),e._v(" "),t("el-dialog",{attrs:{title:"添加黑号",visible:e.addData.visible,width:"500px"},on:{"update:visible":function(a){e.$set(e.addData,"visible",a)}}},[t("el-form",{ref:"addData",staticStyle:{width:"400px"},attrs:{model:e.addData,rules:e.rule1,"label-width":"120px"}},[t("el-form-item",{attrs:{label:"黑号：",prop:"mobile"}},[t("el-input",{attrs:{type:"textarea"},model:{value:e.addData.mobile,callback:function(a){e.$set(e.addData,"mobile",a)},expression:"addData.mobile"}}),e._v(" "),t("div",{staticClass:"el-upload__tip"},[e._v('多个黑词用半角符逗号","分隔')])],1),e._v(" "),t("el-form-item",{attrs:{label:"类型："}},[t("el-select",{model:{value:e.addData.type,callback:function(a){e.$set(e.addData,"type",a)},expression:"addData.type"}},e._l(e.typeOpt,function(e,a){return t("el-option",{key:a,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),t("el-form-item",{attrs:{label:"系统级黑号级别："}},[t("el-select",{model:{value:e.addData.level,callback:function(a){e.$set(e.addData,"level",a)},expression:"addData.level"}},e._l(e.levelOpt,function(e,a){return t("el-option",{key:a,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),t("el-form-item",{attrs:{label:"黑名单所属网关编号：",prop:"gateway"}},[t("el-input",{attrs:{type:"textarea",placeholder:"网关级必填，其他请填0"},model:{value:e.addData.gateway,callback:function(a){e.$set(e.addData,"gateway",a)},expression:"addData.gateway"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"用户名：",prop:"userName"}},[t("el-input",{attrs:{type:"textarea",placeholder:"系统级和网关级为：SYS"},model:{value:e.addData.userName,callback:function(a){e.$set(e.addData,"userName",a)},expression:"addData.userName"}})],1),e._v(" "),t("el-form-item",{attrs:{label:"备注："}},[t("el-input",{attrs:{type:"textarea"},model:{value:e.addData.note,callback:function(a){e.$set(e.addData,"note",a)},expression:"addData.note"}})],1)],1),e._v(" "),t("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{on:{click:function(a){e.addData.visible=!1}}},[e._v("取 消")]),e._v(" "),t("el-button",{attrs:{type:"primary"},on:{click:function(a){e.submitAdd("addData")}}},[e._v("保存")])],1)],1)],1):e._e()],1)},staticRenderFns:[]};var s=t("VU/8")(n,r,!1,function(e){t("Hg/F")},"data-v-1fa7919f",null);a.default=s.exports},"Hg/F":function(e,a){}});