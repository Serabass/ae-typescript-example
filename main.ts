var t = $j('*');

t.undoGroup(function () {
    t.breakByGrid({
        xSize: '50%',
        ySize: '50%'
    })/*.gridEach(function (x, y, el:Layer) {
        var p:Property = <Property>el.property('Y Rotation');
        p.setValueAtTime(0, 0);
        p.setValueAtTime((x + y) / 12, 90);
    })*/;
});