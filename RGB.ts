declare type RGBLike = {R:number, G:number, B:number, r:number, g:number, b:number}
declare type ColorValue = RGB | RGBLike | number | string | [number, number, number];

// TODO Complete it!
class RGB {
    public R:number;
    public G:number;
    public B:number;

    public static hexColorRegExp:RegExp = /^#?([A-F\d]{1,2})([A-F\d]{1,2})([A-F\d]{1,2})$/;
    public static hexColorRegExpShorthand:RegExp = /^#?([A-F\d])([A-F\d])([A-F\d])$/;

    public static from(value:ColorValue) {
        return new RGB(value);
    }

    public constructor(value:ColorValue) {
        switch (typeof value) {
            case 'number':
                throw "Under Construction";

            case 'string':
                if (RGB.hexColorRegExp.test(<string>value)) {
                    let match;
                    [match, this.R, this.G, this.B] = (<string>value)
                            .match(RGB.hexColorRegExp)
                            .map(_ => parseInt(_, 16))
                        ;
                }

                if (RGB.hexColorRegExpShorthand.test(<string>value)) {
                    let match;
                    [match, this.R, this.G, this.B] = (<string>value)
                            .match(RGB.hexColorRegExpShorthand)
                            .map(_ => parseInt(_ + _, 16))
                        ;
                }

                break;

            case 'object':
                if (value instanceof Array) {
                    [this.R, this.G, this.B] = value.map(_ => 255 * _);
                    break;
                }

                if (value instanceof RGB) {
                    this.R = value.R;
                    this.G = value.G;
                    this.B = value.B;
                    break;
                }

                if (value instanceof Object) {
                    this.R = (<RGBLike>value).R || (<RGBLike>value).r;
                    this.G = (<RGBLike>value).G || (<RGBLike>value).g;
                    this.B = (<RGBLike>value).B || (<RGBLike>value).b;
                    break;
                }
        }
    }

    public normalize():[number, number, number] {
        return [
            Fn.map(this.R, 0, 255, 0, 1),
            Fn.map(this.G, 0, 255, 0, 1),
            Fn.map(this.B, 0, 255, 0, 1)
        ];
    }
}
