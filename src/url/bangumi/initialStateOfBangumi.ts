interface modules {
    /** Bangumi页`__INITIAL_STATE__`重构工具 */
    readonly "initialStateOfBangumi.js": string;
}
namespace API {
    export class InitialStateOfBangumi {
        __INITIAL_STATE__ = {
            activity: {},
            app: false,
            area: 0,
            canReview: true,
            epId: 0,
            epInfo: {},
            epList: <any[]>[],
            epStat: { isPay: true, isVip: false, payPack: 0, status: 1, vipNeedPay: false },
            isPlayerTrigger: false,
            loginInfo: {},
            mdId: 0,
            mediaInfo: {
                actors: "",
                alias: "",
                areas: [],
                bkg_cover: "",
                cover: "",
                evaluate: "",
                is_paster_ads: 0,
                jp_title: "",
                link: "",
                media_id: 0,
                mode: 1,
                paster_text: "",
                season_id: 0,
                season_status: 0,
                season_title: "",
                season_type: 1,
                square_cover: "",
                staff: "",
                style: [],
                title: "",
                total_ep: 0
            },
            mediaRating: {},
            miniOn: 1,
            newestEp: {},
            paster: {},
            payMent: {},
            payPack: {},
            playerRecomList: [],
            pubInfo: { is_started: 1 },
            recomList: [],
            rightsInfo: {},
            seasonFollowed: false,
            seasonList: [],
            seasonStat: {},
            special: false,
            spending: 0,
            sponsorTotal: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } },
            sponsorTotalCount: 0,
            sponsorWeek: { code: 0, result: { ep_bp: 0, list: [], mine: {}, users: 0 } },
            ssId: 0,
            ssStat: {},
            upInfo: {},
            userCoined: 1,
            userLongReview: {},
            userScore: -1,
            userShortReview: {},
            userStat: {},
            ver: {}
        };
        epId: number;
        data: any;
        constructor(data: any, epId: number) {
            this.epId = Number(epId) || NaN;
            this.data = jsonCheck(data).result;
            vipCid = [];
        }
        season() {
            const ids = this.data.episodes.reduce((s: number[], d: { [name: string]: any }) => {
                s.push(d.ep_id);
                (d.badge == "会员" || d.badge_type) && vipCid.push(d.cid);
                return s;
            }, []);
            this.__INITIAL_STATE__.activity = this.data.activity || {};
            this.__INITIAL_STATE__.epId = this.epId || ids[0];
            this.__INITIAL_STATE__.epInfo = this.data.episodes[ids.indexOf(this.epId)] || this.data.episodes[0];
            this.__INITIAL_STATE__.epList = this.data.episodes;
            this.__INITIAL_STATE__.mdId = this.data.media_id;
            this.__INITIAL_STATE__.mediaInfo.actors = this.data.actors;
            this.__INITIAL_STATE__.mediaInfo.alias = this.data.alias;
            this.__INITIAL_STATE__.mediaInfo.areas = this.data.areas;
            this.__INITIAL_STATE__.mediaInfo.bkg_cover = this.data.bkg_cover;
            this.__INITIAL_STATE__.mediaInfo.cover = this.data.cover;
            this.__INITIAL_STATE__.mediaInfo.evaluate = this.data.evaluate;
            this.__INITIAL_STATE__.mediaInfo.is_paster_ads = this.data.is_paster_ads;
            this.__INITIAL_STATE__.mediaInfo.jp_title = this.data.jp_title;
            this.__INITIAL_STATE__.mediaInfo.link = this.data.link;
            this.__INITIAL_STATE__.mediaInfo.media_id = this.data.media_id;
            this.__INITIAL_STATE__.mediaInfo.mode = this.data.mode;
            this.__INITIAL_STATE__.mediaInfo.paster_text = this.data.paster_text;
            this.__INITIAL_STATE__.mediaInfo.season_id = this.data.season_id;
            this.__INITIAL_STATE__.mediaInfo.season_status = this.data.season_status;
            this.__INITIAL_STATE__.mediaInfo.season_title = this.data.season_title;
            this.__INITIAL_STATE__.mediaInfo.season_type = this.data.season_type;
            this.__INITIAL_STATE__.mediaInfo.square_cover = this.data.square_cover;
            this.__INITIAL_STATE__.mediaInfo.staff = this.data.staff;
            this.__INITIAL_STATE__.mediaInfo.style = this.data.style;
            this.__INITIAL_STATE__.mediaInfo.title = this.data.title;
            this.__INITIAL_STATE__.mediaInfo.total_ep = this.data.total_ep;
            this.__INITIAL_STATE__.mediaRating = this.data.rating || {};
            this.__INITIAL_STATE__.newestEp = this.data.newest_ep;
            this.__INITIAL_STATE__.payMent = this.data.payment || {};
            this.__INITIAL_STATE__.pubInfo = this.data.publish;
            this.__INITIAL_STATE__.rightsInfo = this.data.rights;
            this.__INITIAL_STATE__.seasonList = this.data.seasons || [];
            this.__INITIAL_STATE__.seasonStat = this.data.stat;
            this.__INITIAL_STATE__.special = this.data.bkg_cover ? true : false;
            this.__INITIAL_STATE__.ssId = this.data.season_id;
            this.__INITIAL_STATE__.upInfo = this.data.up_info;
            return this.__INITIAL_STATE__;
        }
        global() {
            const ids: number[] = [], epList: { [name: string]: any }[] = [];
            this.data.modules.forEach((d: any) => {
                d.data.episodes.forEach((d: any) => {
                    d.ctime = "";
                    d.duration = 1;
                    d.ep_id = d.id;
                    d.episode_status = d.status;
                    d.index = d.title;
                    d.index_title = d.long_title;
                    d.mid = 2;
                    d.page = 1;
                    d.premiere = false;
                    d.pub_real_time = "";
                    d.section_id = 0;
                    d.section_type = 0;
                    d.vid = "";
                    epList.push(d);
                    ids.push(d.id);
                })
            });
            this.__INITIAL_STATE__.activity = this.data.activity_dialog || {};
            this.__INITIAL_STATE__.epId = this.epId || ids[0];
            this.__INITIAL_STATE__.epInfo = this.epId ? epList[ids.indexOf(this.epId)] : epList[0];
            this.__INITIAL_STATE__.epList = epList;
            this.__INITIAL_STATE__.mediaInfo.actors = this.data.actor.info;
            this.__INITIAL_STATE__.mediaInfo.alias = this.data.alias;
            this.__INITIAL_STATE__.mediaInfo.areas = this.data.areas;
            this.__INITIAL_STATE__.mediaInfo.cover = this.data.cover;
            this.__INITIAL_STATE__.mediaInfo.evaluate = this.data.evaluate;
            this.__INITIAL_STATE__.mediaInfo.link = this.data.link;
            this.__INITIAL_STATE__.mediaInfo.mode = this.data.mode;
            this.__INITIAL_STATE__.mediaInfo.season_id = this.data.season_id;
            this.__INITIAL_STATE__.mediaInfo.season_status = this.data.season_status;
            this.__INITIAL_STATE__.mediaInfo.season_title = this.data.season_title;
            this.__INITIAL_STATE__.mediaInfo.staff = this.data.staff;
            this.__INITIAL_STATE__.mediaInfo.style = this.data.styles;
            this.__INITIAL_STATE__.mediaInfo.title = this.data.title;
            this.__INITIAL_STATE__.mediaInfo.total_ep = ids.length;
            this.__INITIAL_STATE__.newestEp = this.data.new_ep;
            this.__INITIAL_STATE__.pubInfo = this.data.publish;
            this.__INITIAL_STATE__.pubInfo.is_started = 1;
            this.__INITIAL_STATE__.rightsInfo = this.data.rights;
            this.__INITIAL_STATE__.seasonStat = this.data.stat;
            this.__INITIAL_STATE__.ssId = this.data.season_id;
            return this.__INITIAL_STATE__;
        }
    }
}
declare namespace API {
    /** 记录需要vip的bangumi回目对应的cid */
    let vipCid: number[];
}