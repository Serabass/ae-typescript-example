declare type IteratorFn = (index:number, el:any) => any;
declare type JQueryLayerSelector = string | number | Function | RegExp | Layer;
declare type JQueryCompSelector = string | number | Function | RegExp | CompItem;
declare type JQuerySelector = JQueryCompSelector | JQueryLayerSelector;
declare type JQueryExpr = {[key:string]:((item:any, ...args) => boolean)};
declare type TimeValue = number | string | Time | any | any[];
declare type JQueryContext = JQuerySelector | CompItem | ((...args) => JQuery<Layer>);

declare type PropAnimateOptions = {
    startTime:number,
    endTime:number,

    // stepFn must be compatible with jQuery Easing Plugin
    stepFn:Function,
    stepValue?:number
}