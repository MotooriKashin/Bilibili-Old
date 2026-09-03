export class ExponentialEaseOut {

    calculate(param1: number, param2: number, param3: number, param4: number) {
        return param1 == param4 ? param2 + param3 : param3 * (1 - Math.pow(2, -10 * param1 / param4)) + param2;
    }
}