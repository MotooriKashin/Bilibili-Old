export class CustomFunctionEasing {

    constructor(public f: (param1: number, param2: number, param3: number, param4: number) => number) { }

    calculate(param1: number, param2: number, param3: number, param4: number) {
        return this.f(param1, param2, param3, param4);
    }
}