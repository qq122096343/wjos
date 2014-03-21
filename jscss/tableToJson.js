String.prototype.Trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, "");
}

function tableToJson(table) {
  var $table = $(table);
  var json = {};
  var tds = $("tr", $table).eq(0).children().length;
  $("tr", $table).each(function(i) {
    var td = {};
    for (var _i = 0; _i < tds; _i++) {
      td[_i] = $(this).children().eq(_i).text().Trim();;
    }
    json[i] = td;
  });
  return json;
}

function tableToJson2(table) {
  var $table = $(table);
  var json = {};
  $("tr", $table).each(function(i) {
    var td0 = $(this).children().eq(0).text().Trim();
    var td1 = $(this).children().eq(1).text().Trim();
    json[td0] = td1;
  });
  return json;
}
function tableToJson3(table) {
  var $table = $(table);
  var json = {"title":[],"rows":[]};
  var tds = $("tr", $table).eq(0).children().length;
  
	for (var i = 0; i < tds; i++) {
	  json.title.push( $("tr", $table).eq(0).children().eq(i).text().Trim());
	}  
  
  $("tr", $table).each(function(i) {
    var td = {};
    for (var _i = 0; _i < tds; _i++) {
      td[json.title[_i]]= $(this).children().eq(_i).text().Trim();
    }
json.rows.push(td);
  });
  return json;
}
function tableToJson4(table) {
  var $table = $(table);
  var json = {"title":"","rows":[]};
  var tds = $("tr", $table).eq(0).children().length;
  $("tr", $table).each(function(i) {
    var td = [];
    for (var _i = 0; _i < tds; _i++) {
      td.push( $(this).children().eq(_i).text().Trim());
    }
	if (i==0){ json.title=td;}
    else {json.rows.push(td);}
  });
  return json;
}