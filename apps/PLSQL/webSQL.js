String.prototype.trim = function() {　　
	return this.replace(/(^\s*)|(\s*$)/g, "");　　
}

if (!window.openDatabase) {  
    alert('不支持openDatabase.');  
} else {

	var dataBase = openDatabase("ams", "1.0", "档案库", 1024 * 1024,function() {});
	sql_noback("create table if not exists seq (id , seq)");
	/*	  dataBase.transaction(function(tx) {
		tx.executeSql('INSERT INTO seq ("id","seq") VALUES ("seq",' + 1+ ')', [],
		function() {},
		function(tx, error) {});
	});*/
	sql_noback("create table if not exists tablename (id , tablename)");
	sql_noback("create table if not exists tablefield (id , tablename , tablefield)");

}
var seq = {
"val": 0,
"get": function() {
	dataBase.transaction(function(tx) {
		tx.executeSql("select seq from seq where id = 'seq' ", [],function(tx, result) {
			seq["val"]=result.rows.item(0)["seq"]+1;
			dataBase.transaction(function(tx) {
					tx.executeSql("UPDATE seq SET seq = " +seq["val"]+" WHERE id = 'seq'", []);
			});
		});
	});
	return seq["val"];
}
}



function sql_noback(sql, f_success, f_error) {
dataBase.transaction(function(tx) {
  tx.executeSql(sql, [], 
  function() {
	if (f_success != undefined) {f_success();}
	$("#res").prepend($("<div>sql:"+sql+",----"+seq["get"]() + "成功!</div>"));
  },
  function(tx, error) {
	if (f_error != undefined) { f_error();}
	$("#res").prepend($("<div>sql:"+sql+",----"+seq["get"]() + '失败:' + error.message+"</div>"));
  });
});
}


function sql_back(sql, fn) {
dataBase.transaction(function(tx) {
  tx.executeSql(sql, [], fn,
  function(tx, error) {
	$("#res").prepend($("<div>sql:"+sql+",----"+seq["get"]() + '查询失败: ' + error.message+"</div>"));
  });
});
}




var plsql = {
grid: null,
fn: {
  "创建表": function() {
	var $tr = $("#创建表");
	var tablename = $(".tablename", $tr).text().trim();
	var tablefield = "id," + $(".tablefield", $tr).text().trim();
	var arr_field = tablefield.split(",");
	sql_noback('INSERT INTO tablename ("id","tablename") VALUES (' + seq["get"]() + ',"' + tablename + '")');
	$(arr_field).each(function() {
	  var tablefield = this;
	  sql_noback('INSERT INTO tablefield ("id","tablename", "tablefield") VALUES (' + seq["get"]() + ',"' + tablename + '","' + tablefield + '")');
	});
	sql_noback('create table if not exists ' + tablename + ' (' + tablefield + ')');

  },
  "删除表": function() {
	var $tr = $("#删除表");
	var tablename = $(".tablename", $tr).text().trim();
	sql_noback("DELETE FROM tablename WHERE tablename = '" + tablename + "'");
	sql_noback("DELETE FROM tablefield WHERE tablename = '" + tablename + "'");
	sql_noback("DROP TABLE " + tablename);

  },
  "查询表": function() {
	var sql = "select * from tablename ";
	var fn = function(tx, result) {
	  $(".tablename_list").remove();
	  var $table = $("<table class='tablename_list'><tr><td >表名</td></tr></table>").appendTo($(".sql_west"));
	  for (var i = 0; i < result.rows.length; i++) {
		var tablename = result.rows.item(i)['tablename'];
		$table.append($("<tr><td class='查询表结构'>" + tablename + "</td></tr>"));
	  }
	}
	sql_back(sql, fn);

  },
  "查询表结构": function() {
	var tablename = $(this).text();
	var sql = "select * from tablefield where tablename = '" + tablename + "'";
	var fn = function(tx, result) {
	  $(".表结构").remove();
	  var $table = $("<table class='表结构'><tr><td>表结构</td></tr></table>").appendTo($(".sql_east"));
	  for (var i = 0; i < result.rows.length; i++) {
		var tablefield = result.rows.item(i)['tablefield'];
		$table.append($("<tr><td>" + tablefield + "</td></tr>"));
	  }
	}
	sql_back(sql, fn);

  },
  "新增数据": function() {
	var tablename = $(".datagrid .panel-title").text();
	$(".add_val").remove();
	var $dialog = $("<div class='easyui-dialog add_val' title='" + tablename + "' style='width:400px; height:300px;' ></div>").appendTo($("body"));
	var $table = $("<table><tr><td>字段名</td><td>内容</td></tr></table>").appendTo($dialog);
	var sql = "select * from tablefield where tablename = '" + tablename + "'";
	var fn = function(tx, result) {
	  for (var i = 0; i < result.rows.length; i++) {
		var tablefield = result.rows.item(i)['tablefield'];
			if(tablefield=="id"){
				$table.append($("<tr><td>" + tablefield + "</td><td><input value='"+seq["get"]() +"'  id='seq_id'/></td></tr>"));
			} else {
				$table.append($("<tr><td>" + tablefield + "</td><td><input /></td></tr>"));
			}
		
	  }
	}
	sql_back(sql, fn);

	$btn_save = $('<a href="javascript:void(0)" class="easyui-linkbutton" >保存</a>').click(function() {

	  var tablename = $(".panel-title", $dialog.parent()).text();
	  var tablefield = $("table tr:gt(0)", $dialog.parent()).map(function() {
		return $(this).children().eq(0).text();
	  }).get().join(",");

	  var tablefieldval = $("table tr:gt(0)", $dialog.parent()).map(function() {
		return '"'+$("input", this).val()+'"';
	  }).get().join(",");

	  sql_noback('INSERT INTO ' + tablename + ' (' + tablefield + ') VALUES (' + tablefieldval + ')');
	  
	  $("#seq_id").val(seq["get"]())

	})

	$dialog.append($btn_save);
	$.parser.parse();
	$dialog.dialog('open');

  },
  "删除数据": function() {
		var tablename = $(".datagrid .panel-title").text();
		var select_id= plsql["grid"].datagrid('getSelected')["id"];
		sql_noback("DELETE FROM "+tablename+" WHERE id = '"+select_id+"'");
		sql_noback("DELETE FROM "+tablename+" WHERE id = "+select_id);
		plsql["fn"]["载入数据"](tablename);

  },
  "刷新数据": function() {
	  	var tablename = $(".datagrid .panel-title").text();
		plsql["fn"]["载入数据"](tablename);

  },
  "载入数据": function(tablename) {
	var sql = "select * from " + tablename;
	var json = {
	  "rows": []
	};
	var fn = function(tx, result) {
	  for (var i = 0; i < result.rows.length; i++) {
		json["rows"].push(result["rows"].item(i));
	  }
	  plsql["grid"].datagrid('loadData', json);
	}
	sql_back(sql, fn);

  },
  "生成数据表格": function(tablename) {
	var sql = "select * from tablefield where tablename = '" + tablename + "'";
	var fn = function(tx, result) {
	  var arr = []
	  for (var i = 0; i < result.rows.length; i++) {
		var tablefield = result.rows.item(i)['tablefield'];
		arr.push({
		  field: tablefield,
		  title: tablefield,
		  sortable:true,
		  editor:'text',
		  width: 60
		});
	  }
        var editIndex = undefined;
        function endEditing(){
            if (editIndex == undefined){return true}
            if (plsql["grid"].datagrid('validateRow', editIndex)){
  
                plsql["grid"].datagrid('endEdit', editIndex);
                editIndex = undefined;
                return true;
            } else {
                return false;
            }
        }
	  plsql["grid"] = $("#grid").datagrid({
		title: tablename,
		url: null,
		rownumbers: true,
/*		onClickRow: function(index){
		 
             if (editIndex != index){
                if (endEditing()){
                     plsql["grid"].datagrid('selectRow', index)
                            .datagrid('beginEdit', index);
                    editIndex = index;
                } else {
                    plsql["grid"].datagrid('selectRow', editIndex);
                }
            }
   
			},*/
		singleSelect: true,
		toolbar: [{
		  text: '新增',
		  handler: plsql["fn"]["新增数据"]
		},{
		  text: '删除',
		  handler:plsql["fn"]["删除数据"]
		},{
		  text: '刷新',
		  handler:plsql["fn"]["刷新数据"]
		}],
		columns: [arr]
	  });

	  plsql["fn"]["载入数据"](tablename);

	}
	sql_back(sql, fn);

  }

}
}
function for_in(a){
	var arr=[]
	for (var i in a){
		arr.push(i)
	}
	alert(arr)
}
function for_in_val(a){
	var arr=[]
	for (var i in a){
		arr.push(a[i])
	}
	alert(arr)
}