namespace API {
    /** DASH playurl result模板 */
    class Playurl {
        accept_description = ["高清 1080P+", "高清 1080P", "高清 720P", "清晰 480P", "流畅 360P"];
        accept_format = "hdflv2,flv,flv720,flv480,mp4";
        accept_quality = [112, 80, 64, 32, 16];
        bp = 0;
        code = 0;
        dash = {
            audio: [],
            dolby: { audio: [], type: "NONE" },
            duration: 0,
            min_buffer_time: 1.5,
            minBufferTime: 1.5,
            video: []
        };
        fnval = 0;
        fnver = 0;
        format = "flv480";
        from = "local";
        has_paid = false;
        is_preview = 0;
        message = "";
        no_rexcode = 1;
        quality = 32;
        result = "suee";
        seek_param = "start";
        seek_type = "offset";
        status = 2;
        support_formats = [
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
        ];
        timelength = 0;
        type = "DASH";
        video_codecid = 7;
        video_project = true;
    }
    /** 编码表 */
    const codecs = {
        default: {
            30112: 'avc1.640028', // 1080P+
            112: 'avc1.640028', // 1080P+
            30102: 'hev1.1.6.L120.90', // HEVC 1080P+
            102: 'hev1.1.6.L120.90', // HEVC 1080P+
            30080: 'avc1.640028', // 1080P
            80: 'avc1.640028', // 1080P
            30077: 'hev1.1.6.L120.90', // HEVC 1080P
            77: 'hev1.1.6.L120.90', // HEVC 1080P
            30064: 'avc1.64001F', // 720P
            64: 'avc1.64001F', // 720P
            30066: 'hev1.1.6.L120.90', // HEVC 720P
            66: 'hev1.1.6.L120.90', // HEVC 720P
            30032: 'avc1.64001E', // 480P
            32: 'avc1.64001E', // 480P
            30033: 'hev1.1.6.L120.90', // HEVC 480P
            33: 'hev1.1.6.L120.90', // HEVC 480P
            30011: 'hev1.1.6.L120.90', // HEVC 360P
            11: 'hev1.1.6.L120.90', // HEVC 360P
            30016: 'avc1.64001E', // 360P
            16: 'avc1.64001E', // 360P
            30280: 'mp4a.40.2', // 高码音频
            30232: 'mp4a.40.2', // 中码音频
            30216: 'mp4a.40.2', // 低码音频
        },
        app: {
            30016: 'avc1.64001E', // APP源 360P
            16: 'avc1.64001E', // APP源 360P
            30032: 'avc1.64001F', // APP源 480P
            32: 'avc1.64001F', // APP源 480P
            30064: 'avc1.640028', // APP源 720P
            64: 'avc1.640028', // APP源 720P
            30080: 'avc1.640032', // APP源 1080P
            80: 'avc1.640032', // APP源 1080P
            30216: 'mp4a.40.2', // APP源 低码音频
            30232: 'mp4a.40.2', // APP源 中码音频
            30280: 'mp4a.40.2' // APP源 高码音频 
        }
    }
    /** 帧率表 */
    const frameRate = {
        30112: '16000/672',
        112: '16000/672',
        30102: '16000/672',
        102: '16000/672',
        30080: '16000/672',
        80: '16000/672',
        30077: '16000/656',
        77: '16000/656',
        30064: '16000/672',
        64: '16000/672',
        30066: '16000/656',
        66: '16000/656',
        30032: '16000/672',
        32: '16000/672',
        30033: '16000/656',
        33: '16000/656',
        30011: '16000/656',
        11: '16000/656',
        30016: '16000/672',
        16: '16000/672'
    }
    /** 分辨率表 */
    const resolution = {
        30112: [1920, 1080], // 1080P+
        112: [1920, 1080], // 1080P+
        30102: [1920, 1080], // HEVC 1080P+
        102: [1920, 1080], // HEVC 1080P+
        30080: [1920, 1080], // 1080P
        80: [1920, 1080], // 1080P
        30077: [1920, 1080], // HEVC 1080P
        77: [1920, 1080], // HEVC 1080P
        30064: [1280, 720], // 720P
        64: [1280, 720], // 720P
        30066: [1280, 720], // HEVC 720P
        66: [1280, 720], // HEVC 720P
        30032: [852, 480], // 480P
        32: [852, 480], // 480P
        30033: [852, 480], // HEVC 480P
        33: [852, 480], // HEVC 480P
        30011: [640, 360], // HEVC 360P
        11: [640, 360], // HEVC 360P
        30016: [640, 360], // 360P
        16: [640, 360], // 360P
    }
    /**
     * 获取链接idxs
     * @param url 下载链接
     * @param duration 媒体时长
     */
    function getIdxs(url: string, duration: number) {
        let range = Math.round(duration * 3.5);
        range = range < 6000 ? 6000 : range;
        return xhr({
            url: url.replace("http:", "https:"),
            responseType: 'arraybuffer',
            headers: { 'Range': `bytes=0-${range}` }
        });
    }
    /** idxs暂存 */
    const OBJ: any = {};
    /**
     * 重构泰区playurl为网页可解析形式
     * @param ogv 原始数据(json)
     */
    export async function bstarPlayurl(ogv: Record<string, any>) {
        const playurl = new Playurl();
        playurl.quality = ogv.data.video_info.quality;
        const num = playurl.accept_quality.indexOf(playurl.quality);
        playurl.format = playurl.accept_format.split(",")[num];
        playurl.timelength = ogv.data.video_info.timelength;

        playurl.accept_quality.splice(0, num);
        playurl.support_formats.splice(0, num);
        playurl.accept_description.splice(0, num);
        (<any>playurl.accept_format) = playurl.accept_format.split(",");
        (<any>playurl.accept_format).splice(0, num);
        playurl.accept_format = (<any>playurl.accept_format).join(",");

        playurl.dash.duration = Math.ceil(playurl.timelength / 1000);
        playurl.dash.minBufferTime = playurl.dash.min_buffer_time = 1.5;

        await Promise.all(ogv.data.video_info.stream_list.reduce((s: any[], d: any) => {
            if (d.dash_video && d.dash_video.base_url) {
                s.push((async d => {
                    OBJ[`sidx${cid}`] || (OBJ[`sidx${cid}`] = {});
                    const id = d.stream_info.quality || d.dash_video.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (!OBJ[`sidx${cid}`][id]) {
                        let data = new Uint8Array(await getIdxs(d.dash_video.base_url, playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        // 首个“sidx”出现4字节之前的部分为索引起始点
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        // 首个“mooc”出现前5字节结束索引
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        // 挂载到BLOD下，切换清晰度直接继承使用（以cid为切p标记）
                        OBJ[`sidx${cid}`][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        debug("DASH-video：", id, OBJ[`sidx${cid}`][id]);
                    }
                    (<any>playurl.dash.video).push({
                        SegmentBase: {
                            Initialization: OBJ[`sidx${cid}`][id][0],
                            indexRange: OBJ[`sidx${cid}`][id][1]
                        },
                        segment_base: {
                            initialization: OBJ[`sidx${cid}`][id][0],
                            index_range: OBJ[`sidx${cid}`][id][1]
                        },
                        backupUrl: [],
                        backup_url: [],
                        bandwidth: d.dash_video.bandwidth,
                        baseUrl: d.dash_video.base_url,
                        base_url: d.dash_video.base_url,
                        codecid: d.dash_video.codecid,
                        codecs: (<any>codecs.app)[id] || (<any>codecs.default)[id],
                        frameRate: (<any>frameRate)[id],
                        frame_rate: (<any>frameRate)[id],
                        height: (<any>resolution)[id][1],
                        id: d.stream_info.quality,
                        md5: d.dash_video.md5,
                        mimeType: "video/mp4",
                        mime_type: "video/mp4",
                        sar: "1:1",
                        size: d.dash_video.size,
                        startWithSAP: 1,
                        start_with_sap: 1,
                        width: (<any>resolution)[id][0]
                    })
                })(d));
            }
            playurl.dash.audio.forEach((d: any) => {
                s.push((async d => {
                    OBJ[`sidx${cid}`] || (OBJ[`sidx${cid}`] = {});
                    const id = d.id || d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (!OBJ[`sidx${cid}`][id]) {
                        let data = new Uint8Array(await getIdxs(d.base_url, playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        // 首个“sidx”出现4字节之前的部分为索引起始点
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        // 首个“mooc”出现前5字节结束索引
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        // 挂载到BLOD下，切换清晰度直接继承使用（以cid为切p标记）
                        OBJ[`sidx${cid}`][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        debug("DASH-video：", id, OBJ[`sidx${cid}`][id]);
                    }
                    (<any>playurl.dash.audio).push({
                        SegmentBase: {
                            Initialization: OBJ[`sidx${cid}`][id][0],
                            indexRange: OBJ[`sidx${cid}`][id][1]
                        },
                        segment_base: {
                            initialization: OBJ[`sidx${cid}`][id][0],
                            index_range: OBJ[`sidx${cid}`][id][1]
                        },
                        backupUrl: [],
                        backup_url: [],
                        bandwidth: d.bandwidth,
                        baseUrl: d.base_url,
                        base_url: d.base_url,
                        codecid: d.codecid,
                        codecs: (<any>codecs.app)[id] || (<any>codecs.default)[id],
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
                })(d));
            });
            return s;
        }, []));

        // video排序
        const avc: any = [], hev: any = [], video: any = [];
        playurl.dash.video.forEach((d: any) => {
            if (d.codecid == 7) avc.push(d);
            else hev.push(d);
        })
        let length = avc.length > hev.length ? avc.length : hev.length;
        for (let i = length - 1; i >= 0; i--) {
            if (avc[i]) video.push(avc[i]);
            if (hev[i]) video.push(hev[i]);
        }
        playurl.dash.video = video;

        return playurl;
    }
}