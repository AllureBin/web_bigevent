// 每次调用$.get $.post $.ajax 的时候 
// 都会先调用$.ajaxPrefilter这个函数
// 可以拿到给Ajax提供的配置对象
$(function() {
    $.ajaxPrefilter(function(options) {
        // 发起ajax请求之前，拼接请求的根路径
        options.url = 'http://ajax.frontend.itheima.net' + options.url

        // 统一给有权限的接口设置herders请求头
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }

        // 全局统一挂载complete函数
        // 无论请求成功还是失败，都会调用的函数
        options.complete = function(res) {
            // console.log(res);
            // 在complete函数中，可以使用res.responseJSON拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制清空token
                localStorage.removeItem('token')
                    // 强制跳转到登录页面
                location.href = '/login.html'
            }
        }
    })
})