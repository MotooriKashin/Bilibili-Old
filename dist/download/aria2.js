/**
 * 本模块负责与aria2通信并构造下载数据
 */
(function () {
    class Aria2 {
        constructor() {
            this.setting = {};
            config.useragent && (this.setting.userAgent = config.useragent);
            config.referer && (this.setting.referer = config.referer);
            config.filepath && (this.setting.directory = config.filepath);
            config.rpcToken && (this.setting.token = config.rpcToken);
        }
        commandLine(obj) {
        }
    }
})();
