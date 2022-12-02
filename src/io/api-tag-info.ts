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
export function apiTagInfo(tag_name: string) {
    return new Promise((resolve: (value: IApiTagInfoResponse) => void, reject) => {
        fetch(objUrl(URLS.TAG_INFO, { tag_name }))
            .then(d => d.json())
            .then(d => resolve(jsonCheck(d).data))
            .catch(e => reject(e));
    });
}