class AECompQuery extends JQuery<CompItem> {

    public expr:JQueryExpr = {

    };

    private compare(item:CompItem, selector:any) {
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


                if (selector === '*')
                    return true;

                return item.name === selector;

            case 'undefined':
                return true;

            case 'function':
                if (selector instanceof RegExp) // TODO Why the RegExp Object is a function?
                    return (<RegExp>selector).test(item.name);

                return (<Function>selector).call(item, item);

            case 'object':
                if (selector instanceof Array)
                    throw "Under construction";

                if (selector.constructor.name.indexOf('Layer') >= 0)
                    return true;

                throw "Under construction";
            default:
                throw "Under construction";
        }
    }

    constructor(containingProject:Project = app.project) {
        super((selector:any, project:Project = containingProject) => {
            var items = project.items;

            for (let i = 1; i <= items.length; i++) {
                let item:CompItem = <CompItem>items[i];
                if (this.compare(item, selector)) {
                    this.push(item);
                }
            }

            return this;
        });
    }
}