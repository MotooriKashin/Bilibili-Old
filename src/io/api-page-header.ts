import { objUrl } from "../utils/format/url";
import { jsonCheck } from "./api";
import { URLS } from "./urls";

export async function apiPageHeader(data: IApiPageHeaderDate) {
    const response = await fetch(objUrl(URLS.PAGE_HEADER, <any>data));
    const json = await response.json();
    return <IApiPageHeaderResponse>jsonCheck(json).data;
}

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