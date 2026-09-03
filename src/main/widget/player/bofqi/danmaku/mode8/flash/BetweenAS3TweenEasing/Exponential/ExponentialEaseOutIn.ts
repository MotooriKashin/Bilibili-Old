export class ExponentialEaseOutIn {

    calculate(param1: number, param2: number, param3: number, param4: number) {
        if (param1 < param4 / 2) {
            return param1 * 2 == param4 ? param2 + param3 / 2 : param3 / 2 * (1 - Math.pow(2, -10 * param1 * 2 / param4)) + param2;
        }
        return param1 * 2 - param4 == 0 ? param2 + param3 / 2 : param3 / 2 * Math.pow(2, 10 * ((param1 * 2 - param4) / param4 - 1)) + param2 + param3 / 2;
    }
}