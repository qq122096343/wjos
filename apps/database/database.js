os.sql = {
    sqls: {查询所有表名: function() {
            return os_sql("SELECT DISTINCT user_tables.table_name, all_tab_comments.comments FROM user_tables, all_tab_comments  WHERE user_tables.table_name = all_tab_comments.table_name");
        },
        查询表字段: function(tablename_en) {
            //return os_sql("select column_name ,comments from user_col_comments  where table_name = '" + tablename_en + "'");
            return os_sql("select A.Table_Name  表名称,A.column_name COLUMN_NAME,A.data_type 数据类型, A.data_length 长度, B.comments COMMENTS from user_tab_columns A, user_col_comments B where A.Table_Name = '" + tablename_en + "' and A.Table_Name = B.Table_Name and A.Column_Name = B.Column_Name");

        },
        查询动态表字段: function(tablename_en) {
            //return os_sql("select column_name ,comments from user_col_comments  where table_name = '" + tablename_en + "'");
            return os_sql("SELECT * FROM SYS_MB where BYWM='" + tablename_en + "'");

        },
        查询表数据: function(tablename_en) {
            return os_sql("SELECT * FROM " + tablename_en + " where rownum <=20");;
        },
        "SYS_MB所有表名": function() {
            return os_sql("SELECT DISTINCT BYWM FROM SYS_MB");
        },
		create_table_MB:function(obj){//建表
			//obj:[[{"name":"","value":""},{"name":"","value":""}],[...]]
			var tablefield=[];
			for(var i in obj){//将传过来的数据进行转换
				var o={};
				for(var ii in obj[i]){
					o[obj[i][ii]["name"]]=obj[i][ii]["value"];
				}
				tablefield.push(o);
			}
			//tablefield:[{"BZWM":"","BYWM":"","ZDLX":""},{}]
 

            for(var i in tablefield){//讲转换后的数据 生产sql
                var field = [] ;
				var fieldval = [];
				for(var ii in tablefield[i]){
					field.push(ii);
                    fieldval.push("'"+tablefield[i][ii]+"'");
				}
                os_sql('INSERT INTO SYS_MB (id,' + field + ') VALUES (' + os.sql.get_seq() + "," + fieldval + ')');
            };

 
		},
		create_table:function(obj){//建表
			//obj:[[{"name":"","value":""},{"name":"","value":""}],[...]]
			var tablefield=[];
			for(var i in obj){//将传过来的数据进行转换
				var o={};
				for(var ii in obj[i]){
					o[obj[i][ii]["name"]]=obj[i][ii]["value"];
				}
				tablefield.push(o);
			}
			//tablefield:[{"BZWM":"","BYWM":"","ZDLX":""},{}]
			var tablename_en=tablefield[0]["BYWM"];
			var tablename_cn=tablefield[0]["BZWM"];	

 
			var sql = "create table " + tablename_en + " ( ";//create 语句
            for (var i in tablefield) {
                sql = sql + tablefield[i]["ZDYWM"] + " " + tablefield[i]["ZDLX"] + ",";
            }
            sql = sql.substring(0, sql.length - 1) + " )";
            os_sql(sql);
            os_sql("comment on table " + tablename_en + " is '" + tablename_cn + "' ");//表备注

            for (var i in tablefield) {//字段备注
                os_sql("comment on column " + tablename_en + "." + tablefield[i]["ZDYWM"] + " is '" + tablefield[i]["ZDZWM"] + "'");
            } 
		},

    },
    west_grid: {},
    center_grid: {},
    get_seq: function() { // 全局序列
        var seq = parseInt(os_sql("select id from seq where seq='seq' ")[0]["ID"]) + 1;
        os_sql("update seq set id = " + seq);
        return seq;
    },
    init: function() { //初始化方法
        os.sql.init_west_grid();
        os.sql.init_center_grid();
        $(".add_val").remove();
        $("button ,.l-btn").click(function(e) {
            e.stopPropagation();
        });
		
		$(document).on("keyup", "input.中文名", function() {
            var o = $(this);
            usejs({
                js: ["jscss/chinese.js"]
            },
            function() {
                var str = o.val().trim();
                if (str == "") return;
				$("."+o.attr("for")).val(makePy(str));
            });
        });
		
		
    },
    check_tablename: function(tablename_en) {
        var table_list = os.sql.sqls["SYS_MB所有表名"]();
        for (var i in table_list) {
            if (table_list[i]["BYWM"] == tablename_en) {
                return "动态表";
            }
        }
        if (tablename_en == "SYS_MB") {
            return "SYS_MB";
        } else {
            return "普通";
        }

    },
    init_west_grid: function() { //初始化左边的grid (表名列表)
        os.sql.west_grid = $("#west_grid").datagrid({
            url: null,
            title: "表列表",
            rownumbers: true,
            singleSelect: true,
            //单选
            columns: [[{
                field: "TABLE_NAME",
                title: "表名"
            },
            {
                field: "COMMENTS",
                title: "中文名"
            }]],
            toolbar: os.sql.toolbar_west,
            //功能菜单
            onClickRow: function(rowIndex, rowData) { //点击事件
                var tablename_en = rowData.TABLE_NAME;
                var tablename_cn = rowData.COMMENTS;
                var tablefield = os.sql.sqls.查询表字段 (tablename_en);

                var columns = [];
                for (var i in tablefield) { //根据查询到的字段 为center_grid 初始化表格题名
                    columns.push({
                        field: tablefield[i]["COLUMN_NAME"],
                        title: tablefield[i]["COMMENTS"]
                    });
                }

                if (os.sql.check_tablename(tablename_en) == "SYS_MB") { //不是模板表, 普通表格处理方法
                    usejs({
                        js: ["apps/datagrid-scrollview/datagrid-groupview.js"]
                    },
                    function() { //因为省去一张表名表,所以用group试图
                        os.sql.center_grid.datagrid({
                            title: tablename_en + "(" + tablename_cn + ")",
                            columns: [columns],
                            toolbar: os.sql.toolbar_mb,
                            //使用模板按钮
                            groupField: 'BZWM',
                            view: groupview,
                            groupFormatter: function(value, rows) {
                                return '模板: ' + value + ' , 共' + rows.length + ' 个字段.';
                            }
                        });

                        var rows = os.sql.sqls.查询表数据 (tablename_en); //获取center 数据
                        os.sql.center_grid.datagrid('loadData', rows); //载入数据
                    });

                } else if (os.sql.check_tablename(tablename_en) == "动态表") {
                    os.sql.center_grid.datagrid({
                        title: "动态表:"+tablename_en + "(" + tablename_cn + ")",
                        columns: [columns],
                        toolbar: os.sql.toolbar_dtb,
                        //使用普通按钮
                        view: $.fn.datagrid.defaults.view //覆盖默认gird试图
                    });

                    var rows = os.sql.sqls.查询表数据 (tablename_en); //获取center 数据
                    os.sql.center_grid.datagrid('loadData', rows); //载入数据
                } else if (os.sql.check_tablename(tablename_en) == "普通") { //如果是模板表,者方法不一样
                    os.sql.center_grid.datagrid({
                        title: tablename_en + "(" + tablename_cn + ")",
                        columns: [columns],
                        toolbar: os.sql.toolbar_pt,
                        //使用普通按钮
                        view: $.fn.datagrid.defaults.view //覆盖默认gird试图
                    });

                    var rows = os.sql.sqls.查询表数据 (tablename_en); //获取center 数据
                    os.sql.center_grid.datagrid('loadData', rows); //载入数据

                }
            }
        });

        os.sql.刷新west_grid();

    },
    init_center_grid: function() {
        os.sql.center_grid = $("#center_grid").datagrid({ //初始化数据表
            title: "数据",
            url: null,
            rownumbers: true
        });
    },
    自定义sql: function() { //提交自定义sql的方法
        var sql = $("#自定义sql").val();
        os_sql(sql);
    },
    刷新west_grid: function() {
        var rows = os.sql.sqls.查询所有表名 ();
        os.sql.west_grid.datagrid('loadData', rows);
    },
    刷新center_grid: function() {
        if (os.sql.west_grid.datagrid('getSelected') == null) {
            os.tips("请选中一行.");
            return false;
        }
        var tablename_en = os.sql.west_grid.datagrid('getSelected')["TABLE_NAME"];
        var rows = os.sql.sqls["查询表数据"](tablename_en);
        os.sql.center_grid.datagrid('loadData', rows);
    }

}