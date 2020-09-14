// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      3.4.9
// @description  恢复原生的旧版页面，包括主页和播放页。
// @author       MotooriKashin, wly5556
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @match        *://*.bilibili.com/*
// @connect      bilibili.com
// @connect      biliplus.com
// @connect      jijidown.com
// @require      https://cdn.jsdelivr.net/npm/protobufjs@6.10.1/dist/protobuf.js
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT License
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let ml, pl, aid, big, cid, mid, oid, pgc, src, tid, uid, url, xml, bvid, limit, defig;
    let arr = [], ids = [], obj = {}, mdf = {}, bloburl = {};
    let DOCUMENT, __playinfo__, __INITIAL_STATE__;
    let LOCATION = document.location.href.split('/');

    // protobuf初始化
    const root = window.protobuf.Root.fromJSON(JSON.parse('{"nested":{"bilibili":{"nested":{"DmWebViewReply":{"fields":{"state":{"type":"int32","id":1},"text":{"type":"string","id":2},"textSide":{"type":"string","id":3},"dmSge":{"type":"DmSegConfig","id":4},"flag":{"type":"DanmakuFlagConfig","id":5},"specialDms":{"rule":"repeated","type":"string","id":6},"checkBox":{"type":"bool","id":7},"count":{"type":"int64","id":8},"commandDms":{"rule":"repeated","type":"CommandDm","id":9},"dmSetting":{"type":"DanmuWebPlayerConfig","id":10}}},"CommandDm":{"fields":{"id":{"type":"int64","id":1},"oid":{"type":"int64","id":2},"mid":{"type":"int64","id":3},"command":{"type":"string","id":4},"content":{"type":"string","id":5},"progress":{"type":"int32","id":6},"ctime":{"type":"string","id":7},"mtime":{"type":"string","id":8},"extra":{"type":"string","id":9},"idStr":{"type":"string","id":10}}},"DmSegConfig":{"fields":{"pageSize":{"type":"int64","id":1},"total":{"type":"int64","id":2}}},"DanmakuFlagConfig":{"fields":{"recFlag":{"type":"int32","id":1},"recText":{"type":"string","id":2},"recSwitch":{"type":"int32","id":3}}},"DmSegMobileReply":{"fields":{"elems":{"rule":"repeated","type":"DanmakuElem","id":1}}},"DanmakuElem":{"fields":{"id":{"type":"int64","id":1},"progress":{"type":"int32","id":2},"mode":{"type":"int32","id":3},"fontsize":{"type":"int32","id":4},"color":{"type":"uint32","id":5},"midHash":{"type":"string","id":6},"content":{"type":"string","id":7},"ctime":{"type":"int64","id":8},"weight":{"type":"int32","id":9},"action":{"type":"string","id":10},"pool":{"type":"int32","id":11},"idStr":{"type":"string","id":12}}},"DanmuWebPlayerConfig":{"fields":{"dmSwitch":{"type":"bool","id":1},"aiSwitch":{"type":"bool","id":2},"aiLevel":{"type":"int32","id":3},"blocktop":{"type":"bool","id":4},"blockscroll":{"type":"bool","id":5},"blockbottom":{"type":"bool","id":6},"blockcolor":{"type":"bool","id":7},"blockspecial":{"type":"bool","id":8},"preventshade":{"type":"bool","id":9},"dmask":{"type":"bool","id":10},"opacity":{"type":"float","id":11},"dmarea":{"type":"int32","id":12},"speedplus":{"type":"float","id":13},"fontsize":{"type":"float","id":14},"screensync":{"type":"bool","id":15},"speedsync":{"type":"bool","id":16},"fontfamily":{"type":"string","id":17},"bold":{"type":"bool","id":18},"fontborder":{"type":"int32","id":19},"drawType":{"type":"string","id":20}}}}}}}'));
    const protoSeg = root.lookupType('bilibili.DmSegMobileReply');
    const protoView = root.lookupType('bilibili.DmWebViewReply');

    // 脚本默认设置：0 - 关闭，1 - 开启
    // 一般直接修改这里无效，脚本读取的是管理器中的数据
    const config = {
        rewrite : {
            av : 1,
            bangumi : 1,
            watchlater : 1,
            frame : 1,
            home : 1,
            playlist : 1,
            medialist : 1,
        },
        reset : {
            xhrhook : 1,
            danmuku : 1,
            livechat : 1,
            limit : 0,
            grobalboard : 1,
            replyfloor : 1,
            headblur : 0,
            preview : 1,
            jointime : 1,
            lostvideo : 1,
            bvid2av : 1,
            selectdanmu : 0,
            episodedata : 1,
            like : 1,
            static : 1,
            download : 1,
            heartbeat : 0,
            carousel : 0,
            adloc : 0,
            roomplay : 0,
            history : 0,
            electric : 0
        }
    }

    // 统一api接口
    const API = {
        // 网页框架
        pageframe : {
            watchlater : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="spm_prefix" content="333.342"/><link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css"><link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css"><link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css" rel="stylesheet"><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div class="z-top-container has-menu"></div><div id="viewlater-app"><app></app></div><div class="footer bili-footer"></div><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script><script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script><script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/js/main.2111469a1bbc20e2e885.js"></script></body></html>',
            playlist : '<!DOCTYPE html><html><head><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=renderer content=webkit><meta name=description content=bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。><meta name=keywords content=B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid><meta name=spm_prefix content=333.44><link rel=stylesheet href=//static.hdslb.com/phoenix/dist/css/comment.min.css type=text/css><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=renderer content=webkit><meta name=description content=bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。><meta name=keywords content=B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid><meta name=spm_prefix content=0><link href=//s1.hdslb.com/bfs/static/jinkela/playlist-video/css/playlist_video.0.87292febba67b03f65d05c15d03e325d9db4f56a.css rel=stylesheet><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}</style></head><body><div id=playlist-video-app></div><div class="footer bili-footer report-wrap-module"></div><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js></script><script type=text/javascript src=//static.hdslb.com/js/jquery.qrcode.min.js></script><script type=text/javascript charset=utf-8 src=//static.hdslb.com/common/js/footer.js></script><script type=text/javascript src=//static.hdslb.com/js/swfobject.js></script><script type=text/javascript src=//static.hdslb.com/js/video.min.js></script><script type=text/javascript src=//static.hdslb.com/mstation/js/upload/moxie.js></script><script type=text/javascript src=//static.hdslb.com/mstation/js/upload/plupload.js></script><script type=text/javascript src=//static.hdslb.com/phoenix/dist/js/comment.min.js></script><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js></script><script type=text/javascript src=//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js></script></body></html>',
            bangumi : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script><script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.css" /></head><body><div class="z-top-container has-menu"></div><div id="app" data-server-rendered="true" class="main-container"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js" crossorigin="" defer="defer"></script><script type="text/javascript">0</script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>',
            cinema : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script><script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.css" /></head><body><div class="z-top-container " style="height:42px"></div><div id="app" data-server-rendered="true" class="main-container special"></div><script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js" crossorigin="" defer="defer"></script><script type="text/javascript">0</script><div class="footer bili-footer report-wrap-module" id="home_footer"></div><script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script><script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script></body></html>',
            video : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" /><style type="text/css">#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}} .video-info-m .number .like b, .video-info-m .number .like i {background : url(//static.hdslb.com/images/base/icons.png);}</style></head><body><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><div class="z-top-container has-menu"></div><div id="video-page-app"></div><div id="app" data-server-rendered="true"></div><div class="bili-wrapper" id="bofqi"></div><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script><script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script><script type="text/javascript">function getQueryString(e){var r=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),i=window.location.search.substr(1).match(r);return null!=i?unescape(i[2]):null}window.getInternetExplorerVersion=function(){var e=-1;if("Microsoft Internet Explorer"==navigator.appName){var r=navigator.userAgent;null!=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r)&&(e=parseFloat(RegExp.$1))}return e};var vd=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.videoData;if(vd&&vd.aid&&9!==getInternetExplorerVersion()){if($("#__bofqi").innerHTML=\'<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>\',vd.embedPlayer){var p=getQueryString("p")?getQueryString("p")-1:0,player={aid:vd.aid,cid:vd.pages[p]&&vd.pages[p].cid||vd.pages[0].cid};EmbedPlayer("player","//static.hdslb.com/play.swf","cid="+player.cid+"&aid="+player.aid+"&pre_ad=")}vd.embed&&$("#bofqi").html(vd.embed)}else $("#bofqi").remove()</script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js" crossorigin="" defer="defer"></script><script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script><link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" /><script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script><script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script></body></html>',
            home : '<!DOCTYPE html><html lang="zh-Hans"><head><meta charset="utf-8"><title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title><meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。"><meta name="keywords" content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃"><meta name="renderer" content="webkit"><meta http-equiv="X-UA-Compatible" content="IE=edge"><link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml" title="哔哩哔哩"><script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script><link rel="stylesheet" href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css"></head><body><div id="home-app"></div><div id="app" data-server-rendered="true"></div><script src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js" defer></script><div class="footer bili-footer report-wrap-module"></div><script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin></script><script type="text/javascript" defer="defer" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script><link rel="prefetch" as="script" href="//static.hdslb.com/js/video.min.js"></body></html>'
        },
        // 样式表
        style : {
            playshadow : "#bilibiliPlayer, #bofqi.mini-player {box-shadow : 0px 2px 8px 0px rgba(0,160,216,0.3) !important;}",
            download : "#bili-old-download-table {position : fixed;z-index : 3300;bottom : 0;background : #f6f6f6;width : 100%;text-align : center;}#bili-old-download-table .download-box {background-color : #fff;color : #000 !important;border : #ccc 1px solid;border-radius : 3px;display : inline-block;margin : 3px;}.download-mp4 {color : #fff !important;background-color : #c0f;background-image : linear-gradient(to right, #c0f, #90f);}.download-avc {color : #fff !important;background-color : #f00;background-image : linear-gradient(to right, #f00, #c00);}.download-hev {color : #fff !important;background-color : #ffe42b;background-image : linear-gradient(to right, #ffe42b, #dfb200);}.download-aac {color : #fff !important;background-color : #0d0;background-image : linear-gradient(to right, #0d0, #0a0);}.download-flv {color : #fff !important;background-color : #f90;background-image : linear-gradient(to right, #f90, #d70);}.download-type {color : #000 !important;display : table-cell;min-width : 1.5em;padding : 1px 3px;text-align : center;vertical-align : middle;}#bili-old-download-table a {display : table-cell;padding : 3px;text-decoration : none;}.quality-high {background-color : #c0f;}.quality-1080p {background-color : #f00;}.quality-720p {background-color : #f90;}.quality-480p {background-color : #00d;}.quality-360p {background-color : #0d0;}.download-quality {color : #fff !important;padding : 1px 3px;text-align : center;}.download-size {font-size : 90%;margin-top : 2px;padding : 1px 3px;text-align : center;}",
            jointime : ".user .info .meta .row {height : 88px;white-space : normal;}.user .info .jointime .icon {background-position : -209px -84px;}.user .info .jointime .text {color : #00a1d6;}}",
            online : ".online a {color : rgb(109, 117, 122);}.popularize-module .online em {display : inline-block;height : 10px;line-height : 10px;vertical-align : top;border-left : 1px solid rgb(184, 192, 204);margin : 12px 15px 0px;}",
            search : ".search-wrap .search-block .input-wrap input {font : 400 13.3333px Arial !important;}",
            uiface : "#ui-face {box-sizing : content-box;color : #fff;background-color : rgb(255,255,255);border-radius:5px;position : fixed;padding : 4px;bottom : 65px;width : 56px;height : 40px;transition : right 0.7s;-moz-transition : right 0.7s;-webkit-transition : right 0.7s;-o-transition : right 0.7s;z-index : 1008;}#ui-face i {background-position : -471px -982px;display : block;width : 20px;height : 20px;margin : auto;transition : 0.2s;background-image : url(//static.hdslb.com/images/base/icons.png);}#ui-face span {font-size : 14px;display : block;width : 50%;margin : auto;transition : 0.2s;color : rgb(0,0,0)}#ui-table {box-sizing : content-box;color : #fff;background-color : rgb(255,255,255);border-radius:5px;font-size : 14px;position : fixed;padding : 4px;bottom : 30px;right : 58px;width : 200px;height : 360px;line-height : normal;box-shadow : rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border : 1px solid rgb(233, 234, 236);overflow-y : scroll;z-index : 10008;}.checke{float : right;position : relative;-webkit-appearance : none;width : 40px;height : 20px;line-height : 20px;background : #eee;border-radius : 10px;outline : none;border : 2px solid #999999;}.checke:before{position : absolute;left : 0;content : '';width : 12px;height : 12px;border-radius : 50%;background : #eee;box-shadow : 0px 0px 5px #ddd;transition : all 0.2s linear;border : 2px solid #999999;}.checke:checked{   background : #01a1d6;}.checke:checked:before{left : 20px;transition : all 0.2s linear;}#ui-state {border-radius : 5px;z-index : 1000;width : auto;position : fixed;right : 280px;color : #fff;background : #0008;padding : 1rem;font-size : 12pt;top : 50%;transform : translateY(-50%);transition : .2s ease-out .8s;max-width : 20%;line-height : 2;white-space : pre-wrap;pointer-events : none;opacity : 1;}.video_download {cursor : pointer;width : 46px;height : 48px;background-color : #f6f9fa;background-position : -1353px -1095px;background-repeat : no-repeat;border : 1px solid #e5e9ef;overflow : hidden;border-radius : 4px;display : inline-block;background-image : url(//static.hdslb.com/images/base/icons.png);}.video_download:hover {background-color : #00a1d6;border-color : #00a1d6;}.bili-header-m .head-banner{background-position: center 0 !important;background-size: cover !important;}",
            bofqi : "#bofqi .player {width:980px;height:620px;display:block;}@media screen and (min-width:1400px){#bofqi .player{width:1160px;height:720px}}",
            gray : "html {filter:grayscale(100%);-webkit-filter:grayscale(100%);-moz-filter:grayscale(100%);-ms-filter:grayscale(100%);-o-filter:grayscale(100%);filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);-webkit-filter:grayscale(1);}",
            like : ".video-info-module .number .like b, .video-info-module .number .like i {background : url(//static.hdslb.com/images/base/icons.png);display : inline-block;margin-top : -3px;vertical-align : middle;}",
        },
        // 播放器框架
        playerframe : {
            html5player : "https://www.bilibili.com/blackboard/html5player.html", // aid, cid, season_type player_type + &as_wide=1
            playlist : "https://www.bilibili.com/blackboard/playlist-player.html", // pl || aid,cid
            ancient : "https://www.bilibili.com/blackboard/activity-ancient-player.html", // aid,cid
            player : "https://player.bilibili.com/player.html", // aid,cid &| page
        },
        // URL
        url : {
            spacedetial : "https://api.bilibili.com/medialist/gateway/base/spaceDetail", // media_id, pn + &ps=20&keyword=&order=mtime&type=0&tid=0
            channel : "https://api.bilibili.com/x/space/channel/video", // mid, cid, pn + &ps=30&order=0
            biliplus : "https://www.biliplus.com/video/av",
            jijidown : "https://www.jijidown.com/video/av",
            online : "https://api.bilibili.com/x/web-interface/online",
            stat : "https://api.bilibili.com/x/web-interface/archive/stat", // aid
            replymain : "https://api.bilibili.com/x/v2/reply/main", // oid, type, mode &| next
            reply : "https://api.bilibili.com/x/v2/reply", // type,sort,oid,pn
            replycursor : "https://api.bilibili.com/x/v2/reply/reply/cursor", // oid, root, type &| sort
            replydialog : "https://api.bilibili.com/x/v2/reply/dialog/cursor",
            membercard : "https://account.bilibili.com/api/member/getCardByMid", // mid
            season : "https://api.bilibili.com/pgc/view/web/season", // season_id || ep_id
            pagelist : "https://api.bilibili.com/x/player/pagelist", // aid
            view : "https://api.bilibili.com/x/web-interface/view", // aid || bvid
            haslike : "https://api.bilibili.com/x/web-interface/archive/has/like", // aid
            like : "https://api.bilibili.com/x/web-interface/archive/like",
            ids4Player : "https://api.bilibili.com/x/v1/medialist/resource/ids4Player", // media_id
            cards : "https://api.bilibili.com/x/article/cards", // ids
            medialist : "https://api.bilibili.com/x/v1/medialist/detail", // media_id && pn=1&ps=1
            x : "https://api.bilibili.com/x/player/playurl", // avid | bvid, cid, qn + fourk=1&type=&otype=json |+ &fnver=0&fnval=16
            pgc : "https://api.bilibili.com/pgc/player/web/playurl", // avid | bvid, cid, qn + fourk=1&type=&otype=json |+ &fnver=0&fnval=16
            sign : "https://interface.bilibili.com/v2/playurl", // appkey, cid=, otype=json, qn, quality, type
            proj : "https://app.bilibili.com/v2/playurlproj", // appkey, cid=, otype=json, qn
            pgcproj : "https://api.bilibili.com/pgc/player/api/playurlproj", // appkey, cid=, otype=json, platform=android_i, qn
            BPplayurl : "https://www.biliplus.com/BPplayurl.php", // [origin] + &module=pgc&balh_ajax=1
            ranklist : "https://api.bilibili.com/pgc/season/rank/web/list", // season_type, &day=3
            detail : "https://api.bilibili.com/x/web-interface/view/detail" // aid
        },
        // 未识别分区对照表
        sort : {
            1 : [1, "动画", "https://www.bilibili.com/v/douga/"],
            3 : [3, "音乐", "https://www.bilibili.com/v/music/"],
            29 : [3, "音乐现场", "https://www.bilibili.com/v/music/live"],
            36 : [36, "科技", "https://www.bilibili.com/v/technology"],
            86 : [1, "特摄", "https://www.bilibili.com/v/douga/"],
            95 : [188, "手机平板", "https://www.bilibili.com/v/digital/mobile/"],
            129 : [129, "舞蹈", "https://www.bilibili.com/v/dance"],
            155 : [155, "时尚", "https://www.bilibili.com/v/fashion"],
            160 : [160, "生活", "https://www.bilibili.com/v/life"],
            168 : [168, "国创", "https://www.bilibili.com/guochuang"],
            176 : [160, "汽车", "https://www.bilibili.com/v/life/automobile"],
            188 : [188, "数码", "https://www.bilibili.com/v/digital"],
            189 : [188, "电脑装机", "https://www.bilibili.com/v/digital/pc"],
            190 : [188, "数码摄影", "https://www.bilibili.com/v/digital/photography"],
            191 : [188, "影音智能", "https://www.bilibili.com/v/digital/intelligence_av"],
            192 : [155, "风尚标", "https://www.bilibili.com/v/fashion/trends"],
            193 : [3, "MV", "https://www.bilibili.com/v/music/mv"],
            194 : [3, "电音", "https://www.bilibili.com/v/music/electronic"],
            195 : [168, "动态漫·广播剧", "https://www.bilibili.com/v/guochuang/motioncomic"],
            198 : [129, "街舞", "https://www.bilibili.com/v/dance/hiphop"],
            199 : [129, "明星舞蹈", "https://www.bilibili.com/v/dance/star"],
            200 : [129, "中国舞", "https://www.bilibili.com/v/dance/china"],
            201 : [36, "科学科普", "https://www.bilibili.com/v/technology/science"],
            202 : [202, "资讯", "https://www.bilibili.com/v/information/"],
            203 : [202, "热点", "https://www.bilibili.com/v/information/hotspot/"],
            204 : [202, "环球", "https://www.bilibili.com/v/information/global/"],
            205 : [202, "社会", "https://www.bilibili.com/v/information/social/"],
            206 : [202, "综合", "https://www.bilibili.com/v/information/multiple/"],
            207 : [36, "财经", "https://www.bilibili.com/v/technology/finance"],
            208 : [36, "校园学习", "https://www.bilibili.com/v/technology/campus"],
            209 : [36, "职业职场", "https://www.bilibili.com/v/technology/career"],
            210 : [1, "手办·模玩", "https://www.bilibili.com/v/douga/garage_kit"]
        },
        // 播放器通知
        message : [
            ['https://www.bilibili.com/blackboard/activity-4KPC.html', '解锁超清4K画质'],
            ['https://www.bilibili.com/blackboard/activity-4K120FPS-PC.html', '4K120FPS投稿全量开放'],
            ['https://www.bilibili.com/blackboard/bilibili2009.html', '十年前的B站长啥样'],
            ['https://www.bilibili.com/blackboard/html5playerhelp.html', 'HTML5播放器试用'],
        ]
    }

    // 调试模块封装
    const debug = {
        log : (...msg) => console.log("[" + deliver.timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
        error : (...msg) => console.error("[" + deliver.timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
        warn : (...msg) => console.warn("[" + deliver.timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
        debug : (...msg) => console.debug("[" + deliver.timeFormat(new Date()) + "]", "[Bilibili Old]", ...msg),
        msg : (...msg) => {
            let node = document.getElementsByClassName("bilibili-player-video-toast-bottom")[0];
            debug.log(...msg);
            if (!node) return;
            let warn = msg[1] || "", delay = msg[2] || 3000;
            let item = document.createElement("div"),
                text = document.createElement("div"),
                span = document.createElement("span"),
                red = document.createElement("span");
            delay = delay ? delay : 3000;
            item.setAttribute("class","bilibili-player-video-toast-item bilibili-player-video-toast-msg");
            item.appendChild(text);
            text.setAttribute("class","bilibili-player-video-toast-item-text");
            text.appendChild(span);
            if (warn) text.appendChild(red);
            span.setAttribute("class","video-float-hint-text");
            span.innerText = msg[0];
            red.setAttribute("class","video-float-hint-btn hint-red");
            red.innerText = warn ? warn : "";
            node.children[0] ? node.children[0].replaceWith(item) : node.appendChild(item);
            setTimeout(() => item.remove(), delay);
        }
    }

    // XMLHttpReques封装，除同步方法外统一返回promise
    const xhr = {
        // 同步方法
        'false' : (url) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.withCredentials = true;
            xhr.send(null);
            return xhr.responseText;
        },
        // 异步方法
        'true' : (url) => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.withCredentials = true;
                xhr.onload = () => resolve(xhr.response);
                xhr.onerror = () => reject(xhr)
                xhr.send();
            });
        },
        // 跨域方法
        GM : (url) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method  : "GET",
                    url     : url,
                    onload  : (response) => resolve(response.responseText),
                    onerror : (response) => reject(response.status)
                });
            })
        },
        // 表单方法
        post : (url, header, data) => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                header = header ? header : "application/x-www-form-urlencoded";
                xhr.open('post', url, true);
                xhr.setRequestHeader("Content-type", header);
                xhr.withCredentials = true;
                xhr.onload = () => resolve(xhr.response);
                xhr.onerror = () => reject(xhr)
                xhr.send(data);
            });
        }
    }

    // 重构__INITIAL_STATE__
    const INITIAL_STATE = {
        // av/BV
        av : (data) => {
            try {
                data = JSON.parse(data).data;
                aid = aid || data.View.aid;
                cid = cid || data.View.cid;
                let dat = {aid : -1, comment : {count : 0, list : []}, error : {}, isClient : false, p: "", player: "", playurl: {}, related : [], tags : [], upData : {}, videoData : {}}
                dat.aid = data.View.aid;
                dat.related = data.Related;
                dat.tags = data.Tags;
                dat.upData = data.Card.card;
                dat.upData.archiveCount = data.Card.archive_count;
                dat.videoData = data.View;
                dat.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + cid +'&aid=' + aid +'&pre_ad=")'
                return dat;
            }
            catch (e) {debug.error("__INITIAL_STATE__·av", ...e)}
        },
        // bangumi
        bangumi : (epId) => {
            try {
                // rp为api数据，由于api改版，现已修复并默认禁用，保留代码以备不时之需
                let ep = 0, rp = "", mode;
                let ini = JSON.parse(DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/,"").replace(/;\(function/,""));
                let pug = JSON.parse(DOCUMENT.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace(/PGC_USERSTATE__=/,"").replace(/<\/script>/,""));
                let dat = {"ver":{},"loginInfo":{},"canReview":false,"userShortReview":{},"userLongReview":{},"userScore":0,"userCoined":false,"isPlayerTrigger":false,"area":0,"app":false,"mediaRating":{},"recomList":[],"playerRecomList":[],"paster":{},"payPack":{},"payMent":{},"activity":{},"spending":0,"sponsorTotal":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorWeek":{"code":0,"result":{"ep_bp":0,"users":0,"mine":{},"list":[]}},"sponsorTotalCount":0,"miniOn":true,"seasonFollowed":false,"epStat":{},"ssStat":{}};
                dat.special = rp.bkg_cover ? true : (ini.mediaInfo.specialCover ? true : false);
                mode = dat.special ? 1 : 2;
                if (epId) {dat.epId = 1 * epId; ep = 1;}
                else {dat.epId = ""; if (pug.hasOwnProperty("progress")) {dat.epId = pug.progress.last_ep_id; ep = 1;}}
                dat.ssId = rp.season_id || ini.mediaInfo.ssId;
                dat.mdId = ini.mediaInfo.id;
                dat.mediaInfo = {};
                dat.mediaInfo.actors = rp.actors || "";
                dat.mediaInfo.alias = rp.alias || ini.mediaInfo.alias;
                dat.mediaInfo.areas = rp.areas || [];
                dat.mediaInfo.bkg_cover = rp.bkg_cover || ini.mediaInfo.specialCover;
                dat.mediaInfo.cover = rp.cover || ini.mediaInfo.cover;
                dat.mediaInfo.evaluate = rp.evaluate || ini.mediaInfo.evaluate;
                dat.mediaInfo.is_paster_ads = rp.is_paster_ads || 0;
                dat.mediaInfo.jp_title = rp.jp_title || ini.mediaInfo.jpTitle;
                dat.mediaInfo.link = "https://www.bilibili.com/bangumi/media/md" + dat.mdId;
                dat.mediaInfo.media_id = rp.media_id || dat.mdId;
                dat.mediaInfo.mode = rp.mode || mode;
                dat.mediaInfo.paster_text = "";
                dat.mediaInfo.season_id = rp.season_id || ini.mediaInfo.ssId;
                dat.mediaInfo.season_status = rp.season_status || ini.mediaInfo.status;
                dat.mediaInfo.season_title = rp.season_title || ini.mediaInfo.title;
                dat.mediaInfo.season_type = rp.season_type || ini.mediaInfo.ssType;
                dat.mediaInfo.square_cover = rp.square_cover || ini.mediaInfo.squareCover;
                dat.mediaInfo.staff = rp.staff || "";
                dat.mediaInfo.stat = rp.state || ini.mediaInfo.stat;
                dat.mediaInfo.style = rp.style || [];
                dat.mediaInfo.title = rp.title || ini.mediaInfo.title;
                dat.mediaInfo.total_ep = rp.total_ep || ini.epList.length;
                dat.mediaRating = rp.rating || ini.mediaInfo.rating;
                if (rp) {
                    dat.epList = rp.episodes;
                    if (dat.epList[0].cid === -1) for (let i = 0; i < ini.epList.length; i++) dat.epList[i].cid = ini.epList[i].cid;
                    if (ep == 0) dat.epId = (ini.epList[0] && dat.epList[0].id) || "";
                    for (let i = 0; i < dat.epList.length; i++) {
                        dat.epList[i].ep_id = dat.epList[i].id;
                        dat.epList[i].episode_status = dat.epList[i].status;
                        dat.epList[i].index = dat.epList[i].title;
                        dat.epList[i].index_title = dat.epList[i].long_title;
                        if(dat.epList[i].ep_id == dat.epId) dat.epInfo = dat.epList[i];
                    }
                }
                else {
                    dat.epList = [];
                    for (let i = 0; i < ini.sections.length; i++) for (let j = 0; j < ini.sections[i].epList.length; j++) ini.epList.push(ini.sections[i].epList[j]);
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
                    }
                }
                dat.epInfo = dat.epInfo || ini.epInfo;
                dat.newestEp = rp.new_ep || ini.mediaInfo.newestEp;
                dat.seasonList = rp.seasons;
                if (!dat.seasonList) {
                    dat.seasonList = [];
                    for (let i = 0; i < ini.ssList.length; i++) {
                        dat.seasonList[i] = {};
                        dat.seasonList[i].badge = ini.ssList[i].badge;
                        dat.seasonList[i].badge_type = ini.ssList[i].badgeType;
                        dat.seasonList[i].cover = ini.ssList[i].cover;
                        dat.seasonList[i].media_id = -1;
                        dat.seasonList[i].new_ep = {
                            cover : ini.ssList[i].epCover,
                            id : -1,
                            index_show : ini.ssList[i].desc
                        };
                        dat.seasonList[i].season_id = ini.ssList[i].id;
                        dat.seasonList[i].season_title = ini.ssList[i].title;
                        dat.seasonList[i].season_type = ini.ssList[i].type;
                        dat.seasonList[i].stat = {
                            danmaku : 0,
                            follow : 0,
                            view : 0
                        };
                        dat.seasonList[i].title = ini.ssList[i].title;
                    }
                }
                dat.seasonStat = {"views":0, "danmakus":0, "coins":0, "favorites":0};
                dat.userStat = {"loaded":true, "error":false, "follow":0, "pay":0, "payPackPaid":0, "sponsor":0};
                dat.userStat.watchProgress = pug.progress;
                dat.userStat.vipInfo = pug.vip_info;
                dat.upInfo = rp.up_info || {};
                dat.rightsInfo = rp.rights || {};
                dat.pubInfo = rp.publish || {};
                if (!rp) {
                    dat.newestEp.isNew = dat.newestEp.isNew ? 1 : 0
                    dat.upInfo.avatar = ini.mediaInfo.upInfo.avatar;
                    dat.upInfo.follower = "--";
                    dat.upInfo.is_vip = ini.mediaInfo.upInfo.isAnnualVip ? 1 : 0;
                    dat.upInfo.mid = ini.mediaInfo.upInfo.mid;
                    dat.upInfo.pendant = {
                        image : ini.mediaInfo.upInfo.pendantImage,
                        name : ini.mediaInfo.upInfo.pendantName,
                        pid : ini.mediaInfo.upInfo.pendantId
                    };
                    dat.upInfo.uname = ini.mediaInfo.upInfo.name;
                    dat.upInfo.verify_type = 6;
                    if (dat.upInfo.mid < 1) dat.upInfo = {avatar : "//i0.hdslb.com/bfs/app/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg", follower : 897603, is_vip : 1, mid : 2, pendant : {image : "http://i2.hdslb.com/bfs/garb/item/cd3e9a6fa18db9ebdc128b0fef64cb32c5aab854.png", name : "如果历史是一群喵", pid : 1141}, uname : "碧诗", verify_type : 2}
                    dat.rightsInfo.allow_bp = ini.mediaInfo.rights.allowBp ? 1 : 0;
                    dat.rightsInfo.allow_download = 1;
                    dat.rightsInfo.allow_review = ini.mediaInfo.rights.allowReview ? 1 : 0;
                    dat.rightsInfo.copyright = "bilibili";
                    dat.rightsInfo.is_preview = ini.mediaInfo.rights.isPreview ? 1 : 0;
                    dat.rightsInfo.watch_platform = 0;
                    dat.pubInfo.is_finish = ini.mediaInfo.pub.isFinish ? 1 : 0;
                    dat.pubInfo.is_started = ini.mediaInfo.pub.isStart ? 1 : 0;
                    dat.pubInfo.pub_time = ini.mediaInfo.pub.time;
                    dat.pubInfo.pub_time_show = ini.mediaInfo.pub.timeShow;
                    dat.pubInfo.weekday = -1;
                }
                if (pug.dialog || pug.pay == 1) {
                    dat.payMent = {"price":"0.0", "promotion":"", "tip":"大会员专享观看特权哦~"};
                    if (pug.dialog) {
                        dat.payMent.vip_promotion = pug.dialog.title;
                        if (pug.dialog.btn_left) dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];
                    }
                }
                return dat;
            }
            catch(e) {debug.error("__INITIAL_STATE__·Bangumi", ...e)}
        },
        // 主页
        home : (data) => {
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
                if (config.reset.adloc) for (let key in dat.locsData) if (dat.locsData[key]) for (let i = dat.locsData[key].length - 1; i >= 0; i--) if (dat.locsData[key][i].is_ad) {debug.log("移除广告", key, dat.locsData[key][i]);dat.locsData[key].splice(i, 1);}
                if (dat.locsData[31][0] && dat.locsData[31][0].id == 0) dat.locsData[31] = [{"id":36585,"contract_id":"","pos_num":1,"name":"小黑屋弹幕举报","pic":"https://i0.hdslb.com/bfs/archive/0aa2f32c56cb65b6d453192a3015b65e62537b9a.jpg","litpic":"","url":"https://www.bilibili.com/blackboard/activity-dmjbfj.html","style":0,"agency":"","label":"","intro":"","creative_type":0,"request_id":"1546354354629q172a23a61a62q626","src_id":32,"area":0,"is_ad_loc":true,"ad_cb":"","title":"","server_type":0,"cm_mark":0,"stime":1520478000,"mid":"14629218"}];
                return dat;
            }
            catch(e) {debug.error("__INITIAL_STATE__·Home", ...e)}
        }
    }

    // xhr hook，包括原生XMLHttpRequest和$.ajax中的jsonp
    const intercept = {
        init : () => {
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
                            let header = [{"name":"Header Length","key":"headerLen","qg":2,"offset":4,"value":16},{"name":"Protocol Version","key":"ver","qg":2,"offset":6,"value":1},{"name":"Operation","key":"op","qg":4,"offset":8,"value" : option},{"name":"Sequence Id","key":"seq","qg":4,"offset":12,"value":1}];
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
                    let Pl = {"WS_OP_HEARTBEAT":2,"WS_OP_HEARTBEAT_REPLY":3,"WS_OP_DATA":1000,"WS_OP_BATCH_DATA":9,"WS_OP_DISCONNECT_REPLY":6,"WS_OP_USER_AUTHENTICATION":7,"WS_OP_CONNECT_SUCCESS":8,"WS_OP_CHANGEROOM":12,"WS_OP_CHANGEROOM_REPLY":13,"WS_OP_REGISTER":14,"WS_OP_REGISTER_REPLY":15,"WS_OP_UNREGISTER":16,"WS_OP_UNREGISTER_REPLY":17,"WS_OP_OGVCMD_REPLY":1015,"WS_PACKAGE_HEADER_TOTAL_LENGTH":18,"WS_PACKAGE_OFFSET":0,"WS_HEADER_OFFSET":4,"WS_VERSION_OFFSET":6,"WS_OPERATION_OFFSET":8,"WS_SEQUENCE_OFFSET":12,"WS_COMPRESS_OFFSET":16,"WS_CONTENTTYPE_OFFSET":17,"WS_BODY_PROTOCOL_VERSION":1,"WS_HEADER_DEFAULT_VERSION":1,"WS_HEADER_DEFAULT_OPERATION":1,"ws_header_default_sequence":1,"WS_HEADER_DEFAULT_COMPRESS":0,"WS_HEADER_DEFAULT_CONTENTTYPE":0};
                    // 请求头的参数表
                    let wsBinaryHeaderList = [{"name":"Header Length","key":"headerLen","bytes":2,"offset":4,"value":18},{"name":"Protocol Version","key":"ver","bytes":2,"offset":6,"value":1},{"name":"Operation","key":"op","bytes":4,"offset":8,"value":7},{"name":"Sequence Id","key":"seq","bytes":4,"offset":12,"value":2},{"name":"Compress","key":"compress","bytes":1,"offset":16,"value":0},{"name":"ContentType","key":"contentType","bytes":1,"offset":17,"value":0}]
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
                                        // 对于心跳包,服务器响应当前在线人数的数据
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
            // 原生xhr hook
            XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                let _url = url, hook = [_url, ""];
                let obj = deliver.search2obj(url);
                // 替换视频心跳
                if (url.includes('api.bilibili.com/x/report/web/heartbeat') && config.reset.heartbeat) {
                    url = url.replace('api.bilibili.com/x/report/web/heartbeat', 'api.bilibili.com/x/click-interface/web/heartbeat');
                    debug.log("XHR重定向", "替换视频心跳", [_url, url]);
                }
                // 显示历史视频
                if (url.includes('api.bilibili.com/x/web-interface/history/cursor') && url.includes("business") && config.reset.history) {
                    let max = obj.max || "", view_at = obj.view_at || "";
                    url = deliver.obj2search("//api.bilibili.com/x/web-interface/history/cursor", {max : max, view_at : view_at, type : "archive", ps : 20});
                    debug.log("XHR重定向", "显示历史视频", [_url, url]);
                }
                // 修改正在直播
                if (url.includes('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList')) {
                    this.addEventListener('readystatechange', () => {if ( this.readyState === 4 ) intercept.biliIndexRec(this, hook)});
                    url = hook[1] = url.replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web');
                }
                // 修改直播动态
                if (url.includes('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore')) {
                    this.addEventListener('readystatechange', () => {if ( this.readyState === 4 ) intercept.biliIndexRec(this, hook)});
                    url = hook[1] = url.replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web');
                }
                // 重定向番剧信息
                if (url.includes('bangumi.bilibili.com/view/web_api/season?')) {
                    this.addEventListener('readystatechange', () => {if ( this.readyState === 4 ) intercept.season(this, hook)});
                    url = hook[1] = url.replace('bangumi.bilibili.com/view/web_api/season', 'api.bilibili.com/pgc/view/web/season');
                }
                // 修改直播数据
                if (url.includes('api.live.bilibili.com/xlive/web-room/v1/index/getRoomPlayInfo')) {
                    this.addEventListener('readystatechange', () => {if ( this.readyState === 4 ) intercept.getRoomPlayInfo(this, hook)});
                }
                // 修改播放器通知
                if (url.includes('api.bilibili.com/x/player/carousel')) {
                    this.addEventListener('readystatechange', () => {if ( this.readyState === 4 ) intercept.carousel(this)});
                }
                // 修改区域限制
                if (url.includes('bangumi.bilibili.com/view/web_api/season/user/status')) {
                    this.addEventListener('readystatechange', () => {if ( this.readyState === 4 ) intercept.status(this)});
                }
                // 监听视频链接
                if (url.includes("/playurl?")) {
                    if (!url.includes("fourk") && !url.includes("sign")) {
                        url = url.replace("playurl?", "playurl?fourk=1&");
                        debug.log("XHR重定向", "添加4K参数", [_url, url]);
                    }
                    cid = obj.cid || cid;
                    aid = obj.avid || aid;
                    bvid = obj.bvid || deliver.convertId(aid) || bvid;
                    pgc = url.includes("pgc") ? true : false;
                    if (limit) this.url = url;
                    this.addEventListener('readystatechange', () => {if ( this.readyState === 4 ) intercept.playinfo(this, url)});
                }
                // 修改弹幕链接
                if (url.includes("list.so") && config.reset.danmuku) {
                    // 这时pakku.js已经修改了xhr对象，需要另做处理
                    if (this.pakku_url) {
                        segRequestOnlyOnce = true;
                        let oid = unsafeWindow.cid;
                        let pid = unsafeWindow.aid;
                        // 更改pakku.js请求的url，使它过滤分段弹幕
                        this.pakku_url = url = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + oid + "&pid=" + pid + "&segment_index=1";
                        this.responseType = "arraybuffer";
                        let xhr = this;
                        let cb = [];
                        for (let i in this.pakku_load_callback) {
                            cb[i] = this.pakku_load_callback[i];
                        }
                        for (let i in this.pakku_load_callback) {
                            // 将pakku.js返回的数据转换回xml
                            this.pakku_load_callback[i] = function () {
                                deliver.toXml(protoSeg.decode(new Uint8Array(xhr.response)).elems, pid).then(function (xml) {
                                    xhr.response = xhr.responseText = xml;
                                    cb[i].call(xhr);
                                });
                            }
                        }
                    } else {
                        this.reqURL = url;
                    }
                }
                return open.call(this, method, url, ...rest);
            }
            // 部分功能依赖hook `XMLHttpRequest.prototype.send`
            if (config.reset.xhrhook) {
                XMLHttpRequest.prototype.send = async function (...arg) {
                    // 条件分别对应        |没有开启pakku.js|pakku.js休眠中，钩子捕捉到的首次对seg.so的请求|
                    // (pakku.js正常运行时这个send()不会被调用)
                    if (config.reset.danmuku && (this.reqURL || (this.pakku_url && this.pakku_url.includes("seg.so") && segRequestOnlyOnce))) {
                        if (this.pakku_url && this.pakku_url.includes("seg.so")) segRequestOnlyOnce = false;
                        // 对于没有pakku.js的情况，模拟一个xhr响应
                        Object.defineProperty(this, "response", { writable : true });
                        Object.defineProperty(this, "responseText", { writable : true });
                        Object.defineProperty(this, "readyState", { writable : true });
                        Object.defineProperty(this, "status", { writable : true });
                        this.readyState = 4;
                        this.status = 200;
                        this.abort();
                        let cid = unsafeWindow.cid;
                        let pid = unsafeWindow.aid;
                        let callBack = this.callBack;
                        let xhr = this;
                        let protoSegments = [];
                        getSegConfig().then(getAllSeg);
                        // 获得所有分段
                        function getAllSeg(config) {
                            let total = config.dmSge.total;
                            let allrequset = [];
                            for (let index = 1; index <= total; index++) {
                                allrequset.push(new Promise(function (resolve) {
                                    let xhr = new XMLHttpRequest();
                                    xhr.addEventListener("load", function () {
                                        protoSegments[index] = xhr.response;
                                        resolve();
                                    });
                                    xhr.open("get", "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + cid + "&pid=" + pid + "&segment_index=" + index);
                                    xhr.responseType = "arraybuffer";
                                    xhr.send();
                                }));
                            }
                            // 完成所有的网络请求大概要300ms
                            Promise.all(allrequset).then(function () {
                                let Segments = [];
                                protoSegments.forEach(function (seg) {
                                    Segments = Segments.concat(protoSeg.decode(new Uint8Array(seg)).elems);
                                });
                                deliver.toXml(Segments, pid).then(function (toXml) {
                                    callBack.forEach(function (f) {
                                        xhr.response = xhr.responseText = toXml;
                                        f.call(xhr);
                                    });
                                    // 备份弹幕
                                    xml = xhr.response;
                                    debug.log("载入新版弹幕");
                                });
                            });
                        }
                        function getSegConfig() {
                            return new Promise(function (resolve) {
                                let xhr = new XMLHttpRequest();
                                xhr.addEventListener("load", function () {
                                    let res = protoView.decode(new Uint8Array(xhr.response));
                                    resolve(res);
                                });
                                xhr.open("get", "https://api.bilibili.com/x/v2/dm/web/view?type=1&oid=" + cid + "&pid=" + pid);
                                xhr.responseType = "arraybuffer";
                                xhr.send();
                            });

                        }
                    }
                    else if (this.url) {
                        try {
                            // 解除限制
                            Object.defineProperty(this, "response", { writable : true });
                            Object.defineProperty(this, "responseText", { writable : true });
                            Object.defineProperty(this, "readyState", { writable : true });
                            Object.defineProperty(this, "status", { writable : true });
                            this.abort();
                            let response;
                            if (limit) {
                                response = {"code":0,"message":"success","result":{}};
                                response.result = JSON.parse(await xhr.true(API.url.BPplayurl + "?" + this.url.split("?")[1] + "&module=pgc&balh_ajax=1"));
                            }
                            this.response = response;
                            this.responseText = JSON.stringify(response);
                            this.status = 200;
                            this.readyState = 3;
                            this.readyState = 4;
                            this.onreadystatechange();
                            __playinfo__ = response;
                            debug.log("解除限制", "aid=", aid, "cid=", cid);
                            if (!response.data && !response.result) throw [response];
                        }
                        catch(e) {debug.error("解除限制", ...e)}
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
            function jsonp(){
                const ajax = unsafeWindow.$.ajax;
                unsafeWindow.$.ajax = function (obj, ...rest) {
                    if (obj) {
                        if (obj.dataType == "jsonp") {
                            let _obj = JSON.parse(JSON.stringify(obj));
                            if (obj.url.includes("region") && obj.data.rid == 165) {
                                // 替换广告区rid为资讯区rid
                                obj.data.rid = 202;
                                debug.log("JSONP重定向", "替换广告区", [_obj, obj]);
                            }
                            if (obj.url.includes("region") && obj.data.original == 1) {
                                // 替换原创排行为全部排行
                                obj.data.original = 0;
                                debug.log("JSONP重定向", "修复原创排行", [_obj, obj]);
                            }
                            if (obj.url.includes('api.bilibili.com/x/web-interface/ranking/index')) {
                                // 修改置顶推荐
                                obj.url = obj.url.replace('ranking/index', 'index/top');
                                debug.log("JSONP重定向", "修复置顶推荐", [_obj, obj]);
                            }
                        }
                    }
                    return ajax.call(this, obj, ...rest);
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
                },10);
                setTimeout(() => clearInterval(timer), 5000);
            }
        },
        // 修改首页直播推荐数据
        biliIndexRec : (obj, hook = []) => {
            try {
                hook.push(JSON.parse(obj.responseText));
                let response = obj.responseText.replace(/preview_banner_list/, "preview").replace(/ranking_list/, "ranking").replace(/recommend_room_list/, "recommend");
                response = JSON.parse(response);
                response.data.text_link = {text : "233秒居然能做这些！", link : "//vc.bilibili.com"};
                if (response.data.recommend) {
                    for (let i = 0; i < response.data.recommend.length; i++) {
                        response.data.recommend[i].pic = response.data.recommend[i].cover;
                        response.data.recommend[i].link = "//live.bilibili.com" + response.data.recommend[i].link;
                    }
                }
                if (response.data.preview) for (let i = 0; i < response.data.preview.length; i++) response.data.preview[i].url = response.data.preview[i].link;
                hook.push(response);
                debug.log("XHR重定向", "修复正在直播", hook);
                Object.defineProperty(obj, 'response', {writable : true});
                Object.defineProperty(obj, 'responseText', {writable : true});
                obj.response = obj.responseText = JSON.stringify(response);
            }
            catch(e) {debug.error("首页推荐", ...e)}
        },
        // 修复番剧季度信息
        season : (obj, hook = []) => {
            try {
                hook.push(JSON.parse(obj.responseText));
                let response = JSON.parse(obj.responseText);
                for (let i = 0; i < response.result.episodes.length; i++){
                    response.result.episodes[i].ep_id = response.result.episodes[i].id;
                    response.result.episodes[i].episode_status = response.result.episodes[i].status;
                    response.result.episodes[i].index = response.result.episodes[i].title;
                    response.result.episodes[i].index_title = response.result.episodes[i].long_title;
                }
                hook.push(response);
                debug.log("XHR重定向", "番剧季度信息", hook);
                Object.defineProperty(obj, 'response', {writable : true});
                Object.defineProperty(obj, 'responseText', {writable : true});
                obj.response = obj.responseText = JSON.stringify(response);
            }
            catch(e) {debug.error("番剧季度信息", ...e)}
        },
        // 修改直播数据
        getRoomPlayInfo : (obj, hook = []) => {
            if (!config.reset.roomplay) return;
            try {
                hook.push(JSON.parse(obj.responseText));
                let response = obj.responseText;
                response = JSON.parse(response);
                if (response.data) {
                    response.data.live_status = 0;
                    response.data.live_time = -1;
                    response.data.play_url = null;
                }
                hook.push(response);
                debug.log("XHR重定向", "拦截直播媒体", hook);
                Object.defineProperty(obj, 'response', {writable : true});
                Object.defineProperty(obj, 'responseText', {writable : true});
                obj.response = obj.responseText = JSON.stringify(response);
            }
            catch(e) {debug.error("直播拦截", ...e)}
        },
        // 生成播放信息
        carousel : (obj) => {
            if (!config.reset.carousel) return;
            try {
                let msg = deliver.randomArray(API.message, 2);
                let xmltext = '<msg><item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="2320" id="314825"><![CDATA[<a href="' + msg[0][0] + '" target="_blank"><font color="#FFFFFF">' + msg[0][1] + '</font></a>]]></item><item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="2321" id="314372"><![CDATA[<a href="' + msg[1][0] + '" target="_blank"><font color="#FFFFFF">' + msg[1][1] + '</font></a>]]></item></msg>';
                let parser = new DOMParser(),
                    responseXML = parser.parseFromString(xmltext, "text/xml");
                Object.defineProperty(obj, 'responseXML', {writable : true});
                obj.responseXML = responseXML;
            }
            catch(e) {debug.error("播放通知", ...e)}
        },
        // 强制载入播放器
        status : (obj) => {
            try {
                let response = JSON.parse(obj.responseText);
                if (response.result) {
                    if (config.reset.limit && response.result.area_limit){
                        response.result.area_limit = 0;
                        limit = true;
                    }
                    if (response.result.pay) big = 0;
                    if (!response.result.pay && config.big && response.result.dialog) {
                        response.result.pay = 1;
                        big = true;
                    }
                    if (limit || big) {
                        Object.defineProperty(obj, 'response', {writable : true});
                        Object.defineProperty(obj, 'responseText', {writable : true});
                        obj.response = obj.responseText = JSON.stringify(response);
                    }
                }
            }
            catch (e) {debug.error("强制启用播放器", ...e)}
        },
        // 监听视频地址
        playinfo : (obj) => {
            try {
                if (!obj.response) throw [obj];
                __playinfo__ = typeof obj.response == "object" ? obj.response : JSON.parse(obj.response);
                // 刷新下载面板
                if (document.getElementById("bili-old-download-table")) deliver.download.setTable();
            }
            catch (e) {debug.error("视频监听", ...e)}
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

    // 函数统一接口
    const deliver = {
        // 格式化时间戳，默认返回hh：mm：ss；指定type加上yy：mm：dd
        timeFormat : (time,type) => {
            let date = new Date(time);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
            let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            let m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            let s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
            return type ? Y + M + D + h +m + s : h + m + s;
        },
        // 格式化字节，逢千换单位，最高到G字节
        sizeFormat : (size) => {
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
        unitFormat : (num) => {
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
        // 数组冒泡排序，指定rev逆序
        bubbleSort : (arr, rev) => {
            let temp=[];
            rev = rev ? true : false;
            for (let i = 0; i < arr.length - 1; i++) {
                let bool = true;
                for (let j = 0; j < arr.length - 1 - i; j++) {
                    if(arr[j] > arr[j+1]){
                        temp = arr[j];
                        arr[j] = arr[j+1];
                        arr[j+1] = temp;
                        bool = false;
                    }
                }
                if (bool) break;
            }
            if (rev) return arr.reverse();
            return arr;
        },
        // 数组随机提取，num指定随机提取几个
        randomArray : (arr, num) => {
            let out = [];
            num = num || 1;
            num = num < arr.length ? num : arr.length;
            while(out.length < num){
                var temp = (Math.random()*arr.length) >> 0;
                out.push(arr.splice(temp,1)[0]);
            }
            return out;
        },
        // bv/av互转，算法见https://www.zhihu.com/question/381784377/answer/1099438784
        convertId : (str) => {
            let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            let tr = {}, s = [11, 10, 3, 8, 4, 6], xor = 177451812, add = 8728348608;
            for (let i = 0; i < 58; i++) tr[table[i]] = i;
            if (!(1 * str)) {
                // str为字符串(BVxxxxxxxxxx)则转化为aid(纯数字)
                let r = 0;
                for (let i = 0; i < 6; i++) r += tr[str[s[i]]]*58**i;
                return (r-add)^xor;
            }
            else {
                // str为数字(aid)则转化为BV(BVxxxxxxxxxx)
                str = (str^xor) + add;
                let r = ['B', 'V', 1, '', '', 4, '', 1, '', 7, '', ''];
                for (let i = 0; i < 6; i++) r[s[i]] = table[parseInt(str/58**i)%58];
                return r.join("");
            }
        },
        // key secret，见https://github.com/Henryhaohao/Bilibili_video_download
        sign : () => {
            let table = 'rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg', str = '';
            for (let i = table.length -1; i >= 0; i--) str = str + String.fromCharCode(table[i].charCodeAt() + 2);
            return str.split(':')
        },
        // 对象转url的查询部分
        obj2search : (url, obj) => {
            if (obj) {
                let arr = [],i = 0;
                for (let key in obj) {
                    if(obj[key] !== "" && obj[key] !== "undefined" && obj[key] !== null) {
                        arr[i] = key + "=" + obj[key];
                        i++;
                    }
                }
                if (url) url = url + "?" + arr.join("&");
                else url = arr.join("&");
            }
            return url;
        },
        // 提取url查询部分成对象
        search2obj : (url) => {
            url = url.split('#')[0];
            url = url.split('?')[1] ? url.split('?')[1].split('&') : "";
            if (!url) return;
            let obj = {};
            for (let i = 0; i < url.length; i++) obj[url[i].split('=')[0]] = url[i].split('=')[1];
            return obj;
        },
        // cookies对象，通过属性访问键值
        getCookies : () => {
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
        toXml : (danmaku, pid) => {
            return new Promise(function (resolve) {
                //按出现时间排序弹幕，能避免反复插入dom元素，明显提高性能
                //排序后40000条弹幕旧播放器能在1秒左右处理完
                danmaku.sort(function (a, b) {
                    return a.progress - b.progress;
                });
                let dom = (new DOMParser()).parseFromString('<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.com</chatserver><chatid>' + cid + '</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source></i>', "text/xml");
                let root = dom.childNodes[0];
                let d, attr, dmk;
                for (let i in danmaku) {
                    dmk = danmaku[i];
                    d = dom.createElement("d");
                    attr = [dmk.progress / 1000, dmk.mode, dmk.fontsize, dmk.color, dmk.ctime, 0, dmk.midHash, dmk.id];
                    d.setAttribute("p", attr.join(","));
                    d.appendChild(dom.createTextNode(dmk.content));
                    root.appendChild(d);
                }
                resolve(new XMLSerializer().serializeToString(dom));
            });
        },
        // 添加全局样式
        setGlobalStyle : async () => {
            let csss = API.style.uiface;
            let style = document.createElement("style");
            csss = csss + API.style.online;
            csss = csss + API.style.search;
            csss = csss + API.style.download;
            if (config.reset.playershadow) csss = csss + API.style.playshadow;
            if (config.reset.like) csss = csss + API.style.like;
            style.setAttribute("type", "text/css");
            if (document.head) document.head.appendChild(style);
            style.appendChild(document.createTextNode(csss));
        },
        // 重写网页
        write : (html) => {
            document.open();
            document.write(html);
            document.close();
        },
        // 重写版面
        reSction : async () => {
            if (!config.reset.grobalboard) return;
            document.getElementById("internationalHeader").setAttribute("style", "visibility:hidden;");
            let newh = document.createElement("div");
            let script = document.createElement("script");
            let foot = document.getElementsByClassName("international-footer");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", "//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
            if(document.getElementsByClassName("mini-type")[0]) {
                if (location.href.includes("blackboard/topic_list") || location.href.includes("blackboard/x/act_list")) newh.setAttribute("class", "z-top-container has-menu");
                else newh.setAttribute("class", "z-top-container");
            }
            else newh.setAttribute("class", "z-top-container has-menu");
            document.body.insertBefore(newh,document.body.firstChild);
            document.body.insertBefore(script,document.body.firstChild);
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
            window.setTimeout(() => {deliver.resetNodes()}, 3000);
        },
        // 下载视频
        download : {
            // 创建播放器右键菜单
            init : async (node) => {
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
            setTable : async () => {
                debug.msg("正在获取视频链接", ">>>");
                let qua = {120 : "4K", 116 : "1080P60", 112 : "1080P+", 80 : "1080P", 74 : "720P60", 64 : "720P", 48 : "720P", 32 : "480P", 16 : "360P"};
                let bps = {30216 : "64kbps", 30232 : "128kbps", 30280 : "320kbps"}
                let path = __playinfo__ ? (__playinfo__.data ? __playinfo__.data : (__playinfo__.durl ? __playinfo__ : __playinfo__.result)) : "";
                try {
                    url = url ? url : ((path && path.durl) ? [await deliver.download.geturl()] : await Promise.all([deliver.download.geturl(), deliver.download.geturl("flv")]));
                    if (url[1]) path.durl = url[1].data ? url[1].data.durl : url[1].result.durl;
                }
                catch(e) {debug.log(url);url = [1]}
                try {
                    // 获取mp4
                    if (url[0] && url[0].durl) {
                        url = url[0];
                        mdf.mp4 = [["1080P", url.durl[0].url.replace("http:", ""), deliver.sizeFormat(url.durl[0].size)]];
                        navigator.clipboard.writeText(url.durl[0].url);
                    }
                    else debug.log("下载配置", config.big ? url : "获取mp4链接失败 ಥ_ಥ");
                    if (__playinfo__ && (__playinfo__.durl || __playinfo__.data || __playinfo__.result)) {
                        // 获取flv
                        if (path.durl) {
                            // durl可能是mp4
                            if (path.durl[0] && path.durl[0].url.includes("mp4?")) {
                                if (!mdf.mp4) mdf.mp4 = [];
                                mdf.mp4.push([qua[path.quality],path.durl[0].url.replace("http:", ""), deliver.sizeFormat(path.durl[0].size)]);
                            }
                            else {
                                mdf.flv = [];
                                for (let i = 0; i < path.durl.length; i++) mdf.flv.push([qua[path.quality], path.durl[i].url.replace("http:", ""), deliver.sizeFormat(path.durl[i].size)]);
                            }
                        }
                        // 获取DASH
                        if (path.dash) {
                            mdf.dash = {}
                            // 获取视频流
                            if (path.dash.video) {
                                for (let i = 0; i < path.dash.video.length; i++) {
                                    if (path.dash.video[i].codecs.startsWith("avc")) {
                                        if (!mdf.dash.avc) mdf.dash.avc = [];
                                        mdf.dash.avc.push([qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), deliver.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8)]);
                                    }
                                    else {
                                        if (!mdf.dash.hev) mdf.dash.hev = [];
                                        mdf.dash.hev.push([qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), deliver.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8)]);
                                    }
                                }
                            }
                            // 获取音频流
                            if (path.dash.audio) {
                                for (let i = 0; i < path.dash.audio.length; i++) {
                                    if (!mdf.dash.aac) mdf.dash.aac = [];
                                    mdf.dash.aac.push([path.dash.audio[i].id, path.dash.audio[i].baseUrl.replace("http:", ""), deliver.sizeFormat(path.dash.audio[i].bandwidth * path.dash.duration / 8)]);
                                }
                                // 倒序音频
                                mdf.dash.aac = deliver.bubbleSort(mdf.dash.aac, true);
                                // 标注大概码率
                                for (let i = 0; i < mdf.dash.aac.length; i++) if (mdf.dash.aac[i][0] in bps) mdf.dash.aac[i][0] = bps[mdf.dash.aac[i][0]];
                            }
                        }
                        // 获取弹幕
                        if (xml) {
                            let blob = new Blob([xml]);
                            mdf.xml = [];
                            bloburl.xml = URL.createObjectURL(blob);
                            mdf.xml.push(["弹幕", bloburl.xml, deliver.sizeFormat(blob.size)]);
                        }
                        else {
                            mdf.xml = [];
                            mdf.xml.push(["弹幕", "//api.bilibili.com/x/v1/dm/list.so?oid=" + cid, "--------"]);
                        }
                        // 获取其他
                        if (__INITIAL_STATE__) {
                            mdf.xml = mdf.xml || [];
                            mdf.xml.push(["封面", (__INITIAL_STATE__.videoData && __INITIAL_STATE__.videoData.pic || __INITIAL_STATE__.mediaInfo.cover).replace("http:", ""), "--------"]);
                            if (__INITIAL_STATE__.mediaInfo && __INITIAL_STATE__.mediaInfo.bkg_cover) mdf.xml.push(["海报", __INITIAL_STATE__.mediaInfo.bkg_cover.replace("http:", ""), "--------"]);
                            if (__INITIAL_STATE__.mediaInfo && __INITIAL_STATE__.mediaInfo.specialCover) mdf.xml.push(["海报", __INITIAL_STATE__.mediaInfo.specialCover.replace("http:", ""), "--------"]);
                            if (__INITIAL_STATE__.videoData && __INITIAL_STATE__.videoData.subtitle && __INITIAL_STATE__.videoData.subtitle.list) for (let i = 0; i < __INITIAL_STATE__.videoData.subtitle.list.length; i++) mdf.xml.push([__INITIAL_STATE__.videoData.subtitle.list[i].lan_doc, __INITIAL_STATE__.videoData.subtitle.list[i].subtitle_url.replace("http:", ""), "--------"]);
                        }
                    }
                    deliver.download.item();
                    mdf = {};
                }
                catch(e) {debug.error("下载配置", ...e)}
            },
            // 拉取mp4链接
            geturl : async (...arg) => {
                let url = deliver.download.playurl(...arg);
                try {
                    if (!url) throw [url];
                    let data = await xhr.GM(url);
                    return JSON.parse(data);
                }
                catch(e) {debug.error("下载拉取", e);}
            },
            // 配置视频链接
            playurl : (type, qn) => {
                let obj = {}
                let sign = deliver.sign();
                aid = aid || unsafeWindow.aid;
                cid = cid || unsafeWindow.cid;
                qn = qn || 120;
                type = type || "mp4";
                if (!cid) return;
                switch(type){
                    case 'dash' : if (pgc) return deliver.obj2search(API.url.pgc, {avid : aid, cid : cid, qn : qn, fourk : 1, otype : 'json', fnver : 0, fnval : 16});
                        else return deliver.obj2search(API.url.x, {avid : aid, cid : cid, qn : qn, fourk : 1, otype : 'json', fnver : 0, fnval : 16});
                        break;
                    case 'flv' : if (pgc) return deliver.obj2search(API.url.pgc, {avid : aid, cid : cid, qn : qn, fourk : 1, otype : 'json'});
                        else return deliver.obj2search(API.url.x, {avid : aid, cid : cid, qn : qn, fourk : 1, otype : 'json'});
                        break;
                    case 'off' : obj = {appkey : sign[0], cid : cid, otype : 'json', qn : qn, quality : qn, type : ''}
                        obj.sign = md5(deliver.obj2search("", obj) + sign[1]);
                        return deliver.obj2search(API.url.sign, obj);
                        break;
                    case 'mp4' : obj = {appkey : sign[0], cid : cid, otype : 'json', platform : 'android_i', qn : 208}
                        obj.sign = md5(deliver.obj2search("", obj) + sign[1]);
                        if (pgc) return deliver.obj2search(API.url.pgcproj, obj);
                        return deliver.obj2search(API.url.proj, obj);
                        break;
                }
            },
            // 创建下载面板
            item : () => {
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
                if (!mdf.mp4 && !mdf.flv && !mdf.dash) throw ["未找到任何视频链接", "ಥ_ಥ", mdf];
                function addBox(obj, name, type, quatily){
                    let box = document.createElement("div");
                    box.setAttribute("class", "download-box");
                    let tab = document.createElement("div");
                    tab.setAttribute("class", "download-type " + type);
                    tab.innerHTML = name;
                    box.appendChild(tab);
                    top.appendChild(box);
                    switch (name) {
                        case "mp4" : name = ".mp4"; break;
                        case "avc" : name = ".m4v"; break;
                        case "hev" : name = ".m4v"; break;
                        case "aac" : name = ".m4a"; break;
                        case "其他" : name = ".xml"; break;
                    }
                    let qua = quatily;
                    for (let i = 0; i < obj.length; i++) {
                        switch (qua || obj[i][0]) {
                            case "1080P" : quatily = "quality-1080p"; break;
                            case "720P" : quatily = "quality-720p"; break;
                            case "480P" : quatily = "quality-480p"; break;
                            case "360P" : quatily = "quality-360p"; break;
                            case "320kbps" : quatily = "quality-720p"; break;
                            case "128kbps" : quatily = "quality-480p"; break;
                            case "64kbps" : quatily = "quality-360p"; break;
                            default : quatily = "quality-high";
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
                top = document.createElement("div");
                top.setAttribute("id", "bili-old-download-table");
                if (mdf.mp4) addBox(mdf.mp4, "mp4", "download-mp4");
                if (mdf.dash) {
                    if (mdf.dash.avc) addBox(mdf.dash.avc, "avc", "download-avc");
                    if (mdf.dash.hev) addBox(mdf.dash.hev, "hev", "download-hev");
                    if (mdf.dash.aac) addBox(mdf.dash.aac, "aac", "download-aac");
                }
                if (mdf.flv) addBox(mdf.flv, "flv", "download-flv");
                if (mdf.xml) addBox(mdf.xml, "其他", "download-xml", "360P");
                document.body.appendChild(top);
                debug.msg("右键另存为或右键IDM下载", "详见脚本简介", 3000);
                top.onmouseover = () => window.clearTimeout(timer);
                top.onmouseout = () => {timer = window.setTimeout(() => {
                    top.remove();
                    if (bloburl.xml) {
                        window.URL.revokeObjectURL(bloburl.xml);
                        bloburl.xml = "";
                    }
                }, 1000)};
            }
        },
        // 切p相关
        switchVideo : async () => {
            let title = document.getElementsByTagName("h1")[0] ? document.getElementsByTagName("h1")[0].title : "";
            if (config.reset.download) {url = "";mdf = {};};
            if (!config.reset.selectdanmu) return;
            let danmu = document.getElementsByClassName("bilibili-player-filter-btn")[1];
            if (danmu) danmu.click();
        },
        // 付费预览
        removePreview : async (node) => {
            try {
                if (!config.reset.preview) return;
                let hint = document.getElementsByClassName("video-float-hint-text")[0];
                // 倒计时长度，单位：秒
                let i = 10;
                let sec = document.createElement("span");
                sec.setAttribute("class", "video-float-hint-btn second-cut");
                hint.parentNode.appendChild(sec);
                function cut(){
                    sec.innerText = i - 1 + "s";
                    if (i==0) {
                        node.remove();
                        return;
                    }
                    i = i - 1;
                    window.setTimeout(cut,1000);
                }
                new cut();
            }
            catch(e) {debug.error("付费预览", ...e)}
        },
        // 超链接转化
        avdesc : async () => {
            if (!config.rewrite.av || !aid || LOCATION[3] != 'video') return;
            let desc = document.getElementsByClassName("info");
            if (desc[1] && desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i)) {
                let paster = desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i);
                for (let i = 0; i < paster.length; i++){
                    let newer = "av" + deliver.convertId(paster[i]);
                    newer = '<a target="_blank" href="//www.bilibili.com/video/' + newer + '">' + newer + '</a>';
                    desc[1].innerHTML = desc[1].outerHTML.replace(paster[i], newer);
                }
            }
        },
        // 节点监听
        resetNodes : async (ext) => {
            let remove = (node, type, hidden, index) => {
                index ? index : index = 0;
                switch(type){
                        // 一般能移除的就移除，否则隐藏
                    case "id" : node = document.getElementById(node);break;
                    case "class" : node = document.getElementsByClassName(node)[index] ? document.getElementsByClassName(node)[index] : "";break;
                    case "tag" : node = document.getElementsByTagName(node)[index] ? document.getElementsByTagName(node)[index] : "";break;
                }
                if (!node || node.getAttribute("hidden")) return;
                debug.log("移除节点", node);
                hidden ? node.setAttribute("hidden", "hidden") : node.remove();
            }
            // 隐藏联系客服
            remove("contact-help", "class", true);
            // 移除新版提示
            remove("new-entry", "class");
            remove("ver", "class");
            remove("trynew-btn", "class");
            // 移除app下载浮动框
            remove("fixed_app_download", "id");
            remove("app-download", "class");
            // 移除直播水印
            remove("bilibili-live-player-video-logo", "class");
            // 移除失效顶栏
            remove("bili-header-m", "class", false, 1);
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
        fixSort : {
            // av
            video : async () => {
                let timer = window.setInterval(()=>{
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
                },1000);
            },
            // 稍后再看
            watchlater : async (data) => {
                let timer = window.setInterval(async ()=>{
                    let tminfo = document.getElementsByClassName("tm-info");
                    // 判断是否是少后再看页面
                    if (tminfo[0]&&aid) {
                        window.clearInterval(timer);
                        let child = tminfo[0].childNodes;
                        if (child[2].nodeType === 8) {
                            try {
                                // 通过链接获取tid
                                data = await xhr.true(deliver.obj2search(API.url.view, {"aid" : aid}));
                                tid = JSON.parse(data).data.tid;
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
                            catch(e) {debug.error("分区·稍后再看", ...e)}
                        }
                    }
                },1000);
            },
        },
        // 点赞功能
        setLike : async (data) => {
            if (!config.reset.like) return;
            let timer = window.setInterval(async () => {
                let coin = document.getElementsByClassName("bilibili-player-video-subtitle")[0];
                let number = document.getElementsByClassName("number")[0];
                let node = document.getElementsByClassName("coin")[0];
                // 判断页面渲染进度
                if (coin && node) {
                    window.clearInterval(timer);
                    let span = document.createElement("span");
                    let bef = document.createElement("i");
                    let af = document.createElement("b");
                    let text = document.createTextNode("点赞 --");
                    let arg = text;
                    // 创建点赞数据相关节点并初始化
                    span.setAttribute("class", "u like");
                    span.setAttribute("style", "margin-right : 5px;");
                    span.appendChild(bef);
                    span.appendChild(af);
                    span.appendChild(text);
                    bef.setAttribute("class", "l-icon-move");
                    bef.setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;");
                    af.setAttribute("class", "l-icon-moved");
                    af.setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;display : none;");
                    try {
                        number.insertBefore(span, node);
                        // 获取点赞数据
                        data = await xhr.true(deliver.obj2search(API.url.view, {"aid" : aid}));
                        data = JSON.parse(data).data.stat.like;
                        document.getElementsByClassName("like")[0].setAttribute("title", "点赞人数" + data);
                        if (data>10000) data = (data/10000).toFixed(1) + "万";
                        text = document.createTextNode(" 点赞 " + data);
                        arg.replaceWith(text);
                        arg = text;
                        data = await xhr.true(deliver.obj2search(API.url.haslike, {"aid" : aid}));
                        data = JSON.parse(data);
                        let move = document.getElementsByClassName("l-icon-move");
                        let moved = document.getElementsByClassName("l-icon-moved");
                        data = data.data;
                        if (data == 1) {
                            // 点赞过点亮图标
                            move[0].setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;display : none;");
                            moved[0].setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;");
                        }
                        move[0].onclick = async () => {
                            // 没有点赞过绑定点赞点击事件
                            if (!deliver.getCookies().bili_jct) {
                                // 没有登录绑定快捷登录
                                document.getElementsByClassName("c-icon-move")[0].click();
                                return;
                            }
                            // 构造并请求点赞表单
                            let msg = "aid=" + aid + "&like=1&csrf=" + deliver.getCookies().bili_jct;
                            data = await xhr.post(API.url.like, "application/x-www-form-urlencoded", msg);
                            data = JSON.parse(data).ttl;
                            // 点亮点赞图标并修改显示数据
                            document.getElementsByClassName("l-icon-move")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;display : none;");
                            document.getElementsByClassName("l-icon-moved")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;");
                            if (arg.nodeValue.match("万")) return;
                            let number = 1 * arg.nodeValue.match(/[0-9]+/) + 1;
                            text = document.createTextNode(" 点赞 " + number)
                            arg.replaceWith(text);
                            arg = text;
                        }
                        moved[0].onclick = async () => {
                            // 点赞过绑定取消点赞点击事件
                            // 构造并请求取消点赞表单
                            let msg = "aid=" + aid + "&like=2&csrf=" + deliver.getCookies().bili_jct;
                            data = await xhr.post(API.url.like, "application/x-www-form-urlencoded", msg);
                            data = JSON.parse(data).ttl;
                            // 熄灭点赞图标并修改显示数据
                            document.getElementsByClassName("l-icon-move")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;");
                            document.getElementsByClassName("l-icon-moved")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;display : none;");
                            if (arg.nodeValue.match("万")) return;
                            let number = 1 * arg.nodeValue.match(/[0-9]+/) - 1;
                            text = document.createTextNode(" 点赞 " + number)
                            arg.replaceWith(text);
                            arg = text;
                        }
                    }
                    catch(e) {debug.error("点赞功能", ...e)}
                }
            },100);
        },
        // 收藏播放，收藏列表视频过多将导致视频加载及切换缓慢
        setMediaList : {
            init : async (data) => {
                if (!ml) {
                    // 二次初始化播放器
                    let timer = setInterval(() => {
                        if (!unsafeWindow.BilibiliPlayer) return;
                        clearInterval(timer);
                        if (__playinfo__.data.accept_quality[0] < 120) return;
                        let e = "cid=" + unsafeWindow.cid + "&aid=" + unsafeWindow.aid;
                        unsafeWindow.GrayManager && unsafeWindow.GrayManager.reload(e);
                        unsafeWindow.BiliCm && unsafeWindow.BiliCm.Core && unsafeWindow.BiliCm.Core.reset();
                    },100)
                    return;
                }
                if (data){
                    // 以传参data决定处理类型
                    try {
                        // 获取首个视频av并跳转
                        data = await xhr.true(deliver.obj2search(API.url.medialist, {"media_id" : ml, "pn" : 1, "ps":1}));
                        data = JSON.parse(data).data;
                        location.replace("https://www.bilibili.com/video/av" + data.medias[0].id);
                    }
                    catch(e) {
                        // 跳转失败，清理残余
                        GM_setValue("medialist", 0);
                        debug.error(e);
                    }
                }
                else {
                    try {
                        let avs = [], value = [], promises = [];
                        // 获取收藏列表，这里获取只能获取到aid
                        data = await xhr.true(deliver.obj2search(API.url.ids4Player, {"media_id" : ml}));
                        data = JSON.parse(data).data;
                        for (let i = 0; i < data.medias.length; i++) {
                            ids[i] = data.medias[i].id;
                            avs[i] = "av" + data.medias[i].id;
                        }
                        // 同时获取所有aid对应的数据，使用Promise.all对齐，该api会直接忽略失效视频
                        while (avs.length) {
                            let i = avs.length > 20 ? 20 : avs.length;
                            value = avs.splice(0,i);
                            promises.push(xhr.true(deliver.obj2search(API.url.cards, {"ids" : value.join("%2C")})));
                        }
                        value = [];
                        data = await Promise.all(promises);
                        // 格式化数据并排序
                        for (let i = 0; i < data.length; i++) {
                            data[i] = JSON.parse(data[i]);
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
                                let toview = {"code":0, "message" : "0", "ttl" : 1, "data" : {"count" : ids.length, "list" : ids}};
                                // 保存初始aid，以便判断是否切p
                                oid = ids[0].aid;
                                debug.log("收藏列表", toview);
                                // 构造初始化参数并重新初始化播放器
                                obj = {"aid" : ids[0].aid, "cid" : ids[0].cid, "watchlater":encodeURIComponent(JSON.stringify(toview))}; // 重构初始化播放器参数
                                unsafeWindow.BilibiliPlayer(obj);
                                let bpui = document.getElementsByClassName("bpui-button-text");
                                let t = setInterval(() => {
                                    // 更新列表名称
                                    if (bpui[1]) {
                                        clearInterval(t);
                                        bpui[1].firstChild.innerText = "收藏列表";
                                    }
                                },100);
                            }
                        },100);
                    }
                    catch(e) {debug.error("收藏模拟", ...e)}
                }
            },
            // aid变化监听
            fixvar : async () => {
                if (!aid) aid = unsafeWindow.aid ? unsafeWindow.cid : aid;
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
            restore : async () => {
                let data;
                history.replaceState(null,null,"https://www.bilibili.com/video/av" + aid + location.search + location.hash);
                for (let i=0;i<ids.length;i++) if (ids[i].aid==aid) data = ids[i];
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
                info.childNodes[3].innerText = deliver.timeFormat(data.pubdate*1000);
                number.childNodes[0].title = "总播放数" + data.stat.view;
                number.childNodes[0].innerText = data.stat.view < 10000 ? data.stat.view : (data.stat.view / 10000).toFixed(1) + "万";
                number.childNodes[1].title = "总弹幕数" + data.stat.danmaku;
                number.childNodes[1].innerText = data.stat.danmaku < 10000 ? data.stat.danmaku : (data.stat.danmaku / 10000).toFixed(1) + "万";
                if (data.stat.his_rank > 0) number.childNodes[2].innerText = "最高全站日排行" + data.stat.his_rank + "名";
                else try {number.childNodes[2].setAttribute("hidden", "hidden");} catch(e) {}
                if (number.childNodes[4].className == "u like") {
                    number.childNodes[4].title = "点赞人数" + data.stat.like;
                    number.childNodes[4].childNodes[2].replaceWith(document.createTextNode("点赞 " + (data.stat.like < 10000 ? data.stat.like : (data.stat.like / 10000).toFixed(1) + "万")));
                    number.childNodes[5].title = "投硬币枚数" + data.stat.coin;
                    number.childNodes[5].childNodes[2].replaceWith(document.createTextNode("硬币 " + (data.stat.coin < 10000 ? data.stat.coin : (data.stat.coin / 10000).toFixed(1) + "万")));
                    number.childNodes[6].title = "收藏人数" + data.stat.favorite;
                    number.childNodes[6].childNodes[2].replaceWith(document.createTextNode("收藏 " + (data.stat.favorite < 10000 ? data.stat.favorite : (data.stat.favorite / 10000).toFixed(1) + "万")));
                }
                else {
                    number.childNodes[4].title = "投硬币枚数" + data.stat.coin;
                    number.childNodes[4].childNodes[2].replaceWith(document.createTextNode("硬币 " + (data.stat.coin < 10000 ? data.stat.coin : (data.stat.coin / 10000).toFixed(1) + "万")));
                    number.childNodes[5].title = "收藏人数" + data.stat.favorite;
                    number.childNodes[5].childNodes[2].replaceWith(document.createTextNode("收藏 " + (data.stat.favorite < 10000 ? data.stat.favorite : (data.stat.favorite / 10000).toFixed(1) + "万")));
                }
                up_info[0].childNodes[1].href = "https://space.bilibili.com/" + data.owner.mid;
                up_info[0].childNodes[1].childNodes[0].src = data.owner.face;
                up_info[1].childNodes[0].childNodes[0].href = "https://space.bilibili.com/" + data.owner.mid;
                up_info[1].childNodes[0].childNodes[0].innerText = data.owner.name;
                up_info[1].childNodes[1].childNodes[0].innerText = "up主简介";
                up_info[1].childNodes[2].childNodes[0].innerText = "投稿 --";
                up_info[1].childNodes[2].childNodes[1].innerText = "粉丝 --";
                arc_toolbar_report[0].childNodes[0].title = "分享人数" + data.stat.share;
                arc_toolbar_report[0].childNodes[0].childNodes[1].innerText = data.stat.share < 10000 ? data.stat.share : (data.stat.share / 10000).toFixed(1) + "万";
                arc_toolbar_report[2].title = "收藏人数" + data.stat.favorite;
                arc_toolbar_report[2].childNodes[0].childNodes[3].innerText = data.stat.favorite < 10000 ? data.stat.favorite : (data.stat.favorite / 10000).toFixed(1) + "万";
                arc_toolbar_report[3].title = "投硬币枚数" + data.stat.coin;
                arc_toolbar_report[3].childNodes[0].childNodes[3].innerText = data.stat.coin < 10000 ? data.stat.coin : (data.stat.coin / 10000).toFixed(1) + "万";
                tag[0].setAttribute("hidden", "hidden");
                desc[1].innerText = data.desc;
                new unsafeWindow.bbComment(".comment",unsafeWindow.aid, 1, unsafeWindow.UserStatus.userInfo, "");
                let bpui = document.getElementsByClassName("bpui-button-text");
                let t = setInterval(()=>{
                    // 更新列表名称
                    if (bpui[1]) {
                        clearInterval(t);
                        bpui[1].firstChild.innerText = "收藏列表";
                    }
                },100);
            },
        },
        // 分集数据
        setBangumi : {
            init : async (data) => {
                if (!config.reset.episodedata) return;
                // 判断是否有分集数据
                if (data.epList[1] && (data.epList[0].aid != data.epList[1].aid)) {
                    aid = data.epInfo.aid;
                    let timer = window.setInterval(() => {
                        if (document.getElementsByClassName("info-sec-av")[0]) {
                            deliver.setBangumi.episodeData("first");
                            window.clearInterval(timer);
                        }
                    },1000);
                    // 延时取消操作，10s还未载入完成将不再处理
                    window.setTimeout(() => window.clearInterval(timer), 10000);
                }
            },
            // 分集数据处理
            episodeData : async (data, msg) => {
                try {
                    let views = document.getElementsByClassName("view-count")[0].getElementsByTagName("span")[0];
                    let danmakus = document.getElementsByClassName("danmu-count")[0].getElementsByTagName("span")[0];
                    if (data == "first") {
                        // 判断是否是首次处理
                        if (views.innerText == "-" && danmakus.innerText == "-") {
                            window.setTimeout(() => {deliver.setBangumi.episodeData("first")},100);
                            return;
                        }
                        // 备份总播放数和弹幕数
                        views.setAttribute("title","总播放数 " + views.innerText);
                        danmakus.setAttribute("title","总弹幕数 " + danmakus.innerText);
                        debug.log("总播放数", views.innerText, " 总弹幕数", danmakus.innerText);
                        data = await xhr.true(deliver.obj2search(API.url.stat, {"aid" : aid}));
                    }
                    if (!data) {
                        aid = msg.relatedNode.innerText.match(/[0-9]+/)[0];
                        data = await xhr.true(deliver.obj2search(API.url.stat, {"aid" : aid}));
                    }
                    data = JSON.parse(data).data;
                    let view = data.view;
                    let danmaku = data.danmaku;
                    if (view >= 10000) view = (view / 10000).toFixed(1) + "万";
                    if (danmaku >= 10000) danmaku = (danmaku / 10000).toFixed(1) + "万";
                    views.innerText = view;
                    danmakus.innerText = danmaku;
                    debug.log("播放", view + " 弹幕", danmaku);
                }
                catch(e) {debug.error("分集数据", ...e)}
            },
        },
        // 跳转完后的播单处理
        setPlayList : async () => {
            window.onload = () => {
                let div = document.createElement("div");
                div.setAttribute("class","z-top-container has-menu");
                document.body.insertBefore(div,document.body.firstChild);
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
        setOnline : async () => {
            let timer = window.setInterval(async () => {
                let online = document.getElementsByClassName("online")[0];
                if (online) {
                    // 判断主页载入进程
                    window.clearInterval(timer);
                    let loop = async () => {
                        try {
                            let data = await xhr.true(API.url.online);
                            data = JSON.parse(data).data;
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
                                parent.insertBefore(div,parent.firstChild);
                                a.setAttribute("href", "//www.bilibili.com/video/online.html");
                                a.setAttribute("target", "_blank");
                                div.appendChild(a);
                                online = a;
                            }
                            online.setAttribute("title","在线观看：" + play_online);
                            online.text = web_online ? "在线人数：" + web_online : "在线列表";
                            if (!online.parentNode.getElementsByTagName("em")[0]) {
                                let em = document.createElement("em");
                                let count = document.createElement("a");
                                online.parentNode.insertBefore(em,online.nextSibling);
                                count.setAttribute("href", "//www.bilibili.com/newlist.html");
                                count.setAttribute("target", "_blank");
                                online.parentNode.insertBefore(count,em.nextSibling);
                                count.text = all_count ? "最新投稿：" + all_count : "最新投稿";
                            }
                            else {
                                let count = online.parentNode.getElementsByTagName("a")[1];
                                count.text = all_count ? "最新投稿：" + all_count : "最新投稿";
                            }
                            if (!all_count || !web_online || !play_online) throw ["无在线数据", data];
                            // 60s刷新一次
                            window.setTimeout(()=> loop(), 60000);
                        }
                        catch(e) {debug.error("在线数据", ...e)}
                    }
                    loop();
                }
            },1000);
        },
        // 注册时间
        setJoinTime : async () => {
            if (!mid && !config.reset.jointime) return;
            let data = await xhr.GM(deliver.obj2search(API.url.membercard,{"mid" : mid}));
            try {
                data = JSON.parse(data);
                // 格式化时间戳，不是13位，主动补位
                let jointime = deliver.timeFormat(data.card.regtime * 1000, 1);
                let birthdate = data.card.birthday;
                debug.log("注册时间", [data.card.name, jointime]);
                document.addEventListener("DOMNodeInserted",(msg) => {
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
            catch(e) {debug.error("注册时间", ...e)}
        },
        // 失效视频
        fixVideoLost : {
            // 收藏里的失效视频
            favlist : async (msg, data) => {
                // src判定是否为频道并取消重复处理
                if (!config.reset.lostvideo || window.src) return;
                // 获取av号或者将bv转为av
                let title, cover, aid = msg.target.getAttribute("data-aid");
                if (!(1 * aid)) aid = deliver.convertId(aid);
                if (arr.indexOf(aid) != -1) return;
                // 记录已经处理过的视频aid
                arr.push(aid);
                try {
                    // 尝试读取来自jijidown的数据
                    data = await xhr.GM(API.url.jijidown + aid);
                    data.match('window._INIT')[0];
                    title = data.match(/\<title\>.+?\-哔哩哔哩唧唧/)[0].replace(/<title>/,"").replace(/-哔哩哔哩唧唧/,"");
                    cover = data.match(/"img\":\ \".+?\",/)[0].replace(/"img" : "/,"").replace(/",/,"");
                    // 判断封面是否有效
                    cover.match('hdslb')[0];
                }
                catch(e) {
                    try {
                        // 尝试读取来自biliplus数据
                        data = await xhr.GM(API.url.biliplus + aid);
                        data.match(/\<title\>.+?\ \-\ AV/)[0];
                        title = data.match(/\<title\>.+?\ \-\ AV/)[0].replace(/<title>/,"").replace(/ - AV/,"");
                        cover = data.match(/\<img style=\"display:none\"\ src=\".+?\"\ alt/)[0].replace(/<img style="display:none" src="/,"").replace(/" alt/,"");
                    }
                    catch(e) {
                        // 无有效数据只能把标题改为av号
                        title = "av" + aid;
                    }
                }
                debug.log("失效视频", "av" + aid);
                let img = msg.target.getElementsByTagName("img")[0];
                let txt = msg.target.getElementsByClassName("title")[0];
                img.setAttribute("src",cover + "@380w_240h_100Q_1c.webp");
                img.setAttribute("alt",title);
                txt.setAttribute("href", "//www.bilibili.com/video/av" + aid);
                txt.setAttribute("title",title);
                txt.setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                txt.text = title;
                msg.target.setAttribute("class", "small-item");
                msg.target.firstChild.setAttribute("href", "//www.bilibili.com/video/av" + aid);
                msg.target.firstChild.setAttribute("target", "_blank");
                msg.target.firstChild.setAttribute("class", "cover cover-normal");
            },
            // 频道里的失效视频
            channel : async (link) => {
                if (!config.reset.lostvideo || !src) return;
                try {
                    let data, obj = deliver.search2obj(link),
                        cid = obj.cid,
                        mid = obj.mid,
                        pn = obj.pn;
                    let small_item = document.getElementsByClassName("small-item");
                    if (small_item[0]) for (let i = 0; i < small_item.length; i++) if (small_item[i].getElementsByClassName("title")[0].text == "已失效视频") src = "";
                    if (src) return;
                    data = await xhr.true(deliver.obj2search(API.url.channel, {"mid" : mid, "cid" : cid, "pn" : pn, "ps" : 30, "order" : 0}));
                    data = JSON.parse(data).data;
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
                            img.setAttribute("src", data.list.archives[i].pic.replace("http","https") + "@380w_240h_100Q_1c.webp");
                            txt.setAttribute("target", "_blank");
                            txt.setAttribute("title", title);
                            txt.setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                            txt.text = title;
                        }
                    }
                }
                catch(e) {debug.error("失效视频·频道", ...e)}
            },
            // 空间首页展示的失效视频
            home : async (msg) => {
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
        setReplyFloor : async (link) => {
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
                    if (pn < 2) data = await xhr.true(deliver.obj2search(API.url.replycursor, {"oid" : oid,"root" : root,"type" : type}));
                    else {
                        // 3页以上先获取当页首条评论rpid
                        let dialog;
                        if (list_item[0]) {
                            for (let i = 0; i < list_item.length; i++) {
                                if (list_item[i].getAttribute("data-id") == root) {
                                    list_item = list_item[i].getElementsByClassName("reply-wrap");
                                    if (list_item[0]) {
                                        for (let j = 0; j < list_item.length; j++) {
                                            if (!list_item[j].getElementsByClassName("floor")[0]) {
                                                dialog = list_item[j].getAttribute("data-id");
                                                break;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        else if (main_floor[0]) {
                            for (let i = 0; i < main_floor.length; i++) {
                                if (main_floor[i].getAttribute("id") && main_floor[i].getAttribute("id").includes(root)) {
                                    main_floor = main_floor[i].getElementsByTagName("li");
                                    if (main_floor[0]) {
                                        for (let j = 0; j < main_floor.length; j++) {
                                            if (main_floor[j].id && main_floor[j].id.includes("l_id") && !main_floor[j].getElementsByClassName("floor-num")[0]) {
                                                dialog = main_floor[j].getAttribute("id").split('_')[2];
                                                break;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                        // 根据当页首条评论rpid获取min_id
                        data = await xhr.true(deliver.obj2search(API.url.replydialog, {"oid" : oid,"root" : root,"type" : type, "dialog" : dialog, "size" : 20}));
                        let min_id = JSON.parse(data).data.replies;
                        if (min_id) {for (let i = 0; i < min_id.length; i++) if (min_id[i].rpid == dialog) {min_id = min_id[i].floor; break;}}
                        else {debug.msg("当前页楼中楼层获取失败 ಥ_ಥ"); return;}
                        // 根据min_id获取当页数据
                        data = await xhr.true(deliver.obj2search(API.url.replycursor, {"oid" : oid,"root" : root,"type" : type, "min_id" : min_id}));
                    }
                }
                else {
                    if (sort == 2) data = await xhr.true(deliver.obj2search(API.url.replymain, {"oid" : oid,"next" : pn,"type" : type,"mode" : mode}));
                    else if (pn == 1) data = await xhr.true(deliver.obj2search(API.url.replymain, {"oid" : oid,"type" : type,"mode" : mode}));
                    else {
                        // 时间排序的楼层号需要相对前页判定
                        pn = pn - 1;
                        data = await xhr.true(deliver.obj2search(API.url.reply, {"type" : type,"sort" : sort,"oid" : oid,"pn" : pn}));
                        data = JSON.parse(data).data;
                        let i = data.replies.length - 1;
                        oid = data.replies[0].oid;
                        let root = data.replies[i].rpid;
                        data = await xhr.true(deliver.obj2search(API.url.replycursor, {"oid" : oid,"root" : root,"type" : type}));
                        data = JSON.parse(data).data;
                        oid = data.root.oid;
                        let next = data.root.floor;
                        data = await xhr.true(deliver.obj2search(API.url.replymain, {"oid" : oid,"next" : next,"type" : type,"mode" : mode}));
                    }
                }
                data = JSON.parse(data).data;
                let floor = {}, top = data.top, hots = data.hots, replies = data.replies, froot = data.root;
                if (hots && hots[0]) {
                    for (let i = 0; i < hots.length; i++) {
                        floor[hots[i].rpid] = hots[i].floor;
                        if (hots[i].replies) for (let j = 0; j < hots[i].replies.length; j++) floor[hots[i].replies[j].rpid] = hots[i].replies[j].floor;
                    }
                }
                if (replies && replies[0]) {
                    for (let i = 0;i < replies.length; i++) {
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
                                    node.insertBefore(span,node.firstChild);
                                }
                            }
                        }
                    }
                }
                // 新版评论需另外创建楼层号
                if (list_item[0]) {
                    for (let i = 0; i<list_item.length; i++) {
                        let rpid = list_item[i].getAttribute("data-id");
                        if (rpid in floor) {
                            let node = list_item[i].getElementsByClassName("info")[0];
                            let span = document.createElement("span");
                            span.setAttribute("class", "floor");
                            span.innerText = "#" + floor[rpid];
                            node.insertBefore(span,node.firstChild);
                        }
                    }
                }
            }
            catch(e) {debug.error("评论楼层", ...e)}
        },
        // 广告区转资讯区
        fixnews : async (node, move) => {
            try {
                let rank = config.reset.grobalboard ? document.getElementsByClassName("rank-tab")[0] : "";
                if (node.id == "bili_ad") {
                    let sight = node.getElementsByTagName("a");
                    node = node.getElementsByClassName("name");
                    if (node[0]) node[0].text = "资讯";
                    for (let i = 0; i < sight.length; i++ ) if (sight[i].href.includes("www.bilibili.com/v/ad/ad/")) sight[i].href = "https://www.bilibili.com/v/information/";
                    let rcon = document.createElement("div");
                    rcon.setAttribute("class", "r-con");
                    rcon.innerHTML = '<div class="r-con"><header style="margin-bottom: 14px"><h3 style="font-size: 18px;font-weight: 400;">资讯分区正式上线啦！</h3></header><div class="carousel-module"><div class="panel"><a href="https://www.bilibili.com/v/information" target="_blank"><img src="//i0.hdslb.com/bfs/archive/0747d26dbbc3bbf087d47cff49e598a326b0030c.jpg@320w_330h_1c.webp" width="260" height="280"/></a></div></div></div>';
                    document.getElementById("ranking_ad").replaceWith(rcon);
                }
                if (node.className == "report-wrap-module elevator-module") node.children[1].children[13].innerHTML = "资讯";
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
            catch(e) {debug.error("分区·版面", ...e)}
        },
        // 跳过充电鸣谢
        electricPanelJump : async (node) => {
            try {
                if (!config.reset.electric) return;
                config.reset.electric = 0;
                setTimeout(() => {node.click()}, 1);
                debug.log("跳过充电鸣谢");
                setTimeout(() => {config.reset.electric = 1}, 5000);
            }
            catch(e) {debug.error("充电鸣谢", ...e)}
        },
        // 修复分区排行
        fixrank : async (node) => {
            let sort = {
                bili_movie : ["ranking_movie", 2, "https://www.bilibili.com/ranking/cinema/23/0/3"],
                bili_teleplay : ["ranking_teleplay", 5, "https://www.bilibili.com/ranking/cinema/11/0/3"],
                bili_documentary : ["ranking_documentary", 3, "https://www.bilibili.com/ranking/cinema/177/0/3"]
            }
            sort = sort[node.id];
            if (!sort) return;
            let section = node.getElementsByClassName("sec-rank report-wrap-module zone-rank")[0];
            section.innerHTML = '<header class="rank-head"><h3>排行</h3></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list"></ul></div><a href="' + sort[2] + '" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>';
            try {
                let data = await xhr.true(deliver.obj2search(API.url.ranklist, {season_type : sort[1], day : 3}));
                data = JSON.parse(data).data;
                node = node.getElementsByClassName("bangumi-rank-list rank-list")[0];
                for (let i = 0; i < 8; i++) {
                    let li = document.createElement("li"),
                        cl = i < 3 ? "rank-item highlight" : "rank-item",
                        fw;
                    li.setAttribute("class", cl);
                    li.innerHTML = '<i class="ri-num">' + (i + 1) + '</i><a href="'+ data.list[i].url + '" target="_blank" title="' + data.list[i].title + ' 播放:' + data.list[i].stat.view + '" class="ri-info-wrap"><p class="ri-title">' + data.list[i].title + '</p><span class="ri-total">' + data.list[i].new_ep.index_show + '</span></a>';
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
                function getTotalTop(node){
                    var sum = 0;
                    do{
                        sum += node.offsetTop;
                        node = node.offsetParent;
                    }
                    while(node);
                    return sum;
                }
            }
            catch (e) {debug.error("分区排行", ...e)}
        }
    }

    // 设置界面
    const UI = {
        // 设置入口
        init : async () => {
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
        table : async () => {
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
                    GM_setValue("config",config);
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
        setTable : async (ele, name, check, key) => {
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
                div.setAttribute("class","bili-old ui-state");
                div.setAttribute("id","ui-state");
                div.innerHTML = name[1];
                document.body.appendChild(div);
            }
            div.onmouseout = () => document.getElementById("ui-state") ? document.getElementById("ui-state").remove() : "";
        },
        // 设置内容及说明，基本与config一一对应
        menu : {
            av : ["av(BV)", "启用旧版av页面，基于旧版网页框架"],
            bangumi : ["Bangumi", "启用旧版番剧页面，基于旧版网页框架"],
            watchlater : ["稍后再看", "启用旧版稍后再看页面，基于旧版网页框架"],
            frame : ["嵌入", "替换嵌入式播放器，不会单独适配被嵌入页面的其他功能"],
            home : ["主页", "启用旧版主页，，基于旧版网页框架，广告区已失效并替换为资讯区"],
            playlist : ["播单", "恢复播单页，使用跳转绕开404"],
            medialist : ["收藏", "模拟收藏列表播放页面，收藏播放页是新版专属页面，只能先跳转av页再模拟收藏列表<br>切P时up主简介等少数信息不会另外请求<br>※播放列表视频太多将导致视频载入及切换速度变慢"],
            danmuku : ["新版弹幕", "尝试换用新版弹幕接口，弹幕上限将变为两倍，但弹幕加载速度应该会变慢<br>※依赖xhrhook"],
            livechat : ["实时弹幕", "尝试修复实时弹幕聊天功能，使旧播放器能继续实时接收最新弹幕<br>※依赖WebSocket hook"],
            limit : ["区域限制", "尝试解除B站区域限制，用于观看港澳台番剧<br>※功能不及专门的脚本，同时使用请关闭本选项<br>※依赖xhrhook"],
            grobalboard : ["顶栏底栏", "识别并替换所有新版顶栏为旧版顶栏，旧版失效广告区替换为资讯区"],
            replyfloor : ["评论楼层", "恢复评论区楼层号，上古“按评论数”排列的评论除外<br>添加了楼中楼层号显示，但若楼中楼当页第一条评论是回复别人则该页都无法获取"],
            headblur : ["顶栏透明", "使旧版顶栏全透明"],
            preview : ["付费预览", "去除播放器左下角付费预览框"],
            jointime : ["注册时间", "在个人空间显示B站账号注册时间，依赖主人开放个人资料"],
            lostvideo : ["失效视频", "借助第三方接口修复失效视频的封面和标题，将标题标红并添加删除线，无数据时只修改标题为av号"],
            bvid2av : ["BV⇒av", "让所有页面能使用av号的地方尽量使用av号(未能完全覆盖)<br>进入bv页面自动跳转到av页面(不会重载页面)"],
            selectdanmu : ["弹幕优先", "让旧版播放器优先展示弹幕列表而不是推荐视频"],
            episodedata : ["分集数据", "让番剧显示分集的播放数和弹幕数，原来总计数据显示在鼠标焦点的浮动信息上"],
            like : ["点赞功能", "为旧版播放页面添加点赞功能，点赞是新版页面专属功能，功能简陋，不支持一键三联"],
            static : ["静态页面", "将静态页面跳转到普通页面以启用旧版页面，静态页面是新版新增页面，页面大部分信息都内置于页面中以加快载入速度"],
            download : ["下载视频", "播放器右键菜单>>>下载视频>>>选择文件>>>右键另存为/右键IDM下载<br>！！！复制无效/左键点击无效！！！<br>※详见脚本简介"],
            heartbeat : ["视频心跳", "替换被其他广告屏蔽插件拦截的视频心跳，若出现播放视频但不记录历史的情况可以尝试启用"],
            carousel : ["播放信息", "填充旧版播放器顶部缺失的通知信息"],
            adloc : ["主页广告", "去除旧版主页直接写在网页里的广告的内容，如滚动图、推荐位、横幅……"],
            roomplay : ["直播拦截", "拦截直播视频及轮播视频以节约流量<br>受浏览器缓存影响注入没有载入直播快则会失败，此种情况硬刷新可以解决"],
            history : ["视频历史", "去掉历史记录页面的直播、专栏，只显示视频播放历史"],
            xhrhook : ["xhrhook", "hook xhr的send属性，副作用是所有xhr的initiator都会变成本脚本，强迫症可以选择关闭除非需要启用以下功能：<br>※新版弹幕<br>※区域限制"],
            electric : ["充电鸣谢", "自动跳过充电鸣谢<br>※动作再快还是会一闪而过"]
        }
    }

    // 页面分离
    const thread = {
        // av/BV
        video : () => {
            try {
                // 判断是否收藏跳转而来
                ml = GM_getValue("medialist");
                GM_setValue("medialist", 0);
                // bv转av
                if (config.reset.bvid2av && LOCATION[4].toLowerCase().startsWith('bv')) {
                    aid = deliver.convertId(LOCATION[4]);
                    history.replaceState(null, null, "https://www.bilibili.com/video/av" + aid + location.search + location.hash);
                }
                if (!config.rewrite.av && !config.reset.download) throw ["未启用旧版av页", location.href];
                // 获取网页源代码
                __playinfo__ = unsafeWindow.__playinfo__;
                if (!config.rewrite.av) throw ["未启用旧版av页", location.href];
                aid = aid || LOCATION[4].match(/[0-9]+/)[0];
                DOCUMENT = xhr.false(deliver.obj2search(API.url.detail, {aid : aid}));
                __INITIAL_STATE__ = INITIAL_STATE.av(DOCUMENT);
                if (__INITIAL_STATE__.videoData.redirect_url) throw ["番剧重定向：", __INITIAL_STATE__.videoData.redirect_url];
                if (__INITIAL_STATE__.videoData.stein_guide_cid) throw ["忽略互动视频：", "av" + aid];
                // 写入全局变量
                aid = __INITIAL_STATE__.aid ? __INITIAL_STATE__.aid : aid;
                tid = __INITIAL_STATE__.videoData.tid ? __INITIAL_STATE__.videoData.tid : tid;
                __playinfo__ = __playinfo__ ? __playinfo__ : unsafeWindow.__playinfo__;
                unsafeWindow.__INITIAL_STATE__ = __INITIAL_STATE__;
                // 重写网页框架并进行调用后续处理
                deliver.write(API.pageframe.video);
                document.title = __INITIAL_STATE__.videoData.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
                deliver.fixSort.video()
                deliver.setLike();
                deliver.setMediaList.init();
            }
            catch(e) {debug.error("框架·av/BV", ...e)}
        },
        // 稍后再看
        watchlater : () => {
            try {
                if (!config.rewrite.watchlater) throw ["未启用旧版稍后再看", location.href];
                if (!uid) throw ["未登录", "无法启用旧版稍后再看"];
                // 重写网页框架并调用后续处理
                deliver.write(API.pageframe.watchlater);
                deliver.setLike();
                deliver.fixSort.watchlater();
                // bv转av
                if (LOCATION[5]) {
                    aid = LOCATION[5].match(/[0-9]+/) ? LOCATION[5].match(/[0-9]+/)[0] : aid;
                    if (LOCATION[5].toLowerCase().startsWith('bv')){
                        aid = deliver.convertId(LOCATION[5]);
                        LOCATION[5] = "av" + aid;
                        history.replaceState(null,null,LOCATION.join("/"));
                    }
                }
            }
            catch(e) {debug.error("框架·稍后再看", ...e)}
        },
        // 番剧
        bangumi : () => {
            try {
                if (!config.rewrite.bangumi && !config.reset.download) throw ["未启用旧版Bangumi", location.href];
                // 指定playurl类型
                pgc = true;
                // 获取网页源代码
                DOCUMENT = xhr.false(location.href);
                __INITIAL_STATE__ = DOCUMENT.includes("__INITIAL_STATE__=") ? JSON.parse(DOCUMENT.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "")) : ""; // 继承__INITIAL_STATE__
                __playinfo__ = DOCUMENT.includes("playinfo__=") ? JSON.parse(DOCUMENT.match(/playinfo__=.+?\<\/script>/)[0].replace(/playinfo__=/, "").replace(/<\/script>/, "")) : "";
                if (!config.rewrite.bangumi) throw ["未启用旧版Bangumi", location.href];
                // 判断页面是否404
                if (!__INITIAL_STATE__) throw ["__INITIAL_STATE__错误", "Bangumi可能无效", __INITIAL_STATE__];
                let id = LOCATION[5].startsWith('ep') ? location.href.match(/[0-9]+/)[0] : "";
                // 获取__INITIAL_STATE__
                __INITIAL_STATE__ = INITIAL_STATE.bangumi(id);
                if (__INITIAL_STATE__ && __INITIAL_STATE__.epInfo && __INITIAL_STATE__.epInfo.badge === "互动") throw ["忽略互动视频：", location.href];
                // 重写网页框架并调用后续处理，按是否有特殊背景分别处理
                unsafeWindow.__INITIAL_STATE__ = __INITIAL_STATE__;
                if (DOCUMENT.match('"specialCover":""')) deliver.write(API.pageframe.bangumi); else deliver.write(API.pageframe.cinema);
                document.title = DOCUMENT.match(/<title.*?>.+?<\/title>/)[0].replace(/<title.*?>/, "").replace(/<\/title>/, "");
                if (__INITIAL_STATE__) deliver.setBangumi.init(__INITIAL_STATE__);
            }
            catch(e) {debug.error("框架·Bangumi", ...e)}
        },
        // 嵌入
        blackboard : () => {
            try {
                // 修复HTML5播放器帮助页视频cid错误
                if (LOCATION[4].startsWith('html5player')) if (LOCATION[4].includes("3521416") && LOCATION[4].includes("6041635")) location.replace(deliver.obj2search(API.playerframe.html5player,{"aid":3521416,"cid":192446449}));
                if (!config.rewrite.frame) throw ["未启用旧版嵌入播放器", location.href];
                if (LOCATION[4].startsWith('newplayer')) {
                    let obj = deliver.search2obj(location.href),
                        season_type = obj.season_type || "",
                        player_type = obj.player_type || "";
                    aid = 1 * obj.aid ? 1 * obj.aid : (obj.aid ? deliver.convertId(obj.aid) : (obj.bvid ? deliver.convertId(obj.bvid) : ""))
                    cid = obj.cid || JSON.parse(xhr.false(deliver.obj2search(API.url.pagelist,{"aid" : aid}))).data[0].cid
                    // 重定向到旧版播放器
                    location.replace(deliver.obj2search(API.playerframe.html5player,{"aid" : aid,"cid" : cid,"season_type" : season_type,"player_type" : player_type,"as_wide" : 1,}));
                    debug.log("嵌入播放器", "aid=", aid, " cid=", cid);
                }
            }
            catch(e) {debug.error("框架·嵌入", ...e)}
        },
        // 播单
        playlist : () => {
            // 保存播单号并跳转到收藏
            if (!config.rewrite.playlist) return;
            pl = 1 * LOCATION[5].match(/[0-9]+/)[0];
            GM_setValue("playlist", pl);
            location.replace("https://www.bilibili.com/medialist/play/ml182603655");
        },
        // 收藏
        medialist : () => {
            if (LOCATION[5].startsWith("ml")) {
                ml = 1 * LOCATION[5].match(/[0-9]+/)[0];
                pl = GM_getValue("playlist") ? GM_getValue("playlist") : "";
                if (pl) {
                    // 判断是否播单重定向而来并把网址修改回去(免跳转)
                    history.replaceState(null,null, "https://www.bilibili.com/playlist/video/pl" + pl);
                    GM_setValue("playlist", 0);
                    GM_setValue("medialist", 0);
                    // 重写网页框架并调用后续处理
                    deliver.write(API.pageframe.playlist);
                    deliver.setPlayList();
                }
                else {
                    // 保存收藏号并调用av跳转
                    if (!config.rewrite.medialist) return;
                    GM_setValue("medialist", ml);
                    deliver.setMediaList.init(ml);
                }
            }
            // 新版稍后再看跳转到旧版稍后再看
            if (LOCATION[5].startsWith("watchlater") && config.rewrite.watchlater) location.replace("https://www.bilibili.com/watchlater/#/"); // 重定向稍后再看
        },
        // 静态av
        svideo : () => {
            // 直接跳转回普通av
            if (!config.reset.static) return;
            location.replace(location.href.replace("s/video", "video"));
        },
        // 空间
        space : () => {
            // 调用注册时间处理
            mid = LOCATION[3] ? 1 * LOCATION[3] : mid;
            deliver.setJoinTime();
        },
        // 主页
        home : () => {
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
            catch(e) {debug.error("框架·主页", ...e)}
            // 调用在线数据处理
            deliver.setOnline();
        }
    }

    // 初始化设置
    defig = JSON.parse(JSON.stringify(config));
    let data = GM_getValue("config");
    if (data) {
        // 读取脚本管理器中的修改过的设置
        for (let key in data.rewrite) if (key in config.rewrite) config.rewrite[key] = data.rewrite[key];
        for (let key in data.reset) if (key in config.reset) config.reset[key] = data.reset[key];
    }
    else GM_setValue("config",config);
    try {
        // 关闭Worker才能hook到弹幕
        if (config.reset.danmuku) unsafeWindow.Worker = null;
        // 关闭show_bv
        if (config.reset.bvid2av) {
            unsafeWindow.__BILI_CONFIG__ = {"show_bv" : false};
            Object.defineProperty(unsafeWindow, '__BILI_CONFIG__', {writable : false});
        }
        // 清空预置的直播数据
        if (LOCATION[2] == 'live.bilibili.com' && config.reset.roomplay) {
            unsafeWindow.__NEPTUNE_IS_MY_WAIFU__ = undefined;
            Object.defineProperty(unsafeWindow, '__NEPTUNE_IS_MY_WAIFU__', {writable : false});
        }
        // uid判断是否登录
        uid = deliver.getCookies().DedeUserID;
        // 维护旧版播放器设置
        let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
        if (bilibili_player_settings) {
            bilibili_player_settings = JSON.parse(bilibili_player_settings);
            if (bilibili_player_settings.video_status.autopart !== "") GM_setValue("bilibili_player_settings", bilibili_player_settings);
            else if (GM_getValue("bilibili_player_settings")) localStorage.setItem("bilibili_player_settings", JSON.stringify(GM_getValue("bilibili_player_settings")));
        }
        else if (LOCATION[2] == 'www.bilibili.com' && GM_getValue("bilibili_player_settings")) localStorage.setItem("bilibili_player_settings", JSON.stringify(GM_getValue("bilibili_player_settings")));
        // 维护旧版动态状态
        if (uid) {
            let offset = deliver.getCookies()["bp_video_offset_"+ uid];
            if (offset) document.cookie = "bp_t_offset_" + uid + "=" + offset + "; domain=bilibili.com; expires=Aug, 18 Dec 2038 18:00:00 GMT; path=/";
        }
    }
    catch(e) {debug.error("初始化", ...e)}

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
    }
    else if (LOCATION[2] == 'www.bilibili.com') thread.home();

    // 全局调用
    // 绘制设置入口
    if (window.self == window.top) UI.init();
    // 创建全局样式
    deliver.setGlobalStyle();
    // 启用xhr hook
    intercept.init();
    // DOM修改监听调用
    document.addEventListener("DOMNodeInserted",(msg) => {
        // 去除预览提示框
        if (/bilibili-player-video-toast-pay/.test(msg.target.className)) deliver.removePreview(msg.target);
        // 版面替换
        if (msg.target.id == "internationalHeader") deliver.reSction();
        if (msg.target.id == "bili-header-m") if (document.getElementById("internationalHeader")) document.getElementById("internationalHeader").remove();
        // 切p监听
        if (/bilibili-player-video-btn-start/.test(msg.target.className)) deliver.switchVideo();
        // 创建播放器右键下载菜单
        if (/bilibili-player-context-menu-container/.test(msg.target.className)) deliver.download.init(msg.target);
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
        // 修复评论楼层
        if (src && (/l_id/.test(msg.target.id) || /reply-wrap/.test(msg.target.className))) deliver.setReplyFloor(src);
        // 跳过充电鸣谢
        if (/bilibili-player-electric-panel-jump/.test(msg.relatedNode.className)) deliver.electricPanelJump(msg.relatedNode);
        // 修复分区排行
        if (msg.target.id == "bili_movie" || msg.target.id == "bili_teleplay" || msg.target.id == "bili_documentary") deliver.fixrank(msg.target);
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
