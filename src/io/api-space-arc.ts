import { objUrl } from "../utils/format/url";
import { jsonCheck } from "./api";
import { URLS } from "./urls";

export async function apiSpaceArc(mid: number) {
    const response = await fetch(objUrl(URLS.SPACE_ARC, {
        mid,
        ps: 30,
        tid: 0,
        pn: 1,
        order: 'pubdate',
        order_avoided: true
    }), { credentials: 'include' });
    const json = await response.json();
    return <IApiSpaceArc>jsonCheck(json).data.list.vlist;
}

interface IApiSpaceArc {
    aid: number;
    attribute: number;
    author: string;
    bvid: string;
    comment: number;
    copyright: string;
    created: number;
    description: string;
    hide_click: boolean;
    is_avoided: number;
    is_live_playback: number;
    is_pay: number;
    is_steins_gate: number;
    is_union_video: number;
    length: string;
    meta: unknown;
    mid: number;
    pic: string;
    play: number;
    review: number;
    subtitle: string;
    title: string;
    typeid: number;
    video_review: number;
}