import { sign } from "../../../../../sign";

/** 获取Bangumi详情 */
export async function season(
    id: SeasonId | epId,
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/pgc/view/v2/app/season');
    const searchParams = new URLSearchParams(<any>id);
    url.search = searchParams.toString();
    const response = await fetch(sign(url, '1d8b6e7d45233436'), { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: ISeason }>>response.json();
}

interface SeasonId {
    season_id: number | bigint | string;
}

interface epId {
    ep_id: number | bigint | string;
}

interface ISeason {
    modules: (Positive | Section)[];
    user_status?: {
        progress?: { last_ep_id: number };
    };
    type: number;
    season_id: number;
}

interface Positive {
    style: 'positive';
    data: {
        episodes: Episode[];
    }
}

interface Section {
    style: 'section';
    data: {
        episodes: Episode[];
    }
}

interface Episode {
    id: number;
    aid: number;
    cid: number;
}