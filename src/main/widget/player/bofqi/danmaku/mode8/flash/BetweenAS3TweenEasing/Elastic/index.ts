import { ElasticEaseIn } from "./ElasticEaseIn";
import { ElasticEaseInOut } from "./ElasticEaseInOut";
import { ElasticEaseOut } from "./ElasticEaseOut";
import { ElasticEaseOutIn } from "./ElasticEaseOutIn";

export const easeIn = new ElasticEaseIn();

export const easeOut = new ElasticEaseOut();

export const easeInOut = new ElasticEaseInOut();

export const easeOutIn = new ElasticEaseOutIn();

export function easeInOutWith(param1 = 0, param2 = 0) {
    return new ElasticEaseInOut(param1, param2);
}

export function easeOutInWith(param1 = 0, param2 = 0) {
    return new ElasticEaseOutIn(param1, param2);
}

export function easeOutWith(param1 = 0, param2 = 0) {
    return new ElasticEaseOut(param1, param2);
}

export function easeInWith(param1 = 0, param2 = 0) {
    return new ElasticEaseIn(param1, param2);
}