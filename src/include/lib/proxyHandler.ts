namespace API {
    function get(t: Record<PropertyKey, any>, p: PropertyKey, r?: any) {
        try {
            return Reflect.get(t, p, r);
        } catch (e) {
            return t[p];
        }
    }
    export class ProxyHandler {
        /**
         * 代理深层对象及数组
         * @param callback 数据变动时回调
         */
        constructor(callback: () => void) {
            return {
                deleteProperty: (target: Record<PropertyKey, any>, key: PropertyKey) => {
                    Promise.resolve().then(() => callback());
                    return Reflect.deleteProperty(target, key);
                },
                get: (target: Record<PropertyKey, any>, key: PropertyKey, receiver: Record<PropertyKey, any>): any => {
                    const res = get(target, key, receiver);
                    const targetIsArray = isArray(res);
                    // 代理对象及数组
                    if (isObject(res) || targetIsArray) {
                        return new Proxy(res, new ProxyHandler(callback));
                    }
                    return res;
                },
                set: (target: Record<PropertyKey, any>, key: PropertyKey, value: any, receiver: Record<PropertyKey, any>) => {
                    value !== get(target, key, receiver) && Promise.resolve().then(() => callback());
                    return Reflect.set(target, key, value, receiver);
                }
            }
        }
    }
}