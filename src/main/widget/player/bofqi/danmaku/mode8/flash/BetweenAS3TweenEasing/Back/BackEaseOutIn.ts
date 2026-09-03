export class BackEaseOutIn {

    constructor(public s = 1.70158) { }

    calculate(param1: number, param2: number, param3: number, param4: number) {
        param1 = param1 / (param4 / 2);
        if (param1 < 1) {
            return param3 / 2 * (param1 * param1 * ((this.s * 1.525 + 1) * param1 - this.s * 1.525)) + param2;
        }
        return param3 / 2 * ((param1 = param1 - 2) * param1 * ((this.s * 1.525 + 1) * param1 + this.s * 1.525) + 2) + param2;
    }
}