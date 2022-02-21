interface modules {
    /**
     * 脚本存储数据导出及恢复
     */
    readonly "manage.js": string;
}
{
    class Config {
        box: HTMLDivElement;
        constructor() {
            this.box = API.element.popupbox({ maxWidth: "360px", maxHeight: "300px" });
            API.addElement("div", { style: 'text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;' }, this.box, `<span>设置数据<span>`);
            API.addElement("div", { style: 'margin-bottom: 10px;' }, this.box, `<div>设置数据包含您个人对于设置的自定义调整，不包括内置的模块、安装的第三方模块以及各种功能缓存的数据。您可以选择恢复默认数据、导出为本地文件或者从本地文件中恢复。</div>`);
            this.box.appendChild(API.element.hr());
            const body = API.addElement("div", { style: "display: flex;align-items: center;justify-content: space-around;" }, this.box);
            body.appendChild(API.element.button(() => { this.restore() }, "默认", 0));
            body.appendChild(API.element.button(() => { this.output() }, "导出", 0));
            body.appendChild(API.element.file((v) => { this.input(v) }, false, "导入", [".json"]));
        }
        /**
         * 初始化设置
         */
        restore() {
            GM.deleteValue("config");
            toast.warning("已恢复默认数据，请及时刷新页面避免数据紊乱！")
            API.alertMessage(`已恢复默认数据，请及时<strong>刷新</strong>页面避免数据紊乱！`, "恢复默认设置").then(d => { d && location.reload() });
        }
        /**
         * 导出设置
         */
        output() {
            API.saveAs(JSON.stringify(GM.getValue("config"), undefined, "\t"), `config ${Format.timeFormat(undefined, true)}.json`, "application/json");
        }
        /**
         * 导入设置
         * @param v 被选文件，来自HTMLInputElement.list
         */
        input(v: FileList) {
            v && v[0] && API.readAs(v[0]).then(d => {
                const data: { [name: string]: any } = JSON.parse(d);
                GM.setValue("config", data);
                toast.success("已导入本地设置数据，请刷新页面生效！")
            })
        }
    }
    new Config();
}