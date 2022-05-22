namespace API {
    export class LocalMedia {
        /** 被选择的文件 */
        data: {
            xml: File[],
            json: File[],
            mp4: File[]
        } = { xml: [], json: [], mp4: [] };
        /** 弹幕当前偏移 */
        offset: number = 0;
        /** 是否已绑定键盘事件 */
        keyboard: boolean = false;
        constructor(files: FileList) {
            this.change(files);
        }
        /**
         * 读取文件地址
         */
        change(files: FileList) {
            if (!window.player) {
                return toast.warning("请在播放页使用本功能 →_→");
            }
            const file = files;
            if (file.length === 0) {
                return toast.warning("请选择本地视频或弹幕文件！", "视频：.mp4（且符合浏览器支持的编码）", "弹幕：.xml, .json");
            }
            this.data = { xml: [], json: [], mp4: [] }; // 初始化选择表
            this.data = Array.from(file).reduce((d, i) => { // 根据文件后缀名分类被选文件
                /\.xml$/.test(i.name) && d.xml.push(i); // xml弹幕
                /\.json$/.test(i.name) && d.json.push(i); // json弹幕
                /\.mp4$/.test(i.name) && d.mp4.push(i); // mp4视频
                return d;
            }, this.data)
            if (!this.data.xml[0] && !this.data.json[0] && !this.data.mp4[0]) {
                return toast.warning("未能识别到任何有效文件信息 →_→");
            }
            this.video();
            this.danmaku();
        }
        /** 载入弹幕 */
        async danmaku() {
            if (!danmaku.loadLocalDm) {
                toast.error("载入本地弹幕失败：本地弹幕组件丢失！", "请检查【托管原生脚本】功能~");
                return showSetting("trusteeship");
            }
            if (!this.data.xml[0] && !this.data.json[0]) return;
            this.data.xml.forEach(async (d, i) => {
                // 读取xml弹幕
                let data = await readAs(d)
                toast("本地弹幕：" + d.name, "载入模式：" + ((i || config.localMedia.concat) ? "与当前弹幕合并" : "替换当前弹幕"));
                danmaku.loadLocalDm(data, Boolean(i) || config.localMedia.concat);
            })
            this.data.json.forEach(async (d, i) => {
                // 读取json弹幕
                let data = JSON.parse(await readAs(d)) || [];
                toast("本地弹幕：" + d.name, "载入模式：" + ((this.data.xml[0] || i || config.localMedia.concat) ? "与当前弹幕合并" : "替换当前弹幕"));
                window.player?.setDanmaku(data, <any>this.data.xml[0] || Boolean(i) || config.localMedia.concat);
            })
            this.offset = 0; // 记录或重置弹幕偏移时间
            if (!window.player?.offsetDanmaku) return toast.error("绑定键盘事件失败：弹幕偏移组件丢失！")
            else {
                toast("已绑定键盘事件", "可以通过键盘 , 和 . 两个键（即上标为 < 和 > 的两个键）提前或延后弹幕偏移，频度1秒/次");
                if (!this.keyboard) {
                    this.keyboard = true;
                    document.addEventListener("keydown", (ev) => {
                        switch (ev.key) {
                            case ",":
                                window.player.offsetDanmaku(-1);
                                this.offset--;
                                videoFloat("弹幕偏移：", `${this.offset} 秒`);
                                break;
                            case ".":
                                window.player.offsetDanmaku(1);
                                this.offset++;
                                videoFloat("弹幕偏移：", `${this.offset} 秒`);
                                break;
                            default:
                                break;
                        }
                    })
                }
            }
        }
        /** 载入视频 */
        video() {
            if (this.data.mp4[0]) {
                toast.warning("载入本地视频中...", "请无视控制台大量报错！")
                let video = <HTMLVideoElement>document.querySelector("#bilibiliPlayer > div.bilibili-player-area.video-state-pause > div.bilibili-player-video-wrap > div.bilibili-player-video > video");
                video.src = URL.createObjectURL(this.data.mp4[0]);
                toast.success("本地视频：" + this.data.mp4[0].name);
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
}