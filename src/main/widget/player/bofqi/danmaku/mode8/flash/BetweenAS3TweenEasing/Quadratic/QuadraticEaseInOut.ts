export class QuadraticEaseInOut {

    calculate(param1: number, param2: number, param3: number, param4: number) {
        param1 = param1 / (param4 / 2);
        if (param1 < 1) {
            return param3 / 2 * param1 * param1 + param2;
        }
        return -param3 / 2 * (--param1 * (param1 - 2) - 1) + param2;
    }
}