import { objUrl } from "../utils/format/url";
import { jsonCheck } from "./api";
import { URLS } from "./urls";

export async function apiSearchSquare(limit = 10) {
    const response = await fetch(objUrl(URLS.SEARCH_SQUARE, { limit }));
    const json = await response.json();
    return <ISearchSquare[]>jsonCheck(json).data.trending.list;
}

interface ISearchSquare {
    goto: string;
    icon: string;
    keyword: string;
    show_name: string;
    uri: string;
}