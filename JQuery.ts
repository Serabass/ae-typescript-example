class UndoGroup {
    public undoGroupIndex:number = 0;

    public undoGroup(fn:Function, name:string = `AEQuery Undo Group ${this.undoGroupIndex++}`) {
        app.beginUndoGroup(name);
        fn.call(this, this);
        app.endUndoGroup();
        return this;
    }
}

class JQuery<T> extends UndoGroup { [index:number]:T;
    public length:number = 0;

    public static extend(...args:any[]) {
        var options, name, src, copy, copyIsArray, clone,
            target = args[0] || {},
            i = 1,
            length = args.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === "boolean") {
            deep = target;

            // Skip the boolean and the target
            target = args[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== "object" && !( typeof target === 'function' )) {
            target = {};
        }

        // Extend jQuery itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {

            // Only deal with non-null/undefined values
            if (( options = args[i] ) != null) {

                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && ( copy.constructor === Object ||
                        ( copyIsArray = (copy instanceof Array) ) )) {

                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && (src instanceof Array) ? src : [];

                        } else {
                            clone = src && src.constructor === Object ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = this.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    }

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
        // TODO Wrong! Must be returned a new array
        for (var i = 0; i < this.length; i++) {
            this[i] = fn.call(this[i], i, this[i]);
        }

        return this;
    }

    public noop():void {
    }
}
