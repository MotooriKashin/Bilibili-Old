import { objUrl } from "../utils/format/url";
import { jsonCheck } from "./api";
import { IBangumiEpisode } from "./bangumi-season";
import { URLS } from "./urls";

interface IApiEpisode {
    aid: number;
    badge: string;
    badge_info: { bg_color: string; bg_color_night: string; text: string; };
    badge_type: number;
    cid: number;
    cover: string;
    from: string;
    id: number;
    is_premiere: number;
    long_title: string;
    share_url: string;
    status: number;
    title: string;
    vid: string;
}
interface ISeasonSectionResponse {
    main_section: {
        episodes: IApiEpisode[];
        id: number;
        title: string;
        type: number;
    };
    section: ISeasonSectionResponse['main_section'][];
}
export class ApiSeasonSection {
    protected fetch: Promise<Response>;
    constructor(season_id: number) {
        this.fetch = fetch(objUrl(URLS.SEASON_STATUS, { season_id }), { credentials: 'include' })
    }
    getDate() {
        return new Promise((resolve: (value: ISeasonSectionResponse) => void, reject) => {
            this.fetch
                .then(d => d.json())
                .then(d => resolve(jsonCheck(d).result))
                .catch(e => reject(e));
        });
    }
    toEpisodes() {
        return new Promise((resolve: (value: IBangumiEpisode[]) => void, reject) => {
            this.fetch
                .then(d => d.json())
                .then(d => {
                    const res = (<ISeasonSectionResponse>jsonCheck(d).result);
                    resolve(
                        <any>res.main_section.episodes
                            .concat(...res.section.map(d => d.episodes))
                            .map((d: any) => {
                                d.ep_id = d.id;
                                d.episode_status = d.status;
                                d.index = d.title;
                                d.index_title = d.long_title;
                                d.premiere = Boolean(d.is_premiere);
                                return d;
                            })
                    )
                })
                .catch(e => reject(e));
        });
    }
}