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

declare type JQuerySelector = string | number | Function | RegExp;
declare type IteratorFn = (index:number, el:any) => any;

class UndoGroup {
    public undoGroup(fn:Function) {
        app.beginUndoGroup('AEQuery Undo Group');
        fn.call(this, this);
        app.endUndoGroup();
    }
}

function addGetter(prop:string) {
    alert(prop);
    return function (target: Function) {
        target.prototype[prop] = function (value?:any) {
            if (value === void 0)
                return this.first()[prop];

            this.first()[prop] = value;
        }
    }
}

class JQuery<T> extends UndoGroup {
    public length:number = 0;
[index:number]:T;

    constructor(public query:(...args) => JQuery<T>) {
        super();
    }

    public toArray() {
        return [].slice.call(this);
    }

    public first():T {
        return this[0];
    }

    public last():T {
        return this[this.length - 1];
    }

    public push(layer:T):JQuery<T> {
        this[this.length++] = layer;
        return this;
    }

    public each(fn:IteratorFn):JQuery<T> {
        for (var i = 0; i < this.length; i++) {
            fn.call(this[i], i, this[i]);
        }

        return this;
    }

    public map(fn:IteratorFn):JQuery<T> {
        for (var i = 0; i < this.length; i++) {
            this[i] = fn.call(this[i], i, this[i]);
        }

        return this;
    }

    public filter(fn:IteratorFn):JQuery<T> {
        var jQuery:JQuery<T> = new JQuery<T>(this.query);
        this.each((i, el) => jQuery.push(el));
        return jQuery;
    }

    public noop() {
    }
}
