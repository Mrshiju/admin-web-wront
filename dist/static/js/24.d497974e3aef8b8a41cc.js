webpackJsonp([24],{GdSE:function(e,t,l){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=l("BO1k"),o=l.n(a),i=l("Xxa5"),n=l.n(i),r=l("exGp"),s=l.n(r),c=l("bOdI"),u=l.n(c),d={data:function(){var e;return e={dialogVisibleT:!1,treeData:[],listIndex:"",checkedArr:[],defaultProps:{children:"children",label:"label"},clientRoleOptions:[{key:1,label:"web主账号",value:1201},{key:2,label:"web子账号",value:1202},{key:3,label:"接口主账号",value:1203},{key:4,label:"接口子账号",value:1204}],index:0,options:[],options1:[],manageRoleVisible:!1,agentRoleVisible:!1,clientRoleVisible:!1,roleName:"",roleNameCn:"",info:"",role:{roleID:"",roleNameCn:"",roleName:"",info:"",level:""},clientRole:{roleID:"",roleNameCn:"",roleName:"",info:"",level:"5"},rules:{roleID:[{required:!0,message:"不能为空",trigger:"blur"}],level:[{required:!0,message:"不能为空",trigger:"blur"}],roleName:[{required:!0,message:"不能为空",trigger:"blur"}],roleNameCn:[{required:!0,message:"不能为空",trigger:"blur"}],info:[{required:!0,message:"不能为空",trigger:"blur"}]},spreadFlag:!1},u()(e,"index",0),u()(e,"id",""),u()(e,"formLabelWidth","120px"),u()(e,"sum",0),u()(e,"pageSize",30),u()(e,"pageNum",1),u()(e,"checkIn",!1),u()(e,"loading",!1),u()(e,"tableData",[]),e},methods:{setRights:function(){},findAllroles:function(){var e=this;return s()(n.a.mark(function t(){return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}},t,e)}))()},permission:function(e){this.treeDataList=[{label:"菜单列表",menuNameCn:"菜单列表",level:0,seq:0,info:"",children:[]}];this.$router.push({path:"/admin_xtglcdlb",query:{roleName:e.roleName,roleID:e.roleID,title:"分配权限"}})},deleteDate:function(e){var t=this,l=this;this.$confirm("此操作将删除角色："+e.roleName+", 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){l.postRequest("admin/deleteAuthRole",{id:e.id}).then(function(e){e.data.success?(t.succeed(e.data.data),t.checkData()):t.failed(e.data.resultMsg)})}).catch(function(){})},succeed:function(e){this.$message({message:e,type:"success"})},failed:function(e){this.$message.error(e)},addManageAuthRole:function(){this.options=[],this.manageRoleVisible=!0;var e=this;this.postRequest("admin/addManageAuthRole",{}).then(function(t){var l=!0,a=!1,i=void 0;try{for(var n,r=o()(t.data.data.deptList);!(l=(n=r.next()).done);l=!0){var s=n.value;e.options.push({value:s.id,label:s.deptName,key:s.id})}}catch(e){a=!0,i=e}finally{try{!l&&r.return&&r.return()}finally{if(a)throw i}}})},saveAddAuthRole:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;t.manageRoleVisible=!1;var l=t;t.postRequest("admin/saveAddAuthRole",{role:t.role}).then(function(e){e.data.success?(l.succeed("角色添加成功"),l.checkData(),l.role={}):l.failed("角色添加失败或角色已经存在")})})},resetForm:function(e){this.role={},this.clientRole={level:5},this.manageRoleVisible=!1,this.agentRoleVisible=!1,this.clientRoleVisible=!1},addAgentRole:function(){this.agentRoleVisible=!0},addClientRole:function(){this.clientRoleVisible=!0},saveAddClientRole:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;t.clientRoleVisible=!1;var l=t;t.postRequest("admin/saveAddAuthRole",{role:t.clientRole}).then(function(e){e.data.success?(l.succeed("角色添加成功"),l.checkData(),t.clientRole={}):l.failed("角色添加失败")})})},handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},checkData:function(){var e=this;this.tableData=[],this.checkIn=!0,this.loading=!0;var t=this;this.postRequest("admin/listAuthRole",{roleName:this.roleName,pageNum:this.pageNum,pageSize:this.pageSize}).then(function(l){var a="",i=!0,n=!1,r=void 0;try{for(var s,c=o()(l.data.data.roleList);!(i=(s=c.next()).done);i=!0){var u=s.value;u.roleName==l.data.data.roleName&&(a=u.level)}}catch(e){n=!0,r=e}finally{try{!i&&c.return&&c.return()}finally{if(n)throw r}}t.options1=[];for(var d=a+1;d<5;d++)t.options1.push({value:d,label:d});t.tableData=[],t.loading=!1,e.index=Number(l.data.data.page.pageNum-1)*Number(l.data.data.page.pageSize)+1,t.sum=l.data.data.page.totalCount;var p=!0,f=!1,m=void 0;try{for(var v,b=o()(l.data.data.roleList);!(p=(v=b.next()).done);p=!0){var h=v.value;"admin"==sessionStorage.saleName?(t.tableData.push({index:t.index,roleName:h.roleName,roleNameCn:h.roleNameCn,roleID:h.roleID,info:h.info,id:h.id,level:h.level}),t.index++):"admin"!=h.roleName&&(t.tableData.push({index:t.index,roleName:h.roleName,roleNameCn:h.roleNameCn,roleID:h.roleID,info:h.info,id:h.id,level:h.level}),t.index++)}}catch(e){f=!0,m=e}finally{try{!p&&b.return&&b.return()}finally{if(f)throw m}}})}},mounted:function(){this.checkData()}},p={render:function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",{staticClass:"container"},[l("el-button",{attrs:{type:"text"},on:{click:e.addManageAuthRole}},[e._v("+添加系统角色")]),e._v(" "),l("el-button",{attrs:{type:"text"},on:{click:e.addAgentRole}},[e._v("+添加代理商角色")]),e._v(" "),l("el-button",{attrs:{type:"text"},on:{click:e.addClientRole}},[e._v("+添加客户角色")]),e._v(" "),l("el-form",{attrs:{inline:"inline","label-width":"120px"},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.checkData(t):null}}},[l("el-form-item",{attrs:{label:"角色："}},[l("el-input",{model:{value:e.roleName,callback:function(t){e.roleName=t},expression:"roleName"}})],1),e._v(" "),l("el-form-item",[l("el-button",{staticClass:"fr",attrs:{type:"primary",plain:""},on:{click:e.checkData}},[e._v("查询")])],1)],1),e._v(" "),l("el-dialog",{attrs:{title:"添加系统角色",visible:e.manageRoleVisible},on:{"update:visible":function(t){e.manageRoleVisible=t}}},[l("el-form",{ref:"role",attrs:{model:e.role,rules:e.rules,"label-width":"120px"}},[l("el-form-item",{attrs:{label:"角色ID：",prop:"roleID"}},[l("el-select",{model:{value:e.role.roleID,callback:function(t){e.$set(e.role,"roleID",t)},expression:"role.roleID"}},e._l(e.options,function(e){return l("el-option",{key:e.key,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),l("el-form-item",{attrs:{label:"角色级别：",prop:"level"}},[l("el-select",{model:{value:e.role.level,callback:function(t){e.$set(e.role,"level",t)},expression:"role.level"}},e._l(e.options1,function(e){return l("el-option",{key:e.key,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),l("el-form-item",{attrs:{label:"角色简称：","label-width":e.formLabelWidth,prop:"roleName"}},[l("el-input",{attrs:{autocomplete:"off"},model:{value:e.role.roleName,callback:function(t){e.$set(e.role,"roleName",t)},expression:"role.roleName"}})],1),e._v(" "),l("el-form-item",{attrs:{label:"角色名称：","label-width":e.formLabelWidth,prop:"roleNameCn"}},[l("el-input",{attrs:{autocomplete:"off",placeholder:"如：客服账号"},model:{value:e.role.roleNameCn,callback:function(t){e.$set(e.role,"roleNameCn",t)},expression:"role.roleNameCn"}})],1),e._v(" "),l("el-form-item",{attrs:{label:"备注：","label-width":e.formLabelWidth,prop:"info"}},[l("el-input",{attrs:{type:"textarea",rows:2,placeholder:"如：级别为3的客服"},model:{value:e.role.info,callback:function(t){e.$set(e.role,"info",t)},expression:"role.info"}})],1)],1),e._v(" "),l("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[l("el-button",{attrs:{type:"primary"},on:{click:function(t){e.saveAddAuthRole("role")}}},[e._v("添加")]),e._v(" "),l("el-button",{on:{click:function(t){e.resetForm("role")}}},[e._v("取消")])],1)],1),e._v(" "),l("el-dialog",{attrs:{title:"添加客户角色",visible:e.clientRoleVisible},on:{"update:visible":function(t){e.clientRoleVisible=t}}},[l("el-form",{ref:"clientRole",attrs:{model:e.clientRole,rules:e.rules,"label-width":"120px"}},[l("el-form-item",{attrs:{label:"角色ID：",prop:"roleID"}},[l("el-select",{model:{value:e.clientRole.roleID,callback:function(t){e.$set(e.clientRole,"roleID",t)},expression:"clientRole.roleID"}},e._l(e.clientRoleOptions,function(e){return l("el-option",{key:e.key,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),l("el-form-item",{attrs:{label:"角色级别：","label-width":e.formLabelWidth,prop:"level"}},[l("el-input",{attrs:{autocomplete:"off",disabled:!0},model:{value:e.clientRole.level,callback:function(t){e.$set(e.clientRole,"level",t)},expression:"clientRole.level"}})],1),e._v(" "),l("el-form-item",{attrs:{label:"角色简称：","label-width":e.formLabelWidth,prop:"roleName"}},[l("el-input",{attrs:{autocomplete:"off"},model:{value:e.clientRole.roleName,callback:function(t){e.$set(e.clientRole,"roleName",t)},expression:"clientRole.roleName"}})],1),e._v(" "),l("el-form-item",{attrs:{label:"角色名称：","label-width":e.formLabelWidth,prop:"roleNameCn"}},[l("el-input",{attrs:{autocomplete:"off"},model:{value:e.clientRole.roleNameCn,callback:function(t){e.$set(e.clientRole,"roleNameCn",t)},expression:"clientRole.roleNameCn"}})],1),e._v(" "),l("el-form-item",{attrs:{label:"备注：","label-width":e.formLabelWidth,prop:"info"}},[l("el-input",{attrs:{type:"textarea",rows:2,placeholder:"请输入内容"},model:{value:e.clientRole.info,callback:function(t){e.$set(e.clientRole,"info",t)},expression:"clientRole.info"}})],1)],1),e._v(" "),l("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[l("el-button",{attrs:{type:"primary"},on:{click:function(t){e.saveAddClientRole("clientRole")}}},[e._v("添加")]),e._v(" "),l("el-button",{on:{click:function(t){e.resetForm("clientRole")}}},[e._v("取消")])],1)],1),e._v(" "),e.checkIn?l("el-card",[l("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",attrs:{border:"",data:e.tableData,stripe:""}},[l("el-table-column",{attrs:{prop:"index",label:"序号",width:"60px",align:"center"}}),e._v(" "),l("el-table-column",{attrs:{prop:"operation",label:"操作",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("el-button",{attrs:{type:"text"},on:{click:function(l){e.permission(t.row)}}},[e._v("权限分配")]),e._v(" "),l("el-button",{attrs:{type:"text"},on:{click:function(l){e.deleteDate(t.row)}}},[e._v("删除")])]}}])}),e._v(" "),l("el-table-column",{attrs:{prop:"roleName",label:"角色",align:"center"}}),e._v(" "),l("el-table-column",{attrs:{prop:"roleNameCn",label:"角色名",align:"center"}}),e._v(" "),l("el-table-column",{attrs:{prop:"level",label:"角色等级",width:"160px",align:"center"}}),e._v(" "),l("el-table-column",{attrs:{prop:"info",label:"备注",align:"center"}})],1),e._v(" "),l("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":e.pageNum,"page-size":e.pageSize,layout:"sizes, prev, pager, next, jumper"},on:{"size-change":e.handleSizeChange,"current-change":e.handlePageChange,"update:currentPage":function(t){e.pageNum=t},"update:pageSize":function(t){e.pageSize=t}}}),e._v(" "),l("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[e._v("共"+e._s(e.sum)+"条，")])],1):e._e(),e._v(" "),l("el-dialog",{attrs:{title:"提示",visible:e.dialogVisibleT,width:"600px"},on:{"update:visible":function(t){e.dialogVisibleT=t}}},[l("span",[e._v("权限管理")]),e._v(" "),l("el-tree",{ref:"tree",attrs:{"default-expand-all":"",data:e.treeData,"show-checkbox":"","node-key":"listIndex",props:e.defaultProps,"default-checked-keys":e.checkedArr}}),e._v(" "),l("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[l("el-button",{attrs:{type:"primary"},on:{click:e.setRights}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var f=l("VU/8")(d,p,!1,function(e){l("iFwL")},"data-v-a5f54822",null);t.default=f.exports},iFwL:function(e,t){}});