import { IPlayurlDurl } from "./api-playurl";
import { ApiSign } from "./api-sign";
import { qn } from "./fnval";
import { URLS } from "./urls";

export class ApiPlayurlProj extends ApiSign {
    constructor(protected data: IApiPlayurlProj, pgc = false) {
        super(pgc ? URLS.PGC_PLAYURL_PROJ : URLS.PLAYURL_PROJ, 'bb3101000e232e27');
        this.data = Object.assign({
            build: "2040100",
            device: "android",
            mobi_app: "android_i",
            otype: "json",
            platform: "android_i",
            qn
        }, data);
        pgc && (this.data.module = "bangumi");
    }
    async getData() {
        const response = await fetch(this.sign().toJSON());
        return <IPlayurlDurl>await response.json();
    }
}

interface IApiPlayurlProj {
    access_key?: string;
    build?: string;
    device?: string;
    expire?: string;
    mobi_app?: string;
    module?: string;
    otype?: string;
    platform?: string;
    qn?: number;
    cid: number;
}