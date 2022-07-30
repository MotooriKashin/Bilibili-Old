import { fileRead, readAs, saveAs } from "../lib/file";
import { showAlert } from "../element/alert";
import { timeFormat } from "../format/time";
import { toast } from "../toast/toast";

/** 【后台脚本】 */
export const settingMG = {
    /** 【后台脚本】初始化设置 */
    restore() {
        chrome.storage.local.clear();
        toast.warning("已恢复默认数据，请及时刷新页面避免数据紊乱！")
        showAlert(`已恢复默认数据，请及时<strong>刷新</strong>页面避免数据紊乱！`, "恢复默认设置", [
            { name: "刷新页面", callback: () => location.reload() }
        ]);
    },
    /** 【后台脚本】导出设置 */
    output() {
        chrome.storage.local.get(d => {
            saveAs(JSON.stringify(d, undefined, "\t"), `Bilibili-Old-${timeFormat(undefined, true)}.json`, "application/json");
        })
    },
    /** 【后台脚本】导入设置 */
    input() {
        fileRead("application/json", true).then(d => {
            d && d[0] && readAs(d[0]).then(d => {
                const data: Record<string, any> = JSON.parse(d);
                chrome.storage.local.set({ setting: data })
                showAlert(`已恢复备份数据，请及时<strong>刷新</strong>页面避免数据紊乱！`, "恢复默认设置", [
                    { name: "刷新页面", callback: () => location.reload() }
                ]);
            });
        });
    }
}