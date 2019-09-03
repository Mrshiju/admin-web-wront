<template>
  <div class="navTabList el-tabs__nav-scroll" id="tabsNav" v-if="showTags">
    <el-tabs
      class="tags"
      v-model="activeIndex"
      type="card"
      closable
      @tab-remove="closeTags"
      @tab-click="tabClick"
    >
      <el-tab-pane
        :key="item.path"
        v-for="(item, index) in tagsList"
        :label="item.title"
        :name="item.path"
      ></el-tab-pane>
    </el-tabs>
    <div class="pull-right navTab_right">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="other">关闭其他页面</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有页面</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import bus from "./bus";

export default {
  data() {
    return {
      tagsList: [],
      counter: "0",
      activeIndex: "",
      defaultTag: "",
      defaultTitle: ""
    };
  },
  methods: {
    tabClick(tab, even) {
      this.$router.push({ path: tab.name });
    },

    // 关闭全部标签
    closeAll() {
      this.tagsList = [];
      this.$router.push(this.defaultTag);
      // this.setDefaultTag();
    },
    // 关闭其他标签
    closeOther() {
      const curItem = this.tagsList.filter(item => {
        return item.path === this.$route.fullPath;
      });
      this.tagsList = curItem;
    },
    // 设置标签
    setTags(route) {
      const isExist = this.tagsList.some(item => {
        return item.path === route.fullPath;
      });
      if (!isExist) {
        this.tagsList.push({
          title: route.meta.title,
          path: route.fullPath
        });
      }

      // bus.$emit('tags', this.tagsList)
    },
    handleTags(command) {
      command === "other" ? this.closeOther() : this.closeAll();
    },
    setDefaultTag() {
      this.tagsList.push({
        title: this.defaultTitle,
        path: this.defaultTag
      });
    },
    // 关闭单个标签
    closeTags(targetName) {
      let tabs = this.tagsList;
      let activeName = this.activeIndex;
      let self = this;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.path === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.path;
            }
            self.tagsList.splice(index, 1);
          }
        });
      }

      this.tagsList = tabs.filter(tab => tab.path !== targetName);
      let len = this.tagsList.length;
      if (len === 0) {
        if (targetName == this.defaultTag) {
          this.setDefaultTag();
        }

        this.$router.push(this.defaultTag);
      } else {
        this.activeIndex = activeName;
        this.$router.push(this.activeIndex);
      }
    }
  },
  computed: {
    showTags() {
      return this.tagsList.length > 0;
    }
  },
  watch: {
    $route(newValue) {
      this.setTags(newValue);
      this.activeIndex = newValue.fullPath;
    }
  },

  created() {
    this.defaultTag = sessionStorage.getItem("mainPage");
    this.defaultTitle = sessionStorage.getItem("mainTitle");
    // this.$router.push(this.defaultTag);
    this.setTags(this.$route);
    this.activeIndex = this.$route.fullPath;
    // 监听关闭当前页面的标签页
    bus.$on("close_current_tags", () => {
      for (let i = 0, len = this.tagsList.length; i < len; i++) {
        const item = this.tagsList[i];
        if (item.path === this.$route.fullPath) {
          if (i < len - 1) {
            this.$router.push(this.tagsList[i + 1].path);
          } else if (i > 0) {
            this.$router.push(this.tagsList[i - 1].path);
          } else {
            this.$router.push(this.defaultTag);
          }
          this.tagsList.splice(i, 1);
        }
      }
    });
      window.addEventListener('setItem', ()=> {
          let targetName = sessionStorage.getItem('watchTagClose');
          this.closeTags(targetName)
      })
  }
};
</script>

<style scoped>
.navTabList {
  padding-right: 110px;
  height: 34px;
  line-height: 34px;
  background: #f4f4f4;
  margin-bottom: 10px;
  font-size: 12px;
  background-color: white;
  box-shadow: 0 5px 10px #ddd;
  position: relative;
  padding-left: 8px;
}

.navTabList .navTab_right {
  position: absolute;
  height: 28px;
  top: 0;
  right: 0;
  line-height: normal;
  padding: 3px 6px;
  background: white;
  box-shadow: 0 5px 10px #ddd;
  z-index: 2;
}

.navTabList .navTab_right .el-button-group {
  vertical-align: top;
}

.navTabList .el-button--mini {
  font-size: 12px;
  /*padding: 4px 6px;*/
}

.navTabList >>> .el-tabs__item:hover {
  color: black;
  cursor: pointer;
  background-color: #f5f7fa;
}

.navTabList >>> .el-tabs--card > .el-tabs__header .el-tabs__item {
  border: 1px #c0c4cc solid;
  border-radius: 4px;
}
.navTabList >>> .el-tabs__item.is-active {
  color: white;
  background-color: #409eff;
}
.navTabList >>> .el-tabs__item {
  top: 2px;
  margin-right: 4px;
  font-size: 12px;
  height: 28px;
  line-height: 28px;
  color: #666;
}
.navTabList >>> .el-tabs__nav-next,
.navTabList >>> .el-tabs__nav-prev {
  font-size: 16px;
  line-height: 37px;
}
/* .navTabList >>> .tags[data-v-2eacdb28] , */
.navTabList >>> .tags {
  line-height: 32px;
  height: 26px;
}

.navTabList >>> .el-tabs__nav-wrap {
  margin-bottom: 0px;
}

.navTabList >>> .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: 1px solid white;
}
</style>
