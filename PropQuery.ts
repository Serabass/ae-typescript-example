class PropQuery extends UndoGroup {
    // TODO Add a generics
    constructor(public prop:any) {
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

        for (var time = options.startTime; time <= options.endTime; time += options.stepValue) {
            let value = this.prop.valueAtTime(time, true);
            this.prop.setValueAtTime(time, options.stepFn(value, time))
        }

        return this;
    }

    public val(value?:any):any | PropQuery {
        if (value === void 0)
            return this.prop.value;

        this.prop.setValue(value);
        return this;
    }

    public atTime(time:TimeValue, value?:PropertyValue):any | PropQuery {
        var aeTime = Time.from(time);

        if (value !== void 0) {
            this.prop.setValueAtTime(aeTime.value, value);
            return this;
        }

        return this.prop.valueAtTime(aeTime.value, false /* ? */);
    }

    public keyValue(keyIndex:number, value?:PropertyValue) {

        if (value !== void 0) {
            this.prop.setValueAtKey(keyIndex, value);
            return this;
        }

        return this.prop.keyValue(keyIndex);
    }

    private _val<T>(key:string, value?:T):T|PropQuery {
        if (value === void 0)
            return this.prop[key];

        this.prop[key] = value;
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
        this.prop.remove();
        return this;
    }

    public removeKeys(keyIndex:number | number[]) {
        if (typeof keyIndex === 'number') {
            this.prop.removeKey(keyIndex);
        } else if (keyIndex instanceof Array) {
            for (let i = 0; i < keyIndex.length; i++) {
                this.prop.removeKey(i);
            }
        }

        return this;
    }

    public removeAllKeys() {
        while (this.prop.numKeys > 0) {
            this.prop.removeKey(1);
        }

        return this;
    }

    public isModified() {
        return this.prop.isModified
    }

    public type():PropertyType {
        return this.prop.propertyType;
    }
}
