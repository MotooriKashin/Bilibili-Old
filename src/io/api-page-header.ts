import { objUrl } from "../utils/format/url";
import { jsonCheck } from "./api";
import { URLS } from "./urls";

interface IApiPageHeaderDate {
    resource_id: number;
}
interface IApiPageHeaderResponse {
    is_split_layer: number;
    litpic: string;
    name: string;
    pic: string;
    request_id: string;
    split_layer: string;
    url: string;
}
export function apiPageHeader(data: IApiPageHeaderDate) {
    return new Promise((resolve: (value: IApiPageHeaderResponse) => void, reject) => {
        fetch(objUrl(URLS.PAGE_HEADER, <any>data))
            .then(d => d.json())
            .then(d => resolve(jsonCheck(d).data))
            .catch(e => reject(e));
    });
}