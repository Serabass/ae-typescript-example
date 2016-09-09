class PropQuery extends UndoGroup {
    // TODO Add a generics
    constructor(public prop:any, public path:string = null) {
        super();
    }

    public '=='(val:any) {
        switch (typeof val) {
            case 'string':
            case 'number':
                return this.prop.value === val;

            case 'object':
                if (val instanceof Array) {

                    if (!(this.prop.value instanceof Array))
                        return false;

                    if (!(this.prop.value.length !== val.length))
                        return false;

                    for (let i = 0; i < val.length; i++) {
                        if (val[i] !== this.prop.value[i])
                            return false;
                    }

                    return true;
                }

                if (val instanceof Property || val instanceof PropertyGroup)
                    return val === this.prop;


        }
    }

    public animate(options:PropAnimateOptions) {
        options.stepValue = options.stepValue || 1;
        return this.call(prop => {
            for (var time = options.startTime; time <= options.endTime; time += options.stepValue) {
                let value = this.prop.valueAtTime(time, true);
                prop.setValueAtTime(time, options.stepFn(value, time))
            }
        });
    }

    public val(value?:any):any | PropQuery {
        if (value === void 0)
            return this.prop.value;

        return this.call(prop => prop.setValue(value));
    }

    public atTime(time:TimeValue, value?:PropertyValue):any | PropQuery {
        var aeTime = Time.from(time);

        if (value !== void 0)
            return this.call(prop => prop.setValueAtTime(aeTime.value, value));

        return this.prop.valueAtTime(aeTime.value, false /* ? */);
    }

    public keyValue(keyIndex:number, value?:PropertyValue) {

        if (value !== void 0)
            return this.call(prop => prop.setValueAtKey(keyIndex, value));

        return this.prop.keyValue(keyIndex);
    }

    private _val<T>(key:string, value?:T):T|PropQuery {
        if (value === void 0)
            return this.prop[key];

        return this.call(prop => prop[key] = value);
    }

    public call(fn:(prop:Property, q:PropQuery) => void):PropQuery {
        fn(this.prop, this);
        return this;
    }

    public numKeys() {
        return this.prop.numKeys;
    }

    public active() {
        return this.prop.active;
    }

    public separated() {
        return this.prop.dimensionsSeparated;
    }

    public selected(value?:boolean) {
        return this._val<boolean>('selected', value);
    }

    public selectedKeys() {
        return this.prop.selectedKeys;
    }

    public nearestKeyIndex(time:Time) {
        return this.prop.nearestKeyIndex(time.value);
    }

    public name() {
        return this.prop.name;
    }

    public max() {
        return this.prop.maxValue;
    }

    public min() {
        return this.prop.minValue;
    }

    public enabled(value?:boolean) {
        return this._val<boolean>('enabled', value);
    }

    public enumerable(propName:string) {
        return this.prop.propertyIsEnumerable(propName);
    }

    public parent() {
        return new PropQuery(this.prop.parentProperty);
    }

    public remove() {
        return this.call(prop => prop.remove());
    }

    public removeKeys(...args:number[]) {
        return this.call(prop => {
            for (let i = 0; i < args.length; i++) {
                prop.removeKey(args[i]);
            }
        });
    }

    public removeAllKeys() {
        return this.call(prop => {
            while (prop.numKeys > 0) {
                prop.removeKey(1);
            }
        });
    }

    public isModified() {
        return this.prop.isModified
    }

    public type():PropertyType {
        return this.prop.propertyType;
    }

    public expr(value?:string):string | PropQuery {
        return this._val<string>('expression', value);
    }

    public exprEnabled(value?:boolean):boolean | PropQuery {
        return this._val<boolean>('expressionEnabled', value);
    }

    public keySelected(keyIndex:number, selected?:boolean):boolean | PropQuery {
        if (selected === void 0)
            return this.prop.selectedKeys.indexOf(keyIndex) >= 0;

        return this.call(prop => prop.setSelectedAtKey(keyIndex, selected));
    }

    public addKey(time:TimeValue) {
        return this.call((prop) => prop.addKey(Time.from(time).value));
    }

    public toString() {
        return `PropQuery "${this.path}"`;
    }
}
