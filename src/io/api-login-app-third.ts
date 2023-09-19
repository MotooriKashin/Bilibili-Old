import { jsonCheck } from "./api";
import { ApiSign } from "./api-sign";
import { URLS } from "./urls";

export class ApiLoginAppThird extends ApiSign {
    constructor(private api: string) {
        super(URLS.LOGIN_APP_THIRD, '27eb53fc9058f8c3');
        this.api = encodeURIComponent(api);
    }
    async getData() {
        const response = await fetch(this.sign({ api: this.api }, this.api), { credentials: 'include' });
        const json = await response.json();
        return <ILoginAppThirdResponse>jsonCheck(json).data;
    }
}

interface ILoginAppThirdResponse {
    api_host: string;
    confirm_uri: string;
    direct_login: boolean;
    has_login: number;
    user_info: { face: string; mid: number; uname: string; };
}