import { objUrl } from "../utils/format/url";
import { IAidDatail, jsonCheck } from "./api";
import { URLS } from "./urls";

export async function apiXView(aid: number | string) {
    const response = await fetch(objUrl(URLS.X_VIEW, { aid }));
    const json = await response.json();
    return <IAidDatail>jsonCheck(json).data;
}