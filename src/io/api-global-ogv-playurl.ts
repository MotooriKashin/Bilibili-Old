import { jsonCheck } from "./api";
import { IPlayurlDash, PlayurlDescriptionMap, PlayurlFormatMap, PlayurlDash, IPlayurlQualityNumber, PlayurlQualityMap, PlayurlCodecs, PlayurlCodecsAPP, PlayurlFrameRate, PlayurlResolution } from "./api-playurl";
import { ApiSign } from "./api-sign";
import { Sidx } from "./sidx";
import { URLS } from "./urls";

export class ApiGlobalOgvPlayurl extends ApiSign {
    protected response?: IGlobalOgvPlayurlResponse;
    /**
     * @param data 查询参数
     * @param server 东南亚（泰区）代理服务器
     */
    constructor(protected data: GlobalOgvPlayurlData, server = 'api.global.bilibili.com') {
        super(URLS.GLOBAL_OGV_PLAYURL.replace('api.global.bilibili.com', server), '7d089525d3611b1c')
        this.data = Object.assign({
            area: "th",
            build: 1001310,
            device: "android",
            force_host: 2,
            download: 1,
            mobi_app: "bstar_a",
            platform: "android"
        }, data);
    }
    async getDate() {
        if (this.response) return this.response;
        const response = await fetch(this.sign());
        const json = await response.json();
        return this.response = <IGlobalOgvPlayurlResponse>jsonCheck(json).data;
    }
    toPlayurl() {
        return new Promise((resolve: (value: IPlayurlDash) => void, reject) => {
            this.getDate()
                .then(d => {
                    const playurl = new PlayurlDash();
                    const set: string[] = [];
                    playurl.quality = d.video_info.stream_list[0].stream_info.quality || d.video_info.quality;
                    playurl.format = PlayurlFormatMap[playurl.quality];
                    playurl.timelength = d.video_info.timelength;

                    playurl.dash.duration = Math.ceil(playurl.timelength / 1000);
                    playurl.dash.minBufferTime = playurl.dash.min_buffer_time = 1.5;

                    Promise.all([...d.video_info.stream_list.map(d => (async () => {
                        if (d.dash_video && d.dash_video.base_url) {
                            const id = d.stream_info.quality;
                            playurl.accept_description.push(PlayurlDescriptionMap[id]);
                            set.push(PlayurlFormatMap[id]);
                            playurl.accept_quality.push(id);
                            playurl.support_formats.push({
                                description: PlayurlDescriptionMap[id],
                                display_desc: PlayurlQualityMap[id],
                                format: PlayurlFormatMap[id],
                                new_description: PlayurlDescriptionMap[id],
                                quality: id,
                                superscript: "",
                                codecs: [PlayurlCodecs[<5>id]]
                            });
                            const sidx = await new Sidx(d.dash_video.base_url, d.dash_video.size).getData();
                            playurl.dash.video.push({
                                SegmentBase: {
                                    Initialization: sidx[0],
                                    indexRange: sidx[1]
                                },
                                segment_base: {
                                    initialization: sidx[0],
                                    index_range: sidx[1]
                                },
                                backupUrl: [],
                                backup_url: [],
                                bandwidth: d.dash_video.bandwidth,
                                baseUrl: d.dash_video.base_url,
                                base_url: d.dash_video.base_url,
                                codecid: <any>d.dash_video.codecid,
                                codecs: PlayurlCodecsAPP[<32>id] || PlayurlCodecs[<32>id],
                                frameRate: PlayurlFrameRate[<32>id],
                                frame_rate: PlayurlFrameRate[<32>id],
                                height: PlayurlResolution[<32>id]?.[1],
                                id: d.stream_info.quality,
                                mimeType: "video/mp4",
                                mime_type: "video/mp4",
                                sar: "1:1",
                                startWithSap: 1,
                                start_with_sap: 1,
                                width: PlayurlResolution[<32>id]?.[0]
                            });
                        }
                    })()),
                    ...d.video_info.dash_audio.map(d => (async () => {
                        const id = <IPlayurlQualityNumber>d.id;
                        const sidx = await new Sidx(d.base_url, d.size).getData();
                        playurl.dash.audio.push({
                            SegmentBase: {
                                Initialization: sidx[0],
                                indexRange: sidx[1]
                            },
                            segment_base: {
                                initialization: sidx[0],
                                index_range: sidx[1]
                            },
                            backupUrl: [],
                            backup_url: [],
                            bandwidth: d.bandwidth,
                            baseUrl: d.base_url,
                            base_url: d.base_url,
                            codecid: <any>d.codecid,
                            codecs: PlayurlCodecsAPP[<32>id] || PlayurlCodecs[<32>id],
                            frameRate: "",
                            frame_rate: "",
                            height: 0,
                            id: id,
                            mimeType: "audio/mp4",
                            mime_type: "audio/mp4",
                            sar: "",
                            startWithSap: 0,
                            start_with_sap: 0,
                            width: 0
                        })
                    })())])
                        .then(() => {
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

                            // 默认1080P
                            (playurl.quality > 80) && (playurl.quality = 80);
                            resolve(playurl);
                        })
                        .catch(e => reject(e));
                })
                .catch(e => reject(e));
        });
    }
}

interface GlobalOgvPlayurlData {
    season_id?: number;
    ep_id?: number;
    access_key: string;
    appkey?: string;
    area?: 'th';
    avid: number;
    build?: number;
    cid: number;
    device: 'android';
    download?: number;
    drm_tech_type?: 2 | 3;
    fnval: number;
    fnver: number;
    force_host?: number;
    fourk: number;
    from_client: 'PC_APP' | 'BROWSER';
    mobi_app: 'bstar_a';
    otype: 'json';
    platform: 'android';
    qn: number;
    session?: string;
    ts: number;
    type: string;
}
interface IGlobalOgvPlayurlDashAudio {
    backup_url: string[];
    bandwidth: number;
    base_url: string;
    codecid: number;
    id: number;
    md5: string;
    size: number;
}
interface IGlobalOgvPlayurlDashVideo extends Omit<IGlobalOgvPlayurlDashAudio, 'id'> {
    audio_id: IGlobalOgvPlayurlDashAudio['id'];
}
interface IGlobalOgvPlayurlStreamInfo {
    description: string;
    display_desc: string;
    intact: boolean;
    need_login: boolean;
    need_vip: boolean;
    new_description: string;
    no_rexcode: boolean;
    quality: IPlayurlQualityNumber;
}
interface IGlobalOgvPlayurlResponse {
    dimension: { height: number; rotate: number; width: number };
    video_info: {
        dash_audio: IGlobalOgvPlayurlDashAudio[];
        quality: IPlayurlQualityNumber;
        stream_list: {
            dash_video: IGlobalOgvPlayurlDashVideo;
            stream_info: IGlobalOgvPlayurlStreamInfo;
        }[];
        timelength: number;
    };
}