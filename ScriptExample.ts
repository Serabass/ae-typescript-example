var ae = new AEQuery(),
    a:AEQuery = <AEQuery>ae.query(':within(00:19; 00:23)'),
    prop = a.prop('Transform / Position')
    ;

alert(a.select().length);