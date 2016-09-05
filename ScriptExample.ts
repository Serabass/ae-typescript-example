declare type JQuerySelector = string | number | Function | RegExp;
declare type IteratorFn = (index:number) => any;

class JQuery {
    [index:number]:Layer;
    public length:number = 0;

    constructor(public init:Function) {

    }

    public push(layer:Layer):JQuery {
        this[this.length++] = layer;
        return this;
    }

    public each(fn:IteratorFn):JQuery {
        for (var i = 0; i < this.length; i++) {
            fn.call(this[i], i);
        }

        return this;
    }

    public map(fn:IteratorFn):JQuery {
        for (var i = 0; i < this.length; i++) {
            this[i] = fn.call(this[i], i);
        }

        return this;
    }
}

class AEQuery extends JQuery {
    constructor(comp:CompItem = <CompItem>app.project.activeItem) {
        super((selector:JQuerySelector) => {
            var layers = comp.layers;
            for (var i = 1; i <= layers.length; i++) {
                var layer:Layer = layers[i];
                switch (typeof selector) {
                    case 'string':
                        if (layer.name === selector) {
                            this.push(layer);
                        }
                        break;
                    case 'number':
                        if (layer.index === selector) {
                            this.push(layer);
                        }
                        break;
                    case 'undefined':
                        this.push(layer);
                        break;
                }
            }

            return this;
        });
    }
}

(() => {
    var ae:AEQuery = new AEQuery();

    var s = ae.init();
    alert(s.length);
})();