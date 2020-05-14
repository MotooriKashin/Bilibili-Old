// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    Motoori Kashin
// @version      2.10.4
// @description  恢复原生的旧版页面，包括主页和播放页。
// @author       Motoori Kashin
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

    let DOCUMENT,CONFIG,ts,aid,cid,mid,uid,src,tid,mode,type,oidsrc,__INITIAL_STATE__,__playinfo__;
    let arr = [],obj = {};
    let TITLE = document.getElementsByTagName("title");
    let LOCATION = document.location.href.split('/');

    if (TITLE[0]) TITLE = TITLE[0].innerText;

    const API = {
        "pageframe" : {
            "watchlater" : '<!DOCTYPE html><html><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="spm_prefix" content="333.342"/><link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css"><link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css" rel="stylesheet"><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div class="z-top-container has-menu"></div><div id="viewlater-app"><app></app></div><div class="footer bili-footer"></div><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script><script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/js/main.2111469a1bbc20e2e885.js"></script></body></html>',
            "playlist" : '<!DOCTYPE html><html><head><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=renderer content=webkit><meta name=description content=bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。><meta name=keywords content=B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid><meta name=spm_prefix content=333.44><link rel=stylesheet href=//static.hdslb.com/phoenix/dist/css/comment.min.css type=text/css><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=renderer content=webkit><meta name=description content=bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。><meta name=keywords content=B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid><meta name=spm_prefix content=0><link href=//s1.hdslb.com/bfs/static/jinkela/playlist-video/css/playlist_video.0.87292febba67b03f65d05c15d03e325d9db4f56a.css rel=stylesheet><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div id=playlist-video-app></div><div class="footer bili-footer report-wrap-module"></div><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js></script><script type=text/javascript src=//static.hdslb.com/js/jquery.qrcode.min.js></script><script type=text/javascript charset=utf-8 src=//static.hdslb.com/common/js/footer.js></script><script type=text/javascript src=//static.hdslb.com/js/swfobject.js></script><script type=text/javascript src=//static.hdslb.com/js/video.min.js></script><script type=text/javascript src=//static.hdslb.com/mstation/js/upload/moxie.js></script><script type=text/javascript src=//static.hdslb.com/mstation/js/upload/plupload.js></script><script type=text/javascript src=//static.hdslb.com/phoenix/dist/js/comment.min.js></script><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js></script><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js></script></body></html>',
            "bangumi" : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script><script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.764aaa07c8ac8078b639306b18838d080a1cefc1.css" /></head><body><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true" class="main-container"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.764aaa07c8ac8078b639306b18838d080a1cefc1.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.764aaa07c8ac8078b639306b18838d080a1cefc1.js" crossorigin="" defer="defer"></script><script type="text/javascript">0</script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>',
            "cinema" : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/bangumi/play/js/promise.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.764aaa07c8ac8078b639306b18838d080a1cefc1.css" /></head><body><div class="z-top-container " style="height:42px"></div><div id="app" data-server-rendered="true" class="main-container special"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/manifest.3b709027.js" crossorigin defer></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/vendor.3b709027.js" crossorigin defer></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/js/bangumi-play.3b709027.js" crossorigin defer></script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>',
            "video" : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + TITLE + '</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" /><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}} .video-info-m .number .like b, .video-info-m .number .like i {background: url(//static.hdslb.com/images/base/icons.png);}</style></head><body><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script> <script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true"></div><div class="player-fix abs" id="bofqi" style="visibility:hidden;"><script type="text/javascript">function getQueryString(e){var r=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),i=window.location.search.substr(1).match(r);return null!=i?unescape(i[2]):null}window.getInternetExplorerVersion=function(){var e=-1;if("Microsoft Internet Explorer"==navigator.appName){var r=navigator.userAgent;null!=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r)&&(e=parseFloat(RegExp.$1))}return e};var vd=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.videoData;if(vd&&vd.aid&&9!==getInternetExplorerVersion()){if($("#__bofqi").innerHTML=\'<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>\',vd.embedPlayer){var p=getQueryString("p")?getQueryString("p")-1:0,player={aid:vd.aid,cid:vd.pages[p]&&vd.pages[p].cid||vd.pages[0].cid};EmbedPlayer("player","//static.hdslb.com/play.swf","cid="+player.cid+"&aid="+player.aid+"&pre_ad=")}vd.embed&&$("#bofqi").html(vd.embed)}else $("#bofqi").remove()</script></div><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><div class="footer bili-footer report-wrap-module"></div><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script></body></html>',
            "home" : '<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css"></head><body><div id="home-app"></div><div id="app" data-server-rendered="true"></div><script src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin></script><script type="text/javascript" defer="defer" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script><link rel="prefetch" as="script" href="//static.hdslb.com/js/video.min.js"></body></html>'
        },
        "style" : {
            "playshadow" : "#bilibiliPlayer, #bofqi.mini-player {box-shadow: 0px 2px 8px 0px rgba(0,160,216,0.3) !important;}",
            "jointime" : ".user .info .meta .row {height: 88px;white-space: normal;}.user .info .jointime .icon {background-position: -209px -84px;}.user .info .jointime .text {color: #00a1d6;}}",
            "online" : ".online a {color: rgb(109, 117, 122);}.popularize-module .online em {display: inline-block;height: 10px;line-height: 10px;vertical-align: top;border-left: 1px solid rgb(184, 192, 204);margin: 12px 15px 0px;}",
            "search" : ".search-wrap .search-block .input-wrap input {font: 400 13.3333px Arial !important;}",
            "uiface" : "#ui-face {box-sizing: content-box;color: #fff;background-color: rgb(255,255,255);border-radius:5px;position: fixed;padding: 4px;bottom: 65px;width: 56px;height: 40px;transition: right 0.7s;-moz-transition: right 0.7s;-webkit-transition: right 0.7s;-o-transition: right 0.7s;z-index: 1008;}#ui-face i {background-position: -471px -982px;display: block;width: 20px;height: 20px;margin: auto;transition: 0.2s;background-image: url(//static.hdslb.com/images/base/icons.png);}#ui-face span {font-size: 14px;display: block;width: 50%;margin: auto;transition: 0.2s;color: rgb(0,0,0)}#ui-table {box-sizing: content-box;color: #fff;background-color: rgb(255,255,255);border-radius:5px;position: fixed;padding: 4px;bottom: 30px;right: 58px;width: 200px;height: 360px;box-shadow: rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border: 1px solid rgb(233, 234, 236);overflow-y: scroll;z-index: 10008;}.checke{float: right;position: relative;-webkit-appearance: none;width: 40px;height: 20px;line-height: 20px;background: #eee;border-radius: 10px;outline: none;border: 2px solid #999999;}.checke:before{position: absolute;left: 0;content: '';width: 12px;height: 12px;border-radius: 50%;background: #eee;box-shadow: 0px 0px 5px #ddd;transition: all 0.2s linear;border: 2px solid #999999;}.checke:checked{   background: #01a1d6;}.checke:checked:before{left: 20px;transition: all 0.2s linear;}",
            "bofqi" : "#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}",
            "gray" : "html {filter:grayscale(100%);-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);-webkit-filter:grayscale(1);}",
            "like" : ".video-info-module .number .like b, .video-info-module .number .like i {background: url(//static.hdslb.com/images/base/icons.png);display: inline-block;margin-top: -3px;vertical-align: middle;}"
        },
        "playerframe" : {
            "html5player" : "https://www.bilibili.com/blackboard/html5player.html", // aid, cid, season_type player_type + &as_wide=1&urlparam=module%253Dbangumi&crossDomain=true
            "playlist" : "https://www.bilibili.com/blackboard/playlist-player.html", // pl || aid,cid
            "ancient" : "https://www.bilibili.com/blackboard/activity-ancient-player.html", // aid,cid
            "player" : "https://player.bilibili.com/player.html", // aid,cid &| page
            "html" : "https://www.bilibili.com/html/player.html" // aid + wmode=transparent
        },
        "url" : {
            "spacedetial" : "https://api.bilibili.com/medialist/gateway/base/spaceDetail", // media_id,pn + &ps=20&keyword=&order=mtime&type=0&tid=0
            "channel" : "https://api.bilibili.com/x/space/channel/video", // mid,cid,pn + &ps=30&order=0
            "biliplus" : "https://www.biliplus.com/video/av",
            "jijidown" : "https://www.jijidown.com/video/av",
            "online" : "https://api.bilibili.com/x/web-interface/online",
            "stat" : "https://api.bilibili.com/x/web-interface/archive/stat", // aid
            "replymain" : "https://api.bilibili.com/x/v2/reply/main", // oid,type,mode &| next
            "reply" : "https://api.bilibili.com/x/v2/reply", // type,sort,oid,pn
            "replycursor" : "https://api.bilibili.com/x/v2/reply/reply/cursor", // oid,root,type &| sort
            "membercard" : "https://account.bilibili.com/api/member/getCardByMid", // mid
            "season" : "https://bangumi.bilibili.com/view/web_api/season", // season_id || ep_id
            "pagelist" : "https://api.bilibili.com/x/player/pagelist", // aid
            "view" : "https://api.bilibili.com/x/web-interface/view", // aid || bvid
            "haslike" : "https://api.bilibili.com/x/web-interface/archive/has/like", // aid
            "like" : "https://api.bilibili.com/x/web-interface/archive/like"
        },
        "sort" : {
            "202" : [202,"资讯","https://www.bilibili.com/v/information/"],
            "203" : [202,"热点","https://www.bilibili.com/v/information/hotspot/"],
            "204" : [202,"环球","https://www.bilibili.com/v/information/global/"],
            "205" : [202,"社会","https://www.bilibili.com/v/information/social/"],
            "206" : [202,"综合","https://www.bilibili.com/v/information/multiple/"]
        },
    }
    const log = {
        "log" : (message) => console.log("[Bilibili 旧播放页]",message),
        "error" : (message) => console.error("[Bilibili 旧播放页]",message),
        "warn" : (message) => console.warn("[Bilibili 旧播放页]",message),
        "debug" : (message) => console.debug("[Bilibili 旧播放页]",message)
    }
    const xhr = {
        "false" : (url) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET',url,false);
            xhr.withCredentials = true;
            xhr.send(null);
            if (xhr.status===200) return xhr.responseText;
        },
        "true" : (url,callback,arg) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET',url,true);
            xhr.withCredentials = true;
            xhr.onload = () => callback(xhr.responseText,arg)
            xhr.onerror = () => log.error("XHR Failed url=" + url)
            xhr.send();
        },
        "GM" : (url,callback,arg) => {
            GM_xmlhttpRequest({
                method : 'GET',
                url    : url,
                onload : (response) => callback(response.responseText,arg)
            });
        },
        "post" : (url,header,data,callback,arg) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST",url,true);
            xhr.setRequestHeader("Content-type", header);
            xhr.withCredentials = true;
            xhr.onload = () => callback(xhr.responseText,arg);
            xhr.send(data);
        }
    }
    let config = {
        "rewrite" : {
            "av" : 1,
            "bangumi" : 1,
            "watchlater" : 1,
            "frame" : 1,
            "home" : 1,
            "playlist" : 1,
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
            "like" : 1
        }
    }
    const INITIAL_STATE = {
        "bangumi" : (data,epId) => {
            try {
                let ep = 0,dat = {};
                let rp = JSON.parse(data).result;
                let ini = JSON.parse(DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace('INITIAL_STATE__=',"").replace(';(function',""));
                let pug = JSON.parse(DOCUMENT.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace('PGC_USERSTATE__=',"").replace('</script>',""));
                if (rp.bkg_cover) {dat = {"ver":{"mobile":false,"ios":false,"android":false,"windowsPhone":false,"iPhone":false,"ios9":false,"iPad":false,"webApp":false,"microMessenger":false,"weibo":false,"uc":false,"qq":false,"baidu":false,"mqq":false,"mBaidu":false,"iqiyi":false,"qqLive":false,"safari":true,"youku":false,"ie":false,"edge":false,"bili":false,"biliVer":0},"loginInfo":{},"canReview":false,"userShortReview":{},"userLongReview":{},"userScore":0,"userCoined":false,"isPlayerTrigger":false,"special":true,"area":0,"app":false,"mediaRating":{},"recomList":[],"playerRecomList":[],"paster":{},"payPack":{},"payMent":{},"activity":{},"spending":0,"sponsorTotal":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorWeek":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorTotalCount":0,"miniOn":true,"seasonFollowed":false};} else {dat = {"ver":{},"loginInfo":{},"canReview":false, "userShortReview":{},"userLongReview":{},"userScore":0,"userCoined":false,"isPlayerTrigger":false,"special":false,"area":0,"app":false,"recomList":[],"playerRecomList":[],"paster":{},"payPack":{},"payMent":{},"activity":{},"spending":0,"sponsorTotal":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorWeek":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorTotalCount":0,"miniOn":true,"seasonFollowed":false,"epStat":{},"ssStat":{}};}
                if (epId) {dat.epId = 1 * epId;ep = 1;}else {dat.epId = "";if (pug.hasOwnProperty("progress")) {dat.epId = pug.progress.last_ep_id;ep = 1;}}
                dat.ssId = rp.season_id;
                dat.mdId = 1 * rp.link.match(/[0-9][0-9]*/)[0];
                dat.mediaInfo = {};
                dat.mediaInfo.actors = rp.actors;
                dat.mediaInfo.alias = rp.alias;
                dat.mediaInfo.areas = rp.areas;
                dat.mediaInfo.bkg_cover = rp.bkg_cover;
                dat.mediaInfo.cover = rp.cover;
                dat.mediaInfo.evaluate = rp.evaluate;
                dat.mediaInfo.is_paster_ads = rp.is_paster_ads;
                dat.mediaInfo.jp_title = rp.jp_title;
                dat.mediaInfo.link = rp.link;
                dat.mediaInfo.media_id = rp.media_id;
                dat.mediaInfo.mode = rp.mode;
                dat.mediaInfo.season_id = rp.season_id;
                dat.mediaInfo.season_status = rp.season_status;
                dat.mediaInfo.season_title = rp.season_title;
                dat.mediaInfo.season_type = rp.season_type;
                dat.mediaInfo.square_cover = rp.square_cover;
                dat.mediaInfo.staff = rp.staff;
                dat.mediaInfo.stat = rp.state;
                dat.mediaInfo.style = rp.style;
                dat.mediaInfo.title = rp.title;
                dat.mediaInfo.total_ep = rp.total_ep;
                dat.mediaRating = rp.rating;
                dat.epList = rp.episodes;
                if (ep==0) dat.epId=dat.epList[0].ep_id;
                for (let i=0;i<dat.epList.length;i++) if(dat.epList[i].ep_id == dat.epId) dat.epInfo = dat.epList[i];
                dat.newestEp = rp.newest_ep;
                dat.seasonList = rp.seasons;
                if (!dat.seasonList) dat.seasonList = ini.sections;
                dat.seasonStat = {"views":0,"danmakus":0,"coins":0,"favorites":0};
                dat.userStat = {"loaded":true,"error":false,"follow":0,"pay":0,"payPackPaid":0,"sponsor":0};
                dat.userStat.watchProgress = pug.progress;
                dat.userStat.vipInfo = pug.vip_info;
                dat.upInfo = rp.up_info;
                dat.rightsInfo = rp.rights;
                dat.pubInfo = rp.publish;
                if (pug.dialog || pug.pay == 1) {
                    dat.payMent = {"price":"0.0","promotion":"","tip":"大会员专享观看特权哦~"};
                    if (pug.dialog) {
                        dat.payMent.vip_promotion = pug.dialog.title;
                        if (pug.dialog.btn_left) dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];
                    }
                }
                return dat;
            } catch(e) {log.error(e)}
        },
        "home" : (data) => {
            try {
                let dat = {};
                let ini = JSON.parse(data);
                dat.recommendData = [];
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
                return dat;
            } catch(e) {log.error(e);}
        }
    }
    const handle = {
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
        "obj2search" : (url,obj) =>{
            // 添加链接参数
            if (obj) {
                let arr = [],i = 0;
                for (let key in obj) {
                    if(obj[key] !== "" && obj[key] !== "undefined" && obj[key] !== null) {
                        arr[i] = key + "=" + obj[key];
                        i++;
                    }
                }
                url = url + "?" + arr.join("&");
            }
            return url;
        },
        "fixvar" : () => {
            // 重整变量
            if (!aid) aid = unsafeWindow.aid?unsafeWindow.aid:aid;
            if (!cid) cid = unsafeWindow.cid?unsafeWindow.cid:cid;
        },
        "hidden" : (node,type) => {
            // 隐藏节点
            switch(type){
                case "id" : node = document.getElementById(node);break;
                case "class" : node = document.getElementsByClassName(node)[0]?document.getElementsByClassName(node)[0]:"";break;
                case "tag" : node = document.getElementsByTagName(node)[0]?document.getElementsByTagName(node)[0]:"";break;
            }
            if (!node) return;
            if (node.getAttribute("hidden")) return;
            node.setAttribute("hidden","hidden")
        },
        "setGlobalStyle" : () => {
            // 添加全局样式
            let csss = API.style.uiface;
            let style = document.createElement("style");
            if (config.reset.playershadow) csss = csss + API.style.playshadow;
            if (config.reset.searchwrap) csss = csss + API.style.search;
            if (config.reset.like) csss = csss + API.style.like;
            style.setAttribute("type","text/css");
            document.head.appendChild(style);
            style.appendChild(document.createTextNode(csss));
        },
        "write" : (html) => {
            // 重写网页框架
            document.open();
            document.write(html);
            document.close();
        },
        "fixSort" : {
            // 修复分区信息
            "av" : () => {
                if (tid) {
                    let timer = window.setInterval(()=>{
                        let tminfo = document.getElementsByClassName("tm-info");
                        if (tminfo[0]) {
                            window.clearInterval(timer);
                            if (!(tid in API.sort)) return;
                            let nodes = tminfo[0].childNodes;
                            nodes[1].replaceWith(nodes[0].cloneNode(true));
                            nodes[2].replaceWith(nodes[0].cloneNode(true));
                            nodes[2].childNodes[1].remove();
                            nodes[1].childNodes[0].href = API.sort[API.sort[tid][0]][2];
                            nodes[1].childNodes[0].innerText = API.sort[API.sort[tid][0]][1];
                            nodes[2].childNodes[0].href = API.sort[tid][2];
                            nodes[2].childNodes[0].innerText = API.sort[tid][1];
                        }
                    },1000);
                }
            },
            "watchlater" : {
                "start" : () => {
                    let timer = window.setInterval(()=>{
                        let tminfo = document.getElementsByClassName("tm-info");
                        if (tminfo[0]&&aid) {
                            window.clearInterval(timer);
                            let child = tminfo[0].childNodes;
                            if (child[2].nodeType === 8) xhr.true(handle.obj2search(API.url.view,{"aid":aid}),handle.fixSort.watchlater.fix,child);
                        }
                    },1000);
                },
                "fix" : (data,nodes) => {
                    try {
                        tid = JSON.parse(data).data.tid;
                        if (!(tid in API.sort)) return;
                        nodes[2].replaceWith(nodes[0].cloneNode(true));
                        nodes[4].replaceWith(nodes[0].cloneNode(true));
                        nodes[4].childNodes[1].remove();
                        nodes[2].childNodes[0].href = API.sort[API.sort[tid][0]][2];
                        nodes[2].childNodes[0].innerText = API.sort[API.sort[tid][0]][1];
                        nodes[4].childNodes[0].href = API.sort[tid][2];
                        nodes[4].childNodes[0].innerText = API.sort[tid][1];
                    } catch(e) {log.error(e)}
                }
            }
        },
        "setLike" : {
            // 添加点赞功能
            "start" : () => {
                if (!config.reset.like) return;
                let coin = document.getElementsByClassName("bilibili-player-video-subtitle");
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
                        xhr.true(handle.obj2search(API.url.view,{"aid":aid}),handle.setLike.howLike,text);
                    }
                },100);
            },
            "howLike" : (data,arg) =>{
                try {
                    data = JSON.parse(data).data.stat.like;
                    document.getElementsByClassName("like")[0].setAttribute("title","点赞人数" + data);
                    if (data>10000) data = (data/10000).toFixed(1) + "万";
                    let text = document.createTextNode(" 点赞 " + data);
                    arg.replaceWith(text);
                    xhr.true(handle.obj2search(API.url.haslike,aid),handle.setLike.ifLike,text);
                } catch(e) {log.error(e)}
            },
            "ifLike" : (data,arg) => {
                try {
                    if (JSON.parse(data).data >= 0) {
                        let move = document.getElementsByClassName("l-icon-move");
                        let moved = document.getElementsByClassName("l-icon-moved");
                        data = JSON.parse(data).data;
                        if (data) {
                            move[0].setAttribute("style","width: 22px;height: 22px;background-position: -660px -2068px;display: none;");
                            moved[0].setAttribute("style","width: 22px;height: 22px;background-position: -725px -2068px;");
                        }
                        else {
                            move[0].onclick = () => {
                                let msg = "aid=" + aid + "&like=1&csrf=" + handle.getCookies().bili_jct;
                                xhr.post(API.url.like,"application/x-www-form-urlencoded",msg,handle.setLike.enLike,arg);
                            }
                        }
                    }
                    else document.getElementsByClassName("l-icon-move")[0].onclick = () => document.getElementsByClassName("c-icon-move")[0].click();
                } catch(e) {log.error(e)}
            },
            "enLike" : (data,arg) => {
                try {
                    data = JSON.parse(data).ttl;
                    document.getElementsByClassName("l-icon-move")[0].setAttribute("style","width: 22px;height: 22px;background-position: -660px -2068px;display: none;");
                    document.getElementsByClassName("l-icon-moved")[0].setAttribute("style","width: 22px;height: 22px;background-position: -725px -2068px;");
                    if (arg.nodeValue.match("万")) return;
                    let number = 1 * arg.nodeValue.match(/[0-9]+/) + 1;
                    arg.replaceWith(document.createTextNode(" 点赞 " + number));
                } catch(e) {log.error(e)}
            }
        },
        "reSction" : () => {
            // 切换旧版版头
            if (!config.reset.grobalboard) return;
            document.getElementById("internationalHeader").setAttribute("style","visibility:hidden;");
            let newh = document.createElement("div");
            let script = document.createElement("script");
            let foot = document.getElementsByClassName("international-footer");
            script.setAttribute("type","text/javascript");
            script.setAttribute("src","//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
            if(document.getElementsByClassName("mini-type")[0]) newh.setAttribute("class","z-top-container");
            else newh.setAttribute("class","z-top-container has-menu");
            document.body.insertBefore(newh,document.body.firstChild);
            document.body.insertBefore(script,document.body.firstChild);
            if (foot[0]) {
                let div = document.createElement("div");
                div.setAttribute("class","footer bili-footer report-wrap-module");
                div.setAttribute("id","home_footer");
                foot[0].replaceWith(div);
                let script = document.createElement("script");
                script.setAttribute("type","text/javascript");
                script.setAttribute("src","//static.hdslb.com/common/js/footer.js");
                document.body.appendChild(script);
            }
            window.setTimeout(() => {handle.removeBlur()},3000);
        },
        "removeBlur" : () => {
            // 调整顶栏全透明
            if (!config.reset.headblur) return;
            let blur = document.getElementsByClassName("blur-bg");
            if (blur[0]) blur[0].removeAttribute("style");
        },
        "deleteElement" : () => {
            // 去除失效项目
            handle.hidden("contact-help","class");
            handle.hidden("new-entry","class");
            handle.hidden("ver","class");
            handle.hidden("fixed_app_download","id");
            handle.hidden("app-download","class");
            if (document.getElementsByClassName("bili-header-m")[1]) document.getElementsByClassName("bili-header-m")[1].remove();arr.push("head");
        },
        "avdesc" : () => {
            // 视频简介中BV转超链接
            if (!config.rewrite.av || !aid) return;
            let desc = document.getElementsByClassName("info");
            if (LOCATION[3] != 'video') return;
            if (desc[1] && desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i)) {
                let paster = desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i);
                for (let i=0;i<paster.length;i++){
                    let newer = "av" + handle.chansId(paster[i]);
                    newer = '<a target="_blank" href="//www.bilibili.com/video/' + newer + '">' + newer + '</a>';
                    desc[1].innerHTML = desc[1].outerHTML.replace(paster[i],newer);
                }
            }
        },
        "removePreview" : () => {
            // 倒计时移除预览框
            if (!config.reset.preview) return;
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
            if (!config.reset.livelogo) return;
            let logo = document.getElementsByClassName("bilibili-live-player-video-logo");
            if (logo[0]) logo[0].remove();
        },
        "selectDanmu" : () => {
            // 切换到弹幕列表
            if (!config.reset.selectdanmu) return;
            let danmu = document.getElementsByClassName("bilibili-player-filter-btn")[1];
            if (danmu) danmu.click();
        },
        "setReplyFloor" : {
            // 添加评论区楼层
            "start" : (src) => {
                if (!config.reset.replyfloor) return;
                try {
                    let oid,sort,pn;
                    src = src.split('?')[1].split('&');
                    for (let i=0;i<src.length;i++) {
                        let key = src[i].split('=');
                        if (key[0] == "oid") oid = key[1];
                        if (key[0] == "sort") sort = key[1];
                        if (key[0] == "pn") pn = key[1];
                        if (key[0] == "type") type = key[1];
                    }
                    if (sort==0) mode = 1;
                    if (sort==1) return;
                    if (sort==2) mode = 3;
                    // 热门：sort=2 mode=3 时间：sort=0 mode=2  回复：sort=1 默认(热门+时间) mode=1
                    if (sort==2) xhr.true(handle.obj2search(API.url.replymain,{"oid":oid,"next":pn,"type":type,"mode":mode}),handle.setReplyFloor.floor);
                    else {
                        if (pn==1) xhr.true(handle.obj2search(API.url.replymain,{"oid":oid,"type":type,"mode":mode}),handle.setReplyFloor.floor);
                        else{
                            pn = pn - 1;
                            xhr.true(handle.obj2search(API.url.reply,{"type":type,"sort":sort,"oid":oid,"pn":pn}),handle.setReplyFloor.prefloor);
                        }
                    }
                } catch(e) {log.error(e)}
            },
            "prefloor" : (data) => {
                try {
                    data = JSON.parse(data).data;
                    let i = data.replies.length - 1;
                    let oid = data.replies[0].oid;
                    let root = data.replies[i].rpid;
                    xhr.true(handle.obj2search(API.url.replycursor,{"oid":oid,"root":root,"type":type}),handle.setReplyFloor.cursorfloor);
                } catch(e) {log.error(e);}
            },
            "cursorfloor" : (data) => {
                try {
                    data = JSON.parse(data).data;
                    let oid = data.root.oid;
                    let next = data.root.floor;
                    xhr.true(handle.obj2search(API.url.replymain,{"oid":oid,"next":next,"type":type,"mode":mode}),handle.setReplyFloor.floor);
                } catch(e) {log.error(e)}
            },
            "floor" : (data) => {
                try {
                    data = JSON.parse(data).data;
                    let floor = {},top = data.top,hots = data.hots,replies = data.replies;
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
                } catch(e) {log.error(e)}
            }
        },
        "setBangumi" : {
            // 添加番剧分集数据
            "start" : (data) => {
                if (!config.reset.episodedata) return;
                try {
                    if (data.epList[1] && (data.epList[0].aid != data.epList[1].aid)) {
                        aid = data.epInfo.aid;
                        let timer = window.setInterval(() => {
                            if (document.getElementsByClassName("info-sec-av")[0]) {
                                handle.setBangumi.EpisodeData("first");
                                window.clearInterval(timer);
                            }
                        },1000);
                        window.setTimeout(() => {window.clearInterval(timer);},10000);
                        document.addEventListener("DOMNodeInserted",(msg) => {
                            if (msg.relatedNode.className == "info-sec-av") {
                                aid = msg.relatedNode.innerText.match(/[0-9]+/)[0];
                                handle.setBangumi.EpisodeData();
                            }
                        });
                    }
                } catch(e) {log.error(e)}
            },
            "EpisodeData" : (data) => {
                let views = document.getElementsByClassName("view-count")[0].getElementsByTagName("span")[0];
            let danmakus = document.getElementsByClassName("danmu-count")[0].getElementsByTagName("span")[0];
            if (data == "first") {
                if (views.innerText == "-" && danmakus.innerText == "-") {window.setTimeout(() => {handle.setBangumi.EpisodeData("first")},100);return;}
                views.setAttribute("title","总播放数 " + views.innerText); // 备份总播放数
                danmakus.setAttribute("title","总弹幕数 " + danmakus.innerText); // 备份总弹幕数
                log.log("合计播放：" + views.innerText + " 合计弹幕：" + danmakus.innerText);
                xhr.true(handle.obj2search(API.url.stat,{"aid":aid}),handle.setBangumi.EpisodeData);
                return;
            }
            if (!data) {xhr.true(handle.obj2search(API.url.stat,{"aid":aid}),handle.setBangumi.EpisodeData);return;}
            try {
                data = JSON.parse(data).data;
                let view = data.view;
                let danmaku = data.danmaku;
                if (view>=10000) view = (view / 10000).toFixed(1) + "万";
                if (danmaku>=10000) danmaku = (danmaku / 10000).toFixed(1) + "万";
                views.innerText = view;
                danmakus.innerText = danmaku;
                log.log("播放：" + view + " 弹幕：" + danmaku);
            } catch(e) {log.error(e);}
            }
        },
        "setOnline" : {
            // 恢复首页在线数据
            "start" : () => {
                if (!config.reset.online) return;
                let style = document.createElement("style");
                style.setAttribute("type","text/css");
                document.head.appendChild(style);
                style.appendChild(document.createTextNode(API.style.online));
                let timer = window.setInterval(() => {
                    let online = document.getElementsByClassName("online");
                    if (online[0]) {
                        window.clearInterval(timer);
                        xhr.true(API.url.online,handle.setOnline.online);
                    }
                },1000);
            },
            "online" : (data) => {
                try {
                    data = JSON.parse(data).data;
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
                    window.setTimeout(()=>{xhr.true(API.url.online,handle.setOnline.online)},60000);
                } catch(e) {log.error(e)}
            }
        },
        "setJoinTime" : {
            // 显示账号注册时间
            "start" : () => {
                if (!mid && !config.reset.jointime) return;
                xhr.GM(handle.obj2search(API.url.membercard,{"mid":mid}),handle.setJoinTime.jointime)
            },
            "jointime" : (data) => {
                try {
                    data = JSON.parse(data);
                    let jointime = handle.timeFormat(data.card.regtime * 1000); // 时间戳不是13位，主动补位
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
                                style.appendChild(document.createTextNode(API.style.jointime));
                            }
                        }
                    });
                } catch(e) {log.error(e)}
            }
        },
        "fixVideoLost" : {
            // 修复失效视频信息
            "favlist" : {
                "start" : (msg) => {
                    try {
                        let aid = msg.target.getAttribute("data-aid");
                        if (!(1 * aid)) aid = handle.chansId(aid);
                        if (arr.indexOf(aid) != -1) return;
                        arr.push(aid);
                        xhr.GM(API.url.jijidown + aid,handle.fixVideoLost.favlist.fix,msg);
                    } catch(e) {log.error(e)}
                },
                "fix" : (data,msg) => {
                    let aid = msg.target.getAttribute("data-aid");
                    if (!(1 * aid)) aid = handle.chansId(aid);
                    let title,cover;
                    try {
                        data.match('window._INIT')[0];
                        title = data.match(/\<title\>.+?\-哔哩哔哩唧唧/)[0].replace('<title>',"").replace('-哔哩哔哩唧唧',"");
                        cover = data.match(/"img\":\ \".+?\",/)[0].replace('"img": "',"").replace('",',"");
                        cover.match('hdslb')[0];
                    } catch(e) {
                        try {
                            data.match('哔哩哔哩唧唧')[0];
                            xhr.GM(API.url.biliplus + aid,handle.fixVideoLost.favlist.fix,msg);
                            return;
                        } catch(e) {
                            try {
                                data.match(/\<title\>.+?\ \-\ AV/)[0];
                                title = data.match(/\<title\>.+?\ \-\ AV/)[0].replace('<title>',"").replace(' - AV',"");
                                cover = data.match(/\<img style=\"display:none\"\ src=\".+?\"\ alt/)[0].replace('<img style="display:none" src="',"").replace('" alt',"");
                            } catch(e) {
                                title = "AV" + aid;
                            }
                        }
                    }
                    log.log("失效视频：AV" + aid);
                    let img = msg.target.getElementsByTagName("img")[0];
                    let txt = msg.target.getElementsByClassName("title")[0];
                    img.setAttribute("src",cover + "@380w_240h_100Q_1c.webp");
                    img.setAttribute("alt",title);
                    txt.setAttribute("href","//www.bilibili.com/video/av" + aid);
                    txt.setAttribute("title",title);
                    txt.setAttribute("style","text-decoration: line-through;color: #ff0000;");
                    txt.text = title;
                    msg.target.setAttribute("class","small-item");
                    msg.target.firstChild.setAttribute("href","//www.bilibili.com/video/av" + aid);
                    msg.target.firstChild.setAttribute("target","_blank");
                    msg.target.firstChild.setAttribute("class","cover cover-normal");
                }
            },
            "channel" : {
                "start" : (src) => {
                    if (!config.reset.lostvideo) return;
                    try {
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
                                    if (!ts) {
                                        ts = Date.parse(new Date());
                                        xhr.true(handle.obj2search(API.url.channel,{"mid":mid,"cid":cid,"pn":pn,"ps":30,"order":0}),handle.fixVideoLost.channel.fix);
                                    }
                                    else {
                                        if (Date.parse(new Date()) - ts >= 1000) {
                                            ts = Date.parse(new Date());
                                            xhr.true(handle.obj2search(API.url.channel,{"mid":mid,"cid":cid,"pn":pn,"ps":30,"order":0}),handle.fixVideoLost.channel.fix);
                                        }
                                    }
                                }
                            }
                        }
                    } catch(e) {log.error(e)}
                },
                "fix" : (data) => {
                    try {
                        data = JSON.parse(data).data;
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
                    } catch(e) {log.error(e)}
                }
            },
            "home" : (msg) => {
                if (!config.reset.lostvideo) return;
                let channel_item = document.getElementsByClassName("channel-item");
                if (channel_item[0]) {
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
                }
                if (msg.relatedNode.text == '已失效视频') msg.relatedNode.text = msg.relatedNode.getAttribute("title");
                if (msg.target.className == "small-item disabled") msg.target.className = "small-item";
            }
        },
    }
    const UI = {
        "start" : () => {
            // 绘制交互
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
                if (!table[0]) UI.table();
                else {
                    if (table[0].getAttribute("hidden")) table[0].removeAttribute("hidden");
                    UI.table();
                }
            }
            ui_face.appendChild(icon);
            ui_face.appendChild(enter);
            enter.innerText = "设置";
            let timer = window.setInterval(() => {if (document.body) {window.clearInterval(timer);document.body.appendChild(ui_face);}},1000);
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
                    config = CONFIG;
                    localStorage.setItem("LSBOC",JSON.stringify(config));
                    table.remove();
                }
                table.appendChild(rec);
                for (let key in config.rewrite) UI.setTable(table,UI.menu[key],config.rewrite[key],key);
                for (let key in config.reset) UI.setTable(table,UI.menu[key],config.reset[key],key);
                document.body.appendChild(table);
            }
            else table = table[0];
            table.onmouseover = () => window.clearTimeout(timer);
            table.onmouseout = () => {timer = window.setTimeout(() => {table.setAttribute("hidden","hidden");localStorage.setItem("LSBOC",JSON.stringify(config));},500);}
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
                if (input.checked){if (key in config.rewrite) config.rewrite[key] = 1;else config.reset[key] = 1;}
                else {if (key in config.rewrite) config.rewrite[key] = 0;else config.reset[key] = 0;}
            }
        },
        "menu" : {
            /* 选项说明 */
            "av" : ["av(BV)","启用旧版av(BV)页"],
            "bangumi" : ["Bangumi","启用旧版番剧页"],
            "watchlater" : ["稍后再看","启用旧版稍后再看"],
            "frame" : ["嵌入式播放器","替换嵌入式播放器"],
            "home" : ["主页","启用旧版Bilibili主页"],
            "playlist" : ["playlist","播单页重定向"],
            "grobalboard" : ["版头和版底","替换新版版头和版底"],
            "replyfloor" : ["评论楼层","显示评论的楼层号"],
            "headblur" : ["顶栏透明度","使顶栏全透明"],
            "preview" : ["付费预览框","去除播放器左下角付费预览框"],
            "livelogo" : ["直播水印","去除直播间Bilibili水印"],
            "searchwrap" : ["搜索框字体","重设搜索页字号"],
            "jointime" : ["注册时间","个人空间显示B站账号注册时间"],
            "lostvideo" : ["失效视频","修复收藏和频道中的失效视频信息"],
            "online" : ["在线数据","恢复Bilibili主页在线人数及投稿数"],
            "bvid2av" : ["BV⇒av","BV重定向到av"],
            "selectdanmu" : ["弹幕列表","首选弹幕列表而非推荐视频"],
            "episodedata" : ["番剧分集数据","显示番剧单回的播放数和弹幕数"],
            "like" : ["点赞","添加旧版播放页添加点赞功能"]
        }
    }
    const sort = {
        "video" : () => {
            try {
                if (config.reset.bvid2av && LOCATION[4].toLowerCase().startsWith('bv')) history.replaceState(null,null,"https://www.bilibili.com/video/av" + handle.chansId(LOCATION[4]) + location.search + location.hash);
                if (!config.rewrite.av) return;
                DOCUMENT = xhr.false(location.href);
                if (DOCUMENT.match("__INITIAL_STATE__=")) {
                    if (DOCUMENT.match('"code":404')) return;
                    let __INITIAL_STATE__ = JSON.parse(DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace("INITIAL_STATE__=","").replace(";(function",""));
                    if (DOCUMENT.match('playinfo__')) {
                        __playinfo__ = JSON.parse(DOCUMENT.match(/playinfo__=.+?\<\/script>/)[0].replace("playinfo__=","").replace("</script>",""));
                        unsafeWindow.__playinfo__ = __playinfo__;
                        log.debug(__playinfo__);
                    }
                    if (__INITIAL_STATE__.videoData.stein_guide_cid) return;
                    aid = __INITIAL_STATE__.aid?__INITIAL_STATE__.aid:aid;
                    tid = __INITIAL_STATE__.videoData.tid?__INITIAL_STATE__.videoData.tid:tid;
                    unsafeWindow.__INITIAL_STATE__ = __INITIAL_STATE__;
                    handle.write(API.pageframe.video);
                    handle.fixSort.av();
                    handle.setLike.start();
                }
            } catch(e) {log.error(e)}
        },
        "watchlater" : () => {
            try {
                if (!config.rewrite.watchlater || !uid) return;
                if (LOCATION[5]) {
                    handle.write(API.pageframe.watchlater);
                    handle.setLike.start();
                    handle.fixSort.watchlater.start();
                    aid = LOCATION[5].match(/[0-9]+/)?LOCATION[5].match(/[0-9]+/)[0]:aid;
                    if (LOCATION[5].toLowerCase().startsWith('bv')){
                        aid = handle.chansId(LOCATION[5]);
                        LOCATION[5] = "av" + aid;
                        history.replaceState(null,null,LOCATION.join("/"));
                    }
                }
            } catch(e){log.error(e)}
        },
        "bangumi" : () => {
            try {
                if (!config.rewrite.bangumi) return;
                DOCUMENT = xhr.false(location.href);
                if (DOCUMENT.match('__INITIAL_STATE__=')) {
                    let id = location.href.match(/[0-9]+/)[0];
                    if (LOCATION[5].startsWith('ss')) __INITIAL_STATE__ = INITIAL_STATE.bangumi(xhr.false(handle.obj2search(API.url.season,{"season_id":id})),null);
                    if (LOCATION[5].startsWith('ep')) __INITIAL_STATE__ = INITIAL_STATE.bangumi(xhr.false(handle.obj2search(API.url.season,{"ep_id":id})),id);
                    unsafeWindow.__INITIAL_STATE__ = __INITIAL_STATE__;
                    if (DOCUMENT.match('"specialCover":""')) handle.write(API.pageframe.bangumi); else handle.write(API.pageframe.cinema);
                    handle.setBangumi.start(__INITIAL_STATE__);
                }
            } catch(e){log.error(e)}
        },
        "frame" : () => {
            if (!config.rewrite.frame) return;
            let link = location.href;
            let season_type = link.match(/season_type=[0-9]*/)?1*link.match(/season_type=[0-9]*/)[0].replace("season_type=",""):"";
            let player_type = link.match(/player_type=[0-9]*/)?1*link.match(/player_type=[0-9]*/)[0].replace("player_type=",""):"";
            aid = link.match(/aid=[0-9]*/)?1*link.match(/aid=[0-9]*/)[0].replace("aid=",""):1*handle.chansId(link.match(/bvid=[A-Za-z0-9]*/)[0].replace("bvid=",""));
            aid = aid?aid:1*handle.chansId(link.match(/aid=[A-Za-z0-9]*/)[0].replace('aid=',""));
            cid = link.match(/cid=[0-9]*/)?1*link.match(/cid=[0-9]*/)[0].replace("cid=",""):cid;
            cid = cid?cid:JSON.parse(xhr.false(handle.obj2search(API.url.pagelist,{"aid":aid}))).data[0].cid;
            location.replace(handle.obj2search(API.playerframe.html5player,{"aid":aid,"cid":cid,"season_type":season_type,"player_type":player_type,"as_wide":1,"urlparam":"module%253Dbangumi","crossDomain":"true"}));
            log.log("嵌入式播放器：aid=" + aid + " cid=" + cid);
        },
        "playlist" : () => {
            try {
                if (!config.rewrite.playlist) return;
                let pl = LOCATION[5].match(/[0-9]+/)[0];
                location.replace(handle.obj2search(API.playerframe.playlist,{"pl":pl}));
            } catch(e) {log.error(e);}
        },
        "home" : () => {
            try {
                if (config.rewrite.home) {
                    DOCUMENT = xhr.false(location.href);
                    __INITIAL_STATE__ = DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace("INITIAL_STATE__=","").replace(";(function","");
                    unsafeWindow.__INITIAL_STATE__ = INITIAL_STATE.home(__INITIAL_STATE__);
                    handle.write(API.pageframe.home);
                }
                handle.setOnline.start();
            } catch(e) {log.error(e)}
        },
        "space" : () => {
            mid = LOCATION[3]?1*LOCATION[3]:mid;
            handle.setJoinTime.start();
        },
        "all" : () => {
            let timer;
            if (window.self == window.top) UI.start();
            if (!LOCATION[2].match("live.bilibili.com")) handle.setGlobalStyle();
            document.addEventListener("DOMNodeInserted",(msg) => {
                let head = document.getElementById("internationalHeader");
                if (msg.target.id == "bofqi") msg.target.removeAttribute("style");
                if (msg.target.id == "internationalHeader") handle.reSction();
                if (msg.target.id == "bili-header-m") if (head) head.remove();
                if (msg.target.className == "bilibili-player-video-subtitle") handle.selectDanmu();
                if (msg.target.src && msg.target.src.startsWith('https://api.bilibili.com/x/v2/reply?')) oidsrc = msg.target.src;
                if (msg.target.src && msg.target.src.match("//api.bilibili.com/x/space/channel/video?")) src = msg.target.src;
                if (msg.relatedNode.getAttribute("class") == "row video-list clearfix") handle.fixVideoLost.channel.start(src);
                if (msg.target.className == "small-item disabled") handle.fixVideoLost.favlist.start(msg);
                handle.fixvar();
                handle.avdesc();
                handle.removeBlur();
                handle.deleteElement();
                handle.removePreview();
                handle.removeLiveLogo();
                handle.fixVideoLost.home(msg);
                if (oidsrc) {
                    if (msg.target.className && (msg.target.className == "main-floor" || msg.target.className == "list-item reply-wrap ")){
                        window.clearTimeout(timer);
                        timer = window.setTimeout(() => {handle.setReplyFloor.start(oidsrc);},1000);
                    }
                }
            });
        }
    }
    CONFIG = JSON.parse(JSON.stringify(config));
    try {
        let data = JSON.parse(localStorage.getItem("LSBOC"));
        for (let key in data.rewrite) if (key in config.rewrite) config.rewrite[key] = data.rewrite[key];
        for (let key in data.reset) if (key in config.reset) config.reset[key] = data.reset[key];
    } catch(e) {localStorage.setItem("LSBOC",JSON.stringify(config));}
    try {
        let bilibili_player_settings = JSON.parse(localStorage.getItem("bilibili_player_settings"));
        uid = handle.getCookies().DedeUserID;
        if (bilibili_player_settings) {
            if (bilibili_player_settings.video_status.autopart !== "") localStorage.setItem("bilibili_player_settings_copy",JSON.stringify(bilibili_player_settings));
            else localStorage.setItem("bilibili_player_settings",localStorage.getItem("bilibili_player_settings_copy"));
        }
        if (uid) {
            let offset = handle.getCookies()["bp_video_offset_"+ uid];
            if (offset) document.cookie = "bp_t_offset_" + uid + "=" + offset + "; domain=bilibili.com; expires=Aug, 18 Dec 2038 18:00:00 GMT; path=/";
        }
    } catch(e) {}
    if (LOCATION[3]) {
        if (LOCATION[3] == 'video' && (LOCATION[4].toLowerCase().startsWith('av') || LOCATION[4].toLowerCase().startsWith('bv'))) sort.video();
        if (LOCATION[3] == 'watchlater') sort.watchlater();
        if (LOCATION[3] == 'bangumi' && LOCATION[4] == 'play') sort.bangumi();
        if (LOCATION[3] == 'blackboard' && LOCATION[4] && LOCATION[4].startsWith('newplayer')) sort.frame();
        if (LOCATION[3] == 'playlist' && LOCATION[5].startsWith('pl')) sort.playlist();
        if (LOCATION[2] == 'space.bilibili.com') sort.space();
        if (LOCATION[2] == 'www.bilibili.com' && (LOCATION[3].startsWith('\?') || LOCATION[3].startsWith('\#') || LOCATION[3].startsWith('index.'))) sort.home();
    } else {if (LOCATION[2] == 'www.bilibili.com') sort.home()}
    sort.all();
})();
