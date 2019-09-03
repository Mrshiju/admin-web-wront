<template>
    <div class="navTabList el-tabs__nav-scroll" id="tabsNav" v-if="showTags">
        <el-tabs class="tags"
                 v-model="activeIndex"
                 type="card"
                 closable
                 @tab-remove='closeTags'
                 @tab-click='tabClick'
        >
            <el-tab-pane
            :key="index"
            v-for="(item, index) in tagsList"
            :label="item.title"
            :name="item.path"
                
            >
            </el-tab-pane>
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
    import bus from './bus'

    export default {
        data() {
            return {
                tagsList: [],
                counter: '0',
                activeIndex: '',
                defaultTag:'',
                defaultTitle:''
            }
        },
        methods: {
            tabClick(tab, even) {
                this.$router.push({path: tab.name});
            },

            // 关闭全部标签
            closeAll() {
                this.tagsList = []
                this.$router.push(this.defaultTag)
            },
            // 关闭其他标签
            closeOther() {
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.$route.fullPath
                })
                this.tagsList = curItem
            },
            // 设置标签
            setTags(route) {
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath
                })
                if (!isExist) {
                    this.tagsList.push({
                        title: route.meta.title,
                        path: route.fullPath,
                    })
                }
                // bus.$emit('tags', this.tagsList)
            },
            handleTags(command) {
                command === 'other' ? this.closeOther() : this.closeAll()
            },
            // 关闭单个标签
            closeTags(targetName) {
                let tabs = this.tagsList;
                tabs.forEach((tab, i) => {
                        if (tab.path == targetName) {
                            this.tagsList.splice(i, 1);
                        }
                    })
                this.tagsList = tabs.filter(tab => tab.path !== targetName);
                let len = this.tagsList.length;
                if (len==0) {
                    this.tagsList.push({
                        title: this.defaultTitle,
                        path: this.defaultTag,
                    })
                    this.$router.push(this.defaultTag);
                }
            }
        }
        ,
        computed: {
            showTags() {
                return this.tagsList.length > 0
            }
        }
        ,
        watch: {
            $route(newValue) {
                this.setTags(newValue)
                this.activeIndex = newValue.fullPath;
            }
        }
        ,
        created() {
            this.defaultTag = sessionStorage.getItem("mainPage");
            this.defaultTitle = sessionStorage.getItem("mainTitle");
            this.setTags(this.$route)
            // 监听关闭当前页面的标签页
            bus.$on('close_current_tags', () => {
                for (let i = 0, len = this.tagsList.length; i < len; i++) {
                    const item = this.tagsList[i]
                    if (item.path === this.$route.fullPath) {
                        if (i < len - 1) {
                            this.$router.push(this.tagsList[i + 1].path)
                        } else if (i > 0) {
                            this.$router.push(this.tagsList[i - 1].path)
                        } else {
                            this.$router.push(this.defaultTag)
                        }
                        this.tagsList.splice(i, 1)
                    }
                }
            })
        },
    }
</script>

<style scoped>

    .tags{
        height: 26px;
        line-height: 26px;
    }
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
    .el-tabs__item{
        border: 1px red solid !important; 
    }
</style>
