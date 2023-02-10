import { ApiSign } from "./api";
import { IPlayurlDurl } from "./api-playurl";
import { fnval, fnver } from "./fnval";
import { URLS } from "./urls";

interface IApiPlayurlInterface {
    otype?: string;
    quality?: number;
    type?: string;
    cid: number;
}
export class ApiPlayurlInterface extends ApiSign {
    constructor(protected data: IApiPlayurlInterface, pgc = false) {
        super(pgc ? URLS.PLAYURL_BANGUMI : URLS.PLAYURL_INTERFACE, 'YvirImLGlLANCLvM');
        this.data = Object.assign({
            otype: 'json',
            qn: data.quality,
            type: '',
            fnver,
            fnval
        }, data, pgc ? { module: "bangumi", season_type: 1 } : {});
    }
    async getData() {
        const response = await fetch(this.sign(), { credentials: 'include' });
        return <IPlayurlDurl>await response.json();
    }
}