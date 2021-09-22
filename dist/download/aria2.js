/**
 * 本模块负责与aria2通信并构造下载数据
 */
(function () {
    try {
        class Aria2 {
            constructor() {
                this.setting = {};
                config.useragent && (this.setting.userAgent = config.useragent);
                config.referer && (this.setting.referer = config.referer);
                config.filepath && (this.setting.directory = config.filepath);
                config.rpcToken && (this.setting.token = config.rpcToken);
            }
            shell(obj) {
                return new Promise((r, j) => {
                    let result = "aria2c";
                    obj = { ...this.setting, ...obj };
                    obj.urls.forEach(d => result += ` "${d}"`);
                    obj.out && (result += ` --out="${obj.out}"`);
                    obj.userAgent && (result += ` --user-agent="${obj.userAgent}"`);
                    obj.referer && (result += ` --referer="${obj.referer}"`);
                    obj.directory && (result += ` --dir="${obj.directory}"`);
                    obj.split && (result += ` --split="${obj.split}"`);
                    obj.header && Object.entries(obj.header).forEach(d => result += ` --header="${d[0]}: ${d[1]}"`);
                    navigator.clipboard.writeText(result).then(r, e => j(e));
                });
            }
            rpc(obj) {
                obj = { ...this.setting, ...obj };
                const options = {};
                obj.out && (options.out = obj.out);
                obj.userAgent && (options["user-agent"] = obj.userAgent);
                obj.referer && (options["referer"] = obj.referer);
                obj.directory && (options["dir"] = obj.directory);
                obj.split && (options["split"] = obj.split);
                obj.header && (options["header"] = obj.header);
                return this.postMessage("aria2.addUri", obj.id || new Date().getTime(), [obj.urls, options]);
            }
            postMessage(method, id, params = []) {
                const url = `${config.rpcServer}:${config.rpcPort}/jsonrpc`;
                config.rpcToken && params.unshift(`token:${config.rpcToken}`);
                return new Promise((r, j) => {
                    xhr({
                        url: url,
                        method: "POST",
                        responseType: "json",
                        data: JSON.stringify({ method, id, params })
                    }).then(d => {
                        d.error && j(d.error);
                        d.result && r(d.result);
                    }).catch(e => {
                        xhr({
                            url: API.objUrl(url, { method, id, params: API.Base64.encode(JSON.stringify(params)) }),
                            method: "GET",
                            responseType: "json"
                        }).then(d => {
                            d.error && j(d.error);
                            d.result && r(d.result);
                        }).catch(() => j(e));
                    });
                });
            }
            getVersion() {
                return this.postMessage("aria2.getVersion", new Date().getTime());
            }
        }
        API.aria2 = {
            shell: (obj) => new Aria2().shell(obj),
            rpcTest: () => new Aria2().getVersion(),
            rpc: (obj) => new Aria2().rpc(obj)
        };
    }
    catch (e) {
        API.trace(e, "aria2.js", true);
    }
})();
