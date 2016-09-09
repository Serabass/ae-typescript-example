
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

    public value(value?:any):any | PropQuery {
        if (value === void 0)
            return this.prop.value;

        this.prop.setValue(value);
        return this;
    }

    public atTime(time:AETime, value?:PropertyValue):any | PropQuery {
        var aeTime = Time.from(time);

        if (value !== void 0) {
            this.prop.setValueAtTime(aeTime.value, value);
            return this;
        }

        throw "Under construction";
        // this.prop.valueAtTime(aeTime.value, false /* ? */);
    }

    public atKey(keyIndex:number, value?:PropertyValue) {

        if (value !== void 0) {
            this.prop.setValueAtKey(keyIndex, value);
            return this;
        }

        throw "Under construction";
        // Why undefined?
        // this.prop.valueAtKey(keyIndex);
    }
}
