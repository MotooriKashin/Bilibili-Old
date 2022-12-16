import { objUrl } from "../utils/format/url";
import { ApiSign, jsonCheck } from "./api";
import { fnval, fnver, qn } from "./fnval";
import { URLS } from "./urls";

export type IPlayurlFormat = 'mp4' | 'flv480' | 'flv720' | 'flv720_p60' | 'flv' | 'flv_p60' | 'hdflv2';
export type IPlayurlDescription = '流畅 144P' | '流畅 240P' | '流畅 360P' | '清晰 480P' | '高清 720P' | '高清 720P60' | '高清 1080P' | '高清 1080P+' | '高清 1080P60' | '超清 4K' | 'HDR' | '杜比视界' | '超高清 8K';
export type IPlayurlQuality = '144P' | '240P' | '360P' | '480P' | '720P' | '720P60' | '1080P' | '1080P+' | '1080P60' | '4K' | 'HDR' | 'Dolby' | '8K';
export type IPlayurlQualityNumber = 127 | 126 | 125 | 121 | 120 | 116 | 112 | 80 | 74 | 64 | 48 | 32 | 16 | 15 | 6 | 5;
export const PlayurlDescriptionMap: Record<IPlayurlQualityNumber, IPlayurlDescription> = {
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
export const PlayurlFormatMap: Record<IPlayurlQualityNumber, IPlayurlFormat> = {
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
};
export const PlayurlQualityMap: Record<IPlayurlQualityNumber, IPlayurlQuality> = {
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
export const PlayurlCodecs = {
    30126: 'hvc1.2.4.L153.90',
    126: 'hvc1.2.4.L153.90',
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
    30251: 'fLaC', // Hires
    30250: 'ec-3', // Dolby
    30280: 'mp4a.40.2', // 高码音频
    30232: 'mp4a.40.2', // 中码音频
    30216: 'mp4a.40.2', // 低码音频
};
export const PlayurlCodecsAPP = {
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
};
export const PlayurlFrameRate = {
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
};
export const PlayurlResolution = {
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
interface IDash {
    SegmentBase: { Initialization: string; indexRange: string; };
    backupUrl: string[];
    backup_url: string[];
    bandwidth: number;
    baseUrl: string;
    base_url: string;
    codecid: string;
    codecs: string;
    frameRate: string;
    frame_rate: string;
    height: number;
    id: IPlayurlQualityNumber;
    mimeType: string;
    mime_type: string;
    sar: string;
    segment_base: { initialization: string; index_range: string; };
    startWithSap: number;
    start_with_sap: number;
    width: number;
}
interface IPlayurl {
    accept_description: IPlayurlDescription[];
    accept_format: string;
    accept_quality: IPlayurlQualityNumber[];
    bp: number;
    code: number;
    fnval: number;
    fnver: number;
    format: IPlayurlFormat;
    from: string;
    has_paid: boolean;
    is_preview: number;
    message: string;
    no_rexcode: number;
    quality: IPlayurlQualityNumber;
    result: string;
    seek_param: string;
    seek_type: string;
    status: number;
    support_formats: {
        description: IPlayurlDescription;
        codecs: string[];
        display_desc: IPlayurlQuality;
        format: IPlayurlFormat;
        new_description: IPlayurlDescription;
        quality: IPlayurlQualityNumber;
        superscript: string;
    }[];
    timelength: number;
    type: string;
    video_codecid: number;
    video_project: boolean;
}
export interface IPlayurlDash extends IPlayurl {
    dash: {
        audio: IDash[],
        dolby: {
            audio?: {
                id: number;
                base_url: string;
                backup_url: string[];
                bandwidth: number;
                mime_type: string;
                codecs: string;
                segment_base: { initialization: string; index_range: string; };
                size: number;
            }[];
            type: number
        };
        duration: number;
        flac?: { display: boolean; audio: IDash };
        min_buffer_time: number;
        minBufferTime: number;
        video: IDash[];
    };
}
export interface IPlayurlDurl extends IPlayurl {
    durl: {
        ahead: string;
        backup_url: string[];
        length: number;
        order: number;
        size: number;
        url: string;
        vhead: string;
    }[];
}
export class PlayurlDash {
    accept_description: IPlayurlDash['accept_description'] = [];
    accept_format: IPlayurlDash['accept_format'] = '';
    accept_quality: IPlayurlDash['accept_quality'] = [];
    bp = 0;
    code = 0;
    dash: IPlayurlDash['dash'] = {
        audio: [],
        dolby: { audio: [], type: 0 },
        duration: 0,
        min_buffer_time: 1.5,
        minBufferTime: 1.5,
        video: []
    };
    fnval = 4048;
    fnver = 0;
    format: IPlayurlFormat = 'flv';
    from = 'local';
    has_paid = true;
    is_preview = 0;
    message = "";
    no_rexcode = 1;
    quality: IPlayurlQualityNumber = 80;
    result = "suee";
    seek_param = "start";
    seek_type = "offset";
    status = 2;
    support_formats: IPlayurlDash['support_formats'] = [];
    timelength = 0;
    type = "DASH";
    video_codecid = 7;
    video_project = true;
}
interface IAppPgcPlayurlData {
    accessKey?: string;
    cid: number;
    ep_id: number;
    build?: string;
    device?: string;
    force_host?: number;
    mobi_app?: string;
    platform?: string;
}
interface IApiPlayurl {
    qn?: number;
    otype?: string;
    avid: number;
    cid: number;
}
export async function apiPlayurl(data: IApiPlayurl, dash = true, pgc = false): Promise<IPlayurlDash | IPlayurlDurl> {
    data = Object.assign({
        qn,
        otype: 'json',
        fourk: 1
    }, data, dash ? { fnver, fnval } : {});
    const response = await fetch(objUrl(pgc ? URLS.PGC_PLAYURL : URLS.PLAYURL, <any>data), { credentials: 'include' });
    const json = await response.json();
    if (pgc) {
        return jsonCheck(json).result;
    }
    return jsonCheck(json).data;
}
export class ApiAppPgcPlayurl extends ApiSign {
    protected fetch: Promise<Response>;
    constructor(data: IAppPgcPlayurlData, server: string = 'api.bilibili.com') {
        super(URLS.APP_PGC_PLAYURL.replace('api.bilibili.com', server), '1d8b6e7d45233436');
        data = Object.assign({
            build: 6720300,
            device: "android",
            force_host: 2,
            mobi_app: "android",
            platform: "android"
        }, data);
        this.fetch = fetch(this.sign(<any>data));
    }
    async getData() {
        const response = await this.fetch;
        const json = await response.json();
        return <IPlayurlDash>jsonCheck(json);
    }
}