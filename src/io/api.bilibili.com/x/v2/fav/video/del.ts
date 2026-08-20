/** 取消收藏 */
export async function del(
    aid: bigint,
    fid: number | number[],
    init?: RequestInit,
) {
    const bili_jct = await cookieStore.get('bili_jct');
    if (!bili_jct) throw new Error('操作失败！');
    const { value: csrf } = bili_jct;
    if (!csrf) throw new Error('操作失败！');
    const url = new URL('https://api.bilibili.com/x/v2/fav/video/del');
    const body = new FormData();
    body.set('aid', aid.toString());
    body.set('fid', (<number[]>[]).concat(fid).join(','));
    body.set('csrf', csrf);
    const response = await fetch(url, { method: 'POST', body, credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; }>>response.json();
}