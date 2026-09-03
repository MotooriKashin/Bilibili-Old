export class SineEaseInOut {

    calculate(param1: number, param2: number, param3: number, param4: number) {
        return -param3 / 2 * (Math.cos(Math.PI * param1 / param4) - 1) + param2;
    }
}