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
        missing: (item:any) => item.footageMissing,
    };

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
            var items = project.items;

            for (let i = 1; i <= items.length; i++) {
                let item:any = items[i];
                if (this.compare(item, selector)) {
                    this.push(item);
                }
            }

            return this;
        });
    }

    public duplicate():AECompQuery {
        var ae:AECompQuery = new AECompQuery();

        this.each((i, el:any) => ae.push(el.duplicate()));

        return ae;
    }

    public remove() {
        return this.each((i, el) => {
            el.remove();
        });
    }

    public toString():string {
        return `AECompQuery [${this.length} layers]`;
    }
}