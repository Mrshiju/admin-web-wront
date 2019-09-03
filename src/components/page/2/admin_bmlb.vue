<template>
    <div class="container">
        <div class="sideBar" width="25%" heiht="100%">
            <el-tree
                :data="deptList"
                :props="defaultProps"
                @node-click="handleNodeClick"
                default-expand-all
                highlight-current
                :expand-on-click-node="false"
            >
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span v-if="!delNodeFlag && node.level != 3">
                  <i class="el-icon-plus blue" type="text" size="mini" @click="() => append(data)"></i>
                </span>
                <span v-if="!delNodeFlag">
                  <i
                      class="el-icon-delete red"
                      type="text"
                      size="mini"
                      @click="() => remove(node, data)"
                  ></i>
                </span>
              </span>
            </el-tree>
        </div>
        <div class="content">
            <div class="formWrap" v-if="menuFlag" width="75%" heiht="100%">
                <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                    <!-- <el-form-item label="部门编号：" :label-width="formLabelWidth" prop="id">
                        <el-input v-model="form.id" autocomplete="off" :disabled="true"></el-input>
                    </el-form-item> -->
                    <el-form-item label="部门名称：" :label-width="formLabelWidth" prop="deptName">
                        <el-input v-model="form.deptName" autocomplete="off" :disabled="delNodeFlag"></el-input>
                    </el-form-item>

                    <!-- <el-form-item label="上级部门：" :label-width="formLabelWidth" prop="pdeptName">
                        <el-input
                            v-model="form.pdeptName"
                            :disabled="true"
                            placeholder="一级部门置空"
                        ></el-input>
                    </el-form-item> -->

                    <el-form-item label="序号：" :label-width="formLabelWidth" prop="seq">
                        <el-input v-model="form.seq" autocomplete="off" :disabled="delNodeFlag"></el-input>
                    </el-form-item>

                    <el-form-item label="备注：" :label-width="formLabelWidth" prop="note">
                        <el-input type="textarea" v-model="form.note" autocomplete="off" :disabled="delNodeFlag"></el-input>
                    </el-form-item>
                </el-form>

                <el-button type="primary" @click="saveMenu('form')" class="btn"  v-show="!delNodeFlag">更新菜单</el-button>
            </div>
        </div>
        <div class="footer">
            <div class="buttonWrap">
                <el-button
                    type="primary"
                    @click="modify('form')"
                >{{!delNodeFlag?"退出编辑":"编辑"}}
                </el-button>
                <el-button @click="close('form')">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                deptList: [
                    {
                        label: "部门列表",
                        deptName: "部门列表",
                        level:0,
                        seq: 0,
                        children: [],
                        pdeptName:''
                    }
                ],
                defaultProps: {
                    children: "children",
                    label: "label"
                },
                form: {
                    id: "",
                    deptName: "",
                    pdeptName: "",
                    seq: "",
                    note: ""
                },
                menuFlag: false,
                formLabelWidth: "120px",
                rules: {
                    deptName: [{required: true, message: "不能为空", trigger: "blur"}],
                    seq: [{required: true, message: "不能为空", trigger: "blur"}]
                },
                delNodeFlag: true,
                parent:'',
                nodes : 0,
            };
        },
        methods: {
             handleNodeClick(data) {
                this.menuFlag = true;
                this.form = {
                    id: data.id,
                    deptName: data.deptName,
                    pdeptName: data.pdeptName,
                    seq: data.seq,
                    note: data.note
                };
            },
            append(data) {
                const newChild = {
                    label: "新增item",
                    deptName: "新增item",
                    level: data.level + 1,
                    pdeptName: data.deptName,
                    info: "",
                    id:" ",
                    zid:'',
                    node:data.id,
                    seq: '',
                    children: []
                };
                this.parent = data.deptName;
                if (!data.children) {
                    this.$set(data, "children", []);
                }

                // this.handleNodeClick(data);
                data.children.push(newChild);
            },
            remove(node, data) {
                let self = this;
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
                let params = data.id;
                this.postRequest("admin/deleteDept", {deptID: params}).then(
                    res => {
                        if (res.data.success) {
                            self.succeed(res.data.message);
                            self.checkData()
                        } else {
                            self.failed(res.data.message);
                        }
                    }
                );
            },
            saveMenu(formName) {
                let self = this;
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.menuFlag = false;
                        let params = `${self.form.deptName},${self.parent == "部门列表" ?  '' :  self.parent},${self.form.note},${self.form.seq},${self.form.id},`;
                        this.postRequest("admin/saveAddDept", {params: params}).then(
                            res => {
                                if (res.data.success) {
                                    // self.succeed(res.data.message);
                                    self.checkData()
                                } else {
                                    // self.failed(res.data.message);
                                }
                                self.resAlert(res.data)
                            }
                        );
                    } else {
                        return false;
                    }
                });
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
            handleSizeChange() {
                this.checkData();
            },
            handlePageChange() {
                this.checkData();
            },
            checkData() {
                let self = this;
                let father = [];
                let children = [];
                this.postRequest("admin/listDept", {}).then(res => {
                    self.deptList =  [
                        {
                            label: "部门列表",
                            deptName: "部门列表",
                            level:0,
                            seq: 0,
                            children: [],
                            pdeptName:''
                        }
                    ];
                    for(let item of res.data.data.deptList){
                        if(item.pdeptName == ''){
                            father.push({
                                label:item.deptName,
                                deptName:item.deptName,
                                id:item.id,
                                seq:item.seq,
                                note:item.note,
                            })
                        }else {
                            children.push({
                                label:item.deptName,
                                deptName:item.deptName,
                                id:item.id,
                                seq:item.seq,
                                note:item.note,
                                pdeptName:item.pdeptName
                            })
                        }
                    };
                    for (let item of father) {
                        self.deptList[0].children.push({
                            label: item.deptName,
                            deptName: item.deptName,
                            id: item.id,
                            pdeptId: item.pdeptId,
                            seq: item.seq,
                            zid: item.zid,
                            zpid: item.zpid,
                            note: item.note,
                            children: [],
                            pdeptName:item.pdeptName
                        });
                    };
                    for(let item of self.deptList[0].children){
                        for(let i of children ){
                            if(i.pdeptName == item.deptName){
                                item.children.push({
                                    label: i.deptName,
                                    deptName: i.deptName,
                                    id: i.id,
                                    pdeptId: i.pdeptId,
                                    seq: i.seq,
                                    zid: i.zid,
                                    zpid: i.zpid,
                                    note: i.note,
                                    children: [],

                                })
                            }
                        }

                    }
                });
            },

            cancel() {
            },
            modify() {
                this.delNodeFlag = !this.delNodeFlag;

            },
            nodedele(n, p, g) {
            },
        },
        mounted() {
            this.checkData();
        }
    };
</script>

<style scoped>
    .container {
        display: flex;
        height: 90%;
    }

    .container .content {
        overflow: auto;
        margin: 0 auto;
        position: relative;
    }

    .container .content form {
        border-bottom: 1px solid rgb(220, 220, 220);
    }

    .container .content button {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 20px;
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

    /*.custom-tree-node .slot-t-icons {*/
    /*display: none;*/
    /*}*/
    /*.custom-tree-node:hover .slot-t-icons {*/
    /*display: inline-block;*/
    /*}*/
</style>
