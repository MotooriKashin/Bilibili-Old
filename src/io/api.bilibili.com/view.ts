/**
 * 获取页面信息  
 * @deprecated 上古接口，已404
 */
export async function view(
    id: number | bigint | string,
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/view');
    const searchParams = new URLSearchParams(<any>{ appkey: '8e9fc618fbd41e28', id, type: 'json' });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<IView>>response.json();
}

interface IView {
    /** UP主 */
    author: string;
    /** 硬币 */
    coins: number;
    /** 发布时间 */
    created_at: string;
    /** 视频简介 */
    description: string;
    /** 收藏 */
    favorites: number;
    id: number;
    /** 修改时间 */
    lastupdate: string;
    /** 分P */
    list: {
        cid: number;
        /** 分P名字 */
    }[];
    mid: number;
    /** 封面 */
    pic: string;
    /** 播放 */
    play: number;
    /** 弹幕 */
    review: number;
    /** 标签 */
    tag: string;
    /** 题目 */
    title: string;
    /** 弹幕 */
    video_review: number;

}