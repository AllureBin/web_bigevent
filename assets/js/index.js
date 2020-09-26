$(function() {
    getUserInfo()

    var layer = layui.layer

    // 点击退出事件
    $('#logout').on('click', function() {
        layer.confirm('是否确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            // 清除本地存储
            localStorage.removeItem('token')
                // 跳转回登录页面
            location.href = '/login.html'
                // 关闭confirm询问框
            layer.close(index);
        });
    })
})

// 获取用户的信息
function getUserInfo() {
    $.ajax({
        mothod: "GET",
        url: "/my/userinfo",
        // headers就是请求头配置对象
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！")
            }
            // 调用渲染用户头像
            renderAvatar(res.data)
        }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 获取用户昵称
    var name = user.nickname || user.username
        // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}