export class CubicEaseOutIn {

    calculate(param1: number, param2: number, param3: number, param4: number) {
        return param1 < param4 / 2 ? param3 / 2 * ((param1 = param1 * 2 / param4 - 1) * param1 * param1 + 1) + param2 : param3 / 2 * (param1 = (param1 * 2 - param4) / param4) * param1 * param1 + param2 + param3 / 2;
    }
}