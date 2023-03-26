import { jsonCheck } from "./api";
import { URLS } from "./urls";

export async function apiDynamicUploadBfs(file: File, bili_jct: string) {
    const formDate = new FormData();
    formDate.append("biz", "dyn");
    formDate.append("file_up", file);
    formDate.append("category", "daily");
    formDate.append("csrf", bili_jct);
    const response = await fetch(URLS.DYNAMIC_UPLOAD_BFS, {
        method: 'POST',
        body: formDate,
        credentials: 'include'
    });
    const json = await response.json();
    return <IApiDynamicUploadBfs>jsonCheck(json).data;
}

interface IApiDynamicUploadBfs {
    image_url: string;
    image_width: number;
    image_height: number;
}