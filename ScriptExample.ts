var ae = new AEQuery(),
    a:AEQuery = <AEQuery>ae.query(":nth(2>..<5)"),
    prop = a.prop('Transform / Position')
    ;

alert(a.length);