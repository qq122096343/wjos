<%@ page contentType="text/html; charset=utf-8" language="java" import="java.sql.*,java.io.*,java.util.*"%><%

    String sql = request.getParameter("sql"); 
  
    Class.forName("oracle.jdbc.driver.OracleDriver").newInstance();
    String url="jdbc:oracle:thin:@127.0.0.1:1521:xe";   
	String uid="os";
	String pwd="os";
    Connection con = DriverManager.getConnection(url,uid,pwd);
    Statement stmt=con.createStatement();
    ResultSet rst=stmt.executeQuery(sql);
 
   
   rst.close();
   stmt.close();
   con.close();
%> 