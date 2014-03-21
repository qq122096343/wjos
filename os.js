var os ={//系统方法
	i:0,
	info:function(info){
		os.i=os.i+1;
		//console.info(os.i);
		console.info(info);//打印后台日志
	} 
}


function os_sql(str) {
	var data = "sql=" + encodeURI(str);
	os.info("sql语句: " + str);
	//os.info("url编码: " + data);

	var s=data.substring(0,20);

	if (/select|SELECT/.test(s)) {
		var obj = {};
		$.ajax({
			url: "../database/oracle.jsp",
			data: data,
			async: false,
			success: function(a) {
				os.info(a.replace(/=/g, ":"));
				obj = eval(a.replace(/=/g, ":"));
				//os.info("成功!");
				os.info(obj);
			}
		});
		return obj;
	} else {
		$.ajax({
			url: "../database/oracle_noback.jsp",
			data: data,
			async: false,
			success: function() {
				os.info("成功!");
			}
		});
	}
} 