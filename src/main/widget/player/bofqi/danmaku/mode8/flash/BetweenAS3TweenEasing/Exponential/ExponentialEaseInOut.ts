export class ExponentialEaseInOut {

    calculate(param1: number, param2: number, param3: number, param4: number) {
        if (param1 == 0) {
            return param2;
        }
        if (param1 == param4) {
            return param2 + param3;
        }
        param1 = param1 / (param4 / 2);
        if (param1 < 1) {
            return param3 / 2 * Math.pow(2, 10 * (param1 - 1)) + param2;
        }
        return param3 / 2 * (2 - Math.pow(2, -10 * --param1)) + param2;
    }
}