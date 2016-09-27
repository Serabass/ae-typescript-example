interface AEQueryProps {

    startsAt():TimeValue;
    startsAt(value:TimeValue):AEQuery;

    endsAt():TimeValue;
    endsAt(value:TimeValue):AEQuery;

    threeD():boolean;
    threeD(value:boolean):AEQuery;

    threeDPerChar():boolean;
    threeDPerChar(value:boolean):AEQuery;

    active():boolean;
    active(value:boolean):AEQuery;

    enabled():boolean;
    enabled(value:boolean):AEQuery;

    'null'():boolean;
    'null'(value:boolean):AEQuery;

    name():string;
    name(value:string):AEQuery;

    quality():LayerQuality;
    quality(value:LayerQuality):AEQuery;

    samplingQuality():LayerSamplingQuality;
    samplingQuality(value:LayerSamplingQuality):AEQuery;

    solo():boolean;
    solo(value:boolean):AEQuery;

    selected():boolean;
    selected(value:boolean):AEQuery;

    trackMatteType():TrackMatteType;
    trackMatteType(value:TrackMatteType):AEQuery;

}

class AEQueryProps extends AEQueryExpr {

    private declareProp<T>(alias:string, prop:string = alias):AEQueryProps {
        this[alias] = function (value?:T):T|AEQueryProps {
            return (<AEQueryProps>this)._val<T>(prop, value);
        };
        return this;
    }

    private declareReadOnlyProp<T>(alias:string, prop:string = alias):AEQueryProps {
        this[alias] = function ():T {
            return (<AEQueryProps>this).first()[prop];
        };
        return this;
    }

    private _val<T>(key:string):T;
    private _val<T>(key:string, value:T):AEQuery;
    private _val<T>(...args) {
        var [key, value] = <[string, T]>args;
        if (value === void 0)
            return this.first()[key];

        return this.each((i, el) => {
            el[key] = value;
        });
    }

    constructor(query:(...args) => JQuery<Layer>) {
        super(query);

        this.declareProp<boolean>('shy');
        this.declareProp<TimeValue>('startsAt', 'inPoint');
        this.declareProp<TimeValue>('endsAt', 'outPoint');
        this.declareProp<boolean>('threeD', 'threeDLayer');
        this.declareProp<boolean>('threeDPerChar');
        this.declareProp<boolean>('active');
        this.declareProp<boolean>('enabled');
        this.declareProp<boolean>('solo');
        this.declareProp<boolean>('selected');
        this.declareReadOnlyProp<boolean>('null');
        this.declareReadOnlyProp<string>('name');
        this.declareProp<LayerQuality>('quality');
        this.declareProp<TrackMatteType>('trackMatteType');
        this.declareProp<LayerSamplingQuality>('samplingQuality');
    }

    private _valEx<G, S>(key:string, fns:{get:(value:G) => G, set:(value:S) => S}):G|S;
    private _valEx<G, S>(key:string, fns:{get:(value:G) => G, set:(value:S) => S}, value?:G|S):AEQuery;
    private _valEx<G, S>(...args:any[]) {
        var [key, fns, value] = args;
        if (value === void 0)
            return fns.get(this.first()[key]);

        return this.each(function (i, el) {
            el[key] = fns.set(<S>value);
        });
    }

    public duration():Time;
    public duration(value:TimeValue):AEQueryExpr;
    public duration(value?:TimeValue):Time|AEQueryExpr {

        var $this = (<AEQueryProps>this);
        var start:number = Time.from($this.startsAt()).getValue();

        if (value === void 0) {
            let end:number = Time.from($this.endsAt()).getValue();
            return Time.from(end - start);
        }

        $this.endsAt(start + Time.from(value).getValue());
        return <AEQueryExpr>this;
    }

}