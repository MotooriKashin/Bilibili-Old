/** 获取视频流 */
export async function playurl(
    avid: bigint,
    cid: bigint,
    init?: RequestInit,
    qn = 127,
    fnval = 4048,
    fnver = 0,
    session = crypto.randomUUID().replaceAll('-', ''),
) {
    const url = new URL('https://api.bilibili.com/x/player/playurl');
    const searchParams = new URLSearchParams(<any>{ avid, cid, qn, fnval, fnver, session });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IPlayurl; }>>response.json();
}

export interface IPlayurl {
    durl?: {
        url: string;
        backup_url?: string[];
    }[];
    dash?: IDash;
    support_formats: {
        quality: number;
        display_desc: string;
        superscript: string;
    }[];
    quality: number;
    is_drm: boolean;
    drm_type: string;
}

export interface IDash {
    video?: {
        /**
         * | 7 | 12 | 13 |
         * | - | - | - |
         * | AVC | HECV | AV1 |
         */
        codecid: number;
        codecs: string;
        id: number;
        mime_type: string;
        base_url: string;
        backup_url?: string[];
    }[];
    audio?: IAudio[];
    flac?: {
        audio: IAudio;
    };
    dolby?: {
        audio?: IAudio[];
    };
}

interface IAudio {
    id: number;
    codecs: string;
    mime_type: string;
    base_url: string;
    backup_url?: string[];
}