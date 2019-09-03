<template>
  <div class="container">
    <el-form inline="inline" style="width: 1000px;" v-on:keyup.enter.native="checkData">
      <el-form-item label="查询条件：">
        <el-select>
          <el-option v-for="(item,i) of condition" :label="item.label" :value="item.value" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="checkData" type="primary" plain class="fr">查询</el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="checkIn">
      <el-table border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="公司名称"></el-table-column>
        <el-table-column label="客户账号"></el-table-column>
        <el-table-column label="主账号"></el-table-column>
        <el-table-column label="所属代理"></el-table-column>
        <el-table-column label="余额（条）"></el-table-column>
        <el-table-column label="联系人"></el-table-column>
        <el-table-column label="手机"></el-table-column>
        <el-table-column label="固话"></el-table-column>
        <el-table-column label="地址"></el-table-column>
        <el-table-column label="QQ"></el-table-column>
        <el-table-column label="邮箱"></el-table-column>
        <el-table-column label="客户来源"></el-table-column>
        <el-table-column label="角色名称"></el-table-column>
        <el-table-column label="客户等级"></el-table-column>
        <el-table-column label="创建时间"></el-table-column>
        <el-table-column label="状态"></el-table-column>
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
  </div>
</template>

<script>
export default {
  name: "admin_salezdkhlb",
  data() {
    return {
      condition: [
        {
          value: 1,
          label: "客户账号"
        },
        {
          value: 2,
          label: "主账户号"
        },
        {
          value: 3,
          label: "余额（格式10-100）"
        },
        {
          value: 4,
          label: "公司名称"
        },
        {
          value: 5,
          label: "联系人"
        },
        {
          value: 6,
          label: "手机"
        }
      ],
      sum: 0
    };
  },
  methods: {
    handleSizeChange() {
      this.checkData();
    },
    handlePageChange() {
      this.checkData();
    },
    checkData() {}
  }
};
</script>

<style scoped>
</style>
