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

class AEQuery extends JQuery<Layer> {

    public query:(selector:JQueryLayerSelector, comp?:JQueryCompSelector) => AEQuery;

    public expr:JQueryExpr = {

        text: layer => layer instanceof TextLayer,
        av: layer => layer instanceof AVLayer,

        even: layer => layer.index % 2 === 0,
        odd: layer => layer.index % 2 !== 0,
        first: layer => layer.index === 1,
        last: layer => layer.index === layer.containingComp.numLayers,

        '3d': layer => (<AVLayer>layer).threeDLayer,
        threeD: layer => (<AVLayer>layer).threeDLayer,
        shy: layer => layer.shy,
        solo: layer => layer.solo,
        selected: layer => layer.selected,
        locked: layer => layer.locked,
        enabled: layer => layer.enabled,
        guide: layer => (<AVLayer>layer).guideLayer,

        motionBlur: layer => (<AVLayer>layer).motionBlur,
        adjustment: layer => (<AVLayer>layer).adjustmentLayer,
        audioActive: layer => (<AVLayer>layer).audioActive,
        audioEnabled: layer => (<AVLayer>layer).audioEnabled,
        effectsActive: layer => (<AVLayer>layer).effectsActive,
        hasVideo: layer => layer.hasVideo,
        hasTrackMatte: layer => (<AVLayer>layer).hasTrackMatte,
        'null': layer => layer.nullLayer,
        timeRemapEnabled: layer => (<AVLayer>layer).timeRemapEnabled,
        trackMatte: layer => (<AVLayer>layer).isTrackMatte,
        hasParent: layer => (<AVLayer>layer).parent !== null,

        // Make 2n too (like CSS) for get, e.g., every 3rd element
        nth: (layer, range:AEQRange | Nth) => {
            if (range instanceof AEQRange)
                return (<AEQRange>range).contains(layer.index);

            if (range instanceof Nth)
                return (<Nth>range).check(layer.index);

            throw "123123123";
        },

        within: (layer, time1:Time, time2?:Time) => {
            if (time2 === void 0)
                return layer.inPoint === time1.value;

            return layer.inPoint >= time1.value && layer.inPoint <= time2.value
                && layer.outPoint >= time1.value && layer.outPoint <= time2.value;
        },

        starts: (layer, time1:Time, time2?:Time) => {
            if (time2 === void 0)
                return layer.inPoint === time1.value;

            return layer.inPoint >= time1.value && layer.inPoint <= time2.value;
        },

        ends: (layer, time1:Time, time2?:Time) => {
            if (time2 === void 0)
                return layer.outPoint === time1.value;

            return layer.outPoint >= time1.value && layer.outPoint <= time2.value;
        },

        light: (layer) => layer instanceof LightLayer,
        shape: (layer) => layer instanceof ShapeLayer,
        camera: (layer) => layer instanceof CameraLayer,
    };

    private compare(layer, selector:JQueryLayerSelector) {

        if (selector === '*' || selector === void 0)
            return true;

        switch (typeof selector) {
            case 'string':
                if (selector[0] === ':') {
                    let name = (<string>selector).substr(1);
                    let names = JQExprParser.parseLexemeList(name);
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
                return layer.index === selector;

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

    constructor(public context?:JQueryContext) {
        super(<(...args) => AEQuery>context);

        if (typeof context !== 'function') {
            super((selector:JQueryLayerSelector, comp:JQueryCompSelector = context || <CompItem>app.project.activeItem) => {
                var compQuery = new AECompQuery(),
                    self = this,
                    comps = compQuery.query(comp)
                    ;

                comps.each((i, comp) => {
                    var layers = comp.layers;
                    for (let i = 1; i <= layers.length; i++) {
                        let layer:Layer = layers[i];
                        let lexemes = JQExprParser.parseLexemeList(<string>selector, {delimiter: ','});

                        for (let li = 0; li < lexemes.length; li++) {
                            if (self.compare(layer, lexemes[li])) {
                                self.push(layer);
                            }
                        }
                    }
                });

                return this;
            });
        }
    }

    public '+'(object:AEQuery):AEQuery {
        var ae:AEQuery = new AEQuery;
        ae.each((i, el) => {
            ae.push(el);
        });
        this.each((i, el) => {
            ae.push(el);
        });
        return ae;
    }

    // TODO Check
    public '-'(object:AEQuery):AEQuery {
        return this.filter((i:number, el:any) => [].indexOf.call(this, el) >= 0);
    }

    public each(fn:IIterator<Layer>):AEQuery {
        return <AEQuery>super.each(fn);
    }

    /**
     * path === 'Transform / Position'
     * @param path
     * @param silent
     */
    public prop(path:string | string[], silent:boolean = false):PropQuery {
        var prop:any = this.first();
        var pathElements;

        switch (typeof path) {
            case 'string':
                pathElements = (<string>path).split(/\s*\/\s*/);
                break;

            case 'object':
                if (path instanceof Array) {
                    pathElements = path;
                }
                break;

        }

        if (!prop)
            return;

        while (pathElements.length > 0) {
            let pathElement = pathElements.shift();

            if (/^\d+$/.test(pathElement)) {
                prop = prop.property(parseInt(pathElement));
            } else {
                prop = prop.property(pathElement);
            }

            if (!prop) {
                if (silent)
                    return null;

                throw "Unknown Property:" + path;
            }
        }

        return new PropQuery(prop, path);
    }

    public props(selector:string):any {
        var layer:Layer = this.first();
        throw "Under construction";
    }

    public effect(selector:string | string[], silent:boolean = false):PropQuery {
        if (typeof selector === 'string')
            selector = (<string>selector).split(/\s*\/\s*/);

        return this.prop(['Effects'].concat(<string[]>selector), silent);
    }

    public map(fn:IIterator<Layer>):AEQuery {
        var ae:AEQuery = new AEQuery();

        this.each((i, el) => {
            ae.push(fn.call(this[i], i, this[i]));
        });

        return ae;
    }

    public duplicate():AEQuery {
        return this.map((i, el) => el.duplicate());
    }

    public select(value:boolean = true):AEQuery {
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
