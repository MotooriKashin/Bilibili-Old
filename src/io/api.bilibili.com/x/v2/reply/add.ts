import type { IReplies } from ".";

/**
 * 发送评论
 */
export async function add(
    oid: bigint,
    message: string,
    type = 1,
    root?: string,
    parent?: string,
    init?: RequestInit,
    ordering: 'heat' | 'time' = 'heat',
    plat = 1,
) {
    const bili_jct = await cookieStore.get('bili_jct');
    if (!bili_jct) throw new Error('操作失败！');
    const { value: csrf } = bili_jct;
    if (!csrf) throw new Error('操作失败！');
    const url = new URL('https://api.bilibili.com/x/v2/reply/add');
    const body = new FormData();
    body.set('oid', oid.toString());
    body.set('message', message);
    body.set('plat', plat.toString());
    body.set('type', type.toString());
    root && body.set('root', root);
    parent && body.set('parent', parent);
    body.set('ordering', ordering);
    body.set('csrf', csrf);
    const response = await fetch(url, { method: 'POST', body, credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IAdd }>>response.json();
}

interface IAdd {
    reply: IReplies;
}