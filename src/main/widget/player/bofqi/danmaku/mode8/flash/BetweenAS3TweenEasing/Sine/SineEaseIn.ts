export class SineEaseIn {

    calculate(param1: number, param2: number, param3: number, param4: number) {
        return -param3 * Math.cos(param1 / param4 * (Math.PI / 2)) + param3 + param2;
    }
}