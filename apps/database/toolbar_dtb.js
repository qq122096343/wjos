os.sql.dtb = {
	new_dtb:function(tablename_en){
 
        var $dialog = $("<div class='easyui-dialog add_val' title='这是动态表" + tablename_en + "' style='width:400px; height:300px;' ></div>");
        var tablefield = os_sql("select * from SYS_MB WHERE BYWM = '" + tablename_en + "'");
        var $table = os.sql.dtb.build_table(tablefield);

        var $btn_save = $('<a href="javascript:void(0)" class="easyui-linkbutton" >保存</a>').click(function() {
            var arr = $("input,select,textarea", $table).serializeArray(); //表单转数组
            os.sql.dtb.insert(tablename_en, arr);

            $dialog.dialog('close');
            os.sql.刷新center_grid();
        });

        $dialog.append($table).append($btn_save).appendTo($("body"));
        $.parser.parse();
        $dialog.dialog('open');	
	},
    build_table: function(tablefield, row) { //生产第一行tr
        var $table = $("<table></table>")

        for (var i = 0; i < tablefield.length; i++) {

            var 字段中文名 = tablefield[i]["ZDZWM"];
            var 字段英文名 = tablefield[i]["ZDYWM"];
            var 字段类型 = tablefield[i]["ZDLX"];
            var 输入框类型 = tablefield[i]["SRKLX"];
            var 输入框参数 = tablefield[i]["SRKCS"];
            if (row == undefined) {
                var value = "";
            } else {
                var value = row[0][字段英文名];
            }
            var $td = $("<td></td>");

            if (输入框类型 == "radio") {
                var arr = 输入框参数.split(",");
                $(arr).each(function(i) {
                    if (arr[i] == value) {
                        $td.append("<label><input type='radio' name='" + 字段英文名 + "' value='" + arr[i] + "' checked=checked />" + arr[i] + "</label>");
                    } else {
                        $td.append("<label><input type='radio' name='" + 字段英文名 + "' value='" + arr[i] + "' />" + arr[i] + "</label>");
                    }
                });

            } else if (输入框类型 == "checkbox") {
                var arr = 输入框参数.split(",");
                $(arr).each(function(i) {
                    $td.append("<label><input type='checkbox' name='" + 字段英文名 + "' value='" + arr[i] + "' />" + arr[i] + "</label>");
                });

                var value = value.split(",");
                $(value).each(function(i) {
                    var val = value[i];
                    $(":checkbox", $td).each(function() {
                        if ($(this).val() == val) {
                            $(this).attr("checked", "checked");
                        }
                    });
                });

            } else if (输入框类型 == "select") {

                var arr = 输入框参数.split(",");
                var $select = $("<select name='" + 字段英文名 + "'>").appendTo($td);
                $(arr).each(function(i) {
                    if (arr[i] == value) {
                        $select.append("<option selected=selected>" + arr[i] + "</option>");
                    } else {
                        $select.append("<option>" + arr[i] + "</option>");
                    }

                });

            } else if (输入框类型 == "textarea") {
                $td.append("<textarea name='" + 字段英文名 + "'>" + value + "</textarea>");

            } else {
                $td.append("<input type='" + 输入框类型 + "' name='" + 字段英文名 + "'  value='" + value + "'/>");

            }

            var $tr = $("<tr><td>" + 字段中文名 + "</td></tr>").append($td);
            $table.append($tr);
        }
        return $table;

    },
    insert: function(tablename, arr) {
        var row = {}; //重构数组为对象,主要为有的字段多个属性
        for (var i in arr) { //初始化对象
            row[arr[i]["name"]] = [];
        }
        for (var i in arr) { //给对象赋值
            row[arr[i]["name"]].push(arr[i]["value"]);
        }

        var tablefield = []; //表字段
        for (var i in row) { //生成表字段
            tablefield.push(i);
        };

        var tablefieldval = []; //表数据
        for (var i in row) { //生成表数据
            tablefieldval.push("'" + row[i] + "'");
        };

        os_sql('INSERT INTO ' + tablename + ' (' + tablefield + ') VALUES (' + tablefieldval + ')'); //写入数据库
    },
    update: function(tablename, arr, select_id) {
        var row = {}; //重构数组为对象,主要为有的字段多个属性
        for (var i in arr) { //初始化对象
            row[arr[i]["name"]] = [];
        }
        for (var i in arr) { //给对象赋值
            row[arr[i]["name"]].push(arr[i]["value"]);
        }

        var tablefield = []; //表字段
        for (var i in row) { //生成表字段
            tablefield.push(i + "='" + row[i] + "'");
        };

        os_sql("update " + tablename + " set " + tablefield + " where id= '" + select_id + "'");

    }

}

os.sql.toolbar_dtb = [{
    text: 'D新增',
    handler: function() {
        $(".add_val").remove();
        if (os.sql.west_grid.datagrid('getSelected') == null) {
            os.tips("请选中一行.");
            return false;
        }
        var tablename_en = os.sql.west_grid.datagrid('getSelected')["TABLE_NAME"]; //取到选中表的英文名称
        var $dialog = $("<div class='easyui-dialog add_val' title='这是动态表" + tablename_en + "' style='width:400px; height:300px;' ></div>");
        var tablefield = os_sql("select * from SYS_MB WHERE BYWM = '" + tablename_en + "'");
        var $table = os.sql.dtb.build_table(tablefield);

        var $btn_save = $('<a href="javascript:void(0)" class="easyui-linkbutton" >保存</a>').click(function() {
            var arr = $("input,select,textarea", $table).serializeArray(); //表单转数组
            os.sql.dtb.insert(tablename_en, arr);

            $dialog.dialog('close');
            os.sql.刷新center_grid();
        });

        $dialog.append($table).append($btn_save).appendTo($("body"));
        $.parser.parse();
        $dialog.dialog('open');

    }
},
{
    text: '删除',
    handler: function() {
        $(".add_val").remove();
        if (os.sql.west_grid.datagrid('getSelected') == null || os.sql.center_grid.datagrid('getSelected') == null) {
            os.tips("请选中一行.");
            return false;
        }
        var tablename = os.sql.west_grid.datagrid('getSelected')["TABLE_NAME"];
        var select_id = os.sql.center_grid.datagrid('getSelected')["ID"];
        os_sql("DELETE FROM " + tablename + " WHERE id = '" + select_id + "'");
        os.sql.刷新center_grid();

    }
},
{
    text: '修改',
    handler: function() {
        $(".add_val").remove();
        if (os.sql.west_grid.datagrid('getSelected') == null || os.sql.center_grid.datagrid('getSelected') == null) {
            os.tips("请选中一行.");
            return false;
        }
        var tablename_en = os.sql.west_grid.datagrid('getSelected')["TABLE_NAME"]; //取到选中表的英文名称
        var $dialog = $("<div class='easyui-dialog add_val' title='这是动态表" + tablename_en + "' style='width:400px; height:300px;' ></div>");

        var tablefield = os_sql("select * from SYS_MB WHERE BYWM = '" + tablename_en + "'");

        var select_id = os.sql.center_grid.datagrid('getSelected')["ID"];
        var row = os_sql("select * from " + tablename_en + " where id= '" + select_id + "'");
        var $table = os.sql.dtb.build_table(tablefield, row);

        var $btn_save = $('<a href="javascript:void(0)" class="easyui-linkbutton" >保存</a>').click(function() {

            var arr = $("input,select,textarea", $table).serializeArray(); //表单转数组
            os.sql.dtb.update(tablename_en, arr, select_id);

            $dialog.dialog('close');
            os.sql.刷新center_grid();
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