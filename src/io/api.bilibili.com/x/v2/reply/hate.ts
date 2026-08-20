/** 评论点踩 */
export async function hate(
    oid: bigint,
    rpid: string,
    /**
     * | 0 | 1 |
     * | - | - |
     * | 取消 | 点踩 |
     */
    action: 0 | 1,
    type = 1,
    init?: RequestInit,
    ordering: 'heat' | 'time' = 'heat',
) {
    const bili_jct = await cookieStore.get('bili_jct');
    if (!bili_jct) throw new Error('操作失败！');
    const { value: csrf } = bili_jct;
    if (!csrf) throw new Error('操作失败！');
    const url = new URL('https://api.bilibili.com/x/v2/reply/hate');
    const body = new FormData();
    body.set('oid', oid.toString());
    body.set('rpid', rpid);
    body.set('action', action.toString());
    body.set('type', type.toString());
    body.set('ordering', ordering);
    body.set('csrf', csrf);
    const response = await fetch(url, { method: 'POST', body, credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; }>>response.json();
}