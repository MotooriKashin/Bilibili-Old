namespace API {
    class StorageInterface {
        [name: string]: any; // 允许任意字符串索引
        #_: boolean; // 类型标记：localStorage/sessionStorage
        /**
         * 
         * @param target 类型标记：真 ? sessionStorage : localStorage
         */
        constructor(target: boolean) {
            this.#_ = target;
            // 原生Storage支持以属性形式获取/修改存储，使用get/set模拟。
            this.keys().forEach(d => Object.defineProperty(this, d, { get: () => this.getItem(d), set: v => this.setItem(d, v) }));
        }
        /** 清空！ */
        clear() {
            (this.#_ ? self.sessionStorage : self.localStorage).clear()
        };
        /**
         * 读取
         * @param key 目标键名
         * @returns 格式化后的数据
         */
        getItem(key: string) {
            let str: any = (this.#_ ? self.sessionStorage : self.localStorage).getItem(key);
            try { str = JSON.parse(str) } catch (e) { }
            return str;
        };
        /**
         * 列出键名数组  
         * 原生Storage.key只返回但索引，感觉意义不大。
         * @returns 键名数组
         */
        keys() {
            return Object.keys((this.#_ ? self.sessionStorage : self.localStorage));
        };
        /**
         * 移除
         * @param key 目标键名
         */
        removeItem(key: string) {
            (this.#_ ? self.sessionStorage : self.localStorage).removeItem(key);
        };
        /**
         * 添加/修改
         * @param key 
         * @param value 
         */
        setItem(key: string, value: any) {
            switch (typeof value) {
                case "object": (this.#_ ? self.sessionStorage : self.localStorage).setItem(key, JSON.stringify(value));
                    break;
                case "function": debug.warn("函数类型并不适合这样存储！", key, value);
                    break;
                default: (this.#_ ? self.sessionStorage : self.localStorage).setItem(key, String(value));
            }
        };
        /** 条目总数 */
        get length() { return (this.#_ ? self.sessionStorage : self.localStorage).length }
    }
    /** localStorage */
    class LocalStorage extends StorageInterface {
        constructor() { super(false); }
    }
    /** sessionStorage */
    class SessionStorage extends StorageInterface {
        constructor() { super(true); }
    }
    // 声明导出，值需要get/set代理以实时更新
    /** localStorage */
    export const localStorage: LocalStorage = <any>undefined;
    /** sessionStorage */
    export const sessionStorage: SessionStorage = <any>undefined;
    Object.defineProperties(API, {
        localStorage: { get: () => new LocalStorage(), set: () => false },
        sessionStorage: { get: () => new SessionStorage(), set: () => false }
    })
}