interface AEQuery {
    pluginTest();
}

AEQuery.prototype.pluginTest = function ():AEQuery {
    alert(this.length);
    return this;
};