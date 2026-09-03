export class PhysicalExponential {

    constructor(
        private _f: number,
        private _th: number,
        private _fps: number,
    ) { }

    getDuration(_param1: number, param2: number) {
        return (Math.log(this._th / param2) / Math.log(1 - this._f) + 1) * (1 / this._fps);
    }

    calculate(param1: number, param2: number, param3: number) {
        return -param3 * Math.pow(1 - this._f, param1 / (1 / this._fps) - 1) + (param2 + param3);
    }
}