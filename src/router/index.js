import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' }, //自述文件？
            children: [{
                    path: '/1',
                    component: resolve => require(['../components/page/2/1.vue'], resolve),
                    meta: { title: '1' }
                },
                {
                    path: '/admin_dxjs',
                    component: resolve => require(['../components/page/2/admin_dxjs.vue'], resolve),
                    meta: { title: '短信检索' }
                },
                {
                    path: '/admin_rwzz',
                    component: resolve => require(['../components/page/2/admin_rwzz.vue'], resolve),
                    meta: { title: '任务追踪' }
                },
                {
                    path: '/admin_bgsjs',
                    component: resolve => require(['../components/page/2/admin_bgsjs.vue'], resolve),
                    meta: { title: '报告数检索' }
                },
                {
                    path: '/admin_bgrfhjs',
                    component: resolve => require(['../components/page/2/admin_bgrfhjs.vue'], resolve),
                    meta: { title: '报告日返回检索' }
                },
                {
                    path: '/admin_whrwjglb',
                    component: resolve => require(['../components/page/2/admin_whrwjglb.vue'], resolve),
                    meta: { title: '语音检索' }
                },
                {
                    name: 'admin_dshdx',
                    path: '/admin_dshdx',
                    component: resolve => require(['../components/page/2/admin_dshdx.vue'], resolve),
                    meta: { title: '待审核短信' }
                },
                {
                    path: '/admin_yshdx',
                    component: resolve => require(['../components/page/2/admin_yshdx.vue'], resolve),
                    meta: { title: '已审核短信' }
                },
                // {
                //     path: '/admin_dshqm',
                //     component: resolve => require(['../components/page/2/admin_dshqm.vue'], resolve),
                //     meta: {title: '待审核签名'}
                // },
                {
                    path: '/admin_cjsh',
                    component: resolve => require(['../components/page/2/admin_cjsh.vue'], resolve),
                    meta: { title: '超级审核' }
                },
                {
                    path: '/admin_dshrwmgc',
                    component: resolve => require(['../components/page/2/admin_dshrwmgc.vue'], resolve),
                    meta: { title: '待审核任务敏感词' }
                },
                {
                    path: '/admin_plxgdx',
                    component: resolve => require(['../components/page/2/admin_plxgdx.vue'], resolve),
                    meta: { title: '批量修改短信' }
                },
                {
                    path: '/admin_plqxdsdx',
                    component: resolve => require(['../components/page/2/admin_plqxdsdx.vue'], resolve),
                    meta: { title: '批量取消定时短信' }
                },
                // {
                //     path: '/admin_dxtjjl',
                //     component: resolve => require(['../components/page/2/admin_dxtjjl.vue'], resolve),
                //     meta: {title: '短信提交记录'}
                // },
                // {
                //     path: '/admin_hmtjjl',
                //     component: resolve => require(['../components/page/2/admin_hmtjjl.vue'], resolve),
                //     meta: {title: '号码提交记录'}
                // },
                // {
                //     path: '/admin_dxfslb',
                //     component: resolve => require(['../components/page/2/admin_dxfslb.vue'], resolve),
                //     meta: {title: '短信发送列表'}
                // },
                // {
                //     path: '/admin_dcllb',
                //     component: resolve => require(['../components/page/2/admin_dcllb.vue'], resolve),
                //     meta: {title: '待处理列表'}
                // },
                {
                    path: '/admin_tjsblb',
                    component: resolve => require(['../components/page/2/admin_tjsblb.vue'], resolve),
                    meta: { title: '提交失败列表' }
                },
                // {
                //     path: '/admin_fxbglb',
                //     component: resolve => require(['../components/page/2/admin_fxbglb.vue'], resolve),
                //     meta: {title: '发送报告列表'}
                // },
                // {
                //     path: '/admin_wgbglb',
                //     component: resolve => require(['../components/page/2/admin_wgbglb.vue'], resolve),
                //     meta: {title: '网关报告列表'}
                // },
                {
                    path: '/admin_ddtjlb',
                    component: resolve => require(['../components/page/2/admin_ddtjlb.vue'], resolve),
                    meta: { title: '等待提交列表' }
                },
                {
                    path: '/admin_dsrwlb',
                    component: resolve => require(['../components/page/2/admin_dsrwlb.vue'], resolve),
                    meta: { title: '定时任务列表' }
                },
                {
                    path: '/admin_sxlb',
                    component: resolve => require(['../components/page/2/admin_sxlb.vue'], resolve),
                    meta: { title: '上行列表' }
                },
                // {
                //     path: '/admin_dlslb',
                //     component: resolve => require(['../components/page/2/admin_dlslb.vue'], resolve),
                //     meta: {title: '代理商列表'}
                // },
                {
                    path: '/admin_yykhlb',
                    component: resolve => require(['../components/page/2/admin_yykhlb.vue'], resolve),
                    meta: { title: '语音客户列表' }
                },
                {
                    path: '/admin_zdkhlb',
                    component: resolve => require(['../components/page/2/admin_zdkhlb.vue'], resolve),
                    meta: { title: '终端客户列表' }
                },
                {
                    path: '/zdkhzzh',
                    component: resolve => require(['../components/page/2/zdkhzzh.vue'], resolve),
                    meta: { title: '终端客户子账号' }
                },
                {
                    path: '/djbgjl',
                    component: resolve => require(['../components/page/2/djbgjl.vue'], resolve),
                    meta: { title: '单价变更记录' }
                },
                {
                    path: '/admin_zhhlb',
                    component: resolve => require(['../components/page/2/admin_zhhlb.vue'], resolve),
                    meta: { title: '主账号列表' }
                },
                {
                    path: '/admin_kzbdqmlb',
                    component: resolve => require(['../components/page/2/admin_kzbdqmlb.vue'], resolve),
                    meta: { title: '扩展绑定签名列表' }
                },
                // {
                //     path: '/admin_qmbagl',
                //     component: resolve => require(['../components/page/2/admin_qmbagl.vue'], resolve),
                //     meta: {title: '签名备案管理'}
                // },
                {
                    path: '/admin_mskhlb',
                    component: resolve => require(['../components/page/2/admin_mskhlb.vue'], resolve),
                    meta: { title: '免审客户列表' }
                },
                {
                    path: '/admin_shcllb',
                    component: resolve => require(['../components/page/2/admin_shcllb.vue'], resolve),
                    meta: { title: '审核策略列表' }
                },
                {
                    path: '/admin_gjzlylb',
                    component: resolve => require(['../components/page/2/admin_gjzlylb.vue'], resolve),
                    meta: { title: '关键字路由列表' }
                },
                {
                    path: '/admin_khmblb',
                    component: resolve => require(['../components/page/2/admin_khmblb.vue'], resolve),
                    meta: { title: '客户模板列表' }
                },
                {
                    path: '/admin_eckzlb',
                    component: resolve => require(['../components/page/2/admin_eckzlb.vue'], resolve),
                    meta: { title: '二次扩展列表' }
                },
                {
                    path: '/admin_swlylb',
                    component: resolve => require(['../components/page/2/admin_swlylb.vue'], resolve),
                    meta: { title: '省网路由列表' }
                },
                {
                    path: '/admin_tdswlylb',
                    component: resolve => require(['../components/page/2/admin_tdswlylb.vue'], resolve),
                    meta: { title: '通道省网路由列表' }
                },
                {
                    path: '/admin_hdlywglb',
                    component: resolve => require(['../components/page/2/admin_hdlywglb.vue'], resolve),
                    meta: { title: '号段路由网关列表' }
                },
                // {
                //     path: '/admin_saledlslb',
                //     component: resolve => require(['../components/page/2/admin_saledlslb.vue'], resolve),
                //     meta: {title: '代理商列表'}
                // },
                // {
                //     path: '/admin_dlqxfp',
                //     component: resolve => require(['../components/page/2/admin_dlqxfp.vue'], resolve),
                //     meta: {title: '代理权限分配'}
                // },
                // {
                //     path: '/admin_salezdkhlb',
                //     component: resolve => require(['../components/page/2/admin_salezdkhlb.vue'], resolve),
                //     meta: {title: '终端客户列表二'}
                // },
                {
                    path: '/admin_khqqmgl',
                    component: resolve => require(['../components/page/2/admin_khqqmgl.vue'], resolve),
                    meta: { title: '客户去签名管理' }
                },
                {
                    path: '/admin_sbfhlb',
                    component: resolve => require(['../components/page/2/admin_sbfhlb.vue'], resolve),
                    meta: { title: '失败返还列表' }
                },
                {
                    path: '/admin_khwgdjlb',
                    component: resolve => require(['../components/page/2/admin_khwgdjlb.vue'], resolve),
                    meta: { title: '客户网关单价列表' }
                },
                {
                    path: '/admin_tglb',
                    component: resolve => require(['../components/page/2/admin_tglb.vue'], resolve),
                    meta: { title: '通道列表' }
                },
                {
                    path: '/admin_tdfzlb',
                    component: resolve => require(['../components/page/2/admin_tdfzlb.vue'], resolve),
                    meta: { title: '通道分组列表' }
                },
                {
                    path: '/admin_tgcs',
                    component: resolve => require(['../components/page/2/admin_tgcs.vue'], resolve),
                    meta: { title: '通道测试' }
                },
                {
                    path: '/admin_apics',
                    component: resolve => require(['../components/page/2/admin_apics.vue'], resolve),
                    meta: { title: 'HTTP接口测试' }
                },
                {
                    path: '/admin_wgxylb',
                    component: resolve => require(['../components/page/2/admin_wgxylb.vue'], resolve),
                    meta: { title: '网关协议列表' }
                },
                {
                    path: '/admin_yxwglb',
                    component: resolve => require(['../components/page/2/admin_yxwglb.vue'], resolve),
                    meta: { title: '运行网关列表' }
                },
                // {
                //     path: '/admin_tdgl_tdzflb',
                //     component: resolve => require(['../components/page/2/admin_tdgl_tdzflb.vue'], resolve),
                //     meta: {title: '通道资费列表'}
                // },
                // {
                //     path: '/admin_tdgl_tdsxlb',
                //     component: resolve => require(['../components/page/2/admin_tdgl_tdsxlb.vue'], resolve),
                //     meta: {title: '通道属性列表'}
                // },
                {
                    path: '/admin_tddjlb',
                    component: resolve => require(['../components/page/2/admin_tddjlb.vue'], resolve),
                    meta: { title: '通道单价列表' }
                },
                {
                    path: '/admin_aqgl_whiteKeyword',
                    component: resolve => require(['../components/page/2/admin_aqgl_whiteKeyword.vue'], resolve),
                    meta: { title: '用户白词列表' }
                }, {
                    path: '/admin_hclb',
                    component: resolve => require(['../components/page/2/admin_hclb.vue'], resolve),
                    meta: { title: '黑词列表' }
                }, {
                    path: '/admin_hhlb',
                    component: resolve => require(['../components/page/2/admin_hhlb.vue'], resolve),
                    meta: { title: '黑号列表' }
                }, {
                    path: '/admin_bhlb',
                    component: resolve => require(['../components/page/2/admin_bhlb.vue'], resolve),
                    meta: { title: '白号列表' }
                }, {
                    path: '/admin_tdhdpblb',
                    component: resolve => require(['../components/page/2/admin_tdhdpblb.vue'], resolve),
                    meta: { title: '通道号码屏蔽列表' }
                }, {
                    path: '/admin_tdgjzpblb',
                    component: resolve => require(['../components/page/2/admin_tdgjzpblb.vue'], resolve),
                    meta: { title: '通道关键字屏蔽列表' }
                }, {
                    path: '/admin_tdbclb',
                    component: resolve => require(['../components/page/2/admin_tdbclb.vue'], resolve),
                    meta: { title: '通道白词列表' }
                }, {
                    path: '/admin_aqgl_nrmblb',
                    component: resolve => require(['../components/page/2/admin_aqgl_nrmblb.vue'], resolve),
                    meta: { title: '内容模板列表' }
                },
                /////////////////////////////////////////////////////////////////////
                // 语音管理
                {
                    path: '/admin_yywglb',
                    component: resolve => require(['../components/page/2/admin_yywglb.vue'], resolve),
                    meta: { title: '语音网关列表' }
                },
                {
                    path: '/admin_yywavlb',
                    component: resolve => require(['../components/page/2/admin_yywavlb.vue'], resolve),
                    meta: { title: '语音wav文件列表' }
                },
                {
                    path: '/admin_yymbsh',
                    component: resolve => require(['../components/page/2/admin_yymbsh.vue'], resolve),
                    meta: { title: '语音模板审核' }
                },
                {
                    path: '/admin_whrwlb',
                    component: resolve => require(['../components/page/2/admin_whrwlb.vue'], resolve),
                    meta: { title: '外呼任务列表' }
                },
                // 下载管理
                {
                    path: '/admin_xzlb',
                    component: resolve => require(['../components/page/2/admin_xzlb.vue'], resolve),
                    meta: { title: '下载列表' }
                },
                // 路由管理
                {
                    path: '/admin_khklbzlb',
                    component: resolve => require(['../components/page/2/admin_khklbzlb.vue'], resolve),
                    meta: { title: '客户扣量标准列表' }
                },
                //此页面转接到 【客户扣量标准列表】的【添加客户扣量标准】按钮中去了
                // {
                //     path: '/admin_tjkhklbz',
                //     component: resolve => require(['../components/page/2/admin_tjkhklbz.vue'], resolve),
                //     meta: {title: '添加客户扣量标准'}
                // },
                // 监控管理
                {
                    path: '/admin_wgzllb',
                    component: resolve => require(['../components/page/2/admin_wgzllb.vue'], resolve),
                    meta: { title: '网关质量列表' }
                },
                {
                    path: '/admin_khyetxlb',
                    component: resolve => require(['../components/page/2/admin_khyetxlb.vue'], resolve),
                    meta: { title: '客户余额提醒列表' }
                },
                {
                    path: '/admin_tdtjsbtx',
                    component: resolve => require(['../components/page/2/admin_tdtjsbtx.vue'], resolve),
                    meta: { title: '通道提交失败提醒' }
                },
                //报告管理
                {
                    path: '/admin_sxtssblb',
                    component: resolve => require(['../components/page/2/admin_sxtssblb.vue'], resolve),
                    meta: { title: '上行推送失败列表' }
                },
                {
                    path: '/admin_sxtscglb',
                    component: resolve => require(['../components/page/2/admin_sxtscglb.vue'], resolve),
                    meta: { title: '上行推送成功列表' }
                },
                {
                    path: '/admin_sxcxlb',
                    component: resolve => require(['../components/page/2/admin_sxcxlb.vue'], resolve),
                    meta: { title: '上行查询列表' }
                },
                {
                    path: '/admin_bgtssblb',
                    component: resolve => require(['../components/page/2/admin_bgtssblb.vue'], resolve),
                    meta: { title: '报告推送失败列表' }
                },
                {
                    path: '/admin_bgtscglb',
                    component: resolve => require(['../components/page/2/admin_bgtscglb.vue'], resolve),
                    meta: { title: '报告推送成功列表' }
                },
                {
                    path: '/admin_bgcxlb',
                    component: resolve => require(['../components/page/2/admin_bgcxlb.vue'], resolve),
                    meta: { title: '报告查询列表' }
                },
                {
                    path: '/admin_tjkhzdybg',
                    component: resolve => require(['../components/page/2/admin_tjkhzdybg.vue'], resolve),
                    meta: { title: '添加客户自定义列表' }
                },
                {
                    path: '/admin_khzdybglb',
                    component: resolve => require(['../components/page/2/admin_khzdybglb.vue'], resolve),
                    meta: { title: '客户自定义报告列表' }
                },
                {
                    path: '/admin_zdybgjl',
                    component: resolve => require(['../components/page/2/admin_zdybgjl.vue'], resolve),
                    meta: { title: '自定义报告记录' }
                },
                //权限管理
                {
                    path: '/admin_xtglcdlb/',
                    component: resolve => require(['../components/page/2/admin_xtglcdlb.vue'], resolve),
                    meta: { title: '系统管理菜单列表' }
                },
                {
                    path: '/admin_zdkfcdlb/',
                    component: resolve => require(['../components/page/2/admin_zdkfcdlb.vue'], resolve),
                    meta: { title: '终端客户菜单列表' }
                },
                {
                    path: '/admin_jslb',
                    component: resolve => require(['../components/page/2/admin_jslb.vue'], resolve),
                    meta: { title: '角色列表' }
                },
                //系统管理
                {
                    path: '/admin_hdlb',
                    component: resolve => require(['../components/page/2/admin_hdlb.vue'], resolve),
                    meta: { title: '号段列表' }
                },
                {
                    path: '/admin_bmlb',
                    component: resolve => require(['../components/page/2/admin_bmlb.vue'], resolve),
                    meta: { title: '部门列表' }
                },
                {
                    path: '/admin_xtyglb',
                    component: resolve => require(['../components/page/2/admin_xtyglb.vue'], resolve),
                    meta: { title: '系统用户列表' }
                },
                {
                    path: '/admin_xtgl_sys_log',
                    component: resolve => require(['../components/page/2/admin_rzgl.vue'], resolve),
                    meta: { title: '日志管理' }
                },
                //统计报表
                {
                    path: '/admin_khjfrtj',
                    component: resolve => require(['../components/page/2/admin_khjfrtj.vue'], resolve),
                    meta: { title: '客户计费日统计' }
                },
                {
                    path: '/admin_khjfytj',
                    component: resolve => require(['../components/page/2/admin_khjfytj.vue'], resolve),
                    meta: { title: '客户计费月统计' }
                },
                {
                    path: '/admin_khfsrtj',
                    component: resolve => require(['../components/page/2/admin_khfsrtj.vue'], resolve),
                    meta: { title: '客户发送日统计' }
                },
                {
                    path: '/admin_khfsytj',
                    component: resolve => require(['../components/page/2/admin_khfsytj.vue'], resolve),
                    meta: { title: '客户发送月统计' }
                },
                {
                    path: '/admin_wgtjrtj',
                    component: resolve => require(['../components/page/2/admin_wgtjrtj.vue'], resolve),
                    meta: { title: '网关提交日统计' }
                },
                {
                    path: '/admin_wgtjytj',
                    component: resolve => require(['../components/page/2/admin_wgtjytj.vue'], resolve),
                    meta: { title: '网关提交月统计' }
                },
                {
                    path: '/admin_wgbgrtj',
                    component: resolve => require(['../components/page/2/admin_wgbgrtj.vue'], resolve),
                    meta: { title: '网关报告日统计' }
                },
                {
                    path: '/admin_wggbytj',
                    component: resolve => require(['../components/page/2/admin_wggbytj.vue'], resolve),
                    meta: { title: '网关报告月统计' }
                },
                {
                    path: '/admin_khdywgrtj',
                    component: resolve => require(['../components/page/2/admin_khdywgrtj.vue'], resolve),
                    meta: { title: '客户对应网关日统计' }
                },
                {
                    path: '/admin_khdywgytj',
                    component: resolve => require(['../components/page/2/admin_khdywgytj.vue'], resolve),
                    meta: { title: '客户对应网关月统计' }
                },
                {
                    path: '/admin_pckhrtj',
                    component: resolve => require(['../components/page/2/admin_pckhrtj.vue'], resolve),
                    meta: { title: '批次语音客户日统计' }
                },
                {
                    path: '/admin_yykhrtj',
                    component: resolve => require(['../components/page/2/admin_yykhrtj.vue'], resolve),
                    meta: { title: '语音客户发送日统计' }
                },
                {
                    path: '/admin_yykhytj',
                    component: resolve => require(['../components/page/2/admin_yykhytj.vue'], resolve),
                    meta: { title: '语音客户发送月统计' }
                },
                // {
                //     path: '/admin_salekhjfrtj',
                //     component: resolve => require(['../components/page/2/admin_salekhjfrtj.vue'], resolve),
                //     meta: {title: '语音客户发送月统计'}
                // },
                //财务管理
                {
                    path: '/admin_bgjl',
                    component: resolve => require(['../components/page/2/admin_bgjl.vue'], resolve),
                    meta: { title: '变更记录' }
                },
                {
                    path: '/admin_zzjl',
                    component: resolve => require(['../components/page/2/admin_zzjl.vue'], resolve),
                    meta: { title: '转账记录' }
                },
                {
                    path: '/admin_yybgjl',
                    component: resolve => require(['../components/page/2/admin_yybgjl.vue'], resolve),
                    meta: { title: '语音记录' }
                },
                {
                    path: '/admin_sbfhbgjl',
                    component: resolve => require(['../components/page/2/admin_sbfhbgjl.vue'], resolve),
                    meta: { title: '失败返还变更记录' }
                },
                {
                    path: '/admin_khczjl',
                    component: resolve => require(['../components/page/2/admin_khczjl.vue'], resolve),
                    meta: { title: '客户充值记录' }
                },
                //特服号管理
                {
                    path: '/admin_tfhlb',
                    component: resolve => require(['../components/page/2/admin_tfhlb.vue'], resolve),
                    meta: { title: '特服号列表' }
                },
                {
                    path: '/admin_blgl',
                    component: resolve => require(['../components/page/2/admin_blgl.vue'], resolve),
                    meta: { title: '关联特服号' }
                },
                //标签管理
                {
                    path: '/admin_bqlb',
                    component: resolve => require(['../components/page/2/admin_bqlb.vue'], resolve),
                    meta: { title: '标签列表' }
                },
                {
                    path: '/admin_bqhmdjlb',
                    component: resolve => require(['../components/page/2/admin_bqhmdjlb.vue'], resolve),
                    meta: { title: '标签号码点击列表' }
                },
                {
                    path: '/admin_bqfspclb',
                    component: resolve => require(['../components/page/2/admin_bqfspclb.vue'], resolve),
                    meta: { title: '发送批次列表' }
                },
                {
                    path: '/admin_bqrtjlb',
                    component: resolve => require(['../components/page/2/admin_bqrtjlb.vue'], resolve),
                    meta: { title: '发送日统计列表' }
                },
                ////////////////////
                {
                    path: '/admin_xssqlb',
                    component: resolve => require(['../components/page/2/admin_xssqlb.vue'], resolve),
                    meta: { title: '销售申请列表' }
                },
                {
                    path: '/admin_khsq',
                    component: resolve => require(['../components/page/2/admin_khsq.vue'], resolve),
                    meta: { title: '客户申请' }
                },
                {
                    path: '/admin_yyfspclb',
                    component: resolve => require(['../components/page/2/admin_yyfspclb.vue'], resolve),
                    meta: { title: '语音发送批次列表' }
                },
                {
                    path: '/admin_yyhjjglb',
                    component: resolve => require(['../components/page/2/admin_yyhjjglb.vue'], resolve),
                    meta: { title: '语音呼叫结果列表' }
                },
                {
                    path: '/admin_yyhjtjlb',
                    component: resolve => require(['../components/page/2/admin_yyhjtjlb.vue'], resolve),
                    meta: { title: '语音呼叫统计列表' }
                },
                {
                    path: '/admin_scyyhjjg',
                    component: resolve => require(['../components/page/2/admin_scyyhujg.vue'], resolve),
                    meta: { title: '语音呼叫统计列表' }
                },
                {
                    path: '/admin_scfszh',
                    component: resolve => require(['../components/page/2/admin_scfszh.vue'], resolve),
                    meta: { title: '上传发送账号' }
                },
                {
                    path: '/admin_fsyhwg',
                    component: resolve => require(['../components/page/2/admin_fsyhwg.vue'], resolve),
                    meta: { title: '发送用户网关' }
                },
                // {
                //     path: '/test',
                //     component: resolve => require(['../components/page/2/test.vue'], resolve),
                //     meta: {title: '测试页面'}
                // },
                //////////////////////////////////////////////////////////////////////
                //———————————————
                {
                    path: '/admin_dashboard_show',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }

            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})