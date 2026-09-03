export class PhysicalAccelerate {

    constructor(
        private _iv: number,
        private _a: number,
        private _fps: number,
    ) { }

    getDuration(_param1: number, param2: number) {
        var _loc3_: number = param2 < 0 ? -this._iv : this._iv;
        var _loc4_: number = param2 < 0 ? -this._a : this._a;
        return (-_loc3_ + Math.sqrt(_loc3_ * _loc3_ - 4 * (_loc4_ / 2) * -param2)) / (2 * (_loc4_ / 2)) * (1 / this._fps);
    }

    calculate(param1: number, param2: number, param3: number) {
        var _loc4_: number = param3 < 0 ? -1 : 1;
        var _loc5_: number = param1 / (1 / this._fps);
        return param2 + _loc4_ * this._iv * _loc5_ + _loc4_ * this._a * _loc5_ * _loc5_ / 2;
    }
}