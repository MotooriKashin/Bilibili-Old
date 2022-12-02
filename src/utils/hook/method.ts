import { debug } from "../debug";
import { isArray, isObject } from "../typeof";

/**
 * 拦截对象的方法。首次调用该方法时触发回调，请在回调中覆写该方法。
 * @param target 方法所属对象
 * @param propertyKey 方法名
 * @param callback 覆写该方法的回调，请在里面覆写该方法，可以是返回promise。
 * @param modifyArguments 修改该方法传参的回调
 * @example // 拦截`window`对象上的`aaa`方法并覆写为`()=>{}`
 * methodHook(window,'aaa',async ()=>{ window.aaa=()=>{}});
 */
export function methodHook(target: object, propertyKey: PropertyKey, callback: () => Promise<unknown> | void, modifyArguments?: (args: IArguments) => void) {
    const arr: Function[] = [];
    let loading = false;
    let loaded = false;
    let argsmed = false;
    Reflect.defineProperty(target, propertyKey, {
        configurable: true,
        set: v => {
            if (!loaded) {
                arr.unshift(v);
            }
            return true
        },
        get: () => {
            if (loaded) {
                Reflect.defineProperty(target, propertyKey, { configurable: true, value: arr[0] });
                return arr[0];
            } else {
                if (!loading) {
                    loading = true;
                    setTimeout(() => {
                        if (!loaded) {
                            loaded = true;
                            debug.error('拦截方法出错！', '目标方法', propertyKey, '所属对象', target);
                        }
                    }, 1e3 * 60);
                    setTimeout(() => { // 此处必须异步调用
                        const res = callback();
                        if (res && res.finally) {
                            res.finally(() => loaded = true);
                        } else {
                            loaded = true;
                        }
                    })
                }
                return function () {
                    if (!argsmed) {
                        argsmed = true;
                        modifyArguments?.(arguments);
                    }
                    setTimeout(() => (<any>target)[propertyKey](...arguments));
                }
            }
        }
    });
}
/**
 * 拦截对象属性。**方法除外**，拦截方法请使用`hookMethod`。
 * @param target 属性所属对象
 * @param propertyKey 属性名
 * @param propertyValue 属性值，用于覆盖原值。覆盖后的属性将无法直接赋值修改。
 * @example
 * propertyHook(window,'aaa',1); // 覆盖window对象上的aaa值为1
 */
export function propertyHook(target: object, propertyKey: PropertyKey, propertyValue: any) {
    Reflect.defineProperty(target, propertyKey, {
        configurable: true,
        set: v => true,
        get: () => {
            Reflect.defineProperty(target, propertyKey, { configurable: true, value: propertyValue });
            return propertyValue;
        }
    });
}
/**
 * 拦截对象属性，在原始值基础上进行修改。
 * @param target 属性所属对象
 * @param propertyKey 属性名
 * @param callback 用于修改原始值的回调，原始值将作为该函数的第一个值传入，请将修改后的值返回
 * @param once 只拦截一次
 */
propertyHook.modify = <T>(target: object, propertyKey: PropertyKey, callback: (value: T) => T, once = false) => {
    let value: T = (<any>target)[propertyKey];
    value && (value = callback(value));
    Reflect.defineProperty(target, propertyKey, {
        configurable: true,
        set: v => {
            value = callback(v);
            return true;
        },
        get: () => {
            if (once) {
                Reflect.deleteProperty(target, propertyKey);
                Reflect.set(target, propertyKey, value);
            }
            return value
        }
    });
}
/**
 * 深层属性代理
 * @param target 二级对象
 * @param parrent 上级对象代理
 * @param key 二级对象在上级对象中对应的属性名
 * @returns 二级对象代理
 */
function ProxyHandler<K extends PropertyKey, T extends Record<K, object>>(target: T[K], parrent: T, key: K): T[K] {
    return new Proxy(target, {
        deleteProperty(target, p) {
            const res = Reflect.deleteProperty(target, p);
            parrent[key] = target;
            return res;
        },
        set(target, p, newValue, receiver) {
            const res = Reflect.set(target, p, newValue, receiver);
            parrent[key] = target;
            return res;
        },
        get(target, p, receiver) {
            const res = Reflect.get(target, p, receiver);
            if (isArray(res) || isObject(res)) {
                return ProxyHandler(res, <any>receiver, p);
            }
            return res;
        }
    })
}
/**
 * 创建一个代理来监听对象属性变化，深层嵌套对象的变化被冒泡到顶层。
 * @param target 原对象
 * @param callback 属性变化时的回调函数，将顶层属性名及其新值作为参数依次传入
 * @returns Proxy代理的对象
 * @example
 * const obj = { a: { b: { c: {} } } };
 * const proxy = propertryChangeHook(obj, (key, value) => { console.log(key, value) });
 * proxy.xxx = 'yyy'; // 控制台打印 xxx 'yyy'
 * proxy.a.b.c = 123; // 控制台打印 a { b: { c: 123 } }
 * proxy.a.b.xyz = 456; // 控制台打印 a { b: { c: 123, xyz: 456 } }
 * delete proxy.a.b; // 控制台打印 a {}
 */
export function propertryChangeHook<T extends object, K extends keyof T>(target: T, callback: (key: K, value: T[K]) => void) {
    return new Proxy(target, {
        deleteProperty(target, p) {
            const res = Reflect.deleteProperty(target, p);
            callback(<any>p, <any>undefined);
            return res;
        },
        set(target, p, newValue, receiver) {
            const res = Reflect.set(target, p, newValue, receiver);
            callback(<any>p, newValue);
            return res
        },
        get(target, p, receiver) {
            const res = Reflect.get(target, p, receiver);
            if (isArray(res) || isObject(res)) {
                return ProxyHandler(res, <any>receiver, p);
            }
            return res;
        }
    })
}