interface modules {
    /**
     * 限制访问账号
     */
    readonly "midInfo.js": string;
    /**
     * 备份的uid信息，可能需要偶尔更新一下？
     */
    readonly "mid.json": string;
}
{
    const response = API.getModule("mid.json");
    response.data.mid = API.mid;
    switch (Number(API.mid)) {
        case 11783021: response.data.name = "哔哩哔哩番剧出差";
            response.data.official.desc = "哔哩哔哩番剧出差 官方帐号";
            break;
        case 1988098633: response.data.name = "b站_戲劇咖";
            response.data.official.desc = "b站_戲劇咖 官方帐号";
            break;
        case 2042149112: response.data.name = "b站_綜藝咖";
            response.data.official.desc = "b站_綜藝咖 官方帐号";
            break;
    }
    API.xhrhook(["api.bilibili.com/x/space/acc/info"], function (args) {
        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4) {
                if (this.responseText && this.responseText.includes("-404")) {
                    Object.defineProperty(this, 'response', { writable: true });
                    Object.defineProperty(this, 'responseText', { writable: true });
                    (<any>this).response = (<any>this).responseText = JSON.stringify(response);
                    toast.warning("该用户被404，已使用缓存数据恢复访问！")
                }
            }
        });
    })
}