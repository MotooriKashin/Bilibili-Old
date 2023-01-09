import { objUrl } from "../utils/format/url";
import { IApiData, IOwner, IStat, jsonCheck } from "./api";
import { URLS } from "./urls";

interface IApiIndexTopRcmdData extends IApiData {
    fresh_type?: number;
}
interface IApiIndexTopRcmdResponse {
    av_feature: unknown;
    business_info: unknown;
    bvid: string;
    cid: number;
    duration: number;
    goto: string;
    id: number;
    is_followed: number;
    is_stock: number;
    ogv_info: unknown;
    owner: IOwner;
    pic: string;
    pos: number;
    pubdate: number;
    rcmd_reason: unknown;
    room_info: unknown;
    show_info: number;
    stat: IStat;
    title: string;
    track_id: string;
    uri: string;
    author: IApiIndexTopRcmdResponse['owner']['name'];
    play: IApiIndexTopRcmdResponse['stat']['view'];
    aid: IApiIndexTopRcmdResponse['id'];
}
export async function apiIndexTopRcmd(data?: IApiIndexTopRcmdData) {
    const response = await fetch(objUrl(URLS.INDEX_TOP_RCMD, {
        fresh_type: data?.fresh_type || 3
    }), {
        credentials: data?.credentials || 'include'
    });
    const json = await response.json();
    return <IApiIndexTopRcmdResponse[]>jsonCheck(json).data.item.map((d: IApiIndexTopRcmdResponse) => {
        d.author = d.owner.name;
        d.play = d.stat.view;
        d.aid = d.id;
        return d;
    });
}