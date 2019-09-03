import axios from 'axios'
import {Message} from 'element-ui'
import router from '../../router'
import response from "vue-resource/src/http/response";

axios.interceptors.request.use(
    config => {
        const token = sessionStorage.admin_token;
    if(token){
       config.headers[token] = token;
    }
    return config;
    },
    err => {
        // console.log('err');
        return Promise.reject(err);
    }
);

axios.interceptors.response.use(
    response => {
        if (response.data.resultCode === "10000" || response.data.statusCode === '10000') {
            router.push('/login');//go是history的跳转，失败效果很鬼畜
            Message.warning('登陆超时，请重新登陆');
        }
        else return response;
    },
    error => {
        Message.warning('请求出错，请联系后台');
        // 后台服务器针对异常已经做了状态修改处理,只有在连接不到服务器时会出err,不需要每一个请求都做catch的操作
        console.log(   error.response);
        return new Promise(() => {});
    });

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${sessionStorage.base}${url}`,//ES6的模板字符串语法

        headers: {
            token: sessionStorage.admin_token
        },
        data: params,
});
};
export const getGatewayList = async function () { //需求变了，没什么乱用
    let gatewaylist = await axios({
        method: 'post',
        url: `${sessionStorage.base}` + 'admin/getGatewayList',
        headers: {
            token: sessionStorage.admin_token
        },
        data: {
            t: ''
        }
    })
    return gatewaylist;
};

export const getCodeList = async function () {
    let codeList = await axios({
        method: 'post',
        url: `${sessionStorage.base}` + 'admin/listCode',
        headers: {
            token: sessionStorage.admin_token
        },
        data: {
            t: ''
        }
    })
    return codeList;
};
// export const listGeneralSubAccount = async function () {
//     let subAccount = await axios({
//         method: 'post',
//         url: `${base}` + 'listGeneralSubAccount',
//         headers: {
//             token: sessionStorage.ms_token
//         },
//         data: {
//             t: ''
//         }
//     });
//     return subAccount;
// }
export default axios;
