/*
 * @Author: your name
 * @Date: 2021-12-01 15:13:12
 * @LastEditTime: 2021-12-30 16:06:16
 * @LastEditors: Please set LastEditors
 * @Description:防抖Js插件
 * @FilePath: /图片网站/src/util/Debounce.js
 */

var wait_arr = {}; //防抖队列，
/**
 * @description:防抖方法
 * @param {*} id 自定义防抖ID
 * @param {*} time:number 防抖等待时间(毫秒) default:2000
 * @returns Promise Boolean
 */
async function Debounce(id = "def", time = 2000) {
  const timestamp = new Date().getTime();
  if (id in wait_arr) {
    if (wait_arr[id] > timestamp) {
      //如果时间戳大于上次存的时间,说明还没有过期
      return Promise.reject(false); //返回失败
    }
  }
  //如果列队不存在此任务就将其加入防抖队列
  wait_arr[id] = timestamp + time;
  return Promise.resolve(true);
}
/**删除某个防抖任务 */
export function Debounce_del(id) {
  delete wait_arr[id];
  return true;
}
/**
 * @description:同步线程睡眠,
 * @param {*} time 暂停时间 default：0
 */
async function Sleep(time = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}
export { wait_arr, Sleep };
export default Debounce;
