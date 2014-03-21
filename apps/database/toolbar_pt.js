os.sql.PT = {
    build_table: function(tablefield,row) { //生产第一行tr
        var $table = $("<table></table>")
		$table.append("<tr><td>字段名</td><td>内容</td></tr>");
		for (var i = 0; i < tablefield.length; i++) {
			var en=  tablefield[i]["COLUMN_NAME"];
			var cn=  tablefield[i]["COMMENTS"];
			if (row==undefined){
				$table.append("<tr><td>" + cn + "</td><td><input name='"+en+"' /></td></tr>");
			}else {
				$table.append("<tr><td>" + cn + "</td><td><input name='"+en+"' value='"+row[0][en]+"'/></td></tr>");
			} 
		}
		return $table;
        
    },
	insert:function(tablename,row){
			var field = [];
			var fieldval = [];
			for(var i in row){
				field.push(row[i]["name"]);
				fieldval.push("'"+row[i]["value"]+"'");
			}
			os_sql('INSERT INTO '+tablename +'('  + field + ') VALUES (' + fieldval + ')');

	},
	update:function(tablename,row,select_id){
			var field = [];
			for(var i in row){
				field.push(row[i]["name"]+"='"+row[i]["value"]+"'");
			}
			os_sql("update " + tablename + " set " + field + " where id= '" + select_id + "'");

	}

}
os.sql.toolbar_pt = [{
    text: '新增',
    handler: function() {
        $(".add_val").remove();
        if (os.sql.west_grid.datagrid('getSelected') == null) {
            os.tips("请选中一行.");
            return false;
        }
        var tablename_en = os.sql.west_grid.datagrid('getSelected')["TABLE_NAME"]; //取到选中表的英文名称

        var $dialog = $("<div class='easyui-dialog add_val' title='" + tablename_en + "' style='width:400px; height:300px;' ></div>");
		var tablefield = os.sql.sqls.查询表字段 (tablename_en);
        var $table = os.sql.PT.build_table(tablefield);

        var $btn_save = $('<a href="javascript:void(0)" class="easyui-linkbutton" >保存</a>').click(function() {

            var row = $("input", $table).serializeArray();
            os.sql.PT.insert(tablename_en,row);  
 
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

        var tablename_en = os.sql.west_grid.datagrid('getSelected')["TABLE_NAME"];
        var select_id = os.sql.center_grid.datagrid('getSelected')["ID"];

        var $dialog = $("<div class='easyui-dialog add_val' title='" + tablename_en + "' style='width:400px; height:300px;' ></div>");

 
		var tablefield = os.sql.sqls.查询表字段 (tablename_en);
		var row = os_sql("select * from " + tablename_en + "  where ID = '" + select_id + "'");
        var $table = os.sql.PT.build_table(tablefield,row);
		
		
        $btn_save = $('<a href="javascript:void(0)" class="easyui-linkbutton" >保存</a>').click(function() {
 
            var row = $("input", $table).serializeArray();
            os.sql.PT.update(tablename_en,row,select_id);  
 
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