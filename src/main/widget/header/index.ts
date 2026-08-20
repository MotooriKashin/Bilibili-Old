import html from './index.html' with {type: 'text'};
import style from './index.css' with {type: 'css'};
import iconfont from './iconfont.css' with {type: 'css'};
import profile from './profile.html' with {type: 'text'};
import navMore from './nav-more.html' with {type: 'text'};
import navLast from './nav-last.html' with {type: 'text'};
import INDEX_ICON from './index-icon.json' with { type: 'json' }
import { s_default } from '../../../io/api.bilibili.com/x/web-interface/search/default';
import { epochRelativeTime } from '../../../utils/time';
import { history } from '../../../io/api.bilibili.com/x/v2/history';
import { nav } from '../../../io/api.bilibili.com/x/polymer/web-dynamic/v1/feed/nav';
import { https } from '../../../utils/url';
import { web } from '../../../io/api.bilibili.com/x/v2/history/toview/web';
import { recent } from '../../../io/api.bilibili.com/x/medialist/gateway/coll/resource/recent';
import { error } from '../../../utils/debug';
import { exit } from '../../../io/passport.bilibili.com/login/exit/v2';
import { suggest, type ISuggest } from '../../../io/s.search.bilibili.com/main/suggest';
import { randBetween } from '../../../utils/number';
import { online } from '../../../io/api.bilibili.com/x/web-interface/online';
import { getItem, setItem } from '../storage';

export class Header extends HTMLElement {
    static get is() {
        return 'bili-header-m';
    }
    static {
        document.adoptedStyleSheets.push(iconfont);
    }
    #shadowRoot = this.attachShadow({ mode: 'closed' });
    #implement = new AbortController();
    #icon: HTMLAnchorElement;
    #update_baseline = 0n;
    #offset = '';
    #noData?: HTMLDivElement;
    #IntersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(async entry => {
            if (entry.isIntersecting) {
                this.feed().catch(error);
            }
        });
    });
    #search: ISearch;
    #defaultUrl = '';
    #suggest: HTMLDivElement;
    #iconTemplate = document.createElement('img');
    constructor() {
        super();
        // 初始化页面结构
        this.#shadowRoot.innerHTML = html;
        this.#shadowRoot.adoptedStyleSheets.push(style);

        this.#iconTemplate.fetchPriority = 'low';

        this.#icon = this.#shadowRoot.querySelector('#icon')!;
        this.#search = this.#shadowRoot.querySelector('#search')!;
        this.#suggest = this.#shadowRoot.querySelector('#suggest')!;

        this.icon();
        this.online().catch(error);
        this.nav().catch(error);
        this.default().catch(error);
    }
    connectedCallback() {
        this.#implement.abort();
        this.#implement = new AbortController();

        this.#icon.when('command').subscribe(({ command }) => {
            switch (command) {
                case '--exit': {
                    exit().catch(error);
                    break;
                }
            }
        }, { signal: this.#implement.signal });
        this.#search.when('submit').subscribe(async e => {
            const { value } = this.#search.keyword;
            if (value === '') {
                if (this.#defaultUrl) {
                    this.#search.keyword.value = this.#search.keyword.placeholder;
                } else {
                    e.preventDefault();
                }
            } else {
                const data = new Set(<string[]>(await getItem('searchHistory')));
                data.add(value.trim());
                setItem('searchHistor', Array.from(data));
            }
        }, { signal: this.#implement.signal });
        this.#search.keyword.when('focus').switchMap(() => this.#search.keyword.when('click').take(1)).subscribe(() => {
            this.#suggest.showPopover({ source: this.#search });
        }, { signal: this.#implement.signal });
        this.#search.keyword.when('input').switchMap<Event>(e => e.isComposing ? this.#search.keyword.when('compositionend').take(1) : Observable.from([e])).switchMap(e => {
            return new Observable(subscriber => {
                const timer = setTimeout(() => {
                    subscriber.next(e);
                    subscriber.complete();
                }, 300);
                return () => clearTimeout(timer);
            });
        }).switchMap(() => {
            const value = this.#search.keyword.value.trim();
            if (!value) {
                return new Observable<ISuggest['tag']>(subscriber => {
                    let abort = false;
                    getItem('searchHistory').then((searchHistory = []) => {
                        if (!abort) {
                            subscriber.next((<string[]>searchHistory).map(term => { return { term } }));
                            subscriber.complete();
                        }
                    }).catch(e => {
                        subscriber.complete();
                        abort || error(e);
                    });
                    return () => abort = true;
                });
            } else {
                return new Observable<ISuggest['tag']>(subscriber => {
                    const abortController = new AbortController();
                    suggest(value, { signal: abortController.signal }).then(({ code, result }) => {
                        if (!code) {
                            const { tag } = result;
                            subscriber.next(tag);
                            subscriber.complete();
                        }
                    }).catch(e => {
                        subscriber.complete();
                        if (e.name === 'AbortError') return;
                        error(e);
                    });
                    return () => abortController.abort();
                })
            }
        }).subscribe((e) => {
            const value = this.#search.keyword.value.trim().toLocaleLowerCase();
            this.#suggest.dataset['value'] = value ? '关联词' : '历史搜索';
            const df = document.createDocumentFragment();
            e.forEach(({ term }) => {
                const button = document.createElement('button');
                button.textContent = term;
                value || button.append(document.createElement('i'));
                df.append(button);
            })
            this.#suggest.replaceChildren(df);
            CSS.highlights.delete('search-match');
            if (value) {
                // 关键词高亮
                const ranges = [];

                const walker = document.createTreeWalker(this.#suggest, NodeFilter.SHOW_TEXT);

                // 当前遍历到的节点
                let currentNode;

                // 1. 遍历 TreeWalker 找到的所有文本节点
                while ((currentNode = walker.nextNode())) {
                    // 此时 currentNode 必然是 Text 节点（由 SHOW_TEXT 保证）
                    const textContent = currentNode.textContent!;
                    const lowerText = textContent.toLowerCase();

                    // 检查这个文本节点中是否包含关键字
                    if (lowerText.includes(value)) {

                        let startIndex = 0;
                        // 2. 在当前文本节点内查找所有匹配项（处理可能出现的多次匹配）
                        while ((startIndex = lowerText.indexOf(value, startIndex)) !== -1) {

                            // 3. 创建 Range 对象
                            const range = new Range();
                            // 设置 Range 的起止字符偏移量 (Offset)
                            // 关键点：setStart 的 node 必须是当前这个 Text 节点
                            range.setStart(currentNode, startIndex);
                            range.setEnd(currentNode, startIndex + value.length);

                            ranges.push(range);

                            // 移动起点，继续搜寻下一个匹配项
                            startIndex += value.length;
                        }
                    }
                }

                // 4. 创建 Highlight 对象并将所有 Range 组合在一起
                const searchHighlight = new Highlight(...ranges);

                // 5. 注册到全局的 CSS.highlights 集合中
                CSS.highlights.set('search-match', searchHighlight);
            }
        }, { signal: this.#implement.signal });
        this.#suggest.when('click').subscribe(async ({ target }) => {
            switch ((<HTMLElement>target).nodeName) {
                case 'BUTTON': {
                    this.#search.keyword.value = (<HTMLElement>target).textContent.trim();
                    this.#search.requestSubmit();
                    break;
                }
                case 'I': {
                    const textContent = (<HTMLElement>target).parentElement!.textContent.trim();
                    const data = new Set(<string[]>(await getItem(' searchHistory')));
                    data.delete(textContent.trim());
                    await setItem('searchHistor', Array.from(data));
                    (<HTMLElement>target).parentElement?.remove();
                    break;
                }
            }
        }, { signal: this.#implement.signal });
    }
    disconnectedCallback() {
        this.#implement.abort();
    }
    private async online() {
        const { code, message, data } = await online();
        if (code) return error(code, message);
        const { region_count } = data;
        Object.entries(region_count).forEach(([tid, value]) => {
            const a = this.#shadowRoot.querySelector<HTMLAnchorElement>(`[data-tid="${tid}"]`);
            if (a) {
                a.dataset['value'] = value > 999 ? '999+' : <any>value;
            }
        });
    }
    private icon() {
        const i = randBetween(0, INDEX_ICON.length - 1);
        const { title, icon, links } = INDEX_ICON[i] || INDEX_ICON[0]!;
        this.#iconTemplate.src = https(icon);
        this.#iconTemplate.alt = this.#iconTemplate.title = title;
        this.#icon.replaceChildren(this.#icon.cloneNode());
        this.#icon.href = links[0]!;
    }
    private async nav() {
        const iFace = this.#shadowRoot.querySelector<HTMLAnchorElement>('.i-face');
        if (!iFace) return;
        const dynamic = iFace.nextElementSibling;
        const { data: { isLogin, face, mid, uname, vip_nickname_color, vip_label: { path, text }, money, wallet: { bcoin_balance }, email_verified, mobile_verified, level_info: { current_level, current_exp, next_exp } } } = await import('../../../io/api.bilibili.com/x/web-interface/nav');
        if (!isLogin) return;
        this.#iconTemplate.src = https(face);
        this.#iconTemplate.alt = this.#iconTemplate.title = uname;
        iFace.replaceChildren(this.#iconTemplate.cloneNode());
        iFace.href = `//space.bilibili.com/${mid}`;
        const pf = document.createElement('div');
        pf.id = 'profile-m';
        pf.popover = 'auto';
        pf.innerHTML = profile;
        pf.firstElementChild!.textContent = uname;
        vip_nickname_color && ((<HTMLElement>pf.firstElementChild!).style.color = vip_nickname_color);
        (<HTMLImageElement>pf.children[1]).src = https(path);
        (<HTMLImageElement>pf.children[1]).alt = (<HTMLImageElement>pf.children[1]).title = text;
        (<HTMLAnchorElement>pf.children[2]!.children[0]).text = <any>money;
        (<HTMLAnchorElement>pf.children[2]!.children[1]).text = <any>bcoin_balance;
        email_verified && (<HTMLAnchorElement>pf.children[2]!.children[2]).classList.add('d');
        mobile_verified && (<HTMLAnchorElement>pf.children[2]!.children[3]).classList.add('d');
        (<HTMLElement>pf.children[3]!.children[0]).classList.add(`lv${current_level}`);
        (<HTMLProgressElement>pf.children[3]!.children[1]).value = typeof next_exp === 'number' ? current_exp / next_exp : 1;
        (<HTMLProgressElement>pf.children[3]!.children[2]).dataset['current'] = <any>current_exp;
        (<HTMLProgressElement>pf.children[3]!.children[2]).dataset['next'] = <any>next_exp;
        iFace.insertAdjacentElement('afterend', pf);
        iFace.insertAdjacentHTML('afterend', navMore);

        this.#noData = this.#shadowRoot.querySelector<HTMLDivElement>('.no-data')!;
        if (this.#noData) {
            this.#IntersectionObserver.observe(this.#noData);
        }
        if (!dynamic) return;
        dynamic.insertAdjacentHTML('afterend', navLast);
        const [wlm, fm, hm] = [this.#shadowRoot.querySelector<HTMLDivElement>('#watch-later-m'), this.#shadowRoot.querySelector<HTMLDivElement>('#favorites-m'), this.#shadowRoot.querySelector<HTMLDivElement>('#history-record-m')];
        if (wlm) {
            const i = new IntersectionObserver(entries => {
                entries.forEach(async entry => {
                    if (entry.isIntersecting) {
                        i.unobserve(wlm);
                        this.web().catch(error);
                    }
                });
            });
            i.observe(wlm);
        }
        if (fm) {
            const i = new IntersectionObserver(entries => {
                entries.forEach(async entry => {
                    if (entry.isIntersecting) {
                        i.unobserve(fm);
                        this.recent().catch(error);
                    }
                });
            });
            i.observe(fm);
        }
        if (hm) {
            const i = new IntersectionObserver(entries => {
                entries.forEach(async entry => {
                    if (entry.isIntersecting) {
                        i.unobserve(hm);
                        this.history().catch(error);
                    }
                });
            });
            i.observe(hm);
        }
    }
    private async feed() {
        if (!this.#noData) return;
        this.#IntersectionObserver.unobserve(this.#noData);
        const { code, message, data } = await nav(this.#offset ? '' : this.#update_baseline || (this.#update_baseline = BigInt(await getItem('update_baseline'))), this.#offset);
        if (code) throw new Error(`${code} ${message}`);
        const { has_more, update_baseline, offset, items } = data;
        const ndf = document.createDocumentFragment();
        const odf = document.createDocumentFragment();
        const div = document.createElement('div');
        div.innerHTML = `<a target="_blank"></a>
<div>
    <div data-value="投稿了"><a target="_blank"></a></div>
    <a target="_blank"></a>
</div>`;
        for (const { jump_url, title, cover, author: { mid, name }, id_str } of items) {
            (<HTMLAnchorElement>div.children[1]!.children[1]).href = (<HTMLAnchorElement>div.children[0]).href = jump_url;
            (<HTMLAnchorElement>div.children[1]!.children[1]).text = (<HTMLAnchorElement>div.children[1]!.children[1]).title = (<HTMLAnchorElement>div.children[0]).title = title;
            (<HTMLAnchorElement>div.children[0]).style.backgroundImage = `url(${https(cover)})`;
            (<HTMLAnchorElement>div.children[1]!.children[0]!.children[0]).href = `//space.bilibili.com/${mid}`;
            (<HTMLAnchorElement>div.children[1]!.children[0]!.children[0]).text = name;
            if (BigInt(id_str) > this.#update_baseline) {
                ndf.append(div.cloneNode(true));
            } else {
                odf.append(div.cloneNode(true));
            }
        }
        const [ne, , oe] = this.#noData.parentElement?.children ?? [];
        ne?.append(ndf);
        oe?.append(odf);
        if (has_more) this.#IntersectionObserver.observe(this.#noData);
        this.#offset = offset;
        if (update_baseline) {
            this.#update_baseline = BigInt(update_baseline);
            await setItem('update_baseline', update_baseline);
        }
    }
    private async web() {
        const list = this.#shadowRoot.querySelector<HTMLDivElement>('#watch-later-m>.list');
        if (!list) return;
        const { code, message, data } = await web();
        if (code) throw new Error(`${code} ${message}`);
        const df = document.createDocumentFragment();
        data.list.forEach(({ aid, title }) => {
            const a = document.createElement('a');
            a.href = `//www.bilibili.com/video/av${aid}`;
            a.text = a.title = title;
            df.append(a);
        })
        list.replaceChildren(df);
    }
    private async recent() {
        const list = this.#shadowRoot.querySelector<HTMLDivElement>('#favorites-m>.list');
        if (!list) return;
        const { code, message, data } = await recent();
        if (code) throw new Error(`${code} ${message}`);
        const df = document.createDocumentFragment();
        data.forEach(({ id, title }) => {
            const a = document.createElement('a');
            a.href = `//www.bilibili.com/video/av${id}`;
            a.text = a.title = title;
            df.append(a);
        })
        list.replaceChildren(df);
    }
    private async history() {
        const list = this.#shadowRoot.querySelector<HTMLDivElement>('#history-record-m>.list');
        if (!list) return;
        const { code, message, data } = await history();
        if (code) throw new Error(`${code} ${message}`);
        const df = document.createDocumentFragment();
        const dd: Record<string, HTMLDivElement> = {};
        data.forEach(({ view_at, redirect_link, redirect_url, duration, page, progress, title, device }) => {
            const d = epochRelativeTime(view_at * 1e3);
            if (!dd[d]) {
                const t = document.createElement('div');
                t.dataset['value'] = d;
                df.append(t);
                dd[d] = t;
            }
            const a = document.createElement('a');
            a.classList.add(2 === device ? 'pc' : 1 === device || 3 === device || 5 === device || 7 === device ? 'phone' : 4 === device || 6 === device ? 'pad' : 33 === device ? 'tv' : 'unknown');
            a.href = `${redirect_link}?${!redirect_url && page ? `p=${page.page}&` : ''}t=${progress}`;
            a.target = '_blank';
            a.title = title;
            a.dataset['value'] = `${!redirect_url && page ? `第${page.page}P | ` : ''}${progress > 0 ? `${Math.floor(progress / (page?.duration ?? duration) * 100)}%` : '已看完'}`;
            const span = document.createElement('span');
            span.textContent = title;
            a.append(span);
            dd[d].append(a);
        });
        list.replaceChildren(df);
    }
    private async default() {
        const { code, message, data } = await s_default();
        if (code) throw new Error(`${code} ${message}`);
        const { name, url } = data;
        this.#search.keyword.placeholder = name;
        this.#defaultUrl = url;
    }
}
customElements.define(Header.is, Header);

interface ISearch extends HTMLFormElement {
    keyword: HTMLInputElement;
}