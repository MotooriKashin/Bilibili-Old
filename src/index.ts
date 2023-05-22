import { GM as _ } from '@jsc/chrome';
import { BLOD } from './core/bilibili-old';
import { user } from './core/user';
import { localStorage } from "./core/storage";
import { Header } from './page/header';
import { PageSpace } from './page/space';
import { PageMedia } from './page/media';
import { PageHistory } from './page/history';
import { PageLive } from './page/live';
import { PageDynamic } from './page/dynamic';
import { PageIndex } from './page';
import { urlCleaner } from './core/url';
import { cdn } from './utils/cdn';
import { player } from './core/player';
import { PageAV } from './page/av';
import { PageBangumi } from './page/bangumi';
import { PageWatchlater } from './page/watchalter';
import { PagePlaylist } from './page/playlist';
import { PagePlaylistDetail } from './page/playlist-detail';
import { PageRanking } from './page/ranking';
import { PageRead } from './page/read';
import { PageSearch } from './page/search';
import { Automate } from './core/automate';
import { toast } from './core/toast';
import { ReportObserver } from './core/report';
import { videoLimit } from './core/videolimit';
import { Comment } from './core/comment';
import { WebTRC } from './core/webrtc';
import { UI } from './core/ui';
import toview from './json/toview.json';
import { PageHttps, PageWild } from './page/wild';
import { PageAnime } from './page/home/anime';
import { PageMovie } from './page/home/movie';

document.domain = 'bilibili.com';

// 提取版本哈希（仅限用户脚本）
BLOD.version = GM.info?.script.version.slice(-40);
// 获取用户数据后初始化
user.addCallback(status => {
    toast.update(status.toast);
    cdn.update(status.cdn, BLOD.version);
    Comment.commentJumpUrlTitle = status.commentJumpUrlTitle;
    Comment.resolvePictures = status.commentPicture;
    if (BLOD.path[2] !== 'm.bilibili.com') {
        if (BLOD.path[2] == 'www.bilibili.com' && (!BLOD.path[3] || (BLOD.path[3].startsWith('\?') || BLOD.path[3].startsWith('\#') || BLOD.path[3].startsWith('index.')))) {
            if (document.referrer.includes('blackboard/bnj2019.html')) {
                // 拜年祭2019
                new PageWild('/src/html/bnj2019.html', 'https://www.bilibili.com/blackboard/bnj2019.html');
            } else {
                status.index && new PageIndex();
            }
        }
        if (status.av && /(\/s)?\/video\/[AaBb][Vv]/.test(location.href)) {
            // SEO重定向
            BLOD.path[3] === "s" && urlCleaner.updateLocation(location.href.replace("s/video", "video"));
            player.loadEmbedPlayer();
            new PageAV();
        }
        if (status.player && (/\/festival\//.test(location.href) || (/player\./.test(location.href) || /webplayer\/embed/.test(location.href) && !location.href.includes("ancient")))) {
            player.loadConnectPlayer();
        }
        if (status.bangumi && /\/bangumi\/play\/(ss|ep)/.test(location.href)) {
            player.loadEmbedPlayer();
            new PageBangumi();
        }
        if (status.watchlater && /\/watchlater/.test(location.href)) {
            player.loadEmbedPlayer();
            new PageWatchlater();
        }
        if ((status.playlist && (/\/medialist\/play\//.test(location.href) || /\/list\/ml\d+/.test(location.href)) && !/watchlater/.test(location.href)) || /\/playlist\/video\/pl/.test(location.href)) {
            player.loadEmbedPlayer();
            new PagePlaylist();
        }
        if (/\/playlist\/detail\/pl/.test(location.href)) {
            new PagePlaylistDetail();
        }
        if (status.ranking && /\/v\/popular\//.test(location.href)) {
            new PageRanking();
        }
        if (status.read && /\/read\/[Cc][Vv]/.test(location.href)) {
            new PageRead();
        }
        if (status.search && BLOD.path[2] == "search.bilibili.com") {
            new PageSearch();
        }
        if (/\/moe\/2018\/jp\/home/.test(location.href)) {
            Reflect.set(window, 'getPlayList', () => { return { code: 0, data: toview } });
        }
        if (
            /\/html\/danmubisai.html/.test(location.href)
            || /\/html\/cele.html/.test(location.href)
        ) {
            new PageHttps();
        }
        if (/\/(anime|guochuang)\/?$/.test(location.pathname)) {
            new PageAnime();
        }
        if (/\/movie\/?$/.test(location.pathname)) {
            new PageMovie();
        }
    }
    player.nanoPermit();
    new Automate();
    status.disableReport && new ReportObserver();
    status.videoLimit.status && videoLimit.enable();
    status.fullBannerCover && (Header.fullBannerCover = true);
    status.header && new Header();
    status.comment && new Comment();
    status.webRTC || WebTRC.disable();
    status.album && /t.bilibili.com\/\d+/.test(location.href) && PageSpace.album();
    status.development && Reflect.defineProperty(window, 'BLOD', {
        value: BLOD,
        configurable: true,
    });
    window.top === window.self && (BLOD.ui = new UI());
});
// 无需用户数据或者自行获取用户数据的组件初始化
try {
    // 禁止bpx-player自动播放
    const bpx_player_profile = localStorage.getItem("bpx_player_profile") || { media: { autoplay: false } };
    bpx_player_profile.media.autoplay = false;
    localStorage.setItem("bpx_player_profile", bpx_player_profile);
} catch (e) { }
BLOD.path[2] == "message.bilibili.com" && Header.message();
Header.videoOffset();
/space\.bilibili\.com/.test(location.href) && new PageSpace();
/bangumi\/media\/md/.test(location.href) && new PageMedia();
location.href.includes("www.bilibili.com/account/history") && new PageHistory();
BLOD.path[2] == "live.bilibili.com" && new PageLive();
BLOD.path[2] == "t.bilibili.com" && new PageDynamic();

//////////////////////////// 全局定义 ////////////////////////////
declare global {
    /** 提权接口，有些需要区分扩展版和用户脚本版 */
    const GM: typeof _;
}