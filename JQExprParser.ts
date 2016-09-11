class JQExprParser {

    public static numberRegExp:RegExp = /^\d+(?:\.\d+)?$/;
    public static stringRegExp:RegExp = /^(['"])(.*?)\1$/;

    /**
     *  Examples:
     *   :expr1(11:99, 1, "123", :sub(1, 2, 3))
     *   :expr
     *   :expr()
     *
     */
    public static parseLexeme(lexeme:string) {
        throw "Under construction";
    }

    public static parseArg(arg:string) {

        if (!arg)
            return void 0;

        if (AEQRange.regExp.test(arg))
            return AEQRange.from(arg);

        if (Time.regExp.test(arg))
            return Time.from(arg);

        if (JQExprParser.numberRegExp.test(arg))
            return parseFloat(arg);

        if (JQExprParser.stringRegExp.test(arg)) {
            var match, quote, string;
            [match, quote, string] = arg.match(JQExprParser.stringRegExp);
            return string;
        }

        if (Nth.regExp.test(arg))
            return Nth.from(arg);

        throw 1231233;
        // return eval(arg);
        /*try {
         return eval(arg);
         } catch (e) {
         throw e;
         }*/
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
                .map(arg => JQExprParser.parseArg(arg));
        }

        if (!name)
            throw `Expr function with name ${name} not found!`;

        result = fn(this, ...argsData);

        return negate ? !result : result;
    }
}
