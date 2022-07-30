/** localStorage */
class LocalStorage {
    /** 清空！ */
    clear() {
        self.localStorage.clear()
    };
    /**
     * 读取
     * @param key 目标键名
     * @returns 格式化后的数据
     */
    getItem(key: string) {
        let str: any = self.localStorage.getItem(key);
        try { str = JSON.parse(str) } catch (e) { }
        return str;
    };
    /**
     * 列出键名数组  
     * 原生Storage.key只返回但索引，感觉意义不大。
     * @returns 键名数组
     */
    keys() {
        return Object.keys(self.localStorage);
    };
    /**
     * 移除
     * @param key 目标键名
     */
    removeItem(key: string) {
        self.localStorage.removeItem(key);
    };
    /**
     * 添加/修改
     * @param key 
     * @param value 
     */
    setItem(key: string, value: any) {
        switch (typeof value) {
            case "object": self.localStorage.setItem(key, JSON.stringify(value));
                break;
            case "function": console.warn("函数类型并不适合这样存储！", key, value);
                break;
            default: self.localStorage.setItem(key, String(value));
        }
    };
    /** 条目总数 */
    get length() { return self.localStorage.length }
}
/** sessionStorage */
class SessionStorage {
    /** 清空！ */
    clear() {
        self.sessionStorage.clear()
    };
    /**
     * 读取
     * @param key 目标键名
     * @returns 格式化后的数据
     */
    getItem(key: string) {
        let str: any = self.sessionStorage.getItem(key);
        try { str = JSON.parse(str) } catch (e) { }
        return str;
    };
    /**
     * 列出键名数组  
     * 原生Storage.key只返回但索引，感觉意义不大。
     * @returns 键名数组
     */
    keys() {
        return Object.keys(self.sessionStorage);
    };
    /**
     * 移除
     * @param key 目标键名
     */
    removeItem(key: string) {
        self.sessionStorage.removeItem(key);
    };
    /**
     * 添加/修改
     * @param key 
     * @param value 
     */
    setItem(key: string, value: any) {
        switch (typeof value) {
            case "object": self.sessionStorage.setItem(key, JSON.stringify(value));
                break;
            case "function": console.warn("函数类型并不适合这样存储！", key, value);
                break;
            default: self.sessionStorage.setItem(key, String(value));
        }
    };
    /** 条目总数 */
    get length() { return self.sessionStorage.length }
}
export const localStorage = new LocalStorage();
export const sessionStorage = new SessionStorage();