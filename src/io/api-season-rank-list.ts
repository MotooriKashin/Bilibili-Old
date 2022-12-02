import { objUrl } from "../utils/format/url";
import { IStat, jsonCheck } from "./api";
import { URLS } from "./urls";

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
export function apiSeasonRankList(data: IApiSeasonRankListDate) {
    return new Promise((resolve: (value: IApiSeasonRankListResponse[]) => void, reject) => {
        fetch(objUrl(URLS.SEASON_RANK_LIST, {
            season_type: data.season_type,
            day: 3
        }))
            .then(d => d.json())
            .then(d => resolve(jsonCheck(d).data.list))
            .catch(e => reject(e));
    });
}