
(() => {
    this.ae = new AEQuery();
    var a:AEQuery = this.ae.query("Black Solid 7");
    this.a = a.prop("transform / scale");
    alert(this.a.prop);

    var x = new _WindowOrContainer();
})();