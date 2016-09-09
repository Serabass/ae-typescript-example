var ae = new AEQuery(),
    a:AEQuery = <AEQuery>ae.query(1)
    ;

alert(a.prop('Transform / Position').atTime("00:15"));