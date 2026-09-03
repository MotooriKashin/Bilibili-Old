export class CubicEaseInOut {

    calculate(param1: number, param2: number, param3: number, param4: number) {
        param1 = param1 / (param4 / 2);
        return param1 < 1 ? param3 / 2 * param1 * param1 * param1 + param2 : param3 / 2 * ((param1 = param1 - 2) * param1 * param1 + 2) + param2;
    }
}