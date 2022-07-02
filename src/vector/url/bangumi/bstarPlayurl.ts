namespace API {
    const descriptionMap = {
        127: "超高清 8K",
        126: "杜比视界",
        125: "HDR",
        121: "超清 4K",
        120: "超清 4K",
        116: "高清 1080P60",
        112: "高清 1080P+",
        80: "高清 1080P",
        74: "高清 720P60",
        64: "高清 720P",
        48: "高清 720P",
        32: "清晰 480P",
        16: "流畅 360P",
        15: "流畅 360P",
        6: "流畅 240P",
        5: "流畅 144P"
    }
    const formatMap = {
        127: "hdflv2",
        126: "hdflv2",
        125: "hdflv2",
        121: "hdflv2",
        120: "hdflv2",
        116: "flv_p60",
        112: "hdflv2",
        80: "flv",
        74: "flv720_p60",
        64: "flv720",
        48: "flv720",
        32: "flv480",
        16: "mp4",
        15: "mp4",
        6: "mp4",
        5: "mp4"
    }
    const qualityMap = {
        127: "8K",
        126: "Dolby",
        125: "HDR",
        121: "4K",
        120: "4K",
        116: "1080P60",
        112: "1080P+",
        80: "1080P",
        74: "720P60",
        64: "720P",
        48: "720P",
        32: "480P",
        16: "360P",
        15: "360P",
        6: "240P",
        5: "144P"
    }
    /** DASH playurl result模板 */
    class Playurl {
        accept_description: string[] = [];
        accept_format = "";
        accept_quality: any[] = [];
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
        support_formats: any[] = [];
        timelength = 0;
        type = "DASH";
        video_codecid = 7;
        video_project = true;
    }
    /** 编码表 */
    const codecs = {
        default: {
            30121: 'hev1.1.6.L156.90',
            121: 'hev1.1.6.L156.90',
            30120: 'avc1.64003C',
            120: 'avc1.64003C',
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
            30006: 'avc1.64001E', //240P
            6: 'avc1.64001E', // 240P
            30005: 'avc1.64001E', // 144P
            5: 'avc1.64001E', // 144P
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
        30121: '16000/672',
        121: '16000/672',
        30120: '16000/672',
        120: '16000/672',
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
        16: '16000/672',
        30006: '16000/672',
        6: '16000/672',
        30005: '16000/672',
        5: '16000/672'
    }
    /** 分辨率表 */
    const resolution = {
        30121: [3840, 2160],
        121: [3840, 2160],
        30120: [3840, 2160],
        120: [3840, 2160],
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
        30006: [426, 240], // 240P
        6: [426, 240], // 240P
        30005: [256, 144], // 144P
        5: [256, 144] // 144P
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
        debugger
        const playurl = new Playurl();
        const set: string[] = [];
        playurl.quality = ogv.data.video_info.stream_list[0].stream_info.quality || ogv.data.video_info.quality;
        playurl.format = (<any>formatMap)[playurl.quality];
        playurl.timelength = ogv.data.video_info.timelength;

        playurl.dash.duration = Math.ceil(playurl.timelength / 1000);
        playurl.dash.minBufferTime = playurl.dash.min_buffer_time = 1.5;

        await Promise.all(ogv.data.video_info.stream_list.reduce((s: any[], d: any, i: number) => {
            if (d.dash_video && d.dash_video.base_url) {
                s.push((async d => {
                    OBJ[`sidx${cid}`] || (OBJ[`sidx${cid}`] = {});
                    const id: keyof typeof descriptionMap = d.stream_info.quality || d.dash_video.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    playurl.accept_description.push(descriptionMap[id]);
                    set.push(formatMap[id]);
                    playurl.accept_quality.push(id);
                    playurl.support_formats.push({
                        description: descriptionMap[id],
                        display_desc: qualityMap[id],
                        format: formatMap[id],
                        new_description: descriptionMap[id],
                        quality: id,
                        superscript: ""
                    })
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
                        height: (<any>resolution)[id] && (<any>resolution)[id][1],
                        id: d.stream_info.quality,
                        md5: d.dash_video.md5,
                        mimeType: "video/mp4",
                        mime_type: "video/mp4",
                        sar: "1:1",
                        size: d.dash_video.size,
                        startWithSAP: 1,
                        start_with_sap: 1,
                        width: (<any>resolution)[id] && (<any>resolution)[id][0]
                    })
                })(d));
            }
            !i && (<any>ogv.data.video_info.dash_audio).forEach((d: any) => {
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

        // 字符串化格式
        playurl.accept_format = set.join(",");

        return playurl;
    }
}