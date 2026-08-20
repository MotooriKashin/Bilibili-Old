/** 收藏夹 */
export async function folder(
    aid: bigint,
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/x/v2/fav/folder');
    const searchParams = new URLSearchParams(<any>{ aid });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IFolder[]; }>>response.json();
}

export interface IFolder {
    fid: number;
    cur_count: number;
    max_count: number;
    name: string;
    favoured: number;
    /** 3：私密 */
    state: number;
}