// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    Motoori Kashin
// @version      2.8.1
// @description  恢复原生的旧版页面，包括主页和播放页。
// @author       Motoori Kashin
// @homepageURL  https://github.com/MotooriKashin/Bilibili-Old/
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @match        *://*.bilibili.com/*
// @connect      bilibili.com
// @connect      biliplus.com
// @connect      jijidown.com
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      MIT License
// ==/UserScript==

(function() {
    'use strict';

    /*** 预处理 ***/
    let INITIAL_DOCUMENT = ""; // 网页源代码，需要时再通过url获取(尚不知如何直接从本地获取)
    let INITIAL_CONFIG = ""; // 默认配置
    let INITIAL_TITLE = document.getElementsByTagName("title"); // 网页原标题
    let INITIAL_PATH = document.location.href.split('/'); // 当前网址(以"/"分割)
    if (INITIAL_TITLE[0]) INITIAL_TITLE = INITIAL_TITLE[0].innerText;

    /*** 网页框架 ***/
    const page = {
        "watchlater" : () => {return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css"><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css"><link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css" rel="stylesheet"><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div class="z-top-container has-menu"></div><div id="watchlater-app"></div><div class="footer bili-footer"></div><script type="text/javascript">0</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script><script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/watchlater/1.watchlater.ba8f2751267792c1f4a5e3a14514e47c34afba61.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/watchlater/watchlater.ba8f2751267792c1f4a5e3a14514e47c34afba61.js"></script></body></html>';},
        "playlist"   : () => {return '<!DOCTYPE html><html><head><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=renderer content=webkit><meta name=description content=bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。><meta name=keywords content=B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid><meta name=spm_prefix content=333.44><link rel=stylesheet href=//static.hdslb.com/phoenix/dist/css/comment.min.css type=text/css><script type=text/javascript>window.spmReportData = {}window.reportConfig = { sample : 1, scrollTracker: true, msgObjects : \'spmReportData\', errorTracker: true }</script><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=renderer content=webkit><meta name=description content=bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。><meta name=keywords content=B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid><meta name=spm_prefix content=0><link href=//s1.hdslb.com/bfs/static/jinkela/playlist-video/css/playlist_video.0.87292febba67b03f65d05c15d03e325d9db4f56a.css rel=stylesheet><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div id=playlist-video-app></div><div class="footer bili-footer report-wrap-module"></div><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js></script><script type=text/javascript src=//static.hdslb.com/js/jquery.qrcode.min.js></script><script type=text/javascript charset=utf-8 src=//static.hdslb.com/common/js/footer.js></script><script type=text/javascript src=//static.hdslb.com/js/swfobject.js></script><script type=text/javascript src=//static.hdslb.com/js/video.min.js></script><script type=text/javascript src=//static.hdslb.com/mstation/js/upload/moxie.js></script><script type=text/javascript src=//static.hdslb.com/mstation/js/upload/plupload.js></script><script type=text/javascript src=//static.hdslb.com/phoenix/dist/js/comment.min.js></script><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js></script><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js></script></body></html>';},
        "bangumi"    : (INITIAL_STATE) => {return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + INITIAL_TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script><script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.764aaa07c8ac8078b639306b18838d080a1cefc1.css" /></head><body><script>window.__INITIAL_STATE__=' + INITIAL_STATE + ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());</script><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true" class="main-container"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.764aaa07c8ac8078b639306b18838d080a1cefc1.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.764aaa07c8ac8078b639306b18838d080a1cefc1.js" crossorigin="" defer="defer"></script><script type="text/javascript">0</script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>';},
        "special"    : (INITIAL_STATE) => {return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + INITIAL_TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/bangumi/play/js/promise.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.764aaa07c8ac8078b639306b18838d080a1cefc1.css" /></head><body><script>window.__INITIAL_STATE__=' + INITIAL_STATE + ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());</script><div class="z-top-container " style="height:42px"></div><div id="app" data-server-rendered="true" class="main-container special"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/manifest.3b709027.js" crossorigin defer></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/vendor.3b709027.js" crossorigin defer></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/bangumi-play.3b709027.js" crossorigin defer></script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>';},
        "video"      : (INITIAL_STATE) => {return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + INITIAL_TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" /><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}} .video-info-m .number .like b, .video-info-m .number .like i {background: url(//static.hdslb.com/images/base/icons.png);}</style></head><body><script>window.__INITIAL_STATE__=' + INITIAL_STATE + ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script> <script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true"></div><div class="bili-wrapper" id="bofqi" style="visibility: hidden;"><script type="text/javascript">function getQueryString(e){var r=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),i=window.location.search.substr(1).match(r);return null!=i?unescape(i[2]):null}window.getInternetExplorerVersion=function(){var e=-1;if("Microsoft Internet Explorer"==navigator.appName){var r=navigator.userAgent;null!=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r)&&(e=parseFloat(RegExp.$1))}return e};var vd=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.videoData;if(vd&&vd.aid&&9!==getInternetExplorerVersion()){if($("#__bofqi").innerHTML=\'<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>\',vd.embedPlayer){var p=getQueryString("p")?getQueryString("p")-1:0,player={aid:vd.aid,cid:vd.pages[p]&&vd.pages[p].cid||vd.pages[0].cid};EmbedPlayer("player","//static.hdslb.com/play.swf","cid="+player.cid+"&aid="+player.aid+"&pre_ad=")}vd.embed&&$("#bofqi").html(vd.embed)}else $("#bofqi").remove()</script></div><script>0</script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><div class="footer bili-footer report-wrap-module"></div><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script></body></html>';},
        "home"       : (INITIAL_STATE) => {return '<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><script type="text/javascript">window.__BILI_CONFIG__={"show_bv":false}</script><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css"></head><body><script>window.__INITIAL_STATE__=' + INITIAL_STATE + ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());</script><div id="home-app"></div><div id="app" data-server-rendered="true"></div><script src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin></script><script type="text/javascript" defer="defer" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script><link rel="prefetch" as="script" href="//static.hdslb.com/js/video.min.js"></body></html>';},
    }
    /*** 播放器框架 ***/
    const iframeplayer = {
        "blackboard" : (aid,cid,type) => {if (type) {return "https://www.bilibili.com/blackboard/html5player.html?aid=" + aid + "&cid=" + cid + "&as_wide=1&player_type=2&urlparam=module%253Dbangumi&crossDomain=true&season_type=" + type;}else {return "https://www.bilibili.com/blackboard/html5player.html?aid=" + aid + "&cid=" + cid + "&as_wide=1&player_type=2&urlparam=module%253Dbangumi&crossDomain=true";}},
        "playlist"   : (aid,cid,pl) => {if (pl) return "https://www.bilibili.com/blackboard/playlist-player.html?pl=" + pl; else return "https://www.bilibili.com/blackboard/playlist-player.html?aid=" + aid + "&cid=" + cid;},
        "ancient"    : (aid,cid) => {return "https://www.bilibili.com/blackboard/activity-ancient-player.html?aid=" + aid + "&cid=" + cid;},
        "normal"     : (aid,cid) => {return "https://player.bilibili.com/player.html?aid=" + aid + "&cid=" + cid + "&page=1";},
        "html"       : (aid,cid) => {return "https://www.bilibili.com/html/player.html?wmode=transparent&aid=" + aid;},
    }
    /*** 样式相关 ***/
    const cssstyle = {
        "jointime"   : ".user .info .meta .row {height: 88px;white-space: normal;}.user .info .jointime .icon {background-position: -209px -84px;}.user .info .jointime .text {color: #00a1d6;}}",
        "online"     : ".online a {color: rgb(109, 117, 122);}.popularize-module .online em {display: inline-block;height: 10px;line-height: 10px;vertical-align: top;border-left: 1px solid rgb(184, 192, 204);margin: 12px 15px 0px;}",
        "playshadow" : "#bilibiliPlayer, #bofqi.mini-player {box-shadow: 0px 2px 8px 0px rgba(0,160,216,0.3) !important;}",
        "search"     : ".search-wrap .search-block .input-wrap input {font: 400 13.3333px Arial !important;}",
        "uiface"     : "#ui-face {box-sizing: content-box;color: #fff;background-color: rgb(255,255,255);border-radius:5px;position: fixed;padding: 4px;bottom: 65px;width: 56px;height: 40px;transition: right 0.7s;-moz-transition: right 0.7s;-webkit-transition: right 0.7s;-o-transition: right 0.7s;z-index: 108;}#ui-face i {background-position: -471px -982px;display: block;width: 20px;height: 20px;margin: auto;transition: 0.2s;background-image: url(//static.hdslb.com/images/base/icons.png);}#ui-face span {font-size: 14px;display: block;width: 50%;margin: auto;transition: 0.2s;color: rgb(0,0,0)}#ui-table {box-sizing: content-box;color: #fff;background-color: rgb(255,255,255);border-radius:5px;position: fixed;padding: 4px;bottom: 30px;right: 58px;width: 200px;height: 360px;box-shadow: rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border: 1px solid rgb(233, 234, 236);overflow-y: scroll;z-index: 108;}.checke{float: right;position: relative;-webkit-appearance: none;width: 40px;height: 20px;line-height: 20px;background: #eee;border-radius: 10px;outline: none;border: 2px solid #999999;}.checke:before{position: absolute;left: 0;content: '';width: 12px;height: 12px;border-radius: 50%;background: #eee;box-shadow: 0px 0px 5px #ddd;transition: all 0.2s linear;border: 2px solid #999999;}.checke:checked{   background: #01a1d6;}.checke:checked:before{left: 20px;transition: all 0.2s linear;}",
        "bofqi"      : "#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}",
        "qingming"   : "html {filter:grayscale(100%);-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);-webkit-filter:grayscale(1);}",
    }
    /*** 调试封装 ***/
    const log = {
        "log"        : (message) => console.log("[Bilibili 旧播放页]",message),
        "error"      : (message) => console.error("[Bilibili 旧播放页]",message),
        "warn"       : (message) => console.warn("[Bilibili 旧播放页]",message),
        "debug"      : (message) => console.debug("[Bilibili 旧播放页]",message)
    }
    /*** XHR封装 ***/
    const xhr = {
        /* 同步请求，不轻易使用 */
        "false" : (url) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET',url,false);
            xhr.withCredentials = true;
            xhr.send(null);
            if (xhr.status===200) return xhr.responseText;
        },
        /* 异步请求，含cookie */
        "true"  : (url,callback,ele) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET',url,true);
            xhr.withCredentials = true;
            xhr.onload = () => callback(xhr.responseText,ele)
            xhr.onerror = () => log.error("XHR Failed url=" + url)
            xhr.send();
        },
        /* 跨域请求，需@connect */
        "GM"    : (url,callback,ele) => {
            GM_xmlhttpRequest({
                method : 'GET',
                url    : url,
                onload : (response) => callback(response.responseText,ele)
            });
        },
        /* 表单请求 */
        "post"  : (url,header,data,callback,ele) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST",url,true);
            xhr.setRequestHeader("Content-type", header);
            xhr.withCredentials = true;
            xhr.onload = () => callback(xhr.responseText,ele);
            xhr.send(data);
        }
    }
    /*** URL相关 ***/
    const url = {
        "channel"     : (mid,cid,pn) => {return "https://api.bilibili.com/x/space/channel/video?mid=" + mid + "&cid=" + cid + "&pn=" + pn + "&ps=30&order=0&jsonp=jsonp";},
        "spacedetial" : (media_id,pn) => {return "https://api.bilibili.com/medialist/gateway/base/spaceDetail?media_id=" + media_id + "&pn=" + pn + "&ps=20&keyword=&order=mtime&type=0&tid=0&jsonp=jsonp";},
        "biliplus"    : (aid) => {return "https://www.biliplus.com/video/av" + aid;},
        "online"      : () => {return "https://api.bilibili.com/x/web-interface/online";},
        "stat"        : (aid) => {return "https://api.bilibili.com/x/web-interface/archive/stat?aid=" + aid;},
        "replymain"   : (oid,type,mode) => {return "https://api.bilibili.com/x/v2/reply/main?oid=" + oid + "&type=" + type + "&plat=2&mode=" + mode;},
        "reply"       : (type,sort,oid,pn) => {return "https://api.bilibili.com/x/v2/reply?jsonp=jsonp&type=" + type + "&sort=" + sort + "&oid=" + oid + "&pn=" + pn;},
        "replycursor" : (oid,root,type) => {return "https://api.bilibili.com/x/v2/reply/reply/cursor?oid=" + oid + "&root=" + root + "&sort=0&plat=2&type=" + type;},
        "replynext"   : (oid,next,type,mode) => {return "https://api.bilibili.com/x/v2/reply/main?oid=" + oid + "&next=" + next + "&type=" + type + "&plat=2&mode=" + mode;},
        "membercard"  : (mid) => {return "https://account.bilibili.com/api/member/getCardByMid?mid=" + mid;},
        "ssid"        : (ssid) => {return "https://bangumi.bilibili.com/view/web_api/season?season_id=" + ssid;},
        "epid"        : (epid) => {return "https://bangumi.bilibili.com/view/web_api/season?ep_id=" + epid;},
        "pagelist"    : (aid) => {return "https://api.bilibili.com/x/player/pagelist?aid=" + aid + "&jsonp=jsonp";},
        "jijidown"    : (aid) => {return "https://www.jijidown.com/video/av" + aid;},
        "bvidview"    : (bvid) => {return "https://api.bilibili.com/x/web-interface/view?bvid=" + bvid;},
        "aidview"     : (aid) => {return "https://api.bilibili.com/x/web-interface/view?aid=" + aid;},
        "haslike"     : (aid) => {return "https://api.bilibili.com/x/web-interface/archive/has/like?aid=" + aid;},
        "enlike"      : () => {return "https://api.bilibili.com/x/web-interface/archive/like";},
    }
    /*** 默认设置 ***/
    let config = {
        "rewrite" : {
            "av" : 1,
            "bangumi" : 1,
            "watchlater" : 1,
            "special" : 1,
            "blackboard" : 1,
            "home" : 1,
            "playlist" : 0,
        },
        "reset" : {
            "grobalboard" : 1,
            "replyfloor" : 1,
            "headblur" : 1,
            "preview" : 1,
            "livelogo" : 1,
            "searchwrap" : 1,
            "jointime" : 1,
            "lostvideo" : 1,
            "online" : 1,
            "bvid2av" : 1,
            "selectdanmu" : 1,
            "episodedata" : 1,
            "like" : 0
        }
    }
    /*** 配置__INITIAL_STATE__ ***/
    const InitialState = {
        "bangumi" : (xhr,epId) => {
            let is;
            let ep = 0;
            try {is = JSON.parse(xhr).result;} catch (e) {log.error(e);return;}
            let ic = JSON.parse(INITIAL_DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace('INITIAL_STATE__=',"").replace(';(function',""));
            let pug = JSON.parse(INITIAL_DOCUMENT.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace('PGC_USERSTATE__=',"").replace('</script>',""));
            let dat = {"ver":{},"loginInfo":{},"canReview":false, "userShortReview":{},"userLongReview":{},"userScore":0,"userCoined":false,"isPlayerTrigger":false,"special":false,"area":0,"app":false,"recomList":[],"playerRecomList":[],"paster":{},"payPack":{},"payMent":{},"activity":{},"spending":0,"sponsorTotal":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorWeek":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorTotalCount":0,"miniOn":true,"seasonFollowed":false,"epStat":{},"ssStat":{}};
            if (epId) {
                dat.epId = 1 * epId;
                ep = 1;
            }
            else {
                dat.epId = "";
                if (pug.hasOwnProperty("progress")) {
                    dat.epId = pug.progress.last_ep_id;
                    ep = 1;
                }
            }
            dat.ssId = is.season_id;
            dat.mdId = 1 * is.link.match(/[0-9][0-9]*/)[0];
            dat.mediaInfo = {};
            dat.mediaInfo.actors = is.actors;
            dat.mediaInfo.alias = is.alias;
            dat.mediaInfo.areas = is.areas;
            dat.mediaInfo.cover = is.cover;
            dat.mediaInfo.evaluate = is.evaluate;
            dat.mediaInfo.is_paster_ads = is.is_paster_ads;
            dat.mediaInfo.jp_title = is.jp_title;
            dat.mediaInfo.link = is.link;
            dat.mediaInfo.media_id = is.media_id;
            dat.mediaInfo.mode = is.mode;
            dat.mediaInfo.season_id = is.season_id;
            dat.mediaInfo.season_status = is.season_status;
            dat.mediaInfo.season_title = is.season_title;
            dat.mediaInfo.season_type = is.season_type;
            dat.mediaInfo.series_title = is.series_title;
            dat.mediaInfo.square_cover = is.square_cover;
            dat.mediaInfo.staff = is.staff;
            dat.mediaInfo.style = is.style;
            dat.mediaInfo.title = is.title;
            dat.mediaInfo.total_ep = is.total_ep;
            dat.mediaRating = is.rating;
            dat.epList = is.episodes;
            if (ep==0) dat.epId=dat.epList[0].ep_id;
            for (let i=0;i<dat.epList.length;i++) if(dat.epList[i].ep_id == dat.epId) dat.epInfo = dat.epList[i];
            dat.newestEp = is.newest_ep;
            dat.seasonList = is.seasons;
            if (!dat.seasonList) dat.seasonList = ic.sections;
            dat.seasonStat = {"views":0,"danmakus":0,"coins":0,"favorites":0};
            dat.userStat = {"loaded":true,"error":false,"follow":0,"pay":0,"payPackPaid":0,"sponsor":0};
            dat.userStat.watchProgress = pug.progress;
            dat.userStat.vipInfo = pug.vip_info;
            dat.upInfo = is.up_info;
            dat.rightsInfo = is.rights;
            dat.pubInfo = is.publish;
            if (pug.dialog || pug.pay == 1) {
                dat.payMent = {"price":"0.0","promotion":"","tip":"大会员专享观看特权哦~"};
                if (pug.dialog) {
                    dat.payMent.vip_promotion = pug.dialog.title;
                    if (pug.dialog.btn_left) dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];
                }
            }
            log.log("Bangumi __INITIAL_STATE__ Build SUCCESS!");
            return dat;
        },
        "special" : (xhr,epId) => {
            let ini;
            let ep = 0;
            try {ini = JSON.parse(xhr).result;} catch(e) {log.error(e);return;}
            let pug = JSON.parse(INITIAL_DOCUMENT.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace('PGC_USERSTATE__=',"").replace('</script>',""));
            let is = JSON.parse(INITIAL_DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace('INITIAL_STATE__=',"").replace(';(function',""));
            let dat = {"ver":{"mobile":false,"ios":false,"android":false,"windowsPhone":false,"iPhone":false,"ios9":false,"iPad":false,"webApp":false,"microMessenger":false,"weibo":false,"uc":false,"qq":false,"baidu":false,"mqq":false,"mBaidu":false,"iqiyi":false,"qqLive":false,"safari":true,"youku":false,"ie":false,"edge":false,"bili":false,"biliVer":0},"loginInfo":{},"canReview":false,"userShortReview":{},"userLongReview":{},"userScore":0,"userCoined":false,"isPlayerTrigger":false,"special":true,"area":0,"app":false,"mediaRating":{},"recomList":[],"playerRecomList":[],"paster":{},"payPack":{},"payMent":{},"activity":{},"spending":0,"sponsorTotal":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorWeek":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorTotalCount":0,"miniOn":true,"seasonFollowed":false};
            if (epId) {
                dat.epId = 1 * epId;
                ep = 1;
            }
            else {
                dat.epId = "";
                if (pug.hasOwnProperty("progress")) {
                    dat.epId = pug.progress.last_ep_id;
                    ep = 1;
                }
            }
            dat.ssId = ini.season_id;
            dat.mdId = 1 * ini.link.match(/[0-9][0-9]*/)[0];
            dat.mediaInfo = {};
            dat.mediaInfo.actors = ini.actors;
            dat.mediaInfo.alias = ini.alias;
            dat.mediaInfo.areas = ini.areas;
            dat.mediaInfo.bkg_cover = ini.bkg_cover;
            dat.mediaInfo.cover = ini.cover;
            dat.mediaInfo.evaluate = ini.evaluate;
            dat.mediaInfo.is_paster_ads = ini.is_paster_ads;
            dat.jp_title = ini.jp_title;
            dat.mediaInfo.link = ini.link;
            dat.mediaInfo.media_id = ini.media_id;
            dat.mediaInfo.mode = ini.mode;
            dat.mediaInfo.season_id = ini.season_id;
            dat.mediaInfo.season_status = ini.season_status;
            dat.mediaInfo.season_title = ini.season_title;
            dat.mediaInfo.season_type = ini.season_type;
            dat.mediaInfo.square_cover = ini.square_cover;
            dat.mediaInfo.staff = ini.staff;
            dat.mediaInfo.stat = ini.state;
            dat.mediaInfo.style = ini.style;
            dat.mediaInfo.title = ini.title;
            dat.mediaRating = ini.rating;
            dat.epList = ini.episodes;
            if (ep==0) dat.epId = dat.epList[0].ep_id;
            for (let i=0;i<dat.epList.length;i++) if (dat.epList[i].ep_id == dat.epId) dat.epInfo = dat.epList[i];
            dat.newestEp = ini.newest_ep;
            dat.seasonList = ini.seasons;
            if (!dat.seasonList) dat.seasonList = is.sections;
            dat.seasonStat = {"views":0,"danmakus":0,"coins":0,"favorites":0};
            dat.userStat = {"loaded":false,"error":false,"follow":0,"pay":0,"payPackPaid":0,"sponsor":0};
            dat.userStat.watchProgress = pug.progress;
            dat.userStat.vipInfo = pug.vip_info;
            dat.upInfo = ini.up_info;
            dat.rightsInfo = ini.rights;
            dat.pubInfo = ini.publish;
            if (pug.dialog || pug.pay == 1) {
                dat.payMent = {"price":"0.0","promotion":"","tip":"大会员专享观看特权哦~"};
                if (pug.dialog) {
                    dat.payMent.vip_promotion = pug.dialog.title;
                    if (pug.dialog.btn_left) dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];
                }
            }
            log.log("Special __INITIAL_STATE__ Build SUCCESS!");
            return dat;
        },
        "home" : (ini) => {
            let dat = {};
            ini = JSON.parse(ini);
            dat.recommendData = [];// ini.recommendList;
            for (let i=0;i<ini.recommendList.length;i++) {
                dat.recommendData[i] = {};
                dat.recommendData[i].aid = ini.recommendList[i].aid;
                dat.recommendData[i].typename = ini.recommendList[i].tname;
                dat.recommendData[i].title = ini.recommendList[i].title;
                dat.recommendData[i].subtitle = "";
                dat.recommendData[i].play = ini.recommendList[i].stat.view;
                dat.recommendData[i].review = ini.recommendList[i].stat.reply;
                dat.recommendData[i].video_review = "";
                dat.recommendData[i].favorites = ini.recommendList[i].stat.favorite;
                dat.recommendData[i].mid = ini.recommendList[i].owner.mid;
                dat.recommendData[i].author = ini.recommendList[i].owner.name;
                dat.recommendData[i].create = ini.recommendList[i].pubdate;
                dat.recommendData[i].pic = ini.recommendList[i].pic;
                dat.recommendData[i].coins = ini.recommendList[i].stat.coin;
                dat.recommendData[i].duration = ini.recommendList[i].duration;
                dat.recommendData[i].badgepay = false;
                dat.recommendData[i].rights = ini.recommendList[i].rights;
            }
            dat.locsData = ini.locsData;
            dat.locsData[23] = ini.locsData[3197];
            log.log("Home __INITIAL_STATE__ Build SUCCESS!");
            return dat;
        },
    }
    /*** 函数相关 ***/
    const functionInterface = {
        "timeFormat" : (time) => {
            // 格式化时间：xxxx-xx-xx xx:xx:xx
            let date = new Date(time);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
            let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            let m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
            return Y+M+D+h+m+s;
        },
        "chansId" : (x) => {
            // bvid <=> aid
            let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            let tr = {};
            let s = [11,10,3,8,4,6];
            let xor = 177451812;
            let add = 8728348608;
            for (let i=0;i<58;i++) tr[table[i]] = i;
            if (!(1 * x)) {
                let r = 0;
                for (let i=0;i<6;i++) r += tr[x[s[i]]]*58**i;
                return (r-add)^xor;
            }
            else {
                x = (x^xor) + add;
                let r = ['B','V',1,'','',4,'',1,'',7,'',''];
                for (let i=0;i<6;i++) r[s[i]] = table[parseInt(x/58**i)%58];
                return r.join("");
            }
        },
        "getCookies" : () => {
            // 返回cookie对象
            let cookies = document.cookie.split('; ');
            let obj = cookies.reduce((pre, next) => {
                let key = next.split('=')[0];
                let val = next.split('=')[1];
                pre[key] = val;
                return pre;
            },{});
            return obj;
        },
        "setGlobalStyle" : () => {
            // 添加全局样式
            let player_shadow = cssstyle.playshadow;
            let search_wrap = cssstyle.search;
            let qingming = "";//cssstyle.qingming;
            let ui = cssstyle.uiface;
            let style = document.createElement("style");
            if (!config.reset.playershadow) player_shadow = "";
            if (!config.reset.searchwrap) search_wrap = "";
            //if (Date.parse(new Date()) > 1586016000000) qingming = "";
            style.setAttribute("type","text/css");
            document.head.appendChild(style);
            style.appendChild(document.createTextNode(player_shadow + search_wrap + ui + qingming));
        },
        "rewritePage" : (html) => {
            // 重写网页框架
            document.open();
            document.write(html);
            document.close();
        },
        "selectDanmu" : () => {
            // 切换到弹幕列表
            let setdanmu = document.getElementsByClassName("bilibili-player-filter-btn")[1];
            if (setdanmu) setdanmu.click();
        },
        "deleteElement" : () => {
            // 去除失效项目
            let head = document.getElementsByClassName("bili-header-m");
            let new_entry = document.getElementsByClassName("new-entry")[0];
            let app = document.getElementById("fixed_app_download");
            let ver = document.getElementsByClassName("ver")[0];
            if (head[1]) {
                head[1].remove();
                try {document.getElementById("bofqi").removeAttribute("style");} catch (e) {}
            }
            if (new_entry) new_entry.setAttribute("style","visibility: hidden;");
            if (ver) ver.remove();
            if (app) app.remove();
        },
        "setMiniHead" : (ele) => {
            // 替换迷你版头
            let div = document.createElement("div");
            div.setAttribute("class","z-top-container");
            ele.replaceWith(div);
            let script = document.createElement("script");
            script.setAttribute("type","text/javascript");
            script.setAttribute("src","//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
            document.body.appendChild(script);
        },
        "setTotalHead" : (ele) => {
            // 替换完整版头
            let div = document.createElement("div");
            div.setAttribute("class","z-top-container has-menu");
            ele.replaceWith(div);
            let script = document.createElement("script");
            script.setAttribute("type","text/javascript");
            script.setAttribute("src","//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
            document.body.appendChild(script);
        },
        "setFoot" : (ele) => {
            // 替换版底
            let div = document.createElement("div");
            div.setAttribute("class","footer bili-footer report-wrap-module");
            div.setAttribute("id","home_footer");
            ele.replaceWith(div);
            let script = document.createElement("script");
            script.setAttribute("type","text/javascript");
            script.setAttribute("src","//static.hdslb.com/common/js/footer.js");
            document.body.appendChild(script);
        },
        "removeBlur" : () => {
            // 调整顶栏全透明
            let blur = document.getElementsByClassName("blur-bg");
            if (blur[0]) blur[0].removeAttribute("style");
        },
        "removePreview" : () => {
            // 倒计时移除预览框
            let hint = document.getElementsByClassName("video-float-hint-btn");
            if (hint[0]) {
                let i = 10; // 倒计时长度，单位：秒
                if (document.getElementsByClassName("second-cut")[0]) return;
                else {
                    let sec = document.createElement("span");
                    sec.setAttribute("class","video-float-hint-btn second-cut");
                    hint[0].parentNode.appendChild(sec);
                    function cut(){
                        sec.innerText = i - 1 + "s";
                        if (i==0) {
                            hint[0].parentNode.remove();
                            return;
                        }
                        i = i - 1;
                        window.setTimeout(cut,1000);
                    }
                    new cut();
                }
            }
        },
        "removeLiveLogo" : () => {
            // 移除直播水印
            let logo = document.getElementsByClassName("bilibili-live-player-video-logo");
            if (logo[0]) logo[0].remove();
        },
        "setJoinTime" : (data) => {
            // 添加注册时间显示，依赖开放隐私设置
            try {data = JSON.parse(data);} catch (e) {log.error(e);log.debug(data);return;}
            let jointime = functionInterface.timeFormat(data.card.regtime * 1000); // 时间戳不是13位，主动补位
            let birthdate = data.card.birthday;
            document.addEventListener("DOMNodeInserted",(msg) => {
                let birthday = document.getElementsByClassName("birthday");
                if (birthday[0]) {
                    if (document.getElementsByClassName("jointime")[0]) return;
                    else {
                        let div = document.createElement("div");
                        let icon = document.createElement("span");
                        let text = document.createElement("span");
                        let style = document.createElement("style");
                        div.setAttribute("class","item jointime");
                        birthday[0].parentNode.appendChild(div);
                        icon.setAttribute("class","icon");
                        div.appendChild(icon);
                        text.setAttribute("class","text");
                        text.innerText = jointime;
                        div.appendChild(text);
                        style.setAttribute("type","text/css");
                        document.head.appendChild(style);
                        style.appendChild(document.createTextNode(cssstyle.jointime));
                    }
                }
            });
        },
        "setFavlist" : (src) => {
            // 处理失效频道视频
            let cid,mid,pn;
            src = src.split('?')[1].split('&');
            for (let i=0;i<src.length;i++) {
                let key = src[i].split('=');
                if (key[0] == "cid") cid = key[1];
                if (key[0] == "mid") mid = key[1];
                if (key[0] == "pn") pn = key[1];
            }
            let small_item = document.getElementsByClassName("small-item");
            let item_change = "small-item fakeDanmu-item";
            if (small_item[0]) {
                for (let i=0;i<small_item.length;i++) {
                    if (small_item[i].getElementsByClassName("title")[0].text == "已失效视频") {
                        small_item[i].getElementsByClassName("title")[0].text = "Loading";
                        small_item[i].setAttribute("class",item_change);
                        if (!window.tid) {
                            window.tid = Date.parse(new Date());
                            xhr.true(url.channel(mid,cid,pn),functionInterface.callbackRefav);
                        }
                        else {
                            if (Date.parse(new Date()) - window.tid >= 1000) {
                                window.tid = Date.parse(new Date());
                                xhr.true(url.channel(mid,cid,pn),functionInterface.callbackRefav);
                            }
                        }
                    }
                }
            }
        },
        "callbackRefav" : (data) => {
            // 频道视频数据
            try {data = JSON.parse(data).data;} catch (e) {log.error(e);log.debug(data);return;}
            let disabled = document.getElementsByClassName("small-item");
            for (let i=0;i<disabled.length;i++) {
                let aid = disabled[i].getAttribute("data-aid") * 1;
                let title = "av" + aid;
                if (data.list.archives[i].title) title = data.list.archives[i].title;
                let a = disabled[i].getElementsByClassName("cover")[0];
                let img = disabled[i].getElementsByTagName("img")[0];
                let txt = disabled[i].getElementsByClassName("title")[0];
                if (txt.text == "Loading") {
                    if (aid) {
                        log.log("失效视频：AV" + aid);
                        txt.setAttribute("href","//www.bilibili.com/video/av" + aid);
                        a.setAttribute("href","//www.bilibili.com/video/av" + aid);
                    }
                    else {
                        aid = disabled[i].getAttribute("data-aid");
                        log.log("失效视频：" + aid);
                        txt.setAttribute("href","//www.bilibili.com/video/" + aid);
                        a.setAttribute("href","//www.bilibili.com/video/" + aid);
                    }
                    a.setAttribute("target","_blank");
                    a.setAttribute("class","cover cover-normal");
                    img.setAttribute("alt",title);
                    img.setAttribute("src",data.list.archives[i].pic.replace("http","https") + "@380w_240h_100Q_1c.webp");
                    txt.setAttribute("target","_blank");
                    txt.setAttribute("title",title);
                    txt.setAttribute("style","text-decoration: line-through;color: #ff0000;");
                    txt.text = title;
                }
            }
        },
        "refav" : (ele) => {
            // 处理失效收藏视频
            let aid = ele.getAttribute("data-aid");
            if (1 * aid) xhr.GM(url.jijidown(aid),functionInterface.callbackFav,ele);
            else xhr.GM(url.jijidown(functionInterface.chansId(aid)),functionInterface.callbackFav,ele);
        },
        "callbackFav" : (data,ele) => {
            // 收藏视频第三方数据
            let aid = functionInterface.chansId(ele.getAttribute("data-aid"));
            let title,cover;
            try {
                data.match('window._INIT')[0];
                title = data.match(/\<title\>.+?\-哔哩哔哩唧唧/)[0].replace('<title>',"").replace('-哔哩哔哩唧唧',"");
                cover = data.match(/"img\":\ \".+?\",/)[0].replace('"img": "',"").replace('",',"");
                cover.match('hdslb')[0];
            }
            catch (e) {
                try {
                    data.match('哔哩哔哩唧唧')[0];
                    xhr.GM(url.biliplus(aid),functionInterface.callbackFav,ele);
                    return;
                }
                catch (e) {
                    try {
                        data.match(/\<title\>.+?\ \-\ AV/)[0];
                        title = data.match(/\<title\>.+?\ \-\ AV/)[0].replace('<title>',"").replace(' - AV',"");
                        cover = data.match(/\<img style=\"display:none\"\ src=\".+?\"\ alt/)[0].replace('<img style="display:none" src="',"").replace('" alt',"");
                    }
                    catch (e) {
                        title = "AV" + aid;
                    }
                }
            }
            log.log("失效视频：AV" + aid);
            let img = ele.getElementsByTagName("img")[0];
            let txt = ele.getElementsByClassName("title")[0];
            img.setAttribute("src",cover + "@380w_240h_100Q_1c.webp");
            img.setAttribute("alt",title);
            txt.setAttribute("href","//www.bilibili.com/video/av" + aid);
            txt.setAttribute("title",title);
            txt.setAttribute("style","text-decoration: line-through;color: #ff0000;");
            txt.text = title;
            ele.setAttribute("class","small-item");
            ele.firstChild.setAttribute("href","//www.bilibili.com/video/av" + aid);
            ele.firstChild.setAttribute("target","_blank");
            ele.firstChild.setAttribute("class","cover cover-normal");
        },
        "setChannelItem" : () => {
            // 空间主页展示的失效视频
            let small_item = document.getElementsByClassName("small-item");
            if (small_item[0]) {
                for (let i=0;i<small_item.length;i++) {
                    if (small_item[i].getAttribute("class") == "small-item disabled") {
                        small_item[i].setAttribute("class","small-item fakeDanmu-item");
                        let aid = small_item[i].getAttribute("data-aid") * 1;
                        let a = small_item[i].getElementsByClassName("cover")[0];
                        let img = small_item[i].getElementsByTagName("img")[0].alt;
                        let txt = small_item[i].getElementsByClassName("title")[0];
                        if (aid) {
                            log.log("失效视频：AV" + aid);
                            txt.setAttribute("href","//www.bilibili.com/video/av" + aid);
                            a.setAttribute("href","//www.bilibili.com/video/av" + aid);
                        }
                        else {
                            aid = small_item[i].getAttribute("data-aid");
                            log.log("失效视频：" + aid);
                            txt.setAttribute("href","//www.bilibili.com/video/" + aid);
                            a.setAttribute("href","//www.bilibili.com/video/" + aid);
                        }
                        a.setAttribute("target","_blank");
                        a.setAttribute("class","cover cover-normal");
                        txt.setAttribute("target","_blank");
                        txt.setAttribute("title",img);
                        txt.setAttribute("style","text-decoration: line-through;color: #ff0000;");
                        txt.text = img;
                    }
                }
            }
        },
        "setOnline" : () => {
            // 添加B站主页在线显示
            let style = document.createElement("style");
            style.setAttribute("type","text/css");
            document.head.appendChild(style);
            style.appendChild(document.createTextNode(cssstyle.online));
            let ck_online = window.setInterval(() => {
                let online = document.getElementsByClassName("online");
                if (online[0]) {
                    window.clearInterval(ck_online);
                    xhr.true(url.online(),functionInterface.callbackOnline);
                }
            },1000);
        },
        "callbackOnline" : (data) => {
            // 在线数据
            try {data = JSON.parse(data).data;} catch (e) {log.error(e);log.debug(data);return;}
            let all_count = data.all_count;
            let web_online = data.web_online;
            let play_online = data.play_online;
            let online = document.getElementsByClassName("online")[0];
            if (online.tagName == "DIV") online = online.getElementsByTagName("a")[0];
            else {
                let parent = online.parentNode;
                online.remove();
                let div = document.createElement("div");
                let a = document.createElement("a");
                div.setAttribute("class","online");
                parent.insertBefore(div,parent.firstChild);
                a.setAttribute("href","//www.bilibili.com/video/online.html");
                a.setAttribute("target","_blank");
                div.appendChild(a);
                online = a;
            }
            online.setAttribute("title","在线观看：" + play_online);
            online.text = "在线人数：" + web_online;
            log.log("在线人数：" + web_online + " 在线观看：" + play_online + " 最新投稿：" + all_count);
            if (!online.parentNode.getElementsByTagName("em")[0]) {
                let em = document.createElement("em");
                let count = document.createElement("a");
                online.parentNode.insertBefore(em,online.nextSibling);
                count.setAttribute("href","//www.bilibili.com/newlist.html");
                count.setAttribute("target","_blank");
                online.parentNode.insertBefore(count,em.nextSibling);
                count.text = "最新投稿：" + all_count;
            }
            else {
                let count = online.parentNode.getElementsByTagName("a")[1];
                count.text = "最新投稿：" + all_count;
            }
            window.setTimeout(functionInterface.setOnline,60000);
        },
        "setBangumi" : (data) => {
            // 添加番剧分集数据
            if (data.epList[1] && (data.epList[0].aid != data.epList[1].aid)) {
                window.aid = data.epInfo.aid;
                let wait = window.setInterval(() => {
                    if (document.getElementsByClassName("info-sec-av")[0]) {
                        functionInterface.setEpisodeData("first");
                        window.clearInterval(wait);
                    }
                },1000);
                window.setTimeout(() => {window.clearInterval(wait);},10000);
                document.addEventListener("DOMNodeInserted",(msg) => {
                    if (msg.relatedNode.className == "info-sec-av") {
                        window.aid = msg.relatedNode.innerText.match(/[0-9]+/)[0];
                        functionInterface.setEpisodeData();
                    }
                });
            }
        },
        "setEpisodeData" : (data) => {
            // 番剧分集数据
            let views = document.getElementsByClassName("view-count")[0].getElementsByTagName("span")[0];
            let danmakus = document.getElementsByClassName("danmu-count")[0].getElementsByTagName("span")[0];
            if (data == "first") {
                if (views.innerText == "-" && danmakus.innerText == "-") {
                    window.setTimeout(() => {functionInterface.setEpisodeData("first");},100);
                    return;
                }
                views.setAttribute("title","总播放数 " + views.innerText); // 备份总播放数
                danmakus.setAttribute("title","总弹幕数 " + danmakus.innerText); // 备份总弹幕数
                log.log("合计播放：" + views.innerText + " 合计弹幕：" + danmakus.innerText);
                xhr.true(url.stat(window.aid),functionInterface.setEpisodeData);
                return;
            }
            if (!data) {
                xhr.true(url.stat(window.aid),functionInterface.setEpisodeData);
                return;
            }
            try {data = JSON.parse(data).data;} catch (e) {log.error(e);log.debug(data);return;}
            let view = data.view;
            let danmaku = data.danmaku;
            if (view>=10000) view = (view / 10000).toFixed(1) + "万";
            if (danmaku>=10000) danmaku = (danmaku / 10000).toFixed(1) + "万";
            views.innerText = view;
            danmakus.innerText = danmaku;
            log.log("播放：" + view + " 弹幕：" + danmaku);
        },
        "setReplyFloor" : (src) => {
            // 添加评论的楼层信息
            let oid,sort,pn;
            src = src.split('?')[1].split('&');
            for (let i=0;i<src.length;i++) {
                let key = src[i].split('=');
                if (key[0] == "oid") oid = key[1];
                if (key[0] == "sort") sort = key[1]; // 0:默认排序；1：按回复数；2：按赞同数；
                if (key[0] == "pn") pn = key[1];
                if (key[0] == "type") window.type = key[1];
            }
            /* 0:热门评论；1：评论；2：最新评论；*/
            if (sort==0) window.mode = 1;
            if (sort==1) return;
            if (sort==2) window.mode = 0;
            if (pn==1) xhr.true(url.replymain(oid,window.type,window.mode),functionInterface.callbackReplyFloor);
            else {
                if (sort==2) return;
                pn = pn - 1;
                xhr.true(url.reply(window.type,sort,oid,pn),functionInterface.callbackReplyPrev);
            }
        },
        "callbackReplyPrev" : (data) => {
            // 上一页评论数据
            try {data = JSON.parse(data).data;} catch(e) {log.error(e);log.debug(data);return;}
            let i = data.replies.length - 1;
            let oid = data.replies[0].oid;
            let root = data.replies[i].rpid;
            xhr.true(url.replycursor(oid,root,window.type),functionInterface.callbackReplyCursor);
        },
        "callbackReplyCursor" : (data) => {
            // 上一条评论数据
            try {data = JSON.parse(data).data;} catch (e) {log.error(e);log.debug(data);return;}
            let oid = data.root.oid;
            let next = data.root.floor;
            xhr.true(url.replynext(oid,next,window.type,window.mode),functionInterface.callbackReplyFloor);
        },
        "callbackReplyFloor" : (data) => {
            // 当前评论数据
            try {data = JSON.parse(data).data;} catch (e) {log.error(e);log.debug(data);return;}
            let floor = {};
            let top = data.top;
            let hots = data.hots;
            let replies = data.replies;
            let list_item = document.getElementsByClassName("list-item");
            let main_floor = document.getElementsByClassName("main-floor");
            if (hots && hots[0]) for (let i=0;i<hots.length;i++) floor[hots[i].rpid] = hots[i].floor;
            if (replies && replies[0]) for (let i=0;i<replies.length;i++) floor[replies[i].rpid] = replies[i].floor;
            if (top && top.admin) floor[top.admin.rpid] = top.admin.floor;
            if (top && top.upper) floor[top.upper.rpid] = top.upper.floor;
            if (top && top.vote) floor[top.vote.rpid] = top.vote.floor;
            if (main_floor[0]) {
                for (let i=0;i<main_floor.length;i++) {
                    let rpid = main_floor[i].getAttribute("id").split('_')[2];
                    // 老版评论直接写入floor
                    if (rpid in floor) main_floor[i].getElementsByClassName("floor-num")[0].innerText = "#" + floor[rpid];
                }
            }
            if (list_item[0]) {
                for (let i=0;i<list_item.length;i++) {
                    let rpid = list_item[i].getAttribute("data-id");
                    if (rpid in floor) {
                        let node = list_item[i].getElementsByClassName("info")[0];
                        // 新版评论需另外创建floor
                        let span = document.createElement("span");
                        span.setAttribute("class","floor");
                        span.innerText = "#" + floor[rpid];
                        node.insertBefore(span,node.firstChild);
                    }
                }
            }
        },
        "setPlayList" : () =>{
            // 处理播单页失效版头，修改播放器布局
            window.onload = () => {
                let div = document.createElement("div");
                div.setAttribute("class","z-top-container has-menu");
                document.body.insertBefore(div,document.body.firstChild);
                let script = document.createElement("script");
                script.setAttribute("type","text/javascript");
                script.setAttribute("src","//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
                document.body.appendChild(script);
                let style = document.createElement("style");
                style.setAttribute("type","text/css");
                document.head.appendChild(style);
                style.appendChild(document.createTextNode(cssstyle.bofqi));
            }
        },
        "setLike" : () => {
            // 添加av(BV)页点赞功能
            let coin = document.getElementsByClassName("c-icon-move");
            let number = document.getElementsByClassName("number");
            let node = document.getElementsByClassName("coin");
            let timer = window.setInterval(() => {
                if (coin[0]) {
                    window.clearInterval(timer);
                    let span = document.createElement("span");
                    let bef = document.createElement("i");
                    let af = document.createElement("b");
                    let text = document.createTextNode("点赞 --");
                    span.setAttribute("class","u like");
                    span.setAttribute("style","margin-right: 5px;");
                    span.appendChild(bef);
                    span.appendChild(af);
                    span.appendChild(text);
                    bef.setAttribute("class","l-icon-move");
                    bef.setAttribute("style","width: 22px;height: 22px;background-position: -660px -2068px;");
                    af.setAttribute("class","l-icon-moved");
                    af.setAttribute("style","width: 22px;height: 22px;background-position: -725px -2068px;display: none;");
                    number[0].insertBefore(span,node[0]);
                    xhr.true(url.aidview(window.aid),functionInterface.callbackLike,text);
                }
            },100);
        },
        "callbackLike" : (data,ele) => {
            // 点赞数据
            try {data = JSON.parse(data).data.stat.like;} catch (e) {log.error(e);return;}
            document.getElementsByClassName("like")[0].setAttribute("title","点赞人数" + data);
            if (data>10000) data = (data/10000).toFixed(1) + "万";
            let text = document.createTextNode(" 点赞 " + data);
            ele.replaceWith(text);
            xhr.true(url.haslike(window.aid),functionInterface.callbackHasLike,text);
        },
        "callbackHasLike" : (data,ele) => {
            // 点赞情况
            if (JSON.parse(data).data >= 0) {
            data = JSON.parse(data).data;
                if (data) {
                    document.getElementsByClassName("l-icon-move")[0].setAttribute("style","width: 22px;height: 22px;background-position: -660px -2068px;display: none;");
                    document.getElementsByClassName("l-icon-moved")[0].setAttribute("style","width: 22px;height: 22px;background-position: -725px -2068px;");
                }
                else {
                    document.getElementsByClassName("l-icon-move")[0].onclick = () => {
                        let msg = "aid=" + window.aid + "&like=1&csrf=" + functionInterface.getCookies().bili_jct;
                        xhr.post(url.enlike(),"application/x-www-form-urlencoded",msg,functionInterface.callbackEnLike,ele);
                    }
                }
            }
            else document.getElementsByClassName("l-icon-move")[0].onclick = () => document.getElementsByClassName("c-icon-move")[0].click();
        },
        "callbackEnLike" : (data,ele) => {
            // 点赞成功
            try {data = JSON.parse(data).ttl;} catch (e) {log.error(e);return;}
            document.getElementsByClassName("l-icon-move")[0].setAttribute("style","width: 22px;height: 22px;background-position: -660px -2068px;display: none;");
            document.getElementsByClassName("l-icon-moved")[0].setAttribute("style","width: 22px;height: 22px;background-position: -725px -2068px;");
            if (ele.nodeValue.match("万")) return;
            let number = 1 * ele.nodeValue.match(/[0-9]+/) + 1;
            ele.replaceWith(document.createTextNode(" 点赞 " + number));
        },
        "avdesc" : () => {
            // 视频简介中BV转超链接
            let desc = document.getElementsByClassName("info");
            if (INITIAL_PATH[3] != 'video') return;
            if (desc[1] && desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i)) {
                let paster = desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i);
                for (let i=0;i<paster.length;i++){
                    let newer = "av" + functionInterface.chansId(paster[i]);
                    newer = '<a target="_blank" href="//www.bilibili.com/video/' + newer + '">' + newer + '</a>';
                    desc[1].innerHTML = desc[1].outerHTML.replace(paster[i],newer);
                }
            }
        },
    }
    /* 交互界面 */
    const UIInterface = {
        "start" : () => {
            // 设置入口
            let ui_face = document.createElement("div");
            let enter = document.createElement("span");
            let icon = document.createElement("i");
            ui_face.setAttribute("class","bili-old ui-face");
            ui_face.setAttribute("id","ui-face");
            ui_face.setAttribute("style","right: -54px;");
            ui_face.onmouseover = () => ui_face.setAttribute("style","right: 0px;box-shadow: rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border: 1px solid rgb(233, 234, 236);");
            ui_face.onmouseout = () => ui_face.setAttribute("style","right: -54px;");
            ui_face.onclick = () => {
                let table = document.getElementsByClassName("ui-table");
                if (!table[0]) UIInterface.table();
                else {
                    if (table[0].getAttribute("hidden")) table[0].removeAttribute("hidden");
                    UIInterface.table();
                }
            }
            ui_face.appendChild(icon);
            ui_face.appendChild(enter);
            enter.innerText = "设置";
            let timer = window.setInterval(() => {
                if (document.body) {
                    window.clearInterval(timer);
                    document.body.appendChild(ui_face);
                }
            },1000);
        },
        "table" : () => {
            // 设置选项
            let table = document.getElementsByClassName("ui-table");
            let timer;
            if (!table[0]) {
                table = document.createElement("div");
                table.setAttribute("class","bili-old ui-table");
                table.setAttribute("id","ui-table");
                let info = document.createElement("span");
                let rec = document.createElement("span");
                info.setAttribute("style","color: rgb(0,0,0);font-size: 14px;");
                info.innerText = "BilibiliOld 设置";
                table.appendChild(info);
                rec.setAttribute("style","color: blue;float: right;font-size: 12px;");
                rec.innerText = "恢复默认";
                rec.onclick = () => {
                    config = INITIAL_CONFIG;
                    log.log(config);
                    localStorage.setItem("LSBOC",JSON.stringify(config));
                    table.remove();
                }
                table.appendChild(rec);
                for (let key in config.rewrite) UIInterface.setTable(table,UIInterface.menu[key],config.rewrite[key],key);
                for (let key in config.reset) UIInterface.setTable(table,UIInterface.menu[key],config.reset[key],key);
                document.body.appendChild(table);
            }
            else table = table[0];
            table.onmouseover = () => window.clearTimeout(timer);
            table.onmouseout = () => {
                timer = window.setTimeout(() => {
                    table.setAttribute("hidden","hidden");
                    localStorage.setItem("LSBOC",JSON.stringify(config));
                },1000);
            }
        },
        "setTable" : (ele,name,check,key) => {
            // 选项数据
            let div = document.createElement("div");
            let span = document.createElement("span");
            let input = document.createElement("input");
            ele.appendChild(div);
            div.setAttribute("style","padding: 4px 4px 0px 4px;clear: both;");
            if (document.getElementsByClassName("checke")[0]) div.setAttribute("style","padding: 0px 4px 0px 4px;clear: both;");
            div.appendChild(span);
            div.appendChild(input);
            span.setAttribute("style","float: left;display: inline-block;color: rgb(0,0,0);font-size: 14px;");
            span.setAttribute("title",name[1]);
            span.innerText = name[0];
            input.setAttribute("type","checkbox");
            input.setAttribute("class","checke");
            if (check) input.checked = true;
            input.onclick = () => {
                if (input.checked){
                    if (key in config.rewrite) config.rewrite[key] = 1;
                    else config.reset[key] = 1;
                }
                else {
                    if (key in config.rewrite) config.rewrite[key] = 0;
                    else config.reset[key] = 0;
                }
            }
        },
        "menu" : {
            /* 选项说明 */
            "av" : ["av(BV)","启用旧版av(BV)页"],
            "bangumi" : ["Bangumi","启用旧版番剧页"],
            "watchlater" : ["稍后再看","启用旧版稍后再看"],
            "special" : ["special","启用旧版特殊播放页"],
            "blackboard" : ["嵌入式播放器","替换嵌入式播放器"],
            "home" : ["主页","启用旧版Bilibili主页"],
            "playlist" : ["playlist","(切莫开启！！！)启用旧版播单页"],
            "grobalboard" : ["版头和版底","替换新版版头和版底"],
            "replyfloor" : ["评论楼层","显示评论的楼层信息"],
            "headblur" : ["顶栏透明度","使顶栏全透明"],
            "preview" : ["付费预览框","关闭播放器左下角付费预览框"],
            "livelogo" : ["直播水印","去除直播间Bilibili字样的水印"],
            "searchwrap" : ["搜索框字体","重设搜索页搜索字体大小"],
            "jointime" : ["注册时间","在个人空间显示B站账号注册时间"],
            "lostvideo" : ["失效视频","修复收藏和频道中的失效视频信息"],
            "online" : ["在线数据","恢复Bilibili主页在线人数及投稿数"],
            "bvid2av" : ["BV页跳转av页","BV页强制跳转av页"],
            "selectdanmu" : ["弹幕列表","自动展示播放器的弹幕列表而不是推荐视频"],
            "episodedata" : ["番剧分集数据","显示连载番剧单回的播放数和弹幕数"],
            "like" : ["点赞","启用旧版av(BV)页添加点赞功能"]
        }
    }
    /* 修改相关 */
    const global = {
        "rewriteSction" : () => {
            // 重写版面
            if (!config.reset.grobalboard) return;
            document.addEventListener("DOMNodeInserted",(msg) => {
                if (document.getElementById("international-home-app")) return;
                let inh = document.getElementById("internationalHeader");
                let erh = document.getElementsByClassName("header");
                let ctn = document.getElementsByClassName("z_top_container");
                let inf = document.getElementsByClassName("international-footer");
                if (inh) {
                    let ppt = document.getElementById("primaryPageTab");
                    if (ppt) {
                        functionInterface.setTotalHead(inh);
                    }
                    else {
                        functionInterface.setMiniHead(inh);
                    }
                }
                if (inf[0]) functionInterface.setFoot(inf[0]);
                if (erh[0] && ctn[0]) {
                    ctn[0].remove();
                    functionInterface.setTotalHead(erh[0]);
                }
            });
        },
        "resetSction" : () => {
            // 全局处理
            let oidsrc,oidtimer;
            if (window.self == window.top) UIInterface.start();
            if (!INITIAL_PATH[2].match("live.bilibili.com")) functionInterface.setGlobalStyle();
            global.rewriteSction();
            document.addEventListener("DOMNodeInserted",(msg) => {
                if (config.reset.replyfloor) {
                    if (msg.target.src && msg.target.src.startsWith('https://api.bilibili.com/x/v2/reply?')) oidsrc = msg.target.src;
                    if (msg.target.className && msg.target.className == "main-floor") {
                        window.clearTimeout(oidtimer);
                        oidtimer = window.setTimeout(() => {
                            functionInterface.setReplyFloor(oidsrc);
                        },1000);
                    }
                    if (msg.target.className && msg.target.className == "list-item reply-wrap ") {
                        window.clearTimeout(oidtimer);
                        oidtimer = window.setTimeout(() => {
                            functionInterface.setReplyFloor(oidsrc);
                        },1000);
                    }
                }
                functionInterface.deleteElement();
                functionInterface.avdesc();
                if (config.reset.headblur) functionInterface.removeBlur();
                if (config.reset.preview) functionInterface.removePreview();
                if (config.reset.livelogo) functionInterface.removeLiveLogo();
                if (config.reset.selectdanmu && msg.target.className && msg.target.className == "bilibili-player-video-subtitle") functionInterface.selectDanmu();
            });
        },
        "space" : () => {
            // 空间相关
            let src,mid;
            mid = INITIAL_PATH[3];
            if (mid && config.reset.jointime) xhr.GM(url.membercard(mid),functionInterface.setJoinTime);
            document.addEventListener("DOMNodeInserted",(msg) => {
                if (!config.reset.lostvideo) return;
                if (msg.target.src && msg.target.src.match("//api.bilibili.com/x/space/channel/video?")) src = msg.target.src;
                let channel_item = document.getElementsByClassName("channel-item");
                if (msg.relatedNode.getAttribute("class") == "fav-video-list clearfix content") {
                    if (msg.target.className == "small-item disabled" && msg.target.outerHTML.match("be27fd62c99036dce67efface486fb0a88ffed06")) {
                        functionInterface.refav(msg.target);
                    }
                }
                if (msg.relatedNode.getAttribute("class") == "row video-list clearfix") functionInterface.setFavlist(src);
                if (channel_item[0]) functionInterface.setChannelItem();
                if (msg.relatedNode.text == '已失效视频') msg.relatedNode.text = msg.relatedNode.getAttribute("title");
            });
        }
    }
    /*** 重写相关 ***/
    const rewritePage = {
        "av" : () => {
            if (config.reset.bvid2av && INITIAL_PATH[4].toLowerCase().startsWith('bv')) {
                history.replaceState(null,null,"https://www.bilibili.com/video/av" + functionInterface.chansId(INITIAL_PATH[4]) + location.search);
            }
            if (!config.rewrite.av) return;
            INITIAL_DOCUMENT = xhr.false(location.href);
            if (INITIAL_DOCUMENT.match("__INITIAL_STATE__=")) {
                if (INITIAL_DOCUMENT.match('"code":404')) return;
                let data = INITIAL_DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace("INITIAL_STATE__=","").replace(";(function","");
                window.aid = JSON.parse(data).aid;
                let html = page.video(data);
                functionInterface.rewritePage(html);
                if (config.reset.like) functionInterface.setLike();
            }
        },
        "watchlater" : () => {
            if (!config.rewrite.watchlater) return;
            if (INITIAL_PATH[5] && INITIAL_PATH[5].toLowerCase().startsWith('bv')){
                log.log(INITIAL_PATH);
                INITIAL_PATH[5] = "av" + functionInterface.chansId(INITIAL_PATH[5]);
                history.replaceState(null,null,INITIAL_PATH.join("/"));
            }
            let html = page.watchlater();
            functionInterface.rewritePage(html);
        },
        "bangumi" : () => {
            if (!config.rewrite.bangumi && !config.rewrite.special) return;
            INITIAL_DOCUMENT = xhr.false(location.href);
            if (INITIAL_DOCUMENT.match('__INITIAL_STATE__=')) {
                if (!config.rewrite.bangumi) return;
                if (INITIAL_DOCUMENT.match('"specialCover":""')) {
                    let id = location.href.match(/[0-9]+/);
                    let data = {};
                    if (INITIAL_PATH[5].startsWith('ss')) {
                        let ini = xhr.false(url.ssid(id[0]));
                        data = InitialState.bangumi(ini,null);
                    }
                    if (INITIAL_PATH[5].startsWith('ep')) {
                        let ini = xhr.false(url.epid(id[0]));
                        data = InitialState.bangumi(ini,id[0]);
                    }
                    let html = page.bangumi(JSON.stringify(data));
                    functionInterface.rewritePage(html);
                    if (config.reset.episodedata) functionInterface.setBangumi(data);
                }
                else rewritePage.special();
            }
        },
        "special" : () => {
            if (!config.rewrite.special) return;
            let id = location.href.match(/[0-9]+/);let data = "";
            if (INITIAL_PATH[5].startsWith('ss')) {
                let ini = xhr.false(url.ssid(id[0]));
                data = InitialState.special(ini,null);
            }
            if (INITIAL_PATH[5].startsWith('ep')) {
                let ini = xhr.false(url.epid(id[0]));
                data = InitialState.special(ini,id[0]);
            }
            let html = page.special(JSON.stringify(data));
            functionInterface.rewritePage(html);
        },
        "blackboard" : () => {
            if (!config.rewrite.blackboard) return;
            let link = location.href;
            let aid = link.match(/aid=[0-9]*/);
            let cid = link.match(/cid=[0-9]*/);
            let type = link.match(/season_type=[0-9]*/);
            if (aid && aid[0]) aid = 1 * aid[0].replace("aid=","");
            else try {aid = 1 * functionInterface.chansId(link.match(/bvid=[A-Za-z0-9]*/)[0].replace("bvid=",""));}catch (e) {log.error(e);return;}
            if (cid && cid[0]) cid = 1 * cid[0].replace("cid=","");
            if (type && type[0]) type = type[0].replace("season_type=","");
            else type = NaN;
            if (!aid) aid = 1 * functionInterface.chansId(link.match(/aid=[A-Za-z0-9]*/)[0].replace('aid=',""));
            if (!cid) try {cid = JSON.parse(xhr.false(url.pagelist(aid))).data[0].cid;} catch(e) {log.error(e);return;}
            location.replace(iframeplayer.blackboard(aid,cid,type));
            log.log("嵌入式播放器：aid=" + aid + " cid=" + cid);
        },
        "home" : () => {
            if (config.rewrite.home) {
                INITIAL_DOCUMENT = xhr.false(location.href);
                let data = INITIAL_DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace("INITIAL_STATE__=","").replace(";(function","");
                let html = page.home(JSON.stringify(InitialState.home(data)));
                functionInterface.rewritePage(html);
            }
            if (config.reset.online) functionInterface.setOnline();
        },
        "playlist" : () => {
            if (config.rewrite.playlist) {
                let html = page.playlist();
                functionInterface.rewritePage(html);
            }
            functionInterface.setPlayList();
        }
    }
    /*** 初始化设置 ***/
    INITIAL_CONFIG = JSON.parse(JSON.stringify(config));
    try {
        let data = JSON.parse(localStorage.getItem("LSBOC"));
        for (let key in data.rewrite) if (key in config.rewrite) config.rewrite[key] = data.rewrite[key];
        for (let key in data.reset) if (key in config.reset) config.reset[key] = data.reset[key];
    }
    catch (e) {localStorage.setItem("LSBOC",JSON.stringify(config));}
    /*** 页面分离 ***/
    if (INITIAL_PATH[3]) {
        if (INITIAL_PATH[3] == 'video' && (INITIAL_PATH[4].toLowerCase().startsWith('av') || INITIAL_PATH[4].toLowerCase().startsWith('bv'))) rewritePage.av();
        if (INITIAL_PATH[3] == 'watchlater') rewritePage.watchlater();
        if (INITIAL_PATH[3] == 'bangumi' && INITIAL_PATH[4] == 'play') rewritePage.bangumi();
        if (INITIAL_PATH[3] == 'blackboard' && INITIAL_PATH[4] && INITIAL_PATH[4].startsWith('newplayer')) rewritePage.blackboard();
        if (INITIAL_PATH[3] == 'playlist' && INITIAL_PATH[4] == 'video' && INITIAL_PATH[5].startsWith('pl')) rewritePage.playlist();
        if (INITIAL_PATH[2] == 'space.bilibili.com') global.space();
        if (INITIAL_PATH[2] == 'www.bilibili.com' && (INITIAL_PATH[3].startsWith('\?') || INITIAL_PATH[3].startsWith('\#') || INITIAL_PATH[3].startsWith('index'))) rewritePage.home();
    } else {
        if (INITIAL_PATH[2] == 'www.bilibili.com') rewritePage.home();
    }
    document.addEventListener("DOMContentLoaded",global.resetSction());
})();
