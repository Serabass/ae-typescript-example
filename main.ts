var t = $j('*');

t.undoGroup(function () {
    t.breakByGrid({
        xSize: '10%',
        ySize: '10%'
    }).gridEach(function (x, y, el:Layer) {
        var p:Property = <Property>el.property('Y Rotation');
        p.setValueAtTime(0, 0);
        p.setValueAtTime((x + y) / 12, 90);
    });
});