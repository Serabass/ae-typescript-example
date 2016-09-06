declare type JQuerySelector = string | number | Function | RegExp;
declare type IteratorFn = (index:number, el:any) => any;
declare type JQueryExpr = {[key:string]:Function};

declare type PropAnimateOptions = {
    startTime:number,
    endTime:number,
    stepFn:Function,
    stepValue?:number
};
