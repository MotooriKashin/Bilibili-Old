import { StatisObserver } from "../core/report";
import { toast } from "../core/toast";
import { urlCleaner } from "../core/url";
import { user } from "../core/user";

export class PageLive {
    protected sleep = false;
    constructor() {
        user.addCallback(status => {
            status.disableSleepChcek && this.disAbleSleepCheck();
            status.disableReport && new StatisObserver();
        });
        this.urlClean();
    }
    /** 添加url清理参数 */
    protected urlClean() {
        urlCleaner.paramsSet.add('broadcast_type');
        urlCleaner.paramsSet.add('is_room_feed');
    }
    /** 禁止挂机检测 */
    protected disAbleSleepCheck() {
        const setInterval = self.setInterval;
        const setTimeout = self.setTimeout;
        self.setInterval = (...args) => {
            // 定时器经过二次包装，toString方法不便来源，延时5分钟一律过滤
            // if (args[0].toString().includes('triggerSleepCallback')) {
            if (args[1] === 300000) {
                if (!this.sleep) {
                    this.sleep = true;
                    toast.warning('成功阻止直播间挂机检测！');
                }
                return Number.MIN_VALUE;
            }
            return setInterval.call(self, ...args);
        }
        self.setTimeout = (...args) => {
            // if (args[0].toString().includes('triggerSleepCallback')) {
            if (args[1] === 300000) {
                if (!this.sleep) {
                    this.sleep = true;
                    toast.warning('成功阻止直播间挂机检测！');
                }
                return Number.MIN_VALUE;
            }
            return setTimeout.call(self, ...args);
        }
    }
}