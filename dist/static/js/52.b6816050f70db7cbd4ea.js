webpackJsonp([52],{"6F4w":function(a,e){},NZtV:function(a,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=t("BO1k"),i=t.n(l),s={name:"A",data:function(){return{sum:0,index:0,totalPage:0,pageSize:30,pageNum:1,checkIn:!0,loading:!1,tableData:[],gatewayName:"",modifyData:{visible:!1,id:"",protocal:"",channelClassName:"",loadClassName:"",sendClassName:"",reportClassName:"",deliverClassName:"",reportQueryClassName:"",deliverQueryClassName:"",balanceQueryClassName:""},addData:{visible:!1,id:"",protocal:"",channelClassName:"",loadClassName:"",sendClassName:"",reportClassName:"",deliverClassName:"",reportQueryClassName:"",deliverQueryClassName:"",balanceQueryClassName:""},statusOpt:[{value:0,label:"停止运行"},{value:1,label:"正在运行"}],rule1:{gatewayId:{required:!0,message:"请输入网关编号",trigger:"blur"},gatewayName:{required:!0,message:"请输入网关名称",trigger:"blur"},status:{required:!0,message:"请输入网关状态",trigger:"blur"},note:{required:!0,message:"请输入备注",trigger:"blur"}}}},methods:{handleSizeChange:function(){this.checkData()},handlePageChange:function(){this.checkData()},handleCommand:function(a){this[a.name]=!0},handleSelectionChange:function(a){this.choosedGateway=a},checkData:function(){var a=this;this.tableData=[],this.checkIn=!0,this.loading=!0;var e=this;this.postRequest("admin/listRunGateway",{gatewayName:this.gatewayName,pageNum:this.pageNum,pageSize:this.pageSize}).then(function(t){e.tableData=[],e.loading=!1,a.index=Number(t.data.data.page.pageNum-1)*Number(t.data.data.page.pageSize)+1,e.sum=t.data.data.page.totalCount,e.totalPage=t.data.data.page.totalPage;var l=!0,s=!1,n=void 0;try{for(var o,r=i()(t.data.data.data);!(l=(o=r.next()).done);l=!0){var d=o.value;e.tableData.push({id:d.id,index:e.index,gatewayId:d.gatewayId,gatewayName:d.gatewayName,note:d.note,status:d.status}),e.index++}}catch(a){s=!0,n=a}finally{try{!l&&r.return&&r.return()}finally{if(s)throw n}}})},modify:function(a){this.modifyData={visible:!0,id:a.id,gatewayId:a.gatewayId,gatewayName:a.gatewayName,status:a.status,note:a.note}},submitModify:function(a){var e=this;this.$refs[a].validate(function(a){if(!a)return!1;var t=e;e.postRequest("admin/saveEditRunGateway",e.modifyData).then(function(a){t.resAlert(a.data),t.modifyData.visible=!1,t.checkData()})})},add:function(){this.addData.visible=!0},submitAdd:function(a){var e=this;this.$refs[a].validate(function(a){if(!a)return!1;var t=e;e.postRequest("admin/saveAddRunGateway",e.addData).then(function(a){t.resAlert(a.data),t.checkData(),t.addData={visible:!1,id:"",protocal:"",channelClassName:"",loadClassName:"",sendClassName:"",reportClassName:"",deliverClassName:"",reportQueryClassName:"",deliverQueryClassName:"",balanceQueryClassName:""}})})}}},n={render:function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("div",{staticClass:"container"},[t("el-form",{attrs:{inline:"inline","label-width":"120px"},nativeOn:{keyup:function(e){return"button"in e||!a._k(e.keyCode,"enter",13,e.key,"Enter")?a.checkData(e):null}}},[t("el-form-item",{attrs:{label:"网关名称："}},[t("el-input",{model:{value:a.gatewayName,callback:function(e){a.gatewayName=e},expression:"gatewayName"}})],1),a._v(" "),t("el-form-item",[t("el-button",{staticClass:"fr",attrs:{type:"primary",plain:""},on:{click:a.checkData}},[a._v("查询")])],1)],1),a._v(" "),a.checkIn?t("el-card",[t("el-button",{attrs:{type:"text"},on:{click:a.add}},[a._v("+添加网关协议")]),a._v(" "),t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:a.loading,expression:"loading"}],ref:"table",attrs:{border:"",data:a.tableData,stripe:""}},[t("el-table-column",{attrs:{label:"序号",width:"50px",prop:"index"}}),a._v(" "),t("el-table-column",{attrs:{width:"50px",label:"操作"},scopedSlots:a._u([{key:"default",fn:function(e){return[t("el-button",{attrs:{type:"text"},on:{click:function(t){a.modify(e.row)}}},[a._v("修改")])]}}])}),a._v(" "),t("el-table-column",{attrs:{prop:"gatewayId",label:"网关代码"}}),a._v(" "),t("el-table-column",{attrs:{prop:"gatewayName",label:"网关名称"}}),a._v(" "),t("el-table-column",{attrs:{prop:"note",label:"备注"}}),a._v(" "),t("el-table-column",{attrs:{label:"运行状态"},scopedSlots:a._u([{key:"default",fn:function(e){return[a._v(a._s(1===e.row.status?"正在运行":"未运行"))]}}])})],1),a._v(" "),t("el-pagination",{staticClass:"fr",staticStyle:{margin:"10px 0"},attrs:{"current-page":a.pageNum,"page-size":a.pageSize,layout:"sizes, prev, pager, next, jumper",total:a.sum},on:{"size-change":a.handleSizeChange,"current-change":a.handlePageChange,"update:currentPage":function(e){a.pageNum=e},"update:pageSize":function(e){a.pageSize=e}}}),a._v(" "),t("span",{staticClass:"fr",staticStyle:{"padding-top":"15px","font-size":"14px"}},[a._v("共"+a._s(a.sum)+"条，")]),a._v(" "),t("el-dialog",{attrs:{title:"添加网关协议",visible:a.addData.visible,width:"500px"},on:{"update:visible":function(e){a.$set(a.addData,"visible",e)}}},[t("el-form",{ref:"addData",staticStyle:{width:"400px"},attrs:{model:a.addData,rules:a.rule1,"label-width":"120px"}},[t("el-form-item",{attrs:{label:"网关编号：",prop:"gatewayId"}},[t("el-input",{model:{value:a.addData.gatewayId,callback:function(e){a.$set(a.addData,"gatewayId",e)},expression:"addData.gatewayId"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"网关名称：",prop:"gatewayName"}},[t("el-input",{model:{value:a.addData.gatewayName,callback:function(e){a.$set(a.addData,"gatewayName",e)},expression:"addData.gatewayName"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"状态：",prop:"status"}},[t("el-select",{model:{value:a.addData.status,callback:function(e){a.$set(a.addData,"status",e)},expression:"addData.status"}},a._l(a.statusOpt,function(a,e){return t("el-option",{key:e,attrs:{value:a.value,label:a.label}})}))],1),a._v(" "),t("el-form-item",{attrs:{label:"备注：",prop:"note"}},[t("el-input",{model:{value:a.addData.note,callback:function(e){a.$set(a.addData,"note",e)},expression:"addData.note"}})],1)],1),a._v(" "),t("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{on:{click:function(e){a.addData.visible=!1}}},[a._v("取 消")]),a._v(" "),t("el-button",{attrs:{type:"primary"},on:{click:function(e){a.submitAdd("addData")}}},[a._v("保存")])],1)],1),a._v(" "),t("el-dialog",{attrs:{title:"网关协议修改",visible:a.modifyData.visible,width:"500px"},on:{"update:visible":function(e){a.$set(a.modifyData,"visible",e)}}},[t("el-form",{ref:"modifyData",staticStyle:{width:"400px"},attrs:{model:a.modifyData,"label-width":"120px"}},[t("el-form-item",{attrs:{label:"网关编号："}},[t("el-input",{model:{value:a.modifyData.gatewayId,callback:function(e){a.$set(a.modifyData,"gatewayId",e)},expression:"modifyData.gatewayId"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"网关名称："}},[t("el-input",{model:{value:a.modifyData.gatewayName,callback:function(e){a.$set(a.modifyData,"gatewayName",e)},expression:"modifyData.gatewayName"}})],1),a._v(" "),t("el-form-item",{attrs:{label:"状态："}},[t("el-select",{model:{value:a.modifyData.status,callback:function(e){a.$set(a.modifyData,"status",e)},expression:"modifyData.status"}},a._l(a.statusOpt,function(a,e){return t("el-option",{key:e,attrs:{value:a.value,label:a.label}})}))],1),a._v(" "),t("el-form-item",{attrs:{label:"备注："}},[t("el-input",{model:{value:a.modifyData.note,callback:function(e){a.$set(a.modifyData,"note",e)},expression:"modifyData.note"}})],1)],1),a._v(" "),t("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[t("el-button",{on:{click:function(e){a.modifyData.visible=!1}}},[a._v("取 消")]),a._v(" "),t("el-button",{attrs:{type:"primary"},on:{click:function(e){a.submitModify("modifyData")}}},[a._v("保存")])],1)],1)],1):a._e()],1)},staticRenderFns:[]};var o=t("VU/8")(s,n,!1,function(a){t("6F4w")},"data-v-61d7e294",null);e.default=o.exports}});