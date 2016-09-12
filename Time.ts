class Time {

    // TODO Are hours needed?

    public value:number;

    public minutes:number;
    public seconds:number;
    public milliseconds:number;

    public static regExp:RegExp = /^(\d+):(\d+)(?:.(\d+))?$/;

    private static zeroPad(s:number):string {
        if (+s >= 10)
            return s.toString();

        return '0' + s;
    }

    public static from(time:TimeValue):Time {
        return new this(time);
    }

    constructor(time:TimeValue) {
        switch (typeof time) {
            case 'string':
                let rgx = Time.regExp;
                if (rgx.test(<string>time)) {
                    let [match, m, s, ms] = (<string>time).match(rgx);
                    this.minutes = parseInt(m, 10);
                    this.seconds = parseInt(s);

                    this.milliseconds = parseInt(ms || "0", 10);

                } else {
                    throw "Under construction";
                }
                this._updateValue();
                break;

            case 'number':
                this.setValue(<number>time);
                break;

            case 'object':
                if (time instanceof Array) {
                    if (time.length !== 2 && time.length !== 3)
                        throw "Passed array length must be equal 2 or 3";

                    var [m, s, ms] = time;

                    this.minutes = +(m || 0);
                    this.seconds = +(s || 0);
                    this.milliseconds = +(ms || 0);
                } else {
                    this.minutes = (<any>time).minutes;
                    this.seconds = (<any>time).seconds;
                    this.milliseconds = (<any>time).milliseconds;
                }
                this._updateValue();
                break;
        }
    }

    private _updateValue() {
        this.value = (this.minutes * 60) + this.seconds + (this.milliseconds / 1000);
    }

    public setValue(value:number) {
        this.value = value;
        this.minutes = Math.floor(value / 60);
        this.seconds = Math.floor(value % 60);
        this.milliseconds = Math.round((value - Math.floor(value)) * 1000);
    }

    public getValue() {
        return (this.minutes * 60) + this.seconds + (this.milliseconds / 1000);
    }

    public setMinutes(value:number) {
        this.minutes = value;
        this._updateValue();
    }

    public setSeconds(value:number) {
        this.seconds = value;
        this._updateValue();
    }

    public setMilliseconds(value:number) {
        this.milliseconds = value;
        this._updateValue();
    }

    public toString() {

        var ms = Math.round(this.milliseconds).toString();

        while (ms.length < 3) {
            ms = '0' + ms;
        }

        return `${Time.zeroPad(this.minutes)}:${Time.zeroPad(this.seconds)}.${ms}`;
    }
}
