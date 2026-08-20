/** 点赞 */
export async function like(
    aid: bigint,
    like: boolean,
    init?: RequestInit,
) {
    const bili_jct = await cookieStore.get('bili_jct');
    if (!bili_jct) throw new Error('操作失败！');
    const { value: csrf } = bili_jct;
    if (!csrf) throw new Error('操作失败！');
    const url = new URL('https://api.bilibili.com/x/web-interface/archive/like');
    const body = new FormData();
    body.set('aid', aid.toString());
    body.set('like', like ? '1' : '2');
    body.set('csrf', csrf);
    const response = await fetch(url, { method: 'POST', body, credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; }>>response.json();
}