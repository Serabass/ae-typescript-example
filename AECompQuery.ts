declare type CreateCompOptions = {
    name:string,
    width:number,
    height:number,
    pixelAspect:number,
    duration:number,
    frameRate:number
};

class AECompQuery extends JQuery<any> {

    public expr:JQueryExpr = {
        comp: (item:any) => item instanceof CompItem,
        folder: (item:any) => item instanceof FolderItem,
        footage: (item:any) => item instanceof FootageItem,

        hasVideo: (item:any) => item.hasVideo,
        hasAudio: (item:any) => item.hasAudio,
        selected: (item:any) => item.selected,
        active: (item:any) => item === app.project.activeItem,
        useProxy: (item:any) => item.useProxy,
        footageMissing: (item:any) => item.footageMissing,
    };

    public static create(options:CreateCompOptions):AECompQuery {

        // TODO Make last 3 options not required (with default values)

        var comp = app.project.items
                .addComp(options.name, options.width, options.height, options.pixelAspect, options.duration, options.frameRate),
            _ = new AECompQuery().query;

        return <AECompQuery>_(comp);
    }

    private compare(item:any, selector:any) {

        if (selector === '*' || selector === void 0)
            return item instanceof CompItem;

        switch (typeof selector) {
            case 'string':
                if (selector[0] === ':') {
                    let name = (<string>selector).substr(1);
                    let names = name.split('+');
                    let result = names.map(name => JQExprParser.parse.call(item, this.expr, name));

                    for (var i = 0; i < result.length; i++) {
                        if (result[i] !== true)
                            return false;
                    }

                    return true;
                }

                return item.name === selector;

            case 'function':
                if (selector instanceof RegExp) // TODO Why the RegExp Object is a function?
                    return (<RegExp>selector).test(item.name);

                return (<Function>selector).call(item, item);

            case 'object':
                if (selector instanceof Array)
                    throw "Under construction";

                if (selector instanceof CompItem)
                    return item === selector;

                throw "Under construction";
            default:
                throw "Under construction";
        }
    }

    constructor(containingProject:Project = app.project) {
        super((selector:any, project:Project = containingProject) => {

            if (selector instanceof CompItem) {
                this.push(selector);
                return this;
            }

            for (let i = 1; i <= project.numItems; i++) {
                let item:any = project.items[i];
                if (this.compare(item, selector)) {
                    this.push(item);
                }
            }

            return this;
        });
    }

    public each(fn:IteratorFn):AECompQuery {
        return <AECompQuery>super.each(fn);
    }

    private _val<T>(key:string, value?:T):T|AECompQuery {
        if (value === void 0)
            return this.first()[key];

        return this.each((i, el) => {
            el[key] = value;
        });
    }

    public bgColor(color?:ColorValue) {
        return this._val('bgColor', color ? RGB.from(color).normalize() : void 0);
    }

    public duplicate():AECompQuery {
        var ae:AECompQuery = new AECompQuery();

        this.each((i, el:any) => ae.push(el.duplicate()));

        return ae;
    }

    public renderFrame1() {
        throw "Under construction";
        /*return this.each((i, el) => {
         el.renderFrame();
         });*/
    }

    public remove() {
        return this.each((i, el) => {
            el.remove();
        });
    }

    public setProxy() {
        return this.each((i, el) => {
            el.setProxy();
        });
    }

    public comment() {
        return this._val<string>('comment');
    }

    public precompose() {
        throw "Under construction";
    }

    public toString():string {
        return `AECompQuery [${this.length} layer${this.length === 1 ? '' : 's'}]`;
    }
}