/** 删除评论 */
export async function del(
    oid: bigint,
    rpid: string,
    type = 1,
    init?: RequestInit,
) {
    const bili_jct = await cookieStore.get('bili_jct');
    if (!bili_jct) throw new Error('操作失败！');
    const { value: csrf } = bili_jct;
    if (!csrf) throw new Error('操作失败！');
    const url = new URL('https://api.bilibili.com/x/v2/reply/del');
    const body = new FormData();
    body.set('oid', oid.toString());
    body.set('rpid', rpid);
    body.set('type', type.toString());
    body.set('csrf', csrf);
    const response = await fetch(url, { method: 'POST', body, credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; }>>response.json();
}