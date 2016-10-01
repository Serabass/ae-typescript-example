interface AEQuery {
    breakByGrid(options:AEQueryBBGOptions);
    gridEach(fn:Function);
}

declare type AEQueryBBGOptions = {
    xSize:number|string,
    ySize:number|string
};

AEQuery.prototype.breakByGrid = function (options:AEQueryBBGOptions) {
    /**
     * Break the layer
     * Pieces names:
     *   $layerName$:piece:$x$:$y$
     */

    var first:AVLayer = this.first();
    var result = new AEQuery();
    var xSize:number;
    var ySize:number;
    var rect = first.sourceRectAtTime(0, true);
    var scale = (<number[]>(<Property>first.property('Scale')).value).map(_ => _ / 100);
    var width = rect.width * scale[0];
    var height = rect.height * scale[1];
    var xIndex = 0, yIndex = 0;

    if (typeof options.xSize === "string") {
        let [match, value] = options.xSize.match(/^(\d+)%/);
        let v = parseFloat(value) / 100;
        xSize = width * (v);
    } else {
        xSize = <number>options.xSize;
    }

    if (typeof options.ySize === "string") {
        let [match, value] = options.ySize.match(/^(\d+)%/);
        let v = parseFloat(value) / 100;
        ySize = height * (v);
    } else {
        ySize = <number>options.ySize;
    }

    for (let x = 0; x < width; x += xSize) {
        for (let y = 0; y < height; y += ySize) {
            let dupl:AVLayer = <AVLayer>first.duplicate();
            let prop = (<any>dupl.mask.addProperty('Mask').property('Mask Path'));
            let path = prop.value;

            path.vertices = <[number, number][]>[
                [x, y],
                [x, y + ySize],
                [x + xSize, y + ySize],
                [x + xSize, y]
            ];

            prop.setValue(path);

            (<Property>dupl.property('Anchor Point')).setValue(
                [rect.left + x, rect.top + y]
            );

            let firstPos = (<Property>first.property('Position')).value;
            let anchPoint = (<Property>first.property('Anchor Point')).value;

            let left = firstPos[0] - anchPoint[0];
            let top = firstPos[1] - anchPoint[1];

            (<Property>dupl.property('Position')).setValue(
                [
                    left + x,
                    top + y
                ]
            );

            dupl.parent = first;
            dupl.name = `${first.name}:piece:${xIndex}:${yIndex}`;
            result.push(dupl);
            yIndex++;
        }
        xIndex++;
    }

    first.enabled = false;

    return result;
};

AEQuery.prototype.gridEach = function (fn:Function) {
    return this.each(function (i:number, el:Layer) {
        var args = el
            .name
            .match(/^.+?:piece:(\d+):(\d+)/)
            .slice(1)
            .map(_ => parseInt(_, 10))
        ;

        args.push(<any>el);

        return fn.apply(el, args);
    });
};