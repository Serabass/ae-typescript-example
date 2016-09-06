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
declare type PropAnimateOptions = {
    startTime:number,
    endTime:number,
    stepFn:Function,
    stepValue?:number
};

class AEQRange {
    constructor(public start:number,
                public includeStart:boolean,
                public includeEnd:boolean,
                public end:number) {
    }
}

class UndoGroup {
    public undoGroup(fn:Function) {
        app.beginUndoGroup('AEQuery Undo Group');
        fn.call(this, this);
        app.endUndoGroup();
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
}

class JQuery<T> extends UndoGroup {
    public length:number = 0;
[index:number]:T;

    constructor(public query:Function) {
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

    public noop() {}
}
