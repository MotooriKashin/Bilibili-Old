import { fileRead, readAs, saveAs } from "../include/file.js";
import { showAlert } from "../runtime/element/alert.js";
import { timeFormat } from "../runtime/format/time.js";
import { toast } from "../runtime/toast/toast.js";

export const settingMG = {
    /** 初始化设置 */
    restore() {
        chrome.storage.local.clear();
        toast.warning("已恢复默认数据，请及时刷新页面避免数据紊乱！")
        showAlert(`已恢复默认数据，请及时<strong>刷新</strong>页面避免数据紊乱！`, "恢复默认设置", [
            { name: "刷新页面", callback: () => location.reload() }
        ]);
    },
    /** 导出设置 */
    output() {
        chrome.storage.local.get(d => {
            saveAs(JSON.stringify(d, undefined, "\t"), `config ${timeFormat(undefined, true)}.json`, "application/json");
        })
    },
    /** 导入设置 */
    input() {
        fileRead("application/json", true).then(d => {
            d && d[0] && readAs(d[0]).then(d => {
                const data: Record<string, any> = JSON.parse(d);
                chrome.storage.local.set(data)
                showAlert(`已恢复备份数据，请及时<strong>刷新</strong>页面避免数据紊乱！`, "恢复默认设置", [
                    { name: "刷新页面", callback: () => location.reload() }
                ]);
            });
        });
    }
}