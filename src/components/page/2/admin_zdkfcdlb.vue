<template>
  <div class="wrapper">
    <div class="mainContainer">
      <div class="sideBar" width="25%" height="80%">
        <el-tree
          :expand-on-click-node="spreadFlag"
          highlight-current
          :data="menuList"
          :props="defaultProps"
          default-expand-all
          :indent="indent"
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="!delNodeFlag &&node.level !==4">
              <i class="el-icon-plus blue" type="text" size="mini" @click="() => append(data)"></i>
            </span>
            <span v-if="!delNodeFlag">
              <i class="el-icon-delete red" type="text" size="mini" @click="() => remove(node, data)"></i>
            </span>
          </span>
        </el-tree>
      </div>

      <div class="content">
        <div class="formWrap" v-if="menuFlag">
          <el-form :model="form" :rules="rules" ref="form" label-width="120px">
            <el-form-item label="菜单名称：" :label-width="formLabelWidth" prop="menuNameCn">
              <el-input v-model="form.menuNameCn" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 菜单名称,菜单简称,级别,父菜单,url,是否显示,是否快速导航,备注,菜单顺序 -->
            <el-form-item label="菜单简称：" :label-width="formLabelWidth" prop="menuName">
              <el-input v-model="form.menuName" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="url：" :label-width="formLabelWidth" prop="url" v-if="urlFlag">
              <el-input v-model="form.url" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="级别：" :label-width="formLabelWidth" prop="level">
              <el-input v-model="form.level" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item
              label="父菜单："
              :label-width="formLabelWidth"
              prop="parentMenuName"
              v-if="parentMenuNameFlag"
            >
              <el-input v-model="form.parentMenuName" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="序号：" :label-width="formLabelWidth" prop="seq" v-if="seqFlag">
              <el-input v-model="form.seq" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="是否显示：" v-if="isShowFlag">
              <el-select v-model="form.isShow">
                <el-option
                  v-for="item in isShowList"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="快速导航：" v-if="isFastNavFlag">
              <el-select v-model="form.isFastNav">
                <el-option
                  v-for="item in isFastNavList"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="备注：" :label-width="formLabelWidth" prop="info">
              <el-input type="textarea" v-model="form.info" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>

          <hr>
          <el-button type="primary" @click="saveMenu('form')" class="btn">更新菜单</el-button>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="buttonWrap">
        <el-button type="primary" @click="modify('form')">{{delNodeFlag?"编辑":"退出编辑"}}</el-button>
        <el-button @click="close('form')">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      spreadFlag: false, //点击node 阻止展开
      delNodeFlag: true,
      menuFlag: false,

      urlFlag: true,
      parentMenuNameFlag: true,
      seqFlag: true,
      isShowFlag: true,
      isFastNavFlag: true,

      form: {
        nodeData: {},
        menuNameCn: "",
        menuName: "",
        url: "",
        level: "",
        parentMenuName: "",
        seq: "",
        isShow: "",
        isFastNav: "",
        info: "",
        type: "customer_menu"
      },
      formLabelWidth: "120px",
      rules: {
        menuNameCn: [{ required: true, message: "不能为空", trigger: "blur" }],
        menuName: [{ required: true, message: "不能为空", trigger: "blur" }],
        url: [{ required: true, message: "不能为空", trigger: "blur" }],
        seq: [{ required: true, message: "不能为空", trigger: "blur" }]
      },

      isShowList: [
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
      isFastNavList: [
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

      indent: 32,
      menuList: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    succeed(message) {
      this.$message({
        message: message,
        type: "success"
      });
    },
    failed(message) {
      this.$message.error(message);
    },
    saveMenu(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          let params = `${this.form.menuNameCn},${this.form.menuName},${
            this.form.level
          },${this.form.parentMenuName},${this.form.url},${this.form.isShow},${
            this.form.isFastNav
          },${this.form.info},${this.form.seq}`;
          this.postRequest("admin/saveAddAuthMenu", {
            type: this.form.type,
            params: params
          }).then(res => {

            if (res.data.success) {
              self.succeed(res.data.data);
              self.checkData();
            } else {
              self.failed(res.data.data);
            }
          });
          this.menuFlag = false;
        } else {
          return false;
        }
      });
    },
    modify() {
      //打开、关闭修改状态
      this.delNodeFlag = !this.delNodeFlag;
      if (this.delNodeFlag) {
        this.checkData();
      }
    },
    close() {
      this.resetSetItem('watchTagClose', this.$route.path);
      this.$router.push({
        path: sessionStorage.getItem("mainPage")
      });
    },
    handleNodeClick(data) {
      if (data.label === "菜单列表") {
        return;
      } else {
        this.menuFlag = true;
        let self = this;
        //修改操作
        switch (data.level) {
          case 0:
            if (this.delNodeFlag) {
              this.menuFlag = true;
              this.urlFlag = false;
              this.parentMenuNameFlag = false;
              this.seqFlag = true;
              this.isShowFlag = true;
              this.isFastNavFlag = true;
              break;
            }
          case 1:
            this.menuFlag = true;
            this.urlFlag = false;
            this.parentMenuNameFlag = false;
            this.seqFlag = true;
            this.isShowFlag = true;
            this.isFastNavFlag = true;
            break;
          case 2:
            this.menuFlag = true;
            this.urlFlag = true;
            this.parentMenuNameFlag = true;
            this.seqFlag = true;
            this.isShowFlag = true;
            this.isFastNavFlag = true;
            break;
          case 3:
            this.menuFlag = true;
            this.urlFlag = false;
            this.parentMenuNameFlag = true;
            this.seqFlag = false;
            this.isShowFlag = false;
            this.isFastNavFlag = false;
            break;
          default:
            return;
        }

        this.form.menuNameCn = data.menuNameCn;
        this.form.menuName = data.menuName;
        this.form.url = data.url;
        this.form.level = data.level;
        this.form.parentMenuName = data.parentMenuName;
        this.form.seq = data.seq;
        this.form.isShow = data.isShow;
        this.form.isFastNav = data.isFastNav;
        this.form.info = data.info;
      }
    },
    remove(node, data) {
      //删除操作

      let self = this;
      this.$confirm(`此操作将删除：${data.menuName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self
            .postRequest("admin/deleteAuthMenu", {
              menuName: data.menuName,
              level: data.level,
              type: "customer_menu"
            })
            .then(res => {

              if (res.data.success) {
                self.succeed(res.data.data);
                this.menuFlag = false;
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(
                  d => d.menuName === data.menuName
                );
                children.splice(index, 1);
              } else {
                self.failed(res.data.data);
              }
            });
        })
        .catch(() => {});
    },
    append(data) {

      const newChild = {
        label: "新增item",
        menuNameCn: "新增item",
        menuName: "customer_",
        level: data.level + 1,
        parentMenuName: data.menuName,
        info: "",
        seq: data.seq,
        children: []
      };
      if (!data.children) {
        this.$set(data, "children", []);
      }

      // this.handleNodeClick(data);
      data.children.push(newChild);
    },
    checkData() {
      this.menuList = [
        {
          label: "菜单列表",
          menuNameCn: "菜单列表",
          level: 0,
          seq: 0,
          info: "",
          children: []
        }
      ];
      let levelOneList = [];
      let levelTwoList = [];
      let levelZeroList = [];
      let self = this;
      this.postRequest("admin/listAuthMenuCustomer", {}).then(res => {
        for (let item of res.data.data.menuList) {
          if (item.level === 1) {
            //第一级菜单
            levelOneList.push(item);
          }
          if (item.level === 2) {
            //第二级菜单
            levelTwoList.push(item);
          }
          if (item.level === 0) {
            //第三级菜单
            levelZeroList.push(item);
          }
        }

        for (let i of levelOneList) {
          self.menuList[0].children.push({
            label: i.menuNameCn,
            menuNameCn: i.menuNameCn,
            menuName: i.menuName,
            url: i.url,
            level: i.level,
            parentMenuName: i.parentMenuName,
            seq: i.seq,
            isShow: i.isShow,
            isFastNav: i.isFastNav,
            info: i.info,
            children: []
          });
        }
        for (let i of self.menuList[0].children) {
          for (let j of levelTwoList) {
            if (j.parentMenuName === i.menuName) {
              //双层循环，j.parentMenuName === i.menuName说明j是i的儿子
              i.children.push({
                label: j.menuNameCn,
                menuNameCn: j.menuNameCn,
                menuName: j.menuName,
                url: j.url,
                level: j.level,
                parentMenuName: j.parentMenuName,
                seq: j.seq,
                isShow: j.isShow,
                isFastNav: j.isFastNav,
                info: j.info,
                children: []
              });
            }
          }
        }
        for (let i of self.menuList[0].children) {
          for (let j of i.children) {
            for (let k of levelZeroList) {
              if (k.parentMenuName === j.menuName) {
                //三层循环，k.parentMenuName === j.menuName说明k是j的儿子
                j.children.push({
                  label: k.menuNameCn,
                  menuNameCn: k.menuNameCn,
                  menuName: k.menuName,
                  url: k.url,
                  level: 3, //三级菜单渲染level为3
                  parentMenuName: k.parentMenuName,
                  seq: k.seq,
                  isShow: k.isShow,
                  isFastNav: k.isFastNav,
                  info: k.info,
                  children: []
                });
              }
            }
          }
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
.red{
  color: red;
}
.blue{
  color: blue;
}
.wrapper {
  position: relative;
  background-color: #fff;
  width: 100%;
  height: 100%;
}
.mainContainer {
  width: 100%;
  height: 85%;
  display: flex;
}
.sideBar {
  width: 30%;
  height: 100%;
  overflow: auto;
}
.content {
  overflow: auto;
  width: 70%;
  height: 100%;
}
.formWrap {
  position: relative;
  width: 60%;
  margin: 0 auto;
}
.formWrap .btn {
  position: absolute;
  left: 50%;
  margin: 10px 0 0 0;
  transform: translateX(-50%);
}
.footer {
  border-top: 1px solid #1590b6;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 10%;
}
.buttonWrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
