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

class Time {

    public value:number;

    public minutes:number;
    public seconds:number;

    public static from(time:AETime):Time {
        return new this(time);
    }

    constructor(time:AETime) {
        switch (typeof time) {
            case 'string':
                let match;
                let rgx = /^(\d+):(\d+)$/;
                if (rgx.test(<string>time)) {
                    var m, s;
                    [match, m, s] = (<string>time).match(rgx);
                    this.minutes = m;
                    this.seconds = s;
                } else {
                    throw "Under construction";
                }
                break;

            case 'number':
                this.minutes = Math.floor(time / 60);
                this.seconds = time % 60;
                break;

            case 'object':
                this.minutes = (<any>time).minutes;
                this.seconds = (<any>time).seconds;
                break;
        }
    }

    // TODO Complete all getters and setters
    public get ____minutes() {
        throw "Under construction";
        //return Math.floor(this.value / 60);
    }

    // TODO Complete all getters and setters
    public get ___seconds() {
        throw "Under construction";
        //return Math.floor(this.value / 60);
    }
}

class AEQRange {
    constructor(public start:number,
                public includeStart:boolean,
                public includeEnd:boolean,
                public end:number) {
    }
}

class PropQuery extends UndoGroup {
    // TODO Add a generics
    constructor(public prop:Property) {
        super();
    }

    public animate(options:PropAnimateOptions) {
        options.stepValue = options.stepValue || 1;

        for (var time = options.startTime; time <= options.endTime; time += options.stepValue) {
            let value = this.prop.valueAtTime(time, true);
            this.prop.setValueAtTime(time, options.stepFn(value, time))
        }

        return this;
    }

    public value(value?:any):any | PropQuery {
        if (value === void 0)
            return this.prop.value;

        this.prop.setValue(value);
        return this;
    }

    public atTime(time:AETime, value?:PropertyValue):any | PropQuery {
        var aeTime = Time.from(time);

        if (value !== void 0) {
            this.prop.setValueAtTime(aeTime.value, value);
            return this;
        }

        throw "Under construction";
        // this.prop.valueAtTime(aeTime.value, false /* ? */);
    }

    public atKey(keyIndex:number, value?:PropertyValue) {

        if (value !== void 0) {
            this.prop.setValueAtKey(keyIndex, value);
            return this;
        }

        throw "Under construction";
        // Why undefined?
        // this.prop.valueAtKey(keyIndex);
    }
}

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
        super((selector:JQuerySelector, comp:CompItem = compItem) => {
            var layers = comp.layers;
            for (let i = 1; i <= layers.length; i++) {
                let layer:Layer = layers[i];
                if (this.compare(layer, selector)) {
                    this.push(layer);
                }
            }

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
}