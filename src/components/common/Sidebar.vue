<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items" :v-if="item.isShow===1">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <!-- <i class="iconfont icon-renwu"></i> -->
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <!--<el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">-->
                            <!--<template slot="title">{{ subItem.title }}</template>-->
                            <!--<el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">-->
                            <!--{{ threeItem.title }}-->
                            <!--</el-menu-item>-->
                            <!--</el-submenu>-->
                            <el-menu-item
                                v-if="subItem.isShow===1"
                                :index="subItem.index"
                                :key="subItem.index"
                            ><i class="iconfont icon-admin_dian"></i>{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from "../common/bus";
    //获取左侧栏数据，遍历原始数据转成符合要求的格式
    export default {
        beforeCreate: function () {
            //这里出现了生命周期钩子函数，如果是created就无效
            //对于created和mounted的区别，总结就是created的dom还没被vue的dom替换,其他都是一样的
            let self = this;
            let leftMenu = [];

            this.postRequest("admin/leftMenu", {
                token: ""
            }).then(function (response) {
                if (response.data.success) {
                    for (let num of response.data.data) {
                        let menuItem = {};
                        menuItem.subs = [];
                        menuItem.index = num.menuName;
                        menuItem.title = num.menuNameCn;
                        menuItem.icon = `iconfont icon-${num.menuName}`;
                        if (num.menuName == 'admin_dashboard') {
                            menuItem.icon = 'el-icon-menu';
                        }
                        menuItem.isShow = num.isShow;
                        if (num.childMenu !== null) {
                            for (let subNum of num.childMenu) {
                                let subMenu = {};
                                subMenu.index = subNum.menuName;
                                subMenu.isShow = subNum.isShow;
                                subMenu.title = subNum.menuNameCn; //关于对象数组的遍历获取，肯定有更便捷的方法……
                                menuItem.subs.push(subMenu); //这里是转换数据格式而不是遍历判断，模板中判断了一次有没有二三级菜单，JS中也需要，来转换数据格式
                            }
                        }
                        leftMenu.push(menuItem);
                    }
                    self.items = leftMenu.concat(self.items);
                }

            });
        },
        data() {
            return {
                collapse: false,
                // items:[]
                items: [],
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace("/", "");
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on("collapse", msg => {
                this.collapse = msg;
            });
        },
        beforeRouteEnter(to, from, next) {
            if(to.query.title){
                to.meta.title = to.query.title;
            } else{
                to.meta.title = '系统管理菜单列表';
            }
            next(vm => {
                if (vm.$route.query.roleName) {
                    let roleName = vm.$route.query.roleName;
                    vm.isShowCheckBoxFlag = true;
                    vm.loadqxData(roleName,vm.$route.query.roleID);
                }else{
                    vm.isShowCheckBoxFlag = false;
                    vm.checkData();
                }
            });
        },
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 200px;
    }

    .sidebar > ul {
        height: 100%;
        margin: 0 !important;
    }
</style>
