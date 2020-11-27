// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      3.7.7
// @description  恢复原生的旧版页面，包括主页和播放页。
// @author       MotooriKashin, wly5556
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @match        *://*.bilibili.com/*
// @connect      bilibili.com
// @connect      biliplus.com
// @connect      jijidown.com
// @connect      mcbbs.net
// @require      https://cdn.jsdelivr.net/npm/protobufjs@6.10.1/dist/protobuf.js
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT License
// ==/UserScript==

(function () {
    'use strict';

    // 全局变量
    let ml, aid, cid, mid, oid, pgc, src, tid, uid, url, xml, bvid, limit, defig;
    let arr = [], ids = [], obj = {}, mdf = {}, hash = [], bloburl = {};
    let DOCUMENT, __playinfo__, __INITIAL_STATE__;
    let LOCATION = document.location.href.split('/');

    // protobuf初始化
    const root = window.protobuf.Root.fromJSON(JSON.parse('{"nested":{"bilibili":{"nested":{"DmWebViewReply":{"fields":{"state":{"type":"int32","id":1},"text":{"type":"string","id":2},"textSide":{"type":"string","id":3},"dmSge":{"type":"DmSegConfig","id":4},"flag":{"type":"DanmakuFlagConfig","id":5},"specialDms":{"rule":"repeated","type":"string","id":6},"checkBox":{"type":"bool","id":7},"count":{"type":"int64","id":8},"commandDms":{"rule":"repeated","type":"CommandDm","id":9},"dmSetting":{"type":"DanmuWebPlayerConfig","id":10}}},"CommandDm":{"fields":{"id":{"type":"int64","id":1},"oid":{"type":"int64","id":2},"mid":{"type":"int64","id":3},"command":{"type":"string","id":4},"content":{"type":"string","id":5},"progress":{"type":"int32","id":6},"ctime":{"type":"string","id":7},"mtime":{"type":"string","id":8},"extra":{"type":"string","id":9},"idStr":{"type":"string","id":10}}},"DmSegConfig":{"fields":{"pageSize":{"type":"int64","id":1},"total":{"type":"int64","id":2}}},"DanmakuFlagConfig":{"fields":{"recFlag":{"type":"int32","id":1},"recText":{"type":"string","id":2},"recSwitch":{"type":"int32","id":3}}},"DmSegMobileReply":{"fields":{"elems":{"rule":"repeated","type":"DanmakuElem","id":1}}},"DanmakuElem":{"fields":{"id":{"type":"int64","id":1},"progress":{"type":"int32","id":2},"mode":{"type":"int32","id":3},"fontsize":{"type":"int32","id":4},"color":{"type":"uint32","id":5},"midHash":{"type":"string","id":6},"content":{"type":"string","id":7},"ctime":{"type":"int64","id":8},"weight":{"type":"int32","id":9},"action":{"type":"string","id":10},"pool":{"type":"int32","id":11},"idStr":{"type":"string","id":12}}},"DanmuWebPlayerConfig":{"fields":{"dmSwitch":{"type":"bool","id":1},"aiSwitch":{"type":"bool","id":2},"aiLevel":{"type":"int32","id":3},"blocktop":{"type":"bool","id":4},"blockscroll":{"type":"bool","id":5},"blockbottom":{"type":"bool","id":6},"blockcolor":{"type":"bool","id":7},"blockspecial":{"type":"bool","id":8},"preventshade":{"type":"bool","id":9},"dmask":{"type":"bool","id":10},"opacity":{"type":"float","id":11},"dmarea":{"type":"int32","id":12},"speedplus":{"type":"float","id":13},"fontsize":{"type":"float","id":14},"screensync":{"type":"bool","id":15},"speedsync":{"type":"bool","id":16},"fontfamily":{"type":"string","id":17},"bold":{"type":"bool","id":18},"fontborder":{"type":"int32","id":19},"drawType":{"type":"string","id":20}}}}}}}'));
    const protoSeg = root.lookupType('bilibili.DmSegMobileReply');
    const protoView = root.lookupType('bilibili.DmWebViewReply');

    // 脚本默认设置：0 - 关闭，1 - 开启
    // 一般直接修改这里无效，脚本读取的是管理器中的数据
    const config = {
        rewrite: {
            av: 1,
            bangumi: 1,
            watchlater: 1,
            frame: 1,
            home: 1,
            medialist: 1,
            rank: 1
        },
        reset: {
            xhrhook: 1,
            danmuku: 1,
            livechat: 1,
            limit: 0,
            accesskey: 0,
            grobalboard: 1,
            replyfloor: 1,
            headblur: 0,
            preview: 1,
            jointime: 1,
            lostvideo: 1,
            bvid2av: 1,
            selectdanmu: 0,
            episodedata: 1,
            like: 1,
            static: 1,
            download: 1,
            dlother: 0,
            heartbeat: 0,
            carousel: 0,
            adloc: 0,
            roomplay: 0,
            history: 0,
            electric: 0,
            panel: 0,
            midcrc: 0,
            viewbofqi: 0,
            widescreen: 0,
            danmakuoff: 0,
            oldreply: 0
        }
    }

    // 统一api接口
    const API = {
        // 网页框架
        pageframe: {
            watchlater: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="spm_prefix" content="333.342"/><link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css"><link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css" rel="stylesheet"><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div class="z-top-container has-menu"></div><div id="viewlater-app"><app></app></div><div class="footer bili-footer"></div><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script><script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/js/main.2111469a1bbc20e2e885.js"></script></body></html>',
            playlist: '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta charset="utf-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="renderer" content="webkit" /><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" /><meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" /><meta name="spm_prefix" content="333.44" /><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><meta charset="utf-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="renderer" content="webkit" /><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" /><meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" /><meta name="spm_prefix" content="0" /><link href="//s1.hdslb.com/bfs/static/jinkela/playlist-video/css/playlist_video.0.87292febba67b03f65d05c15d03e325d9db4f56a.css" rel="stylesheet" /><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div id="playlist-video-app"></div><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script><script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"></script></body></html>',
            bangumi: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script><script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.css" /></head><body><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true" class="main-container"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js" crossorigin="" defer="defer"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script type="text/javascript">0</script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>',
            detail: '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta charset="utf-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="renderer" content="webkit" /><meta name="spm_prefix" content="333.43" /><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" /><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><link rel="preload" href="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/manifest.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js" as="script" /><link rel="preload" href="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/vendor.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js" as="script" /><link rel="preload" href="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/playlist_detail.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js" as="script" /><link rel="preload" href="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/css/playlist_detail.1.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.css" as="style" /><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/css/playlist_detail.1.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.css" /></head><body><div id="playlist-detail-app"></div><div id="app" data-server-rendered="true" class="pl-app"></div><script src="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/manifest.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/vendor.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/playlist_detail.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js" defer="defer"></script><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script></body></html>',
            cinema: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script><script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.css" /></head><body><div class="z-top-container " style="height:42px"></div><div id="app" data-server-rendered="true" class="main-container special"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js" crossorigin="" defer="defer"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script type="text/javascript">0</script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>',
            video: '<!DOCTYPE html><html><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" /><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}} .video-info-m .number .like b, .video-info-m .number .like i {background : url(//static.hdslb.com/images/base/icons.png);}</style></head><body><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><div class="z-top-container has-menu"></div><div id="video-page-app"></div><div id="app" data-server-rendered="true"></div><div class="bili-wrapper" id="bofqi"></div><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript">function getQueryString(e){var r=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),i=window.location.search.substr(1).match(r);return null!=i?unescape(i[2]):null}window.getInternetExplorerVersion=function(){var e=-1;if("Microsoft Internet Explorer"==navigator.appName){var r=navigator.userAgent;null!=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r)&&(e=parseFloat(RegExp.$1))}return e};var vd=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.videoData;if(vd&&vd.aid&&9!==getInternetExplorerVersion()){if($("#__bofqi").innerHTML=\'<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>\',vd.embedPlayer){var p=getQueryString("p")?getQueryString("p")-1:0,player={aid:vd.aid,cid:vd.pages[p]&&vd.pages[p].cid||vd.pages[0].cid};EmbedPlayer("player","//static.hdslb.com/play.swf","cid="+player.cid+"&aid="+player.aid+"&pre_ad=")}vd.embed&&$("#bofqi").html(vd.embed)}else $("#bofqi").remove()</script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script></body></html>',
            home: '<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css"></head><body><div id="home-app"></div><div id="app" data-server-rendered="true"></div><script src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin></script><script type="text/javascript" defer="defer" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script><link rel="prefetch" as="script" href="//static.hdslb.com/js/video.min.js"></body></html>',
            rank: '<!DOCTYPE html><html lang="zh-Hans" xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-Hans"><head><title>热门视频排行榜 - 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta charset="utf-8" /><meta name="spm_prefix" content="333.158" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="renderer" content="webkit" /><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" /><meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" /><link rel="preload" href="//s1.hdslb.com/bfs/static/jinkela/rank/1.rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js" as="script" /><link rel="preload" href="//s1.hdslb.com/bfs/static/jinkela/rank/css/rank.0.ba58f8684a87651e0e1c576df8f918bfa10c1a90.css" as="style" /><link rel="preload" href="//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js" as="script" /><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/rank/css/rank.0.ba58f8684a87651e0e1c576df8f918bfa10c1a90.css" /></head><body><div class="z-top-container has-menu"></div><div id="rank-app"></div><script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js" defer="defer"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin=""></script><div id="app" data-server-rendered="true"></div><script src="//s1.hdslb.com/bfs/static/jinkela/rank/1.rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js" defer="defer"></script><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js" defer="defer"></script></body></html>'
        },
        // 样式表
        style: {
            playshadow: "#bilibiliPlayer, #bofqi.mini-player {box-shadow : 0px 2px 8px 0px rgba(0,160,216,0.3) !important;}",
            download: "#bili-old-download-table {position : fixed;z-index : 3300;bottom : 0;background : #f6f6f6;width : 100%;text-align : center;}#bili-old-download-table .download-box {background-color : #fff;color : #000 !important;border : #ccc 1px solid;border-radius : 3px;display : inline-block;margin : 3px;}.download-mp4 {color : #fff !important;background-color : #c0f;background-image : linear-gradient(to right, #c0f, #90f);}.download-avc {color : #fff !important;background-color : #f00;background-image : linear-gradient(to right, #f00, #c00);}.download-hev {color : #fff !important;background-color : #ffe42b;background-image : linear-gradient(to right, #ffe42b, #dfb200);}.download-aac {color : #fff !important;background-color : #0d0;background-image : linear-gradient(to right, #0d0, #0a0);}.download-flv {color : #fff !important;background-color : #f90;background-image : linear-gradient(to right, #f90, #d70);}.download-type {color : #000 !important;display : table-cell;min-width : 1.5em;padding : 1px 3px;text-align : center;vertical-align : middle;}#bili-old-download-table a {display : table-cell;padding : 3px;text-decoration : none;}.quality-tops {background-color : #ffff00;}.quality-top {background-color : #ffe42b;}.quality-highs {background-color : #f5f;}.quality-high {background-color : #c0f;}.quality-1080ps {background-color : #f00;}.quality-1080p {background-color : #d00;}.quality-720p {background-color : #f90;}.quality-480p {background-color : #00d;}.quality-360p {background-color : #0d0;}.download-quality {color : #fff !important;padding : 1px 3px;text-align : center;}.download-size {font-size : 90%;margin-top : 2px;padding : 1px 3px;text-align : center;}",
            jointime: ".user .info .meta .row {height : 88px;white-space : normal;}.user .info .jointime .icon {background-position : -209px -84px;}.user .info .jointime .text {color : #00a1d6;}}",
            online: ".online a {color : rgb(109, 117, 122);}.popularize-module .online em {display : inline-block;height : 10px;line-height : 10px;vertical-align : top;border-left : 1px solid rgb(184, 192, 204);margin : 12px 15px 0px;}",
            search: ".search-wrap .search-block .input-wrap input {font : 400 13.3333px Arial !important;}",
            uiface: "#ui-face {box-sizing : content-box;color : #fff;background-color : rgb(255,255,255);border-radius:5px;position : fixed;padding : 4px;bottom : 65px;width : 56px;height : 40px;transition : right 0.7s;-moz-transition : right 0.7s;-webkit-transition : right 0.7s;-o-transition : right 0.7s;z-index : 1008;}#ui-face i {background-position : -471px -982px;display : block;width : 20px;height : 20px;margin : auto;transition : 0.2s;background-image : url(//static.hdslb.com/images/base/icons.png);}#ui-face span {font-size : 14px;display : block;width : 50%;margin : auto;transition : 0.2s;color : rgb(0,0,0)}#ui-table {box-sizing : content-box;color : #fff;background-color : rgb(255,255,255);border-radius:5px;font-size : 14px;position : fixed;padding : 4px;bottom : 30px;right : 58px;width : 200px;height : 360px;line-height : normal;box-shadow : rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border : 1px solid rgb(233, 234, 236);overflow-y : scroll;z-index : 10008;}.checke{float : right;position : relative;-webkit-appearance : none;width : 40px;height : 20px;line-height : 20px;background : #eee;border-radius : 10px;outline : none;border : 2px solid #999999;}.checke:before{position : absolute;left : 0;content : '';width : 12px;height : 12px;border-radius : 50%;background : #eee;box-shadow : 0px 0px 5px #ddd;transition : all 0.2s linear;border : 2px solid #999999;}.checke:checked{   background : #01a1d6;}.checke:checked:before{left : 20px;transition : all 0.2s linear;}#ui-state {border-radius : 5px;z-index : 1000;width : auto;position : fixed;right : 280px;color : #fff;background : #0008;padding : 1rem;font-size : 12pt;top : 50%;transform : translateY(-50%);transition : .2s ease-out .8s;max-width : 20%;line-height : 2;white-space : pre-wrap;pointer-events : none;opacity : 1;}.video_download {cursor : pointer;width : 46px;height : 48px;background-color : #f6f9fa;background-position : -1353px -1095px;background-repeat : no-repeat;border : 1px solid #e5e9ef;overflow : hidden;border-radius : 4px;display : inline-block;background-image : url(//static.hdslb.com/images/base/icons.png);}.video_download:hover {background-color : #00a1d6;border-color : #00a1d6;}.bili-header-m .head-banner{background-position: center 0 !important;background-size: cover !important;} .bb-comment .comment-header .header-page, .comment-bilibili-fold .comment-header .header-page {float: right;line-height: 36px;}.bb-comment .comment-list .list-item .user-face img, .comment-bilibili-fold .comment-list .list-item .user-face img {width: 48px;height: 48px;border-radius: 50%;}.bb-comment .comment-list .list-item .user-face .pendant, .comment-bilibili-fold .comment-list .list-item .user-face .pendant {width: 86px;height: 86px;position: absolute;top: -19px;left: -19px;display: block;}.bb-comment .comment-list .list-item .user-face .pendant img, .comment-bilibili-fold .comment-list .list-item .user-face .pendant img {border: 0;border-radius: 0;width: 86px;height: 86px;}",
            bofqi: "#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}",
            gray: "html {filter:grayscale(100%);-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);-webkit-filter:grayscale(1);}",
            like: ".video-info-module .number .like b, .video-info-module .number .like i {background : url(//static.hdslb.com/images/base/icons.png);display : inline-block;margin-top : -3px;vertical-align : middle;}",
        },
        // 播放器框架
        playerframe: {
            html5player: "https://www.bilibili.com/blackboard/html5player.html", // aid, cid, season_type player_type + &as_wide=1
            playlist: "https://www.bilibili.com/blackboard/playlist-player.html", // pl || aid, cid
            ancient: "https://www.bilibili.com/blackboard/activity-ancient-player.html", // aid, cid
            player: "https://player.bilibili.com/player.html", // aid,cid &| page
        },
        // URL
        url: {
            spacedetial: "https://api.bilibili.com/medialist/gateway/base/spaceDetail", // media_id, pn + &ps=20&keyword=&order=mtime&type=0&tid=0
            channel: "https://api.bilibili.com/x/space/channel/video", // mid, cid, pn + &ps=30&order=0
            biliplus: "https://www.biliplus.com/video/av",
            jijidown: "https://www.jijidown.com/video/av",
            online: "https://api.bilibili.com/x/web-interface/online",
            stat: "https://api.bilibili.com/x/web-interface/archive/stat", // aid
            replymain: "https://api.bilibili.com/x/v2/reply/main", // oid, type, mode &| next
            reply: "https://api.bilibili.com/x/v2/reply", // type,sort,oid,pn
            replycursor: "https://api.bilibili.com/x/v2/reply/reply/cursor", // oid, root, type &| sort
            replydialog: "https://api.bilibili.com/x/v2/reply/dialog/cursor",
            membercard: "https://account.bilibili.com/api/member/getCardByMid", // mid
            season: "https://api.bilibili.com/pgc/view/web/season", // season_id || ep_id
            pagelist: "https://api.bilibili.com/x/player/pagelist", // aid
            view: "https://api.bilibili.com/x/web-interface/view", // aid || bvid
            haslike: "https://api.bilibili.com/x/web-interface/archive/has/like", // aid
            like: "https://api.bilibili.com/x/web-interface/archive/like",
            ids4Player: "https://api.bilibili.com/x/v1/medialist/resource/ids4Player", // media_id
            cards: "https://api.bilibili.com/x/article/cards", // ids
            medialist: "https://api.bilibili.com/x/v1/medialist/detail", // media_id && pn=1&ps=1
            x: "https://api.bilibili.com/x/player/playurl", // avid | bvid, cid, qn + fourk=1&type=&otype=json |+ &fnver=0&fnval=16
            pgc: "https://api.bilibili.com/pgc/player/web/playurl", // avid | bvid, cid, qn + fourk=1&type=&otype=json |+ &fnver=0&fnval=16
            sign: "https://interface.bilibili.com/v2/playurl", // appkey, cid=, otype=json, qn, quality, type
            proj: "https://app.bilibili.com/v2/playurlproj", // appkey, cid=, otype=json, qn
            pgcproj: "https://api.bilibili.com/pgc/player/api/playurlproj", // appkey, cid=, otype=json, platform=android_i, qn
            BPplayurl: "https://www.biliplus.com/BPplayurl.php", // [origin] + &module=pgc&balh_ajax=1
            ranklist: "https://api.bilibili.com/pgc/season/rank/web/list", // season_type, &day=3
            detail: "https://api.bilibili.com/x/web-interface/view/detail", // aid
            playlist: "https://api.bilibili.com/x/playlist/video/toview", // pid
            card: "https://api.bilibili.com/x/web-interface/card", // mid
            listso: "https://api.bilibili.com/x/v1/dm/list.so", //oid
            ranking: "https://api.bilibili.com/x/web-interface/ranking" // rid=0&day=3&type=1&arc_type=0
        },
        // 未识别分区对照表
        sort: {
            1: [1, "动画", "https://www.bilibili.com/v/douga/"],
            3: [3, "音乐", "https://www.bilibili.com/v/music/"],
            29: [3, "音乐现场", "https://www.bilibili.com/v/music/live"],
            36: [36, "科技", "https://www.bilibili.com/v/technology"],
            86: [1, "特摄", "https://www.bilibili.com/v/douga/"],
            95: [188, "手机平板", "https://www.bilibili.com/v/digital/mobile/"],
            129: [129, "舞蹈", "https://www.bilibili.com/v/dance"],
            155: [155, "时尚", "https://www.bilibili.com/v/fashion"],
            160: [160, "生活", "https://www.bilibili.com/v/life"],
            168: [168, "国创", "https://www.bilibili.com/guochuang"],
            176: [160, "汽车", "https://www.bilibili.com/v/life/automobile"],
            188: [188, "数码", "https://www.bilibili.com/v/digital"],
            189: [188, "电脑装机", "https://www.bilibili.com/v/digital/pc"],
            190: [188, "数码摄影", "https://www.bilibili.com/v/digital/photography"],
            191: [188, "影音智能", "https://www.bilibili.com/v/digital/intelligence_av"],
            192: [155, "风尚标", "https://www.bilibili.com/v/fashion/trends"],
            193: [3, "MV", "https://www.bilibili.com/v/music/mv"],
            194: [3, "电音", "https://www.bilibili.com/v/music/electronic"],
            195: [168, "动态漫·广播剧", "https://www.bilibili.com/v/guochuang/motioncomic"],
            198: [129, "街舞", "https://www.bilibili.com/v/dance/hiphop"],
            199: [129, "明星舞蹈", "https://www.bilibili.com/v/dance/star"],
            200: [129, "中国舞", "https://www.bilibili.com/v/dance/china"],
            201: [36, "科学科普", "https://www.bilibili.com/v/technology/science"],
            202: [202, "资讯", "https://www.bilibili.com/v/information/"],
            203: [202, "热点", "https://www.bilibili.com/v/information/hotspot/"],
            204: [202, "环球", "https://www.bilibili.com/v/information/global/"],
            205: [202, "社会", "https://www.bilibili.com/v/information/social/"],
            206: [202, "综合", "https://www.bilibili.com/v/information/multiple/"],
            207: [36, "财经", "https://www.bilibili.com/v/technology/finance"],
            208: [36, "校园学习", "https://www.bilibili.com/v/technology/campus"],
            209: [36, "职业职场", "https://www.bilibili.com/v/technology/career"],
            210: [1, "手办·模玩", "https://www.bilibili.com/v/douga/garage_kit"]
        },
        // 播放器通知
        message: [
            ['https://www.bilibili.com/blackboard/activity-4KPC.html', '解锁超清4K画质'],
            ['https://www.bilibili.com/blackboard/activity-4K120FPS-PC.html', '4K120FPS投稿全量开放'],
            ['https://www.bilibili.com/blackboard/bilibili2009.html', '十年前的B站长啥样'],
            ['https://www.bilibili.com/blackboard/html5playerhelp.html', 'HTML5播放器试用'],
        ]
    }

    // 调试模块封装
    const debug = {
        log: (...msg) => console.log("[" + deliver.timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
        error: (...msg) => console.error("[" + deliver.timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
        warn: (...msg) => console.warn("[" + deliver.timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
        debug: (...msg) => console.debug("[" + deliver.timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
        msg: (...msg) => { deliver.debug(...msg) }
    }

    // XMLHttpReques封装，除同步方法外统一返回promise
    const xhr = {
        // 同步方法
        'false': (url) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.withCredentials = true;
            xhr.send(null);
            return xhr.responseText;
        },
        // 异步方法
        'true': (url) => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.withCredentials = true;
                xhr.onload = () => resolve(xhr.response);
                xhr.onerror = () => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
                xhr.send();
            });
        },
        // 跨域方法
        GM: (url) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: (xhr) => resolve(xhr.responseText),
                    onerror: (xhr) => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT"),
                });
            })
        },
        // 表单方法
        post: (url, header, data) => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                header = header ? header : "application/x-www-form-urlencoded";
                xhr.open('post', url, true);
                xhr.setRequestHeader("Content-type", header);
                xhr.withCredentials = true;
                xhr.onload = () => resolve(xhr.response);
                xhr.onerror = () => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
                xhr.send(data);
            });
        }
    }

    // 重构__INITIAL_STATE__
    const INITIAL_STATE = {
        // av/BV
        av: (data) => {
            try {
                data = deliver.xhrJsonCheck(data).data;
                aid = aid || data.View.aid;
                cid = cid || data.View.cid;
                let dat = { aid: -1, comment: { count: 0, list: [] }, error: {}, isClient: false, p: "", player: "", playurl: {}, related: [], tags: [], upData: {}, videoData: {} }
                dat.aid = data.View.aid;
                dat.related = data.Related;
                dat.tags = data.Tags || [];
                dat.upData = data.Card.card;
                dat.upData.archiveCount = data.Card.archive_count;
                dat.videoData = data.View;
                dat.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + cid + '&aid=' + aid + '&pre_ad=")'
                return dat;
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("__INITIAL_STATE__·av", ...e) }
        },
        // bangumi
        bangumi: (epId) => {
            try {
                let ep = 0, rp = {}, ini = {}, pug = {}, mode;
                let dat = { "ver": {}, "loginInfo": {}, "canReview": false, "userShortReview": {}, "userLongReview": {}, "userScore": 0, "userCoined": false, "isPlayerTrigger": false, "area": 0, "app": false, "mediaRating": {}, "recomList": [], "playerRecomList": [], "paster": {}, "payPack": {}, "payMent": {}, "activity": {}, "spending": 0, "sponsorTotal": { "code": 0, "result": { "ep_bp": 0, "users": 0, "mine": {}, "list": [] } }, "sponsorWeek": { "code": 0, "result": { "ep_bp": 0, "users": 0, "mine": {}, "list": [] } }, "sponsorTotalCount": 0, "miniOn": true, "seasonFollowed": false, "epStat": {}, "ssStat": {} };
                if (DOCUMENT.startsWith("{")) {
                    // rp为api获取到的备用数据保存于DOCUMENT中，作为DOCUMENT被404的备用数据源，无法获取播放进度信息，以ss进入默认选择第一p
                    rp = deliver.xhrJsonCheck(DOCUMENT).result;
                    dat.special = rp.bkg_cover ? true : false;
                    if (epId) { dat.epId = 1 * epId; ep = 1; } else dat.epId = ""
                    dat.ssId = rp.season_id;
                    dat.mdId = rp.media_id;
                    dat.mediaInfo = {};
                    dat.mediaInfo.actors = rp.actors || "";
                    dat.mediaInfo.alias = rp.alias;
                    dat.mediaInfo.areas = rp.areas || [];
                    dat.mediaInfo.bkg_cover = rp.bkg_cover;
                    dat.mediaInfo.cover = rp.cover;
                    dat.mediaInfo.evaluate = rp.evaluate;
                    dat.mediaInfo.is_paster_ads = rp.is_paster_ads || 0;
                    dat.mediaInfo.jp_title = rp.jp_title;
                    dat.mediaInfo.link = rp.link;
                    dat.mediaInfo.media_id = rp.media_id;
                    dat.mediaInfo.mode = rp.mode;
                    dat.mediaInfo.paster_text = "";
                    dat.mediaInfo.season_id = rp.season_id;
                    dat.mediaInfo.season_status = rp.status;
                    dat.mediaInfo.season_title = rp.season_title;
                    dat.mediaInfo.season_type = rp.type;
                    dat.mediaInfo.square_cover = rp.square_cover;
                    dat.mediaInfo.staff = rp.staff || "";
                    dat.mediaInfo.stat = rp.state;
                    dat.mediaInfo.style = rp.style || [];
                    dat.mediaInfo.title = rp.title;
                    dat.mediaInfo.total_ep = rp.total;
                    dat.mediaRating = rp.rating;
                    dat.epList = rp.episodes;
                    if (ep == 0) dat.epId = (rp.episodes[0] && rp.episodes[0].id) || "";
                    for (let i = 0; i < dat.epList.length; i++) {
                        dat.epList[i].ep_id = dat.epList[i].id;
                        dat.epList[i].episode_status = dat.epList[i].status;
                        dat.epList[i].index = dat.epList[i].title;
                        dat.epList[i].index_title = dat.epList[i].long_title;
                        if (dat.epList[i].ep_id == dat.epId) dat.epInfo = dat.epList[i];
                        if (dat.epList[i].badge == "会员" || dat.epList[i].badge_type) ids.push(dat.epList[i].cid);
                    }
                    dat.newestEp = rp.new_ep;
                    dat.seasonList = rp.seasons;
                    dat.rightsInfo = rp.rights;
                    dat.pubInfo = rp.publish;
                    dat.upInfo = rp.up_info || {};
                }
                else {
                    // 正常DOCUMENT数据源，up组主数据可能无效，将指向uid=2(站长)
                    ini = JSON.parse(DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, ""));
                    pug = JSON.parse(DOCUMENT.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace(/PGC_USERSTATE__=/, "").replace(/<\/script>/, ""));
                    dat.special = ini.mediaInfo.specialCover ? true : false;
                    mode = dat.special ? 1 : 2;
                    if (epId) { dat.epId = 1 * epId; ep = 1; }
                    else { dat.epId = ""; if (pug.hasOwnProperty("progress")) { dat.epId = pug.progress.last_ep_id; ep = 1; } }
                    dat.ssId = ini.mediaInfo.ssId;
                    dat.mdId = ini.mediaInfo.id;
                    dat.mediaInfo = {};
                    dat.mediaInfo.actors = "";
                    dat.mediaInfo.alias = ini.mediaInfo.alias;
                    dat.mediaInfo.areas = [];
                    dat.mediaInfo.bkg_cover = ini.mediaInfo.specialCover;
                    dat.mediaInfo.cover = ini.mediaInfo.cover;
                    dat.mediaInfo.evaluate = ini.mediaInfo.evaluate;
                    dat.mediaInfo.is_paster_ads = 0;
                    dat.mediaInfo.jp_title = ini.mediaInfo.jpTitle;
                    dat.mediaInfo.link = "https://www.bilibili.com/bangumi/media/md" + dat.mdId;
                    dat.mediaInfo.media_id = dat.mdId;
                    dat.mediaInfo.mode = mode;
                    dat.mediaInfo.paster_text = "";
                    dat.mediaInfo.season_id = ini.mediaInfo.ssId;
                    dat.mediaInfo.season_status = ini.mediaInfo.status;
                    dat.mediaInfo.season_title = ini.mediaInfo.title;
                    dat.mediaInfo.season_type = ini.mediaInfo.ssType;
                    dat.mediaInfo.square_cover = ini.mediaInfo.squareCover;
                    dat.mediaInfo.staff = "";
                    dat.mediaInfo.stat = ini.mediaInfo.stat;
                    dat.mediaInfo.style = [];
                    dat.mediaInfo.title = ini.mediaInfo.title;
                    dat.mediaInfo.total_ep = ini.epList.length;
                    dat.mediaRating = ini.mediaInfo.rating;
                    dat.epList = [];
                    for (let i = 0; i < ini.sections.length; i++) ini.epList.push(...ini.sections[i].epList);
                    if (ep == 0) dat.epId = (ini.epList[0] && ini.epList[0].id) || "";
                    for (let i = 0; i < ini.epList.length; i++) {
                        dat.epList[i] = {};
                        dat.epList[i].aid = ini.epList[i].aid;
                        dat.epList[i].cid = ini.epList[i].cid;
                        dat.epList[i].badge = ini.epList[i].badge;
                        dat.epList[i].badge_type = ini.epList[i].badgeType;
                        dat.epList[i].cover = ini.epList[i].cover;
                        dat.epList[i].duration = -1;
                        dat.epList[i].ep_id = ini.epList[i].id;
                        dat.epList[i].episode_status = ini.epList[i].epStatus;
                        dat.epList[i].from = ini.epList[i].from;
                        dat.epList[i].index = ini.epList[i].title;
                        dat.epList[i].index_title = ini.epList[i].longTitle;
                        dat.epList[i].mid = ini.mediaInfo.upInfo.mid;
                        dat.epList[i].page = 1;
                        dat.epList[i].pub_real_time = ini.epList[i].releaseDate || ini.mediaInfo.pub.time;
                        dat.epList[i].section_id = -1;
                        dat.epList[i].section_type = 0;
                        dat.epList[i].vid = ini.epList[i].vid;
                        if (dat.epList[i].ep_id == dat.epId) dat.epInfo = dat.epList[i];
                        if (dat.epList[i].badge == "会员" || dat.epList[i].badge_type) ids.push(dat.epList[i].cid);
                    }
                    dat.newestEp = ini.mediaInfo.newestEp;
                    dat.seasonList = [];
                    for (let i = 0; i < ini.ssList.length; i++) {
                        dat.seasonList[i] = {};
                        dat.seasonList[i].badge = ini.ssList[i].badge;
                        dat.seasonList[i].badge_type = ini.ssList[i].badgeType;
                        dat.seasonList[i].cover = ini.ssList[i].cover;
                        dat.seasonList[i].media_id = -1;
                        dat.seasonList[i].new_ep = {
                            cover: ini.ssList[i].epCover,
                            id: -1,
                            index_show: ini.ssList[i].desc
                        };
                        dat.seasonList[i].season_id = ini.ssList[i].id;
                        dat.seasonList[i].season_title = ini.ssList[i].title;
                        dat.seasonList[i].season_type = ini.ssList[i].type;
                        dat.seasonList[i].stat = {
                            danmaku: 0,
                            follow: 0,
                            view: 0
                        };
                        dat.seasonList[i].title = ini.ssList[i].title;
                    }
                    dat.newestEp.isNew = dat.newestEp.isNew ? 1 : 0;
                    dat.rightsInfo = {};
                    dat.rightsInfo.allow_bp = ini.mediaInfo.rights.allowBp ? 1 : 0;
                    dat.rightsInfo.allow_download = 1;
                    dat.rightsInfo.allow_review = ini.mediaInfo.rights.allowReview ? 1 : 0;
                    dat.rightsInfo.copyright = "bilibili";
                    dat.rightsInfo.is_preview = ini.mediaInfo.rights.isPreview ? 1 : 0;
                    dat.rightsInfo.watch_platform = ini.mediaInfo.rights.appOnly ? 1 : 0;
                    dat.pubInfo = {};
                    dat.pubInfo.is_finish = ini.mediaInfo.pub.isFinish ? 1 : 0;
                    dat.pubInfo.is_started = ini.mediaInfo.pub.isStart ? 1 : 0;
                    dat.pubInfo.pub_time = ini.mediaInfo.pub.time;
                    dat.pubInfo.pub_time_show = ini.mediaInfo.pub.timeShow;
                    dat.pubInfo.weekday = -1;
                    dat.upInfo = {};
                    dat.upInfo.avatar = ini.mediaInfo.upInfo.avatar;
                    dat.upInfo.follower = "--";
                    dat.upInfo.is_vip = ini.mediaInfo.upInfo.isAnnualVip ? 1 : 0;
                    dat.upInfo.mid = ini.mediaInfo.upInfo.mid;
                    dat.upInfo.pendant = {
                        image: ini.mediaInfo.upInfo.pendantImage,
                        name: ini.mediaInfo.upInfo.pendantName,
                        pid: ini.mediaInfo.upInfo.pendantId
                    };
                    dat.upInfo.uname = ini.mediaInfo.upInfo.name;
                    dat.upInfo.verify_type = 6;
                    if (dat.upInfo.mid < 1) dat.upInfo = { avatar: "//i0.hdslb.com/bfs/face/ef0457addb24141e15dfac6fbf45293ccf1e32ab.jpg", follower: 897603, is_vip: 1, mid: 2, pendant: { image: "", name: "", pid: 0 }, uname: "碧诗", verify_type: 2 }
                }
                dat.seasonStat = { "views": 0, "danmakus": 0, "coins": 0, "favorites": 0 };
                dat.userStat = { "loaded": true, "error": false, "follow": 0, "pay": 0, "payPackPaid": 0, "sponsor": 0 };
                dat.userStat.watchProgress = pug.progress;
                dat.userStat.vipInfo = pug.vip_info;
                if (pug.dialog || pug.pay == 1) {
                    dat.payMent = { "price": "0.0", "promotion": "", "tip": "大会员专享观看特权哦~" };
                    if (pug.dialog) {
                        dat.payMent.vip_promotion = pug.dialog.title;
                        if (pug.dialog.btn_left) dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];
                    }
                }
                if (dat.epInfo.index >= 0) { dat.special = false; dat.mediaInfo.bkg_cover = ""; }
                return dat;
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("__INITIAL_STATE__·Bangumi", ...e) }
        },
        // 主页
        home: (data) => {
            try {
                let dat = {};
                let ini = JSON.parse(data);
                dat.recommendData = [];
                for (let i = 0; i < ini.recommendList.length; i++) {
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
                if (config.reset.adloc) for (let key in dat.locsData) if (dat.locsData[key]) for (let i = dat.locsData[key].length - 1; i >= 0; i--) if (dat.locsData[key][i].is_ad) { debug.debug("移除广告", key, dat.locsData[key][i]); dat.locsData[key].splice(i, 1); }
                if (dat.locsData[31][0] && dat.locsData[31][0].id == 0) dat.locsData[31] = [{ "id": 36585, "contract_id": "", "pos_num": 1, "name": "小黑屋弹幕举报", "pic": "https://i0.hdslb.com/bfs/archive/0aa2f32c56cb65b6d453192a3015b65e62537b9a.jpg", "litpic": "", "url": "https://www.bilibili.com/blackboard/activity-dmjbfj.html", "style": 0, "agency": "", "label": "", "intro": "", "creative_type": 0, "request_id": "1546354354629q172a23a61a62q626", "src_id": 32, "area": 0, "is_ad_loc": true, "ad_cb": "", "title": "", "server_type": 0, "cm_mark": 0, "stime": 1520478000, "mid": "14629218" }];
                return dat;
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("__INITIAL_STATE__·Home", ...e) }
        },
        playlist: () => { return { "mid": 26468955, "pid": 769, "plinfoData": { "attr": 2, "count": 100, "cover": "https://i0.hdslb.com/bfs/archive/a45ef4fcde397247032cf4ce0c8f71815f9e28d0.jpg", "ctime": 1529021131, "description": "bilibili moe 2018 动画角色人气大赏日本动画场应援视频播单 / 每天不定时更新最新的一批", "favored": 1, "id": 1826036, "is_favorite": true, "mid": 26468955, "mtime": 1533874759, "name": "bilibili moe 2018 日本动画场应援", "owner": { "face": "http://i2.hdslb.com/bfs/face/57389d533621407d36981a99fed93834dd8b20e6.jpg", "mid": 26468955, "name": "萌战基" }, "pid": 769, "stat": { "favorite": 1685, "pid": 769, "reply": 10, "share": 0, "view": 298928 }, "state": 0, "type": 2 }, "pllistData": [{ "aid": 24883898, "attribute": 16768, "cid": 41980488, "copyright": 1, "ctime": 1528969754, "desc": "bilibili moe 2018 动画角色人气大赏日本动画场宣传PV / BGM : No.1 / Editor : @暗猫の祝福  \n\n活动地址 https://www.bilibili.com/moe/2018/jp/home\n\n了解活动最新动态请关注@哔哩哔哩萌战基", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 191, "dynamic": "#日本场应援##角色应援##bilibilimoe2018#", "owner": { "face": "http://i2.hdslb.com/bfs/face/1e711421fdd158a0cadc1c4351ca19a75ea712ec.jpg", "mid": 26366366, "name": "哔哩哔哩活动" }, "pages": [{ "cid": 41980488, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 191, "from": "vupload", "page": 1, "part": "bilibili moe 2018 动画角色人气大赏 - 日本动画场PV", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/6e7ce18cca1965da52090e96c03c095ee97f43a7.jpg", "pubdate": 1529121652, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 24883898, "coin": 30379, "danmaku": 38599, "dislike": 0, "favorite": 29868, "his_rank": 76, "like": 18109, "now_rank": 0, "reply": 18082, "share": 12878, "view": 1072577 }, "state": 0, "tid": 24, "title": "bilibili moe 2018 动画角色人气大赏日本动画场宣传PV", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28854498, "attribute": 16768, "cid": 50012938, "copyright": 1, "ctime": 1533734369, "desc": "因为是突然心血来潮的作品，所以也没有特意去找无字幕的片源，直接用了带字幕的。所以中间有一段我添加了部分马赛克。\n之前已经做过一次关于（Fate/Stay night 宛若天堂）这一条樱线的视频了，但是上一次毕竟是战斗画面为主，所以这一次我决定给樱做一期她为主角的剪辑视频，希望大家可以喜欢。\nBGM：River Flows in You", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 192, "dynamic": "#日本场应援2018##AMV##MAD#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/d6c946012742c3c86839fc2caf547a99159009ad.jpg", "mid": 24626247, "name": "星火琉璃酱" }, "pages": [{ "cid": 50012938, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 192, "from": "vupload", "page": 1, "part": "【AMV】樱，你是我喜欢的女孩。", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/dacc8024b48b7cc756b27e2945bd7d7d9cbbc387.jpg", "pubdate": 1533734369, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28854498, "coin": 27, "danmaku": 31, "dislike": 0, "favorite": 22, "his_rank": 0, "like": 29, "now_rank": 0, "reply": 7, "share": 4, "view": 4788 }, "state": 0, "tid": 24, "title": "【AMV】樱，你是我喜欢的女孩。", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28854218, "attribute": 16768, "cid": 50011454, "copyright": 1, "ctime": 1533733783, "desc": "尼禄殿下好可爱啊，用了前十集的素材。一共30多个唔嗯，有些不能用，用了好长时间剪素材\n动漫：Fate/EXTRA Last Encore，其实我觉得这番挺好看的，内容也是有点，可能还是和UBW有点差距吧\nBGM：Unity", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 121, "dynamic": "#日本场应援2018##新星计划##尼禄#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/67d4c8c9a6d9b58fd5c935047c64cdd3b5cadbef.jpg", "mid": 14911961, "name": "抹不去の伤痛" }, "pages": [{ "cid": 50011454, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 121, "from": "vupload", "page": 1, "part": "FateEXTRA Last Encore - 如今在古老边狱之底(Av18806005,P1)", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/8a213e873515eda27d474f0c9cc31e6c47166cb3.jpg", "pubdate": 1533733783, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28854218, "coin": 56, "danmaku": 47, "dislike": 0, "favorite": 96, "his_rank": 0, "like": 91, "now_rank": 0, "reply": 21, "share": 28, "view": 6641 }, "state": 0, "tid": 27, "title": "尼禄殿下世界第一可爱", "tname": "综合", "videos": 1 }, { "aid": 28851731, "attribute": 24704, "cid": 49951942, "copyright": 1, "ctime": 1533733741, "desc": "米娜桑，大家好！这次趁着B萌赶紧做一波应援视频，希望大家喜欢！btw考虑一下投凛哟~\n使用素材: Fate/Grand Order, Fate/Stay Night UBW, Fate/Zero, Fate,/Stay Night HF, Fate/Hollow Ataraxia\n视频类型: AMV/MAD\nBGM【音乐名】: Illuminate\nBGM【音乐人】: Minami", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 287, "dynamic": "#金闪闪##日本场应援2018##卫宫士郎##远坂凛#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/3c3eb61912831b33c83a5924c16d1d17f1ad893c.jpg", "mid": 44371203, "name": "呆毛万岁233" }, "pages": [{ "cid": 49951942, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 287, "from": "vupload", "page": 1, "part": "【Fate:全角色应援:MAD:慢燃】吾等响应汝之召唤而来，众英灵，参上！", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/5cde6c0623ec8701da5ade96425c72d21448bd22.jpg", "pubdate": 1533733741, "rights": { "autoplay": 0, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28851731, "coin": 139, "danmaku": 81, "dislike": 0, "favorite": 152, "his_rank": 0, "like": 141, "now_rank": 0, "reply": 47, "share": 37, "view": 5948 }, "state": 0, "tid": 24, "title": "【Fate/全角色应援/慢燃/MAD】吾等响应汝之召唤而来，众英灵，参上！", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28847039, "attribute": 16512, "cid": 49996088, "copyright": 1, "ctime": 1533728826, "desc": "萌萌的小樱~", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 749, "dynamic": "#日本场应援2018##魔卡少女樱##木之本樱#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/fcafbef391efb9b59978242c27d1907de11a4270.jpg", "mid": 32452880, "name": "月下的纯白" }, "pages": [{ "cid": 49996088, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 749, "from": "vupload", "page": 1, "part": "小樱", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/003c7674aad37e0fa0791e21c2b1c16935132f99.jpg", "pubdate": 1533728826, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28847039, "coin": 42, "danmaku": 10, "dislike": 0, "favorite": 19, "his_rank": 0, "like": 45, "now_rank": 0, "reply": 26, "share": 9, "view": 2271 }, "state": 0, "tid": 162, "title": "【绘画过程】木之本樱 封印解除~", "tname": "绘画", "videos": 1 }, { "aid": 28845287, "attribute": 16768, "cid": 49992801, "copyright": 1, "ctime": 1533723329, "desc": "救救孩子！！请给咔酱投上一票！！！\n【别问我为什么要用这样的应援我已经彻底放弃剪燃向了_(:з」∠)_】【无cp】\nBGM:\nだってまだまだアバンタイトル—觉得爆豪同学特别可爱的轰君和切岛君x【梶裕贵/增田俊树】", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 64, "dynamic": "#日本场应援2018##爆豪胜己##我的英雄学院#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/4874ce1162dce147670b610aad356272ba23ef1a.jpg", "mid": 26498497, "name": "是扑倒不是扑倒" }, "pages": [{ "cid": 49992801, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 64, "from": "vupload", "page": 1, "part": "【爆豪胜己】可爱的爆豪君（日常吸咔＾q＾）", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/6bb2a44b5179fc2389b72815f20c08fc227e1a63.jpg", "pubdate": 1533723329, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28845287, "coin": 22, "danmaku": 13, "dislike": 0, "favorite": 10, "his_rank": 0, "like": 42, "now_rank": 0, "reply": 13, "share": 3, "view": 1482 }, "state": -100, "tid": 24, "title": "【爆豪胜己】这么可爱的咔不来吸一口吗＾q＾", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28841791, "attribute": 16512, "cid": 49986585, "copyright": 1, "ctime": 1533724456, "desc": "封面源自网络\r\n前方高渣....\r\n使用素材: 我的英雄学院\r\nBGM【音乐名】: Look At Me Now", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 132, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/62c5c0b39cd1f9b559d0eea9083702110abde6b0.jpg", "mid": 9565447, "name": "祁延浅" }, "pages": [{ "cid": 49986585, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 132, "from": "vupload", "page": 1, "part": "秀气的我_bilibili", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/2fde6388863e889fda437507379719ca47228e94.png", "pubdate": 1533724456, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28841791, "coin": 70, "danmaku": 41, "dislike": 0, "favorite": 44, "his_rank": 0, "like": 100, "now_rank": 0, "reply": 29, "share": 14, "view": 2163 }, "state": -100, "tid": 24, "title": "【B萌/绿谷出久应援】冲向更遥远的彼方!", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28840257, "attribute": 2113664, "cid": 49983925, "copyright": 1, "ctime": 1533719916, "desc": "模型：ザビ男：なかむら\n场景：im8225803：SNowly\n动作：sm25937215：ゆり\n镜头：一騎当千(1人用)：うぐいす\nBGM：一騎当千（Luz）\nMME：AutoLuminous4、Diffusion7：そぼろ", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 209, "dynamic": "#岸浪白野##日本场应援2018##FATE#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg", "mid": 16295316, "name": "岸波玉藻" }, "pages": [{ "cid": 49983925, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 209, "from": "vupload", "page": 1, "part": "1", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/d4eeaf566b61e6c3c32271cbbc51d658402af01b.jpg", "pubdate": 1533719916, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28840257, "coin": 4, "danmaku": 0, "dislike": 0, "favorite": 9, "his_rank": 0, "like": 30, "now_rank": 0, "reply": 8, "share": 8, "view": 529 }, "state": 0, "tid": 25, "title": "【FATE MMD】扎比君的一骑当千", "tname": "MMD·3D", "videos": 1 }, { "aid": 28840256, "attribute": 16512, "cid": 49984131, "copyright": 1, "ctime": 1533721986, "desc": "BGM：skillet--hero\n喜欢的话点个转发，加个关注都是对我最大的支持～", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 188, "dynamic": "#日本场应援2018##AMV##纯剪辑#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/45b27a346e342f9d92a71c68ec78dac5dd0893b4.jpg", "mid": 237269440, "name": "无sol谓" }, "pages": [{ "cid": 49984131, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 188, "from": "vupload", "page": 1, "part": "未命名项目", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/f9b7ad36badbee092bf05c85e5b1364b2cefc000.jpg", "pubdate": 1533721986, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28840256, "coin": 35, "danmaku": 14, "dislike": 0, "favorite": 7, "his_rank": 0, "like": 32, "now_rank": 0, "reply": 18, "share": 7, "view": 858 }, "state": -100, "tid": 24, "title": "「我的英雄学院/AMV」三人共同的意志", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28840249, "attribute": 16512, "cid": 49977458, "copyright": 1, "ctime": 1533723558, "desc": "某不知名萌新up，第一次做mad/amv。做的不好请多指教\nBGM：THERE IS REASON。\n因为我的天谴之力，一共做了4次，第一次没保存重做，第二次出了致命问题重做，第三次电脑死机重做，第四次电脑卡死只保存了一半......但是游戏人生是我top1，剧场版看哭了40分钟，所以还是坚持做完了·-·\n播放量要是没超1w，可能我以后就不会做这种视频了,除非游戏人生出第二季→.→...\n求关注求硬币求推荐求收藏求打赏求转发(๑ • . • ๑)", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 437, "dynamic": "#日本场应援2018##游戏人生ZERO##游戏人生#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/f7a8cb6818a31566ecb686c334b79c7251385e7d.jpg", "mid": 69185991, "name": "邪少年丶" }, "pages": [{ "cid": 49977458, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 437, "from": "vupload", "page": 1, "part": "最终成品游戏人生zero", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/ab4da65db1a29bb62187a43f4163f84642632ae9.jpg", "pubdate": 1533723558, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28840249, "coin": 80, "danmaku": 23, "dislike": 0, "favorite": 52, "his_rank": 0, "like": 107, "now_rank": 0, "reply": 27, "share": 29, "view": 2537 }, "state": 0, "tid": 24, "title": "【游戏人生zero/剧场版/mad】跨越种族的爱情。休比，下次我们一定会赢！", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28837429, "attribute": 16512, "cid": 49978954, "copyright": 1, "ctime": 1533719385, "desc": "", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 227, "dynamic": "#日本场应援2018##此花亭奇谭##柚#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/39f667b341cf21827cd7ae81f68da3081934ac82.jpg", "mid": 97248224, "name": "bili_97248224" }, "pages": [{ "cid": 49978954, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 227, "from": "vupload", "page": 1, "part": "周杰伦 - 稻香", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/1e89c1ef6c8a3be7b1585599c8ca418c939d6440.jpg", "pubdate": 1533719385, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28837429, "coin": 19, "danmaku": 3, "dislike": 0, "favorite": 18, "his_rank": 0, "like": 19, "now_rank": 0, "reply": 4, "share": 8, "view": 729 }, "state": 0, "tid": 24, "title": "【此花亭奇谭】稻香X此花亭奇谭", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28835367, "attribute": 16512, "cid": 49973121, "copyright": 1, "ctime": 1533718379, "desc": "歌曲：魔法少女小圆OPコネクト -歌手：ClariS（网易云有）\n剪辑软件：PR\n没找到生肉，也没找到歌词字幕，，好气啊。。。。\n总之，2018萌战请多多支持小樱，拜托了！！！", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 267, "dynamic": "#魔卡少女樱##动漫##新人向#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/04a86a7f99fb9506003c13a130134763c283536b.jpg", "mid": 29543952, "name": "渡鸦爱德华" }, "pages": [{ "cid": 49973121, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 267, "from": "vupload", "page": 1, "part": "魔卡少女樱", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/60a588aae46e8ae2e172682ab98a4779b7f5ea87.jpg", "pubdate": 1533718379, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28835367, "coin": 48, "danmaku": 28, "dislike": 0, "favorite": 66, "his_rank": 0, "like": 102, "now_rank": 0, "reply": 53, "share": 19, "view": 3232 }, "state": 0, "tid": 24, "title": "【2018 B萌 应援/魔卡少女樱】无论前方有多么大的阻碍，也一定可以越过（用小圆的方式打开小樱）", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28833022, "attribute": 16512, "cid": 49966396, "copyright": 1, "ctime": 1533715262, "desc": "《闪耀之海》\n演唱：染音若蔡\n作词：冰梓yuri\n作曲：甄小熊\nPV：EinsElric\n封面画师：汐洛琪SHIROKI\n\nST声迹配音组《宝石之国》中文配音原创歌。助力宝石之国B萌大人气角色，取得好成绩！\n网易云：https://music.163.com/#/album?id=71806628\n5sing：http://5sing.kugou.com/yc/3652162.html\n\n微博：@瑷珥-染音若蔡", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 133, "dynamic": "B萌记得给宝石们投票哦~！支持请多多点赞收藏~！爱你们~！\nps:配合PV看会感觉到了不一样的东西！\n《闪耀之海》\n演唱：@瑷珥-染音若蔡\n作词：@冰梓yuri\n作曲：甄小熊\nPV：@EinsElric\n封面画师：@汐洛琪SHIROKI\n#宝石之国##染音若蔡##磷叶石##原创歌#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/dc14daced5b61f985759fd931980f43f7605ace1.jpg", "mid": 215210, "name": "瑷珥-染音若蔡" }, "pages": [{ "cid": 49966396, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 133, "from": "vupload", "page": 1, "part": "118【染音若蔡】闪耀之海【宝石之国 原创歌】_1", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/531a0b243f53ab33b854ecd8a5ea72d8f7f8fc2d.jpg", "pubdate": 1533715262, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28833022, "coin": 347, "danmaku": 42, "dislike": 0, "favorite": 377, "his_rank": 0, "like": 656, "now_rank": 0, "reply": 63, "share": 41, "view": 6559 }, "state": 0, "tid": 28, "title": "【染音若蔡】你还记得宝石之国那闪耀之海吗", "tname": "原创音乐", "videos": 1 }, { "aid": 28831588, "attribute": 16512, "cid": 49967939, "copyright": 1, "ctime": 1533715661, "desc": "智乃应援视频第二弹终于肝出来了！！由于是两天肝出来的，有一半的镜头有重复，但看点完全是两个看点！希望大家多多支持智乃！！！emmm也希望智乃能比伊莉雅的票高!!\nbgm：光吉猛修 - 天国と地獄", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 83, "dynamic": "智乃应援视频第二弹终于肝出来了！！由于是两天肝出来的，有一半的镜头有重复，但看点完全是两个看点！希望大家多多支持智乃！！！emmm也希望智乃能比伊莉雅的票高！#日本场应援2018##bilibili moe##请问您今天要来点兔子吗？？##香风智乃##新星计划#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/7a9e7d5d792c853f6adeb262ebabf61d59e6cf0a.jpg", "mid": 11354330, "name": "凌云Chino" }, "pages": [{ "cid": 49967939, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 83, "from": "vupload", "page": 1, "part": "老婆！你有毒！", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/bd95d3672b7030d7ad33a607ac74d15088940d1e.jpg", "pubdate": 1533715661, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28831588, "coin": 52, "danmaku": 9, "dislike": 0, "favorite": 27, "his_rank": 0, "like": 58, "now_rank": 0, "reply": 67, "share": 15, "view": 1866 }, "state": 0, "tid": 24, "title": "【欢乐向/智乃应援】老婆！你有毒！", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28831178, "attribute": 16768, "cid": 49964130, "copyright": 1, "ctime": 1533715825, "desc": "新人渣作，素材和音乐等方面有很大不足，请大家多多见谅，欢迎大家的批评指教。\n封面ID64099009", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 142, "dynamic": "#AMV##新人向##纯剪辑", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/021b691a4de5c69f85c97b0745481eb092695131.jpg", "mid": 23033971, "name": "漫雪凛冬" }, "pages": [{ "cid": 49964130, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 142, "from": "vupload", "page": 1, "part": "我的视频", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/448a64ab80ab613b97a0f6661df9cd21e2154cf5.jpg", "pubdate": 1533718392, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28831178, "coin": 10, "danmaku": 1, "dislike": 0, "favorite": 4, "his_rank": 0, "like": 14, "now_rank": 0, "reply": 10, "share": 7, "view": 689 }, "state": 0, "tid": 24, "title": "绚烂如樱，尘世似雪", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28830153, "attribute": 16768, "cid": 49964529, "copyright": 1, "ctime": 1533714855, "desc": "做完这个视频后B站暂时不会再发布新视频了，工作重心转移到自己的学业和微博上，说不出为什么就是不想再这样参加萌战了，但无论如何，智乃加油吧，大家加油吧。", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 299, "dynamic": "#日本场应援2018##香风智乃##二次元# 大家加油", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/5bcbe2e796416996929cc225b57f252ef2772fa8.jpg", "mid": 31895977, "name": "Andy安笛" }, "pages": [{ "cid": 49964529, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 299, "from": "vupload", "page": 1, "part": "Last", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/41c200994248d6f491786fe4753bf29049f2e893.jpg", "pubdate": 1533714855, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28830153, "coin": 25, "danmaku": 0, "dislike": 0, "favorite": 20, "his_rank": 0, "like": 32, "now_rank": 0, "reply": 18, "share": 11, "view": 3325 }, "state": 0, "tid": 24, "title": "【Moe2018应援/退圈纪念/点兔/香风智乃】CONTINUE....?", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28829710, "attribute": 16512, "cid": 49965171, "copyright": 1, "ctime": 1533715229, "desc": "主要内容为纳萨力克大坟墓目前登场的领域守护者\nBGM：鏡音レン,mothy - 悪ノ召使\n欢迎加入UP的粉丝群：237213911", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 299, "dynamic": "#不死者之王##骨傲天##Overlord##新星计划#\n主要内容为纳萨力克大坟墓目前登场的领域守护者\nBGM：鏡音レン,mothy - 悪ノ召使\n欢迎加入UP的粉丝群：237213911", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/a4cbc140157251afb969023ada66e6d7b084bf6e.jpg", "mid": 4021955, "name": "红莲妖" }, "pages": [{ "cid": 49965171, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 299, "from": "vupload", "page": 1, "part": "领域守护者", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/b4986d507dc65cf0222f2b1d40d35a640ac1e757.jpg", "pubdate": 1533715229, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28829710, "coin": 41, "danmaku": 26, "dislike": 0, "favorite": 24, "his_rank": 0, "like": 82, "now_rank": 0, "reply": 21, "share": 1, "view": 4222 }, "state": 0, "tid": 27, "title": "【瞎考剧】Overlord：领域守护者", "tname": "综合", "videos": 1 }, { "aid": 28826330, "attribute": 16512, "cid": 49957386, "copyright": 1, "ctime": 1533710501, "desc": "·自制，2018b萌日本场贞德应援作品\n·草稿风，渣上色，轻喷……\n·BGM：自伤无色\n·无cp向，请勿ky，一起愉快的食用\n·求硬币，收藏，关注(　´・◡・｀)", "dimension": { "height": 1072, "rotate": 0, "width": 1520 }, "duration": 105, "dynamic": "#日本场应援2018##fgo##贞德应援#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/2f787c2dcafdd2d0772b3564bd772ab17bd83633.jpg", "mid": 5825627, "name": "Great乱舞" }, "pages": [{ "cid": 49957386, "dimension": { "height": 1072, "rotate": 0, "width": 1520 }, "duration": 105, "from": "vupload", "page": 1, "part": "乐秀视频第12部_20180808133443914", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/4bb5318d9c5b1654d25ecca194170fe4badeb03a.jpg", "pubdate": 1533710501, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28826330, "coin": 323, "danmaku": 37, "dislike": 0, "favorite": 501, "his_rank": 0, "like": 363, "now_rank": 0, "reply": 56, "share": 42, "view": 6674 }, "state": 0, "tid": 47, "title": "【FGO手书】这样的我生存于世", "tname": "短片·手书·配音", "videos": 1 }, { "aid": 28826083, "attribute": 16768, "cid": 49956973, "copyright": 1, "ctime": 1533711389, "desc": "因果流转，人总得靠其他人的帮助才能生活下去，所以总有一天，请你去帮助其他人吧。  阿万音铃羽", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 59, "dynamic": "#日本场应援2018##命运石之门##命运石之门0#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/9d9a503bc52be6f408910ea0b8aba6653bb018d8.jpg", "mid": 7583781, "name": "素晴硝子" }, "pages": [{ "cid": 49956973, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 59, "from": "vupload", "page": 1, "part": "翎羽1", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/2965363a0f23ab4fae38481e08032f2a91f33078.jpg", "pubdate": 1533711389, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28826083, "coin": 85, "danmaku": 1, "dislike": 0, "favorite": 32, "his_rank": 0, "like": 101, "now_rank": 0, "reply": 36, "share": 18, "view": 1374 }, "state": 0, "tid": 27, "title": "【应援】铃羽莫比乌斯的跃迁", "tname": "综合", "videos": 1 }, { "aid": 28825682, "attribute": 16768, "cid": 49824582, "copyright": 1, "ctime": 1533708951, "desc": "-", "dimension": { "height": 1440, "rotate": 0, "width": 2560 }, "duration": 106, "dynamic": "#日本场应援2018##木之本樱##魔卡少女樱#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/bed3035d9ac8ef3a8d4428551110a1f061ffc932.jpg", "mid": 3651600, "name": "咕大福" }, "pages": [{ "cid": 49824582, "dimension": { "height": 1440, "rotate": 0, "width": 2560 }, "duration": 106, "from": "vupload", "page": 1, "part": "【木之本樱B萌应援】燃向踩点混剪，小樱今天就告诉你什么是魔法少女\\(✨∇✨)\\", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/ffe6068e6cf665e2bfdbc7d88bda39312d13d196.jpg", "pubdate": 1533708951, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28825682, "coin": 51, "danmaku": 37, "dislike": 0, "favorite": 73, "his_rank": 0, "like": 119, "now_rank": 0, "reply": 32, "share": 25, "view": 3764 }, "state": 0, "tid": 183, "title": "【木之本樱B萌应援】燃向踩点混剪，小樱今天就告诉你什么是魔法少女(✨∇✨)", "tname": "影视剪辑", "videos": 1 }, { "aid": 28822944, "attribute": 2113920, "cid": 49952983, "copyright": 1, "ctime": 1533709292, "desc": "各位好我是冥香。这个不出意外可能是天草在参加本届B萌期间我会做的最后一个应援视频。\r\n这次改成适用持刀的动作费了好长时间……如果觉得效果好，也不用给我投币，请给天草投票xxxxxxxxxxx\r\n\r\n总而言之本周六天草对小太阳的32进16，希望大家支持天草！虽然我也很喜欢小太阳但内战就是这样了！！", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 201, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/40d60aa15ac21ed3f8f0a13aac77d176094e4e8f.jpg", "mid": 422673, "name": "冥香" }, "pages": [{ "cid": 49952983, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 201, "from": "vupload", "page": 1, "part": "moe3", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/3726c6fe26cf6b0e39b45f62f3701abccb49a293.png", "pubdate": 1533709292, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28822944, "coin": 50, "danmaku": 5, "dislike": 0, "favorite": 51, "his_rank": 0, "like": 55, "now_rank": 0, "reply": 13, "share": 13, "view": 1100 }, "state": 0, "tid": 25, "title": "【B萌2018日本场应援】[A]ddiction【天草四郎】【动作改变】", "tname": "MMD·3D", "videos": 1 }, { "aid": 28821884, "attribute": 16512, "cid": 49951385, "copyright": 1, "ctime": 1533707868, "desc": "这次做了好长时间哦。\r\n素材：魔法少女伊莉雅雪下的誓言，Fate/Stay Night06版，Fate/Stay Night UBW版，Fate/Stay Night HF版\r\n音乐：Flower Dance", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 254, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/1d3318128de6a4d2164cd37e43f4ad45222fe98b.jpg", "mid": 175795512, "name": "我是笔帽" }, "pages": [{ "cid": 49951385, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 254, "from": "vupload", "page": 1, "part": "第14话 理想的尽头_高清_3", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/84a5b2d3a3e098a8db0ddc0326bee4603a88be44.png", "pubdate": 1533707868, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28821884, "coin": 23, "danmaku": 11, "dislike": 0, "favorite": 35, "his_rank": 0, "like": 39, "now_rank": 0, "reply": 9, "share": 12, "view": 2179 }, "state": 0, "tid": 24, "title": "【Fate/卫宫士郎应援】无论发生什么，我也不会后悔！", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28820064, "attribute": 2113664, "cid": 49946360, "copyright": 1, "ctime": 1533705696, "desc": "模型：衛宮士郎：ごまもりは流れゆく／遠坂凛、間桐桜、ぐだお：珠華（しゅか）／セイバー：ribbondog／ネロ・クラウディウス：あかね／玉藻の前、ザビ男：なかむら／ザビ子：1010浣／エミヤ、クーフーリン：ちょビ玉／ギルガメッシュ：ひどく泰平化されたオティー\n场景：月面ステージ、月面低軌道ステージ：Tansoku102cm-短足沼地人\n动作/镜头：Thriller：DJRocket\nBGM：Thriller（Michael Jackson）\nMME：Diffusion7：そぼろ", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 128, "dynamic": "#THRILLER##FATE##日本场应援2018#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg", "mid": 16295316, "name": "岸波玉藻" }, "pages": [{ "cid": 49946360, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 128, "from": "vupload", "page": 1, "part": "2", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/3103e49ef8b92433c74cd86b58ebb8482bde0046.jpg", "pubdate": 1533705696, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28820064, "coin": 27, "danmaku": 58, "dislike": 0, "favorite": 71, "his_rank": 0, "like": 93, "now_rank": 0, "reply": 45, "share": 25, "view": 2953 }, "state": 0, "tid": 25, "title": "【FATE MMD】Thriller", "tname": "MMD·3D", "videos": 1 }, { "aid": 28819794, "attribute": 16512, "cid": 49945412, "copyright": 1, "ctime": 1533705933, "desc": "视频类型: 其他\n相关题材: OVERLORD；报菜名\n简介: 老骨头：我的那萨里克原来还有说相声的女仆！？\n贯口：相声中常见的表现形式，\n贯是一气呵成，一贯到底的意思。", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 147, "dynamic": "视频类型: 其他\n相关题材: OVERLORD；报菜名\n简介: 老骨头：我的那萨里克原来还有说相声的女仆！？\n贯口：相声中常见的表现形式，\n贯是一气呵成，一贯到底的意思。", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/0901945fce57e13d89b3d941330ab89a10cd9ebd.jpg", "mid": 4159782, "name": "养耗子防猫" }, "pages": [{ "cid": 49945412, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 147, "from": "vupload", "page": 1, "part": "goodgang", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/329994b5fecf7222c05586036ff4e634d0c5c97e.jpg", "pubdate": 1533705933, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28819794, "coin": 84, "danmaku": 45, "dislike": 0, "favorite": 34, "his_rank": 0, "like": 114, "now_rank": 0, "reply": 34, "share": 19, "view": 8210 }, "state": 0, "tid": 27, "title": "【OVERLORD】老骨：我请您吃饭..", "tname": "综合", "videos": 1 }, { "aid": 28819726, "attribute": 16512, "cid": 49943436, "copyright": 1, "ctime": 1533705782, "desc": "大家如果观后感觉不错，有劳点个推荐赞一下吧，小透明up主在B站生存艰难，没有推荐就没有播放量，拜托各位了，十分感谢！\n新作指路 ——→ 鬼灯不同造型帅气瞬间，av30505048 ：【踩点高燃】鬼灯：无所不能，瞬间切换！白泽：笑瘫！鬼灯百变造型帅气瞬间剪辑，求推荐哇！\n在av28147879里，白泽被鬼灯一顿狂扁，弹幕和评论中不少老中医粉纷纷表达心疼。为了活命，up主做了新的剪辑。\n这次，换白泽来折腾鬼灯！虐啊——！从头到尾，鬼灯被安排得明明白白。题目为《欲胜鬼灯，惟可用情》。“胜”改为“虐”后，情，就是", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 229, "dynamic": "本视频主题：鬼灯可爱~（误......）\n身为一只上亿岁的老神兽，白泽反虐的方式，自然与鬼灯不同。\n鬼灯战力爆表，名贯三界，遇事属他拎得清，总能找到最适宜有效的解决方法。虽然行事和表情令人生怖，但威严下亦有对他人尊重、体恤与守护的心意。\n这样的人物，却反常且别扭地，总和非奸非恶的白泽过不去。\n可能鬼灯自己也没有发觉内心真实的情感吧。\n难以察觉的情感，即本视频主题。\n#鬼灯的冷彻# #白泽# #鬼灯# #Bilibili Moe# #日本场应援2018# #剪辑#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/86d74a90ee6c2b729392bcb9d6d6a954f7f0ae26.jpg", "mid": 2609880, "name": "树狸饭堂" }, "pages": [{ "cid": 49943436, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 229, "from": "vupload", "page": 1, "part": "白泽鬼灯甜折腾720P", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/204887868346b795c004d55cf4678fbf5dea898f.jpg", "pubdate": 1533705782, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28819726, "coin": 1267, "danmaku": 218, "dislike": 0, "favorite": 1828, "his_rank": 0, "like": 2122, "now_rank": 0, "reply": 272, "share": 138, "view": 39315 }, "state": 0, "tid": 27, "title": "【HE】换白泽来虐鬼灯！鬼灯：被安排得明明白白...原台词重塑甜向剧情", "tname": "综合", "videos": 1 }, { "aid": 28819080, "attribute": 16512, "cid": 49943054, "copyright": 1, "ctime": 1533702750, "desc": "字幕来源／应援文：半翅雀@半翅雀\n票根来源：UP主自己\n让我们迎接各位刀回家，他们在我们心里是最棒的\n欢迎各位婶婶加入刀剑乱舞B萌应援群\n群号：773458796", "dimension": { "height": 720, "rotate": 0, "width": 1200 }, "duration": 238, "dynamic": "#日本场应援2018##刀剑乱舞##鹤丸国永#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/2e3e8bcedcbcb6abcfdf00cca6049d5345d0da58.jpg", "mid": 19505617, "name": "夜雨月落" }, "pages": [{ "cid": 49943054, "dimension": { "height": 720, "rotate": 0, "width": 1200 }, "duration": 238, "from": "vupload", "page": 1, "part": "【墨染瑶】【刀剑乱舞B萌应援】刀剑乱舞2018 Bilibili Moe 日漫场送别", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/7149b35ee1df51de1d8dfbd88f7a77e4a11e3f4e.jpg", "pubdate": 1533702750, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28819080, "coin": 13, "danmaku": 1, "dislike": 0, "favorite": 12, "his_rank": 0, "like": 18, "now_rank": 0, "reply": 19, "share": 14, "view": 559 }, "state": 0, "tid": 47, "title": "【墨染瑶】【刀剑乱舞B萌应援】刀剑乱舞2018 Bilibili Moe 日漫场送别", "tname": "短片·手书·配音", "videos": 1 }, { "aid": 28810607, "attribute": 16768, "cid": 49922234, "copyright": 1, "ctime": 1533696555, "desc": "番名：《DARLING in the FRANXX》\nBGM:日剧产科医生鸿鸟的主题曲《あなたがここにいて抱きしめることができるなら》    from  miwa\n第二发了，做完就感觉比上次工作量大了很多，很幸运歌不算很难，对我这个萌新比较友好\n喜欢我的视频别忘了点赞，投币，收藏，关注，分享给你的朋友。b萌02加油！02赛高！让这个世界给这个女孩一丝温暖吧！\n敏娜桑！！！多谢了！！！    \n最后祝02在b萌取得好成绩", "dimension": { "height": 1080, "rotate": 0, "width": 1440 }, "duration": 357, "dynamic": "#日本场应援2018##bilibili moe##动画#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/96c43c12e194c5cc95e86a624099da01dd309b9f.jpg", "mid": 29459594, "name": "KLArkalin阿卡林" }, "pages": [{ "cid": 49922234, "dimension": { "height": 1080, "rotate": 0, "width": 1440 }, "duration": 357, "from": "vupload", "page": 1, "part": "二期成品字幕_2", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/98f22b1956f8f68355e2b9db0c127c03c90c16c3.jpg", "pubdate": 1533697364, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28810607, "coin": 252, "danmaku": 82, "dislike": 0, "favorite": 179, "his_rank": 0, "like": 224, "now_rank": 0, "reply": 141, "share": 41, "view": 3341 }, "state": 0, "tid": 24, "title": "【DitF/02应援/催泪向】只要能将眼前的你拥入怀中，我别无所求", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28805234, "attribute": 16512, "cid": 49913077, "copyright": 1, "ctime": 1533691390, "desc": "第一次做amv也是费了一番心血\n从文案 剪辑 后期\n一共花了大概一个星期吧\n其中偷懒过 爆肝过\n苦想过 也欣喜过\n用自己微弱的力量给薇尔莉特应援\n薇尔莉特 冲鸭！！！！！！！！！！！！！", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 208, "dynamic": "#日本场应援2018##AMV##新人向#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/d234685696aeb25f42bf096e619e0e8fd1fa69e0.jpg", "mid": 85985833, "name": "安少目" }, "pages": [{ "cid": 49913077, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 208, "from": "vupload", "page": 1, "part": "08_3", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/bfe2df5b1183b4022f355b88a7eef61d35db9478.jpg", "pubdate": 1533691390, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28805234, "coin": 52, "danmaku": 23, "dislike": 0, "favorite": 15, "his_rank": 0, "like": 56, "now_rank": 0, "reply": 29, "share": 8, "view": 903 }, "state": -100, "tid": 24, "title": "【AMV/紫罗兰】一个人如其名的书记人偶 一段扣人心弦的寻爱之旅", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28804750, "attribute": 16512, "cid": 49915214, "copyright": 1, "ctime": 1533690428, "desc": "(　・ˍ・)　(・ˍ・*)", "dimension": { "height": 720, "rotate": 0, "width": 1080 }, "duration": 231, "dynamic": "#日本场应援2018##我的英雄学院##绿谷出久#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/46877cdaa4023321d113153564fd97e4b620127c.jpg", "mid": 25328929, "name": "SWINGNOW" }, "pages": [{ "cid": 49915214, "dimension": { "height": 720, "rotate": 0, "width": 1080 }, "duration": 231, "from": "vupload", "page": 1, "part": "合成 1_1_x264", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/099048695bcba2fd6ba0075269fd549f1105a74b.jpg", "pubdate": 1533690428, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28804750, "coin": 4, "danmaku": 13, "dislike": 0, "favorite": 5, "his_rank": 0, "like": 25, "now_rank": 0, "reply": 16, "share": 1, "view": 944 }, "state": -100, "tid": 24, "title": "【我英应援】逆战", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28803085, "attribute": 16512, "cid": 49912292, "copyright": 1, "ctime": 1533687448, "desc": "不要收藏，不要硬币，要脸。\r\n啊……太菜了……剪了半天弄了个什么出来……留个黑历史在这儿以后拿来嘲笑一下自己。", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 159, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/77a572f604a652b2b73432127f4191d8354970ef.jpg", "mid": 43971264, "name": "烟唐秋豪丶" }, "pages": [{ "cid": 49912292, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 159, "from": "vupload", "page": 1, "part": "磷叶石终稿", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/d2747e03786090bf318f4eb6c3916fd8c332a017.png", "pubdate": 1533687448, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28803085, "coin": 28, "danmaku": 4, "dislike": 0, "favorite": 39, "his_rank": 0, "like": 45, "now_rank": 0, "reply": 25, "share": 9, "view": 1201 }, "state": 0, "tid": 24, "title": "【宝石之国AMV】法斯：我该如何改变？", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28802665, "attribute": 16768, "cid": 49911644, "copyright": 1, "ctime": 1533686451, "desc": "8月6日，与人梭哈莓反杀，惜败\r\n素材：DARLING in the FRANXX\r\nBGM：Take me hand  - DAISHI DANCE", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 262, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/28e3b7964a7a25462350583a45ecfb57883aebc5.jpg", "mid": 3127528, "name": "空耳狂魔" }, "pages": [{ "cid": 49911644, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 262, "from": "vupload", "page": 1, "part": "序列 01_24", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/e90fd9a48797ce034fde2d885116b0c86cf6aefc.png", "pubdate": 1533686451, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28802665, "coin": 4015, "danmaku": 468, "dislike": 0, "favorite": 3102, "his_rank": 0, "like": 3422, "now_rank": 0, "reply": 332, "share": 756, "view": 62078 }, "state": 0, "tid": 24, "title": "【02应援】你一票我一票，02今晚就出道", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28797741, "attribute": 16512, "cid": 49901368, "copyright": 1, "ctime": 1533675012, "desc": "Emmmmmmm白纸up没技术没生肉没智商，但是（我永远喜欢田所惠.jpg）", "dimension": { "height": 576, "rotate": 0, "width": 720 }, "duration": 238, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/59dee61bb5022c7fa331c3ffb8177b4e6910e6f2.jpg", "mid": 298019774, "name": "Mztty" }, "pages": [{ "cid": 49901368, "dimension": { "height": 576, "rotate": 0, "width": 720 }, "duration": 238, "from": "vupload", "page": 1, "part": "田所惠", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/91f9a1af07a609e94fb7ac2c82816deacd4e90b7.jpg", "pubdate": 1533675012, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28797741, "coin": 4, "danmaku": 0, "dislike": 0, "favorite": 0, "his_rank": 0, "like": 1, "now_rank": 0, "reply": 1, "share": 2, "view": 332 }, "state": -100, "tid": 24, "title": "【食戟之灵】感谢你出现在我的身边", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28797730, "attribute": 16512, "cid": 49901363, "copyright": 1, "ctime": 1533675022, "desc": "时间飞快的流逝，唯独现在，我有一种想对爱因斯坦发牢骚的心情，冈部，时间根据每个人的主观感受，既会变长，也会变短，相对论真是既浪漫又伤感的东西呢。——牧濑红莉栖", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 150, "dynamic": "#日本场应援2018##命运石之门##MAD#时间飞快的流逝，唯独现在，我有一种想对爱因斯坦发牢骚的心情，冈部，时间根据每个人的主观感受，既会变长，也会变短，相对论真是既浪漫又伤感的东西呢。——牧濑红莉栖", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/d7018376ff9e712c03a34f6d4e77c247b6a2ba75.jpg", "mid": 22044759, "name": "丶牧濑红莉牺" }, "pages": [{ "cid": 49901363, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 150, "from": "vupload", "page": 1, "part": "命运石之门.amv", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/a9d7ad25f84f34abcdd32d200fb9b7a9e7986462.jpg", "pubdate": 1533675022, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28797730, "coin": 89, "danmaku": 3, "dislike": 0, "favorite": 37, "his_rank": 0, "like": 73, "now_rank": 0, "reply": 32, "share": 8, "view": 1369 }, "state": 0, "tid": 24, "title": "【牧濑红莉栖应援】穿越世界线，与你相遇，仅此而已", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28796831, "attribute": 16512, "cid": 49900181, "copyright": 1, "ctime": 1533678023, "desc": "做了16天的视频，可是食戟全员已回家，但128强仍然值得骄傲。\n素材：食戟之灵\nBGM：Black Rail\n参考了一个黑契的视频：av3219374，是一个良作", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 137, "dynamic": "#日本场应援2018##食戟之灵##MAD#欢迎食戟全员回家，招待不周", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/19c9dc8a6e28c4c570c16733599492f0503ea7c3.jpg", "mid": 20443161, "name": "Hope豪侠" }, "pages": [{ "cid": 49900181, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 137, "from": "vupload", "page": 1, "part": "食戟之灵应援视频2_1", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/3048dddd60221bdfe0e6002e15dbe821e078ff50.jpg", "pubdate": 1533693611, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28796831, "coin": 37, "danmaku": 3, "dislike": 0, "favorite": 16, "his_rank": 0, "like": 25, "now_rank": 0, "reply": 17, "share": 4, "view": 859 }, "state": 0, "tid": 24, "title": "【接全员回家】我的食戟，不，是我们的食戟", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28795012, "attribute": 2113920, "cid": 49887724, "copyright": 1, "ctime": 1533671812, "desc": "BGM:ONE OK ROCK -The beginning\n素材：fate  进击的巨人 一击男  小英雄 \n上一次做的很多小伙伴说不够好,BGM不搭什么的，这次就重新做了一遍，希望大家会喜欢", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 294, "dynamic": "#日本场应援2018##MAD##AMV#这次重新做了一版，希望会让大家满意", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/7c6d2f48e51eb4849fde10975b47f9fddbcb8373.jpg", "mid": 113630734, "name": "我就是BB机啊" }, "pages": [{ "cid": 49887724, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 294, "from": "vupload", "page": 1, "part": "爱剪辑-我的信念AMV_clip", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/e70a5139253a8de2c78dce317a2f237d30fbeba5.jpg", "pubdate": 1533671812, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28795012, "coin": 78, "danmaku": 18, "dislike": 0, "favorite": 101, "his_rank": 0, "like": 80, "now_rank": 0, "reply": 29, "share": 27, "view": 3798 }, "state": 0, "tid": 24, "title": "【AMV】因为背负着信念才不会甘愿认输！", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28794117, "attribute": 16512, "cid": 49894425, "copyright": 1, "ctime": 1533671090, "desc": "bgm--卡路里", "dimension": { "height": 576, "rotate": 0, "width": 720 }, "duration": 324, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/6f15a7a5df1658f1fe0bdb79c0ca729672556f5c.jpg", "mid": 211720194, "name": "珠珠珠珠珠珠玉" }, "pages": [{ "cid": 49894425, "dimension": { "height": 576, "rotate": 0, "width": 720 }, "duration": 162, "from": "vupload", "page": 1, "part": "画面有问题对不起呜呜呜", "vid": "", "weblink": "" }, { "cid": 50379376, "dimension": { "height": 576, "rotate": 0, "width": 720 }, "duration": 162, "from": "vupload", "page": 2, "part": "画面调整啦，直接看这个就行", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/733e426e0c3d5221c117fe7a4e6d2c3309389a18.jpg", "pubdate": 1533671090, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28794117, "coin": 778, "danmaku": 273, "dislike": 0, "favorite": 1258, "his_rank": 0, "like": 1237, "now_rank": 0, "reply": 266, "share": 438, "view": 32021 }, "state": 0, "tid": 27, "title": "爱过，再见。", "tname": "综合", "videos": 2 }, { "aid": 28793582, "attribute": 16512, "cid": 49893323, "copyright": 1, "ctime": 1533675084, "desc": "爆豪胜己，粗中有细\n话不多说，西内为敬\n西内！", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 350, "dynamic": "#日本场应援2018##我的英雄学院##爆豪胜己#西内！", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/863cbca4ad7d93581d7c2fc382da6bb66e4a74e9.jpg", "mid": 22701238, "name": "Hello-Newworld" }, "pages": [{ "cid": 49893323, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 350, "from": "vupload", "page": 1, "part": "爆豪", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/60ae2e49ebfc28a60447adcd46f2bc6833336411.jpg", "pubdate": 1533675083, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28793582, "coin": 22, "danmaku": 7, "dislike": 0, "favorite": 24, "his_rank": 0, "like": 56, "now_rank": 0, "reply": 0, "share": 7, "view": 1552 }, "state": -100, "tid": 24, "title": "【爆豪胜己】为了成为No.1的英雄！", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28792753, "attribute": 16768, "cid": 49891825, "copyright": 1, "ctime": 1533666186, "desc": "喜欢还请点个推荐，就是那个大拇指，点个关注，收藏硬币！谢谢各位支持！", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 41, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/19626abafb253b1864026aaa4a5c86d150262df1.jpg", "mid": 9253594, "name": "拔旗" }, "pages": [{ "cid": 49891825, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 41, "from": "vupload", "page": 1, "part": "卡酱1", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/477bea426007d003a8e02e75ea82994dcef1c329.png", "pubdate": 1533666186, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28792753, "coin": 27, "danmaku": 17, "dislike": 0, "favorite": 84, "his_rank": 0, "like": 225, "now_rank": 0, "reply": 54, "share": 11, "view": 8421 }, "state": -100, "tid": 22, "title": "【旗子】爆豪：啊？啊啊？啊啊啊？诶啊啊啊？！", "tname": "鬼畜调教", "videos": 1 }, { "aid": 28792602, "attribute": 16512, "cid": 49892800, "copyright": 1, "ctime": 1533670521, "desc": "和伊莉雅领证的最后一关选择了打闪闪，和ubw以及魔伊的混剪，喜欢的话请关注下up哦。", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 647, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/a7cc9d0187170a0ef41dd5c77c0c1d8965df3050.jpg", "mid": 44487065, "name": "怪人兰斯" }, "pages": [{ "cid": 49892800, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 647, "from": "vupload", "page": 1, "part": "伊莉雅", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/4c29c30c26d7094294b38eabb4f911735e03d568.png", "pubdate": 1533670521, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28792602, "coin": 6, "danmaku": 33, "dislike": 0, "favorite": 21, "his_rank": 0, "like": 27, "now_rank": 0, "reply": 33, "share": 11, "view": 3596 }, "state": 0, "tid": 172, "title": "震惊！某UP与伊莉雅结婚现场上，某金发男路人竟惨遭殴打，重伤不起！（b萌伊莉雅，金闪闪应援）", "tname": "手机游戏", "videos": 1 }, { "aid": 28792328, "attribute": 16768, "cid": 53221024, "copyright": 1, "ctime": 1533666210, "desc": "之前做得不太满意，这次在原版的基础上做了一点小改动，希望大家能够喜欢～～", "dimension": { "height": 2160, "rotate": 0, "width": 3840 }, "duration": 77, "dynamic": "#FATE# #尼禄#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/e277274b0f6e0b587031f7415e868ec767f9c349.jpg", "mid": 52367389, "name": "柯哀落樱飘雪" }, "pages": [{ "cid": 53221024, "dimension": { "height": 2160, "rotate": 0, "width": 3840 }, "duration": 77, "from": "vupload", "page": 1, "part": "【Fate/Extra Last Encore】尼禄陛下的欢脱日常", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/0c7b4d21b030b10ea1137d6822b31d9ca1078aa0.jpg", "pubdate": 1533666210, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28792328, "coin": 34, "danmaku": 6, "dislike": 0, "favorite": 31, "his_rank": 0, "like": 51, "now_rank": 0, "reply": 7, "share": 5, "view": 2221 }, "state": -100, "tid": 27, "title": "【Fate/Extra Last Encore】红saber：今天余不但要唱歌～还要唱rap！", "tname": "综合", "videos": 1 }, { "aid": 28789557, "attribute": 16768, "cid": 49886535, "copyright": 1, "ctime": 1533669770, "desc": "fate全员应援，外加失踪人口回归（｡ò ∀ ó｡）\nBGM：Shot In The Dark", "dimension": { "height": 2160, "rotate": 0, "width": 3840 }, "duration": 299, "dynamic": "#日本场应援2018##fate##吾王#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/0c1d6eb8b497ffe10e3c29817b41e84ad13ee5e9.jpg", "mid": 23226251, "name": "Saber琪" }, "pages": [{ "cid": 49886535, "dimension": { "height": 2160, "rotate": 0, "width": 3840 }, "duration": 299, "from": "vupload", "page": 1, "part": "2160_25_12.76_Aug072018", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/1e3fac7c49cc612020ecc4260156b9938cc62650.jpg", "pubdate": 1533669770, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28789557, "coin": 67, "danmaku": 8, "dislike": 0, "favorite": 84, "his_rank": 0, "like": 65, "now_rank": 0, "reply": 18, "share": 24, "view": 2351 }, "state": 0, "tid": 24, "title": "【FGO/AMV/燃向】欢迎来到人理之光", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28788090, "attribute": 16512, "cid": 49883160, "copyright": 1, "ctime": 1533667419, "desc": "第一次做mad，做的不怎么好，多多包涵。\r\n素材：魔法少女伊莉雅剧场版：雪下的誓言\r\nBGM：ひび割れた世界\r\n封面：https://www.pixiv.net/member_illust.php?mode=medium&illust_id=65608478", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 329, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/b7f988546726555377681f732c4bfed54c299613.jpg", "mid": 8416010, "name": "阡陌初雪" }, "pages": [{ "cid": 49883160, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 329, "from": "vupload", "page": 1, "part": "雪下的誓言", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/ef03d707048a19e83796341b56eedb67db044440.png", "pubdate": 1533667419, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28788090, "coin": 1682, "danmaku": 504, "dislike": 0, "favorite": 2383, "his_rank": 0, "like": 1685, "now_rank": 0, "reply": 441, "share": 429, "view": 79651 }, "state": 0, "tid": 24, "title": "【卫宫士郎】我没能成为拯救所有人的正义的伙伴", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28787251, "attribute": 16768, "cid": 49900934, "copyright": 1, "ctime": 1533675107, "desc": "第一次做AMV，估计观感欠佳_(:з」∠)_\r\n算是b萌朱碧和利库的应援视频吧ww\r\n素材：NGNL0（No Game No Life Zero)\r\n           鈴木このみ - There is a reason", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 602, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/f6e7b7ff85f7af44ed547c895dfe5f16a5e75d60.jpg", "mid": 13902416, "name": "一本畫時" }, "pages": [{ "cid": 49900934, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 301, "from": "vupload", "page": 1, "part": "字幕版", "vid": "", "weblink": "" }, { "cid": 49881402, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 301, "from": "vupload", "page": 2, "part": "无字版", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/9e3eeaf0b1e2983ba283da7c80063874f0ab7a15.png", "pubdate": 1533675107, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28787251, "coin": 20, "danmaku": 1, "dislike": 0, "favorite": 18, "his_rank": 0, "like": 36, "now_rank": 0, "reply": 12, "share": 18, "view": 798 }, "state": 0, "tid": 24, "title": "【No Game No Life · Zero】There is a reason 愛のために「AMV」", "tname": "MAD·AMV", "videos": 2 }, { "aid": 28787096, "attribute": 16512, "cid": 49880064, "copyright": 1, "ctime": 1533666205, "desc": "新人初投稿 请多指教\n五战骑主从真好\n\nBGM：浅川悠-《瞬时の涡》（Fate/Stay Night Rider 角色歌）\n素材来源：《Fate/Stay Night[Unlimited Blade Works]》、《Fate/Stay Night[Heaven's Feel I.presage flower]》", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 90, "dynamic": "#日本场应援2018# #AMV# #美杜莎# #间桐樱#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/45227ce02741601a2a0098e0bfd5df11af7fb8c2.jpg", "mid": 35151881, "name": "-雪户鹤织-" }, "pages": [{ "cid": 49880064, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 90, "from": "vupload", "page": 1, "part": "瞬时の涡", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/0b9a6b5da7e5e43ee0ec6f818b19e33a51bdd718.jpg", "pubdate": 1533666205, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28787096, "coin": 25, "danmaku": 1, "dislike": 0, "favorite": 24, "his_rank": 0, "like": 33, "now_rank": 0, "reply": 7, "share": 7, "view": 1743 }, "state": 0, "tid": 24, "title": "[Fate/AMV]Rider&间桐樱|只要澄澈的羁绊仍无言地照亮心间", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28787024, "attribute": 2113664, "cid": 49881578, "copyright": 1, "ctime": 1533666213, "desc": "借用见视频尾", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 55, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/8ab9d8c06b1ede208b51fb7be1e0a9c06b396ac2.jpg", "mid": 5033425, "name": "木2森森" }, "pages": [{ "cid": 49881578, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 55, "from": "vupload", "page": 1, "part": "001", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/917d5441b2f434f227453c5544570dd6b9434056.png", "pubdate": 1533666213, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28787024, "coin": 11, "danmaku": 3, "dislike": 0, "favorite": 40, "his_rank": 0, "like": 30, "now_rank": 0, "reply": 9, "share": 5, "view": 1189 }, "state": 0, "tid": 25, "title": "【我的英雄学院MMD】轰焦冻的runaway baby", "tname": "MMD·3D", "videos": 1 }, { "aid": 28786327, "attribute": 2113664, "cid": 49876912, "copyright": 1, "ctime": 1533666200, "desc": "迦勒底加班人员的b萌应援。\n嘛，对上了大狗感觉有点恐怖,也许是在做最后的挣扎也说不定呢。。。。.。\n说起来这是我第一次正经地尝试2d向渲染，我吹爆akon太太的模型wwwww~\nBGM是れをる桑的no title，降了三个半调（降调狂魔就是我了）。\n韦伯子裙子的物理出了点问题咋改也改不好我也很烦恼，稍微忍耐下吧，别刷暂停成功什么的，小心复明失败23333。\n借物表见评论，如果没看见就是你来的太早啦我还没起床。\n另外为了应援9号当天我会发一个小彩蛋，能记住的可以来我的动态看下哦~", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 245, "dynamic": "#日本场应援2018##君主·埃尔梅罗二世##bilibili moe#迦勒底加班势力登场~~~~b萌希望能投一票哦", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/8aeb328aec7b35b61786fb1dbdf2df7a6431154f.jpg", "mid": 10986504, "name": "xyz坐标" }, "pages": [{ "cid": 49876912, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 245, "from": "vupload", "page": 1, "part": "001", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/a8973399567558849135be742ac6c1fcdc6f2ffe.jpg", "pubdate": 1533666200, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28786327, "coin": 42, "danmaku": 11, "dislike": 0, "favorite": 27, "his_rank": 0, "like": 38, "now_rank": 0, "reply": 16, "share": 15, "view": 1241 }, "state": 0, "tid": 25, "title": "【B萌应援】迦勒底加班势力登场", "tname": "MMD·3D", "videos": 1 }, { "aid": 28785523, "attribute": 2113664, "cid": 49877810, "copyright": 1, "ctime": 1533666183, "desc": "Bilibili Moe,弗兰肯斯坦应援向MMD\nBGM:from Y to Y\nModel:做成参谋\nCamera+Action:Hiramori Amu", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 322, "dynamic": "#日本场应援2018##舞蹈MMD##新人向#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/98545d02fcb6bd97fe21eeb784a38ec24eb0f6ed.jpg", "mid": 39469126, "name": "双商下线" }, "pages": [{ "cid": 49877810, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 322, "from": "vupload", "page": 1, "part": "from Y to Y(弗兰肯斯坦ver._BiliBili", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/3fb6aa9bd61c14133d65ebf1959a16dc16d1e771.jpg", "pubdate": 1533666183, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28785523, "coin": 13, "danmaku": 4, "dislike": 0, "favorite": 4, "his_rank": 0, "like": 6, "now_rank": 0, "reply": 4, "share": 3, "view": 394 }, "state": 0, "tid": 25, "title": "【MMD/B萌应援】from Y to Y(弗兰肯斯坦)", "tname": "MMD·3D", "videos": 1 }, { "aid": 28782524, "attribute": 16512, "cid": 49926392, "copyright": 1, "ctime": 1533660829, "desc": "BGM:田中井彩智——黄金の辉き\n=\n说到做到。上星期看到B站上架了06版的fate，打鸡血剪辑的……剪到后面遇到不少困难有点摸鱼了，甚至忘了自己最初想通过视频表达什么了，有些粗制滥造，真是对不起（飞歌语气）。\n可能赶不上士郎今天的应援了，但是我喜欢士郎的热情还是不变的（笑），也请大家多多支持士郎咯。", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 277, "dynamic": "#日本场应援2018##卫宫士郎##fate#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/3ae164771bc5df3dc8f3083fc09154984f912a0f.jpg", "mid": 8983166, "name": "自我意识过剩者" }, "pages": [{ "cid": 49926392, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 277, "from": "vupload", "page": 1, "part": "黄金の辉き（士郎应援）_bilibili", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/707cfd0e00eab017fa6792e5d2ee2db19a9ac508.jpg", "pubdate": 1533660828, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28782524, "coin": 103, "danmaku": 9, "dislike": 0, "favorite": 135, "his_rank": 0, "like": 113, "now_rank": 0, "reply": 39, "share": 19, "view": 3160 }, "state": 0, "tid": 24, "title": "【Fate/卫宫士郎】背负理想不断前行", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28779967, "attribute": 16768, "cid": 49868565, "copyright": 1, "ctime": 1533657496, "desc": "bgm：Old Memory\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n希望有一个小埋那样的妹妹", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 106, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/4fd3f9c70ba89b9f87d6db91796b87233edcd670.jpg", "mid": 20963025, "name": "HoshikawaKanade" }, "pages": [{ "cid": 49868565, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 106, "from": "vupload", "page": 1, "part": "【小埋应援】Old Memory", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/697ef3486f5bcd8514fea73d9677930bc1b5873d.jpg", "pubdate": 1533657496, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28779967, "coin": 36, "danmaku": 27, "dislike": 0, "favorite": 23, "his_rank": 0, "like": 74, "now_rank": 0, "reply": 41, "share": 8, "view": 2025 }, "state": -100, "tid": 24, "title": "【土间埋应援】Old Memory", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28778494, "attribute": 16768, "cid": 49865025, "copyright": 1, "ctime": 1533657293, "desc": "有一对夫妻他们很强，但他们从来没赢过。        有一对兄妹他们很弱，但他们从来没输过。", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 245, "dynamic": "#日本场应援2018##里克与休比#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/e177eb81b4d0b835cf5023f411a9a9c612cd3037.jpg", "mid": 289091320, "name": "牧瑟秋风" }, "pages": [{ "cid": 49865025, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 245, "from": "vupload", "page": 1, "part": "游戏人生剧场版里克与休比", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/fc4f4ea539ac75cf8f2aadc4778d09e3e6a05222.jpg", "pubdate": 1533657293, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28778494, "coin": 7, "danmaku": 0, "dislike": 0, "favorite": 2, "his_rank": 0, "like": 4, "now_rank": 0, "reply": 1, "share": 0, "view": 312 }, "state": -100, "tid": 27, "title": "游戏人生剧场版里克与休比", "tname": "综合", "videos": 1 }, { "aid": 28773575, "attribute": 16512, "cid": 49854596, "copyright": 1, "ctime": 1533657302, "desc": "第一次剪辑这种视频\n所以暂且把开头放出来当预告\n不知道大家感觉怎么样\n评论区说一下，我在正片里改改\n争取赶在十号之前给小樱应援L('ω')┘三└('ω')｣\n\n视频素材：魔卡少女樱clear篇\n音乐素材：认真卖萌么么哒--洛天依（作曲：周存JUSF）", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 45, "dynamic": "#日本场应援2018##动漫##童年#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/f6af35d8b410256680a4f3dec77ffc86a8677e90.jpg", "mid": 10434225, "name": "花子君のドーナツ" }, "pages": [{ "cid": 49854596, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 45, "from": "vupload", "page": 1, "part": "认真卖萌么么哒   2018.8.7", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/79bebca16fcad64fb529c2973c176f3088a02ee2.jpg", "pubdate": 1533657302, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28773575, "coin": 10, "danmaku": 1, "dislike": 0, "favorite": 16, "his_rank": 0, "like": 56, "now_rank": 0, "reply": 16, "share": 1, "view": 1468 }, "state": -100, "tid": 27, "title": "【樱狼警告】认真卖萌给你看~=ω=【预告】", "tname": "综合", "videos": 1 }, { "aid": 28771695, "attribute": 16512, "cid": 49850403, "copyright": 1, "ctime": 1533657307, "desc": "做MAD之前：这首歌好适合士樱啊，做个MAD试试吧\n为了做MAD去看了HF线生肉后：呜呜呜呜，老虫子你还我樱！qaq\n【BGM：THERE IS A REASON】\n顺便求个关注收藏推荐硬币，你们的支持是我最大的动力！", "dimension": { "height": 720, "rotate": 0, "width": 960 }, "duration": 295, "dynamic": "#日本场应援2018##卫宫士郎##间桐樱#我以后再也不拿pr做字幕了.....手都得断掉......", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/1f3d7848eba42e5775235e3bb9d6789133a56674.jpg", "mid": 272915884, "name": "藤丸嘉人" }, "pages": [{ "cid": 49850403, "dimension": { "height": 720, "rotate": 0, "width": 960 }, "duration": 295, "from": "vupload", "page": 1, "part": "鈴木このみ - THERE IS A REASON_1", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/48874afd663622db93026f5325909b12340947e4.jpg", "pubdate": 1533657307, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28771695, "coin": 38, "danmaku": 3, "dislike": 0, "favorite": 45, "his_rank": 0, "like": 43, "now_rank": 0, "reply": 16, "share": 14, "view": 1975 }, "state": 0, "tid": 24, "title": "仅此一人的英雄【fate/HF  MAD/AMV】", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28770849, "attribute": 16768, "cid": 49849896, "copyright": 1, "ctime": 1533657317, "desc": "这个和预告系没有任何关系，没看过的被剧透别怪我~~~", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 601, "dynamic": "#日本场应援2018##AMV##游戏人生##TOS偶像总选举#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/694658b56ad6d747497b7ffb7b2efdad5f4a4623.jpg", "mid": 3001391, "name": "NearLight" }, "pages": [{ "cid": 49849896, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 301, "from": "vupload", "page": 1, "part": "参赛稿", "vid": "", "weblink": "" }, { "cid": 56785862, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 300, "from": "vupload", "page": 2, "part": "工程文件整理", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/2b43cacdfc92b09c6f838fb4df417b688a28d154.jpg", "pubdate": 1533657317, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28770849, "coin": 750, "danmaku": 25, "dislike": 0, "favorite": 1102, "his_rank": 0, "like": 1672, "now_rank": 0, "reply": 108, "share": 105, "view": 14257 }, "state": 0, "tid": 24, "title": "【AMV/NGNL/游戏人生ZERO】无命而去 有命而逝", "tname": "MAD·AMV", "videos": 2 }, { "aid": 28770700, "attribute": 16512, "cid": 49850685, "copyright": 1, "ctime": 1533651391, "desc": "关于胜出上学路上的小故事\n尝试做了手书，差点累死我这个手残\n果然还是回去好好学画画吧", "dimension": { "height": 576, "rotate": 0, "width": 720 }, "duration": 118, "dynamic": "#我的英雄学院##手书##胜出#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/d0c5030ab6cf4a7a53eac013fb8522db13033166.jpg", "mid": 20359495, "name": "今天惹咔酱生气了吗" }, "pages": [{ "cid": 49850685, "dimension": { "height": 576, "rotate": 0, "width": 720 }, "duration": 118, "from": "vupload", "page": 1, "part": "你的心拍数", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/b6b74f8c4365d9e6364ae95f3b03fa58814d95a0.jpg", "pubdate": 1533651391, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28770700, "coin": 8, "danmaku": 5, "dislike": 0, "favorite": 8, "his_rank": 0, "like": 43, "now_rank": 0, "reply": 4, "share": 9, "view": 1215 }, "state": -100, "tid": 47, "title": "{我的英雄学院/胜出/手书} 你的心拍数", "tname": "短片·手书·配音", "videos": 1 }, { "aid": 28769993, "attribute": 1065171, "cid": 49835843, "copyright": 1, "ctime": 1533650863, "desc": "末尾有信长三连！\n没纯踩点所以不敢用87k！\n没错我就是那个欠债的后期！\n\nbgm：handclap", "dimension": { "height": 576, "rotate": 0, "width": 720 }, "duration": 110, "dynamic": "#日本场应援2018##FREE!#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/2e6f63afc605959f370db3dfe91c0e5dd69a3a9b.jpg", "mid": 104557039, "name": "梓川木由" }, "pages": [{ "cid": 49835843, "dimension": { "height": 576, "rotate": 0, "width": 720 }, "duration": 110, "from": "vupload", "page": 1, "part": "Fitz & the Tantrums - HandClap_1", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/301c5a13e052776f333f005f6de16479191635d6.jpg", "pubdate": 1533650863, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28769993, "coin": 14, "danmaku": 9, "dislike": 0, "favorite": 9, "his_rank": 0, "like": 17, "now_rank": 0, "reply": 5, "share": 8, "view": 770 }, "state": 0, "tid": 24, "title": "【混剪】不就是想看小哥哥脱衣服么！", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28768955, "attribute": 16512, "cid": 49838604, "copyright": 1, "ctime": 1533650172, "desc": "■ 调教 · 混音 · 字幕：梦落遗廊P\n■ 曲：じん\n■ 編曲：Nhato\n■ 映像：しづ\n \n● 本家 → sm21720819\n● 时隔5个月的稿，鸽了这么久请诸位别把我抓去炖汤……\n● 调教了这首带感曲子来应援阳炎，海选赛只有Konoha通过了，球球你们本战投稿这位小天使一票，让他好歹撑到决赛(´；ω；`)\n● 在niconico也有投稿 → sm33640672 \n● 之前用 IA 翻调的车祸曲 → av20887402", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 217, "dynamic": "#じん##VOCALOID##阳炎计划#个\n翻调了界外科学，快来听一听ww", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/ef2b6e770837ed88f1e02a90f289af18a0f4c42e.jpg", "mid": 111651195, "name": "Niscet" }, "pages": [{ "cid": 49838604, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 217, "from": "vupload", "page": 1, "part": "结月缘 · GUMI Ver.", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/5806182a696baba6fe44fb10d36202707528d910.jpg", "pubdate": 1533650172, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28768955, "coin": 24, "danmaku": 72, "dislike": 0, "favorite": 43, "his_rank": 0, "like": 42, "now_rank": 0, "reply": 13, "share": 12, "view": 894 }, "state": 0, "tid": 30, "title": "【结月缘 · GUMI】界外科学 / アウターサイエンス【VOCALOID COVER】【原PV付 · 自制中文字幕】【2018B萌应援】", "tname": "VOCALOID·UTAU", "videos": 1 }, { "aid": 28767558, "attribute": 16768, "cid": 49842496, "copyright": 1, "ctime": 1533648380, "desc": "娱乐至上，大家看的开心就好", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 62, "dynamic": "求求审核老哥给个面子吧QAQ", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/0dc27beff4d096b67ece41d5213d417f076ec81e.jpg", "mid": 4328994, "name": "三木先森不会咕" }, "pages": [{ "cid": 49842496, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 62, "from": "vupload", "page": 1, "part": "圣经_x264", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/eaa6950d0823447ebc8fea77fbda57d7d645132c.jpg", "pubdate": 1533648380, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28767558, "coin": 57, "danmaku": 7, "dislike": 0, "favorite": 13, "his_rank": 0, "like": 40, "now_rank": 0, "reply": 40, "share": 19, "view": 1412 }, "state": 0, "tid": 27, "title": "如果以命运石之门的方式去打开7酱圣经会怎么样", "tname": "综合", "videos": 1 }, { "aid": 28766665, "attribute": 16579, "cid": 213977771, "copyright": 1, "ctime": 1533648458, "desc": "不希望别人看这个视频啦\n所以呢就悄悄地换了源！\n不删掉视频的原因是会扣硬币w\n\n原简介：\n万恶之源：av17699810\n参考，音频：av20536168", "dimension": { "height": 1280, "rotate": 0, "width": 590 }, "duration": 10, "dynamic": "#日本场应援2018##手书##自制#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/5deb5de649e9d0fc7c3da927e48e1eae74ec8754.jpg", "mid": 13437131, "name": "UID_13437131" }, "pages": [{ "cid": 213977771, "dimension": { "height": 1280, "rotate": 0, "width": 590 }, "duration": 10, "from": "vupload", "page": 1, "part": "SVID_20200718_222845_1", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/82f16c06497ecffc29b20ee6d5d433dd11c0a799.jpg", "pubdate": 1533648458, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28766665, "coin": 587, "danmaku": 2, "dislike": 0, "favorite": 2352, "his_rank": 0, "like": 3413, "now_rank": 0, "reply": 238, "share": 122, "view": 129535 }, "state": 0, "tid": 174, "title": "已删除", "tname": "其他", "videos": 1 }, { "aid": 28764554, "attribute": 16768, "cid": 49836795, "copyright": 1, "ctime": 1533648227, "desc": "02加油", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 46, "dynamic": "#日本场应援2018##MAD.AMV##bilibili  moe#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/02478906b35a1ea1ef29eecf8c93548cf47d07c8.jpg", "mid": 65732857, "name": "零二的達令" }, "pages": [{ "cid": 49836795, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 46, "from": "vupload", "page": 1, "part": "[02应援]", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/f173f5886356dc23b4966a6b0a35763db3fe50d6.jpg", "pubdate": 1533648227, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28764554, "coin": 26, "danmaku": 2, "dislike": 0, "favorite": 21, "his_rank": 0, "like": 47, "now_rank": 0, "reply": 13, "share": 7, "view": 1048 }, "state": 0, "tid": 24, "title": "[02应援]", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28759375, "attribute": 2113664, "cid": 49826852, "copyright": 1, "ctime": 1533646967, "desc": "模型：アストルフォ：すがきれもん\n场景：im8225803：SNowly\n动作/镜头：av25782915：浪潮小汐\n表情：av25782915：閃爍P\nBGM：恋して♥ポプテピピック（牧野由依、渡部优衣）\nMME：AutoLuminous4、Diffusion7：そぼろ", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 90, "dynamic": "#阿斯托尔福##日本场应援2018##FATE#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg", "mid": 16295316, "name": "岸波玉藻" }, "pages": [{ "cid": 49826852, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 90, "from": "vupload", "page": 1, "part": "1", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/28235650899fd8313e78e62238340a99c0f4f6bf.jpg", "pubdate": 1533646967, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28759375, "coin": 10, "danmaku": 4, "dislike": 0, "favorite": 13, "his_rank": 0, "like": 38, "now_rank": 0, "reply": 5, "share": 10, "view": 815 }, "state": 0, "tid": 25, "title": "【FATE MMD】阿斯托尔福的恋爱吧❤POP TEAM EPIC", "tname": "MMD·3D", "videos": 1 }, { "aid": 28757836, "attribute": 16384, "cid": 49820005, "copyright": 1, "ctime": 1533646283, "desc": "话说对导演下手的“家伙”还是挺多的嘛，如：\n库洛牌：消牌、冰牌、迷牌、声牌、地牌、无牌等\n人物：柊泽艾力欧、女占卜师等\n透明牌-包围、冰雹、幻影等\n（还有个破坏知世房子的摇动没加进去）", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 196, "dynamic": "对导演知世动手的片段小剪。#日本场应援2018#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/d6cb50fc26bdd24652a25e0d3571243a9cfa6c14.jpg", "mid": 23218911, "name": "花中童" }, "pages": [{ "cid": 49820005, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 160, "from": "vupload", "page": 1, "part": "正片", "vid": "", "weblink": "" }, { "cid": 50634353, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 36, "from": "vupload", "page": 2, "part": "补续", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/d14c77ad2456cacdd9d3b498eb64e17bb520743d.jpg", "pubdate": 1533646283, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 0, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28757836, "coin": 21, "danmaku": 103, "dislike": 0, "favorite": 162, "his_rank": 0, "like": 142, "now_rank": 0, "reply": 53, "share": 19, "view": 11693 }, "state": 0, "tid": 27, "title": "【魔卡少女樱】那些年敢对知世动手的人或牌（不全）", "tname": "综合", "videos": 2 }, { "aid": 28757709, "attribute": 16768, "cid": 49821087, "copyright": 1, "ctime": 1533646295, "desc": "一个短小的绿谷小天使应援视频...........\n莺莺燕燕嘤嘤\n新人UP求关注", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 86, "dynamic": "#日本场应援2018##我的英雄学院##AMV#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/be45bacc10a0467bc798dac935dd62825dcb06b6.jpg", "mid": 351853136, "name": "带肥皂的小纸船" }, "pages": [{ "cid": 49821087, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 86, "from": "vupload", "page": 1, "part": "绿谷", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/46bb690c9c9cace1c02e6efec8162ed1e955c35e.jpg", "pubdate": 1533646295, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28757709, "coin": 17, "danmaku": 6, "dislike": 0, "favorite": 9, "his_rank": 0, "like": 32, "now_rank": 0, "reply": 20, "share": 9, "view": 957 }, "state": 0, "tid": 24, "title": "【小英雄/AMV/泪燃向】承包绿谷小天使(●'◡'●)", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28756456, "attribute": 16768, "cid": 49814945, "copyright": 1, "ctime": 1533644685, "desc": "迦尔纳应援视频，各位一定要去为迦尔纳投票啊，他现在的处境很不好。\n不要三连，只要你们投票。\n十分感谢。", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 226, "dynamic": "#日本场应援2018##fate/apocrypha##迦尔纳#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/0057690360800f5120c82b581909725f09a94c14.jpg", "mid": 76807994, "name": "ZXSA-solider" }, "pages": [{ "cid": 49814945, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 226, "from": "vupload", "page": 1, "part": "迦尔纳应援是视频2_01", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/960d6efdab3975e5ba6b13178d9a0a49cbe4f584.jpg", "pubdate": 1533644685, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28756456, "coin": 48, "danmaku": 1, "dislike": 0, "favorite": 10, "his_rank": 0, "like": 40, "now_rank": 0, "reply": 27, "share": 12, "view": 904 }, "state": 0, "tid": 183, "title": "【2018 bilbil moe】 迦尔纳应援视频   第二弹", "tname": "影视剪辑", "videos": 1 }, { "aid": 28753982, "attribute": 16512, "cid": 49813835, "copyright": 1, "ctime": 1533643235, "desc": "这是在下第一次投稿希望不会出什么问题......也许吧。\n如果问题太多我就重做一次吧。", "dimension": { "height": 576, "rotate": 0, "width": 720 }, "duration": 238, "dynamic": "#日本场应援2018##FGO##FATE#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/6273def76c5d6a9cc61b4465a23cfaaeb6f5888b.jpg", "mid": 28036674, "name": "言峰明" }, "pages": [{ "cid": 49813835, "dimension": { "height": 576, "rotate": 0, "width": 720 }, "duration": 238, "from": "vupload", "page": 1, "part": "fgo原创卡片视频系列-阿尔泰尔", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/e969f49f4e218e6c18b5d39eb6d80147509a6d55.jpg", "pubdate": 1533643235, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28753982, "coin": 24, "danmaku": 5, "dislike": 0, "favorite": 5, "his_rank": 0, "like": 23, "now_rank": 0, "reply": 17, "share": 8, "view": 857 }, "state": -100, "tid": 172, "title": "fgo原创卡片视频系列-阿尔泰尔", "tname": "手机游戏", "videos": 1 }, { "aid": 28750045, "attribute": 16512, "cid": 49858754, "copyright": 1, "ctime": 1533630352, "desc": "视频类型: 动画\r\n动漫中那些毁天灭地的炫酷大招", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 890, "dynamic": "#动漫##动画##热血#", "owner": { "face": "http://i0.hdslb.com/bfs/face/607efa42b42d23a32433f524d452d3ab36a6cdd2.jpg", "mid": 7360144, "name": "十柒号" }, "pages": [{ "cid": 49858754, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 890, "from": "vupload", "page": 1, "part": "动漫中那些毁天灭地的炫酷大招", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/6583dc0f9c786eb7386f808771437b236732a589.png", "pubdate": 1533657312, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28750045, "coin": 359, "danmaku": 1784, "dislike": 0, "favorite": 1235, "his_rank": 0, "like": 1057, "now_rank": 0, "reply": 403, "share": 88, "view": 138104 }, "state": 0, "tid": 27, "title": "动漫中那些毁天灭地的炫酷大招", "tname": "综合", "videos": 1 }, { "aid": 28749274, "attribute": 16512, "cid": 49803783, "copyright": 1, "ctime": 1533639413, "desc": "一个潦草的自制手书233333有描绘，原作Takadabear", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 63, "dynamic": "#日本场应援2018##卫宫切嗣##卫宫士郎#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/57dd2529a51790824a6fb3e0fa3778b424cd7cab.jpg", "mid": 524252, "name": "笑揉橘猫不语" }, "pages": [{ "cid": 49803783, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 63, "from": "vupload", "page": 1, "part": "卫宫 搓腚舞", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/1a15f0b0220690a8d0b8e09a6cdda1fbe7011123.jpg", "pubdate": 1533639413, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28749274, "coin": 79, "danmaku": 33, "dislike": 0, "favorite": 89, "his_rank": 0, "like": 107, "now_rank": 0, "reply": 48, "share": 31, "view": 2578 }, "state": 0, "tid": 47, "title": "【卫宫家的搓屁舞】孩子不听话怎么办", "tname": "短片·手书·配音", "videos": 1 }, { "aid": 28748902, "attribute": 2113664, "cid": 49803395, "copyright": 1, "ctime": 1533639596, "desc": "模型：天草四郎時貞：sema／カルナ：ユタカ／シェイクスピア：履物連絡用（準備中）\n背景：sm15356644：kiyo_NoN\n动作/镜头：sm24491916：にもゆに\nBGM：EVERYBODY（Backstreet Boys）\nMME：Diffusion7：そぼろ", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 231, "dynamic": "#日本场应援2018##FATE##EVERYBODY#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg", "mid": 16295316, "name": "岸波玉藻" }, "pages": [{ "cid": 49803395, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 231, "from": "vupload", "page": 1, "part": "3", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/59e215ed79cc0814a36c0ed815b633e28c6ed1f7.jpg", "pubdate": 1533639596, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28748902, "coin": 13, "danmaku": 0, "dislike": 0, "favorite": 7, "his_rank": 0, "like": 29, "now_rank": 0, "reply": 5, "share": 7, "view": 636 }, "state": 0, "tid": 25, "title": "【FATE MMD】EVERYBODY【天草四郎&迦尔纳&莎士比亚】", "tname": "MMD·3D", "videos": 1 }, { "aid": 28745414, "attribute": 16512, "cid": 49795470, "copyright": 1, "ctime": 1533634290, "desc": "喜欢就点个赞吧 谢谢大家！\nbgm: 菅田将晖《ロングホープ・フィリア》", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 86, "dynamic": "#动漫##剪辑##我的英雄学院#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/96a64c7bbf85efa5453cbb5751b471e61265c394.jpg", "mid": 12423973, "name": "拉二的小太阳" }, "pages": [{ "cid": 49795470, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 86, "from": "vupload", "page": 1, "part": "切爆", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/136403e510faead254816acfd76ba6d5f5a6ce38.jpg", "pubdate": 1533634290, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28745414, "coin": 831, "danmaku": 225, "dislike": 0, "favorite": 2334, "his_rank": 0, "like": 2236, "now_rank": 0, "reply": 341, "share": 263, "view": 72678 }, "state": 0, "tid": 27, "title": "【我英】（切爆）鸡窝头，你老是垂头丧气，我都不舒服了！（谢谢你切岛）", "tname": "综合", "videos": 1 }, { "aid": 28744228, "attribute": 16512, "cid": 49793945, "copyright": 1, "ctime": 1533633433, "desc": "第一次尝试着做视频，对pr还不是很了解，\n但对于金木。（尽力了）\n做视频不敢有任何懈怠，大家好，新人up猪\n我来啦,希望各位大佬wu喷\nBGM：Angel    saybia\n           透明で透き通って何でも成れそうで    haku", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 367, "dynamic": "#剪辑##东京喰种##金木#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/220f925eafda0466421f1395a52ddad47dfc07a7.jpg", "mid": 288141009, "name": "-时鸣涧-" }, "pages": [{ "cid": 49793945, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 367, "from": "vupload", "page": 1, "part": "金木研：  我，从未后悔", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/768d50b95d27d6cab7c9be696cd3a23a640799df.jpg", "pubdate": 1533633433, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28744228, "coin": 46, "danmaku": 90, "dislike": 0, "favorite": 204, "his_rank": 0, "like": 212, "now_rank": 0, "reply": 87, "share": 28, "view": 13225 }, "state": 0, "tid": 183, "title": "金木研：  我，从未后悔", "tname": "影视剪辑", "videos": 1 }, { "aid": 28743188, "attribute": 2113664, "cid": 49793120, "copyright": 1, "ctime": 1533632587, "desc": "模型：ロビン・フッド：切な顔P\n场景：im4179284：切な顔P\n动作：sm29180863：yurie\n镜头：sm29298856：一護牛乳\nBGM：av5451565：云潇翼Seanwing\nMME：Diffusion7：そぼろ", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 221, "dynamic": "#FATE##日本场应援2018##罗宾汉#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg", "mid": 16295316, "name": "岸波玉藻" }, "pages": [{ "cid": 49793120, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 221, "from": "vupload", "page": 1, "part": "2", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/84dabeaa9b7d5d127c98f8121b0d46f241287767.jpg", "pubdate": 1533632587, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28743188, "coin": 2, "danmaku": 0, "dislike": 0, "favorite": 7, "his_rank": 0, "like": 23, "now_rank": 0, "reply": 6, "share": 2, "view": 124 }, "state": -100, "tid": 25, "title": "【FATE MMD】罗宾汉的极乐净土", "tname": "MMD·3D", "videos": 1 }, { "aid": 28741550, "attribute": 16768, "cid": 49789622, "copyright": 1, "ctime": 1533630391, "desc": "BGM：Désir——《fate/apocrypha》ED1\n新人up摸鱼出来的第二个视频\n前面一段偷懒了还望谅解（还有一小段用过两次\n喜欢的话就请关注投币推荐收藏一条龙吧=v=", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 278, "dynamic": "#日本场应援2018##间桐樱##卫宫士郎##远坂凛##燃向#终于弄好了哇QAQ", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/016fb61758a8697378703853f075e5ffd96dfc80.jpg", "mid": 74156490, "name": "极と墨" }, "pages": [{ "cid": 49789622, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 278, "from": "vupload", "page": 1, "part": "樱应援(2)", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/48b2c32d85521f0074ff8a34385811b8e0c59399.jpg", "pubdate": 1533630391, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28741550, "coin": 431, "danmaku": 75, "dislike": 0, "favorite": 776, "his_rank": 0, "like": 466, "now_rank": 0, "reply": 92, "share": 58, "view": 17369 }, "state": 0, "tid": 24, "title": "【FATE/fgo】正义之所在", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28740360, "attribute": 16512, "cid": 49786602, "copyright": 1, "ctime": 1533629143, "desc": "首先，感谢网易云用户：saberycr他在网易云投稿的游戏人生mad非常棒！给了我很大的灵感，大家可以去看看。\n新人渣作，喜欢的话就点个赞也是好的，谢谢！", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 368, "dynamic": "#日本场应援2018##AMV##MAD#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/fd9cf396df8779b55a84f8793a668f028f37608d.jpg", "mid": 107142392, "name": "清居wl" }, "pages": [{ "cid": 49786602, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 368, "from": "vupload", "page": 1, "part": "【MAD·AMV游戏人生zero】休比，下辈子再做我的妻子好吗？", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/e41e625d36b235e1fd55bbf479b550d6b93190e0.jpg", "pubdate": 1533629142, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28740360, "coin": 19, "danmaku": 5, "dislike": 0, "favorite": 12, "his_rank": 0, "like": 26, "now_rank": 0, "reply": 15, "share": 12, "view": 575 }, "state": 0, "tid": 24, "title": "【MAD·AMV游戏人生zero】休比，下辈子再做我的妻子好吗？", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28739521, "attribute": 16512, "cid": 49782315, "copyright": 1, "ctime": 1533629243, "desc": "大家好我死回来啦.........!\n学会了录屏和一点点简单的剪辑超开心!!!\n炫耀一下vqv。\n大家今天一定要给茶茶投票鸭!!!!!!!!!!!!!\n\nbgm:\n無邪気な冒険心——Goose house\n3/4——Goose house\n18歲——Goose house", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 799, "dynamic": "#绘画过程##板绘##上色#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/8901e94eb89768277f88f3e5e021b28f0202bdb5.jpg", "mid": 12469873, "name": "嗨呀个嘿" }, "pages": [{ "cid": 49782315, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 799, "from": "vupload", "page": 1, "part": "20180806_172718.mp4", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/428deb75735cab3e32cfd6af4a7e15dc62564ff6.jpg", "pubdate": 1533629243, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28739521, "coin": 15, "danmaku": 0, "dislike": 0, "favorite": 5, "his_rank": 0, "like": 13, "now_rank": 0, "reply": 15, "share": 11, "view": 417 }, "state": -100, "tid": 162, "title": "【一个过程】简陋的画了一个茶茶", "tname": "绘画", "videos": 1 }, { "aid": 28738449, "attribute": 16512, "cid": 49783840, "copyright": 1, "ctime": 1533628244, "desc": "休息了2周 再次回来做视频了\nBGM:一刀缭乱-六花\n希望大家喜欢 也希望fate在萌战里获得好成绩 也希望大家鬼岛活动加油！", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 200, "dynamic": "#日本场应援2018##AMV##FATE#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/ff34db61ca71de81684ea0ae9b708e5ee68cd342.jpg", "mid": 3294538, "name": "月无挽风" }, "pages": [{ "cid": 49783840, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 200, "from": "vupload", "page": 1, "part": "六花 - 一刀繚乱", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/dac96f76cc81fe4205fc29fb37f3d52178c73a87.jpg", "pubdate": 1533628244, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28738449, "coin": 162, "danmaku": 23, "dislike": 0, "favorite": 223, "his_rank": 0, "like": 174, "now_rank": 0, "reply": 33, "share": 48, "view": 5548 }, "state": 0, "tid": 24, "title": "【FGO/AMV】为御主献上 如雷鸣般的喝彩！", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28738418, "attribute": 16512, "cid": 49800159, "copyright": 1, "ctime": 1533623268, "desc": "应援视频。\n对不起来晚了，如果这样就能让故事停留在P1就好了。\n（虽然我觉得P2很好）\n希望休比和助手都能拿个好名次~", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 696, "dynamic": "#日本场应援2018##NO GAME NO LIFE##游戏人生#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/20fbb85c51b1cfcfc24372d5e06068addaf6f8a0.jpg", "mid": 4313856, "name": "年度枫" }, "pages": [{ "cid": 49800159, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 135, "from": "vupload", "page": 1, "part": "游戏人生zero-休比（原音频）", "vid": "", "weblink": "" }, { "cid": 49800172, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 561, "from": "vupload", "page": 2, "part": "如果没有P2就好了（配乐版）", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/ff2227531a7dcc0eaef3c22e73c34733689fec45.jpg", "pubdate": 1533634230, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28738418, "coin": 22, "danmaku": 10, "dislike": 0, "favorite": 19, "his_rank": 0, "like": 26, "now_rank": 0, "reply": 13, "share": 10, "view": 1278 }, "state": 0, "tid": 27, "title": "【游戏人生zero】休比应援：这场游戏是休比赢了", "tname": "综合", "videos": 2 }, { "aid": 28736888, "attribute": 2113664, "cid": 49781520, "copyright": 1, "ctime": 1533621539, "desc": "模型：エミヤ：ちょビ玉\n场景：im8147346：鯖缶359\n动作：sm24923974：遊風稜\n口型：sm32918418：しわこ\n镜头：sm26631976：足屋ｺｰﾋｰ\nMME：Diffusion7：そぼろ\nBGM：Beat It（Michael Jackson）", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 218, "dynamic": "#FATE##日本场应援2018##卫宫#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/7dc3c1da46f9d5024b27fc0c880a4c2a66327c16.jpg", "mid": 16295316, "name": "岸波玉藻" }, "pages": [{ "cid": 49781520, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 218, "from": "vupload", "page": 1, "part": "1", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/10338319f5125dfb9b793795a0fd02241dfc52fc.jpg", "pubdate": 1533621539, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28736888, "coin": 0, "danmaku": 1, "dislike": 0, "favorite": 7, "his_rank": 0, "like": 27, "now_rank": 0, "reply": 3, "share": 10, "view": 475 }, "state": 0, "tid": 25, "title": "【FATE MMD】卫宫的Beat it", "tname": "MMD·3D", "videos": 1 }, { "aid": 28734732, "attribute": 16768, "cid": 49769513, "copyright": 1, "ctime": 1533622564, "desc": "第三期预告（水视频）\n我怀疑我们能不能继续了（失望）赞好少，感觉大家不是很喜欢我这个系列\n真的如果收藏没有达到200我们打算做其他简单的了", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 264, "dynamic": "#日本场应援2018##魔法少女伊莉雅##阿库娅#我才不是什么智障，我是魔法女神！发起火来连自己都打！", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/a12473cd675c85d35ca62ebb16ee8788f924512e.jpg", "mid": 104934805, "name": "小千藤" }, "pages": [{ "cid": 49769513, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 264, "from": "vupload", "page": 1, "part": "第三期魔法少女", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/6d4d6dc5044c32ba3fa8e155abb89d71438c3904.jpg", "pubdate": 1533622564, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28734732, "coin": 272, "danmaku": 91, "dislike": 0, "favorite": 151, "his_rank": 0, "like": 588, "now_rank": 0, "reply": 145, "share": 48, "view": 9016 }, "state": -100, "tid": 24, "title": "【AMV/误解】我才不是智障！我是魔法少女~", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28734092, "attribute": 16512, "cid": 49775961, "copyright": 1, "ctime": 1533620802, "desc": "因为第一次传失误了所以删除了...对此感到抱歉...\n明天的帮派火拼请各位务必投zero two一票\nBGM：い〜やい〜やい〜や（算了~算了~算了~）", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 199, "dynamic": "#日本场应援2018##DARLINGINTHEFRANX##国家队#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/b17b1cfde77da1bb362f962e639852b853679a56.jpg", "mid": 33916569, "name": "熊屋_" }, "pages": [{ "cid": 49775961, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 199, "from": "vupload", "page": 1, "part": "4 (2)", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/ee255addecc8c1f9c61bb854b96dc2d6d45c606c.jpg", "pubdate": 1533620802, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28734092, "coin": 12, "danmaku": 1, "dislike": 0, "favorite": 19, "his_rank": 0, "like": 32, "now_rank": 0, "reply": 7, "share": 1, "view": 874 }, "state": -100, "tid": 24, "title": "[Darling in the Franxx]因为我们13部队是一家人啊", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28729478, "attribute": 16512, "cid": 49766687, "copyright": 1, "ctime": 1533614675, "desc": "bgm:彼女は旅に出る\n我的英雄学院实在是，太太太太太太太太好看了！！！！吹爆我英！！！真的具TM好看，我永远爱着绿谷小天使/咔酱/轰总/茶爷/欧叔/渡我/...(省略)，真的，我英真的很棒，b萌轰总下一场和小天使对，自己人打自己人，咔酱对闪闪，简直死亡分组）\nqaq手书里的绿毛是up我了，刚开始因为画风，然后一直没看，我朋友安利过我很多次了，后面是没东西看了，然后去看我英，然后 出不来了！！\n此生无悔入我英，祝小伙伴们食用愉快【比心】", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 205, "dynamic": "#我的英雄学院##手书##all出#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/a42c2ed64c15f8f782597a6a2d8dfc14064c8539.jpg", "mid": 8882876, "name": "七月萤兮" }, "pages": [{ "cid": 49766687, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 205, "from": "vupload", "page": 1, "part": "Pixgram_2018-08-06-05-51-39", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/78ea20ba7fa688185ef8def45bd6b27ba142a1aa.jpg", "pubdate": 1533614675, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28729478, "coin": 33, "danmaku": 33, "dislike": 0, "favorite": 30, "his_rank": 0, "like": 43, "now_rank": 0, "reply": 42, "share": 12, "view": 807 }, "state": -100, "tid": 47, "title": "【七月萤兮/我的英雄学院手书】我的小英雄", "tname": "短片·手书·配音", "videos": 1 }, { "aid": 28729392, "attribute": 16512, "cid": 49765760, "copyright": 1, "ctime": 1533614699, "desc": "bgm：Re：rain", "dimension": { "height": 720, "rotate": 0, "width": 1434 }, "duration": 290, "dynamic": "#日本场应援2018##恋爱##我的青春恋爱物语果然有问题#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/18ca4971240d76810158623d7c75240e675f4874.jpg", "mid": 31451891, "name": "骑士王SABER233" }, "pages": [{ "cid": 49765760, "dimension": { "height": 720, "rotate": 0, "width": 1434 }, "duration": 290, "from": "vupload", "page": 1, "part": "我的青春恋爱物语果然有问题 (1)", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/7b8058ac794060dbefac6e00256185bea88dcf7a.jpg", "pubdate": 1533614699, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28729392, "coin": 6, "danmaku": 6, "dislike": 0, "favorite": 14, "his_rank": 0, "like": 21, "now_rank": 0, "reply": 13, "share": 7, "view": 1101 }, "state": 0, "tid": 24, "title": "【我的青春恋爱物语果然有问题】那个房间依旧演绎着永不终结的日常", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28728563, "attribute": 16512, "cid": 49764773, "copyright": 1, "ctime": 1533613174, "desc": "ooc警告！！！！！！！！！！\n开头声音不知道为什么爆炸了，小心啊（虽然我觉得没人看简介）\n本家手书：sm7598520\n是半成品（但是不会画完，因为懒）\n作品是闪恩向向，伊斯塔凛厨慎入", "dimension": { "height": 704, "rotate": 0, "width": 1280 }, "duration": 81, "dynamic": "#日本场应援2018##bilibili moe#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/b8c804b83b724a75dbd695114b8e94fa0fd5c8b6.jpg", "mid": 5246707, "name": "鸦青夙" }, "pages": [{ "cid": 49764773, "dimension": { "height": 704, "rotate": 0, "width": 1280 }, "duration": 81, "from": "vupload", "page": 1, "part": "bandicam 2018-08-07 10-52-36-456", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/7a09ba0de0d85a3062aac90740382b6d96b24cac.jpg", "pubdate": 1533646608, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28728563, "coin": 88, "danmaku": 38, "dislike": 0, "favorite": 101, "his_rank": 0, "like": 149, "now_rank": 0, "reply": 50, "share": 27, "view": 4009 }, "state": -100, "tid": 47, "title": "【描绘】那什么的吉尔伽美什", "tname": "短片·手书·配音", "videos": 1 }, { "aid": 28728539, "attribute": 16768, "cid": 49763239, "copyright": 1, "ctime": 1533613312, "desc": "原图作者：@micsu3_3   \n一时兴起录的勾线视频 \n因为我就是被这张图拉入闪恩 就当给闪闪应援了\nBGM发在弹幕里   \n作者大大只在图里做了签名 但是微博p站都找不到了\n有人知道求发我一下", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 901, "dynamic": "#日本场应援2018##手绘##板绘#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/b0129594cbf7b0472760055e06619ff38ca5bd82.jpg", "mid": 101222463, "name": "-吾生-" }, "pages": [{ "cid": 49763239, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 901, "from": "vupload", "page": 1, "part": "金闪闪小恩", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/71b0f51ca97edab7f09ebe06d0a6d8df68968022.jpg", "pubdate": 1533613312, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28728539, "coin": 65, "danmaku": 32, "dislike": 0, "favorite": 38, "his_rank": 0, "like": 48, "now_rank": 0, "reply": 25, "share": 9, "view": 1705 }, "state": -100, "tid": 162, "title": "(封面勾线）闪恩 超舒服的勾线教程 金闪闪应援  原图@micsu3_3", "tname": "绘画", "videos": 1 }, { "aid": 28726197, "attribute": 16768, "cid": 49760343, "copyright": 1, "ctime": 1533610523, "desc": "素材 DARLING in the FRANXX\nBGM lie 三无MarBlue\n02应援 希望大家多多支持02", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 177, "dynamic": "#日本场应援2018##02##剪辑#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/9584df17eab3fa95f602a0f786c30fa40848aedd.jpg", "mid": 180306090, "name": "黑火saki" }, "pages": [{ "cid": 49760343, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 177, "from": "vupload", "page": 1, "part": "催泪 02应援 DARLING in the FRANXX BGM超燃", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/28862cff8571c64f8b1c366da7cfb2214cb0e8de.jpg", "pubdate": 1533610523, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28726197, "coin": 45, "danmaku": 1, "dislike": 0, "favorite": 32, "his_rank": 0, "like": 53, "now_rank": 0, "reply": 23, "share": 10, "view": 1279 }, "state": 0, "tid": 183, "title": "催泪 02应援 DARLING in the FRANXX BGM超燃", "tname": "影视剪辑", "videos": 1 }, { "aid": 28724349, "attribute": 16768, "cid": 49753999, "copyright": 1, "ctime": 1533609970, "desc": "为02和广主席疯狂打call！\n封面pixiv画师：星晓吻", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 235, "dynamic": "#AMV##MAD##新人向#国家队虽然瑕疵挺多，但这不妨它成为今年上半年给我留下印象最深的日本动画。", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/0a735c9ff4fe87d7c0f205a832e59cc59a902694.jpg", "mid": 8189036, "name": "幻化涅槃" }, "pages": [{ "cid": 49753999, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 235, "from": "vupload", "page": 1, "part": "比翼齐飞，终不悔", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/54587be6c0441b911ffa551666efe6e2c21c7ce3.jpg", "pubdate": 1533609970, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28724349, "coin": 69, "danmaku": 12, "dislike": 0, "favorite": 67, "his_rank": 0, "like": 87, "now_rank": 0, "reply": 25, "share": 22, "view": 1690 }, "state": 0, "tid": 24, "title": "【02广应援/燃】比翼齐飞，终不悔", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28721456, "attribute": 16768, "cid": 49750661, "copyright": 1, "ctime": 1533607334, "desc": "这次画了一个知世，我知道我画残了，完全没有知世小姐姐的那种气质TAT…………cm我也不画了，想不出来。（尾巴我居然忘了…………TAT）我也希望本战大家能多投给这善解人意，为他人着想，又是神助攻的知世几票，我不希望她就此止步于32强~以及，不喜勿喷。", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 238, "dynamic": "#日本场应援2018##我的小马驹##动画#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/ab1bf911a50086c21707f0f558908c1adda0f8ac.jpg", "mid": 71304403, "name": "暮临呀" }, "pages": [{ "cid": 49750661, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 238, "from": "vupload", "page": 1, "part": "知世拟马", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/7435ec40e0b513949546a93c15661df3dea27f94.jpg", "pubdate": 1533607334, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28721456, "coin": 4, "danmaku": 0, "dislike": 0, "favorite": 3, "his_rank": 0, "like": 2, "now_rank": 0, "reply": 19, "share": 5, "view": 322 }, "state": 0, "tid": 27, "title": "[mlp速绘]知世拟马", "tname": "综合", "videos": 1 }, { "aid": 28719317, "attribute": 2113664, "cid": 49746204, "copyright": 1, "ctime": 1533603953, "desc": "借物表：\nmodel:Kei\nmotion:srs\ncamera:aokana\nstage:hazi，溯北，怪獣対若大将P，kotami，RedialC\nmme:角砂糖，下っ腹P，XDOF，Diffusion7，SSAO\nmusic:無情", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 212, "dynamic": "#舞蹈MMD##日本场应援2018##新人#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/6061182c896d07597978ff34862d690652f29cf4.jpg", "mid": 348898917, "name": "ex陌书" }, "pages": [{ "cid": 49746204, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 212, "from": "vupload", "page": 1, "part": "無情", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/95039a13d98c56f3281791f33c7b19c6351df1fb.jpg", "pubdate": 1533603953, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28719317, "coin": 4, "danmaku": 1, "dislike": 0, "favorite": 53, "his_rank": 0, "like": 19, "now_rank": 0, "reply": 9, "share": 10, "view": 665 }, "state": 0, "tid": 25, "title": "【刀剑乱舞MMD】無情--来自kei咪", "tname": "MMD·3D", "videos": 1 }, { "aid": 28718973, "attribute": 16512, "cid": 49751276, "copyright": 1, "ctime": 1533606982, "desc": "主要内容为管家助理艾克雷亚·艾克雷尔·艾伊克雷亚\nBGM：ほぼ日P - 家に帰ると妻が必ず死んだふりをしています\n欢迎加入UP的粉丝群：237213911", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 163, "dynamic": "#不死者之王##骨傲天##Overlord##新星计划#\n主要内容为管家助理艾克雷亚·艾克雷尔·艾伊克雷亚\nBGM：ほぼ日P - 家に帰ると妻が必ず死んだふりをしています\n欢迎加入UP的粉丝群：237213911", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/a4cbc140157251afb969023ada66e6d7b084bf6e.jpg", "mid": 4021955, "name": "红莲妖" }, "pages": [{ "cid": 49751276, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 163, "from": "vupload", "page": 1, "part": "助理_1", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/dbec0f5b79c77003b9f2065ab5806b1f662d7f06.jpg", "pubdate": 1533606982, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28718973, "coin": 37, "danmaku": 15, "dislike": 0, "favorite": 14, "his_rank": 0, "like": 85, "now_rank": 0, "reply": 38, "share": 7, "view": 6447 }, "state": 0, "tid": 27, "title": "【瞎考剧】Overlord：艾克雷亚·艾克雷尔·艾伊克雷亚", "tname": "综合", "videos": 1 }, { "aid": 28718963, "attribute": 16512, "cid": 49851722, "copyright": 1, "ctime": 1533607036, "desc": "又一个积压了一个多月的视频，花了两天时间憋出来。\n（才刚用pr的新人啥也不会）\n很遗憾爱酱的B萌已经落幕了\n但他的留下反叛精神与钢铁的意志永远不会消失\n献给伟大的起义领袖，斯巴达克斯\n（中间部分已3倍速快进，需要也可跳至25:35继续食用）", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 1846, "dynamic": "#Fate/Grand Order##国服##实况##斯巴达克斯#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/584f66e6583416ef5117910c32fcb5ef26df0e5c.jpg", "mid": 9366744, "name": "Actinides" }, "pages": [{ "cid": 49851722, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 1846, "from": "vupload", "page": 1, "part": "序列 01", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/fb8b9580a2039ca2bb56efcc0315fd911801f27e.jpg", "pubdate": 1533619025, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28718963, "coin": 6, "danmaku": 5, "dislike": 0, "favorite": 6, "his_rank": 0, "like": 9, "now_rank": 0, "reply": 7, "share": 8, "view": 822 }, "state": 0, "tid": 172, "title": "我的爱终将毁灭一切压迫！斯巴达克斯主手vs魔性菩萨", "tname": "手机游戏", "videos": 1 }, { "aid": 28714933, "attribute": 16768, "cid": 78023888, "copyright": 1, "ctime": 1533603974, "desc": "bgm:lemon\n稍微小改了一下,虽然感觉还有点问题,但之后也没有大改的打算了", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 269, "dynamic": "#日本场应援2018##命运石之门##石头门#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/b77b86be883edc9e028148d4dbbe30e25f2e8682.jpg", "mid": 12787286, "name": "羽室233" }, "pages": [{ "cid": 78023888, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 269, "from": "vupload", "page": 1, "part": "试下直接删旧源换源0.0", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/fa7894144ea6aa79df078be2b9a427346c569237.jpg", "pubdate": 1533603974, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28714933, "coin": 51, "danmaku": 2, "dislike": 0, "favorite": 24, "his_rank": 0, "like": 35, "now_rank": 0, "reply": 24, "share": 14, "view": 1094 }, "state": 0, "tid": 24, "title": "【命运石之门】误入α线——你待在这里，只不过是在梦境中罢了", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28714440, "attribute": 2113920, "cid": 49737324, "copyright": 1, "ctime": 1533603986, "desc": "高三那年看了游戏人生zero，过了很久才释然...\n“我其实不想给任何人的...喜欢里克的心情，不想和他分开的心情，毕竟很害羞啊！从里克那得到的多到数不清的系统错误，这些都是只属于休比自己的东西，现在要把这些交给你们，这意味着什么？你们给我明白啊！笨蛋！别在那啰里啰唆！给我把这份思念继承下去啊！\n给我把应援票投给休比啊！w\n给我把关注和硬币投up主啊！（误）“\n休比，祝你终有一天能与自己重要的人重逢.\n\n封面截自BD  0：55：56\nbgm：befall（崩三女王降临印象曲）", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 235, "dynamic": "#日本场应援2018##新星计划##游戏人生zero#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/0e0c4b99b95726bf34c62122effa08c4e1e36e11.jpg", "mid": 35578381, "name": "阴久晴" }, "pages": [{ "cid": 49737324, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 235, "from": "vupload", "page": 1, "part": "游戏人生", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/527eb42364d323d9c171be6cce97178c7b140656.jpg", "pubdate": 1533616201, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28714440, "coin": 70, "danmaku": 9, "dislike": 0, "favorite": 39, "his_rank": 0, "like": 72, "now_rank": 0, "reply": 17, "share": 11, "view": 967 }, "state": 1, "tid": 24, "title": "【游戏人生/休比应援】当给休比配上崩三的bgm，悲剧是否能够改变", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28714349, "attribute": 16512, "cid": 49738002, "copyright": 1, "ctime": 1533603990, "desc": "第一次剪视频，完全用爱发电爆肝赶在凛凛本战的时候做完，做得不好的地方还请大家包容啦。\n他们俩真好嘤嘤嘤，凛凛、哈鲁冲鸭！\n事先声明，里面混有玻璃渣，但结局绝对是甜的！绝对！！", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 306, "dynamic": "#日本场应援2018##凛遥##Free！#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/7c8e6063dbcbe34411c761c1645038e49f19a5cf.jpg", "mid": 4902600, "name": "浮声" }, "pages": [{ "cid": 49738002, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 306, "from": "vupload", "page": 1, "part": "free", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/df18b2ffe096c285a8b6f1953cd75a5429ee6de7.jpg", "pubdate": 1533603990, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28714349, "coin": 177, "danmaku": 70, "dislike": 0, "favorite": 214, "his_rank": 0, "like": 173, "now_rank": 0, "reply": 84, "share": 29, "view": 2883 }, "state": 0, "tid": 24, "title": "【Free!凛遥】【愛してるのに、愛せない】爱着你、却无法爱你", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28712030, "attribute": 16768, "cid": 49732205, "copyright": 1, "ctime": 1533604000, "desc": "永不放弃努力前行 是想抓住梦想的翅膀\n时至今日 想要传达的心愿无法按捺 在心中迸发\n动摇的心或有迷茫 即使如此也要向前\n相信会有风停雨散\n向着明天前行  得以遇见Sunshine!\n昂首便是万里晴空", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 282, "dynamic": "#日本场应援2018##MAD.AMV##MAD##Aqours##lovelive#\n永不放弃努力前行 是想抓住梦想的翅膀\n时至今日 想要传达的心愿无法按捺 在心中迸发\n动摇的心或有迷茫 即使如此也要向前\n相信会有风停雨散\n向着明天前行  得以遇见Sunshine!\n昂首便是万里晴空", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/0630cf1774548a15fe62fe93de01f76f91232dbb.jpg", "mid": 177444763, "name": "希大0723" }, "pages": [{ "cid": 49732205, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 282, "from": "vupload", "page": 1, "part": "序列 01", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/edccc6da7934da5cf39e095bedbcbffc8f1f66ba.jpg", "pubdate": 1533604000, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28712030, "coin": 27, "danmaku": 2, "dislike": 0, "favorite": 11, "his_rank": 0, "like": 19, "now_rank": 0, "reply": 5, "share": 2, "view": 787 }, "state": -4, "tid": 24, "title": "【Aqours BD7纪念】キセキヒカル 奇迹闪耀", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28711339, "attribute": 16768, "cid": 49733160, "copyright": 1, "ctime": 1533584227, "desc": "士郎加油，喜欢的话推荐收藏一下哦!", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 255, "dynamic": "#日本场应援2018##卫宫士郎##AMV#", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/78527264bbbb4c1370ffb1c57c999c3984323dd6.jpg", "mid": 66862188, "name": "伊卡伊卡w" }, "pages": [{ "cid": 49733160, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 255, "from": "vupload", "page": 1, "part": "【AMV·卫宫士郎应援】“输给谁都可以，但是，决不能输给自己!”", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/ead76899d19cdbe371b1a646c13a8ec850e89040.jpg", "pubdate": 1533584227, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28711339, "coin": 25, "danmaku": 9, "dislike": 0, "favorite": 46, "his_rank": 0, "like": 56, "now_rank": 0, "reply": 19, "share": 16, "view": 2037 }, "state": 0, "tid": 24, "title": "【AMV·卫宫士郎应援】“输给谁都可以，但是，决不能输给自己!”", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28710374, "attribute": 16512, "cid": 49727323, "copyright": 1, "ctime": 1533604007, "desc": "尝试去讲一个机器人少女拥有心的故事，于是选用了镜音的这首歌曲，同时和花たん的翻唱结合做音频处理，试图从休比的个体视角，而不是故事的全局视角，去表现少女从“无心”到拥有“心”的升华过程。\n\n素材：no game no life 0（游戏人生剧场版）\nBGM：ココロ（镜音+花たん,UP主剪辑版）", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 312, "dynamic": "#日本场应援2018##休比·多拉##休比# 还是太赶了，待打磨的地方太多，完成度三成吧", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/fe4a7d538ddbcba7bf28a2bf1b29965ac1d2a6b5.jpg", "mid": 16386653, "name": "精神隶属机" }, "pages": [{ "cid": 49727323, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 312, "from": "vupload", "page": 1, "part": "心·机凯", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/841ef5644f90f16633bb5b17201bd73932bd8e38.jpg", "pubdate": 1533604007, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28710374, "coin": 706, "danmaku": 111, "dislike": 0, "favorite": 353, "his_rank": 0, "like": 607, "now_rank": 0, "reply": 109, "share": 113, "view": 12415 }, "state": -100, "tid": 24, "title": "【游戏人生ZERO】心·机凯——那是名为“心”的奇迹（ココロ・エクスマキナ）", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28709514, "attribute": 2113920, "cid": 49728720, "copyright": 1, "ctime": 1533609142, "desc": "青叶可真是个罪孽深重的女人，没有青叶看我要死了(\"▔□▔)/\n请大家为青叶投上宝贵的一票！！\nbgm：恋爱循环香菜版", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 204, "dynamic": "#日本场应援2018##新星计划##凉风青叶#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/0e0c4b99b95726bf34c62122effa08c4e1e36e11.jpg", "mid": 35578381, "name": "阴久晴" }, "pages": [{ "cid": 49728720, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 204, "from": "vupload", "page": 1, "part": "凉风青叶", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/be899252235f5fbc3f432d354fad87e59e79a8d3.jpg", "pubdate": 1533634233, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28709514, "coin": 29, "danmaku": 25, "dislike": 0, "favorite": 16, "his_rank": 0, "like": 35, "now_rank": 0, "reply": 12, "share": 10, "view": 411 }, "state": 1, "tid": 24, "title": "【青叶应援】没有青叶看我要死了(\"▔□▔)/青叶赛高", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28708306, "attribute": 2113664, "cid": 50233770, "copyright": 1, "ctime": 1533604016, "desc": "自制，借物表见视频内\n摸鱼，这次算填完一个坑，于是顺便把它当做了应援视频，虽然感觉发的时间有点微妙\n很喜欢这首歌的动作数据，感觉和波特莫名契合，很可爱", "dimension": { "height": 768, "rotate": 0, "width": 1366 }, "duration": 194, "dynamic": "", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/63f3fe9708a4dfb9158d5a1d845e3f1bfa04592a.jpg", "mid": 6565661, "name": "Tiua" }, "pages": [{ "cid": 50233770, "dimension": { "height": 768, "rotate": 0, "width": 1366 }, "duration": 194, "from": "vupload", "page": 1, "part": "0", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/2b3bf7256a573bfb5a1d1c2ac8308a5724ec0859.jpg", "pubdate": 1533604016, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28708306, "coin": 8, "danmaku": 1, "dislike": 0, "favorite": 16, "his_rank": 0, "like": 15, "now_rank": 0, "reply": 7, "share": 7, "view": 397 }, "state": 0, "tid": 25, "title": "【女神异闻录5MMD】波特的染上你的颜色", "tname": "MMD·3D", "videos": 1 }, { "aid": 28707654, "attribute": 16640, "cid": 49726539, "copyright": 1, "ctime": 1533604019, "desc": "=-=想哭了，感觉莫名对不到节奏\n但总之是吧之前的遗憾略微弥补了一下（真的是略微）哭\n因为里克违背了誓约，所以他注定要失去一切（哭）\nMAD很一般，不知道是做的烂还是审美疲劳了（我觉得是做的烂）\n请审核大佬放过~呜呜呜", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 255, "dynamic": "#日本场应援2018##里克##休比#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/67c1f2995c2b69abef1e952eb01d6e72a3a249c1.jpg", "mid": 6410318, "name": "玖钥桑" }, "pages": [{ "cid": 49726539, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 255, "from": "vupload", "page": 1, "part": "无标题2", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/e8f2e8e8bf2461dbabaf0352cbc28c8a7bca78cf.jpg", "pubdate": 1533604019, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 0, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28707654, "coin": 21, "danmaku": 4, "dislike": 0, "favorite": 20, "his_rank": 0, "like": 37, "now_rank": 0, "reply": 17, "share": 11, "view": 945 }, "state": 0, "tid": 24, "title": "【游戏人生ZERO/MAD/终极应援】违背了誓约，我注定失去这一切", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28707213, "attribute": 16768, "cid": 49725419, "copyright": 1, "ctime": 1533604022, "desc": "虽然用很多时间搞，但是依然做的很烂", "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 87, "dynamic": "#日本场应援2018##AMV##fate#", "mission_id": 10568, "owner": { "face": "http://i1.hdslb.com/bfs/face/147a6f160a5cc3364828bf2ad10909d6bf2ff082.jpg", "mid": 4961140, "name": "凉宫杏夏" }, "pages": [{ "cid": 49725419, "dimension": { "height": 1080, "rotate": 0, "width": 1920 }, "duration": 87, "from": "vupload", "page": 1, "part": "序列 03", "vid": "", "weblink": "" }], "pic": "http://i2.hdslb.com/bfs/archive/b6969e7eb14eb1854d094c95d243e3356a88719f.jpg", "pubdate": 1533604022, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 1, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28707213, "coin": 7, "danmaku": 5, "dislike": 0, "favorite": 14, "his_rank": 0, "like": 23, "now_rank": 0, "reply": 10, "share": 8, "view": 967 }, "state": 0, "tid": 24, "title": "【AMV】高燃，最爱的红色Archer和红色的魔法师", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28705483, "attribute": 16512, "cid": 49722687, "copyright": 1, "ctime": 1533574047, "desc": "bgm很老了，小学生估计都没听过", "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 112, "dynamic": "#日本场应援2018##AMV##MAD#", "mission_id": 10568, "owner": { "face": "http://i2.hdslb.com/bfs/face/39f667b341cf21827cd7ae81f68da3081934ac82.jpg", "mid": 97248224, "name": "bili_97248224" }, "pages": [{ "cid": 49722687, "dimension": { "height": 720, "rotate": 0, "width": 1280 }, "duration": 112, "from": "vupload", "page": 1, "part": "【龙王的工作】八一x空银子，只对你有感觉", "vid": "", "weblink": "" }], "pic": "http://i0.hdslb.com/bfs/archive/9925518d391f52287c1a11e0b1f13f87505ed3f5.jpg", "pubdate": 1533574047, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28705483, "coin": 15, "danmaku": 3, "dislike": 0, "favorite": 11, "his_rank": 0, "like": 24, "now_rank": 0, "reply": 10, "share": 11, "view": 1389 }, "state": 0, "tid": 24, "title": "【龙王的工作】八一x空银子，只对你有感觉", "tname": "MAD·AMV", "videos": 1 }, { "aid": 28705200, "attribute": 16512, "cid": 49719266, "copyright": 1, "ctime": 1533604035, "desc": "原作：《孤独的巡礼/孤独な巡礼》\n出自作品：Fate/Stay Night\n作者：川井宪次\n演奏乐器：钢琴/小提琴\nSTAFF：钢琴/小提琴/COS/后期：Kino\n终于翻了自己从刚入fate坑就特别喜欢的这首歌~！\n一人全役了整首歌，有许多不足，还请各位dalao们指正~\n一人制作辛苦，如果喜欢希望能给点个赞啦~比心(๑•̀ㅁ•́ฅ)\n（原声乐器的录音好蓝瘦QWQ）\n这次试了远坂凛在Fate/Grand Order中的概念礼装元素转换的COS，凛酱赛高！我永远喜欢远坂凛.JPG \n（虽然这是Saber的", "dimension": { "height": 480, "rotate": 0, "width": 640 }, "duration": 116, "dynamic": "#fate##日本场应援2018#终于翻了自己从刚入fate坑就特别喜欢的《孤独的巡礼》，试了远坂凛在Fate/Grand Order中的概念礼装元素转换的COS，凛酱赛高！我永远喜欢远坂凛.JPG。一人全役了整首歌，有许多不足，还请各位dalao们指正~", "mission_id": 10568, "owner": { "face": "http://i0.hdslb.com/bfs/face/71f384ff3ed0a7a9b3e7cad28cedbb988ca16173.jpg", "mid": 3575182, "name": "LogicKino" }, "pages": [{ "cid": 49719266, "dimension": { "height": 480, "rotate": 0, "width": 640 }, "duration": 116, "from": "vupload", "page": 1, "part": "孤独的巡礼", "vid": "", "weblink": "" }], "pic": "http://i1.hdslb.com/bfs/archive/3f54e6e37135ad042b49b66e75f1d0495321fd46.jpg", "pubdate": 1533604035, "rights": { "autoplay": 1, "bp": 0, "download": 0, "elec": 0, "hd5": 0, "is_cooperation": 0, "movie": 0, "no_background": 0, "no_reprint": 1, "pay": 0, "ugc_pay": 0, "ugc_pay_preview": 0 }, "stat": { "aid": 28705200, "coin": 122, "danmaku": 10, "dislike": 0, "favorite": 30, "his_rank": 0, "like": 82, "now_rank": 0, "reply": 64, "share": 16, "view": 2323 }, "state": 0, "tid": 59, "title": "【一人全役】【钢琴&小提琴】孤独的巡礼 Fate/Stay Night插入曲【B萌日本场应援】", "tname": "演奏", "videos": 1 }] } }
    }

    // xhr hook，包括原生XMLHttpRequest、$.ajax中的jsonp、WebSocket
    const intercept = {
        init: () => {
            const open = XMLHttpRequest.prototype.open;
            const send = XMLHttpRequest.prototype.send;
            const addEventListener = XMLHttpRequest.prototype.addEventListener;
            // 为了防止pakku.js休眠时，send中主动请求分段的部分被重复调用而设置的标志
            let segRequestOnlyOnce = true;
            if (config.reset.livechat) {
                let decoder = new TextDecoder();
                let encoder = new TextEncoder();
                let liveChatOld; // 对旧播放器建立的ws对象的引用
                let liveChat;
                // 为了获取ws对象的引用,hook WebSocket.send
                let wsHookRunOnce = true;
                const wssend = WebSocket.prototype.send;

                WebSocket.prototype.send = function (...arg) {
                    if (wsHookRunOnce && this.url == 'wss://broadcast.chat.bilibili.com:4095/sub') {
                        liveChatOld = this;
                        // 切p和掉线之后需要重新启动hook,获得新的引用
                        let onclose = liveChatOld.onclose;
                        liveChatOld.onclose = function () {
                            wsHookRunOnce = true;
                            clearTimeout(liveChat.heatTimer);
                            liveChat.close();
                            onclose.call(this);
                        }
                        // 从bilibiliPlayer.js > b.prototype.xx复制过来
                        // 编码一个数据包
                        // body[Object] : 要发送的信息
                        // option[Number] : 数据包对应的行为
                        //                  =5 一条弹幕数据
                        //                  =7 首个数据包,建立与服务器的连接
                        // return[Buffer] : 包装好的数据
                        liveChatOld.convertToArrayBuffer = function (body, option) {
                            let header = [{ "name": "Header Length", "key": "headerLen", "qg": 2, "offset": 4, "value": 16 }, { "name": "Protocol Version", "key": "ver", "qg": 2, "offset": 6, "value": 1 }, { "name": "Operation", "key": "op", "qg": 4, "offset": 8, "value": option }, { "name": "Sequence Id", "key": "seq", "qg": 4, "offset": 12, "value": 1 }];
                            let headerBuf = new ArrayBuffer(16);
                            let viewer = new DataView(headerBuf, 0);
                            let bodyBuf = encoder.encode(JSON.stringify(body));
                            viewer.setInt32(0, 16 + bodyBuf.byteLength);
                            header.forEach(function (b) {
                                4 === b.qg ? viewer.setInt32(b.offset, b.value) : 2 === b.qg && viewer.setInt16(b.offset, b.value)
                            })
                            return mergeArrayBuffer(headerBuf, bodyBuf);
                        }
                        wsHookRunOnce = false;
                        initLiveChat();
                    }
                    wssend.call(this, ...arg);
                }

                // 原函数位于bilibiliPlayer.js > c.a.eK 和 jsc-player > Dl.mergeArrayBuffer
                // 连接两个buffer
                function mergeArrayBuffer(headerBuf, bodyBuf) {
                    headerBuf = new Uint8Array(headerBuf);
                    bodyBuf = new Uint8Array(bodyBuf);
                    var d = new Uint8Array(headerBuf.byteLength + bodyBuf.byteLength);
                    d.set(headerBuf, 0);
                    d.set(bodyBuf, headerBuf.byteLength);
                    return d.buffer;
                }

                function initLiveChat() {
                    // 数据包对应的Operation常量表
                    let Pl = { "WS_OP_HEARTBEAT": 2, "WS_OP_HEARTBEAT_REPLY": 3, "WS_OP_DATA": 1000, "WS_OP_BATCH_DATA": 9, "WS_OP_DISCONNECT_REPLY": 6, "WS_OP_USER_AUTHENTICATION": 7, "WS_OP_CONNECT_SUCCESS": 8, "WS_OP_CHANGEROOM": 12, "WS_OP_CHANGEROOM_REPLY": 13, "WS_OP_REGISTER": 14, "WS_OP_REGISTER_REPLY": 15, "WS_OP_UNREGISTER": 16, "WS_OP_UNREGISTER_REPLY": 17, "WS_OP_OGVCMD_REPLY": 1015, "WS_PACKAGE_HEADER_TOTAL_LENGTH": 18, "WS_PACKAGE_OFFSET": 0, "WS_HEADER_OFFSET": 4, "WS_VERSION_OFFSET": 6, "WS_OPERATION_OFFSET": 8, "WS_SEQUENCE_OFFSET": 12, "WS_COMPRESS_OFFSET": 16, "WS_CONTENTTYPE_OFFSET": 17, "WS_BODY_PROTOCOL_VERSION": 1, "WS_HEADER_DEFAULT_VERSION": 1, "WS_HEADER_DEFAULT_OPERATION": 1, "ws_header_default_sequence": 1, "WS_HEADER_DEFAULT_COMPRESS": 0, "WS_HEADER_DEFAULT_CONTENTTYPE": 0 };
                    // 请求头的参数表
                    let wsBinaryHeaderList = [{ "name": "Header Length", "key": "headerLen", "bytes": 2, "offset": 4, "value": 18 }, { "name": "Protocol Version", "key": "ver", "bytes": 2, "offset": 6, "value": 1 }, { "name": "Operation", "key": "op", "bytes": 4, "offset": 8, "value": 7 }, { "name": "Sequence Id", "key": "seq", "bytes": 4, "offset": 12, "value": 2 }, { "name": "Compress", "key": "compress", "bytes": 1, "offset": 16, "value": 0 }, { "name": "ContentType", "key": "contentType", "bytes": 1, "offset": 17, "value": 0 }]
                    liveChat = new WebSocket('wss://broadcast.chat.bilibili.com:7823/sub');
                    liveChat.binaryType = "arraybuffer";
                    liveChat.heatTimer = -1;

                    // 每30秒一个心跳包
                    liveChat.heartBeat = function () {
                        var i = this;
                        clearTimeout(this.heatTimer);
                        var e = this.convertToArrayBuffer({}, Pl.WS_OP_HEARTBEAT);
                        this.send(e);
                        this.heatTimer = window.setTimeout((function () {
                            i.heartBeat();
                        }), 1e3 * 30);
                    }

                    liveChat.onopen = function () {
                        let body = {
                            "room_id": "video://" + aid + "/" + cid,
                            "platform": "web",
                            "accepts": [1000, 1015]
                        };
                        return this.send(this.convertToArrayBuffer(body, 7));
                    }

                    liveChat.onmessage = function (i) {
                        try {
                            var t = this.convertToObject(i.data);
                            if (t) {
                                switch (t.op) {
                                    case Pl.WS_OP_HEARTBEAT_REPLY:
                                        // 接收到心跳包后,服务器响应当前在线人数的数据
                                        // 旧播放器连接的4095端口,虽然不再下发实时弹幕,但依然照常响应在线人数
                                        // 所以暂时不用替换成新版
                                        // this.onHeartBeatReply(t.body);
                                        break;
                                    case Pl.WS_OP_CONNECT_SUCCESS:
                                        this.heartBeat();
                                        break;
                                    // 旧播放器只能处理(连接成功，心跳响应，实时弹幕)三种响应信息
                                    // 新播放器新增的指令和功能就不管了
                                    case Pl.WS_OP_CHANGEROOM_REPLY:
                                        //0 === Number(t.body.code) && this.options.onChangeRoomReply({ data : t && t.body });
                                        break;
                                    case Pl.WS_OP_REGISTER_REPLY:
                                        //0 === Number(t.body.code) && this.options.onRegisterReply({ data : t && t.body });
                                        break;
                                    case Pl.WS_OP_UNREGISTER_REPLY:
                                        //0 === Number(t.body.code) && this.options.onUnRegisterReply({ data : t && t.body });
                                        break;
                                    case Pl.WS_OP_DATA:
                                    case Pl.WS_OP_BATCH_DATA:
                                        t.body.forEach(function (v) {
                                            // 记录实时弹幕哈希值
                                            hash.push(v[0].split(",")[7]);
                                            liveChatOld.onmessage({
                                                data: liveChatOld.convertToArrayBuffer({
                                                    cmd: 'DM',
                                                    info: [v[0], v[1]]
                                                }, 5)
                                            });
                                        });
                                        break;
                                    case Pl.WS_OP_OGVCMD_REPLY:
                                        //this.onOgvCmdReply(t);
                                        break;
                                    default:
                                    //this.msgReply(t)
                                }
                            }
                        } catch (i) {
                            console.error("WebSocket Error : ", i)
                        }
                        return this;
                    }

                    // jsc-player > i.prototype.convertToArrayBuffer,新版播放器的请求头信息更多,需要18字节
                    // 基本与liveChatOld.convertToArrayBuffer相同
                    liveChat.convertToArrayBuffer = function (body, option) {
                        let headerBuf = new ArrayBuffer(Pl.WS_PACKAGE_HEADER_TOTAL_LENGTH);
                        let viewer = new DataView(headerBuf, Pl.WS_PACKAGE_OFFSET);
                        let bodyBuf = encoder.encode(JSON.stringify(body));
                        viewer.setInt32(Pl.WS_PACKAGE_OFFSET, Pl.WS_PACKAGE_HEADER_TOTAL_LENGTH + bodyBuf.byteLength);
                        wsBinaryHeaderList[2].value = option;
                        wsBinaryHeaderList.forEach((function (i) {
                            4 === i.bytes ? (viewer.setInt32(i.offset, i.value),
                                "seq" === i.key && ++i.value) : 2 === i.bytes ? viewer.setInt16(i.offset, i.value) : 1 === i.bytes && viewer.setInt8(i.offset, i.value)
                        }));
                        return mergeArrayBuffer(headerBuf, bodyBuf);
                    }

                    // jsc-player > i.prototype.convertToObject
                    // convertToArrayBuffer对应的解码函数
                    liveChat.convertToObject = function (i) {
                        var e = new DataView(i), t = {};
                        t.packetLen = e.getInt32(Pl.WS_PACKAGE_OFFSET);
                        wsBinaryHeaderList.forEach((function (i) {
                            4 === i.bytes ? t[i.key] = e.getInt32(i.offset) : 2 === i.bytes ? t[i.key] = e.getInt16(i.offset) : 1 === i.bytes && (t[i.key] = e.getInt8(i.offset))
                        }));
                        if (t.op && t.op === Pl.WS_OP_BATCH_DATA) {
                            t.body = this.parseDanmaku(i, e, Pl.WS_PACKAGE_HEADER_TOTAL_LENGTH, t.packetLen);
                        }
                        else if (t.op && Pl.WS_OP_DATA === t.op) {
                            t.body = this.parseDanmaku(i, e, Pl.WS_PACKAGE_OFFSET, t.packetLen);
                        }
                        else if (t.op && t.op === Pl.WS_OP_OGVCMD_REPLY) {
                            t.body = ""; // this.parseOgvCmd(i, e, Pl.WS_PACKAGE_OFFSET, t.packetLen);
                        }
                        else if (t.op) {
                            t.body = [];
                            for (var a = Pl.WS_PACKAGE_OFFSET, r = t.packetLen, n = "", l = ""; a < i.byteLength; a += r) {
                                r = e.getInt32(a);
                                n = e.getInt16(a + Pl.WS_HEADER_OFFSET);
                                try {
                                    l = JSON.parse(decoder.decode(i.slice(a + n, a + r)));
                                    t.body = l;
                                } catch (e) {
                                    l = decoder.decode(i.slice(a + n, a + r));
                                    console.error("decode body error:", new Uint8Array(i), t);
                                }
                            }
                        }
                        return t;
                    }

                    // jsc-player > i.prototype.parseDanmaku
                    liveChat.parseDanmaku = function (i, e, t, a) {
                        for (var r, n = [], l = t; l < i.byteLength; l += a) {
                            a = e.getInt32(l);
                            r = e.getInt16(l + Pl.WS_HEADER_OFFSET);
                            try {
                                n.push(JSON.parse(decoder.decode(i.slice(l + r, l + a))));
                            } catch (e) {
                                n.push(decoder.decode(i.slice(l + r, l + a)));
                                console.error("decode body error:", new Uint8Array(i));
                            }
                        }
                        return n;
                    }
                }
            }
            //Worker Hook
            if (config.reset.danmuku && Worker) {
                // hook postMessage来得到旧播放器创建的 获取list.so 的worker对象
                let workerPostMsg = Worker.prototype.postMessage;
                let list_so;
                let loadTime, parseTime; // 旧播放器需要得到耗时数据(网络请求，数据处理)
                Worker.prototype.postMessage = function (aMessage, transferList) {
                    if (aMessage.url && aMessage.url.includes("list.so")) {
                        list_so = this;
                        loadTime = new Date();
                        let Segments = [];
                        deliver.getSegDanmaku(function (protoSegments) {
                            loadTime = new Date() - loadTime;
                            parseTime = new Date();
                            protoSegments.forEach(function (seg) {
                                Segments = Segments.concat(protoSeg.decode(new Uint8Array(seg)).elems);
                            });
                            Segments.sort(function (a, b) {
                                return a.progress - b.progress;
                            });
                            // 将弹幕转换为旧格式
                            let danmaku = Segments.map(function (v) {
                                // 记录弹幕池哈希值
                                hash.push(v.midHash);
                                return {
                                    class: 0,
                                    color: v.color,
                                    date: v.ctime,
                                    dmid: v.idStr, // v.idStr与v.id在最近产生的弹幕数据中不相等
                                    mode: v.mode,
                                    size: v.fontsize,
                                    stime: v.progress / 1000,
                                    text: v.content,
                                    uid: v.midHash
                                };
                            });
                            parseTime = new Date() - parseTime;
                            list_so.onmessage({
                                data: {
                                    code: 0,
                                    danmakuArray: danmaku,
                                    loadTime: loadTime,
                                    parseTime: parseTime,
                                    sendTip: "",
                                    state: 0,
                                    textSide: "",
                                    total: danmaku.length.toString()
                                }
                            });
                            // 把分段弹幕转换到xml以备下载
                            deliver.toXml(Segments).then(function (result) {
                                // 备份弹幕
                                xml = result;
                            });
                        });
                    } else {
                        workerPostMsg.call(this, aMessage, transferList);
                    }
                }
            }
            // 原生xhr hook
            XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                let _url = url, hook = [_url, ""];
                let obj = deliver.search2obj(url);
                // 替换视频心跳
                if (url.includes('api.bilibili.com/x/report/web/heartbeat') && config.reset.heartbeat) {
                    url = url.replace('api.bilibili.com/x/report/web/heartbeat', 'api.bilibili.com/x/click-interface/web/heartbeat');
                    debug.debug("XHR重定向", "替换视频心跳", [_url, url]);
                }
                // 显示历史视频
                if (url.includes('api.bilibili.com/x/web-interface/history/cursor') && url.includes("business") && config.reset.history) {
                    let max = obj.max || "", view_at = obj.view_at || "";
                    url = deliver.obj2search("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: 20 });
                    debug.debug("XHR重定向", "显示历史视频", [_url, url]);
                }
                // 修改正在直播
                if (url.includes('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) intercept.biliIndexRec(this, hook) });
                    url = hook[1] = url.replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web');
                }
                // 修改直播动态
                if (url.includes('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) intercept.biliIndexRec(this, hook) });
                    url = hook[1] = url.replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web');
                }
                // 重定向番剧信息
                if (url.includes('bangumi.bilibili.com/view/web_api/season?')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) intercept.season(this, hook) });
                    url = hook[1] = url.replace('bangumi.bilibili.com/view/web_api/season', 'api.bilibili.com/pgc/view/web/season');
                }
                // 重定向追番信息
                if (url.includes('bangumi.bilibili.com/ext/web_api/season_count?')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) intercept.stat(this, hook) });
                    url = hook[1] = url.replace('bangumi.bilibili.com/ext/web_api/season_count', 'api.bilibili.com/pgc/web/season/stat');
                }
                // 修改番剧推荐
                if (url.includes('api.bilibili.com/pgc/web/recommend/related/recommend')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) intercept.recommend(this) });
                }
                // 修改直播数据
                if (url.includes('api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) intercept.getRoomPlayInfo(this) });
                }
                // 修改播放器通知
                if (url.includes('api.bilibili.com/x/player/carousel')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) intercept.carousel(this) });
                }
                // 修改区域限制
                if (url.includes('season/user/status?')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) intercept.status(this) });
                    url = hook[1] = url.replace('bangumi.bilibili.com/view/web_api/season/user/status', 'api.bilibili.com/pgc/view/web/season/user/status');
                }
                // 监听视频链接
                if (url.includes("/playurl?")) {
                    obj.fourk = obj.sign ? "" : 1;
                    obj.fnval = obj.fnval ? 80 : "";
                    url = deliver.obj2search(url.split("?")[0], obj);
                    cid = obj.cid || cid;
                    aid = obj.avid || aid;
                    bvid = obj.bvid || deliver.abv(aid) || bvid;
                    pgc = url.includes("pgc") ? true : false;
                    if (limit) this.url = url;
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) intercept.playinfo(this, url) });
                }
                // 修改弹幕链接
                if (url.includes("list.so")) {
                    // 这时pakku.js已经修改了xhr对象，需要另做处理
                    if (this.pakku_url && config.reset.danmuku) {
                        segRequestOnlyOnce = true;
                        let pid = aid;
                        // 更改pakku.js请求的url，使它过滤分段弹幕
                        this.pakku_url = url = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + cid + "&pid=" + pid + "&segment_index=1";
                        this.responseType = "arraybuffer";
                        let xhr = this;
                        let cb = [];
                        for (let i in this.pakku_load_callback) {
                            cb[i] = this.pakku_load_callback[i];
                        }
                        for (let i in this.pakku_load_callback) {
                            // 将pakku.js返回的数据转换回xml
                            this.pakku_load_callback[i] = function () {
                                deliver.toXml(protoSeg.decode(new Uint8Array(xhr.response)).elems).then(function (xml) {
                                    xhr.response = xhr.responseText = xml;
                                    cb[i].call(xhr);
                                });
                                xml = this.response;
                                hash = [];
                                xml.match(/d p=".+?"/g).forEach((v) => { hash.push(v.split(",")[6]) });
                            }
                        }
                    }
                    // 在历史弹幕面板切换回当天的弹幕时，播放器不通过web worker加载弹幕，而是直接请求list.so
                    // 可以直接记录弹幕数据
                    this.addEventListener("load", function () {
                        xml = this.response;
                        hash = [];
                        xml.match(/d p=".+?"/g).forEach((v) => { hash.push(v.split(",")[6]) });
                    });
                }
                //历史弹幕下载
                if (url.includes("history?type=")) {
                    this.addEventListener("load", function () {
                        xml = this.response;
                        hash = [];
                        xml.match(/d p=".+?"/g).forEach((v) => { hash.push(v.split(",")[6]) });
                    });
                }
                return open.call(this, method, url, ...rest);
            }
            // 部分功能依赖hook `XMLHttpRequest.prototype.send`
            if (config.reset.xhrhook) {
                XMLHttpRequest.prototype.send = async function (...arg) {
                    // 新版弹幕兼容pakku.js
                    // pakku.js休眠中，钩子捕捉到首次对seg.so发起请求时触发
                    // (pakku.js正常运行时这个send()不会被调用)
                    if (config.reset.danmuku && (this.pakku_url && this.pakku_url.includes("seg.so") && segRequestOnlyOnce)) {
                        segRequestOnlyOnce = false;
                        // pakku.js会禁用Worker，这时需要模拟一个xhr响应
                        Object.defineProperty(this, "response", { writable: true });
                        Object.defineProperty(this, "responseText", { writable: true });
                        Object.defineProperty(this, "readyState", { writable: true });
                        Object.defineProperty(this, "status", { writable: true });
                        this.readyState = 4;
                        this.status = 200;
                        this.abort();
                        let callBack = this.callBack;
                        let xhr = this;
                        deliver.getSegDanmaku(function (protoSegments) {
                            let Segments = [];
                            protoSegments.forEach(function (seg) {
                                Segments = Segments.concat(protoSeg.decode(new Uint8Array(seg)).elems);
                            });
                            deliver.toXml(Segments).then(function (toXml) {
                                callBack.forEach(function (f) {
                                    xhr.response = xhr.responseText = toXml;
                                    f.call(xhr);
                                });
                                // 备份弹幕
                                xml = xhr.response;
                                hash = [];
                                xml.match(/d p=".+?"/g).forEach((v) => { hash.push(v.split(",")[6]) });
                            });
                        });
                    }
                    else if (this.url) {
                        try {
                            // 解除限制
                            Object.defineProperty(this, "response", { writable: true });
                            Object.defineProperty(this, "responseText", { writable: true });
                            Object.defineProperty(this, "readyState", { writable: true });
                            Object.defineProperty(this, "status", { writable: true });
                            this.readyState = 2;
                            this.status = 200;
                            this.abort();
                            let response, accesskey = "";
                            try {
                                if (limit) {
                                    // 区域限制 + APP限制的DASH似乎缺少码率信息，现默认启用flv以规避，platform用于伪装成APP
                                    if (uid && (ids.indexOf(1 * cid) >= 0) && config.reset.accesskey) accesskey = GM_getValue("access_key") || "";
                                    let obj = Object.assign(deliver.search2obj(this.url), __INITIAL_STATE__.rightsInfo.watch_platform ? { access_key: accesskey, balh_ajax: 1, fnval: "", fnver: "", module: "pgc", platform: "android_i" } : { access_key: accesskey, balh_ajax: 1, module: "pgc" })
                                    response = deliver.xhrJsonCheck(await xhr.true(deliver.obj2search(API.url.BPplayurl, obj)));
                                    response = { "code": 0, "message": "success", "result": response };
                                }
                            }
                            catch (e) { debug.msg("解除限制失败 ಥ_ಥ", ...e); response = { "code": -404, "message": e, "data": null }; }
                            this.response = this.responseText = JSON.stringify(response);
                            this.readyState = 4;
                            this.onreadystatechange();
                            if (response.code !== 0) throw response.message;
                            __playinfo__ = response;
                            debug.log("解除限制", "aid=", aid, "cid=", cid);
                        }
                        catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("解除限制", ...e) }
                    }
                    else {
                        send.call(this, ...arg);
                    }
                }
                XMLHttpRequest.prototype.addEventListener = function (name, callback) {
                    if (name == "load") {
                        this.callBack = this.callBack || [];
                        this.callBack.push(callback);
                    }
                    return addEventListener.call(this, name, callback);
                }
            }
            // jsonp hook
            function jsonp() {
                const ajax = unsafeWindow.$.ajax;
                unsafeWindow.$.ajax = function (...rest) {
                    rest.forEach((d, i, rest) => {
                        if (d && d.dataType && d.dataType == "jsonp") {
                            // 替换广告区rid为资讯区rid
                            if (rest[i].url.includes("region") && rest[i].data.rid == 165) rest[i].data.rid = 202;
                            // 替换原创排行为全部排行
                            if (rest[i].url.includes("region") && rest[i].data.original == 1) rest[i].data.original = 0;
                            // 修改置顶推荐
                            if (rest[i].url.includes('api.bilibili.com/x/web-interface/ranking/index')) rest[i].url = rest[i].url.replace('ranking/index', 'index/top');
                            // 跳过充电鸣谢
                            if (config.reset.electric && rest[i].url.includes('api.bilibili.com/x/web-interface/elec/show')) rest[i].data = { jsonp: "jsonp", aid: 1, mid: 1 }
                        }
                    })
                    return ajax.call(this, ...rest);
                }
            }
            // jsonp非原生调用，先判断jQuery是否载入，以免报错
            if (unsafeWindow.$ && unsafeWindow.$.ajax) jsonp();
            else {
                let timer = setInterval(() => {
                    // 为不错过任何jsonp，轮循间隔设得有点小
                    if (unsafeWindow.$) {
                        clearInterval(timer);
                        jsonp();
                    }
                }, 10);
                setTimeout(() => clearInterval(timer), 5000);
            }
        },
        // 修改首页直播推荐数据
        biliIndexRec: (obj, hook = []) => {
            try {
                hook.push(deliver.xhrJsonCheck(obj.responseText));
                let response = obj.responseText.replace(/preview_banner_list/, "preview").replace(/ranking_list/, "ranking").replace(/recommend_room_list/, "recommend");
                response = JSON.parse(response);
                response.data.text_link = { text: "233秒居然能做这些！", link: "//vc.bilibili.com" };
                if (response.data.recommend) {
                    for (let i = 0; i < response.data.recommend.length; i++) {
                        response.data.recommend[i].pic = response.data.recommend[i].cover;
                        response.data.recommend[i].link = "//live.bilibili.com" + response.data.recommend[i].link;
                    }
                }
                if (response.data.preview) for (let i = 0; i < response.data.preview.length; i++) response.data.preview[i].url = response.data.preview[i].link;
                hook.push(response);
                debug.debug("XHR重定向", "修复正在直播", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("首页推荐", ...e) }
        },
        // 修复番剧季度信息
        season: (obj, hook = []) => {
            try {
                hook.push(deliver.xhrJsonCheck(obj.responseText));
                let response = deliver.xhrJsonCheck(obj.responseText);
                if (response.result.section) for (let i = 0; i < response.result.section.length; i++) response.result.episodes.push(...response.result.section[i].episodes);
                for (let i = 0; i < response.result.episodes.length; i++) {
                    response.result.episodes[i].ep_id = response.result.episodes[i].id;
                    response.result.episodes[i].episode_status = response.result.episodes[i].status;
                    response.result.episodes[i].index = response.result.episodes[i].title;
                    response.result.episodes[i].index_title = response.result.episodes[i].long_title;
                }
                hook.push(response);
                debug.debug("XHR重定向", "番剧季度信息", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧季度信息", ...e) }
        },
        // 修复番剧追番信息
        stat: (obj, hook = []) => {
            try {
                hook.push(deliver.xhrJsonCheck(obj.responseText));
                let response = deliver.xhrJsonCheck(obj.responseText);
                response.result.favorites = response.result.follow;
                hook.push(response);
                debug.debug("XHR重定向", "番剧追番信息", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧季度信息", ...e) }
        },
        // 修改直播数据
        getRoomPlayInfo: (obj, hook = []) => {
            if (!config.reset.roomplay) return;
            try {
                hook.push(deliver.xhrJsonCheck(obj.responseText));
                let response = deliver.xhrJsonCheck(obj.responseText);
                if (response.data) {
                    response.data.live_status = 0;
                    response.data.live_time = -1;
                    response.data.playurl_info = null;
                }
                hook.push(response);
                debug.debug("XHR重定向", "拦截直播媒体", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("直播拦截", ...e) }
        },
        // 修改番剧推荐
        recommend: (obj, hook = []) => {
            try {
                hook.push(deliver.xhrJsonCheck(obj.responseText));
                let response = deliver.xhrJsonCheck(obj.responseText);
                if (response.result && response.result.season) response.result = response.result.season;
                hook.push(response);
                debug.debug("XHR重定向", "修改番剧推荐", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧推荐", ...e) }
        },
        // 生成播放信息
        carousel: (obj) => {
            if (!config.reset.carousel) return;
            try {
                let msg = deliver.randomArray(API.message, 2);
                let xmltext = '<msg><item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="2320" id="314825"><![CDATA[<a href="' + msg[0][0] + '" target="_blank"><font color="#FFFFFF">' + msg[0][1] + '</font></a>]]></item><item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="2321" id="314372"><![CDATA[<a href="' + msg[1][0] + '" target="_blank"><font color="#FFFFFF">' + msg[1][1] + '</font></a>]]></item></msg>';
                let parser = new DOMParser(),
                    responseXML = parser.parseFromString(xmltext, "text/xml");
                Object.defineProperty(obj, 'responseXML', { writable: true });
                obj.responseXML = responseXML;
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("播放通知", ...e) }
        },
        // 强制载入播放器
        status: (obj) => {
            try {
                let response = deliver.xhrJsonCheck(obj.responseText);
                if (response.result) {
                    if (config.reset.limit && response.result.area_limit) {
                        response.result.area_limit = 0;
                        response.ban_area_show = 1;
                        limit = true;
                    }
                    if (response.result.progress) response.result.watch_progress = response.result.progress;
                    if (response.result.vip_info) response.result.vipInfo = response.result.vip_info;
                    Object.defineProperty(obj, 'response', { writable: true });
                    Object.defineProperty(obj, 'responseText', { writable: true });
                    obj.response = obj.responseText = JSON.stringify(response);
                }
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("强制启用播放器", ...e) }
        },
        // 监听视频地址
        playinfo: (obj) => {
            try {
                if (!obj.response) throw obj;
                __playinfo__ = typeof obj.response == "object" ? obj.response : deliver.xhrJsonCheck(obj.response);
                // 移除下载面板
                if (document.getElementById("bili-old-download-table")) document.getElementById("bili-old-download-table").remove();
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("视频监听", ...e) }
        }
    }

    // MD5接口，修改自百度百科https://baike.baidu.com/item/MD5/212708
    const md5 = (str) => {
        let md5_RotateLeft = (lValue, iShiftBits) => (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        let md5_AddUnsigned = (lX, lY) => {
            let lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
            else return (lResult ^ lX8 ^ lY8);
        }
        let md5_F = (x, y, z) => (x & y) | ((~x) & z);
        let md5_G = (x, y, z) => (x & z) | (y & (~z));
        let md5_H = (x, y, z) => (x ^ y ^ z);
        let md5_I = (x, y, z) => (y ^ (x | (~z)));
        let md5_FF = (a, b, c, d, x, s, ac) => {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };
        let md5_GG = (a, b, c, d, x, s, ac) => {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };
        let md5_HH = (a, b, c, d, x, s, ac) => {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };
        let md5_II = (a, b, c, d, x, s, ac) => {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };
        let md5_ConvertToWordArray = (string) => {
            let lWordCount;
            let lMessageLength = string.length;
            let lNumberOfWords_temp1 = lMessageLength + 8;
            let lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            let lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            let lWordArray = Array(lNumberOfWords - 1);
            let lBytePosition = 0;
            let lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };
        let md5_WordToHex = (lValue) => {
            let WordToHexValue = "",
                WordToHexValue_temp = "",
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };
        let md5_Utf8Encode = (string) => {
            string = string.replace(/\r\n/g, "\n");
            let utftext = "";
            for (let n = 0; n < string.length; n++) {
                let c = string.charCodeAt(n);
                if (c < 128) utftext += String.fromCharCode(c);
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        let x = Array();
        let k, AA, BB, CC, DD, a, b, c, d;
        let S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        let S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        let S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        let S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        str = md5_Utf8Encode(str);
        x = md5_ConvertToWordArray(str);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = md5_AddUnsigned(a, AA);
            b = md5_AddUnsigned(b, BB);
            c = md5_AddUnsigned(c, CC);
            d = md5_AddUnsigned(d, DD);
        }
        return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
    }

    // crc哈希转mid算法，来源https://github.com/esterTion/BiliBili_crc2mid
    const BiliBili_midcrc = function () {
        const CRCPOLYNOMIAL = 0xEDB88320;
        let startTime = performance.now(),
            crctable = new Array(256),
            create_table = function () {
                let crcreg,
                    i,
                    j;
                for (i = 0; i < 256; ++i) {
                    crcreg = i;
                    for (j = 0; j < 8; ++j) {
                        if ((crcreg & 1) !== 0) {
                            crcreg = CRCPOLYNOMIAL ^ (crcreg >>> 1);
                        } else {
                            crcreg >>>= 1;
                        }
                    }
                    crctable[i] = crcreg;
                }
            },
            crc32 = function (input) {
                if (typeof (input) != 'string') input = input.toString();
                let crcstart = 0xFFFFFFFF,
                    len = input.length,
                    index;
                for (let i = 0; i < len; ++i) {
                    index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                    crcstart = (crcstart >>> 8) ^ crctable[index];
                }
                return crcstart;
            },
            crc32lastindex = function (input) {
                if (typeof (input) != 'string') input = input.toString();
                let crcstart = 0xFFFFFFFF,
                    len = input.length,
                    index;
                for (let i = 0; i < len; ++i) {
                    index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                    crcstart = (crcstart >>> 8) ^ crctable[index];
                }
                return index;
            },
            getcrcindex = function (t) {
                for (let i = 0; i < 256; i++) if (crctable[i] >>> 24 == t) return i;
                return -1;
            },
            deepCheck = function (i, index) {
                let tc = 0x00,
                    str = '',
                    hash = crc32(i);
                tc = hash & 0xff ^ index[2];
                if (!(tc <= 57 && tc >= 48)) return [0];
                str += tc - 48;
                hash = crctable[index[2]] ^ (hash >>> 8);
                tc = hash & 0xff ^ index[1];
                if (!(tc <= 57 && tc >= 48)) return [0];
                str += tc - 48;
                hash = crctable[index[1]] ^ (hash >>> 8);
                tc = hash & 0xff ^ index[0];
                if (!(tc <= 57 && tc >= 48)) return [0];
                str += tc - 48;
                hash = crctable[index[0]] ^ (hash >>> 8);
                return [1, str];
            };
        create_table();
        let index = new Array(4);
        return function (input) {
            let ht = parseInt('0x' + input) ^ 0xffffffff,
                snum,
                i,
                lastindex,
                deepCheckData;
            for (i = 3; i >= 0; i--) {
                index[3 - i] = getcrcindex(ht >>> (i * 8));
                snum = crctable[index[3 - i]];
                ht ^= snum >>> ((3 - i) * 8);
            }
            for (i = 0; i < 10000000; i++) {
                lastindex = crc32lastindex(i);
                if (lastindex == index[3]) {
                    deepCheckData = deepCheck(i, index);
                    if (deepCheckData[0]) break;
                }
            }
            if (i == 10000000) return -1;
            return i + '' + deepCheckData[1];
        };
    };

    // 函数统一接口
    const deliver = {
        // 格式化时间戳，默认返回hh：mm：ss；指定type加上yy：mm：dd
        timeFormat: (time, type) => {
            let date = new Date(time);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
            let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return type ? Y + M + D + h + m + s : h + m + s;
        },
        // 格式化字节，逢千换单位，最高到G字节
        sizeFormat: (size) => {
            let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1000 ** i;
            while (dex > 1) {
                if (size >= vor) {
                    size = (size / dex).toFixed(2);
                    break;
                }
                dex = dex / 1024;
                vor = vor / 1000;
                i--;
            }
            return size + unit[i];
        },
        // 格式化计数法
        unitFormat: (num) => {
            let unit = ["", "万", "亿"], i = unit.length - 1, dex = 10000 ** i;
            while (dex > 1) {
                if (num >= dex) {
                    num = (num / dex).toFixed(1);
                    break;
                }
                dex = dex / 10000;
                i--;
            }
            return num + unit[i];
        },
        // 数组冒泡排序，指定rev输出逆序
        bubbleSort: (arr, rev) => {
            let temp = [];
            rev = rev ? true : false;
            for (let i = 0; i < arr.length - 1; i++) {
                let bool = true;
                for (let j = 0; j < arr.length - 1 - i; j++) {
                    if (arr[j] > arr[j + 1]) {
                        temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                        bool = false;
                    }
                }
                if (bool) break;
            }
            if (rev) return arr.reverse();
            return arr;
        },
        // 数组随机提取，num指定随机提取几个
        randomArray: (arr, num) => {
            let out = [];
            num = num || 1;
            num = num < arr.length ? num : arr.length;
            while (out.length < num) {
                var temp = (Math.random() * arr.length) >> 0;
                out.push(arr.splice(temp, 1)[0]);
            }
            return out;
        },
        // bv/av互转，算法见https://www.zhihu.com/question/381784377/answer/1099438784
        abv: (str) => {
            let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            let tr = {}, s = [11, 10, 3, 8, 4, 6], xor = 177451812, add = 8728348608;
            for (let i = 0; i < 58; i++) tr[table[i]] = i;
            if (!(1 * str)) {
                // str为字符串(BVxxxxxxxxxx)则转化为aid(纯数字)
                let r = 0;
                for (let i = 0; i < 6; i++) r += tr[str[s[i]]] * 58 ** i;
                return (r - add) ^ xor;
            }
            else {
                // str为数字(aid)则转化为BV(BVxxxxxxxxxx)
                str = (str ^ xor) + add;
                let r = ['B', 'V', 1, '', '', 4, '', 1, '', 7, '', ''];
                for (let i = 0; i < 6; i++) r[s[i]] = table[parseInt(str / 58 ** i) % 58];
                return r.join("");
            }
        },
        // key secret，见https://github.com/Henryhaohao/Bilibili_video_download
        sign: () => {
            let table = 'rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg', str = '';
            for (let i = table.length - 1; i >= 0; i--) str = str + String.fromCharCode(table[i].charCodeAt() + 2);
            return str.split(':')
        },
        // 对象转url的查询部分
        obj2search: (url, obj) => {
            if (obj) {
                let arr = [], i = 0;
                for (let key in obj) {
                    if (obj[key] !== "" && obj[key] !== "undefined" && obj[key] !== null) {
                        arr[i] = key + "=" + obj[key];
                        i++;
                    }
                }
                if (url) url = url + "?" + arr.join("&");
                else url = arr.join("&");
            }
            if (url.charAt(url.length - 1) == "?") url = url.split("?")[0];
            return url;
        },
        // 提取url查询部分成对象
        search2obj: (url) => {
            url = url.split('#')[0];
            url = url.split('?')[1] ? url.split('?')[1].split('&') : "";
            if (!url) return;
            let obj = {};
            for (let i = 0; i < url.length; i++) obj[url[i].split('=')[0]] = url[i].split('=')[1];
            return obj;
        },
        // cookies对象，通过属性访问键值
        getCookies: () => {
            let cookies = document.cookie.split('; ');
            let obj = cookies.reduce((pre, next) => {
                let key = next.split('=')[0];
                let val = next.split('=')[1];
                pre[key] = val;
                return pre;
            }, {});
            return obj;
        },
        // 转换解码后的protobuf到xml
        toXml: (danmaku) => {
            return new Promise(function (resolve) {
                danmaku.sort(function (a, b) {
                    return a.progress - b.progress;
                });
                let attr = [], xml = '<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.com</chatserver><chatid>' + cid + '</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source>'
                attr[5] = 0;
                for (let i = 0; i < danmaku.length; i++) {
                    attr[0] = danmaku[i].progress / 1000;
                    attr[1] = danmaku[i].mode;
                    attr[2] = danmaku[i].fontsize;
                    attr[3] = danmaku[i].color;
                    attr[4] = danmaku[i].ctime;
                    attr[6] = danmaku[i].midHash;
                    attr[7] = danmaku[i].idStr;
                    xml += '<d p="' + attr.join(",") + '">' + danmaku[i].content + '</d>'
                }
                xml += "</i>";
                resolve(xml);
            });
        },
        getSegDanmaku: function (onload) {
            let protoSegments = [];
            getSegConfig().then(getAllSeg);
            function getSegConfig() {
                return new Promise(function (resolve) {
                    let xhr = new XMLHttpRequest();
                    xhr.addEventListener("load", function () {
                        let res = protoView.decode(new Uint8Array(xhr.response));
                        resolve(res);
                    });
                    xhr.open("get", "https://api.bilibili.com/x/v2/dm/web/view?type=1&oid=" + cid + "&pid=" + aid);
                    xhr.responseType = "arraybuffer";
                    xhr.send();
                });
            }
            // 获得所有分段
            function getAllSeg(config) {
                let total = config.dmSge.total;
                let allrequset = [];
                let reqUrl = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + cid + "&pid=" + aid;
                function pushReq(url, index) {
                    allrequset.push(new Promise(function (resolve) {
                        let xhr = new XMLHttpRequest();
                        xhr.addEventListener("load", function () {
                            // api的segment_index从1开始
                            // 这个数组中从0开始存储分段数据
                            protoSegments[index - 1] = xhr.response;
                            resolve();
                        });
                        xhr.open("get", url);
                        xhr.responseType = "arraybuffer";
                        xhr.send();
                    }));
                }
                for (let index = 1; index <= total; index++) {
                    pushReq(reqUrl + "&segment_index=" + index, index);
                }
                // BAS弹幕
                if (config.specialDms.length > 0) {
                    for (let index = 1; index <= config.specialDms.length; index++) {
                        // 下发的是http链接，但会被chrome的安全措施拦掉，于是替换成https
                        pushReq(config.specialDms[index - 1].replace("http", "https"), total + index);
                    }
                }
                // 完成所有的网络请求大概要300ms
                return Promise.all(allrequset).then(function () { onload(protoSegments); });
            }
        },
        // 添加全局样式
        setGlobalStyle: async () => {
            let csss = API.style.uiface;
            let style = document.createElement("style");
            csss = csss + API.style.online;
            csss = csss + API.style.search;
            csss = csss + API.style.download;
            if (config.reset.playershadow) csss = csss + API.style.playshadow;
            if (config.reset.like) csss = csss + API.style.like;
            style.setAttribute("type", "text/css");
            style.appendChild(document.createTextNode(csss));
            setTimeout(() => { if (document.head) document.head.appendChild(style) });
        },
        // 播放器调试通知
        debug: (...msg) => {
            let node = document.getElementsByClassName("bilibili-player-video-toast-bottom")[0];
            let time = 1 * msg[2] || 3000;
            if (!node) {
                debug.log(...msg);
                return;
            }
            msg.forEach((d) => { d = typeof d == "object" ? "" : d });
            msg[2] = 1 * msg[2] ? "" : msg[2];
            let item = document.createElement("div");
            node.children[0] ? node.children[0].replaceWith(item) : node.appendChild(item);
            item.setAttribute("class", "bilibili-player-video-toast-item bilibili-player-video-toast-pay");
            item.innerHTML = '<div class="bilibili-player-video-toast-item-text"><span class="video-float-hint-text"></span><span class="video-float-hint-btn hint-red"></span><span class="video-float-hint-btn"></span></div>';
            msg[0] ? item.children[0].children[0].innerHTML = msg[0] : "";
            msg[1] ? item.children[0].children[1].innerHTML = msg[1] : "";
            msg[2] ? item.children[0].children[2].innerHTML = msg[2] : item.children[0].children[2].remove();
            setTimeout(() => item.remove(), time);
        },
        // xhr返回json校验
        xhrJsonCheck: (data, toast) => {
            data = JSON.parse(data);
            if ("code" in data && data.code !== 0) {
                let msg = data.msg || data.message || "";
                if (toast) debug.msg("xhr错误：", data.code + " " + msg);
                throw [data.code, msg, data]
            }
            return data;
        },
        // 全局变量监听
        getVariable: (value) => {
            function read(arr) {
                switch (arr[0]) {
                    case "aid": aid = arr[1];
                        break;
                    case "cid": cid = arr[1];
                        break;
                    case "__playinfo__": __playinfo__ = __playinfo__ || arr[1];
                        break;
                }
            }
            Object.defineProperty(unsafeWindow, "aid", { set: (value) => { read(["aid", value]) }, get: () => { return aid }, configurable: true });
            Object.defineProperty(unsafeWindow, "cid", { set: (value) => { read(["cid", value]) }, get: () => { return cid }, configurable: true });
            Object.defineProperty(unsafeWindow, "__playinfo__", { set: (value) => { read(["__playinfo__", value]) }, get: () => { return __playinfo__ }, configurable: true });
            Object.defineProperty(unsafeWindow, "__BILI_CONFIG__", { get: () => { return { "show_bv": false } }, configurable: true });
            if (LOCATION[2] == "live.bilibili.com" && config.reset.roomplay) Object.defineProperty(unsafeWindow, "__NEPTUNE_IS_MY_WAIFU__", { get: () => { return undefined }, configurable: true });
        },
        // 重写网页
        write: (html) => {
            document.open();
            document.write(html);
            document.close();
        },
        // 重写版面
        reSction: async () => {
            if (!config.reset.grobalboard) return;
            if (!unsafeWindow.$) {
                let jq = document.createElement("script");
                jq.setAttribute("type", "text/javascript");
                jq.setAttribute("src", "//static.hdslb.com/js/jquery.min.js");
                document.body.insertBefore(jq, document.body.firstChild);
            }
            document.getElementById("internationalHeader").setAttribute("style", "visibility:hidden;");
            let newh = document.createElement("div");
            let script = document.createElement("script");
            let foot = document.getElementsByClassName("international-footer");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", "//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
            if (document.getElementsByClassName("mini-type")[0]) {
                if (location.href.includes("blackboard/topic_list") || location.href.includes("blackboard/x/act_list")) newh.setAttribute("class", "z-top-container has-menu");
                else newh.setAttribute("class", "z-top-container");
            }
            else newh.setAttribute("class", "z-top-container has-menu");
            document.body.insertBefore(newh, document.body.firstChild);
            document.body.insertBefore(script, document.body.firstChild);
            if (foot[0]) {
                let div = document.createElement("div");
                div.setAttribute("class", "footer bili-footer report-wrap-module");
                div.setAttribute("id", "home_footer");
                foot[0].replaceWith(div);
                let script = document.createElement("script");
                script.setAttribute("type", "text/javascript");
                script.setAttribute("src", "//static.hdslb.com/common/js/footer.js");
                document.body.appendChild(script);
            }
            window.setTimeout(() => { deliver.resetNodes() }, 3000);
        },
        // 下载视频
        download: {
            // 创建播放器右键菜单
            init: async (node) => {
                if (!config.reset.download) return;
                let li = document.createElement("li");
                let div = document.createElement("a");
                li.setAttribute("class", "context-line context-menu-function bili-old-download");
                div.setAttribute("class", "context-menu-a js-action");
                div.setAttribute("href", "javascript:void(0);");
                div.innerText = "下载视频";
                li.appendChild(div);
                node.firstChild.appendChild(li);
                div.onclick = deliver.download.setTable;
            },
            // 配置下载数据
            setTable: async () => {
                debug.msg("正在获取视频链接", ">>>");
                let qua = { 125: "HDR", 120: "4K", 116: "1080P60", 112: "1080P+", 80: "1080P", 74: "720P60", 64: "720P", 48: "720P", 32: "480P", 16: "360P", 15: "360P" };
                let bps = { 30216: "64kbps", 30232: "128kbps", 30280: "320kbps" }
                if (!mdf) {
                    let path = __playinfo__ ? (__playinfo__.data || (__playinfo__.durl && __playinfo__) || __playinfo__.result) : "";
                    mdf = {};
                    mdf.quee = mdf.quee || ((path && path.durl) ? [await deliver.download.geturl()] : await Promise.all([deliver.download.geturl(), deliver.download.geturl("flv")]));
                    deliver.download.quee(mdf.quee, qua, bps);
                    deliver.download.durl(path, qua);
                    deliver.download.dash(path, qua, bps);
                }
                deliver.download.other();
                deliver.download.item();
            },
            // 创建下载面板
            item: () => {
                let timer, top = document.getElementById("bili-old-download-table");
                if (top) {
                    // 刷新下载面板
                    top.remove();
                    // 释放bolb残留
                    if (bloburl.xml) {
                        window.URL.revokeObjectURL(bloburl.xml);
                        bloburl.xml = "";
                    }
                }
                if (!mdf.mp4 && !mdf.flv && !mdf.dash) throw (debug.msg("未找到任何视频链接 ಥ_ಥ"), mdf);
                top = document.createElement("div");
                top.setAttribute("id", "bili-old-download-table");
                if (mdf.mp4) deliver.download.addBox(top, mdf.mp4, "mp4", "download-mp4");
                if (mdf.dash) {
                    if (mdf.dash.avc) deliver.download.addBox(top, mdf.dash.avc, "avc", "download-avc");
                    if (mdf.dash.hev) deliver.download.addBox(top, mdf.dash.hev, "hev", "download-hev");
                    if (mdf.dash.aac) deliver.download.addBox(top, mdf.dash.aac, "aac", "download-aac");
                }
                if (mdf.flv) deliver.download.addBox(top, mdf.flv, "flv", "download-flv");
                if (mdf.xml) deliver.download.addBox(top, mdf.xml, "其他", "download-xml", "360P");
                document.body.appendChild(top);
                debug.msg("右键另存为或右键IDM下载", "详见脚本简介", 3000);
                top.onmouseover = () => window.clearTimeout(timer);
                top.onmouseout = () => {
                    timer = window.setTimeout(() => {
                        top.remove();
                        if (bloburl.xml) {
                            window.URL.revokeObjectURL(bloburl.xml);
                            bloburl.xml = "";
                        }
                    }, 1000)
                };
            },
            quee: (path, qua, bps) => {
                if (path[0] && path[0].durl) {
                    mdf.mp4 = mdf.mp4 || [];
                    mdf.mp4.push(["1080P", path[0].durl[0].url.replace("http:", ""), deliver.sizeFormat(path[0].durl[0].size)]);
                    navigator.clipboard.writeText(path[0].durl[0].url);
                }
                if (path[1]) {
                    path = path[1].data || (path[1].durl && path[1]) || path[1].result || {};
                    mdf.flvq = path.quality || (path.data ? path.data.quality : (path.result ? path.result.quality : ""));
                    deliver.download.durl(path, qua);
                    deliver.download.dash(path, qua, bps);
                }
            },
            dash: (path, qua, bps) => {
                if (!path.dash) return;
                mdf.dash = mdf.dash || {};
                if (path.dash.video) {
                    for (let i = 0; i < path.dash.video.length; i++) {
                        if (path.dash.video[i].codecs.startsWith("avc")) {
                            mdf.dash.avc = mdf.dash.avc || [];
                            mdf.dash.avc.push([qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), deliver.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8)]);
                        } else {
                            mdf.dash.hev = mdf.dash.hev || [];
                            mdf.dash.hev.push([qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), deliver.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8)]);
                        }
                    }
                }
                if (path.dash.audio) {
                    for (let i = 0; i < path.dash.audio.length; i++) {
                        mdf.dash.aac = mdf.dash.aac || [];
                        mdf.dash.aac.push([path.dash.audio[i].id, path.dash.audio[i].baseUrl.replace("http:", ""), deliver.sizeFormat(path.dash.audio[i].bandwidth * path.dash.duration / 8)]);
                    }
                    mdf.dash.aac = deliver.bubbleSort(mdf.dash.aac, true);
                    for (let i = 0; i < mdf.dash.aac.length; i++) if (mdf.dash.aac[i][0] in bps) mdf.dash.aac[i][0] = bps[mdf.dash.aac[i][0]];
                }
            },
            durl: (path, qua) => {
                if (!path.durl) return;
                if (path.durl[0] && path.durl[0].url.includes("mp4?")) {
                    mdf.mp4 = mdf.mp4 || [];
                    mdf.mp4.push([qua[path.quality], path.durl[0].url.replace("http:", ""), deliver.sizeFormat(path.durl[0].size)]);
                } else {
                    mdf.flv = [];
                    for (let i = 0; i < path.durl.length; i++) mdf.flv.push([qua[mdf.flvq || path.quality], path.durl[i].url.replace("http:", ""), deliver.sizeFormat(path.durl[i].size)]);
                }
            },
            other: () => {
                if (!config.reset.dlother) return;
                if (xml) {
                    let blob = new Blob([xml]);
                    mdf.xml = [];
                    bloburl.xml = URL.createObjectURL(blob);
                    mdf.xml.push(["弹幕", bloburl.xml, deliver.sizeFormat(blob.size)]);
                } else {
                    mdf.xml = [];
                    mdf.xml.push(["弹幕", "//api.bilibili.com/x/v1/dm/list.so?oid=" + cid, "--------"]);
                }
                if (__INITIAL_STATE__) {
                    mdf.xml = mdf.xml || [];
                    mdf.xml.push(["封面", (__INITIAL_STATE__.videoData && __INITIAL_STATE__.videoData.pic || __INITIAL_STATE__.mediaInfo.cover).replace("http:", ""), "--------"]);
                    if (__INITIAL_STATE__.mediaInfo && __INITIAL_STATE__.mediaInfo.bkg_cover) mdf.xml.push(["海报", __INITIAL_STATE__.mediaInfo.bkg_cover.replace("http:", ""), "--------"]);
                    if (__INITIAL_STATE__.mediaInfo && __INITIAL_STATE__.mediaInfo.specialCover) mdf.xml.push(["海报", __INITIAL_STATE__.mediaInfo.specialCover.replace("http:", ""), "--------"]);
                    if (__INITIAL_STATE__.videoData && __INITIAL_STATE__.videoData.subtitle && __INITIAL_STATE__.videoData.subtitle.list) for (let i = 0; i < __INITIAL_STATE__.videoData.subtitle.list.length; i++) mdf.xml.push([__INITIAL_STATE__.videoData.subtitle.list[i].lan_doc, __INITIAL_STATE__.videoData.subtitle.list[i].subtitle_url.replace("http:", ""), "--------"]);
                }
            },
            // 拉取视频链接
            geturl: async (...arg) => {
                let url = deliver.download.playurl(...arg);
                try {
                    if (!url) throw url;
                    let data = await xhr.GM(url);
                    return deliver.xhrJsonCheck(data);
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("下载拉取", ...e); }
            },
            // 配置视频链接
            playurl: (type, qn) => {
                let obj = {}, sign = deliver.sign();
                aid = aid || unsafeWindow.aid;
                cid = cid || unsafeWindow.cid;
                qn = qn || 120;
                type = type || "mp4";
                if (!cid) return;
                switch (type) {
                    case 'dash': if (pgc) return deliver.obj2search(API.url.pgc, { avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 16 });
                    else return deliver.obj2search(API.url.x, { avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 16 });
                        break;
                    case 'flv': if (pgc) return deliver.obj2search(API.url.pgc, { avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json' });
                    else return deliver.obj2search(API.url.x, { avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json' });
                        break;
                    case 'off': obj = { appkey: sign[0], cid: cid, otype: 'json', qn: qn, quality: qn, type: '' }
                        obj.sign = md5(deliver.obj2search("", obj) + sign[1]);
                        return deliver.obj2search(API.url.sign, obj);
                        break;
                    case 'mp4': obj = { appkey: sign[0], cid: cid, otype: 'json', platform: 'android_i', qn: 208 }
                        obj.sign = md5(deliver.obj2search("", obj) + sign[1]);
                        if (pgc) return deliver.obj2search(API.url.pgcproj, obj);
                        return deliver.obj2search(API.url.proj, obj);
                        break;
                }
            },
            addBox: (top, item, name, type, quatily) => {
                let obj = JSON.parse(JSON.stringify(item));
                let box = document.createElement("div");
                box.setAttribute("class", "download-box");
                let tab = document.createElement("div");
                tab.setAttribute("class", "download-type " + type);
                tab.innerHTML = name;
                box.appendChild(tab);
                top.appendChild(box);
                switch (name) {
                    case "mp4": name = ".mp4"; break;
                    case "avc": name = ".m4v"; break;
                    case "hev": name = ".m4v"; break;
                    case "aac": name = ".m4a"; break;
                    case "其他": name = ".xml"; break;
                }
                let qua = quatily;
                for (let i = 0; i < obj.length; i++) {
                    switch (qua || obj[i][0]) {
                        case "HDR": quatily = "quality-tops"; break;
                        case "4K": quatily = "quality-top"; break;
                        case "1080P60": quatily = "quality-highs"; break;
                        case "720P60": quatily = "quality-high"; break;
                        case "1080P+": quatily = "quality-1080ps"; break;
                        case "1080P": quatily = "quality-1080p"; break;
                        case "720P": quatily = "quality-720p"; break;
                        case "480P": quatily = "quality-480p"; break;
                        case "360P": quatily = "quality-360p"; break;
                        case "320kbps": quatily = "quality-720p"; break;
                        case "128kbps": quatily = "quality-480p"; break;
                        case "64kbps": quatily = "quality-360p"; break;
                        default: quatily = "quality-high";
                    }
                    let a = document.createElement("a");
                    let q = document.createElement("div");
                    let s = document.createElement("div");
                    q.innerHTML = obj[i][0];
                    obj[i][0] = "弹幕" || "封面" ? "av" + aid : obj[i][0];
                    name = obj[i][2] == "--------" ? "" : name;
                    a.setAttribute("download", obj[i][0] + name);
                    a.setAttribute("href", obj[i][1]);
                    a.setAttribute("target", "_blank");
                    q.setAttribute("class", "download-quality " + quatily);
                    s.setAttribute("class", "download-size");
                    s.innerHTML = obj[i][2];
                    a.appendChild(q);
                    a.appendChild(s);
                    box.appendChild(a);
                }
            }
        },
        // 切p相关
        switchVideo: async () => {
            let title = document.getElementsByTagName("h1")[0] ? document.getElementsByTagName("h1")[0].title : "";
            if (config.reset.download) { xml = ""; url = ""; mdf = ""; hash = []; };
            if (config.reset.selectdanmu && document.getElementsByClassName("bilibili-player-filter-btn")[1]) document.getElementsByClassName("bilibili-player-filter-btn")[1].click();
            if (config.reset.midcrc && !config.reset.danmuku && !hash[0]) xhr.true(deliver.obj2search(API.url.listso, { oid: cid }));
            setTimeout(() => {
                if (config.reset.viewbofqi && document.querySelector("#bofqi")) document.querySelector("#bofqi").scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (config.reset.widescreen && document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-widescreen.icon-24wideoff")) {
                    document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").click();
                }
                if (config.reset.danmakuoff && !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off")) {
                    if (document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku")) {
                        document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku").click();
                    }
                }
            });
        },
        // 付费预览
        removePreview: async (node) => {
            try {
                if (!config.reset.preview) return;
                let hint = document.getElementsByClassName("video-float-hint-text")[0];
                // 倒计时长度，单位：秒
                let i = 10;
                let sec = document.createElement("span");
                sec.setAttribute("class", "video-float-hint-btn second-cut");
                hint.parentNode.appendChild(sec);
                function cut() {
                    sec.innerText = i - 1 + "s";
                    if (i == 0) {
                        node.remove();
                        return;
                    }
                    i = i - 1;
                    window.setTimeout(cut, 1000);
                }
                new cut();
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("付费预览", ...e) }
        },
        // 超链接转化
        avdesc: async () => {
            let desc = document.getElementsByClassName("info");
            if (desc[1] && desc[1].parentNode && desc[1].parentNode.id == "v_desc") {
                if (desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i)) {
                    let paster = desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i);
                    for (let i = 0; i < paster.length; i++) {
                        let newer = "av" + abv(paster[i]);
                        newer = '<a target="_blank" href="//www.bilibili.com/video/' + newer + '">' + newer + '</a>';
                        desc[1].innerHTML = desc[1].outerHTML.replace(paster[i], newer);
                    }
                }
            }
        },
        // 节点监听
        resetNodes: async (ext) => {
            let remove = (node, type, hidden, index) => {
                index ? index : index = 0;
                switch (type) {
                    case "id": node = document.getElementById(node); break;
                    case "class": node = document.getElementsByClassName(node)[index] ? document.getElementsByClassName(node)[index] : ""; break;
                    case "tag": node = document.getElementsByTagName(node)[index] ? document.getElementsByTagName(node)[index] : ""; break;
                }
                if (!node || node.getAttribute("hidden")) return;
                // 一般能移除的就移除，否则隐藏
                debug.debug("移除节点", node);
                hidden ? node.setAttribute("hidden", "hidden") : node.remove();
            }
            // 隐藏联系客服
            remove("contact-help", "class", true);
            // 移除新版提示
            remove("new-entry", "class");
            if (window.recbtn) remove("ver", "class");
            remove("trynew-btn", "class");
            if (config.reset.panel) remove("bilibili-player-ending-panel", "class");
            // 移除app下载浮动框
            remove("fixed_app_download", "id");
            remove("app-download", "class");
            // 移除直播水印
            remove("bilibili-live-player-video-logo", "class");
            // 移除失效顶栏
            remove("bili-header-m report-wrap-module", "class", false, 1);
            // 移除主页昨日榜
            if (window.recbtn) remove("rec-btn prev", "class");
            // 移除主页七日榜
            if (window.recbtn) remove("rec-btn next", "class");
            // 移除双重视频下载右键菜单
            if (document.getElementsByClassName("bili-old-download")[1]) document.getElementsByClassName("bili-old-download")[0].remove();
            // 使顶栏透明
            if (config.reset.headblur) {
                let blur = document.getElementsByClassName("blur-bg");
                if (blur[0]) blur[0].removeAttribute("style");
            }
        },
        // 失效分区
        fixSort: {
            // av
            video: async () => {
                let timer = window.setInterval(() => {
                    let tminfo = document.getElementsByClassName("tm-info");
                    if (tminfo[0]) {
                        window.clearInterval(timer);
                        if (!(tid in API.sort)) return;
                        let nodes = tminfo[0].childNodes;
                        // 创建分区信息节点并写入tid对应的分区数据
                        nodes[1].replaceWith(nodes[0].cloneNode(true));
                        nodes[2].replaceWith(nodes[0].cloneNode(true));
                        nodes[2].childNodes[1].remove();
                        nodes[1].childNodes[0].href = API.sort[API.sort[tid][0]][2];
                        nodes[1].childNodes[0].innerText = API.sort[API.sort[tid][0]][1];
                        nodes[2].childNodes[0].href = API.sort[tid][2];
                        nodes[2].childNodes[0].innerText = API.sort[tid][1];
                    }
                }, 1000);
            },
            // 稍后再看
            watchlater: async (data) => {
                let timer = window.setInterval(async () => {
                    let tminfo = document.getElementsByClassName("tm-info");
                    // 判断是否是少后再看页面
                    if (tminfo[0] && aid) {
                        window.clearInterval(timer);
                        let child = tminfo[0].childNodes;
                        if (child[2].nodeType === 8) {
                            try {
                                // 通过链接获取tid
                                data = await xhr.true(deliver.obj2search(API.url.view, { "aid": aid }));
                                tid = deliver.xhrJsonCheck(data).data.tid;
                                if (!(tid in API.sort)) return;
                                // 创建分区信息节点并写入tid对应的分区数据
                                child[2].replaceWith(child[0].cloneNode(true));
                                child[4].replaceWith(child[0].cloneNode(true));
                                child[4].childNodes[1].remove();
                                child[2].childNodes[0].href = API.sort[API.sort[tid][0]][2];
                                child[2].childNodes[0].innerText = API.sort[API.sort[tid][0]][1];
                                child[4].childNodes[0].href = API.sort[tid][2];
                                child[4].childNodes[0].innerText = API.sort[tid][1];
                            }
                            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("分区·稍后再看", ...e) }
                        }
                    }
                }, 1000);
            },
        },
        // 点赞功能
        setLike: async (data) => {
            if (!config.reset.like) return;
            let timer = window.setInterval(async () => {
                let coin = document.getElementsByClassName("bilibili-player-video-subtitle")[0];
                let number = document.getElementsByClassName("number")[0];
                let node = document.getElementsByClassName("coin")[0];
                // 判断页面渲染进度
                if (coin && node) {
                    window.clearInterval(timer);
                    let span = document.createElement("span");
                    let move = document.createElement("i");
                    let moved = document.createElement("b");
                    let text = document.createTextNode("点赞 --");
                    let arg = text;
                    // 创建点赞数据相关节点并初始化
                    span.setAttribute("class", "u like");
                    span.setAttribute("style", "margin-right : 5px;");
                    span.appendChild(move);
                    span.appendChild(moved);
                    span.appendChild(text);
                    move.setAttribute("class", "l-icon-move");
                    move.setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;");
                    moved.setAttribute("class", "l-icon-moved");
                    moved.setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;display : none;");
                    try {
                        move.onclick = async () => {
                            // 没有点赞过绑定点赞点击事件
                            if (!uid) {
                                // 没有登录绑定快捷登录
                                document.getElementsByClassName("c-icon-move")[0].click();
                                return;
                            }
                            // 构造并请求点赞表单
                            let msg = "aid=" + aid + "&like=1&csrf=" + deliver.getCookies().bili_jct;
                            data = await xhr.post(API.url.like, "application/x-www-form-urlencoded", msg);
                            data = deliver.xhrJsonCheck(data).ttl;
                            // 点亮点赞图标并修改显示数据
                            debug.msg("点赞成功！");
                            document.getElementsByClassName("l-icon-move")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;display : none;");
                            document.getElementsByClassName("l-icon-moved")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;");
                            if (arg.nodeValue.match("万")) return;
                            let number = 1 * arg.nodeValue.match(/[0-9]+/) + 1;
                            text = document.createTextNode(" 点赞 " + number)
                            arg.replaceWith(text);
                            arg = text;
                        }
                        moved.onclick = async () => {
                            // 点赞过绑定取消点赞点击事件
                            // 构造并请求取消点赞表单
                            let msg = "aid=" + aid + "&like=2&csrf=" + deliver.getCookies().bili_jct;
                            data = await xhr.post(API.url.like, "application/x-www-form-urlencoded", msg);
                            data = deliver.xhrJsonCheck(data).ttl;
                            // 熄灭点赞图标并修改显示数据
                            debug.msg("点赞撤回！");
                            document.getElementsByClassName("l-icon-move")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;");
                            document.getElementsByClassName("l-icon-moved")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;display : none;");
                            if (arg.nodeValue.match("万")) return;
                            let number = 1 * arg.nodeValue.match(/[0-9]+/) - 1;
                            text = document.createTextNode(" 点赞 " + number)
                            arg.replaceWith(text);
                            arg = text;
                        }
                        number.insertBefore(span, node);
                        // 获取点赞数据
                        data = await xhr.true(deliver.obj2search(API.url.view, { "aid": aid }));
                        data = deliver.xhrJsonCheck(data).data.stat.like;
                        document.getElementsByClassName("like")[0].setAttribute("title", "点赞人数" + data);
                        text = document.createTextNode(" 点赞 " + deliver.unitFormat(data));
                        arg.replaceWith(text);
                        arg = text;
                        if (!uid) return;
                        data = deliver.xhrJsonCheck(await xhr.true(deliver.obj2search(API.url.haslike, { "aid": aid }))).data;
                        if (data == 1) {
                            // 点赞过点亮图标
                            move.setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;display : none;");
                            moved.setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;");
                        }
                    }
                    catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("点赞功能", ...e) }
                }
            }, 100);
        },
        // 收藏播放，收藏列表视频过多将导致视频加载及切换缓慢
        setMediaList: {
            init: async (data) => {
                if (!ml) return;
                if (data) {
                    // 以传参data决定处理类型
                    try {
                        // 获取首个视频av并跳转
                        data = await xhr.true(deliver.obj2search(API.url.medialist, { "media_id": ml, "pn": 1, "ps": 1 }));
                        data = deliver.xhrJsonCheck(data).data;
                        location.replace("https://www.bilibili.com/video/av" + data.medias[0].id);
                    }
                    catch (e) {
                        // 跳转失败，清理残余
                        GM_setValue("medialist", 0);
                        debug.error(e);
                    }
                }
                else {
                    try {
                        let avs = [], value = [], promises = [];
                        // 获取收藏列表，这里获取只能获取到aid
                        data = await xhr.true(deliver.obj2search(API.url.ids4Player, { "media_id": ml }));
                        data = deliver.xhrJsonCheck(data).data;
                        for (let i = 0; i < data.medias.length; i++) {
                            ids[i] = data.medias[i].id;
                            avs[i] = "av" + data.medias[i].id;
                        }
                        // 同时获取所有aid对应的数据，使用Promise.all对齐，该api会直接忽略失效视频
                        while (avs.length) {
                            let i = avs.length > 20 ? 20 : avs.length;
                            value = avs.splice(0, i);
                            promises.push(xhr.true(deliver.obj2search(API.url.cards, { "ids": value.join("%2C") })));
                        }
                        value = [];
                        data = await Promise.all(promises);
                        // 格式化数据并排序
                        for (let i = 0; i < data.length; i++) {
                            data[i] = deliver.xhrJsonCheck(data[i]);
                            for (let key in data[i].data) avs.push(data[i].data[key]);
                        }
                        for (let i = 0; i < ids.length; i++) {
                            for (let j = 0; j < avs.length; j++) {
                                if (avs[j].aid == ids[i]) {
                                    value.push(avs[j]);
                                    break;
                                }
                            }

                        }
                        ids = value;
                        let timer = window.setInterval(() => {
                            if (unsafeWindow.BilibiliPlayer) {
                                clearInterval(timer);
                                // 将视频列表重构为稍后再看列表
                                for (let i = 0; i < ids.length; i++) {
                                    ids[i].progress = 0;
                                    ids[i].add_at = ids[i].ctime;
                                    ids[i].pages = [];
                                    ids[i].pages[0] = {};
                                    ids[i].pages[0].cid = ids[i].cid;
                                    ids[i].pages[0].dimension = ids[i].dimension;
                                    ids[i].pages[0].duration = ids[i].duration;
                                    ids[i].pages[0].from = "vupload";
                                    ids[i].pages[0].page = 1;
                                    ids[i].pages[0].part = ids[i].title;
                                    ids[i].pages[0].vid = "";
                                    ids[i].pages[0].weblink = "";
                                }
                                let toview = { "code": 0, "message": "0", "ttl": 1, "data": { "count": ids.length, "list": ids } };
                                // 保存初始aid，以便判断是否切p
                                oid = ids[0].aid;
                                debug.debug("收藏列表", toview);
                                // 构造初始化参数并重新初始化播放器
                                obj = { "aid": ids[0].aid, "cid": ids[0].cid, "watchlater": encodeURIComponent(JSON.stringify(toview)) }; // 重构初始化播放器参数
                                unsafeWindow.BilibiliPlayer(obj);
                                let bpui = document.getElementsByClassName("bpui-button-text");
                                let t = setInterval(() => {
                                    // 更新列表名称
                                    if (bpui[1]) {
                                        clearInterval(t);
                                        bpui[1].firstChild.innerText = "收藏列表";
                                    }
                                }, 100);
                            }
                        }, 100);
                    }
                    catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("收藏模拟", ...e) }
                }
            },
            // aid变化监听
            fixvar: async () => {
                if (!aid) aid = unsafeWindow.aid ? unsafeWindow.aid : aid;
                if (oid) {
                    if (oid != unsafeWindow.aid) {
                        // 收藏播放切p判断
                        aid = unsafeWindow.aid ? unsafeWindow.aid : aid;
                        oid = unsafeWindow.aid;
                        deliver.setMediaList.restore();
                    }
                }
            },
            // 收藏播放更新
            restore: async () => {
                let data;
                history.replaceState(null, null, "https://www.bilibili.com/video/av" + aid + location.search + location.hash);
                for (let i = 0; i < ids.length; i++) if (ids[i].aid == aid) data = ids[i];
                let video_info = document.getElementById("viewbox_report").childNodes;
                let up_info = document.getElementById("v_upinfo").childNodes;
                let tag = document.getElementById("v_tag").childNodes;
                let desc = document.getElementById("v_desc").childNodes;
                let arc_toolbar_report = document.getElementById("arc_toolbar_report").childNodes;
                let title = video_info[0];
                let info = video_info[1];
                let number = video_info[2];
                document.title = data.title;
                title.title = data.title;
                title.childNodes[1].innerText = data.title;
                info.childNodes[3].innerText = deliver.timeFormat(data.pubdate * 1000);
                number.childNodes[0].title = "总播放数" + data.stat.view;
                number.childNodes[0].innerText = deliver.unitFormat(data.stat.view);
                number.childNodes[1].title = "总弹幕数" + data.stat.danmaku;
                number.childNodes[1].innerText = deliver.unitFormat(data.stat.danmaku);
                if (data.stat.his_rank > 0) number.childNodes[2].innerText = "最高全站日排行" + data.stat.his_rank + "名";
                else try { number.childNodes[2].setAttribute("hidden", "hidden"); } catch (e) { }
                if (number.childNodes[4].className == "u like") {
                    number.childNodes[4].title = "点赞人数" + data.stat.like;
                    number.childNodes[4].childNodes[2].replaceWith(document.createTextNode("点赞 " + deliver.unitFormat(data.stat.like)));
                    number.childNodes[5].title = "投硬币枚数" + data.stat.coin;
                    number.childNodes[5].childNodes[2].replaceWith(document.createTextNode("硬币 " + deliver.unitFormat(data.stat.coin)));
                    number.childNodes[6].title = "收藏人数" + data.stat.favorite;
                    number.childNodes[6].childNodes[2].replaceWith(document.createTextNode("收藏 " + deliver.unitFormat(data.stat.favorite)));
                }
                else {
                    number.childNodes[4].title = "投硬币枚数" + data.stat.coin;
                    number.childNodes[4].childNodes[2].replaceWith(document.createTextNode("硬币 " + deliver.unitFormat(data.stat.coin)));
                    number.childNodes[5].title = "收藏人数" + data.stat.favorite;
                    number.childNodes[5].childNodes[2].replaceWith(document.createTextNode("收藏 " + deliver.unitFormat(data.stat.favorite)));
                }
                up_info[0].childNodes[1].href = "https://space.bilibili.com/" + data.owner.mid;
                up_info[0].childNodes[1].childNodes[0].src = data.owner.face;
                up_info[1].childNodes[0].childNodes[0].href = "https://space.bilibili.com/" + data.owner.mid;
                up_info[1].childNodes[0].childNodes[0].innerText = data.owner.name;
                up_info[1].childNodes[1].childNodes[0].innerText = "up主简介";
                up_info[1].childNodes[2].childNodes[0].innerText = "投稿 --";
                up_info[1].childNodes[2].childNodes[1].innerText = "粉丝 --";
                arc_toolbar_report[0].childNodes[0].title = "分享人数" + data.stat.share;
                arc_toolbar_report[0].childNodes[0].childNodes[1].innerText = deliver.unitFormat(data.stat.share);
                arc_toolbar_report[2].title = "收藏人数" + data.stat.favorite;
                arc_toolbar_report[2].childNodes[0].childNodes[3].innerText = deliver.unitFormat(data.stat.favorite);
                arc_toolbar_report[3].title = "投硬币枚数" + data.stat.coin;
                arc_toolbar_report[3].childNodes[0].childNodes[3].innerText = deliver.unitFormat(data.stat.coin);
                tag[0].setAttribute("hidden", "hidden");
                desc[1].innerText = data.desc;
                new unsafeWindow.bbComment(".comment", unsafeWindow.aid, 1, unsafeWindow.UserStatus.userInfo, "");
                let bpui = document.getElementsByClassName("bpui-button-text");
                let t = setInterval(() => {
                    // 更新列表名称
                    if (bpui[1]) {
                        clearInterval(t);
                        bpui[1].firstChild.innerText = "收藏列表";
                    }
                }, 100);
            },
        },
        // 分集数据
        setBangumi: {
            init: async (data) => {
                if (!config.reset.episodedata) return;
                // 判断是否有分集数据
                if (data.epList[1] && (data.epList[0].aid != data.epList[1].aid)) {
                    aid = data.epInfo.aid;
                    let timer = window.setInterval(() => {
                        if (document.getElementsByClassName("info-sec-av")[0]) {
                            deliver.setBangumi.episodeData("first");
                            window.clearInterval(timer);
                        }
                    }, 1000);
                    // 延时取消操作，10s还未载入完成将不再处理
                    window.setTimeout(() => window.clearInterval(timer), 10000);
                }
            },
            // 分集数据处理
            episodeData: async (data, msg) => {
                try {
                    let views = document.getElementsByClassName("view-count")[0].getElementsByTagName("span")[0];
                    let danmakus = document.getElementsByClassName("danmu-count")[0].getElementsByTagName("span")[0];
                    if (data == "first") {
                        // 判断是否是首次处理
                        if (views.innerText == "-" && danmakus.innerText == "-") {
                            window.setTimeout(() => { deliver.setBangumi.episodeData("first") }, 100);
                            return;
                        }
                        // 备份总播放数和弹幕数
                        views.setAttribute("title", "总播放数 " + views.innerText);
                        danmakus.setAttribute("title", "总弹幕数 " + danmakus.innerText);
                        debug.debug("总播放数", views.innerText, " 总弹幕数", danmakus.innerText);
                        data = await xhr.true(deliver.obj2search(API.url.stat, { "aid": aid }));
                    }
                    if (!data) {
                        aid = msg.relatedNode.innerText.match(/[0-9]+/)[0];
                        data = await xhr.true(deliver.obj2search(API.url.stat, { "aid": aid }));
                    }
                    data = deliver.xhrJsonCheck(data).data;
                    let view = data.view;
                    let danmaku = data.danmaku;
                    view = deliver.unitFormat(view);
                    danmaku = deliver.unitFormat(danmaku);
                    views.innerText = view;
                    danmakus.innerText = danmaku;
                    debug.debug("播放", view + " 弹幕", danmaku);
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("分集数据", ...e) }
            },
        },
        // 跳转完后的播单处理
        setPlayList: async () => {
            window.onload = () => {
                let div = document.createElement("div");
                div.setAttribute("class", "z-top-container has-menu");
                document.body.insertBefore(div, document.body.firstChild);
                let script = document.createElement("script");
                script.setAttribute("type", "text/javascript");
                script.setAttribute("src", "//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
                document.body.appendChild(script);
                let style = document.createElement("style");
                style.setAttribute("type", "text/css");
                document.head.appendChild(style);
                style.appendChild(document.createTextNode(API.style.bofqi));
            }
        },
        // 在线数据，接口失效
        setOnline: async () => {
            let timer = window.setInterval(async () => {
                let online = document.getElementsByClassName("online")[0];
                if (online) {
                    // 判断主页载入进程
                    window.clearInterval(timer);
                    let loop = async () => {
                        try {
                            let data = await xhr.true(API.url.online);
                            data = deliver.xhrJsonCheck(data).data;
                            let all_count = data.all_count;
                            let web_online = data.web_online;
                            let play_online = data.play_online;
                            let online = document.getElementsByClassName("online")[0];
                            if (online.tagName == "DIV") online = online.getElementsByTagName("a")[0];
                            else {
                                // 旧版主页需额外创建节点
                                let parent = online.parentNode;
                                online.remove();
                                let div = document.createElement("div");
                                let a = document.createElement("a");
                                div.setAttribute("class", "online");
                                parent.insertBefore(div, parent.firstChild);
                                a.setAttribute("href", "//www.bilibili.com/video/online.html");
                                a.setAttribute("target", "_blank");
                                div.appendChild(a);
                                online = a;
                            }
                            online.setAttribute("title", "在线观看：" + play_online);
                            online.text = web_online ? "在线人数：" + web_online : "在线列表";
                            if (!online.parentNode.getElementsByTagName("em")[0]) {
                                let em = document.createElement("em");
                                let count = document.createElement("a");
                                online.parentNode.insertBefore(em, online.nextSibling);
                                count.setAttribute("href", "//www.bilibili.com/newlist.html");
                                count.setAttribute("target", "_blank");
                                online.parentNode.insertBefore(count, em.nextSibling);
                                count.text = all_count ? "最新投稿：" + all_count : "最新投稿";
                            }
                            else {
                                let count = online.parentNode.getElementsByTagName("a")[1];
                                count.text = all_count ? "最新投稿：" + all_count : "最新投稿";
                            }
                            if (!all_count || !web_online || !play_online) return;
                            // 60s刷新一次
                            window.setTimeout(() => loop(), 60000);
                        }
                        catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("在线数据", ...e) }
                    }
                    loop();
                }
            }, 1000);
        },
        // 注册时间
        setJoinTime: async () => {
            if (!mid && !config.reset.jointime) return;
            let data = await xhr.GM(deliver.obj2search(API.url.membercard, { "mid": mid }));
            try {
                data = deliver.xhrJsonCheck(data);
                // 格式化时间戳，不是13位，主动补位
                let jointime = deliver.timeFormat(data.card.regtime * 1000, 1);
                let birthdate = data.card.birthday;
                debug.log("注册时间", [data.card.name, jointime]);
                document.addEventListener("DOMNodeInserted", (msg) => {
                    let birthday = document.getElementsByClassName("birthday");
                    if (birthday[0]) {
                        if (document.getElementsByClassName("jointime")[0]) return;
                        else {
                            let div = document.createElement("div");
                            let icon = document.createElement("span");
                            let text = document.createElement("span");
                            let style = document.createElement("style");
                            div.setAttribute("class", "item jointime");
                            birthday[0].parentNode.appendChild(div);
                            icon.setAttribute("class", "icon");
                            div.appendChild(icon);
                            text.setAttribute("class", "text");
                            text.innerText = jointime;
                            div.appendChild(text);
                            style.setAttribute("type", "text/css");
                            document.head.appendChild(style);
                            style.appendChild(document.createTextNode(API.style.jointime));
                        }
                    }
                });
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("注册时间", ...e) }
        },
        // 失效视频
        fixVideoLost: {
            // 收藏里的失效视频
            favlist: async (msg, data) => {
                // src判定是否为频道并取消重复处理
                if (!config.reset.lostvideo || window.src) return;
                // 获取av号或者将bv转为av
                let title, cover, aid = msg.target.getAttribute("data-aid");
                if (!(1 * aid)) aid = deliver.abv(aid);
                if (arr.indexOf(aid) != -1) return;
                // 记录已经处理过的视频aid
                arr.push(aid);
                try {
                    // 尝试读取来自jijidown的数据
                    data = await xhr.GM(API.url.jijidown + aid);
                    data.match('window._INIT')[0];
                    title = data.match(/\<title\>.+?\-哔哩哔哩唧唧/)[0].replace(/<title>/, "").replace(/-哔哩哔哩唧唧/, "");
                    cover = data.match(/\"img\":\ \".+?\",/)[0].match(/http.+?\",/)[0].replace(/",/, "");
                    // 判断封面是否有效
                    cover.match('hdslb')[0];
                }
                catch (e) {
                    try {
                        // 尝试读取来自biliplus数据
                        data = await xhr.GM(API.url.biliplus + aid);
                        data.match(/\<title\>.+?\ \-\ AV/)[0];
                        title = data.match(/\<title\>.+?\ \-\ AV/)[0].replace(/<title>/, "").replace(/ - AV/, "");
                        cover = data.match(/\<img style=\"display:none\"\ src=\".+?\"\ alt/)[0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
                    }
                    catch (e) {
                        // 无有效数据只能把标题改为av号
                        title = "av" + aid;
                    }
                }
                debug.log("失效视频", "av" + aid);
                let img = msg.target.getElementsByTagName("img")[0];
                let txt = msg.target.getElementsByClassName("title")[0];
                if (cover) img.setAttribute("src", cover + "@380w_240h_100Q_1c.webp");
                img.setAttribute("alt", title);
                txt.setAttribute("href", "//www.bilibili.com/video/av" + aid);
                txt.setAttribute("title", title);
                txt.setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                txt.text = title;
                msg.target.setAttribute("class", "small-item");
                msg.target.firstChild.setAttribute("href", "//www.bilibili.com/video/av" + aid);
                msg.target.firstChild.setAttribute("target", "_blank");
                msg.target.firstChild.setAttribute("class", "cover cover-normal");
            },
            // 频道里的失效视频
            channel: async (link) => {
                if (!config.reset.lostvideo || !src) return;
                try {
                    let data, obj = deliver.search2obj(link),
                        cid = obj.cid,
                        mid = obj.mid,
                        pn = obj.pn;
                    let small_item = document.getElementsByClassName("small-item");
                    if (small_item[0]) for (let i = 0; i < small_item.length; i++) if (small_item[i].getElementsByClassName("title")[0].text == "已失效视频") src = "";
                    if (src) return;
                    data = await xhr.true(deliver.obj2search(API.url.channel, { "mid": mid, "cid": cid, "pn": pn, "ps": 30, "order": 0 }));
                    data = deliver.xhrJsonCheck(data).data;
                    for (let i = 0; i < small_item.length; i++) {
                        let aid = small_item[i].getAttribute("data-aid") * 1;
                        let title = "av" + aid;
                        if (data.list.archives[i].title) title = data.list.archives[i].title;
                        let a = small_item[i].getElementsByClassName("cover")[0];
                        let img = small_item[i].getElementsByTagName("img")[0];
                        let txt = small_item[i].getElementsByClassName("title")[0];
                        if (txt.text == "已失效视频") {
                            small_item[i].setAttribute("class", "small-item fakeDanmu-item");
                            if (aid) {
                                // 修复失效视频av号
                                debug.log("失效视频", "av" + aid);
                                txt.setAttribute("href", "//www.bilibili.com/video/av" + aid);
                                a.setAttribute("href", "//www.bilibili.com/video/av" + aid);
                            }
                            else {
                                // 修复失效视频bv号
                                aid = small_item[i].getAttribute("data-aid");
                                debug.log("失效视频", aid);
                                txt.setAttribute("href", "//www.bilibili.com/video/" + aid);
                                a.setAttribute("href", "//www.bilibili.com/video/" + aid);
                            }
                            a.setAttribute("target", "_blank");
                            a.setAttribute("class", "cover cover-normal");
                            img.setAttribute("alt", title);
                            img.setAttribute("src", data.list.archives[i].pic.replace("http", "https") + "@380w_240h_100Q_1c.webp");
                            txt.setAttribute("target", "_blank");
                            txt.setAttribute("title", title);
                            txt.setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                            txt.text = title;
                        }
                    }
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("失效视频·频道", ...e) }
            },
            // 空间首页展示的失效视频
            home: async (msg) => {
                if (!config.reset.lostvideo) return;
                let channel_item = document.getElementsByClassName("channel-item");
                if (channel_item[0]) {
                    let small_item = document.getElementsByClassName("small-item");
                    if (small_item[0]) {
                        for (let i = 0; i < small_item.length; i++) {
                            if (small_item[i].getAttribute("class") == "small-item disabled") {
                                small_item[i].setAttribute("class", "small-item fakeDanmu-item");
                                let aid = small_item[i].getAttribute("data-aid") * 1;
                                let a = small_item[i].getElementsByClassName("cover")[0];
                                let img = small_item[i].getElementsByTagName("img")[0].alt;
                                let txt = small_item[i].getElementsByClassName("title")[0];
                                if (aid) {
                                    // 修改失效视频av链接
                                    debug.log("失效视频", "av" + aid);
                                    txt.setAttribute("href", "//www.bilibili.com/video/av" + aid);
                                    a.setAttribute("href", "//www.bilibili.com/video/av" + aid);
                                }
                                else {
                                    // 修改失效视频bv链接
                                    aid = small_item[i].getAttribute("data-aid");
                                    debug.log("失效视频", aid);
                                    txt.setAttribute("href", "//www.bilibili.com/video/" + aid);
                                    a.setAttribute("href", "//www.bilibili.com/video/" + aid);
                                }
                                a.setAttribute("target", "_blank");
                                a.setAttribute("class", "cover cover-normal");
                                txt.setAttribute("target", "_blank");
                                txt.setAttribute("title", img);
                                txt.setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                                txt.text = img;
                            }
                        }
                    }
                }
                // 固定失效视频数据防止被页面改回去
                if (msg.relatedNode.text == '已失效视频') msg.relatedNode.text = msg.relatedNode.getAttribute("title");
                if (msg.target.className == "small-item disabled") msg.target.className = "small-item";
            }
        },
        // 评论楼层
        setReplyFloor: {
            init: async (link) => {
                src = "";
                if (!config.reset.replyfloor) return;
                try {
                    let mode, data, obj = deliver.search2obj(link),
                        oid = obj.oid,
                        sort = obj.sort,
                        pn = obj.pn,
                        root = obj.root,
                        type = obj.type;
                    // sort与mode对应转化，sort == 1时暂时处理不了直接退出
                    // 热门：sort=2 mode=3 时间：sort=0 mode=2  回复：sort=1 默认(热门+时间)： mode=1
                    if (sort == 0) mode = 1;
                    if (sort == 1) throw ["暂无法处理按回复排列的评论", obj];
                    if (sort == 2) mode = 3;
                    let list_item = document.getElementsByClassName("reply-wrap");
                    let main_floor = document.getElementsByTagName("li");
                    // 展开楼中楼的楼层号
                    if (root) {
                        // 前两页直接获取
                        if (pn < 2) data = await xhr.true(deliver.obj2search(API.url.replycursor, { "oid": oid, "root": root, "type": type }));
                        else {
                            // 3页以上先获取当页首条评论rpid
                            let dialog;
                            if (list_item[0]) {
                                for (let i = 0; i < list_item.length; i++) {
                                    if (list_item[i].getAttribute("data-id") == root) {
                                        list_item = list_item[i].getElementsByClassName("reply-wrap");
                                        if (list_item[0]) for (let j = 0; j < list_item.length; j++) if (!list_item[j].getElementsByClassName("floor")[0]) { dialog = list_item[j].getAttribute("data-id"); break; }
                                        break;
                                    }
                                }
                            }
                            else if (main_floor[0]) {
                                for (let i = 0; i < main_floor.length; i++) {
                                    if (main_floor[i].getAttribute("id") && main_floor[i].getAttribute("id").includes(root)) {
                                        main_floor = main_floor[i].getElementsByTagName("li");
                                        if (main_floor[0]) for (let j = 0; j < main_floor.length; j++) if (main_floor[j].id && main_floor[j].id.includes("l_id") && !main_floor[j].getElementsByClassName("floor-num")[0]) { dialog = main_floor[j].getAttribute("id").split('_')[2]; break; }
                                        break;
                                    }
                                }
                            }
                            // 根据当页首条评论rpid获取min_id
                            data = await xhr.true(deliver.obj2search(API.url.replydialog, { "oid": oid, "root": root, "type": type, "dialog": dialog, "size": 20 }));
                            let min_id = deliver.xhrJsonCheck(data).data.replies;
                            if (min_id) { for (let i = 0; i < min_id.length; i++) if (min_id[i].rpid == dialog) { min_id = min_id[i].floor; break; } }
                            else { debug.msg("当前页楼中楼层获取失败 ಥ_ಥ"); return; }
                            // 根据min_id获取当页数据
                            data = await xhr.true(deliver.obj2search(API.url.replycursor, { "oid": oid, "root": root, "type": type, "min_id": min_id }));
                        }
                    }
                    else {
                        if (sort == 2) data = await xhr.true(deliver.obj2search(API.url.replymain, { "oid": oid, "next": pn, "type": type, "mode": mode }));
                        else if (pn == 1) data = await xhr.true(deliver.obj2search(API.url.replymain, { "oid": oid, "type": type, "mode": mode }));
                        else {
                            // 时间排序的楼层号需要相对前页判定
                            pn = pn - 1;
                            data = await xhr.true(deliver.obj2search(API.url.reply, { "type": type, "sort": sort, "oid": oid, "pn": pn }));
                            data = deliver.xhrJsonCheck(data).data;
                            let i = data.replies.length - 1;
                            oid = data.replies[0].oid;
                            let root = data.replies[i].rpid;
                            data = await xhr.true(deliver.obj2search(API.url.replycursor, { "oid": oid, "root": root, "type": type }));
                            data = deliver.xhrJsonCheck(data).data;
                            oid = data.root.oid;
                            let next = data.root.floor;
                            data = await xhr.true(deliver.obj2search(API.url.replymain, { "oid": oid, "next": next, "type": type, "mode": mode }));
                        }
                    }
                    data = deliver.xhrJsonCheck(data).data;
                    deliver.setReplyFloor.fix(deliver.setReplyFloor.floor(data));
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("评论楼层", ...e) }
            },
            // 纪录楼层对照表
            floor: (data) => {
                let floor = {}, top = data.top, hots = data.hots, replies = data.replies, froot = data.root;
                if (hots && hots[0]) {
                    for (let i = 0; i < hots.length; i++) {
                        floor[hots[i].rpid] = hots[i].floor;
                        if (hots[i].replies) for (let j = 0; j < hots[i].replies.length; j++) floor[hots[i].replies[j].rpid] = hots[i].replies[j].floor;
                    }
                }
                if (replies && replies[0]) {
                    for (let i = 0; i < replies.length; i++) {
                        floor[replies[i].rpid] = replies[i].floor;
                        if (replies[i].replies) for (let j = 0; j < replies[i].replies.length; j++) floor[replies[i].replies[j].rpid] = replies[i].replies[j].floor;
                    }
                }
                if (top) {
                    for (let key in top) {
                        if (top[key]) {
                            floor[top[key].rpid] = top[key].floor;
                            if (top[key].replies) for (let i = 0; i < top[key].replies.length; i++) floor[top[key].replies[i].rpid] = top[key].replies[i].floor;
                        }
                    }
                }
                if (froot && froot.replies) for (let i = 0; i < froot.replies.length; i++) floor[froot.replies[i].rpid] = froot.replies[i].floor;
                return floor;
            },
            // 修复楼层号
            fix: (floor) => {
                let list_item = document.getElementsByClassName("reply-wrap");
                let main_floor = document.getElementsByTagName("li");
                // 旧版评论直接写入楼层号
                if (main_floor[0]) {
                    for (let i = 0; i < main_floor.length; i++) {
                        if (main_floor[i].id && main_floor[i].id.includes("l_id")) {
                            let rpid = main_floor[i].getAttribute("id").split('_')[2];
                            if (rpid in floor) {
                                try {
                                    main_floor[i].getElementsByClassName("floor-num")[0].innerText = "#" + floor[rpid];
                                }
                                catch (e) {
                                    let node = main_floor[i].getElementsByClassName("floor-date")[0].parentNode;
                                    let span = document.createElement("span");
                                    span.setAttribute("class", "floor-num");
                                    span.setAttribute("style", "float : left;color : #aaa;padding-right : 10px;");
                                    span.innerText = "#" + floor[rpid];
                                    node.insertBefore(span, node.firstChild);
                                }
                            }
                        }
                    }
                }
                // 新版评论需另外创建楼层号
                if (list_item[0]) {
                    for (let i = 0; i < list_item.length; i++) {
                        let rpid = list_item[i].getAttribute("data-id");
                        if (rpid in floor) {
                            let node = list_item[i].getElementsByClassName("info")[0];
                            let span = document.createElement("span");
                            span.setAttribute("class", "floor");
                            span.innerText = "#" + floor[rpid];
                            node.insertBefore(span, node.firstChild);
                        }
                    }
                }
            }
        },
        //修复评论”跳转指定时间“功能
        fixVideoSeek: function (node) {
            node.querySelectorAll("a.video-seek").forEach(function (v) {
                v.addEventListener("click", function (e) {
                    window.scrollTo(0, 170);
                    unsafeWindow.player.seek(Number(e.target.attributes[2].nodeValue));
                });
            });
        },
        // 广告区转资讯区
        fixnews: async (node, move) => {
            try {
                let rank = config.reset.grobalboard ? document.getElementsByClassName("rank-tab")[0] : "";
                if (node.id == "bili_ad") {
                    let sight = node.getElementsByTagName("a");
                    node = node.getElementsByClassName("name");
                    if (node[0]) node[0].text = "资讯";
                    for (let i = 0; i < sight.length; i++) if (sight[i].href.includes("www.bilibili.com/v/ad/ad/")) sight[i].href = "https://www.bilibili.com/v/information/";
                    let rcon = document.createElement("div");
                    rcon.setAttribute("class", "r-con");
                    rcon.innerHTML = '<div class="r-con"><header style="margin-bottom: 14px"><h3 style="font-size: 18px;font-weight: 400;">资讯分区正式上线啦！</h3></header><div class="carousel-module"><div class="panel"><a href="https://www.bilibili.com/v/information" target="_blank"><img src="//i0.hdslb.com/bfs/archive/0747d26dbbc3bbf087d47cff49e598a326b0030c.jpg@320w_330h_1c.webp" width="260" height="280"/></a></div></div></div>';
                    document.getElementById("ranking_ad").replaceWith(rcon);
                }
                if (node.className == "report-wrap-module elevator-module") for (let item of node.children[1].children) if (item.innerHTML == "广告") item.innerHTML = "资讯";
                if (node.id == "bili-header-m") {
                    node = node.getElementsByClassName('nav-name');
                    if (node[0]) {
                        for (let i = 0; i < node.length; i++) {
                            if (node[i].textContent == "科技") {
                                move = node[i].parentNode.parentNode.children[1].lastChild.cloneNode(true);
                                move.firstChild.href = move.firstChild.href.replace("technology", "life");
                                node[i].parentNode.parentNode.children[1].lastChild.remove();
                            }
                            if (node[i].textContent == "广告") {
                                node[i].textContent = "资讯";
                                node[i].parentNode.href = "//www.bilibili.com/v/information/";
                            }
                            if (node[i].textContent == "生活") {
                                let sight = node[i].parentNode.parentNode.children[1];
                                sight.insertBefore(move, sight.lastChild)
                            }
                            if (node[i].textContent == "娱乐") node[i].parentNode.parentNode.children[1].lastChild.remove();
                        }
                    }
                }
                if (rank && rank.children[5]) {
                    rank.children[5].innerText == "知识" ? rank.children[5].innerText = "科技" : "";
                    rank.children[6].innerText == "知识" ? rank.children[6].innerText = "科技" : "";
                }
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("分区·版面", ...e) }
        },
        // 修复分区排行
        fixrank: async (node) => {
            // 这些分区排行榜已全部采用类似番剧排行的模式，故采用相似的节点覆盖
            let sort = {
                bili_movie: ["ranking_movie", 2, "https://www.bilibili.com/ranking/cinema/23/0/3"],
                bili_teleplay: ["ranking_teleplay", 5, "https://www.bilibili.com/ranking/cinema/11/0/3"],
                bili_documentary: ["ranking_documentary", 3, "https://www.bilibili.com/ranking/cinema/177/0/3"]
            }
            sort = sort[node.id];
            if (!sort) return;
            let section = node.getElementsByClassName("sec-rank report-wrap-module zone-rank")[0];
            section.innerHTML = '<header class="rank-head"><h3>排行</h3></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list"></ul></div><a href="' + sort[2] + '" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>';
            try {
                let data = await xhr.true(deliver.obj2search(API.url.ranklist, { season_type: sort[1], day: 3 }));
                data = deliver.xhrJsonCheck(data).data;
                node = node.getElementsByClassName("bangumi-rank-list rank-list")[0];
                for (let i = 0; i < 8; i++) {
                    let li = document.createElement("li"),
                        cl = i < 3 ? "rank-item highlight" : "rank-item",
                        fw;
                    li.setAttribute("class", cl);
                    li.innerHTML = '<i class="ri-num">' + (i + 1) + '</i><a href="' + data.list[i].url + '" target="_blank" title="' + data.list[i].title + ' 播放:' + data.list[i].stat.view + '" class="ri-info-wrap"><p class="ri-title">' + data.list[i].title + '</p><span class="ri-total">' + data.list[i].new_ep.index_show + '</span></a>';
                    li.onmouseover = () => {
                        fw = document.createElement("div");
                        fw.setAttribute("class", "bangumi-info-module");
                        fw.setAttribute("style", 'left: ' + li.getBoundingClientRect().left + 'px; top: ' + (getTotalTop(li) - 150) + 'px;');
                        fw.innerHTML = '<div class="v-preview clearfix"><div class="lazy-img cover"><img alt="' + data.list[i].title + '" src="' + data.list[i].cover + '" /></div><div><p class="title">' + data.list[i].title + '</p><p class="desc">' + data.list[i].new_ep.index_show + '</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>' + deliver.unitFormat(data.list[i].stat.view) + '</span><span class="danmu"><i class="icon"></i>' + deliver.unitFormat(data.list[i].stat.danmaku) + '</span><span class="fav"><i class="icon"></i>' + deliver.unitFormat(data.list[i].stat.follow) + '</span></div>';
                        document.body.appendChild(fw);
                    }
                    li.onmouseout = () => fw.remove();
                    node.appendChild(li);
                }
                // 计算节点相对高度
                function getTotalTop(node) {
                    var sum = 0;
                    do {
                        sum += node.offsetTop;
                        node = node.offsetParent;
                    }
                    while (node);
                    return sum;
                }
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("分区排行", ...e) }
        },
        // 弹幕哈希反查
        danmkuHashId: async (node) => {
            if (!config.reset.midcrc || !window.midcrc) return;
            let index = 1 * node.getAttribute("dmno");
            node.addEventListener("contextmenu", () => {
                setTimeout(async (data) => {
                    try {
                        let descipline = document.createElement("li");
                        let onwer = document.createElement("li");
                        let mid = window.midcrc(hash[index]);
                        node = document.getElementsByClassName("bili-old-hash");
                        if (node[0]) for (let i = 0; i < node.length; i++) node[i].remove();
                        if (document.getElementsByClassName("bilibili-player-icon bilibili-player-icon-arrow-down")[0]) return;
                        if (document.getElementsByClassName("bilibili-player-icon bilibili-player-icon-arrow-up")[0]) return;
                        descipline.setAttribute("class", "context-line context-menu-descipline bili-old-hash");
                        descipline.innerHTML = '<a class="context-menu-a" href="javascript:void(0);"></a>';
                        onwer.setAttribute("class", "context-line context-menu-function bili-old-hash");
                        onwer.innerHTML = '<a class="context-menu-a js-action" title="" href="//space.bilibili.com/' + mid + '">hash: ' + hash[index] + " mid: " + mid + '</a>';
                        node = document.getElementsByClassName("bilibili-player-context-menu-container white")[0];
                        if (!node) return;
                        node.firstChild.insertBefore(descipline, node.firstChild.firstChild);
                        onwer = node.firstChild.insertBefore(onwer, node.firstChild.firstChild);
                        data = deliver.xhrJsonCheck(await xhr.true(deliver.obj2search(API.url.card, { mid: mid })));
                        onwer.innerHTML = '<div style="min-height:0px;z-index:-5;" class="bb-comment"><div style="padding-top:10px;" class="comment-list"><div class="list-item"><div class="reply-box"><div style="padding:0px" class="reply-item reply-wrap"><div style="margin-left: 15px;" class="reply-face"><img src="' +
                            data.data.card.face + '@52w_52h.webp" alt=""></div><div class="reply-con"><div class="user"><a style="display:initial;padding: 0px;" data-usercard-mid="' +
                            mid + '" href="//space.bilibili.com/' +
                            mid + '" target="_blank" class="' +
                            (data.data.card.vip.vipType > 1 ? "name vip-red-name" : "name") + '">' + data.data.card.name + '</a> ' +
                            data.data.card.sex + '<a style="display:initial;padding: 0px;" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' +
                            data.data.card.level_info.current_level + '"></i></a></div></div></div></div></div></div></div>';
                    }
                    catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("弹幕反查", ...e) }
                })
            })
        },
        // 会员授权
        accesskey: async () => {
            if (!config.reset.accesskey) {
                if (GM_getValue("access_key")) {
                    GM_setValue("access_key", "");
                    GM_setValue("access_date", "");
                }
                return;
            }
            if (!GM_getValue("access_key") || (Date.now() - GM_getValue("access_date") > 2160000)) {
                try {
                    if (!uid) return;
                    let data = deliver.xhrJsonCheck(await xhr.GM("https://passport.bilibili.com/login/app/third?appkey=27eb53fc9058f8c3&api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png&sign=04224646d1fea004e79606d3b038c84a"));
                    data = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: data.data.confirm_uri,
                            onload: (xhr) => resolve(xhr.finalUrl),
                            onerror: (xhr) => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT"),
                        });
                    })
                    data = deliver.search2obj(data);
                    let page = document.createElement("iframe");
                    page.setAttribute("style", "display: none;");
                    page.setAttribute("src", deliver.obj2search("https://www.biliplus.com/login", data));
                    document.body.appendChild(page);
                    setTimeout(() => { page.remove() }, 3000);
                    GM_setValue("access_key", data.access_key);
                    GM_setValue("access_date", Date.now());
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("登录鉴权", ...e) }
            }
        },
        // 初始化播放器设置
        playerSetting: () => {
            let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
            if (bilibili_player_settings) {
                bilibili_player_settings = JSON.parse(bilibili_player_settings);
                if (bilibili_player_settings.video_status.autopart !== "") GM_setValue("bilibili_player_settings", bilibili_player_settings);
                else if (GM_getValue("bilibili_player_settings")) localStorage.setItem("bilibili_player_settings", JSON.stringify(GM_getValue("bilibili_player_settings")));
            } else if (GM_getValue("bilibili_player_settings")) {
                localStorage.setItem("bilibili_player_settings", JSON.stringify(GM_getValue("bilibili_player_settings")));
            }
        },
        // 原生脚本替换
        oldScript: (str) => {
            let comment = config.reset.oldreply ? "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@c74067196af49a16cb6e520661df7d4d1e7f04e5/src/comment.min.js" : "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/comment.min.js";
            str = str.replace("//static.hdslb.com/js/video.min.js", "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/video.min.js");
            str = str.replace("//static.hdslb.com/phoenix/dist/js/comment.min.js", comment);
            return str;
        },
        // URL转化
        parameterTrim: () => {
            let url = [];
            if (!BLOD.triming) {
                let parameters = ["spm_id_from", "from_source", "msource", "bsource", "seid", "from", "source", "session_id", "visit_id", "sourceFrom"];
                BLOD.triming = (url) => {
                    let obj = deliver.search2obj(url);
                    var mas = url.split("?")[0];
                    mas = mas.split("/");
                    mas.forEach((d, i, mas) => {
                        if (d.toLowerCase().startsWith('bv')) mas[i] = "av" + deliver.abv(d);
                    });
                    mas = mas.join("/");
                    if (!obj) return mas;
                    parameters.forEach(d => {
                        obj[d] = "";
                    })
                    return deliver.obj2search(mas, obj);
                }
            }
            let trim = async () => {
                url[1] = location.href;
                if (url[0] != url[1]) {
                    window.history.replaceState(null, null, BLOD.triming(location.href) + location.hash);
                    url[0] = location.href;
                }
                if (!config.reset.bvid2av) return;
                document.querySelectorAll("a").forEach(d => {
                    if (d.href && url.indexOf(d.href) < 0) {
                        let hash = d.href.includes("#") ? "#" + d.href.split("#")[1] : "";
                        hash = hash.includes("/") ? "" : hash;
                        d.href = BLOD.triming(d.href);
                        if (d.href.includes("?")) d.href = d.href + hash;
                        url.push(d.href);
                    }
                })
            }
            trim();
            setTimeout(() => { unsafeWindow.onclick = trim });
        }
    }

    // 设置界面
    const UI = {
        // 设置入口
        init: async () => {
            let ui_face = document.createElement("div");
            let enter = document.createElement("span");
            let icon = document.createElement("i");
            ui_face.setAttribute("class", "bili-old ui-face");
            ui_face.setAttribute("id", "ui-face");
            ui_face.setAttribute("style", "right : -54px;");
            ui_face.onmouseover = () => ui_face.setAttribute("style", "right : 0px;box-shadow : rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border : 1px solid rgb(233, 234, 236);");
            ui_face.onmouseout = () => ui_face.setAttribute("style", "right : -54px;");
            ui_face.onclick = () => {
                let table = document.getElementsByClassName("ui-table");
                if (!table[0]) UI.table();
                else if (table[0].getAttribute("hidden")) table[0].removeAttribute("hidden");
            }
            ui_face.appendChild(icon);
            ui_face.appendChild(enter);
            enter.innerText = "设置";
            let timer = window.setInterval(() => {
                // 等待body载入再进行设置绘制
                if (document.body) {
                    window.clearInterval(timer);
                    document.body.appendChild(ui_face);
                }
            }, 1000);
        },
        // 设置面板
        table: async () => {
            let table = document.getElementsByClassName("ui-table")[0];
            let timer;
            if (!table) {
                table = document.createElement("div");
                table.setAttribute("class", "bili-old ui-table");
                table.setAttribute("id", "ui-table");
                let info = document.createElement("span");
                let rec = document.createElement("span");
                info.setAttribute("style", "color : rgb(0,0,0);font-size : 14px;");
                info.innerText = "BilibiliOld 设置";
                table.appendChild(info);
                rec.setAttribute("style", "color : blue;float : right;font-size : 12px;");
                rec.innerText = "恢复默认";
                rec.onclick = () => {
                    for (let key in defig.rewrite) if (key in config.rewrite) config.rewrite[key] = defig.rewrite[key];
                    for (let key in defig.reset) if (key in config.reset) config.reset[key] = defig.reset[key];
                    GM_setValue("config", config);
                    debug.msg("恢复默认设置");
                    table.remove();
                }
                table.appendChild(rec);
                for (let key in config.rewrite) UI.setTable(table, UI.menu[key], config.rewrite[key], key);
                for (let key in config.reset) UI.setTable(table, UI.menu[key], config.reset[key], key);
                document.body.appendChild(table);
            }
            // 设置失去焦点时消失时间
            table.onmouseover = () => window.clearTimeout(timer);
            table.onmouseout = () => {
                timer = window.setTimeout(() => {
                    table.setAttribute("hidden", "hidden");
                    GM_setValue("config", config);
                    debug.msg("设置已保存");
                }, 500);
            }
        },
        // 设置选项
        setTable: async (ele, name, check, key) => {
            let div = document.createElement("div");
            let span = document.createElement("span");
            let input = document.createElement("input");
            ele.appendChild(div);
            div.setAttribute("style", "padding : 4px 4px 0px 4px;clear : both;");
            if (document.getElementsByClassName("checke")[0]) div.setAttribute("style", "padding : 0px 4px 0px 4px;clear : both;");
            div.appendChild(span);
            div.appendChild(input);
            span.setAttribute("style", "float : left;display : inline-block;color : rgb(0,0,0);font-size : 14px;");
            span.innerText = name[0];
            input.setAttribute("type", "checkbox");
            input.setAttribute("class", "checke");
            if (check) input.checked = true;
            input.onclick = () => {
                // 开关响应
                if (input.checked) {
                    if (key in config.rewrite) config.rewrite[key] = 1;
                    else config.reset[key] = 1;
                    if (!config.reset.xhrhook && key != "xhrhook" && UI.menu[key][1].includes("xhrhook")) debug.msg("启用失败！xhrhook已关闭！", UI.menu[key][0])
                }
                else {
                    if (key in config.rewrite) config.rewrite[key] = 0;
                    else config.reset[key] = 0;
                    if (key == "xhrhook") debug.msg("xhrhook已关闭，部分功能无法生效！")
                }
            }
            // 鼠标移出隐藏并保存设置
            div.onmouseover = () => {
                let div = document.createElement("div");
                div.setAttribute("class", "bili-old ui-state");
                div.setAttribute("id", "ui-state");
                div.innerHTML = name[1];
                document.body.appendChild(div);
            }
            div.onmouseout = () => document.getElementById("ui-state") ? document.getElementById("ui-state").remove() : "";
        },
        // 设置内容及说明，基本与config一一对应
        menu: {
            av: ["av(BV)", "启用旧版av页面，基于旧版网页框架"],
            bangumi: ["Bangumi", "启用旧版番剧页面，基于旧版网页框架"],
            watchlater: ["稍后再看", "启用旧版稍后再看页面，基于旧版网页框架"],
            frame: ["嵌入", "替换嵌入式播放器，不会单独适配被嵌入页面的其他功能"],
            home: ["主页", "启用旧版主页，，基于旧版网页框架，旧版主页失效内容过多，已进行一定程度处理满足日常使用"],
            medialist: ["收藏", "模拟收藏列表播放页面，收藏播放页是新版专属页面，只能先跳转av页再模拟收藏列表<br>依赖旧版av页<br>切P时up主简介等少数信息不会另外请求<br>※播放列表视频太多将导致视频载入及切换速度变慢"],
            rank: ["排行", "启用旧版排行，基于旧版网页框架"],
            danmuku: ["新版弹幕", "尝试换用新版弹幕接口，弹幕上限将变为两倍，对加载速度影响不明显<br>※依赖WebWorker hook"],
            livechat: ["实时弹幕", "尝试修复实时弹幕聊天功能，使旧播放器能继续实时接收最新弹幕<br>※依赖WebSocket hook"],
            limit: ["区域限制", "尝试解除B站区域限制(包括部分仅限APP限制)，用于观看港澳台番剧<br>※只适配旧版播放器<br>※功能不及专门的脚本，同时使用请关闭本选项<br>※依赖xhrhook<br>※参看“会员授权”"],
            accesskey: ["会员授权", "“区域限制”的高级功能，大会员的用户可以授权使用B站账户登录代理服务器，以观看会员专享视频。<br>※使用B站官方授权接口，完全不涉及密码等隐私信息，敬请放心<br>※不能解除大会员限制，只是让本身是大会员的用户能在区域限制视频继承大会员身份<br>※非大会员或者不需要观看大会员区域限制番剧开启本功能毫无意义"],
            grobalboard: ["顶栏底栏", "识别并替换所有新版顶栏为旧版顶栏，旧版失效广告区替换为资讯区"],
            replyfloor: ["评论楼层", "恢复评论区楼层号，上古“按评论数”排列的评论除外<br>添加了楼中楼层号显示，但若楼中楼当页第一条评论是回复别人则该页都无法获取"],
            headblur: ["顶栏透明", "使旧版顶栏全透明"],
            preview: ["付费预览", "去除播放器左下角付费预览框"],
            jointime: ["注册时间", "在个人空间显示B站账号注册时间，依赖主人开放个人资料"],
            lostvideo: ["失效视频", "借助第三方接口修复失效视频的封面和标题，将标题标红并添加删除线，无数据时只修改标题为av号"],
            bvid2av: ["BV⇒av", "单击一下，将页面所有BV转化为av并清理多余参数<br>地址栏是默认开启不受此开关限制"],
            selectdanmu: ["弹幕优先", "让旧版播放器优先展示弹幕列表而不是推荐视频"],
            episodedata: ["分集数据", "让番剧显示分集的播放数和弹幕数，原来总计数据显示在鼠标焦点的浮动信息上"],
            like: ["点赞功能", "为旧版播放页面添加点赞功能，点赞是新版页面专属功能，功能简陋，不支持一键三联"],
            static: ["静态页面", "将静态页面跳转到普通页面以启用旧版页面，静态页面是新版新增页面，页面大部分信息都内置于页面中以加快载入速度"],
            download: ["下载视频", "播放器右键菜单>>>下载视频>>>选择文件>>>右键另存为/右键IDM下载<br>！！！复制无效/左键点击无效！！！<br>※详见脚本简介"],
            dlother: ["其他下载", "下载面板同时提供弹幕、字幕等下载"],
            heartbeat: ["视频心跳", "替换被其他广告屏蔽插件拦截的视频心跳，若出现播放视频但不记录历史的情况可以尝试启用"],
            carousel: ["播放信息", "填充旧版播放器顶部缺失的通知信息"],
            adloc: ["主页广告", "去除旧版主页直接写在网页里的广告的内容，如滚动图、推荐位、横幅……"],
            roomplay: ["直播拦截", "拦截直播视频及轮播视频以节约流量<br>受浏览器缓存影响注入没有载入直播快则会失败，此种情况硬刷新可以解决"],
            history: ["视频历史", "去掉历史记录页面的直播、专栏，只显示视频播放历史"],
            xhrhook: ["xhrhook", "hook xhr的send方法，副作用是所有xhr的initiator都会变成本脚本，强迫症可以选择关闭除非需要启用以下功能：<br>※区域限制"],
            electric: ["充电鸣谢", "自动跳过充电鸣谢<br>※动作再快还是会一闪而过"],
            panel: ["最后一帧", "使视频播放结束后画面停留在最后一帧，不再展示功能窗口"],
            midcrc: ["弹幕反查", "在旧版播放器弹幕列表上右键将显示发送者信息，鼠标移动到发送者名字上展示详细信息页<br>※原理是通过crc哈希值暴力逆推出mid，再通过mid获取发送者信息，由于哈希函数特性二者不一定一一对应，所以结果仅供参考<br>※不支持嵌入式旧版播放器<br>※修改弹幕排序后由于无法获取哈希值故无法查询<br>※出错时说明逆推出的mid不正确，但不出错也不代表一定正确"],
            viewbofqi: ["播放居中", "自动滚动到播放器，使播放器位于网页可视区域正中"],
            widescreen: ["自动宽屏", "默认启用网页宽屏"],
            danmakuoff: ["关闭弹幕", "默认关闭弹幕，开启后切p也会主动关闭弹幕"],
            oldreply: ["旧版评论", "恢复旧版先“全部评论”再热门评论的样式"]
        }
    }

    // 页面分离
    const thread = {
        // av/BV
        video: () => {
            try {
                // 判断是否收藏跳转而来
                ml = GM_getValue("medialist");
                GM_setValue("medialist", 0);
                if (!config.rewrite.av) throw ["未启用旧版av页", location.href];
                deliver.playerSetting();
                if (LOCATION[4].toLowerCase().startsWith('bv')) aid = deliver.abv(LOCATION[4]);
                aid = aid || LOCATION[4].match(/[0-9]+/)[0];
                DOCUMENT = xhr.false(deliver.obj2search(API.url.detail, { aid: aid }));
                __INITIAL_STATE__ = INITIAL_STATE.av(DOCUMENT);
                if (!__INITIAL_STATE__) throw "av/BV号可能无效！";
                if (__INITIAL_STATE__.videoData.redirect_url) throw ["番剧重定向：", __INITIAL_STATE__.videoData.redirect_url];
                if (__INITIAL_STATE__.videoData.stein_guide_cid) throw ["忽略互动视频：", "av" + aid];
                // 写入全局变量
                aid = __INITIAL_STATE__.aid ? __INITIAL_STATE__.aid : aid;
                tid = __INITIAL_STATE__.videoData.tid ? __INITIAL_STATE__.videoData.tid : tid;
                unsafeWindow.__INITIAL_STATE__ = __INITIAL_STATE__;
                // 重写网页框架并进行调用后续处理
                deliver.write(deliver.oldScript(API.pageframe.video));
                document.title = __INITIAL_STATE__.videoData.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
                deliver.fixSort.video()
                deliver.setLike();
                deliver.setMediaList.init();
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·av/BV", ...e) }
        },
        // 稍后再看
        watchlater: () => {
            try {
                if (!config.rewrite.watchlater) throw ["未启用旧版稍后再看", location.href];
                if (!uid) throw ["未登录", "无法启用旧版稍后再看"];
                deliver.playerSetting();
                // 重写网页框架并调用后续处理
                deliver.write(deliver.oldScript(API.pageframe.watchlater));
                deliver.setLike();
                deliver.fixSort.watchlater();
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·稍后再看", ...e) }
        },
        // 番剧
        bangumi: () => {
            try {
                if (!config.rewrite.bangumi) throw ["未启用旧版Bangumi", location.href];
                deliver.playerSetting();
                // 指定playurl类型
                pgc = true;
                // 获取网页源代码
                DOCUMENT = xhr.false(location.href);
                __INITIAL_STATE__ = DOCUMENT.includes("__INITIAL_STATE__=") ? JSON.parse(DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "")) : ""; // 继承__INITIAL_STATE__
                // 判断页面是否404
                if (!__INITIAL_STATE__) {
                    // 尝试获取备用数据源
                    if (LOCATION[5].startsWith('ss')) DOCUMENT = xhr.false(deliver.obj2search(API.url.season, { season_id: location.href.match(/[0-9]+/)[0] }));
                    else if (LOCATION[5].startsWith('ep')) DOCUMENT = xhr.false(deliver.obj2search(API.url.season, { ep_id: location.href.match(/[0-9]+/)[0] }));
                }
                let id = LOCATION[5].startsWith('ep') ? location.href.match(/[0-9]+/)[0] : "";
                // 获取__INITIAL_STATE__
                __INITIAL_STATE__ = INITIAL_STATE.bangumi(id);
                if (__INITIAL_STATE__ && __INITIAL_STATE__.epInfo && __INITIAL_STATE__.epInfo.badge === "互动") throw ["忽略互动视频：", location.href];
                // 重写网页框架并调用后续处理，按是否有特殊背景分别处理
                unsafeWindow.__INITIAL_STATE__ = __INITIAL_STATE__;
                if (DOCUMENT.match('"specialCover":""') || !__INITIAL_STATE__.special) deliver.write(deliver.oldScript(API.pageframe.bangumi)); else deliver.write(deliver.oldScript(API.pageframe.cinema));
                document.title = DOCUMENT.match(/<title.*?>.+?<\/title>/) ? DOCUMENT.match(/<title.*?>.+?<\/title>/)[0].replace(/<title.*?>/, "").replace(/<\/title>/, "") : __INITIAL_STATE__.mediaInfo.title;
                if (__INITIAL_STATE__) deliver.setBangumi.init(__INITIAL_STATE__);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·Bangumi", ...e) }
        },
        // 嵌入
        blackboard: () => {
            try {
                // 修复HTML5播放器帮助页视频cid错误
                if (LOCATION[4].startsWith('html5player')) if (LOCATION[4].includes("3521416") && LOCATION[4].includes("6041635")) location.replace(deliver.obj2search(API.playerframe.html5player, { "aid": 3521416, "cid": 192446449 }));
                if (!config.rewrite.frame) throw ["未启用旧版嵌入播放器", location.href];
                deliver.playerSetting();
                if (LOCATION[4].startsWith('newplayer')) {
                    let obj = deliver.search2obj(location.href),
                        season_type = obj.season_type || "",
                        player_type = obj.player_type || "";
                    aid = 1 * obj.aid || (obj.aid ? deliver.abv(obj.aid) : undefined) || (obj.bvid ? deliver.abv(obj.bvid) : undefined);
                    cid = obj.cid || "";
                    try {
                        cid = cid || deliver.xhrJsonCheck(xhr.false(deliver.obj2search(API.url.pagelist, { "aid": aid }))).data[0].cid
                    }
                    catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·嵌入", ...e) }
                    // 重定向到旧版播放器
                    location.replace(deliver.obj2search(API.playerframe.html5player, { "aid": aid, "cid": cid, "season_type": season_type, "player_type": player_type, "as_wide": 1, }));
                    debug.log("嵌入播放器", "aid=", aid, " cid=", cid);
                }
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·嵌入", ...e) }
        },
        // 播单
        playlist: () => {
            if (LOCATION[4] == "video") {
                deliver.write(deliver.oldScript(API.pageframe.playlist));
                deliver.setPlayList();
            }
            if (LOCATION[4] == "detail") {
                __INITIAL_STATE__ = { mid: "", pid: "", plinfoData: {}, pllistData: {} }
                try {
                    DOCUMENT = deliver.xhrJsonCheck(xhr.false(deliver.obj2search(API.url.playlist, { pid: LOCATION[5].match(/[0-9]+/)[0] }))).data;
                    __INITIAL_STATE__.mid = DOCUMENT.mid;
                    __INITIAL_STATE__.pid = DOCUMENT.pid;
                    __INITIAL_STATE__.plinfoData = { attr: DOCUMENT.attr, count: DOCUMENT.count, cover: DOCUMENT.cover, ctime: DOCUMENT.ctime, description: DOCUMENT.description, favored: DOCUMENT.favored, id: DOCUMENT.id, is_favorite: DOCUMENT.is_favorite, mid: DOCUMENT.mid, mtime: DOCUMENT.mtime, owner: DOCUMENT.owner, pid: DOCUMENT.pid, stat: DOCUMENT.stat, state: DOCUMENT.state, type: DOCUMENT.type, };
                    __INITIAL_STATE__.pllistData = DOCUMENT.list;
                }
                catch (e) {
                    e = Array.isArray(e) ? e : [e]; debug.error("播单", ...e);
                    unsafeWindow.__INITIAL_STATE__ = INITIAL_STATE.playlist();
                }
                deliver.write(deliver.oldScript(API.pageframe.detail));
            }
        },
        // 收藏
        medialist: () => {
            if (LOCATION[5].startsWith("ml")) {
                ml = 1 * LOCATION[5].match(/[0-9]+/)[0];
                // 保存收藏号并调用av跳转
                if (!config.rewrite.medialist) return;
                GM_setValue("medialist", ml);
                deliver.setMediaList.init(ml);
            }
            // 新版稍后再看跳转到旧版稍后再看
            if (LOCATION[5].startsWith("watchlater") && config.rewrite.watchlater) location.replace("https://www.bilibili.com/watchlater/#/");
        },
        // 静态av
        svideo: () => {
            // 直接跳转回普通av
            if (!config.reset.static) return;
            location.replace(location.href.replace("s/video", "video"));
        },
        // 空间
        space: () => {
            // 调用注册时间处理
            mid = LOCATION[3] ? 1 * LOCATION[3] : mid;
            deliver.setJoinTime();
        },
        // 主页
        home: () => {
            try {
                if (!config.rewrite.home) throw ["未启用旧版主页", location.href];
                window.recbtn = 1;
                if (!unsafeWindow.__INITIAL_STATE__) {
                    DOCUMENT = xhr.false(location.href);
                    __INITIAL_STATE__ = DOCUMENT.includes("__INITIAL_STATE__=") ? DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "") : ""; // 继承__INITIAL_STATE__
                }
                else __INITIAL_STATE__ = JSON.stringify(unsafeWindow.__INITIAL_STATE__);
                // 新旧__INITIAL_STATE__不兼容，进行重构
                unsafeWindow.__INITIAL_STATE__ = __INITIAL_STATE__ = INITIAL_STATE.home(__INITIAL_STATE__);
                // 重写网页框架
                deliver.write(API.pageframe.home);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·主页", ...e) }
            // 调用在线数据处理
            deliver.setOnline();
        },
        // 排行榜
        rank: () => {
            try {
                if (!config.rewrite.rank) throw ["未启用排行", location.href];
                let refer = document.referrer.split("/");
                if (refer && refer[4] && refer[4] == "all") DOCUMENT = deliver.xhrJsonCheck(xhr.false(deliver.obj2search(API.url.ranking, { rid: refer[5], day: 3, type: 1, arc_type: 0 })));
                else DOCUMENT = deliver.xhrJsonCheck(xhr.false(deliver.obj2search(API.url.ranking, { rid: 0, day: 3, type: 1, arc_type: 0 })));
                __INITIAL_STATE__ = { loading: false, rankRouteParams: { arc_type: 0, day: 3, rankTab: "all", rid: 1 * refer[5] || 0, season_type: 1 }, showTypes: true, times: [{ name: "日排行", value: 1 }, { name: "三日排行", value: 3 }, { name: "周排行", value: 7 }, { name: "月排行", value: 30 }], typeList: [{ name: "全部投稿", value: 0 }, { name: "近期投稿", value: 1 }] };
                __INITIAL_STATE__.channels = [{ name: "全站", tid: 0 }, { name: "动画", tid: 1 }, { name: "国创相关", tid: 168 }, { name: "音乐", tid: 3 }, { name: "舞蹈", tid: 129 }, { name: "游戏", tid: 4 }, { name: "科技", tid: 36 }, { name: "数码", tid: 188 }, { name: "生活", tid: 160 }, { name: "美食", tid: 211 }, { name: "鬼畜", tid: 119 }, { name: "时尚", tid: 155 }, { name: "娱乐", tid: 5 }, { name: "影视", tid: 181 }];
                __INITIAL_STATE__.rankList = DOCUMENT.data.list;
                __INITIAL_STATE__.note = DOCUMENT.data.note;
                unsafeWindow.__INITIAL_STATE__ = __INITIAL_STATE__;
                deliver.write(API.pageframe.rank);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·排行", ...e) }
        }
    }

    // 修复推出登录功能
    if (location.href.includes("bilibili.com/login?act=exit")) {
        (async () => {
            let refer = document.referrer;
            await xhr.post("https://passport.bilibili.com/login/exit/v2", "", "biliCSRF=" + BLOD.getCookies().bili_jct);
            location.href = refer;
        })();
    }
    // 初始化设置
    unsafeWindow.BLOD = deliver;
    defig = JSON.parse(JSON.stringify(config));
    let data = GM_getValue("config");
    if (data) {
        // 读取脚本管理器中的修改过的设置
        for (let key in data.rewrite) if (key in config.rewrite) config.rewrite[key] = data.rewrite[key];
        for (let key in data.reset) if (key in config.reset) config.reset[key] = data.reset[key];
    }
    else GM_setValue("config", config);
    try {
        deliver.parameterTrim();
        // 监听拦截全局变量
        deliver.getVariable();
        // uid用于判断是否登录
        uid = deliver.getCookies().DedeUserID;
        // 维护旧版动态状态
        if (uid) {
            let offset = deliver.getCookies()["bp_video_offset_" + uid];
            if (offset) document.cookie = "bp_t_offset_" + uid + "=" + offset + "; domain=bilibili.com; expires=Aug, 18 Dec 2038 18:00:00 GMT; path=/";
        }
    }
    catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("初始化", ...e) }

    // 分离页面单独调用
    if (LOCATION[3]) {
        if (LOCATION[3] == 'video' && (LOCATION[4].toLowerCase().startsWith('av') || LOCATION[4].toLowerCase().startsWith('bv'))) thread.video();
        if (LOCATION[3] == 'watchlater') thread.watchlater();
        if (LOCATION[3] == 'bangumi' && LOCATION[4] == 'play') thread.bangumi();
        if (LOCATION[3] == 'blackboard' && LOCATION[4]) thread.blackboard();
        if (LOCATION[3] == 'playlist' && LOCATION[5].startsWith('pl')) thread.playlist();
        if (LOCATION[3] == 'medialist' && LOCATION[4] == 'play') thread.medialist();
        if (LOCATION[3] == 's' && (LOCATION[5].toLowerCase().startsWith('av') || LOCATION[5].toLowerCase().startsWith('bv'))) thread.svideo();
        if (LOCATION[2] == 'space.bilibili.com') thread.space();
        if (LOCATION[2] == 'www.bilibili.com' && (LOCATION[3].startsWith('\?') || LOCATION[3].startsWith('\#') || LOCATION[3].startsWith('index.'))) thread.home();
        if (LOCATION[3] == 'v' && LOCATION[4] == "popular") thread.rank();
    }
    else if (LOCATION[2] == 'www.bilibili.com') thread.home();

    // 全局调用
    // 绘制设置入口
    if (window.self == window.top) UI.init();
    // 创建全局样式
    deliver.setGlobalStyle();
    // 启用xhr hook
    intercept.init();
    // 启用弹幕哈希引擎
    if (window.self == window.top && config.reset.midcrc) window.midcrc = new BiliBili_midcrc();
    // 登录鉴权
    if (window.self == window.top) deliver.accesskey();
    // DOM修改监听调用
    document.addEventListener("DOMNodeInserted", (msg) => {
        // 去除预览提示框
        if (/bilibili-player-video-toast-pay/.test(msg.target.className)) deliver.removePreview(msg.target);
        // 版面替换
        if (msg.target.id == "internationalHeader") deliver.reSction();
        if (msg.target.id == "bili-header-m") if (document.getElementById("internationalHeader")) document.getElementById("internationalHeader").remove();
        // 切p监听
        if (/bilibili-player-video-btn-start/.test(msg.target.className)) deliver.switchVideo();
        // 创建播放器右键下载菜单
        if (/bilibili-player-context-menu-container black/.test(msg.target.className)) deliver.download.init(msg.target);
        // 捕获评论链接
        if (msg.target.src && msg.target.src.startsWith('https://api.bilibili.com/x/v2/reply') && msg.target.src.includes("oid")) src = msg.target.src;
        // 捕获频道视频链接
        if (msg.target.src && msg.target.src.includes("//api.bilibili.com/x/space/channel/video?")) window.src = src = msg.target.src;
        // 修复失效频道视频
        if (msg.relatedNode.getAttribute("class") == "row video-list clearfix") deliver.fixVideoLost.channel(src);
        // 修复失效收藏视频
        if (msg.target.className == "small-item disabled") deliver.fixVideoLost.favlist(msg);
        // 刷新番剧分集数据
        if (msg.relatedNode.className == "info-sec-av") deliver.setBangumi.episodeData("", msg);
        // 失效分区转换
        if (msg.target.id == "bili_ad" || msg.target.className == "report-wrap-module elevator-module" || msg.target.id == "bili-header-m" || msg.target.className == "no-data loading") deliver.fixnews(msg.target);
        // 修复评论楼层&修复评论空降坐标
        if (src && (/l_id/.test(msg.target.id) || /reply-wrap/.test(msg.target.className))) { deliver.setReplyFloor.init(src); deliver.fixVideoSeek(msg.target.parentNode); }
        // 修复分区排行
        if (msg.target.id == "bili_movie" || msg.target.id == "bili_teleplay" || msg.target.id == "bili_documentary") deliver.fixrank(msg.target);
        // 弹幕哈希反查
        if (/danmaku-info-row/.test(msg.target.className)) deliver.danmkuHashId(msg.target);
        // 其他节点监听
        deliver.resetNodes();
        // 收藏页切p监听
        deliver.setMediaList.fixvar();
        // 修复空间主页失效视频
        deliver.fixVideoLost.home(msg);
        // bv号转超链接
        deliver.avdesc();
    });
})();
