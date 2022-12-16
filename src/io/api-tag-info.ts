import { objUrl } from "../utils/format/url";
import { jsonCheck } from "./api";
import { URLS } from "./urls";

interface IApiTagInfoResponse {
    attribute: number;
    content: string;
    count: { view: number; use: number; atten: number; }
    cover: string;
    ctime: number;
    extra_attr: number;
    hated: number;
    hates: number;
    head_cover: string;
    is_atten: number;
    liked: number;
    likes: number;
    short_content: string;
    state: number;
    tag_id: number;
    tag_name: string;
    type: number;
}
export async function apiTagInfo(tag_name: string) {
    const response = await fetch(objUrl(URLS.TAG_INFO, { tag_name }));
    const json = await response.json();
    return <IApiTagInfoResponse>jsonCheck(json).data;
}