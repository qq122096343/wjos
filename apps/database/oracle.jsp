<%@ page contentType="text/html; charset=utf-8" language="java" import="java.sql.*,java.io.*,java.util.*"%><%

    String sql = request.getParameter("sql"); 
  
    Class.forName("oracle.jdbc.driver.OracleDriver").newInstance();
    String url="jdbc:oracle:thin:@127.0.0.1:1521:xe";   
	String uid="os";
	String pwd="os";
    Connection con = DriverManager.getConnection(url,uid,pwd);
    Statement stmt=con.createStatement();
    ResultSet rst=stmt.executeQuery(sql);
    ResultSetMetaData rsmd = rst.getMetaData();
    List<Map<String, Object>> list=new ArrayList<Map<String,Object>>();

    while(rst.next())  {
    	HashMap<String, Object> map=new HashMap<String, Object>();	
    	for(int i=0;i<rsmd.getColumnCount();i++){
    		map.put("'"+rsmd.getColumnName(i+1)+"'","'"+rst.getString(i+1)+"'");
    	}
    	list.add(map);
   }
   
   rst.close();
   stmt.close();
   con.close();
%><%=list%>