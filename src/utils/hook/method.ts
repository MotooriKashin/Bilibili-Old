import { debug } from "../debug";
import { isArray, isObject } from "../typeof";

/**
 * 拦截对象的方法（无返回值）。首次调用该方法时触发回调，请在回调中覆写该方法。
 * @param target 方法所属对象
 * @param propertyKey 方法名
 * @param callback 覆写该方法的回调，请在里面覆写该方法，可以是返回promise。
 * @param modifyArguments 修改该方法传参的回调
 * @example // 拦截`window`对象上的`aaa`方法并覆写为`()=>{}`
 * methodHook(window,'aaa',async ()=>{ window.aaa=()=>{}});
 */
export function methodHook(target: object, propertyKey: PropertyKey, callback: () => Promise<unknown> | void, modifyArguments?: (args: IArguments) => void) {
    /** 方法暂存 */
    const values: Function[] = [];
    /** 调用参数暂存 */
    const iArguments: IArguments[] = [];
    /** 加载方法开始标记 */
    let loading = false;
    /** 加载方法完成标记 */
    let loaded = false;
    /** 写入方法及恢复调用 */
    function modify() {
        loaded = true;
        if (values[0]) {
            // 写入拦截后的方法
            Reflect.defineProperty(target, propertyKey, { configurable: true, value: values[0] });
            // 恢复暂存的调用
            iArguments.forEach(d => values[0](...d));
        } else {
            // 未暂存任何方法，调用出错
            debug.error('拦截方法出错！', '目标方法', propertyKey, '所属对象', target);
        }
    }
    Reflect.defineProperty(target, propertyKey, {
        configurable: true,
        set: v => {
            if (loading && !loaded) {
                // 暂存开始及结束之间的方法，拦截后的方法一定在此区间，但页可能被页面污染，优先取靠后的。
                values.unshift(v);
            }
            return true
        },
        get: () => {
            if (!loading) {
                loading = true; // 方法被读取，开启申请拦截
                setTimeout(() => { // 此处必须异步调用
                    const res = callback();
                    if (res && res.finally) {
                        res.finally(() => modify());
                    } else {
                        modify();
                    }
                })
            }
            // 伪装调用，修改并记录调用参数
            return function () {
                modifyArguments?.(arguments);
                iArguments.push(arguments);
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
    // 属性已存在直接修改
    let value: T = (<any>target)[propertyKey];
    value && (value = callback(value));
    Reflect.defineProperty(target, propertyKey, {
        configurable: true,
        set: v => {
            // 修改后来写入的属性
            value = callback(v);
            return true;
        },
        get: () => {
            if (once) {
                // 固化属性值且不再拦截
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
 * @param callback 属性变化时的回调函数，将顶层属性名及其新值作为参数依次传入。**不允许进行二次赋值修改，必须经过回环判定，不然容易导致死循环！**
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