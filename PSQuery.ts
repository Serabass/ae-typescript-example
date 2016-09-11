/**
 * Selectors that I want to see:
 * :shy+locked
 * :motionBlur, Solid 1
 * :solo+enabled
 * :text+!enabled
 *
 *
 * Features:
 *  - Break a layer
 *  - Break by Voronoi
 *  -
 */

class PSQuery extends JQuery<any> {

    public query:(selector:any, doc?:any) => PSQuery;

    public expr:JQueryExpr = {
        bg: (layer) => layer.isBackgroundLayer,
        visible: (layer) => layer.visible,
        grouped: (layer) => layer.grouped,
    };

    private compare(layer, selector:any) {

        if (selector === '*' || selector === void 0)
            return true;

        switch (typeof selector) {
            case 'string':
                if (selector[0] === ':') {
                    let name = (<string>selector).substr(1);
                    let names = name.split('+');
                    let result = names.map(name => JQExprParser.parse.call(layer, this.expr, name));

                    for (var i = 0; i < result.length; i++) {
                        if (result[i] !== true)
                            return false;
                    }

                    return true;
                }

                /*
                 let matches:boolean[] = (<string>selector).split(/\s*,\s*!/)
                 .map(string => this.compare(layer, string));
                 */

                return layer.name === selector;

            case 'number':
                return layer.itemIndex === selector;

            case 'function':
                if (selector instanceof RegExp) // TODO Why the RegExp Object is a function?
                    return (<RegExp>selector).test(layer.name);

                return (<Function>selector).call(layer, layer);

            case 'object':
                if (selector instanceof Array)
                    throw "Under construction";

                if (selector.constructor.name.indexOf('Layer') >= 0)
                    return true;

                throw "Under construction";
        }

        throw 12313123123123;
    }

    constructor(public doc?:any) {
        super(doc);

        if (typeof doc !== 'function') {
            super((selector:any, doc:any = doc || (<any>app).activeDocument) => {

                var layers = doc.activeDocument.layers;
                for (let i = 1; i <= layers.length; i++) {
                    let layer:any = layers[i];
                    if (this.compare(layer, selector)) {
                        this.push(layer);
                    }
                }

                return this;
            });
        }
    }

    public each(fn:IIterator<Layer>):PSQuery {
        return <PSQuery>super.each(fn);
    }

    public map(fn:IIterator<Layer>):PSQuery {
        var ae:PSQuery = new PSQuery();

        this.each((i, el) => {
            ae.push(fn.call(this[i], i, this[i]));
        });

        return ae;
    }

    public duplicate():PSQuery {
        return this.map((i, el) => el.duplicate());
    }

    public select(value:boolean = true):PSQuery {
        this.each((i, el) => {
            el.selected = value
        });
        return this;
    }

    public parent(parent?:any):any {
        if (!parent)
            return this.first().parent;

        var ae:AEQuery = new AEQuery();
        return this.each((i, el) => el.setParentWithJump(ae.query(parent).first()));
    }

    public filter(selector:JQueryLayerSelector):AEQuery {
        var self = this;
        return <AEQuery>new AEQuery(function (selector:JQueryLayerSelector) {
            self.each((i, layer) => {
                if (self.compare(layer, selector)) {
                    this.push(layer);
                }
            });

            return this;
        }).query(selector);
    }

    private _val<T>(key:string, value?:T):T|AEQuery {
        if (value === void 0)
            return this.first()[key];

        return this.each((i, el) => {
            el[key] = value;
        });
    }

    public inPoint(value?:number) {
        return this._val<number>('inPoint', value);
    }

    public outPoint(value?:number) {
        return this._val<number>('outPoint', value);
    }

    public duration(value?:number) {
        if (value !== void 0) {
            let v = <number>this.inPoint() + value;
            return this._val<number>('outPoint', v);
        }

        return <number>this._val<number>('outPoint')
            - <number>this._val<number>('startTime')
            ;
    }

    public threeD(value?:number) {
        return this._val<number>('threeDLayer', value);
    }

    public threeDPerChar(value?:number) {
        return this._val<number>('threeDPerChar', value);
    }

    public active(value?:boolean) {
        return this._val<boolean>('active', value);
    }

    public enabled(value?:boolean) {
        return this._val<boolean>('enabled', value);
    }

    public 'null'() {
        return this.first().nullLayer;
    }

    public name(value?:string) {
        return this._val<string>('name', value);
    }

    public quality(value?:LayerQuality) {
        return this._val<LayerQuality>('quality', value);
    }

    public samplingQuality(value?:LayerSamplingQuality) {
        return this._val<LayerSamplingQuality>('quality', value);
    }

    public shy(value?:boolean) {
        return this._val<boolean>('shy', value);
    }

    public solo(value?:boolean) {
        return this._val<boolean>('solo', value);
    }

    public selected(value?:boolean) {
        return this._val<boolean>('selected', value);
    }

    public trackMatteType(value?:TrackMatteType) {
        return this._val<TrackMatteType>('trackMatteType', value);
    }

    public moveAfter(layer:JQueryLayerSelector) {
        var q = new AEQuery();
        this.first().moveAfter(q.query(layer).first());
        return this;
    }

    public moveBefore(layer:JQueryLayerSelector) {
        var q = new AEQuery();
        this.first().moveBefore(q.query(layer).first());
        return this;
    }

    public moveToBeginning() {
        this.first().moveToBeginning();
        return this;
    }

    /// TODO WHY???????
    public moveTo(index:number) {
        this.first().moveTo(index);
        return this;
    }

    public moveToEnd() {
        this.first().moveToEnd();
        return this;
    }

    public openInViewer() {
        throw "Under construction";
    }

    public toString():string {
        return `AEQuery [${this.length} layer${this.length === 1 ? '' : 's'}]`;
    }
}
