
declare type IteratorFn = (index:number, el:any) => any;

declare module AE {
    declare class AfterEffectsTime {}
    declare type JQuerySelector = string | number | Function | RegExp;
    declare type JQueryExpr = {[key:string]:Function};
    declare type AETime = number | string | AfterEffectsTime;

    declare type PropAnimateOptions = {
        startTime:number,
        endTime:number,
        stepFn:Function,
        stepValue?:number
    };
}