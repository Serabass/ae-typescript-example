class JQExprParser {

    public static numberRegExp:RegExp = /^\d+(?:\.\d+)?$/;
    public static stringRegExp:RegExp = /^(['"])(.*?)\1$/;

    public static parseLexeme(lexeme:string) {
        throw "Under construction";
    }

    public static parse(expr:JQueryExpr, name:string) {
        var [match, negateSign, fnName, args] = name.match(/^(!)?(\w+)(?:\(([^)]+)\))?/);
        var negate = negateSign === '!';
        var fn:Function = expr[fnName];
        var result;
        var argsData;

        if (fn === void 0)
            throw `Expr function named ${fnName} not found!`;

        if (args) {
            argsData = args
                .split(/\s*;\s*/)
                .map(arg => {

                    if (!arg)
                        return void 0;

                    if (AEQRange.regExp.test(arg))
                        return AEQRange.from(arg);

                    if (Time.regExp.test(arg))
                        return Time.from(arg);

                    if (JQExprParser.numberRegExp.test(arg))
                        return parseFloat(arg);

                    if (JQExprParser.stringRegExp.test(arg)) {
                        var [match, quote, string] = arg.match(JQExprParser.stringRegExp);
                        return string;
                    }

                    return eval(arg);
                    /*try {
                        return eval(arg);
                    } catch (e) {
                        throw e;
                    }*/
                });
        }

        if (!name)
            throw `Expr function with name ${name} not found!`;

        result = fn(this, ...argsData);

        return negate ? !result : result;
    }
}
