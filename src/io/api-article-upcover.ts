import { jsonCheck } from "./api";
import { URLS } from "./urls";

export async function apiArticleUpcover(file: File, bili_jct: string) {
    const formDate = new FormData();
    formDate.append('binary', file);
    formDate.append('csrf', bili_jct);
    const response = await fetch(URLS.ARTICLE_UPCOVER, {
        method: 'POST',
        body: formDate,
        credentials: 'include',
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    const json = await response.json();
    return <IApiArticleUpcover>jsonCheck(json).data;
}

interface IApiArticleUpcover {
    url: string;
}