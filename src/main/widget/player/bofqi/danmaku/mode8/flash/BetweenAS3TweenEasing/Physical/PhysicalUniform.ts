export class PhysicalUniform {

    constructor(
        private _v: number,
        private _fps: number,
    ) { }

    calculate(param1: number, param2: number, param3: number) {
        return param2 + (param3 < 0 ? -this._v : this._v) * (param1 / (1 / this._fps));
    }

    getDuration(_param1: number, param2: number) {
        return param2 / (param2 < 0 ? -this._v : this._v) * (1 / this._fps);
    }
}