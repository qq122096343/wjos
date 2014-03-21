function jsonToTable(json){   //{"title":[标题],"rows":[[行],[行]]}
	
	var rows = "<table><tr>";

	for (var i = 0; i < json.title.length; i++) {
	  rows += "<th>" + json.title[i] + "</th>";
	};
	rows += "</tr>";

	for (var i = 0; i < json.rows.length; i++) {
	  rows += "<tr>";
	  for (var _i = 0; _i < json.title.length; _i++) {
		rows += "<td >" + json.rows[i][_i] + "</td>";
	  };
	  rows += "</tr>";
	};
	rows += "</table>";
	return rows;
}

function jsonToTable2(json){   //{"total":1,"rows":[{},{}]}
	
	var rows = "<table><tr>";
	var name_list={};
	$.ajax({
		type:"POST",
		url:$ctx+"/public/css/json/Rb.json",
		dataType: "json", 
		async: false,
		success: function(data){
			name_list=data;
		}
	});
	
	for (var i in json.rows[0]) {
	  var title= name_list[i];
	  if(title==undefined){title=i;}
	  rows += "<th>" + title + "</th>";
	};
	rows += "</tr>";
 
	for (var i = 0; i < json.rows.length; i++) {
	  rows += "<tr>";
	  for (var _i in json.rows[0]) {
			rows += "<td >" + json.rows[i][_i] + "</td>";
	  };
	  rows += "</tr>";
	};
	rows += "</table>";
	return rows;
}

function jsonToTable3(json){   //{"total":1,"rows":[{},{}]}
	
	var rows = "<table><tr>";
	var name_list={};
	$.ajax({
		type:"POST",
		url:"../json.json",
		dataType: "json", 
		async: false,
		success: function(data){
			name_list=data;
		}
	});
	
	for (var i in name_list) {
	  rows += "<th>" + name_list[i] + "</th>";
	};
	rows += "</tr>";
 
	for (var i = 0; i < json.rows.length; i++) {
	  rows += "<tr>";
	  for (var _i in name_list) {
		  rows += "<td >" + json.rows[i][_i] + "</td>";
	  };
	  rows += "</tr>";
	};
	rows += "</table>";
	return rows;
}


function jsonToTable4(json){   //{"total":1,"rows":[{},{}]}
		
	var rows = "<table><tr>";
	var name_list={};
	$.ajax({
		type:"POST",
		url:"title.json",
		dataType: "json", 
		async: false,
		success: function(data){
			name_list=data;
		}
	});

	for (var i in name_list) {
	  rows += "<th>" + name_list[i] + "</th>";
	  alert(name_list[i])
	};
	rows += "</tr>";
 
	for (var i = 0; i < json.rows.length; i++) {
	  rows += "<tr>";
	  for (var _i in name_list) {
		  rows += "<td >" + json.rows[i][_i] + "</td>";
	  };
	  rows += "</tr>";
	};
	rows += "</table>";
	return rows;
}