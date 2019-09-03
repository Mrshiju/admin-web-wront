<template>
  <div class="container">
    <el-form v-on:keyup.enter.native="checkData" label-width="120px" inline="inline">
      <el-form-item label="模板编号：">
        <el-input  v-model="tid"></el-input>
      </el-form-item>
      <el-form-item label="模板名称：">
        <el-input  v-model="templetName"></el-input>
      </el-form-item>
      <el-form-item label="网关编号：">
        <el-input  v-model="gatewayId"></el-input>
      </el-form-item>
      <el-form-item label="wav编号：">
        <el-input  v-model="wavId"></el-input>
      </el-form-item>
      <el-form-item label="客户名：">
        <el-input  v-model="createUser"></el-input>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select v-model="optionValue">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间：">
       <el-date-picker v-model="startDate" type="date"></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间：">
       <el-date-picker v-model="endDate" type="date"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="checkData" type="primary" plain>查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 审核操作弹出框 -->
    <el-dialog title="审核" :visible.sync="callTempletCheckFlag">
      <el-form :model="callTempletCheckForm" ref="form" label-width="120px">
        <el-form-item label="模板id：" prop="tid">
          <el-input v-model="callTempletCheckForm.tid" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="模板内容：" prop="templetName">
          <el-input v-model="callTempletCheckForm.templetName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="语音文件名：" prop="wavName">
          <el-input v-model="callTempletCheckForm.wavName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="语言文件路径：" prop="wavPath">
          <el-input v-model="callTempletCheckForm.wavPath" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="发送文本内容：" prop="sendContent">
          <el-input v-model="callTempletCheckForm.sendContent" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="可用网关：">
          <el-select v-model="callTempletCheckForm.gatewayName">
            <el-option
              v-for="item in callTempletCheckOptions"
              :key="item.key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="命令：" prop="command">
          <el-input v-model="callTempletCheckForm.command" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-radio v-model="callTempletCheckForm.status" label="1">通过</el-radio>
          <el-radio v-model="callTempletCheckForm.status" label="2">不通过</el-radio>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCallTempletCheck('callTempletCheckForm')">添加</el-button>
        <el-button @click="cancelCallTempletCheck('callTempletCheckForm')">取消</el-button>
      </div>
    </el-dialog>
    <el-card v-if="checkIn">
      <el-table border ref="table" v-loading="loading" :data="tableData" stripe>
        <el-table-column label="序号" prop="index"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="callTempletCheck(scope.row)"
              v-if="scope.row.status===0"
            >审核</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="statusCn" label="状态"></el-table-column>
        <el-table-column prop="tid" label="模板编号"></el-table-column>
        <el-table-column prop="templetName" label="模板名称"></el-table-column>
        <el-table-column prop="gatewayId" label="网关编号"></el-table-column>
        <el-table-column prop="gatewayContent" label="网关内容"></el-table-column>
        <el-table-column prop="wavId" label="wav编号"></el-table-column>
        <el-table-column prop="wavName" label="语音名称"></el-table-column>
        <el-table-column prop="wavPath" label="语音路径"></el-table-column>
        <el-table-column prop="sendContent" label="发送文本内容"></el-table-column>
        <el-table-column prop="command" label="命令"></el-table-column>
        <!-- 后台数据未见客户名数据 暂用wavName代替 -->
        <el-table-column prop="createUser" label="客户名"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateUser" label="审核人"></el-table-column>
        <el-table-column prop="updateTime" label="审核时间"></el-table-column>
      </el-table>
      <el-pagination
        class="fr"
        style="margin:10px 0"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="pageNum"
        :page-size.sync="pageSize"
        :total="sum"
         layout="sizes, prev, pager, next, jumper"
      ></el-pagination>
      <span class="fr" style="padding-top: 15px;font-size: 14px;">共{{sum}}条，</span>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "admin_fxbglb",
  data() {
    return {
      callTempletCheckFlag: false,
      callTempletCheckForm: {
        tid: "",
        templetName: "",
        wavName: "",
        wavPath: "",
        sendContent: "",
        gatewayName: "",
        command: "",
        status: 1
      },
      callTempletCheckOptions: [],
      tid: "",
      templetName: "",
      gatewayId: "",
      wavId: "",
      wavName: "",
      createUser: "",
      status: "",
      startDate: new Date(),
      endDate: new Date(),
      optionValue: "",
      pageNum: 1,
      pageSize: 30,
      sum: 0,
      index: 0,
      tableData: [],
      checkIn: false,
      loading: false,
      options: [
        {
          value: "1",
          label: "所有"
        },
        {
          value: "2",
          label: "可用"
        },
        {
          value: "3",
          label: "不可用"
        }
      ]
    };
  },
  methods: {
    ////
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    failed(message) {
      this.$message.error(message);
    },
    //审核操作
    callTempletCheck(row) {
      this.callTempletCheckFlag = true;
      this.callTempletCheckForm = {
        id: row.id,
        gatewayId: row.gatewayId,
        tid: row.tid,
        templetName: row.templetName,
        wavName: row.wavName,
        wavPath: row.wavPath,
        wavId: row.wavId,
        sendContent: row.sendContent,
        gatewayName: row.gatewayName,
        command: row.command,
        status: row.status
      };
      this.callTempletCheckOptions = [];
      let self = this;
      this.postRequest("admin/getAvailableGateway", {}).then(res => {
        for (let item of res.data.data.availableGateway) {
          self.callTempletCheckOptions.push({
            key: item.gateway_id,
            label: item.gateway_name,
            value: item.gateway_id
          });
        }
      });
    },
    //保存审核
    saveCallTempletCheck() {
      this.callTempletCheckFlag = false;
      let self = this;
      this.postRequest("admin/updateCallTempletCheck", {
        id: this.callTempletCheckForm.id,
        wavId: this.callTempletCheckForm.wavId,
        gatewayId: this.callTempletCheckForm.gatewayId,
        command: this.callTempletCheckForm.command,
        status: this.callTempletCheckForm.status
      }).then(res => {
        if (res.data.success) {
          self.succeed(res.data.message);
        } else {
          self.failed(res.data.message);
        }
      });
    },
    //取消保存
    cancelCallTempletCheck() {
      this.callTempletCheckFlag = false;
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
      this.postRequest("admin/calltempletchecklist", {
        tid: this.tid,
        templetName: this.templetName,
        gatewayId: this.gatewayId,
        wavId: this.wavId,
        wavName: this.wavName,
        createUser: this.createUser,
        status: this.status,
        startDate: this.formatDate(this.startDate),
        endDate: this.formatDate(this.endDate),
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        self.loading = false;
        this.index = Number(res.data.data.page.pageNum - 1) * Number(res.data.data.page.pageSize) + 1;
        self.sum = res.data.data.data.length;
        for (let item of res.data.data.data) {
          self.tableData.push({
            index: self.index,
            tid: item.tid,
            templetName: item.templet_name,
            gatewayId: item.gateway_id,
            wavId: item.wav_id,
            wavName: item.wav_name,
            createUser: item.create_user,
            status: item.status,
            statusCn: item.status === 1 ? "通过" : "未通过",
            gatewayContent: item.gateway_content,
            wavPath: item.wav_path,
            sendContent: item.send_content,
            command: item.command,
            createUser: item.create_user,
            createTime: item.create_time,
            updateUser: item.update_user,
            updateTime: item.update_time,
            id: item.id
          });
          self.index++;
        }
      });
    },
    cancel() {}
  }
};
</script>

<style scoped>
</style>
