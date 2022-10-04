import axios from "axios";
import Debounce from "@/util/Debounce";
import {ElNotification} from "element-plus";

let token = false;
let host = "";
if (location.hostname === "localhost") {
    token = "81b7c72181566d860f495428e3677fd3" //开发环境的token
}

const request = axios.create({
    baseURL: host,
    timeout: 1000 * 30,
})

request.interceptors.request.use((config) => {
    config.headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8";
    if (token)
        if (typeof config.data == "object")
            config.data['token'] = token
        else
            config.data = {token: token}
    console.log(config)
    config.transformRequest = [
        function (data) {
            let ret = '';
            for (let it in data) {
                // 中文编码
                if (data[it] !== '' || data[it] === 0) {
                    //值为空的全部剔除
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
                }
            }
            return ret;
        },
    ];
    return config
})
/*响应结果拦截 */
request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        Debounce("netWork", 10000)
            .then((e) => {
                ElNotification({
                    title: "网络错误",
                    message: "请求服务器超时、请重试发起请求",
                    type: "error",
                    duration: 5000,
                });
            })
            .catch((e) => console.log("网络错误"));
        return Promise.reject({
            code: 404,
            msg: "网络错误",
        });
    }
);
const apiHost = host
export {apiHost}
export default request
