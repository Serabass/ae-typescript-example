class AEQRange {

    public static regExp:RegExp = /^(\d+(?:\.\d+)?)(>)?\.\.(<)?(\d+(?:\.\d+)?)$/;

    public static from(string:string) {
        let [match, start, includeStart1, includeEnd1, end] = string.match(AEQRange.regExp);
        let includeStart = includeStart1 === '>';
        let includeEnd = includeEnd1 === '<';

        if (end === void 0) {
            end = start;
        }

        return new AEQRange(parseFloat(start), includeStart, includeEnd, parseFloat(end));
    }

    constructor(public start:number,
                public includeStart:boolean,
                public includeEnd:boolean,
                public end:number) {
    }

    public contains(value:number) {
        var result:boolean;
        result = this.includeStart ? value >= this.start : value > this.start;
        result = result && (this.includeEnd ? value <= this.end : value < this.end);

        return result;
    }

    public toString():string {
        return this.start
            + (this.includeStart ? '.' : '')
            + '..'
            + (this.includeEnd ? '.' : '')
            + this.end
        ;
    }
}
