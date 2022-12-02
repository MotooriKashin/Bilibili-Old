import { objUrl } from "../utils/format/url";
import { IPlayurlDash, IPlayurlDurl } from "./api-playurl";

interface IBiliplusPlayurl {
    module: 'movie' | 'bangumi' | 'pgc';
}
export class apiBiliplusPlayurl {
    protected fetch: Promise<Response>;
    constructor(data: IBiliplusPlayurl) {
        this.fetch = fetch(objUrl('//www.biliplus.com/BPplayurl.php', <any>data));
    }
    getData() {
        return new Promise((resolve: (value: IPlayurlDash | IPlayurlDurl) => void, reject) => {
            this.fetch.then(d => d.json())
                .then(d => resolve(d))
                .catch(e => reject(e));
        });
    }
}