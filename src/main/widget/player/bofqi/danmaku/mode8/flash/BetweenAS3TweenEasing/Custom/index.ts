import { CustomFunctionEasing } from "./CustomFunctionEasing";

export function func(param1: (param1: number, param2: number, param3: number, param4: number) => number) {
    return new CustomFunctionEasing(param1);
}