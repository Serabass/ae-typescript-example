
class UndoGroup {
    public undoGroupIndex:number = 0;
    public undoGroup(fn:Function, name:string = `AEQuery Undo Group ${this.undoGroupIndex++}`) {
        app.beginUndoGroup(name);
        fn.call(this, this);
        app.endUndoGroup();
        return this;
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

    public each(fn:IIterator<T>):JQuery<T> {
        for (var i = 0; i < this.length; i++) {
            fn.call(this[i], i, this[i]);
        }

        return this;
    }

    public map(fn:IIterator<T>):JQuery<T> {
        for (var i = 0; i < this.length; i++) {
            this[i] = fn.call(this[i], i, this[i]);
        }

        return this;
    }

    public noop():void {
    }
}
