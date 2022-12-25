import { objUrl } from "../utils/format/url";
import { IStat, jsonCheck } from "./api";
import { URLS } from "./urls";

export async function apiStat(aid: number) {
    const response = await fetch(objUrl(URLS.STAT, { aid }));
    const json = await response.json();
    return <IStat>jsonCheck(json).data
}