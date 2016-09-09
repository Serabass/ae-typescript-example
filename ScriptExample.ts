var ae = new AEQuery();
var a:AEQuery = <AEQuery>ae.query('*');
var length;

a = a.filter(':nth(3..6)');
length = a.length;
alert(length);