$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }


    // 定义一个查询的参数对象
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值 默认第一页
        pagesize: 2, // 每页显示的多少数据，默认两条
        cate_id: '', // 分类 
        state: '' // 文章的状态，可选值有：已发布、草稿
    }

    initTable()
    initCate()

    // 获取文章列表数据函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 调用渲染分页方法
                renderPage(res.total)
            }
        })
    }

    // 获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 让layui重新渲染表单区域UI结构
                form.render()
            }
        })
    }

    // 筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取表单中筛选项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 把获取的值赋值到查询参数对象q中
        q.cate_id = cate_id
        q.state = state
            // 根据最新的筛选条件重新渲染表格数据
        initTable()
    })


    // 定义分页
    function renderPage(total) {
        // 调用laypage.render方法渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器的ID
            count: total, // 总数据 条数
            limit: q.pagesize, // 每页显示几条
            curr: q.pagenum, // 默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换触发的函数
            jump: function(obj, first) {
                // 把最新的页码值赋值给q
                q.pagenum = obj.curr
                    // 把最新的条目数赋值给q
                q.pagesize = obj.limit
                    // 判断first是否为ture，如果为true则不触发initTable()方法
                if (!first) {
                    // 根据最新的q对象获取对应的列表数据，渲染表格
                    initTable()
                }
            }
        })
    }


    // 给删除按钮绑定点击事件
    $('tbody').on('click', '.delete', function() {
        var len = $('.delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // 当删除数据后，判断当前页是否存在数据
                    // 如果不存在数据，便让页码值 -1 再渲染数据
                    // 如果len=1 证明删除这条数据后，当前页便无数据，所以需要-1
                    // 注意：页码值最少为1，所以需要判断页码值
                    if (len == 1) {
                        q.pagenum = q.pagenum = 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index)
                }
            })
        })
    })

    // 给编辑按钮绑定点击事件
    $('tbody').on('click', '.btnEdit', function(e) {
        layer.open({
            type: 1,
            title: '修改文章',
            content: '123',
            area: 'auto',
        });
    })
})