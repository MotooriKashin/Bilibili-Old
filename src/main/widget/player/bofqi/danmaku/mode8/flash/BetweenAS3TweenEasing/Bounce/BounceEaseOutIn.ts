export class BounceEaseOutIn {

    calculate(param1: number, param2: number, param3: number, param4: number) {
        if (param1 < param4 / 2) {
            param1 = param1 * 2 / param4;
            if (param1 < 1 / 2.75) {
                return param3 / 2 * (7.5625 * param1 * param1) + param2;
            }
            if (param1 < 2 / 2.75) {
                return param3 / 2 * (7.5625 * (param1 = param1 - 1.5 / 2.75) * param1 + 0.75) + param2;
            }
            if (param1 < 2.5 / 2.75) {
                return param3 / 2 * (7.5625 * (param1 = param1 - 2.25 / 2.75) * param1 + 0.9375) + param2;
            }
            return param3 / 2 * (7.5625 * (param1 = param1 - 2.625 / 2.75) * param1 + 0.984375) + param2;
        }
        param1 = (param4 - (param1 * 2 - param4)) / param4;
        if (param1 < 1 / 2.75) {
            return param3 / 2 - param3 / 2 * (7.5625 * param1 * param1) + (param2 + param3 / 2);
        }
        if (param1 < 2 / 2.75) {
            return param3 / 2 - param3 / 2 * (7.5625 * (param1 = param1 - 1.5 / 2.75) * param1 + 0.75) + (param2 + param3 / 2);
        }
        if (param1 < 2.5 / 2.75) {
            return param3 / 2 - param3 / 2 * (7.5625 * (param1 = param1 - 2.25 / 2.75) * param1 + 0.9375) + (param2 + param3 / 2);
        }
        return param3 / 2 - param3 / 2 * (7.5625 * (param1 = param1 - 2.625 / 2.75) * param1 + 0.984375) + (param2 + param3 / 2);
    }
}