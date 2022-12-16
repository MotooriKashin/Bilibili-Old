import { objUrl } from "../utils/format/url";
import { IAidPage, jsonCheck } from "./api";
import { URLS } from "./urls";

export async function apiPlayerPagelist(aid: string | number) {
    const response = await fetch(objUrl(URLS.PAGE_LIST, { aid }));
    const json = await response.json();
    return <IAidPage[]>jsonCheck(json).data;
}