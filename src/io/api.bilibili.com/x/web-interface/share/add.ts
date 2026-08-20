/**
 * 增加分享。  
 * 单纯给视频分享+1，一个账号仅限一次。
 */
export async function add(
    aid: bigint,
    init?: RequestInit,
) {
    const bili_jct = await cookieStore.get('bili_jct');
    if (!bili_jct) throw new Error('操作失败！');
    const { value: csrf } = bili_jct;
    if (!csrf) throw new Error('操作失败！');
    const url = new URL('https://api.bilibili.com/x/web-interface/share/add');
    const body = new FormData();
    body.set('aid', aid.toString());
    body.set('csrf', csrf);
    const response = await fetch(url, { method: 'POST', body, credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: number; }>>response.json();
}