/** 获取活动信息 */
export async function subject(
    mission_id: number,
    aid: bigint,
    init?: RequestInit,
) {
    const url = new URL(`https://www.bilibili.com/activity/subject/${mission_id}`);
    const searchParams = new URLSearchParams(<any>{ aid });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: ISubject; }>>response.json();
}

export interface ISubject {
    name: string;
    act_url: string;
    cover: string;
    etime: number;
}