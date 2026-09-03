export class ExponentialEaseIn {

    calculate(param1: number, param2: number, param3: number, param4: number) {
        return param1 == 0 ? param2 : param3 * Math.pow(2, 10 * (param1 / param4 - 1)) + param2;
    }
}