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

    public expr:JQueryExpr = {

        text: (layer:any) => layer instanceof TextLayer,
        av: (layer:any) => layer instanceof AVLayer,

        even: (layer:any) => layer.index % 2 === 0,
        odd: (layer:any) => layer.index % 2 !== 0,
        first: (layer:any) => layer.index === 1,
        last: (layer:any) => layer.index === layer.containingComp.numLayers,

        '3d': (layer:any) => (<AVLayer>layer).threeDLayer,
        shy: (layer:any) => layer.shy,
        solo: (layer:any) => layer.solo,
        selected: (layer:any) => layer.selected,
        locked: (layer:any) => layer.locked,
        enabled: (layer:any) => layer.enabled,
        guide: (layer:any) => (<AVLayer>layer).guideLayer,

        motionBlur: (layer:any) => (<AVLayer>layer).motionBlur,
        adjustment: (layer:any) => (<AVLayer>layer).adjustmentLayer,
        audioActive: (layer:any) => (<AVLayer>layer).audioActive,
        audioEnabled: (layer:any) => (<AVLayer>layer).audioEnabled,
        effectsActive: (layer:any) => (<AVLayer>layer).effectsActive,
        hasVideo: (layer:any) => layer.hasVideo,
        hasTrackMatte: (layer:any) => (<AVLayer>layer).hasTrackMatte,
        'null': (layer:any) => layer.nullLayer,
        timeRemapEnabled: (layer:any) => (<AVLayer>layer).timeRemapEnabled,
        trackMatte: (layer:any) => (<AVLayer>layer).isTrackMatte,

        nth: (layer:any, range:AEQRange) => {
            var result:boolean;
            result = range.includeStart ? layer.index >= range.start : layer.index > range.start;
            result = result && (range.includeEnd ? layer.index <= range.end : layer.index < range.end);

            return result;
        },

        // TODO Test it!
        belongs: (layer:any, time1:Time, time2?:Time) => {
            if (time2 === void 0)
                return layer.startTime === time1.value;

            return layer.startTime >= time1.value && layer.startTime <= time2.value
                && layer.outPoint >= time1.value && layer.outPoint <= time2.value;
        },

        startsAt: (layer:any, time1:Time, time2?:Time) => {
            if (time2 === void 0)
                return layer.startTime === time1.value;

            return layer.startTime >= time1.value && layer.startTime <= time2.value;
        }
    };

    private compare(layer:any, selector:JQuerySelector) {

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

    constructor(compItem:CompItem = <CompItem>app.project.activeItem) {
        // TODO Make comp argument as the selector for AECOmpQuery

        super((selector:JQuerySelector, comp:JQueryCompSelector = compItem) => {
            var compQuery = new AECompQuery(),
                self = this,
                comps = compQuery.query(comp)
                ;

            comps.each((i, comp) => {
                var layers = comp.layers;
                for (let i = 1; i <= layers.length; i++) {
                    let layer:Layer = layers[i];
                    if (self.compare(layer, selector)) {
                        self.push(layer);
                    }
                }
            });

            return this;
        });
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

    /**
     * path === 'Transform / Position'
     * @param path
     * @param strict
     */
    public prop(path:string, strict:boolean = false):PropQuery {
        var prop:any = this.first();
        var pathElements = path.split(/\s*\/\s*/);

        if (!prop)
            return;

        while (pathElements.length > 0) {
            let pathElement = pathElements.shift();
            prop = prop.property(pathElement);
        }

        return new PropQuery(prop);
    }

    public props(selector:string):any {
        var layer:Layer = this.first();
        throw "Under construction";
    }

    public duplicate():AEQuery {
        var ae:AEQuery = new AEQuery();

        this.each((i, el:any) => ae.push(el.duplicate()));

        return ae;
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

    private _val<T>(key:string, value?:T):T|AEQuery {
        if (value === void 0)
            return this.first()[key];

        this.first()[key] = value;
        return this;
    }

    public startTime(value?:number) {
        return this._val<number>('startTime', value);
    }

    public active(value?:boolean) {
        return this._val<boolean>('active', value);
    }

    public enabled(value?:boolean) {
        return this._val<boolean>('enabled', value);
    }

    public 'null'(value?:boolean) {
        return this.first().nullLayer;
    }

    public startTime(value?:number) {
        return this._val<number>('startTime', value);
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

    public toString():string {
        return `AEQuery [${this.length} layers]`;
    }
}