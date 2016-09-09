class JQExprParser {

    static parseLexeme(lexeme:string) {
        throw "Under construction";
    }

    static parse(expr:JQueryExpr, name:string) {
        var [match, negateSign, fnName, args] = name.match(/^(!)?(\w+)(?:\(([^)]+)\))?/);
        var negate = negateSign === '!';
        var fn:Function = expr[fnName];
        var result;
        var argsData;

        if (args) {
            argsData = args
                .split(';')
                .map(arg => {
                    var rangeRegexp:RegExp = /^(\d+(?:\.\d+)?)(\.)?\.\.(\.)?(\d+(?:\.\d+)?)$/;
                    if (rangeRegexp.test(arg)) {
                        let [match, start, includeStart1, includeEnd1, end] = arg.match(rangeRegexp);
                        let includeStart = includeStart1 === '.';
                        let includeEnd = includeEnd1 === '.';

                        if (end === void 0) {
                            end = start;
                        }

                        return new AEQRange(parseFloat(start), includeStart, includeEnd, parseFloat(end));
                    }

                    if (/^\d+(?:\.\d+)?$/.test(arg))
                        return parseFloat(arg);

                    throw "Under construction";
                });
        }

        if (!name)
            throw `Expr function with name ${name} not found!`;

        result = fn(this, ...argsData);

        return negate ? !result : result;
    }
}