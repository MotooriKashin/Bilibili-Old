import html from './index.html' with {type: 'text'};
import style from './index.css' with {type: 'css'};
import { tidNameLink } from './tid';
import { durationFormat, epochFormat } from '../../utils/time';
import { unitFormat } from '../../utils/number';
import { https, string2SuperLink } from '../../utils/url';
import { detail, type IDetail, type IRelated, type ITag } from '../../io/api.bilibili.com/x/web-interface/view/detail';
import { Medal } from '../widget/dialog';
import { view as plus, type IView as IPlus } from '../../io/www.biliplus.com/api/view';
import { view_all as plus_all, type IViewAll as IPlusAll } from '../../io/www.biliplus.com/api/view_all';
import { get_info as jjd, type IGetInfo as IJiJiDown } from '../../io/www.jijidown.com/get_info';
import { relation, type IRelation } from '../../io/api.bilibili.com/x/web-interface/archive/relation';
import { debug, error, log } from '../../utils/debug';
import { show, type IShow } from '../../io/api.bilibili.com/x/web-interface/elec/show';
import { subject, type ISubject } from '../../io/www.bilibili.com/activity/subject';
import { modify, RELATION_MODIFY } from '../../io/api.bilibili.com/x/relation/modify';
import { like } from '../../io/api.bilibili.com/x/web-interface/archive/like';
import { add as addCoin } from '../../io/api.bilibili.com/x/web-interface/coin/add';
import { folder, type IFolder } from '../../io/api.bilibili.com/x/v2/fav/folder';
import { add as addFav } from '../../io/api.bilibili.com/x/v2/fav/video/add';
import { del as delFav } from '../../io/api.bilibili.com/x/v2/fav/video/del';
import { del as delToview } from '../../io/api.bilibili.com/x/v2/history/toview/del';
import { add as addToView } from '../../io/api.bilibili.com/x/v2/history/toview/add';
import { bv2av } from '../../utils/abv';
import { Comment } from '../widget/comment';
import { Player } from '../widget/player';

export class Av extends HTMLHtmlElement {
    static get is() {
        return 'av-html';
    }
    static {
        document.adoptedStyleSheets.push(style);
    }
    #player: Player;
    #comment: Comment;
    #implement = new AbortController();
    #abortController = new AbortController();
    #__bofqi: HTMLDivElement;
    #coinPopover = document.createElement('form');
    #copyright = 0;
    #favPopover: HTMLFormElement;
    #fids = new Set<number>();
    #aid = 0n;
    get aid() {
        return this.#aid;
    }
    set aid(v) {
        if (v === this.#aid) return;
        this.#aid = v;
        this.identify();
        // 分发aid到各组件
        this.#comment.oid = this.#player.aid = v;
        this.dispatchEvent(new Event('--detail'))
    }
    #cid = 0n;
    get cid() {
        return this.#cid;
    }
    set cid(v) {
        if (v === this.#cid) return;
        document.body.dataset['cid'] = this.#cid = <any>v;
        // 重置组件状态
        this.#player.identify();
        // 分发cid到各组件
        this.#player.cid = v;
    }
    override set title(v: string) {
        const h1 = document.querySelector<HTMLHeadingElement>('.video-info-m>h1');
        if (!h1) return;

        if (v) {
            document.title = v;

            h1.textContent = h1.title = v;
            return;
        }

        document.title = '哔哩哔哩-bilibili';

        h1.textContent = h1.title = '';
    }
    set tid(v: number) {
        const tid = <HTMLSpanElement>document.querySelector('.tm-info')?.firstElementChild;
        if (!tid) return;

        if (v) {
            const tids = tidNameLink(v);
            if (tids) {
                const a = document.createElement('a');
                a.href = '//www.bilibili.com';
                a.text = '主页';
                tid.replaceChildren(a);
                tids.forEach(([name, href]) => {
                    const d = <HTMLAnchorElement>a.cloneNode(true)
                    d.href = href;
                    d.text = name;
                    tid.append(d);
                });
                return;
            }
        }

        tid.replaceChildren();
    }
    set pubdate(v: number | string) {
        const pubdate = document.querySelector<HTMLTimeElement>('.tm-info>time');
        if (!pubdate) return;

        if (v) {
            pubdate.textContent = pubdate.dateTime = typeof v === 'string' ? v : epochFormat(v * 1e3);
            return;
        }

        pubdate.replaceChildren();
        pubdate.dateTime = '';
    }
    set view(v: number | void) {
        const view = <HTMLSpanElement>document.querySelector('.number>.v')?.firstElementChild;
        if (!view) return;

        if (v != undefined) {
            view.dataset['value'] = unitFormat(view.title = <any>v);
            return;
        }

        delete view.dataset['value'];
        view.title = '';
    }
    set danmaku(v: number | void) {
        const danmaku = <HTMLSpanElement>document.querySelector('.number>.v')?.children[1];
        if (!danmaku) return;

        if (v != undefined) {
            danmaku.dataset['value'] = unitFormat(danmaku.title = <any>v);
            return;
        }

        delete danmaku.dataset['value'];
        danmaku.title = '';
    }
    set his_rank(v: number | void) {
        const his_rank = <HTMLSpanElement>document.querySelector('.number>.v')?.lastElementChild;
        if (!his_rank) return;

        if (v) {
            his_rank.dataset['value'] = <any>v;
            return;
        }

        delete his_rank.dataset['value'];
    }
    #like = 0;
    set like(v: number | void) {
        const like = <HTMLSpanElement>document.querySelector('.number>.u')?.firstElementChild;
        if (!like) return;

        if (v != undefined) {
            this.#like = v;
            like.dataset['value'] = unitFormat(like.title = <any>v);
            return;
        }

        delete like.dataset['value'];
        like.title = '';
        like.classList.remove('d');
        this.#like = 0;
    }
    set isLike(v: boolean) {
        const like = <HTMLSpanElement>document.querySelector('.number>.u')?.firstElementChild;
        if (!like) return;
        like.classList.toggle('d', v);
    }
    #coin = 0;
    set coin(v: number | void) {
        this.#coin = v ?? 0;
        (async () => {
            const coin = <HTMLSpanElement>document.querySelector('.number>.u')?.children[1];
            if (!coin) return;

            if (v != undefined) {
                coin.dataset['value'] = unitFormat(coin.title = <any>v);
                return;
            }

            delete coin.dataset['value'];
            coin.title = '';
            coin.classList.remove('d');
            this.#coinPopover.replaceChildren();
            this.#coinPopover.remove();
        })();
        const coin = <HTMLSpanElement>document.querySelector('.coin-box')?.firstElementChild;
        if (!coin) return;

        if (v != undefined) {
            coin.dataset['value'] = unitFormat(coin.title = <any>v);
            return;
        }

        delete coin.dataset['value'];
        coin.title = '';
        coin.parentElement?.classList.remove('d');
    }
    set isCoin(v: number) {
        (async () => {
            const coin = <HTMLSpanElement>document.querySelector('.number>.u')?.children[1];
            if (!coin) return;

            coin.classList.toggle('d', Boolean(v));
            const i = 3 - this.#copyright - v
            if (i > 0) {
                this.#coinPopover.innerHTML = `<button class="hide" command="hide-popover" commandfor="coin-operated-m" type="button"></button>
<div class="coin-title">给UP主投上 <span></span> 枚硬币</div>
<div class="mc">
    <label><input name="coin" type="radio" value="1"${i === 1 ? ' checked' : ''}></label>${i > 1 ? '<label><input name="coin" type="radio" value="2" checked></label>' : ''}
</div>
<button class="submit">确定</button>`;
                coin.insertAdjacentElement('afterend', this.#coinPopover);
            } else {
                this.#coinPopover.replaceChildren();
                this.#coinPopover.remove();
            }
        })();
        const coin = <HTMLSpanElement>document.querySelector('.coin-box')?.firstElementChild;
        if (!coin) return;

        coin.parentElement?.classList.toggle('d', Boolean(v));
    }
    set favorite(v: number | void) {
        (async () => {
            const favorite = <HTMLSpanElement>document.querySelector('.number>.u>.fav');
            if (!favorite) return;

            if (v != undefined) {
                favorite.dataset['value'] = unitFormat(favorite.title = <any>v);
                return;
            }

            delete favorite.dataset['value'];
            favorite.title = '';
            favorite.classList.remove('d');
        })();
        const favorite = <HTMLSpanElement>document.querySelector('.fav-box')?.firstElementChild;
        if (!favorite) return;

        if (v != undefined) {
            favorite.dataset['value'] = unitFormat(favorite.title = <any>v);
            return;
        }

        delete favorite.dataset['value'];
        favorite.title = '';
        favorite.parentElement?.classList.remove('d');
    }
    set isFavorite(v: boolean) {
        (async () => {
            const favorite = <HTMLSpanElement>document.querySelector('.number>.u>.fav');
            if (!favorite) return;

            favorite.classList.toggle('d', v);
        })();
        const favorite = <HTMLSpanElement>document.querySelector('.fav-box')?.firstElementChild;
        if (!favorite) return;

        favorite.parentElement?.classList.toggle('d', v);
    }
    set share(v: number | void) {
        const share = document.querySelector<HTMLDivElement>('.share-box>header');
        if (!share) return;

        if (v) {
            share.dataset['value'] = unitFormat(v);
            return;
        }

        delete share.dataset['value'];
    }
    set face(v: string) {
        const face = document.querySelector<HTMLImageElement>('.u-face>img');
        if (!face) return;

        if (v) {
            face.src = https(v);
            return;
        }

        face.src = '//static.hdslb.com/images/akari.jpg';
    }
    set name(v: string) {
        (async () => {
            const name = document.querySelector<HTMLAnchorElement>('.user>.name');
            if (!name) return;

            if (v) {
                name.text = v;
                return;
            }

            name.text = '';
        })();

        const name = <HTMLAnchorElement>document.querySelector('.elecrank-header')?.firstElementChild;
        if (!name) return;
        name.text = v;
    }
    #mid = 0;
    set mid(v: number) {
        this.#mid = v;
        (async () => {
            const mid = document.querySelector<HTMLAnchorElement>('.u-face');
            if (!mid) return;

            if (v) {

                mid.href = `//space.bilibili.com/${v}`;
                return;
            }

            mid.removeAttribute('href');
        })();

        (async () => {
            const mid = document.querySelector<HTMLAnchorElement>('.user>.name');
            if (!mid) return;

            if (v) {

                mid.href = `//space.bilibili.com/${v}`;
                return;
            }

            mid.removeAttribute('href');
        })();

        (async () => {
            const mid = document.querySelector<HTMLAnchorElement>('.user>.message');
            if (!mid) return;

            if (v) {

                mid.href = `//message.bilibili.com/#whisper/mid${v}`;
                return;
            }

            mid.removeAttribute('href');
        })();

        (async () => {
            if (!v) {
                const mid = document.querySelector<HTMLDivElement>('.elecrank-wrapper');
                if (!mid) return;
                mid.style.display = 'none';
                delete (<HTMLDivElement>mid.firstElementChild?.lastElementChild)?.dataset['value'];
                mid.lastElementChild?.lastElementChild?.replaceChildren();
                return;
            }
            this.dispatchEvent(new CustomEvent('--show', { detail: v }));
        })();

        const mid = <HTMLAnchorElement>document.querySelector('.elecrank-header')?.firstElementChild;
        if (!mid) return;

        if (v) {
            mid.href = `//space.bilibili.com/${v}`;
            return;
        }

        mid.removeAttribute('href');
    }
    set sign(v: string) {
        const sign = document.querySelector<HTMLDivElement>('.info>.sign');
        if (!sign) return;

        sign.textContent = v;
        if (sign.scrollHeight > sign.clientHeight) {
            sign.insertAdjacentHTML('beforeend', '<button command="--more" commandfor="__bofqi"></button>');
        }
    }
    set archive_count(v: number | void) {
        const archive_count = <HTMLSpanElement>document.querySelector('.info>.number')?.firstElementChild;
        if (!archive_count) return;

        if (v != undefined) {
            archive_count.dataset['value'] = unitFormat(v);
            archive_count.title = `投稿数${v}`;
            return;
        }

        delete archive_count.dataset['value'];
        archive_count.title = '';
    }
    set follower(v: number | void) {
        const follower = <HTMLSpanElement>document.querySelector('.info>.number')?.lastElementChild;
        if (!follower) return;

        if (v != undefined) {
            follower.dataset['value'] = unitFormat(v);
            follower.title = `粉丝数${v}`;
            return;
        }

        delete follower.dataset['value'];
        follower.title = '';
    }
    set mission_id(v: number) {
        const mission_id = document.querySelector<HTMLDivElement>('.l-wrapper>.s_tag');
        if (!mission_id) return;

        if (v) {
            this.dispatchEvent(new CustomEvent('--subject', { detail: v }))
            return;
        }

        document.querySelector<HTMLDivElement>('.l-wrapper>.activity-m')?.remove();
    }
    set tags(v: ITag[] | void) {
        const tags = document.querySelector<HTMLDivElement>('.tag-area');
        if (!tags) return;

        if (v) {
            const df = document.createDocumentFragment();
            const a = document.createElement('a');
            a.target = '_blank';
            v.forEach(({ tag_name, jump_url }) => {
                a.href = jump_url || `//search.bilibili.com/all?keyword=${tag_name}`;
                a.text = tag_name;
                df.append(a.cloneNode(true));
            });
            tags.replaceChildren(df);
            return;
        }

        tags.replaceChildren();
    }
    set no_reprint(v: number) {
        const no_reprint = document.querySelector<HTMLDivElement>('.reprint');
        if (!no_reprint) return;

        no_reprint.style.display = v ? '' : 'none';
    }
    set desc(v: string | void) {
        const desc = document.querySelector<HTMLPreElement>('.video-desc-m>.info');
        if (!desc) return;

        if (v != undefined) {
            desc.replaceChildren(string2SuperLink(v));
            desc.classList.toggle('d', desc.scrollHeight > desc.clientHeight);
            return;
        }

        desc.replaceChildren();
        desc.classList.remove('d');
    }
    set related(v: IRelated[] | void) {
        const related = document.querySelector<HTMLDivElement>('.video-like-m>.like-list');
        if (!related) return;

        if (v) {
            const fp = document.createDocumentFragment();
            const a = document.createElement('a');
            const br = document.createElement('br');
            a.target = '_blank';
            a.innerHTML = `<div>
    <img fetchpriority="low" loading="lazy">
    <div></div>
</div>
<span></span>`;
            v.forEach(({ aid, title, pic, duration, owner: { name }, stat: { view, danmaku } }) => {
                a.href = `/video/av${aid}/`;
                (<HTMLSpanElement>a.children[1]).textContent = (<HTMLSpanElement>a.children[1]).title = (<HTMLImageElement>a.children[0]!.children[0]).alt = title;
                (<HTMLImageElement>a.children[0]!.children[0]).src = https(pic);
                (<HTMLDivElement>a.children[0]!.children[1]).replaceChildren(document.createTextNode(`UP：${name}`), br.cloneNode(), document.createTextNode(`时长：${durationFormat({ seconds: duration })}`), br.cloneNode(), document.createTextNode(`播放：${unitFormat(view)}`), br.cloneNode(), document.createTextNode(`弹幕：${unitFormat(danmaku)}`));
                fp.append(a.cloneNode(true));
            });
            related.replaceChildren(fp);
            return;
        }

        related.replaceChildren();
    }
    set pages(v: { cid: number; part: string, page: number }[] | void) {
        const pages = document.querySelector<HTMLDivElement>('.multi-page>div');
        if (!pages) return;

        if (v) {
            const df = document.createDocumentFragment();
            const button = document.createElement('button');
            button.command = '--cid';
            button.setAttribute('commandfor', '__bofqi');
            v.forEach(({ cid, part, page }) => {
                button.dataset['cid'] = <any>cid;
                button.dataset['p'] = <any>page;
                button.title = button.textContent = part;
                df.append(button.cloneNode(true));
            });
            pages.replaceChildren(df);
            pages.classList.toggle('d', pages.scrollHeight > pages.clientHeight);
        } else {
            pages.replaceChildren();
            pages.classList.remove('d');
        }
    }
    set isAttention(v: boolean) {
        const attention = <HTMLButtonElement>document.querySelector('.info>.btn')?.firstElementChild;
        if (!attention) return;
        attention.classList.toggle('d', v);
    }
    constructor() {
        super();
        document.documentElement.innerHTML = html;

        import('../widget/header');
        import('../widget/footer');

        this.#__bofqi = document.querySelector('#__bofqi')!;
        this.#favPopover = document.querySelector('#collection-m')!;
        this.#comment = this.querySelector(Comment.is)!;
        this.#player = this.querySelector(Player.is)!;

        this.#coinPopover.id = 'coin-operated-m';
        this.#coinPopover.popover = 'manual';
    }
    connectedCallback() {
        this.#implement.abort();
        this.#implement = new AbortController();

        this.when('--detail').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(() => {
            return new Observable<IDetail>(subscriber => {
                const abortController = new AbortController();
                detail(this.#aid, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message, data }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(data);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (e.name === 'AbortError') return;
                    new Medal(e.message, e.name, { label: '👉第三方存档', callback: () => this.dispatchEvent(new Event('--plus')) }, { label: '取消' });
                });
                return () => abortController.abort();
            });
        }).subscribe(({ View: { title, tid, pubdate, stat: { view, danmaku, his_rank, like, coin, favorite, share }, owner: { face, name, mid }, mission_id, rights: { no_reprint }, desc, cid, pages, copyright }, Card: { card: { sign }, archive_count, follower }, Tags, Related }) => {
            this.title = title;
            this.tid = tid;
            this.pubdate = pubdate;
            this.view = view;
            this.danmaku = danmaku;
            this.his_rank = his_rank;
            this.like = like;
            this.coin = coin;
            this.favorite = favorite;
            this.share = share;
            this.face = face;
            this.name = name;
            this.mid = mid;
            this.sign = sign;
            this.archive_count = archive_count;
            this.follower = follower;
            mission_id && (this.mission_id = mission_id);
            this.tags = Tags;
            this.no_reprint = no_reprint;
            this.desc = desc;
            this.related = Related;
            this.pages = pages;
            this.#copyright = copyright;

            // 提取 cid
            const p = new URLSearchParams(location.search).get('p');
            if (pages?.[0]) {
                if (p) {
                    const i = Number(p) - 1;
                    this.cid = BigInt(pages[i]?.cid || pages[0].cid);
                } else {
                    this.cid = BigInt(pages[0].cid);
                }
            } else if (cid) {
                this.cid = BigInt(cid);
            } else {
                new Medal('CID 丢失！');
            }

            this.dispatchEvent(new Event('--relation'));
        }, { signal: this.#implement.signal });
        this.when('--plus').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(() => {
            return new Observable<IPlus>(subscriber => {
                const abortController = new AbortController();
                plus(this.#aid, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(data => {
                    if (data.code) throw new Error(`${data.code} ${data.message}`);
                    subscriber.next(data);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (e.name === 'AbortError') return;
                    this.dispatchEvent(new Event('--plus-all'))
                });
                return () => abortController.abort();
            });
        }).subscribe(({ v2_app_api, title, description, pic, tid, created, author, mid, play, coins, video_review, favorites, tag, list }) => {
            if (v2_app_api) {
                const { title, tid, ctime, stat: { view, danmaku, coin, favorite }, pic, owner: { name, mid }, desc, tag } = v2_app_api;
                this.title = title;
                this.tid = tid;
                this.pubdate = ctime;
                this.view = view;
                this.danmaku = danmaku;
                this.coin = coin;
                this.favorite = favorite;
                this.face = pic;
                this.name = name;
                this.mid = mid;
                this.tags = tag;
                this.desc = desc;
            } else {
                this.title = title;
                this.desc = description;
                this.pubdate = created;
                this.face = pic;
                this.tid = tid;
                this.name = author;
                this.mid = mid;
                this.view = play;
                this.danmaku = video_review;
                this.coin = coins;
                this.favorite = favorites;
                this.tags = tag.split(',').map(tag_name => ({ tag_name }));
            }
            this.pages = list;

            // 提取 cid
            const p = new URLSearchParams(location.search).get('p');
            if (list[0]) {
                if (p) {
                    const i = Number(p) - 1;
                    this.cid = BigInt(list[i]?.cid || list[0].cid);
                } else {
                    this.cid = BigInt(list[0].cid);
                }
            }

            this.dispatchEvent(new Event('--relation'));
        }, { signal: this.#implement.signal });
        this.when('--plus-all').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(() => {
            return new Observable<IPlusAll>(subscriber => {
                const abortController = new AbortController();
                plus_all(this.#aid, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message, data }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(data);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (e.name === 'AbortError') return;
                    this.dispatchEvent(new Event('--jijidown'));
                });
                return () => abortController.abort();
            });
        }).subscribe(({ info: { title, create, play, video_review, coins, favorites, pic, author, mid, keywords, description }, parts }) => {
            this.title = title;
            this.pubdate = create;
            this.pages = parts;
            this.view = play;
            this.danmaku = video_review;
            this.coin = coins;
            this.favorite = favorites;
            this.face = pic;
            this.name = author;
            this.mid = mid;
            keywords && (this.tags = keywords.split(',').map(tag_name => ({ tag_name })));
            this.desc = description;

            // 提取 cid
            const p = new URLSearchParams(location.search).get('p');
            if (parts[0]) {
                if (p) {
                    const i = Number(p) - 1;
                    this.cid = BigInt(parts[i]?.cid || parts[0].cid);
                } else {
                    this.cid = BigInt(parts[0].cid);
                }
            }

            this.dispatchEvent(new Event('--relation'));
        }, { signal: this.#implement.signal });
        this.when('--jijidown').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(() => {
            return new Observable<IJiJiDown>(subscriber => {
                const abortController = new AbortController();
                jjd(this.#aid, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(data => {
                    if (!data.img) throw new Error(data.title);
                    subscriber.next(data);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (e.name === 'AbortError') return;
                    new Medal(e);
                });
                return () => abortController.abort();
            });
        }).subscribe(({ title, play, coins, favos, up: { avatar, author, id: mid, sign, list }, tags, desc }) => {
            this.title = title;
            this.view = play;
            this.coin = coins;
            this.favorite = favos;
            this.face = avatar;
            this.name = author;
            this.mid = mid;
            this.sign = sign;
            tags && (this.tags = tags.map(tag_name => ({ tag_name })));
            this.desc = desc;
            this.pages = list.map(({ id: cid, title: part }, i) => ({ cid, part, page: i }));

            this.dispatchEvent(new Event('--relation'));
        }, { signal: this.#implement.signal });
        this.when('--relation').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(() => {
            return new Observable<IRelation>(subscriber => {
                const abortController = new AbortController();
                import('../../io/api.bilibili.com/x/web-interface/nav').then(({ data: { isLogin } }) => {
                    if (isLogin) {
                        relation(this.#aid, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message, data }) => {
                            if (code) throw new Error(`${code} ${message}`);
                            subscriber.next(data);
                            subscriber.complete();
                        }).catch(e => {
                            subscriber.complete();
                            if (e.name === 'AbortError') return;
                            error(e)
                        });
                    }
                }).catch(e => {
                    subscriber.complete();
                    error(e);
                });
                return () => abortController.abort();
            });
        }).subscribe(({ like, favorite, coin, attention }) => {
            this.isLike = like;
            this.isFavorite = favorite;
            this.isCoin = coin;
            this.isAttention = attention;
        }, { signal: this.#implement.signal });
        this.when('--show').switchMap(e => {
            return new Observable<CustomEvent<number>>(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<number>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            return new Observable<IShow>(subscriber => {
                const abortController = new AbortController();
                show(detail, this.#aid, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message, data }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(data);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (e.name === 'AbortError') return;
                    log(e.message);
                });
                return () => abortController.abort();
            });
        }).subscribe(({ total_count, list }) => {
            const mid = document.querySelector<HTMLDivElement>('.elecrank-wrapper');
            if (!mid) return;
            (<HTMLDivElement>mid.firstElementChild!.lastElementChild).dataset['value'] = unitFormat(total_count);
            const df = document.createDocumentFragment();
            if (list) {
                list.forEach(({ mid, avatar, uname }) => {
                    const div = document.createElement('div');
                    div.innerHTML = '<a target="_blank"><img fetchpriority="low" loading="lazy"></a>';
                    (<HTMLAnchorElement>div.children[0]).href = `//space.bilibili.com/${mid}`;
                    (<HTMLAnchorElement>div.children[0]).append(document.createTextNode(uname));
                    (<HTMLImageElement>div.children[0]!.children[0]).src = https(avatar);
                    (<HTMLImageElement>div.children[0]!.children[0]).alt = uname;
                    df.append(div);
                });
            }
            mid.lastElementChild?.lastElementChild?.replaceChildren(df);
            mid.style.display = '';
        }, { signal: this.#implement.signal });
        this.when('--subject').switchMap(e => {
            return new Observable<CustomEvent<number>>(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<number>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            return new Observable<ISubject>(subscriber => {
                const abortController = new AbortController();
                subject(detail, this.#aid, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message, data }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(data);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (e.name === 'AbortError') return;
                    error(e);
                });
                return () => abortController.abort();
            });
        }).subscribe(({ name, act_url, cover, etime }) => {
            const div = document.createElement('div');
            div.classList.add('activity-m');
            div.innerHTML = `<div></div><a target="_blank"><img fetchpriority="low" loading="lazy"></a>`;
            document.querySelector<HTMLDivElement>('.l-wrapper>.s_tag')?.insertAdjacentElement('beforebegin', div);
            etime * 1e3 > Temporal.Now.instant().epochMilliseconds && div.children[0]?.classList.add('ing');
            (<HTMLDivElement>div.children[0]).textContent = `[ ${name} ]`;
            (<HTMLAnchorElement>div.children[1]).href = act_url;
            (<HTMLImageElement>div.children[1]!.children[0]).src = https(cover);
        }, { signal: this.#implement.signal });

        this.#__bofqi.when('command').subscribe(({ command, source }) => {
            switch (command) {
                case '--page': {
                    source?.classList.toggle('d');
                    break;
                }
                case '--cid': {
                    const cid = (<HTMLElement>source).dataset['cid'];
                    const p = (<HTMLElement>source).dataset['p'];
                    if (p) {
                        const url = new URL(location.origin + location.pathname);
                        url.searchParams.set('p', p);
                        history.pushState(undefined, '', url);
                        document.body.dataset['p'] = p;
                    }
                    if (cid) {
                        this.cid = BigInt(cid);
                    }
                    break;
                }
                case '--more': {
                    source?.classList.toggle('d');
                    break;
                }
                case '--fav':
                case '--like':
                case '--attention': {
                    this.#__bofqi.dispatchEvent(new CustomEvent(command, { detail: source?.classList.contains('d') }));
                    break;
                }
                case '--seelater': {
                    this.#__bofqi.dispatchEvent(new CustomEvent(command, { detail: source }));
                    break;
                }
            }
        }, { signal: this.#implement.signal });
        this.#__bofqi.when('--attention').switchMap<CustomEvent<boolean>>(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<boolean>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            if (!this.#mid) return Observable.from([]);
            return new Observable<boolean>(subscriber => {
                const abortController = new AbortController();
                modify(this.#mid, detail ? RELATION_MODIFY.CANCEL_FOLLOW : RELATION_MODIFY.ADD_FOLLOW, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(!detail);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort();
            });
        }).subscribe(e => {
            this.isAttention = e;
        }, { signal: this.#implement.signal });
        this.#__bofqi.when('--like').switchMap<CustomEvent<boolean>>(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<boolean>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            if (!this.#aid) return Observable.from([]);
            return new Observable<boolean>(subscriber => {
                const abortController = new AbortController();
                like(this.#aid, !detail, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(!detail);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort();
            });
        }).subscribe(e => {
            this.isLike = e;
            if (e) {
                this.like = this.#like + 1;
            } else {
                this.like = this.#like - 1;
            }
        }, { signal: this.#implement.signal });
        this.#__bofqi.when('--coin').switchMap<CustomEvent<number>>(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<number>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            if (!this.#aid) return Observable.from([]);
            return new Observable<number>(subscriber => {
                const abortController = new AbortController();
                addCoin(this.#aid, detail, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(detail);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort();
            });
        }).subscribe(e => {
            this.isCoin = e;
            this.coin = this.#coin + e;
        }, { signal: this.#implement.signal });
        this.#__bofqi.when('--fav').switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(() => {
            if (this.#favPopover.matches(':popover-open') || !this.#aid) return Observable.from([]);
            return new Observable<IFolder[]>(subscriber => {
                const abortController = new AbortController();
                folder(this.#aid, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message, data }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(data);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort();
            });
        }).subscribe(e => {
            const div = <HTMLDivElement>this.#favPopover.children[1];
            if (!div) return;
            this.#fids.clear();
            const df = document.createDocumentFragment();
            e.forEach(({ state, cur_count, max_count, fid, favoured, name }) => {
                const label = document.createElement('label');
                label.innerHTML = '<input name="fid" type="checkbox">';
                label.classList.toggle('state', state === 3);
                label.dataset['cur'] = <any>cur_count;
                label.dataset['max'] = <any>max_count;
                (<HTMLInputElement>label.children[0]).value = <any>fid;
                (<HTMLInputElement>label.children[0]).checked = Boolean(favoured);
                label.append(document.createTextNode(name));
                df.append(label);
            });
            div.replaceChildren(df);
            this.#favPopover.showPopover();
        }, { signal: this.#implement.signal });
        this.#__bofqi.when('--fids').switchMap(e => {
            return new Observable<CustomEvent<{ add: number[]; del: number[]; }>>(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<{ add: number[]; del: number[]; }>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail: { add, del } }) => {
            if (!this.#aid) return Observable.from([]);
            return new Observable(subscriber => {
                const abortController = new AbortController();
                add.length && addFav(this.#aid, add, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    add.forEach(d => {
                        this.#fids.add(d);
                    });
                    subscriber.next(true);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                del.length && delFav(this.#aid, del, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    del.forEach(d => {
                        this.#fids.delete(d);
                    });
                    subscriber.next(false);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort();
            });
        }).subscribe(() => {
            this.isFavorite = Boolean(this.#fids.size);
            this.#favPopover.hidePopover();
        }, { signal: this.#implement.signal });
        this.#__bofqi.when('--seelater').switchMap<CustomEvent<HTMLElement>>(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(<CustomEvent<HTMLElement>>e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(({ detail }) => {
            if (!this.#aid) return Observable.from([]);
            return new Observable<HTMLElement>(subscriber => {
                const abortController = new AbortController();
                (detail.classList.contains('d') ? delToview : addToView)(this.#aid, { signal: AbortSignal.any([abortController.signal, this.#abortController.signal]) }).then(({ code, message }) => {
                    if (code) throw new Error(`${code} ${message}`);
                    subscriber.next(detail);
                    subscriber.complete();
                }).catch(e => {
                    subscriber.complete();
                    if (Error.isError(e)) {
                        new Medal(e.message, e.name);
                    }
                });
                return () => abortController.abort();
            });
        }).subscribe(e => {
            e.classList.toggle('d');
        }, { signal: this.#implement.signal });

        this.#coinPopover.when('submit').subscribe(e => {
            e.preventDefault();
            const { value } = (<HTMLInputElement>this.#coinPopover['coin']);
            this.#__bofqi.dispatchEvent(new CustomEvent('--coin', { detail: value }));
        }, { signal: this.#implement.signal });
        this.#favPopover.when('submit').subscribe(e => {
            e.preventDefault();
            const fd = new FormData(this.#favPopover);
            const fids = new Set(fd.getAll('fid').map(d => Number(<string>d)).filter(num => !Number.isNaN(num)));
            const add = Array.from(fids).filter(d => !this.#fids.has(d));
            const del = Array.from(this.#fids).filter(d => !fids.has(d));
            if (add.length || del.length) this.#__bofqi.dispatchEvent(new CustomEvent('--fids', { detail: { add, del } }));
        }, { signal: this.#implement.signal });

        const av = /av\d+/i.exec(location.pathname);
        if (!av) {
            const bv = /[BbVv]{2}1[FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf]{9}/.exec(location.pathname);
            if (!bv) {
                new Medal('解码av号失败ಥ_ಥ');
                return;
            }
            debug(bv[0]);
            this.aid = bv2av(bv[0]);
            const url = new URL(location.href);
            url.pathname = `/video/av${this.aid}`;
            history.replaceState(undefined, '', url);
            return;
        }
        this.aid = BigInt(av[0].slice(2));
    }
    disconnectedCallback() {
        this.#implement.abort();
    }
    identify() {
        this.#abortController.abort();
        this.#abortController = new AbortController();

        this.#player.identify();
        this.#comment.identify();

        this.sign = this.name = this.face = this.title = '';
        this.#copyright = this.no_reprint = this.mid = this.mission_id = this.tid = this.pubdate = this.his_rank = 0;
        this.pages = this.related = this.desc = this.tags = this.follower = this.archive_count = this.view = this.danmaku = this.like = this.coin = this.favorite = this.share = undefined;
        this.isAttention = false;
        this.#fids.clear();
    }
}
customElements.define(Av.is, Av, { extends: 'html' });