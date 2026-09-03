export class QuadraticEaseIn {

    calculate(param1: number, param2: number, param3: number, param4: number) {
        return param3 * (param1 = param1 / param4) * param1 + param2;
    }
}