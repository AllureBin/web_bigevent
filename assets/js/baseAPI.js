// 每次调用$.get $.post $.ajax 的时候 
// 都会先调用$.ajaxPrefilter这个函数
// 可以拿到给Ajax提供的配置对象
$(function() {
    $.ajaxPrefilter(function(options) {
        // 发起ajax请求之前，拼接请求的根路径
        options.url = 'http://ajax.frontend.itheima.net' + options.url
        console.log(options.url);
    })
})