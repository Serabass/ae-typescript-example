
class AEQuery extends JQuery<Layer> {

    public expr:{[key:string]:Function} = {

        text: (layer:Layer) => layer instanceof TextLayer,
        av: (layer:Layer) => layer instanceof AVLayer,

        even: (layer:Layer) => layer.index % 2 === 0,
        odd: (layer:Layer) => layer.index % 2 !== 0,
        first: (layer:Layer) => layer.index === 1,
        last: (layer:Layer) => layer.index === layer.containingComp.numLayers,

        shy: (layer:Layer) => layer.shy,
        solo: (layer:Layer) => layer.solo,
        selected: (layer:Layer) => layer.selected,
        locked: (layer:Layer) => layer.locked,
        enabled: (layer:Layer) => layer.enabled,
        motionBlur: (layer:Layer) => (<AVLayer>layer).motionBlur,
        adjustment: (layer:Layer) => (<AVLayer>layer).adjustmentLayer,
        audioActive: (layer:Layer) => (<AVLayer>layer).audioActive,
        audioEnabled: (layer:Layer) => (<AVLayer>layer).audioEnabled,
        effectsActive: (layer:Layer) => (<AVLayer>layer).effectsActive,
        hasVideo: (layer:Layer) => layer.hasVideo,
        hasTrackMatte: (layer:Layer) => (<AVLayer>layer).hasTrackMatte,
        'null': (layer:Layer) => layer.nullLayer,
        timeRemapEnabled: (layer:Layer) => (<AVLayer>layer).timeRemapEnabled,

        nth: (layer:Layer, range:AEQRange) => {
            var result:boolean;
            result = range.includeStart ? layer.index >= range.start : layer.index > range.start;
            result = result && (range.includeEnd ? layer.index <= range.end : layer.index < range.end);

            return result;
        }
    };

    public compare(layer:Layer, selector:JQuerySelector) {
        switch (typeof selector) {
            case 'string':
                if (selector[0] === ':') {
                    let name = (<string>selector).substr(1);
                    let names = name.split('+');
                    let result = names.map(name => {
                        var [match, negateSign, fnName, args] = name.match(/^(!)?(\w+)(?:\(([^)]+)\))?/);
                        var negate = negateSign === '!';
                        var fn:Function = this.expr[fnName];
                        var result;
                        var argsData;

                        if (args) {
                            argsData = args
                                .split(';')
                                .map(arg => {
                                    var rangeRegexp:RegExp = /^(\d+(?:\.\d+)?)(?:(\.)?\.\.(\.)?(\d+(?:\.\d+)?))?$/;
                                    if (rangeRegexp.test(arg)) {
                                        let [match, start, includeStart1, includeEnd1, end] = arg.match(rangeRegexp);
                                        let includeStart = includeStart1 === '.';
                                        let includeEnd = includeEnd1 === '.';

                                        if (end === void 0) {
                                            end = start;
                                        }

                                        return new AEQRange(parseFloat(start), includeStart, includeEnd, parseFloat(end));
                                    }

                                    throw "Under construction";
                                });
                        }

                        if (!name)
                            throw `Expr function with name ${name} not found!`;

                        result = fn(layer, ...argsData);

                        return negate ? !result : result;
                    });

                    for (var i = 0; i < result.length; i++) {
                        if (result[i] !== true)
                            return false;
                    }

                    return true;
                }

                if (selector === '*')
                    return true;

                return layer.name === selector;

            case 'number':
                return layer.index === selector;

            case 'undefined':
                return true;

            case 'function':
                return (<Function>selector).call(layer);

            case 'object':
                if (selector instanceof RegExp)
                    return (<RegExp>selector).test(layer.name);

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

    public dupe():AEQuery {
        var ae:AEQuery = new AEQuery();

        this.each((i, el) => ae.push(el.duplicate()));

        return ae;
    }

    public select(value:boolean = true):AEQuery {
        this.each((i, el) => el.selected = value);
        return this;
    }

    public parent(parent?:any):any {
        if (!parent)
            return this.first().parent;

        var ae:AEQuery = new AEQuery();
        return this.each((i, el) => el.setParentWithJump(ae.query(parent).first()));
    }
}
