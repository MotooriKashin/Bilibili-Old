/** 获取缩略图 */
/** 获取播放流 */
export async function videoshot(
    aid: bigint,
    cid: bigint,
    init?: RequestInit,

) {
    const url = new URL('https://api.bilibili.com/x/player/videoshot');
    const searchParams = new URLSearchParams(<any>{ aid, cid });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IVideoshot; }>>response.json();
}

export interface IVideoshot {
    /** 缩略图序列 */
    image: string[];
    /** 行向缩略图数目 */
    img_x_len: number;
    /** 单个缩略图行向像素 */
    img_x_size?: number;
    /** 块向缩略图数目 */
    img_y_len: number;
    /** 单个缩略图块向像素 */
    img_y_size?: number;
    /** 视频时间对应的缩略图位置索引 */
    pvdata: string;
    /** 索引数据 */
    index: number[];
}