/** 获取最近收藏 */
export async function recent(
    init?: RequestInit,
) {
    const response = await fetch('https://api.bilibili.com/medialist/gateway/coll/resource/recent', { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IRecent[]; }>>response.json();
}

interface IRecent {
    id: number;
    title: string;
}