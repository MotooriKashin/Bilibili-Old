/** 作用域隔离 Proxy(ScopeProxy) */
class ScopeProxyHandler implements ProxyHandler<Record<string | symbol, any>> {
    /** 允许通过的白名单变量 */
    #allowedGlobals: Set<string | symbol>;
    constructor(allowedGlobals: string[]) {
        this.#allowedGlobals = new Set([...allowedGlobals]);
    }
    /** with 语句查找变量时，会先触发 has 拦截 */
    has(_target: Record<string | symbol, any>, _key: string | symbol) {
        // 返回 true 表示 key 存在于当前作用域中，阻止 JavaScript 继续向上层 window 查找
        return true;
    }
    get(target: Record<string | symbol, any>, key: string | symbol) {
        // 拦截全局对象的访问
        if (key === 'window' || key === 'globalThis' || key === 'self' || key === 'top') {
            return target; // 返回沙箱自身代理，阻止拿取真实全局对象
        }

        // 优先读取沙箱主动注入的变量/方法
        if (key in target) {
            return target[key];
        }

        // 如果不在白名单中，一律拒绝访问（返回 undefined）
        if (!this.#allowedGlobals.has(key)) {
            return;
        }

        // 读取 Worker / 当前环境中安全的原生全局属性 (例如 Math)
        return (<any>globalThis)[key];
    }
    /** 防止用户通过 eval / Function 在沙箱内给全局变量赋值 */
    set(target: Record<string | symbol, any>, key: string | symbol, value: any) {
        target[key] = value;
        return true;
    }
}

/** 递归深度冻结对象，使其属性不可写、不可删、不可配置 */
function deepFreeze<T extends object>(obj: T): T {
    const propNames = Reflect.ownKeys(obj);

    for (const name of propNames) {
        const value = (obj as any)[name];
        if (value && (typeof value === 'object' || typeof value === 'function')) {
            // 如果子属性尚未冻结，递归冻结
            if (!Object.isFrozen(value)) {
                deepFreeze(value);
            }
        }
    }

    return Object.freeze(obj);
}

/** 安全包裹注入的函数，阻断通过 fn.constructor 获取真实 Function 构造函数 */
function createSafeFunction(fn: Function): Function {
    const safeFn = function (this: any, ...args: any[]) {
        return fn.apply(this, args);
    };

    // 切断原型链，防止通过 constructor 逃逸
    Object.setPrototypeOf(safeFn, null);

    // 重新封包构造器指针
    Object.defineProperty(safeFn, 'constructor', {
        value: undefined,
        writable: false,
        configurable: false
    });

    return Object.freeze(safeFn);
}

/** 沙箱核心执行器 (Sandbox) */
export class Sandbox {
    /** 沙箱上下文（无原型的干净对象） */
    #scopeContext = Object.create(null);
    #proxy: Record<string, any>;
    constructor(
        /** 主动注入的对象/工具 */
        injects?: Record<string, any>,
        /** 显式允许访问的全局变量名 */
        allowedGlobals?: string[],
    ) {
        // 1. 处理并注入允许的对象
        if (injects) {
            // for (const [key, val] of Object.entries(injects)) {
            // if (typeof val === 'function') {
            //     this.#scopeContext[key] = createSafeFunction(val);
            // } else if (typeof val === 'object' && val !== null) {
            //     this.#scopeContext[key] = deepFreeze(val);
            // } else {
            // this.#scopeContext[key] = val;
            // }
            // }
            Object.assign(this.#scopeContext, injects);
        }
        // 2. 创建 Proxy 拦截作用域
        const allowedList = [
            ...Object.keys(this.#scopeContext),
            ...(allowedGlobals || [])
        ];
        const handler = new ScopeProxyHandler(allowedList);
        this.#proxy = new Proxy(this.#scopeContext, handler);
    }
    /** 将 proxy 作为 sandbox 传入 */
    execute(code: string): any {
        // 使用 strict mode 避免很多静默失败，配合 with 限制作用域
        const compiledRunner = new Function(
            'sandbox',
            `
      with (sandbox) {
        return (function() {
          'use strict';
          ${code}
        })();
      }
      `
        );
        // 将 proxy 作为 sandbox 传入
        return compiledRunner(this.#proxy);
    }
}