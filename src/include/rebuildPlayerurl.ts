interface modules {
    /** 将其他视频流重构为网页端支持的视频流 */
    readonly "rebuildPlayerurl.js": string;
}
namespace API {
    export class RebuildPlayerurl {
        static OBJ: any = {};
        playurl = {
            accept_description: ["高清 1080P+", "高清 1080P", "高清 720P", "清晰 480P", "流畅 360P"],
            accept_format: "hdflv2,flv,flv720,flv480,mp4",
            accept_quality: [112, 80, 64, 32, 16],
            bp: 0,
            code: 0,
            dash: {
                audio: [],
                dolby: { audio: [], type: "NONE" },
                duration: 0,
                min_buffer_time: 1.5,
                minBufferTime: 1.5,
                video: []
            },
            fnval: 0,
            fnver: 0,
            format: "flv480",
            from: "local",
            has_paid: false,
            is_preview: 0,
            message: "",
            no_rexcode: 1,
            quality: 32,
            result: "suee",
            seek_param: "start",
            seek_type: "offset",
            status: 2,
            support_formats: [
                {
                    description: "高清 1080P+",
                    display_desc: "1080P",
                    format: "hdflv2",
                    need_login: true,
                    need_vip: true,
                    new_description: "1080P 高码率",
                    quality: 112,
                    superscript: "高码率"
                },
                {
                    description: "高清 1080P",
                    display_desc: "1080P",
                    format: "flv",
                    need_login: true,
                    new_description: "1080P 高清",
                    quality: 80,
                    superscript: ""
                },
                {
                    description: "高清 720P",
                    display_desc: "720P",
                    format: "flv720",
                    need_login: true,
                    new_description: "720P 高清",
                    quality: 64,
                    superscript: ""
                },
                {
                    description: "清晰 480P",
                    display_desc: "480P",
                    format: "flv480",
                    new_description: "480P 清晰",
                    quality: 32,
                    superscript: ""
                },
                {
                    description: "流畅 360P",
                    display_desc: "360P",
                    format: "mp4",
                    new_description: "360P 流畅",
                    quality: 16,
                    superscript: ""
                }
            ],
            timelength: 0,
            type: "DASH",
            video_codecid: 7,
            video_project: true
        }
        codecs = {
            default: {
                30112: 'avc1.640028', // 1080P+
                30102: 'hev1.1.6.L120.90', // HEVC 1080P+
                30080: 'avc1.640028', // 1080P
                30077: 'hev1.1.6.L120.90', // HEVC 1080P
                30064: 'avc1.64001F', // 720P
                30066: 'hev1.1.6.L120.90', // HEVC 720P
                30032: 'avc1.64001E', // 480P
                30033: 'hev1.1.6.L120.90', // HEVC 480P
                30011: 'hev1.1.6.L120.90', // HEVC 360P
                30016: 'avc1.64001E', // 360P
                30280: 'mp4a.40.2', // 高码音频
                30232: 'mp4a.40.2', // 中码音频
                30216: 'mp4a.40.2', // 低码音频
            },
            app: {
                30016: 'avc1.64001E', // APP源 360P
                30032: 'avc1.64001F', // APP源 480P
                30064: 'avc1.640028', // APP源 720P
                30080: 'avc1.640032', // APP源 1080P
                30216: 'mp4a.40.2', // APP源 低码音频
                30232: 'mp4a.40.2', // APP源 中码音频
                30280: 'mp4a.40.2' // APP源 高码音频 
            }
        }
        frameRate = {
            30112: '16000/672',
            30102: '16000/672',
            30080: '16000/672',
            30077: '16000/656',
            30064: '16000/672',
            30066: '16000/656',
            30032: '16000/672',
            30033: '16000/656',
            30011: '16000/656',
            30016: '16000/672'
        }
        resolution = {
            30112: [1920, 1080], // 1080P+
            30102: [1920, 1080], // HEVC 1080P+
            30080: [1920, 1080], // 1080P
            30077: [1920, 1080], // HEVC 1080P
            30064: [1280, 720], // 720P
            30066: [1280, 720], // HEVC 720P
            30032: [852, 480], // 480P
            30033: [852, 480], // HEVC 480P
            30011: [640, 360], // HEVC 360P
            30016: [640, 360], // 360P
        }
        /**
         * 获取链接ids
         * @param url 下载链接
         * @param duration 媒体时长
         */
        getIdxs(url: string, duration: number) {
            let range = Math.round(duration * 3.5);
            range = range < 6000 ? 6000 : range;
            return xhr({
                url: url,
                responseType: 'arraybuffer',
                headers: { 'Range': `bytes=0-${range}` },
                credentials: false
            });
        }
        /**
         * 过滤问题音频
         * @param audio 音频数据数组
         */
        fixAudio(audio: any[]) {
            return audio.reduce((arr, d) => {
                if (d.id == 30232 || d.id == 30280 || d.id == 30216) arr.push(d);
                return arr;
            }, [])
        }
        /**
         * 重构APP端数据
         * @param app 原始数据对象
         */
        async appPlayurl(app: any) {
            if (app.durl) return app;
            if (app.dash.duration) {
                app.dash.audio = this.fixAudio(app.dash.audio);
                return app;
            }
            toast("重构DASH数据中...");
            for (let key in app) (<any>this.playurl)[key] = app[key];
            // duration向上取整
            this.playurl.dash.duration = Math.ceil(app.timelength / 1000);
            this.playurl.dash.minBufferTime = this.playurl.dash.min_buffer_time = 1.5;
            // 构造Promise序列以同时获取所有DASH媒体segment数据
            // 本应由播放器自行获取，B站官方称之为【首帧优化】却在缺失时直接报错导致播放器无法正常载入视频
            let arr: any = [];
            (<any>this.playurl.dash.video).forEach((d: any, i: any, e: any) => {
                arr.push((async (d) => {
                    RebuildPlayerurl.OBJ["sidx" + String(cid)] = RebuildPlayerurl.OBJ["sidx" + String(cid)] || {};
                    let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (d.SegmentBase) RebuildPlayerurl.OBJ["sidx" + String(cid)][id] = [d.SegmentBase.Initialization, d.SegmentBase.indexRange]
                    if (!RebuildPlayerurl.OBJ["sidx" + String(cid)][id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        // 首个“sidx”出现4字节之前的部分为索引起始点
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        // 首个“mooc”出现前5字节结束索引
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        // 挂载到BLOD下，切换清晰度直接继承使用（以cid为切p标记）
                        RebuildPlayerurl.OBJ["sidx" + String(cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        debug("DASH-video：", id, RebuildPlayerurl.OBJ["sidx" + String(cid)][id]);
                    }
                    d.segment_base = {
                        initialization: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][0],
                        index_range: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][1]
                    };
                    d.SegmentBase = {
                        Initialization: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][0],
                        indexRange: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][1]
                    }
                    d.backupUrl = d.backup_url = d.backupUrl || d.backup_url || [];
                    d.baseUrl = d.base_url;
                    d.codecs = d.codecs || (<any>this.codecs.app)[id] || (<any>this.codecs.default)[id];
                    d.frameRate = d.frame_rate = d.frameRate || d.frame_rate || (<any>this.frameRate)[id];
                    d.height = d.height || (<any>this.resolution)[id][1];
                    d.width = d.width || (<any>this.resolution)[id][0];
                    d.mimeType = d.mime_type = d.mimeType || d.mime_type || 'video/mp4';
                    d.sar = d.sar || "1:1";
                    d.startWithSAP = d.start_with_sap = d.startWithSAP || d.start_with_sap || 1;
                })(e[i]))
            })
            this.playurl.dash.audio = this.fixAudio(this.playurl.dash.audio);
            (<any>this.playurl.dash.audio).forEach((d: any, i: any, e: any) => {
                arr.push((async (d) => {
                    RebuildPlayerurl.OBJ["sidx" + String(cid)] = RebuildPlayerurl.OBJ["sidx" + String(cid)] || {};
                    let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (d.SegmentBase) RebuildPlayerurl.OBJ["sidx" + String(cid)][id] = [d.SegmentBase.Initialization, d.SegmentBase.indexRange]
                    if (!RebuildPlayerurl.OBJ["sidx" + String(cid)][id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        RebuildPlayerurl.OBJ["sidx" + String(cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        debug("DASH-audio：", id, RebuildPlayerurl.OBJ["sidx" + String(cid)][id]);
                    }
                    d.segment_base = {
                        initialization: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][0],
                        index_range: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][1]
                    };
                    d.SegmentBase = {
                        Initialization: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][0],
                        indexRange: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][1]
                    }
                    d.backupUrl = d.backup_url = d.backupUrl || d.backup_url || [];
                    d.baseUrl = d.base_url;
                    d.codecs = d.codecs || (<any>this.codecs.app)[id] || (<any>this.codecs.default)[id] || "mp4a.40.2";
                    d.mimeType = d.mime_type = d.mimeType || d.mime_type || 'audio/mp4';
                })(e[i]))
            })
            toast("等待数据回传...");
            if (arr[0]) await Promise.all(arr);

            // video排序
            let avc: any = [], hev: any = [], video: any = [];
            this.playurl.dash.video.forEach((d: any) => {
                if (d.codecid == 7) avc.push(d);
                else hev.push(d);
            })
            let length = avc.length > hev.length ? avc.length : hev.length;
            for (let i = length - 1; i >= 0; i--) {
                if (avc[i]) video.push(avc[i]);
                if (hev[i]) video.push(hev[i]);
            }
            this.playurl.dash.video = video;
            toast.success("DASH数据重构成功！", "正在投喂给播放器...");
            debug.log(this.playurl);
            return this.playurl;
        }
        /**
         * 重构Thailand数据
         * @param ogv 原始数据
         */
        async ogvPlayurl(ogv: any) {
            toast("重构DASH数据中...");
            this.playurl.quality = ogv.data.video_info.quality;
            let num = this.playurl.accept_quality.indexOf(this.playurl.quality);
            this.playurl.format = this.playurl.accept_format.split(",")[num];
            this.playurl.timelength = ogv.data.video_info.timelength;

            this.playurl.accept_quality.splice(0, num);
            this.playurl.support_formats.splice(0, num);
            this.playurl.accept_description.splice(0, num);
            (<any>this.playurl.accept_format) = this.playurl.accept_format.split(",");
            (<any>this.playurl.accept_format).splice(0, num);
            this.playurl.accept_format = (<any>this.playurl.accept_format).join(",");

            this.playurl.dash.duration = Math.ceil(this.playurl.timelength / 1000);
            this.playurl.dash.minBufferTime = this.playurl.dash.min_buffer_time = 1.5;

            let arr: any[] = [];
            ogv.data.video_info.stream_list.forEach((d: any) => {
                if (d.dash_video && d.dash_video.base_url) {
                    arr.push((async (d) => {
                        RebuildPlayerurl.OBJ["sidx" + String(cid)] = RebuildPlayerurl.OBJ["sidx" + String(cid)] || {};
                        let id = d.dash_video.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                        if (!RebuildPlayerurl.OBJ["sidx" + String(cid)][id]) {
                            let data = new Uint8Array(await this.getIdxs(d.dash_video.base_url, this.playurl.dash.duration));
                            let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                            let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                            let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                            RebuildPlayerurl.OBJ["sidx" + String(cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                            debug("DASH-video：", id, RebuildPlayerurl.OBJ["sidx" + String(cid)][id]);
                        }
                        (<any>this.playurl.dash.video).push({
                            SegmentBase: {
                                Initialization: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][0],
                                indexRange: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][1]
                            },
                            segment_base: {
                                initialization: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][0],
                                index_range: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][1]
                            },
                            backupUrl: [],
                            backup_url: [],
                            bandwidth: d.dash_video.bandwidth,
                            baseUrl: d.dash_video.base_url,
                            base_url: d.dash_video.base_url,
                            codecid: d.dash_video.codecid,
                            codecs: (<any>this.codecs.app)[id] || (<any>this.codecs.default)[id],
                            frameRate: (<any>this.frameRate)[id],
                            frame_rate: (<any>this.frameRate)[id],
                            height: (<any>this.resolution)[id][1],
                            id: d.stream_info.quality,
                            md5: d.dash_video.md5,
                            mimeType: "video/mp4",
                            mime_type: "video/mp4",
                            sar: "1:1",
                            size: d.dash_video.size,
                            startWithSAP: 1,
                            start_with_sap: 1,
                            width: (<any>this.resolution)[id][0]
                        })
                    })(d))
                }
            })
                (<any>ogv.data.video_info.dash_audio).forEach((d: any) => {
                    arr.push((async (d) => {
                        RebuildPlayerurl.OBJ["sidx" + String(cid)] = RebuildPlayerurl.OBJ["sidx" + String(cid)] || {};
                        let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                        if (!RebuildPlayerurl.OBJ["sidx" + String(cid)][id]) {
                            let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                            let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                            let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                            let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                            RebuildPlayerurl.OBJ["sidx" + String(cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                            debug("DASH-audio：", id, RebuildPlayerurl.OBJ["sidx" + String(cid)][id]);
                        }
                        (<any>this.playurl.dash.audio).push({
                            SegmentBase: {
                                Initialization: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][0],
                                indexRange: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][1]
                            },
                            segment_base: {
                                initialization: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][0],
                                index_range: RebuildPlayerurl.OBJ["sidx" + String(cid)][id][1]
                            },
                            backupUrl: [],
                            backup_url: [],
                            bandwidth: d.bandwidth,
                            baseUrl: d.base_url,
                            base_url: d.base_url,
                            codecid: d.codecid,
                            codecs: (<any>this.codecs.app)[id] || (<any>this.codecs.default)[id],
                            frameRate: "",
                            frame_rate: "",
                            height: 0,
                            id: id,
                            md5: d.md5,
                            mimeType: "audio/mp4",
                            mime_type: "audio/mp4",
                            sar: "",
                            size: d.size,
                            startWithSAP: 0,
                            start_with_sap: 0,
                            width: 0
                        })
                    })(d))
                })
            toast("等待数据回传...");
            await Promise.all(arr);
            toast.success("DASH数据重构成功！", "正在投喂给播放器...");
            debug.log(this.playurl);
            return this.playurl;
        }
    }
}