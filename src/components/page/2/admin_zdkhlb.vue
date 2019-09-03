<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="客户用户名：">
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="公司名称：">
        <el-input v-model="companyName"></el-input>
      </el-form-item>
      <el-form-item label="所属销售：">
        <el-select filterable v-model="saleName">
          <el-option label="所有" value></el-option>
          <el-option
            v-for="item in saleNameOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="所属代理：">-->
      <!--<el-select filterable v-model="agentName">-->
      <!--<el-option-->
      <!--v-for="item in agentNameOpt"-->
      <!--:key="item.value"-->
      <!--:label="item.label"-->
      <!--:value="item.value">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="联系人：">
        <el-input v-model="contactor"></el-input>
      </el-form-item>
      <el-form-item label="联系手机：">
        <el-input v-model="mobile"></el-input>
      </el-form-item>
      <el-form-item label="特服号：">
        <el-input v-model="code"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select filterable v-model="status">
          <el-option
            v-for="item in statusOpt"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="checkData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column width="200px" label="操作">
          <template slot-scope="scope">
            <el-button @click="modifyInformation(scope.row)" type="text">修改信息</el-button>
            <el-button @click="modifyParameters(scope.row)" type="text">修改参数</el-button>
            <el-button @click="delClient(scope.row)" type="text">删除</el-button>
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button type="text">
                其他管理
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!--@click.native能解决的非要用command-->
                <el-dropdown-item
                  v-if="adminKhglSubaccountList && scope.row.isPCN=='1'"
                  :command="{name:'subAccount',data:scope.row}"
                >子账号</el-dropdown-item>
                <el-dropdown-item
                  v-if="adminUnitPrice"
                  :command="{name:'priceChangeRecord',data:scope.row}"
                >单价变更记录</el-dropdown-item>
                <el-dropdown-item
                  v-if="adminZdkhlbRoleNameUpdate"
                  :command="{name:'permissionModification',data:scope.row}"
                >修改权限</el-dropdown-item>
                <el-dropdown-item
                  v-if="adminKhglChecktemplateAdd"
                  :command="{name:'bindTemplates',data:scope.row}"
                >绑定模板</el-dropdown-item>
                <el-dropdown-item
                  v-if="adminKhglBeforeafterChecktemplateAdd"
                  :command="{name:'bindingSignature',data:scope.row}"
                >绑定前后签名模板</el-dropdown-item>
                <el-dropdown-item
                  v-if="adminKhglProvincerouteAdd"
                  :command="{name:'provincialNetworkRoute',data:scope.row}"
                >省网路由</el-dropdown-item>
                <el-dropdown-item
                  v-if="adminKhglCheckmanageAdd"
                  :command="{name:'trialFreeClient',data:scope.row}"
                >免审客户</el-dropdown-item>
                <el-dropdown-item
                  v-if="adminKhglCheckscenceAdd"
                  :command="{name:'auditPolicy',data:scope.row}"
                >审核策略</el-dropdown-item>
                <!--<el-dropdown-item :command="{name:'addSign',data:scope.row}">添加拓展绑定签名</el-dropdown-item>-->
                <el-dropdown-item
                  v-if="adminKhglRouteinfoList"
                  :command="{name:'routeInformation',data:scope.row}"
                >路由信息</el-dropdown-item>
                <el-dropdown-item :command="{name:'failureReturn',data:scope.row}">失败返还设置</el-dropdown-item>
                <el-dropdown-item :command="{name:'gatewayPriceSetting',data:scope.row}">对应网关价格设置</el-dropdown-item>
                <el-dropdown-item
                  v-if="adminGjzlylbAdd"
                  :command="{name:'addKeyWordRoute',data:scope.row}"
                >添加关键字路由</el-dropdown-item>
                <el-dropdown-item
                  v-if="adminKhglGwrouteAdd"
                  :command="{name:'addGwRoute',data:scope.row}"
                >二次扩展添加</el-dropdown-item>
                <!--Schlechte Erziehung-->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="userName" label="客户用户名"></el-table-column>
        <el-table-column prop="code" label="特服号"></el-table-column>
        <el-table-column prop="pcnName" label="主账号"></el-table-column>
        <el-table-column label="状态">
          <template
            slot-scope="scope"
          >{{scope.row.status===2?'禁用':scope.row.status===-1?'黑名单':'正常'}}</template>
        </el-table-column>
        <el-table-column prop="saleName" label="所属销售"></el-table-column>
        <el-table-column prop="agentName" label="所属代理"></el-table-column>
        <el-table-column prop="leftPrice" label="余额（元）"></el-table-column>
        <el-table-column prop="unitprice" label="单价（元）"></el-table-column>
        <el-table-column label="账号类型" prop="accountTypeCn"></el-table-column>
        <el-table-column prop="nickName" label="联系人"></el-table-column>
        <el-table-column prop="mobile" label="手机"></el-table-column>
        <el-table-column prop="phone" label="固话"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="QQ" label="QQ"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="rank" label="客户等级"></el-table-column>
        <el-table-column label="客户来源">
          <template
            slot-scope="scope"
          >{{scope.row.source===1?'web客户':scope.row.source===2?'普通接口':scope.row.source===3?'cmpp客户':'未知'}}</template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="creatorUserName" label="创建人"></el-table-column>
        <el-table-column prop="created" label="创建时间"></el-table-column>
        <el-table-column prop="modifyUserName" label="修改人"></el-table-column>
        <el-table-column prop="modifytimes" label="修改时间"></el-table-column>
      </el-table>
      <el-pagination
        class="fr"
        style="margin:10px 0"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="pageNum"
        :page-size.sync="PageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="sum"
      ></el-pagination>
      <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
      <el-dialog title="修改信息" :visible.sync="modifyInformationData.visible" width="500px">
        <el-form
          :model="modifyInformationData"
          :rules="rule2"
          label-width="150px"
          ref="modify"
          style="width: 400px"
        >
          <el-form-item label="客户用户名：" prop="userName">
            <el-input v-model="modifyInformationData.userName" disabled></el-input>
          </el-form-item>
          <el-form-item label="公司名称：" prop="companyName">
            <el-input v-model="modifyInformationData.companyName"></el-input>
          </el-form-item>
          <!--<el-form-item label="代理账户名称：">-->
          <!--<el-select filterable v-model="modifyInformationData.userName">-->
          <!--<el-option-->
          <!--v-for="item in modifyInformationData.sourceOpt"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="客户来源：">
            <el-select filterable v-model="modifyInformationData.source">
              <el-option
                v-for="item in sourceOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号类型：">
            <el-select filterable v-model="modifyInformationData.accountType">
              <el-option
                v-for="item in accountTypeOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指定销售：">
            <el-select filterable v-model="modifyInformationData.saleName">
              <el-option
                v-for="item in saleNameOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单价(元)：" prop="unitprice">
            <el-input v-model.number="modifyInformationData.unitprice"></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="nickName">
            <el-input v-model="modifyInformationData.nickName"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="mobile">
            <el-input v-model="modifyInformationData.mobile"></el-input>
          </el-form-item>
          <el-form-item label="联系地址：">
            <el-input v-model="modifyInformationData.address"></el-input>
          </el-form-item>
          <el-form-item label="固定电话：">
            <el-input v-model="modifyInformationData.phone"></el-input>
          </el-form-item>
          <el-form-item label="QQ/msn：">
            <el-input v-model="modifyInformationData.QQ"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input v-model="modifyInformationData.mail"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyInformationData.visible = false;getSaleList()">取 消</el-button>
          <el-button type="primary" @click="submitModifyInformation">确认修改</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改参数" :visible.sync="modifyParamsData.visible" width="500px">
        <el-form
          :model="modifyParamsData"
          label-width="150px"
          ref="modify2"
          style="width: 400px"
          :rules="rule7"
        >
          <el-form-item label="客户账号：">
            <el-input disabled v-model="modifyParamsData.userName"></el-input>
          </el-form-item>
          <el-form-item label="企业签名：">
            <el-input v-model="modifyParamsData.signature"></el-input>
          </el-form-item>
          <el-form-item label="未知收费率：">
            <el-input disabled v-model="modifyParamsData.unKnownProportion"></el-input>
          </el-form-item>
          <el-form-item label="扩展长度：">
            <el-input v-model="modifyParamsData.extendNumber"></el-input>
          </el-form-item>
          <el-form-item label="IP绑定：">
            <el-input v-model="modifyParamsData.userip"></el-input>
          </el-form-item>
          <el-form-item label="每天号码限制：">
            <el-input v-model="modifyParamsData.mobileLimit"></el-input>
          </el-form-item>
          <el-form-item label="每小时号码限制：">
            <el-input v-model="modifyParamsData.mobileLimitHour"></el-input>
          </el-form-item>
          <el-form-item label="黑号等级：">
            <el-select filterable v-model="modifyParamsData.blackLevel">
              <el-option
                v-for="item in blackRank"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运营商接口长号：">
            <el-input v-model="modifyParamsData.longcode"></el-input>
          </el-form-item>
          <el-form-item label="运营商接口连接数：">
            <el-input v-model="modifyParamsData.maxsession"></el-input>
          </el-form-item>
          <el-form-item label="组包号码数：">
            <el-input v-model="modifyParamsData.groupMax"></el-input>
          </el-form-item>
          <el-form-item label="自定义签名位置：">
            <el-select filterable v-model="modifyParamsData.isCustomSignLocation">
              <el-option
                v-for="item in sighLocation"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="签名校验设置：">
            <el-select filterable v-model="modifyParamsData.signCheck">
              <el-option
                v-for="item in sighCheck"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报告授权：">
            <el-select filterable v-model="modifyParamsData.reportflag">
              <el-option
                v-for="item in reportOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报告地址：">
            <el-input type="textarea" style="width: 220px" v-model="modifyParamsData.reporturl"></el-input>
          </el-form-item>
          <el-form-item label="上行地址：">
            <el-input type="textarea" style="width: 220px" v-model="modifyParamsData.mourl"></el-input>
          </el-form-item>
          <el-form-item label="客户上传文件扩容：" label-width="170px">
            <el-radio-group v-model="modifyParamsData.isuploadfilebigger">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="彩信是否自定义文案：" label-width="170px">
            <el-radio-group v-model="modifyParamsData.mmsCustomizeDoc">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyParamsData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitModifyParams">确认修改</el-button>
        </span>
      </el-dialog>
      <!-- //////////////////////////////////////////// -->
      <el-dialog title="系统账号权限修改" :visible.sync="permissionModificationData.visible" width="500px">
        <el-form v-model="permissionModificationData" label-width="100px" style="width: 400px">
          <el-form-item label="用户账号：">
            <el-input disabled v-model="permissionModificationData.userName"></el-input>
          </el-form-item>
          <el-form-item label="当前角色：">
            <el-input disabled v-model="permissionModificationData.roleName"></el-input>
          </el-form-item>
          <el-form-item label="新角色：">
            <el-select filterable v-model="permissionModificationData.newRoleName">
              <el-option
                v-for="(item,i) in roleOpt"
                :value="item.value"
                :label="item.label"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="permissionModificationData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitPermissionModification">确认修改</el-button>
        </span>
      </el-dialog>
      <el-dialog title="客户绑定模板" :visible.sync="bindTemplatesData.visible" width="500px">
        <el-form
          :model="bindTemplatesData"
          label-width="150px"
          style="width: 400px"
          :rules="rule4"
          ref="bindTemplate"
        >
          <el-form-item label="客户账号：">
            <el-input disabled v-model="bindTemplatesData.template.userName"></el-input>
          </el-form-item>
          <el-form-item label="号码限制：">
            <el-radio-group v-model="bindTemplatesData.template.isMobileLimit">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="限制条数：" prop="template.mobileLimit">
            <el-input v-model="bindTemplatesData.template.mobileLimit"></el-input>
          </el-form-item>
          <el-form-item label="时间间隔：">
            <el-input v-model="bindTemplatesData.template.limitMins"></el-input>
          </el-form-item>
          <el-form-item label="每小时号码限制：" prop="template.mobileLimitHour">
            <el-input v-model="bindTemplatesData.template.mobileLimitHour"></el-input>
          </el-form-item>
          <el-form-item label="每天号码限制：" prop="template.mobileLimitDay">
            <el-input v-model="bindTemplatesData.template.mobileLimitDay"></el-input>
          </el-form-item>
          <el-form-item label="模板路由：">
            <el-radio-group v-model="bindTemplatesData.template.isRoute">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="移动网关：">
            <el-select filterable v-model="bindTemplatesData.template.cm">
              <el-option
                v-for="item in cmList"
                :label="item.label"
                :value="item.value"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联通网关：">
            <el-select filterable v-model="bindTemplatesData.template.cu">
              <el-option
                v-for="item in cuList"
                :label="item.label"
                :value="item.value"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电信网关：">
            <el-select filterable v-model="bindTemplatesData.template.ct">
              <el-option
                v-for="item in ctList"
                :label="item.label"
                :value="item.value"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板1：" prop="temp1">
            <el-input type="textarea" v-model="bindTemplatesData.temp1"></el-input>
            <!--仅模板1必填-->
          </el-form-item>
          <el-form-item label="模板2：">
            <el-input type="textarea" v-model="bindTemplatesData.temp2"></el-input>
          </el-form-item>
          <el-form-item label="模板3：">
            <el-input type="textarea" v-model="bindTemplatesData.temp3"></el-input>
          </el-form-item>
          <el-form-item label="模板4：">
            <el-input type="textarea" v-model="bindTemplatesData.temp4"></el-input>
          </el-form-item>
          <el-form-item label="模板5：">
            <el-input type="textarea" v-model="bindTemplatesData.temp5"></el-input>
          </el-form-item>
          <el-form-item label=" "></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="bindTemplatesData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitBindTemplates">添加</el-button>
        </span>
      </el-dialog>
      <el-dialog title="客户绑定前后签名模板" :visible.sync="bindingSignatureData.visible" width="500px">
        <el-form
          :model="bindingSignatureData"
          label-width="120px"
          style="width: 400px"
          ref="bindSign"
          :rules="rule5"
        >
          <el-form-item label="客户账号：">
            <el-input disabled v-model="bindingSignatureData.template.userName"></el-input>
          </el-form-item>
          <el-form-item label="号码限制：">
            <el-radio-group v-model="bindingSignatureData.template.isMobileLimit">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="限制条数：" prop="template.mobileLimit">
            <el-input v-model="bindingSignatureData.template.mobileLimit"></el-input>
          </el-form-item>
          <el-form-item label="时间间隔：">
            <el-input v-model="bindingSignatureData.template.limitMins"></el-input>
          </el-form-item>
          <el-form-item label="每小时号码限制：" prop="template.mobileLimitHour">
            <el-input v-model="bindingSignatureData.template.mobileLimitHour"></el-input>
          </el-form-item>
          <el-form-item label="每天号码限制：" prop="template.mobileLimitDay">
            <el-input v-model="bindingSignatureData.template.mobileLimitDay"></el-input>
          </el-form-item>
          <el-form-item label="模板路由：">
            <el-radio-group v-model="bindingSignatureData.template.isRoute">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="移动网关：">
            <el-select filterable v-model="bindingSignatureData.template.cm">
              <el-option
                v-for="item in cmList"
                :label="item.label"
                :value="item.value"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联通网关：">
            <el-select filterable v-model="bindingSignatureData.template.cu">
              <el-option
                v-for="item in cuList"
                :label="item.label"
                :value="item.value"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电信网关：">
            <el-select filterable v-model="bindingSignatureData.template.ct">
              <el-option
                v-for="item in ctList"
                :label="item.label"
                :value="item.value"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="签名：">
            <el-input v-model="bindingSignatureData.template.sign"></el-input>
          </el-form-item>
          <el-form-item label="模板1：" prop="temp1">
            <el-input type="textarea" v-model="bindingSignatureData.temp1"></el-input>
          </el-form-item>
          <el-form-item label="模板2：">
            <el-input type="textarea" v-model="bindingSignatureData.temp2"></el-input>
          </el-form-item>
          <el-form-item label="模板3：">
            <el-input type="textarea" v-model="bindingSignatureData.temp3"></el-input>
          </el-form-item>
          <el-form-item label="模板4：">
            <el-input type="textarea" v-model="bindingSignatureData.temp4"></el-input>
          </el-form-item>
          <el-form-item label="模板5：">
            <el-input type="textarea" v-model="bindingSignatureData.temp5"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="bindingSignatureData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitBindingSignatureData">确认修改</el-button>
        </span>
      </el-dialog>
      <el-dialog title="客户添加省网路由" :visible.sync="provincialNetworkRouteData.visible " width="500px">
        <el-form v-model="provincialNetworkRouteData" label-width="120px" style="width: 400px">
          <el-form-item label="客户账号：">
            <el-input v-model="provincialNetworkRouteData.userName"></el-input>
          </el-form-item>
          <el-form-item label="路由省份：">
            <el-select filterable v-model="provincialNetworkRouteData.mobileArea">
              <el-option
                v-for="(item,i) in mobileAreaOpt"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否路由">
            <el-radio-group v-model="provincialNetworkRouteData.isRoute">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="移动网关：">
            <el-select filterable v-model="provincialNetworkRouteData.cm">
              <el-option
                v-for="(item,i) in cmList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联通网关：">
            <el-select filterable v-model="provincialNetworkRouteData.cu">
              <el-option
                v-for="(item,i) in cuList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电信网关：">
            <el-select filterable v-model="provincialNetworkRouteData.ct">
              <el-option
                v-for="(item,i) in ctList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="provincialNetworkRouteData.visible = false">取 消</el-button>
          <el-button type="primary" @click="SubmitProvincialNetworkRoute">添加</el-button>
        </span>
      </el-dialog>
      <el-dialog title="客户添加免审" :visible.sync="trialFreeClientData.visible" width="500px">
        <el-form
          :model="trialFreeClientData"
          label-width="150px"
          style="width: 400px"
          ref="trialFree"
          :rules="rule6"
        >
          <el-form-item label="客户账号：">
            <el-input disabled v-model="trialFreeClientData.userName"></el-input>
          </el-form-item>
          <el-form-item label="当前特服号：">
            <el-select filterable v-model="trialFreeClientData.code">
              <el-option
                v-for="(item,i) in codeOpt"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="对应签名：">
            <el-input v-model="trialFreeClientData.sign" disabled></el-input>
          </el-form-item>
          <el-form-item label="移动网关：" prop="cm">
            <el-select filterable v-model="trialFreeClientData.cm">
              <el-option
                v-for="(item,i) in cmList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联通网关：" prop="cu">
            <el-select filterable v-model="trialFreeClientData.cu">
              <el-option
                v-for="(item,i) in cuList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电信网关：" prop="ct">
            <el-select filterable v-model="trialFreeClientData.ct">
              <el-option
                v-for="(item,i) in ctList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="自定义关键词开关：">
            <el-radio-group v-model="trialFreeClientData.keySwitch">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自定义关键词：" v-if="trialFreeClientData.keySwitch===1">
            <el-input
              placeholder="多个关键字用全角符逗号“，”隔开"
              v-model="trialFreeClientData.userDefinedKeyWord"
            ></el-input>
          </el-form-item>
          <el-form-item label="自定义关键词级别：">
            <el-select filterable v-model="trialFreeClientData.userDefinedKeyLevel">
              <el-option
                v-for="(item,index) in userDefinedKeyLevelOpt"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键词级别：">
            <el-select filterable v-model="trialFreeClientData.keyflag">
              <el-option
                v-for="(item,i) in keyflagOpt"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="免审条数：">
            <el-input v-model="trialFreeClientData.checkcount"></el-input>
          </el-form-item>
          <el-form-item label="信息类型：">
            <el-radio-group v-model="trialFreeClientData.smtype">
              <el-radio :label="1">短信</el-radio>
              <el-radio :label="2">彩信</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="匹配模板：">
            <el-radio-group v-model="trialFreeClientData.templateflag">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="trialFreeClientData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitTrialFreeClientData">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加/修改审核策略" :visible.sync="auditPolicyData.visible" width="500px">
        <el-form v-model="auditPolicyData" label-width="120px" style="width: 400px">
          <el-form-item label="客户账号：">
            <el-input disabled v-model="auditPolicyData.userName"></el-input>
          </el-form-item>
          <el-form-item label="移动网关：">
            <el-select filterable v-model="auditPolicyData.cmgateway">
              <el-option
                v-for="(item,i) in cmList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联通网关：">
            <el-select filterable v-model="auditPolicyData.cugateway">
              <el-option
                v-for="(item,i) in cuList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电信网关：">
            <el-select filterable v-model="auditPolicyData.ctgateway">
              <el-option
                v-for="(item,i) in ctList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="auditPolicyData.memo"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="auditPolicyData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitAuditPolicy">添加</el-button>
        </span>
      </el-dialog>
      <el-dialog title="客户扩展绑定签名添加" width="500px" :visible.sync="addSignData.visible">
        <el-form label-width="120px" style="width: 400px" :rules="rule3" :model="addSignData">
          <el-form-item label="客户账号：">
            <el-input disabled v-model="addSignData.userName"></el-input>
          </el-form-item>
          <el-form-item label="当前特服号：">
            <el-input disabled v-model="addSignData.code"></el-input>
          </el-form-item>
          <el-form-item label="当前签名：">
            <el-input disabled v-model="addSignData.signature"></el-input>
          </el-form-item>
          <el-form-item label="后缀扩展：" prop="extcode">
            <el-input v-model="addSignData.extcode"></el-input>
            <span>当前特服号+扩展</span>
          </el-form-item>
          <el-form-item label="扩展签名：" prop="extsign">
            <el-input v-model="addSignData.extsign"></el-input>
            <span>扩展后特服号对应签名</span>
          </el-form-item>
          <el-form-item label="是否免审：">
            <el-radio-group v-model="addSignData.ischeck">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="移动网关：">
            <el-select filterable v-model="addSignData.cm">
              <el-option
                v-for="(item,i) in cmList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联通网关：">
            <el-select filterable v-model="addSignData.cu">
              <el-option
                v-for="(item,i) in cuList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电信网关：">
            <el-select filterable v-model="addSignData.ct">
              <el-option
                v-for="(item,i) in ctList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键词级别：">
            <el-select filterable v-model="addSignData.keyflag">
              <el-option
                v-for="(item,i) in keyflagOpt"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="免审条数：">
            <el-input v-model="addSignData.checkcount"></el-input>
          </el-form-item>
          <el-form-item label="信息类型：">
            <el-radio-group v-model="addSignData.smtype">
              <el-radio :label="1">短信</el-radio>
              <el-radio :label="2">彩信</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="匹配模板：">
            <el-radio-group v-model="addSignData.templateflag">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addSignData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddSign">确认修改</el-button>
        </span>
      </el-dialog>
      <el-dialog title="客户路由信息" :visible.sync="routeInformationData.visible" width="800px">
        <el-form label-width="120px" style="width: 800px">
          <table :data="routeInformationTableData.table" style="width:90%">
            <!-- <el-table-column width="100px" label="路由名称" prop="routeName"></el-table-column>
            <el-table-column label="路由信息" prop="routeData"></el-table-column>-->
            <tr class="trStyle">
              <th class="widthOne">路由名称</th>
              <th class="widthTwo">路由信息</th>
            </tr>
            <tr v-for="(item,i) in routeInformationTableData.table" class="trStyle" :key="i">
              <td class="widthOne" v-html="item.routeName"></td>
              <td class="widthTwo" v-html="item.routeData"></td>
            </tr>
          </table>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="routeInformationData.visible = false">关闭</el-button>
        </span>
      </el-dialog>
      <el-dialog title="失败返还设置" :visible.sync="failureReturnData.visible" width="500px">
        <el-form v-model="failureReturnData" label-width="120px" style="width: 400px">
          <el-form-item label="客户账号">
            <el-input disabled v-model="failureReturnData.userName"></el-input>
          </el-form-item>
          <el-form-item label="失败类型：">
            <el-checkbox v-model="failureReturnData.gateSubmitFail">网关提交失败</el-checkbox>
            <el-checkbox v-model="failureReturnData.gateReportFail">网关报告失败</el-checkbox>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="failureReturnData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitFailureReturn">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="对应网关价格设置" :visible.sync="gatewayPriceSettingData.visible" width="500px">
        <el-form v-model="gatewayPriceSettingData" label-width="120px" style="width: 400px">
          <el-form-item label="客户账号：">
            <el-input disabled v-model="gatewayPriceSettingData.userName"></el-input>
          </el-form-item>
          <el-form-item label="移动网关：" class="short">
            <el-select
              filterable
              v-model="gatewayPriceSettingData.cmGateway"
              @change="cmGetChangeData"
            >
              <el-option
                v-for="(item,i) of cmList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
            <el-checkbox v-model="gatewayPriceSettingData.cmCheck"></el-checkbox>
            <el-input style="display:inline" v-model="gatewayPriceSettingData.cmUnitprice"></el-input>
            <span>元</span>
          </el-form-item>

          <el-form-item label="联通网关：" class="short">
            <el-select
              filterable
              v-model="gatewayPriceSettingData.cuGateway"
              @change="cuGetChangeData"
            >
              <el-option
                v-for="(item,i) of cuList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
            <el-checkbox v-model="gatewayPriceSettingData.cuCheck"></el-checkbox>
            <el-input style="display:inline" v-model="gatewayPriceSettingData.cuUnitprice"></el-input>
            <span>元</span>
          </el-form-item>

          <el-form-item label="电信网关：" class="short">
            <el-select
              filterable
              v-model="gatewayPriceSettingData.ctGateway"
              @change="ctGetChangeData"
            >
              <el-option
                v-for="(item,i) of ctList"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
            <el-checkbox v-model="gatewayPriceSettingData.ctCheck"></el-checkbox>
            <el-input style="display:inline" v-model="gatewayPriceSettingData.ctUnitprice"></el-input>
            <span>元</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="gatewayPriceSettingData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitGatewayPriceSetting">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加关键字路由" :visible.sync="addKeyWordRouteData.visible" width="500px">
        <el-form
          :model="addKeyWordRouteData"
          label-width="150px"
          style="width: 400px;"
          ref="addKeyWordRoute"
          :rules="rule8"
        >
          <el-form-item label="客户账号：" prop="userName">
            <el-input v-model="addKeyWordRouteData.userName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="关键字：" prop="keyword">
            <el-input v-model="addKeyWordRouteData.keyword"></el-input>
          </el-form-item>
          <el-form-item label="关键字等级：" prop="keylevel">
            <el-select filterable v-model="addKeyWordRouteData.keylevel">
              <el-option
                v-for="(item,i) of keyLevelOpt"
                :label="item.label"
                :value="item.value"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="移动网关：">
            <el-select filterable v-model="addKeyWordRouteData.cm">
              <el-option
                v-for="item in cmList"
                :label="item.label"
                :value="item.value"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联通网关：">
            <el-select filterable v-model="addKeyWordRouteData.cu">
              <el-option
                v-for="item in cuList"
                :label="item.label"
                :value="item.value"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电信网关：">
            <el-select filterable v-model="addKeyWordRouteData.ct">
              <el-option
                v-for="item in ctList"
                :label="item.label"
                :value="item.value"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addKeyWordRouteData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddKeyWord">保存</el-button>
        </span>
      </el-dialog>
      <el-dialog title="二次扩展添加" :visible.sync="addGwRouteData.visible" width="500px">
        <el-form
          label-width="150px"
          style="width: 400px;"
          :model="addGwRouteData.gwRoute"
          ref="addGwRoute"
          :rules="rule9"
        >
          <el-form-item label="客户账号：" prop="userName">
            <el-input v-model="addGwRouteData.gwRoute.userName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="网关：" prop="gateway">
            <el-select filterable v-model="addGwRouteData.gwRoute.gateway">
              <el-option
                v-for="item in addGwRouteData.gatewayList"
                :label="item.label"
                :value="item.value"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网关扩展号：" prop="gwcode">
            <el-input v-model="addGwRouteData.gwRoute.gwcode"></el-input>
          </el-form-item>
          <el-form-item label="网关计费号：">
            <el-input v-model="addGwRouteData.gwRoute.terminalId"></el-input>
          </el-form-item>
          <el-form-item label="用户扩展号：">
            <el-input v-model="addGwRouteData.gwRoute.code" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="签名：" prop="sign">
            <el-input v-model="addGwRouteData.gwRoute.sign"></el-input>
          </el-form-item>
          <el-form-item label="移动是否去签：">
            <el-radio-group v-model="addGwRouteData.gwRoute.isCmLeft">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联通是否去签：">
            <el-radio-group v-model="addGwRouteData.gwRoute.isCuLeft">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电信是否去签：">
            <el-radio-group v-model="addGwRouteData.gwRoute.isCtLeft">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="addGwRouteData.gwRoute.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addGwRouteData.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddGwRoute">保存</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "admin_dlslb",
  data() {
    return {
      index: 0,
      rule9: {
        gateway: { required: true, message: "请选择网关", trigger: "change" },
        accountID: {
          required: true,
          message: "请选择客户账号",
          trigger: "change"
        },
        gwcode: {
          required: true,
          message: "请输入网关扩展号",
          trigger: "blur"
        },
        // code: {required: true, message: '请选择客户账号', trigger: 'blur'},
        sign: { required: true, message: "请输入签名", trigger: "blur" }
      },
      addGwRouteData: {
        visible: false,
        gatewayList: [],
        gwRoute: {
          id: "",
          accountID: "",
          userName: "",
          code: "",
          gwcode: "",
          gateway: "",
          companyName: "",
          sign: "",
          isCmLeft: 0,
          isCuLeft: 0,
          isCtLeft: 0,
          terminalId: "",
          remark: "",
          createtime: "",
          creater: "",
          modifytime: "",
          modifier: ""
        }
      },
      rule8: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        keyword: [{ required: true, message: "请输入关键字", trigger: "blur" }],
        keylevel: [
          { required: true, message: "请选择关键字级别", trigger: "change" }
        ]
      },
      keyLevelOpt: [
        {
          label: "一级关键字",
          value: 1
        },
        {
          label: "二级关键字",
          value: 2
        },
        {
          label: "三级关键字",
          value: 3
        }
      ],
      addKeyWordRouteData: {
        visible: false,
        userName: "",
        keyword: "",
        keylevel: 1,
        cm: "",
        cu: "",
        ct: ""
      },
      sum: 0,
      pageNum: 1,
      PageSize: 30,
      checkIn: true,
      loading: false,
      tableData: [],
      userName: "",
      companyName: "",
      saleName: "",
      saleNameOpt: [],
      agentName: "",
      agentNameOpt: [],
      mobile: "",
      contactor: "",
      code: "",
      status: "",
      roleOpt: [],
      mobileAreaOpt: [
        {
          label: "北京市",
          value: "北京市",
          key: 1
        },
        {
          label: "天津市",
          value: "天津市",
          key: 2
        },
        {
          label: "上海市",
          value: "上海市",
          key: 3
        },
        {
          label: "重庆市",
          value: "重庆市",
          key: 4
        },
        {
          label: "河北省",
          value: "河北省",
          key: 5
        },
        {
          label: "山西省",
          value: "山西省",
          key: 6
        },
        {
          label: "辽宁省",
          value: "辽宁省",
          key: 7
        },
        {
          label: "吉林省",
          value: "吉林省",
          key: 8
        },
        {
          label: "黑龙江省",
          value: "黑龙江省",
          key: 9
        },
        {
          label: "江苏省",
          value: "江苏省",
          key: 10
        },
        {
          label: "浙江省",
          value: "浙江省",
          key: 11
        },
        {
          label: "安徽省",
          value: "安徽省",
          key: 12
        },
        {
          label: "福建省",
          value: "福建省",
          key: 13
        },
        {
          label: "江西省",
          value: "江西省",
          key: 14
        },
        {
          label: "山东省",
          value: "山东省",
          key: 15
        },
        {
          label: "河南省",
          value: "河南省",
          key: 16
        },
        {
          label: "湖北省",
          value: "湖北省",
          key: 17
        },
        {
          label: "湖南省",
          value: "湖南省",
          key: 18
        },
        {
          label: "广东省",
          value: "广东省",
          key: 19
        },
        {
          label: "海南省",
          value: "海南省",
          key: 20
        },
        {
          label: "四川省",
          value: "四川省",
          key: 21
        },
        {
          label: "贵州省",
          value: "贵州省",
          key: 22
        },
        {
          label: "云南省",
          value: "云南省",
          key: 23
        },
        {
          label: "陕西省",
          value: "陕西省",
          key: 24
        },
        {
          label: "甘肃省",
          value: "甘肃省",
          key: 25
        },
        {
          label: "青海省",
          value: "青海省",
          key: 26
        },
        {
          label: "台湾省",
          value: "台湾省",
          key: 27
        },
        {
          label: "内蒙古自治区",
          value: "内蒙古自治区",
          key: 28
        },
        {
          label: "广西壮族自治区",
          value: "广西壮族自治区",
          key: 29
        },
        {
          label: "西藏自治区",
          value: "西藏自治区",
          key: 30
        },
        {
          label: "宁夏回族自治区",
          value: "宁夏回族自治区",
          key: 31
        },
        {
          label: "新疆维吾尔自治区",
          value: "新疆维吾尔自治区",
          key: 32
        },
        {
          label: "香港特别行政区",
          value: "香港特别行政区",
          key: 33
        },
        {
          label: "澳门特别行政区",
          value: "澳门特别行政区",
          key: 34
        }
      ],
      blackRank: [
        {
          value: 0,
          label: "免黑"
        },
        {
          value: 1,
          label: "一级(恶意投诉)"
        },
        {
          value: 2,
          label: "二级(一般投诉)"
        },
        {
          value: 3,
          label: "三级(退订)"
        }
      ],
      sighLocation: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        },
        {
          value: 2,
          label: "不格式化"
        }
      ],
      sighCheck: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],
      reportOpt: [
        {
          value: 0,
          label: "无报告权限"
        },
        {
          value: 1,
          label: "推送上行"
        },
        {
          value: 2,
          label: "推送报告"
        },
        {
          value: 3,
          label: "报告上行都推送"
        },
        {
          value: 4,
          label: "自取上行"
        },
        {
          value: 5,
          label: "自取报告"
        },
        {
          value: 6,
          label: "自取上行和报告"
        }
      ],
      sourceOpt: [
        {
          value: 1,
          label: "web客户"
        },
        {
          value: 2,
          label: "普通接口"
        },
        {
          value: 3,
          label: "cmpp客户"
        }
        // {
        //   value: 31,
        //   label: "sgip客户"
        // },
        // {
        //   value: 32,
        //   label: "sgmp客户"
        // }
      ],
      statusOpt: [
        {
          label: "所有",
          value: "",
          ket: 0
        },
        {
          label: "正常",
          value: 1,
          key: 1
        },
        {
          label: "禁用",
          value: 2,
          key: 2
        }
      ],
      accountTypeOpt: [
        {
          value: 1,
          label: "行业短信"
        },
        {
          value: 2,
          label: "营销短信"
        }
      ],
      p1: false,
      p2: false,
      p3: false,
      p4: false,
      p5: false,
      p6: false,
      p7: false,
      p8: false,
      p9: false,
      p10: false,
      rule1: {
        userName: [
          { required: true, message: "请输入客户用户名", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        saleName: [
          { required: true, message: "请选择指定销售", trigger: "change" }
        ],
        nickName: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入联系地址", trigger: "blur" }
        ],
        unitprice: [
          { required: true, message: "请输入单价", trigger: "blur" },
          { type: "number", min: 0, message: "请输入数字" }
        ]
      },
      rule2: {
        userName: [
          { required: true, message: "请输入客户用户名", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        unitprice: [
          { required: true, message: "请输入单价", trigger: "blur" },
          { type: "number", min: 0, message: "请输入数字" }
        ]
      },
      rule3: {
        extcode: [
          { required: true, message: "请输入后缀扩展", trigger: "blur" }
        ],
        extsign: [
          { required: true, message: "请输入扩展签名", trigger: "blur" }
        ]
      },
      rule4: {
        "template.mobileLimit": [
          { required: true, message: "请输入限制条数", trigger: "blur" }
        ],
        "template.mobileLimitHour": [
          { required: true, message: "请输入每小时号码限制", trigger: "blur" }
        ],
        "template.mobileLimitDay": [
          { required: true, message: "请输入每天号码限制", trigger: "blur" }
        ],
        temp1: [{ required: true, message: "请输入模板1", trigger: "blur" }]
      },
      rule5: {
        "template.mobileLimit": [
          { required: true, message: "请输入限制条数", trigger: "blur" }
        ],
        "template.mobileLimitHour": [
          { required: true, message: "请输入每小时号码限制", trigger: "blur" }
        ],
        "template.mobileLimitDay": [
          { required: true, message: "请输入每天号码限制", trigger: "blur" }
        ],
        temp1: [{ required: true, message: "请输入模板1", trigger: "blur" }]
      },
      rule6: {
        cm: [{ required: true, message: "请选择移动网关", trigger: "change" }],
        cu: [{ required: true, message: "请选择联通网关", trigger: "change" }],
        ct: [{ required: true, message: "请选择电信网关", trigger: "change" }]
      },
      rule7: {
        userName: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        signature: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        unKnownProportion: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        extendNumber: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        userip: { required: true, message: "请完善本行数据", trigger: "blur" },
        mobileLimit: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        mobileLimitHour: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        blackLevel: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        longcode: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        maxsession: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        groupMax: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        isCustomSignLocation: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        signCheck: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        reportflag: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        reporturl: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        mourl: { required: true, message: "请完善本行数据", trigger: "blur" },
        isuploadfilebigger: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        },
        mmsCustomizeDoc: {
          required: true,
          message: "请完善本行数据",
          trigger: "blur"
        }
      },
      modify2: false,
      mod: [],
      radio1: 1,
      radio2: 1,
      radio3: 1,
      cmList: [],
      cuList: [],
      ctList: [],
      addClientData: {
        visible: false,
        userName: "",
        companyName: "",
        agentName: "",
        agentID: "",
        source: 1,
        accountType: 1,
        saleName: "",
        unitprice: "",
        nickName: "",
        mobile: "",
        address: "",
        phone: "",
        QQ: "",
        mail: "",
        accountID: "" //???
      },
      modifyInformationData: {
        visible: false,
        id: "",
        userName: "",
        companyName: "",
        agentName: "", //功能取消，默认
        agentID: "", //功能取消，默认
        source: "",
        accountType: "",
        saleName: "",
        unitprice: "",
        nickName: "",
        mobile: "",
        address: "",
        phone: "",
        QQ: "",
        mail: "",
        accountID: ""
      },
      //转到
      formData: new FormData(),
      modifyParamsData: {
        visible: false,
        accountID: "",
        code: "",
        userName: "",
        signature: "",
        unKnownProportion: "",
        extendNumber: "",
        userip: "",
        mobileLimit: "",
        mobileLimitHour: "",
        blackLevel: "",
        longcode: "",
        maxsession: "",
        groupMax: "",
        isCustomSignLocation: "",
        signCheck: "",
        reportflag: "",
        reporturl: "",
        mourl: "",
        isuploadfilebigger: "",
        mmsCustomizeDoc: ""
      },
      permissionModificationData: {
        visible: false,
        type: "",
        userName: "",
        roleName: "",
        newRoleName: ""
      },
      bindTemplatesData: {
        visible: false,
        temp1: "",
        temp2: "",
        temp3: "",
        temp4: "",
        temp5: "",
        template: {
          accountID: "",
          code: "",
          userName: "",
          isMobileLimit: "",
          mobileLimit: "",
          limitMins: "",
          mobileLimitHour: "",
          mobileLimitDay: "",
          isRoute: "",
          cm: "",
          cu: "",
          ct: ""
        }
      },
      bindingSignatureData: {
        visible: false,
        temp1: "",
        temp2: "",
        temp3: "",
        temp4: "",
        temp5: "",
        sign: "",
        template: {
          accountID: "",
          code: "",
          userName: "",
          isMobileLimit: "",
          mobileLimit: "",
          limitMins: "",
          mobileLimitHour: "",
          mobileLimitDay: "",
          isRoute: "",
          cm: "",
          cu: "",
          ct: ""
        }
      },
      provincialNetworkRouteData: {
        visible: false,
        mobileArea: "",
        isRoute: "",
        cm: "",
        cu: "",
        ct: ""
      },
      codeOpt: [],
      userDefinedKeyLevelOpt: [
        {
          label: "不过滤",
          value: 0
        },
        {
          label: "特级",
          value: 1
        },
        {
          label: "一级",
          value: 2
        },
        {
          label: "二级",
          value: 3
        },
        {
          label: "三级",
          value: 4
        }
      ],
      keyflagOpt: [
        {
          label: "不过滤",
          value: 0
        },
        {
          label: "特级",
          value: 1
        },
        {
          label: "一级",
          value: 2
        },
        {
          label: "二级",
          value: 3
        },
        {
          label: "三级",
          value: 4
        }
      ],
      trialFreeClientData: {
        visible: false,
        accountID: "",
        userName: "",
        code: "",
        cm: "",
        cu: "",
        ct: "",
        keySwitch: 0,
        userDefinedKeyWord: "",
        userDefinedKeyLevel: 0,
        keyflag: 0,
        checkcount: 0,
        smtype: 1,
        templateflag: 0
      },
      auditPolicyData: {
        visible: false,
        accountID: "",
        userName: "",
        cmgateway: "",
        cugateway: "",
        ctgateway: "",
        memo: ""
      },
      addSignData: {
        visible: false,
        accountID: "",
        userName: "",
        code: "",
        signature: "",
        extcode: "",
        extsign: "",
        ischeck: "",
        cm: "",
        cu: "",
        ct: "",
        keyflag: "",
        checkcount: "",
        smtype: "",
        templateflag: ""
      },
      routeInformationData: {
        visible: false
      },
      routeInformationTableData: {
        table: [],
        visible: false
      },
      failureReturnData: {
        visible: false,
        userName: "",
        accountID: "",
        gateSubmitFail: false,
        gateReportFail: false
      },
      gatewayPriceSettingData: {
        visible: false,
        cmGateway: "",
        cuGateway: "",
        ctGateway: "",
        cmCheck: "",
        cuCheck: "",
        ctCheck: "",
        userName: "",
        cmUnitprice: "",
        cuUnitprice: "",
        ctUnitprice: "",
        accountID: "",
        operaid: ""
      },
      adminKhglSubaccountList: false,
      adminUnitPrice: false,
      adminZdkhlbRoleNameUpdate: false,
      adminKhglChecktemplateAdd: false,
      adminKhglBeforeafterChecktemplateAdd: false,
      adminKhglProvincerouteAdd: false,
      adminKhglCheckmanageAdd: false,
      adminKhglCheckscenceAdd: false,
      adminKhglRouteinfoList: false,
      adminGjzlylbAdd: false,
      adminKhglGwrouteAdd: false
      // cmList: [],
      // cuList: [],
      // ctList: []
    };
  },
  methods: {
    addGwRoute(row) {
      let self = this;
      this.addGwRouteData.gwRoute = {};
      this.addGwRouteData.gatewayList = [];
      this.postRequest("admin/addGwRoute", {
        accountID: row.accountID
      }).then(res => {
        for (let i of res.data.data.gatewayList) {
          if (i === null) {
            this.$message.warning("二次拓展添加信息为空");
          } else {
            for (let item of res.data.data.gatewayList) {
              self.addGwRouteData.gatewayList.push({
                label: item.gatewayname,
                value: item.gateway
              });
            }
            self.addGwRouteData.gwRoute.id = res.data.data.customer.id;
            self.addGwRouteData.gwRoute.accountID =
              res.data.data.customer.accountID;
            self.addGwRouteData.gwRoute.userName =
              res.data.data.customer.userName;
            self.addGwRouteData.gwRoute.code = res.data.data.customer.code;
            self.addGwRouteData.visible = true;
          }
        }
      });
    },
    submitAddGwRoute() {
      let self = this;
      this.$refs.addGwRoute.validate(valid => {
        if (valid) {
          self
            .postRequest("admin/saveAddGwRoute", {
              gwRoute: self.addGwRouteData.gwRoute
            })
            .then(res => {
              if (res.data.success === true) {
                self.checkData();
                self.$message.success(res.data.data);
                self.addGwRouteData = {
                  visible: false,
                  gatewayList: [],
                  gwRoute: {
                    id: "",
                    accountID: "",
                    userName: "",
                    code: "",
                    gwcode: "",
                    gateway: "",
                    companyName: "",
                    sign: "",
                    isCmLeft: 0,
                    isCuLeft: 0,
                    isCtLeft: 0,
                    terminalId: "",
                    remark: "",
                    createtime: "",
                    creater: "",
                    modifytime: "",
                    modifier: ""
                  }
                };
              } else self.$message.error("添加二次扩展失败");
            });
        } else return false;
      });
    },
    addKeyWordRoute(row) {
      let self = this;
      this.cmList = [];
      this.cuList = [];
      this.ctList = [];
      this.postRequest("admin/getAddCheckManage", {
        accountID: row.accountID,
        userName: row.userName
      }).then(res => {
        for (let item of res.data.data.cuList) {
          if (item.status === 1) {
            self.cuList.push({
              label: item.gatewayname,
              value: item.gateway
            });
          }
        }
        for (let item of res.data.data.ctList) {
          if (item.status === 1) {
            self.ctList.push({
              label: item.gatewayname,
              value: item.gateway
            });
          }
        }
        for (let item of res.data.data.cmList) {
          if (item.status === 1) {
            self.cmList.push({
              label: item.gatewayname,
              value: item.gateway
            });
          }
        }
        self.addKeyWordRouteData.visible = true;
        self.addKeyWordRouteData.cm = self.cmList[0];
        self.addKeyWordRouteData.cu = self.cuList[0];
        self.addKeyWordRouteData.ct = self.ctList[0];
        self.addKeyWordRouteData.userName = row.userName;
      });
    },
    submitAddKeyWord() {
      let self = this;
      this.$refs.addKeyWordRoute.validate(valid => {
        if (valid) {
          this.postRequest(
            "admin/saveAddKeywordRoute",
            self.addKeyWordRouteData
          ).then(res => {
            self.checkData();
            self.addKeyWordRouteData = {
              visible: false,
              userName: "",
              keyword: "",
              keylevel: 1,
              cm: "",
              cu: "",
              ct: ""
            };
            self.resAlert(res.data);
          });
        }
      });
    },
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listAllCustomer", {
        userName: this.userName,
        companyName: this.companyName,
        saleName: this.saleName,
        agentName: "", //
        mobile: this.mobile,
        contactor: this.contactor,
        code: this.code,
        status: this.status,
        pageNum: this.pageNum,
        pageSize: this.PageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index =
          Number(res.data.data.page.pageNum - 1) *
            Number(res.data.data.page.pageSize) +
          1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            companyName: item.userDetail.companyName,
            userName: item.userName,
            code: item.code,
            pcnName: item.pcnName,
            isPCN: item.isPCN,
            accountID: item.accountID,
            // accountType: item.accountType,
            accountTypeCn:
              item.accountType === 1
                ? "行业"
                : item.accountType === 2
                ? "营销"
                : "未知",
            status: item.status,
            saleName: item.saleName,
            agentName: item.agentName,
            balance: item.userBalance.balance,
            accountType: item.accountType,
            contract: item.userDetail.contract,
            mobile: item.userDetail.mobile,
            address: item.userDetail.address,
            QQ: item.userDetail.QQ,
            email: item.userDetail.email,
            rank: item.rank,
            source: item.source,
            roleName: item.roleName,
            creatorUserName: item.userDetail.creatorUserName,
            created: item.userDetail.created,
            modifyUserName: item.userDetail.modifyUserName,
            modifytimes: item.userDetail.modifytimes,
            id: item.id,
            nickName: item.userDetail.nickName,
            phone: item.phone,
            signature: item.signature,
            unKnownProportion: item.unKnownProportion,
            extendNumber: item.extendNumber,
            userip: item.userip,
            mobileLimit: item.mobileLimit,
            mobileLimitHour: item.mobileLimitHour,
            blackLevel: item.blackLevel,
            longcode: item.longcode,
            maxsession: item.maxsession,
            groupMax: item.groupMax,
            isCustomSignLocation: item.isCustomSignLocation,
            signCheck: item.signCheck,
            reportflag: item.reportflag,
            reporturl: item.reporturl,
            mourl: item.mourl,
            isuploadfilebigger: item.isuploadfilebigger,
            unitprice:
              item.userBalance.unitprice / 10000
                ? item.userBalance.unitprice / 10000
                : 0,
            leftPrice:
              item.userBalance.leftPrice / 10000
                ? item.userBalance.leftPrice / 10000
                : 0
          });
          self.index++;
        }
        // console.log(self.tableData);
      });
    },
    modifyInformation(row) {
      this.modifyInformationData = {
        visible: true,
        accountType: row.accountType,
        saleName: row.saleName,
        nickName: row.nickName,
        mobile: row.mobile,
        address: row.address,
        phone: row.phone,
        QQ: row.QQ,
        mail: row.email,
        accountID: row.accountID,
        id: row.id,
        userName: row.userName,
        companyName: row.companyName,
        agentName: "SYS",
        agentID: 100000, //功能取消，默认
        source: row.source,
        unitprice: Number(row.unitprice)
      };
      // console.log(this.modifyInformationData);
    },
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    failed(message) {
      this.$message.error(message);
    },
    delClient(row) {
      let self = this;
      this.$confirm("确认删除【" + row.userName + "】?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/deleteCustomer", {
              accountID: row.accountID
            })
            .then(res => {
              if (res.data.success) {
                self.succeed(res.data.message);
                this.checkData();
              } else {
                this.failed(res.data.message);
              }
            });
          ///补写接口！
          //提交删除接口同时把数据从tabledata里删除
        })
        .catch(() => {});
    },
    getSaleList() {
      let self = this;
      this.postRequest("admin/listAllEmployee", {
        t: ""
      }).then(res => {
        self.saleNameOpt = [];
        for (let item of res.data.data) {
          self.saleNameOpt.push({
            value: item.userName,
            label: `${item.userName}(${item.nickName})`
          });
        }
      });
    },
    ////////////////////////
    subAccount(row) {
      this.$router.push({
        path: "/zdkhzzh",
        query: {
          accountID: row.accountID
        }
      });
    },
    submitModifyInformation() {
      let self = this;
      this.$refs.modify.validate(valid => {
        if (valid) {
          this.modifyInformationData.visible = false;
          // console.log(this.modifyInformationData.contract);
          this.postRequest("admin/saveUpdateCustomer", {
            id: this.modifyInformationData.id,
            userName: this.modifyInformationData.userName,
            companyName: this.modifyInformationData.companyName,
            agentName: this.modifyInformationData.agentName, //功能取消，默认
            agentID: this.modifyInformationData.agentID, //功能取消，默认
            source: this.modifyInformationData.source,
            accountType: this.modifyInformationData.accountType,
            saleName: this.modifyInformationData.saleName,
            nickName: this.modifyInformationData.nickName,
            mobile: this.modifyInformationData.mobile,
            address: this.modifyInformationData.address,
            phone: this.modifyInformationData.phone,
            QQ: this.modifyInformationData.QQ,
            mail: this.modifyInformationData.mail,
            accountID: this.modifyInformationData.accountID,
            unitprice: Number(this.modifyInformationData.unitprice) * 10000
          }).then(res => {
            self.checkData();
            self.resAlert(res.data);
          });
        } else return false;
      });
    },
    modifyParameters(row) {
      let self = this;
      this.postRequest("admin/listConsultUpdateParams", {
        accountID: row.accountID
      }).then(res => {
        self.modifyParamsData = {
          visible: true,
          accountID: res.data.data.accountID,
          code: res.data.data.code,
          userName: res.data.data.userName,
          signature: res.data.data.signature,
          unKnownProportion: res.data.data.unKnownProportion,
          extendNumber: res.data.data.extendNumber,
          userip: res.data.data.userip,
          mobileLimit: res.data.data.mobileLimit,
          mobileLimitHour: res.data.data.mobileLimitHour,
          blackLevel: res.data.data.blackLevel,
          longcode: res.data.data.longcode,
          maxsession: res.data.data.maxsession,
          groupMax: res.data.data.groupMax,
          isCustomSignLocation: res.data.data.isCustomSignLocation,
          signCheck: res.data.data.signCheck,
          reportflag: res.data.data.reportflag,
          reporturl: res.data.data.reporturl,
          mourl: res.data.data.mourl,
          isuploadfilebigger: res.data.data.isuploadfilebigger,
          mmsCustomizeDoc: res.data.data.mmsCustomizeDoc //新加字段
        };
      });
    },
    submitModifyParams() {
      let self = this;
      // this.$refs.modify2.validate(valid => {
      //     if (valid) {
      this.postRequest("admin/saveConsultUpdateParams", {
        accountID: this.modifyParamsData.accountID,
        code: this.modifyParamsData.code,
        userName: this.modifyParamsData.userName,
        signature: this.modifyParamsData.signature,
        unKnownProportion: this.modifyParamsData.unKnownProportion,
        extendNumber: this.modifyParamsData.extendNumber,
        userip: this.modifyParamsData.userip
          ? this.modifyParamsData.userip
          : "",
        mobileLimit: this.modifyParamsData.mobileLimit,
        mobileLimitHour: this.modifyParamsData.mobileLimitHour,
        blackLevel: this.modifyParamsData.blackLevel,
        longcode: this.modifyParamsData.longcode,
        maxsession: this.modifyParamsData.maxsession,
        groupMax: this.modifyParamsData.groupMax,
        isCustomSignLocation: this.modifyParamsData.isCustomSignLocation,
        signCheck: this.modifyParamsData.signCheck,
        reportflag: this.modifyParamsData.reportflag,
        reporturl: this.modifyParamsData.reporturl,
        mourl: this.modifyParamsData.mourl,
        isuploadfilebigger: this.modifyParamsData.isuploadfilebigger,
        mmsCustomizeDoc: this.modifyParamsData.mmsCustomizeDoc
      }).then(res => {
        self.checkData();
        self.modifyParamsData.visible = false;
        self.resAlert(res.data);
      });
      // } else return false
      // })
    },
    handleCommand(command) {
      // console.log(command.name);
      this[command.name](command.data);
    },
    permissionModification(row) {
      let self = this;
      this.roleOpt = [];
      this.postRequest("admin/roleList", {
        userName: row.userName
      }).then(res => {
        for (let item of res.data.data) {
          self.roleOpt.push({
            label: item.roleName,
            value: item.roleName
          });
        }
        self.permissionModificationData = {
          visible: true,
          userName: row.userName,
          roleName: row.roleName,
          newRoleName: ""
        };
        // console.log(self.permissionModificationData);
      });
    },
    submitPermissionModification() {
      let self = this;
      this.postRequest("admin/saveUpdateAuthRole", {
        type: "update_customer_roleName",
        userName: this.permissionModificationData.userName,
        roleName: this.permissionModificationData.roleName,
        newRoleName: this.permissionModificationData.newRoleName
      }).then(res => {
        self.resAlert(res.data);
        self.permissionModificationData.visible = false;
        self.checkData();
      });
    },
    bindTemplates(row) {
      // console.log(row);
      let self = this;
      this.postRequest("admin/getAddCheckManage", {
        accountID: row.accountID,
        userName: row.userName
      }).then(res => {
        self.cmList = [];
        self.cuList = [];
        self.ctList = [];
        for (let item of res.data.data.cmList) {
          if (item.status === 1) {
            self.cmList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.cuList) {
          if (item.status === 1) {
            self.cuList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.ctList) {
          if (item.status === 1) {
            self.ctList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        self.bindTemplatesData = {
          visible: true,
          temp1: "",
          temp2: "",
          temp3: "",
          temp4: "",
          temp5: "",
          template: {
            accountID: row.accountID,
            code: "", //?
            userName: row.userName,
            isMobileLimit: 0,
            mobileLimit: -1,
            limitMins: 30,
            mobileLimitHour: -1,
            mobileLimitDay: -1,
            isRoute: 0,
            cm: "",
            cu: "",
            ct: ""
          }
        };
        // console.log(self.bindTemplatesData);
      });
    },
    submitBindTemplates() {
      let self = this;
      this.$refs.bindTemplate.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveAddCheckTemplate", {
            temp1: this.bindTemplatesData.temp1,
            temp2: this.bindTemplatesData.temp2,
            temp3: this.bindTemplatesData.temp3,
            temp4: this.bindTemplatesData.temp4,
            temp5: this.bindTemplatesData.temp5,
            template: {
              accountID: this.bindTemplatesData.template.accountID,
              code: this.bindTemplatesData.template.code,
              userName: this.bindTemplatesData.template.userName,
              isMobileLimit: this.bindTemplatesData.template.isMobileLimit,
              mobileLimit: this.bindTemplatesData.template.mobileLimit,
              limitMins: this.bindTemplatesData.template.limitMins,
              mobileLimitHour: this.bindTemplatesData.template.mobileLimitHour,
              mobileLimitDay: this.bindTemplatesData.template.mobileLimitDay,
              isRoute: this.bindTemplatesData.template.isRoute,
              cm: this.bindTemplatesData.template.cm,
              cu: this.bindTemplatesData.template.cu,
              ct: this.bindTemplatesData.template.ct
            }
          }).then(res => {
            self.checkData();
            self.bindTemplatesData.visible = false;
            self.resAlert(res.data);
          });
        } else return false;
      });
    },
    bindingSignature(row) {
      let self = this;
      this.postRequest("admin/getAddCheckManage", {
        accountID: row.accountID,
        userName: row.userName
      }).then(res => {
        self.cmList = [];
        self.cuList = [];
        self.ctList = [];
        for (let item of res.data.data.cmList) {
          if (item.status === 1) {
            self.cmList.push({
              value: item.id,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.cuList) {
          if (item.status === 1) {
            self.cuList.push({
              value: item.id,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.ctList) {
          if (item.status === 1) {
            self.ctList.push({
              value: item.id,
              label: item.gatewayname
            });
          }
        }
      });
      this.bindingSignatureData = {
        visible: true,
        temp1: "",
        temp2: "",
        temp3: "",
        temp4: "",
        temp5: "",
        sign: "",
        template: {
          accountID: row.accountID,
          code: "",
          userName: row.userName,
          isMobileLimit: 0,
          mobileLimit: -1,
          limitMins: 30,
          mobileLimitHour: -1,
          mobileLimitDay: -1,
          isRoute: 0,
          cm: "",
          cu: "",
          ct: ""
        }
      };
    },
    submitBindingSignatureData() {
      let self = this;
      this.$refs.bindSign.validate(valid => {
        if (valid) {
          this.postRequest("admin/saveAddCheckTemplatePreBack", {
            temp1: this.bindingSignatureData.temp1,
            temp2: this.bindingSignatureData.temp2,
            temp3: this.bindingSignatureData.temp3,
            temp4: this.bindingSignatureData.temp4,
            temp5: this.bindingSignatureData.temp5,
            sign: this.bindingSignatureData.sign,
            template: {
              accountID: this.bindingSignatureData.template.accountID,
              code: this.bindingSignatureData.template.code,
              userName: this.bindingSignatureData.template.userName,
              isMobileLimit: this.bindingSignatureData.template.isMobileLimit,
              mobileLimit: this.bindingSignatureData.template.mobileLimit,
              limitMins: this.bindingSignatureData.template.limitMins,
              mobileLimitHour: this.bindingSignatureData.template
                .mobileLimitHour,
              mobileLimitDay: this.bindingSignatureData.template.mobileLimitDay,
              isRoute: this.bindingSignatureData.template.isRoute,
              cm: this.bindingSignatureData.template.cm,
              cu: this.bindingSignatureData.template.cu,
              ct: this.bindingSignatureData.template.ct
            }
          }).then(res => {
            self.bindingSignatureData.visible = false;
            self.resAlert(res.data);
          });
        } else return false;
      });
    },
    provincialNetworkRoute(row) {
      let self = this;
      this.provincialNetworkRouteData = {
        visible: true,
        mobileArea: "北京",
        userName: row.userName,
        isRoute: 1,
        cm: "",
        cu: "",
        ct: ""
      };
      this.postRequest("admin/getAddCheckManage", {
        accountID: row.accountID,
        userName: row.userName
      }).then(res => {
        self.cmList = [];
        self.cuList = [];
        self.ctList = [];
        for (let item of res.data.data.cmList) {
          if (item.status === 1) {
            self.cmList.push({
              value: item.id,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.cuList) {
          if (item.status === 1) {
            self.cuList.push({
              value: item.id,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.ctList) {
          if (item.status === 1) {
            self.ctList.push({
              value: item.id,
              label: item.gatewayname
            });
          }
        }
      });
    },
    SubmitProvincialNetworkRoute() {
      let self = this;
      this.postRequest("admin/saveAddProvinceRoute", {
        userName: this.provincialNetworkRouteData.userName,
        mobileArea: this.provincialNetworkRouteData.mobileArea,
        isRoute: this.provincialNetworkRouteData.isRoute,
        cm: this.provincialNetworkRouteData.cm,
        cu: this.provincialNetworkRouteData.cu,
        ct: this.provincialNetworkRouteData.ct
      }).then(res => {
        if (res.data.success === true) {
          self.$message.success("添加省网路由成功");
          self.checkData();
          self.provincialNetworkRouteData.visible = false;
        } else self.$message.error(res.data.resultMsg);
      });
    },
    trialFreeClient(row) {
      let self = this;
      this.trialFreeClientData = {
        visible: true,
        accountID: row.accountID,
        userName: row.userName,
        code: row.code === null ? "" : row.code,
        cm: "",
        cu: "",
        ct: "",
        keySwitch: 0,
        userDefinedKeyWord: "",
        userDefinedKeyLevel: 0,
        keyflag: 0,
        checkcount: 1,
        smtype: 1,
        templateflag: 0
      };
      this.postRequest("admin/getAddCheckManage", {
        accountID: row.accountID,
        userName: row.userName
      }).then(res => {
        // console.log(res);
        self.cmList = [];
        self.cuList = [];
        self.ctList = [];
        for (let item of res.data.data.cmList) {
          if (item.status === 1) {
            self.cmList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.cuList) {
          if (item.status === 1) {
            self.cuList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.ctList) {
          if (item.status === 1) {
            self.ctList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        self.trialFreeClientData.cm = res.data.data.cmList[0].gateway;
        self.trialFreeClientData.cu = res.data.data.cuList[0].gateway;
        self.trialFreeClientData.ct = res.data.data.ctList[0].gateway;
      });
    },
    submitTrialFreeClientData() {
      let self = this;
      this.$refs.trialFree.validate(valid => {
        if (valid) {
          this.postRequest(
            "admin/saveAddCheckManage",
            this.trialFreeClientData
          ).then(res => {
            self.resAlert(res.data);
            self.trialFreeClientData.visible = false;
            self.checkData();
          });
        }
      });
    },
    auditPolicy(row) {
      let self = this;
      this.auditPolicyData = {
        visible: true,
        accountID: row.accountID,
        userName: row.userName,
        cmgateway: "",
        cugateway: "",
        ctgateway: "",
        memo: ""
      };
      this.postRequest("admin/getAddCheckManage", {
        accountID: row.accountID,
        userName: row.userName
      }).then(res => {
        // console.log(res);
        self.cmList = [];
        self.cuList = [];
        self.ctList = [];
        for (let item of res.data.data.cmList) {
          if (item.status === 1) {
            self.cmList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.cuList) {
          if (item.status === 1) {
            self.cuList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.ctList) {
          if (item.status === 1) {
            self.ctList.push({
              value: item.gateway,
              label: item.gatewayname
            });
          }
        }
        self.auditPolicyData.cmgateway = res.data.data.cmList[0].gateway;
        self.auditPolicyData.cugateway = res.data.data.cuList[0].gateway;
        self.auditPolicyData.ctgateway = res.data.data.ctList[0].gateway;
      });
    },
    submitAuditPolicy() {
      let self = this;
      this.postRequest("admin/saveAddClientGwScene", {
        accountID: this.auditPolicyData.accountID,
        userName: this.auditPolicyData.userName,
        cmgateway: this.auditPolicyData.cmgateway,
        cugateway: this.auditPolicyData.cugateway,
        ctgateway: this.auditPolicyData.ctgateway,
        memo: this.auditPolicyData.memo
      }).then(res => {
        self.resAlert(res.data);
        self.auditPolicyData.visible = false;
      });
    },
    addSign(row) {
      // console.log(row);
      let self = this;
      this.postRequest("admin/getAddCheckManage", {
        accountID: row.accountID,
        userName: row.userName
      }).then(res => {
        self.cmList = [];
        self.cuList = [];
        self.ctList = [];
        for (let item of res.data.data.cmList) {
          if (item.status === 1) {
            self.cmList.push({
              value: item.id,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.cuList) {
          if (item.status === 1) {
            self.cuList.push({
              value: item.id,
              label: item.gatewayname
            });
          }
        }
        for (let item of res.data.data.ctList) {
          if (item.status === 1) {
            self.ctList.push({
              value: item.id,
              label: item.gatewayname
            });
          }
        }
      });
      this.addSignData = {
        visible: true,
        accountID: row.accountID,
        userName: row.userName,
        code: Boolean(row.code) ? row.code : "",
        signature: Boolean(row.signature) ? row.signature : "",
        extcode: "",
        extsign: "",
        ischeck: 0,
        cm: "",
        cu: "",
        ct: "",
        keyflag: 0,
        checkcount: "",
        smtype: 1,
        templateflag: 0
      };
    },
    submitAddSign() {
      let self = this;
      this.postRequest("admin/saveAddExtBindSign", {
        accountID: this.addSignData.accountID,
        userName: this.addSignData.userName,
        code: this.addSignData.code,
        signature: this.addSignData.signature,
        extcode: this.addSignData.extcode,
        extsign: this.addSignData.extsign,
        ischeck: this.addSignData.ischeck,
        cm: this.addSignData.cm,
        cu: this.addSignData.cu,
        ct: this.addSignData.ct,
        keyflag: this.addSignData.keyflag,
        checkcount: this.addSignData.checkcount,
        smtype: this.addSignData.smtype,
        templateflag: this.addSignData.templateflag
      }).then(res => {
        self.addSignData.visible = false;
        self.resAlert(res.data);
        self.checkData();
      });
    },
    checkRole() {
      let self = this;
      this.postRequest("/admin/clickShowCheck", { token: "" }).then(res => {
        if (res.data.success) {
          let codes = res.data.data.codes;
          self.adminKhglSubaccountList = codes.includes(
            "admin_khgl_subaccount_list"
          );
          self.adminUnitPrice = codes.includes("admin_unit_price");
          self.adminZdkhlbRoleNameUpdate = codes.includes(
            "admin_zdkhlb_roleName_update"
          );
          self.adminKhglChecktemplateAdd = codes.includes(
            "admin_khgl_checktemplate_add"
          );
          self.adminKhglBeforeafterChecktemplateAdd = codes.includes(
            "admin_khgl_beforeafter_checktemplate_add"
          );
          self.adminKhglProvincerouteAdd = codes.includes(
            "admin_khgl_provinceroute_add"
          );
          self.adminKhglCheckmanageAdd = codes.includes(
            "admin_khgl_checkmanage_add"
          );
          self.adminKhglCheckscenceAdd = codes.includes(
            "admin_khgl_checkscence_add"
          );
          self.adminKhglRouteinfoList = codes.includes(
            "admin_khgl_routeinfo_list"
          );
          self.adminGjzlylbAdd = codes.includes("admin_gjzlylb_add");
          self.adminKhglGwrouteAdd = codes.includes("admin_khgl_gwroute_add");
        } else {
          self.failed();
        }
      });
    },
    //转到
    routeInformation(row) {
      this.routeInformationTableData.table = [];
      let self = this;
      this.postRequest("admin/listRouteInfo", {
        accountID: row.accountID
      }).then(res => {
        // console.log(res);
        // let str =
        for (let item in res.data.data) {
          self.routeInformationTableData.table.push({
            routeName:
              item === "ctStr"
                ? "模板路由"
                : item === "mlrStr"
                ? "省网路由"
                : item === "ckStr"
                ? "免审路由"
                : item === "cgwStr"
                ? "审核路由"
                : "",
            routeData: res.data.data[item]
            // .replace(/&nbsp;/g, "")
            // .replace(/&nbsp/g, "")
            // .replace(/null/g, "null")
            // .replace(/<br \/>/g, "\n")
          });
        }
        self.routeInformationData.visible = true;
        // console.log(self.routeInformationTableData.table);
      });
    },
    failureReturn(row) {
      let self = this;
      this.postRequest("admin/getfailrefundUserData", {
        accountID: row.accountID
      }).then(res => {
        self.failureReturnData = {
          visible: true,
          accountID: res.data.data.accountID,
          userName: res.data.data.userName, //并不返回是否选中失败返还
          gateSubmitFail: false,
          gateReportFail: false
        };
      });
    },
    submitFailureReturn() {
      let self = this;
      // console.log(this.failureReturnData);
      this.postRequest("admin/savefailrefund", {
        accountID: this.failureReturnData.accountID,
        gateSubmitFail: this.failureReturnData.gateSubmitFail ? 1 : 0,
        gateReportFail: this.failureReturnData.gateReportFail ? 1 : 0
      }).then(res => {
        self.checkData();
        self.failureReturnData.visible = false;
        self.resAlert(res.data);
      });
    },
    gatewayPriceSetting(row) {
      let self = this;
      this.cuList = [];
      this.cmList = [];
      this.ctList = [];
      this.gatewayPriceSettingData.visible = true;
      this.postRequest("admin/editCustomerGatewayPrice", {
        accountId: row.accountID
      }).then(res => {
        self.gatewayPriceSettingData.userName = res.data.data.customer.userName;
        self.gatewayPriceSettingData.accountID =
          res.data.data.customer.accountID;

        let cmList = res.data.data.cmList;
        let ctList = res.data.data.ctList;
        let cuList = res.data.data.cuList;
        for (let item of cmList) {
          self.cmList.push({
            label: item.gatewayname,
            value: item.gateway
          });
        }
        for (let item of cuList) {
          self.cuList.push({
            label: item.gatewayname,
            value: item.gateway
          });
        }
        for (let item of ctList) {
          self.ctList.push({
            label: item.gatewayname,
            value: item.gateway
          });
        }
      });
    },
    //h获取价格
    cmGetChangeData() {
      let self = this;
      this.postRequest("admin/getCgpJsonData", {
        accountId: this.gatewayPriceSettingData.accountID,
        gatewayId: this.gatewayPriceSettingData.cmGateway,
        operaid: 1
      }).then(res => {
        self.gatewayPriceSettingData.cmUnitprice =
          res.data.data.cusGatewayPrice.unitprice;
      });
    },
    cuGetChangeData() {
      let self = this;
      this.postRequest("admin/getCgpJsonData", {
        accountId: this.gatewayPriceSettingData.accountID,
        gatewayId: this.gatewayPriceSettingData.cuGateway,
        operaid: 2
      }).then(res => {
        self.gatewayPriceSettingData.cuUnitprice =
          res.data.data.cusGatewayPrice.unitprice;
      });
    },
    ctGetChangeData() {
      let self = this;
      this.postRequest("admin/getCgpJsonData", {
        accountId: this.gatewayPriceSettingData.accountID,
        gatewayId: this.gatewayPriceSettingData.ctGateway,
        operaid: 3
      }).then(res => {
        self.gatewayPriceSettingData.ctUnitprice =
          res.data.data.cusGatewayPrice.unitprice;
      });
    },
    submitGatewayPriceSetting() {
      let self = this;
      this.postRequest("admin/saveEditCustomerGatewayPrice", {
        cmcheck: this.gatewayPriceSettingData.cmcheck ? 0 : 1,
        cucheck: this.gatewayPriceSettingData.cucheck ? 0 : 1,
        ctcheck: this.gatewayPriceSettingData.ctcheck ? 0 : 1,
        cmgateway: this.gatewayPriceSettingData.cmGateway,
        cugateway: this.gatewayPriceSettingData.cuGateway,
        ctgateway: this.gatewayPriceSettingData.ctGateway,
        cmPrice: this.gatewayPriceSettingData.cmUnitprice,
        cuPrice: this.gatewayPriceSettingData.cuUnitprice,
        ctPrice: this.gatewayPriceSettingData.ctUnitprice,
        accountId: this.gatewayPriceSettingData.accountID,
        userName: this.gatewayPriceSettingData.userName
      }).then(res => {
        self.checkData();
        self.gatewayPriceSettingData = {
          visible: false,
          cmGateway: "",
          cuGateway: "",
          ctGateway: "",
          cmCheck: "",
          cuCheck: "",
          ctCheck: "",
          userName: "",
          cmUnitprice: "",
          cuUnitprice: "",
          ctUnitprice: "",
          accountID: "",
          operaid: ""
        };
        self.resAlert(res.data);
      });
    },
    priceChangeRecord(row) {
      this.$router.push({
        path: "/djbgjl",
        query: {
          userName: row.userName
        }
      });
    }
  },
  created() {
    this.getSaleList();
    this.checkRole();
  }
};
</script>

<style scoped>
.widthOne {
  width: 30%;
}

.widthTwo {
  width: 70%;
}

.trStyle {
  border-bottom: 2px solid #444;
}

tr:nth-child(even) {
  background: rgb(240, 240, 240);
}

tr:nth-child(odd) {
  background: #fff;
}
</style>
