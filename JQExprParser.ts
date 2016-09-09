class JQExprParser {

    public static numberRegExp:RegExp = /^\d+(?:\.\d+)?$/;

    public static parseLexeme(lexeme:string) {
        throw "Under construction";
    }

    public static parse(expr:JQueryExpr, name:string) {
        var [match, negateSign, fnName, args] = name.match(/^(!)?(\w+)(?:\(([^)]+)\))?/);
        var negate = negateSign === '!';
        var fn:Function = expr[fnName];
        var result;
        var argsData;

        if (args) {
            argsData = args
                .split(';')
                .map(arg => {
                    if (AEQRange.regExp.test(arg))
                        return AEQRange.from(arg);

                    if (Time.regExp.test(arg))
                        return Time.from(arg);

                    if (JQExprParser.numberRegExp.test(arg))
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