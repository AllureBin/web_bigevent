$(function() {
    // 点击注册链接
    $('#link_reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })
        // 点击登录链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide()
        $('.login-box').show()
    })


    // 从layui获取form对象
    var form = layui.form
    var layer = layui.layer
        // 通过form.verify()方法自定义校验规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 检测两次密码是否一致
        repwd: function(value) {
            var pwd = $('#pwd').val()
            if (pwd !== value) {
                return "两次密码输入不一致"
            }
        }
    })

    // 监听注册表单事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        var data = {
            username: $('#uname').val(),
            password: $('#pwd').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg("注册成功，请登录！")
            $('#link_login').click()
        })
    })

    // 监听登录表单事件
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                    // 将登录成功的token字符串保存到localStorage中
                localStorage.setItem('token', res.token)
                    // 跳转页面
                location.href = '/index.html'
            }
        })
    })
})