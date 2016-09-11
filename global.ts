var aeQuery:AEQuery = new AEQuery();
var $j = function (...args:any[]):AEQuery {
    var aeQ = new AEQuery();
    return aeQ.query.apply(aeQ, args);
};