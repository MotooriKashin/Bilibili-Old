import { objUrl } from "../utils/format/url";
import { IAidDatail, jsonCheck } from "./api";
import { URLS } from "./urls";

export async function apiNewlist(rid: number, ps = 30, pn = 1, type = 0) {
    const response = await fetch(objUrl(URLS.NEWLIST, { rid, type, pn, ps }));
    const json = await response.json();
    return <IAidDatail[]>jsonCheck(json).data.archives;
}