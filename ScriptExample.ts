var ae = new AEQuery(),
    a:AEQuery = <AEQuery>ae.query(1),
    prop = a.prop('Transform / Position')
    ;

alert(a.trackMatteType().toString());