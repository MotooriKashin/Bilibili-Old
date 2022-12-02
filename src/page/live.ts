import { BLOD } from "../bilibili-old";
import { StatisObserver } from "../core/report";

export class PageLive {
    protected sleep = false;
    constructor(protected BLOD: BLOD) {
        BLOD.userLoadedCallback(status => {
            status.disableSleepChcek && this.disAbleSleepCheck();
            status.disableReport && new StatisObserver();
        });
        this.urlClean();
    }
    /** 添加url清理参数 */
    protected urlClean() {
        this.BLOD.urlCleaner.paramsSet.add('broadcast_type');
        this.BLOD.urlCleaner.paramsSet.add('is_room_feed');
    }
    /** 禁止挂机检测 */
    protected disAbleSleepCheck() {
        const setInterval = self.setInterval;
        self.setInterval = (...args) => {
            if (args[0].toString().includes('triggerSleepCallback')) {
                if (!this.sleep) {
                    this.sleep = true;
                    this.BLOD.toast.warning('成功阻止直播间挂机检测！');
                }
                return Number.MIN_VALUE;
            }
            return setInterval.call(self, ...args);
        }
    }
}