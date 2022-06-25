namespace API {
    export const settingMG = {
        /** 初始化设置 */
        restore() {
            GM.GM_deleteValue("config");
            toast.warning("已恢复默认数据，请及时刷新页面避免数据紊乱！")
            alert(`已恢复默认数据，请及时<strong>刷新</strong>页面避免数据紊乱！`, "恢复默认设置", [
                { name: "刷新页面", callback: () => location.reload() }
            ]);
        },
        /** 导出设置 */
        output() {
            saveAs(JSON.stringify(GM.GM_getValue("config"), undefined, "\t"), `config ${timeFormat(undefined, true)}.json`, "application/json");
        },
        /** 导入设置 */
        input() {
            fileRead("application/json", true).then(d => {
                d && d[0] && readAs(d[0]).then(d => {
                    const data: Record<string, any> = JSON.parse(d);
                    GM.GM_setValue("config", data);
                    alert(`已恢复备份数据，请及时<strong>刷新</strong>页面避免数据紊乱！`, "恢复默认设置", [
                        { name: "刷新页面", callback: () => location.reload() }
                    ]);
                });
            });
        }
    }
}