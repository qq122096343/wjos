os.sql.SYS_MB = {
    field_type: ["VARCHAR2(1000)", "NUMBER"],
    //字段类型
    input_type: ["text", "checkbox", "password", "radio", "select", "textarea"],
    //输入框类型
    build_select: function(type_list, 字段类型) { //生产select  
        var $select = $("<select></select>");
        for (var i in type_list) {
            var op = type_list[i];
            if (op == 字段类型) {
                $select.append("<option selected='selected'>" + op + "</option>");
            } else {
                $select.append("<option>" + op + "</option>");
            }
        };
        return $select;
    },
    build_title: function(en, cn) { //生产title , 中文名: input . 英文名: input
        var 随机数 = "r" + parseInt(Math.random() * 10000);
        var $title = $("<div></div>");
        if (en == undefined) {
            $title.append("模板中文名:<input name='BZWM' class='中文名'  for='" + 随机数 + "' />");
            $title.append("模板英文名:<input name='BYWM' class='" + 随机数 + "'/>");
        } else {
            $title.append("模板中文名:<input name='BZWM' class='中文名'  for='" + 随机数 + "' value='" + cn + "' />");
            $title.append("模板英文名:<input name='BYWM' class='" + 随机数 + "'  value='" + en + "'/>");
        }
        return $title;

    },
    build_tr1: function() { //生产第一行tr
        var $tr = $("<tr></tr>");
        $tr.append($("<td>字段中文名</td>"));
        $tr.append($("<td>字段英文名</td>"));
        $tr.append($("<td>字段类型</td>"));
        $tr.append($("<td>输入框类型</td>"));
        $tr.append($("<td>输入框参数</td>"));
        $tr.append("<td><button class='添加字段'>添加</button></td>");
        $tr.on("click", ".添加字段",
        function() { //绑定添加字段函数
            var $tr = os.sql.SYS_MB.build_tr();
            $(this).parent().parent().after($tr);
        });

        return $tr;
    },
    build_tr: function(tablefield) { //生产tr
        if (tablefield == undefined) { //如果没传字段者为add 方法
            var ID = "";
            var 字段中文名 = "";
            var 字段英文名 = "";
            var 字段类型 = "";
            var 输入框类型 = "";
            var 输入框参数 = "";
        } else { //edit 方法
            var ID = tablefield["ID"];
            var 字段中文名 = tablefield["ZDZWM"];
            var 字段英文名 = tablefield["ZDYWM"];
            var 字段类型 = tablefield["ZDLX"];
            var 输入框类型 = tablefield["SRKLX"];
            var 输入框参数 = tablefield["SRKCS"];
        }

        var 随机数 = "r" + parseInt(Math.random() * 10000);
        var $tr = $("<tr data-id='" + ID + "'></tr>");

        $tr.append($("<td></td>").append("<input name='ZDZWM' value='" + 字段中文名 + "' for='" + 随机数 + "' class='中文名' />"));

        $tr.append($("<td></td>").append("<input name='ZDYWM' value='" + 字段英文名 + "' class='" + 随机数 + "'/>"));

        var $select = os.sql.SYS_MB.build_select(os.sql.SYS_MB.field_type, 字段类型);
        $tr.append($("<td></td>").append($select.attr("name", "ZDLX")));

        var $select = os.sql.SYS_MB.build_select(os.sql.SYS_MB.input_type, 字段类型);
        $tr.append($("<td></td>").append($select.attr("name", "SRKLX")));

        $tr.append($("<td></td>").append("<input name='SRKCS' value='" + 输入框参数 + "'/>"));

        $tr.append("<td><button class='添加字段'>添加</button><button class='删除字段'>删除</button></td>");

        $tr.on("click", ".添加字段",
        function() { //绑定函数
            var $tr = os.sql.SYS_MB.build_tr();
            $(this).parent().parent().after($tr);
        });

        $tr.on("click", ".删除字段",
        function() { //绑定函数
            $(this).parent().parent().remove();
        });
        return $tr;
    }

}

os.sql.toolbar_mb = [{
    text: '新建模板',
    handler: function() {
        $(".add_val").remove();

        var $dialog = $("<div class='easyui-dialog add_val' title='新建模板' style='width:1000px; height:500px;' ></div>");
        var $title = os.sql.SYS_MB.build_title().appendTo($dialog); //初始化title 
        var $table = $("<table style='width:100%;'></table>");
        var $tr1 = os.sql.SYS_MB.build_tr1().appendTo($table); //初始化第一行

        var $table2 = $("<table style='width:100%;'></table>"); //初始化 table2 ,用作 实时生成表
        $table.on("keyup", "td",
        function() {
            $table2.html(function() {
                var $t = $("<table></table>");

                for (var i = 0; i < $("tr:gt(0)", $table).length; i++) {
                    var $tr = $("tr:gt(0)", $table).eq(i);

                    var 字段中文名 = $("[name='ZDZWM']", $tr).val();
                    var 字段英文名 = $("[name='ZDYWM']", $tr).val();
                    var 字段类型 = $("[name='ZDLX']", $tr).val();
                    var 输入框类型 = $("[name='SRKLX']", $tr).val();
                    var 输入框参数 = $("[name='SRKCS']", $tr).val();

                    if (输入框类型 == "radio" || 输入框类型 == "checkbox") {
                        var arr = 输入框参数.split(",");
                        var html = "";
                        $(arr).each(function(i) {
                            html += "<label><input type='" + 输入框类型 + "' name='" + 字段英文名 + "' />" + arr[i] + "</label>";
                        });
                        $t.append($("<tr><td>" + 字段中文名 + "</td><td>" + html + "</td></tr>"));
                    } else if (输入框类型 == "select") {
                        var arr = 输入框参数.split(",");
                        var html = "<select>";
                        $(arr).each(function(i) {
                            html += "<option>" + arr[i] + "</option>";
                        });
                        html += "</select>";
                        $t.append($("<tr><td>" + 字段中文名 + "</td><td>" + html + "</td></tr>"));
                    } else if (输入框类型 == "textarea") {
                        $t.append($("<tr><td>" + 字段中文名 + "</td><td><textarea></textarea></td></tr>"));
                    } else {
                        $t.append($("<tr><td>" + 字段中文名 + "</td><td><input type='" + 输入框类型 + "'/></td></tr>"));
                    }

                }
                return $t.children();

            });
        });

        $btn_save = $('<a href="javascript:void(0)" class="easyui-linkbutton" >提交</a>').click(function() { //提交事件
            var tablefield = [];
            $("tr:gt(0)", $table).each(function() { //将每一行数据放入 [];
                tablefield.push($("input,select", this).add($("input", $title)).serializeArray());
            });
			os.sql.sqls.create_table_MB(tablefield); //根据字段新建表
            os.sql.sqls.create_table(tablefield); //根据字段新建表
            //tablefield:[[{"name":"","value":""},{"name":"","value":""}],[...]]

            os.sql.刷新west_grid();
            $dialog.dialog('close');
        });

        $dialog.append($table).append($table2).append($btn_save).appendTo($("body"));
        $.parser.parse();
        $dialog.dialog('open');

    }
},
{
    text: '删除模板',
    handler: function() {
        var tablename = os.sql.center_grid.datagrid('getSelected')["BYWM"];
        os_sql("DELETE FROM SYS_MB WHERE BYWM = '" + tablename + "'"); //删除表数据
        os_sql('DROP TABLE ' + tablename); //删除表
        os.sql.刷新center_grid();
    }
},
{
    text: '修改模板',
    handler: function() {
        $(".add_val").remove();

        var $dialog = $("<div class='easyui-dialog add_val' title='修改表' style='width:1000px; height:500px;' ></div>");

        var MB_en = os.sql.center_grid.datagrid('getSelected')["BYWM"];
        var MB_cn = os.sql.center_grid.datagrid('getSelected')["BZWM"];
        var $title = os.sql.SYS_MB.build_title(MB_en, MB_cn).appendTo($dialog); //初始化title 
        var $table = $("<table style='width:100%;'></table>");
        var $tr1 = os.sql.SYS_MB.build_tr1().appendTo($table); //初始化第一行tr
        var tablefield = os_sql("select * from SYS_MB where BYWM= '" + MB_en + "' "); //查询行数据
        for (var i in tablefield) { //初始化行数据
            var $tr = os.sql.SYS_MB.build_tr(tablefield[i]); //生产行数据
            $table.append($tr);
        }

        $btn_save = $('<a href="javascript:void(0)" class="easyui-linkbutton" >提交</a>').click(function() { //提交事件
            var tablename = os.sql.center_grid.datagrid('getSelected')["BYWM"]; //先删除 后新建.. 
            os_sql("DELETE FROM SYS_MB WHERE BYWM = '" + tablename + "'");
            os_sql('DROP TABLE ' + tablename);

            var tablefield = [];
            $("tr:gt(0)", $table).each(function() { //将每一行数据放入 [];
                tablefield.push($("input,select", this).add($("input", $title)).serializeArray());
            });
			os.sql.sqls.create_table_MB(tablefield); //根据字段新建表
            os.sql.sqls.create_table(tablefield); //根据字段新建表
            //tablefield:[[{"name":"","value":""},{"name":"","value":""}],[...]]
            os.sql.刷新west_grid();
            $dialog.dialog('close');

        });

        $dialog.append($table).append($btn_save).appendTo($("body"));
        $.parser.parse();
        $dialog.dialog('open');

    }
},
{
    text: '刷新',
    handler: function() {
        os.sql.刷新center_grid();
    }
}];