declare type IteratorFn = (index:number, el:any) => any;
declare type JQuerySelector = string | number | Function | RegExp;
declare type JQueryExpr = {[key:string]:Function};
declare class AfterEffectsTime {
}
declare type AETime = number | string | AfterEffectsTime | any;

declare type PropAnimateOptions = {
    startTime:number,
    endTime:number,
    stepFn:Function,
    stepValue?:number
}