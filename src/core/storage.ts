import { toObject, toString } from "../utils/type"

class LocalStorage {
    /** 清空！ */
    static clear() {
        localStorage.clear()
    };
    /**
     * 读取
     * @param key 目标键名
     * @returns 格式化后的数据
     */
    static getItem(key: string) {
        return toObject(localStorage.getItem(key)!);
    };
    /**
     * 列出键名数组  
     * 原生Storage.key只返回但索引，感觉意义不大。
     * @returns 键名数组
     */
    static keys() {
        return Object.keys(localStorage);
    };
    /**
     * 移除
     * @param key 目标键名
     */
    static removeItem(key: string) {
        localStorage.removeItem(key);
    };
    /**
     * 添加/修改
     * @param key 
     * @param value 
     */
    static setItem(key: string, value: any) {
        localStorage.setItem(key, toString(value));
    };
}
class SessionStorage {
    /** 清空！ */
    static clear() {
        sessionStorage.clear()
    };
    /**
     * 读取
     * @param key 目标键名
     * @returns 格式化后的数据
     */
    static getItem(key: string) {
        return toObject(sessionStorage.getItem(key)!);
    };
    /**
     * 列出键名数组  
     * 原生Storage.key只返回但索引，感觉意义不大。
     * @returns 键名数组
     */
    static keys() {
        return Object.keys(sessionStorage);
    };
    /**
     * 移除
     * @param key 目标键名
     */
    static removeItem(key: string) {
        sessionStorage.removeItem(key);
    };
    /**
     * 添加/修改
     * @param key 
     * @param value 
     */
    static setItem(key: string, value: any) {
        sessionStorage.setItem(key, toString(value));
    };
}

export { SessionStorage as sessionStorage, LocalStorage as localStorage }