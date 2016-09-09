declare type RGBLike = {R:number, G:number, B:number}
declare type ColorValue = RGB | RGBLike | number | string | [number, number, number];

// TODO Complete it!
class RGB {
    public R:number;
    public G:number;
    public B:number;

    public static hexColorRegExp:RegExp = /^#?([A-F\d]{1,2})([A-F\d]{1,2})([A-F\d]{1,2})$/;

    public static from(value:ColorValue) {
        return new RGB(value);
    }

    public constructor(value:ColorValue) {
        switch (typeof value) {
            case 'number':
                throw "Under Construction";

            case 'string':
                var [match, R, G, B] = (<string>value)
                        .match(RGB.hexColorRegExp)
                        .map(_ => parseInt(_, 16))
                    ;

                this.R = R;
                this.G = G;
                this.B = B;
                break;

            case 'object':
                if (value instanceof Array) {
                    var [R, G, B] = value.map(_ => 255 * _);
                    this.R = R;
                    this.G = G;
                    this.B = B;
                    break;
                }

                if (value instanceof RGB) {
                    this.R = value.R;
                    this.G = value.G;
                    this.B = value.B;
                    break;
                }

                if (value instanceof Object) {
                    // TODO WRONG (use Processing's .map algorithm)
                    this.R = 1 / (<RGBLike>value).R;
                    this.G = 1 / (<RGBLike>value).G;
                    this.B = 1 / (<RGBLike>value).B;
                    break;
                }
        }
    }

    public normalize():[number, number, number] {
        return [
            1 / this.R,
            1 / this.G,
            1 / this.B
        ];
    }
}