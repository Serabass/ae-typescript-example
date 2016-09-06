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

    public value(value?:any):any | AEQuery {
        if (value === void 0)
            return this.prop.value;

        this.prop.setValue(value);
        return this;
    }
}

class AEQuery extends JQuery<Layer> {

    public expr:JQueryExpr = {

        text: (layer:Layer) => layer instanceof TextLayer,
        av: (layer:Layer) => layer instanceof AVLayer,

        even: (layer:Layer) => layer.index % 2 === 0,
        odd: (layer:Layer) => layer.index % 2 !== 0,
        first: (layer:Layer) => layer.index === 1,
        last: (layer:Layer) => layer.index === layer.containingComp.numLayers,

        '3d': (layer:Layer) => (<AVLayer>layer).threeDLayer,
        shy: (layer:Layer) => layer.shy,
        solo: (layer:Layer) => layer.solo,
        selected: (layer:Layer) => layer.selected,
        locked: (layer:Layer) => layer.locked,
        enabled: (layer:Layer) => layer.enabled,
        guide: (layer:Layer) => (<AVLayer>layer).guideLayer,

        motionBlur: (layer:Layer) => (<AVLayer>layer).motionBlur,
        adjustment: (layer:Layer) => (<AVLayer>layer).adjustmentLayer,
        audioActive: (layer:Layer) => (<AVLayer>layer).audioActive,
        audioEnabled: (layer:Layer) => (<AVLayer>layer).audioEnabled,
        effectsActive: (layer:Layer) => (<AVLayer>layer).effectsActive,
        hasVideo: (layer:Layer) => layer.hasVideo,
        hasTrackMatte: (layer:Layer) => (<AVLayer>layer).hasTrackMatte,
        'null': (layer:Layer) => layer.nullLayer,
        timeRemapEnabled: (layer:Layer) => (<AVLayer>layer).timeRemapEnabled,
        trackMatte: (layer:Layer) => (<AVLayer>layer).isTrackMatte,

        nth: (layer:Layer, range:AEQRange) => {
            var result:boolean;
            result = range.includeStart ? layer.index >= range.start : layer.index > range.start;
            result = result && (range.includeEnd ? layer.index <= range.end : layer.index < range.end);

            return result;
        }
    };

    private compare(layer:Layer, selector:JQuerySelector) {
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

                if (selector === '*')
                    return true;
                /*
                 let matches:boolean[] = (<string>selector).split(/\s*,\s*!/)
                 .map(string => this.compare(layer, string));
                 */

                return layer.name === selector;

            case 'number':
                return layer.index === selector;

            case 'undefined':
                return true;

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

        this.each((i, el:Layer) => ae.push(el.duplicate()));

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
