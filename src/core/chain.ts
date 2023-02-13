import { user } from "./user";

export const Chain = new (class {
    /**
     * 链式获取目标对象的值
     * @param key 链式字符串
     * @param obj 目标对象（默认为用户数据）
     * @returns 用户数据
     * @example
     * getStatus('toast.disabled') // userStatus.toast.disabled
     */
    getStatus(key: string, obj: object = user.userStatus!) {
        const arr = key.split('.');
        let status: any = obj;
        while (status && arr.length) {
            const d = arr.shift();
            d && (status = status[d]);
        }
        return status;
    }
    /**
     * 链式设置目标对象的值
     * @param key 链式字符串
     * @param value 用户数据
     * @param obj 目标对象（默认为用户数据）
     * @example
     * setStatus('toast.disabled', false) // userStatus.toast.disabled
     */
    setStatus(key: string, value: any, obj: object = user.userStatus!) {
        try {
            const arr = key.split('.');
            let target: any = obj;
            key = <any>undefined;
            while (arr.length) {
                key && (target = target[key]);
                key = <any>arr.shift();
            }
            target[key] = value;
        } catch { }
    }
})();