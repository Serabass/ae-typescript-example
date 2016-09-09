declare type IteratorFn = (index:number, el:any) => any;
declare type JQuerySelector = string | number | Function | RegExp | Layer;
declare type JQueryCompSelector = string | number | Function | RegExp | CompItem;
declare type JQueryExpr = {[key:string]:Function};
declare type TimeValue = number | string | Time | any | any[];

declare type PropAnimateOptions = {
    startTime:number,
    endTime:number,
    stepFn:Function,
    stepValue?:number
}