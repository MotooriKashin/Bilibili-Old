import { objUrl } from "../utils/format/url";
import { IAidPage } from "./api";
import { URLS } from "./urls";

export interface IApiViewResponse {
    aid: number;
    author: string;
    coins: number;
    created: number;
    created_at: string;
    description: string;
    favorites: number;
    id: number;
    lastupdate: string;
    lastupdatets: number;
    list: IAidPage[];
    mid: number;
    pic: string;
    play: number
    review: number;
    tag: string;
    tid: number;
    title: string;
    typename: string;
    ver: number;
    video_review: number;
}
export async function apiView(aid: number | string) {
    const response = await fetch(objUrl(URLS.VIEW, {
        appkey: '8e9fc618fbd41e28',
        id: aid,
        type: 'json'
    }));
    return <IApiViewResponse>await response.json();
}