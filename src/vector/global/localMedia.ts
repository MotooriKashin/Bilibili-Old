/**
 * 本模块负责实现旧版播放器载入本地视频及弹幕功能
 */
(function () {
    class LocalMedia {
        data: {
            xml: File[],
            json: File[],
            mp4: File[]
        } = { xml: [], json: [], mp4: [] };
        offset: number = 0; // 弹幕当前偏移
        keyboard: boolean = false; // 是否已绑定键盘事件
        /**
         * 读取文件地址
         */
        change(files: FileList) {
            const file = files;
            if (file.length === 0) {
                return API.toast.warning("请选择本地视频或弹幕文件！", "视频：.mp4（且符合浏览器支持的编码）", "弹幕：.xml, .json");
            }
            this.data = { xml: [], json: [], mp4: [] };
            this.data = Array.from(file).reduce((d, i) => {
                /\.xml$/.test(i.name) && d.xml.push(i); // xml弹幕
                /\.json$/.test(i.name) && d.json.push(i); // json弹幕
                /\.mp4$/.test(i.name) && d.mp4.push(i); // mp4视频
                return d;
            }, this.data)
            if (!this.data.xml[0] && !this.data.json[0] && !this.data.mp4[0]) {
                return API.toast.warning("未能识别到任何有效文件信息 →_→");
            }
            this.video();
            this.danmaku();
        }
        /**
         * 读取文件内容
         * @param file 记录本地文件信息的 file 对象
         */
        readFile(file: File): any {
            return new Promise((resolve, reject) => {
                if (!file) reject(API.toast.error('无效文件路径！'));
                const reader = new FileReader();
                reader.readAsText(file, 'utf-8');
                reader.onload = () => {
                    resolve(reader.result);
                }
                reader.onerror = () => {
                    reject(API.toast.error('读取文件出错，请重试！'));
                }
            })
        }
        /**
         * 载入弹幕
         */
        async danmaku() {
            if (!API.loadLocalDm) {
                return API.toast.error("载入本地弹幕失败：本地弹幕组件丢失！");
            }
            if (!this.data.xml[0] && !this.data.json[0]) return;
            this.data.xml.forEach(async (d, i) => {
                // 读取xml弹幕
                let data = await this.readFile(d);
                API.toast("本地弹幕：" + d.name, "载入模式：" + ((i || config.concatDanmaku) ? "与当前弹幕合并" : "替换当前弹幕"));
                API.loadLocalDm(data, Boolean(i) || config.concatDanmaku);
            })
            this.data.json.forEach(async (d, i) => {
                // 读取json弹幕
                let data = JSON.parse(await this.readFile(d)) || [];
                API.toast("本地弹幕：" + d.name, "载入模式：" + ((this.data.xml[0] || i || config.concatDanmaku) ? "与当前弹幕合并" : "替换当前弹幕"));
                window.setDanmaku(data, <any>this.data.xml[0] || Boolean(i) || config.concatDanmaku);
            })
            API.debug.msg();
            this.offset = 0; // 记录或重置弹幕偏移时间
            if (!window.offsetDanmaku) return API.toast.error("绑定键盘事件失败：弹幕偏移组件丢失！")
            else {
                API.toast("已绑定键盘事件", "可以通过键盘 , 和 . 两个键（即上标为 < 和 > 的两个键）提前或延后弹幕偏移，频度1秒/次");
                if (!this.keyboard) {
                    this.keyboard = true;
                    document.addEventListener("keydown", (ev) => {
                        switch (ev.key) {
                            case ",":
                                window.offsetDanmaku(-1);
                                this.offset--;
                                API.debug.msg(undefined, "弹幕偏移：", this.offset + " 秒");
                                break;
                            case ".":
                                window.offsetDanmaku(1);
                                this.offset++;
                                API.debug.msg(undefined, "弹幕偏移：", this.offset + " 秒");
                                break;
                            default:
                                break;
                        }
                    })
                }
            }
        }
        /**
         * 载入视频
         */
        video() {
            if (this.data.mp4[0]) {
                API.toast.warning("载入本地视频中...", "请无视控制台大量报错！")
                let video = <HTMLVideoElement>document.querySelector("video");
                video.src = URL.createObjectURL(this.data.mp4[0]);
                API.toast.success("本地视频：" + this.data.mp4[0].name);
                (<HTMLDivElement>document.querySelector(".bilibili-player-video-time-total")).textContent = this.time(video.duration); // 修复总时长
            }
        }
        /**
         * 格式化时间轴
         * @param time 时间/秒
         * @returns mm:ss
         */
        time(time: number) {
            time = Number(time) || 0;
            let s: any = time % 60;
            let m: any = (time - s) / 60;
            s = (Array(2).join('0') + s).slice(-2);
            m = m < 10 ? (Array(2).join('0') + m).slice(-2) : m;
            return `${m}:${s}`
        }
    }
    const localMedia = new LocalMedia()
    API.localMedia = (files: FileList) => localMedia.change(files);
})();
interface Window {
    /**
     * 实时修改播放器弹幕
     * **本函数直接写入托管的`bilibiliPlayer.js`，使用前请检查是否可用**
     * @param time 弹幕偏移，正相关
     */
    offsetDanmaku: (time: number) => void;
}
declare namespace API {
    /**
     * 载入本地文件
     * @param files `input.files`
     */
    function localMedia(files: FileList): void;
}