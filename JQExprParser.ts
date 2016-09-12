declare type JQExprLexemeParserOptions = {
    delimiter?:string,
    brackets?: {
        open?:string,
        close?:string
    }
};

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
    public static parseLexemeList(lexeme:string, options:JQExprLexemeParserOptions = {}) {
        var result = [],
            level = 0,
            chars = lexeme.split('');
        options.delimiter = options.delimiter || '+';
        options.brackets = options.brackets || {open: '(', close: ')'};
        options.brackets.open = options.brackets.open || '(';
        options.brackets.close = options.brackets.close || ')';

        var currentString = '';

        function x(ch:string) {

            switch (ch) {
                case options.delimiter:
                case void 0:
                    if (level === 0) {
                        result.push(currentString);
                        currentString = '';
                    } else {
                        currentString += ch;
                    }
                    return;

                case options.brackets.open:
                    level++;
                    currentString += ch;
                    return;

                case options.brackets.close:
                    level--;
                    currentString += ch;
                    return;

                default:
                    currentString += ch;
            }
        }

        while (chars.length >= 0) {
            var ch = chars.shift();

            x(ch);

            if (ch === void 0)
                break;
        }

        return result.map(lexeme => lexeme.replace(/^\s+/, '').replace(/\s+$/, ''));
    }

    public static parseArg(arg:string) {

        if (!arg)
            return void 0;

        // TODO Add a TimeRange

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
        var negate = negateSign === '!',
            fn:Function = expr[fnName],
            result,
            argsData;

        if (fn === void 0)
            throw `Expr function named ${fnName} not found!`;

        if (args) {
            argsData = JQExprParser.parseLexemeList(args, {delimiter: ','})
                .map(arg => JQExprParser.parseArg(arg))
            ;
        }

        if (!name)
            throw `Expr function with name ${name} not found!`;

        result = fn.call(this, this, ...argsData);

        return negate ? !result : result;
    }
}
