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

class AEQuery extends AEQueryProps /*implements IAEQuery*/ {


    public query:(selector:JQueryLayerSelector, comp?:JQueryCompSelector) => AEQuery;

    private compare(layer, selector:JQueryLayerSelector) {

        if (selector === '*' || selector === void 0)
            return true;

        switch (typeof selector) {
            case 'string':
                if (selector[0] === ':') {
                    let name = (<string>selector).substr(1);
                    let names = JQExprParser.parseLexemeList(name);
                    let result = names.map(name => JQExprParser.parse.call(layer, this.expr, name));

                    for (let el of result) {
                        if (el !== true)
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
                    return selector === layer;

                throw "Under construction";
        }

        throw 12313123123123;
    }

    public static query(selector:JQueryLayerSelector, comp:JQueryCompSelector = <CompItem>app.project.activeItem):AEQuery {
        return new AEQuery().query(selector, comp);
    }

    constructor(public context?:JQueryContext) {
        super(<(...args) => AEQuery>context);

        if (typeof context !== 'function') {
            super((selector:JQueryLayerSelector, comp:JQueryCompSelector = context || <CompItem>app.project.activeItem):AEQuery => {
                var compQuery = new AECompQuery(),
                    self = this,
                    comps = compQuery.query(comp)
                    ;

                comps.each((i, comp) => {
                    var layers = comp.layers;
                    for (let i = 1; i <= layers.length; i++) {
                        let layer:Layer = layers[i];
                        if (typeof selector === 'string') {
                            let lexemes = JQExprParser.parseLexemeList(<string>selector, {delimiter: ','});

                            for (let lex of lexemes) {
                                if (self.compare(layer, lex)) {
                                    self.push(layer);
                                }
                            }

                            for (let lex of lexemes) {
                                if (self.compare(layer, lex)) {
                                    self.push(layer);
                                }
                            }
                        } else {

                            if (self.compare(layer, selector)) {
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
        return this.filter((i:number, el:any) =>
            [].indexOf.call(this, el) >= 0);
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

        return this.prop(['Effects', ...selector], silent);
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

        return this.each((i, el) => el.setParentWithJump(AEQuery.query(parent).first()));
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

    public moveAfter(layer:JQueryLayerSelector) {
        this.first().moveAfter(AEQuery.query(layer).first());
        return this;
    }

    public moveBefore(layer:JQueryLayerSelector) {
        this.first().moveBefore(AEQuery.query(layer).first());
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
