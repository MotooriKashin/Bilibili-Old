import { debug } from "../utils/debug";
import { fileRead, readAs, saveAs } from "../utils/file";
import { timeFormat } from "../utils/format/time";
import { toast } from "./toast";
import { userStatus } from "./userstatus";
import { alert } from "./ui/alert";
import { propertryChangeHook } from "../utils/hook/method";

class User {
    /** 用户数据，除非确定已初始化，否则请使用`addCallback`用户数据回调代替 */
    userStatus?: typeof userStatus;
    /** 初始化标记 */
    protected initialized = false;
    /** 更新CD */
    protected updating?: number;
    /** 回调栈 */
    protected changes: Record<keyof typeof userStatus, Function[]> = <any>{};
    /** 更新存储延时 */
    protected timer?: number;
    /** 用户数据加载回调序列 */
    userLoadedCallbacks: ((status: typeof userStatus) => void)[] = [];
    constructor() {
        GM.getValue('userStatus', userStatus).then(status => {
            status = Object.assign(userStatus, status)
            const proxy = propertryChangeHook(status, (key, value) => {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => GM.setValue('userStatus', status));
                this.emitChange(key, value);
            });
            this.userStatus = proxy;
            this.initialized = true;
            while (this.userLoadedCallbacks.length) {
                this.userLoadedCallbacks.shift()?.(proxy);
            }
        });
    }
    /**
     * 监听设置改动
     * @param key 设置键
     * @param callback 设置项变动时执行的回调，新值将作为第一个参数传入
     * @returns 用于取消监听的回调
     */
    bindChange<T extends keyof typeof userStatus>(key: T, callback: (newValue: (typeof userStatus)[T]) => void) {
        this.changes[key] || (this.changes[key] = []);
        const id = this.changes[key].push(callback);
        return () => {
            delete this.changes[key][id - 1];
        }
    }
    /**
     * 推送设置改动
     * @param key 设置键
     * @param newValue 新值
     */
    protected emitChange<T extends keyof typeof userStatus>(key: T, newValue: (typeof userStatus)[T]) {
        this.changes[key].forEach(async d => { d(newValue) });
    }
    /** 用户数据回调 */
    addCallback(callback: (status: typeof userStatus) => void) {
        if (typeof callback === 'function') {
            if (this.initialized) {
                callback(this.userStatus!);
            } else {
                this.userLoadedCallbacks.push(callback);
            }
        }
    }
    /** 恢复默认数据 */
    restoreUserStatus() {
        GM.deleteValue('userStatus');
        toast.warning('已恢复默认设置数据，请<strong>刷新</strong>页面以避免数据紊乱！');
    }
    /** 备份设置数据 */
    outputUserStatus() {
        GM.getValue('userStatus', userStatus)
            .then(d => {
                saveAs(JSON.stringify(d, undefined, '\t'), `Bilibili-Old-${timeFormat(undefined, true).replace(/ |:/g, d => '-')}`, 'application/json')
            });
    }
    /** 恢复备份数据 */
    inputUserStatus() {
        const msg = toast.list('恢复备份数据 >>>', '> 请选择一个备份的数据文件（.json）', '> 注意：无效的数据文件可能导致异常！');
        fileRead("application/json")
            .then(d => {
                if (d && d[0]) {
                    msg.push(`> 读取文件：${d[0].name}`);
                    msg.type = 'info';
                    return readAs(d[0])
                        .then(d => {
                            const data = JSON.parse(d);
                            if (typeof data === "object") {
                                GM.setValue('userStatus', data);
                                const text = '已恢复设置数据，请<strong>刷新</strong>页面以避免数据紊乱！';
                                msg.push('> ' + text, 'fin <<<');
                                msg.type = 'success';
                                return alert(text, '刷新页面', [{
                                    text: '刷新',
                                    callback: () => location.reload()
                                }])
                            }
                        })
                        .catch(e => {
                            msg.push('> 读取文件出错！', e, 'fin <<<');
                            msg.type = 'error';
                            debug.error('恢复设置数据', e);
                        })
                }
            })
            .catch(e => {
                msg.push(e, 'fin <<<');
            })
            .finally(() => {
                msg.delay = 4;
            })
    }
}
/** 用户数据管理 */
export const user = new User();