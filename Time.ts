class Time {

    public value:number;

    public minutes:number;
    public seconds:number;
    public milliseconds:number;

    public static regExp:RegExp = /^(\d+):(\d+)(?:.(\d+))?$/;

    public static zeroPad(s:number):string {
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
                break;

            case 'number':
                this.minutes = Math.floor(time / 60);
                this.seconds = Math.floor(time % 60);
                this.milliseconds = Math.round((time - Math.floor(<number>time)) * 1000);
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
                break;
        }

        this.value = (this.minutes * 60) + this.seconds + (this.milliseconds / 1000);
    }

    // TODO Complete all getters and setters
    /*    public get ____minutes() {
     throw "Under construction";
     //return Math.floor(this.value / 60);
     }

     // TODO Complete all getters and setters
     public get ___seconds() {
     throw "Under construction";
     //return Math.floor(this.value / 60);
     }*/

    public toString() {

        var ms = Math.round(this.milliseconds).toString();

        while (ms.length < 3) {
            ms = '0' + ms;
        }

        return `${Time.zeroPad(this.minutes)}:${Time.zeroPad(this.seconds)}.${ms}`;
    }
}