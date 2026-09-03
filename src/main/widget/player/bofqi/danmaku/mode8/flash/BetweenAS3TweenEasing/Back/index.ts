import { BackEaseIn } from "./BackEaseIn";
import { BackEaseInOut } from "./BackEaseInOut";
import { BackEaseOut } from "./BackEaseOut";
import { BackEaseOutIn } from "./BackEaseOutIn";

export const easeIn = new BackEaseIn();

export const easeOut = new BackEaseOut();

export const easeInOut = new BackEaseInOut();

export const easeOutIn = new BackEaseOutIn();

export function easeInOutWith(param1 = 1.70158) {
    return new BackEaseInOut(param1);
}

export function easeOutInWith(param1 = 1.70158) {
    return new BackEaseOutIn(param1);
}

export function easeOutWith(param1 = 1.70158) {
    return new BackEaseOut(param1);
}

export function easeInWith(param1 = 1.70158) {
    return new BackEaseIn(param1);
}