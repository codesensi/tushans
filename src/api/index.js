import request from "@/util/request";

//目录
export const get_menu = (data = {}) => request({
    url: '/index.php?c=api&method=category_list&limit=999999',
    params: data,
})
//获取链接
export const get_link = (data = {}) => request({
    url: '/index.php?c=api&method=link_list&limit=999999',
    params: data
})
//新增目录
export const add_menu = (data = {}) => request({
    url: '/index.php?c=api&method=add_category',
    method: 'post',
    data: data
})
//更新目录
export const update_menu = (data = {}) => request({
    url: '/index.php?c=api&method=edit_category',
    method: 'post',
    data: data
})

//新增链接
export const add_link = (data = {}) => request({
    url: '/index.php?c=api&method=add_link',
    method: 'post',
    data: data
})
//更新链接
export const update_link = (data = {}) => request({
    url: '/index.php?c=api&method=edit_link',
    method: 'post',
    data: data
})

//删除目录
export const delete_menu = (data = {}) => request({
    url: '/index.php?c=api&method=del_category',
    method: 'post',
    data: data
})

//删除链接
export const delete_link = (data = {}) => request({
    url: '/index.php?c=api&method=del_link',
    method: 'post',
    data: data
})

//是否登录
export const is_login = (data = {}) => request({
    url: '/index.php?c=api&method=check_login',
    method: 'post',
    data: data
})
