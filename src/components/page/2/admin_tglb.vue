<template>
  <div class="container">
    <el-form inline="inline" label-width="120px" v-on:keyup.enter.native="checkData">
      <el-form-item label="通道编号：">
        <el-input  v-model="gatewayId"></el-input>
      </el-form-item>
      <el-form-item label="通道名称：">
        <el-input  v-model="gatewayName"></el-input>
      </el-form-item>
      <el-form-item label="通道状态：">
        <el-select v-model="status" placeholder="请选择">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通道类型：">
        <el-select v-model="accountType" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否独享：">
        <el-select v-model="isCustom" placeholder="请选择">
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通道余额：">
        <el-select v-model="fbalance" placeholder="余额起">
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="tbalance" placeholder="余额止">
          <el-option
            v-for="item in options5"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-button type="text" @click="addPassageway">+添加通道</el-button>
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" width="50px" prop="index"></el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button @click="unlockPipe(scope.row)" type="text" v-if="scope.row.status===0">启用</el-button>
            <el-button @click="lockPipe(scope.row)" type="text" v-else>禁用</el-button>
            <!-- <el-button @click="customPipe(scope.row)" type="text" v-if="scope.row.iscustom===0">独享</el-button> -->
            <!-- <el-button @click="sharePipe(scope.row)" type="text" v-else>共享</el-button> -->
            <el-button @click="editPipeParam(scope.row)" type="text">参数</el-button>
            <!-- <el-button @click="editFinance(scope.row)" type="text">计费参数</el-button> -->
            <!-- <el-button @click="setPrice(scope.row)" type="text">设置单价</el-button> -->
          </template>
        </el-table-column>
        <el-table-column prop="gateway" label="通道编号"></el-table-column>
        <el-table-column prop="gatewayname" label="通道名称"></el-table-column>
        <el-table-column prop="accountTypeCn" label="通道类型"></el-table-column>
        <el-table-column prop="isCmCn" label="可发移动"></el-table-column>
        <el-table-column prop="isCuCn" label="可发联通"></el-table-column>
        <el-table-column prop="isCtCn" label="可发电信"></el-table-column>
        <el-table-column prop="balance" label="通道余额"></el-table-column>
        <el-table-column prop="isCustomCn" label="是否独享"></el-table-column>
        <el-table-column prop="protocol" label="所属协议"></el-table-column>
        <el-table-column prop="runGatewayId" label="运行网关"></el-table-column>
        <el-table-column prop="statusCn" label="通道状态"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="modifyoper" label="最后操作"></el-table-column>
        <el-table-column prop="modifytime" label="操作时间"></el-table-column>
      </el-table>
      <el-pagination
        class="fr"
        style="margin:10px 0"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="pageNum"
        :page-size.sync="pageSize"
         layout="sizes, prev, pager, next, jumper"
        :total="sum"
      ></el-pagination>
      <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
    </el-card>
    <!-- 添加通道弹出 -->
    <el-dialog title="添加通道" :visible.sync="addDataFlag" width="500px">
      <el-form
        :model="addData"
        label-width="120px"
        style="width: 400px"
        :rules="rules"
        ref="addData"
      >
        <el-form-item label="通道编号：" prop="gateway">
          <el-input v-model="addData.gateway" placeholder="1-3协议；4-6供应商；7-9序号"></el-input>
        </el-form-item>
        <el-form-item label="通道名称：" prop="gatewayname">
          <el-input v-model="addData.gatewayname"></el-input>
        </el-form-item>

        <el-form-item label="通道类型：">
          <el-select v-model="addData.accountType" filterable>
            <el-option
              v-for="item of accountTypeList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否独享：">
          <el-select v-model="addData.iscustom" filterable>
            <el-option
              v-for="item of iscustomList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属协议：">
          <el-select v-model="addData.protocol" filterable>
            <el-option
              v-for="item of protocolList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="运行网关：">
          <el-select v-model="addData.runGatewayId" filterable>
            <el-option
              v-for="item of runGatewayIdList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="可发移动：">
          <el-select v-model="addData.iscm" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="可发联通：">
          <el-select v-model="addData.iscu" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="可发电信：">
          <el-select v-model="addData.isct" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addData')">取 消</el-button>
        <el-button type="primary" @click="submitAdd('addData')">保存</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数弹出 -->
    <el-dialog title="修改参数" :visible.sync="editPipeFormFlag" width="800px">
      <el-form
        :model="editPipeForm"
        label-width="150px"
        style="width: 800px"
        :rules="rules"
        ref="editPipeForm"
        inline="inline"
      >
        <el-form-item label="通道编号：">
          <el-input v-model="editPipeForm.gateway" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="通道名称：">
          <el-input v-model="editPipeForm.gatewayname"></el-input>
        </el-form-item>

        <el-form-item label="通道类型：" style="display:block">
          <el-select v-model="editPipeForm.accountType" filterable>
            <el-option
              v-for="item of accountTypeList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="账号：" prop="account">
          <el-input v-model="editPipeForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="editPipeForm.password"></el-input>
        </el-form-item>

        <el-form-item label="接入号：">
          <el-input v-model="editPipeForm.sourceId"></el-input>
        </el-form-item>
        <el-form-item label="企业ID：">
          <el-input v-model="editPipeForm.spId"></el-input>
        </el-form-item>

        <el-form-item label="连接数：">
          <el-input v-model="editPipeForm.sessionNum"></el-input>
        </el-form-item>
        <el-form-item label="提交频率(条/秒)：">
          <el-input v-model="editPipeForm.submitFreq"></el-input>
        </el-form-item>

        <el-form-item label="短短信长度：" prop="shortMsgLen">
          <el-input v-model="editPipeForm.shortMsgLen"></el-input>
        </el-form-item>
        <el-form-item label="长短信长度：" prop="longMsgLen">
          <el-input v-model="editPipeForm.longMsgLen"></el-input>
        </el-form-item>

        <el-form-item label="提交地址：" prop="submitUrl">
          <el-input v-model="editPipeForm.submitUrl"></el-input>
        </el-form-item>
        <el-form-item label="提交端口：" prop="submitPort">
          <el-input v-model="editPipeForm.submitPort"></el-input>
        </el-form-item>

        <el-form-item label="可发移动：">
          <el-select v-model="editPipeForm.iscm" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="可发联通：">
          <el-select v-model="editPipeForm.iscu" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="可发电信：">
          <el-select v-model="editPipeForm.isct" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上行TD加黑名单：">
          <el-select v-model="editPipeForm.isBlack" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="网关报告类型：">
          <el-select v-model="editPipeForm.reportType" filterable>
            <el-option
              v-for="item of isList2"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上行短信类型：">
          <el-select v-model="editPipeForm.deliverType" filterable>
            <el-option
              v-for="item of isList2"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="余额类型：">
          <el-select v-model="editPipeForm.balanceType" filterable>
            <el-option
              v-for="item of isList2"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否单条网关报告：">
          <el-select v-model="editPipeForm.singleReport" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发送服务器IP：" style="display:block" prop="serverIP">
          <el-input v-model="editPipeForm.serverIP" class="long"></el-input>
        </el-form-item>
        <el-form-item label="状态报告查询地址：" style="display:block">
          <el-input v-model="editPipeForm.reportQueryUrl" class="long"></el-input>
        </el-form-item>
        <el-form-item label="上行短信查询地址：" style="display:block">
          <el-input v-model="editPipeForm.deliverQueryUrl" class="long"></el-input>
        </el-form-item>
        <el-form-item label="余额查询地址：" style="display:block">
          <el-input v-model="editPipeForm.balanceQueryUrl" class="long"></el-input>
        </el-form-item>

        <el-form-item label="是否二次转码：">
          <el-select v-model="editPipeForm.codeConvert" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否扩展：">
          <el-select v-model="editPipeForm.isExtend" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="扩展码：">
          <el-input v-model="editPipeForm.code"></el-input>
        </el-form-item>

        <el-form-item label="是否独享：">
          <el-select v-model="editPipeForm.iscustom" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="独享用户名：">
          <el-input v-model="editPipeForm.userName"></el-input>
        </el-form-item>

        <el-form-item label="是否去除签名：">
          <el-select v-model="editPipeForm.removeSign" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否必须签名：">
          <el-select v-model="editPipeForm.hasSign" filterable>
            <el-option
              v-for="item of isList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="签名位置：">
          <el-select v-model="editPipeForm.signLocation" filterable>
            <el-option
              v-for="item of signLocationList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签名括号类型：">
          <el-select v-model="editPipeForm.signCase" filterable>
            <el-option
              v-for="item of signCaseList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="开始时间：">
                    <el-input v-model="editPipeForm.startTime"></el-input>
                </el-form-item>
                <el-form-item label="结束时间：">
                    <el-input v-model="editPipeForm.endTime"></el-input>
        </el-form-item>-->
        <el-form-item label="字符串编码：">
          <el-input v-model="editPipeForm.msgfmt"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="editPipeForm.note"></el-input>
        </el-form-item>

        <el-form-item label="所属协议：">
          <el-select v-model="editPipeForm.protocol" filterable>
            <el-option
              v-for="item of protocolList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="运行网关：">
          <el-select v-model="editPipeForm.runGatewayId" filterable>
            <el-option
              v-for="item of runGatewayIdList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="扩展属性：" style="display:block;">
          <el-input :rows="4" type="textarea" v-model="editPipeForm.extParam" style="width:600px;" class="longTextArea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editPipeForm')">取 消</el-button>
        <el-button type="primary" @click="saveEditPipe('editPipeForm')">保存</el-button>
      </span>
    </el-dialog>

    <!-- 计费参数弹出 -->
    <el-dialog title="计费参数" :visible.sync="editFinanceFormFlag" width="500px">
      <el-form
        :model="editFinanceForm"
        label-width="120px"
        style="width: 400px"
        :rules="rules"
        ref="editFinanceForm"
      >
        <el-form-item label="通道编号：">
          <el-input v-model="editFinanceForm.gateway" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="通道名称：">
          <el-input v-model="editFinanceForm.gatewayname" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="通道类型：">
          <el-input v-model="editFinanceForm.cnAccountType" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="付费方式：">
          <el-select v-model="editFinanceForm.paymentMethod" filterable>
            <el-option
              v-for="item of iscustomList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="计费方式：">
          <el-select v-model="editFinanceForm.feeMethod" filterable>
            <el-option
              v-for="item of feeMethodList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否补返：">
          <el-select v-model="editFinanceForm.isBackMoney" filterable>
            <el-option
              v-for="item of isBackMoneyList"
              :label="item.label"
              :value="item.value"
              :key="item.key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="补返方式：">
          <el-input v-model="editFinanceForm.backMoneyMethod"></el-input>
        </el-form-item>
        <el-form-item label="所属单位：">
          <el-input v-model="editFinanceForm.homeUnit"></el-input>
        </el-form-item>

        <el-form-item label="合同编号：">
          <el-input v-model="editFinanceForm.pactCode"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="editFinanceForm.remark"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editFinanceForm')">取 消</el-button>
        <el-button type="primary" @click="SaveEditFinance('editFinanceForm')">保存</el-button>
      </span>
    </el-dialog>

    <!-- 设置单价弹出 -->
    <el-dialog title="设置单价" :visible.sync="setPriceFormFlag" width="500px">
      <el-form
        :model="setPriceForm"
        label-width="120px"
        style="width: 400px"
        :rules="rules"
        ref="setPriceForm"
      >
        <el-form-item label="通道：" prop="gateway">
          <el-input v-model="setPriceForm.gateway" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单价(元)：" prop="unitprice">
          <el-input v-model="setPriceForm.unitprice"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('setPriceForm')">取 消</el-button>
        <el-button type="primary" @click="saveSetPrice('setPriceForm')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "A",
  data() {
    return {
      index:0,
      addDataFlag: false,
      gatewayId: "",
      gatewayName: "",
      status: "",
      accountType: "",
      isCustom: "",
      fbalance: "",
      tbalance: "",
      sum: 0,
      pageSize: 30,
      pageNum: 1,
      checkIn: true,
      loading: false,
      tableData: [{}],
      totalPage: 1000,
      options1: [
        {
          label: "所有",
          value: 0
        },
        {
          label: "正常",
          value: 1
        },
        {
          label: "禁用",
          value: 2
        }
      ],
      type: "",
      options2: [
        {
          label: "所有",
          value: 0
        },
        {
          label: "行业",
          value: 1
        },
        {
          label: "营销",
          value: 2
        },
        {
          label: "混合",
          value: 3
        }
      ],
      exclude: "",
      options3: [
        {
          label: "所有",
          value: 0
        },
        {
          label: "独享",
          value: 1
        },
        {
          label: "共享",
          value: 2
        }
      ],
      balance1: "",
      options4: [
        {
          label: "0",
          value: 0
        },
        {
          label: "10",
          value: 10
        },
        {
          label: "100",
          value: 100
        },
        {
          label: "1000",
          value: 1000
        },
        {
          label: "10000",
          value: 10000
        },
        {
          label: "100000",
          value: 100000
        },
        {
          label: "1000000",
          value: 1000000
        }
      ],
      balance2: "",
      options5: [
        {
          label: "0",
          value: 0
        },
        {
          label: "10",
          value: 10
        },
        {
          label: "100",
          value: 100
        },
        {
          label: "1000",
          value: 1000
        },
        {
          label: "10000",
          value: 10000
        },
        {
          label: "100000",
          value: 100000
        },
        {
          label: "1000000",
          value: 1000000
        }
      ],
      //新增通道参数
      addData: {
        gateway: "",
        gatewayname: "",
        accountType: "",
        iscustom: "",
        protocol: "",
        runGatewayId: "",
        iscm: "",
        iscu: "",
        isct: ""
      },
      rules: {
        gatewayname: [{ required: true, message: "不能为空", trigger: "blur" }],
        account: [{ required: true, message: "不能为空", trigger: "blur" }],
        password: [{ required: true, message: "不能为空", trigger: "blur" }],
        submitUrl: [{ required: true, message: "不能为空", trigger: "blur" }],
        submitPort: [{ required: true, message: "不能为空", trigger: "blur" }],
        unitprice: [{ required: true, message: "不能为空", trigger: "blur" }],
        shortMsgLen: [{ required: true, message: "不能为空", trigger: "blur" }],
        longMsgLen: [{ required: true, message: "不能为空", trigger: "blur" }],
        serverIP:[{ required: true, message: "不能为空", trigger: "blur" }]
      },
      protocolList: [],
      runGatewayIdList: [],
      isList: [
        { key: 0, label: "否", value: 0 },
        { key: 1, label: "是", value: 1 }
      ],
      accountTypeList: [
        {
          key: 1,
          label: "行业",
          value: 1
        },
        {
          key: 2,
          label: "营销",
          value: 2
        },
        {
          key: 3,
          label: "混合",
          value: 3
        }
      ],
      isList2: [
        {
          key: 0,
          label: "无",
          value: 0
        },
        {
          key: 1,
          label: "推送",
          value: 1
        },
        {
          key: 2,
          label: "查询",
          value: 2
        }
      ],
      iscustomList: [
        {
          key: 1,
          label: "独享",
          value: 1
        },
        {
          key: 2,
          label: "共享",
          value: 2
        }
      ],
      signLocationList: [
        {
          key: 0,
          label: "无要求",
          value: 0
        },
        {
          key: 1,
          label: "签名前置",
          value: 1
        },
        {
          key: 2,
          label: "签名后置",
          value: 2
        }
      ],
      signCaseList: [
        {
          key: 0,
          label: "所有",
          value: 0
        },
        {
          key: 1,
          label: "半角括号【】",
          value: 1
        },
        {
          key: 2,
          label: "半角括号[]",
          value: 2
        }
      ],
      //参数操作数据
      editPipeFormFlag: false,
      editPipeForm: {
        gateway: "",
        gatewayId: "",
        gatewayname: "",
        accountType: "",
        account: "",
        password: "",
        sourceId: "",
        spId: "",
        sessionNum: "",
        submitFreq: "",
        shortMsgLen: "",
        longMsgLen: "",
        submitUrl: "",
        submitPort: "",
        iscm: "",
        iscu: "",
        isct: "",
        isBlack: "",
        reportType: "",
        deliverType: "",
        balanceType: "",
        singleReport: "",
        reportQueryUrl: "",
        deliverQueryUrl: "",
        balanceQueryUrl: "",
        codeConvert: "",
        isExtend: "",
        code: "",
        iscustom: "",
        userName: "",
        removeSign: "",
        hasSign: "",
        signLocation: "",
        signCase: "",
        startTime: "",
        endTime: "",
        msgfmt: "",
        note: "",
        protocol: "",
        runGatewayId: "",
        extParam: "",
        serverIP: ""
      },
      channelParam: {},
      pipe: {},
      //计费参数
      editFinanceFormFlag: false,
      editFinanceForm: {
        gateway: "",
        gatewayname: "",
        cnAccountType: "",
        paymentMethod: "",
        feeMethod: "",
        isBackMoney: "",
        backMoneyMethod: "",
        homeUnit: "",
        pactCode: "",
        remark: ""
      },
      feeMethodList: [
        {
          key: 1,
          label: "成功+未知",
          value: 1
        },
        {
          key: 3,
          label: "成功",
          value: 3
        },
        {
          key: 2,
          label: "成功+未知+失败",
          value: 2
        }
      ],
      isBackMoneyList: [
        {
          key: 0,
          label: "否",
          value: 0
        },
        {
          key: 1,
          label: "是",
          value: 1
        }
      ],
      //设置单价
      setPriceFormFlag: false,
      setPriceForm: {
        gateway: "",
        gatewayName: "",
        unitprice: ""
      }
    };
  },
  methods: {
    resetForm(formName) {
      this.addData = {};
      this.addDataFlag = false;
      this.editPipeFormFlag = false;
      this.editFinanceFormFlag = false;
      this.setPriceFormFlag = false;
      this.setPriceForm.unitprice = "";
    },
    //添加通道操作
    addPassageway() {
      this.runGatewayIdList = [];
      this.protocolList = [];
      let self = this;
      this.addDataFlag = true;
      this.postRequest("admin/addPipe", {
        t: ""
      }).then(res => {
        let gatewayProtocols = res.data.data.gatewayProtocols;
        let runGateways = res.data.data.runGateways;
        for (let item of gatewayProtocols) {
          self.protocolList.push({
            key: item.id,
            label: item.protocol,
            value: item.protocol
          });
        }
        for (let item of runGateways) {
          self.runGatewayIdList.push({
            key: item.id,
            label: item.gatewayName,
            value: item.gatewayId
          });
        }
      });
    },
    //保存添加通道
    submitAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addDataFlag = false;
          let self = this;
          this.postRequest("admin/saveAddPipe", {
            gateway: this.addData.gateway,
            gatewayname: this.addData.gatewayname,
            accountType: this.addData.accountType,
            iscustom: this.addData.iscustom,
            protocol: this.addData.protocol,
            runGatewayId: this.addData.runGatewayId,
            iscm: this.addData.iscm,
            iscu: this.addData.iscu,
            isct: this.addData.isct
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
            self.addData = {
              gateway: "",
              gatewayname: "",
              accountType: "",
              iscustom: "",
              protocol: "",
              runGatewayIdList: "",
              iscm: "",
              iscu: "",
              isct: ""
            };
          });
        } else {
          return false;
        }
      });
    },
    //启用
    unlockPipe(row) {
      let self = this;
      this.$confirm(`确认启用【${row.gatewayname}】?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/unlockPipe", { gatewayId: row.gateway })
            .then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
        })
        .catch(() => {});
    },
    //禁用
    lockPipe(row) {
      let self = this;
      this.$confirm(`确认禁用【${row.gatewayname}】?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/lockPipe", { gatewayId: row.gateway })
            .then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
        })
        .catch(() => {});
    },
    //共享
    sharePipe(row) {
      let self = this;
      this.$confirm(`确认设置通道【${row.gatewayname}】为共享通道?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/sharePipe", { gatewayId: row.gateway })
            .then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
        })
        .catch(() => {});
    },
    //独享
    customPipe(row) {
      let self = this;
      this.$confirm(`确认设置通道【${row.gatewayname}】为独享通道?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/customPipe", { gatewayId: row.gateway })
            .then(res => {
              self.resAlert(res.data);
              self.checkData();
            });
        })
        .catch(() => {});
    },
    //参数查看
    editPipeParam(row) {
      this.protocolList = [];
      this.runGatewayIdList = [];
      let self = this;
      this.editPipeFormFlag = true;
      this.postRequest("admin/editPipeParam", {
        gatewayId: row.gateway
      }).then(res => {
        console.log(res);
        let channelParam = res.data.data.channelParam;
        let pipe = res.data.data.pipe;
        self.editPipeForm.account = channelParam.account;
        self.editPipeForm.password = channelParam.password;
        self.editPipeForm.submitUrl = channelParam.submitUrl;
        self.editPipeForm.reportQueryUrl = channelParam.reportQueryUrl;
        self.editPipeForm.balanceQueryUrl = channelParam.balanceQueryUrl;
        self.editPipeForm.deliverQueryUrl = channelParam.deliverQueryUrl;
        self.editPipeForm.serverIP = channelParam.serverIP;
        self.editPipeForm.balanceType = channelParam.balanceType;
        self.editPipeForm.codeConvert = channelParam.codeConvert;
        self.editPipeForm.deliverType = channelParam.deliverType;
        self.editPipeForm.gateway = channelParam.gatewayId;
        self.editPipeForm.gatewayId = channelParam.gatewayId;
        self.editPipeForm.gatewayname = channelParam.gatewayName;
        self.editPipeForm.hasSign = channelParam.hasSign;
        self.editPipeForm.isBlack = channelParam.isBlack;
        self.editPipeForm.iscustom = channelParam.isCustom;
        self.editPipeForm.isExtend = channelParam.isExtend;
        self.editPipeForm.longMsgLen = channelParam.longMsgLen;
        self.editPipeForm.msgfmt = channelParam.msgfmt;
        self.editPipeForm.protocol = channelParam.protocol;
        self.editPipeForm.removeSign = channelParam.removeSign;
        self.editPipeForm.reportType = channelParam.reportType;
        self.editPipeForm.sessionNum = channelParam.sessionNum;
        self.editPipeForm.shortMsgLen = channelParam.shortMsgLen;
        self.editPipeForm.signCase = channelParam.signCase;
        self.editPipeForm.signLocation = channelParam.signLocation;
        self.editPipeForm.singleReport = channelParam.singleReport;
        self.editPipeForm.submitFreq = channelParam.submitFreq;
        self.editPipeForm.submitPort = channelParam.submitPort;
        self.editPipeForm.runGatewayId = channelParam.runGatewayId;
        self.editPipeForm.sourceId = channelParam.sourceId;
        self.editPipeForm.spId = channelParam.spId;
        self.editPipeForm.code = channelParam.code;
        self.editPipeForm.userName = channelParam.userName;
        self.editPipeForm.extParam = channelParam.extParam;

        self.editPipeForm.accountType = pipe.accountType;
        self.editPipeForm.iscm = pipe.iscm;
        self.editPipeForm.iscu = pipe.iscu;
        self.editPipeForm.isct = pipe.isct;
        self.editPipeForm.iscustom = pipe.iscustom;
        let gatewayProtocols = res.data.data.gatewayProtocols;
        let runGateways = res.data.data.runGateways;
        for (let item of gatewayProtocols) {
          self.protocolList.push({
            key: item.id,
            label: item.protocol,
            value: item.protocol
          });
        }
        for (let item of runGateways) {
          self.runGatewayIdList.push({
            key: item.id,
            label: item.gatewayName,
            value: item.gatewayId
          });
        }
      });
    },
    //保存修改参数
    saveEditPipe(formName) {
      this.channelParam = {
        gatewayId: this.editPipeForm.gatewayId,
        gatewayName: this.editPipeForm.gatewayname,
        account: this.editPipeForm.account,
        password: this.editPipeForm.password,
        sourceId: this.editPipeForm.sourceId,
        spId: this.editPipeForm.spId,
        sessionNum: this.editPipeForm.sessionNum,
        submitFreq: this.editPipeForm.submitFreq,
        shortMsgLen: this.editPipeForm.shortMsgLen,
        longMsgLen: this.editPipeForm.longMsgLen,
        submitUrl: this.editPipeForm.submitUrl,
        submitPort: this.editPipeForm.submitPort,
        isBlack: this.editPipeForm.isBlack,
        reportType: this.editPipeForm.reportType,
        deliverType: this.editPipeForm.deliverType,
        balanceType: this.editPipeForm.balanceType,
        singleReport: this.editPipeForm.singleReport,
        reportQueryUrl: this.editPipeForm.reportQueryUrl,
        deliverQueryUrl: this.editPipeForm.deliverQueryUrl,
        balanceQueryUrl: this.editPipeForm.balanceQueryUrl,
        codeConvert: this.editPipeForm.codeConvert,
        isExtend: this.editPipeForm.isExtend,
        code: this.editPipeForm.code,
        userName: this.editPipeForm.userName,
        removeSign: this.editPipeForm.removeSign,
        hasSign: this.editPipeForm.hasSign,
        signLocation: this.editPipeForm.signLocation,
        signCase: this.editPipeForm.signCase,
        startTime: this.editPipeForm.startTime,
        endTime: this.editPipeForm.endTime,
        msgfmt: this.editPipeForm.msgfmt,
        note: this.editPipeForm.note,
        protocol: this.editPipeForm.protocol,
        runGatewayId: this.editPipeForm.runGatewayId,
        extParam: this.editPipeForm.extParam,
        serverIP: this.editPipeForm.serverIP
      };
      this.pipe = {
        accountType: this.editPipeForm.accountType,
        iscm: this.editPipeForm.iscm,
        iscu: this.editPipeForm.iscu,
        isct: this.editPipeForm.isct,
        iscustom: this.editPipeForm.iscustom
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editPipeFormFlag = false;
          let self = this;
          this.postRequest("admin/saveEditPipeParam", {
            channelParam: this.channelParam,
            pipe: this.pipe
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
            self.editPipeForm = {
              gateway: "",
              gatewayname: "",
              accountType: "",
              account: "",
              password: "",
              sourceId: "",
              spId: "",
              sessionNum: "",
              submitFreq: "",
              shortMsgLen: "",
              longMsgLen: "",
              submitUrl: "",
              submitPort: "",
              iscm: "",
              iscu: "",
              isct: "",
              isBlack: "",
              reportType: "",
              deliverType: "",
              balanceType: "",
              singleReport: "",
              reportQueryUrl: "",
              deliverQueryUrl: "",
              balanceQueryUrl: "",
              codeConvert: "",
              isExtend: "",
              code: "",
              iscustom: "",
              userName: "",
              removeSign: "",
              hasSign: "",
              signLocation: "",
              signCase: "",
              startTime: "",
              endTime: "",
              msgfmt: "",
              note: "",
              protocol: "",
              runGatewayId: "",
              extParam: "",
              serverIP: ""
            };
          });
        } else {
          return false;
        }
      });
    },
    //计费参数查看
    editFinance(row) {
      this.editFinanceFormFlag = true;
      let self = this;
      this.postRequest("admin/editGatewayFinance", {
        gatewayId: row.gateway
      }).then(res => {
        let dataObj = res.data.data.gatewayFinance;
        self.editFinanceForm.gateway = dataObj.gateway;
        self.editFinanceForm.gatewayname = dataObj.gatewayname;
        self.editFinanceForm.cnAccountType = dataObj.cnAccountType;
        self.editFinanceForm.feeMethod = dataObj.feeMethod;
        self.editFinanceForm.paymentMethod = dataObj.paymentMethod;
        self.editFinanceForm.homeUnit = dataObj.homeUnit;
        self.editFinanceForm.id = dataObj.id;
        self.editFinanceForm.isBackMoney = dataObj.isBackMoney;
        self.editFinanceForm.backMoneyMethod = dataObj.backMoneyMethod;
        self.editFinanceForm.pactCode = dataObj.pactCode;
        self.editFinanceForm.remark = dataObj.remark;
      });
    },
    //保存计费参数修改
    SaveEditFinance(formName) {
      let self = this;
      this.postRequest("admin/saveEditGatewayFinance", {
        gatewayId: this.editFinanceForm.gateway,
        gatewayName: this.editFinanceForm.gatewayname,
        accountTypeCn: this.editFinanceForm.cnAccountType,
        paymentMethod: this.editFinanceForm.paymentMethod,
        feeMethod: this.editFinanceForm.feeMethod,
        isBackMoney: this.editFinanceForm.isBackMoney,
        backMoneyMethod: this.editFinanceForm.backMoneyMethod,
        homeUnit: this.editFinanceForm.homeUnit,
        pactCode: this.editFinanceForm.pactCode,
        remark: this.editFinanceForm.remark
      }).then(res => {
        self.editFinanceFormFlag = false;
        self.resAlert(res.data);
        self.checkData();
        self.editFinanceForm = {
          gateway: "",
          gatewayname: "",
          cnAccountType: "",
          paymentMethod: "",
          feeMethod: "",
          isBackMoney: "",
          backMoneyMethod: "",
          homeUnit: "",
          pactCode: "",
          remark: ""
        };
      });
    },
    //设置单价
    setPrice(row) {
      console.log(row);
      this.setPriceFormFlag = true;
      let self = this;
      this.postRequest("admin/gatewayPrice", {
        gatewayId: row.gateway,
        gatewayName: row.gatewayName
      }).then(res => {
        console.log(res);
        self.setPriceForm.gateway = res.data.data.gatewayId;
        self.setPriceForm.gatewayName = res.data.data.gatewayName;
        self.setPriceForm.unitprice = res.data.data.unitprice;
      });
    },
    //保存单价设置
    saveSetPrice(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setPriceFormFlag = false;
          let self = this;
          this.postRequest("admin/saveGatewayPrice", {
            gatewayId: this.setPriceForm.gateway,
            gatewayName: this.setPriceForm.gatewayName,
            unitprice: this.setPriceForm.unitprice
          }).then(res => {
            self.resAlert(res.data);
            self.checkData();
            self.setPriceForm.unitprice = "";
          });
        } else {
          return false;
        }
      });
    },
    handleSizeChange() {
      // this.tableData = [];
      this.checkData();
    },
    handlePageChange() {
      // this.tableData = [];
      this.checkData();
    },
    handleCommand(command) {
      // console.log(command);
      this[command.name] = true;
    },
    checkData() {
      this.tableData = [];
      this.checkIn = true;
      this.loading = true;
      let self = this;
      this.postRequest("admin/listPipe", {
        gatewayId: this.gatewayId,
        gatewayName: this.gatewayName,
        status: this.status,
        accountType: this.accountType,
        isCustom: this.isCustom,
        fbalance: this.fbalance,
        tbalance: this.tbalance,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.tableData = [];
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.page.totalCount;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            id: item.id,
            gateway: item.gateway,
            gatewayname: item.gatewayname,
            accountTypeCn: item.accountTypeCn,
            accountType: item.accountType,
            cm: item.cm, //移动
            cu: item.cu, //联通
            ct: item.ct, //电信
            isCmCn: item.isCmCn,
            isCtCn: item.isCtCn,
            isCuCn: item.isCuCn,
            balance: item.balance,
            iscustom: item.iscustom,
            isCustomCn: item.isCustomCn,
            protocol: item.protocol,
            runGatewayId: item.runGatewayId,
            status: item.status,
            statusCn: item.statusCn,
            createtime: item.createtime,
            modifyoper: item.modifyoper,
            modifytime: item.modifytime
          });
          self.index++;
        }
      });
    }
  },
  mounted() {
    this.checkData();
  }
};
</script>

<style scoped>
.el-dialog {
  width: 800px !important;
  text-align: left;
}

</style>
