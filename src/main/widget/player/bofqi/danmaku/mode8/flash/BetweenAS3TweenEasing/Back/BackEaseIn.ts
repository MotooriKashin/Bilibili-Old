export class BackEaseIn {

    constructor(public s = 1.70158) { }

    calculate(param1: number, param2: number, param3: number, param4: number) {
        return param3 * (param1 = param1 / param4) * param1 * ((this.s + 1) * param1 - this.s) + param2;
    }
}