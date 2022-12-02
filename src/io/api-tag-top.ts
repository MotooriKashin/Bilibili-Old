import { objUrl } from "../utils/format/url";
import { IAidDatail, jsonCheck } from "./api";
import { URLS } from "./urls";

export function apiTagTop(tid: number) {
    return new Promise((resolve: (value: IAidDatail[]) => void, reject) => {
        fetch(objUrl(URLS.TAG_TOP, { tid }))
            .then(d => d.json())
            .then(d => resolve(jsonCheck(d).data))
            .catch(e => reject(e));
    });
}