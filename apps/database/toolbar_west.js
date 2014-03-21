os.sql.west = {
    field_type: ["VARCHAR2(1000)", "NUMBER"],
    //字段类型
 
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
            $title.append("中文名:<input name='BZWM' class='中文名'  for='" + 随机数 + "' />");
            $title.append("英文名:<input name='BYWM' class='" + 随机数 + "'/>");
        } else {
            $title.append("中文名:<input name='BZWM' class='中文名'  for='" + 随机数 + "' value='" + cn + "' />");
            $title.append("英文名:<input name='BYWM' class='" + 随机数 + "'  value='" + en + "'/>");
        }
        return $title;

    },
    build_tr1: function() { //生产第一行tr
        var $tr = $("<tr></tr>");
        $tr.append($("<td>中文名</td>"));
        $tr.append($("<td>英文名</td>"));
        $tr.append($("<td>属性</td>"));
        $tr.append("<td><button class='添加字段'>添加</button></td>");
        $tr.on("click", ".添加字段", function() { //绑定添加字段函数
            var $tr = os.sql.west.build_tr();
            $(this).parent().parent().after($tr);
        });

        return $tr;
    },
    build_tr: function(tablefield) { //生产tr
        if (tablefield == undefined) { //如果没传字段者为add 方法
            var 字段中文名 = "";
            var 字段英文名 = "";
            var 字段类型 = "";
        } else { //edit 方法

            var 字段中文名 = tablefield["COMMENTS"];
            var 字段英文名 = tablefield["COLUMN_NAME"];
            var 字段类型 = tablefield["数据类型"];
        }

        var 随机数 = "r" + parseInt(Math.random() * 10000);
        var $tr = $("<tr></tr>");

        $tr.append($("<td></td>").append("<input name='ZDZWM' value='" + 字段中文名 + "' for='" + 随机数 + "' class='中文名' />"));

        $tr.append($("<td></td>").append("<input name='ZDYWM' value='" + 字段英文名 + "' class='" + 随机数 + "'/>"));

        var $select = os.sql.SYS_MB.build_select(os.sql.SYS_MB.field_type, 字段类型);
        $tr.append($("<td></td>").append($select.attr("name", "ZDLX")));
 

        $tr.append("<td><button class='添加字段'>添加</button><button class='删除字段'>删除</button></td>");

        $tr.on("click", ".添加字段",
        function() { //绑定函数
            var $tr = os.sql.west.build_tr();
            $(this).parent().parent().after($tr);
        });

        $tr.on("click", ".删除字段",
        function() { //绑定函数
            $(this).parent().parent().remove();
        });
        return $tr;
    }

}



os.sql.toolbar_west = [{
    text: '新建表',
    handler: function() {
        $(".add_val").remove();
        var $dialog = $("<div class='easyui-dialog add_val' title='新建表' style='width:600px; height:420px;'></div>");
        var $title = os.sql.west.build_title().appendTo($dialog); //初始化title 
		var $table = $("<table style='width:100%;'></table>");
		var tr1=os.sql.west.build_tr1().appendTo($table);
 

        $btn_save = $('<a href="javascript:void(0)" class="easyui-linkbutton" >提交</a>').click(function() {

            var tablefield = [];
            $("tr:gt(0)", $table).each(function() { //将每一行数据放入 [];
                tablefield.push($("input,select", this).add($("input", $title)).serializeArray());
            });
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
    text: '删除表',
    handler: function() {
        var tablename = os.sql.west_grid.datagrid('getSelected')["TABLE_NAME"];
		
		var 不能删除的表=["SYS_MB","SEQ"]
		for (var i in 不能删除的表){
 			if(tablename==不能删除的表[i]){
				alert("这个表不能删!")
				return false;	
			}	
		}
		
        os_sql('DROP TABLE ' + tablename);
        os.sql.刷新west_grid();
    }
},
{
    text: '修改表',
    handler: function() {
        $(".add_val").remove();
        var tablename_en = os.sql.west_grid.datagrid('getSelected')["TABLE_NAME"];
        var tablename_cn = os.sql.west_grid.datagrid('getSelected')["COMMENTS"];

        var $dialog = $("<div class='easyui-dialog add_val' title='修改表' style='width:600px; height:420px;' ></div>");
    
        var $title = os.sql.west.build_title(tablename_en,tablename_cn).appendTo($dialog); //初始化title 
		var $table = $("<table style='width:100%;'></table>");
		var tr1=os.sql.west.build_tr1().appendTo($table);	
	 
    
        var tablefield = os.sql.sqls.查询表字段 (tablename_en);
        for (var i in tablefield) { //初始化行数据
            var $tr = os.sql.west.build_tr(tablefield[i]); //生产行数据
            $table.append($tr);
        }

        $btn_save = $('<a href="javascript:void(0)" class="easyui-linkbutton" >提交</a>').click(function() {
            os_sql('DROP TABLE ' + tablename_en);
			
            var tablefield = [];
            $("tr:gt(0)", $table).each(function() { //将每一行数据放入 [];
                tablefield.push($("input,select", this).add($("input", $title)).serializeArray());
            });
            os.sql.sqls.create_table(tablefield); //根据字段新建表
            //tablefield:[[{"name":"","value":""},{"name":"","value":""}],[...]]

            os.sql.刷新west_grid();
            $dialog.dialog('close');

        });

        $dialog.append($table).append($btn_save).appendTo($("body"));
        $.parser.parse();
        $dialog.dialog('open');
    }
}];