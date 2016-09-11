class Nth {

    public step:number;
    public offset:number = 0;

    public static regExp:RegExp = /^(\d+)n(?:(\+|-)(\d+))?$/;

    public static from(value:string) {
        return new Nth(value);
    }

    constructor(value:string) {
        var [match, step, sign, offset] = value.match(Nth.regExp);
        this.step = parseInt(step, 10);
        switch (sign) {
            case '+':
                this.offset = parseInt(offset || "0", 10);
                break;
            case '-':
                this.offset = -offset;
                break;

            case void 0:
                this.offset = 0;
        }
    }

    public check(value:number) {
        return (value % this.step) - this.offset === 0
    }
}