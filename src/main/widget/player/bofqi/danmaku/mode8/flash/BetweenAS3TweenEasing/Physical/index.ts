import { PhysicalAccelerate } from "./PhysicalAccelerate";
import { PhysicalExponential } from "./PhysicalExponential";
import { PhysicalUniform } from "./PhysicalUniform";

export const defaultFrameRate = 30;

export function uniform(param1 = 10, param2 = NaN) {
    return new PhysicalUniform(param1, isNaN(param2) ? defaultFrameRate : param2);
}

export function exponential(param1 = 0.2, param2 = 0.0001, param3 = NaN) {
    return new PhysicalExponential(param1, param2, isNaN(param3) ? defaultFrameRate : param3);
}

export function accelerate(param1 = 1, param2 = 0, param3 = NaN) {
    return new PhysicalAccelerate(param2, param1, isNaN(param3) ? defaultFrameRate : param3);
}