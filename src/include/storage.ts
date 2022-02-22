interface modules {
    /**
     * localstorage/sessionstorage封装，存储读取更为方便。
     */
    readonly "storage.js": string;
}
class StorageInterface {
    [name: string]: any;
    constructor(target: boolean) {
        this._ = target;
    }
    /**
     * 清空！
     */
    clear() {
        (this._ ? sessionStorage : localStorage).clear()
    };
    /**
     * 读取
     * @param key 目标键名
     * @returns 格式化后的数据
     */
    getItem(key: string) {
        let str: any = (this._ ? sessionStorage : localStorage).getItem(key);
        try { str = JSON.parse(str) } catch (e) { }
        return str;
    };
    /**
     * 列出键名数组
     * @returns 键名数组
     */
    keys() {
        return Object.keys((this._ ? sessionStorage : localStorage));
    };
    /**
     * 移除
     * @param key 目标键名
     */
    removeItem(key: string) {
        (this._ ? sessionStorage : localStorage).removeItem(key);
    };
    /**
     * 添加/修改
     * @param key 
     * @param value 
     */
    setItem(key: string, value: any) {
        switch (typeof value) {
            case "object": (this._ ? sessionStorage : localStorage).setItem(key, JSON.stringify(value));
                break;
            case "function": debug.warn("函数类型并不适合这样存储！", key, value);
                break;
            default: (this._ ? sessionStorage : localStorage).setItem(key, String(value));
        }
    };
    /**
     * 键值总数
     */
    get length() { return (this._ ? sessionStorage : localStorage).length }
}
class LocalStorage extends StorageInterface {
    constructor() {
        super(false);
        this.keys().forEach(d => Object.defineProperty(this, d, { get: () => this.getItem(d), set: v => this.setItem(d, v) }));
    }
}
class SessionStorage extends StorageInterface {
    constructor() {
        super(true);
        this.keys().forEach(d => Object.defineProperty(this, d, { get: () => this.getItem(d), set: v => this.setItem(d, v) }));
    }
}
Object.defineProperties(API, {
    localStorage: { get: () => new LocalStorage(), set: () => false },
    sessionStorage: { get: () => new SessionStorage(), set: () => false }
})
declare namespace API {
    /**
     * 代理localStorage，与原生不同的是取值将被格式化
     */
    export const localStorage: LocalStorage;
    /**
     * 代理sessionStorage，与原生不同的是取值将被格式化
     */
    export const sessionStorage: SessionStorage;
}