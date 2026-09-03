export class ElasticEaseOutIn {

    constructor(
        public a = 0,
        public p = 0,
    ) { }

    calculate(param1: number, param2: number, param3: number, param4: number) {
        let _loc5_: number;
        param3 /= 2;
        if (param1 < param4 / 2) {
            param1 = param1 * 2;
            if (param1 == 0) {
                return param2;
            }
            param1 = param1 / param4;
            if (param1 == 1) {
                return param2 + param3;
            }
            if (!this.p) {
                this.p = param4 * 0.3;
            }
            if (!this.a || this.a < Math.abs(param3)) {
                this.a = param3;
                _loc5_ = this.p / 4;
            }
            else {
                _loc5_ = this.p / (2 * Math.PI) * Math.asin(param3 / this.a);
            }
            return this.a * Math.pow(2, -10 * param1) * Math.sin((param1 * param4 - _loc5_) * (2 * Math.PI) / this.p) + param3 + param2;
        }
        param1 = param1 * 2 - param4;
        if (param1 == 0) {
            return param2 + param3;
        }
        param1 = param1 / param4;
        if (param1 == 1) {
            return param2 + param3 + param3;
        }
        if (!this.p) {
            this.p = param4 * 0.3;
        }
        if (!this.a || this.a < Math.abs(param3)) {
            this.a = param3;
            _loc5_ = this.p / 4;
        }
        else {
            _loc5_ = this.p / (2 * Math.PI) * Math.asin(param3 / this.a);
        }
        return -(this.a * Math.pow(2, 10 * (param1 = param1 - 1)) * Math.sin((param1 * param4 - _loc5_) * (2 * Math.PI) / this.p)) + (param2 + param3);
    }
}