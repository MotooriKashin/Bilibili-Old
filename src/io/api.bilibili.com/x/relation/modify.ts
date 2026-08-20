/** 修改关注关系 */
export async function modify(
    fid: bigint | string | number,
    act: RELATION_MODIFY,
    init?: RequestInit,
    re_src = 15,
) {
    const bili_jct = await cookieStore.get('bili_jct');
    if (!bili_jct) throw new Error('操作失败！');
    const { value: csrf } = bili_jct;
    if (!csrf) throw new Error('操作失败！');
    const url = new URL('https://api.bilibili.com/x/relation/modify');
    const body = new FormData();
    body.set('fid', fid.toString());
    body.set('act', act.toString());
    body.set('re_src', re_src.toString());
    body.set('csrf', csrf);
    const response = await fetch(url, { method: 'POST', body, credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; }>>response.json();
}

/**
 * 要修改的关系类型
 */
export enum RELATION_MODIFY {
    ADD_FOLLOW = 1,
    CANCEL_FOLLOW,
    QUIET,
    CANCEL_QUIET,
    BLOCK,
    CANCEL_BLOCK,
    DEL_FANS,
}