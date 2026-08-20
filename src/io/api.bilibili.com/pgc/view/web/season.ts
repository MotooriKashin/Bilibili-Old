/** 获取Bangumi详情 */
export async function season(
    id: SeasonId | epId,
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/pgc/view/web/season');
    const searchParams = new URLSearchParams(<any>id);
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: ISeason }>>response.json();
}

interface SeasonId {
    season_id: number | bigint | string;
}

interface epId {
    ep_id: number | bigint | string;
}

interface ISeason { }