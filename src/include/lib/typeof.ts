// @see vuejs {@link https://github.com/vuejs/core/blob/main/packages/shared/src/index.ts}
// @license MIT
namespace API {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    export const hasOwn = (val: Record<PropertyKey, any>, key: PropertyKey) => hasOwnProperty.call(val, key);
    export const isArray = Array.isArray;
    export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]';
    export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]';
    export const isDate = (val: unknown): val is Date => val instanceof Date;
    export const isFunction = (val: unknown): val is Function => typeof val === 'function';
    export const isString = (val: unknown): val is string => typeof val === 'string';
    export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol';
    export const isObject = (val: unknown): val is Record<PropertyKey, any> => val !== null && typeof val === 'object';
    export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
        return isObject(val) && isFunction(val.then) && isFunction(val.catch);
    }
    export const objectToString = Object.prototype.toString;
    export const toTypeString = (value: unknown): string => objectToString.call(value);
    export const toRawType = (value: unknown): string => {
        // extract "RawType" from strings like "[object RawType]"
        return toTypeString(value).slice(8, -1);
    }
}