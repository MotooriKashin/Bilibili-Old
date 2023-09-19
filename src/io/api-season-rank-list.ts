import { objUrl } from "../utils/format/url";
import { IStat, jsonCheck } from "./api";
import { URLS } from "./urls";

export async function apiSeasonRankList(data: IApiSeasonRankListDate) {
    const response = await fetch(objUrl(URLS.SEASON_RANK_LIST, {
        season_type: data.season_type,
        day: 3
    }));
    const json = await response.json();
    return <IApiSeasonRankListResponse[]>jsonCheck(json).data.list;
}

interface IApiSeasonRankListDate {
    season_type: number;
    day?: number;
}
interface IApiSeasonRankListResponse {
    badge: string;
    badge_info: { bg_color: string, bg_color_night: string, text: string }
    badge_type: number;
    cover: string;
    desc: string;
    new_ep: { cover: string, index_show: string }
    rank: number;
    rating: string;
    season_id: number;
    ss_horizontal_cover: string;
    stat: IStat;
    title: string;
    url: string;
}