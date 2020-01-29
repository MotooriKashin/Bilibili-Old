// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    https://greasyfork.org/zh-CN/scripts/394296
// @version      2.5.1
// @description  切换旧版播放页面，布局、播放器全部切换回2019年12月09日之前的样子。载入异常请尝试`Shift+F5`或`Ctrl+Shift+R`
// @author       Motoori Kashin
// @match        *://*.bilibili.com/*
// @exclude      *://live.bilibili.com/*
// @license      MIT
// @run-at       document-start
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const OR_HTML = xhrHM(location.href);
    const path = document.location.href.split('/');
    let TITLE = document.getElementsByTagName("title");if (TITLE[0]){TITLE = TITLE[0].innerText;}

    function xhrHM(url){ // 同步链接获取网页数据
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send(null);
        if (xhr.status === 200) {return xhr.responseText;}
    }
    /*function xhrYM(url){ // 异步链接获取网页数据
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = () => {return xhr.responseText;}
        xhr.send();
    }
    function adscr(src){ // 添加同步script
        let script = document.createElement("script");
        script.setAttribute("type","text/javascript");
        script.setAttribute("src",src);
        document.body.appendChild(script);
    }
    function anscr(src){ // 添加异步script
        let script = document.createElement("script");
        script.setAttribute("src",src);
        script.setAttribute("crossorigin","");
        script.setAttribute("defer","defer");
        document.body.appendChild(script);
    }
    function repEle(ele,dcm){ // 替换页面元素
        let rp = document.getElementsByClassName(ele)[0];
        let rpw = document.createElement(ele);
        rpw.innerHTML = dcm;
        rp.replaceWith(rpw);
    }
    function onPlay(){ // 动态添加av页播放器初始化代码
        let bofqi = document.getElementById("bofqi");
        let str = '<script>function getQueryString(e){var r=new RegExp(\"(^|&)\"+e+\"=([^&]*)(&|$)\"),i=window.location.search.substr(1).match(r);return null!=i?unescape(i[2]):null}window.getInternetExplorerVersion=function(){var e=-1;if(\"Microsoft Internet Explorer\"==navigator.appName){var r=navigator.userAgent;null!=new RegExp(\"MSIE ([0-9]{1,}[.0-9]{0,})\").exec(r)&&(e=parseFloat(RegExp.$1))}return e};var vd=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.videoData;if(vd&&vd.aid&&9!==getInternetExplorerVersion()){if($(\"#__bofqi\").innerHTML=\'<div class=\"bili-wrapper\" id=\"bofqi\"><div id=\"player_placeholder\"></div></div>\',vd.embedPlayer){var p=getQueryString(\"p\")?getQueryString(\"p\")-1:0,player={aid:vd.aid,cid:vd.pages[p]&&vd.pages[p].cid||vd.pages[0].cid};EmbedPlayer(\"player\",\"//static.hdslb.com/play.swf\",\"cid=\"+player.cid+\"&aid=\"+player.aid+\"&pre_ad=\")}vd.embed&&$(\"#bofqi\").html(vd.embed)}else $(\"#bofqi\").remove()</script>';
        var range = document.createRange()
        range.setStart(bofqi, 0)
        bofqi.appendChild(
            range.createContextualFragment(str)
        )
    }*/
    /* 以上接口存档备用 */
    function setDM(){ // 选择弹幕列表
        let cDM = window.setInterval(()=>{
            let setDM = document.getElementsByClassName("bilibili-player-filter-btn")[1];
            if (setDM){setDM.click();clearInterval(cDM);}
        }, 10);
    }
    function mkBGM(ini,epId){ // 主动构造ss番剧页播放数据，ss页无法主动获取epId，未登录情况下默认取第一个分集的epId
        let is = JSON.parse(ini).result; // 以数组形式获取原__INITIAL_STATE__数据，包含番剧原生信息，但需重构
        let ep = 0; // 布尔值，判断是否登录,这里用数值0代替（是否能正常获取epId）
        let ic = JSON.parse(OR_HTML.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/,"").replace(/\;\(function/,"")); // 取新版__INITIAL_STATE__备用
        let pug = JSON.parse(OR_HTML.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace(/PGC_USERSTATE__=/,"").replace(/<\/script>/,"")); // 以数组形式获取新版__PGC_USERSTATE__信息，播放记录被拆分到了这里
        /* 下面开始构造__INITIAL_STATE__数据，第一行直接复制自旧版页面 */
        let dat = {"ver":{},"loginInfo":{},"canReview":false,"userShortReview":{},"userLongReview":{},"userScore":0,"userCoined":false,"isPlayerTrigger":false,"special":false,"area":0,"app":false,"recomList":[],"playerRecomList":[],"paster":{},"payPack":{},"payMent":{},"activity":{},"spending":0,"sponsorTotal":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorWeek":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorTotalCount":0,"miniOn":true,"seasonFollowed":false,"epStat":{},"ssStat":{}};
        if (epId){dat.epId = 1 * epId;ep = 1;}else{dat.epId = "";if(pug.hasOwnProperty("progress")){dat.epId = pug.progress.last_ep_id;ep = 1;}} // 当前ep集数
        dat.ssId = is.season_id; // 番剧ssID
        dat.mdId = 1 * is.link.match(/[0-9][0-9]*/)[0]; // 番剧信息页ID，这里通过link获取
        dat.mediaInfo = {};dat.mediaInfo.actors = is.actors;dat.mediaInfo.alias = is.alias;dat.mediaInfo.areas = is.areas;dat.mediaInfo.cover = is.cover;dat.mediaInfo.evaluate = is.evaluate;
        dat.mediaInfo.is_paster_ads = is.is_paster_ads;dat.mediaInfo.jp_title = is.jp_title;dat.mediaInfo.link = is.link;dat.mediaInfo.media_id = is.media_id;dat.mediaInfo.mode = is.mode;
        dat.mediaInfo.season_id = is.season_id;dat.mediaInfo.season_status = is.season_status;dat.mediaInfo.season_title = is.season_title;dat.mediaInfo.season_type = is.season_type;
        dat.mediaInfo.series_title = is.series_title;dat.mediaInfo.square_cover = is.square_cover;dat.mediaInfo.staff = is.staff;dat.mediaInfo.style = is.style;dat.mediaInfo.title = is.title;
        dat.mediaInfo.total_ep = is.total_ep; // 番剧基本信息
        dat.mediaRating = is.rating; // 评分及长短评
        dat.epList = is.episodes;if (ep==0){dat.epId=dat.epList[0].ep_id;}for (let i = 0;i<dat.epList.length;i++){if(dat.epList[i].ep_id == dat.epId){dat.epInfo = dat.epList[i]}} // 番剧所有ep分集信息
        dat.newestEp = is.newest_ep; // 番剧连载信息
        dat.seasonList = is.seasons;if(!dat.seasonList){dat.seasonList = ic.sections;} // 番剧分季信息，API获取不到就从新版获取
        dat.seasonStat = {"views":0,"danmakus":0,"coins":0,"favorites":0}; // 原样复制
        dat.userStat = {"loaded":true,"error":false,"follow":0,"pay":0,"payPackPaid":0,"sponsor":0};dat.userStat.watchProgress = pug.progress;dat.userStat.vipInfo = pug.vip_info; // 用户信息，前面复制，vip信息重构
        dat.upInfo = is.up_info; // up主信息
        dat.rightsInfo = is.rights; // 权限信息，包含是否可以预览、下载……
        dat.pubInfo = is.publish; // 番剧时间信息：上映日期、是否开播……
        if(pug.dialog){dat.payMent = {"price":"0.0","promotion":"","tip":"大会员专享观看特权哦~"};dat.payMent.vip_promotion = pug.dialog.title;
                      if(pug.dialog.btn_left){dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];}} // 大会员提示，付费信息
        window.__INITIAL_STATE__ = dat; // 主动重构__INITIAL_STATE__，而不是等document.write()后以内联脚本方式启动
    }
    function mkSC(xhr,epId){ // 特殊Bangumi ARCHIVED ON 14:33:35 May 11, 2018
        let ini = JSON.parse(xhr).result;let ep = 0;
        let pug = JSON.parse(OR_HTML.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace(/PGC_USERSTATE__=/,"").replace(/<\/script>/,""));
        let is = JSON.parse(OR_HTML.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/,"").replace(/\;\(function/,""));
        let dat = {"ver":{"mobile":false,"ios":false,"android":false,"windowsPhone":false,"iPhone":false,"ios9":false,"iPad":false,"webApp":false,"microMessenger":false,"weibo":false,"uc":false,"qq":false,"baidu":false,"mqq":false,"mBaidu":false,"iqiyi":false,"qqLive":false,"safari":true,"youku":false,"ie":false,"edge":false,"bili":false,"biliVer":0},"loginInfo":{},"canReview":false,"userShortReview":{},"userLongReview":{},"userScore":0,"userCoined":false,"isPlayerTrigger":false,"special":true,"area":0,"app":false,"mediaRating":{},"recomList":[],"playerRecomList":[],"paster":{},"payPack":{},"payMent":{},"activity":{},"spending":0,"sponsorTotal":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorWeek":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorTotalCount":0,"miniOn":true,"seasonFollowed":false};
        if (epId){dat.epId = 1 * epId;ep = 1;}else{dat.epId = "";if(pug.hasOwnProperty("progress")){dat.epId = pug.progress.last_ep_id;ep = 1;}}
        dat.ssId = ini.season_id;dat.mdId = 1 * ini.link.match(/[0-9][0-9]*/)[0];
        dat.mediaInfo = {};dat.mediaInfo.actors = ini.actors;dat.mediaInfo.alias = ini.alias;dat.mediaInfo.areas = ini.areas;dat.mediaInfo.bkg_cover = ini.bkg_cover;
        dat.mediaInfo.cover = ini.cover;dat.mediaInfo.evaluate = ini.evaluate;dat.mediaInfo.is_paster_ads = ini.is_paster_ads;dat.jp_title = ini.jp_title;
        dat.mediaInfo.link = ini.link;dat.mediaInfo.media_id = ini.media_id;dat.mediaInfo.mode = ini.mode;dat.mediaInfo.season_id = ini.season_id;dat.mediaInfo.season_status = ini.season_status;
        dat.mediaInfo.season_title = ini.season_title;dat.mediaInfo.season_type = ini.season_type;dat.mediaInfo.square_cover = ini.square_cover;dat.mediaInfo.staff = ini.staff;
        dat.mediaInfo.stat = ini.state;dat.mediaInfo.style = ini.style;dat.mediaInfo.title = ini.title;
        dat.mediaRating = ini.rating;
        dat.epList = ini.episodes;if (ep==0){dat.epId=dat.epList[0].ep_id;}for (let i = 0;i<dat.epList.length;i++){if(dat.epList[i].ep_id == dat.epId){dat.epInfo = dat.epList[i]}}
        dat.newestEp = ini.newest_ep;
        dat.seasonList = ini.seasons;if(!dat.seasonList){dat.seasonList = is.sections;}
        dat.seasonStat = {"views":0,"danmakus":0,"coins":0,"favorites":0};
        dat.userStat = {"loaded":false,"error":false,"follow":0,"pay":0,"payPackPaid":0,"sponsor":0};dat.userStat.watchProgress = pug.progress;dat.userStat.vipInfo = pug.vip_info;
        dat.upInfo = ini.up_info;
        dat.rightsInfo = ini.rights;
        dat.pubInfo = ini.publish;
        if(pug.dialog){dat.payMent = {"price":"0.0","promotion":"","tip":"大会员专享观看特权哦~"};dat.payMent.vip_promotion = pug.dialog.title;
                       if(pug.dialog.btn_left){dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];}}
        window.__INITIAL_STATE__ = dat;
    }
    function wrAV(){ // 处理av页
        let ini = OR_HTML.match(/<script>window.__INITIAL_STATE__.+?<\/script>/)[0];
        let html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" /><style>#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style>' + ini + '</head><body><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script> <script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true"></div><div class="bili-wrapper" id="bofqi" style="visibility: hidden;"><script type="text/javascript">function getQueryString(e){var r=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),i=window.location.search.substr(1).match(r);return null!=i?unescape(i[2]):null}window.getInternetExplorerVersion=function(){var e=-1;if("Microsoft Internet Explorer"==navigator.appName){var r=navigator.userAgent;null!=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r)&&(e=parseFloat(RegExp.$1))}return e};var vd=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.videoData;if(vd&&vd.aid&&9!==getInternetExplorerVersion()){if($("#__bofqi").innerHTML=\'<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>\',vd.embedPlayer){var p=getQueryString("p")?getQueryString("p")-1:0,player={aid:vd.aid,cid:vd.pages[p]&&vd.pages[p].cid||vd.pages[0].cid};EmbedPlayer("player","//static.hdslb.com/play.swf","cid="+player.cid+"&aid="+player.aid+"&pre_ad=")}vd.embed&&$("#bofqi").html(vd.embed)}else $("#bofqi").remove()</script></div><script>0</script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><div class="footer bili-footer report-wrap-module"></div><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script></body></html>';
        document.open();
        document.write(html);
        document.close();
    }
    function wrWL(){ // 处理稍后再看
        let html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css"><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css"><link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css" rel="stylesheet"><style>#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div class="z-top-container has-menu"></div><div id="watchlater-app"></div><div class="footer bili-footer"></div><script type="text/javascript">0</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script><script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/watchlater/1.watchlater.ba8f2751267792c1f4a5e3a14514e47c34afba61.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/watchlater/watchlater.ba8f2751267792c1f4a5e3a14514e47c34afba61.js"></script></body></html>';
        document.open();
        document.write(html);
        document.close();
    }
    function wrBGM(){ // 处理BGM页
        if (window.__INITIAL_STATE__){Reflect.deleteProperty(window, "__INITIAL_STATE__");} // 去掉可能导致番剧页载入失败的新版页面残留的__INITIAL_STATE__
        let id = location.href.match(/[0-9]+/);
        if(path[5].startsWith('ss')){let url = "https://bangumi.bilibili.com/view/web_api/season?season_id=" + id[0];let ini = xhrHM(url);new mkBGM(ini,null);}
        if(path[5].startsWith('ep')){let url = "https://bangumi.bilibili.com/view/web_api/season?ep_id=" + id[0];let ini = xhrHM(url);new mkBGM(ini,id[0]);}
        let html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script><script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.764aaa07c8ac8078b639306b18838d080a1cefc1.css" /></head><body><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true" class="main-container"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.764aaa07c8ac8078b639306b18838d080a1cefc1.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.764aaa07c8ac8078b639306b18838d080a1cefc1.js" crossorigin="" defer="defer"></script><script type="text/javascript">0</script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>';
        document.open();
        document.write(html);
        document.close();
    }
    function wrSC(){ // 处理特殊BGM页
        if (window.__INITIAL_STATE__){Reflect.deleteProperty(window, "__INITIAL_STATE__");}
        let id = location.href.match(/[0-9]+/);
        if(path[5].startsWith('ss')){let url = "https://bangumi.bilibili.com/view/web_api/season?season_id=" + id[0];let ini = xhrHM(url);new mkSC(ini,null);}
        if(path[5].startsWith('ep')){let url = "https://bangumi.bilibili.com/view/web_api/season?ep_id=" + id[0];let ini = xhrHM(url);new mkSC(ini,id[0]);}
        let html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/bangumi/play/js/promise.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.764aaa07c8ac8078b639306b18838d080a1cefc1.css" /></head><body><div class="z-top-container " style="height:42px"></div><div id="app" data-server-rendered="true" class="main-container special"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/manifest.3b709027.js" crossorigin defer></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/vendor.3b709027.js" crossorigin defer></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/bangumi-play.3b709027.js" crossorigin defer></script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>';
        document.open();
        document.write(html);
        document.close();
    }
    function wrBB(aid,tvs,wid,hei){ // 处理blackboard
        let xhr = new XMLHttpRequest();
        let url = '//api.bilibili.com/x/player/pagelist?aid=' + aid + '&jsonp=jsonp';
        xhr.open('GET', url,true); // 获取异步链接返回值会失败，所以直接写在了异步任务里
        xhr.onload = () => {
            let cid = JSON.parse(xhr.responseText).data[0].cid;
            let ifr = document.createElement("iframe");
            if (wid < 720){cid = cid + '&as_wide=1';} // 自动宽屏
            ifr.setAttribute("src",'https://www.bilibili.com/blackboard/html5player.html?aid=' + aid + '&cid=' + cid);
            ifr.setAttribute("style",'width: '+ wid +'px;height: ' + hei + 'px;');
            tvs.replaceWith(ifr);
        };
        xhr.send();
    }
    function wrZY(){ // 处理主页
        let html = '<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css"></head><body><div id="home-app"></div><div id="app" data-server-rendered="true"></div><script src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin></script><script type="text/javascript" defer="defer" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script><link rel="prefetch" as="script" href="//static.hdslb.com/js/video.min.js"></body></html>';
        document.open();
        document.write(html);
        document.close();
    }
    function wrMH(ele){ // 替换迷你版头
        let reh = document.createElement("div");
        reh.setAttribute("class","z-top-container");
        ele.replaceWith(reh);
        let script = document.createElement("script");
        script.setAttribute("type","text/javascript");
        script.setAttribute("src","//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
        document.body.appendChild(script);
    }
    function wrAH(ele){ // 替换完整版头
        let reh = document.createElement("div");
        reh.setAttribute("class","z-top-container has-menu");
        ele.replaceWith(reh);
        let script = document.createElement("script");
        script.setAttribute("type","text/javascript");
        script.setAttribute("src","//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
        document.body.appendChild(script);
    }
    function wrFT(ele){ // 替换版底
        let ret = document.createElement("div");
        ret.setAttribute("class","footer bili-footer report-wrap-module");
        ret.setAttribute("id","home_footer");
        ele.replaceWith(ret);
        let script = document.createElement("script");
        script.setAttribute("type","text/javascript");
        script.setAttribute("src","//static.hdslb.com/common/js/footer.js");
        document.body.appendChild(script);
    }
    function wrBT(){ // 移除蒙版
        let blu = document.getElementsByClassName("blur-bg");
        if (blu[0]){
            blu[0].removeAttribute("style");
        }
    }
    function rdHT(){ // 移除预览
        let hint = document.getElementsByClassName("video-float-hint-btn");
        if (hint[0]){
            let i = 10; // 倒计时长度，可自行修改，单位/s
            if(document.getElementsByClassName("second-cut")[0]){return;}
            else{
                let sec = document.createElement("span");
                sec.setAttribute("class","video-float-hint-btn second-cut");
                hint[0].parentNode.appendChild(sec);
                function cut(){
                    sec.innerText = i - 1 + "s";
                    if(i==0){hint[0].parentNode.remove();return;}
                    i = i - 1;
                    window.setTimeout(cut,1000);
                }
                new cut();
            }
        }
    }
    function wrFX(){ // 全局处理
        new wrBT(); // 全局版头蒙版
        new rdHT(); // 大会员6分钟预览
    }
    function reAV(){ // av页入口
        if (OR_HTML.match(/biliconfig/) == null && OR_HTML.match(/"trueCode":-404/) == null){ // 排除自动重定向的av页
            new wrAV();
            new setDM();
            let reh = window.setInterval(()=>{ // av页后续处理
                let reH = document.getElementsByClassName("bili-header-m");
                if (reH[1]){
                    reH[1].remove();document.getElementById("bofqi").removeAttribute("style");clearInterval(reh);}
            }, 10);
        }
        else{ // av页判断不完美，收集失误信息方便修改
            console.log("Error！Old Bilibili: 跳转页 ",OR_HTML.match(/biliconfig/));
            console.log("Error！Old Bilibili: 报错页 ",OR_HTML.match(/"trueCode":-404/));
        }
    }
    function reWL(){ // 稍后再看入口
        new wrWL();
        new setDM();
    }
    function reBGM(){ // BGM页入口
        if (OR_HTML.match(/__INITIAL_STATE__/)){ // 排除无效BGM页
            if (OR_HTML.match(/"specialCover":""/)){// 分离特殊BGM页，普通BGM页specialCover为空
                new wrBGM();
                new setDM();
                let reh = window.setInterval(()=>{ // BGM页后续处理
                    let etN = document.getElementsByClassName("new-entry")[0];
                    if (etN){etN.setAttribute("style","visibility: hidden;");clearInterval(reh);}
                }, 10);
            }
            else{new wrSC();}
        }
    }
    function reBB(){ // blackboard入口
        document.addEventListener("DOMNodeInserted",() => {
            let ply = document.getElementsByTagName("iframe");
            if (ply[0]){
                for (let i = 0;i < ply.length;i++){
                    let src = ply[i].src;
                    if (src && src.match(/newplayer/)){ // 判断新版潜入式播放器
                        let aid = 1 * src.match(/aid=[0-9]*/)[0].replace(/aid=/,"");let tvs = ply[i];
                        let wid = ply[i].offsetWidth;let hei = ply[i].offsetHeight;
                        new wrBB(aid,tvs,wid,hei);// 参数依次为aid、DOM、视频宽度、视频高度
                    }
                }
            }
        });
    }
    function reBT(){ // 版头版底处理
        document.addEventListener("DOMNodeInserted",() => {
            let inh = document.getElementById("internationalHeader");
            let inf = document.getElementsByClassName("international-footer");
            if (inh){ // 判断版头
                let ppt = document.getElementById("primaryPageTab");
                if (ppt){new wrAH(inh);}else{new wrMH(inh);}
            }
            if (inf[0]){new wrFT(inf[0]);} // 判断版底
        });
    }
    function reZY(){ // 主页入口
        new wrZY();
    }
    function reFX(){ // DOM全局入口
        document.addEventListener("DOMNodeInserted",() => {new wrFX();});
    }
    /* 分离页面 */
    if (path[3]){
        if (path[3] == 'video'&& (path[4].startsWith('av'))){new reAV();} // 分离进入av页
        if (path[3] == 'watchlater'){new reWL();} // 分离进入稍后再看
        if ((path[3] == 'bangumi') && (path[4] == 'play')){new reBGM();} // 分离进入Bangumi页
        if (path[3] == 'blackboard'){new reBB();} // 分离进入blackboard
    }
    if (path[3]){new reBT();} // 除首页外进入版头版底
    /* 主页目前还未下架，且目前实现的丢失了首页推荐和推广位 */
    //if (location.href == "https://www.bilibili.com/"){new reZY()}
    /* 其他DOM载入后的全局处理 */
    document.addEventListener("DOMContentLoaded",() => {new reFX();});
})();