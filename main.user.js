// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      7.1.0
// @description  恢复Bilibili旧版页面，为了那些念旧的人。
// @author       MotooriKashin，wly5556
// @homepage     https://github.com/MotooriKashin/Bilibili-Old
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        *://*.bilibili.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM.cookie
// @run-at       document-start
// @license      MIT
// @resource     index-icon.json https://www.bilibili.com/index/index-icon.json
// @resource     protobuf.js https://cdn.jsdelivr.net/npm/protobufjs@6.10.1/dist/protobuf.min.js
// @resource     comment.min.js https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@c74067196af49a16cb6e520661df7d4d1e7f04e5/src/comment.min.js
// @resource     bilibiliPlayer.js https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@a7e9b2cf614c377712ad23e010838e37c61b18c6/dist/bilibiliPlayer.min.js
// @resource     comment.js https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@e34ba53279212adc855ff0f17fbdde5d61a4f11e/dist/comment.min.js
// ==/UserScript==

"use strict";
/** 封装脚本管理器提供的API */
GM.xmlHttpRequest = GM_xmlhttpRequest;
GM.getValue = GM_getValue;
GM.setValue = GM_setValue;
GM.deleteValue = GM_deleteValue;
GM.listValues = GM_listValues;
GM.getResourceText = GM_getResourceText;
GM.getResourceURL = GM_getResourceText;
GM.DOM = document;
"use strict";
/** 模块打包点，**模块中不可用！** */
const modules = {};

/**/modules["alert.css"] = /*** ./CSS/alert.css ***/
`.table {
    line-height   : 14px;
    display       : flex;
    flex-direction: column;
    box-sizing    : border-box;
    top           : 50%;
    background    : #FFFFFF;
    box-shadow    : 0 3px 12px 0 rgb(0 0 0 / 20%);
    border-radius : 10px;
    width         : 300px;
    height        : auto;
    padding       : 18px;
    position      : fixed;
    left          : 50%;
    transform     : translateX(-50%) translateY(-50%);
    z-index       : 11124;
}

.title {
    line-height  : 22px;
    margin-left  : 2px;
    margin-bottom: 10px;
    font-size    : 14px;
}

.text {
    margin-bottom: 3px;
    margin-left  : 2px;
}

.act {
    line-height    : 154%;
    align-items    : center;
    border-radius  : 4px;
    box-sizing     : border-box;
    cursor         : pointer;
    display        : inline-flex;
    flex-shrink    : 0;
    font-weight    : 500;
    min-width      : 5.14em;
    outline-width  : 0;
    overflow       : hidden;
    padding        : 8px 16px;
    position       : relative;
    user-select    : none;
    border         : none;
    color          : #fff;
    justify-content: space-around;
}`;
/*!***********************!*/
/**/modules["animated-banner.css"] = /*** ./CSS/animated-banner.css ***/
`.animated-banner {
  position: absolute;
  top     : 0;
  bottom  : 0;
  left    : 0;
  right   : 0;
}

.animated-banner>.layer {
  position       : absolute;
  left           : 0;
  top            : 0;
  height         : 100%;
  width          : 100%;
  display        : flex;
  align-items    : center;
  justify-content: center;
  overflow       : hidden;
}

@keyframes banner-fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.animated-banner .layer {
  animation: banner-fade-in 0.7s;
}`;
/*!***********************!*/
/**/modules["avatarAnimation.css"] = /*** ./CSS/avatarAnimation.css ***/
`/* 鼠标放在顶栏上的动效 */
.bili-header-m .profile-info .i-face .face {
    border: 0
}

.bili-header-m .profile-info .i-face .pendant {
    transform : scale(0.5);
    width     : 112px;
    height    : 112px;
    left      : -41px;
    bottom    : -46px;
    opacity   : 0;
    transition: opacity .1s ease-in
}

.bili-header-m .profile-info.on .i-face {
    left            : 8px;
    top             : 0;
    height          : 32px;
    width           : 32px;
    transform       : translateY(10px) translateX(-16px) scale(2);
    transform-origin: top left
}

.bili-header-m .profile-info.on .i-face .legalize {
    transform: scale(0.5) translate(10px, 15px)
}

.bili-header-m .profile-info.on .i-face .pendant {
    opacity: 1
}

.bili-header-m .profile-info.on .i-face .face {
    border    : 0;
    box-shadow: 0 0 0 2px #fff
}

.bili-header-m .profile-info.on .i-face.scale-in {
    transform: translateY(5px) translateX(-10px) scale(1.75)
}

.bili-header-m .profile-info.on .scale-in .face {
    height: 32px;
    width : 32px
}

.bili-header-m .profile-info.on .i-face.scale-in .legalize {
    transform: scale(0.5) translate(38px, 48px)
}`;
/*!***********************!*/
/**/modules["bgray-btn.css"] = /*** ./CSS/bgray-btn.css ***/
`.player-wrapper {
    position: relative;
}

.player-fullscreen-fix {
    position: fixed;
    top     : 0;
    left    : 0;
    margin  : 0;
    padding : 0;
    width   : 100%;
    height  : 100%;
}

.player-fullscreen-fix #bofqi .player {
    position     : fixed !important;
    border-radius: 0;
    z-index      : 100000 !important;
    left         : 0;
    top          : 0;
    width        : 100% !important;
    height       : 100% !important;
}

.bgray-btn-wrap {
    position   : absolute;
    top        : 10px;
    left       : 50%;
    margin-left: 490px;
    width      : 70px;
    height     : 200px;
}

.widescreen .bgray-btn-wrap {
    margin-left: 580px;
}

.bgray-btn {
    transition      : all 0.3s;
    cursor          : pointer;
    margin          : 10px 0;
    background-color: #fff;
    text-align      : center;
    padding         : 7px 5px;
    display         : block;
    left            : 100%;
    font-size       : 12px;
    line-height     : 12px;
    margin-left     : 10px;
    width           : 20px;
    border-radius   : 4px;
    border          : 1px solid #e5e9ef;
    color           : #99a2aa;
}

.bgray-btn-feedback {
    height       : 72px;
    margin-bottom: 5px;
}

.bgray-btn-help {
    height    : 24px;
    margin-top: 5px;
}

.bgray-btn:hover {
    color       : #6d757a;
    border-color: #6d757a;
}

.bgray-btn.player-feedback-disable {
    color: #ccd0d7
}

.bgray-btn.player-feedback-disable:hover {
    color       : #ccd0d7;
    border-color: #ccd0d7;
}

.bgray-btn.player-feedback-disable {
    color: #ccd0d7
}

.bgray-btn.player-feedback-disable:hover {
    color       : #ccd0d7;
    border-color: #ccd0d7;
}

.bgray-btn.active {
    cursor      : default;
    color       : #00a1d6;
    border-color: #00a1d6;
}

.bgray-line {
    display      : none;
    width        : 42px;
    margin       : 0 auto;
    border-bottom: 1px solid #e5e9ef;
}

.bgray-btn {
    display: none;
}

.bgray-btn.show {
    display: block;
}

@media screen and (min-width: 1400px) {
    .bgray-btn-wrap {
        margin-left: 580px;
    }
}

.bgray-btn.happyfoolsday {
    line-height     : 13px;
    background-color: #00a1d6;
    border-color    : #00a1d6;
    color           : #fff;
}

.bgray-btn.happyfoolsday:hover {
    background-color: #00b5e5;
    border-color    : #00b5e5;
    color           : #fff;
}`;
/*!***********************!*/
/**/modules["bofqi.css"] = /*** ./CSS/bofqi.css ***/
`#bofqi .player {
    width  : 980px;
    height : 620px;
    display: block;
}

@media screen and (min-width:1400px) {
    #bofqi .player {
        width : 1160px;
        height: 720px
    }
}`;
/*!***********************!*/
/**/modules["button.css"] = /*** ./CSS/button.css ***/
`.button {
    line-height    : 154%;
    align-items    : center;
    border-radius  : 4px;
    box-sizing     : border-box;
    cursor         : pointer;
    display        : inline-flex;
    flex-shrink    : 0;
    font-weight    : 500;
    height         : 32px;
    justify-content: center;
    min-width      : 5.14em;
    outline-width  : 0;
    overflow       : hidden;
    padding        : 8px 16px;
    position       : relative;
    user-select    : none;
}

.button {
    background-color: #fff;
    color           : rgb(26, 115, 232);
    border          : 1px solid rgba(0, 0, 0, 6%);
}

.button:hover {
    background-color: rgba(26, 115, 232, 6%);
}

.button:active {
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 10%);
}

.button[disabled] {
    pointer-events  : none;
    background-color: rgba(239, 239, 239, 0.3);
    border          : 1px solid rgba(118, 118, 118, 0.3);
    color           : rgba(16, 16, 16, 0.3);
}`;
/*!***********************!*/
/**/modules["checkbox.css"] = /*** ./CSS/checkbox.css ***/
`/* 复选框 */
.box {
  display: inline-flex;
}

.checkbox {
  align-items: center;
  display    : flex;
  min-height : auto;
  padding    : 0;
  cursor     : pointer;
}

.checkbox .checklabel {
  height            : 16px;
  margin-block-start: 0px;
  position          : relative;
  width             : 16px;
  border-radius     : 50%;
}

.checklabel .disc-border {
  border       : 2px solid rgb(95, 99, 104);
  box-sizing   : border-box;
  height       : 16px;
  width        : 16px;
  border-radius: 50%;
}

.checklabel .disc-border[checked] {
  border-color: rgb(26, 115, 232);
}

.checklabel .disc {
  background-color: transparent;
  position        : absolute;
  top             : 0;
  transform       : scale(0);
  transition      : border-color 200ms, transform 200ms;
  box-sizing      : border-box;
  height          : 16px;
  width           : 16px;
  border-radius   : 50%;
}

.checklabel .disc[checked] {
  background-color: rgb(26, 115, 232);
  transform       : scale(0.5);
}

.checkbox .checkvalue {
  flex               : 1;
  margin-inline-start: 5px;
  margin-inline-end  : 5px;
}`;
/*!***********************!*/
/**/modules["closedCaption.css"] = /*** ./CSS/closedCaption.css ***/
`/* CC字幕相关样式 */
/*对齐，悬停按钮显示菜单*/
#subtitle-setting-panel>div>* {
    margin-right: 5px;
}

#bilibili-player-subtitle-btn:hover>#subtitle-setting-panel {
    display: block !important;
}

/*滑动选择样式*/
#subtitle-setting-panel input[type="range"] {
    background-color  : #ebeff4;
    -webkit-appearance: none;
    height            : 4px;
    transform         : translateY(-4px);
}

#subtitle-setting-panel input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height            : 15px;
    width             : 15px;
    background        : #fff;
    border-radius     : 15px;
    border            : 1px solid;
}

/*复选框和其对应标签样式*/
#subtitle-setting-panel input[type="checkbox"] {
    display: none;
}

#subtitle-setting-panel input~label {
    cursor: pointer;
}

#subtitle-setting-panel input:checked~label:before {
    content: '\\2714';
}

#subtitle-setting-panel input~label:before {
    width         : 12px;
    height        : 12px;
    line-height   : 14px;
    vertical-align: text-bottom;
    border-radius : 3px;
    border        : 1px solid #d3d3d3;
    display       : inline-block;
    text-align    : center;
    content       : ' ';
}

/*悬停显示下拉框样式*/
#subtitle-setting-panel .bpui-selectmenu:hover .bpui-selectmenu-list {
    display: block;
}

/*滚动条样式*/
#subtitle-setting-panel ::-webkit-scrollbar {
    width: 7px;
}

#subtitle-setting-panel ::-webkit-scrollbar-track {
    border-radius   : 4px;
    background-color: #EEE;
}

#subtitle-setting-panel ::-webkit-scrollbar-thumb {
    border-radius   : 4px;
    background-color: #999;
}`;
/*!***********************!*/
/**/modules["commandDm.css"] = /*** ./CSS/commandDm.css ***/
`.commandDm-popup {
  border-radius   : 1rem;
  background-color: #f5f5f5;
  position        : absolute;
  cursor          : default;
  opacity         : 0;
  transition      : opacity 0.2s;
  padding         : 0.8rem 1rem;
}

.commandDm-popup.on {
  opacity: 1;
}

.vote-dialog {
  overflow      : hidden;
  display       : flex;
  flex-direction: column;
}

.vote-panel {
  display        : flex;
  justify-content: space-between;
  width          : 100%;
}

.vote-title,
.grade-title {
  font-weight  : bolder;
  margin-bottom: 0.5rem;
}

.vote-option {
  display       : flex;
  flex-direction: column;
  width         : 100%;
}

.vote-button {
  text-align      : center;
  min-width       : 85px;
  display         : inline-block;
  padding         : 0.3rem 2rem;
  border          : 1px solid #00a1d6;
  border-radius   : 5px;
  margin          : 0.2rem 0;
  background-color: #fff;
  cursor          : pointer;
}

.vote-button:hover {
  background-color: #1baada;
  color           : #f5f5f5;
  transition      : all 0.15s ease-out;
}

.vote-button::before {
  position: absolute;
  padding : 0 1.8rem;
  left    : 0;
  content : attr(idx);
}

.vote-progress-bg {
  border-radius   : 5px;
  min-width       : 85px;
  margin          : 0.2rem 0;
  border          : 1px solid #1a1a1a6b;
  background-color: white;
  position        : relative;
}

.vote-progress {
  transition      : width 0.3s, background-color 0.2s;
  animation       : opacity-animation 0.5s;
  overflow        : hidden;
  display         : inline-block;
  border-radius   : 4px 0 0 4px;
  background-color: #d3d3d3;
  text-align      : left;
  overflow        : visible;
  position        : relative;
}

.vote-progress-blue {
  background-color: #9fdef3;
}

.vote-progress-desc {
  display: inline-block;
  margin : 0.3rem 0.8rem;
}

@keyframes opacity-animation {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.vote-count {
  display : inline-block;
  position: absolute;
  right   : 0.8rem;
  top     : 0.3rem;
}

.vote-count::after {
  content: "票";
}

.bilibili-player-video-popup {
  z-index       : 100;
  position      : absolute;
  top           : 0;
  left          : 0;
  width         : 100%;
  height        : 100%;
  pointer-events: none;
}

.bilibili-player-video-popup>* {
  pointer-events: all;
}

.link-button {
  animation       : opacity-animation 0.2s;
  position        : absolute;
  left            : 40%;
  top             : 20%;
  background-color: #f5f5f5;
  padding         : 0.4rem 1rem;
  border-radius   : 0.6rem;
  font-size       : large;
  box-shadow      : #888888c7 0px 0px 6px;
}

.link-button:hover {
  color : #00a1d6;
  cursor: pointer;
}

.link-button>* {
  vertical-align: middle;
}

.link-button>img {
  transform: scale(0.7) translateY(-1px);
}

.danmaku-up-icon::before {
  content         : "UP主";
  background-color: #00a1d6;
  border-radius   : 5px;
  font-size       : 0.8em;
  padding         : 0.1em;
  transform       : translateY(-0.1em);
  display         : inline-block;
  box-shadow      : #888888c7 0px 0px 6px;
}

.grade-score-area>div {
  display   : inline-block;
  position  : relative;
  width     : 41px;
  transition: width 0.3s;
}

.grade-score-area.pointer {
  cursor: pointer;
}

.grade-score-area>div:last-child {
  width: 20px;
}

.grade-score-area .score-button {
  filter: grayscale(1);
}

.grade-score-area .highlight .score-button {
  filter: none;
}

.grade-score-area .bg {
  position  : absolute;
  left      : 0;
  filter    : blur(9px);
  visibility: hidden;
}

.grade-score-area .highlight .bg {
  visibility: visible;
}

.grade-score-info {
  position: absolute;
  right   : 1rem;
  bottom  : 0.6rem;
  opacity : 0;
}

@keyframes grade-score-showup {
  0% {
    opacity  : 0;
    transform: translateY(5px);
  }

  100% {
    opacity  : 1;
    transform: translateY(0);
  }
}

@keyframes grade-score-hit {
  0% {
    filter: brightness(1);
  }

  30% {
    filter: brightness(1.5);
  }

  100% {
    filter: brightness(1);
  }
}`;
/*!***********************!*/
/**/modules["comment.css"] = /*** ./CSS/comment.css ***/
`.bb-comment .comment-header .header-page,
.comment-bilibili-fold .comment-header .header-page {
    float      : right;
    line-height: 36px;
}

.bb-comment .comment-list .list-item .user .text-con,
.comment-bilibili-fold .comment-list .list-item .user .text-con {
    margin-left: initial;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con .user>a,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con .user>a {
    margin-left: initial;
}

.user-card .info .user .vip-icon {
    max-width       : 58px;
    height          : 16px;
    border-radius   : 2px;
    margin-left     : 8px;
    background-color: #FF6699;
    font-size       : 12px;
    font-weight     : 400;
    color           : #fff;
    white-space     : nowrap;
    padding         : 1px;
    padding-inline  : 4px;
}

.user-card .info .verify {
    color      : #9499A0;
    line-height: 17px;
    margin-top : 11px;
}

.user-card .info .verify .auth {
    display       : inline-block;
    vertical-align: bottom;
    position      : relative;
    left          : -3px;
    width         : 16px;
    height        : 16px;
}

.reply-item .reply-con .user .stick {
    zoom: 0.9;
}`;
/*!***********************!*/
/**/modules["danmakuHashId.css"] = /*** ./CSS/danmakuHashId.css ***/
`/* 反查弹幕发送者相关样式 */
.bb-comment,
.comment-bilibili-fold {
    font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
    font-size  : 0;
    zoom       : 1;
    min-height : 100px;
    background : #fff;
}

.bb-comment .comment-list,
.comment-bilibili-fold .comment-list {
    padding-top: 20px;
}

.bb-comment *,
.comment-bilibili-fold * {
    box-sizing: content-box;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .reply-face,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-face {
    display       : inline-block;
    position      : relative;
    margin-right  : 10px;
    vertical-align: top;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .reply-face img,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-face img {
    width        : 24px;
    height       : 24px;
    border-radius: 50%;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con {
    display: inline-block;
    width  : calc(100% - 34px);
}

.bb-comment .comment-list .list-item .user,
.comment-bilibili-fold .comment-list .list-item .user {
    font-size     : 12px;
    font-weight   : 700;
    line-height   : 18px;
    padding-bottom: 4px;
    display       : block;
    word-wrap     : break-word;
    position      : relative;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con .user .name,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con .user .name {
    position: relative;
    top     : -1px;
}

.bb-comment .comment-list .list-item .reply-box .reply-item .level,
.comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .level {
    margin: 0 15px 0 8px;
}

.bb-comment .comment-list .list-item .user .level.l0,
.comment-bilibili-fold .comment-list .list-item .user .level.l0 {
    background-position: -23px -28px
}

.bb-comment .comment-list .list-item .user .level.l1,
.comment-bilibili-fold .comment-list .list-item .user .level.l1 {
    background-position: -23px -92px
}

.bb-comment .comment-list .list-item .user .level.l2,
.comment-bilibili-fold .comment-list .list-item .user .level.l2 {
    background-position: -23px -156px
}

.bb-comment .comment-list .list-item .user .level.l3,
.comment-bilibili-fold .comment-list .list-item .user .level.l3 {
    background-position: -23px -220px
}

.bb-comment .comment-list .list-item .user .level.l4,
.comment-bilibili-fold .comment-list .list-item .user .level.l4 {
    background-position: -23px -284px
}

.bb-comment .comment-list .list-item .user .level.l5,
.comment-bilibili-fold .comment-list .list-item .user .level.l5 {
    background-position: -23px -348px
}

.bb-comment .comment-list .list-item .user .level.l6,
.comment-bilibili-fold .comment-list .list-item .user .level.l6 {
    background-position: -23px -412px
}

.bb-comment .comment-list .list-item .user .level.l7,
.comment-bilibili-fold .comment-list .list-item .user .level.l7 {
    background-position: -23px -476px
}

.bb-comment .comment-list .list-item .user .level.l8,
.comment-bilibili-fold .comment-list .list-item .user .level.l8 {
    background-position: -23px -540px
}

.bb-comment .comment-list .list-item .user .level.l9,
.comment-bilibili-fold .comment-list .list-item .user .level.l9 {
    background-position: -23px -604px
}

.bb-comment .comment-list .list-item .user .level,
.comment-bilibili-fold .comment-list .list-item .user .level {
    display       : inline-block;
    width         : 19px;
    height        : 9px;
    vertical-align: middle;
    margin        : 0 8px;
    background    : url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAMAAAB6fSTWAAAA51BMVEUAAACYoKhwd3yboqni5emDjJL7+/yZoqoAodbnix8AodYAodaZoqoAodYAodaln5jnix8Aodbnix8AodaZoqoAodbnix8Aodbnix/yXY6ZoqoAodYAodYAodaZoqoAodaZoqryXY7yXY4AodbyXY6ZoqryXY6ZoqoAodaZoqoAodaZoqryXY7nix8AodYAodbnix+ZoqqZoqrnix8AodYAodbnix+Zoqr////19vfM0NcAoda/v7/l6e9MyP//u1PlL+z/s3yS0eWV3bL/bAAVFRX/AACEHPnnix+M2fn/1pbyXY4iIiIkv4BgAAAAOHRSTlMA9fUreZKu4eI+EfDtgtwP7AkexYcv2WfIsP3refnX0mcmGUPyxsScjXkXF++zoZpMMyn+Ppl8Q6/LsKoAAA3QSURBVHja7NvdbtowGIfxP7UsaEqbfkGj0bWVpqofiK0f2nZALyD3f0V7E4KsbULCjpRA9fykQDjw4SOb2BEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG2cF4X64vzAeJc+/sDYeGDH3Q0e1MrV1x9q4eW0LNUTP2j4xPEHDS9gp70O50O1MRk9j5Tu13tZhX4+LdS5ejJvpnUlqCfzZloXsMPym99qFfrZ7Telh54vyop1Xk7VNevbqeas+KT5fD2eOR3b+FhR1/L84dJaz42SZNnPR2UnWZadKV7+Mi1rss7P1THXdB7u47iq83DP/3RsijtQpevQ78bjL/fS29CMHxTvana0vDjT5MTMviuSVb6movvO5Qe+Wr2vLvsRP6H7avW+ujxTOjaErrrw+mq+1K1hrqHWxoo3yjTS2kyRTssQeh9sEg+hO/uIZJN4CN3xLx07G7pC6G/3KaErhD65UKQyUGEfhbplaYfQlRK6Quja29CPj4W/febQn55ahn59vY+hO9VcWuhh/P6GfrxcUvq/PnHo965l6BcTRZruwNLdexnv05buYfzeLt2tc0qPkBi6qb77D31+o3ahP58o1mERQl8U/TyMc3bZjUt9GOfsshvHwzhsDt00jdf3fYZ+d9ky9KtHxcsPe99ec746NJO+veZ8dWiG7TVs9PGfzkOfr0PPb16TQn9eh57dTtoemCm0NQ7MAHH76OOVJylxH/2oNrtufQR2oa1xBBbYN/ZSy7ui8VILsF94TRUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAH3buoMVNIAzA8BxESA5ldyHkUui1p/Y6YrJ71v//g/rFmFoKaaMBdZPngTWzh+/4MqKTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwIMqyirnqizungfWqihzryzum5c6rFVkWrUfoa0i1Unzx+Y9NMfTPKzZvv6ZnlJ02n702ih1wnzz3muUzrrt6rpOS3kbFrMrzp0PpRdj57vOh9LdvbNer/WCob+9bFJn8zJ/6eWl87Y9l16OnW/6xpvuakvnvw5naW7bbX2y3W5f0xI2UXr/MbciV33nffBVLsbNH/vO++CPtnSuxT3o/k/z2td/+JGWEIkv0vmwobf596KcsqE3ORa2dK46nNLuLsNiXpF3/F2kRUTkC3QeqnzpPBadXI2bv3Qei07Mg9CvlR6dLyDnc+ehqqou9Dxu/tJ5zB+70HOCtYf+Nd3sgUKvcqedGno/3widTxL6Lt3skW7do+/ofPKtezh17tadf4YeTp8rCP1Lup2HcR7GMSL00BfeNb5o6N/TzR7r9Vobnd/zeq2Jzr1e47rD35YM/dsujfMwB2bauE4/MNMdl7Ghs2r7+o5HcY7AOgILn4AvtcAz8DVVeAZ+eAKegp+SAgAAAAAAAAAAAAAAAAAAAH6xczctbQRxAIf/RmHDGgyiQWisCkV8gxaF0nZDTjkF+v0/T4dNrIFe6g5JnOR5srksDHP6wTCzDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlKhZdXRY3HjgPzS/Vkybd5fW/FyRxmfOr3RorS/0ZHqUEXqSxufODyRrDD1pckJPmuz5gQihQxc3g8GnwcJDdHAxPp4ct8aXUR6hsx+qp6iiNbx6jvfrP0Y/WvX1KIojdDZtthCbVbVP6+a8S+jt07q4j+IsQjvIDH2eGfpU6Dtutioi2WLoT1d5oT+eRHEWof0+yAt9Ms8LvZkKfbfNoi28/be2GXrcHmaFHmflrd2XoafSs0KfzPNCb6ZC32kfK/SHh7zQL8vbjluGnkrPC30yzwu9mQp9l62Evv2le7zc5oU+OovS/A29J3Q66BT6Vjbjhm+hx6BD6PVb6DGO0ryG3rN0Z41e406/jNBzz9FvI16qZHDX7Rz97DRGJ8n4a5RmGXrPZhzr1Gb92vjyzaYNh3fnMbwaJtFFXX+/j/qkruvTKM4itJ7jNdZq9q/YuFT5j6iiu9PrL9GPIvlghj3yXD1VkWHUfxS60Pnwbg7uIsfF529RJKHDHhA67AEXT8AecJUU7IHG5ZAAAAAAAAAAAAAAAMAfdu6etUEgDuDwNcnkUMgQshS6dmrXeOKSLdDv/3kqlxeELCVXk9T/84Aogtz0w+OUAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAmVqu8ti/ex74RWe5b8dueH43Vj0+8PdWfVsV2mrofOyG8YUOU8ttXWh5Vxd6boUOV4QOt9h2F28pHqETwxD4cBTvmxSO0Lm3/VGqUBd695HCuYT2Uhn6oTL0Xuhzth8rdx4Z+msKJ587/64L/dDVhd5noc/ZPpXCy1E8LPQi3tw9nzuvC/3Q1YXeZ6HP2pOFHm85Lp86rwv90NWF3mehz9so9CeYug+X0Rz7WgidKzN+o0cN3dSdaZ36LufHhL7tRj5TNLk9WliMY0Il69J3xap7paYpkTdNs07h5PZk4fMa09lfS/e3Djlr98MM0WyELnQC2HZfKSShQwBChwBsPAEB2EoKIljaHBIAAAAAAAAAAPhhzw5WGwSiMIzekCGbkF1Wgb5HhzIL3/+lClaCEixCCMl4zwER3H/8OgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADtX2gYlgJ617w1aAD0TOiQgdEhA6JCA0CEBoUMCQocEhA4JCB0SEDokIHRIQOiQgNBJ6nq4xlMu50t0Q+gkdbsd4ilfP+fohtB5o+FPbGTRhU4vhrkYr+CB0OnbEPfChb5O6PTtU0L36i505l4Z+vRkI4dxQqcXi9AHi75C6PRt6nu6+0ZfIXT6NmY99i30/widrg0z/qOvEjo4jBM6WHShQ0ZChwSEDgkIHRIQOiQgdEhA6JDAQ+i1tSp02Je2rLy2cjyWVqvQYUfaYsxPJUbl1KrQYTfaYszjbpx1of+yZ8c4DINAFAW3QJwpFO64/5kiMAUU6eP1jGS5oH76loEcajvGfDlnvdUAnqxc7dOuY8yPWZ/HJYBHK3WN+e9jnQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPyNfgsgmb6LQeiQTo9Z+P2ERYeUhA4vsIXu0x2y2kOfhA75rL7HW+iQ1cx69O2vO+TVN+7RAQAAAAAAAAAAvuzZwQnAIBBE0a1u+i8pqBch15wm74FawWdFAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvpFjgDK5zSJ0qJPZhZ81JjpUEjr8wBW6qzu0ek10oUOfTJZ1Ch1aZW/JeHWHXrn4RwcAAAAAAHjYs2MbgIEQCIKURv9VWY8dfAGOjhkJUcFGBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8I9+FRCmb3UIHeJ0TeFzQ+iQR+iwgNBhAaHDAl/f5wsdUk3W07fQIVZf7OgAAAAPe3ZQA0AIQ1Gw7r5/Rxu6lwrgVGYSqIIXCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANyRXwHLZKpD6LBOqgvv1UPosI/Q4QEjdFd32MqJDg9I5ThT6LBVekvKqzvslcE/+sduHZ0AAIIAFHQ5918pMggH6MvuQJzgoQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kEcAw2cUmdBgnowqvqSV0mEfo8IEWutcdprqh17joiz07tgEQhgEgmBoEUuQaZZDU3n8lCBUbIFl3hT3BNzaUlC2XtYUOVeU7MpurO9SVH/7oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL+L+YgGVBZzaUBp2xA6FNaP8zqPmEPoUFaPueyxCf1mz45NIIaBIAAqdCKBcOTAgZBDh86uhO+/n9fzTZhjJtgOloNbSKtGm322qGX3jIOsWjwrn2gFSOuMvrLHWYC0WkwXHbKrsc0+t6gFSKvv8bP3AuT139H1HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4OXGcV3HKEBi4/4st6Z/2bODG4BhEAaArJFnoyjLeP99WnUMuHuwgQXC0NnK2vsbBfR1sqt2TgF9CToM4HSHATzjYIJnJeo16O3mdwvoS9BhhqSA7q51DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAve3AgAAAAAADk/9oIqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrCHhwIAAAAAAD5vzaCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqwBwcCAAAAAED+r42gqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqirtwQEJAAAAgKD/r9sRqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8BfEgGFMI1IvvAAAAABJRU5ErkJggg==) no-repeat;
}`;
/*!***********************!*/
/**/modules["download.css"] = /*** ./CSS/download.css ***/
`.table {
    position       : fixed;
    z-index        : 11113;
    bottom         : 0;
    width          : 100%;
    min-height     : 50px;
    display        : flex;
    box-sizing     : border-box;
    background     : #fff;
    border-radius  : 8px;
    box-shadow     : 0 6px 12px 0 rgba(106, 115, 133, 22%);
    transition     : transform 0.3s ease-in;
    flex-wrap      : wrap;
    align-content  : center;
    justify-content: center;
    align-items    : center;
}

.cell {
    background-color: #fff;
    color           : #000 !important;
    border          : #ccc 1px solid;
    border-radius   : 3px;
    display         : flex;
    margin          : 3px;
    flex-wrap       : wrap;
    align-content   : center;
    justify-content : center;
    align-items     : center;
    flex-direction  : row;
}

.type {
    color         : #000 !important;
    display       : table-cell;
    min-width     : 1.5em;
    text-align    : center;
    vertical-align: middle;
    padding       : 10px 3px;
}

.item {
    display        : table-cell;
    text-decoration: none;
    padding        : 3px;
    cursor         : pointer;
    color          : #1184B4;
}

.item:hover {
    color: #FE3676;
}

.up {
    color           : #fff !important;
    text-align      : center;
    padding         : 1px 3px;
    background-color: #777;
}

.down {
    font-size : 90%;
    margin-top: 2px;
    text-align: center;
    padding   : 1px 3px;
}`;
/*!***********************!*/
/**/modules["hr.css"] = /*** ./CSS/hr.css ***/
`.hr {
    display         : flex;
    align-items     : center;
    grid-gap        : 0;
    gap             : 0;
    justify-content : space-between;
    flex-shrink     : 0;
    height          : 1px;
    background-color: rgba(136, 136, 136, 0.1);
    width           : 100%;
    margin-bottom   : 12px;
}`;
/*!***********************!*/
/**/modules["icon.css"] = /*** ./CSS/icon.css ***/
`.icon {
  align-items    : center;
  border-radius  : 50%;
  display        : flex;
  height         : 20px;
  justify-content: center;
  position       : relative;
  width          : 20px;
  box-sizing     : content-box;
  background     : none;
  cursor         : pointer;
}`;
/*!***********************!*/
/**/modules["imroot.css"] = /*** ./CSS/imroot.css ***/
`/* 修复顶栏样式 */
.im-root,
.im-root .im-list-box * {
    font-size  : 12px;
    line-height: 42px;
}

.im-root .im-list-box {
    width   : 100%;
    overflow: visible;
}

.im-root .im-list-box .im-list {
    line-height: 42px;
    height     : 42px;
}

.im-root .im-list-box .im-notify.im-number {
    height       : 14px;
    line-height  : 13px;
    border-radius: 10px;
    padding      : 1px 3px;
    font-size    : 12px;
    min-width    : 20px;
    text-align   : center;
    color        : #fff;
}

.im-root .im-list-box .im-notify.im-number.im-center {
    top : 14px;
    left: 80px;
}

.im-root .im-list-box .im-notify.im-dot {
    top          : 11px;
    right        : -10px;
    width        : 8px;
    height       : 8px;
    border-radius: 100%;
}

.im-root .im-list-box .im-notify.im-dot.im-center {
    top  : 16px;
    right: 20px;
}`;
/*!***********************!*/
/**/modules["input.css"] = /*** ./CSS/input.css ***/
`/* 输入框 */
.input {
  align-items        : center;
  display            : flex;
  justify-content    : space-between;
  position           : relative;
  background-color   : transparent;
  box-sizing         : border-box;
  padding            : 0;
  flex               : 1;
  flex-basis         : 0.000000001px;
  padding-block-end  : 12px;
  padding-block-start: 12px;
}

.input input {
  background-color    : transparent;
  box-sizing          : border-box;
  font-family         : inherit;
  font-size           : inherit;
  font-weight         : inherit;
  line-height         : inherit;
  min-height          : auto;
  outline             : none;
  padding-bottom      : 6px;
  padding-inline-end  : 8px;
  padding-inline-start: 8px;
  padding-top         : 6px;
  text-align          : inherit;
  text-overflow       : ellipsis;
  width               : 100%;
  border-radius       : 4px;
  border              : 1px solid rgba(136, 136, 136, 0.13333);
  box-shadow          : 0 4px 12px 0 rgb(0, 0, 0, 5%);
  transition          : box-shadow 120ms ease 180ms;
}

.input input:focus {
  box-shadow: inset 0 0 1px 1px rgba(26, 115, 232, 80%);
}

.input .icon {
  cursor          : pointer;
  outline         : none;
  padding         : 0;
  pointer-events  : auto;
  position        : absolute;
  right           : 12px;
  background-color: white;
}

.input .icon:hover {
  background-color: rgba(0, 0, 0, 10%);
  box-shadow      : 0 1 12px 12px rgb(0, 0, 0, 10%);
}`;
/*!***********************!*/
/**/modules["message.css"] = /*** ./CSS/message.css ***/
`/* 修复消息页样式 */
.container[data-v-6969394c] {
    height: calc(100vh - 42px) !important;
}

.container[data-v-1c9150a9] {
    height: calc(100vh - 42px) !important;
}`;
/*!***********************!*/
/**/modules["mini-bofqi.css"] = /*** ./CSS/mini-bofqi.css ***/
`/* 修正稍后再看迷你播放器样式 */
.bilibili-player .bilibili-player-area .bilibili-player-video-wrap.mini-player .bilibili-player-video-danmaku {
    top   : 30px;
    height: 240px;
}`;
/*!***********************!*/
/**/modules["oldReplySort.css"] = /*** ./CSS/oldReplySort.css ***/
`.bb-comment .comment-list .list-item .user-face img,
.comment-bilibili-fold .comment-list .list-item .user-face img {
    width        : 48px;
    height       : 48px;
    border-radius: 50%;
}

.bb-comment .comment-list .list-item .user-face .pendant,
.comment-bilibili-fold .comment-list .list-item .user-face .pendant {
    width   : 86px;
    height  : 86px;
    position: absolute;
    top     : -19px;
    left    : -19px;
    display : block;
}

.bb-comment .comment-list .list-item .user-face .pendant img,
.comment-bilibili-fold .comment-list .list-item .user-face .pendant img {
    border       : 0;
    border-radius: 0;
    width        : 86px;
    height       : 86px;
}`;
/*!***********************!*/
/**/modules["progress.css"] = /*** ./CSS/progress.css ***/
`.progress {
    --paper-progress-active-color   : rgb(26, 115, 232);
    --paper-progress-container-color: rgb(223, 222, 223);
    width                           : auto;
}

.progressContainer {
    background: rgb(223, 222, 223);
    height    : 4px;
    position  : relative;
}

.secondaryProgress,
.primaryProgress {

    position        : absolute;
    top             : 0;
    right           : 0;
    bottom          : 0;
    left            : 0;
    transform-origin: left center;
    transform       : scaleX(0);
    will-change     : transform;
}

.secondaryProgress {
    background: rgb(183, 225, 205);
}

.primaryProgress {
    background: rgb(26, 115, 232);
}

.progressTag {
    width          : 100%;
    padding-top    : 6px;
    display        : inline-flex;
    justify-content: space-between;
}`;
/*!***********************!*/
/**/modules["select.css"] = /*** ./CSS/select.css ***/
`/* 下拉列表 */
.select {
  align-items: center;
  display    : inline-flex;
}

select {
  background-color    : rgb(241, 243, 244);
  background-size     : 10px;
  border              : none;
  border-radius       : 4px;
  color               : rgb(32, 33, 36);
  cursor              : pointer;
  font-family         : inherit;
  font-size           : inherit;
  line-height         : inherit;
  max-width           : 100%;
  outline             : none;
  padding-bottom      : 6px;
  padding-inline-end  : 21px;
  padding-inline-start: 8px;
  padding-top         : 6px;
  width               : 200px;
}

option {
  background-color: #fff;
}`;
/*!***********************!*/
/**/modules["switch.css"] = /*** ./CSS/switch.css ***/
`/* 滑块开关 */
.switch {
  cursor   : pointer;
  display  : block;
  min-width: 34px;
  outline  : none;
  position : relative;
  width    : 34px;
}

.bar {
  background-color: rgb(189, 193, 198);
  border-radius   : 8px;
  height          : 12px;
  left            : 3px;
  position        : absolute;
  top             : 2px;
  transition      : background-color linear 80ms;
  width           : 28px;
  z-index         : 0;
}

.bar[checked] {
  background-color: rgb(26, 115, 232);
  opacity         : 0.5;
}

.bar:active {
  box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);
}

.knob {
  background-color: #fff;
  border-radius   : 50%;
  box-shadow      : 0 1px 3px 0 rgba(0, 0, 0, 40%);
  display         : block;
  height          : 16px;
  position        : relative;
  transition      : transform linear 80ms, background-color linear 80ms;
  width           : 16px;
  z-index         : 1;
}

.knob[checked] {
  background-color: rgb(26, 115, 232);
  transform       : translate3d(18px, 0, 0);
}

.knob:active {
  box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);
}

.knob i {
  color         : rgba(128, 134, 139, 15%);
  height        : 40px;
  left          : -12px;
  pointer-events: none;
  top           : -12px;
  transition    : color linear 80ms;
  width         : 40px;
  border-radius : 50%;
  bottom        : 0;
  display       : block;
  overflow      : hidden;
  position      : absolute;
  right         : 0;
  transform     : translate3d(0, 0, 0);
}

.knob i[checked] {
  color: rgb(26, 115, 232);
}

.knob i:active {
  box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);
}`;
/*!***********************!*/
/**/modules["ui-action.css"] = /*** ./CSS/ui-action.css ***/
`.contain {
  align-items     : center;
  border-top      : 1px solid rgba(0, 0, 0, 6%);
  display         : flex;
  min-height      : 24px;
  padding         : 0 20px;
  flex-wrap       : wrap;
  justify-content : flex-end;
  background-color: transparent !important;
}

.label {
  flex                : 1;
  flex-basis          : 0.000000001px;
  padding-block-end   : 12px;
  padding-block-start : 12px;
  padding-inline-start: 12px;
}

.sub {
  color      : rgb(95, 99, 104);
  font-weight: 400;
}

.button,
.action {
  line-height    : 154%;
  align-items    : center;
  border-radius  : 4px;
  box-sizing     : border-box;
  cursor         : pointer;
  display        : inline-flex;
  flex-shrink    : 0;
  font-weight    : 500;
  height         : 32px;
  justify-content: center;
  min-width      : 5.14em;
  outline-width  : 0;
  overflow       : hidden;
  padding        : 8px 16px;
  position       : relative;
  user-select    : none;
}

.action {
  border          : none;
  background-color: rgb(26, 115, 232);
  color           : #fff;
}

.button {
  background-color: #fff;
  color           : rgb(26, 115, 232);
  border          : 1px solid rgba(0, 0, 0, 6%);
}

.action:hover {
  background-color: rgb(72, 115, 232);
}

.button:hover {
  background-color: rgba(26, 115, 232, 6%);
}

.action:active {
  box-shadow: 0 0 1px 1px rgba(72, 115, 232, 80%);
}

.button:active {
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 10%);
}

.button[disabled],
.action[disabled] {
  pointer-events  : none;
  background-color: rgba(19, 1, 1, 0.1);
  border          : 1px solid rgba(0, 0, 0, 0.1);
  color           : white;
}`;
/*!***********************!*/
/**/modules["ui-contain.css"] = /*** ./CSS/ui-contain.css ***/
`.contain {
  margin-bottom       : 3px;
  padding-inline-start: 20px;
  padding-inline-end  : 20px;
  display             : flex;
  flex-direction      : column;
  outline             : none;
  position            : relative;
}

.header .title {
  color         : #000;
  font-size     : 108%;
  font-weight   : 400;
  letter-spacing: 0.25px;
  margin-bottom : 12px;
  margin-top    : 21px;
  outline       : none;
  padding-bottom: 4px;
  padding-top   : 8px;
}

.card {
  border-radius: 4px;
  box-shadow   : 0px 0px 1px 1px rgba(60, 64, 67, 30%);
  flex         : 1;
  color        : #000;
  line-height  : 154%;
  user-select  : text;
}`;
/*!***********************!*/
/**/modules["ui-file.css"] = /*** ./CSS/ui-file.css ***/
`.contain {
  align-items     : center;
  border-top      : 1px solid rgba(0, 0, 0, 6%);
  display         : flex;
  min-height      : 24px;
  padding         : 0 20px;
  flex-wrap       : wrap;
  justify-content : flex-end;
  background-color: transparent !important;
}

.label {
  flex                : 1;
  flex-basis          : 0.000000001px;
  padding-block-end   : 12px;
  padding-block-start : 12px;
  padding-inline-start: 12px;
}

.sub {
  color      : rgb(95, 99, 104);
  font-weight: 400;
}

.button,
.action {
  line-height    : 154%;
  align-items    : center;
  border-radius  : 4px;
  box-sizing     : border-box;
  cursor         : pointer;
  display        : inline-flex;
  flex-shrink    : 0;
  font-weight    : 500;
  height         : 32px;
  justify-content: center;
  min-width      : 5.14em;
  outline-width  : 0;
  overflow       : hidden;
  padding        : 8px 16px;
  position       : relative;
  user-select    : none;
}

.action {
  border          : none;
  background-color: rgb(26, 115, 232);
  color           : #fff;
}

.button {
  background-color: #fff;
  color           : rgb(26, 115, 232);
  border          : 1px solid rgba(0, 0, 0, 6%);
}

.action:hover {
  background-color: rgb(72, 115, 232);
}

.button:hover {
  background-color: rgba(26, 115, 232, 6%);
}

.action:active {
  box-shadow: 0 0 1px 1px rgba(72, 115, 232, 80%);
}

.button:active {
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 10%);
}

.button[disabled],
.action[disabled] {
  pointer-events  : none;
  background-color: rgba(19, 1, 1, 0.1);
  border          : 1px solid rgba(0, 0, 0, 0.1);
  color           : white;
}`;
/*!***********************!*/
/**/modules["ui-float.css"] = /*** ./CSS/ui-float.css ***/
`.float {
  top           : 0;
  right         : 0;
  position      : fixed;
  z-index       : 11111;
  min-width     : 40px;
  min-height    : 30px;
  display       : block;
  padding       : 8px;
  box-sizing    : border-box;
  background    : #fff;
  border        : 1px solid #e9eaec;
  border-radius : 8px;
  box-shadow    : 0 6px 12px 0 rgb(106, 115, 133, 22%);
  user-select   : text;
  pointer-events: none;
}

.arrow {
  left        : 16%;
  top         : 100%;
  width       : 0;
  height      : 0;
  border-left : 4px solid transparent;
  border-right: 4px solid transparent;
  border-top  : 8px solid #fff;
  position    : absolute;
  user-select : text;
}

.message {
  margin-top : -4px;
  box-sizing : border-box;
  height     : 100%;
  position   : relative;
  user-select: text;
  word-wrap  : break-word;
  word-break : break-all;
  font-size  : 12px;
  line-height: 1.15;
}`;
/*!***********************!*/
/**/modules["ui-input.css"] = /*** ./CSS/ui-input.css ***/
`.contain {
  align-items     : center;
  border-top      : 1px solid rgba(0, 0, 0, 6%);
  display         : flex;
  min-height      : 24px;
  padding         : 0 20px;
  flex-wrap       : wrap;
  justify-content : flex-end;
  background-color: transparent !important;
}

.label {
  flex                : 1;
  flex-basis          : 0.000000001px;
  padding-block-end   : 12px;
  padding-block-start : 12px;
  padding-inline-start: 12px;
}

.sub {
  color      : rgb(95, 99, 104);
  font-weight: 400;
}

.textbox {
  align-items        : center;
  display            : flex;
  justify-content    : space-between;
  position           : relative;
  background-color   : transparent;
  box-sizing         : border-box;
  padding            : 0;
  flex               : 1;
  flex-basis         : 0.000000001px;
  padding-block-end  : 12px;
  padding-block-start: 12px;
}

.textbox input {
  background-color    : transparent;
  box-sizing          : border-box;
  font-family         : inherit;
  font-size           : inherit;
  font-weight         : inherit;
  line-height         : inherit;
  min-height          : auto;
  outline             : none;
  padding-bottom      : 6px;
  padding-inline-end  : 8px;
  padding-inline-start: 8px;
  padding-top         : 6px;
  text-align          : inherit;
  text-overflow       : ellipsis;
  width               : 100%;
  border-radius       : 4px;
  border              : 1px solid rgba(136, 136, 136, 0.13333);
  box-shadow          : 0 4px 12px 0 rgb(0, 0, 0, 5%);
  transition          : box-shadow 120ms ease 180ms;
}

.textbox input:focus {
  box-shadow: inset 0 0 1px 1px rgba(26, 115, 232, 80%);
}

.textbox .icon {
  cursor          : pointer;
  outline         : none;
  padding         : 0;
  pointer-events  : auto;
  position        : absolute;
  right           : 12px;
  background-color: white;
}

.textbox .icon:hover {
  background-color: rgba(0, 0, 0, 10%);
  box-shadow      : 0 1 12px 12px rgb(0, 0, 0, 10%);
}

.button,
.action {
  line-height    : 154%;
  align-items    : center;
  border-radius  : 4px;
  box-sizing     : border-box;
  cursor         : pointer;
  display        : inline-flex;
  flex-shrink    : 0;
  font-weight    : 500;
  height         : 32px;
  justify-content: center;
  min-width      : 5.14em;
  outline-width  : 0;
  overflow       : hidden;
  padding        : 8px 16px;
  position       : relative;
  user-select    : none;
}

.action {
  border          : none;
  background-color: rgb(26, 115, 232);
  color           : #fff;
}

.button {
  background-color: #fff;
  color           : rgb(26, 115, 232);
  border          : 1px solid rgba(0, 0, 0, 6%);
}

.action:hover {
  background-color: rgb(72, 115, 232);
}

.button:hover {
  background-color: rgba(26, 115, 232, 6%);
}

.action:active {
  box-shadow: 0 0 1px 1px rgba(72, 115, 232, 80%);
}

.button:active {
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 10%);
}

.button[disabled],
.action[disabled] {
  pointer-events  : none;
  background-color: rgba(19, 1, 1, 0.1);
  border          : 1px solid rgba(0, 0, 0, 0.1);
  color           : white;
}`;
/*!***********************!*/
/**/modules["ui-item.css"] = /*** ./CSS/ui-item.css ***/
`/* 菜单项容器 */
.contain {
  align-items     : center;
  border-top      : 1px solid rgba(0, 0, 0, 6%);
  display         : flex;
  min-height      : 24px;
  padding         : 0 20px;
  flex-wrap       : wrap;
  justify-content : flex-end;
  background-color: transparent !important;
}

.label {
  flex                : 1;
  flex-basis          : 0.000000001px;
  padding-block-end   : 12px;
  padding-block-start : 12px;
  padding-inline-start: 12px;
}

.sub {
  color      : rgb(95, 99, 104);
  font-weight: 400;
}`;
/*!***********************!*/
/**/modules["ui-menu.css"] = /*** ./CSS/ui-menu.css ***/
`.menuitem {
  align-items         : center;
  display             : flex;
  font-weight         : 500;
  margin-inline-end   : 2px;
  margin-inline-start : 1px;
  min-height          : 20px;
  padding-bottom      : 10px;
  padding-inline-start: 23px;
  padding-top         : 10px;
  cursor              : pointer;
}

.menuitem:hover {
  background-color: rgb(0, 0, 0, 6%);
}

.menuitem>div {
  padding-inline-end: 12px;
}`;
/*!***********************!*/
/**/modules["ui-picture.css"] = /*** ./CSS/ui-picture.css ***/
`.contain {
  align-items     : center;
  border-top      : 1px solid rgba(0, 0, 0, 6%);
  display         : flex;
  min-height      : 24px;
  padding         : 0 20px;
  flex-wrap       : wrap;
  justify-content : center;
  background-color: transparent !important;
  line-height     : 0;
  max-height      : 62px;
}

.contain img {
  border-radius: 4px;
  width        : 100%;
  max-height   : 62px;
}`;
/*!***********************!*/
/**/modules["ui-popup-box.css"] = /*** ./CSS/ui-popup-box.css ***/
`.box {
  top             : 50%;
  left            : 50%;
  transform       : translateX(-50%) translateY(-50%);
  transition      : 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
  padding         : 12px;
  background-color: #fff;
  color           : black;
  border-radius   : 8px;
  box-shadow      : 0 4px 12px 0 rgb(0 0 0 / 5%);
  border          : 1px solid rgba(136, 136, 136, 0.13333);
  box-sizing      : border-box;
  position        : fixed;
  font-size       : 13px;
  z-index         : 11115;
  line-height     : 14px;
}

.contain {
  display       : flex;
  flex-direction: column;
  height        : 100%;
}

*::-webkit-scrollbar {
  width : 0 !important;
  height: 0 !important;
}`;
/*!***********************!*/
/**/modules["ui-sort-body.css"] = /*** ./CSS/ui-sort-body.css ***/
`contain {
  display             : block;
  padding-block-end   : 0;
  padding-block-start : 0;
  padding-inline-end  : 20px;
  padding-inline-start: 20px;
  border-top          : 1px solid rgba(0, 0, 0, 6%);
}`;
/*!***********************!*/
/**/modules["ui-sort-head.css"] = /*** ./CSS/ui-sort-head.css ***/
`.contain {
  align-items     : center;
  border-top      : 1px solid rgba(0, 0, 0, 6%);
  display         : flex;
  min-height      : 24px;
  padding         : 0 20px;
  flex-wrap       : wrap;
  justify-content : flex-end;
  background-color: transparent !important;
}

.label {
  flex                : 1;
  flex-basis          : 0.000000001px;
  padding-block-end   : 12px;
  padding-block-start : 12px;
  padding-inline-start: 12px;
}

.sub {
  color      : rgb(95, 99, 104);
  font-weight: 400;
}

.anchor {
  cursor    : pointer;
  transition: transform 120ms ease 180ms, box-shadow 120ms ease 180ms;
}

.anchor[checked] {
  transform: rotateX(180deg);
}

.anchor:hover {
  box-shadow: 0 0 4px 4px rgba(241, 243, 244, 80%);
}`;
/*!***********************!*/
/**/modules["ui-stage.css"] = /*** ./CSS/ui-stage.css ***/
`.stage {
  position     : fixed;
  right        : 40px;
  bottom       : 60px;
  height       : 20px;
  width        : 20px;
  border       : 1px solid #e9eaec;
  border-radius: 50%;
  box-shadow   : 0 0 12px 4px rgb(106, 115, 133, 22%);
  padding      : 10px;
  cursor       : pointer;
  animation    : roll 1s ease-out;
  transition   : opacity 0.3s ease-out;
  background   : none;
  z-index      : 11110;
}

.classical {
  box-sizing        : content-box;
  color             : #fff;
  background-color  : #fff;
  border-radius     : 5px;
  position          : fixed;
  bottom            : 65px;
  width             : 56px;
  height            : 40px;
  transition        : right 0.7s;
  -moz-transition   : right 0.7s;
  -webkit-transition: right 0.7s;
  -o-transition     : right 0.7s;
  z-index           : 11110;
  padding           : 4px;
  right             : -54px;
}

.classical:hover {
  right     : 0px;
  box-shadow: rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;
  border    : 1px solid rgb(233, 234, 236);
}

.classical i {
  background-position: -471px -982px;
  display            : block;
  width              : 20px;
  height             : 20px;
  transition         : 0.2s;
  background-image   : url(//static.hdslb.com/images/base/icons.png);
  margin             : auto;
}

.classical span {
  font-size : 14px;
  display   : block;
  width     : 50%;
  transition: 0.2s;
  color     : #000;
  margin    : auto;
}

@keyframes roll {

  30%,
  60%,
  90% {
    transform: scale(1) rotate(0deg);
  }

  10%,
  40%,
  70% {
    transform: scale(1.11) rotate(-180deg);
  }

  20%,
  50%,
  80% {
    transform: scale(0.9) rotate(-360deg);
  }
}`;
/*!***********************!*/
/**/modules["ui.css"] = /*** ./CSS/ui.css ***/
`.box {
  left         : 50%;
  top          : 50%;
  transform    : translateX(-50%) translateY(-50%);
  min-width    : 600px;
  min-height   : 400px;
  padding      : 0;
  border       : 0;
  position     : fixed;
  z-index      : 11110;
  display      : block;
  box-sizing   : border-box;
  background   : #fff;
  border-radius: 8px;
  box-shadow   : 0 6px 12px 0 rgba(106, 115, 133, 22%);
  transition   : transform 0.3s ease-in;
  line-height  : 14px;
  font         : 12px Helvetica Neue, Helvetica, Arial, Microsoft Yahei, Hiragino Sans GB,
    Heiti SC, WenQuanYi Micro Hei, sans-serif;
}

.tool {
  position                  : absolute;
  border-bottom-left-radius : 8px;
  border-bottom-right-radius: 8px;
  overflow                  : hidden;
  width                     : 100%;
  display                   : inline-flex;
  z-index                   : 1;
  align-items               : center;
  justify-content           : flex-end;
  pointer-events            : none;
}

.tool div {
  border-radius : 50%;
  padding       : 10px;
  transform     : scale(0.8);
  pointer-events: visible;
}

.tool div:hover {
  background-color: rgba(0, 0, 0, 10%);
}

.content {
  position                  : relative;
  border-bottom-left-radius : 8px;
  border-bottom-right-radius: 8px;
  overflow                  : hidden;
  background-color          : #fff;
}

.contain {
  padding-bottom     : 15px;
  background-position: top center;
  background-size    : contain;
  background-repeat  : no-repeat;
  display            : flex;
  align-items        : flex-start;
  flex               : 1;
  height             : 385px;
}

.menu::-webkit-scrollbar,
.item::-webkit-scrollbar {
  width : 0 !important;
  height: 0 !important;
}

.menu {
  flex          : 1 1 0;
  flex-basis    : calc(480px * 0.2);
  height        : 100%;
  position      : sticky;
  top           : 0;
  display       : flex;
  flex-direction: column;
  min-width     : fit-content;
  overflow      : auto;
}

.item {
  flex      : 4 4 0;
  flex-basis: calc(480px * 0.8);
  height    : 100%;
  box-sizing: border-box;
  display   : block;
  margin    : 0 auto;
  position  : relative;
  overflow  : auto;
}

.selected {
  color: rgb(51, 103, 214) !important;
}

.selected>.icon {
  fill: rgb(51, 103, 214) !important;
}`;
/*!***********************!*/
/**/modules["upList.css"] = /*** ./CSS/upList.css ***/
`.up-info-m .up-card-box {
  white-space: nowrap;
  overflow   : auto;
}

.up-info-m .up-card {
  display   : inline-block;
  margin-top: 10px;
}

.up-info-m .avatar img {
  cursor       : pointer;
  width        : 40px;
  height       : 40px;
  border-radius: 50%;
}

.up-info-m .avatar {
  position: relative;
}

.up-info-m .avatar .info-tag {
  position     : absolute;
  background   : #fff;
  border       : 1px solid #fb7299;
  border-radius: 2px;
  display      : inline-block;
  font-size    : 12px;
  color        : #fb7299;
  padding      : 0 3px;
  top          : -10px;
  right        : -10px;
  white-space  : nowrap;
}

.up-info-m .avatar {
  width          : 60px;
  height         : 30px;
  display        : -ms-flexbox;
  display        : flex;
  -ms-flex-pack  : center;
  justify-content: center;
  -ms-flex-align : start;
  align-items    : flex-start;
}

.up-info-m .avatar .name-text {
  font-family       : PingFangSC-Regular, sans-serif;
  line-height       : 30px;
  color             : #222;
  word-break        : break-all;
  overflow          : hidden;
  text-overflow     : ellipsis;
  display           : -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space       : nowrap;
}

.up-info-m .avatar .name-text.is-vip,
.up-info-m .avatar .name-text:hover {
  color: #fb7299;
}

.up-info-m .title {
  display     : block;
  font-size   : 14px;
  margin-right: 80px;
  color       : #525659;
  overflow    : hidden;
  height      : 24px;
  font-weight : 400;
  padding     : 8px 0;
}`;
/*!***********************!*/
/**/modules["anime.html"] = /*** ./HTML/anime.html ***/
`<!DOCTYPE html>
<html lang="zh-Hans" xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-Hans">

<head>
    <meta charset="utf-8" />
    <title>番剧 - 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
    <meta name="renderer" content="webkit" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="baidu-site-verification" content="gbRdPloQBZ" />
    <link rel="dns-prefetch" href="//s1.hdslb.com" />
    <link rel="dns-prefetch" href="//s2.hdslb.com" />
    <link rel="dns-prefetch" href="//s3.hdslb.com" />
    <link rel="dns-prefetch" href="//i0.hdslb.com" />
    <link rel="dns-prefetch" href="//i1.hdslb.com" />
    <link rel="dns-prefetch" href="//i2.hdslb.com" />
    <link rel="dns-prefetch" href="//static.hdslb.com" />
    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />
    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
        title="哔哩哔哩" />
    <link rel="stylesheet"
        href="//s1.hdslb.com/bfs/static/bangumi-home/css/bangumi-home.1.73141fb5868615cb4fe6bc969ccd02cb7c1c7d4c.css" />
    <link rel="stylesheet"
        href="//s1.hdslb.com/bfs/static/bangumi-home/css/bangumi-home.0.73141fb5868615cb4fe6bc969ccd02cb7c1c7d4c.css" />
</head>

<body>
    <div class="z-top-container has-menu"></div>
    <div id="client-app"></div>
    <div id="app" data-server-rendered="true" class="cinema-home-wrapper"></div>
    <div class="footer bili-footer report-wrap-module"></div>
</body>

</html>`;
/*!***********************!*/
/**/modules["av.html"] = /*** ./HTML/av.html ***/
`<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta charset="utf-8" />
  <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
  <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
  <meta name="keywords"
    content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />
  <meta name="renderer" content="webkit" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />
  <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
    title="哔哩哔哩" />
  <style>
    #bofqi .player {
      width: 980px;
      height: 620px;
      display: block;
    }

    @media screen and (min-width:1400px) {
      #bofqi .player {
        width: 1160px;
        height: 720px
      }
    }
  </style>
  <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" />
  <link rel="stylesheet"
    href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" />
</head>

<body>
  <div class="z-top-container has-menu"></div>
  <div id="video-page-app"></div>
  <div id="app" data-server-rendered="true"></div>
  <div class="bili-wrapper" id="bofqi"></div>
  <div class="footer bili-footer report-wrap-module"></div>
</body>

</html>`;
/*!***********************!*/
/**/modules["bangumi.html"] = /*** ./HTML/bangumi.html ***/
`<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta charset="utf-8" />
  <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
  <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
  <meta name="keywords"
    content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />
  <meta name="renderer" content="webkit" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />
  <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
    title="哔哩哔哩" />
  <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" />
  <link rel="stylesheet"
    href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.css" />
</head>

<body>
  <div class="z-top-container has-menu"></div>
  <div id="app" data-server-rendered="true" class="main-container"></div>
  <div class="footer bili-footer report-wrap-module" id="home_footer"></div>
</body>

</html>`;
/*!***********************!*/
/**/modules["index.html"] = /*** ./HTML/index.html ***/
`<!DOCTYPE html>
<html lang="zh-Hans" xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-Hans">

<head>
  <meta charset="utf-8" />
  <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
  <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
  <meta name="keywords"
    content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />
  <meta name="renderer" content="webkit" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />
  <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
    title="哔哩哔哩" />
  <link rel="stylesheet"
    href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css" />
</head>

<body>
  <div id="home-app"></div>
  <div id="app" data-server-rendered="true"></div>
  <div class="footer bili-footer report-wrap-module"></div>
</body>

</html>`;
/*!***********************!*/
/**/modules["player.html"] = /*** ./HTML/player.html ***/
`<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport"
        content="target-densitydpi=device-dpi,width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,minimal-ui">
    <title>player - bilibili.com</title>
    <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />
    <style type="text/css">
        html {
            background-color: #fff;
            font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif;
            overflow: hidden;
        }

        html,
        body,
        #bofqi,
        .player {
            width: 100%;
            height: 100%;
            margin: 0px;
            padding: 0px;
        }

        #bofqi,
        #bofqi .player-box {
            width: 100%;
            height: 100%;
            overflow: visible;
            box-sizing: border-box;
        }

        #bofqi object {
            width: 100%;
            height: 100%;
        }

        #dm_send_bar {
            width: 100%;
            height: 60px;
            position: absolute;
            bottom: -60px;
            background-color: transparent;
        }

        #dm_send_input {
            margin: 10px 0 10px 2%;
            height: 40px;
            line-height: 38px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            font-family: "Microsoft YaHei";
            padding: 0 8px;
            width: 70%;
            outline: 0;
            box-sizing: border-box;
            color: #333;
        }

        #dm_send_btn {
            height: 40px;
            line-height: 40px;
            font-size: 1rem;
            color: #fff;
            background: #de698c;
            border-radius: 6px;
            margin: 10px 3% 10px 0;
            width: 20%;
            box-sizing: border-box;
            outline: 0;
            border: 0;
            float: right;
        }

        #dm_send_btn:focus,
        #dm_send_btn.disabled {
            background-color: #b65673;
        }
    </style>
</head>

<body>
    <div id="bofqi"></div>
</body>

</html>`;
/*!***********************!*/
/**/modules["playlist.html"] = /*** ./HTML/playlist.html ***/
`<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="renderer" content="webkit" />
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
    <meta name="spm_prefix" content="333.44" />
    <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" />
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="renderer" content="webkit" />
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
    <meta name="spm_prefix" content="0" />
    <link
        href="https://s1.hdslb.com/bfs/static/jinkela/playlist-video/css/playlist_video.0.87292febba67b03f65d05c15d03e325d9db4f56a.css"
        rel="stylesheet" />
    <style>
        #bofqi .player {
            width: 980px;
            height: 620px;
            display: block;
        }

        @media screen and (min-width:1400px) {
            #bofqi .player {
                width: 1160px;
                height: 720px
            }
        }
    </style>
</head>

<body>
    <div class="z-top-container has-menu"></div>
    <div id="playlist-video-app"></div>
    <div class="footer bili-footer report-wrap-module"></div>
</body>

</html>`;
/*!***********************!*/
/**/modules["ranking.html"] = /*** ./HTML/ranking.html ***/
`<!DOCTYPE html>
<html lang="zh-Hans" xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-Hans">

<head>
  <title>热门视频排行榜 - 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="renderer" content="webkit" />
  <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
  <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
  <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />
  <link rel="stylesheet"
    href="//s1.hdslb.com/bfs/static/jinkela/rank/css/rank.0.ba58f8684a87651e0e1c576df8f918bfa10c1a90.css" />
</head>

<body>
  <div class="z-top-container has-menu"></div>
  <div id="rank-app"></div>
  <div id="app" data-server-rendered="true"></div>
  <div class="footer bili-footer report-wrap-module"></div>
</body>

</html>`;
/*!***********************!*/
/**/modules["read.html"] = /*** ./HTML/read.html ***/
`<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head itemprop="Article" itemscope="itemscope" itemtype="http://schema.org/Article">
    <meta charset="UTF-8" />
    <meta data-n-head="true" name="viewport" content="width=device-width,initial-scale=1,user-scalable=0" />
    <meta name="theme-color" content="#de698c" />
    <meta http="Cache-Control" content="no-transform" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="applicable-device" content="pc" />
    <link rel="apple-touch-icon-precomposed" href="//static.hdslb.com/mobile/img/512.png" />
    <link rel="icon" type="image/vnd.microsoft.icon" href="//www.bilibili.com/favicon.ico" />
    <link rel="apple-touch-icon" href="//www.bilibili.com/favicon.ico" />
    <meta name="renderer" content="webkit" />
    <link data-n-head="true" rel="icon" type="image/x-icon" href="//www.bilibili.com/favicon.ico" />
    <link data-n-head="true" rel="apple-touch-icon-precomposed" type="image/x-icon"
        href="//static.hdslb.com/mobile/img/512.png" />
    <title>哔哩哔哩专栏</title>
    <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" />
    <link href="//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.css"
        rel="stylesheet" />
</head>

<body>
    <div class="z-top-container report-wrap-module"></div>
    <div class="page-container"></div>
    <div class="footer bili-footer report-wrap-module" id="home_footer"></div>
</body>

</html>`;
/*!***********************!*/
/**/modules["watchlater.html"] = /*** ./HTML/watchlater.html ***/
`<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta charset="utf-8" />
  <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
  <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
  <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
  <meta name="renderer" content="webkit" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link rel="shortcut icon" href="//static.hdslb.com/images/favicon.ico" />
  <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
    title="哔哩哔哩" />
  <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" />
  <link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" />
  <link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" />
  <link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css"
    rel="stylesheet" />
  <style>
    #bofqi .player {
      width: 980px;
      height: 620px;
      display: block;
    }

    @media screen and (min-width:1400px) {
      #bofqi .player {
        width: 1160px;
        height: 720px
      }
    }
  </style>
</head>

<body>
  <div class="z-top-container has-menu"></div>
  <div id="viewlater-app">
    <app></app>
  </div>
  <div class="footer bili-footer"></div>
</body>

</html>`;
/*!***********************!*/
/**/modules["apply.json"] = /*** ./Json/apply.json ***/
{
	"uid": "vector.js",
	"closedCaption": "closedCaption.js",
	"LocalMedia": "localMedia.js",
	"SegProgress": "segProgress.js",
	"aria2": "aria2.js",
	"download": "download.js",
	"ef2": "ef2.js",
	"jsonphook": "Node.js",
	"jsonphookasync": "Node.js",
	"scriptBlock": "Node.js",
	"scriptIntercept": "Node.js",
	"removeJsonphook": "Node.js",
	"xhrhook": "open.js",
	"xhrhookasync": "open.js",
	"removeXhrhook": "open.js",
	"AllDanmaku": "allDanmaku.js",
	"config": "config.js",
	"registerSetting": "config.js",
	"registerMenu": "config.js",
	"changeSettingMode": "config.js",
	"getCookies": "cookie.js",
	"setCookie": "cookie.js",
	"danmaku": "danmaku.js",
	"debug": "debug.js",
	"ClickRemove": "element.js",
	"ElementComponent": "element.js",
	"GrayManager": "EmbedPlayer.js",
	"loadVideoScript": "EmbedPlayer.js",
	"readAs": "file.js",
	"saveAs": "file.js",
	"fnval": "fnval.js",
	"Format": "format.js",
	"mediaSession": "MediaMeta.js",
	"observerAddedNodes": "nodeObserver.js",
	"removeObserver": "nodeObserver.js",
	"RebuildPlayerurl": "rebuildPlayerurl.js",
	"Rewrite": "rewrite.js",
	"localStorage": "storage.js",
	"sessionStorage": "storage.js",
	"switchVideo": "switchVideo.js",
	"toast": "toast.js",
	"loginExit": "units.js",
	"jsonCheck": "units.js",
	"biliQuickLogin": "units.js",
	"loadScript": "units.js",
	"getTotalTop": "units.js",
	"getUrlValue": "units.js",
	"getAidInfo": "units.js",
	"strSize": "units.js",
	"addCss": "units.js",
	"addElement": "units.js",
	"runWhile": "units.js",
	"bofqiMessage": "units.js",
	"alertMessage": "units.js",
	"getCss": "units.js",
	"url": "url.js",
	"urlInputCheck": "urlInputCheck.js",
	"xhr": "xhr.js",
	"abv": "abv.js",
	"Base64": "Base64.js",
	"midcrc": "crc32.js",
	"crc32": "crc32.js",
	"bezier": "cubicBezier.js",
	"md5": "md5.js",
	"urlsign": "sign.js",
	"loadCommandDm": "commandDm.js",
	"InitialStateOfAv": "initialStateOfAv.js",
	"InitialStateOfBangumi": "initialStateOfBangumi.js"
}
/*!***********************!*/
/**/modules["mid.json"] = /*** ./Json/mid.json ***/
{
    "code": 0,
    "data": {
        "birthday": "1980-01-01",
        "coins": 0,
        "face": "http://i2.hdslb.com/bfs/face/9f10323503739e676857f06f5e4f5eb323e9f3f2.jpg",
        "fans_badge": false,
        "is_followed": true,
        "jointime": 1436351229,
        "level": 6,
        "mid": "11783021",
        "moral": 0,
        "name": "哔哩哔哩番剧出差",
        "official": {
            "type": 1,
            "desc": "哔哩哔哩番剧出差 官方账号"
        },
        "pendant": {
            "pid": 0,
            "name": "",
            "image": "",
            "expire": 0
        },
        "rank":
            "10000",
        "sex": "保密",
        "sign": "",
        "silence": 0,
        "sys_notice": {},
        "theme": {},
        "user_honour_info": {
            "colour": null,
            "mid": 0,
            "tags": null
        },
        "vip": {
            "avatar_subscript": 1,
            "avatar_subscript_url": "http://i0.hdslb.com/bfs/vip/icon_Certification_big_member_22_3x.png",
            "due_date": 1655740800000,
            "label": {
                "bg_color": "#FB7299",
                "bg_style": 1,
                "border_color": "",
                "label_theme": "annual_vip",
                "path": "",
                "text": "年度大会员",
                "text_color": "#FFFFFF"
            },
            "nickname_color": "#FB7299",
            "role": 3,
            "status": 1,
            "theme_type": 0,
            "type": 2, "vip_pay_type": 1
        }
    },
    "message": "0",
    "ttl": 1
}
/*!***********************!*/
/**/modules["protobuf.json"] = /*** ./Json/protobuf.json ***/
{
    "nested": {
        "bilibili": {
            "nested": {
                "DmWebViewReply": {
                    "fields": {
                        "state": {
                            "type": "int32",
                            "id": 1
                        },
                        "text": {
                            "type": "string",
                            "id": 2
                        },
                        "textSide": {
                            "type": "string",
                            "id": 3
                        },
                        "dmSge": {
                            "type": "DmSegConfig",
                            "id": 4
                        },
                        "flag": {
                            "type": "DanmakuFlagConfig",
                            "id": 5
                        },
                        "specialDms": {
                            "rule": "repeated",
                            "type": "string",
                            "id": 6
                        },
                        "checkBox": {
                            "type": "bool",
                            "id": 7
                        },
                        "count": {
                            "type": "int64",
                            "id": 8
                        },
                        "commandDms": {
                            "rule": "repeated",
                            "type": "CommandDm",
                            "id": 9
                        },
                        "dmSetting": {
                            "type": "DanmuWebPlayerConfig",
                            "id": 10
                        }
                    }
                },
                "CommandDm": {
                    "fields": {
                        "id": {
                            "type": "int64",
                            "id": 1
                        },
                        "oid": {
                            "type": "int64",
                            "id": 2
                        },
                        "mid": {
                            "type": "int64",
                            "id": 3
                        },
                        "command": {
                            "type": "string",
                            "id": 4
                        },
                        "content": {
                            "type": "string",
                            "id": 5
                        },
                        "progress": {
                            "type": "int32",
                            "id": 6
                        },
                        "ctime": {
                            "type": "string",
                            "id": 7
                        },
                        "mtime": {
                            "type": "string",
                            "id": 8
                        },
                        "extra": {
                            "type": "string",
                            "id": 9
                        },
                        "idStr": {
                            "type": "string",
                            "id": 10
                        }
                    }
                },
                "DmSegConfig": {
                    "fields": {
                        "pageSize": {
                            "type": "int64",
                            "id": 1
                        },
                        "total": {
                            "type": "int64",
                            "id": 2
                        }
                    }
                },
                "DanmakuFlagConfig": {
                    "fields": {
                        "recFlag": {
                            "type": "int32",
                            "id": 1
                        },
                        "recText": {
                            "type": "string",
                            "id": 2
                        },
                        "recSwitch": {
                            "type": "int32",
                            "id": 3
                        }
                    }
                },
                "DmSegMobileReply": {
                    "fields": {
                        "elems": {
                            "rule": "repeated",
                            "type": "DanmakuElem",
                            "id": 1
                        }
                    }
                },
                "DanmakuElem": {
                    "fields": {
                        "id": {
                            "type": "int64",
                            "id": 1
                        },
                        "progress": {
                            "type": "int32",
                            "id": 2
                        },
                        "mode": {
                            "type": "int32",
                            "id": 3
                        },
                        "fontsize": {
                            "type": "int32",
                            "id": 4
                        },
                        "color": {
                            "type": "uint32",
                            "id": 5
                        },
                        "midHash": {
                            "type": "string",
                            "id": 6
                        },
                        "content": {
                            "type": "string",
                            "id": 7
                        },
                        "ctime": {
                            "type": "int64",
                            "id": 8
                        },
                        "weight": {
                            "type": "int32",
                            "id": 9
                        },
                        "action": {
                            "type": "string",
                            "id": 10
                        },
                        "pool": {
                            "type": "int32",
                            "id": 11
                        },
                        "idStr": {
                            "type": "string",
                            "id": 12
                        },
                        "attr": {
                            "type": "int32",
                            "id": 13
                        }
                    }
                },
                "DanmuWebPlayerConfig": {
                    "fields": {
                        "dmSwitch": {
                            "type": "bool",
                            "id": 1
                        },
                        "aiSwitch": {
                            "type": "bool",
                            "id": 2
                        },
                        "aiLevel": {
                            "type": "int32",
                            "id": 3
                        },
                        "blocktop": {
                            "type": "bool",
                            "id": 4
                        },
                        "blockscroll": {
                            "type": "bool",
                            "id": 5
                        },
                        "blockbottom": {
                            "type": "bool",
                            "id": 6
                        },
                        "blockcolor": {
                            "type": "bool",
                            "id": 7
                        },
                        "blockspecial": {
                            "type": "bool",
                            "id": 8
                        },
                        "preventshade": {
                            "type": "bool",
                            "id": 9
                        },
                        "dmask": {
                            "type": "bool",
                            "id": 10
                        },
                        "opacity": {
                            "type": "float",
                            "id": 11
                        },
                        "dmarea": {
                            "type": "int32",
                            "id": 12
                        },
                        "speedplus": {
                            "type": "float",
                            "id": 13
                        },
                        "fontsize": {
                            "type": "float",
                            "id": 14
                        },
                        "screensync": {
                            "type": "bool",
                            "id": 15
                        },
                        "speedsync": {
                            "type": "bool",
                            "id": 16
                        },
                        "fontfamily": {
                            "type": "string",
                            "id": 17
                        },
                        "bold": {
                            "type": "bool",
                            "id": 18
                        },
                        "fontborder": {
                            "type": "int32",
                            "id": 19
                        },
                        "drawType": {
                            "type": "string",
                            "id": 20
                        }
                    }
                }
            }
        }
    }
}
/*!***********************!*/
/**/modules["videoSort.json"] = /*** ./Json/videoSort.json ***/
{
    "1": [
        1,
        "动画",
        "//www.bilibili.com/v/douga/"
    ],
    "3": [
        3,
        "音乐",
        "//www.bilibili.com/v/music/"
    ],
    "29": [
        3,
        "音乐现场",
        "//www.bilibili.com/v/music/live"
    ],
    "36": [
        36,
        "科技",
        "//www.bilibili.com/v/technology"
    ],
    "75": [
        217,
        "动物综合",
        "//www.bilibili.com/v/animal/animal_composite/"
    ],
    "76": [
        211,
        "美食制作",
        "//www.bilibili.com/v/food/make/"
    ],
    "86": [
        1,
        "特摄",
        "//www.bilibili.com/v/douga/"
    ],
    "95": [
        188,
        "数码",
        "//www.bilibili.com/v/digital/mobile/"
    ],
    "119": [
        119,
        "鬼畜",
        "//www.bilibili.com/v/kichiku/"
    ],
    "129": [
        129,
        "舞蹈",
        "//www.bilibili.com/v/dance"
    ],
    "155": [
        155,
        "时尚",
        "//www.bilibili.com/v/fashion"
    ],
    "157": [
        155,
        "美妆护肤",
        "//www.bilibili.com/v/fashion/makeup/"
    ],
    "158": [
        155,
        "穿搭",
        "//www.bilibili.com/v/fashion/clothing/"
    ],
    "159": [
        155,
        "时尚潮流",
        "//www.bilibili.com/v/fashion/trend/"
    ],
    "160": [
        160,
        "生活",
        "//www.bilibili.com/v/life"
    ],
    "163": [
        160,
        "家居房产",
        "//www.bilibili.com/v/life/home"
    ],
    "164": [
        234,
        "健身",
        "//www.bilibili.com/v/sports/aerobics"
    ],
    "168": [
        168,
        "国创",
        "//www.bilibili.com/guochuang"
    ],
    "176": [
        223,
        "汽车生活",
        "//www.bilibili.com/v/car/life/"
    ],
    "188": [
        188,
        "数码",
        "//www.bilibili.com/v/digital"
    ],
    "189": [
        188,
        "电脑装机",
        "//www.bilibili.com/v/digital/pc"
    ],
    "190": [
        188,
        "数码摄影",
        "//www.bilibili.com/v/digital/photography"
    ],
    "191": [
        188,
        "影音智能",
        "//www.bilibili.com/v/digital/intelligence_av"
    ],
    "192": [
        155,
        "风尚标",
        "//www.bilibili.com/v/fashion/trends"
    ],
    "193": [
        3,
        "MV",
        "//www.bilibili.com/v/music/mv"
    ],
    "194": [
        3,
        "电音",
        "//www.bilibili.com/v/music/electronic"
    ],
    "195": [
        168,
        "动态漫·广播剧",
        "//www.bilibili.com/v/guochuang/motioncomic"
    ],
    "198": [
        129,
        "街舞",
        "//www.bilibili.com/v/dance/hiphop"
    ],
    "199": [
        129,
        "明星舞蹈",
        "//www.bilibili.com/v/dance/star"
    ],
    "200": [
        129,
        "中国舞",
        "//www.bilibili.com/v/dance/china"
    ],
    "201": [
        36,
        "科学科普",
        "//www.bilibili.com/v/technology/science"
    ],
    "202": [
        202,
        "资讯",
        "//www.bilibili.com/v/information/"
    ],
    "203": [
        202,
        "热点",
        "//www.bilibili.com/v/information/hotspot/"
    ],
    "204": [
        202,
        "环球",
        "//www.bilibili.com/v/information/global/"
    ],
    "205": [
        202,
        "社会",
        "//www.bilibili.com/v/information/social/"
    ],
    "206": [
        202,
        "综合",
        "//www.bilibili.com/v/information/multiple/"
    ],
    "207": [
        36,
        "财经",
        "//www.bilibili.com/v/technology/finance"
    ],
    "208": [
        36,
        "校园学习",
        "//www.bilibili.com/v/technology/campus"
    ],
    "209": [
        36,
        "职业职场",
        "//www.bilibili.com/v/technology/career"
    ],
    "210": [
        1,
        "手办·模玩",
        "//www.bilibili.com/v/douga/garage_kit"
    ],
    "211": [
        211,
        "美食",
        "//www.bilibili.com/v/food"
    ],
    "212": [
        211,
        "美食侦探",
        "//www.bilibili.com/v/food/detective/"
    ],
    "213": [
        211,
        "美食测评",
        "//www.bilibili.com/v/food/measurement/"
    ],
    "214": [
        211,
        "田园美食",
        "//www.bilibili.com/v/food/rural/"
    ],
    "215": [
        211,
        "美食记录",
        "//www.bilibili.com/v/food/record/"
    ],
    "216": [
        119,
        "鬼畜剧场",
        "//www.bilibili.com/v/kichiku/theatre/"
    ],
    "217": [
        217,
        "动物圈",
        "//www.bilibili.com/v/animal"
    ],
    "218": [
        217,
        "喵星人",
        "//www.bilibili.com/v/animal/cat/"
    ],
    "219": [
        217,
        "汪星人",
        "//www.bilibili.com/v/animal/dog/"
    ],
    "220": [
        217,
        "大熊猫",
        "//www.bilibili.com/v/animal/panda/"
    ],
    "221": [
        217,
        "野生动物",
        "//www.bilibili.com/v/animal/wild_animal/"
    ],
    "222": [
        217,
        "爬宠",
        "//www.bilibili.com/v/animal/reptiles/"
    ],
    "223": [
        223,
        "汽车",
        "//www.bilibili.com/v/car"
    ],
    "224": [
        223,
        "汽车文化",
        "//www.bilibili.com/v/car/culture/"
    ],
    "225": [
        223,
        "汽车极客",
        "//www.bilibili.com/v/car/geek/"
    ],
    "226": [
        223,
        "智能出行",
        "//www.bilibili.com/v/car/smart/"
    ],
    "227": [
        223,
        "购车攻略",
        "//www.bilibili.com/v/car/strategy/"
    ],
    "228": [
        36,
        "人文历史",
        "//www.bilibili.com/v/knowledge/humanity_history/"
    ],
    "229": [
        36,
        "设计·创意",
        "//www.bilibili.com/v/knowledge/design/"
    ],
    "230": [
        188,
        "软件应用",
        "//www.bilibili.com/v/tech/application/"
    ],
    "231": [
        188,
        "计算机技术",
        "//www.bilibili.com/v/tech/computer_tech/"
    ],
    "232": [
        188,
        "工业·工程·机械",
        "//www.bilibili.com/v/tech/computer_tech/"
    ],
    "233": [
        188,
        "极客DIY",
        "//www.bilibili.com/v/tech/diy/"
    ],
    "234": [
        234,
        "运动",
        "//www.bilibili.com/v/sports"
    ],
    "235": [
        234,
        "篮球·足球",
        "//www.bilibili.com/v/sports/basketballfootball"
    ],
    "236": [
        234,
        "竞技体育",
        "//www.bilibili.com/v/sports/athletic"
    ],
    "237": [
        234,
        "运动文化",
        "//www.bilibili.com/v/sports/culture"
    ],
    "238": [
        234,
        "运动综合",
        "//www.bilibili.com/v/sports/comprehensive"
    ],
    "240": [
        223,
        "摩托车",
        "//www.bilibili.com/v/car/motorcycle"
    ]
}
/*!***********************!*/
/**/modules["main.js"] = /*** ./dist/main.js ***/
`"use strict";
{
    const API = new Proxy(new (class {
        constructor() {
            /** 封装脚本管理器API的顶级对象 */
            this.GM = GM;
            /** 脚本名称 */
            this.Name = GM.info.script.name;
            /** 当前版本 */
            this.Virsion = GM.info.script.version;
            /** 脚本管理器及版本 */
            this.Handler = [GM.info.scriptHandler, GM.info.version].join(" ");
            /** 当前URL解构的数组 */
            this.path = location.href.split("/");
            /**
             * 获取模块内容
             * @param key 模块名称
             * @returns 模块内容
             */
            this.getModule = (key) => modules[key];
        }
        get aid() { return Reflect.get(window, "aid"); }
        set aid(v) { Reflect.set(window, "aid", v); }
        get cid() { return Reflect.get(window, "cid"); }
        set cid(v) { Reflect.set(window, "cid", v); }
        get __INITIAL_STATE__() { return Reflect.get(window, "__INITIAL_STATE__"); }
        set __INITIAL_STATE__(v) { Reflect.set(window, "__INITIAL_STATE__", v); }
        /**
         * 加载模块
         * @param name 模块名称
         * @param args 需要传递的变量，该变量可以在该模块中像全局变量一样使用。格式：{变量名: 变量值}
         * @returns 空调用直接返回可选模块
         */
        importModule(name, args = {}) {
            if (!name) {
                // 空调用直接返回可选模块
                return Object.keys(modules).filter(p => typeof modules[p] === "string");
            }
            else if (typeof modules[name] === "string") {
                new Function("GM", "API", ...Object.keys(args), modules[name])(GM, API, ...Object.keys(args).reduce((s, d) => {
                    s.push(args[d]);
                    return s;
                }, []));
            }
            else
                return this.toast.error(\`模块\${name}并不存在！\`);
        }
    })(), {
        get: (t, p, r) => {
            // 接口存在直接返回
            if (Reflect.has(t, p))
                return Reflect.get(t, p);
            if (typeof p === "string" && p in modules["apply.json"]) {
                // 接口未加载加载所在模块
                t.importModule(modules["apply.json"][p]);
                return Reflect.get(t, p);
            }
            return undefined;
        }
    });
    API.importModule("vector.js"); // 引导模块
}

//# sourceURL=API://@Bilibili-Old/main.js`;
/*!***********************!*/
/**/modules["vector.js"] = /*** ./dist/vector.js ***/
`"use strict";
    /** 账号id，判定是否登录 */
    API.uid = Number(API.getCookies().DedeUserID);
    const NOREWRITE = API.sessionStorage.getItem("NOREWRITE");
    if (NOREWRITE) {
        // 临时禁用重写功能
        setTimeout(() => API.toast.warning(NOREWRITE), 1000);
        API.sessionStorage.removeItem("NOREWRITE");
    }
    API.importModule("parameterTrim.js"); // 网址及超链接清理
    API.importModule("replyList.js"); // 回复翻页评论区及楼层号
    API.config.logReport && API.importModule("logReport.js"); // 拦截B站日志上报
    if (!NOREWRITE) {
        if (API.config.av && /\\/video\\/[AaBb][Vv]/.test(location.href))
            API.importModule("av.js");
        if (API.config.bangumi && /\\/bangumi\\/play\\/(ss|ep)/.test(location.href))
            API.importModule("bangumi.js");
        if (API.config.watchlater && /\\/watchlater/.test(location.href))
            API.importModule("watchlater.js");
        if (API.config.player && /player\\./.test(location.href))
            API.importModule("player.js");
        if (/space\\.bilibili\\.com/.test(location.href))
            API.importModule("space.js");
        if (API.config.index && API.path[2] == 'www.bilibili.com' && (!API.path[3] || (API.path[3].startsWith('\\?') || API.path[3].startsWith('\\#') || API.path[3].startsWith('index.'))))
            API.importModule("index.js");
        if (API.config.ranking && /\\/v\\/popular\\//.test(location.href))
            API.importModule("ranking.js");
        if (/live\\.bilibili\\.com/.test(location.href))
            API.importModule("live.js");
        if (API.config.anime && /\\/anime\\/?(\\?.+)?\$/.test(location.href))
            API.importModule("anime.js");
        if (API.path[2] == "message.bilibili.com")
            API.addCss(API.getModule("message.css"));
        if (window.self == window.top && API.path[2] == 'www.bilibili.com')
            document.domain = "bilibili.com";
        if (location.href.includes("message.bilibili.com/pages/nav/index_new_sync"))
            API.addCss(API.getModule("imroot.css"));
        if (location.href.includes("www.bilibili.com/account/history"))
            API.importModule("history.js");
        if (API.config.read && /\\/read\\/[Cc][Vv]/.test(location.href))
            API.importModule("read.js");
        if (API.config.player && /festival\\/202[1-2]bnj/.test(location.href))
            API.importModule("bnj.js");
        if ((API.config.medialist && /\\/medialist\\/play\\//.test(location.href) && !/watchlater/.test(location.href)) || /\\/playlist\\/video\\/pl/.test(location.href))
            API.importModule("medialist.js");
    }
    API.importModule("infoNewNumber.js"); // 移除旧版顶栏失效资讯数据
    API.config.protoDm && API.importModule("protoDm.js"); // 旧版播放器新版protobuf弹幕支持
    API.importModule("playinfo.js"); // 视频源修复及记录
    API.importModule("player-v2.js"); // 视频信息接口
    API.importModule("automate.js"); // 自动化处理
    API.config.videoLimit && API.importModule("videoLimit.js"); // 解锁视频限制
    API.importModule("banner.js"); // 移植动态顶栏banner
    API.config.section && API.importModule("section.js"); // 还原旧版顶栏
    API.config.danmakuHashId && API.path.name && API.importModule("danmakuHashId.js"); // 反查弹幕发送者
    API.config.downloadContentmenu && API.importModule("rightKey.js"); // 下载右键菜单
    API.importModule().forEach((d) => { d.includes("[run]") && API.importModule(d); }); // 自运行脚本

//# sourceURL=API://@Bilibili-Old/vector.js`;
/*!***********************!*/
/**/modules["accesskey.js"] = /*** ./dist/do/accesskey.js ***/
`"use strict";
    class Accesskey {
        /** 创建移动端鉴权获取面板 */
        constructor() {
            /** APP access_key */
            this.access_key = GM.getValue("access_key", "");
            /** 授权日期 */
            this.access_date = GM.getValue("access_date", 0);
            /** 重试次数 */
            this.num = 0;
            this.box = API.ElementComponent.popupbox({ maxWidth: "360px", maxHeight: "300px" });
            API.addElement("div", { style: 'text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;' }, this.box, \`<span>账户授权<span>\`);
            API.addElement("div", { style: 'margin-bottom: 10px;' }, this.box, \`<div>授权代理服务器使用您的账户权限，以在限制视频等操作中继承您的大会员权益。
            <strong>这意味着第三方拥有您的账户访问权限，请充分考虑其中干系后谨慎操作！</strong>
            如果只是为了解除视频限制，以“游客”身份也一样可以获取到最高1080P的视频源，而且一般不会有大会员专享限制。
            </br>※ 鉴权有效期一般在一个月左右，若是失效需要手动重新授权，脚本不会代为检查。</div>\`);
            this.box.appendChild(API.ElementComponent.hr());
            const body = API.addElement("div", { style: "display: flex;align-items: center;justify-content: space-around;margin-bottom: 10px;" }, this.box);
            this.enable = body.appendChild(API.ElementComponent.button(() => { this.access(); }, "开始授权", 3));
            this.disable = body.appendChild(API.ElementComponent.button(() => { this.abort(); }, "取消授权", 10));
            this.box.appendChild(API.ElementComponent.hr());
            this.foot = API.addElement("div", { style: "display: flex;align-items: center;justify-content: space-around;" }, this.box);
            this.flesh();
        }
        /** 重新获取鉴权按钮 */
        flesh() {
            if (this.access_key) {
                const temp = API.ElementComponent.button(() => { this.access(); }, "重新授权", 3);
                this.enable.replaceWith(temp);
                this.disable.style.display = "block";
                this.enable = temp;
                this.foot.innerHTML = \`<div>授权状态：已授权</div><div>授权日期：\${API.Format.timeFormat(this.access_date, true)}</div>\`;
            }
            else {
                const temp = API.ElementComponent.button(() => { this.access(); }, "开始授权", 3);
                this.enable.replaceWith(temp);
                this.enable = temp;
                this.disable.style.display = "none";
                this.foot.innerHTML = \`<div>授权状态：未授权</div><div> </div>\`;
            }
        }
        /** 请求移动端鉴权 */
        async access() {
            if (!API.uid)
                return (API.toast.warning("请先登录！"), API.biliQuickLogin()); // 登录状态
            API.toast("您正在进行账户授权操作，请稍候~");
            let data = await API.xhr.GM({
                url: API.urlsign("https://passport.bilibili.com/login/app/third?api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png", undefined, 3),
                responseType: "json"
            });
            data = await new Promise((resolve, reject) => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: data.data.confirm_uri,
                    onload: (xhr) => resolve(xhr.finalUrl),
                    onerror: (xhr) => reject(xhr),
                });
            });
            data = API.Format.urlObj(data);
            await new Promise((resolve, reject) => { this.pluslogin(data, resolve, reject); });
            this.access_key = data.access_key; // 保存access_key
            this.access_date = new Date().getTime();
            GM.setValue("access_key", this.access_key);
            GM.setValue("access_date", this.access_date);
            API.toast.success("账户授权成功！");
            this.flesh();
        }
        /** 取消移动端鉴权并清除一切数据 */
        async abort() {
            API.toast("正在取消账户授权，请稍候~");
            this.access_key = "";
            this.access_date = 0;
            GM.deleteValue("access_key");
            GM.deleteValue("access_date");
            await new Promise((resolve) => {
                const iframe = document.createElement("iframe");
                iframe.setAttribute("style", "width: 0px;height: 0px;");
                iframe.src = "https://www.biliplus.com/login?act=logout";
                iframe.onload = () => {
                    iframe.remove();
                    resolve();
                };
                iframe.onerror = () => {
                    iframe.remove();
                    resolve();
                };
                document.body.appendChild(iframe);
            });
            API.toast.success("已取消账户授权并销毁痕迹！");
            this.flesh();
        }
        /** 登录到biliplus，用于解除视频限制 */
        pluslogin(data, resolve, reject) {
            this.num++;
            const iframe = document.createElement("iframe");
            iframe.setAttribute("style", "width: 0px;height: 0px;");
            iframe.src = API.Format.objUrl("https://www.biliplus.com/login", data);
            iframe.onload = () => {
                iframe.remove();
                resolve();
            };
            iframe.onerror = ev => {
                if (this.num < 4) {
                    API.toast.error("授权出错！将在3秒后重试~", ev);
                    setTimeout(() => this.pluslogin(data, resolve, reject), 3e3);
                }
                else {
                    API.toast.error("重试终止！请参考控制台报错信息~");
                    reject(ev);
                }
            };
            document.body.appendChild(iframe);
        }
    }
    new Accesskey();

//# sourceURL=API://@Bilibili-Old/do/accesskey.js`;
/*!***********************!*/
/**/modules["automate.js"] = /*** ./dist/do/automate.js ***/
`"use strict";
    /** 滚动到播放器 */
    function bofqiToView() {
        let str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
        let node = str.reduce((s, d) => {
            s = s || document.querySelector(d);
            return s;
        }, document.querySelector("#__bofqi"));
        node && node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // 播放器自动化操作
    API.switchVideo(() => {
        API.config.danmakuFirst && document.querySelectorAll(".bilibili-player-filter-btn")[1].click(); // 展示弹幕列表
        setTimeout(() => {
            API.config.showBofqi && bofqiToView(); // 滚动到播放器
        }, 500);
        API.config.screenWide && API.runWhile(() => document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-widescreen.icon-24wideoff"), () => document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").click()); // 自动宽屏
        API.config.webFullScreen && API.runWhile(() => document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-web-fullscreen.icon-24webfull.player-tooltips-trigger"), () => document.querySelector(".bilibili-player-video-web-fullscreen").click()); // 自动网页全屏
        API.config.noDanmaku && API.runWhile(() => document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku"), () => {
            !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off") && document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku").click(); // 自动关闭弹幕
        });
        API.config.autoPlay && setTimeout(() => { window.player && window.player.play && window.player.play(); }, 1000); // 自动播放
    });
    // 播放本地媒体按钮
    API.path.name && API.observerAddedNodes(e => {
        if (e.className && /bilibili-player-danmaku-setting-lite-panel/.test(e.className)) {
            API.runWhile(() => document.querySelector(".bilibili-player-setting-dmask-wrap"), () => {
                const node = document.querySelector(".bilibili-player-setting-dmask-wrap").parentElement;
                const lebel = API.addElement("label", { class: "bpui-checkbox-text", style: "cursor: pointer;display: inline-table;" }, node, "本地文件");
                const input = API.addElement("input", { type: "file", accept: ".mp4,.xml,.json", multiple: "multiple", style: "width: 0;" }, lebel);
                input.onchange = () => {
                    var _a;
                    (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku)) && API.toast.warning("内部组件丢失，无法载入弹幕文件！");
                    input.files && new API.LocalMedia(input.files);
                };
            });
        }
    });
    // 修复顶栏分区数据
    API.runWhile(() => document.querySelector(".bili-header-m"), () => {
        try {
            let node = document.querySelector(".bili-header-m").getElementsByClassName('nav-name');
            if (node[0]) {
                for (let i = 0; i < node.length; i++) {
                    if (node[i].textContent == "科技") {
                        node[i].textContent = "知识";
                        node[i].parentNode.href = "//www.bilibili.com/v/knowledge/";
                        node[i].parentNode.parentNode.children[1].innerHTML = \`<li><a href="//www.bilibili.com/v/knowledge/science/"><span>科学科普</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/social_science/"><span>社科·法律·心理</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/humanity_history/"><span>人文历史</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/business/"><span>财经商业</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/campus/"><span>校园学习</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/career/"><span>职业职场</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/design/"><span>设计·创意</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/skill/"><span>野生技能协会</span></a></li>\`;
                    }
                    if (node[i].textContent == "数码") {
                        node[i].textContent = "科技";
                        node[i].parentNode.href = "//www.bilibili.com/v/tech/";
                        node[i].parentNode.parentNode.children[1].innerHTML = \`<li><a href="//www.bilibili.com/v/tech/digital/"><span>数码</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/application/"><span>软件应用</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/computer_tech/"><span>计算机技术</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/industry/"><span>工业·工程·机械</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/diy/"><span>极客DIY</span></a></li>\`;
                    }
                    if (node[i].textContent == "时尚") {
                        node[i].parentNode.parentNode.children[1].innerHTML = \`<li><a href="//www.bilibili.com/v/fashion/makeup/"><span>美妆护肤</span></a></li>
                        <li><a href="//www.bilibili.com/v/fashion/clothing/"><span>穿搭</span></a></li>
                        <li><a href="//www.bilibili.com/v/fashion/trend/"><span>时尚潮流</span></a></li>\`;
                    }
                    if (node[i].textContent == "广告") {
                        node[i].textContent = "资讯";
                        node[i].parentNode.href = "//www.bilibili.com/v/information/";
                        node[i].parentNode.parentNode.children[1].innerHTML = \`<li><a href="//www.bilibili.com/v/information/hotspot/"><span>热点</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/global/"><span>环球</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/social/"><span>社会</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/multiple/"><span>综合</span></a></li>\`;
                    }
                    if (node[i].textContent == "生活") {
                        node[i].parentNode.parentNode.children[1].children[2].remove(); // 移除美食圈
                        node[i].parentNode.parentNode.children[1].children[2].remove(); // 移除美食圈
                        node[i].parentNode.parentNode.children[1].children[5].remove(); // 移除其他
                        node[i].parentNode.parentNode.children[1].children[4].children[0].href = "//www.bilibili.com/v/sports"; // 修复运动区链接
                    }
                    if (node[i].textContent == "娱乐")
                        node[i].parentNode.parentNode.children[1].lastChild.remove();
                }
            }
        }
        catch (e) {
            API.debug.error("automate.js", e);
        }
    });
    API.config.heartbeat && API.xhrhook(['api.bilibili.com/x/report/web/heartbeat'], function (args) {
        args[1] = args[1].replace('api.bilibili.com/x/report/web/heartbeat', 'api.bilibili.com/x/click-interface/web/heartbeat');
    }, undefined, false);
    API.config.unloginPopover && !API.uid && API.runWhile(() => document.querySelector(".lt-row"), () => document.querySelector(".lt-row").remove()); // 移除登录提示弹窗
    API.config.unloginPopover && !API.uid && API.runWhile(() => document.querySelector(".unlogin-popover"), () => document.querySelector(".unlogin-popover").remove()); // 移除登录提示弹窗

//# sourceURL=API://@Bilibili-Old/do/automate.js`;
/*!***********************!*/
/**/modules["banner.js"] = /*** ./dist/do/banner.js ***/
`"use strict";
    var _a;
    class Animate {
        constructor(v) {
            /**
             * 有在启用了动画banner的配置，且浏览器支持css filter时才加载动画banner的图片资源
             * safari浏览器在mac屏幕上模糊效果有性能问题，不开启
             */
            this.animatedBannerSupport = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('filter: blur(1px)')
                && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            this.layerConfig = {};
            /**
             * layer表单
             */
            this.resources = [];
            /**
             * container 元素上有其他元素，需使用全局事件判断鼠标位置
             */
            this.entered = false;
            this.extensions = [];
            this.handleMouseLeave = undefined;
            this.handleMouseMove = undefined;
            this.handleResize = undefined;
            if (this.animatedBannerSupport)
                this.mounted(v);
            API.addCss(API.getModule("animated-banner.css"), "animated-banner");
            if (v.is_split_layer !== 0) {
                API.addCss(".blur-bg {display:none}");
            }
            else
                API.addCss(".blur-bg {background:none !important;-webkit-backdrop-filter: blur(4px);backdrop-filter: blur(4px)}");
        }
        /**
         * 根据页面返回resourceId
         * @returns resourceId
         */
        static resourceId() {
            if (location.href.includes("v/douga"))
                return 1576;
            if (location.href.includes("/anime"))
                return 1612;
            if (location.href.includes("v/music"))
                return 1580;
            if (location.href.includes("/guochuang"))
                return 1920;
            if (location.href.includes("v/dance"))
                return 1584;
            if (location.href.includes("v/game"))
                return 1588;
            if (location.href.includes("v/knowledge"))
                return 1592;
            if (location.href.includes("v/tech"))
                return 3129;
            if (location.href.includes("v/life"))
                return 1600;
            if (location.href.includes("v/kichiku"))
                return 1608;
            if (location.href.includes("v/fashion"))
                return 1604;
            if (location.href.includes("v/ent"))
                return 1596;
            if (location.href.includes("v/cinephile"))
                return 2210;
            if (location.href.includes("/cinema"))
                return 1634;
            return 142;
        }
        async mounted(v) {
            var _b;
            this.layerConfig = JSON.parse(v.split_layer);
            if (!this.layerConfig.layers)
                return;
            try {
                if ("extensions" in this.layerConfig && "time" in this.layerConfig.extensions) {
                    let time = undefined, now = (Date.now() - (new Date).setHours(0, 0, 0, 0)) / 1e3;
                    let timeCode = Object.keys(this.layerConfig.extensions.time).sort((a, b) => parseInt(a) - parseInt(b));
                    for (let t of timeCode) {
                        if (parseInt(t) < now)
                            time = parseInt(t);
                        else
                            break;
                    }
                    let timelayers = this.layerConfig.extensions.time[time];
                    this.layerConfig.layers = timelayers[Math.floor(Math.random() * timelayers.length)].layers;
                }
                await Promise.all(this.layerConfig.layers.map(async (v, index) => {
                    return Promise.all(v.resources.map(async (i) => {
                        if (/\\.(webm|mp4)\$/.test(i.src)) {
                            const res = await API.xhr({ url: i.src, responseType: "blob" });
                            const url = URL.createObjectURL(res);
                            const video = document.createElement('video');
                            video.muted = true;
                            // video.autoplay = true
                            video.loop = true;
                            video.src = url;
                            video.playsInline = true;
                            video.style.objectFit = 'cover'; // 元素尺寸大于视频实际尺寸时放大
                            this.resources[index] = video;
                            // 视频需要添加到dom树才能获取宽高
                            video.width = 0;
                            video.height = 0;
                            document.body.appendChild(video);
                            await new Promise(resolve => {
                                const onMetaLoad = () => {
                                    resolve(true);
                                    video.removeEventListener('loadedmetadata', onMetaLoad);
                                };
                                video.addEventListener('loadedmetadata', onMetaLoad);
                            });
                        }
                        else {
                            const img = document.createElement('img');
                            img.src = i.src;
                            await new Promise(resolve => img.onload = resolve);
                            this.resources[index] = img;
                        }
                    }));
                }));
            }
            catch (e) {
                API.debug.error('load animated banner images error', e);
                return;
            }
            let container = document.querySelector("#banner_link");
            if (!container) {
                container = document.querySelector(".h-center");
                if (!container)
                    return this.resources.forEach(d => d.remove());
                container.parentElement.removeAttribute("style");
                container.style.width = "100%";
                container.style.top = "-42px";
                container.style.marginBottom = "-42px";
                container.innerHTML = "";
                (_b = document.querySelector(".b-header-mask-wrp")) === null || _b === void 0 ? void 0 : _b.remove();
            }
            ;
            container.classList.add("animated-banner");
            let containerHeight = container.clientHeight;
            let containerWidth = container.clientWidth;
            let containerScale = 180 / 155;
            // 初始化资源尺寸
            this.layerConfig.layers.forEach(v => {
                var _b, _c, _d, _e;
                v._initState = {
                    scale: 1,
                    rotate: ((_b = v.rotate) === null || _b === void 0 ? void 0 : _b.initial) || 0,
                    translate: ((_c = v.translate) === null || _c === void 0 ? void 0 : _c.initial) || [0, 0],
                    blur: ((_d = v.blur) === null || _d === void 0 ? void 0 : _d.initial) || 0,
                    opacity: ((_e = v.opacity) === null || _e === void 0 ? void 0 : _e.initial) === undefined ? 1 : v.opacity.initial,
                };
                v.resources.forEach((i, index) => {
                    var _b, _c;
                    const el = this.resources[index];
                    if (el.tagName === 'VIDEO') {
                        if (el.parentNode) {
                            el.parentNode.removeChild(el);
                        }
                        el.dataset.height = el.videoHeight;
                        el.dataset.width = el.videoWidth;
                    }
                    else {
                        el.dataset.height = el.naturalHeight;
                        el.dataset.width = el.naturalWidth;
                    }
                    const initial = ((_b = v.scale) === null || _b === void 0 ? void 0 : _b.initial) === undefined ? 1 : (_c = v.scale) === null || _c === void 0 ? void 0 : _c.initial;
                    el.height = el.dataset.height * containerScale * initial;
                    el.width = el.dataset.width * containerScale * initial;
                });
            });
            // 初始化图层
            const layers = this.layerConfig.layers.map(v => {
                const layer = document.createElement('div');
                layer.classList.add('layer');
                container.appendChild(layer);
                return layer;
            });
            let displace = 0;
            let enterX = 0;
            let raf = 0;
            const curveParameterToFunc = (param) => {
                const o = API.bezier(...param);
                return (v) => v > 0 ? o(v) : -o(-v);
            };
            let lastDisplace = NaN;
            // 根据鼠标位置改变状态
            const af = (t) => {
                try {
                    if (lastDisplace === displace) {
                        return;
                    }
                    lastDisplace = displace;
                    layers.map((layer, i) => {
                        const v = this.layerConfig.layers[i];
                        const a = layer.firstChild;
                        if (!a) {
                            return;
                        }
                        const transform = {
                            scale: v._initState.scale,
                            rotate: v._initState.rotate,
                            translate: v._initState.translate,
                        };
                        if (v.scale) {
                            const x = v.scale.offset || 0;
                            const itp = v.scale.offsetCurve ? curveParameterToFunc(v.scale.offsetCurve) : ((x) => x);
                            const offset = x * itp(displace);
                            transform.scale = v._initState.scale + offset;
                        }
                        if (v.rotate) {
                            const x = v.rotate.offset || 0;
                            const itp = v.rotate.offsetCurve ? curveParameterToFunc(v.rotate.offsetCurve) : ((x) => x);
                            const offset = x * itp(displace);
                            transform.rotate = v._initState.rotate + offset;
                        }
                        if (v.translate) {
                            const x = v.translate.offset || [0, 0];
                            const itp = v.translate.offsetCurve ? curveParameterToFunc(v.translate.offsetCurve) : ((x) => x);
                            const offset = x.map(v => itp(displace) * v);
                            const translate = v._initState.translate.map((x, i) => { var _b; return (x + offset[i]) * containerScale * (((_b = v.scale) === null || _b === void 0 ? void 0 : _b.initial) || 1); });
                            transform.translate = translate;
                        }
                        a.style.transform = \`scale(\${transform.scale})\` +
                            \`translate(\${transform.translate[0]}px, \${transform.translate[1]}px)\` +
                            \`rotate(\${transform.rotate}deg)\`;
                        if (v.blur) {
                            const x = v.blur.offset || 0;
                            const itp = v.blur.offsetCurve ? curveParameterToFunc(v.blur.offsetCurve) : ((x) => x);
                            const blurOffset = x * itp(displace);
                            let res = 0;
                            if (!v.blur.wrap || v.blur.wrap === 'clamp') {
                                res = Math.max(0, v._initState.blur + blurOffset);
                            }
                            else if (v.blur.wrap === 'alternate') {
                                res = Math.abs(v._initState.blur + blurOffset);
                            }
                            a.style.filter = res < 1e-4 ? '' : \`blur(\${res}px)\`;
                        }
                        if (v.opacity) {
                            const x = v.opacity.offset || 0;
                            const itp = v.opacity.offsetCurve ? curveParameterToFunc(v.opacity.offsetCurve) : ((x) => x);
                            const opacityOffset = x * itp(displace);
                            const initial = v._initState.opacity;
                            if (!v.opacity.wrap || v.opacity.wrap === 'clamp') {
                                a.style.opacity = Math.max(0, Math.min(1, initial + opacityOffset));
                            }
                            else if (v.opacity.wrap === 'alternate') {
                                const x = initial + opacityOffset;
                                let y = Math.abs(x % 1);
                                if (Math.abs(x % 2) >= 1) {
                                    y = 1 - y;
                                }
                                a.style.opacity = y;
                            }
                        }
                    });
                }
                catch (e) {
                    API.debug.error(e);
                }
            };
            // 初始化图层内图片和帧动画
            this.layerConfig.layers.map((v, i) => {
                const a = this.resources[i];
                layers[i].appendChild(a);
                if (a.tagName === 'VIDEO') {
                    a.play();
                }
                requestAnimationFrame(af);
            });
            const handleLeave = () => {
                const now = performance.now();
                const timeout = 200;
                const tempDisplace = displace;
                cancelAnimationFrame(raf);
                const leaveAF = (t) => {
                    if (t - now < timeout) {
                        displace = tempDisplace * (1 - (t - now) / 200);
                        af(t);
                        requestAnimationFrame(leaveAF);
                    }
                    else {
                        displace = 0;
                        af(t);
                    }
                };
                raf = requestAnimationFrame(leaveAF);
            };
            this.handleMouseLeave = e => {
                this.entered = false;
                handleLeave();
            };
            this.handleMouseMove = e => {
                const offsetY = document.documentElement.scrollTop + e.clientY;
                if (offsetY < containerHeight) {
                    if (!this.entered) {
                        this.entered = true;
                        enterX = e.clientX;
                    }
                    displace = (e.clientX - enterX) / containerWidth;
                    cancelAnimationFrame(raf);
                    raf = requestAnimationFrame(af);
                }
                else {
                    if (this.entered) {
                        this.entered = false;
                        handleLeave();
                    }
                }
                this.extensions.map(v => { var _b; return (_b = v.handleMouseMove) === null || _b === void 0 ? void 0 : _b.call(v, { e, displace }); });
            };
            this.handleResize = e => {
                containerHeight = container.clientHeight;
                containerWidth = container.clientWidth;
                containerScale = 180 / 155;
                this.layerConfig.layers.forEach(lc => {
                    lc.resources.forEach((d, i) => {
                        var _b, _c;
                        const el = this.resources[i];
                        el.height = el.dataset.height * containerScale * (((_b = lc.scale) === null || _b === void 0 ? void 0 : _b.initial) || 1);
                        el.width = el.dataset.width * containerScale * (((_c = lc.scale) === null || _c === void 0 ? void 0 : _c.initial) || 1);
                    });
                });
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(t => {
                    af(t);
                });
                this.extensions.map(v => { var _b; return (_b = v.handleResize) === null || _b === void 0 ? void 0 : _b.call(v, e); });
            };
            document.addEventListener('mouseleave', this.handleMouseLeave);
            window.addEventListener('mousemove', this.handleMouseMove);
            window.addEventListener('resize', this.handleResize);
        }
    }
    _a = Animate;
    /**
     * 缓存已请求内容
     */
    Animate.record = {};
    /**
     * 资源id
     */
    Animate.rid = _a.resourceId();
    /**
     * locs列表
     */
    Animate.locs = [1576, 1612, 1580, 1920, 1584, 1588, 1592, 3129, 1600, 1608, 1604, 1596, 2210, 1634, 142];
    API.registerSetting({
        key: "bannerGif",
        sort: "style",
        label: "丰富顶栏动图",
        sub: '搜索框下gif',
        float: "替换顶栏动图接口，避免单调。",
        type: "switch",
        value: true
    });
    // 动图彩蛋
    API.config.bannerGif && API.jsonphook("api.bilibili.com/x/web-interface/index/icon", undefined, response => {
        response.data = API.Format.randomArray(JSON.parse(GM.getResourceText("index-icon.json")).fix);
        return response;
    }, false);
    // hook顶栏图片请求
    API.jsonphookasync("api.bilibili.com/x/web-show/res/loc", undefined, async (url) => {
        const obj = API.Format.urlObj(url);
        obj.callback = undefined;
        let loc = Animate.record[url];
        let header = Animate.record[Animate.rid];
        let rqs;
        if (!loc || !header) {
            rqs = await Promise.all([
                API.xhr.get(API.Format.objUrl(url, obj), { responseType: "json" }),
                API.xhr.get(\`https://api.bilibili.com/x/web-show/page/header?resource_id=\${Animate.rid}\`, { responseType: "json" })
            ]);
            loc = Animate.record[url] = rqs[0];
            header = Animate.record[Animate.rid] = rqs[1];
        }
        loc.data && Animate.locs.forEach(d => {
            loc.data[d] && (loc.data[d][0].pic = (header && header.data.pic) || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png",
                loc.data[d][0].litpic = (header && header.data.litpic),
                loc.data[d][0].url = (header && header.data.url) || "",
                loc.data[d][0].title = (header && header.data.name) || "");
            if (url.includes("loc?") && obj.id == String(d)) {
                loc.data[0].pic = (header && header.data.pic) || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png";
                loc.data[0].litpic = (header && header.data.litpic) || "";
                loc.data[0].url = (header && header.data.url) || "";
                loc.data[0].title = (header && header.data.name) || "";
            }
        });
        setTimeout(() => new Animate(header.data));
        return loc;
    }, false);
    // 顶栏广场
    API.jsonphookasync("api.bilibili.com/plaza/banner", () => true, async (url) => {
        return { "code": 0, "result": [{ "link": "https://www.bilibili.com/blackboard/x/act_list", "end": 1640966407, "begin": 1456709887, "title": "bilibili 活动", "cover": "http://i0.hdslb.com/bfs/square/6830d0e479eee8cc9a42c3e375ca99a5147390cd.jpg", "id": 9, "created_ts": 1491386053 }, { "link": "http://www.bilibili.com/blackboard/topic_list.html", "end": 1640966418, "begin": 1544258598, "title": "话题列表", "cover": "http://i0.hdslb.com/bfs/square/b1b00a0c3ce8570b48277ae07a2e55603a4a4ddf.jpg", "id": 17, "created_ts": 1491386030 }] };
    }, false);

//# sourceURL=API://@Bilibili-Old/do/banner.js`;
/*!***********************!*/
/**/modules["closedCaption.js"] = /*** ./dist/do/closedCaption.js ***/
`"use strict";
    class ClosedCaption {
        constructor() {
            this.element = {}; // 节点集合
            this.data = {}; // 字幕缓存
            this.resizeRate = 100; // 字幕大小倍率
            this.subtitle = []; // 字幕栈
            this.ON = \`<svg width="22" height="28" viewbox="0 0 22 30" xmlns="http://www.w3.org/2000/svg"><path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m4.07787,6.88102l14,0a2,2 0 0 1 2,2l0,10a2,2 0 0 1 -2,2l-14,0a2,2 0 0 1 -2,-2l0,-10a2,2 0 0 1 2,-2zm5,5.5a1,1 0 1 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0zm8,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0z"/></svg>\`;
            this.OFF = \`<svg width="22" height="28" viewBox="0 0 22 32" xmlns="http://www.w3.org/2000/svg"><path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m15.172,21.87103l-11.172,0a2,2 0 0 1 -2,-2l0,-10c0,-0.34 0.084,-0.658 0.233,-0.938l-0.425,-0.426a1,1 0 1 1 1.414,-1.414l15.556,15.556a1,1 0 0 1 -1.414,1.414l-2.192,-2.192zm-10.21,-10.21c-0.577,0.351 -0.962,0.986 -0.962,1.71l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 0.713,-0.958l-1.751,-1.752zm1.866,-3.79l11.172,0a2,2 0 0 1 2,2l0,10c0,0.34 -0.084,0.658 -0.233,0.938l-2.48,-2.48a1,1 0 0 0 -0.287,-1.958l-1.672,0l-1.328,-1.328l0,-0.672a1,1 0 0 1 1,-1l2,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -1.977,1.695l-5.195,-5.195z"/></svg>\`;
            this.color = [
                { value: '16777215', content: '<span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span>' },
                { value: '16007990', content: '<b style="color:#F44336;text-shadow: #000 0px 0px 1px">红色</b>' },
                { value: '10233776', content: '<b style="color:#9C27B0;text-shadow: #000 0px 0px 1px">紫色</b>' },
                { value: '6765239', content: '<b style="color:#673AB7;text-shadow: #000 0px 0px 1px">深紫色</b>' },
                { value: '4149685', content: '<b style="color:#3F51B5;text-shadow: #000 0px 0px 1px">靛青色</b>' },
                { value: '2201331', content: '<b style="color:#2196F3;text-shadow: #000 0px 0px 1px">蓝色</b>' },
                { value: '240116', content: '<b style="color:#03A9F4;text-shadow: #000 0px 0px 1px">亮蓝色</b>' }
            ];
            this.position = [
                { value: 'bl', content: '左下角' },
                { value: 'bc', content: '底部居中' },
                { value: 'br', content: '右下角' },
                { value: 'tl', content: '左上角' },
                { value: 'tc', content: '顶部居中' },
                { value: 'tr', content: '右上角' }
            ];
            this.shadow = [
                { value: '0', content: '无描边', style: '' },
                { value: '1', content: '重墨', style: \`text-shadow: #000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px,#000 -1px 0px 1px;\` },
                { value: '2', content: '描边', style: \`text-shadow: #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px;\` },
                { value: '3', content: '45°投影', style: \`text-shadow: #000 1px 1px 2px, #000 0px 0px 1px;\` }
            ];
            this.isON = false; // 是否启用
            this.setting = GM.getValue("subtitle", { backgroundopacity: 0.5, color: 16777215, fontsize: 1, isclosed: false, scale: true, shadow: "0", position: 'bc' });
            this.subtitlePrefer = GM.getValue("subtitlePrefer"); // 默认语言
        }
        /** 绘制字幕面板 */
        initUI() {
            this.element.node = document.createElement("div");
            this.element.node.setAttribute("class", "bilibili-player-video-btn");
            this.element.node.setAttribute("id", "bilibili-player-subtitle-btn");
            this.element.node.setAttribute("style", "display: block;");
            this.element.span = API.addElement("span", {}, this.element.node);
            this.element.span.innerHTML = this.ON;
            this.isON = true;
            this.element.span.onclick = () => {
                if (this.isON)
                    this.iconSwitch();
                else
                    this.iconSwitch(this.caption);
            };
            this.element.table = API.addElement("div", { id: "subtitle-setting-panel", style: "position: absolute; bottom: 28px; right: 30px; background: white; border-radius: 4px; text-align: left; padding: 13px; display: none; cursor: default;" }, this.element.node);
            this.language();
            this.fontsize();
            this.fontcolor();
            this.fontshadow();
            this.fontposition();
            this.fontopacrity();
            API.addCss(API.getModule("closedCaption.css"), "caption");
            this.changeResize();
            this.changePosition();
        }
        /** 切换字幕样式 */
        changeStyle() {
            var _a;
            (_a = document.querySelector("#caption-style")) === null || _a === void 0 ? void 0 : _a.remove();
            API.addCss(\`span.subtitle-item-background{opacity: \${this.setting.backgroundopacity};}
            span.subtitle-item-text {color:#\${("000000" + this.setting.color.toString(16)).slice(-6)};}
            span.subtitle-item {font-size: \${this.setting.fontsize * this.resizeRate}%;line-height: 110%;}
            span.subtitle-item {\${this.shadow[this.setting.shadow].style}}\`, "caption-style");
            GM.setValue("subtitle", this.setting);
        }
        /** 切换字幕大小 */
        changeResize() {
            this.resizeRate = this.setting.scale ? window.player.getWidth() / 1280 * 100 : 100;
            this.changeStyle();
        }
        /** 切换字幕位置 */
        changePosition() {
            this.contain = document.querySelector(".bilibili-player-video-subtitle>div");
            this.contain.className = 'subtitle-position subtitle-position-'
                + (this.setting.position || 'bc');
            this.contain.style = '';
            GM.setValue("subtitle", this.setting);
        }
        /** 字幕图标切换 */
        iconSwitch(caption) {
            if (caption) {
                this.isON = true;
                this.element.span.innerHTML = this.ON;
                this.setCaption(caption);
                this.text.innerHTML = caption.lan_doc;
                this.element.language.children[2].disabled = false;
            }
            else {
                this.isON = false;
                this.element.span.innerHTML = this.OFF;
                this.setCaption();
                this.text.innerHTML = "关闭";
                this.element.language.children[2].disabled = true;
            }
        }
        /** 字幕选择 */
        language() {
            this.element.language = API.addElement("div", {}, this.element.table);
            this.element.language.innerHTML = \`<div>字幕</div>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 100px;">
            <div class="bpui-selectmenu-txt">关闭</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 180px; overflow: hidden auto; white-space: nowrap;">
            <li class="bpui-selectmenu-list-row" data-value="close">关闭</li>
            </ul></div>
            <button class="bpui-button" style="padding: 0px 8px;">下载</button>
            <a class="bpui-button" href="https://member.bilibili.com/v2#/zimu/my-zimu/zimu-editor?cid=\${API.cid}&aid=\${API.aid}" target="_blank" title="" style="margin-right: 0px; height: 24px; padding: 0px 6px;">添加字幕</a>\`;
            let list = this.element.language.children[1].children[2];
            this.text = this.element.language.children[1].children[0];
            // this.element.language.children[2].onclick = () => {
            //     importModule("download");
            //     config.reset.dlother = 1; // 开启其他下载
            //     download(); // 拉起下载面板
            // }
            list.children[0].onclick = () => {
                this.text.innerHTML = "关闭";
                this.setCaption();
            };
            this.text.innerHTML = this.caption.lan_doc;
            this.captions = this.captions.reverse();
            this.captions.forEach((d) => {
                let temp = API.addElement("div", { class: "bpui-selectmenu-list-row", "data-value": d.lan }, list, d.lan_doc, true);
                temp.onclick = () => {
                    this.text.innerHTML = d.lan_doc;
                    this.iconSwitch(d);
                    GM.setValue("subtitlePrefer", this.subtitlePrefer = d.lan);
                };
            });
        }
        /** 字幕大小 */
        fontsize() {
            this.element.fontsize = API.addElement("div", {}, this.element.table);
            this.element.fontsize.innerHTML = \`<div>字体大小</div>
            <input type="range" step="25" style="width: 70%;">
            <input id="subtitle-auto-resize" type="checkbox">
            <label for="subtitle-auto-resize" style="cursor: pointer;">自动缩放</label>\`;
            this.element.fontsize.children[1].value = this.setting.fontsize == 0.6 ? 0
                : this.setting.fontsize == 0.8 ? 25
                    : this.setting.fontsize == 1.3 ? 75
                        : this.setting.fontsize == 1.6 ? 100 : 50;
            this.element.fontsize.children[1].oninput = (e) => {
                const v = e.target.value / 25;
                this.setting.fontsize = v > 2 ? (v - 2) * 0.3 + 1 : v * 0.2 + 0.6;
                this.changeStyle();
            };
            this.element.fontsize.children[2].checked = this.setting.scale;
            this.element.fontsize.children[2].onchange = (e) => this.changeResize(this.setting.scale = e.target.checked);
        }
        /** 字幕颜色 */
        fontcolor() {
            this.element.fontcolor = API.addElement("div", {}, this.element.table);
            this.element.fontcolor.innerHTML = \`<span>字幕颜色</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt"><span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span></div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 120px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>\`;
            this.color.forEach(d => {
                if (d.value == this.setting.color)
                    this.element.fontcolor.children[1].children[0].innerHTML = d.content;
                let temp = API.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontcolor.children[1].children[2]);
                temp.innerHTML = d.content;
                temp.onclick = () => {
                    this.element.fontcolor.children[1].children[0].innerHTML = d.content;
                    this.changeStyle(this.setting.color = parseInt(d.value));
                };
            });
        }
        /** 字幕阴影 */
        fontshadow() {
            this.element.fontshadow = API.addElement("div", {}, this.element.table);
            this.element.fontshadow.innerHTML = \`<span>字幕描边</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt">无描边</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 120px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>\`;
            this.shadow.forEach(d => {
                if (d.value == this.setting.shadow)
                    this.element.fontshadow.children[1].children[0].innerHTML = d.content;
                let temp = API.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontshadow.children[1].children[2]);
                temp.innerHTML = d.content;
                temp.onclick = () => {
                    this.element.fontshadow.children[1].children[0].innerHTML = d.content;
                    this.changeStyle(this.setting.shadow = d.value);
                };
            });
        }
        /** 字幕位置 */
        fontposition() {
            this.element.fontposition = API.addElement("div", {}, this.element.table);
            this.element.fontposition.innerHTML = \`<span>字幕位置</span>
            <div class="bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute" style="width: 74%;">
            <div class="bpui-selectmenu-txt">底部居中</div>
            <div class="bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down"></div>
            <ul class="bpui-selectmenu-list bpui-selectmenu-list-left" style="max-height: 100px; overflow: hidden auto; white-space: nowrap;"></ul>
            </div>\`;
            this.position.forEach(d => {
                if (d.value == this.setting.position)
                    this.element.fontposition.children[1].children[0].innerHTML = d.content;
                let temp = API.addElement("li", { class: "bpui-selectmenu-list-row", "data-value": d.value }, this.element.fontposition.children[1].children[2]);
                temp.innerHTML = d.content;
                temp.onclick = () => {
                    this.element.fontposition.children[1].children[0].innerHTML = d.content;
                    this.changePosition(this.setting.position = d.value);
                };
            });
        }
        /** 字幕透明度 */
        fontopacrity() {
            this.element.fontopacrity = API.addElement("div", {}, this.element.table);
            this.element.fontopacrity.innerHTML = \`<div>背景不透明度</div><input type="range" style="width: 100%;">\`;
            this.element.fontopacrity.children[1].value = this.setting.backgroundopacity * 100;
            this.element.fontopacrity.children[1].oninput = (e) => {
                this.changeStyle(this.setting.backgroundopacity = e.target.value / 100);
            };
        }
        /** 获取CC字幕信息 */
        async getCaption(data) {
            try {
                this.subtitle = this.captions = data.data.subtitle.subtitles || [];
                let i = 0; // 指示字幕语言记录
                this.captions.forEach((d, j) => {
                    if (d.lan == this.subtitlePrefer)
                        i = j;
                });
                if (this.captions[i])
                    await this.setCaption(this.captions[i]);
                if (this.caption) {
                    // 只在有字幕时添加面板
                    window.player.addEventListener('video_resize', (event) => {
                        this.changeResize(event);
                    });
                    let anchor = document.querySelector(".bilibili-player-video-btn-quality");
                    this.initUI();
                    if (!document.querySelector("#bilibili-player-subtitle-btn"))
                        anchor.insertAdjacentElement("afterend", this.element.node);
                }
            }
            catch (e) {
                API.debug.error("closedCaption.js", e);
            }
        }
        /**
         * 设置CC字幕
         * @param caption CC字幕对象
         */
        async setCaption(caption) {
            let data = { body: [] }; // 空字幕
            if (caption && caption.subtitle_url) {
                this.data[caption.subtitle_url] = this.data[caption.subtitle_url] || await API.xhr({
                    url: caption.subtitle_url,
                    responseType: "json",
                    credentials: false
                });
                data = this.data[caption.subtitle_url] || data;
            }
            window.player.updateSubtitle(data); // 投喂字幕数据给播放器
            setTimeout(() => {
                if (window.player.getState() == "PLAYING") {
                    // 刷新一次播放状态
                    window.player.pause();
                    window.player.play();
                }
            }, 1000);
            if (caption && caption.subtitle_url) {
                this.caption = caption; // 记忆当前字幕
                API.bofqiMessage(["载入字幕", this.captions[0].lan_doc]);
            }
            else
                API.bofqiMessage("关闭字幕");
        }
    }
    /** 为旧版播放器追加CC字幕功能 */
    API.closedCaption = new ClosedCaption();

//# sourceURL=API://@Bilibili-Old/do/closedCaption.js`;
/*!***********************!*/
/**/modules["danmakuHashId.js"] = /*** ./dist/do/danmakuHashId.js ***/
`"use strict";
    API.addCss(API.getModule("danmakuHashId.css"));
    class DanmakuHashId {
        constructor(crc) {
            this.count = 0; // 当前查询弹幕序号
            // 设置正在查询的弹幕数量
            DanmakuHashId.count = DanmakuHashId.count ? DanmakuHashId.count + 1 : 1;
            // 当前查询弹幕排序
            this.count = DanmakuHashId.count;
            // 临时缓存已查询的 mid
            DanmakuHashId.catch = DanmakuHashId.catch || {};
            this.hash = crc;
            this.mid = API.midcrc(this.hash);
            this.getInfo();
        }
        async getInfo() {
            try {
                this.node = document.querySelector(".bilibili-player-context-menu-container.active");
                if (!this.node)
                    return setTimeout(() => { this.getInfo(); }, 100);
                this.node = this.node.children[0];
                let j = 0; // 找到的节点序号
                for (let i = this.node.children.length - 1; i >= 0; i--) {
                    if (this.node.children[i].textContent.includes("mid")) {
                        this.dm = this.node.children[i];
                        j++;
                        if (this.count === j)
                            break;
                    }
                }
                if (!this.dm)
                    return setTimeout(() => { this.getInfo(); }, 100);
                if (this.dm.tagName != "LI")
                    return;
                DanmakuHashId.catch[this.mid] = DanmakuHashId.catch[this.mid] || API.jsonCheck(await API.xhr({ url: API.Format.objUrl("https://api.bilibili.com/x/web-interface/card", { mid: this.mid }) }));
                this.dm.innerHTML = '<div style="min-height:0px;z-index:-5;background-color: unset;" class="bb-comment"><div style="padding-top: 0;" class="comment-list"><div class="list-item"><div class="reply-box"><div style="padding:0px" class="reply-item reply-wrap"><div style="margin-left: 15px;vertical-align: middle;" data-usercard-mid="' +
                    this.mid + '" class="reply-face"><img src="' +
                    DanmakuHashId.catch[this.mid].data.card.face + '@52w_52h.webp" alt=""></div><div class="reply-con"><div class="user" style="padding-bottom: 0;top: 3px;"><a style="display:initial;padding: 0px;" data-usercard-mid="' +
                    this.mid + '" href="//space.bilibili.com/' +
                    this.mid + '" target="_blank" class="' +
                    (DanmakuHashId.catch[this.mid].data.card.vip.vipType > 1 ? "name vip-red-name" : "name") + '">' + DanmakuHashId.catch[this.mid].data.card.name + '</a> ' +
                    DanmakuHashId.catch[this.mid].data.card.sex + '<a style="display:initial;padding: 0px;" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' +
                    DanmakuHashId.catch[this.mid].data.card.level_info.current_level + '"></i></a></div></div></div></div></div></div></div>';
                DanmakuHashId.count--;
            }
            catch (e) {
                DanmakuHashId.count--;
                API.toast.error("danmakuHashId.js", e);
            }
        }
    }
    DanmakuHashId.count = 0; // 正在查询弹幕数
    DanmakuHashId.catch = {}; // 已查询弹幕缓存
    window.danmakuHashId = (crc) => {
        try {
            const check = new DanmakuHashId(crc);
            return \`hash: \${check.hash} mid: \${check.mid}\`;
        }
        catch (e) {
            API.toast.error("danmakuHashId.js", e);
        }
    };

//# sourceURL=API://@Bilibili-Old/do/danmakuHashId.js`;
/*!***********************!*/
/**/modules["infoNewNumber.js"] = /*** ./dist/do/infoNewNumber.js ***/
`"use strict";
    API.jsonphook("bilibili.com/x/web-interface/online", undefined, obj => {
        obj.data && (obj.data.region_count[165] = obj.data.region_count[202]);
        return obj;
    }, false);
    API.scriptBlock(["/web-feed/", "unread?"]);

//# sourceURL=API://@Bilibili-Old/do/infoNewNumber.js`;
/*!***********************!*/
/**/modules["localMedia.js"] = /*** ./dist/do/localMedia.js ***/
`"use strict";
    class LocalMedia {
        constructor(files) {
            /** 被选择的文件 */
            this.data = { xml: [], json: [], mp4: [] };
            /** 弹幕当前偏移 */
            this.offset = 0;
            /** 是否已绑定键盘事件 */
            this.keyboard = false;
            this.change(files);
        }
        /**
         * 读取文件地址
         */
        change(files) {
            const file = files;
            if (file.length === 0) {
                return API.toast.warning("请选择本地视频或弹幕文件！", "视频：.mp4（且符合浏览器支持的编码）", "弹幕：.xml, .json");
            }
            this.data = { xml: [], json: [], mp4: [] }; // 初始化选择表
            this.data = Array.from(file).reduce((d, i) => {
                /\\.xml\$/.test(i.name) && d.xml.push(i); // xml弹幕
                /\\.json\$/.test(i.name) && d.json.push(i); // json弹幕
                /\\.mp4\$/.test(i.name) && d.mp4.push(i); // mp4视频
                return d;
            }, this.data);
            if (!this.data.xml[0] && !this.data.json[0] && !this.data.mp4[0]) {
                return API.toast.warning("未能识别到任何有效文件信息 →_→");
            }
            this.video();
            this.danmaku();
        }
        /**
         * 读取文件内容
         * @param file 记录本地文件信息的 file 对象
         */
        readFile(file) {
            return new Promise((resolve, reject) => {
                if (!file)
                    reject(API.toast.error('无效文件路径！'));
                const reader = new FileReader();
                reader.readAsText(file, 'utf-8');
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(API.toast.error('读取文件出错，请重试！'));
                };
            });
        }
        /** 载入弹幕 */
        async danmaku() {
            var _a;
            if (!API.danmaku.loadLocalDm) {
                return API.toast.error("载入本地弹幕失败：本地弹幕组件丢失！");
            }
            if (!this.data.xml[0] && !this.data.json[0])
                return;
            this.data.xml.forEach(async (d, i) => {
                // 读取xml弹幕
                let data = await this.readFile(d);
                API.toast("本地弹幕：" + d.name, "载入模式：" + ((i || API.config.concatDanmaku) ? "与当前弹幕合并" : "替换当前弹幕"));
                API.danmaku.loadLocalDm(data, Boolean(i) || API.config.concatDanmaku);
            });
            this.data.json.forEach(async (d, i) => {
                var _a;
                // 读取json弹幕
                let data = JSON.parse(await this.readFile(d)) || [];
                API.toast("本地弹幕：" + d.name, "载入模式：" + ((this.data.xml[0] || i || API.config.concatDanmaku) ? "与当前弹幕合并" : "替换当前弹幕"));
                (_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku(data, this.data.xml[0] || Boolean(i) || API.config.concatDanmaku);
            });
            API.bofqiMessage();
            this.offset = 0; // 记录或重置弹幕偏移时间
            if (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.offsetDanmaku))
                return API.toast.error("绑定键盘事件失败：弹幕偏移组件丢失！");
            else {
                API.toast("已绑定键盘事件", "可以通过键盘 , 和 . 两个键（即上标为 < 和 > 的两个键）提前或延后弹幕偏移，频度1秒/次");
                if (!this.keyboard) {
                    this.keyboard = true;
                    document.addEventListener("keydown", (ev) => {
                        switch (ev.key) {
                            case ",":
                                window.player.offsetDanmaku(-1);
                                this.offset--;
                                API.bofqiMessage(["弹幕偏移：", \`\${this.offset} 秒\`]);
                                break;
                            case ".":
                                window.player.offsetDanmaku(1);
                                this.offset++;
                                API.bofqiMessage(["弹幕偏移：", \`\${this.offset} 秒\`]);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        }
        /** 载入视频 */
        video() {
            if (this.data.mp4[0]) {
                API.toast.warning("载入本地视频中...", "请无视控制台大量报错！");
                let video = document.querySelector("#bilibiliPlayer > div.bilibili-player-area.video-state-pause > div.bilibili-player-video-wrap > div.bilibili-player-video > video");
                video.src = URL.createObjectURL(this.data.mp4[0]);
                API.toast.success("本地视频：" + this.data.mp4[0].name);
                document.querySelector(".bilibili-player-video-time-total").textContent = this.time(video.duration); // 修复总时长
            }
        }
        /**
         * 格式化时间轴
         * @param time 时间/秒
         * @returns mm:ss
         */
        time(time) {
            time = Number(time) || 0;
            let s = time % 60;
            let m = (time - s) / 60;
            s = (Array(2).join('0') + s).slice(-2);
            m = m < 10 ? (Array(2).join('0') + m).slice(-2) : m;
            return \`\${m}:\${s}\`;
        }
    }
    API.LocalMedia = LocalMedia;

//# sourceURL=API://@Bilibili-Old/do/localMedia.js`;
/*!***********************!*/
/**/modules["logReport.js"] = /*** ./dist/do/logReport.js ***/
`"use strict";
    Object.defineProperty(window, "reportObserver", { get: () => undefined, set: () => true });
    Object.defineProperty(window, "reportMsgObj", { get: () => new Proxy({}, { get: () => () => { } }), set: () => true });
    API.xhrhookasync("data.bilibili.com", (args) => { API.debug.debug("拦截日志", ...args); return true; }, undefined, false);
    API.xhrhookasync("data.bilivideo.com", (args) => { API.debug.debug("拦截日志", ...args); return true; }, undefined, false);
    API.scriptBlock("log-reporter.js");

//# sourceURL=API://@Bilibili-Old/do/logReport.js`;
/*!***********************!*/
/**/modules["manage.js"] = /*** ./dist/do/manage.js ***/
`"use strict";
    class Config {
        constructor() {
            this.box = API.ElementComponent.popupbox({ maxWidth: "360px", maxHeight: "300px" });
            API.addElement("div", { style: 'text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;' }, this.box, \`<span>设置数据<span>\`);
            API.addElement("div", { style: 'margin-bottom: 10px;' }, this.box, \`<div>设置数据包含您个人对于设置的自定义调整，不包括内置的模块、安装的第三方模块以及各种功能缓存的数据。您可以选择恢复默认数据、导出为本地文件或者从本地文件中恢复。</div>\`);
            this.box.appendChild(API.ElementComponent.hr());
            const body = API.addElement("div", { style: "display: flex;align-items: center;justify-content: space-around;" }, this.box);
            body.appendChild(API.ElementComponent.button(() => { this.restore(); }, "默认", 0));
            body.appendChild(API.ElementComponent.button(() => { this.output(); }, "导出", 0));
            body.appendChild(API.ElementComponent.file((v) => { this.input(v); }, false, "导入", [".json"]));
        }
        /** 初始化设置 */
        restore() {
            GM.deleteValue("config");
            API.toast.warning("已恢复默认数据，请及时刷新页面避免数据紊乱！");
            API.alertMessage(\`已恢复默认数据，请及时<strong>刷新</strong>页面避免数据紊乱！\`, "恢复默认设置").then(d => { d && location.reload(); });
        }
        /** 导出设置 */
        output() {
            API.saveAs(JSON.stringify(GM.getValue("config"), undefined, "\\t"), \`config \${API.Format.timeFormat(undefined, true)}.json\`, "application/json");
        }
        /**
         * 导入设置
         * @param v 被选文件，来自HTMLInputElement.list
         */
        input(v) {
            v && v[0] && API.readAs(v[0]).then(d => {
                const data = JSON.parse(d);
                GM.setValue("config", data);
                API.toast.success("已导入本地设置数据，请刷新页面生效！");
            });
        }
    }
    new Config();

//# sourceURL=API://@Bilibili-Old/do/manage.js`;
/*!***********************!*/
/**/modules["parameterTrim.js"] = /*** ./dist/do/parameterTrim.js ***/
`"use strict";
    class ParameterTrim {
        constructor() {
            /** 原始url */
            this.url = [];
            /** 垃圾参数 */
            this.param = {
                spm_id_from: undefined,
                from_source: undefined,
                msource: undefined,
                bsource: undefined,
                seid: undefined,
                source: undefined,
                session_id: undefined,
                visit_id: undefined,
                sourceFrom: undefined,
                from_spmid: undefined,
                share_source: undefined,
                share_medium: undefined,
                share_plat: undefined,
                share_session_id: undefined,
                share_tag: undefined,
                unique_k: undefined
            };
        }
        /** url处理 */
        location() {
            this.url[1] = location.href; // 暂存URL，以便比较URL变化
            if (this.url[0] != this.url[1]) {
                let href = this.triming(location.href); // 处理链接
                window.history.replaceState(window.history.state, "", href); // 推送到地址栏
                this.url[0] = location.href; // 刷新暂存
            }
        }
        anchor(list) {
            list.forEach(d => {
                if (!d.href)
                    return;
                d.href.includes("bilibili.tv") && (d.href = d.href.replace("bilibili.tv", "bilibili.com")); // tv域名失效
                d.href.includes("www.bilibili.com/tag") && (d.href = d.href.replace("tag", "topic")); // 视频标签失效
                d.href.includes("account.bilibili.com/login?act=exit") && (d.href = "javascript:void(0);", d.onclick = () => API.loginExit()); // 修复退出页面
                d.href = this.triming(d.href);
            });
        }
        /**
         * 处理引导
         * @param url 源URL
         * @returns URL
         */
        triming(url) {
            const obj = API.Format.urlObj(url);
            obj.bvid && (obj.aid = API.abv(obj.bvid), obj.bvid = undefined); // 旧版页面一般不支持bvid，转化为aid
            obj.aid && !Number(obj.aid) && (obj.aid = API.abv(obj.aid)); // 部分写作aid读作bvid也得转化
            obj.from == "search" && (obj.from = undefined); // from=search 在直播页面是有效参数
            Object.assign(obj, this.param); // 清理参数，undefined在objUrl中会被过滤
            return API.Format.objUrl(url, obj).replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, s => "av" + API.abv(s)); // 非参数型bv号转化为av号
        }
        click(e) {
            var f = e.target;
            for (; f && "A" !== f.tagName;) {
                f = f.parentNode;
            }
            if ("A" !== (null == f ? void 0 : f.tagName)) {
                return;
            }
            f.href && (f.href = this.triming(f.href));
        }
    }
    const parameterTrim = new ParameterTrim();
    parameterTrim.location(); // 清理网址
    API.switchVideo(() => { parameterTrim.location(); });
    API.observerAddedNodes(async (node) => {
        node.querySelectorAll && parameterTrim.anchor(node.querySelectorAll("a"));
        node.tagName == "A" && parameterTrim.anchor([node]);
    });
    window.addEventListener("click", e => parameterTrim.click(e), !1); // spm参数在DOM回调中注入，冒泡到window便能将其抹去

//# sourceURL=API://@Bilibili-Old/do/parameterTrim.js`;
/*!***********************!*/
/**/modules["player-v2.js"] = /*** ./dist/do/player-v2.js ***/
`"use strict";
    API.registerSetting({
        key: "carousel",
        sort: "restore",
        label: "修复播放器消息",
        sub: "也可以留空",
        type: "mutlti",
        value: ["番剧推荐"],
        list: ["番剧推荐", "首页推荐", "实时热搜"],
        float: '不定多选，多选时随机呈现其中一种，也可以留空。'
    });
    API.registerSetting({
        key: "segProgress",
        sort: "player",
        label: "分段进度条",
        sub: "仅限看点视频",
        type: "switch",
        value: false
    });
    API.switchVideo(() => {
        let ready = false; // 载入时机标记
        API.xhrhookasync("api.bilibili.com/x/player/carousel.so", () => ready = true, async () => {
            let str = \`<msg><item bgcolor="#000000" catalog="news"><![CDATA[<a href="//app.bilibili.com/?from=bfq" target="_blank"><font color="#ffffff">客户端下载</font></a>]]></item><item bgcolor="#000000" catalog="news"><![CDATA[<a href="http://link.acg.tv/forum.php" target="_blank"><font color="#ffffff">bug反馈传送门</font></a>]]></item></msg>'\`, result;
            try {
                switch (API.Format.randomArray(API.config.carousel)) { // 随机抽选
                    case "番剧推荐":
                        result = await API.xhr.get("//api.bilibili.com/pgc/operation/api/slideshow?position_id=531", { responseType: "json" });
                        str = result.result.reduce((s, d, i) => {
                            s += \`<item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="\${2320 + i}" id="\${314825 + i}"><![CDATA[<a href="\${d.blink}" target="_blank"><font color="#FFFFFF">\${d.title}</font></a>]]></item>\`;
                            return s;
                        }, "<msg>") + "</msg>";
                        break;
                    case "首页推荐":
                        result = await API.xhr.get("https://api.bilibili.com/x/web-show/res/loc?pf=0&id=4694", { responseType: "json" });
                        str = result.data.reduce((s, d, i) => {
                            d.name && (s += \`<item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="\${2320 + i}" id="\${314825 + i}"><![CDATA[<a href="\${d.url}" target="_blank"><font color="#FFFFFF">\${d.name}</font></a>]]></item>\`);
                            return s;
                        }, "<msg>") + "</msg>";
                        break;
                    case "实时热搜":
                        result = await API.xhr.get("https://api.bilibili.com/x/web-interface/search/square?limit=10", { responseType: "json" });
                        str = result.data.trending.list.reduce((s, d, i) => {
                            s += \`<item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="\${2320 + i}" id="\${314825 + i}"><![CDATA[<a href="https://search.bilibili.com/all?keyword=\${encodeURIComponent(d.keyword)}" target="_blank"><font color="#FFFFFF">\${d.keyword}</font></a>]]></item>\`;
                            return s;
                        }, "<msg>") + "</msg>";
                        break;
                }
            }
            catch (e) {
                API.debug.error("获取推荐数据出错！", e);
            }
            const dom = new DOMParser().parseFromString(str, "text/xml");
            API.runWhile(() => document.querySelector(".bilibili-player-video-message-show-setting"), () => {
                document.querySelector(".bilibili-player-video-message-show-setting").addEventListener("click", () => {
                    API.toast.warning("此处设置已失效，请在脚本设置面板“修复播放器消息”中调整！");
                    API.displaySetting("carousel");
                });
            });
            return {
                response: dom,
                responseXML: dom
            };
        }, false);
        API.xhr({
            url: API.Format.objUrl("https://api.bilibili.com/x/player/v2", { cid: API.cid, aid: API.aid }),
            responseType: "json",
            credentials: true
        }).catch((e) => {
            API.debug.error("autoFix.js", e);
            return API.xhr({
                url: API.Format.objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: API.cid, aid: API.aid, type: 1 }),
                responseType: "json",
                credentials: true
            });
        }).then((data) => {
            API.runWhile(() => ready, () => {
                var _a, _b, _c;
                // CC字幕
                ((_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.subtitle) === null || _b === void 0 ? void 0 : _b.subtitles) && API.closedCaption.getCaption(data);
                // 分段进度条
                API.config.segProgress && ((_c = data === null || data === void 0 ? void 0 : data.data) === null || _c === void 0 ? void 0 : _c.view_points[1]) && new API.SegProgress(data);
            });
        });
    });

//# sourceURL=API://@Bilibili-Old/do/player-v2.js`;
/*!***********************!*/
/**/modules["playinfo.js"] = /*** ./dist/do/playinfo.js ***/
`"use strict";
    API.xhrhook("/playurl?", args => {
        args[1].includes("84956560bc028eb7") && (args[1] = API.urlsign(args[1], {}, 8)); // 修复失效的appid
        args[1].includes("pgc") && (API.pgc = true); // ogv视频
    }, async (obj) => {
        try {
            API.__playinfo__ = obj.responseType === "json" ? obj.response : API.jsonCheck(obj.response);
        }
        catch (e) { }
    }, false);

//# sourceURL=API://@Bilibili-Old/do/playinfo.js`;
/*!***********************!*/
/**/modules["protoDm.js"] = /*** ./dist/do/protoDm.js ***/
`"use strict";
    API.importModule("worker.js");
    API.importModule("webSocket.js");
    const id = API.xhrhookasync("history?type=", (args) => {
        var _a;
        const param = API.Format.urlObj(args[1]);
        if (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku)) {
            API.removeXhrhook(id);
            API.toast.warning("内部组件丢失！");
            return false;
        }
        else if (!param.date)
            return false;
        API.xhr({
            url: \`https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=\${API.cid}&date=\${param.date}\`,
            responseType: "arraybuffer",
            credentials: true
        }).then((seg) => {
            var _a;
            let dm = API.danmaku.danmakuFormat(API.danmaku.segDmDecode(seg));
            (_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku(dm);
            API.danmaku.danmaku = dm;
        }).catch((e) => {
            API.toast.error("载入历史弹幕失败", "请尝试刷新页面");
            API.toast.error(e);
        });
        return true;
    }, undefined, false);

//# sourceURL=API://@Bilibili-Old/do/protoDm.js`;
/*!***********************!*/
/**/modules["replyList.js"] = /*** ./dist/do/replyList.js ***/
`"use strict";
    API.registerSetting({
        key: "oldReplySort",
        sort: "style",
        label: "评论区优先展示按时间排序",
        sub: "疏于维护的特别需求",
        type: "switch",
        value: false,
        float: "B站曾经默认优先以时间顺序展示评论，并在最前列展示几条热评。本脚本尝试恢复过本功能，但如今已疏于维护。"
    });
    API.registerSetting({
        key: "trusteeship",
        sort: "common",
        label: "托管原生脚本",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></g></svg>',
        type: "switch",
        value: true,
        float: "脚本修改了部分B站原生脚本以解决常规手段无法解决的问题，但由于托管CDN没有国内节点等原因可能访问不畅，如果出现页面其他情况都正常唯独播放器加载不出来的情况可以尝试开启。<strong>关闭本选项将导致部分功能不可用，如非必要请勿关闭！</strong>",
        sub: "代为修复和维护"
    });
    API.registerSetting({
        key: "commentLinkDetail",
        sort: "style",
        label: "还原评论中的超链接",
        sub: "av、ss或ep",
        type: "switch",
        value: false
    });
    let tag = true, timer;
    const script = API.config.oldReplySort ? "comment.min.js" : "comment.js";
    API.config.trusteeship && API.scriptIntercept("comment.min.js", undefined, url => {
        setTimeout(() => {
            API.addElement("link", { rel: "stylesheet", href: "//static.hdslb.com/phoenix/dist/css/comment.min.css" }, document.head);
        });
        const text = GM.getResourceText(script);
        if (!text)
            setTimeout(() => { API.toast.error("comment.js 资源加载失败！您可以在设置中临时关闭“托管原生脚本”。"); API.displaySetting("trusteeship"); });
        return text;
    });
    API.jsonphook("bilibili.com/x/v2/reply", url => {
        tag && (tag = false, API.addCss(API.getCss("comment.css")), API.config.oldReplySort && API.addCss(API.getCss("oldReplySort.css")));
        url += "&mobi_app=android";
        return url;
    }, undefined, false);
    API.config.commentLinkDetail && API.observerAddedNodes((node) => {
        if (/l_id/.test(node.id) || /reply-wrap/.test(node.className)) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                timer = undefined;
                document.querySelectorAll(".comment-jump-url").forEach((d, i, e) => {
                    if (d.href && !d.href.includes(d.text)) {
                        const arr = d.href.split("/");
                        let text = arr[arr.length - 1] || arr[arr.length - 2];
                        text.toLowerCase().startsWith("bv") && (text = API.abv(text));
                        e[i].title = d.text;
                        e[i].text = text;
                    }
                });
            }, 100);
        }
    });

//# sourceURL=API://@Bilibili-Old/do/replyList.js`;
/*!***********************!*/
/**/modules["section.js"] = /*** ./dist/do/section.js ***/
`"use strict";
    API.runWhile(() => document.querySelector("#internationalHeader"), () => {
        var _a;
        if (API.path.name)
            return;
        API.addCss(".nav-item.live {width: auto;}");
        document.querySelector("#internationalHeader").setAttribute("style", "visibility:hidden;");
        (!((_a = window.\$) === null || _a === void 0 ? void 0 : _a.ajax)) && API.addElement("script", { type: "text/javascript", src: "//static.hdslb.com/js/jquery.min.js" }, undefined, undefined, true);
        ((document.querySelector(".mini-type") &&
            !location.href.includes("blackboard/topic_list") &&
            !location.href.includes("blackboard/x/act_list")) ||
            /festival/.test(location.href)) ?
            API.addElement("div", { class: "z-top-container" }, undefined, undefined, true) :
            API.addElement("div", { class: "z-top-container has-menu" }, undefined, undefined, true);
        API.addElement("script", { type: "text/javascript", src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js" });
    });
    API.runWhile(() => document.querySelector(".international-footer"), () => {
        var _a;
        if (API.path.name)
            return;
        document.querySelector(".international-footer").remove();
        (!((_a = window.\$) === null || _a === void 0 ? void 0 : _a.ajax)) && API.addElement("script", { type: "text/javascript", src: "//static.hdslb.com/js/jquery.min.js" }, undefined, undefined, true);
        API.addElement("div", { class: "footer bili-footer report-wrap-module", id: "home_footer" });
        API.addElement("script", { type: "text/javascript", src: "//static.hdslb.com/common/js/footer.js" });
    });
    API.runWhile(() => document.querySelector("#bili-header-m"), () => {
        var _a;
        (_a = document.querySelector("#internationalHeader")) === null || _a === void 0 ? void 0 : _a.remove();
        API.addCss(API.getModule("avatarAnimation.css"));
    });

//# sourceURL=API://@Bilibili-Old/do/section.js`;
/*!***********************!*/
/**/modules["segProgress.js"] = /*** ./dist/do/segProgress.js ***/
`"use strict";
    class SegProgress {
        constructor(resp) {
            if (!resp.data.view_points || resp.data.view_points.length == 0)
                return;
            this.init(resp.data.view_points);
        }
        async init(view_points) {
            if (!SegProgress.cssInited) {
                SegProgress.cssInited = true;
                API.addCss(\`
                            .bilibili-progress-segmentation-logo{display:inline-block;position:absolute;top:-12px;height:30px;width:1px; transition: opacity .1s}
                            .bilibili-progress-segmentation-logo>img{position: absolute;top:-14px;transform:translate(-50%,-50%) scale(0.7);left:50%;transition:top 0.1s}
                            .bilibili-progress-segmentation-logo>svg{position: absolute;top: -19px;width: 32px;height: 36px;transform: translate(-50%, -50%)}
                            .bilibili-player.mode-widescreen .bilibili-progress-segmentation-logo>img,
                            .bilibili-player.mode-webfullscreen .bilibili-progress-segmentation-logo>img,
                            .bilibili-player.mode-fullscreen .bilibili-progress-segmentation-logo>img{top:-18px;left:50%;transform:translate(-50%,-50%) scale(1)}
                            .bilibili-progress-segmentation{height:29px;position:absolute;top:-12px}
                            .bilibili-progress-segmentation:hover > div > div{border-color:#fb7299;border-style:solid;border-width:0 2px;width:100%;height:3px;top:6px;left:-2px;position:relative;background:#fb7299}
                            .bilibili-progress-segmentation > div{box-sizing:border-box;border-style:solid;border-color:#fb7299;border-left-width:2px;position:absolute;width:100%;height:6px;top:12px}
                            .bilibili-progress-detail-chapter{top:-96px;position:absolute;width:100%;font-size:17px;font-weight:bold;color:#fff;text-shadow:0 0 5px #000}
                            .bilibili-progress-segmentation:last-child > div{border-right-width:2px}
                            .bilibili-player-filter-chapter:hover{color:#00a1d6}
                            .bilibili-player-chapterList{position:relative;height:100%;width:100%;overflow:auto}
                            .bilibili-player-chapterList::-webkit-scrollbar{width:6px}
                            .bilibili-player-chapterList::-webkit-scrollbar-track{border-radius:4px;background-color:#fff}
                            .bilibili-player-chapterList::-webkit-scrollbar-thumb{border-radius:4px;background-color:#fff}
                            .bilibili-player-chapterList:hover::-webkit-scrollbar-track{background-color:#edf2f9}
                            .bilibili-player-chapterList:hover::-webkit-scrollbar-thumb{background-color:#a2a2a2}
                            .bilibili-player-chapter-info{width:100%;height:72px;margin-top:5px;white-space:normal;font-size:14px;position:relative;cursor:pointer}
                            .bilibili-player-chapter-info > img{position:absolute;left:15px;top:4px;border-radius:2px}
                            .bilibili-player-chapter-info > p{padding-top:5px;margin:0 5px 5px 138px;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;height:43px}
                            .bilibili-player-chapter-info:hover > p{color:#00a1d6}
                            .bilibili-player-chapter-info > span{color:#99a2aa}
                            .bilibili-player-chapter-info.active{background-color:#f3f3f3}\`);
            }
            let sliderTracker = document.querySelector(".bilibili-player-video-progress .bpui-slider-tracker"); // 播放进度区域，6px
            let sliderBar = document.getElementsByClassName("bilibili-player-video-progress-bar")[0];
            let handleWidth = document.getElementsByClassName("bpui-slider-handle")[0].clientWidth; // 进度条圆形把手的宽度
            let trackerWrp = document.getElementsByClassName("bpui-slider-tracker-wrp")[0]; // 进度条可控区域，28px
            let videoDuration = window.player.getDuration(); // 视频总时长
            // 创建显示在视频预览缩略图上方的看点标题
            let chptName = document.createElement("div");
            chptName.className = "bilibili-progress-detail-chapter";
            document.querySelector(".bilibili-player-video-progress-detail").appendChild(chptName);
            // 添加分段进度条
            let type = view_points[0].type; // type = 1：赛事看点，type = 2：视频分段
            let segDivs = []; // 存放所有分段Div
            for (let v of view_points) {
                let seg = document.createElement("div");
                if (type == "1") {
                    seg.className = "bilibili-progress-segmentation-logo";
                    let title = document.createElement("div"); // 看点标题
                    title.innerHTML = "-> " + v.content;
                    title.className = "bilibili-progress-detail-chapter";
                    title.style.cssText = "width: auto; transform: translateX(-50%); display: none";
                    let img;
                    if (v.logoUrl) {
                        img = document.createElement("img"); // 看点图标
                        img.id = "segmentation-logo";
                        img.width = 32;
                        img.height = 36;
                        img.src = v.logoUrl;
                    }
                    else {
                        img = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        img.setAttribute("viewBox", "0 -3 32 36");
                        img.innerHTML = \`
                    <defs>
                    <radialGradient id="gradient">
                            <stop offset="10%" stop-color="#ffe78f"></stop>
                            <stop offset="40%" stop-color="#ffe996"></stop>
                            <stop offset="95%" stop-color="#fcecae"></stop>
                        </radialGradient>
                    </defs>
                    <path style="fill: rgb(252, 236, 174); stroke: rgb(252, 236, 174);" d="M 16 32.097 C 13.312 32.106 10.608 30.145 11 25.897 C 11.265 22.744 16 17.097 16 17.097 C 16 17.097 20.822 22.697 21.022 25.897 C 21.322 30.097 18.801 32.088 16 32.097 Z" transform="matrix(-1, 0, 0, -1, 32.021761, 49.196602)"></path>
                    <circle cx="16" cy="22" r="5" fill="url(#gradient)"/>\`;
                    }
                    img.addEventListener("mousemove", e => e.stopPropagation());
                    img.addEventListener("mouseenter", () => {
                        title.style.display = "";
                        img.style.zIndex = "1000";
                    });
                    img.addEventListener("mouseleave", () => {
                        title.style.display = "none";
                        img.style.zIndex = "";
                    });
                    img.addEventListener("click", () => window.player.seek(v.from));
                    seg.appendChild(title);
                    seg.appendChild(img);
                }
                else if (type == "2") {
                    seg.className = "bilibili-progress-segmentation";
                    let duration = view_points[view_points.length - 1].to;
                    let ratio = videoDuration / duration / duration;
                    seg.style.width = (v.to - v.from) * ratio * 100 + "%";
                    seg.style.left = v.from * ratio * 100 + "%";
                    seg.innerHTML = "<div><div></div></div>";
                    seg.onmouseenter = () => chptName.innerHTML = v.content;
                }
                segDivs.push(seg);
                sliderTracker.appendChild(seg);
            }
            if (type == "1") {
                API.addCss(\`#app #bilibiliPlayer .bilibili-player-video-progress-detail > .bilibili-player-video-progress-detail-img {top:-120px}
                            .bilibili-player-video-progress-detail > .bilibili-player-video-progress-detail-time {top:-48px}\`);
                function update() {
                    for (let i = 0; i < segDivs.length; i++) {
                        // 进度条上的鼠标坐标与视频时间点的互算公式，从bilibiliPlayer.js复制过来
                        // 使视频看点标记与点击进度条后实际跳转的时间点准确对应
                        segDivs[i].style.left = view_points[i].to / videoDuration * (trackerWrp.clientWidth - handleWidth) + handleWidth / 2 + "px";
                    }
                }
                setTimeout(() => update(), 500); // 等待进度条完全加载
                chptName.style.top = "-150px";
                let playerArea = document.getElementsByClassName("bilibili-player-area")[0], visibility = true;
                function hide() {
                    if (!visibility)
                        return;
                    visibility = false;
                    for (let i = 0; i < segDivs.length; i++)
                        segDivs[i].style.opacity = "0";
                    setTimeout(() => {
                        for (let i = 0; i < segDivs.length; i++)
                            segDivs[i].style.visibility = "hidden";
                    }, 100);
                }
                playerArea.addEventListener("mouseleave", e => {
                    hide();
                });
                playerArea.addEventListener("mousemove", e => {
                    let clientRect = playerArea.getBoundingClientRect();
                    if (e.pageY < clientRect.top + window.scrollY + clientRect.height * 0.65) {
                        hide();
                    }
                    else {
                        visibility = true;
                        for (let i = 0; i < segDivs.length; i++) {
                            segDivs[i].style.visibility = "";
                            segDivs[i].style.opacity = "1";
                        }
                    }
                });
                // 鼠标与看点图标的交互
                trackerWrp.addEventListener("mousemove", e => {
                    let closestPoint = 1e6;
                    // 鼠标位置->视频时间点
                    let box = sliderBar.getBoundingClientRect();
                    let pos = (e.pageX - (box.left + window.scrollX - document.body.clientLeft) - handleWidth / 2) / (trackerWrp.clientWidth - handleWidth) * videoDuration;
                    0 > pos && (pos = 0);
                    pos > videoDuration && (pos = videoDuration);
                    let thumbnailArea = 80 / (trackerWrp.clientWidth - handleWidth) * videoDuration;
                    let hitArea = trackerWrp.clientWidth > 400 ? thumbnailArea / 10 : thumbnailArea / 20; // 显示标题的鼠标坐标范围
                    for (let i = 0; i < view_points.length; i++) {
                        segDivs[i].style.zIndex = "";
                        if (view_points[i].to >= pos - hitArea && view_points[i].to <= pos + hitArea && Math.abs(view_points[i].to - pos) < closestPoint) {
                            chptName.innerHTML = view_points[i].content;
                            closestPoint = Math.abs(view_points[i].to - pos);
                            segDivs[i].style.zIndex = "1000";
                        }
                    }
                    if (closestPoint == 1e6)
                        chptName.innerHTML = "";
                });
                window.player.addEventListener("video_player_resize", () => update());
                trackerWrp.addEventListener("mouseleave", () => {
                    for (let i = 0; i < segDivs.length; i++) {
                        segDivs[i].className = "bilibili-progress-segmentation-logo";
                    }
                });
            }
            // 添加“视频看点”面板
            let wrapList = document.querySelector("div.bilibili-player-wraplist"); // 获取播放器右侧面板的容器div
            let panels = wrapList.children;
            let chptInfo = null; // 数组，存放每一看点的UI卡片
            let chptPanel = document.createElement("div"); // “视频看点”面板
            chptPanel.style.display = "none";
            chptPanel.className = "bilibili-player-filter-wrap bilibili-player-chapterList";
            wrapList.appendChild(chptPanel);
            let chptBtn = document.createElement("div"); // “视频看点”按钮
            chptBtn.className = "bilibili-player-filter-btn bilibili-player-filter-chapter bpui-component bpui-button bpui-button-type-small button";
            chptBtn.innerHTML = '<span class="bpui-button-text"><span>视频看点</span></span>';
            document.querySelector("div.bilibili-player-filter").appendChild(chptBtn);
            // 用当前播放进度刷新面板
            function refreshState() {
                if (!chptInfo)
                    return;
                let progress = window.player.getCurrentTime();
                for (let i = 0, v; i < view_points.length; i++) {
                    v = view_points[i];
                    if (progress < v.to) {
                        let active = document.querySelector(".bilibili-player-chapter-info.active");
                        active && active.classList.remove("active");
                        chptInfo[i].classList.add("active");
                        break;
                    }
                }
            }
            let timeFormat = (t) => t < 10 ? "0" + t : t;
            chptBtn.onclick = () => {
                let activePanel = document.querySelector("div.bilibili-player-filter-btn.active");
                if (activePanel == chptBtn)
                    return;
                // 切换按钮的激活状态
                activePanel.classList.remove("active");
                chptBtn.classList.add("active");
                for (let i = 0; i < panels.length; i++) {
                    const element = panels[i];
                    if (element.style.display == "block") {
                        element.style.display = "none";
                        break;
                    }
                }
                // 创建各个看点对应的UI卡片
                if (!chptInfo) {
                    chptInfo = [];
                    for (let i = 0, v; i < view_points.length; i++) {
                        v = view_points[i];
                        let dura = v.to - v.from;
                        let div = document.createElement("div");
                        div.className = "bilibili-player-chapter-info";
                        div.innerHTML = \`<img width="112" height="63" src="\${v.imgUrl}"/>
                                        <p class="chapter-name">\${v.content}</p>
                                        <span style="margin-left: 138px">\${timeFormat(Math.floor(v.from / 60))}:\${timeFormat(v.from % 60)}</span>
                                        <span style="margin-right: 5px; float: right;">\${dura >= 60 ? \`\${Math.floor(dura / 60)}分\` : ""}\${dura > 0 ? \`\${dura % 60}秒\` : ""}</span>\`;
                        div.onclick = (jumpto => () => {
                            window.player.seek(jumpto);
                            let active = document.querySelector(".bilibili-player-chapter-info.active");
                            active && active.classList.remove("active");
                            div.classList.add("active");
                        })(v.from);
                        chptInfo[i] = div;
                        chptPanel.appendChild(div);
                    }
                }
                ;
                chptPanel.style.display = "block";
                // 将当前的播放进度对应的UI卡片显示为灰色底色
                refreshState();
            };
            window.player.addEventListener("video_media_seeked", refreshState);
            chptPanel.onmouseenter = refreshState;
            class timer {
                static start() { if (!timer.handle)
                    timer.handle = setInterval(refreshState, 3000); }
                static stop() { if (timer.handle) {
                    clearInterval(timer.handle);
                    timer.handle = null;
                } }
            }
            window.player.addEventListener("video_media_playing", timer.start);
            window.player.addEventListener("video_media_pause", timer.stop);
            if (window.player.getState() == "PLAYING")
                timer.start();
        }
    }
    SegProgress.cssInited = false;
    API.SegProgress = SegProgress;

//# sourceURL=API://@Bilibili-Old/do/segProgress.js`;
/*!***********************!*/
/**/modules["user-select.js"] = /*** ./dist/do/user-select.js ***/
`"use strict";
    API.addCss(\`* {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }\`);
    [].forEach.call(['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'], function (event) {
        document.addEventListener(event, function (e) {
            e.stopPropagation();
        }, true);
    });

//# sourceURL=API://@Bilibili-Old/do/user-select.js`;
/*!***********************!*/
/**/modules["videoLimit.js"] = /*** ./dist/do/videoLimit.js ***/
`"use strict";
    class HookTimeOut {
        constructor() {
            this.hook = setTimeout;
            window.setTimeout = (...args) => {
                if (args[1] && args[1] == 1500 && args[0] && args[0].toString() == "function(){f.cz()}") {
                    API.toast.warning("禁用播放器强制初始化！", ...args);
                    return Number.MIN_VALUE;
                }
                return this.hook.call(window, ...args);
            };
        }
        relese() {
            window.setTimeout = this.hook;
        }
    }
    API.xhrhook('season/user/status?', args => {
        args[1] = args[1].replace('bangumi.bilibili.com/view/web_api/season/user/status', 'api.bilibili.com/pgc/view/web/season/user/status');
    }, obj => {
        const response = obj.responseType === "json" ? obj.response : JSON.parse(obj.response);
        if (response) {
            if (response.result.area_limit) {
                response.result.area_limit = 0; // 解除区域限制标记
                response.ban_area_show = 1; // 伪造访问许可
                API.limit = true;
            }
            // 处理两个接口属性名差异
            if (response.result.progress)
                response.result.watch_progress = response.result.progress;
            if (response.result.vip_info)
                response.result.vipInfo = response.result.vip_info;
            obj.response = obj.responseType === "json" ? response : JSON.stringify(response);
            obj.responseText = JSON.stringify(response);
        }
    }, false);
    API.xhrhookasync("/playurl?", args => {
        var _a, _b;
        return API.limit || (API.pgc && ((_b = (_a = API.__INITIAL_STATE__) === null || _a === void 0 ? void 0 : _a.rightsInfo) === null || _b === void 0 ? void 0 : _b.watch_platform)); // 判定是否限制视频
    }, async (args, type) => {
        var _a, _b, _c, _d, _e, _f;
        let response; // 初始化返回值
        let obj = API.Format.urlObj(args[1]); // 提取请求参数
        const hookTimeout = new HookTimeOut(); // 过滤播放器请求延时代码
        const accesskey = GM.getValue("access_key", "") || undefined;
        if (API.globalLimit) { // 处理泰区视频
            const server = API.config.limitServer || "https://api.global.bilibili.com";
            try {
                API.toast.info("尝试解除泰区限制... 访问代理服务器");
                response = API.jsonCheck(await API.xhr.GM({
                    url: API.Format.objUrl(\`\${server}/intl/gateway/v2/ogv/playurl\`, { aid: obj.avid || API.aid, ep_id: obj.ep_id, download: "1" })
                }));
                response = await new API.RebuildPlayerurl().ogvPlayurl(response);
                response = { "code": 0, "message": "success", "result": response };
                API.__playinfo__ = response;
                API.toast.success(\`解除泰区限制！aid=\${API.aid}, cid=\${API.cid}\`);
            }
            catch (e) {
                API.toast.error("videoLimit.js", e);
                response = { "code": -404, "message": e, "data": null };
            }
        }
        else if (API.limit) { // 处理区域限制
            obj.access_key = accesskey; // 鉴权
            obj.module = (((_b = (_a = API.__INITIAL_STATE__) === null || _a === void 0 ? void 0 : _a.upInfo) === null || _b === void 0 ? void 0 : _b.mid) == 1988098633 || ((_d = (_c = API.__INITIAL_STATE__) === null || _c === void 0 ? void 0 : _c.upInfo) === null || _d === void 0 ? void 0 : _d.mid) == 2042149112) ? "movie" : "bangumi"; // 支持影视区投稿
            obj.fnval && (obj.fnval = API.fnval); // 提升dash标记清晰度
            try {
                API.toast.info("尝试解除区域限制... 访问代理服务器");
                response = API.jsonCheck(await API.xhr.GM({
                    url: API.Format.objUrl("https://www.biliplus.com/BPplayurl.php", obj)
                }));
                response = await new API.RebuildPlayerurl().appPlayurl(response);
                response = { "code": 0, "message": "success", "result": response };
                API.__playinfo__ = response;
                API.toast.success(\`解除区域限制！aid=\${API.aid}, cid=\${API.cid}\`);
            }
            catch (e) {
                API.toast.error("videoLimit.js", e);
                response = { "code": -404, "message": e, "data": null };
            }
        }
        else if (API.pgc && ((_f = (_e = API.__INITIAL_STATE__) === null || _e === void 0 ? void 0 : _e.rightsInfo) === null || _f === void 0 ? void 0 : _f.watch_platform)) { // APP专属限制
            obj.access_key = accesskey;
            obj.fnval = null;
            obj.fnver = null;
            obj.platform = "android_i";
            try {
                API.toast.info("尝试解除APP限制... 使用移动端flv接口");
                response = API.jsonCheck(await API.xhr.GM({
                    url: API.urlsign("https://api.bilibili.com/pgc/player/api/playurl", obj, 1)
                }));
                response = { "code": 0, "message": "success", "result": response };
                API.__playinfo__ = response;
                API.toast.success(\`解除APP限制！aid=\${API.aid}, cid=\${API.cid}\`);
            }
            catch (e) {
                API.toast.error("videoLimit.js", e);
                response = { "code": -404, "message": e, "data": null };
            }
        }
        hookTimeout.relese();
        return type === "json" ? { response } : {
            response: JSON.stringify(response),
            responseText: JSON.stringify(response)
        };
    }, false);

//# sourceURL=API://@Bilibili-Old/do/videoLimit.js`;
/*!***********************!*/
/**/modules["aria2.js"] = /*** ./dist/download/aria2.js ***/
`"use strict";
    class Aria2 {
        constructor() {
            this.setting = {};
            API.config.useragent && (this.setting.userAgent = API.config.useragent);
            API.config.referer && (this.setting.referer = API.config.referer);
            API.config.filepath && (this.setting.directory = API.config.filepath);
            API.config.rpcToken && (this.setting.token = API.config.rpcToken);
        }
        /**
         * 生成aria2命令行参数并赋值到剪切板
         * @param obj 下载配置数据
         */
        shell(obj) {
            return new Promise((r, j) => {
                let result = "aria2c";
                obj = { ...this.setting, ...obj };
                obj.urls.forEach(d => result += \` "\${d}"\`);
                obj.out && (result += \` --out="\${obj.out}"\`);
                obj.userAgent && (result += \` --user-agent="\${obj.userAgent}"\`);
                obj.referer && (result += \` --referer="\${obj.referer}"\`);
                obj.directory && (result += \` --dir="\${obj.directory}"\`);
                obj.split && (result += \` --split="\${obj.split}"\`);
                obj.header && Object.entries(obj.header).forEach(d => result += \` --header="\${d[0]}: \${d[1]}"\`);
                navigator.clipboard.writeText(result).then(r, e => j(e));
            });
        }
        /**
         * 以rpc方式发送aria2下载数据
         * @param obj 下载配置数据
         */
        rpc(obj) {
            obj = { ...this.setting, ...obj };
            const options = {};
            obj.out && (options.out = obj.out);
            obj.userAgent && (options["user-agent"] = obj.userAgent);
            obj.referer && (options["referer"] = obj.referer);
            obj.directory && (options["dir"] = obj.directory);
            obj.split && (options["split"] = obj.split);
            obj.header && (options["header"] = obj.header);
            return this.postMessage("aria2.addUri", obj.id || new Date().getTime(), [obj.urls, options]);
        }
        /**
         * rpc发送接口
         * @param method 请求类型
         * @param id 请求唯一标志
         * @param params 请求参数
         * @returns Promise托管的请求结果
         */
        postMessage(method, id, params = []) {
            const url = \`\${API.config.rpcServer}:\${API.config.rpcPort}/jsonrpc\`;
            API.config.rpcToken && params.unshift(\`token:\${API.config.rpcToken}\`);
            return new Promise((r, j) => {
                API.xhr({
                    url: url,
                    method: "POST",
                    responseType: "json",
                    data: JSON.stringify({ method, id, params })
                }).then(d => {
                    d.error && j(d.error);
                    d.result && r(d.result);
                }).catch(e => {
                    API.xhr({
                        url: API.Format.objUrl(url, { method, id, params: API.Base64.encode(JSON.stringify(params)) }),
                        method: "GET",
                        responseType: "json"
                    }).then(d => {
                        d.error && j(d.error);
                        d.result && r(d.result);
                    }).catch(() => j(e));
                });
            });
        }
        /**
         * 查询aria2版本，用于测试aria2 rpc链接情况
         * @returns Promise托管的aria2版本信息
         */
        getVersion() {
            return this.postMessage("aria2.getVersion", new Date().getTime());
        }
    }
    /**
     * aria2工具
     */
    API.aria2 = new Aria2();

//# sourceURL=API://@Bilibili-Old/download/aria2.js`;
/*!***********************!*/
/**/modules["download.js"] = /*** ./dist/download/download.js ***/
`"use strict";
    class Download {
        constructor() {
            /** 下载面板 */
            this.table = API.addElement("div");
            /** 已获取类型列表 */
            this.type = [];
            /** 整理出的链接列表 */
            this.links = [];
            /** url序号对应的质量信息  */
            this.quality = {
                100029: '4K',
                100028: '1080P60',
                100027: '1080P+',
                100026: '1080P',
                100024: '720P',
                100023: '480P',
                100022: '360P',
                30280: "320Kbps",
                30260: "320Kbps",
                30259: "128Kbps",
                30257: "64Kbps",
                30255: "AUDIO",
                30250: "ATMOS",
                30232: "128Kbps",
                30216: "64Kbps",
                30127: "8K",
                30126: "Dolby",
                30125: "HDR",
                30121: "4K",
                30120: "4K",
                30116: '1080P60',
                30112: '1080P+',
                30106: '1080P60',
                30102: '1080P+',
                30080: '1080P',
                30077: '1080P',
                30076: '720P',
                30074: '720P',
                30066: '720P',
                30064: '720P',
                30048: "720P",
                30033: '480P',
                30032: '480P',
                30016: '360P',
                30015: '360P',
                30011: '360P',
                464: '预览',
                336: "1080P",
                320: "720P",
                288: "480P",
                272: "360P",
                208: "1080P",
                192: "720P",
                160: "480P",
                127: "8K",
                126: "Dolby",
                125: "HDR",
                120: "4K",
                116: "1080P60",
                112: "1080P+",
                80: "1080P",
                74: "720P60",
                64: "720P",
                48: "720P",
                32: "480P",
                16: "360P",
                15: "360P"
            };
            /** 视频编码信息对应的id，可能不完整 */
            this.codec = {
                hev: [30127, 30126, 30125, 30121, 30106, 30102, 30077, 30066, 30033, 30011],
                avc: [30120, 30112, 30080, 30064, 30032, 30016],
                av1: [100029, 100028, 100027, 100026, 100024, 100023, 100022]
            };
            /** 颜色表 */
            this.color = {
                "8K": "background-color: #ffe42b;background-image: linear-gradient(to right, #ffe42b, #dfb200);",
                "Dolby": "background-color: #ffe42b;background-image: linear-gradient(to right, #ffe42b, #dfb200);",
                "ATMOS": "background-color: #ffe42b;background-image: linear-gradient(to right, #ffe42b, #dfb200);",
                "AUDIO": "background-color: #ffe42b;background-image: linear-gradient(to right, #ffe42b, #dfb200);",
                "HDR": "background-color: #ffe42b;background-image: linear-gradient(to right, #ffe42b, #dfb200);",
                "4K": "background-color: #c0f;background-image: linear-gradient(to right, #c0f, #90f);",
                "1080P60": "background-color: #c0f;background-image: linear-gradient(to right, #c0f, #90f);",
                "1080P+": "background-color: #f00;background-image: linear-gradient(to right, #f00, #c00);",
                "1080P": "background-color: #f00;background-image: linear-gradient(to right, #f00, #c00);",
                "720P60": "background-color: #f90;background-image: linear-gradient(to right, #f90, #d70);",
                "720P": "background-color: #f90;background-image: linear-gradient(to right, #f90, #d70);",
                "480P": "background-color: #00d;background-image: linear-gradient(to right, #00d, #00a);",
                "360P": "background-color: #0d0;",
                "mp4": "background-color: #e0e;",
                "av1": "background-color: #feb;",
                "avc": "background-color: #07e;",
                "hev": "background-color: #7ba;",
                "aac": "background-color: #07e;",
                "flv": "background-color: #0dd;",
                "320Kbps": "background-color: #f00;background-image: linear-gradient(to right, #f00, #c00);",
                "128Kbps": "background-color: #f90;background-image: linear-gradient(to right, #f90, #d70);",
                "64Kbps": "background-color: #0d0;"
            };
            API.switchVideo(() => { this.type = []; this.links = []; this.table && this.table.remove(); }); // 切P后清除下载数据并移除下载面板
        }
        /**
         * 整理playurl返回值并提取其中的媒体链接记录到links
         * @param playinfo ajax返回的JSON数据
         */
        decodePlayinfo(playinfo) {
            playinfo.data && this.decodePlayinfo(playinfo.data); // data型
            playinfo.result && this.decodePlayinfo(playinfo.result); // result型
            playinfo.durl && this.durl(playinfo.durl); // 顶层durl型
            playinfo.dash && this.dash(playinfo.dash); // 顶层dash型
        }
        /**
         * 根据url确定画质/音质信息
         * 需要维护quality表
         * @param url 多媒体url
         * @param id 媒体流id
         * @returns 画质/音质信息
         */
        getQuality(url, id) {
            return this.quality[this.getID(url)] || (id && this.quality[id]) || "N/A";
        }
        /**
         * 从url中提取可能的id
         * @param url 多媒体url
         */
        getID(url) {
            return Number(/[0-9]+\\.((flv)|(mp4)|(m4s))/.exec(url)[0].split(".")[0]);
        }
        /**
         * 整理dash部分
         * @param dash dash信息
         */
        dash(dash) {
            dash.video && this.dashVideo(dash.video, dash.duration); // dash视频部分
            dash.audio && this.dashAudio(dash.audio, dash.duration); // dash音频部分
            dash.dolby && dash.dolby.audio && Array.isArray(dash.dolby.audio) && this.dashATMOS(dash.dolby.audio, dash.duration); // 杜比音效部分
        }
        /**
         * 整理dash视频部分
         * @param video dash视频信息
         * @param duration duration信息，配合bandwidth能计算出文件大小
         */
        dashVideo(video, duration) {
            video.forEach(d => {
                const url = d.baseUrl || d.base_url;
                let type = "";
                if (!url)
                    return;
                if (d.codecs) {
                    type = d.codecs.includes("avc") ? "avc" : d.codecs.includes("av01") ? "av1" : "hev"; // 编码类型
                }
                else {
                    const id = this.getID(url);
                    type = this.codec.hev.find(d => d === id) ? "hev" : "avc";
                }
                !this.type.includes("dash") && this.type.push("dash");
                this.links.push({
                    type: type,
                    url: url,
                    quality: this.getQuality(url, d.id),
                    size: API.Format.sizeFormat(d.bandwidth * duration / 8),
                    backupUrl: d.backupUrl || d.backup_url
                });
            });
        }
        /**
         * 整理dash音频部分
         * @param audio dash音频信息
         * @param duration duration信息，配合bandwidth能计算出文件大小
         */
        dashAudio(audio, duration) {
            audio.forEach(d => {
                const url = d.baseUrl || d.base_url;
                url && this.links.push({
                    type: "aac",
                    url: url,
                    quality: this.getQuality(url, d.id),
                    size: API.Format.sizeFormat(d.bandwidth * duration / 8),
                    backupUrl: d.backupUrl || d.backup_url
                });
            });
        }
        /**
         * 整理dash杜比全景声部分
         * @param audio 杜比全景声信息
         * @param duration duration信息，配合bandwidth能计算出文件大小
         */
        dashATMOS(audio, duration) {
            audio.forEach(d => {
                const url = d.baseUrl || d.base_url;
                url && this.links.push({
                    type: "aac",
                    url: url,
                    quality: this.getQuality(url, d.id),
                    size: API.Format.sizeFormat(d.bandwidth * duration / 8),
                    backupUrl: d.backupUrl || d.backup_url
                });
            });
        }
        /**
         * 整理durl部分
         * @param durl durl信息
         */
        durl(durl) {
            let index = 0; // flv分段标记
            durl.forEach(d => {
                const link = {
                    type: "",
                    url: d.url,
                    quality: this.getQuality(d.url, d.id),
                    size: API.Format.sizeFormat(d.size),
                    backupUrl: d.backupUrl || d.backup_url
                };
                switch (d.url.includes("mp4?")) {
                    case true:
                        link.type = "mp4";
                        !this.type.includes("mp4") && this.type.push("mp4");
                        break;
                    case false:
                        link.type = "flv";
                        index++;
                        link.flvSplit = index;
                        !this.type.includes("flv") && this.type.push("flv");
                        break;
                }
                this.links.push(link);
            });
        }
        /**
         * 右键下载响应
         */
        async contentMenu() {
            if (API.aid && API.cid) {
                if (!this.links[0]) {
                    !API.config.TVresource && API.__playinfo__ && this.decodePlayinfo(API.__playinfo__); // tv源无法从播放器里读取
                    const result = await Promise.all(API.config.downloadList.reduce((s, d) => {
                        !this.type.includes(d) && s.push(this.getContent(d));
                        return s;
                    }, []));
                    result.forEach(d => d && this.decodePlayinfo(d));
                    await this.getOther(); // 其他下载
                }
                const title = this.getTitle();
                this.links.forEach(d => {
                    !d.filename && (d.filename = title);
                });
                this.showTable();
            }
        }
        /**
         * 添加视频之外的下载数据
         */
        async getOther() {
            var _a;
            if (!API.config.ifDlDmCC)
                return;
            if (API.danmaku.danmaku) {
                const url = API.config.dlDmType == "json" ? JSON.stringify(API.danmaku.danmaku, undefined, "\\t") : API.danmaku.toXml(API.danmaku.danmaku);
                this.links.push({
                    url: url,
                    type: "其他",
                    quality: "弹幕",
                    size: API.Format.sizeFormat(API.strSize(url)),
                    filename: \`\${this.getTitle()}-\${API.cid}.\${API.config.dlDmType}\`
                });
            }
            if (API.closedCaption.subtitle) {
                API.closedCaption.subtitle.forEach(d => {
                    this.links.push({
                        url: !d.subtitle_url.includes(":") ? d.subtitle_url.replace("//", "https://") : d.subtitle_url,
                        type: "其他",
                        quality: d.lan_doc,
                        size: "N/A"
                    });
                });
            }
            const data = await API.getAidInfo(API.aid);
            data && ((_a = data === null || data === void 0 ? void 0 : data.View) === null || _a === void 0 ? void 0 : _a.pic) && this.links.push({
                url: data.View.pic,
                type: "其他",
                quality: "封面",
                size: "N/A",
                amylose: true
            });
        }
        /**
         * 封装请求链接
         * 用于过滤Promise.all请求错误
         * @param d 请求类型
         * @returns 请求结果
         */
        async getContent(d) {
            let result;
            try {
                switch (d) {
                    case "dash":
                        result = API.pgc ?
                            await API.url.getJson(API.config.TVresource ? "api.bilibili.com/pgc/player/api/playurltv" : "api.bilibili.com/pgc/player/web/playurl", { avid: API.aid, cid: API.cid, fnver: 0, fnval: API.fnval }, true) :
                            await API.url.getJson(API.config.TVresource ? "api.bilibili.com/x/tv/ugc/playurl" : "api.bilibili.com/x/player/playurl", { avid: API.aid, cid: API.cid, fnver: 0, fnval: API.fnval }, true);
                        break;
                    case "flv":
                        result = API.pgc ?
                            await API.url.getJson(API.config.TVresource ? "api.bilibili.com/pgc/player/api/playurltv" : "api.bilibili.com/pgc/player/web/playurl", { avid: API.aid, cid: API.cid, qn: API.config.downloadQn }, true) :
                            await API.url.getJson(API.config.TVresource ? "api.bilibili.com/x/tv/ugc/playurl" : "api.bilibili.com/x/player/playurl", { avid: API.aid, cid: API.cid, qn: API.config.downloadQn }, true);
                        break;
                    case "mp4":
                        result = API.pgc ?
                            await API.url.getJson("api.bilibili.com/pgc/player/api/playurlproj", { cid: API.cid }, true) :
                            await API.url.getJson("app.bilibili.com/v2/playurlproj", { cid: API.cid }, true);
                        break;
                }
            }
            catch (e) { }
            return result;
        }
        /**
         * 呼出下载面板
         */
        showTable() {
            if (!this.links[0])
                return API.toast.warning("未获取到任何下载数据！");
            this.table && this.table.remove(); // 移除已存在的下载面板
            this.table = API.addElement("div");
            const real = this.table.attachShadow({ mode: "closed" });
            const root = API.addElement("div", { class: "table" }, real);
            const cells = {};
            new API.ClickRemove(this.table); // 点击外部移除
            API.addCss(API.getCss("download.css"), undefined, real);
            this.links.forEach(d => {
                const cell = cells[d.type] || API.addElement("div", { class: "cell" }, root);
                if (!cells[d.type]) {
                    cells[d.type] = cell;
                    const div = API.addElement("div", { class: "type" }, cell, d.type);
                    this.color[d.type] && div.setAttribute("style", this.color[d.type]);
                }
                const item = API.addElement("a", { class: "item", target: "_blank" }, cell);
                const up = API.addElement("div", { class: "up" }, item, d.quality + (d.flvSplit ? "x" + d.flvSplit : ""));
                this.color[d.quality] && up.setAttribute("style", this.color[d.quality]);
                API.addElement("div", { class: "down" }, item, d.size);
                d.amylose ? item.href = d.url : (item.onclick = () => {
                    /^https?:\\/\\/([\\w-]+\\.)+[\\w-]+(\\/[\\w-,.\\/?%&=]*)?/.test(d.url) ?
                        this.postData(d) :
                        API.saveAs(d.url, d.filename || \`download \${API.Format.timeFormat(undefined, true)}.txt\`, d.contentType || "text/plain"); // 文本类型
                });
            });
        }
        /**
         * 点击下载按钮回调
         * @param data 被点击的下载数据
         */
        postData(data) {
            !Reflect.has(data, "_name") && (data.filename = this.setFinalName(data));
            switch (API.config.downloadMethod) {
                case "ef2":
                    API.ef2.sendLinkToIDM({ url: data.url, out: data.filename });
                    break;
                case "aria2":
                    API.aria2.shell({ urls: [data.url], out: data.filename })
                        .then(() => API.toast.success(\`已复制aria2命令行到剪切板，在cmd等shell中使用即可下载~\`))
                        .catch(e => API.toast.error(\`复制aria2命令行失败！\`, e));
                    break;
                case "aira2 RPC":
                    API.aria2.rpc({ urls: [data.url], out: data.filename })
                        .then(GID => API.toast.success(\`已添加下载任务到aria2 RPC主机，任务GID：\${GID}\`))
                        .catch(e => API.toast.error(\`添加下载任务到aria2 RPC主机出错！\`, e));
                    break;
                default: (API.config.TVresource && (data.type === "flv" || data.type === "avc" || data.type === "hev" || data.type === "av1" || data.type === "aac")) ? API.toast.warning("TV源视频流不支持本方式下载，请在设置中另选下载方式或关闭请求TV源！") : this.rightKey(data);
            }
        }
        /**
         * 获取当前视频标题
         * @returns 标题
         */
        getTitle() {
            const title = document.title.split("_哔哩")[0];
            const p = location.href.includes("p=") ? location.href.match(/p=\\d+/)[0].split("=")[1] : "";
            return p ? title + p : title;
        }
        /**
         * 从URL中提取可能的文件名和拓展名
         * @param url
         * @returns [文件名，拓展名]
         */
        getUrlFileName(url) {
            url = url.split("?")[0];
            const arr = url.split("/");
            return arr[arr.length - 1].split(".");
        }
        /**
         * 合成最终文件名
         * @param obj.url 下载url，从中提取可能的文件名，优先级最低
         * @param obj.type 下载资源类型，用于决定后缀名，优先级次之
         * @param obj.filename 预设定文件名，优先级最高
         * @returns 文件名
         */
        setFinalName(obj) {
            let adv = "";
            let arr = this.getUrlFileName(obj.url);
            let ars = obj.filename.split(".");
            switch (obj.type) {
                case "mp4":
                    adv = ".mp4";
                    break;
                case "flv":
                    adv = ".flv";
                    break;
                case "aac":
                    adv = ".m4a";
                    break;
                case "avc":
                    adv = ".avc.m4v";
                    break;
                case "hev":
                    adv = ".hevc.m4v";
                    break;
            }
            adv = ars[1] ? \`.\${ars.pop()}\` : adv ? adv : arr[1] ? \`.\${arr.pop()}\` : "";
            Reflect.set(obj, "_name", true);
            return (obj.filename || arr[0]) + \`\${obj.flvSplit ? "x" + obj.flvSplit : ""}.\${obj.quality}\${adv}\`;
        }
        /**
         * 右键下载
         * @param data 下载数据
         */
        rightKey(data) {
            const root = API.ElementComponent.popupbox({ width: "300px" });
            API.addElement("div", { style: "text-align: center;font-weight: bold;padding-block-end: 10px;" }, root, data.filename);
            API.addElement("div", { style: "padding-block-end: 10px;" }, root, \`<a href=\${data.url} target="_blank" download="\${data.filename}">请在此处右键“另存为”以保存文件，IDM的话也可以右键“使用 IDM下载链接”。</a>\`);
            API.addElement("div", { style: "font-size: 10px; padding-block-end: 10px;" }, root, '本方式下载不太稳定，不嫌麻烦的话可在设置中更换下载方式。');
        }
    }
    const _ = new Download();
    /**
     * 拉起下载面板
     */
    function download() { _.contentMenu(); }
    API.download = download;

//# sourceURL=API://@Bilibili-Old/download/download.js`;
/*!***********************!*/
/**/modules["ef2.js"] = /*** ./dist/download/ef2.js ***/
`"use strict";
    class Ef2 {
        constructor() {
            this.setting = {};
            API.config.useragent && (this.setting.userAgent = API.config.useragent);
            API.config.referer && (this.setting.referer = API.config.referer);
            API.config.filepath && (this.setting.directory = API.config.filepath);
            API.config.IDMLater && (this.setting.sendToList = API.config.IDMLater);
            API.config.IDMToast && (this.setting.toastDisabled = API.config.IDMToast);
        }
        /**
         * 发送下载数据到IDM
         * @param data 配置IDM
         */
        sendLinkToIDM(data) {
            data = { ...this.setting, ...data };
            const a = document.createElement("a");
            a.href = this.encode(data);
            a.click();
        }
        /**
         * 编码ef2协议
         * @param data 配置数据
         * @returns ef2协议
         */
        encode(data) {
            let result = "";
            Object.keys(data).forEach(d => {
                switch (d) {
                    case "cookies":
                        result += \` -c "\${data.cookies}"\`;
                        break;
                    case "directory":
                        data.directory = data.directory.replace(/\\//, "\\\\"); // 目录反斜杠可能误输入为了正斜杠
                        data.directory && data.directory[data.directory.length - 1] == "\\\\" && (data.directory = data.directory.substr(0, data.directory.length - 1)); // 目录最后的反斜杠可能导致引号被转义 
                        result += \` -o "\${data.directory}"\`;
                        break;
                    case "out":
                        result += \` -s "\${data.out}"\`;
                        break;
                    case "password":
                        result += \` -P "\${data.password}"\`;
                        break;
                    case "postDate":
                        result += \` -d "\${data.postDate}"\`;
                        break;
                    case "referer":
                        result += \` -r "\${data.referer}"\`;
                        break;
                    case "sendToList":
                        result += \` -q\`;
                        break;
                    case "toastDisabled":
                        result += \` -f\`;
                        break;
                    case "url":
                        data.url.startsWith("//") && (data.url = "https:" + data.url); // 省略协议头时默认添加http/tls头
                        result += \` -u "\${data.url}"\`;
                        break;
                    case "userAgent":
                        result += \` -a "\${data.userAgent}"\`;
                        break;
                    case "userName":
                        result += \` -U "\${data.userName}"\`;
                        break;
                }
            });
            result && result.startsWith(" ") && (result = result.substr(1, result.length));
            return "ef2://" + API.Base64.encode(result);
        }
        /**
         * 解码ef2链接为
         * @param ef2ptl
         * @returns ef2配置信息
         */
        decode(ef2ptl) {
            ef2ptl = ef2ptl.replace("ef2://", "");
            ef2ptl = API.Base64.decode(ef2ptl) + " ";
            const key = ef2ptl.match(/-\\w /g);
            const value = ef2ptl.split(/-\\w /);
            value.shift();
            return Array.from(key).reduce((s, d, i) => {
                value[i] && value[i].endsWith(" ") && (value[i] = value[i].substr(0, value[i].length - 1));
                value[i] && value[i].endsWith("\\"") && (value[i] = value[i].substr(1, value[i].length - 2));
                switch (d) {
                    case "-c ":
                        s.cookies = value[i];
                        break;
                    case "-o ":
                        s.directory = value[i];
                        break;
                    case "-s ":
                        s.out = value[i];
                        break;
                    case "-P ":
                        s.password = value[i];
                        break;
                    case "-d ":
                        s.postDate = value[i];
                        break;
                    case "-r ":
                        s.referer = value[i];
                        break;
                    case "-q ":
                        s.sendToList = true;
                        break;
                    case "-f ":
                        s.toastDisabled = true;
                        break;
                    case "-u ":
                        s.url = value[i];
                        break;
                    case "-a ":
                        s.userAgent = value[i];
                        break;
                    case "-U ":
                        s.userName = value[i];
                        break;
                }
                return s;
            }, {});
        }
    }
    /**
     * ef2工具
     */
    API.ef2 = new Ef2();

//# sourceURL=API://@Bilibili-Old/download/ef2.js`;
/*!***********************!*/
/**/modules["rightKey.js"] = /*** ./dist/download/rightKey.js ***/
`"use strict";
    API.switchVideo(() => {
        var _a, _b;
        try {
            const li = document.createElement("li");
            li.innerHTML = '<a id="BOLD-dl-content" class="context-menu-a js-action" href="javascript:void(0);">下载视频</a>';
            li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onmouseover = () => li.setAttribute("class", "context-line context-menu-function bili-old-download hover");
            li.onmouseout = () => li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onclick = () => API.download();
            let flag = 0;
            (_a = document.querySelector("#bilibiliPlayer")) === null || _a === void 0 ? void 0 : _a.addEventListener("DOMNodeInserted", e => {
                if (!flag && e.target.className && /context-line context-menu-function/.test(e.target.className)) {
                    const node = document.querySelector(".bilibili-player-context-menu-container.black");
                    node && (flag = setTimeout(() => {
                        if (node.querySelector(".context-menu-danmaku"))
                            return;
                        if (node.querySelector("#BOLD-dl-content"))
                            return;
                        if (node.contains(li))
                            return;
                        node.firstChild.appendChild(li);
                    }, 100));
                }
            });
            (_b = document.querySelector("#bilibiliPlayer")) === null || _b === void 0 ? void 0 : _b.addEventListener("DOMNodeRemoved", e => {
                if (flag && e.target.className && /context-line context-menu-function/.test(e.target.className)) {
                    flag = 0;
                    try {
                        li.remove();
                    }
                    catch (_a) { }
                    ;
                }
            });
        }
        catch (e) {
            API.toast.error("dlContentMenu.js", e);
        }
    });

//# sourceURL=API://@Bilibili-Old/download/rightKey.js`;
/*!***********************!*/
/**/modules["Node.js"] = /*** ./dist/hook/Node.js ***/
`"use strict";
    const appendChild = Node.prototype.appendChild;
    const insertBefore = Node.prototype.insertBefore;
    const jsonp = [];
    Node.prototype.appendChild = function (newChild) {
        newChild.nodeName == 'SCRIPT' && newChild.src && (jsonp.forEach(d => {
            d[0].every(d => newChild.src.includes(d)) && d[1].call(newChild);
        }));
        return appendChild.call(this, newChild);
    };
    Node.prototype.insertBefore = function (newChild, refChild) {
        newChild.nodeName == 'SCRIPT' && newChild.src && (jsonp.forEach(d => {
            d[0].every(d => newChild.src.includes(d)) && d[1].call(newChild);
        }));
        return insertBefore.call(this, newChild, refChild);
    };
    /**
     * 注册拦截修改jsonp请求，本方法必须传入同步返回的回调函数，要使用异步回调请考虑左转\`jsonphookasync\`。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param redirect 重定向url的回调函数，将原url作为第一个参数传递，必须同步返回重定向后的url。
     * @param modifyResponse 修改jsonp返回值的回调函数，将原返回值(一般为json格式)作为第一个参数传递，必须同步返回修改后的返回值。
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递\`false\`，然后自行在不再需要拦截后使用\`removeJsonphook\`注销。
     * @returns 注册编号，\`once=false\`时才有用，可用于取消拦截。
     */
    function jsonphook(url, redirect, modifyResponse, once = true) {
        let id;
        const one = Array.isArray(url) ? url : [url];
        const two = function () {
            once && id && delete jsonp[id - 1];
            if (redirect)
                try {
                    this.src = redirect(this.src) || this.src;
                }
                catch (e) {
                    API.debug.error("redirect of jsonphook", one, e);
                }
            if (modifyResponse) {
                const obj = API.Format.urlObj(this.src);
                const callback = obj.callback;
                const call = window[callback];
                if (call) {
                    window[callback] = function (v) {
                        try {
                            v = modifyResponse(v) || v;
                        }
                        catch (e) {
                            API.debug.error("modifyResponse of jsonphook", one, e);
                        }
                        return call(v);
                    };
                }
            }
        };
        return id = jsonp.push([one, two]);
    }
    API.jsonphook = jsonphook;
    /**
     * \`jsonphook\`的异步版本，可以用异步方法获取到的返回值替换jsonp请求的返回值。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param condition 二次判定**同步**回调函数，不提供或者返回真值时开始拦截，可以通过url等精确判定是否真要拦截。
     * @param modifyResponse 修改jsonp返回值的回调函数，将原url作为第一个参数传递，请将要设定的jsonp返回值返回，格式一般都是json。
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递\`false\`，然后自行在不再需要拦截后使用\`removeJsonphook\`注销。
     * @returns 注册编号，\`once=false\`时才有用，可用于取消拦截。
     */
    function jsonphookasync(url, condition, modifyResponse, once = true) {
        let id;
        const one = Array.isArray(url) ? url : [url];
        const two = function () {
            try {
                once && id && delete jsonp[id - 1];
                if (!condition || condition(this.src)) {
                    const obj = API.Format.urlObj(this.src);
                    const callback = obj.callback;
                    const call = window[callback];
                    if (call) {
                        modifyResponse && modifyResponse(this.src).then(d => {
                            window[callback](d);
                            this.dispatchEvent(new ProgressEvent("load"));
                        }).catch(e => {
                            this.dispatchEvent(new ProgressEvent("error"));
                            API.debug.error("modifyResponse of xhrhookasync", one, e);
                        });
                    }
                    this.removeAttribute("src");
                }
            }
            catch (e) {
                API.debug.error("jsonphook", one, e);
            }
        };
        return id = jsonp.push([one, two]);
    }
    API.jsonphookasync = jsonphookasync;
    /**
     * 禁止脚本注入运行。
     * @param url 要禁止运行的脚本src匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     */
    function scriptBlock(url) {
        const one = Array.isArray(url) ? url : [url];
        const two = function () {
            try {
                this.removeAttribute("src");
                setTimeout(() => this.dispatchEvent(new ProgressEvent("load")), 100);
            }
            catch (e) {
                API.debug.error("脚本拦截失败！", one, e);
            }
        };
        jsonp.push([one, two]);
    }
    API.scriptBlock = scriptBlock;
    /**
     * 注册拦截脚本注入，本方法只能拦截通过\`appendChild\`等方法传入页面的脚本。
     * 若要解除拦截，可通过\`removeJsonphook\`取消拦截，参数为本方法返回的id。
     * @param url 需要拦截的脚本的src匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param redirect 替换src的回调函数，将原src作为第一个参数，必须同步返回重定向的src。
     * @param text 要以内联脚本形式替换的回调函数，将原src作为第一个参数，必须同步返回替换的代码文本。本参数的存在将导致\`redirect\`被忽略。
     * @returns 注册编号，可用于取消拦截。
     */
    function scriptIntercept(url, redirect, text) {
        const one = Array.isArray(url) ? url : [url];
        const two = function () {
            try {
                if (text) {
                    this.text = text(this.src);
                    this.removeAttribute("src");
                    setTimeout(() => {
                        this.dispatchEvent(new ProgressEvent("load"));
                        this === null || this === void 0 ? void 0 : this.remove();
                    }, 100);
                }
                else if (redirect) {
                    this.src = redirect(this.src);
                }
            }
            catch (e) {
                API.debug.error("scriptIntercept", one, e);
            }
        };
        return jsonp.push([one, two]);
    }
    API.scriptIntercept = scriptIntercept;
    /**
     * 取消jsonphook或脚本拦截，只在注册时设置了\`once=false\`时才需要使用本方法！
     * @param id 要取消注册的id，该值为注册时返回值，一个id只允许使用一次！
     */
    function removeJsonphook(id) {
        id >= 0 && delete jsonp[id - 1];
    }
    API.removeJsonphook = removeJsonphook;

//# sourceURL=API://@Bilibili-Old/hook/Node.js`;
/*!***********************!*/
/**/modules["open.js"] = /*** ./dist/hook/open.js ***/
`"use strict";
    const rules = [];
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...rest) {
        const args = [...rest];
        args[1] && rules.forEach(d => {
            d && d[0].every(d => args[1].includes(d)) && d[1].call(this, args);
        });
        return open.call(this, ...args);
    };
    /**
     * 注册拦截修改xhr，本方法必须传入同步返回的回调函数，要使用异步回调请考虑左转\`xhrhookasync\`。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param modifyOpen 修改XMLHttpRequest.open参数的回调函数，第一个参数为数组，包含原xhr的open方法传递的所有参数，其中索引2位置上就是原url。
     * @param modifyResponse 修改XMLHttpRequest返回值的回调函数，第一个参数为一个对象，可能包含response、responseType、responseText、responseXML中的一种或多种原始数据，可以在其基础上进行修改并赋值回去，**注意每种返回值的格式！**
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递\`false\`，然后自行在不再需要拦截后使用\`removeXhrhook\`注销。
     * @returns 注册编号，\`once=false\`时才有用，可用于取消拦截。
     */
    function xhrhook(url, modifyOpen, modifyResponse, once = true) {
        let id;
        const one = Array.isArray(url) ? url : [url];
        const two = function (args) {
            once && id && delete rules[id - 1];
            if (modifyOpen)
                try {
                    modifyOpen(args);
                }
                catch (e) {
                    API.debug.error("modifyOpen of xhrhook", one, e);
                }
            if (modifyResponse)
                try {
                    this.addEventListener("readystatechange", () => {
                        try {
                            if (this.readyState === 4) {
                                const response = { response: this.response, responseType: this.responseType };
                                (this.responseType === "" || this.responseType === "text") && (response.responseText = this.responseText);
                                (this.responseType === "" || this.responseType === "document") && (response.responseXML = this.responseXML);
                                modifyResponse(response);
                                Object.defineProperty(this, "response", { configurable: true, value: response.response });
                                response.responseText && Object.defineProperty(this, "responseText", { configurable: true, value: response.responseText });
                                response.responseXML && Object.defineProperty(this, "responseXML", { configurable: true, value: response.responseXML });
                            }
                        }
                        catch (e) {
                            API.debug.error("modifyResponse of xhrhook", one, e);
                        }
                    });
                }
                catch (e) {
                    API.debug.error("modifyResponse of xhrhook", one, e);
                }
        };
        return id = rules.push([one, two]);
    }
    API.xhrhook = xhrhook;
    /**
     * \`xhrhook\`的异步版本，可以用异步方法获取到的返回值替换xhr请求返回值。
     * 本方法或阻断原xhr请求，您可以在\`condition\`根据url等信息进一步判定是否真的需要拦截。
     * 注意部分xhr请求可能有额外的超时判定，所以\`modifyResponse\`修改未必会生效。
     * @param url 需要拦截的xhr的url匹配关键词或词组，词组间是并的关系，即必须同时满足才会触发拦截回调。
     * @param condition 二次判定**同步**回调函数，不提供或者返回真值时开始拦截，可以通过url等精确判定是否真要拦截。
     * @param modifyResponse 提供XMLHttpRequest返回值的回调函数，第一个参数为数组，包含原xhr的open方法传递的所有参数，其中索引2位置上就是原url。请以XMLHttpRequestResponses格式提供返回值，第二个参数为responseType类型，你可以据此确定需要哪些返回值，**注意每种返回值的格式！**
     * @param once 为节约性能开销，默认只拦截符合条件的xhr**一次**后便会注销，如果要多次拦截，请传递\`false\`，然后自行在不再需要拦截后使用\`removeXhrhook\`注销。
     * @returns 注册编号，\`once=false\`时才有用，可用于取消拦截。
     */
    function xhrhookasync(url, condition, modifyResponse, once = true) {
        let id, temp;
        const one = Array.isArray(url) ? url : [url];
        const two = function (args) {
            try {
                if (!condition || condition(args)) {
                    id && (temp = rules[id - 1]); // 临时移除同条件URL的hook，避免代理中使用了同url造成死循环
                    delete rules[id - 1];
                    this.send = () => true; // 禁用XMLHttpRequest.send
                    (!args[2] || args[2] === true) && (this.timeout = 0); // 禁用超时
                    const et = setInterval(() => { this.dispatchEvent(new ProgressEvent("progress")); }, 50);
                    Object.defineProperty(this, "status", { configurable: true, value: 200 });
                    Object.defineProperty(this, "readyState", { configurable: true, value: 2 });
                    this.dispatchEvent(new ProgressEvent("readystatechange"));
                    modifyResponse && modifyResponse(args, this.responseType).then(d => {
                        clearInterval(et);
                        if (d) {
                            Object.defineProperty(this, "response", { configurable: true, value: d.response });
                            d.responseType && Object.defineProperty(this, "responseType", { configurable: true, value: d.responseType });
                            d.responseText && Object.defineProperty(this, "responseText", { configurable: true, value: d.responseText });
                            d.responseXML && Object.defineProperty(this, "responseXML", { configurable: true, value: d.responseXML });
                            !this.responseURL && Object.defineProperty(this, "responseURL", { configurable: true, value: args[1] });
                            Object.defineProperty(this, "readyState", { configurable: true, value: 4 });
                            this.dispatchEvent(new ProgressEvent("readystatechange"));
                            this.dispatchEvent(new ProgressEvent("load"));
                            this.dispatchEvent(new ProgressEvent("loadend"));
                        }
                    }).catch(e => {
                        this.dispatchEvent(new ProgressEvent("error"));
                        API.debug.error("modifyResponse of xhrhookasync", one, e);
                    }).finally(() => {
                        clearInterval(et);
                        !once && (id = rules.push(temp)); // 恢复多次监听
                    });
                    clearInterval(et);
                }
            }
            catch (e) {
                API.debug.error("condition of xhrhook", one, e);
            }
        };
        return id = rules.push([one, two]);
    }
    API.xhrhookasync = xhrhookasync;
    /**
     * 注销xhrhook以节约开销，只在注册时设置了\`once=false\`时才需要使用本方法！
     * @param id \`xhrhook\`注册时的返回值，一个id只允许使用一次！
     */
    function removeXhrhook(id) { id >= 0 && delete rules[id - 1]; }
    API.removeXhrhook = removeXhrhook;

//# sourceURL=API://@Bilibili-Old/hook/open.js`;
/*!***********************!*/
/**/modules["webSocket.js"] = /*** ./dist/hook/webSocket.js ***/
`"use strict";
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
            };
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
                    4 === b.qg ? viewer.setInt32(b.offset, b.value) : 2 === b.qg && viewer.setInt16(b.offset, b.value);
                });
                return mergeArrayBuffer(headerBuf, bodyBuf);
            };
            wsHookRunOnce = false;
            initLiveChat();
        }
        wssend.call(this, ...arg);
    };
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
        let wsBinaryHeaderList = [{ "name": "Header Length", "key": "headerLen", "bytes": 2, "offset": 4, "value": 18 }, { "name": "Protocol Version", "key": "ver", "bytes": 2, "offset": 6, "value": 1 }, { "name": "Operation", "key": "op", "bytes": 4, "offset": 8, "value": 7 }, { "name": "Sequence Id", "key": "seq", "bytes": 4, "offset": 12, "value": 2 }, { "name": "Compress", "key": "compress", "bytes": 1, "offset": 16, "value": 0 }, { "name": "ContentType", "key": "contentType", "bytes": 1, "offset": 17, "value": 0 }];
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
        };
        liveChat.onopen = function () {
            let body = {
                "room_id": "video://" + API.aid + "/" + API.cid,
                "platform": "web",
                "accepts": [1000, 1015]
            };
            return this.send(this.convertToArrayBuffer(body, 7));
        };
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
            }
            catch (i) {
                console.error("WebSocket Error : ", i);
            }
            return this;
        };
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
                    "seq" === i.key && ++i.value) : 2 === i.bytes ? viewer.setInt16(i.offset, i.value) : 1 === i.bytes && viewer.setInt8(i.offset, i.value);
            }));
            return mergeArrayBuffer(headerBuf, bodyBuf);
        };
        // jsc-player > i.prototype.convertToObject
        // convertToArrayBuffer对应的解码函数
        liveChat.convertToObject = function (i) {
            var e = new DataView(i), t = {};
            t.packetLen = e.getInt32(Pl.WS_PACKAGE_OFFSET);
            wsBinaryHeaderList.forEach((function (i) {
                4 === i.bytes ? t[i.key] = e.getInt32(i.offset) : 2 === i.bytes ? t[i.key] = e.getInt16(i.offset) : 1 === i.bytes && (t[i.key] = e.getInt8(i.offset));
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
                    }
                    catch (e) {
                        l = decoder.decode(i.slice(a + n, a + r));
                        console.error("decode body error:", new Uint8Array(i), t);
                    }
                }
            }
            return t;
        };
        // jsc-player > i.prototype.parseDanmaku
        liveChat.parseDanmaku = function (i, e, t, a) {
            for (var r, n = [], l = t; l < i.byteLength; l += a) {
                a = e.getInt32(l);
                r = e.getInt16(l + Pl.WS_HEADER_OFFSET);
                try {
                    n.push(JSON.parse(decoder.decode(i.slice(l + r, l + a))));
                }
                catch (e) {
                    n.push(decoder.decode(i.slice(l + r, l + a)));
                    console.error("decode body error:", new Uint8Array(i));
                }
            }
            return n;
        };
    }

//# sourceURL=API://@Bilibili-Old/hook/webSocket.js`;
/*!***********************!*/
/**/modules["worker.js"] = /*** ./dist/hook/worker.js ***/
`"use strict";
    let workerPostMsg = Worker.prototype.postMessage;
    let list_so;
    Worker.prototype.postMessage = function (aMessage, transferList) {
        if (aMessage.url && aMessage.url.includes("list.so")) {
            list_so = this;
            let triggerOnMsg = (danmaku, loadTime, parseTime) => list_so.onmessage({
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
            let loadDanmaku = (loadTime) => API.danmaku.getSegDanmaku().then((Segments) => {
                // 旧播放器需要得到耗时数据(网络请求，数据处理)
                loadTime = new Date() - loadTime;
                let parseTime = new Date();
                let danmaku = API.danmaku.danmakuFormat(Segments);
                parseTime = new Date() - parseTime;
                triggerOnMsg(danmaku, loadTime, parseTime);
                API.danmaku.danmaku = danmaku;
            });
            if (XMLHttpRequest.prototype.pakku_send === undefined) {
                loadDanmaku(new Date());
            }
            else {
                // 让pakku.js载入弹幕
                let url = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + API.cid + "&pid=" + API.aid + "&segment_index=1";
                API.xhr({ url: url, responseType: "arraybuffer", credentials: true }).then((response) => {
                    let Segments = API.danmaku.segDmDecode(response);
                    // pakku.js处于“休眠中”时，不会修改响应数据，这时的response仅仅是第一个分段的弹幕数据
                    // 这种情况下需要主动去加载全部的分段(loadDanmaku)
                    let i = 1;
                    for (; i < Segments.length; i++) {
                        // pakku.js处理过的弹幕，在出现时间上按升序排列，可以用这个特征加以区别是否应该载入完整的弹幕
                        if (Segments[i - 1].progress > Segments[i].progress)
                            break;
                    }
                    if (i != Segments.length)
                        loadDanmaku(new Date());
                    else {
                        triggerOnMsg(API.danmaku.danmakuFormat(Segments), "(pakku.js)", "(pakku.js)");
                    }
                });
            }
        }
        else {
            workerPostMsg.call(this, aMessage, transferList);
        }
    };

//# sourceURL=API://@Bilibili-Old/hook/worker.js`;
/*!***********************!*/
/**/modules["allDanmaku.js"] = /*** ./dist/include/allDanmaku.js ***/
`"use strict";
    class AllDanmaku {
        constructor(callback) {
            this.danmaku = [];
            this.callback = callback;
            API.toast("正在尝试获取全部弹幕请耐心等待。。。", "冷却延时请尽量调大，以免短时间内大量请求被临时封端口！");
            this.pubdate = new Date(2009, 0);
            if (API.__INITIAL_STATE__) {
                if (API.__INITIAL_STATE__.videoData && API.__INITIAL_STATE__.videoData.pubdate) {
                    this.pubdate = new Date(1E3 * API.__INITIAL_STATE__.videoData.pubdate);
                }
                else if (API.__INITIAL_STATE__.epInfo && API.__INITIAL_STATE__.epInfo.pub_real_time) {
                    this.pubdate = new Date(API.__INITIAL_STATE__.epInfo.pub_real_time);
                }
            }
            else {
                let time = document.querySelector("div.tm-info.tminfo > time");
                time && (this.pubdate = new Date(time.innerHTML));
            }
            this.pubdate = API.Format.timeFormat(this.pubdate, true).split(" ")[0]; // 视频上传日期
            this.today = API.Format.timeFormat(undefined, true).split(" ")[0]; // 当天日期
            this.time = this.today;
            this.arrP = this.pubdate.split("-");
            this.danmaku = [];
            this.init();
        }
        /**
         * 按日期拉取弹幕
         * @returns 调用月份判断
         */
        async init() {
            if (!API.uid)
                return API.toast.warning("本功能需要登录！");
            if (!this.pubdate)
                return API.toast.warning("投稿日期获取失败！无法获取全部弹幕！");
            try {
                // 获取当日日期
                this.arrT = this.time.split("-");
                // 如果年份小于投稿日，说明获取成功
                if (this.arrT[0] < this.arrP[0])
                    return this.done(1);
                // 年份相等但月份小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1])
                    return this.done(1);
                // 年月都相等，但日期小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2])
                    return this.done(1);
                // 日期未早于投稿日，正常请求日期数据
                API.toast("正在获取 " + this.time + " 日的弹幕。。。");
                let danmaku = await API.danmaku.getHistoryDanmaku(this.time);
                API.danmaku.sortDmById(danmaku, "idStr");
                danmaku.reverse();
                // 取最早一条弹幕的时间
                this.time = API.Format.timeFormat(danmaku[danmaku.length - 1].ctime * 1000, true).split(" ")[0];
                this.danmaku = this.danmaku.concat(danmaku);
                API.toast("数据返回！已获取弹幕数：" + API.Format.unitFormat(this.danmaku.length));
                this.arrT = this.time.split("-");
                // 如果当天不是投稿日，转入日期检查
                if (this.pubdate != this.today)
                    return this.check();
                // 否则结束弹幕获取，当前弹幕就是能获取到的全弹幕
                this.done(1);
            }
            catch (e) {
                API.toast.error("全弹幕装填", e);
                // 弹幕获取出错，载入已获取的弹幕
                if (this.danmaku[0]) {
                    API.toast.warning("弹幕获取出错！", "保留并载入已获取的弹幕");
                    this.done();
                }
                else {
                    this.callback && this.callback();
                    API.toast.error("弹幕获取出错！", "已退出！");
                }
            }
        }
        /**
         * 按月份判断有弹幕时间
         * @returns 调用获取日期弹幕或者循环月份判断
         */
        async check() {
            try {
                // 如果年份小于投稿日，说明获取成功
                if (this.arrT[0] < this.arrP[0])
                    return this.done(1);
                // 年份相等但月份小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1])
                    return this.done(1);
                // 年月都相等，但日期小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2])
                    return this.done(1);
                // 日期未早于投稿日，正常请求月份数据
                let data = await API.xhr({
                    url: API.Format.objUrl("https://api.bilibili.com/x/v2/dm/history/index", {
                        type: 1,
                        oid: API.cid,
                        month: this.arrT.slice(0, 2).join("-")
                    }),
                    credentials: true
                });
                data = API.jsonCheck(data).data;
                if (data && data[0]) {
                    // 当月有弹幕，进入日期判断
                    for (let i = data.length - 1; i >= 0; i--) {
                        let date = data[i].split("-");
                        if (date[2] < this.arrT[2]) {
                            // 当日在已获取弹幕之前，记录并跳出循环
                            this.timeT = data[i];
                            break;
                        }
                    }
                    if (this.timeT) {
                        // 延时转入日期请求
                        this.time = this.timeT;
                        this.timeT = undefined;
                        API.toast(\`技能冷却中。。。请稍待 \${API.config.allDanmakuDelay} 秒钟\`);
                        return setTimeout(() => this.init(), API.config.allDanmakuDelay * 1000);
                    }
                    else {
                        // 当月有弹幕但都不在已请求日之前，月份 -1 重载
                        if (this.arrT[1] > 1) {
                            this.arrT[1]--;
                            this.arrT[1] = (Array(2).join('0') + this.arrT[1]).slice(-2);
                        }
                        else
                            this.arrT = [this.arrT[0] - 1, 12, 31];
                        API.toast(\`获取前一个月数据 \${this.arrT.slice(0, 2).join("-")} 请稍待 \${API.config.allDanmakuDelay} 秒钟\`);
                        return setTimeout(() => this.check(), API.config.allDanmakuDelay * 1000);
                    }
                }
                else {
                    // 当月无弹幕直接月份 -1 重载，月份等于 1 则取上年最后一天
                    if (this.arrT[1] > 1) {
                        this.arrT[1]--;
                        if (this.arrT[1] < 10)
                            this.arrT[1] = (Array(2).join('0') + this.arrT[1]).slice(-2);
                    }
                    else
                        this.arrT = [this.arrT[0] - 1, 12, 31];
                    API.toast(\`获取前一个月数据 \${this.arrT.slice(0, 2).join("-")} 请稍待 \${API.config.allDanmakuDelay} 秒钟\`);
                    return setTimeout(() => this.check(), API.config.allDanmakuDelay * 1000);
                }
            }
            catch (e) {
                e = Array.isArray(e) ? e : [e];
                API.toast.error("全弹幕装填", e);
                // 弹幕获取出错，载入已获取的弹幕
                if (this.danmaku[0]) {
                    API.toast.warning("弹幕获取出错！", "保留并载入已获取的弹幕");
                    this.done();
                }
                else {
                    this.callback && this.callback();
                    API.toast.error("弹幕获取出错！", "已退出！");
                }
            }
        }
        /**
         * 载入弹幕
         * @param boolean 判断获取成功还是失败，成功请传入真值。
         */
        async done(boolean) {
            var _a;
            try {
                // 历史弹幕里不包含代码弹幕必须额外处理
                API.toast("正在获取BAS/代码弹幕专包。。。");
                this.danmaku = this.danmaku.concat(await API.danmaku.getSegDanmaku(undefined, undefined, true));
                API.toast("数据返回！正在整合。。。");
            }
            catch (e) { }
            let danmaku = API.danmaku.danmakuFormat(this.danmaku, API.aid);
            if (boolean)
                API.toast.success("全弹幕获取成功，正在装填。。。", "总弹幕量：" + API.Format.unitFormat(this.danmaku.length), "同时推送至下载面板，可右键保存 π_π");
            (_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku(danmaku);
            API.danmaku.danmaku = danmaku;
            this.callback && this.callback();
        }
    }
    API.AllDanmaku = AllDanmaku;

//# sourceURL=API://@Bilibili-Old/include/allDanmaku.js`;
/*!***********************!*/
/**/modules["config.js"] = /*** ./dist/include/config.js ***/
`"use strict";
    /** 设置接口，包含\`value\`值的设置项可以key: value格式获取 */
    API.config = new Proxy(GM.getValue("config", {}), {
        // 修改设置立即存储
        set: (t, p, v) => {
            Reflect.set(t, p, v);
            GM.setValue("config", t);
            return true;
        }
    });
    /** 设置分类栈 */
    const MENU = {};
    /** 设置栈 */
    const SETTING = [];
    /**
     * 注册设置项
     * @param obj 设置项
     */
    function registerSetting(obj) {
        SETTING.push(obj);
        modifyConfig(obj);
    }
    API.registerSetting = registerSetting;
    /**
     * 初始化默认值
     * @param obj 设置项
     */
    function modifyConfig(obj) {
        try {
            Reflect.has(obj, "value") && !Reflect.has(API.config, Reflect.get(obj, "key")) && (Reflect.set(API.config, Reflect.get(obj, "key"), Reflect.get(obj, "value")));
            obj.type == "sort" && obj.list && obj.list.forEach(d => { modifyConfig(d); });
        }
        catch (e) {
            API.debug.warn(\`UI设置项注册错误！\`, obj);
        }
    }
    /**
     * 注册设置分类
     * @param obj 设置分类
     */
    function registerMenu(obj) {
        MENU[obj.key] = obj;
    }
    API.registerMenu = registerMenu;
    /**
     * 显示/隐藏设置项
     * @param mode 设置项主键: 是否隐藏
     */
    function changeSettingMode(mode) {
        const keys = Object.keys(mode);
        SETTING.forEach(d => {
            Reflect.has(d, "key") && keys.includes(Reflect.get(d, "key")) && (d.hidden = mode[Reflect.get(d, "key")]);
        });
    }
    API.changeSettingMode = changeSettingMode;
    registerMenu({ key: "common", name: "通用", svg: '<svg viewBox="0 0 24 24"><g><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></g></svg>' });
    registerMenu({ key: "rewrite", name: "重构", svg: \`<svg viewBox="0 0 24 24"><g><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></g></svg>\` });
    registerMenu({ key: "danmaku", name: "弹幕", svg: \`<svg viewBox="0 0 22 22"><path d="M16.5 8c1.289 0 2.49.375 3.5 1.022V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h7.022A6.5 6.5 0 0116.5 8zM7 13H5a1 1 0 010-2h2a1 1 0 010 2zm2-4H5a1 1 0 010-2h4a1 1 0 010 2z"></path><path d="M20.587 13.696l-.787-.131a3.503 3.503 0 00-.593-1.051l.301-.804a.46.46 0 00-.21-.56l-1.005-.581a.52.52 0 00-.656.113l-.499.607a3.53 3.53 0 00-1.276 0l-.499-.607a.52.52 0 00-.656-.113l-1.005.581a.46.46 0 00-.21.56l.301.804c-.254.31-.456.665-.593 1.051l-.787.131a.48.48 0 00-.413.465v1.209a.48.48 0 00.413.465l.811.135c.144.382.353.733.614 1.038l-.292.78a.46.46 0 00.21.56l1.005.581a.52.52 0 00.656-.113l.515-.626a3.549 3.549 0 001.136 0l.515.626a.52.52 0 00.656.113l1.005-.581a.46.46 0 00.21-.56l-.292-.78c.261-.305.47-.656.614-1.038l.811-.135A.48.48 0 0021 15.37v-1.209a.48.48 0 00-.413-.465zM16.5 16.057a1.29 1.29 0 11.002-2.582 1.29 1.29 0 01-.002 2.582z"></path></svg>\` });
    registerMenu({ key: "restore", name: "修复", svg: \`<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>\` });
    registerMenu({ key: "player", name: "播放", svg: \`<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z"></path></svg>\` });
    registerMenu({ key: "style", name: "样式", svg: \`<svg viewBox="0 0 24 24"><g><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g></svg>\` });
    registerMenu({ key: "live", name: "直播", svg: \`<svg viewBox="0 0 1024 1024"><path d="M392.448 275.911111a92.416 92.416 0 1 1-184.832 0 92.416 92.416 0 0 1 184.832 0"></path><path d="M826.624 464.583111l-63.744 36.864v-48.64a72.206222 72.206222 0 0 0-71.68-71.936H190.72a72.192 72.192 0 0 0-71.936 71.936V748.231111a71.936 71.936 0 0 0 71.936 71.936H691.2a71.936 71.936 0 0 0 71.936-71.936v-23.808l63.488 37.888a51.2 51.2 0 0 0 76.8-44.544V508.871111a51.2 51.2 0 0 0-76.8-44.288M572.928 369.351111c79.459556 0.142222 143.985778-64.156444 144.128-143.616 0.142222-79.459556-64.156444-143.985778-143.616-144.128-79.260444-0.142222-143.701333 63.857778-144.128 143.104-0.426667 79.459556 63.644444 144.213333 143.104 144.64h0.512"></path><path d="M425.216 512.967111l124.16 71.936a25.6 25.6 0 0 1 0 42.496l-124.16 71.68a25.6 25.6 0 0 1-37.12-21.248V534.471111a25.6 25.6 0 0 1 37.12-21.504"></path></svg>\` });
    registerMenu({ key: "download", name: "下载", svg: \`<svg viewBox="0 0 24 24"><g><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g></svg>\` });
    registerSetting({
        key: "developer",
        sort: "common",
        label: "开发者模式",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g></svg>',
        type: "switch",
        value: false,
        float: \`启用开发者模式，暴露顶层命名空间API到全局以便于调试。\`,
        sub: "暴露API到window",
        action: v => {
            v ? (!window.API && (window.API = API)) : (window.API && Reflect.deleteProperty(window, "API"));
        }
    });
    API.config.developer && (window.API = API); // 开发者模式
    window.top === window.self && API.importModule("ui.js", { MENU, SETTING }); // 绘制设置UI

//# sourceURL=API://@Bilibili-Old/include/config.js`;
/*!***********************!*/
/**/modules["cookie.js"] = /*** ./dist/include/cookie.js ***/
`"use strict";
    /**
     * 获取cookie对象
     * @returns 名称: 值
     */
    function getCookies() {
        return document.cookie.split('; ').reduce((s, d) => {
            let key = d.split('=')[0];
            let val = d.split('=')[1];
            s[key] = unescape(val);
            return s;
        }, {});
    }
    API.getCookies = getCookies;
    /**
     * 添加cookie
     * @param name 名称
     * @param value 值
     * @param days 有效期：/天
     */
    function setCookie(name, value, days = 365) {
        const exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toUTCString() + '; path=/; domain=.bilibili.com';
    }
    API.setCookie = setCookie;

//# sourceURL=API://@Bilibili-Old/include/cookie.js`;
/*!***********************!*/
/**/modules["danmaku.js"] = /*** ./dist/include/danmaku.js ***/
`"use strict";
    class Danmaku {
        constructor() {
            this.danmaku = [];
            new Function(GM.getResourceText("protobuf.js"))(); // protobufjs引擎
            Danmaku.root = window.protobuf.Root.fromJSON(API.getModule("protobuf.json"));
            Danmaku.protoSeg = Danmaku.root.lookupType('bilibili.DmSegMobileReply');
            Danmaku.protoView = Danmaku.root.lookupType('bilibili.DmWebViewReply');
        }
        /**
         * 生成xml形式的弹幕
         * @param danmaku protoSeg.decode(new Uint8Array(this.response)).elems
         * @returns 委托对象，表示生成的xml形式的弹幕字符串
         */
        toXml(danmaku) {
            let DM = Reflect.has(danmaku[0], "idStr") ? this.danmakuFormat(danmaku) : danmaku;
            this.sortDmById(DM, "dmid");
            let xml = DM.reduce((s, d) => {
                s += \`<d p="\${d.stime},\${d.mode},\${d.size},\${d.color},\${d.date},\${d.class},\${d.uid},\${d.dmid}">\${d.text.replace(/[<">'&]/g, (a) => { return { '<': '&lt;', '"': '&quot;', '>': '&gt;', "'": '&#39;', '&': '&amp;' }[a]; }).replace(/(\\n|\\r\\n)/g, "/n")}</d>\\r\\n\`;
                return s;
            }, '<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.api.bilibili.com</chatserver><chatid>' + API.cid + '</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source>\\r\\n');
            xml += "</i>";
            /**
             * remove-invalid-xml-characters.js
             * @link https://gist.github.com/john-doherty/b9195065884cdbfd2017a4756e6409cc
             * @license MIT
             * @see https://en.wikipedia.org/wiki/Valid_characters_in_XML
             */
            var regex = /((?:[\\0-\\x08\\x0B\\f\\x0E-\\x1F\\uFFFD\\uFFFE\\uFFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF]))/g;
            return xml.replace(regex, '');
        }
        /**
         * 将弹幕数组按弹幕id升序排序
         * @param danmaku 要排序的弹幕数组
         * @param key 弹幕id的属性名，应为dmid或idStr
         */
        sortDmById(danmaku, key) {
            let egx = /^\\d+\$/;
            for (let i = 0, d; i < danmaku.length; i++) {
                d = danmaku[i];
                // 判断输入是否纯数字
                if (!egx.test(d[key]))
                    throw "请输入数字字符串";
                // 强制转化输入为字符串
                if (typeof d[key] !== "string")
                    d[key] = String(d[key]);
                // 去除数字开头占位的0
                d[key] = d[key].replace(/^0+/, "");
            }
            danmaku.sort((a, b) => this.bigInt(a[key], b[key]) ? 1 : -1);
        }
        /**
         * 比较大小，仅用于弹幕排序
         * @param num1 数字字符串 1
         * @param num2 数字字符串 2
         * @returns 前者大于后者返回真，否则返回假，相等也返回假
         */
        bigInt(num1, num2) {
            // 数位不同，前者大为真，否则为假
            if (num1.length > num2.length)
                return true;
            else if (num1.length < num2.length)
                return false;
            else {
                // 数位相同，逐位比较
                for (let i = 0; i < num1.length; i++) {
                    // 任意一位前者大为真
                    if (num1[i] > num2[i])
                        return true;
                    // 任意一位前者小为假
                    if (num1[i] < num2[i])
                        return false;
                    // 仅当位相等时继续比较下一位
                }
                // 包括相等情况返回假
                return false;
            }
        }
        /**
         * 获取 proto 弹幕
         * @param aid 弹幕所对应视频的 aid，当前视频请留空
         * @param cid 弹幕所对应视频的 cid，当前视频请留空
         * @param bas 是否只获取BAS/代码弹幕，默认请留空
         * @returns 弹幕数组：Promise
         */
        async getSegDanmaku(aid = API.aid, cid = API.cid, bas = false) {
            try {
                // 判断参数是否有效
                aid = aid || API.aid;
                cid = cid || API.cid;
                if (!aid || !cid)
                    throw ["弹幕参数错误！", "aid：" + aid, "cid：" + cid];
                // 首先获取弹幕分片总数
                let config = await API.xhr({
                    url: API.Format.objUrl("https://api.bilibili.com/x/v2/dm/web/view", {
                        type: String(1),
                        oid: String(cid),
                        pid: String(aid)
                    }),
                    responseType: "arraybuffer",
                    credentials: true
                });
                config = Danmaku.protoView.decode(new Uint8Array(config));
                // dmSge.total代表的分片总数，有时错误地为100
                // 故需要按照 视频时长/分片时长(一般是360秒) 把分片总数计算出来
                let pageSize = config.dmSge.pageSize ? config.dmSge.pageSize / 1000 : 360;
                let total = (window.player && window.player.getDuration && (window.player.getDuration() / pageSize + 1)) || config.dmSge.total;
                let allrequset = [], allDanmaku = [];
                // 其他视频的分片总数已经不能从当前window下获取
                if (aid && (aid != aid))
                    total = config.dmSge.total;
                if (!bas) {
                    // 特殊情况下只需要BAS/高级弹幕时 bas为真
                    for (let index = 1; index <= total; index++) {
                        allrequset.push(API.xhr({
                            url: API.Format.objUrl("https://api.bilibili.com/x/v2/dm/web/seg.so", {
                                type: String(1),
                                oid: String(cid),
                                pid: String(aid),
                                segment_index: String(index)
                            }),
                            responseType: "arraybuffer",
                            credentials: true
                        }));
                    }
                }
                // BAS弹幕
                if (config.specialDms.length > 0) {
                    for (let index = 0; index < config.specialDms.length; index++) {
                        // 下发的是http链接，但会被chrome的安全措施拦掉，于是替换成https
                        allrequset.push(API.xhr({
                            url: config.specialDms[index].replace("http", "https"),
                            responseType: "arraybuffer",
                            credentials: false
                        }));
                    }
                }
                // 互动弹幕
                let upHighlightDm = []; // 带有蓝色“UP主”特殊标记的弹幕
                if (config.commandDms.length > 0) {
                    for (let i = 0; i < config.commandDms.length; i++) {
                        let cdm = config.commandDms[i];
                        if (cdm.command == "#UP#") {
                            cdm.styleClass = "danmaku-up-icon";
                            cdm.color = 16777215;
                            cdm.pool = 0;
                            cdm.fontsize = 25;
                            cdm.ctime = new Date(cdm.mtime).getTime() / 1000;
                            cdm.mode = 1;
                            cdm.midHash = API.crc32 && API.crc32(cdm.mid);
                            upHighlightDm.push(cdm);
                            config.commandDms.splice(i, 1);
                        }
                    }
                    if (API.loadCommandDm && API.config.commandDm)
                        API.loadCommandDm(config.commandDms, aid, cid);
                }
                // 解码弹幕
                (await Promise.all(allrequset)).forEach(d => {
                    if (d)
                        allDanmaku = allDanmaku.concat(Danmaku.protoSeg.decode(new Uint8Array(d)).elems);
                });
                return allDanmaku.concat(upHighlightDm);
            }
            catch (e) {
                API.toast.error("danmaku.js", e);
            }
        }
        /**
         * 获取历史弹幕
         * @param date 历史弹幕日期，yyyy-mm-dd格式：如 2009-06-24
         * @param cid 弹幕所在视频的 cid，不填则取当前视频的cid
         * @returns 解析好的弹幕数组
         */
        async getHistoryDanmaku(date, cid = API.cid) {
            if (!date || !API.uid)
                return;
            cid = cid || cid;
            let dm = await API.xhr({
                url: API.Format.objUrl("https://api.bilibili.com/x/v2/dm/web/history/seg.so", {
                    type: String(1),
                    oid: String(cid),
                    date: date
                }),
                responseType: "arraybuffer",
                credentials: true
            });
            return this.segDmDecode(dm);
        }
        /**
         * 载入本地弹幕
         * @param xml 读取本地弹幕文件得到的字符串
         * @param append 默认为false，即不保留已加载的弹幕。为true时，则将追加到现有弹幕上
         */
        loadLocalDm(xml, append) {
            var _a, _b;
            let doc = new DOMParser().parseFromString(xml, "application/xml");
            let dm = doc.querySelectorAll("d");
            if (dm.length == 0) {
                API.toast.warning("从弹幕文件中没有获取到任何弹幕！");
                return;
            }
            let danmaku = [];
            let attr, v, mode;
            for (let i = 0; i < dm.length; i++) {
                v = dm[i];
                attr = v.getAttribute('p').split(",");
                mode = parseInt(attr[1]);
                danmaku[i] = {
                    class: parseInt(attr[5]),
                    color: parseInt(attr[3]),
                    date: parseInt(attr[4]),
                    dmid: attr[7],
                    mode: mode,
                    size: parseInt(attr[2]),
                    stime: parseFloat(attr[0]),
                    text: ((mode != 8 && mode != 9) ? v.textContent.replace(/(\\/n|\\\\n|\\n|\\r\\n)/g, '\\n') : v.textContent),
                    uid: attr[6]
                };
            }
            this.specialEffects(danmaku);
            this.sortDmById(danmaku, "dmid");
            /**
             * bilibiliPlayer.js 21394行已经添加如下代码，用于设置弹幕池
             * @param  {Array} dm 弹幕数组
             * @param  {Boolean} append 默认为false，即不保留已加载的弹幕。为true时，则将追加到现有弹幕上
             */
            // setDanmaku = (dm) => {......}
            if (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku))
                return API.toast.error("刷新弹幕列表失败：播放器内部调用丢失！");
            (_b = window.player) === null || _b === void 0 ? void 0 : _b.setDanmaku(danmaku, append);
        }
        /**
         * 把有换行符的弹幕的zindex设为它的出现时间(progress)，并且打上“字幕弹幕”标记
         * @param dm 弹幕数组
         */
        specialEffects(dm) {
            let textData;
            for (let i = 0; i < dm.length; i++) {
                textData = dm[i];
                if (textData.text.includes('\\n')) {
                    textData.class = 1;
                    textData.zIndex = textData.stime * 1000;
                    if (!(textData.text.includes("█") || textData.text.includes("▂")))
                        textData.zIndex = textData.zIndex + 1;
                }
            }
        }
        segDmDecode(response) {
            return Danmaku.protoSeg.decode(new Uint8Array(response)).elems;
        }
        /**
         * 将新版弹幕数组转化为旧版弹幕数组
         * @param dm 新版弹幕数组
         * @param aid 视频aid，默认取当前视频aid
         * @returns 旧版弹幕数组
         */
        danmakuFormat(dm, aid) {
            aid = aid || aid;
            let danmaku = dm.map(function (v) {
                let result = {
                    class: v.pool,
                    color: v.color,
                    date: v.ctime,
                    dmid: v.idStr,
                    mode: v.mode,
                    size: v.fontsize,
                    stime: v.progress / 1000,
                    text: (v.mode != 8 && v.mode != 9) ? v.content.replace(/(\\/n|\\\\n|\\n|\\r\\n)/g, '\\n') : v.content,
                    uid: v.midHash
                };
                // 添加图片弹幕信息
                if (v.action && v.action.startsWith("picture:"))
                    result.picture = "//" + v.action.split(":")[1];
                // 利用bilibiliPlayer.js的这行代码，可以添加指定的css类到弹幕上
                // b.AH && (e.className = e.className + " " + b.AH);
                if (v.styleClass !== undefined)
                    result.AH = v.styleClass;
                return result;
            });
            //对av400000(2012年11月)之前视频中含有"/n"的弹幕的进行专门处理
            if (aid && aid < 400000) {
                this.specialEffects(danmaku);
            }
            this.sortDmById(danmaku, "dmid");
            return danmaku;
        }
        /**
         * 载入在线弹幕
         * @param url 其他弹幕所在视URL
         */
        async onlineDanmaku(url) {
            try {
                let obj = await API.urlInputCheck(url);
                if (obj.aid && obj.cid) {
                    this.getSegDanmaku(obj.aid, obj.cid).then((d) => {
                        var _a;
                        d = this.danmakuFormat(d, obj.aid);
                        (_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku(d, API.config.concatDanmaku);
                        this.danmaku = d;
                    });
                }
            }
            catch (e) {
                API.debug.error("onlineDanmaku.js", e);
            }
        }
    }
    /** 弹幕相关 */
    API.danmaku = new Danmaku();

//# sourceURL=API://@Bilibili-Old/include/danmaku.js`;
/*!***********************!*/
/**/modules["debug.js"] = /*** ./dist/include/debug.js ***/
`"use strict";
    /**
     * console的封装
     * debug.log的重定向，剩下的请访问对应属性。
     * @param data 要输出的内容
     */
    API.debug = function (...data) { console.log(\`%c[\${API.Format.timeFormat()}]\`, "color: blue;", ...data); };
    API.debug.log = function (...data) { console.log(\`%c[\${API.Format.timeFormat()}]\`, "color: blue;", ...data); };
    API.debug.info = function (...data) { console.info(\`%c[\${API.Format.timeFormat()}]\`, "color: green;", ...data); };
    API.debug.debug = function (...data) { console.debug(\`[\${API.Format.timeFormat()}]\`, ...data); };
    API.debug.warn = function (...data) { console.warn(\`[\${API.Format.timeFormat()}]\`, ...data); };
    API.debug.error = function error(...data) { console.error(\`[\${API.Format.timeFormat()}]\`, ...data); };

//# sourceURL=API://@Bilibili-Old/include/debug.js`;
/*!***********************!*/
/**/modules["element.js"] = /*** ./dist/include/element.js ***/
`"use strict";
    /** 对一个节点添加监听，点击该节点之外的地方移除该节点 */
    class ClickRemove {
        /** @param ele 目标节点 */
        constructor(ele) {
            setTimeout(() => {
                function remove() {
                    ele.remove();
                    document.removeEventListener("click", remove);
                }
                document.addEventListener("click", remove);
                ele.addEventListener("click", e => e.stopPropagation());
            }, 100);
        }
    }
    API.ClickRemove = ClickRemove;
    /** 弹出一个空白浮动窗口，点击该窗口外的节点该窗口会自动关闭，浮动窗口上的内容请通过返回的节点进行后续添加 */
    class ElementComponent {
        /**
         * @param style 添加style样式，直接写进element，具有最高优先级
         * @param hold 禁用自动关闭，转而提供一个关闭按钮
         * @returns 浮动窗口实际可操作节点，可以往上面添加需要显示在浮动窗口上的内容
         */
        static popupbox(style = {}, hold) {
            const box = API.addElement("div", { class: "ui-popup-box" });
            const real = box.attachShadow({ mode: "closed" });
            const div = API.addElement("div", { class: "box" }, real);
            const popup = API.addElement("div", { class: "contain" }, div);
            API.addCss(API.getModule("ui-popup-box.css"), undefined, real);
            Object.keys(style).forEach((d) => popup.style[d] = style[d]);
            hold ? this.close(div, box) : new ClickRemove(box);
            return popup;
        }
        /**
         * 添加关闭按钮
         * @param ele 按钮所在节点
         * @param box 点击按钮关闭的节点，不存在则取ele
         */
        static close(ele, box) {
            const svg = this.svg('<svg viewBox="0 0 100 100"><path d="M2 2 L98 98 M 98 2 L2 98Z" stroke-width="10px" stroke="#212121" stroke-linecap="round"></path></svg>');
            svg.setAttribute("style", "position: absolute;transform: scale(0.8);right: 10px;top: 10px;");
            svg.onclick = () => box ? box.remove() : ele.remove();
            ele.appendChild(svg);
        }
        /**
         * 封装hr标签，一条水平直线，一般用于隔断节点
         * @returns 封装好的节点
         */
        static hr() {
            const hr = document.createElement("div");
            const real = hr.attachShadow({ mode: "closed" });
            API.addElement("div", { class: "hr" }, real);
            API.addCss(API.getModule("hr.css"), undefined, real);
            return hr;
        }
        /**
         * 封装svg图标标签
         * @param svg svg节点字符串
         * @returns 封装好的节点
         */
        static svg(svg) {
            const root = document.createElement("div");
            const real = root.attachShadow({ mode: "closed" });
            API.addElement("div", { class: "icon" }, real, svg);
            API.addCss(API.getModule("icon.css"), undefined, real);
            return root;
        }
        /**
         * 封装好的滑块快关标签
         * @param callback 一个用于接收滑块开关响应的回调函数，必须，否则外部无法获取或响应开关状态
         * @param value 开关初始状态，非必须，默认为false
         * @returns 封装好的节点
         */
        static switch(callback, value) {
            const root = document.createElement("div");
            const real = root.attachShadow({ mode: "closed" });
            const div = API.addElement("div", {
                class: "switch"
            }, real, \`<span class="bar"></span>
            <span class="knob"><i class="circle"></i></span>\`);
            API.addCss(API.getModule("switch.css"), undefined, real);
            value = value ? true : false;
            value && (div.children[0].setAttribute("checked", "checked"),
                div.children[1].setAttribute("checked", "checked"),
                div.children[1].children[0].setAttribute("checked", "checked"));
            div.onclick = () => {
                value = !value;
                value ? (div.children[0].setAttribute("checked", "checked"),
                    div.children[1].setAttribute("checked", "checked"),
                    div.children[1].children[0].setAttribute("checked", "checked")) : (div.children[0].removeAttribute("checked"),
                    div.children[1].removeAttribute("checked"),
                    div.children[1].children[0].removeAttribute("checked"));
                callback.call(div, value);
            };
            return root;
        }
        /**
         * 封装好的下拉列表标签（单选）
         * @param list 下拉表值组
         * @param callback 一个用于接收下拉选择响应的回调函数，必须，否则外部无法获取或响应选择状态
         * @param value 初始选定值
         * @returns 封装好的节点
         */
        static select(list, callback, value) {
            const root = document.createElement("div");
            const real = root.attachShadow({ mode: "closed" });
            const div = API.addElement("div", { class: "select" }, real);
            const select = list.reduce((s, d) => {
                API.addElement("option", {}, s, d);
                return s;
            }, API.addElement("select", {}, div));
            API.addCss(API.getCss("select.css"), undefined, real);
            select.value = value || select.options[0].text;
            select.onchange = () => callback.call(div, select.value);
            return root;
        }
        /**
         * 封装好的按钮标签
         * @param callback 响应按钮点击的回调函数，必须，否则无法响应按钮点击事件
         * @param text 按钮上的文字，默认为“确定”
         * @param disabled 点击按钮后的CD，单位：/s，默认为1，取0表示一直禁用
         * @returns 封装好的节点
         */
        static button(callback, text, disabled = 1) {
            const root = document.createElement("div");
            const real = root.attachShadow({ mode: "closed" });
            const div = API.addElement("div", { class: "button" }, real, text || "确定");
            API.addCss(API.getCss("button.css"), undefined, real);
            div.onclick = () => {
                div.setAttribute("disabled", "disabled");
                callback.call(div);
                disabled && setTimeout(() => div.removeAttribute("disabled"), disabled * 1000);
            };
            return root;
        }
        /**
         * 封装好的输入框，响应回车事件
         * @param callback 响应输入确认的回调函数，必须，否则无法响应输入
         * @param text 输入框内默认数据，非必须
         * @param attribute input标签的标准属性，用于指定输入框类型等
         * @param pattern 检测输入的正则表达式，将过滤非法输入并弹出toast警告
         * @param button 输入框右侧带上按钮，响应按钮点击事件而非回车事件
         * @param disabled 点击按钮后的CD，单位：/s，默认为1，取0表示一直禁用
         * @returns 封装好的节点
         */
        static input(callback, text, attribute, pattern, button, disabled) {
            const root = document.createElement("div");
            const real = root.attachShadow({ mode: "closed" });
            const div = API.addElement("div", { class: "input" }, real);
            const input = API.addElement("input", {}, div);
            API.addCss(API.getCss("input.css"), undefined, real);
            attribute && Object.entries(attribute).forEach(d => { input.setAttribute(d[0], d[1]); });
            text && (input.value = text);
            button ? div.appendChild(this.button(function () {
                if (pattern && !pattern.test(input.value))
                    return API.toast.warning(\`值 \${input.value} 不符合要求！\`, \`正则表达式：\${pattern.toString()}\`);
                callback.call(input, input.value);
            }, button, disabled)) : input.onchange = () => {
                if (pattern && !pattern.test(input.value))
                    return API.toast.warning(\`值 \${input.value} 不符合要求！\`, \`正则表达式：\${pattern.toString()}\`);
                callback.call(input, input.value);
            };
            return root;
        }
        /**
         * 封装好的文件选择按钮，特化版的输入框
         * @param callback 响应文件选择结果的回调函数，必须，否则无法响应文件选择
         * @param multiple 是否允许多选，默认为false
         * @param text 选择按钮上的文字，默认为“选择”
         * @param accept 指定文件类型拓展名组，不指定默认取所有类型文件
         * @returns 封装好的节点
         */
        static file(callback, multiple, text = "选择", accept) {
            const root = document.createElement("div");
            const real = root.attachShadow({ mode: "closed" });
            const input = API.addElement("input", { type: "file", style: "width: 0;position: absolute;" }, real);
            accept && (input.accept = accept.join(","));
            multiple && (input.multiple = true);
            real.appendChild(this.button(() => input.click(), text, 0));
            input.onchange = () => input.files && callback.call(input, input.files);
            return root;
        }
        /**
         * 封装好的复选框（多选）
         * @param list 复选框的值组
         * @param callback 响应选择操作的回调函数，必须，否则无法响应文件选择
         * @param value list中的默认选中数据组，非必须
         * @returns 封装好的节点
         */
        static checkbox(list, callback, value = []) {
            const root = document.createElement("div");
            const real = root.attachShadow({ mode: "closed" });
            const div = API.addElement("div", { class: "box" }, real);
            API.addCss(API.getCss("checkbox.css"), undefined, real);
            const checkboxs = list.reduce((s, d) => {
                s.push(API.addElement("div", { class: "checkbox" }, div, \`<div class="checklabel">
                        <div class="disc-border"></div>
                        <div class="disc"></div>
                    </div>
                    <div class="checkvalue">\${d}</div>\`));
                return s;
            }, []);
            const checks = list.reduce((s, d) => {
                s.push(value.includes(d));
                return s;
            }, []);
            checkboxs.forEach((d, i) => {
                checks[i] && (d.children[0].children[0].setAttribute("checked", "checked"),
                    d.children[0].children[1].setAttribute("checked", "checked"));
                d.onclick = () => {
                    checks[i] = !checks[i];
                    checks[i] ? (d.children[0].children[0].setAttribute("checked", "checked"),
                        d.children[0].children[1].setAttribute("checked", "checked")) : (d.children[0].children[0].removeAttribute("checked"),
                        d.children[0].children[1].removeAttribute("checked"));
                    callback.call(div, checks.reduce((s, d, i) => { d && s.push(list[i]); return s; }, []));
                };
            });
            return root;
        }
        /**
         * 封装好的进度条，自适应父节点width
         * @param detail 进度条配置，双向绑定：**修改其中的值会及时体现在该进度条上**
         * @returns 封装好的节点
         */
        static progress(detail) {
            let { min, max, value, color, nocolor, display } = detail;
            const root = document.createElement("div");
            const real = root.attachShadow({ mode: "closed" });
            API.addCss(API.getCss("progress.css"), undefined, real);
            const progress = API.addElement("div", { class: "progress" }, real);
            const progressContainer = API.addElement("div", { class: "progressContainer", title: "0%" }, progress);
            const secondaryProgress = API.addElement("div", { class: "secondaryProgress", style: "transform: scaleX(0);" }, progressContainer);
            const primaryProgress = API.addElement("div", { class: "primaryProgress", style: "transform: scaleX(0);" }, progressContainer);
            const progressTag = API.addElement("div", { class: "progressTag", style: "display: none;" }, progress, \`<div>\${min}</div><div>\${max}</div>\`);
            Object.defineProperties(detail, {
                "color": { get: () => primaryProgress.style.backgroundColor, set: (v) => primaryProgress.style.backgroundColor = v },
                "display": { get: () => progressTag.style.display, set: (v) => progressTag.style.display = v ? "" : "none" },
                "max": {
                    get: () => max, set: (v) => {
                        if (v < value || v <= min)
                            return;
                        progressTag.children[1].innerText = max = v;
                        detail.value = value;
                    }
                },
                "min": {
                    get: () => min, set: (v) => {
                        if (v > value || v >= max)
                            return;
                        progressTag.children[0].innerText = min = v;
                        detail.value = value;
                    }
                },
                "nocolor": { get: () => secondaryProgress.style.backgroundColor, set: (v) => secondaryProgress.style.backgroundColor = v },
                "value": {
                    get: () => value, set: (v) => {
                        if (v > max || v < min)
                            return;
                        const per = Number(((v - min) / (max - min)).toFixed(3).slice(0, -1));
                        primaryProgress.style.transform = \`scaleX(\${per})\`;
                        progressContainer.title = (per * 100) + "%";
                    }
                }
            });
            min >= max && (min = 0);
            (value > max || value < min) && (value = 0);
            detail.min = min, detail.max = max, detail.value = value, detail.color = color, detail.nocolor = nocolor, detail.display = display;
            return root;
        }
    }
    API.ElementComponent = ElementComponent;

//# sourceURL=API://@Bilibili-Old/include/element.js`;
/*!***********************!*/
/**/modules["EmbedPlayer.js"] = /*** ./dist/include/EmbedPlayer.js ***/
`"use strict";
    class EmbedPlayer {
        /**
         * 代理EmbedPlayer函数
         * @param player "player"
         * @param swf "//static.hdslb.com/play.swf"
         * @param playerParams url参数式的播放器初始化参数，需要转化为对象格式才能传递给播放器实例
         * @param playerType 播放器类型：flash/HTML5
         * @param upgrade 提升播放器版本，可能只在flash格式下有用
         * @param callbackFn 初始化播放器后的回调函数
         */
        constructor(player, swf, playerParams, playerType, upgrade, callbackFn) {
            this.flashAddEvents = [];
            this.flashRemoveEvents = [];
            this.pageno = undefined;
            this.bofqi = document.querySelector("#bofqi");
            this.eventMaps = {
                'jwplayerMediaBuffer': 'video_media_buffer',
                'jwplayerMediaBufferFull': 'video_media_buffer_full',
                'jwplayerMediaComplete': 'video_media_ended',
                'jwplayerMediaError': 'video_media_error',
                'jwplayerMediaLoaded': 'video_media_loaded',
                'jwplayerMediaMute': 'video_media_mute',
                'jwplayerMediaSeek': 'video_media_seek',
                'jwplayerMediaTime': 'video_media_time',
                'jwplayerMediaVolume': 'video_media_volume'
            };
            this.apiMaps = {
                'mukio_reloadAccess': 'reloadAccess',
                // 'jwAddEventListener': 'addEventListener',
                // 'jwRemoveEventListener': 'removeEventListener',
                'jwPlay': 'play',
                'jwPause': 'pause',
                'jwStop': 'stop',
                'jwSeek': 'seek',
                'jwPlaylistPrev': 'prev',
                'jwPlaylistNext': 'next',
                'jwGetBuffer': 'getBufferRate',
                'jwGetDuration': 'getDuration',
                'jwGetFullscreen': 'isFullScreen',
                'jwGetWidth': 'getWidth',
                'jwGetHeight': 'getHeight',
                'jwGetMute': 'isMute',
                'jwSetMute': 'setMute',
                'jwGetPlaylist': 'getPlaylist',
                'jwGetPlaylistIndex': 'getPlaylistIndex',
                'jwGetPosition': 'getCurrentTime',
                'jwGetState': 'getState',
                'jwGetVersion': 'getVersion',
                'jwGetVolume': 'volume',
                'jwSetVolume': 'volume'
            };
            this.cElement = undefined;
            this.feedback = undefined;
            this.playerParam = API.Format.urlObj(\`?\${playerParams}\`);
            this.playerParam.dashSymbol = true;
            this.playerParam.aid && Reflect.set(window, "aid", this.playerParam.aid);
            this.playerParam.cid && Reflect.set(window, "cid", this.playerParam.cid);
            this.playerType = playerType;
            this.upgrade = upgrade;
            this.callbackFn = callbackFn;
            this.gray_loader();
        }
        get gray_html5() {
            return !API.config.noVideo;
        }
        set gray_html5(v) {
            API.config.noVideo = !v;
        }
        /**
         * 加载外源脚本依赖
         * @param src 外源脚本src
         * @param onload 成功加载后的回调函数
         */
        loadScript(src, onload) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.addEventListener("load", () => {
                script.remove();
                onload && onload();
            });
            script.addEventListener("error", (e) => {
                script.remove();
                API.toast.error("加载播放器脚本失败！", e.message);
            });
            document.body.appendChild(script);
        }
        /** 初始化HTML5播放器节点 */
        loadHtml5Player() {
            if (!this.bofqi)
                return API.debug.warn("页面中并不存在播放器节点！", this.playerParam);
            if (!window.bilibiliPlayer) {
                this.loadScript("//static.hdslb.com/player/js/bilibiliPlayer.min.js", () => {
                    this.bofqi.innerHTML = '<div class="player"><div id="bilibiliPlayer"></div></div><div id="player_placeholder"></div>';
                    window.player = new window.bilibiliPlayer(this.playerParam);
                    this.gray_html5_compatible();
                });
            }
            else {
                this.bofqi.innerHTML = '<div class="player"><div id="bilibiliPlayer"></div></div><div id="player_placeholder"></div>';
                window.player = new window.bilibiliPlayer(this.playerParam);
                this.gray_html5_compatible();
            }
        }
        /**
         * 统一HTML5播放器对外接口
         */
        gray_html5_compatible() {
            this.cElement = this.bofqi.querySelector("#player_placeholder");
            Object.entries(this.apiMaps).forEach(d => {
                this.cElement[d[0]] = function () {
                    if (window.player && "function" == typeof window.player[d[1]]) {
                        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                            t[n] = arguments[n];
                        return window.player[d[1]].apply(window.player, t);
                    }
                    return !1;
                };
            });
            Reflect.set(this.cElement, "jwAddEventListener", (type, callback) => {
                var callbackString = "", _callback;
                try {
                    "function" != typeof callback && (callbackString = new Function(callback));
                }
                catch (e) {
                    callbackString = function () { };
                }
                this.eventMaps[type] && (_callback = callbackString || callback, window.player && window.player.addEventListener && window.player.addEventListener(this.eventMaps[type], _callback));
            });
            Reflect.set(this.cElement, "jwRemoveEventListener", (e) => {
                this.eventMaps[e] && window.player && window.player.removeEventListener && window.player.removeEventListener(this.eventMaps[e]);
            });
            "function" == typeof this.callbackFn && this.cElement.jwAddEventListener("jwplayerMediaLoaded", () => this.callbackFn());
            "function" == typeof window.PlayerMediaLoaded && window.PlayerMediaLoaded();
        }
        /**
         * 检查浏览器flash支持性
         * @returns 支持结果
         */
        flashChecker() {
            let e = !1, t = 0;
            if (!!/msie [\\w.]+/.exec(navigator.userAgent.toLowerCase()) && !/Edge/i.test(navigator.userAgent) || /Trident/i.test(navigator.userAgent)) {
                try {
                    var n = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    if (n) {
                        e = !0;
                        var r = n.GetVariable("\$version");
                        t = parseInt(r.split(" ")[1].split(",")[0], 10);
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            else if (navigator.plugins && 0 < navigator.plugins.length) {
                var i = navigator.plugins["Shockwave Flash"];
                if (i) {
                    e = !0;
                    for (var a = i.description.split(" "), o = 0; o < a.length; ++o)
                        isNaN(parseInt(a[o], 10)) || (t = parseInt(a[o], 10));
                }
            }
            return {
                hasFlash: e,
                flashVersion: t
            };
        }
        /**
         * 初始化flash播放器节点
         */
        gray_loader_flash() {
            // flash播放器已不可用，主动更新全局变量
            this.playerParam.aid && (API.aid = this.playerParam.aid);
            this.playerParam.cid && (API.cid = this.playerParam.cid);
            this.flashChecker().hasFlash ? window.swfobject && window.swfobject.embedSWF ?
                this.loadFlashPlayer() :
                this.loadScript("//static.hdslb.com/js/swfobject.js", () => this.loadFlashPlayer()) :
                this.getNoFlashTips();
        }
        /**
         * 不支持flash提示
         */
        getNoFlashTips() {
            window.NoFlashTips ? this.createNoFlashTipsInstance() : this.loadScript("//static.hdslb.com/player/noflashtips/no-flash-tips.min.js", () => this.createNoFlashTipsInstance());
        }
        /**
         * 不支持flash提示内容
         */
        createNoFlashTipsInstance() {
            const msg = {
                backgroundColor: "white",
                msg: "主人，未安装Flash插件，暂时无法观看视频，您可以…",
                msgColor: "#000",
                msgSize: 14,
                btnList: [
                    {
                        title: "下载Flash插件",
                        width: 166,
                        height: 40,
                        type: "flash",
                        theme: "white"
                    }, {
                        title: "使用HTML5播放器",
                        width: 166,
                        height: 40,
                        type: "html5",
                        theme: "blue",
                        onClick: (e) => {
                            this.gray_html5 = true,
                                this.loadHtml5Player(),
                                "function" == typeof e && e();
                        }
                    }
                ],
                hasOrText: !1
            };
            API.config.noVideo && msg.btnList.push({
                title: "下载视频",
                width: 166,
                height: 40,
                type: "download",
                theme: "red",
                onClick: (e) => {
                    API.download();
                }
            });
            new window.NoFlashTips(this.bofqi, msg);
            this.bofqi.style.removeProperty("position");
        }
        /**
         * 加载flash播放器脚本
         */
        loadFlashPlayer() {
            this.bofqi.innerHTML = '<div id="player_placeholder" class="player"></div>';
            window.swfobject.embedSWF(this.upgrade ? "//static.hdslb.com/play_recommend.swf" : "//static.hdslb.com/play.swf", "player_placeholder", "950", "482", "0", "", this.playerParam, {
                bgcolor: "#ffffff",
                allowfullscreeninteractive: "true",
                allowfullscreen: "true",
                quality: "high",
                allowscriptaccess: "always",
                wmode: /Firefox/.test(navigator.userAgent) ? "opaque" : "direct"
            }, {
                class: "player"
            }, () => {
                "function" == typeof this.callbackFn && this.callbackFn();
                "function" == typeof window.PlayerMediaLoaded && window.PlayerMediaLoaded();
                this.gray_flash_compatible();
            });
        }
        /**
         * 统一flash播放器对外接口
         */
        gray_flash_compatible() {
            this.cElement = this.bofqi.querySelector("#player_placeholder");
            window.player = {};
            Object.entries(this.apiMaps).forEach(d => {
                this.cElement[d[0]] = function () {
                    if (window.player && "function" == typeof window.player[d[1]]) {
                        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                            t[n] = arguments[n];
                        return window.player[d[1]].apply(window.player, t);
                    }
                    return !1;
                };
                window.player[d[1]] = () => {
                    if (typeof this.cElement[d[0]] === 'function') {
                        return this.cElement[d[0]].apply(this.cElement, arguments);
                    }
                };
            });
            Reflect.set(this.cElement, "jwAddEventListener", () => {
                this.cElement['jwAddEventListener'].apply(this, arguments);
            });
            Reflect.set(this.cElement, "jwRemoveEventListener", () => {
                this.cElement['jwRemoveEventListener'].apply(this, arguments);
            });
            const eventMaps = {
                'video_media_buffer': 'jwplayerMediaBuffer',
                'video_media_buffer_full': 'jwplayerMediaBufferFull',
                'video_media_ended': 'jwplayerMediaComplete',
                'video_media_error': 'jwplayerMediaError',
                'video_media_loaded': 'jwplayerMediaLoaded',
                'video_media_mute': 'jwplayerMediaMute',
                'video_media_seek': 'jwplayerMediaSeek',
                'video_media_time': 'jwplayerMediaTime',
                'video_media_volume': 'jwplayerMediaVolume'
            };
            window.player['addEventListener'] = (type, callback) => {
                try {
                    if (typeof callback !== 'function') {
                        callback = new Function(callback);
                    }
                }
                catch (e) {
                    callback = function () { };
                }
                if (eventMaps[type]) {
                    this.flashAddEvents.push([type, callback]);
                }
            };
            window.player['removeEventListener'] = (type) => {
                if (eventMaps[type]) {
                    for (var i = this.flashAddEvents.length - 1; i > 0; i--) {
                        if (this.flashAddEvents[i][0] == type) {
                            this.flashAddEvents.splice(i, 1);
                        }
                    }
                }
            };
            Object.entries(eventMaps).forEach(d => {
                this.cElement["jwAddEventListener"](d[1], () => { this.callFunction(d[0]); });
            });
        }
        callFunction(type) {
            const eventMaps = {
                'video_media_buffer': 'jwplayerMediaBuffer',
                'video_media_buffer_full': 'jwplayerMediaBufferFull',
                'video_media_ended': 'jwplayerMediaComplete',
                'video_media_error': 'jwplayerMediaError',
                'video_media_loaded': 'jwplayerMediaLoaded',
                'video_media_mute': 'jwplayerMediaMute',
                'video_media_seek': 'jwplayerMediaSeek',
                'video_media_time': 'jwplayerMediaTime',
                'video_media_volume': 'jwplayerMediaVolume'
            };
            if (eventMaps[type]) {
                for (var i = 0; i < this.flashAddEvents.length; i++) {
                    this.flashAddEvents[i] && this.flashAddEvents[i][0] == type && this.flashAddEvents[i][1]();
                }
            }
        }
        /**
         * 播放器附加菜单
         * @param type 菜单类型
         * @returns 菜单数据
         */
        loadExtraMenuConfig(type) {
            let v = '20161115', exconfig = [];
            if (type === 'flash' || type === 'flash_gray') {
                if (this.gray_html5) {
                    exconfig.push({ label: "HTML5播放器", id: "change_h5" });
                    exconfig.push({ label: "Flash播放器", id: "change_flash", active: true });
                }
            }
            else {
                exconfig.push({ label: "HTML5播放器", id: "change_h5", active: true });
                exconfig.push({ label: "Flash播放器", id: "change_flash" });
            }
            return { 'ver': v, 'menuItems': exconfig };
        }
        /**
         * 播放器附加菜单回调函数
         * @param id 菜单类型
         */
        clickMenu(id) {
            setTimeout(() => {
                if (id === 'change_h5') {
                    this.gray_html5 = true;
                    this.gray_loader();
                }
                else if (id === 'change_flash') {
                    this.gray_html5 = false;
                    window.player && window.player.destroy && window.player.destroy();
                    this.gray_loader();
                }
            });
        }
        /**
         * 根据参数引导播放器类型
         */
        gray_loader() {
            this.init_bgray_btn();
            ("html5" === this.playerType || this.gray_html5) ? this.loadHtml5Player() : this.gray_loader_flash();
        }
        init_bgray_btn() {
            const prt = this.bofqi.parentElement;
            const gray = API.addElement("div", { class: "bgray-btn-wrap" }, prt);
            API.addCss(API.getModule("bgray-btn.css") + (prt.classList.contains("movie_play") ? ".movie_play {overflow: visible;} .bgray-btn-wrap {top: -10px;} #bofqi {box-shadow: 0 0 0;}" : ""));
            API.addElement("div", { class: "bgray-btn show bgray-btn-feedback" }, gray, \`播放<br/>问题<br/>反馈\`).addEventListener("click", () => {
                this.feedback ? this.feedback.show() : window.FeedBackInstance ? (this.feedback = new window.FeedBackInstance(), this.feedback.show()) : (gray.querySelector(".bgray-btn.show").classList.add("player-feedback-disable"), this.loadScript("//static.hdslb.com/player/feedback/feedback.min.js", () => {
                    gray.querySelector(".bgray-btn.show").classList.remove("player-feedback-disable");
                    this.feedback = window.FeedBackInstance && new window.FeedBackInstance();
                    this.feedback && this.feedback.show();
                }));
            });
            API.addElement("div", { class: "bgray-btn show bgray-btn-help" }, gray, \`帮助\`).addEventListener("click", () => {
                window.open("//www.bilibili.com/blackboard/help.html#常见播放问题自救方法");
            });
        }
    }
    class GrayManager extends EmbedPlayer {
        constructor(player, swf, playerParams, playerType, upgrade, callbackFn) {
            super(player, swf, playerParams, playerType, upgrade, callbackFn);
            /**
             * 监听url哈希修改
             */
            this.HashManage = {
                p: function (e) {
                    return (this.p = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                        return typeof e;
                    }
                        : function (e) {
                            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                        })(e);
                },
                prependHash: "!",
                _change: function (e, t) {
                    var n, r = location.hash, i = [], a = "", o = 0, s = {};
                    r && (r = r.substring(1),
                        this.prependHash && (r = r.replace(new RegExp("^".concat(this.prependHash.replace(/[-[\\]{}()*+?.,\\\\^\$|#\\s]/g, "\\\\\$&"))), ""))),
                        i = r.split("&");
                    for (var u = 0; u < i.length; u++) {
                        var l = i[u].split("=")[0], d = i[u].split("=")[1];
                        l && (s[l] = decodeURIComponent(d));
                    }
                    if ("object" === this.p(e)) {
                        n = Object.keys(e).length;
                        for (var f = 0; f < n; f++) {
                            var c = e[n[f]];
                            c ? s[n[f]] = encodeURIComponent(c) : !1 === c && delete s[n[f]];
                        }
                    }
                    else if (t)
                        s[e] = encodeURIComponent(t);
                    else {
                        if (!1 !== t)
                            return void 0 === e ? s : s[e] || null;
                        delete s[e];
                    }
                    n = Object.keys(s);
                    for (var h = 0; h < n.length; h++)
                        a += 0 !== o ? "&" : this.prependHash,
                            a += "".concat(n[h], "=").concat(s[n[h]]),
                            o += 1;
                    return location.hash = a,
                        s;
                },
                get: function (e) {
                    return this._change(e, null);
                },
                set: function (e, t) {
                    return this._change(e, t);
                },
                clear: function () {
                    location.hash = "";
                }
            };
            let codecId = {
                "AVC": 7,
                "HEVC": 12,
                "AV1": 13
            };
            this.codec = {
                preference: codecId[API.config.codecType],
                support: {}
            };
            let mime = {
                "AVC": 'video/mp4;codecs="avc1.640028"',
                "HEVC": 'video/mp4;codecs="hev1.1.6.L120.90"',
                "AV1": 'video/mp4;codecs="av01.0.01M.08.0.110.01.01.01.0"'
            };
            for (let i in mime) {
                this.codec.support[codecId[i]] = MediaSource.isTypeSupported(mime[i]);
            }
            location.href.includes("t=") && (this.playerParam.p = this.GetUrlValue("t"));
            location.href.includes("d=") && (this.playerParam.d = this.GetUrlValue("d"));
            location.href.includes("lastplaytime=") && (this.playerParam.lastplaytime = this.GetUrlValue("lastplaytime"));
        }
        /**
         * 重新加载播放器实例
         * @param playerParams 播放器实例参数，格式同初始化参数
         */
        reload(playerParams) {
            if (this.playerParam) {
                try {
                    window.swfobject && window.swfobject.removeSWF("player_placeholder"),
                        window.player && window.player.pause(),
                        window.player && window.player.destroy && window.player.destroy(),
                        (this.HashManage.get("page") || this.GetUrlValue("p")) && (window.pageno = this.HashManage.get("page") || this.GetUrlValue("p") || 1,
                            this.pageno = window.pageno);
                }
                catch (e) {
                    console.log(e);
                }
                this.playerParam = API.Format.urlObj(\`?\${playerParams}\`) || this.playerParam;
                this.playerParam.dashSymbol = true;
                this.playerParam && (Reflect.set(window, "aid", this.playerParam.aid),
                    Reflect.set(window, "cid", this.playerParam.cid));
                this.gray_loader();
            }
            else
                window.location.reload();
        }
        /**
         * 从url中提取参数
         * @param e 参数名
         * @returns 参数值
         */
        GetUrlValue(e) {
            var t = new RegExp("(^|&)".concat(e, "=([^&]*)(&|\$)"), "i"), n = window.location.search.substr(1).match(t);
            if (null != n)
                try {
                    return decodeURIComponent(n[2]);
                }
                catch (e) {
                    return null;
                }
            return null;
        }
    }
    API.GrayManager = GrayManager;
    /** 加载重写后的\`video.min.js\`，重写页面前调用。 */
    function loadVideoScript() {
        window.EmbedPlayer = (player, swf, playerParams, playerType, upgrade, callbackFn) => {
            window.GrayManager = new GrayManager(player, swf, playerParams, playerType, upgrade, callbackFn);
        };
    }
    API.loadVideoScript = loadVideoScript;
    // 托管播放器脚本\`bilibiliPlayer.min.js\`
    API.config.trusteeship && API.scriptIntercept("bilibiliPlayer.min.js", undefined, () => {
        const text = GM.getResourceText("bilibiliPlayer.js");
        if (!text)
            setTimeout(() => { API.toast.error("bilibiliPlayer.js 资源加载失败！您可以在设置中临时关闭“托管原生脚本”。"); API.displaySetting("trusteeship"); });
        return text;
    });

//# sourceURL=API://@Bilibili-Old/include/EmbedPlayer.js`;
/*!***********************!*/
/**/modules["file.js"] = /*** ./dist/include/file.js ***/
`"use strict";
    function readAs(file, type = "string", encoding = 'utf-8') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            switch (type) {
                case "ArrayBuffer":
                    reader.readAsArrayBuffer(file);
                    break;
                case "DataURL":
                    reader.readAsDataURL(file);
                    break;
                case "string":
                    reader.readAsText(file, encoding);
                    break;
            }
            reader.onload = () => resolve(reader.result);
            reader.onerror = e => reject(e);
        });
    }
    API.readAs = readAs;
    /**
     * 保存到文件
     * @param content 要保存的对象
     * @param fileName 文件名（含拓展名）
     * @param contentType 编码类型
     */
    async function saveAs(content, fileName, contentType = "text/plain") {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.addEventListener("load", () => URL.revokeObjectURL(a.href));
        // document.body.appendChild(a);
        a.click();
    }
    API.saveAs = saveAs;

//# sourceURL=API://@Bilibili-Old/include/file.js`;
/*!***********************!*/
/**/modules["fnval.js"] = /*** ./dist/include/fnval.js ***/
`"use strict";
    /** fnval参数标志位（二进制） */
    class Fnval {
        constructor() {
            this.MP4 = 1;
            this.DASH_H265 = 16;
            this.HDR = 64;
            this.DASH_4K = 128;
            this.DOLBYAUDIO = 256;
            this.DOLBYVIDEO = 512;
            this.DASH_8K = 1024;
            this.DASH_AV1 = 2048;
        }
    }
    const _ = new Fnval();
    /** 视频格式标志\`fnval\`的默认值（最高值） */
    API.fnval = Reflect.ownKeys(_).reduce((s, d) => {
        s += _[d];
        return s;
    }, -1);

//# sourceURL=API://@Bilibili-Old/include/fnval.js`;
/*!***********************!*/
/**/modules["format.js"] = /*** ./dist/include/format.js ***/
`"use strict";
    /** URL处理函数 */
    class Url {
        constructor(url) {
            this.url = "";
            this.search = "";
            this.hash = "";
            const search = url.match(/(?<=\\?)[A-Za-z0-9&=%\\+\\-_\\.~!\\*'\\(\\);@\$,\\[\\]]+/g);
            this.search = search ? "?" + search.join("&") : "";
            const hash = url.match(/(?<=\\#)[A-Za-z0-9&=%\\+\\-_\\.~!\\*'\\(\\);@\$,\\[\\]\\/]+/g);
            this.hash = hash ? "#" + hash : "";
            this.url = url.replace(/\\?[A-Za-z0-9&=%\\+\\-_\\.~!\\*'\\(\\);@\$,\\[\\]]+/g, "")
                .replace(/\\#[A-Za-z0-9&=%\\+\\-_\\.~!\\*'\\(\\);@\$,\\[\\]\\/]+/g, "");
        }
        /**
         * 提取url的查询参数为对象
         * @returns 参数对象
         */
        getSearch() {
            if (this.search) {
                return this.search.substring(1).split("&").reduce((s, d) => {
                    const arr = d.split("=");
                    s[arr[0]] = arr[1];
                    return s;
                }, {});
            }
            else
                return {};
        }
        /**
         * 修改/添加url参数
         * @param obj 参数对象
         */
        setSearch(obj) {
            let tar = this.getSearch();
            tar = Object.assign(tar, obj);
            const result = Object.entries(tar).reduce((s, d) => {
                d[1] !== null && d[1] !== undefined && s.push(\`\${d[0]}=\${d[1]}\`);
                return s;
            }, []).join("&");
            this.search = result ? "?" + result : "";
        }
        /**
         * 转化为url字符串
         * @returns url字符串
         */
        toJSON() {
            return ((this.url || "") + this.search + this.hash).replace(/^\\?/, "");
        }
    }
    /** 格式化工具集 */
    class Format {
        /**
         * 格式化时间
         * @param time 时间戳
         * @param type 是否包含年月日
         * @returns 时:分:秒 | 年-月-日 时:分:秒
         */
        static timeFormat(time = new Date().getTime(), type) {
            let date = new Date(time), Y = date.getFullYear() + '-', M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-', D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ', h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':', m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':', s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            return type ? Y + M + D + h + m + s : h + m + s;
        }
        /**
         * 格式化字节
         * @param size 字节/B
         * @returns n B | K | M | G
         */
        static sizeFormat(size = 0) {
            let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1000 ** i;
            while (dex > 1) {
                if (size >= vor) {
                    size = Number((size / dex).toFixed(2));
                    break;
                }
                dex = dex / 1024;
                vor = vor / 1000;
                i--;
            }
            return size ? size + unit[i] : "N/A";
        }
        /**
         * 格式化进位
         * @param num 实数
         * @returns n 万 | 亿
         */
        static unitFormat(num = 0) {
            num = 1 * num || 0;
            let unit = ["", "万", "亿"], i = unit.length - 1, dex = 10000 ** i;
            while (dex > 1) {
                if (num >= dex) {
                    num = Number((num / dex).toFixed(1));
                    break;
                }
                dex = dex / 10000;
                i--;
            }
            return num + unit[i];
        }
        /**
         * 冒泡排序
         * @param arr 待排序数组
         * @returns 排序结果
         */
        static bubbleSort(arr) {
            let temp;
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
                if (bool)
                    break;
            }
            return arr;
        }
        /**
         * 随机截取指定大小子数组
         * @param res 母数组
         * @param num 子数组大小
         * @returns 子数组，num=1时直接返回该值
         */
        static randomArray(res, num = 1) {
            const arr = [...res];
            const out = [];
            num = num || 1;
            num = num < arr.length ? num : arr.length;
            while (out.length < num) {
                var temp = (Math.random() * arr.length) >> 0;
                out.push(arr.splice(temp, 1)[0]);
            }
            return num === 1 ? out[0] : out;
        }
        /**
         * search参数对象拼合回URL
         * @param url URL主体，可含search参数和锚
         * @param obj search参数对象
         * @returns 拼合的URL
         */
        static objUrl(url = "", obj = {}) {
            const result = new Url(url);
            result.setSearch(obj);
            return result.toJSON();
        }
        /**
         * 提取URL search参数对象
         * @param url 原URL
         * @returns search参数对象
         */
        static urlObj(url = "") {
            return new Url(url).getSearch();
        }
        /**
         * 秒数 -> hh:mm:ss
         * @param second 秒数
         * @returns hh:mm:ss
         */
        static s2hms(second) {
            const s = second % 60;
            let m = parseInt(String(second / 60));
            const h = parseInt(String(m / 60));
            m = m % 60;
            return (h > 0 ? h + ":" : "") + (h > 0 || m > 0 ? (Array(2).join('0') + m).slice(-2) + ":" : "") + (Array(2).join('0') + s).slice(-2);
        }
        /**
         * 格式化时间间隔，返回过去了多长时间
         * timeFormat的再封装
         * @param time 10/13位的时间戳
         * @returns 过去了多长时间，当时间间隔超过一天时，直接返回timeFormat带年月日的结果
         */
        static intervalFormat(time) {
            time >= 1e11 && (time = Math.floor(time / 1e3));
            const now = Math.floor((new Date).getTime() / 1e3);
            let t = new Date;
            if (t.setHours(0), t.setMinutes(0), t.setSeconds(0), (t = Math.floor(t.getTime() / 1e3)) < time && 0 <= now - time) {
                if (now - time <= 50) {
                    var r = 10 * Math.floor((now - time) % 60 / 10);
                    return (10 < time ? r : 10) + "秒前";
                }
                return now - time < 3600 ? Math.floor((now - time) / 60) + "分钟前" : Math.floor((now - time) / 3600) + "小时前";
            }
            return Format.timeFormat(time * 1e3, true);
        }
    }
    API.Format = Format;

//# sourceURL=API://@Bilibili-Old/include/format.js`;
/*!***********************!*/
/**/modules["MediaMeta.js"] = /*** ./dist/include/MediaMeta.js ***/
`"use strict";
    /**
     * 置媒体控制器MediaMeta信息
     * @param data MediaMeta数据
     */
    function mediaSession(data) {
        if (!navigator.mediaSession.metadata)
            navigator.mediaSession.metadata = new MediaMetadata({ ...data });
        else {
            navigator.mediaSession.metadata.title = data.title;
            navigator.mediaSession.metadata.artist = data.artist;
            navigator.mediaSession.metadata.album = data.album;
            navigator.mediaSession.metadata.artwork = data.artwork;
        }
    }
    API.mediaSession = mediaSession;

//# sourceURL=API://@Bilibili-Old/include/MediaMeta.js`;
/*!***********************!*/
/**/modules["nodeObserver.js"] = /*** ./dist/include/nodeObserver.js ***/
`"use strict";
    const nodelist = [];
    /**
     * 注册节点添加监听
     * **监听节点变动开销极大，如非必要请改用其他方法并且用后立即销毁！**
     * @param callback 添加节点后执行的回调函数
     * @returns 注册编号，用于使用\`removeObserver\`销毁监听
     */
    function observerAddedNodes(callback) {
        try {
            if (typeof callback === "function")
                nodelist.push(callback);
            return nodelist.length - 1;
        }
        catch (e) {
            API.toast.error("nodeObserver.js", e);
        }
    }
    API.observerAddedNodes = observerAddedNodes;
    /**
     * 销毁\`observerAddedNodes\`监听
     * @param id 注册\`observerAddedNodes\`监听是返回的编号
     */
    function removeObserver(id) {
        nodelist.splice(id, 1);
    }
    API.removeObserver = removeObserver;
    (new MutationObserver(d => d.forEach(d => {
        d.addedNodes[0] && nodelist.forEach(async (f) => {
            try {
                f(d.addedNodes[0]);
            }
            catch (e) {
                API.debug.error(d);
                API.debug.error(e);
            }
        });
    }))).observe(document, { childList: true, subtree: true });

//# sourceURL=API://@Bilibili-Old/include/nodeObserver.js`;
/*!***********************!*/
/**/modules["rebuildPlayerurl.js"] = /*** ./dist/include/rebuildPlayerurl.js ***/
`"use strict";
    class RebuildPlayerurl {
        constructor() {
            this.playurl = {
                accept_description: ["高清 1080P+", "高清 1080P", "高清 720P", "清晰 480P", "流畅 360P"],
                accept_format: "hdflv2,flv,flv720,flv480,mp4",
                accept_quality: [112, 80, 64, 32, 16],
                bp: 0,
                code: 0,
                dash: {
                    audio: [],
                    dolby: { audio: [], type: "NONE" },
                    duration: 0,
                    min_buffer_time: 1.5,
                    minBufferTime: 1.5,
                    video: []
                },
                fnval: 0,
                fnver: 0,
                format: "flv480",
                from: "local",
                has_paid: false,
                is_preview: 0,
                message: "",
                no_rexcode: 1,
                quality: 32,
                result: "suee",
                seek_param: "start",
                seek_type: "offset",
                status: 2,
                support_formats: [
                    {
                        description: "高清 1080P+",
                        display_desc: "1080P",
                        format: "hdflv2",
                        need_login: true,
                        need_vip: true,
                        new_description: "1080P 高码率",
                        quality: 112,
                        superscript: "高码率"
                    },
                    {
                        description: "高清 1080P",
                        display_desc: "1080P",
                        format: "flv",
                        need_login: true,
                        new_description: "1080P 高清",
                        quality: 80,
                        superscript: ""
                    },
                    {
                        description: "高清 720P",
                        display_desc: "720P",
                        format: "flv720",
                        need_login: true,
                        new_description: "720P 高清",
                        quality: 64,
                        superscript: ""
                    },
                    {
                        description: "清晰 480P",
                        display_desc: "480P",
                        format: "flv480",
                        new_description: "480P 清晰",
                        quality: 32,
                        superscript: ""
                    },
                    {
                        description: "流畅 360P",
                        display_desc: "360P",
                        format: "mp4",
                        new_description: "360P 流畅",
                        quality: 16,
                        superscript: ""
                    }
                ],
                timelength: 0,
                type: "DASH",
                video_codecid: 7,
                video_project: true
            };
            this.codecs = {
                default: {
                    30112: 'avc1.640028',
                    30102: 'hev1.1.6.L120.90',
                    30080: 'avc1.640028',
                    30077: 'hev1.1.6.L120.90',
                    30064: 'avc1.64001F',
                    30066: 'hev1.1.6.L120.90',
                    30032: 'avc1.64001E',
                    30033: 'hev1.1.6.L120.90',
                    30011: 'hev1.1.6.L120.90',
                    30016: 'avc1.64001E',
                    30280: 'mp4a.40.2',
                    30232: 'mp4a.40.2',
                    30216: 'mp4a.40.2', // 低码音频
                },
                app: {
                    30016: 'avc1.64001E',
                    30032: 'avc1.64001F',
                    30064: 'avc1.640028',
                    30080: 'avc1.640032',
                    30216: 'mp4a.40.2',
                    30232: 'mp4a.40.2',
                    30280: 'mp4a.40.2' // APP源 高码音频 
                }
            };
            this.frameRate = {
                30112: '16000/672',
                30102: '16000/672',
                30080: '16000/672',
                30077: '16000/656',
                30064: '16000/672',
                30066: '16000/656',
                30032: '16000/672',
                30033: '16000/656',
                30011: '16000/656',
                30016: '16000/672'
            };
            this.resolution = {
                30112: [1920, 1080],
                30102: [1920, 1080],
                30080: [1920, 1080],
                30077: [1920, 1080],
                30064: [1280, 720],
                30066: [1280, 720],
                30032: [852, 480],
                30033: [852, 480],
                30011: [640, 360],
                30016: [640, 360], // 360P
            };
        }
        /**
         * 获取链接ids
         * @param url 下载链接
         * @param duration 媒体时长
         */
        getIdxs(url, duration) {
            let range = Math.round(duration * 3.5);
            range = range < 6000 ? 6000 : range;
            return API.xhr({
                url: url,
                responseType: 'arraybuffer',
                headers: { 'Range': \`bytes=0-\${range}\` },
                credentials: false
            });
        }
        /**
         * 过滤问题音频
         * @param audio 音频数据数组
         */
        fixAudio(audio) {
            return audio.reduce((arr, d) => {
                if (d.id == 30232 || d.id == 30280 || d.id == 30216)
                    arr.push(d);
                return arr;
            }, []);
        }
        /**
         * 重构APP端数据
         * @param app 原始数据对象
         */
        async appPlayurl(app) {
            if (app.durl)
                return app;
            if (app.dash.duration) {
                app.dash.audio = this.fixAudio(app.dash.audio);
                return app;
            }
            API.toast("重构DASH数据中...");
            for (let key in app)
                this.playurl[key] = app[key];
            // duration向上取整
            this.playurl.dash.duration = Math.ceil(app.timelength / 1000);
            this.playurl.dash.minBufferTime = this.playurl.dash.min_buffer_time = 1.5;
            // 构造Promise序列以同时获取所有DASH媒体segment数据
            // 本应由播放器自行获取，B站官方称之为【首帧优化】却在缺失时直接报错导致播放器无法正常载入视频
            let arr = [];
            this.playurl.dash.video.forEach((d, i, e) => {
                arr.push((async (d) => {
                    RebuildPlayerurl.OBJ["sidx" + String(API.cid)] = RebuildPlayerurl.OBJ["sidx" + String(API.cid)] || {};
                    let id = d.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
                    if (d.SegmentBase)
                        RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id] = [d.SegmentBase.Initialization, d.SegmentBase.indexRange];
                    if (!RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        // 首个“sidx”出现4字节之前的部分为索引起始点
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        // 首个“mooc”出现前5字节结束索引
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        // 挂载到BLOD下，切换清晰度直接继承使用（以cid为切p标记）
                        RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        API.debug("DASH-video：", id, RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id]);
                    }
                    d.segment_base = {
                        initialization: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][0],
                        index_range: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][1]
                    };
                    d.SegmentBase = {
                        Initialization: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][0],
                        indexRange: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][1]
                    };
                    d.backupUrl = d.backup_url = d.backupUrl || d.backup_url || [];
                    d.baseUrl = d.base_url;
                    d.codecs = d.codecs || this.codecs.app[id] || this.codecs.default[id];
                    d.frameRate = d.frame_rate = d.frameRate || d.frame_rate || this.frameRate[id];
                    d.height = d.height || this.resolution[id][1];
                    d.width = d.width || this.resolution[id][0];
                    d.mimeType = d.mime_type = d.mimeType || d.mime_type || 'video/mp4';
                    d.sar = d.sar || "1:1";
                    d.startWithSAP = d.start_with_sap = d.startWithSAP || d.start_with_sap || 1;
                })(e[i]));
            });
            this.playurl.dash.audio = this.fixAudio(this.playurl.dash.audio);
            this.playurl.dash.audio.forEach((d, i, e) => {
                arr.push((async (d) => {
                    RebuildPlayerurl.OBJ["sidx" + String(API.cid)] = RebuildPlayerurl.OBJ["sidx" + String(API.cid)] || {};
                    let id = d.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
                    if (d.SegmentBase)
                        RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id] = [d.SegmentBase.Initialization, d.SegmentBase.indexRange];
                    if (!RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        API.debug("DASH-audio：", id, RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id]);
                    }
                    d.segment_base = {
                        initialization: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][0],
                        index_range: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][1]
                    };
                    d.SegmentBase = {
                        Initialization: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][0],
                        indexRange: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][1]
                    };
                    d.backupUrl = d.backup_url = d.backupUrl || d.backup_url || [];
                    d.baseUrl = d.base_url;
                    d.codecs = d.codecs || this.codecs.app[id] || this.codecs.default[id] || "mp4a.40.2";
                    d.mimeType = d.mime_type = d.mimeType || d.mime_type || 'audio/mp4';
                })(e[i]));
            });
            API.toast("等待数据回传...");
            if (arr[0])
                await Promise.all(arr);
            // video排序
            let avc = [], hev = [], video = [];
            this.playurl.dash.video.forEach((d) => {
                if (d.codecid == 7)
                    avc.push(d);
                else
                    hev.push(d);
            });
            let length = avc.length > hev.length ? avc.length : hev.length;
            for (let i = length - 1; i >= 0; i--) {
                if (avc[i])
                    video.push(avc[i]);
                if (hev[i])
                    video.push(hev[i]);
            }
            this.playurl.dash.video = video;
            API.toast.success("DASH数据重构成功！", "正在投喂给播放器...");
            API.debug.log(this.playurl);
            return this.playurl;
        }
        /**
         * 重构Thailand数据
         * @param ogv 原始数据
         */
        async ogvPlayurl(ogv) {
            API.toast("重构DASH数据中...");
            this.playurl.quality = ogv.data.video_info.quality;
            let num = this.playurl.accept_quality.indexOf(this.playurl.quality);
            this.playurl.format = this.playurl.accept_format.split(",")[num];
            this.playurl.timelength = ogv.data.video_info.timelength;
            this.playurl.accept_quality.splice(0, num);
            this.playurl.support_formats.splice(0, num);
            this.playurl.accept_description.splice(0, num);
            this.playurl.accept_format = this.playurl.accept_format.split(",");
            this.playurl.accept_format.splice(0, num);
            this.playurl.accept_format = this.playurl.accept_format.join(",");
            this.playurl.dash.duration = Math.ceil(this.playurl.timelength / 1000);
            this.playurl.dash.minBufferTime = this.playurl.dash.min_buffer_time = 1.5;
            let arr = [];
            ogv.data.video_info.stream_list.forEach((d) => {
                if (d.dash_video && d.dash_video.base_url) {
                    arr.push((async (d) => {
                        RebuildPlayerurl.OBJ["sidx" + String(API.cid)] = RebuildPlayerurl.OBJ["sidx" + String(API.cid)] || {};
                        let id = d.dash_video.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
                        if (!RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id]) {
                            let data = new Uint8Array(await this.getIdxs(d.dash_video.base_url, this.playurl.dash.duration));
                            let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                            let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                            let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                            RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                            API.debug("DASH-video：", id, RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id]);
                        }
                        this.playurl.dash.video.push({
                            SegmentBase: {
                                Initialization: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][0],
                                indexRange: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][1]
                            },
                            segment_base: {
                                initialization: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][0],
                                index_range: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][1]
                            },
                            backupUrl: [],
                            backup_url: [],
                            bandwidth: d.dash_video.bandwidth,
                            baseUrl: d.dash_video.base_url,
                            base_url: d.dash_video.base_url,
                            codecid: d.dash_video.codecid,
                            codecs: this.codecs.app[id] || this.codecs.default[id],
                            frameRate: this.frameRate[id],
                            frame_rate: this.frameRate[id],
                            height: this.resolution[id][1],
                            id: d.stream_info.quality,
                            md5: d.dash_video.md5,
                            mimeType: "video/mp4",
                            mime_type: "video/mp4",
                            sar: "1:1",
                            size: d.dash_video.size,
                            startWithSAP: 1,
                            start_with_sap: 1,
                            width: this.resolution[id][0]
                        });
                    })(d));
                }
            })(ogv.data.video_info.dash_audio).forEach((d) => {
                arr.push((async (d) => {
                    RebuildPlayerurl.OBJ["sidx" + String(API.cid)] = RebuildPlayerurl.OBJ["sidx" + String(API.cid)] || {};
                    let id = d.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
                    if (!RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        API.debug("DASH-audio：", id, RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id]);
                    }
                    this.playurl.dash.audio.push({
                        SegmentBase: {
                            Initialization: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][0],
                            indexRange: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][1]
                        },
                        segment_base: {
                            initialization: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][0],
                            index_range: RebuildPlayerurl.OBJ["sidx" + String(API.cid)][id][1]
                        },
                        backupUrl: [],
                        backup_url: [],
                        bandwidth: d.bandwidth,
                        baseUrl: d.base_url,
                        base_url: d.base_url,
                        codecid: d.codecid,
                        codecs: this.codecs.app[id] || this.codecs.default[id],
                        frameRate: "",
                        frame_rate: "",
                        height: 0,
                        id: id,
                        md5: d.md5,
                        mimeType: "audio/mp4",
                        mime_type: "audio/mp4",
                        sar: "",
                        size: d.size,
                        startWithSAP: 0,
                        start_with_sap: 0,
                        width: 0
                    });
                })(d));
            });
            API.toast("等待数据回传...");
            await Promise.all(arr);
            API.toast.success("DASH数据重构成功！", "正在投喂给播放器...");
            API.debug.log(this.playurl);
            return this.playurl;
        }
    }
    RebuildPlayerurl.OBJ = {};
    API.RebuildPlayerurl = RebuildPlayerurl;

//# sourceURL=API://@Bilibili-Old/include/rebuildPlayerurl.js`;
/*!***********************!*/
/**/modules["rewrite.js"] = /*** ./dist/include/rewrite.js ***/
`"use strict";
    /**
     * 重写页面工具
     * 请继承本接口并定义对应页面专属属性和方法。
     * 1. 在modules接口中拓展旧版网页框架名并于html目录下准备好网页框架（剔除所有script标签）。
     * 2. 将所有剔除的script**严格依次**以属性键值对像添加进script数组中，内联脚本文本属性名为\`text\`。
     * 3. 部分页面需要构造\`__INITIAL_STATE__\`数据，请在重构页面(\`flushDocument\`)前准备好并写入window变量下。
     * 5. 需要页面重构完再执行的回调函数请复制给\`onload\`属性，可以添加多个，不会相互覆盖，且异步并行回调。
     * 6. 重写页面要异步等待外源脚本加载完，完成后推送\`load\`\`DOMContentLoaded\`等标准事件。
     */
    class Rewrite {
        /** @param 旧版网页框架名，**请移除其中的script标签** */
        constructor(html) {
            this.url = new URL(location.href);
            this.__INITIAL_STATE__ = {};
            /** 旧版脚本序列，初始化请复制给\`scripts\`！ */
            this.script = [];
            /** 重写页面前需要清理的全局变量污染 */
            this.dush = [
                // "__INITIAL_STATE__",
                "__PGC_USERSTATE__",
                "__BILI_CONFIG__",
                "Sentry",
                "__mobxGlobals",
                "__mobxInstanceCount",
                "_babelPolyfill",
                "BilibiliPlayer",
                "BiliJsBridge",
                "LazyLoad",
                "lazyload",
                "regeneratorRuntime",
                "ownKeys",
                "asyncGeneratorStep",
                "Bjax",
                "BPlayer",
                "BwpElement",
                "BwpMediaSource",
                "bbComment",
                "bPlayer",
                "EmbedPlayer",
                "GrayManager",
                "PlayerAgent",
                "PlayerSetOnline",
                "abtest",
                "ad_rp",
                "ad_url",
                "bPlayer",
                "bsourceFrom",
                "dashjs",
                "deltaFilter",
                "directiveDispatcher",
                "ep",
                "flashChecker",
                "flvjs",
                "getAuthorInfo",
                "getCookie",
                "getIEVersion",
                "gqs",
                "heimu",
                "insertLink",
                "insertScript",
                "iris",
                "isBiliPlayer",
                "isEmbedPlayer",
                "isInit",
                "jsurl",
                "jsUrls",
                "loadLink",
                "loadScript",
                "loginInfoCallbacks",
                "md",
                "nano",
                "nanoWidgetsJsonp",
                "player",
                "playerInfo",
                "player_fullwin",
                "player_widewin",
                "rec_rp",
                "regeneratorRuntime",
                "reportConfig",
                "reportFistAdFs",
                "reportObserver",
                "setSize",
                "setSizeStyle",
                "spmReportData",
                "vd",
                "videoWidgetsJsonP",
                "webAbTest",
                "webpackJsonp",
                "__getClientLogo",
                "_arrayLikeToArray",
                "_arrayWithHoles",
                "_arrayWithoutHoles",
                "_asyncToGenerator2",
                "_classCallCheck",
                "_createClass",
                "_createForOfIteratorHelper",
                "_defineProperties",
                "_defineProperty",
                "_iterableToArray",
                "_iterableToArrayLimit",
                "_nonIterableRest",
                "_nonIterableSpread",
                "_objectSpread",
                "_slicedToArray",
                "_toConsumableArray",
                "_typeof",
                "_unsupportedIterableToArray",
                "el",
                "BiliCm",
                "BiliHeader",
                "webpackJsonpwebpackLogReporter",
                "webpackLogReporter",
                "core",
                "__getClientLogo",
                "_arrayLikeToArray",
                "_arrayWithoutHoles",
                "_iterableToArray",
                "_nonIterableSpread",
                "_toConsumableArray",
                "_unsupportedIterableToArray",
                "AttentionList",
                "UserStatus",
                "biliQuickLogin",
                "clearImmediate",
                "jvsCert",
                "loadLoginStatus",
                "mOxie",
                "moxie",
                "o",
                "onLoginInfoLoaded",
                "plupload",
                "recaptcha",
                "setImmediate",
                "setTid",
                "show1080p",
                "showCoopModal",
                "showPay",
                "swfobject",
                "tabSocket",
                "__BiliUser__",
                "___grecaptcha_cfg",
                "__core-js_shared__",
            ];
            /** 重写完页面执行的回调函数 */
            this.loadendCallback = [];
            this.cleard = false;
            this.title = document.title;
            if (API.config.compatible === "极端") {
                GM.DOM.write(API.getModule(html));
                GM.DOM.close();
            }
            else {
                API.config.compatible === "默认" && window.stop();
                document.replaceChild(document.implementation.createDocumentType('html', '', ''), document.doctype);
                document.documentElement.replaceWith((new DOMParser().parseFromString(API.getModule(html), 'text/html')).documentElement);
            }
            (!this.title.includes("出错")) && (document.title = this.title);
            this.restorePlayerSetting();
            API.switchVideo(() => this.setActionHandler());
        }
        /** 添加重写完页面执行的回调函数 */
        set onload(v) {
            this.loadendCallback.push(v);
        }
        /** 修复播放器设置，新版播放器修改过播放器设置，这会导致旧版播放器设置读取异常。 */
        async restorePlayerSetting() {
            var _a;
            let setting = API.localStorage.getItem("bilibili_player_settings");
            if (setting) {
                if (((_a = setting.video_status) === null || _a === void 0 ? void 0 : _a.autopart) !== "") {
                    return GM.setValue("bilibili_player_settings", setting);
                }
            }
            setting = GM.getValue("bilibili_player_settings");
            setting && API.localStorage.setItem("bilibili_player_settings", setting);
        }
        /** 清洗页面及全局变量 */
        clearWindow() {
            this.cleard = true;
            this.dush.forEach(d => {
                try {
                    Reflect.deleteProperty(window, d);
                }
                catch (e) {
                    window[d] = undefined;
                    API.debug(d);
                }
            });
            API.loadVideoScript();
            if (API.config.videospeed) { // 记忆播放器速率
                const videospeed = GM.getValue("videospeed");
                if (videospeed) {
                    let setting = API.sessionStorage.getItem("bilibili_player_settings");
                    setting ? setting.video_status ? setting.video_status.videospeed = videospeed : setting.video_status = { videospeed } : setting = { video_status: { videospeed } };
                    API.sessionStorage.setItem("bilibili_player_settings", setting);
                }
                API.switchVideo(() => {
                    API.runWhile(() => document.querySelector("#bofqi").querySelector("video"), () => {
                        document.querySelector("#bofqi").querySelector("video").addEventListener("ratechange", e => GM.setValue("videospeed", e.target.playbackRate || 1));
                    });
                });
            }
        }
        /** 刷新页面，将进入脚本插入循环，页面重构完成请通过\`onload\`属性回调 */
        flushDocument() {
            !this.cleard && this.clearWindow();
            !(this.script.length === 0) ? this.loadScript(this.script[0]) : this.loadenEvent();
        }
        /**
         * 脚本插入循环
         * @param obj 脚本属性数据
         */
        loadScript(obj) {
            if (obj.defer) { // defer脚本重新追加向最后
                const temp = this.script.shift();
                delete obj.defer;
                this.script.push(temp);
                return this.flushDocument();
            }
            const script = document.createElement("script");
            if (obj.text) { // 内联脚本
                script.text = obj.text;
                delete obj.text;
            }
            if (obj.src) { // 外源脚本需等待返回
                script.addEventListener("load", () => {
                    this.script.shift();
                    this.flushDocument();
                });
                script.addEventListener("error", () => {
                    this.script.shift();
                    this.flushDocument();
                });
            }
            Object.entries(obj).forEach(d => { script.setAttribute(d[0], d[1]); });
            document.body.appendChild(script);
            if (!obj.src) { // 非外源脚本立刻返回
                this.script.shift();
                this.flushDocument();
            }
        }
        /** 重写完信息通知 */
        loadenEvent() {
            this.loadendCallback.forEach(async (d) => d());
            if (API.config.compatible === "默认") {
                document.dispatchEvent(new ProgressEvent("readystatechange"));
                document.dispatchEvent(new ProgressEvent("DOMContentLoaded"));
                window.dispatchEvent(new ProgressEvent("DOMContentLoaded"));
                window.dispatchEvent(new ProgressEvent("load"));
            }
        }
        /** 添加媒体控制 */
        setActionHandler() {
            navigator.mediaSession.setActionHandler('play', () => window.player.play());
            navigator.mediaSession.setActionHandler('pause', () => window.player.pause());
            navigator.mediaSession.setActionHandler('seekbackward', () => window.player.seek(window.player.getCurrentTime() - 10));
            navigator.mediaSession.setActionHandler('seekforward', () => window.player.seek(window.player.getCurrentTime() + 10));
            navigator.mediaSession.setActionHandler('previoustrack', () => window.player.prev());
            navigator.mediaSession.setActionHandler('nexttrack', () => window.player.next());
        }
        /** 临时禁用重写并跳转回新版页面 */
        stop(reason) {
            API.sessionStorage.setItem("disable_rewrite", reason);
            location.reload();
        }
    }
    API.Rewrite = Rewrite;

//# sourceURL=API://@Bilibili-Old/include/rewrite.js`;
/*!***********************!*/
/**/modules["setting.js"] = /*** ./dist/include/setting.js ***/
`"use strict";
    API.registerSetting({
        key: "logReport",
        sort: "common",
        label: "日志拦截",
        svg: '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75h14.5a.75.75 0 000-1.5H1.5V1.75zm14.28 2.53a.75.75 0 00-1.06-1.06L10 7.94 7.53 5.47a.75.75 0 00-1.06 0L3.22 8.72a.75.75 0 001.06 1.06L7 7.06l2.47 2.47a.75.75 0 001.06 0l5.25-5.25z"></path></svg>',
        sub: "拦截B站日志上报",
        float: "网页端日志采集太频繁，稍微动下鼠标都要发送数条日志请求，给network调试带来额外的困扰。",
        type: "switch",
        value: false
    });
    API.registerSetting({
        key: "av",
        sort: "rewrite",
        label: "av/BV",
        type: "switch",
        value: true,
        float: '重构以恢复旧版av视频播放页。'
    });
    API.registerSetting({
        key: "limit",
        sort: "player",
        label: "解除区域/平台限制",
        sub: "港澳台？泰版？仅限APP？",
        float: "同类功能脚本可能会冲突，使用专用脚本切莫开启本功能！",
        type: "sort",
        list: [
            {
                key: "videoLimit",
                sort: "player",
                label: "解除限制",
                type: "switch",
                value: false,
                sub: "区域+APP"
            }, {
                key: "limitAccesskey",
                sort: "player",
                label: "账户授权",
                sub: "泰区除外",
                type: "action",
                title: "管理",
                action: () => { API.importModule("accesskey.js"); }
            }, {
                key: "limitServer",
                sort: "player",
                label: "泰区代理",
                type: "input",
                value: "https://global.bilibili.com",
                float: "泰区番剧限制需要自备相应的代理服务器（需要https协议头但无需末尾的斜杠！）</br>中文域名请先使用punycode转化一下。</br>本功能由于缺乏调试条件维护不善请多担待！",
                input: { type: "url", placeholder: "URL" },
                pattern: /(\\w+):\\/\\/([^/:]+)(:\\d*)?([^# ]*)/
            }
        ]
    });
    API.registerSetting({
        key: "protoDm",
        sort: "danmaku",
        label: "启用新版弹幕",
        sub: "proto弹幕",
        type: "switch",
        value: true,
        float: \`添加旧版播放器新版proto弹幕支持。由于旧版xml弹幕已获取不到90分钟后的弹幕，本功能不建议禁用。</br>”\`
    });
    API.registerSetting({
        key: "section",
        sort: "style",
        label: "统一换回旧版顶栏",
        sub: "针对未重构的页面",
        type: "switch",
        value: true,
        float: '非重构页面顶栏底栏也替换为旧版。'
    });
    API.registerSetting({
        key: "danmakuHashId",
        sort: "danmaku",
        label: "反查弹幕发送者",
        sub: "结果仅供参考！",
        type: "switch",
        value: false,
        float: '旧版播放器上右键弹幕将显示弹幕发送者。</br>※ 使用哈希逆向算法，存在碰撞可能性，所示信息仅供参考，或者干脆查不出来。'
    });
    API.registerSetting({
        key: "noVideo",
        sort: "player",
        label: "flash播放器",
        sub: "可用于临时不加载视频进入视频页面",
        float: "临时启用flash播放器以拦截播放器载入，如需下载视频可切换到“下载”标签呼出下载面板，恢复播放器请点击HTML5按钮或在设置中关闭本功能。",
        type: "switch",
        value: false
    });
    API.registerSetting({
        key: "compatible",
        sort: "common",
        label: "页面重构模式",
        svg: \`<svg viewBox="0 0 24 24"><g><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></g></svg>\`,
        type: "row",
        sub: "页面不正常时的选择",
        value: "默认",
        list: ["极端", "默认", "兼容"],
        float: \`“默认”模式下会中止默认DOM树的解析，更有效地保障旧版页面不被新版脚本破坏，但可能引发部分浏览器扩展（如pakku.js）功能异常。</br>“兼容”模式可改善这一问题，但加剧了旧版页面被破坏的可能性。</br>另有“极端”模式，恢复经典的“重写”模式，此模式恢复的页面稳定性最佳，但与其他脚本或浏览器扩展兼容性最差，任何在本脚本之前或与本脚本同时注入页面的脚本或浏览器扩展的"content.js"功能都受到影响。</br>很抱歉还是没能找到两全的办法，请自行按需调整。\`
    });
    API.registerSetting({
        key: "enlike",
        sort: "player",
        label: "添加点赞功能",
        sub: "自制、简陋",
        type: "switch",
        value: false,
        float: "旧版播放器的时代点赞功能还未存在，本脚本代为设计了个丑丑的点赞功能。注意对于bangumi，点赞数据计算的是单P的。"
    });
    API.registerSetting({
        key: "electric",
        sort: "player",
        label: "跳过充电鸣谢",
        sub: "在视频末尾",
        type: "switch",
        value: false
    });
    API.registerSetting({
        key: "upList",
        sort: "style",
        label: "UP主列表",
        sub: "展示合作者",
        type: "switch",
        value: false
    });
    API.registerSetting({
        key: "commandDm",
        sort: "danmaku",
        label: "添加互动弹幕",
        sub: "投票弹窗等",
        type: "switch",
        value: false,
        float: \`可以使用新版的一些弹窗互动组件。目前可用组件：评分弹窗、投屏弹窗、关联视频跳转按钮、带“UP主”标识弹幕。</br>※ <strong>需要同时开启新版proto弹幕。</strong>\`
    });
    API.registerSetting({
        key: "bangumi",
        sort: "rewrite",
        label: "bangumi",
        sub: "ss/ep",
        type: "switch",
        value: true,
        float: '重构以恢复旧版bangumi播放页。'
    });
    API.registerSetting({
        type: "switch",
        key: "watchlater",
        label: "稍后再看",
        value: true,
        sort: "rewrite",
        float: '重构以恢复旧版稍后再看。'
    });
    API.registerSetting({
        type: "switch",
        key: "player",
        label: "嵌入",
        value: true,
        sort: "rewrite",
        float: '重构以恢复旧版嵌入播放器。'
    });
    API.registerSetting({
        type: "switch",
        key: "index",
        label: "主页",
        value: true,
        sort: "rewrite",
        float: '重构以恢复旧版主页'
    });
    API.registerSetting({
        type: "switch",
        key: "ranking",
        label: "排行榜",
        value: true,
        sort: "rewrite",
        float: "重构以恢复旧版全站排行榜。"
    });
    API.registerSetting({
        key: "anime",
        sort: "rewrite",
        label: "番剧主页",
        type: "switch",
        value: false,
        float: '重构以恢复旧版番剧主页。'
    });
    API.registerSetting({
        type: "switch",
        key: "read",
        label: "专栏",
        value: true,
        sort: "rewrite",
        float: "重构以启用旧版专栏。"
    });
    API.registerSetting({
        key: "medialist",
        sort: "rewrite",
        label: "medialist",
        type: "switch",
        value: true,
        float: "用旧版av页重构medialist页面。该页面使用曾经的播单页面进行模拟，初始状态视频数据为20，你可以滚送到播单底部以动态加载更多。另外由于播单已被官方禁用，您无法对播单进行收藏等操作，也不能访问播单详情页面。"
    });
    API.registerSetting({
        key: "danmakuFirst",
        sort: "style",
        label: "自动切换到弹幕列表",
        sub: "默认是展示推荐视频",
        float: "自动从推荐视频切换到播放弹幕列表。",
        type: "switch",
        value: false
    });
    API.registerSetting({
        type: "sort",
        key: "autoDo",
        label: "自动化操作",
        sort: "player",
        sub: "进入播放页面及切P时",
        list: [{
                key: "showBofqi",
                sort: "style",
                label: "自动滚动到播放器",
                type: "switch",
                value: false
            }, {
                key: "screenWide",
                sort: "style",
                label: "自动宽屏",
                type: "switch",
                value: false,
                action: v => v && (API.config.webFullScreen = false)
            }, {
                key: "noDanmaku",
                sort: "style",
                label: "自动关弹幕",
                type: "switch",
                value: false
            }, {
                key: "autoPlay",
                sort: "style",
                label: "自动播放",
                type: "switch",
                value: false
            }, {
                key: "webFullScreen",
                sort: "style",
                label: "自动网页全屏",
                type: "switch",
                value: false,
                action: v => v && (API.config.screenWide = false)
            }, {
                key: "videospeed",
                sort: "player",
                label: "记忆播放速率",
                type: "switch",
                value: false
            }]
    });
    API.registerSetting({
        key: "heartbeat",
        sort: "restore",
        label: "修复视频心跳",
        sub: "出现不记录播放历史症状时的选择",
        float: "尝试修复可能被广告拦截扩展误伤的视频心跳。",
        type: "switch",
        value: false
    });
    API.registerSetting({
        type: "switch",
        key: "unloginPopover",
        label: "移除未登录弹窗",
        sub: "有些时候就是不喜欢登录",
        value: false,
        sort: "style"
    });
    API.registerSetting({
        key: "bangumiEplist",
        sort: "player",
        label: "保留番剧回目列表",
        sub: "牺牲特殊背景图",
        type: "switch",
        value: false,
        float: '部分带特殊背景图片的番剧会隐藏播放器下方的番剧回目列表，二者不可得兼，只能选一。'
    });
    API.registerSetting({
        key: "episodeData",
        sort: "style",
        label: "显示番剧分集数据",
        sub: "原本是合集数据",
        type: "switch",
        value: false,
        float: '有分集数据时将bangumi播放、弹幕数替换为当集数据。原合集数据将显示在鼠标焦点信息上。'
    });
    API.registerSetting({
        type: "switch",
        key: "history",
        label: "只显示视频历史",
        sub: "去除专栏、直播记录",
        value: false,
        sort: "style"
    });
    API.registerSetting({
        type: "switch",
        key: "searchHistory",
        label: "去除历史记录页面搜索框",
        sub: "其实留着也没什么",
        value: false,
        sort: "style"
    });
    API.registerSetting({
        type: "switch",
        key: "indexLoc",
        label: "过滤主页广告",
        sub: "banner+recommand",
        value: false,
        sort: "style",
        float: '当然指的是旧版主页。'
    });
    API.registerSetting({
        type: "switch",
        key: "privateRecommend",
        label: "禁用主页个性化推荐",
        sub: "还是习惯全站统一推荐",
        value: false,
        sort: "style",
        float: '禁用旧版主页banner右边的个性化推荐，恢复全站统一推荐。'
    });
    API.registerSetting({
        type: "switch",
        key: "liveP2p",
        label: "禁止P2P上传",
        sub: "小水管禁不起别人白嫖！",
        value: true,
        sort: "live",
        float: "禁止直播间使用WebRTC进行P2P共享上传，以免暴露ip地址，并为小水管节约带宽。"
    });
    API.registerSetting({
        type: "switch",
        key: "sleepCheck",
        label: "禁止挂机检测",
        sub: "就喜欢挂后台听个响不行吗！",
        value: true,
        sort: "live",
        float: "禁止直播间5分钟不操作判定挂机并切断直播，可以放心挂后台听个响。"
    });
    API.registerSetting({
        type: "switch",
        key: "errands",
        label: '恢复对于<a href="//space.bilibili.com/11783021" target="_blank">番剧出差</a>和<a href="//space.bilibili.com/1988098633" target="_blank">DM組</a>的访问',
        sub: '还好没赶尽杀绝',
        value: true,
        sort: "restore",
        float: '使用备份数据修复对于番剧出差官方空间的访问。'
    });
    API.registerSetting({
        type: "switch",
        key: "album",
        label: "还原个人空间相簿链接",
        sub: "相簿比动态页面好看",
        value: false,
        sort: "restore",
        float: '将个人空间的相簿链接从动态重定向回原来的相簿。'
    });
    API.registerSetting({
        type: "switch",
        key: "jointime",
        label: "显示账号注册时间",
        sub: "历史不该被隐藏",
        value: false,
        sort: "restore",
        float: '在空间显示对应账号的注册时间。'
    });
    API.registerSetting({
        key: "lostVideo",
        sort: "restore",
        label: "修复失效视频信息",
        sub: \`有些甚至评论还在！\`,
        type: "switch",
        value: false,
        float: '使用第三方数据修复收藏、频道等处的失效视频信息。（以红色删除线标记）</br>访问失效视频链接时将尝试重建av页面。</br>※ 依赖第三方数据库且未必有效，<strong>请谨慎考虑是否开启！</strong>'
    });
    API.registerSetting({
        type: "switch",
        sort: "download",
        key: "downloadContentmenu",
        label: "右键菜单",
        sub: "播放画面上右键添加下载菜单",
        value: false
    });
    API.registerSetting({
        type: "row",
        sort: "download",
        key: "downloadMethod",
        label: "下载方式",
        value: "右键保存",
        list: ["右键保存", "ef2", "aria2", "aira2 RPC"],
        action: (v) => {
            switch (v) {
                case "ef2":
                    API.alertMessage(\`<a href="https://github.com/MotooriKashin/ef2/releases" target="_blank">EF2</a>是作者开发的一款从浏览器中拉起IDM进行下载的中间软件，可以非常方便地传递下载数据给IDM，并支持自定义文件名、保存目录等。<strong>您必须安装了ef2和IDM才能使用本方式！</strong>\`).then(d => {
                        d ? API.changeSettingMode({ referer: false, useragent: false, filepath: false, IDMLater: false, IDMToast: false, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }) :
                            (API.config.downloadMethod = "右键保存", API.changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
                        API.displaySetting("downloadMethod");
                    });
                    break;
                case "aria2":
                    API.alertMessage(\`aria2是一款著名的命令行下载工具，使用本方式将在您点击下载面板中的链接时将命令行复制到您的剪切板中，您可以粘贴到cmd等终端中回车进行下载。<strong>您必须先下载aria2工具并添加系统环境变量或者在终端在打开aria2二进制文件所在目录！</strong>\`).then(d => {
                        d ? API.changeSettingMode({ referer: false, useragent: false, filepath: false, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }) :
                            (API.config.downloadMethod = "右键保存", API.changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLate: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
                        API.displaySetting("downloadMethod");
                    });
                    break;
                case "aira2 RPC":
                    API.alertMessage(\`aria2支持RPC方式接收下载数据，您需要在aria2配置开启RPC功能并保持后台运行，并在本脚本设置中配置好aria2主机及端口。</br>点击确定将刷新设置面板并呈现相关设置。\`).then(d => {
                        d ? API.changeSettingMode({ referer: false, useragent: false, filepath: false, IDMLater: true, IDMToast: true, rpcServer: false, rpcPort: false, rpcToken: false, rpcTest: false }) :
                            (API.config.downloadMethod = "右键保存", API.changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
                        API.displaySetting("downloadMethod");
                    });
                    break;
                default:
                    API.changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true });
                    API.displaySetting("downloadMethod");
            }
        }
    });
    API.registerSetting({
        type: "action",
        key: "downloadNow",
        label: "下载面版",
        title: "呼出",
        sub: "只在视频页面有效",
        sort: "download",
        disabled: 0,
        action: () => {
            if (API.aid && API.cid) {
                API.download();
            }
            else
                API.toast.warning("当前并非视频页，请在视频页面打开！");
        }
    });
    API.registerSetting({
        type: "switch",
        sort: "download",
        key: "TVresource",
        label: "请求TV源",
        sub: "无水印",
        value: false,
        float: \`请求TV端的视频源，该端口可以获取到无水印的视频源（mp4格式除外），</br><strong>此类源无法以“右键保存”方式下载，请改用ef2或者aria2，且“referer”选项必须置空！</strong></br>大会员专享类视频下载将要求电视端大会员，与一般大会员不互通。授权大会员状态请尝试设置-播放-解除区域/平台限制-账户授权(有效性待测！)\`
    });
    API.registerSetting({
        type: "mutlti",
        sort: "download",
        key: "downloadList",
        label: "视频类型",
        sub: "右键呼出下载时请求的类型",
        value: ["mp4", "dash", "flv"],
        list: ["mp4", "dash", "flv"],
        float: '下载功能会自动读取播放器已载入的视频源并呈现在下载面板上，即使未勾选对应的视频类型。</br>勾选了也不一定能获取到该类型的视频源。'
    });
    API.registerSetting({
        type: "row",
        sort: "download",
        key: "downloadQn",
        label: "默认画质",
        sub: "针对flv格式",
        value: 127,
        list: ["0", 15, 16, 32, 48, 64, 74, 80, 112, 116, 120, 125, 126, 127],
        float: '画质qn参数，数值越大画质越高，0表示自动。64（720P）以上需要登录，112（1080P+）以上需要大会员。一般只需设置为最大即可，会自动获取到能获取的最高画质。'
    });
    API.registerSetting({
        type: "input",
        sort: "download",
        key: "useragent",
        label: "User-Agent",
        value: "Bilibili Freedoooooom/MarkII",
        input: { type: "text" },
        float: \`用户代理，此值不可为空，默认使用B站客户端专属UA。\`,
        hidden: API.config.downloadMethod == "右键保存"
    });
    API.registerSetting({
        type: "input",
        sort: "download",
        key: "referer",
        label: "referer",
        value: location.origin,
        input: { type: "text" },
        float: \`一般为B站主域名(http://www.bilibili.com)。</br><strong>APP/TV等视频源必须为空！</strong>\`,
        hidden: API.config.downloadMethod == "右键保存"
    });
    API.registerSetting({
        type: "input",
        sort: "download",
        key: "filepath",
        label: "保存目录",
        value: "",
        input: { type: "text", placeholder: "如：D\\\\下载" },
        float: 'windows端请注意反斜杠！',
        hidden: API.config.downloadMethod == "右键保存"
    });
    API.registerSetting({
        key: "rpcToken",
        sort: "download",
        label: "RPC令牌（可选）",
        type: "input",
        input: { type: "password" },
        value: "",
        hidden: API.config.downloadMethod != "aira2 RPC"
    });
    API.registerSetting({
        key: "rpcServer",
        sort: "download",
        label: "RPC主机",
        type: "input",
        input: { type: "url", placeholder: "如：http(s)://localhost" },
        value: "http://localhost",
        hidden: API.config.downloadMethod != "aira2 RPC"
    });
    API.registerSetting({
        key: "rpcPort",
        sort: "download",
        label: "RPC端口",
        type: "input",
        input: { type: "number", placeholder: "如：6800" },
        value: 6800,
        hidden: API.config.downloadMethod != "aira2 RPC"
    });
    API.registerSetting({
        key: "rpcTest",
        sort: "download",
        label: "RPC调试",
        type: "action",
        title: "测试",
        hidden: API.config.downloadMethod != "aira2 RPC",
        action: () => {
            API.aria2.getVersion()
                .then(d => API.toast.success(\`RPC设置正常！aria2版本：\${d.version}\`))
                .catch(e => API.toast.error("RPC链接异常！请检查各项设置以及RPC主机的状况！", e));
        }
    });
    API.registerSetting({
        key: "IDMLater",
        sort: "download",
        label: "稍后下载",
        sub: "添加到IDM列表而不立即下载",
        type: "switch",
        value: false,
        float: "把下载链接添加到下载列表但是不立即开始下载，需要下载时再手动到IDM里开始。<strong>B站下载链接一般都有时效，太久不下载的话链接可能失效！</strong>",
        hidden: API.config.downloadMethod != "ef2"
    });
    API.registerSetting({
        key: "IDMToast",
        sort: "download",
        label: "静默下载",
        sub: "不用IDM确认框",
        type: "switch",
        value: false,
        float: "禁用IDM下载前的询问弹窗，其中可以选择修改文件名及保存目录等信息。",
        hidden: API.config.downloadMethod != "ef2"
    });
    API.registerSetting({
        key: "dlDmCC",
        sort: "download",
        label: "其他下载",
        sub: "弹幕、CC字幕等",
        type: "sort",
        list: [
            {
                key: "ifDlDmCC",
                sort: "download",
                label: "弹幕、CC字幕、封面",
                type: "switch",
                value: false
            },
            {
                key: "dlDmType",
                sort: "download",
                label: "弹幕格式",
                type: "row",
                value: "xml",
                list: ["xml", "json"],
                float: \`xml是经典的B站弹幕格式，json是旧版播放器直接支持的格式，本脚本载入本地弹幕功能同时支持这两种。</br>如果只是给本脚本专用那就选json，xml对“非法字符”支持不友好，部分高级/代码/BAS弹幕可能出错。\`
            }
        ]
    });
    API.registerSetting({
        key: "onlineDanmaku",
        sort: "danmaku",
        label: "在线弹幕",
        type: "input",
        float: '为当前旧版播放器载入其他站内视频弹幕，可以输入URL或者aid等参数。</br>※ 可配合选择是否合并已有弹幕。',
        input: { type: "url", placeholder: "URL" },
        title: "载入",
        hidden: true,
        action: (url) => {
            var _a;
            if (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku))
                return API.toast.warning("内部组件丢失，已停止！");
            API.danmaku.onlineDanmaku(url);
        }
    });
    API.registerSetting({
        key: "localMedia",
        sort: "player",
        label: "载入本地文件",
        sub: "视频/弹幕",
        type: "file",
        accept: [".mp4", ".xml", ".json"],
        float: '使用旧版播放器播放本地视频或者弹幕文件。</br>※ 视频只能为mp4格式，且编码格式被浏览器所兼容。</br>※ 若载入弹幕文件，参见弹幕设置是否合并弹幕。',
        title: "文件",
        hidden: true,
        action: (files) => {
            var _a;
            (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku)) && API.toast.warning("内部组件丢失，无法载入弹幕文件！");
            new API.LocalMedia(files);
        }
    });
    API.registerSetting({
        key: "allDanmaku",
        sort: "danmaku",
        label: "全弹幕装填",
        type: "sort",
        float: '获取所有能获取的历史弹幕。</br><strong>※ 该操作耗时较长且可能造成B站临时封接口，请慎用！</strong>',
        hidden: true,
        list: [{
                key: "allDanmakuDelay",
                sort: "danmaku",
                label: "冷却时间：/s",
                type: "input",
                value: 3,
                input: { type: "number", min: 1, max: 60, step: 0.5 },
                float: '接口冷却时间，时间长可以降低被临时封端口的几率。'
            },
            {
                key: "allDanmakuAction",
                sort: "danmaku",
                label: "开始获取",
                type: "action",
                title: "开始",
                action: function () {
                    var _a;
                    if (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku))
                        return API.toast.warning("内部组件丢失，已停止！");
                    new API.AllDanmaku();
                },
                disabled: 0
            }]
    });
    API.path && API.path.name && API.runWhile(() => API.path.name && window.player, () => {
        API.changeSettingMode({ onlineDanmaku: false, allDanmaku: false, localMedia: false });
    });
    API.registerSetting({
        type: "row",
        sort: "player",
        key: "codecType",
        label: "优先载入的视频编码类型",
        sub: "AVC、HEVC或AV1",
        value: "AVC",
        list: ["AVC", "HEVC", "AV1"],
        float: '播放器会尽量优先加载所选择的编码，可根据设备解码能力与实际需要调整这个设置项。AVC兼容性最佳，AV1次之，HEVC则只有Safari支持，edge可通过一些操作进行支持。有关视频编码格式可查阅其他专业文档。',
        action: type => {
            let mime = {
                "HEVC": 'video/mp4;codecs="hev1.1.6.L120.90"',
                "AV1": 'video/mp4;codecs="av01.0.01M.08.0.110.01.01.01.0"',
                "AVC": 'video/mp4;codecs="avc1.640028"'
            };
            if (!MediaSource.isTypeSupported(mime[type])) {
                API.toast.warning(\`播放器不支持\${type}编码格式\`, "将继续使用AVC编码");
                API.config.codecType = "AVC";
                API.displaySetting("codecType");
            }
        }
    });
    API.registerSetting({
        key: "configManage",
        sort: "common",
        svg: '<svg viewBox="0 0 24 24"><g><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></g></svg>',
        label: "设置数据",
        sub: "备份/恢复",
        type: "action",
        title: "管理",
        action: () => API.importModule("manage.js")
    });

//# sourceURL=API://@Bilibili-Old/include/setting.js`;
/*!***********************!*/
/**/modules["storage.js"] = /*** ./dist/include/storage.js ***/
`"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
    var _StorageInterface__;
    class StorageInterface {
        /**
         *
         * @param target 类型标记：真 ? sessionStorage : localStorage
         */
        constructor(target) {
            _StorageInterface__.set(this, void 0); // 类型标记：localStorage/sessionStorage
            __classPrivateFieldSet(this, _StorageInterface__, target, "f");
            // 原生Storage支持以属性形式获取/修改存储，使用get/set模拟。
            this.keys().forEach(d => Object.defineProperty(this, d, { get: () => this.getItem(d), set: v => this.setItem(d, v) }));
        }
        /** 清空！ */
        clear() {
            (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).clear();
        }
        ;
        /**
         * 读取
         * @param key 目标键名
         * @returns 格式化后的数据
         */
        getItem(key) {
            let str = (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).getItem(key);
            try {
                str = JSON.parse(str);
            }
            catch (e) { }
            return str;
        }
        ;
        /**
         * 列出键名数组
         * 原生Storage.key只返回但索引，感觉意义不大。
         * @returns 键名数组
         */
        keys() {
            return Object.keys((__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage));
        }
        ;
        /**
         * 移除
         * @param key 目标键名
         */
        removeItem(key) {
            (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).removeItem(key);
        }
        ;
        /**
         * 添加/修改
         * @param key
         * @param value
         */
        setItem(key, value) {
            switch (typeof value) {
                case "object":
                    (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).setItem(key, JSON.stringify(value));
                    break;
                case "function":
                    API.debug.warn("函数类型并不适合这样存储！", key, value);
                    break;
                default: (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).setItem(key, String(value));
            }
        }
        ;
        /** 条目总数 */
        get length() { return (__classPrivateFieldGet(this, _StorageInterface__, "f") ? self.sessionStorage : self.localStorage).length; }
    }
    _StorageInterface__ = new WeakMap();
    /** localStorage */
    class LocalStorage extends StorageInterface {
        constructor() { super(false); }
    }
    /** sessionStorage */
    class SessionStorage extends StorageInterface {
        constructor() { super(true); }
    }
    // 声明导出，值需要get/set代理以实时更新
    /** localStorage */
    API.localStorage = undefined;
    /** sessionStorage */
    API.sessionStorage = undefined;
    Object.defineProperties(API, {
        localStorage: { get: () => new LocalStorage(), set: () => false },
        sessionStorage: { get: () => new SessionStorage(), set: () => false }
    });

//# sourceURL=API://@Bilibili-Old/include/storage.js`;
/*!***********************!*/
/**/modules["switchVideo.js"] = /*** ./dist/include/switchVideo.js ***/
`"use strict";
    const switchlist = [];
    /**
     * 注册切P回调
     * 实际上是播放器每次初始化完成时回调，意思是首P也能用。
     * @param callback 切P时的回调函数
     */
    function switchVideo(callback) {
        try {
            if (typeof callback === "function")
                switchlist.push(callback);
        }
        catch (e) {
            API.toast.error("switchVideo.js", e);
        }
    }
    API.switchVideo = switchVideo;
    API.observerAddedNodes((node) => {
        if (/bilibili-player-area video-state-pause/.test(node.className)) {
            switchlist.forEach(async (d) => {
                try {
                    d();
                }
                catch (e) {
                    API.debug.error(d);
                    API.debug.error(e);
                }
            });
        }
    });

//# sourceURL=API://@Bilibili-Old/include/switchVideo.js`;
/*!***********************!*/
/**/modules["toast.js"] = /*** ./dist/include/toast.js ***/
`"use strict";
    class Toast {
        constructor() {
            this.info = Toast.show.bind(Toast, "info");
            this.success = Toast.show.bind(Toast, "success");
            this.warning = Toast.show.bind(Toast, "warning");
            this.error = Toast.show.bind(Toast, "error");
            Toast.init();
        }
        static init() {
            this.container = document.createElement("div");
            this.style = document.createElement("link");
            this.container.setAttribute("id", "toast-container");
            this.container.setAttribute("class", "toast-top-right");
            this.style.setAttribute("rel", "stylesheet");
            this.style.setAttribute("id", "toastr-style");
            this.style.setAttribute("href", "//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css");
        }
        static show(type, ...msg) {
            if (API.config.toastcheck === false)
                return;
            if (!document.body) {
                if (this.check)
                    return;
                return setTimeout(() => { this.check = true; this.show(type, ...msg); });
            }
            document.querySelector("#toastr-style") || document.head.appendChild(this.style);
            document.querySelector("#toast-container") || document.body.appendChild(this.container);
            this.box = document.querySelector("#toast-container") || this.container;
            let item = document.createElement("div");
            item.setAttribute("class", "toast toast-" + type);
            item.setAttribute("aria-live", "assertive");
            item.setAttribute("style", "visibility: hidden;position: absolute");
            setTimeout(() => {
                if (this.count > 0)
                    this.count--;
                item = this.box.insertBefore(item, this.box.firstChild);
                item.appendChild(this.msg(...msg));
                this.come(item);
                setTimeout(() => this.quit(item), (Number(API.config.toasttimeout) || 4) * 1000);
            }, this.count * (Number(API.config.toaststep) || 250));
            this.count++;
        }
        static come(item, i = 0) {
            let height = item.clientHeight;
            item.setAttribute("style", "display: none;");
            let timer = setInterval(() => {
                i++;
                item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
                if (i === this.sence) {
                    clearInterval(timer);
                    item.removeAttribute("style");
                }
            });
        }
        static quit(item, i = this.sence) {
            let height = item.clientHeight;
            let timer = setInterval(() => {
                i--;
                item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
                if (i === 0) {
                    clearInterval(timer);
                    item.remove();
                    if (!this.box.firstChild)
                        this.box.remove();
                }
            });
        }
        static msg(...msg) {
            let div = document.createElement("div");
            div.setAttribute("class", "toast-message");
            div.innerHTML = msg.reduce((s, d, i) => {
                s = s + (i ? "<br />" : "") + String(d);
                return s;
            }, "");
            return div;
        }
    }
    /** 未呈现通知计数 */
    Toast.count = 0;
    /** 动画呈现帧数 */
    Toast.sence = 60;
    const _ = new Toast();
    /**
     * toastr
     * toast.info的重定向，剩下的请访问对应属性
     * @param msg 消息字符串
     */
    function toast(...msg) { API.debug.debug(...msg); _.info(...msg); }
    API.toast = toast;
    toast.info = function (...msg) { API.debug.debug(...msg); _.info(...msg); };
    toast.success = function (...msg) { API.debug.log(...msg); _.success(...msg); };
    toast.warning = function (...msg) { API.debug.warn(...msg); _.warning(...msg); };
    toast.error = function (...msg) { API.debug.error(...msg); _.error(...msg); };

//# sourceURL=API://@Bilibili-Old/include/toast.js`;
/*!***********************!*/
/**/modules["ui.js"] = /*** ./dist/include/ui.js ***/
`"use strict";
    API.registerSetting({
        key: "settingEntryType",
        svg: '<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></svg>',
        sort: "common",
        type: "switch",
        label: "经典设置入口",
        sub: "贴边隐藏",
        value: false
    });
    // @ts-expect-error 专属变量
    const menu = MENU, setting = SETTING;
    class Ui {
        constructor() {
            const history = GM.getValue("history", {});
            Ui.history = new Proxy(history, {
                set: (_target, p, value) => {
                    history[p] = value;
                    GM.setValue("history", history);
                    return true;
                },
                get: (_target, p) => history[p]
            });
            this.stage();
        }
        /**
         * 设置入口
         */
        async stage() {
            if (API.config.settingEntryType)
                return this.classical();
            const div = API.addElement("div").attachShadow({ mode: "closed" });
            const stage = API.addElement("div", { class: "stage" }, div, \`<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></svg>\`);
            API.addCss(API.getModule("ui-stage.css"), "", div);
            stage.onclick = () => this.display();
            stage.onmouseover = () => stage.style.opacity = "0.8";
            setTimeout(() => {
                stage.style.opacity = "0";
                stage.onmouseout = () => stage.style.opacity = "0";
            }, 2e3);
        }
        /**
         * 经典设置入口
         */
        async classical() {
            const div = API.addElement("div").attachShadow({ mode: "closed" });
            const classical = API.addElement("div", { class: "classical" }, div, \`<i></i><span>设置</span>\`);
            API.addCss(API.getModule("ui-stage.css"), "", div);
            classical.onclick = () => this.display();
        }
        /**
         * 呈现设置界面
         * @param key 设置项的key，直接滚动到对应设置
         */
        display(key) {
            var _a;
            (_a = document.querySelector("#ui-border-box")) === null || _a === void 0 ? void 0 : _a.remove();
            Ui.borderBox();
            setting.reduce((s, d) => {
                d.sort && !s.includes(d.sort) && (Ui.menuitem(d.sort), s.push(d.sort));
                Ui.index(d);
                return s;
            }, []);
            document.body.appendChild(Ui.box);
            Ui.tool.childNodes.forEach((d, i) => {
                (i < (Ui.tool.childNodes.length - 1)) && (d.style.opacity = "0");
            });
            Ui.tool.onmouseover = () => {
                Ui.tool.childNodes.forEach((d, i) => {
                    (i < (Ui.tool.childNodes.length - 1)) && (d.style.opacity = "1");
                });
            };
            Ui.tool.onmouseout = () => {
                Ui.tool.childNodes.forEach((d, i) => {
                    (i < (Ui.tool.childNodes.length - 1)) && (d.style.opacity = "0");
                });
            };
            key && Reflect.has(Ui.list, key) && Ui.list[key].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        static borderBox() {
            this.box = document.createElement("div");
            this.box.setAttribute("id", "ui-border-box");
            const root = this.box.attachShadow({ mode: "closed" });
            const div = API.addElement("div", { class: "box" }, root, \`<div class="tool"></div>
            <div class="content">
                <div class="contain">
                    <div class="menu"></div>
                    <div class="item"></div>
                </div>
            </div>\`);
            API.addCss(API.getModule("ui.css"), "", root);
            this.tool = div.children[0];
            this.menu = div.children[1].children[0].children[0];
            this.item = div.children[1].children[0].children[1];
            this.toolIcon({
                type: "icon",
                svg: '<svg viewBox="0 0 100 100"><path d="M2 2 L98 98 M 98 2 L2 98Z" stroke-width="10px" stroke="#212121" stroke-linecap="round"></path></svg>',
                title: "关闭",
                action: (node) => node.remove()
            });
        }
        /**
         * 添加工具栏按钮
         * @param obj 按钮配置数据
         */
        static toolIcon(obj) {
            const div = this.icon(obj.svg);
            div.setAttribute("title", obj.title);
            this.tool.insertBefore(div, this.tool.firstChild);
            div.onclick = () => obj.action(this.box);
            return div;
        }
        /**
         * 创建图标节点
         * @param svg 图标 svg 字符串
         * @returns 图标节点
         */
        static icon(svg) {
            const div = document.createElement("div");
            const root = div.attachShadow({ mode: "closed" });
            API.addElement("div", { class: "icon" }, root, svg);
            API.addCss(API.getModule("icon.css"), "", root);
            return div;
        }
        /**
         * 添加菜单栏
         * @param key 菜单主键
         */
        static menuitem(key) {
            let obj = menu[key];
            const div = API.addElement("div", {}, this.menu);
            const root = div.attachShadow({ mode: "closed" });
            const real = API.addElement("div", { class: "menuitem" }, root);
            API.addCss(API.getModule("ui-menu.css"), "", root);
            obj.svg && real.appendChild(this.icon(obj.svg));
            real.appendChild(document.createTextNode(obj.name));
            div.onclick = () => {
                let selected = this.menu.querySelector(".selected");
                let itembox = this.item.querySelector(\`.\${obj.key}\`);
                selected && selected.removeAttribute("class");
                itembox && itembox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                div.setAttribute("class", "selected");
            };
        }
        /**
         * 添加菜单组合项
         * @param key 菜单主键
         * @returns 组合框节点，用以添加设计设置项
         */
        static itemContain(key) {
            let obj = menu[key];
            let div = this.item.querySelector(\`.\${obj.key}\`);
            if (!div) {
                div = API.addElement("div", { class: obj.key }, this.item);
                const root = div.attachShadow({ mode: "open" });
                API.addElement("div", { class: "contain" }, root, \`<div class="header">
                    <h2 class="title">\${obj.name}</h2>
                </div>
                <div class="card"></div>\`);
                API.addCss(API.getModule("ui-contain.css"), "", root);
            }
            return div.shadowRoot.querySelector(".card");
        }
        /**
         * 创建浮动信息，鼠标移动该节点上时显示
         * @param node 浮动信息所属节点
         * @param data 浮动信息内容
         */
        static float(node, data) {
            const div = document.createElement("div");
            const root = div.attachShadow({ mode: "closed" });
            const real = API.addElement("div", { class: "float" }, root, \`<div class="arrow"></div><div class="message">\${data}</div>\`);
            API.addCss(API.getModule("ui-float.css"), "", root);
            node.onmouseover = (ev) => {
                document.body.appendChild(div);
                let rect = real.getBoundingClientRect();
                real.style.left = \`\${node.getBoundingClientRect().x + ev.offsetX}px\`;
                real.style.top = \`\${node.getBoundingClientRect().y + ev.offsetY - rect.height}px\`;
                real.style.width = \`\${Math.sqrt(rect.width * rect.height) * 4 / 3}px\`;
            };
            node.onmouseout = () => div.remove();
            this.box.addEventListener("DOMNodeRemovedFromDocument", async () => div === null || div === void 0 ? void 0 : div.remove());
        }
        /**
         * 设置分类
         * @param obj 设置内容
         * @param node 父节点
         * @returns 设置节点
         */
        static index(obj, node) {
            let result = undefined;
            if (!obj.hidden)
                switch (obj.type) {
                    case "action":
                        result = this.action(obj, node);
                        break;
                    case "file":
                        result = this.file(obj, node);
                        break;
                    case "input":
                        result = this.input(obj, node);
                        break;
                    case "mutlti":
                        result = this.multi(obj, node);
                        break;
                    case "picture":
                        result = this.picture(obj, node);
                        break;
                    case "row":
                        result = this.row(obj, node);
                        break;
                    case "sort":
                        result = this.sort(obj, node);
                        break;
                    case "switch":
                        result = this.switch(obj, node);
                        break;
                    case "icon":
                        result = this.toolIcon(obj);
                        break;
                    case "custom":
                        result = this.custom(obj);
                        break;
                }
            return result;
        }
        /**
         * 添加纯图片设置
         * @param obj 设置内容
         * @param node 父节点
         * @returns 设置节点
         */
        static picture(obj, node) {
            node = node || this.itemContain(obj.sort);
            const div = document.createElement("div");
            const root = div.attachShadow({ mode: "closed" });
            const real = API.addElement("div", { class: "contain" }, root, \`<picture><img src="\${obj.src}"></picture>\`);
            API.addCss(API.getModule("ui-picture.css"), "", root);
            node && node.appendChild(div);
            obj.callback && new Promise(r => obj.callback && obj.callback.call(real));
            return div;
        }
        /**
         * 添加开关设置
         * @param obj 设置内容
         * @param node 父节点
         * @returns 设置节点
         */
        static switch(obj, node) {
            typeof API.config[obj.key] === "boolean" || Reflect.set(API.config, obj.key, obj.value); // 检查默认值
            node = node || this.itemContain(obj.sort);
            const div = document.createElement("div");
            const root = div.attachShadow({ mode: "closed" });
            const real = API.addElement("div", { class: "contain" }, root);
            API.addCss(API.getCss("ui-item.css"), "", root);
            Reflect.set(this.list, obj.key, real);
            obj.svg && real.appendChild(this.icon(obj.svg));
            const label = API.addElement("div", { class: "label" }, real, obj.label);
            real.appendChild(API.ElementComponent.switch(function (v) {
                Reflect.set(API.config, obj.key, v);
                obj.action && obj.action.call(this, API.config[obj.key]);
            }, API.config[obj.key]));
            obj.sub && (label.innerHTML = \`\${obj.label}<div class="sub">\${obj.sub}</div>\`);
            obj.float && this.float(real, obj.float);
            node && node.appendChild(div);
            obj.callback && new Promise(r => obj.callback && obj.callback.call(real));
            return div;
        }
        /**
         * 添加下拉设置
         * @param obj 设置内容
         * @param node 父节点
         * @returns 设置节点
         */
        static row(obj, node) {
            obj.list.includes(API.config[obj.key]) || Reflect.set(API.config, obj.key, obj.value);
            node = node || this.itemContain(obj.sort);
            let div = document.createElement("div");
            const root = div.attachShadow({ mode: "closed" });
            const real = API.addElement("div", { class: "contain" }, root);
            Reflect.set(this.list, obj.key, real);
            API.addCss(API.getCss("ui-item.css"), "", root);
            obj.svg && real.appendChild(this.icon(obj.svg));
            const label = API.addElement("div", { class: "label" }, real, obj.label);
            real.appendChild(API.ElementComponent.select(obj.list, function (v) {
                Reflect.set(API.config, obj.key, v);
                API.config[obj.key] = v;
                obj.action && obj.action.call(this, v);
            }, API.config[obj.key]));
            obj.sub && API.addElement("div", { class: "sub" }, label, obj.sub);
            obj.float && this.float(real, obj.float);
            node && node.appendChild(div);
            obj.callback && new Promise(r => obj.callback && obj.callback.call(real));
            return div;
        }
        /**
         * 添加归档设置
         * @param obj 设置内容
         * @param node 父节点
         * @returns 设置节点
         */
        static sort(obj, node) {
            node = node || this.itemContain(obj.sort);
            let div = document.createElement("div");
            let sec = document.createElement("div");
            let flag = false;
            let item;
            const root = div.attachShadow({ mode: "closed" });
            const real = API.addElement("div", { class: "contain" }, root);
            Reflect.set(this.list, obj.key, real);
            API.addCss(API.getModule("ui-sort-head.css"), "", root);
            const secroot = sec.attachShadow({ mode: "closed" });
            const secreal = API.addElement("div", { class: "contain" }, secroot);
            API.addCss(API.getModule("ui-sort-body.css"), "", secroot);
            obj.svg && real.appendChild(this.icon(obj.svg));
            const label = API.addElement("div", { class: "label" }, real, obj.label);
            const value = API.addElement("div", { class: "anchor" }, real);
            value.appendChild(this.icon(\`<svg viewBox="0 0 24 24"><g><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></g></svg>\`));
            obj.sub && (label.innerHTML = \`\${obj.label}<div class="sub">\${obj.sub}</div>\`);
            obj.float && this.float(real, obj.float);
            node && node.appendChild(div) && node.appendChild(sec);
            obj.callback && new Promise(r => obj.callback && obj.callback.call(real));
            item = obj.list.reduce((s, d) => {
                let temp = this.index(d, secreal);
                temp.style.display = "none";
                s.push(temp);
                return s;
            }, []);
            value.onclick = () => {
                flag = !flag;
                flag ? value.setAttribute("checked", "checked") : value.removeAttribute("checked");
                flag ? item.forEach(d => d.style.display = "block") : item.forEach(d => d.style.display = "none");
            };
            return div;
        }
        /**
         * 添加按钮菜单
         * @param obj 设置内容
         * @param node 父节点
         * @returns 设置节点
         */
        static action(obj, node) {
            node = node || this.itemContain(obj.sort);
            let div = document.createElement("div");
            let disabled = obj.hasOwnProperty("disabled") ? obj.disabled : 3;
            const root = div.attachShadow({ mode: "closed" });
            const real = API.addElement("div", { class: "contain" }, root);
            Reflect.set(this.list, obj.key, real);
            API.addCss(API.getModule("ui-item.css"), "", root);
            obj.svg && real.appendChild(this.icon(obj.svg));
            const label = API.addElement("div", { class: "label" }, real, obj.label);
            real.appendChild(API.ElementComponent.button(function () {
                obj.action.call(this);
            }, obj.title, disabled));
            obj.sub && (label.innerHTML = \`\${obj.label}<div class="sub">\${obj.sub}</div>\`);
            obj.float && this.float(real, obj.float);
            node && node.appendChild(div);
            obj.callback && new Promise(r => obj.callback && obj.callback.call(real));
            return div;
        }
        /**
         * 添加输入框设置
         * @param obj 设置内容
         * @param node 父节点
         * @returns 设置节点
         */
        static input(obj, node) {
            node = node || this.itemContain(obj.sort);
            let div = document.createElement("div");
            let history = [];
            let disabled = obj.hasOwnProperty("disabled") ? obj.disabled : 3;
            const root = div.attachShadow({ mode: "closed" });
            const real = API.addElement("div", { class: "contain" }, root);
            Reflect.set(this.list, obj.key, real);
            API.addCss(API.getModule("ui-input.css"), "", root);
            obj.svg && real.appendChild(this.icon(obj.svg));
            API.addElement("div", { style: "padding-inline-start: 12px;flex: 1;flex-basis: 0.000000001px;padding-block-end: 12px;padding-block-start: 12px;" }, real, obj.label);
            const value = API.addElement("div", { class: "textbox" }, real);
            obj.key ? (API.addElement("input", { list: \`list-\${obj.key}\` }, value),
                API.addElement("datalist", { id: \`list-\${obj.key}\` }, value),
                value.appendChild(this.icon(\`<svg viewBox="0 0 24 24"><g><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"></path></g></svg>\`)))
                : API.addElement("input", {}, value);
            obj.title && API.addElement("div", { class: "button" }, value, obj.title);
            (history = this.history[obj.key] || [],
                history.reduce((s, d) => {
                    API.addElement("option", { value: d || "" }, s);
                    return s;
                }, value.children[1]),
                value.children[2].setAttribute("style", "display: none;cursor: pointer;pointer-events: auto;position: absolute;right: 100%;background-color: white;"));
            obj.float && this.float(real, obj.float);
            node && node.appendChild(div);
            obj.callback && new Promise(r => obj.callback && obj.callback.call(real));
            let input = value.children[0];
            let clear = value.children[2];
            obj.hasOwnProperty("value") && (input.value = API.config[obj.key]);
            Object.entries(obj.input).forEach(d => { input.setAttribute(d[0], d[1]); });
            value.onmouseover = () => history.length > 0 && (clear && (clear.style.display = "block"));
            value.onmouseout = () => { clear && (clear.style.display = "none"); };
            clear && (clear.onclick = () => {
                history = this.history[obj.key] = [];
                real.querySelectorAll("option").forEach(d => d.remove());
                clear.style.display = "none";
            });
            obj.title ? (real.querySelector(".button").onclick = () => {
                if (!input.value || (API.config[obj.key] == input.value))
                    return;
                if (obj.pattern && !obj.pattern.test(input.value))
                    return API.toast.warning("非法输入！", \`正则限制：\${obj.pattern.toString()}\`);
                real.querySelector(".button").setAttribute("disabled", "disabled");
                disabled && setTimeout(() => real.querySelector(".button").removeAttribute("disabled"), disabled * 1000);
                obj.hasOwnProperty("value") && (Reflect.set(API.config, obj.key, input.value), API.config[obj.key] = input.value);
                !history.includes(input.value) && history.push(input.value) && (this.history[obj.key] = history);
                obj.action && obj.action.call(real, input.value);
            }) : (input.onchange = () => {
                if (obj.pattern && !obj.pattern.test(input.value))
                    return API.toast.warning("非法输入！", \`正则限制：\${obj.pattern.toString()}\`);
                obj.hasOwnProperty("value") && (Reflect.set(API.config, obj.key, input.value), API.config[obj.key] = input.value);
                !history.includes(input.value) && history.push(input.value) && (this.history[obj.key] = history);
                obj.action && obj.action.call(real, input.value);
            });
            return div;
        }
        /**
         * 添加文件选择设置
         * @param obj 设置内容
         * @param node 父节点
         * @returns 设置节点
         */
        static file(obj, node) {
            node = node || this.itemContain(obj.sort);
            let div = document.createElement("div");
            const root = div.attachShadow({ mode: "closed" });
            const real = API.addElement("div", { class: "contain" }, root);
            Reflect.set(this.list, obj.key, real);
            API.addCss(API.getModule("ui-file.css"), "", root);
            obj.svg && real.appendChild(this.icon(obj.svg));
            const label = API.addElement("div", { class: "label" }, real, obj.label);
            const value = API.addElement("div", { class: "button" }, real, obj.title);
            const input = API.addElement("input", { type: "file", style: "width: 0;" }, real);
            obj.sub && (label.innerHTML = \`\${obj.label}<div class="sub">\${obj.sub}</div>\`);
            obj.accept && (input.accept = obj.accept.join(","));
            obj.multiple && (input.multiple = true);
            obj.float && this.float(real, obj.float);
            node && node.appendChild(div);
            obj.callback && new Promise(r => obj.callback && obj.callback.call(real));
            value.onclick = () => input.click();
            input.onclick = () => input.value = "";
            input.onchange = () => input.files && obj.action.call(real, input.files);
            return div;
        }
        /**
         * 添加复选设置
         * @param obj 设置内容
         * @param node 父节点
         * @returns 设置节点
         */
        static multi(obj, node) {
            Array.isArray(API.config[obj.key]) || Reflect.set(API.config, obj.key, obj.value); // 检查默认值
            node = node || this.itemContain(obj.sort);
            let div = document.createElement("div");
            const root = div.attachShadow({ mode: "closed" });
            const real = API.addElement("div", { class: "contain" }, root);
            Reflect.set(this.list, obj.key, real);
            API.addCss(API.getModule("ui-item.css"), "", root);
            obj.svg && real.appendChild(this.icon(obj.svg));
            const label = API.addElement("div", { class: "label" }, real, obj.label);
            real.appendChild(API.ElementComponent.checkbox(obj.list, function (v) {
                Reflect.set(API.config, obj.key, v);
                obj.action && obj.action.call(this, v);
            }, API.config[obj.key]));
            obj.sub && (label.innerHTML = \`\${obj.label}<div class="sub">\${obj.sub}</div>\`);
            obj.float && this.float(real, obj.float);
            node && node.appendChild(div);
            obj.callback && new Promise(r => obj.callback && obj.callback.call(real));
            return div;
        }
        /**
         * 添加自定义设置
         * @param obj 设置内容
         * @param node 父节点
         * @returns 设置节点
         */
        static custom(obj, node) {
            node = node || this.itemContain(obj.sort);
            let div = document.createElement("div");
            const root = div.attachShadow({ mode: "open" });
            const real = API.addElement("div", { class: "contain" }, root);
            const table = {};
            Reflect.set(this.list, obj.key, real);
            API.addCss(API.getModule("ui-item.css"), "", root);
            obj.svg && real.appendChild(table.svg = this.icon(obj.svg));
            table.label = API.addElement("div", { class: "label" }, real, obj.label);
            table.value = API.addElement("div", {}, real, obj.custom);
            obj.sub && (table.label.innerHTML = \`\${obj.label}<div class="sub">\${obj.sub}</div>\`);
            obj.float && this.float(real, obj.float);
            node && node.appendChild(div);
            obj.callback && new Promise(r => obj.callback && obj.callback.call(real));
            obj.flesh && obj.flesh.call(real, new Proxy(obj, {
                set: (t, p, v) => {
                    Reflect.set(obj, p, v);
                    switch (p) {
                        case "svg":
                            table.temp = this.icon(v);
                            table.svg.replaceWith(table.temp);
                            table.svg = table.temp;
                            break;
                        case "label":
                            table.label = API.addElement("div", { class: "label" }, real, v, false, table.label);
                            break;
                        case "custom":
                            table.value = API.addElement("div", {}, real, v, false, table.value);
                            break;
                        case "sub":
                            table.label.innerHTML = \`\${obj.label}<div class="sub">\${v}</div>\`;
                            break;
                    }
                    return true;
                }
            }));
            return div;
        }
    }
    /** 设置项表 */
    Ui.list = {};
    API.runWhile(() => document.readyState === 'complete', () => {
        API.importModule("setting.js"); // 空闲时间检查一下默认设置
        const ui = new Ui();
        API.displaySetting = (key) => ui.display(key);
    });

//# sourceURL=API://@Bilibili-Old/include/ui.js`;
/*!***********************!*/
/**/modules["units.js"] = /*** ./dist/include/units.js ***/
`"use strict";
    /**
     * 代理退出登录功能
     * @param referer 退出后跳转的页面URL
     */
    async function loginExit(referer) {
        if (!API.uid)
            return API.toast.warning("本就未登录，无法退出登录！");
        API.toast.warning("正在退出登录...");
        let data = jsonCheck(await API.xhr({
            url: "https://passport.bilibili.com/login/exit/v2",
            data: \`biliCSRF=\${API.getCookies().bili_jct}&gourl=\${encodeURIComponent(location.href)}\`,
            method: "POST",
            credentials: true
        }));
        if (data.status) {
            API.toast.success("退出登录！");
            if (referer)
                return location.replace(referer);
            setTimeout(() => location.reload(), 1000);
        }
    }
    API.loginExit = loginExit;
    /**
     * 检查B站json接口返回值并格式化为json
     * 对于code异常将直接抛出错误！
     * @param data B站接口的response
     * @returns 格式化后的json
     */
    function jsonCheck(data) {
        let result = typeof data === "string" ? JSON.parse(data) : data;
        if ("code" in result && result.code !== 0) {
            let msg = result.msg || result.message || "";
            throw [result.code, msg];
        }
        return result;
    }
    API.jsonCheck = jsonCheck;
    /**
     * 拉起B站快捷登录面板
     */
    function biliQuickLogin() {
        window.biliQuickLogin ? window.biliQuickLogin() : loadScript("//static.hdslb.com/account/bili_quick_login.js", () => biliQuickLogin());
    }
    API.biliQuickLogin = biliQuickLogin;
    /**
     * 加载外源脚本
     * @param src 外源脚本url
     * @param onload 加载完成后的回调函数
     */
    function loadScript(src, onload) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.addEventListener("load", () => {
            script.remove();
            onload && onload();
        });
        document.body.appendChild(script);
    }
    API.loadScript = loadScript;
    /**
     * 节点到页面顶部的距离
     * @param node 目标节点
     * @returns 距离：/px
     */
    function getTotalTop(node) {
        var sum = 0;
        do {
            sum += node.offsetTop;
            node = node.offsetParent;
        } while (node);
        return sum;
    }
    API.getTotalTop = getTotalTop;
    /**
     * 从url中提取指定参数
     * @param name 参数名
     * @returns 参数值，不存在返回null
     */
    function getUrlValue(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|\$)", "i");
        const r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURIComponent(r[2]);
        return null;
    }
    API.getUrlValue = getUrlValue;
    const aids = {};
    /**
     * 获取aid的信息，无效aid除外
     * @param aid aid
     */
    async function getAidInfo(aid) {
        if (!aids[aid]) {
            const data = await API.xhr({
                url: \`https://api.bilibili.com/x/web-interface/view/detail?aid=\${aid}\`,
                responseType: "json",
                credentials: true
            });
            aids[aid] = data.data;
        }
        return aids[aid];
    }
    API.getAidInfo = getAidInfo;
    /**
     * 求utf-8字符串字节数，一般用于求文件大小。
     * @param str utf-8字符串（js默认字符串格式）
     * @returns 字节数
     */
    function strSize(str) {
        let size = 0;
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code <= 0x007f)
                size++;
            else if (code <= 0x07ff)
                size += 2;
            else if (code <= 0xffff)
                size += 3;
            else
                size += 4;
        }
        return size;
    }
    API.strSize = strSize;
    /**
     * 添加css样式
     * @param txt css文本
     * @param id 样式ID，用于唯一标记
     * @param parrent 添加到的父节点，默认为head
     */
    async function addCss(txt, id, parrent) {
        if (!parrent && !document.head) {
            await new Promise(r => runWhile(() => document.body, r));
        }
        parrent = parrent || document.head;
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        id && !parrent.querySelector(\`#\${id}\`) && style.setAttribute("id", id);
        style.appendChild(document.createTextNode(txt));
        parrent.appendChild(style);
    }
    API.addCss = addCss;
    /**
     * 创建HTML节点
     * @param tag 节点名称
     * @param attribute 节点属性对象
     * @param parrent 添加到的父节点，默认为body
     * @param innerHTML 节点的innerHTML
     * @param top 是否在父节点中置顶
     * @param replaced 替换节点而不是添加，被替换的节点，将忽略父节点相关参数
     */
    function addElement(tag, attribute, parrent, innerHTML, top, replaced) {
        let element = document.createElement(tag);
        attribute && (Object.entries(attribute).forEach(d => element.setAttribute(d[0], d[1])));
        parrent = parrent || document.body;
        innerHTML && (element.innerHTML = innerHTML);
        replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
        return element;
    }
    API.addElement = addElement;
    /**
     * 添加条件回调，条件为真时执行回调函数，用于检测函数运行时机
     * @param check 一个返回布尔值的函数，用于轮询，当函数返回值为真时执行回调函数
     * @param callback 待执行的回调函数
     * @param delay 轮询间隔：/ms，默认100ms
     * @param stop 轮询最大延时：/s，多长时间后终止轮询，不做无谓的等待，默认180s，即3分钟。为0时永不终止直到为真。
     */
    function runWhile(check, callback, delay = 100, stop = 180) {
        let timer = setInterval(() => {
            if (check()) {
                clearInterval(timer);
                callback();
            }
        }, delay);
        stop && setTimeout(() => clearInterval(timer), stop * 1000);
    }
    API.runWhile = runWhile;
    /**
     * 播放器通知，播放器不存在将转送到控制台
     * @param msg 消息字符串或三项数组，数组时顺序分别为普通、红色、黄色消息，可按位次置空取所需颜色。本值不存在将作为“屏显”使用。
     * @param time 消息时长：/s，默认为3，为0表示永久消息
     * @param callback 点击消息执行的回调函数
     * @param replace 替代已有消息，默认为真，即同时只显示一条消息
     */
    function bofqiMessage(msg, time = 3, callback, replace = true) {
        let node = document.querySelector(".bilibili-player-video-toast-bottom");
        if (!node) {
            if (msg) {
                if (Array.isArray(msg))
                    return API.debug.log(...msg);
                return API.debug.log(msg);
            }
            return;
        }
        if (!msg)
            node.childNodes.forEach(d => d.remove());
        const table = document.querySelector(".bilibili-player-video-toast-item.bilibili-player-video-toast-pay") || document.createElement("div");
        table.setAttribute("class", "bilibili-player-video-toast-item bilibili-player-video-toast-pay");
        const ele = document.createElement("div");
        ele.setAttribute("class", "bilibili-player-video-toast-item-text");
        table.appendChild(ele);
        msg = Array.isArray(msg) ? msg : [msg];
        if (!msg[0])
            return;
        replace && node.childNodes.forEach(d => d.remove());
        ele.innerHTML = msg.reduce((s, d, i) => {
            if (d) {
                switch (i) {
                    case 0:
                        s += \`<span class="video-float-hint-text">\${d}</span>\`;
                        break;
                    case 1:
                        s += \`<span class="video-float-hint-btn hint-red">\${d}</span>\`;
                        break;
                    case 2:
                        s += \`<span class="video-float-hint-btn">\${d}</span>\`;
                        break;
                }
            }
            return s;
        }, '');
        node.appendChild(table);
        callback && (ele.style.cursor = "pointer") && (ele.onclick = () => callback());
        (time !== 0) && setTimeout(() => {
            ele.remove();
            !table.children[0] && table.remove();
        }, time * 1000);
    }
    API.bofqiMessage = bofqiMessage;
    /**
     * 弹出提示框
     * 仿造alert制作的提示框，但不具备中断页面的能力，异步返回用户点击的按钮布尔值
     * @param title 提示标题，默认为脚本名称
     * @param text 提示内容
     * @returns Promise代理的布尔值，取决于用户的点击的按钮
     */
    async function alertMessage(text, title = API.Name) {
        return new Promise((r) => {
            const root = addElement("div");
            const div = root.attachShadow({ mode: "closed" });
            const table = addElement("div", { class: "table" }, div, \`
            <div class="title">\${title}</div>
            <div class="text">\${text}</div>
            <div class="act">
                <div class="button">确认</div>
                <div class="button">取消</div>
                </div>
            \`);
            addCss(getCss("alert.css", "button.css"), '', div);
            table.querySelectorAll(".button").forEach((d, i) => {
                i ? (d.onclick = () => { root.remove(), r(false); }) : (d.onclick = () => (root.remove(), r(true)));
            });
        });
    }
    API.alertMessage = alertMessage;
    /**
     * 获取并整合合内置Css模块
     * @param svg Css模块名序列
     * @returns 整合好的Css模块
     */
    function getCss(...svg) {
        return svg.reduce((s, d) => {
            s += \`\\r\\n\${API.getModule(d)}\`;
            return s;
        }, "");
    }
    API.getCss = getCss;

//# sourceURL=API://@Bilibili-Old/include/units.js`;
/*!***********************!*/
/**/modules["url.js"] = /*** ./dist/include/url.js ***/
`"use strict";
    class Url {
        constructor() {
            this.access_key = GM.getValue("access_key");
            /** url的默认参数，即UrlDetail未列出或可选的部分 */
            this.jsonUrlDefault = {
                "api.bilibili.com/pgc/player/web/playurl": { qn: 127, otype: 'json', fourk: 1 },
                "api.bilibili.com/x/player/playurl": { qn: 127, otype: 'json', fourk: 1 },
                "interface.bilibili.com/v2/playurl": { appkey: 9, otype: 'json', quality: 127, type: '' },
                "bangumi.bilibili.com/player/web_api/v2/playurl": { appkey: 9, module: "bangumi", otype: 'json', quality: 127, type: '' },
                "api.bilibili.com/pgc/player/api/playurlproj": { access_key: this.access_key, appkey: 1, build: "2040100", device: "android", expire: "0", mid: "0", mobi_app: "android_i", module: "bangumi", otype: "json", platform: "android_i", qn: 127, ts: new Date().getTime() },
                "app.bilibili.com/v2/playurlproj": { access_key: this.access_key, appkey: 1, build: "2040100", device: "android", expire: "0", mid: "0", mobi_app: "android_i", otype: "json", platform: "android_i", qn: 127, ts: new Date().getTime() },
                "api.bilibili.com/pgc/player/api/playurltv": { appkey: 6, qn: 127, fourk: 1, otype: 'json', platform: "android", mobi_app: "android_tv_yst", build: 102801 },
                "api.bilibili.com/x/tv/ugc/playurl": { appkey: 6, qn: 127, fourk: 1, otype: 'json', platform: "android", mobi_app: "android_tv_yst", build: 102801 },
                "app.bilibili.com/x/intl/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval: API.fnval, qn: 127, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: 'json', ts: new Date().getTime() },
                "apiintl.biliapi.net/intl/gateway/ogv/player/api/playurl": { access_key: this.access_key, mobi_app: "android_i", fnver: 0, fnval: API.fnval, qn: 127, platform: "android", fourk: 1, build: 2100110, appkey: 0, otype: 'json', ts: new Date().getTime() },
                "api.bilibili.com/view": { type: "json", appkey: "8e9fc618fbd41e28" }
            };
        }
        /**
         * 请求封装好的json请求
         * @param url 请求的url
         * @param detail 请求所需配置数据
         * @param GM 是否使用跨域请求
         * @returns Promise封装的返回值
         */
        getJson(url, detail, GM = false) {
            let obj = { ...(this.jsonUrlDefault[url] || {}), ...detail };
            (Number(Reflect.get(obj, "appkey")) >= 0) && (obj = this.sign(obj));
            return GM ? API.xhr.GM({
                url: API.Format.objUrl(\`//\${url}\`, obj),
                responseType: "json"
            }) : API.xhr({
                url: API.Format.objUrl(\`//\${url}\`, obj),
                responseType: "json",
                credentials: true
            });
        }
        sign(obj) {
            return API.Format.urlObj(\`?\${API.urlsign("", obj, obj.appkey)}\`);
        }
    }
    /** 封装好的默认请求，已填好必须的参数 */
    API.url = undefined;
    Object.defineProperty(API, "url", { get: () => new Url() });

//# sourceURL=API://@Bilibili-Old/include/url.js`;
/*!***********************!*/
/**/modules["urlInputCheck.js"] = /*** ./dist/include/urlInputCheck.js ***/
`"use strict";
    /** 将数据缓存起来，以免重复查询 */
    const catchs = { aid: {}, ssid: {}, epid: {} };
    /**
     * 解析B站相关url以获取aid/cid等参数
     * @param input URL链接
     * @returns 解析结果
     */
    async function urlInputCheck(input) {
        let aid, cid, ssid, epid, p, pgc = false;
        API.toast("正在解析链接：" + input);
        if (input && !input.includes("?"))
            input = "?" + input; // 重整化输入便于提取参数
        let obj = API.Format.urlObj(input); // 获取参数对象
        aid = input.match(/[aA][vV][0-9]+/) ? input.match(/[aA][vV][0-9]+/)[0].match(/\\d+/)[0] : undefined;
        aid = aid || obj.aid || undefined;
        aid = aid || (/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/.test(input) ? API.abv(input.match(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/)[0]) : undefined);
        aid = aid || (obj.bvid ? API.abv(obj.bvid) : undefined);
        p = obj.p || 1;
        try {
            if (aid) {
                if (aid == aid)
                    cid = cid;
                // 有缓存数据的情况
                cid = catchs.aid[aid] && catchs.aid[aid][p - 1].cid;
                // 直接获取到cid的情况
                cid = cid || obj.cid || undefined;
                if (!cid) {
                    try {
                        // 尝试访问B站服务器获取信息
                        catchs.aid[aid] = API.jsonCheck(await API.xhr({ url: API.Format.objUrl("https://api.bilibili.com/x/player/pagelist", { "aid": aid }) })).data;
                        cid = catchs.aid[aid][p - 1].cid;
                        API.toast("正在请求av视频数据", "分P名称：" + catchs.aid[aid][p - 1].part);
                    }
                    catch (e) {
                        API.debug.error("获取视频信息出错：aid：" + aid, "HOST：https://api.bilibili.com/x/player/pagelist", e);
                        try {
                            // 尝试访问BiliPlus获取信息
                            let data = API.jsonCheck(await API.xhr({ url: API.Format.objUrl("https://www.biliplus.com/api/view", { "id": aid }) }));
                            catchs.aid[aid] = data.list || (data.v2_app_api && data.v2_app_api.pages);
                            cid = catchs.aid[aid][p - 1].cid;
                            API.toast("正在请求av视频数据", "分P名称：" + catchs.aid[aid][p - 1].part);
                        }
                        catch (e) {
                            API.debug.error("获取视频信息出错：aid：" + aid, "HOST：https://www.biliplus.com/api/view", e);
                        }
                    }
                }
            }
            else {
                // 输入的是番剧ss/ep链接的情况，尝试获取aid、cid
                ssid = input.match(/[sS][sS][0-9]+/) ? input.match(/[sS][sS][0-9]+/)[0].match(/\\d+/)[0] : undefined;
                ssid = ssid || obj.season_id || undefined;
                epid = input.match(/[eE][pP][0-9]+/) ? input.match(/[eE][pP][0-9]+/)[0].match(/\\d+/)[0] : undefined;
                epid = epid || obj.ep_id || undefined;
                try {
                    // 尝试访问bangumi接口
                    let data;
                    if (epid)
                        data = JSON.stringify(catchs.epid[epid]) || await API.xhr({ url: API.Format.objUrl("https://bangumi.bilibili.com/view/web_api/season", { ep_id: epid }) });
                    else if (ssid)
                        data = JSON.stringify(catchs.ssid[ssid]) || await API.xhr({ url: API.Format.objUrl("https://bangumi.bilibili.com/view/web_api/season", { season_id: ssid }) });
                    if (data) {
                        data = new API.InitialStateOfBangumi(data, epid).season();
                        ssid && (catchs.ssid[ssid] = data);
                        epid && (catchs.epid[epid] = data);
                        aid = data.epInfo.aid;
                        cid = data.epInfo.cid;
                        pgc = true;
                        API.toast("正在请求Bangumi数据", "系列名称：" + data.mediaInfo.title, "分p名称：" + data.epInfo.index_title);
                    }
                }
                catch (e) {
                    let data;
                    if (ssid)
                        API.debug.error("获取视频信息出错：ssid：" + ssid, "HOST：https://bangumi.bilibili.com/view/web_api/season", e);
                    else if (epid)
                        API.debug.error("获取视频信息出错：epid：" + epid, "HOST：https://bangumi.bilibili.com/view/web_api/season", e);
                    try {
                        if (epid) {
                            data = await API.xhr({ url: API.Format.objUrl(\`\${API.config.limitServer}/intl/gateway/v2/ogv/view/app/season\`, { ep_id: epid }) });
                        }
                        else if (ssid) {
                            data = await API.xhr({ url: API.Format.objUrl(\`\${API.config.limitServer}/intl/gateway/v2/ogv/view/app/season\`, { season_id: ssid }) });
                        }
                        data = new API.InitialStateOfBangumi(data, epid).global();
                        aid = data.epInfo.aid;
                        cid = data.epInfo.cid;
                        pgc = true;
                        API.toast("正在请求Bangumi数据", "系列名称：" + data.mediaInfo.title, "分p名称：" + data.epInfo.index_title);
                    }
                    catch (e) { }
                }
            }
        }
        catch (e) {
            API.toast.error("urlInputCheck.js", e);
        }
        return { aid, cid, ssid, epid, p, pgc };
    }
    API.urlInputCheck = urlInputCheck;

//# sourceURL=API://@Bilibili-Old/include/urlInputCheck.js`;
/*!***********************!*/
/**/modules["xhr.js"] = /*** ./dist/include/xhr.js ***/
`"use strict";
    /** 跨越请求及其值栈 */
    const catches = [];
    function xhr(details) {
        details.method == "POST" && (details.headers = details.headers || {}, !details.headers["Content-Type"] && Reflect.set(details.headers, "Content-Type", "application/x-www-form-urlencoded"));
        if (details.async === false) {
            let xhr = new XMLHttpRequest();
            xhr.open(details.method || 'GET', details.url, false);
            details.responseType && (xhr.responseType = details.responseType);
            details.credentials && (xhr.withCredentials = true);
            details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
            details.timeout && (xhr.timeout = details.timeout);
            xhr.send(details.data);
            return xhr.response;
        }
        else
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open(details.method || 'GET', details.url);
                details.responseType && (xhr.responseType = details.responseType);
                details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
                details.credentials && (xhr.withCredentials = true);
                details.timeout && (xhr.timeout = details.timeout);
                xhr.onabort = details.onabort || ((ev) => reject(ev));
                xhr.onerror = details.onerror || ((ev) => reject(ev));
                details.onloadstart && (xhr.onloadstart = details.onloadstart);
                details.onprogress && (xhr.onprogress = details.onprogress);
                details.onreadystatechange && (xhr.onreadystatechange = details.onreadystatechange);
                xhr.ontimeout = details.ontimeout || ((ev) => reject(ev));
                xhr.onload = details.onload || (() => resolve(xhr.response));
                xhr.send(details.data);
            });
    }
    API.xhr = xhr;
    /**
     * 跨域请求日志
     * @returns 跨域请求及其结果
     */
    xhr.log = () => catches;
    /**
     * \`GM_xmlhttpRequest\`的\`Promise\`封装，用于跨域\`XMLHttpRequest\`请求
     * @param details 以对象形式传递的参数，注意\`onload\`回调会覆盖Promise结果
     * @returns \`Promise\`托管的请求结果或者报错信息
     */
    xhr.GM = function (details) {
        return new Promise((resolve, reject) => {
            details.method = details.method || 'GET';
            details.onload = details.onload || ((xhr) => { catches.push([details.url, xhr.response]); resolve(xhr.response); });
            details.onerror = details.onerror || ((xhr) => { catches.push([details.url, xhr.response]); reject(xhr.response); });
            GM.xmlHttpRequest(details);
        });
    };
    function get(url, details = {}) {
        !Reflect.has(details, "credentials") && (details.credentials = true);
        return xhr({ url: url, ...details });
    }
    xhr.get = get;
    function post(url, data, contentType = "application/x-www-form-urlencoded", details = {}) {
        !Reflect.has(details, "credentials") && (details.credentials = true);
        details.headers = { "Content-Type": contentType, ...details.headers };
        return xhr({ url: url, method: "POST", data: data, ...details });
    }
    xhr.port = post;

//# sourceURL=API://@Bilibili-Old/include/xhr.js`;
/*!***********************!*/
/**/modules["abv.js"] = /*** ./dist/lib/abv.js ***/
`"use strict";
    class Abv {
        constructor() {
            this.base58Table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
            this.digitMap = [11, 10, 3, 8, 4, 6];
            this.xor = 177451812;
            this.add = 8728348608;
            this.bvidTemplate = ['B', 'V', 1, '', '', 4, '', 1, '', 7, '', ''];
            this.table = {};
            for (let i = 0; i < 58; i++)
                this.table[this.base58Table[i]] = i;
        }
        /**
         * av/BV互转
         * @param input av或BV，可带av/BV前缀
         * @returns 转化结果
         */
        check(input) {
            if (/^[aA][vV][0-9]+\$/.test(String(input)) || /^\\d+\$/.test(String(input)))
                return this.avToBv(Number(/[0-9]+/.exec(String(input))[0]));
            if (/^1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}\$/.test(String(input)))
                return this.bvToAv("BV" + input);
            if (/^[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}\$/.test(String(input)))
                return this.bvToAv(String(input));
            throw input;
        }
        bvToAv(BV) {
            let r = 0;
            for (let i = 0; i < 6; i++)
                r += this.table[BV[this.digitMap[i]]] * 58 ** i;
            return (r - this.add) ^ this.xor;
        }
        avToBv(av) {
            let bv = Array.from(this.bvidTemplate);
            av = (av ^ this.xor) + this.add;
            for (let i = 0; i < 6; i++)
                bv[this.digitMap[i]] = this.base58Table[parseInt(String(av / 58 ** i)) % 58];
            return bv.join("");
        }
    }
    /**
     * av <=> BV
     * @param input av/BV
     * @returns BV/aid
     */
    function abv(input) {
        return new Abv().check(input);
    }
    API.abv = abv;

//# sourceURL=API://@Bilibili-Old/lib/abv.js`;
/*!***********************!*/
/**/modules["Base64.js"] = /*** ./dist/lib/Base64.js ***/
`"use strict";
    /** Base64编解码工具。 */
    class Base64 {
        /**
         * Base64编码
         * @param str 原始字符串
         * @returns 编码结果
         */
        static encode(str) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                return String.fromCharCode(('0x' + p1));
            }));
        }
        /**
         * Base64解码
         * @param str 原始字符串
         * @returns 解码结果
         */
        static decode(str) {
            return decodeURIComponent(atob(str).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
    }
    API.Base64 = Base64;

//# sourceURL=API://@Bilibili-Old/lib/Base64.js`;
/*!***********************!*/
/**/modules["crc32.js"] = /*** ./dist/lib/crc32.js ***/
`"use strict";
    class Midcrc {
        constructor() {
            this.CRCPOLYNOMIAL = 0xEDB88320;
            this.crctable = new Array(256);
            this.index = new Array(4);
            this.create_table();
        }
        /**
         * @param input 输入crc32散列值
         * @returns 逆向出的mid值
         */
        run(input) {
            let ht = parseInt('0x' + input) ^ 0xffffffff, snum, i, lastindex, deepCheckData;
            for (i = 3; i >= 0; i--) {
                this.index[3 - i] = this.getcrcindex(ht >>> (i * 8));
                snum = this.crctable[this.index[3 - i]];
                ht ^= snum >>> ((3 - i) * 8);
            }
            for (i = 0; i < 10000000; i++) {
                lastindex = this.crc32lastindex(i);
                if (lastindex == this.index[3]) {
                    deepCheckData = this.deepCheck(i, this.index);
                    if (deepCheckData[0])
                        break;
                }
            }
            if (i == 10000000)
                return -1;
            return Number(i + '' + deepCheckData[1]);
        }
        create_table() {
            let crcreg, i, j;
            for (i = 0; i < 256; ++i) {
                crcreg = i;
                for (j = 0; j < 8; ++j) {
                    if ((crcreg & 1) !== 0) {
                        crcreg = this.CRCPOLYNOMIAL ^ (crcreg >>> 1);
                    }
                    else {
                        crcreg >>>= 1;
                    }
                }
                this.crctable[i] = crcreg;
            }
        }
        crc32(input) {
            if (typeof (input) != 'string')
                input = input.toString();
            let crcstart = 0xFFFFFFFF, len = input.length, index;
            for (let i = 0; i < len; ++i) {
                index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                crcstart = (crcstart >>> 8) ^ this.crctable[index];
            }
            return crcstart;
        }
        crc32lastindex(input) {
            if (typeof (input) != 'string')
                input = input.toString();
            let crcstart = 0xFFFFFFFF, len = input.length, index;
            for (let i = 0; i < len; ++i) {
                index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                crcstart = (crcstart >>> 8) ^ this.crctable[index];
            }
            return index;
        }
        getcrcindex(t) {
            for (let i = 0; i < 256; i++)
                if (this.crctable[i] >>> 24 == t)
                    return i;
            return -1;
        }
        deepCheck(i, index) {
            let tc = 0x00, str = '', hash = this.crc32(i);
            tc = hash & 0xff ^ index[2];
            if (!(tc <= 57 && tc >= 48))
                return [0];
            str += tc - 48;
            hash = this.crctable[index[2]] ^ (hash >>> 8);
            tc = hash & 0xff ^ index[1];
            if (!(tc <= 57 && tc >= 48))
                return [0];
            str += tc - 48;
            hash = this.crctable[index[1]] ^ (hash >>> 8);
            tc = hash & 0xff ^ index[0];
            if (!(tc <= 57 && tc >= 48))
                return [0];
            str += tc - 48;
            hash = this.crctable[index[0]] ^ (hash >>> 8);
            return [1, str];
        }
    }
    const crc = new Midcrc();
    /**
     * 逆向弹幕散列值到uid
     * @param input 输入crc32散列值
     * @returns 逆向出的mid值
     */
    function midcrc(input) { return crc.run(input); }
    API.midcrc = midcrc;
    /**
     * 求字符串的crc32散列
     * @param input 输入字符串
     * @returns crc32散列
     */
    function crc32(input) { return (((crc.crc32(input) + 1) * -1) >>> 0).toString(16); }
    API.crc32 = crc32;

//# sourceURL=API://@Bilibili-Old/lib/crc32.js`;
/*!***********************!*/
/**/modules["cubicBezier.js"] = /*** ./dist/lib/cubicBezier.js ***/
`"use strict";
    const NEWTON_ITERATIONS = 4;
    const NEWTON_MIN_SLOPE = 0.001;
    const SUBDIVISION_PRECISION = 0.0000001;
    const SUBDIVISION_MAX_ITERATIONS = 10;
    const kSplineTableSize = 11;
    const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
    const float32ArraySupported = typeof Float32Array === 'function';
    function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C(aA1) { return 3.0 * aA1; }
    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }
    function binarySubdivide(aX, aA, aB, mX1, mX2) {
        let currentX, currentT, i = 0;
        do {
            currentT = aA + (aB - aA) / 2.0;
            currentX = calcBezier(currentT, mX1, mX2) - aX;
            if (currentX > 0.0) {
                aB = currentT;
            }
            else {
                aA = currentT;
            }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
        return currentT;
    }
    function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
        for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
            const currentSlope = getSlope(aGuessT, mX1, mX2);
            if (currentSlope === 0.0) {
                return aGuessT;
            }
            const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    }
    function LinearEasing(x) {
        return x;
    }
    function bezier(mX1, mY1, mX2, mY2) {
        if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
            throw new Error('bezier x values must be in [0, 1] range');
        }
        if (mX1 === mY1 && mX2 === mY2) {
            return LinearEasing;
        }
        // Precompute samples table
        const sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
        for (let i = 0; i < kSplineTableSize; ++i) {
            sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
        function getTForX(aX) {
            let intervalStart = 0.0;
            let currentSample = 1;
            const lastSample = kSplineTableSize - 1;
            for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }
            --currentSample;
            // Interpolate to provide an initial guess for t
            const dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
            const guessForT = intervalStart + dist * kSampleStepSize;
            const initialSlope = getSlope(guessForT, mX1, mX2);
            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
            }
            else if (initialSlope === 0.0) {
                return guessForT;
            }
            else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
            }
        }
        return function BezierEasing(x) {
            // Because JavaScript number are imprecise, we should guarantee the extremes are right.
            if (x === 0 || x === 1) {
                return x;
            }
            return calcBezier(getTForX(x), mY1, mY2);
        };
    }
    API.bezier = bezier;

//# sourceURL=API://@Bilibili-Old/lib/cubicBezier.js`;
/*!***********************!*/
/**/modules["md5.js"] = /*** ./dist/lib/md5.js ***/
`"use strict";
    const ERROR = 'input is invalid type';
    const ARRAY_BUFFER = true;
    const HEX_CHARS = '0123456789abcdef'.split('');
    const EXTRA = [128, 32768, 8388608, -2147483648];
    const SHIFT = [0, 8, 16, 24];
    const OUTPUT_TYPES = ['hex', 'array', 'digest', 'buffer', 'arrayBuffer', 'base64'];
    const BASE64_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
    let buffer = new ArrayBuffer(68), blocks = new Uint32Array(buffer), buffer8 = new Uint8Array(buffer);
    let createOutputMethod = function (outputType) {
        return function (message) {
            return new Md5(true).update(message)[outputType]();
        };
    };
    let createMethod = function () {
        let method = createOutputMethod('hex');
        method.create = function () {
            return new Md5();
        };
        method.update = function (message) {
            return method.create().update(message);
        };
        for (let i = 0; i < OUTPUT_TYPES.length; ++i) {
            let type = OUTPUT_TYPES[i];
            method[type] = createOutputMethod(type);
        }
        return method;
    };
    class Md5 {
        constructor(sharedMemory) {
            this.buffer8 = new Uint8Array();
            this.h0 = 0;
            this.h1 = 0;
            this.h2 = 0;
            this.h3 = 0;
            this.start = 0;
            this.bytes = 0;
            this.hBytes = 0;
            this.finalized = false;
            this.hashed = false;
            this.first = true;
            this.lastByteIndex = 0;
            if (sharedMemory) {
                blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                    blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                            blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                this.blocks = blocks;
                this.buffer8 = buffer8;
            }
            else {
                if (ARRAY_BUFFER) {
                    let buffer = new ArrayBuffer(68);
                    this.buffer8 = new Uint8Array(buffer);
                    this.blocks = new Uint32Array(buffer);
                }
                else {
                    this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                }
            }
            this.toString = this.hex;
            this.array = this.digest;
            this.buffer = this.arrayBuffer;
        }
        update(message) {
            if (this.finalized) {
                return;
            }
            message = typeof message === 'number' ? message + '' : message;
            let notString, type = typeof message;
            if (type !== 'string') {
                if (type === 'object') {
                    if (message === null) {
                        throw ERROR;
                    }
                    else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
                        message = new Uint8Array(message);
                    }
                    else if (!Array.isArray(message)) {
                        if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                            throw ERROR;
                        }
                    }
                }
                else {
                    throw ERROR;
                }
                notString = true;
            }
            let code, index = 0, i, length = message.length, blocks = this.blocks;
            let buffer8 = this.buffer8;
            while (index < length) {
                if (this.hashed) {
                    this.hashed = false;
                    blocks[0] = blocks[16];
                    blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                            blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                                blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
                }
                if (notString) {
                    if (ARRAY_BUFFER) {
                        for (i = this.start; index < length && i < 64; ++index) {
                            buffer8[i++] = message[index];
                        }
                    }
                    else {
                        for (i = this.start; index < length && i < 64; ++index) {
                            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
                        }
                    }
                }
                else {
                    if (ARRAY_BUFFER) {
                        for (i = this.start; index < length && i < 64; ++index) {
                            code = message.charCodeAt(index);
                            if (code < 0x80) {
                                buffer8[i++] = code;
                            }
                            else if (code < 0x800) {
                                buffer8[i++] = 0xc0 | (code >> 6);
                                buffer8[i++] = 0x80 | (code & 0x3f);
                            }
                            else if (code < 0xd800 || code >= 0xe000) {
                                buffer8[i++] = 0xe0 | (code >> 12);
                                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                                buffer8[i++] = 0x80 | (code & 0x3f);
                            }
                            else {
                                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                                buffer8[i++] = 0xf0 | (code >> 18);
                                buffer8[i++] = 0x80 | ((code >> 12) & 0x3f);
                                buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
                                buffer8[i++] = 0x80 | (code & 0x3f);
                            }
                        }
                    }
                    else {
                        for (i = this.start; index < length && i < 64; ++index) {
                            code = message.charCodeAt(index);
                            if (code < 0x80) {
                                blocks[i >> 2] |= code << SHIFT[i++ & 3];
                            }
                            else if (code < 0x800) {
                                blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                            }
                            else if (code < 0xd800 || code >= 0xe000) {
                                blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                            }
                            else {
                                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                                blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
                            }
                        }
                    }
                }
                this.lastByteIndex = i;
                this.bytes += i - this.start;
                if (i >= 64) {
                    this.start = i - 64;
                    this.hash();
                    this.hashed = true;
                }
                else {
                    this.start = i;
                }
            }
            if (this.bytes > 4294967295) {
                this.hBytes += this.bytes / 4294967296 << 0;
                this.bytes = this.bytes % 4294967296;
            }
            return this;
        }
        finalize() {
            if (this.finalized) {
                return;
            }
            this.finalized = true;
            let blocks = this.blocks, i = this.lastByteIndex;
            blocks[i >> 2] |= EXTRA[i & 3];
            if (i >= 56) {
                if (!this.hashed) {
                    this.hash();
                }
                blocks[0] = blocks[16];
                blocks[16] = blocks[1] = blocks[2] = blocks[3] =
                    blocks[4] = blocks[5] = blocks[6] = blocks[7] =
                        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
                            blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            }
            blocks[14] = this.bytes << 3;
            blocks[15] = this.hBytes << 3 | this.bytes >>> 29;
            this.hash();
        }
        hash() {
            let a, b, c, d, bc, da, blocks = this.blocks;
            if (this.first) {
                a = blocks[0] - 680876937;
                a = (a << 7 | a >>> 25) - 271733879 << 0;
                d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
                d = (d << 12 | d >>> 20) + a << 0;
                c = (-271733879 ^ (d & (a ^ -271733879))) + blocks[2] - 1126478375;
                c = (c << 17 | c >>> 15) + d << 0;
                b = (a ^ (c & (d ^ a))) + blocks[3] - 1316259209;
                b = (b << 22 | b >>> 10) + c << 0;
            }
            else {
                a = this.h0;
                b = this.h1;
                c = this.h2;
                d = this.h3;
                a += (d ^ (b & (c ^ d))) + blocks[0] - 680876936;
                a = (a << 7 | a >>> 25) + b << 0;
                d += (c ^ (a & (b ^ c))) + blocks[1] - 389564586;
                d = (d << 12 | d >>> 20) + a << 0;
                c += (b ^ (d & (a ^ b))) + blocks[2] + 606105819;
                c = (c << 17 | c >>> 15) + d << 0;
                b += (a ^ (c & (d ^ a))) + blocks[3] - 1044525330;
                b = (b << 22 | b >>> 10) + c << 0;
            }
            a += (d ^ (b & (c ^ d))) + blocks[4] - 176418897;
            a = (a << 7 | a >>> 25) + b << 0;
            d += (c ^ (a & (b ^ c))) + blocks[5] + 1200080426;
            d = (d << 12 | d >>> 20) + a << 0;
            c += (b ^ (d & (a ^ b))) + blocks[6] - 1473231341;
            c = (c << 17 | c >>> 15) + d << 0;
            b += (a ^ (c & (d ^ a))) + blocks[7] - 45705983;
            b = (b << 22 | b >>> 10) + c << 0;
            a += (d ^ (b & (c ^ d))) + blocks[8] + 1770035416;
            a = (a << 7 | a >>> 25) + b << 0;
            d += (c ^ (a & (b ^ c))) + blocks[9] - 1958414417;
            d = (d << 12 | d >>> 20) + a << 0;
            c += (b ^ (d & (a ^ b))) + blocks[10] - 42063;
            c = (c << 17 | c >>> 15) + d << 0;
            b += (a ^ (c & (d ^ a))) + blocks[11] - 1990404162;
            b = (b << 22 | b >>> 10) + c << 0;
            a += (d ^ (b & (c ^ d))) + blocks[12] + 1804603682;
            a = (a << 7 | a >>> 25) + b << 0;
            d += (c ^ (a & (b ^ c))) + blocks[13] - 40341101;
            d = (d << 12 | d >>> 20) + a << 0;
            c += (b ^ (d & (a ^ b))) + blocks[14] - 1502002290;
            c = (c << 17 | c >>> 15) + d << 0;
            b += (a ^ (c & (d ^ a))) + blocks[15] + 1236535329;
            b = (b << 22 | b >>> 10) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[1] - 165796510;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[6] - 1069501632;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[11] + 643717713;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[0] - 373897302;
            b = (b << 20 | b >>> 12) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[5] - 701558691;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[10] + 38016083;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[15] - 660478335;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[4] - 405537848;
            b = (b << 20 | b >>> 12) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[9] + 568446438;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[14] - 1019803690;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[3] - 187363961;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[8] + 1163531501;
            b = (b << 20 | b >>> 12) + c << 0;
            a += (c ^ (d & (b ^ c))) + blocks[13] - 1444681467;
            a = (a << 5 | a >>> 27) + b << 0;
            d += (b ^ (c & (a ^ b))) + blocks[2] - 51403784;
            d = (d << 9 | d >>> 23) + a << 0;
            c += (a ^ (b & (d ^ a))) + blocks[7] + 1735328473;
            c = (c << 14 | c >>> 18) + d << 0;
            b += (d ^ (a & (c ^ d))) + blocks[12] - 1926607734;
            b = (b << 20 | b >>> 12) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[5] - 378558;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[8] - 2022574463;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[11] + 1839030562;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[14] - 35309556;
            b = (b << 23 | b >>> 9) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[1] - 1530992060;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[4] + 1272893353;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[7] - 155497632;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[10] - 1094730640;
            b = (b << 23 | b >>> 9) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[13] + 681279174;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[0] - 358537222;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[3] - 722521979;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[6] + 76029189;
            b = (b << 23 | b >>> 9) + c << 0;
            bc = b ^ c;
            a += (bc ^ d) + blocks[9] - 640364487;
            a = (a << 4 | a >>> 28) + b << 0;
            d += (bc ^ a) + blocks[12] - 421815835;
            d = (d << 11 | d >>> 21) + a << 0;
            da = d ^ a;
            c += (da ^ b) + blocks[15] + 530742520;
            c = (c << 16 | c >>> 16) + d << 0;
            b += (da ^ c) + blocks[2] - 995338651;
            b = (b << 23 | b >>> 9) + c << 0;
            a += (c ^ (b | ~d)) + blocks[0] - 198630844;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[5] - 57434055;
            b = (b << 21 | b >>> 11) + c << 0;
            a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[10] - 1051523;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
            b = (b << 21 | b >>> 11) + c << 0;
            a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[15] - 30611744;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
            b = (b << 21 | b >>> 11) + c << 0;
            a += (c ^ (b | ~d)) + blocks[4] - 145523070;
            a = (a << 6 | a >>> 26) + b << 0;
            d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
            d = (d << 10 | d >>> 22) + a << 0;
            c += (a ^ (d | ~b)) + blocks[2] + 718787259;
            c = (c << 15 | c >>> 17) + d << 0;
            b += (d ^ (c | ~a)) + blocks[9] - 343485551;
            b = (b << 21 | b >>> 11) + c << 0;
            if (this.first) {
                this.h0 = a + 1732584193 << 0;
                this.h1 = b - 271733879 << 0;
                this.h2 = c - 1732584194 << 0;
                this.h3 = d + 271733878 << 0;
                this.first = false;
            }
            else {
                this.h0 = this.h0 + a << 0;
                this.h1 = this.h1 + b << 0;
                this.h2 = this.h2 + c << 0;
                this.h3 = this.h3 + d << 0;
            }
        }
        hex() {
            this.finalize();
            let h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
            return HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
                HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
                HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
                HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
                HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
                HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
                HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
                HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
                HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
                HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
                HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
                HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
                HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
                HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
                HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
                HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
        }
        digest() {
            this.finalize();
            let h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
            return [
                h0 & 0xFF, (h0 >> 8) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 24) & 0xFF,
                h1 & 0xFF, (h1 >> 8) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 24) & 0xFF,
                h2 & 0xFF, (h2 >> 8) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 24) & 0xFF,
                h3 & 0xFF, (h3 >> 8) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 24) & 0xFF
            ];
        }
        arrayBuffer() {
            this.finalize();
            let buffer = new ArrayBuffer(16);
            let blocks = new Uint32Array(buffer);
            blocks[0] = this.h0;
            blocks[1] = this.h1;
            blocks[2] = this.h2;
            blocks[3] = this.h3;
            return buffer;
        }
        base64() {
            let i, v1, v2, v3, base64Str = '', bytes = this.array();
            for (i = 0; i < 15;) {
                v1 = bytes[i++];
                v2 = bytes[i++];
                v3 = bytes[i++];
                base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
                    BASE64_ENCODE_CHAR[(v1 << 4 | v2 >>> 4) & 63] +
                    BASE64_ENCODE_CHAR[(v2 << 2 | v3 >>> 6) & 63] +
                    BASE64_ENCODE_CHAR[v3 & 63];
            }
            v1 = bytes[i];
            base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] +
                BASE64_ENCODE_CHAR[(v1 << 4) & 63] +
                '==';
            return base64Str;
        }
    }
    /**
     * 获取md5哈希值
     * 函数属性上还有其他类型md5值获取方法，返回值参考其名，如\`md5.hex()\`
     * @param str 字符串输入
     * @returns md5输出
     */
    API.md5 = createMethod();

//# sourceURL=API://@Bilibili-Old/lib/md5.js`;
/*!***********************!*/
/**/modules["sign.js"] = /*** ./dist/lib/sign.js ***/
`"use strict";
    class Sign {
        /**
         * 签名URL
         * @param url 原URL
         * @param obj 添加到URL上的查询参数对象，可选
         * @param id appkey在\`keySecret\`中的索引
         * @returns 签名后的URL
         */
        static sign(url, obj = {}, id = 0) {
            this.keySecret = this.decode(id);
            obj = { ...API.Format.urlObj(url), ...obj };
            url = url.split("#")[0].split("?")[0];
            delete obj.sign;
            obj.appkey = this.keySecret[0];
            const table = Object.keys(obj).sort().reduce((s, d) => {
                s[d] = obj[d];
                return s;
            }, {});
            table.sign = id === 3 && table.api ? (API.md5(API.Format.objUrl("", { api: decodeURIComponent(table.api) }) + this.keySecret[1])) : (API.md5(API.Format.objUrl("", table) + this.keySecret[1]));
            return API.Format.objUrl(url, table);
        }
        /**
         * 提取appkey和盐
         * @param id appkey在\`keySecret\`中的索引
         * @returns [appkey, sort]
         */
        static decode(id) {
            if (typeof id === "number") {
                id = id < this.table.length ? id : 0;
                return this.table[id].split("").reverse().reduce((s, d) => {
                    s = s + String.fromCharCode(d.charCodeAt(0) + 2);
                    return s;
                }, '').split(":");
            }
            else {
                return [id, this.list()[id]];
            }
        }
        /**
         * 生成\`keySecret\`池
         * @param key appkey
         * @param secret appkey对应的盐
         * @returns 混淆后的字符串
         */
        static encode(key, secret) {
            return (key + ":" + secret).split("").reverse().reduce((s, d) => {
                s = s + String.fromCharCode(d.charCodeAt(0) - 2);
                return s;
            }, "");
        }
        /**
         * 输出\`keySecret\`池对象
         * @returns \`keySecret\`池对象
         */
        static list() {
            return this.table.reduce((s, d, i) => {
                let keySecret = this.decode(i);
                s[keySecret[0]] = keySecret[1];
                return s;
            }, {});
        }
    }
    Sign.table = [
        "rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg",
        "/a_206b\`_.61.bca6117.175bcdadc41850c010c..././1\`\`",
        "157bdd\`6/bc73632.bcd660baa03a.43841211032b5c4\`6b/",
        "351a7a6b/.b\`d77da1cdccc25_13bc0a81a6d63.7ad13\`c50",
        "4_/54d\`3_4_73..2c42\`d4.a3__31b358d706d\`._7a.3_b5.",
        "12a.7c4b76c.a\`12bb4\`2b2b275c667c85b6d\`c_c\`0d5.051",
        "bb16d652\`04.7/121d3474b_2.c12\`7386\`0/bdd6ca0c7.22",
        "244_530/7/.ab\`7.//22a15572502b_08c21./_.\`3164\`c36",
        "16_d52_d/d22_2c0a.6573355/b\`./bd8a\`bc6114a30_4.\`d",
        "c02ba/d6.33d05cb/5d34.7d_23_\`_2785\`c60.a\`.4343726",
        "2aa2\`.1_\`_1.73\`.70.67d.bc671c16382a3d\`71a4.bcb3c7",
        "40/171b046c/bcc0a603ac620\`372ba_8d706d\`._7a.3_b5.",
        "c4_a.7562_15\`_a416a/63/c2cbcb\`308a/\`//41b30376.b5" // 7d08...1b1c
    ];
    /**
     * 签名URL
     * @param url 原URL
     * @param obj 添加到URL上的查询参数对象
     * @param id appkey在\`keySecret\`中的索引
     * @returns 签名后的URL
     */
    API.urlsign = (url, obj = {}, id = 0) => Sign.sign(url, obj, id);
    /**
     * 提取appkey和盐
     * @param id appkey在\`keySecret\`中的索引
     * @returns [appkey, sort]
     */
    API.urlsign.getKeyById = (id) => Sign.decode(id);
    /**
     * 生成\`keySecret\`池
     * @param key appkey
     * @param secret 盐
     * @returns 混淆后的字符串
     */
    API.urlsign.encode = (key, secret) => Sign.encode(key, secret);
    /**
     * 输出\`keySecret\`池对象
     * @returns \`keySecret\`池对象
     */
    API.urlsign.list = () => Sign.list();

//# sourceURL=API://@Bilibili-Old/lib/sign.js`;
/*!***********************!*/
/**/modules["anime.js"] = /*** ./dist/url/anime.js ***/
`"use strict";
    class Anime extends API.Rewrite {
        constructor(html) {
            super(html);
            this.script = [
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
                },
                {
                    type: "text/javascript",
                    src: "//s2.hdslb.com/bfs/cm/st/bundle.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/promise.auto.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//www.bilibili.com/gentleman/polyfill.js?features=Promise%2CObject.assign%2CString.prototype.includes%2CNumber.isNaN"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/ogv/fe/iris.min.js"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/bangumi-home/1.bangumi-home.73141fb5868615cb4fe6bc969ccd02cb7c1c7d4c.js",
                    crossorigin: "",
                    defer: "defer"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/bangumi-home/bangumi-home.73141fb5868615cb4fe6bc969ccd02cb7c1c7d4c.js",
                    crossorigin: "",
                    defer: "defer"
                },
                {
                    type: "text/javascript",
                    charset: "utf-8",
                    src: "//static.hdslb.com/common/js/footer.js"
                }
            ];
            API.path.name = "anime";
            this.flushDocument();
        }
    }
    new Anime("anime.html");

//# sourceURL=API://@Bilibili-Old/url/anime.js`;
/*!***********************!*/
/**/modules["bnj.js"] = /*** ./dist/url/bnj.js ***/
`"use strict";
    API.runWhile(() => window.__INITIAL_STATE__, () => {
        try {
            const titles = window.__INITIAL_STATE__.videoSections.reduce((s, d) => {
                d.episodes.forEach(d => s.push(d));
                return s;
            }, []);
            // 替换播放器节点
            const node = document.querySelector("#bilibili-player").parentElement;
            const root = node.attachShadow({ mode: "closed" }); // 使用shadow覆盖视频节点而不影响页面其他功能
            const iframe = document.createElement('iframe');
            iframe.src = \`https://www.bilibili.com/blackboard/html5player.html?aid=\${window.__INITIAL_STATE__.videoInfo.aid}&cid=\${window.__INITIAL_STATE__.videoInfo.cid}&enable_ssl=1&crossDomain=1&as_wide=1\`;
            iframe.setAttribute("style", "width: 906px; height: 556px;border:none;");
            root.appendChild(iframe);
            // 添加时间戳监听
            const episodes = document.querySelectorAll('.video-episode-card__info-title');
            episodes.forEach((d, i, e) => {
                const episode = titles.find(t => t.title == d.innerText);
                e[i].parentNode.parentNode.onclick = () => {
                    setTimeout(() => {
                        // 销毁切p播放器已阻止自动播放
                        window.player && window.player.destroy();
                    }, 100);
                    // toast(episode.title, \`av\${Reflect.get(episode, "aid")}\`, \`UP主：\${Reflect.get(episode, "author").name}\`)
                    iframe.contentWindow.postMessage({ ...episode });
                };
            });
            window.addEventListener("message", e => {
                if (e.data == "MediaMeta") {
                    const episode = titles.find(t => t.aid == window.__INITIAL_STATE__.videoInfo.aid);
                    iframe.contentWindow.postMessage({
                        title: episode.title,
                        author: episode.author,
                        cover: episode.cover
                    });
                }
            });
            // 销毁原播放器
            API.runWhile(() => window.player && window.player.destroy, () => {
                setTimeout(() => {
                    window.player && window.player.destroy();
                }, 100);
            });
        }
        catch (e) {
            API.toast.error("bnjFestival.js", e);
        }
    });

//# sourceURL=API://@Bilibili-Old/url/bnj.js`;
/*!***********************!*/
/**/modules["history.js"] = /*** ./dist/url/history.js ***/
`"use strict";
    API.config.history && API.xhrhook(["api.bilibili.com/x/web-interface/history/cursor", "business"], function (args) {
        let obj = API.Format.urlObj(args[1]), max = obj.max || "", view_at = obj.view_at || "";
        args[1] = API.Format.objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: "20" });
    }, undefined, false);
    API.config.searchHistory && API.runWhile(() => document.querySelector(".b-head-search"), () => { var _a; return (_a = document.querySelector(".b-head-search")) === null || _a === void 0 ? void 0 : _a.remove(); });

//# sourceURL=API://@Bilibili-Old/url/history.js`;
/*!***********************!*/
/**/modules["medialist.js"] = /*** ./dist/url/medialist.js ***/
`"use strict";
    class Playlist extends API.Rewrite {
        constructor(html) {
            super(html);
            /** url参数 */
            this.route = API.Format.urlObj(location.href);
            /** medialist类型 */
            this.type = 3;
            /** 伪造的pl号 */
            this.pl = /\\d+/.exec(API.path[5]) && Number(/\\d+/.exec(API.path[5])[0]);
            /** 真的是playlist页面？ */
            this.playlist = Boolean(API.path[5].startsWith("pl"));
            /** 滚动加载锚 */
            this.oid = "";
            /** playlist toview模板 */
            this.toview = {
                "attr": 2,
                "count": 100,
                "cover": "https://i0.hdslb.com/bfs/archive/a45ef4fcde397247032cf4ce0c8f71815f9e28d0.jpg",
                "ctime": 1529021131,
                "description": "bilibili moe 2018 动画角色人气大赏日本动画场应援视频播单 / 每天不定时更新最新的一批",
                "faved_count": 0,
                "favored": 0,
                "favorite": false,
                "id": 1826036,
                "is_favorite": false,
                "like_count": 0,
                "list": [],
                "mid": 26468955,
                "mlid": 182603655,
                "mtime": 1533874759,
                "name": "bilibili moe 2018 日本动画场应援",
                "owner": {
                    "face": "http://i2.hdslb.com/bfs/face/57389d533621407d36981a99fed93834dd8b20e6.jpg",
                    "mid": 26468955,
                    "name": "萌战基"
                },
                "pid": 769,
                "play_count": 0,
                "recent_oids": [],
                "recent_res": [],
                "reply_count": 0,
                "share_count": 0,
                "stat": {
                    "favorite": 1685,
                    "pid": 769,
                    "reply": 10,
                    "share": 0,
                    "view": 298928
                },
                "state": 0,
                "type": 2
            };
            /** 滚动到底了？ */
            this.has_more = false;
            /** 滚动监听 */
            this.observer = new MutationObserver(d => this.Observer(d));
            this.initPlayerQueryData();
            history.replaceState(null, "", API.Format.objUrl(\`https://www.bilibili.com/playlist/video/pl\${this.pl}\`, API.Format.urlObj(location.href))); // 伪造为playlist页面，便于重构，重构完会还原回去
            this.script = [
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.qrcode.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/common/js/footer.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/swfobject.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/mstation/js/upload/moxie.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/mstation/js/upload/plupload.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/phoenix/dist/js/comment.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"
                }
            ];
            API.jsonphookasync("toview", undefined, async (url) => {
                history.replaceState(null, "", API.path.join("/")); // 还原页面url
                try {
                    if (this.playlist || this.pl === 182603655) { // 备份页面
                        const result = await API.xhr({
                            url: "https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/Json/pl769.json",
                            responseType: "json"
                        });
                        this.toview = result.data;
                        return result;
                    }
                    else {
                        const rqs = await Promise.all([
                            API.xhr.get(\`https://api.bilibili.com/x/v1/medialist/info?type=\${this.type}&biz_id=\${this.pl}&tid=0\`, { responseType: "json" }),
                            API.xhr.get(\`https://api.bilibili.com/x/v2/medialist/resource/list?type=\${this.type}&oid=\${this.oid}&otype=2&biz_id=\${this.pl}&bvid=&with_current=true&mobi_app=web&ps=20&direction=false&sort_field=1&tid=0&desc=true\`, { responseType: "json" })
                        ]);
                        this.info(rqs[0]); // 分别填充模板
                        this.list(rqs[1]);
                        return { code: 0, data: this.toview, message: "0", ttl: 1 };
                    }
                }
                catch (e) {
                    API.toast.error("获取medialist数据失败！请刷新页面或者在脚本设置中关闭重构“medialist”选项");
                    throw e;
                }
            });
            API.switchVideo(() => {
                !(this.pl == 769) && history.replaceState(null, "", API.Format.objUrl(API.path.join("/"), API.Format.urlObj(location.href))); // 还原被原生脚本修改过的url
                const data = this.toview.list.find((d) => d.aid == API.aid);
                if (data) {
                    API.tid = data.tid;
                    API.mediaSession({
                        title: data.pages.find((d) => d.cid == API.cid).part || data.title,
                        artist: data.owner.name,
                        album: data.title,
                        artwork: [{
                                src: data.pic
                            }]
                    });
                    (Reflect.has(data, "attr") && !!+data.attr.toString(2)[data.attr.toString(2).length - 2] && API.toast.warning("限制视频，可能无法在播单中直接播放~"));
                }
                if (this.has_more) { // 继续滚动监听
                    API.runWhile(() => document.querySelector(".bilibili-player-playlist-item"), () => this.startObserver());
                }
            });
            this.flushDocument();
            this.onload = () => this.afterFlush();
        }
        /** 初始化medialist类型 */
        initPlayerQueryData() {
            if (this.route.business)
                switch (this.route.business) {
                    case "space":
                        this.type = 1;
                        break;
                    case "space_series":
                        this.type = 5;
                        this.pl = this.route.business_id;
                        break;
                    case "space_channel":
                        this.type = 6;
                        this.pl = 10 * this.route.business_id + this.pl % 10;
                        break;
                    case "space_collection":
                        this.type = 8;
                        this.pl = this.route.business_id;
                        break;
                    default: this.type = 3;
                }
        }
        /**
         * 开始滚动监听
         */
        startObserver() {
            this.observer.observe(document.querySelector(".bilibili-player-playlist-item").parentElement.parentElement, { attributes: true });
        }
        info(obj) {
            this.toview.attr = obj.data.attr;
            this.toview.count = obj.data.media_count;
            this.toview.cover = obj.data.cover;
            this.toview.ctime = obj.data.ctime;
            this.toview.description = obj.data.intro;
            this.toview.favored = obj.data.fav_state;
            this.toview.favorite = Boolean(obj.data.fav_state);
            this.toview.id = obj.data.id;
            this.toview.is_favorite = Boolean(obj.data.fav_state);
            this.toview.like_count = obj.data.like_state;
            this.toview.mid = obj.data.mid;
            this.toview.mlid = obj.data.id;
            this.toview.mtime = obj.data.ctime;
            this.toview.name = obj.data.title;
            this.toview.owner = obj.data.upper;
            this.toview.pid = obj.data.id;
            this.toview.stat.favorite = obj.data.cnt_info.collect;
            this.toview.stat.pid = obj.data.id;
            this.toview.stat.reply = obj.data.cnt_info.reply;
            this.toview.stat.share = obj.data.cnt_info.share;
            this.toview.stat.view = obj.data.cnt_info.play;
        }
        list(obj) {
            obj.data.media_list.reduce((s, d) => {
                s.push({
                    aid: d.id,
                    attr: d.attr,
                    attribute: 0,
                    cid: d.pages[0].id,
                    copyright: d.copy_right,
                    ctime: d.pubtime,
                    desc: d.intro,
                    dimension: d.pages[0].dimension,
                    duration: d.duration,
                    dynamic: "",
                    owner: d.upper,
                    pages: d.pages.reduce((s, b) => {
                        s.push({
                            cid: b.id,
                            dimension: b.dimension,
                            duration: b.duration,
                            from: b.from,
                            page: b.page,
                            part: b.title,
                            vid: "",
                            weblink: b.link
                        });
                        return s;
                    }, []),
                    pic: d.cover,
                    pubdate: d.pubtime,
                    rights: d.rights,
                    stat: {
                        aid: d.id,
                        coin: d.cnt_info.coin,
                        danmaku: d.cnt_info.danmaku,
                        dislike: d.cnt_info.thumb_down,
                        favorite: d.cnt_info.collect,
                        his_rank: 0,
                        like: d.cnt_info.thumb_up,
                        now_rank: 0,
                        reply: d.cnt_info.reply,
                        share: d.cnt_info.share,
                        view: d.cnt_info.play
                    },
                    state: 0,
                    tid: d.tid,
                    title: d.title,
                    tname: "",
                    videos: d.page
                });
                return s;
            }, this.toview.list);
            this.has_more = obj.data.has_more;
            this.oid = this.toview.list[this.toview.list.length - 1].aid;
        }
        afterFlush() {
            API.runWhile(() => document.getElementsByClassName("bili-header-m")[1], () => document.getElementsByClassName("bili-header-m")[1].remove()); // 移除上古顶栏
            if (this.playlist && !(this.pl == 769)) {
                history.replaceState(null, "", \`https://www.bilibili.com/playlist/video/pl769\`);
                API.toast.warning("原生playlist页面已无法访问，已重定向到脚本备份的pl769~");
            }
            if (document.compatMode === "BackCompat") { // 怪异模式下样式修复
                API.addCss(".bili-header-m .nav-menu .profile-info .i-face { top:5px; }");
            }
            API.importModule("descBV.js"); // 修复简介中超链接
            API.importModule("videoSort.js"); // 修正分区信息
            API.config.enlike && API.importModule("enLike.js"); // 添加点赞功能
            API.config.electric && API.jsonphook("api.bilibili.com/x/web-interface/elec/show", url => API.Format.objUrl(url, { aid: 1, mid: 1 }));
        }
        Observer(record) {
            record.forEach(d => {
                this.calcScroll(d.target);
            });
        }
        calcScroll(node) {
            const maxHeight = node.scrollHeight;
            const scroll = /\\d+/.exec(node.style.top) ? Number(/\\d+/.exec(node.style.top)) : 0;
            if (node.className.includes("hidden"))
                return;
            if (maxHeight - scroll > 0 && maxHeight - scroll < 600) {
                this.observer.disconnect(); // 暂停监听
                API.toast("loading...");
                API.xhr.get(\`https://api.bilibili.com/x/v2/medialist/resource/list?type=\${this.type}&oid=\${this.oid}&otype=2&biz_id=\${this.pl}&bvid=&with_current=true&mobi_app=web&ps=20&direction=false&sort_field=1&tid=0&desc=true\`, { responseType: "json" }).then(d => {
                    this.formatMore(d);
                    this.has_more && this.startObserver(); // 重新监听
                }).catch(e => { API.toast.error("正在加载...", e); });
            }
        }
        /**
         * 重构加载更多
         * @param obj 接口返回数据（json）
         */
        formatMore(obj) {
            var _a;
            const result = obj.data.media_list.reduce((s, d) => {
                s.push({
                    ao: d.rights && d.rights.pay,
                    Sz: d.upper && d.upper.face,
                    Te: d.pages.reduce((s, f) => {
                        var _a, _b, _c;
                        s.push({
                            Da: (_a = d.bangumi) === null || _a === void 0 ? void 0 : _a.ep_id,
                            Fb: (_c = (_b = d.bangumi) === null || _b === void 0 ? void 0 : _b.season) === null || _c === void 0 ? void 0 : _c.season_id,
                            aid: d.id,
                            duration: f.duration,
                            from: f.from,
                            j: f.id,
                            ni: f.title,
                            page: f.page
                        });
                        return s;
                    }, []),
                    Tz: d.upper && d.upper.mid,
                    aid: d.id,
                    duration: d.duration,
                    ko: d.upper && d.upper.name,
                    lb: d.cover,
                    state: 0,
                    title: d.title,
                });
                return s;
            }, []);
            this.list(obj); // 记录更多数据
            this.has_more ? (_a = window.player) === null || _a === void 0 ? void 0 : _a.updatePlaylist(result) : API.toast.warning("没有更多了！"); // 推送到播放器脚本
        }
    }
    new Playlist("playlist.html");

//# sourceURL=API://@Bilibili-Old/url/medialist.js`;
/*!***********************!*/
/**/modules["player.js"] = /*** ./dist/url/player.js ***/
`"use strict";
    class Player extends API.Rewrite {
        constructor(html) {
            super(html);
            this.obj = API.Format.urlObj(location.href);
            this.aid = this.obj.aid || this.obj.avid;
            this.bvid = this.obj.bvid;
            this.cid = this.obj.cid;
            this.script = [
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.qrcode.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/player/js/whitelist.js"
                }
            ];
            API.path.name = "player"; // 重写标记
            this.flushDocument();
            this.onload = () => { this.afterFlush(); };
        }
        async afterFlush() {
            if (!Number(this.aid)) {
                if (this.obj.aid)
                    this.aid = API.abv(this.aid);
                else if (this.bvid)
                    this.aid = API.abv(this.bvid);
            }
            if (!Number(this.cid)) {
                this.obj = (await API.urlInputCheck(location.href));
                this.aid = this.obj.aid;
                this.cid = this.obj.cid;
                if (!Number(this.cid))
                    return API.toast.error("初始化嵌入式播放器失败！", this.obj);
            }
            const playerParam = {
                aid: this.aid,
                cid: this.cid,
                p: API.getUrlValue("P"),
                // autoplay: getUrlValue("autoplay"), 深恶痛绝
                as_wide: API.getUrlValue("as_wide"),
                bnj: API.getUrlValue("bnj"),
                player_type: API.getUrlValue("player_type"),
                season_type: API.getUrlValue("season_type")
            };
            if (this.obj.pgc || this.obj.ssid || this.obj.epid) { // pgc额外信息
                Reflect.set(playerParam, "seasonId", this.obj.ssid);
                Reflect.set(playerParam, "episodeId", this.obj.epid);
                Reflect.set(playerParam, "urlparam", \`module%3Dbangumi%26season_type%3D\${playerParam.season_type}\`);
            }
            window.EmbedPlayer("player", "//static.hdslb.com/play.swf", API.Format.objUrl("", playerParam)); // 初始化播放器
            window.addEventListener('message', e => {
                var _a;
                if (e.data.aid) {
                    window.__playinfo__ = undefined;
                    e.data.as_wide = 1;
                    e.data.dashSymbol = true;
                    e.data.p = 1;
                    e.data.pre_ad = "";
                    window.player.destroy();
                    window.player = new window.BilibiliPlayer(e.data); // 重新初始化播放器
                }
                if (e.data.title) {
                    API.mediaSession({
                        title: e.data.title,
                        artist: (_a = e.data.author) === null || _a === void 0 ? void 0 : _a.name,
                        album: document.title,
                        artwork: [{
                                src: e.data.cover
                            }]
                    });
                }
            });
            window.parent.postMessage("MediaMeta"); // 请求初始媒体面板信息（拜年祭）
        }
    }
    new Player("player.html");

//# sourceURL=API://@Bilibili-Old/url/player.js`;
/*!***********************!*/
/**/modules["ranking.js"] = /*** ./dist/url/ranking.js ***/
`"use strict";
    class Ranking extends API.Rewrite {
        constructor(html) {
            super(html);
            this.refer = document.referrer.split("/");
            this.obj = { rid: "0", day: "3", type: "1", arc_type: "0" };
            this.script = [
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js",
                    defer: "defer"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/cm/st/bundle.js",
                    crossorigin: ""
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/rank/1.rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js",
                    defer: "defer"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js",
                    defer: "defer"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/common/js/footer.js",
                    defer: "defer"
                }
            ];
            API.path.name = "ranking"; // 重写标记
            this.getIniState();
        }
        async getIniState() {
            const json = await API.xhr({
                url: API.Format.objUrl("https://api.bilibili.com/x/web-interface/ranking", this.obj),
                responseType: "json",
                credentials: true
            });
            const data = API.jsonCheck(json);
            const result = { loading: false, rankRouteParams: { arc_type: 0, day: 3, rankTab: "all", rid: Number(this.refer[5]) || 0, season_type: 1 }, showTypes: true, times: [{ name: "日排行", value: 1 }, { name: "三日排行", value: 3 }, { name: "周排行", value: 7 }, { name: "月排行", value: 30 }], typeList: [{ name: "全部投稿", value: 0 }, { name: "近期投稿", value: 1 }] };
            result.channels = [{ name: "全站", tid: 0 }, { name: "动画", tid: 1 }, { name: "国创相关", tid: 168 }, { name: "音乐", tid: 3 }, { name: "舞蹈", tid: 129 }, { name: "游戏", tid: 4 }, { name: "知识", tid: 36 }, { name: "数码", tid: 188 }, { name: "生活", tid: 160 }, { name: "美食", tid: 211 }, { name: "鬼畜", tid: 119 }, { name: "时尚", tid: 155 }, { name: "娱乐", tid: 5 }, { name: "影视", tid: 181 }];
            result.rankList = data.data.list;
            result.note = data.data.note;
            window.__INITIAL_STATE__ = result; // 写入__INITIAL_STATE__
            this.flushDocument();
            API.addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}"); // 高分辨率屏修补
        }
    }
    new Ranking("ranking.html");

//# sourceURL=API://@Bilibili-Old/url/ranking.js`;
/*!***********************!*/
/**/modules["read.js"] = /*** ./dist/url/read.js ***/
`"use strict";
    class Read extends API.Rewrite {
        constructor(html) {
            super(html);
            this.temp = '';
            this.bar = [
                [0, "推荐", "home"],
                [2, "动画", "douga"],
                [1, "游戏", "game"],
                [28, "影视", "cinephile"],
                [3, "生活", "life"],
                [29, "兴趣", "interest"],
                [16, "轻小说", "lightnovel"],
                [17, "科技", "technology"],
                [41, "笔记", "note"]
            ];
            this.script = [
                {
                    src: "//static.hdslb.com/public/intersection-observer.js"
                },
                {
                    src: "//static.hdslb.com/public/timing.min.js"
                },
                {
                    src: "//static.hdslb.com/js/jquery-3.3.1.min.js"
                },
                {
                    type: "text/javascript",
                    charset: "utf-8",
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
                },
                {
                    type: "text/javascript",
                    charset: "utf-8",
                    src: "//static.hdslb.com/common/js/footer.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/phoenix/dist/js/comment.min.js"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/biliapp/biliapp.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/jinkela/article/manifest.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/jinkela/article/vendor.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"
                }
            ];
            API.path.name = "read";
            this.getIniState();
        }
        async getIniState() {
            const data = await API.xhr({ url: location.href, credentials: true });
            this.data = data.includes("__INITIAL_STATE__=") ? JSON.parse(data.match(/INITIAL_STATE__=.+?\\;\\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\\(function/, "")) : "";
            if (!this.data)
                API.toast.error("获取专栏数据失败！");
            this.bars(); // 链接重构文章各部分
        }
        /**
         * 左侧菜单栏
         */
        bars() {
            this.temp += this.bar.reduce((o, d) => {
                o = o + \`<a href="//www.bilibili.com/read/\${d[2]}?from=articleDetail" target="_self" class="tab-item\${this.data.readInfo.category.parent_id == d[0] ? " on" : ""}" data-tab-id="\${d[0]}"><span>\${d[1]}</span></a>\`;
                return o;
            }, \`<div class="nav-tab-bar"><a href="https://www.bilibili.com/read/home?from=articleDetail" target="_self" class="logo"></a>\`) + "</div>";
            this.upinfo();
        }
        /**
         * up主信息
         */
        upinfo() {
            this.temp += \`<div class="up-info-holder"><div class="fixed-box"><div class="up-info-block">
            <a class="up-face-holder" href="//space.bilibili.com/\${this.data.readInfo.author.mid}" target="_blank"><img class="up-face-image" data-face-src="\${this.data.readInfo.author.face.replace("http:", "")}" src="//static.hdslb.com/images/member/noface.gif" /></a><div class="up-info-right-block"><div class="row">
            <a class="up-name" href="//space.bilibili.com/\${this.data.readInfo.author.mid}" target="_blank">\${this.data.readInfo.author.name}</a> <span class="level"></span><div class="nameplate-holder"><i class="nameplate"></i></div></div><div class="row-2">粉丝: <span class="fans-num"></span> <span class="view">阅读:</span> <span class="view-num"></span></div></div></div><div class="follow-btn-holder"><span class="follow-btn">关注</span></div><div class="up-article-list-block hidden"><div class="block-title">推荐文章</div><ul class="article-list"></ul></div><div class="more"><div class="top-bar"><label>更多</label></div><a class="ac-link" href="//www.bilibili.com/read/apply/" target="_blank"><div class="link"><span class="icon"></span><p class="title">成为创作者</p><p class="info">申请成为专栏UP主</p></div></a> <a href="//www.bilibili.com/blackboard/help.html#%C3%A4%C2%B8%C2%93%C3%A6%C2%A0%C2%8F%C3%A7%C2%9B%C2%B8%C3%A5%C2%85%C2%B3" target="_blank"><div class="help"><span class="icon"></span><p class="title">专栏帮助</p><p class="info">查看专栏使用说明</p></div></a></div></div>
            </div><div class="right-side-bar"><div class="to-comment"><div class="comment-num-holder"><span class="comment-num"></span></div></div><div class="to-top"></div></div>\`;
            this.head();
        }
        /**
         * 标题及封面
         */
        head() {
            this.temp += \`<div class="head-container"><div class="banner-img-holder"></div><div class="bangumi-rating-container"></div><div class="argue-flag hidden"></div><div class="title-container">
            <h1 class="title">\${this.data.readInfo.title}</h1><div class="info">
            <a class="category-link" href="//www.bilibili.com/read/\${this.bar.find(d => {
                if (d[0] == this.data.readInfo.category.parent_id)
                    return d;
            })[2]}#rid=\${this.data.readInfo.category.id}" target="_blank"><span>\${this.data.readInfo.category.name}</span></a> <span class="create-time" data-ts="\${this.data.readInfo.ctime}"></span><div class="article-data"></div>
            </div></div><div style="display:none" class="author-container">
            <a class="author-face" href="//space.bilibili.com/\${this.data.readInfo.author.mid}" target="_blank"><img data-face-src="\${this.data.readInfo.author.face.replace("http:", "")}" src="\${this.data.readInfo.author.face.replace("http:", "")}" class="author-face-img" /></a> <a class="author-name" href="//space.bilibili.com/\${this.data.readInfo.author.mid}" target="_blank">\${this.data.readInfo.author.name}</a><div class="attention-btn slim-border">关注</div></div></div>\`;
            this.body();
        }
        /**
         * 专栏主体
         */
        body() {
            this.temp += \`<div class="article-holder">\${this.data.readInfo.content}</div><p class="original">本文为我原创</p>\`;
            this.tag();
        }
        /**
         * 专栏标签
         */
        tag() {
            this.temp += (this.data.readInfo.tags || []).reduce((o, d) => {
                o = o + \`<li data-tag-id="\${d.tid}" class="tag-item"><span class="tag-border"><span class="tag-border-inner"></span></span> <span class="tag-content">\${d.name}</span></li>\`;
                return o;
            }, \`<ul class="tag-container">\`) + \`</ul><div class="article-action"><div class="ops"><span class="like-btn"><i class="icon-video-details_like"></i> <span>--</span></span> <span class="coin-btn"><i class="icon-video-details_throw-coin"></i> <span>--</span></span> <span class="fav-btn"><i class="icon-video-details_collection"></i> <span>--</span></span> <span class="share-container share-btn">分享到：<span></span></span></div><div class="more"><!-- <i class="icon-general_more-actions"></i> --><div class="more-ops-list"><ul><li value="0">投诉或建议</li></ul></div></div></div><div class="article-list-holder-block"></div><div class="draft-holder-block"></div><div class="b-head comment-title-block"><span class="b-head-t comment-results" style="display: inline;"></span> <span class="b-head-t">评论</span></div><div class="comment-holder"></div>\`;
            this.origin();
        }
        origin() {
            window.original = {
                cvid: this.data.cvid,
                author: {
                    name: this.data.readInfo.author.name,
                    mid: this.data.readInfo.author.mid,
                },
                banner_url: this.data.readInfo.banner_url || (this.data.readInfo && this.data.readInfo.image_urls[0]) || null,
                reprint: this.data.readInfo.reprint,
                summary: this.data.readInfo.summary,
                media: "",
                actId: this.data.readInfo.act_id,
                dispute: {
                    dispute: "",
                    dispute_url: ""
                },
                spoiler: "0"
            };
            document.querySelector(".page-container").innerHTML = this.temp; // 修补html模板
            this.flushDocument();
            API.runWhile(() => document.body, () => API.importModule("user-select.js")); // 解锁复制/右键
        }
    }
    new Read("read.html");

//# sourceURL=API://@Bilibili-Old/url/read.js`;
/*!***********************!*/
/**/modules["watchlater.js"] = /*** ./dist/url/watchlater.js ***/
`"use strict";
    class Watchlater extends API.Rewrite {
        constructor(html) {
            super(html);
            this.script = [
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.qrcode.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/common/js/footer.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/swfobject.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/account/bili_quick_login.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/phoenix/dist/js/comment.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/mstation/js/upload/moxie.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/mstation/js/upload/plupload.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/elec_2/dist/js/later_elec.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/static/phoenix/viewlater/static/js/main.2111469a1bbc20e2e885.js"
                }
            ];
            API.path.name = "watchlater"; // 重写标记
            this.mediaSession();
            this.flushDocument();
            this.onload = () => { this.afterFlush(); };
        }
        mediaSession() {
            API.jsonphook("api.bilibili.com/x/v2/history/toview/web", undefined, obj => {
                API.switchVideo(async () => {
                    const data = obj.data.list.find((d) => d.aid == API.aid);
                    data && API.mediaSession({
                        title: data.pages.find((d) => d.cid == API.cid).part || data.title,
                        artist: data.owner.name,
                        album: data.title,
                        artwork: [{
                                src: data.pic
                            }]
                    });
                });
                return obj;
            });
        }
        afterFlush() {
            window.commentAgent = { seek: (t) => window.player && window.player.seek(t) }; // 修复评论跳转
            API.config.enlike && API.importModule("enLike.js"); // 添加点赞功能
            API.addCss(API.getModule("mini-bofqi.css")); // 修正迷你播放器样式
            API.importModule("videoSort.js"); // 修正分区信息
            API.path.forEach(d => { d.includes("av") && (API.aid = Number(/[0-9]+/.exec(d)[0])); });
        }
    }
    if (API.path[5] && API.path[5].startsWith("watchlater") && API.config.watchlater)
        location.replace("https://www.bilibili.com/watchlater/#/"); // 重定向medialist型稍后再看
    new Watchlater("watchlater.html");

//# sourceURL=API://@Bilibili-Old/url/watchlater.js`;
/*!***********************!*/
/**/modules["av.js"] = /*** ./dist/url/av/av.js ***/
`"use strict";
    class Av extends API.Rewrite {
        constructor(html) {
            super(html);
            this.script = [
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
                },
                {
                    type: "text/javascript",
                    text: \`window.getInternetExplorerVersion=function(){var rv=-1;if(navigator.appName=="Microsoft Internet Explorer"){var ua=navigator.userAgent;var re=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");if(re.exec(ua)!=null){rv=parseFloat(RegExp.\$1)}}return rv};function getQueryString(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|\$)");var r=window.location.search.substr(1).match(reg);if(r!=null){return unescape(r[2])}return null}\`
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js",
                    crossorigin: "",
                    defer: "defer"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js",
                    crossorigin: "",
                    defer: "defer"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js",
                    crossorigin: "",
                    defer: "defer"
                },
                {
                    type: "text/javascript",
                    text: \`var vd=window.__INITIAL_STATE__&&window.__INITIAL_STATE__.videoData;if(vd&&vd.aid&&getInternetExplorerVersion()!==9){\$("#__bofqi").innerHTML='<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>';if(vd.embedPlayer){var p=getQueryString("p")?getQueryString("p")-1:0;var player={aid:vd.aid,cid:(vd.pages[p]&&vd.pages[p].cid)||vd.pages[0].cid};EmbedPlayer("player","//static.hdslb.com/play.swf","cid="+player.cid+"&aid="+player.aid+"&pre_ad=")}if(vd.embed){\$("#bofqi").html(vd.embed)}}else{\$("#bofqi").remove()};\`,
                    defer: "defer"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/phoenix/dist/js/comment.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.qrcode.min.js"
                },
                {
                    type: "text/javascript",
                    charset: "utf-8",
                    src: "//static.hdslb.com/common/js/footer.js"
                }
            ];
            this.getIniState();
            this.onload = () => { this.afterFlush(); };
            API.importModule("hookWebpackJsonp.js"); // 修复原生代码错误
        }
        async getIniState() {
            var _a;
            if (API.path[4].toLowerCase().startsWith('bv'))
                API.aid = API.abv(API.path[4].split("#")[0].split("?")[0]);
            API.aid = API.aid || Number(/[0-9]+/.exec(String(API.path[4]))[0]);
            API.path.name = "av"; // 重写页面标记
            await new Promise(r => {
                API.xhr({
                    url: API.Format.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: API.aid }),
                    responseType: "json",
                    credentials: true
                }).then(d => {
                    this.__INITIAL_STATE__ = new API.InitialStateOfAv(d).detail();
                    this.appendIniState();
                    r(true);
                }).catch(e => {
                    API.toast.error(\`获取av号信息失败，尝试访问第三方接口~\`, e);
                    API.xhr({
                        url: API.Format.objUrl("https://www.biliplus.com/api/view", { id: API.aid }),
                        responseType: "json"
                    }).then(d => {
                        this.__INITIAL_STATE__ = new API.InitialStateOfAv(d).plus();
                        this.appendIniState();
                        r(true);
                    }).catch(e => {
                        API.toast.error(\`第三方接口也没有获取到有效数据~\`, e);
                        API.url.getJson("api.bilibili.com/view", { id: API.aid, page: this.url.searchParams.get("p") }).then(d => {
                            this.__INITIAL_STATE__ = new API.InitialStateOfAv(d).view();
                            this.appendIniState();
                            API.switchVideo(() => { API.toast.warning("这可能是个Bangumi，可惜未能获取到ssid，无法跳转~"); });
                            r(true);
                        }).catch(e => {
                            API.toast.error(\`上古接口还是没能获取到有效数据~\`);
                            throw e;
                        });
                    });
                });
            });
            if (this.__INITIAL_STATE__.videoData.redirect_url)
                return API.toast.warning("番剧重定向...", this.__INITIAL_STATE__.videoData.redirect_url);
            if (this.__INITIAL_STATE__.videoData.stein_guide_cid)
                this.stop("这似乎是个互动视频！抱歉！旧版播放器无法支持 ಥ_ಥ");
            API.aid = this.__INITIAL_STATE__.aid;
            API.tid = this.__INITIAL_STATE__.videoData.tid; // 用于修复分区
            API.like = (_a = this.__INITIAL_STATE__.stat) === null || _a === void 0 ? void 0 : _a.like; // 用于点赞按钮
            API.switchVideo(() => {
                API.mediaSession({
                    title: this.__INITIAL_STATE__.videoData.pages.find((t) => t.cid == API.cid).part || this.__INITIAL_STATE__.videoData.title,
                    artist: this.__INITIAL_STATE__.videoData.owner.name,
                    album: this.__INITIAL_STATE__.videoData.title,
                    artwork: [{
                            src: this.__INITIAL_STATE__.videoData.pic
                        }]
                });
            });
            this.flushDocument();
        }
        appendIniState() {
            this.script.unshift({
                type: "text/javascript",
                text: \`window.__INITIAL_STATE__=\${JSON.stringify(this.__INITIAL_STATE__)};(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());\`
            });
        }
        afterFlush() {
            API.runWhile(() => document.getElementsByClassName("bili-header-m")[1], () => document.getElementsByClassName("bili-header-m")[1].remove()); // 移除上古顶栏
            window.commentAgent = { seek: (t) => window.player && window.player.seek(t) }; // 修复评论跳转
            API.config.enlike && API.importModule("enLike.js"); // 添加点赞功能
            API.config.upList && this.__INITIAL_STATE__.videoData.staff && API.importModule("upList.js", { staff: this.__INITIAL_STATE__.videoData.staff }); // 合作UP主
            API.importModule("descBV.js"); // 修复简介中超链接
            API.config.commandDm && API.importModule("commandDm.js"); // 互动弹幕
            API.importModule("videoSort.js"); // 修正分区信息
            API.config.electric && API.jsonphook("api.bilibili.com/x/web-interface/elec/show", url => API.Format.objUrl(url, { aid: 1, mid: 1 }));
            /dmid/.test(location.href) && /dm_progress/.test(location.href) && API.importModule("loadByDmid.js"); // 弹幕锚
        }
    }
    if (/\\/s\\//.test(location.href))
        location.replace(location.href.replace("s/video", "video"));
    new Av("av.html");

//# sourceURL=API://@Bilibili-Old/url/av/av.js`;
/*!***********************!*/
/**/modules["collection.js"] = /*** ./dist/url/av/collection.js ***/
`"use strict";
    function calcDivWidth(text) {
        let elem = document.createElement("div");
        elem.setAttribute("style", "display: inline-block");
        elem.innerText = text;
        document.body.append(elem);
        let w = elem.clientWidth;
        document.body.removeChild(elem);
        return w;
    }
    function calcOffsetPos(elem) {
        let result = { x: 0, y: 0 };
        for (let e = elem; e != null; e = e.offsetParent) {
            result.x += e.offsetLeft;
            result.y += e.offsetTop;
        }
        return result;
    }
    function getAid() {
        var _a;
        return (_a = window.history.state) === null || _a === void 0 ? void 0 : _a.aid;
    }
    class CollectionElement {
        constructor(onSpread) {
            this.items = [];
            this.spread = null;
            this.container = document.createElement("div");
            this.clearfix = document.createElement("ul");
            this.clearfix.className = "clearfix";
            this.container.appendChild(this.clearfix);
            if (onSpread) {
                this.spread = document.createElement("a");
                this.spread.className = "item v-part-toggle";
                this.spread.addEventListener("click", (e) => {
                    onSpread();
                    e.preventDefault();
                });
                this.clearfix.appendChild(this.spread);
            }
        }
        setContainerAttr(attr) {
            let staticClass = "multi-page bili-wrapper report-wrap-module report-scroll-module";
            this.container.className = [staticClass, attr.class].join(' ').trim();
        }
        setItemAttrs(attrs) {
            // 更新分集DOM节点数量
            while (this.items.length > attrs.length)
                this.clearfix.removeChild(this.items.pop().node);
            while (this.items.length < attrs.length) {
                let i = { click: null, node: document.createElement("a") };
                i.node.addEventListener("mouseenter", (e) => this.showFloatTxt(e));
                i.node.addEventListener("mouseleave", () => this.hideFloatText());
                i.node.addEventListener("click", (e) => {
                    // 参考vue router-link中防跳转处理
                    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.defaultPrevented || e.button != 0)
                        return;
                    e.preventDefault();
                    i.click && i.click(e);
                });
                this.clearfix.insertBefore(i.node, this.spread);
                this.items.push(i);
            }
            // 更新DOM节点属性
            const staticClass = "item";
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].node.className = [staticClass, attrs[i].class].join(' ').trim();
                this.items[i].node.innerText = attrs[i].text;
                this.items[i].node.href = attrs[i].href;
                this.items[i].click = attrs[i].click;
            }
        }
        setSpreadAttr(attr) {
            if (this.spread) {
                this.spread.style.top = attr.top + "px";
                attr.text && (this.spread.innerText = attr.text);
            }
        }
        showFloatTxt(e) {
            let item = e.target;
            let treshold = calcDivWidth(item.innerText) + 14;
            if (item.offsetWidth >= treshold)
                return;
            let floatTxt = document.createElement("div");
            floatTxt.className = "p-float-txt";
            floatTxt.innerText = item.innerText;
            document.body.appendChild(floatTxt);
            let pos = calcOffsetPos(item);
            floatTxt.style.left = pos.x + 'px';
            floatTxt.style.top = pos.y - 8 - floatTxt.clientHeight + 'px';
            // transition代替animate()
            floatTxt.style.transition = "opacity 0.4s, top 0.4s cubic-bezier(0.37, 0, 0.63, 1)";
            floatTxt.style.top = pos.y - 3 - floatTxt.clientHeight + 'px';
            floatTxt.style.opacity = "1";
        }
        hideFloatText() {
            let e = document.querySelector(".p-float-txt");
            e && document.body.removeChild(e);
        }
    }
    class CollectionData {
        constructor(season) {
            this.notify = null;
            this._viewEpisodes = [];
            this._ep = 0;
            this._spread = false;
            this._spreadBtnTop = 0;
            this._colCount = 4;
            this.episodes = [];
            this.initEpisodes(season);
            this.calcColCount();
            this._viewEpisodes = !this.needSpread() ? this.episodes :
                this.calcViewEpisodesOnCollapsed(this.ep);
        }
        get viewEpisodes() {
            return this._viewEpisodes;
        }
        get ep() {
            if (this.episodes[this._ep].aid != getAid())
                this._ep = this.episodes.findIndex((ep) => ep.aid == getAid());
            return this._ep;
        }
        get spreadBtnTop() {
            return this._spreadBtnTop;
        }
        set spreadBtnTop(n) {
            var _a;
            if (this._spreadBtnTop != n) {
                this._spreadBtnTop = n;
                (_a = this.notify) === null || _a === void 0 ? void 0 : _a.spreadBtnTop(this._spreadBtnTop);
            }
        }
        get spread() {
            return this._spread;
        }
        get colCount() {
            return this._colCount;
        }
        // 转换成/x/player/pagelist中的列表格式
        get pageList() {
            return this.episodes.reduce((s, ep, i) => {
                s.push({
                    aid: ep.aid,
                    cid: ep.cid,
                    page: i + 1,
                    part: ep.title,
                    duration: ep.page.duration,
                    dimension: ep.page.dimension,
                    from: ep.page.from,
                    vid: "",
                    weblink: ""
                });
                return s;
            }, []);
        }
        initEpisodes(season) {
            season.sections.forEach((section) => {
                Array.prototype.push.apply(this.episodes, section.episodes);
            });
        }
        calcColCount() {
            let w = calcDivWidth(this.episodes[this.ep].title);
            this._colCount = w >= 241 ? 3 : w >= 186 ? 4 :
                w >= 149 ? 5 : w >= 123 ? 6 :
                    window.innerWidth > 1440 ? 7 : 6;
        }
        calcViewEpisodesOnCollapsed(ep) {
            let begin = ep == 0 ? 0 :
                ep - 1 + this._colCount <= this.episodes.length ? ep - 1 :
                    this.episodes.length - this._colCount;
            return this.episodes.slice(begin, begin + this._colCount);
        }
        needSpread() {
            return this._colCount < this.episodes.length || this.spread;
        }
        toggleSpread() {
            var _a;
            this._spread = !this._spread;
            this._viewEpisodes = this._spread ? this.episodes :
                this.calcViewEpisodesOnCollapsed(this.ep);
            this._spreadBtnTop = 0;
            this.calcColCount();
            (_a = this.notify) === null || _a === void 0 ? void 0 : _a.spread(this._spread);
        }
        updateEp() {
            var _a;
            let ep = this._ep;
            if (ep == this.ep)
                return;
            this._viewEpisodes = this._spread ? this.episodes :
                this.calcViewEpisodesOnCollapsed(this.ep);
            (_a = this.notify) === null || _a === void 0 ? void 0 : _a.ep();
        }
    }
    class CollectionComponent {
        constructor(season, player) {
            this.data = new CollectionData(season);
            this.elem = new CollectionElement(this.data.needSpread() ?
                () => this.data.toggleSpread() : null);
            // 替换播放器换P处理
            window.callAppointPart = (_p, video) => {
                let state = { aid: video.aid, cid: video.cid };
                window.history.pushState(state, "", "/video/av" + video.aid);
                this.onRouteChanged(state);
            };
            window.addEventListener("popstate", (e) => {
                this.reloadPlayer(e.state);
                this.onRouteChanged(e.state);
            });
            window.addEventListener("scroll", () => this.onWindowScroll());
            this.render();
            player.parentNode.insertBefore(this.elem.container, player);
            this.data.notify = {
                spread: (spread) => {
                    this.render();
                    // 收起时页面滚动
                    !spread && window.scroll({ top: calcOffsetPos(document.getElementById("viewbox_report")).y });
                },
                spreadBtnTop: (top) => {
                    this.elem.setSpreadAttr({ top: top });
                },
                ep: () => this.render()
            };
            // 拦截播放器换P分P列表API
            API.xhrhook("/x/player/pagelist", undefined, (r) => {
                r.response = JSON.stringify({
                    code: 0,
                    message: 0,
                    ttl: 1,
                    data: this.data.pageList
                });
                r.responseText = r.response;
            }, false);
        }
        render() {
            this.elem.setContainerAttr({ class: "col-" + this.data.colCount });
            this.elem.setItemAttrs(this.data.viewEpisodes.map((p) => {
                return {
                    class: p.aid == getAid() ? "on" : "",
                    href: "/video/av" + p.aid,
                    text: p.title,
                    click: (_e) => {
                        let video = { aid: p.aid, cid: p.cid };
                        this.reloadPlayer(video);
                        window.callAppointPart(1, video);
                    }
                };
            }, this));
            this.elem.setSpreadAttr({
                top: this.data.spreadBtnTop,
                text: this.data.spread ? "收起" : "展开"
            });
        }
        reloadPlayer(v) {
            window.GrayManager.reload(\`aid=\${v.aid}&cid=\${v.cid}&has_next=1\`);
        }
        onWindowScroll() {
            if (!this.data.spread)
                return;
            // 展开按钮随页面滚动浮动
            let div = this.elem.container;
            let btn = this.elem.spread;
            let divY = calcOffsetPos(div).y;
            let maxTop = div.clientHeight - btn.clientHeight - 20;
            this.data.spreadBtnTop = window.scrollY <= divY - 20 ? 0 :
                Math.min(window.scrollY - divY + 20, maxTop);
        }
        onRouteChanged(state) {
            this.data.updateEp();
            // 视频信息刷新
            let avComponent = window.biliUIcomponents;
            // 评论和标签通过修改组件aid刷新
            avComponent.\$store.state.aid = state.aid;
            // 简介, 标题, 视频统计
            API.xhr({
                url: API.Format.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: state.aid }),
                responseType: "json",
                credentials: true
            }).then((d) => {
                var _a;
                avComponent === null || avComponent === void 0 ? void 0 : avComponent.setVideoData((_a = d.data) === null || _a === void 0 ? void 0 : _a.View);
            });
            // 下方视频推荐
            API.xhr({
                url: API.Format.objUrl("https://api.bilibili.com/x/web-interface/archive/related", { aid: state.aid }),
                responseType: "json",
                credentials: true
            }).then((d) => avComponent.related = d.data);
            // 收藏/投币状态
            avComponent.initPage();
            //TODO: 分区修复 & 点赞数
        }
    }
    class Collection {
        constructor(videoData) {
            this.component = undefined;
            API.xhrhook("/x/player.so", undefined, (r) => {
                // 替换has_next标签值让播放器显示下一P按钮
                r.response = r.response.replace(/<has_next>\\s*0/, "<has_next>1");
                r.responseText = r.response;
            }, false);
            API.runWhile(() => document.getElementById("__bofqi"), () => {
                try {
                    let player = document.getElementById("__bofqi");
                    window.history.replaceState({ aid: videoData.aid, cid: videoData.cid }, "");
                    this.component = new CollectionComponent(videoData.ugc_season, player);
                    this.component.render();
                }
                catch (e) {
                    API.toast.error("collection.js", e);
                }
            });
        }
        static needDisplay(videoData) {
            return videoData.videos <= 1 && videoData.ugc_season &&
                videoData.is_season_display;
        }
        static run(videoData) {
            this.needDisplay(videoData) && new Collection(videoData);
        }
    }
    //@ts-ignore
    Collection.run(videoData);

//# sourceURL=API://@Bilibili-Old/url/av/collection.js`;
/*!***********************!*/
/**/modules["commandDm.js"] = /*** ./dist/url/av/commandDm.js ***/
`"use strict";
    API.addCss(API.getModule("commandDm.css"));
    let player, widgetContainer;
    let playing = false;
    let visible = true;
    let commandDm = {
        visible: [],
        hidden: [] // 未显示的互动弹幕
    };
    /** 初始化互动弹幕功能 */
    function init(cdm) {
        if (window.player) {
            if (widgetContainer === undefined)
                widgetContainer = initContainer();
            player = window.player;
            bindEvents();
            load(cdm);
        }
        else
            throw "获取window.player失败";
    }
    /**
     * 添加互动弹幕
     * @param commandDmRaw 从服务器获得的互动弹幕数据
     */
    function load(commandDmRaw) {
        commandDm.hidden = parseDm(commandDmRaw);
        resize();
    }
    /**
     * 创建互动弹幕的容器div
     * @returns div.bilibili-player-video-popup
     */
    function initContainer() {
        let videoWrap = document.getElementsByClassName("bilibili-player-video-wrap")[0];
        if (!videoWrap)
            throw "未能获取播放器div";
        let widgetContainer = document.createElement("div");
        widgetContainer.className = "bilibili-player-video-popup";
        videoWrap.appendChild(widgetContainer);
        return widgetContainer;
    }
    /** 绑定播放器事件，使用window.player.addEventListener */
    function bindEvents() {
        const EVENT = {
            VIDEO_MEDIA_PLAYING: "video_media_playing",
            VIDEO_MEDIA_PAUSE: "video_media_pause",
            VIDEO_MEDIA_SEEK: "video_media_seek",
            VIDEO_MEDIA_SEEKED: "video_media_seeked",
            VIDEO_MEDIA_ENDED: "video_media_ended",
            VIDEO_RESIZE: "video_resize",
            VIDEO_PLAYER_RESIZE: "video_player_resize",
            VIDEO_DESTROY: "video_destroy"
        };
        player.addEventListener(EVENT.VIDEO_MEDIA_PLAYING, play);
        player.addEventListener(EVENT.VIDEO_MEDIA_PAUSE, pause);
        player.addEventListener(EVENT.VIDEO_MEDIA_SEEK, pause);
        player.addEventListener(EVENT.VIDEO_MEDIA_SEEKED, play);
        player.addEventListener(EVENT.VIDEO_MEDIA_ENDED, pause);
        player.addEventListener(EVENT.VIDEO_PLAYER_RESIZE, resize);
        player.addEventListener(EVENT.VIDEO_DESTROY, destroy);
        // 开启/关闭弹幕事件
        document.querySelector("div.bilibili-player-video-control > div.bilibili-player-video-btn.bilibili-player-video-btn-danmaku").addEventListener("click", (event) => {
            let option = event.target.getAttribute("name");
            if (option == "ctlbar_danmuku_close") {
                visible = false;
                pause();
                widgetContainer.style.display = "none";
            }
            else if (option == "ctlbar_danmuku_on") {
                visible = true;
                play();
                widgetContainer.style.display = "";
            }
        });
    }
    /**
     * 生成互动弹幕的UI组件，各种后续处理
     * @param commandDmRaw 互动弹幕原始数据
     * @returns 互动弹窗的UI对象
     */
    function parseDm(commandDmRaw) {
        let popupWindow = [];
        for (let i = 0, cdm, extra, from; i < commandDmRaw.length; i++) {
            cdm = commandDmRaw[i];
            extra = JSON.parse(cdm.extra);
            from = cdm.progress / 1000;
            switch (cdm.command) {
                // 4种将会弹出界面的互动弹幕(见原生代码appendPopup())
                case "#ATTENTION#":
                case "#ACTORFOLLOW#":
                case "#MANAGERFOLLOW#":
                    API.debug.warn("未被支持的互动弹幕类型：" + cdm.command);
                    API.debug.warn(cdm);
                    break;
                case "#VOTE#": // 投票弹窗
                    popupWindow.push(new Vote(cdm, extra, from));
                    break;
                case "#GRADE#": // 评分弹窗
                    popupWindow.push(new Grade(cdm, extra, from));
                    break;
                // 滚动弹幕(见原生代码appendDmImg())，它们的渲染也许需要去修改原生弹幕渲染器
                case "#LINK#":
                    popupWindow.push(new Link(cdm, extra, from));
                    break;
                case "#RESERVE#":
                case "#ACTOR#":
                case "#ACTIVITYCOMBO#":
                    API.debug.warn("未被支持的互动弹幕类型：" + cdm.command);
                    API.debug.warn(cdm);
                    break;
            }
        }
        return popupWindow;
    }
    function play() {
        if (visible) {
            playing = true;
            loop();
        }
    }
    function pause() {
        playing = false;
        loop();
    }
    /** 播放器大小更改时触发 */
    function resize() {
        // 获得当前播放器显示分辨率与最小分辨率(680x504)时的缩放比，用于UI缩放
        let scaleX = widgetContainer.clientWidth / 680;
        let scaleY = widgetContainer.clientHeight / 504;
        for (let i = 0; i < commandDm.visible.length; i++) {
            commandDm.visible[i].resize(scaleX, scaleY, widgetContainer.clientWidth, widgetContainer.clientHeight);
        }
        for (let i = 0; i < commandDm.hidden.length; i++) {
            commandDm.hidden[i].resize(scaleX, scaleY, widgetContainer.clientWidth, widgetContainer.clientHeight);
        }
    }
    function loop() {
        let time = player.getCurrentTime(); // 获得以秒为单位的当前播放进度
        if (playing) {
            requestAnimationFrame(loop);
        }
        // 根据播放进度，显示、隐藏互动弹幕界面
        for (let i = 0, cdm; i < commandDm.hidden.length; i++) {
            cdm = commandDm.hidden[i];
            if (cdm.from < time && cdm.to > time) {
                commandDm.visible.push(cdm);
                commandDm.hidden.splice(i, 1);
                cdm.show();
                resize();
            }
        }
        for (let i = 0, cdm; i < commandDm.visible.length; i++) {
            cdm = commandDm.visible[i];
            if (cdm.to < time || cdm.from > time) {
                commandDm.hidden.push(cdm);
                commandDm.visible.splice(i, 1);
                cdm.hide();
            }
        }
    }
    function destroy() {
        playing = false;
        for (let i = 0; i < commandDm.visible.length; i++) {
            commandDm.visible[i].destroy();
        }
        for (let i = 0; i < commandDm.hidden.length; i++) {
            commandDm.hidden[i].destroy();
        }
        commandDm.visible.splice(0, commandDm.visible.length);
        commandDm.hidden.splice(0, commandDm.hidden.length);
    }
    function divClass(className) {
        let div = document.createElement("div");
        div.className = className;
        return div;
    }
    function isLoggedin() {
        if (API.uid)
            return true;
        player.pause();
        API.bofqiMessage("请先登录");
        API.biliQuickLogin();
    }
    function post(url, data, contentType = "application/x-www-form-urlencoded;charset=UTF-8") {
        data.csrf = API.getCookies().bili_jct;
        return API.xhr({
            url: url,
            data: API.Format.objUrl("", data),
            headers: { "Content-Type": contentType },
            method: "POST",
            credentials: true
        });
    }
    /** 弹窗组件 */
    class PopupWindow {
        constructor(cdm, extra, from) {
            this.duration = extra.duration / 1e3 || 5;
            this.from = from || 0;
            this.to = from + (extra.duration / 1e3 || 5);
            this.pos_x = extra.posX || 200;
            this.pos_y = extra.posY || 200;
            this.popup = divClass("commandDm-popup");
            this.popup.style.display = "none";
            widgetContainer.appendChild(this.popup);
        }
        show() {
            this.popup.style.display = "";
            requestAnimationFrame(() => this.popup.className = "commandDm-popup on");
        }
        hide() {
            this.popup.className = "commandDm-popup";
            setTimeout(() => this.popup.style.display = "none", 200);
        }
        destroy() {
        }
        /**
        * 根据视频区域大小等比缩放投票界面
        */
        resize(scaleX, scaleY, containerWidth, containerHeight) {
            this.popup.style.transform = "translateX(-50%) translateY(-50%) scale(" + Math.min((scaleX + scaleY) / 2, 1.5) + ")";
            let left = this.pos_x * scaleX;
            let top = this.pos_y * scaleY;
            left = Math.max(left, this.popup.clientWidth / 2);
            top = Math.max(top, this.popup.clientHeight / 2);
            left = Math.min(left, containerWidth - this.popup.clientWidth / 2);
            top = Math.min(top, containerHeight - this.popup.clientHeight / 2);
            this.popup.style.left = left + "px";
            this.popup.style.top = top + "px";
        }
    }
    /** 投票互动UI */
    class Vote extends PopupWindow {
        constructor(cdm, extra, from) {
            super(cdm, extra, from);
            this.popup.style.width = "150px";
            this.total = extra.cnt;
            this.voteId = extra.vote_id;
            this.options = extra.options;
            this.question = extra.question;
            this.myVote = extra.my_vote; // 0：未投票  非零数字：已投票，my_vote的值即为已投项的idx
            let dialog = divClass("vote-dialog");
            let panel = divClass("vote-panel");
            let title = divClass("vote-title");
            title.innerHTML = this.question;
            let optionDiv = divClass("vote-option");
            let button = [];
            for (let i = 0, btn, opt; i < this.options.length; i++) {
                // 投票按钮
                opt = this.options[i];
                btn = divClass("vote-button");
                btn.innerHTML = opt.desc;
                btn.setAttribute("idx", opt.idx);
                btn.onclick = () => this.goVote(opt.idx, i);
                button[i] = btn;
                optionDiv.appendChild(btn);
            }
            panel.appendChild(optionDiv);
            dialog.appendChild(title);
            dialog.appendChild(panel);
            this.popup.appendChild(dialog);
            this.dialog = dialog;
            this.button = button;
            this.progress = [];
            // 已投票则直接显示结果
            if (this.myVote !== 0) {
                this.showResult();
                this.progress[this.myVote - 1].className = "vote-progress vote-progress-blue";
            }
            ;
        }
        goVote(idx, i) {
            if (isLoggedin()) {
                this.total += 1;
                this.options[i].cnt += 1;
                // 发送投票操作到服务器
                let url = "//api.bilibili.com/x/web-interface/view/dm/vote";
                post(url, {
                    aid: API.aid,
                    cid: API.cid,
                    progress: Math.max(Math.round(1e3 * player.getCurrentTime()), 1),
                    vote: idx,
                    vote_id: this.voteId
                }).then((resp) => {
                    resp = JSON.parse(resp);
                    biliAPI.verify(resp, "投票");
                    this.progress[i].className = "vote-progress vote-progress-blue";
                });
                this.myVote = idx;
                this.showResult();
                this.to += 5; //点击投票后推迟5秒消失，防止结果消失太快来不及看
            }
        }
        showResult() {
            // 显示票数、比例条
            this.count = [];
            for (let i = 0, progress, desc; i < this.button.length; i++) {
                this.button[i].onclick = null;
                this.button[i].innerHTML = "";
                this.button[i].className = "vote-progress-bg";
                progress = divClass("vote-progress");
                desc = divClass("vote-progress-desc");
                desc.innerHTML = this.options[i].desc;
                progress.appendChild(desc);
                this.button[i].appendChild(progress);
                this.progress[i] = progress;
                // 结果数据
                let cnt = divClass("vote-count");
                cnt.innerHTML = this.options[i].cnt;
                this.count[i] = cnt;
                this.button[i].appendChild(cnt);
            }
            this.resultAnimation();
        }
        /** 投票结果的动画 */
        resultAnimation() {
            // 投票比例条型图向右展开
            for (let i = 0; i < this.progress.length; i++) {
                this.progress[i].style.width = "0";
                requestAnimationFrame(() => this.progress[i].style.width = (this.options[i].cnt / this.total * 100) + "%");
            }
            // 右侧票数递增动画，持续0.8秒
            let start = performance.now();
            let frame = (t) => {
                let percentage = (t - start) * 0.00125;
                if (percentage < 1)
                    requestAnimationFrame(frame);
                else
                    percentage = 1;
                for (let i = 0; i < this.count.length; i++) {
                    this.count[i].innerHTML = Math.floor(this.options[i].cnt * percentage);
                }
            };
            requestAnimationFrame(frame);
        }
        show() {
            super.show();
            if (this.myVote !== 0) {
                this.resultAnimation();
            }
        }
        hide() {
            super.hide();
            this.to = this.from + this.duration; // 重设消失时间
        }
    }
    class Grade extends PopupWindow {
        constructor(cdm, info, from) {
            super(cdm, info, from);
            this.popup.style.width = "184px";
            this.gradeInfo = info;
            this.popup.innerHTML = \`
            <div style="display:block" class="grade-title">\${info.msg}</div>
            <div class="grade-score-area pointer"></div>
            <div class="grade-score-info" style="display:none">
                <div style="color:#6f6f6f;display:inline-block;">平均</div><span style="color:\${info.skin_font_color};font-size:27px" class="grade-avg-score">\${info.avg_score}</span>
            </div>
            <span style="position:absolute;right:1rem;top:0.8rem;font-size:12px;color:#6f6f6f" class="grade-score-count">\${info.count}人参与</span>
            \`;
            this.scoreInfo = this.popup.getElementsByClassName("grade-score-info")[0];
            let scoreArea = this.popup.getElementsByClassName("grade-score-area")[0];
            let scoreButton = [];
            function highlightScores(i) {
                for (let m = 0; m < 5; m++) {
                    if (m <= i && !scoreButton[m].highlight) {
                        scoreButton[m].highlight = true;
                        scoreButton[m].className = "highlight";
                    }
                    else if (m > i && scoreButton[m].highlight) {
                        scoreButton[m].highlight = false;
                        scoreButton[m].className = "";
                    }
                }
            }
            for (let i = 0; i < 5; i++) {
                let score = document.createElement("div");
                scoreButton[i] = score;
                score.innerHTML = \`
                <img width=20 hegiht=20 src="\${info.skin_selected}" class="bg"></img>
                <img width=20 hegiht=20 src="\${info.skin_selected}" class="score-button"></img>\`;
                scoreArea.appendChild(score);
                if (info.mid_score === 0) {
                    score.onmouseenter = () => highlightScores(i);
                    score.onclick = () => {
                        if (isLoggedin()) {
                            this.gradeInfo.avg_score = (this.gradeInfo.count * this.gradeInfo.avg_score + (i + 1) * 2) / (this.gradeInfo.count + 1);
                            this.gradeInfo.avg_score = this.gradeInfo.avg_score.toPrecision(2);
                            this.gradeInfo.count += 1;
                            this.popup.getElementsByClassName("grade-avg-score")[0].innerHTML = this.gradeInfo.avg_score;
                            this.popup.getElementsByClassName("grade-score-count")[0].innerHTML = this.gradeInfo.count + "人参与";
                            this.showResult();
                            for (let index = 0; index < 5; index++) {
                                if (index <= i) {
                                    scoreButton[index].style.animation = "grade-score-hit 0.7s ease forwards";
                                    setTimeout(() => scoreButton[index].style.animation = "", 1000);
                                }
                                scoreButton[index].onclick = null;
                                scoreButton[index].onmouseenter = null;
                            }
                            scoreArea.onmouseleave = null;
                            scoreArea.classList.remove("pointer");
                            this.goGrade((i + 1) * 2);
                        }
                    };
                }
            }
            ;
            if (info.mid_score === 0)
                scoreArea.onmouseleave = () => highlightScores(-1);
            this.scoreButton = scoreButton;
            if (info.mid_score != 0) {
                this.showResult();
                highlightScores(info.mid_score / 2 - 1);
                scoreArea.classList.remove("pointer");
            }
        }
        goGrade(score) {
            post("https://api.bilibili.com/x/v2/dm/command/grade/post", {
                aid: API.aid,
                cid: API.cid,
                progress: parseInt(player.getCurrentTime()) * 1000,
                grade_id: this.gradeInfo.grade_id,
                grade_score: score
            });
            this.to += 3;
        }
        showResult() {
            this.scoreInfo.style.display = "";
            this.scoreInfo.style.animation = "grade-score-showup 0.3s ease 0.2s forwards";
            for (let i = 0; i < 4; i++) {
                setTimeout(() => this.scoreButton[i].style.width = "24px", i * 50);
            }
        }
        hide() {
            super.hide();
            this.to = this.from + this.duration;
        }
    }
    /** 用于获取收藏列表有关信息 */
    class favList {
        static get() {
            if (this.list.length > 0)
                return Promise.resolve(this.list);
            return API.xhr({
                url: API.Format.objUrl("//api.bilibili.com/x/v3/fav/folder/created/list-all", {
                    type: String(2),
                    rid: String(API.aid),
                    up_mid: String(API.uid)
                }),
                credentials: true
            }).then((resp) => {
                resp = JSON.parse(resp);
                biliAPI.verify(resp, "获取收藏列表");
                this.list = resp.data.list;
                this.list.forEach((v) => v.attr === 1 && (this.defaultFolderId = v.id));
                return this.list;
            });
        }
        static getDefaultFolder() {
            if (this.defaultFolderId !== 0)
                return Promise.resolve(this.defaultFolderId);
            return this.get().then(() => { return this.defaultFolderId; });
        }
    }
    favList.list = [];
    favList.defaultFolderId = 0;
    /** @see https://github.com/SocialSisterYi/bilibili-API-collect */
    class biliAPI {
        static verify(resp, msg) {
            if (resp.code !== 0) {
                API.toast.error(msg + "失败", resp.code, resp.message);
                throw msg + "失败";
            }
            return resp;
        }
        static like(bool) {
            bool = bool ? 1 : 2;
            return post("//api.bilibili.com/x/web-interface/archive/like", {
                aid: API.aid,
                like: bool
            }, "application/json; charset=utf-8").then((resp) => biliAPI.verify(resp, "点赞"));
        }
        static follow() {
            return post("//api.bilibili.com/x/relation/modify", {
                aid: API.aid,
                fid: window.getAuthorInfo().mid,
                act: 1,
                re_src: 14
            }).then((resp) => {
                resp = JSON.parse(resp);
                return biliAPI.verify(resp, "关注");
            });
        }
        static coin() {
        }
        static fav() {
            return post("//api.bilibili.com/x/v3/fav/resource/deal", {
                rid: API.aid,
                type: 2,
                add_media_ids: favList.defaultFolderId,
            }).then((resp) => {
                resp = JSON.parse(resp);
                return biliAPI.verify(resp, "收藏");
            });
        }
        static triple() {
            return post("//api.bilibili.com/x/web-interface/archive/like/triple", {
                aid: API.aid
            }, "application/json; charset=utf-8").then((resp) => {
                biliAPI.verify(resp, "三连");
                let d = resp.data;
                if (d.coin && d.like && d.fav)
                    return;
                if (!d.coin)
                    API.toast.error("投币失败");
                if (!d.like)
                    API.toast.error("点赞失败");
                if (!d.fav)
                    API.toast.error("收藏失败");
                return d;
            });
        }
    }
    /** 关联视频跳转按钮 */
    class Link {
        constructor(cdm, extra, from) {
            this.content = cdm.content;
            this.aid = extra.aid;
            this.from = from || 0;
            this.to = from + 5;
            this.pos_x = extra.posX || 200;
            this.pos_y = extra.posY || 200;
            /*
                <div class="link-button">
                    <img src="https://static.hdslb.com/images/favicon.ico">
                    <span>关联视频跳转</span>
                </div>
            */
            let button = divClass("link-button");
            let img = document.createElement("img");
            img.src = "https://static.hdslb.com/images/favicon.ico";
            let span = document.createElement("span");
            span.innerHTML = this.content;
            button.appendChild(img);
            button.appendChild(span);
            button.style.display = "none";
            button.onclick = () => {
                player.pause();
                window.open("https://www.bilibili.com/video/av" + this.aid);
            };
            widgetContainer.appendChild(button);
            this.button = button;
        }
        show() {
            this.button.style.display = "block";
        }
        hide() {
            this.button.style.display = "none";
        }
        /** 根据视频区域大小缩放，放大倍数限制在最大1.5倍 */
        resize(scaleX, scaleY) {
            this.button.style.left = (this.pos_x * scaleX) + "px";
            this.button.style.top = (this.pos_y * scaleY) + "px";
            this.button.style.transform = "translateX(-50%) translateY(-50%) scale(" + Math.min(1.5, (scaleX + scaleY) / 2) + ")";
        }
        destroy() {
        }
    }
    /**
     * 程序入口
     * @param cdm 互动弹幕原始数据
     * @param aid aid
     * @param cid cid
     */
    async function loadCommandDm(cdm, aid, cid) {
        try {
            if (aid != aid || cid != cid || (widgetContainer !== undefined && document.getElementById("bilibiliPlayer").contains(widgetContainer))) {
                // 正在“载入其他视频弹幕”，不必处理互动弹幕
                return;
            }
            init(cdm); // 由于切P后整个播放器会被销毁重建，每次载入互动弹幕都需要重新绑定事件
        }
        catch (e) {
            API.toast.error("commandDm.js", e);
        }
    }
    API.loadCommandDm = loadCommandDm;

//# sourceURL=API://@Bilibili-Old/url/av/commandDm.js`;
/*!***********************!*/
/**/modules["descBV.js"] = /*** ./dist/url/av/descBV.js ***/
`"use strict";
    API.switchVideo(() => {
        try {
            let desc = document.getElementsByClassName("info");
            if (desc[1] && desc[1].parentNode && desc[1].parentNode.id == "v_desc") {
                let text = desc[1].textContent;
                text = text.replace(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/g, (str) => {
                    return "av" + API.abv(str);
                    ;
                }).replace(/(av|sm)[0-9]+/gi, (str) => {
                    str = str.toLowerCase();
                    return \`<a target="_blank" href="http://acg.tv/\${str}">\${str}</a>\`; // 此域名并未升级https！
                });
                desc[1].innerHTML = text;
            }
        }
        catch (e) {
            API.debug.error("descBV.js", e);
        }
    });

//# sourceURL=API://@Bilibili-Old/url/av/descBV.js`;
/*!***********************!*/
/**/modules["enLike.js"] = /*** ./dist/url/av/enLike.js ***/
`"use strict";
    class Like {
        constructor() {
            this.aid = undefined;
            this.coin = undefined;
            this.span = undefined;
            /** 点赞了吗？ */
            this.liked = false;
            /** 点赞数 */
            this.number = API.like || 0;
            /** 未点赞图标 */
            this.svgLike = \`<svg viewBox="0 0 38.89 34.47" width="22px"><defs><style>.cls-1{fill:#f36392;}</style></defs><g><path class="cls-1" d="M10.28,32.77h2.5V13.19h-2.5ZM25,10.55H35.42a4.15,4.15,0,0,1,3.33,1.67,4.38,4.38,0,0,1,.56,3.47L34.86,30.41a6.37,6.37,0,0,1-6,4.86H5.56a4.52,4.52,0,0,1-4.31-2.36,5.61,5.61,0,0,1-.69-2.5V15.55a4.93,4.93,0,0,1,2.5-4.31,8.38,8.38,0,0,1,2.5-.69h6.25l6.8-8.49A3.83,3.83,0,0,1,25.25,5Zm10.14,2.51H22.22l.28-2.92L22.92,5a1.26,1.26,0,0,0-.18-1,1.28,1.28,0,0,0-.82-.56,1.11,1.11,0,0,0-1.25.42l-6.36,8.2-.83,1.11H5.14a2,2,0,0,0-.83.28,2.28,2.28,0,0,0-1.25,2.08V30.41a2,2,0,0,0,.42,1.25,2,2,0,0,0,2.08,1.11H28.89a2.38,2.38,0,0,0,1.39-.41,3.61,3.61,0,0,0,2.08-2.78L36.8,15l2.5.56L36.8,15a2.45,2.45,0,0,0-.14-1.39,2.89,2.89,0,0,0-1.52-.54l.28-2.5Z" transform="translate(-0.56 -0.82)"/></g></svg>\`;
            /** 已点赞图标 */
            this.svgEnLike = \`<svg viewBox="0 0 38.89 34.47" width="22px"><defs><style>.cls-1{fill:#f36392;}</style></defs><g><path class="cls-1" d="M12.06,35.27V10.43h-.15l6.7-8.37A3.83,3.83,0,0,1,25.25,5L25,10.55H35.42a4.15,4.15,0,0,1,3.33,1.67,4.38,4.38,0,0,1,.56,3.47L34.86,30.41a6.37,6.37,0,0,1-6,4.86Zm-2.5,0h-4a4.52,4.52,0,0,1-4.31-2.36,5.61,5.61,0,0,1-.69-2.5V15.55a4.93,4.93,0,0,1,2.5-4.31,8.38,8.38,0,0,1,2.5-.69h4Z" transform="translate(-0.56 -0.82)"/></g></svg>\`;
            API.runWhile(() => {
                this.coin = API.path.name == "watchlater" ? document.querySelector(".u.coin") : document.querySelector("[report-id*=coin]");
                return this.coin && API.aid;
            }, () => this.init());
        }
        init() {
            this.style();
            this.aid = API.aid;
            this.span = document.createElement("span");
            this.span.classList.add("ulike");
            this.coin.parentElement.insertBefore(this.span, this.coin);
            this.changeLiked();
            this.span.addEventListener("click", () => this.setLike());
            API.switchVideo(() => this.switch());
            try {
                !this.number && API.xhr({
                    url: \`https://api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    this.number = API.jsonCheck(d).data.stat.like;
                    this.changeLiked();
                });
                API.uid && API.xhr({
                    url: \`https://api.bilibili.com/x/web-interface/archive/has/like?aid=\${API.aid}\`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    d = API.jsonCheck(d).data;
                    d === 1 && (this.liked = true, this.changeLiked());
                });
            }
            catch (e) {
                API.toast.error("点赞出错！", e);
            }
        }
        /** 修补样式 */
        style() {
            let style = \`.ulike {cursor: pointer;}.ulike svg{vertical-align: middle;margin-right: 10px;}\`;
            switch (API.path.name) {
                case "bangumi":
                    style += \`.ulike {margin-left: 15px;position: relative;float: left;height: 100%;line-height: 18px;font-size: 12px;color: #222;}\`;
                    break;
                case "watchlater":
                    style += \`.video-info-module .number .ulike {margin-left: 15px;margin-right: 5px;}\`;
                    break;
                default: style += \`.video-info-m .number .ulike {margin-left: 15px;margin-right: 5px;}\`;
            }
            API.addCss(style);
        }
        /** 点赞响应 */
        setLike() {
            if (API.uid) {
                const like = this.liked ? 2 : 1;
                API.xhr({
                    url: "https://api.bilibili.com/x/web-interface/archive/like",
                    method: "POST",
                    data: \`aid=\${API.aid}&like=\${like}&csrf=\${API.getCookies().bili_jct}\`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    API.jsonCheck(d).ttl;
                    this.liked = !this.liked;
                    this.number = this.liked ? this.number + 1 : this.number - 1;
                    this.changeLiked();
                });
            }
            else
                API.biliQuickLogin();
        }
        /** 图标及数目变化 */
        changeLiked() {
            this.span.innerHTML = \`\${this.liked ? this.svgEnLike : this.svgLike}</i>点赞 \${API.Format.unitFormat(this.number) || "--"}\`;
        }
        /** 切p后刷新数据 */
        switch() {
            if (this.aid != API.aid) {
                this.aid = API.aid;
                API.xhr({
                    url: \`https://api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`,
                    credentials: true,
                    responseType: "json"
                }).then(d => {
                    this.number = API.jsonCheck(d).data.stat.like;
                    this.changeLiked();
                });
            }
        }
    }
    new Like();

//# sourceURL=API://@Bilibili-Old/url/av/enLike.js`;
/*!***********************!*/
/**/modules["hookWebpackJsonp.js"] = /*** ./dist/url/av/hookWebpackJsonp.js ***/
`"use strict";
    let webpackJsonpFunction;
    Object.defineProperty(window, "webpackJsonp", {
        get() {
            if (webpackJsonpFunction) {
                return (chunkIds, moreModules, executeModules) => {
                    function inject(index, replaceFn) {
                        let code = moreModules[index].toString();
                        moreModules[index] = new Function("t", "e", "i", "(" + replaceFn(code) + ")(t,e,i)");
                    }
                    // length == 716 -> vendor.js
                    //        == 717 -> video.b1b7706abd590dd295794f540f7669a5d8d978b3.js
                    if (moreModules.length == 717) {
                        // 暴露UI组件
                        // .onCoinSuccess(n)   页面变为已投币n枚的状态
                        // .onFollow()         变为已关注状态
                        // .favSubmit(bool)    设置收藏状态，参数bool: true -> “已收藏”状态 false -> 未收藏状态
                        inject(274, (code) => code.replace("init:function(){", "init:function(){window.biliUIcomponents=this;"));
                        // 修复：收藏视频时，在“添加到收藏夹”弹窗中，如果将视频从收藏夹A删除，并同时添加到收藏夹B，点击确定后窗口不消失的问题
                        /* 报错原因示意：
                            jQuery.when(deferredA,deferredB).done((resultA,resultB) => {
                                let codeA = resultA[0].code; // Cannot read property 'code' of undefined
                                let codeA = resultA.code;    // 本应该写成这样
                            })
                        */
                        inject(251, (code) => code.replace("e[0].code", "e.code").replace("i[0].code", "i.code"));
                    }
                    return webpackJsonpFunction(chunkIds, moreModules, executeModules);
                };
            }
        },
        set(func) {
            webpackJsonpFunction = func;
        }
    });

//# sourceURL=API://@Bilibili-Old/url/av/hookWebpackJsonp.js`;
/*!***********************!*/
/**/modules["initialStateOfAv.js"] = /*** ./dist/url/av/initialStateOfAv.js ***/
`"use strict";
    class InitialStateOfAv {
        constructor(data) {
            this.__INITIAL_STATE__ = {
                aid: 0,
                comment: { count: 0, list: [] },
                error: {},
                isClient: false,
                p: "",
                player: "",
                playurl: "",
                related: [],
                tags: [],
                upData: {
                    face: "https://static.hdslb.com/images/akari.jpg",
                    name: "",
                    mid: 0,
                    DisplayRank: "0",
                    Official: { desc: "", role: 0, title: "", type: -1 },
                    approve: false,
                    archiveCount: 0,
                    article: 0,
                    attention: 10,
                    attentions: [],
                    birthday: "",
                    description: "",
                    fans: 44616,
                    friend: 10,
                    level_info: { current_exp: 0, current_level: 6, current_min: 0, next_exp: 0 },
                    nameplate: { condition: "", image: "", image_small: "", level: "", name: "", mid: 0 },
                    official_verify: { desc: "", type: -1 },
                    pendant: { expire: 0, image: "", image_enhance: "", image_enhance_frame: "", name: "", pid: 0 },
                    place: "",
                    rank: 10000,
                    regtime: 0,
                    sex: "保密",
                    sign: "",
                    spacesta: 0,
                    vip: { accessStatus: 0, dueRemark: "", theme_type: 0, vipStatus: 0, vipStatusWarn: "", vipType: 1 }
                },
                videoData: {
                    aid: 0,
                    cid: 0,
                    config: { relates_title: "相关推荐", share_style: 1 },
                    copyright: 2,
                    ctime: "",
                    desc: "",
                    dimension: { height: 1080, rotate: 0, width: 1920 },
                    duration: 360,
                    dynamic: "",
                    owner: {},
                    pages: [{ cid: 0, dimension: { height: 1080, rotate: 0, width: 1920 }, duration: 360, from: "vupload", page: 1, part: "", vid: "", weblink: "" }],
                    pic: "",
                    pubdate: "",
                    redirect_url: undefined,
                    rights: { autoplay: 0, bp: 0, download: 0, elec: 0, hd5: 0, is_cooperation: 0, movie: 0, no_background: 0, no_reprint: 0, pay: 0, ugc_pay: 0, ugc_pay_preview: 0 },
                    stat: {
                        aid: 0,
                        coin: 0,
                        danmaku: 0,
                        dislike: 0,
                        favorite: 0,
                        his_rank: 0,
                        like: 0,
                        now_rank: 0,
                        reply: 0,
                        share: 0,
                        view: 0
                    },
                    state: 0,
                    stein_guide_cid: undefined,
                    tid: 0,
                    title: 0,
                    tname: 0,
                    videos: 1,
                    embedPlayer: 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid:0&aid:0&pre_ad:")'
                }
            };
            this.data = data;
        }
        detail() {
            this.data = API.jsonCheck(this.data).data;
            if (!this.data.View.cid && this.data.View.forward) {
                API.toast.warning("视频撞车了！正在跳转至原视频~");
                location.href = \`https://www.bilibili.com/video/av\${this.data.View.forward}\`;
            }
            this.__INITIAL_STATE__.aid = this.data.View.aid;
            this.__INITIAL_STATE__.related = this.data.Related || [];
            this.__INITIAL_STATE__.tags = this.data.Tags || [];
            this.__INITIAL_STATE__.upData = this.data.Card.card || {};
            this.__INITIAL_STATE__.upData.archiveCount = this.data.Card.archive_count;
            this.__INITIAL_STATE__.videoData = this.data.View || {};
            this.__INITIAL_STATE__.videoData.embedPlayer = \`EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=\${this.data.View.cid}&aid=\${this.data.View.aid}&pre_ad=")\`;
            return this.__INITIAL_STATE__;
        }
        plus() {
            this.data = API.jsonCheck(this.data);
            this.data.v2_app_api && this.data.v2_app_api.redirect_url && (location.href = this.data.v2_app_api.redirect_url);
            this.data.bangumi && this.data.bangumi.ogv_play_url && (location.href = this.data.bangumi.ogv_play_url);
            this.__INITIAL_STATE__.aid = this.data.aid || API.aid;
            this.__INITIAL_STATE__.upData.name = this.data.author;
            this.__INITIAL_STATE__.upData.mid = this.data.mid;
            this.__INITIAL_STATE__.videoData.aid = this.data.aid || API.aid;
            this.__INITIAL_STATE__.videoData.cid = this.data.list[0].cid;
            this.__INITIAL_STATE__.videoData.ctime = this.data.created;
            this.__INITIAL_STATE__.videoData.pubdate = this.data.created;
            this.__INITIAL_STATE__.videoData.desc = this.data.description;
            this.__INITIAL_STATE__.videoData.pages[0].cid = this.data.list[0].cid;
            this.__INITIAL_STATE__.videoData.stat.aid = this.data.aid;
            this.__INITIAL_STATE__.videoData.stat.coin = this.data.coins;
            this.__INITIAL_STATE__.videoData.stat.danmaku = this.data.video_review;
            this.__INITIAL_STATE__.videoData.stat.favorite = this.data.favorites;
            this.__INITIAL_STATE__.videoData.stat.reply = this.data.review;
            this.__INITIAL_STATE__.videoData.stat.view = this.data.play;
            this.__INITIAL_STATE__.videoData.tid = this.data.tid;
            this.__INITIAL_STATE__.videoData.title = this.data.title;
            this.__INITIAL_STATE__.videoData.tname = this.data.typename;
            this.data.v2_app_api && (this.__INITIAL_STATE__.tags = this.data.v2_app_api.tag, this.__INITIAL_STATE__.videoData = this.data.v2_app_api);
            this.__INITIAL_STATE__.videoData.embedPlayer = \`EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=\${this.data.list[0].cid}&aid=\${this.data.aid}&pre_ad=")\`;
            API.switchVideo(() => API.bofqiMessage(["视频已失效", "加载弹幕", "缓存信息仅供参考"], 3));
            return this.__INITIAL_STATE__;
        }
        view() {
            this.data = API.jsonCheck(this.data);
            this.__INITIAL_STATE__.aid = API.aid;
            this.__INITIAL_STATE__.tags = this.data.tag || [];
            this.__INITIAL_STATE__.upData.name = this.data.author;
            this.__INITIAL_STATE__.upData.face = this.data.face;
            this.__INITIAL_STATE__.upData.mid = this.data.mid;
            this.__INITIAL_STATE__.videoData.aid = API.aid;
            this.__INITIAL_STATE__.videoData.cid = this.data.cid;
            this.__INITIAL_STATE__.videoData.ctime = this.data.created;
            this.__INITIAL_STATE__.videoData.pubdate = this.data.created;
            this.__INITIAL_STATE__.videoData.desc = this.data.description;
            this.__INITIAL_STATE__.videoData.pages[0].cid = this.data.cid;
            this.__INITIAL_STATE__.videoData.stat.aid = API.aid;
            this.__INITIAL_STATE__.videoData.stat.coin = this.data.coins;
            this.__INITIAL_STATE__.videoData.stat.danmaku = this.data.video_review;
            this.__INITIAL_STATE__.videoData.stat.favorite = this.data.favorites;
            this.__INITIAL_STATE__.videoData.stat.reply = this.data.review;
            this.__INITIAL_STATE__.videoData.stat.view = this.data.play;
            this.__INITIAL_STATE__.videoData.tid = this.data.tid;
            this.__INITIAL_STATE__.videoData.title = this.data.title;
            this.__INITIAL_STATE__.videoData.tname = this.data.typename;
            this.__INITIAL_STATE__.videoData.embedPlayer = \`EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=\${this.data.cid}&aid=\${API.aid}&pre_ad=")\`;
            return this.__INITIAL_STATE__;
        }
    }
    API.InitialStateOfAv = InitialStateOfAv;

//# sourceURL=API://@Bilibili-Old/url/av/initialStateOfAv.js`;
/*!***********************!*/
/**/modules["loadByDmid.js"] = /*** ./dist/url/av/loadByDmid.js ***/
`"use strict";
    const dmid = API.Format.urlObj(location.href).dmid;
    let progress = Number(API.Format.urlObj(location.href).dm_progress);
    let first = 0;
    API.switchVideo(async () => {
        var _a;
        if (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.seek)) {
            await new Promise(r => {
                API.runWhile(() => { var _a; return (_a = window.player) === null || _a === void 0 ? void 0 : _a.seek; }, r);
            });
        }
        if (first)
            return;
        first++;
        if (progress)
            return window.player.seek(progress);
        if (dmid) {
            progress = await API.xhr({
                url: \`https://api.bilibili.com/x/v2/dm/thumbup/detail?oid=\${API.cid}&dmid=\${dmid}\`,
                credentials: true
            });
            progress = API.jsonCheck(progress).data.progress; // 检查xhr返回值并转化为json
            progress && window.player.seek(progress / 1000 - .2);
        }
    });

//# sourceURL=API://@Bilibili-Old/url/av/loadByDmid.js`;
/*!***********************!*/
/**/modules["upList.js"] = /*** ./dist/url/av/upList.js ***/
`"use strict";
    API.runWhile(() => document.querySelector("#v_upinfo"), () => {
        try {
            let fl = '<span class="title">UP主列表</span><div class="up-card-box">';
            // @ts-ignore：该变量由主模块传入
            fl = staff.reduce((s, d) => {
                s = s + \`<div class="up-card">
                <a href="//space.bilibili.com/\${d.mid}" data-usercard-mid="\${d.mid}" target="_blank" class="avatar">
                <img src="\${d.face}@48w_48h.webp" /><!---->
                <span class="info-tag">\${d.title}</span><!----></a>
                <div class="avatar">
                <a href="//space.bilibili.com/\${d.mid}" data-usercard-mid="\${d.mid}" target="_blank" class="\${(d.vip && d.vip.status) ? 'name-text is-vip' : 'name-text'}">\${d.name}</a>
                </div></div>\`;
                return s;
            }, fl) + \`</div>\`;
            document.querySelector("#v_upinfo").innerHTML = fl;
            API.addCss(API.getModule("upList.css"));
        }
        catch (e) {
            API.toast.error("upList.js", e);
        }
    });

//# sourceURL=API://@Bilibili-Old/url/av/upList.js`;
/*!***********************!*/
/**/modules["videoSort.js"] = /*** ./dist/url/av/videoSort.js ***/
`"use strict";
    API.runWhile(() => document.querySelector(".tm-info") && API.aid, () => {
        try {
            const sort = API.getModule("videoSort.json");
            if (API.path.name == "av" && API.tid && API.tid in sort) {
                const nodes = document.querySelector(".tm-info").childNodes;
                nodes[1].replaceWith(nodes[0].cloneNode(true));
                nodes[2].replaceWith(nodes[0].cloneNode(true));
                nodes[2].childNodes[1].remove();
                nodes[1].childNodes[0].href = sort[sort[API.tid][0]][2];
                nodes[1].childNodes[0].text = sort[sort[API.tid][0]][1];
                nodes[2].childNodes[0].href = sort[API.tid][2];
                nodes[2].childNodes[0].text = sort[API.tid][1];
            }
            else if (API.path.name == "watchlater") {
                const nodes = document.querySelector(".tm-info").childNodes;
                if (nodes[2].nodeType === 8) {
                    API.xhr({
                        url: \`https://api.bilibili.com/x/web-interface/view?aid=\${API.aid}\`,
                        responseType: "json"
                    }).then(d => {
                        API.tid = API.jsonCheck(d).data.tid;
                        if (API.tid && API.tid in sort) {
                            nodes[2].replaceWith(nodes[0].cloneNode(true));
                            nodes[4].replaceWith(nodes[0].cloneNode(true));
                            nodes[4].childNodes[1].remove();
                            nodes[2].childNodes[0].href = sort[sort[API.tid][0]][2];
                            nodes[2].childNodes[0].text = sort[sort[API.tid][0]][1];
                            nodes[4].childNodes[0].href = sort[API.tid][2];
                            nodes[4].childNodes[0].text = sort[API.tid][1];
                        }
                    });
                }
            }
        }
        catch (e) {
            API.debug.error("videoSort.js", e);
        }
    });

//# sourceURL=API://@Bilibili-Old/url/av/videoSort.js`;
/*!***********************!*/
/**/modules["bangumi.js"] = /*** ./dist/url/bangumi/bangumi.js ***/
`"use strict";
    class Bangumi extends API.Rewrite {
        constructor(html) {
            super(html);
            this.epid = API.path[5].startsWith('ep') ? Number(location.href.match(/[0-9]+/)[0]) : null;
            /** 页面数据请求参数 */
            this.obj = {};
            this.script = [
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/promise.auto.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js",
                    crossorigin: "",
                    defer: "defer"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js",
                    crossorigin: "",
                    defer: "defer"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/phoenix/dist/js/comment.min.js"
                },
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/common/js/footer.js"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"
                }
            ];
            this.getIniState();
            this.onload = () => { this.afterFlush(); };
        }
        async getIniState() {
            var _a, _b, _c;
            API.path.name = "bangumi"; // 重写标记
            API.pgc = true; // pgc标记
            API.path[5].startsWith('ss') && (this.obj.season_id = location.href.match(/[0-9]+/)[0]);
            API.path[5].startsWith('ep') && (this.obj.ep_id = location.href.match(/[0-9]+/)[0]);
            if (API.uid && !this.epid) { // ss页面需要获取历史ep信息
                const data = await API.xhr({ url: location.href });
                const arr = data.match(/last_ep_id\\"\\:[0-9]+/) || [];
                this.epid = (arr[0] && arr[0].split(":")[1]) || null;
            }
            await new Promise(r => {
                if (this.obj.season_id || this.obj.ep_id) {
                    API.xhr({
                        url: API.Format.objUrl("https://bangumi.bilibili.com/view/web_api/season", this.obj),
                        responseType: "json",
                        credentials: true
                    }).then(d => {
                        this.__INITIAL_STATE__ = new API.InitialStateOfBangumi(d, this.epid).season();
                        r(true);
                    }).catch(e => {
                        API.toast.error("获取bangumi数据出错！", e);
                        if (API.config.videoLimit) {
                            API.xhr({
                                url: API.Format.objUrl(\`\${API.config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season\`, this.obj),
                                responseType: "json",
                                credentials: true
                            }).then(d => {
                                this.__INITIAL_STATE__ = new API.InitialStateOfBangumi(d, this.epid).global();
                                API.limit = true;
                                API.globalLimit = true;
                                r(true);
                            }).catch(e => {
                                API.debug.error(e);
                            });
                        }
                    });
                }
            });
            if (((_b = (_a = this.__INITIAL_STATE__) === null || _a === void 0 ? void 0 : _a.epInfo) === null || _b === void 0 ? void 0 : _b.badge) === "互动")
                this.stop("这似乎是个互动番剧！什么！番剧也能互动？可惜旧版播放器不支持 ಥ_ಥ");
            API.config.bangumiEplist && ((_c = this.__INITIAL_STATE__) === null || _c === void 0 ? void 0 : _c.epList[1]) && (this.__INITIAL_STATE__.special = false, this.__INITIAL_STATE__.mediaInfo.bkg_cover = undefined); // 特殊背景
            this.appendIniState();
            API.config.episodeData && API.importModule("episodeData.js"); // 显示分集数据
            API.importModule("restoreData.js"); // 修复页面数据
            API.switchVideo(() => {
                const ep = this.__INITIAL_STATE__.epList.find((d) => d.cid == API.cid);
                ep && API.mediaSession({
                    title: ep.index_title || this.__INITIAL_STATE__.mediaInfo.title,
                    artist: this.__INITIAL_STATE__.upInfo.uname,
                    album: this.__INITIAL_STATE__.mediaInfo.title,
                    artwork: [{
                            src: ep.cover
                        }]
                });
            });
            this.flushDocument();
        }
        appendIniState() {
            if (this.__INITIAL_STATE__.special) { // 特殊背景页面样式修改
                const head = document.querySelector(".z-top-container.has-menu");
                head.classList.remove("has-menu");
                head.style.height = "42px";
                document.querySelector("#app").classList.add("special");
            }
            this.script.unshift({
                type: "text/javascript",
                text: \`window.__INITIAL_STATE__=\${JSON.stringify(this.__INITIAL_STATE__)};(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());\`
            });
        }
        afterFlush() {
            API.config.enlike && API.importModule("enLike.js"); // 添加点赞功能
            API.runWhile(() => document.querySelector(".new-entry"), () => { var _a; return (_a = document.querySelector(".new-entry")) === null || _a === void 0 ? void 0 : _a.remove(); }); // 移除过期节点
            if (document.compatMode === "BackCompat") { // 怪异模式下样式修复
                API.addCss(".header-info .count-wrapper div, .ulike { height:18px !important; }.bili-header-m .nav-menu .profile-info .i-face { top:5px; }");
            }
        }
    }
    new Bangumi("bangumi.html");

//# sourceURL=API://@Bilibili-Old/url/bangumi/bangumi.js`;
/*!***********************!*/
/**/modules["episodeData.js"] = /*** ./dist/url/bangumi/episodeData.js ***/
`"use strict";
    let first = 0; // 首p指示
    API.switchVideo(async () => {
        try {
            first++;
            let views = document.querySelector(".view-count").querySelector("span");
            let danmakus = document.querySelector(".danmu-count").querySelector("span");
            if (first === 1) {
                // 首p时辈分总播放数和总弹幕数
                views.setAttribute("title", "总播放数 " + views.innerText);
                danmakus.setAttribute("title", "总弹幕数 " + danmakus.innerText);
                API.debug.debug("总播放数", views.innerText, " 总弹幕数", danmakus.innerText);
            }
            let data = await API.xhr({
                url: API.Format.objUrl("https://api.bilibili.com/x/web-interface/archive/stat", { "aid": String(API.aid) }),
                credentials: true
            }); // 获取分集数据
            data = API.jsonCheck(data).data;
            let view = data.view;
            let danmaku = data.danmaku;
            view = API.Format.unitFormat(view);
            danmaku = API.Format.unitFormat(danmaku);
            views.innerText = view;
            danmakus.innerText = danmaku;
            API.debug.debug("播放", view + " 弹幕", danmaku);
        }
        catch (e) {
            API.debug.error("episodeData.js", e);
        }
    });

//# sourceURL=API://@Bilibili-Old/url/bangumi/episodeData.js`;
/*!***********************!*/
/**/modules["initialStateOfBangumi.js"] = /*** ./dist/url/bangumi/initialStateOfBangumi.js ***/
`"use strict";
    class InitialStateOfBangumi {
        constructor(data, epId) {
            this.__INITIAL_STATE__ = {
                activity: {},
                app: false,
                area: 0,
                canReview: true,
                epId: 0,
                epInfo: {},
                epList: [],
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
            this.epId = Number(epId) || NaN;
            this.data = API.jsonCheck(data).result;
            API.vipCid = [];
        }
        season() {
            const ids = this.data.episodes.reduce((s, d) => {
                s.push(d.ep_id);
                (d.badge == "会员" || d.badge_type) && API.vipCid.push(d.cid);
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
            const ids = [], epList = [];
            this.data.modules.forEach((d) => {
                d.this.data.episodes.forEach((d) => {
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
                });
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
            this.__INITIAL_STATE__.rightsInfo = this.data.right;
            this.__INITIAL_STATE__.seasonStat = this.data.stat;
            this.__INITIAL_STATE__.ssId = this.data.season_id;
            return this.__INITIAL_STATE__;
        }
    }
    API.InitialStateOfBangumi = InitialStateOfBangumi;

//# sourceURL=API://@Bilibili-Old/url/bangumi/initialStateOfBangumi.js`;
/*!***********************!*/
/**/modules["restoreData.js"] = /*** ./dist/url/bangumi/restoreData.js ***/
`"use strict";
    // 修复追番数
    API.xhrhook("bangumi.bilibili.com/ext/web_api/season_count?", args => {
        args[1] = args[1].replace('bangumi.bilibili.com/ext/web_api/season_count', 'api.bilibili.com/pgc/web/season/stat');
    }, args => {
        const response = API.jsonCheck(args.responseText);
        response.result.favorites = response.result.follow;
        args.response = args.responseText = JSON.stringify(response);
    }, false);
    // 修复番剧推荐
    API.addCss(\`#bangumi_recommend_vertial .recom-list{
            height: 960px;
            overflow: auto;
        } .recom-list::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
        }\`, "recom-list");
    API.runWhile(() => document.querySelector(".recom-list.clearfix"), async () => {
        let result = API.jsonCheck(await API.xhr({ url: API.Format.objUrl("https://api.bilibili.com/x/tag/info", { tag_name: (API.__INITIAL_STATE__).mediaInfo.title }) }));
        result = API.jsonCheck(await API.xhr({ url: API.Format.objUrl("https://api.bilibili.com/x/web-interface/tag/top", { tid: result.data.tag_id }) })).data;
        result = result.reduce((s, d) => {
            s = s + \`<li class="recom-item">
                <a href="https://www.bilibili.com/video/av\${d.aid}" target="_blank" title="\${d.title}">
                <div class="recom-img"><div class="common-lazy-img">
                <img alt="\${d.title}" src="\${d.pic.replace("http:", "")}@224w_140h.webp" lazy="loaded">
                </div></div>
                <div class="recom-info">
                <div class="info-title">\${d.title}</div>
                <div class="info-count">
                <div class="play-count"><i></i><span>\${API.Format.unitFormat(d.stat.view)}</span></div>
                <div class="danmu-count"><i></i><span>\${API.Format.unitFormat(d.stat.danmaku)}</span></div>
                </div></div></a></li>\`;
            return s;
        }, "");
        document.querySelector(".recom-list.clearfix").innerHTML = result;
    });

//# sourceURL=API://@Bilibili-Old/url/bangumi/restoreData.js`;
/*!***********************!*/
/**/modules["ad2info.js"] = /*** ./dist/url/index/ad2info.js ***/
`"use strict";
    API.runWhile(() => document.querySelector("#bili_ad"), function () {
        const node = document.querySelector("#bili_ad");
        const sight = node.querySelectorAll("a");
        const title = node.querySelector(".name");
        const technology = document.querySelector("#bili_technology").querySelector(".name");
        const digital = document.querySelector("#bili_digital").querySelector(".name");
        title && (title.innerText = "资讯");
        sight.forEach(d => {
            d.href && d.href.includes("www.bilibili.com/v/ad/ad/") && (d.href = "https://www.bilibili.com/v/information/");
        });
        API.addElement("div", { class: "r-con" }, undefined, '<div class="r-con"><header style="margin-bottom: 14px"><h3 style="font-size: 18px;font-weight: 400;">资讯分区正式上线啦！</h3></header><div class="carousel-module"><div class="panel"><a href="https://www.bilibili.com/v/information" target="_blank"><img src="//i0.hdslb.com/bfs/archive/0747d26dbbc3bbf087d47cff49e598a326b0030c.jpg@320w_330h_1c.webp" width="260" height="280"/></a></div></div></div>', undefined, document.querySelector("#ranking_ad"));
        technology.href = "//www.bilibili.com/v/knowledge/";
        technology.innerHTML = "知识";
        digital.href = "//www.bilibili.com/v/tech/";
        digital.innerHTML = "科技";
        document.querySelector(".icon.icon_t.icon-ad").setAttribute("style", "background-image: url(//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/image/news.png);background-position: unset;");
    });
    API.runWhile(() => document.querySelector(".report-wrap-module.elevator-module"), function () {
        const node = document.querySelector(".report-wrap-module.elevator-module");
        for (let item of node.children[1].children) {
            if (item.innerHTML == "广告")
                item.innerHTML = "资讯";
            if (item.innerHTML == "科技")
                item.innerHTML = "知识";
            if (item.innerHTML == "数码")
                item.innerHTML = "科技";
        }
    });

//# sourceURL=API://@Bilibili-Old/url/index/ad2info.js`;
/*!***********************!*/
/**/modules["biliIndexRec.js"] = /*** ./dist/url/index/biliIndexRec.js ***/
`"use strict";
    API.xhrhook("api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRec", args => {
        args[1] = args[1].includes("List") ? args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web') : args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web');
    }, obj => {
        var _a;
        let response = (_a = obj.responseText) === null || _a === void 0 ? void 0 : _a.replace(/preview_banner_list/, "preview").replace(/ranking_list/, "ranking").replace(/recommend_room_list/, "recommend");
        if (response) {
            response = JSON.parse(response);
            response.data.text_link = { text: "233秒居然能做这些！", link: "//vc.bilibili.com" };
            if (response.data.recommend) {
                for (let i = 0; i < response.data.recommend.length; i++) {
                    response.data.recommend[i].pic = response.data.recommend[i].cover;
                    response.data.recommend[i].link = "//live.bilibili.com" + response.data.recommend[i].link;
                }
            }
            if (response.data.preview)
                for (let i = 0; i < response.data.preview.length; i++)
                    response.data.preview[i].url = response.data.preview[i].link;
            obj.response = obj.responseText = JSON.stringify(response);
        }
    }, false);

//# sourceURL=API://@Bilibili-Old/url/index/biliIndexRec.js`;
/*!***********************!*/
/**/modules["index.js"] = /*** ./dist/url/index/index.js ***/
`"use strict";
    class Index extends API.Rewrite {
        constructor(html) {
            super(html);
            this.script = [
                {
                    type: "text/javascript",
                    src: "//static.hdslb.com/js/jquery.min.js"
                },
                {
                    src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js",
                    defer: "defer"
                },
                {
                    src: "//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js",
                    defer: "defer"
                },
                {
                    type: "text/javascript",
                    src: "//s1.hdslb.com/bfs/cm/st/bundle.js",
                    crossorigin: ""
                },
                {
                    type: "text/javascript",
                    defer: "defer",
                    charset: "utf-8",
                    src: "//static.hdslb.com/common/js/footer.js"
                }
            ];
            API.path.name = "index"; // 重写标记
            this.getIniState();
            this.onload = () => { this.afterFlush(); };
        }
        async getIniState() {
            const data = (await API.xhr({
                url: "https://api.bilibili.com/x/web-show/res/locs?pf=0&ids=4694,34,31",
                responseType: "json"
            })).data;
            let result = { locsData: { 23: data[4694], 34: data[34], 31: data[31] } };
            API.config.indexLoc && this.reAD(result); // 广告
            window.__INITIAL_STATE__ = result; // 写入__INITIAL_STATE__
            API.importModule("indexSort.js");
            this.flushDocument();
        }
        reAD(data) {
            for (let key in data.locsData) {
                if (Array.isArray(data.locsData[key])) {
                    data.locsData[key] = data.locsData[key].filter((d) => {
                        return d.is_ad ? (API.debug.debug("移除广告", key, d), false) : true;
                    });
                }
            }
        }
        afterFlush() {
            // 移除无效节点
            API.runWhile(() => document.querySelector(".ver"), () => { var _a; return (_a = document.querySelector(".ver")) === null || _a === void 0 ? void 0 : _a.remove(); });
            API.runWhile(() => document.querySelector("#fixed_app_download"), () => { var _a; return (_a = document.querySelector("#fixed_app_download")) === null || _a === void 0 ? void 0 : _a.remove(); });
            // 修复失效分区
            API.addCss(".bili-tab.rank-tab, .bili-dropdown.rank-dropdown { pointer-events: none; }");
        }
    }
    new Index("index.html");

//# sourceURL=API://@Bilibili-Old/url/index/index.js`;
/*!***********************!*/
/**/modules["indexRecommend.js"] = /*** ./dist/url/index/indexRecommend.js ***/
`"use strict";
    let indexRecommend, indexFlag;
    API.runWhile(() => document.querySelector(".bili-wrapper"), async function () {
        try {
            let node = document.querySelector(".recommend-module.clearfix"); // 父节点
            let prev = API.addElement("span", { class: "rec-btn prev" }, node, undefined, undefined, document.querySelector(".rec-btn.prev")); // 替换切换按钮
            let next = API.addElement("span", { class: "rec-btn next" }, node, undefined, undefined, document.querySelector(".rec-btn.next")); // 替换切换按钮
            prev.innerHTML = next.innerHTML = "切换"; // 命名按钮
            prev.onclick = next.onclick = async () => {
                // 按钮单击回调
                document.querySelectorAll(".groom-module.home-card").forEach(d => d.remove()); // 移除现有数据
                let wait = API.addElement("div", { class: "load-state" }, node, undefined, true); // 添加loading临时节点
                wait.innerHTML = '<span class="loading">正在加载...</span><!----><!---->'; // 写入loading提示
                indexRecommend = indexRecommend && indexRecommend.length > 20 ? indexRecommend : API.jsonCheck(await API.xhr({
                    url: "https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3",
                    credentials: !API.config.privateRecommend
                })).data.item; // 请求推荐数据，分情况，个性化推荐每次都请求，全站推荐只请求一次
                indexFlag = indexRecommend.length < 20 ? 10 : indexFlag || ((API.uid && API.config.privateRecommend) ? 10 : 20); // 设置遍历起始点，个性化推荐固定为10
                wait.remove(); // 移除loading节点
                for (let i = indexFlag - 1; i >= indexFlag - 10; i--) {
                    // 依次创建推荐数据，长度固定为10
                    API.addElement("div", { class: "groom-module home-card" }, node, undefined, true).innerHTML = \`<a href="//www.bilibili.com/video/av\${indexRecommend[i].aid || indexRecommend[i].id}" target="_blank" title="\${indexRecommend[i].title}">
                        <img src="\${indexRecommend[i].pic.replace("http:", "")}@160w_100h.webp" alt="\${indexRecommend[i].title}" width="160" height="100" class="pic">
                        "><!----><div class="card-mark"><p class="title">\${indexRecommend[i].title}</p><p class="author">up主：\${indexRecommend[i].owner.name}</p><p class="play">播放：\${API.Format.unitFormat(indexRecommend[i].stat.view)}</p></div></a><div class="watch-later-trigger w-later"></div></div>\`;
                }
                indexFlag = indexRecommend.length < 20 ? 10 : indexFlag < 30 ? indexFlag + 10 : 10; // 对于全站推荐，刷新遍历起始点
            };
            prev.click(); // 移除个性化推荐
        }
        catch (e) {
            API.debug.error("indexRecommend.js", e);
        }
    });

//# sourceURL=API://@Bilibili-Old/url/index/indexRecommend.js`;
/*!***********************!*/
/**/modules["indexSort.js"] = /*** ./dist/url/index/indexSort.js ***/
`"use strict";
    API.importModule("biliIndexRec.js");
    API.importModule("ad2info.js");
    API.importModule("mediaRank.js");
    API.importModule("indexRecommend.js");
    // 广告取转资讯区
    API.jsonphook(["region", "rid=165"], url => url.replace("rid=165", "rid=202"), undefined, false);
    // 用户热点最新投稿修复资讯区最新投稿
    API.jsonphook(["newlist", "rid=165"], url => url.replace("rid=165", "rid=203"), undefined, false);
    // 取消原创排行榜
    API.jsonphook(["region", "original=1"], url => url.replace("original=1", "original=0"), undefined, false);
    // 修复置顶推荐
    API.jsonphook("api.bilibili.com/x/web-interface/ranking/index", url => url.replace("ranking/index", "index/top"), undefined, false);

//# sourceURL=API://@Bilibili-Old/url/index/indexSort.js`;
/*!***********************!*/
/**/modules["mediaRank.js"] = /*** ./dist/url/index/mediaRank.js ***/
`"use strict";
    async function fixRank(node) {
        const sorts = {
            bili_movie: ["ranking_movie", 2, "https://www.bilibili.com/ranking/cinema/23/0/3"],
            bili_teleplay: ["ranking_teleplay", 5, "https://www.bilibili.com/ranking/cinema/11/0/3"],
            bili_documentary: ["ranking_documentary", 3, "https://www.bilibili.com/ranking/cinema/177/0/3"]
        };
        const sort = sorts[node.id];
        if (!sort)
            return;
        let section = node.getElementsByClassName("sec-rank report-wrap-module zone-rank")[0];
        section.innerHTML = '<header class="rank-head"><h3>排行</h3></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list"></ul></div><a href="' + sort[2] + '" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>';
        try {
            let data = await API.xhr({ url: API.Format.objUrl("https://api.bilibili.com/pgc/season/rank/web/list", { season_type: sort[1], day: '3' }) });
            data = API.jsonCheck(data).data;
            let div = node.getElementsByClassName("bangumi-rank-list rank-list")[0];
            for (let i = 0; i < 8; i++) {
                let li = document.createElement("li"), cl = i < 3 ? "rank-item highlight" : "rank-item", fw;
                li.setAttribute("class", cl);
                li.innerHTML = '<i class="ri-num">' + (i + 1) + '</i><a href="' + data.list[i].url + '" target="_blank" title="' + data.list[i].title + ' 播放:' + data.list[i].stat.view + '" class="ri-info-wrap"><p class="ri-title">' + data.list[i].title + '</p><span class="ri-total">' + data.list[i].new_ep.index_show + '</span></a>';
                li.onmouseover = () => {
                    fw = document.createElement("div");
                    fw.setAttribute("class", "bangumi-info-module");
                    fw.setAttribute("style", 'left: ' + li.getBoundingClientRect().left + 'px; top: ' + (API.getTotalTop(li) - 150) + 'px;');
                    fw.innerHTML = '<div class="v-preview clearfix"><div class="lazy-img cover"><img alt="' + data.list[i].title + '" src="' + data.list[i].cover + '" /></div><div><p class="title">' + data.list[i].title + '</p><p class="desc">' + data.list[i].new_ep.index_show + '</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>' + API.Format.unitFormat(data.list[i].stat.view) + '</span><span class="danmu"><i class="icon"></i>' + API.Format.unitFormat(data.list[i].stat.danmaku) + '</span><span class="fav"><i class="icon"></i>' + API.Format.unitFormat(data.list[i].stat.follow) + '</span></div>';
                    document.body.appendChild(fw);
                };
                li.onmouseout = () => fw.remove();
                div.appendChild(li);
            }
        }
        catch (e) {
            API.debug.error("indexSort.js", e);
        }
    }
    API.runWhile(() => document.querySelector("#bili_movie"), () => fixRank(document.querySelector("#bili_movie")));
    API.runWhile(() => document.querySelector("#bili_teleplay"), () => fixRank(document.querySelector("#bili_teleplay")));
    API.runWhile(() => document.querySelector("#bili_documentary"), () => fixRank(document.querySelector("#bili_documentary")));

//# sourceURL=API://@Bilibili-Old/url/index/mediaRank.js`;
/*!***********************!*/
/**/modules["live.js"] = /*** ./dist/url/live/live.js ***/
`"use strict";
    API.config.liveP2p && API.importModule("WebRTC.js");
    API.config.sleepCheck && API.importModule("sleepCheck.js");
    API.runWhile(() => document.querySelector(".web-player-icon-roomStatus"), () => { var _a; return (_a = document.querySelector(".web-player-icon-roomStatus")) === null || _a === void 0 ? void 0 : _a.remove(); });

//# sourceURL=API://@Bilibili-Old/url/live/live.js`;
/*!***********************!*/
/**/modules["sleepCheck.js"] = /*** ./dist/url/live/sleepCheck.js ***/
`"use strict";
    const fun = setInterval;
    let flag = 0;
    window.setInterval = (...args) => {
        if (args[1] && args[1] == 300000 && args[0] && args[0].toString() == "function(){e.triggerSleepCallback()}") {
            if (!flag) {
                API.toast.warning("成功阻止直播间挂机检测！");
                flag++;
            }
            return Number.MIN_VALUE;
        }
        return fun.call(window, ...args);
    };

//# sourceURL=API://@Bilibili-Old/url/live/sleepCheck.js`;
/*!***********************!*/
/**/modules["WebRTC.js"] = /*** ./dist/url/live/WebRTC.js ***/
`"use strict";
    if (typeof navigator.getUserMedia !== "undefined")
        navigator.getUserMedia = undefined;
    if (typeof window.MediaStreamTrack !== "undefined")
        window.MediaStreamTrack = undefined;
    if (typeof window.RTCPeerConnection !== "undefined")
        window.RTCPeerConnection = undefined;
    if (typeof window.RTCSessionDescription !== "undefined")
        window.RTCSessionDescription = undefined;
    if (typeof navigator.mozGetUserMedia !== "undefined")
        navigator.mozGetUserMedia = undefined;
    if (typeof window.mozMediaStreamTrack !== "undefined")
        window.mozMediaStreamTrack = undefined;
    if (typeof window.mozRTCPeerConnection !== "undefined")
        window.mozRTCPeerConnection = undefined;
    if (typeof window.mozRTCSessionDescription !== "undefined")
        window.mozRTCSessionDescription = undefined;
    if (typeof navigator.webkitGetUserMedia !== "undefined")
        navigator.webkitGetUserMedia = undefined;
    if (typeof window.webkitMediaStreamTrack !== "undefined")
        window.webkitMediaStreamTrack = undefined;
    if (typeof window.webkitRTCPeerConnection !== "undefined")
        window.webkitRTCPeerConnection = undefined;
    if (typeof window.webkitRTCSessionDescription !== "undefined")
        window.webkitRTCSessionDescription = undefined;

//# sourceURL=API://@Bilibili-Old/url/live/WebRTC.js`;
/*!***********************!*/
/**/modules["album.js"] = /*** ./dist/url/space/album.js ***/
`"use strict";
    API.xhrhook("api.bilibili.com/x/dynamic/feed/draw/doc_list", undefined, obj => {
        const response = JSON.parse(obj.responseText);
        let data = response.data.items.reduce((s, d) => {
            s.push(d.doc_id);
            return s;
        }, []);
        setTimeout(() => {
            document.querySelectorAll(".album-card").forEach((d, i) => {
                d.firstChild.href = \`//h.bilibili.com/\${data[i]}\`;
                d.children[1].href = \`//h.bilibili.com/\${data[i]}\`;
            });
        }, 1000);
    }, false);

//# sourceURL=API://@Bilibili-Old/url/space/album.js`;
/*!***********************!*/
/**/modules["jointime.js"] = /*** ./dist/url/space/jointime.js ***/
`"use strict";
    (async function () {
        try {
            if (!document.querySelector(".user-info-title")) {
                await new Promise(r => {
                    API.runWhile(() => document.querySelector(".user-info-title"), r);
                });
            }
            let data = API.jsonCheck(await API.xhr.GM({ url: API.Format.objUrl("https://account.bilibili.com/api/member/getCardByMid", { "mid": API.mid }) }));
            let jointime = API.Format.timeFormat(data.card.regtime * 1000, true);
            let node = document.querySelector(".user-info-title");
            API.addElement("span", { class: "info-jointime" }, node, jointime);
        }
        catch (e) {
            API.toast.error("jsontime.js", e);
        }
    })();

//# sourceURL=API://@Bilibili-Old/url/space/jointime.js`;
/*!***********************!*/
/**/modules["lostVideo.js"] = /*** ./dist/url/space/lostVideo.js ***/
`"use strict";
    async function getLostVideo(aid) {
        let result = []; // 失效视频信息缓存
        try { // 尝试访问Biliplus
            let data = await API.xhr.GM({ url: \`https://www.biliplus.com/video/av\${aid}\` });
            if (data.match(/\\<title\\>.+?\\ \\-\\ AV/)) {
                result[0] = data.match(/\\<title\\>.+?\\ \\-\\ AV/)[0].replace(/<title>/, "").replace(/ - AV/, "");
                result[1] = data.match(/\\<img style=\\"display:none\\"\\ src=\\".+?\\"\\ alt/)[0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
            }
        }
        catch (e) {
            API.debug.error("lostVideo.js", e);
        }
        if (!result[0] || !result[1]) {
            try { // 标题或封面无效，尝试访问Biliplus CID缓存库
                let data = await API.xhr.GM({ url: \`https://www.biliplus.com/all/video/av\${aid}/\` });
                if (data.match('/api/view_all?')) {
                    data = data.match(/\\/api\\/view_all\\?.+?\\',cloudmoe/)[0].replace(/\\',cloudmoe/, "");
                    data = await API.xhr.GM({ url: \`//www.biliplus.com\${data}\` });
                    data = API.jsonCheck(data).data;
                    result[0] = result[0] || data.info.title;
                    result[1] = result[1] || data.info.pic;
                }
            }
            catch (e) {
                API.debug.error("lostVideo.js", e);
            }
        }
        if (!result[0] || !result[1]) {
            try { // 标题或封面依旧无效，尝试访问jijidown
                let data = await API.xhr.GM({ url: \`https://www.jijidown.com/video/\${aid}\` });
                if (data.match('window._INIT')) {
                    result[0] = result[0] || data.match(/\\<title\\>.+?\\-哔哩哔哩唧唧/)[0].replace(/<title>/, "").replace(/-哔哩哔哩唧唧/, "");
                    result[1] = result[1] || data.match(/\\"img\\":\\ \\".+?\\",/)[0].match(/http.+?\\",/)[0].replace(/",/, "");
                }
            }
            catch (e) {
                API.debug.error("lostVideo.js", e);
            }
        }
        result[0] = result[0] || \`av\${aid}\`; // 无法获取有效数据，将标题改为av号
        result[1] = result[1] ? result[1].replace("http:", "") : "//i0.hdslb.com/bfs/archive/be27fd62c99036dce67efface486fb0a88ffed06.jpg"; //无法获取有效数据，将封面改为哭脸
        return result;
    }
    API.observerAddedNodes((node) => {
        if (/section channel guest/.test(node.className)) {
            let items = node.querySelectorAll(".small-item.disabled");
            items.forEach(d => {
                let aid = d.getAttribute("data-aid"); // 获取aid
                aid = Number(aid) || API.abv(aid); // 转化为数字
                d.setAttribute("class", "small-item fakeDanmu-item");
                d.setAttribute("data-aid", aid);
                d.children[0].href = \`//www.bilibili.com/video/av\${aid}\`;
                d.children[1].href = \`//www.bilibili.com/video/av\${aid}\`;
                d.children[0].setAttribute("target", "_blank");
                d.children[1].setAttribute("target", "_blank");
                d.children[0].setAttribute("class", "cover cover-normal");
                d.children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                getLostVideo(aid).then(data => {
                    d.children[1].setAttribute("title", data[0]);
                    d.children[1].text = data[0];
                    d.children[0].children[0].alt = data[0];
                    d.children[0].children[0].src = data[1];
                });
            });
        }
        if (/small-item disabled/.test(node.className)) {
            let aid = node.getAttribute("data-aid"); // 获取aid
            aid = Number(aid) || API.abv(aid); // 转化为数字
            node.setAttribute("class", "small-item fakeDanmu-item");
            node.setAttribute("data-aid", aid);
            node.children[0].href = \`//www.bilibili.com/video/av\${aid}\`;
            node.children[1].href = \`//www.bilibili.com/video/av\${aid}\`;
            node.children[0].setAttribute("target", "_blank");
            node.children[1].setAttribute("target", "_blank");
            node.children[0].setAttribute("class", "cover cover-normal");
            node.children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
            getLostVideo(aid).then(data => {
                node.children[1].setAttribute("title", data[0]);
                node.children[1].text = data[0];
                node.children[0].children[0].alt = data[0];
                node.children[0].children[0].src = data[1];
            });
        }
    });

//# sourceURL=API://@Bilibili-Old/url/space/lostVideo.js`;
/*!***********************!*/
/**/modules["midInfo.js"] = /*** ./dist/url/space/midInfo.js ***/
`"use strict";
    const response = API.getModule("mid.json");
    response.data.mid = API.mid;
    switch (Number(API.mid)) {
        case 11783021:
            response.data.name = "哔哩哔哩番剧出差";
            response.data.official.desc = "哔哩哔哩番剧出差 官方帐号";
            break;
        case 1988098633:
            response.data.name = "b站_戲劇咖";
            response.data.official.desc = "b站_戲劇咖 官方帐号";
            break;
        case 2042149112:
            response.data.name = "b站_綜藝咖";
            response.data.official.desc = "b站_綜藝咖 官方帐号";
            break;
    }
    API.xhrhook("api.bilibili.com/x/space/acc/info", undefined, obj => {
        if (obj.responseText && obj.responseText.includes("-404")) {
            obj.response = obj.responseText = JSON.stringify(response);
            API.toast.warning("该用户被404，已使用缓存数据恢复访问！");
        }
    }, false);

//# sourceURL=API://@Bilibili-Old/url/space/midInfo.js`;
/*!***********************!*/
/**/modules["space.js"] = /*** ./dist/url/space/space.js ***/
`"use strict";
    API.mid = (API.path[3] && API.path[3].split("?")[0]) || API.mid;
    API.config.errands && (API.mid == 11783021 || API.mid == 1988098633 || API.mid == 2042149112) && API.importModule("midInfo.js");
    API.config.album && API.importModule("album.js"); // 相簿重定向
    API.config.jointime && API.importModule("jointime.js"); // 注册时间
    API.config.lostVideo && API.importModule("lostVideo.js"); // 失效视频

//# sourceURL=API://@Bilibili-Old/url/space/space.js`;
/*!***********************!*/"use strict";
(function () {
    /** 入口点，切换上下文环境回页面 */
    new Function("GM", "modules", modules["main.js"])(GM, modules);
})();
