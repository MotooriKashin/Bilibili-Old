// ==UserScript==
// @name         Bilibili 旧播放页
// @namespace    MotooriKashin
// @version      6.0.4
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
// @resource     protobuf.min.js https://cdn.jsdelivr.net/npm/protobufjs@6.10.1/dist/protobuf.min.js
// @resource     comment.js https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/comment.js
// ==/UserScript==

/**
 * 脚本主体，负责提供脚本与模块间沟通的桥梁
 */
(function () {
    GM.xmlHttpRequest = GM_xmlhttpRequest;
    GM.getValue = GM_getValue;
    GM.setValue = GM_setValue;
    GM.deleteValue = GM_deleteValue;
    GM.listValues = GM_listValues;
    GM.getResourceText = GM_getResourceText;
    GM.getResourceURL = GM_getResourceText;
    // @ts-ignore 忽略unsafeWindow错误
    const root = unsafeWindow;
    const modules = {};
    
    modules["alert.css"] = `.table {
    line-height: 14px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    top: 50%;
    background: #FFFFFF;
    box-shadow: 0 3px 12px 0 rgb(0 0 0 / 20%);
    border-radius: 10px;
    width: 300px;
    height: auto;
    padding: 18px;
    position: fixed;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);z-index: 11124;
}
.title {
    line-height: 22px;
    margin-left: 2px;
    margin-bottom: 10px;
    font-size: 14px;
}
.text {
    margin-bottom: 3px;
    margin-left: 2px;
}
.act {
    line-height: 154%;
    align-items: center;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    font-weight: 500;
    min-width: 5.14em;
    outline-width: 0;
    overflow: hidden;
    padding: 8px 16px;
    position: relative;
    user-select: none;
    border: none;
    color: #fff;
    justify-content: space-around;
}`;
    modules["animated-banner.css"] = `.animated-banner {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.animated-banner > .layer {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}`;
    modules["avatarAnimation.css"] = `/* 鼠标放在顶栏上的动效 */
.bili-header-m .profile-info .i-face .face{
    border:0
}
.bili-header-m .profile-info .i-face .pendant{
    transform:scale(0.5);
    width:112px;
    height:112px;
    left:-41px;
    bottom:-46px;
    opacity:0;
    transition:opacity .1s ease-in
}
.bili-header-m .profile-info.on .i-face{
    left:8px;
    top:0;
    height:32px;
    width:32px;
    transform:translateY(10px) translateX(-16px) scale(2);
    transform-origin:top left
}
.bili-header-m .profile-info.on .i-face .legalize{
    transform:scale(0.5) translate(10px,15px)
}
.bili-header-m .profile-info.on .i-face .pendant{
    opacity:1
}
.bili-header-m .profile-info.on .i-face .face{
    border:0;
    box-shadow:0 0 0 2px #fff
}
.bili-header-m .profile-info.on .i-face.scale-in{
    transform:translateY(5px) translateX(-10px) scale(1.75)
}
.bili-header-m .profile-info.on .scale-in .face{
    height:32px;
    width:32px
}
.bili-header-m .profile-info.on .i-face.scale-in .legalize{
    transform:scale(0.5) translate(38px,48px)
}`;
    modules["bofqi.css"] = `#bofqi .player {
    width: 980px;
    height: 620px;
    display: block;
}       
@media screen and (min-width:1400px) {
    #bofqi .player {
        width: 1160px;
        height: 720px
    }
}`;
    modules["button.css"] = `.button{
    line-height: 154%;
    align-items: center;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    font-weight: 500;
    height: 32px;
    justify-content: center;
    min-width: 5.14em;
    outline-width: 0;
    overflow: hidden;
    padding: 8px 16px;
    position: relative;
    user-select: none;
}
.button {
    background-color: #fff;
    color: rgb(26,115,232);
    border: 1px solid rgba(0,0,0,6%);
}
.button:hover{
    background-color: rgba(26,115,232,6%);
}
.button:active{
    box-shadow: 0 0 1px 1px rgba(0,0,0,10%);
}
.button[disabled]{
    pointer-events: none;
    background-color: rgba(239, 239, 239, 0.3);
    border: 1px solid rgba(118, 118, 118, 0.3);
    color: rgba(16, 16, 16, 0.3);
}`;
    modules["checkbox.css"] = `/* 复选框 */
.box {
  display: inline-flex;
}
.checkbox {
  align-items: center;
  display: flex;
  min-height: auto;
  padding: 0;
  cursor: pointer;
}
.checkbox .checklabel {
  height: 16px;
  margin-block-start: 0px;
  position: relative;
  width: 16px;
  border-radius: 50%;
}
.checklabel .disc-border {
  border: 2px solid rgb(95, 99, 104);
  box-sizing: border-box;
  height: 16px;
  width: 16px;
  border-radius: 50%;
}
.checklabel .disc-border[checked] {
  border-color: rgb(26, 115, 232);
}
.checklabel .disc {
  background-color: transparent;
  position: absolute;
  top: 0;
  transform: scale(0);
  transition: border-color 200ms, transform 200ms;
  box-sizing: border-box;
  height: 16px;
  width: 16px;
  border-radius: 50%;
}
.checklabel .disc[checked] {
  background-color: rgb(26, 115, 232);
  transform: scale(0.5);
}
.checkbox .checkvalue {
  flex: 1;
  margin-inline-start: 5px;
  margin-inline-end: 5px;
}`;
    modules["closedCaption.css"] = `/* CC字幕相关样式 */
/*对齐，悬停按钮显示菜单*/
#subtitle-setting-panel>div>* {margin-right: 5px;}
#bilibili-player-subtitle-btn:hover>#subtitle-setting-panel {display: block!important;}
/*滑动选择样式*/
#subtitle-setting-panel input[type="range"] {
    background-color: #ebeff4;
    -webkit-appearance: none;
    height:4px;
    transform: translateY(-4px);
}
#subtitle-setting-panel input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 15px;
    width: 15px;
    background: #fff;
    border-radius: 15px;
    border: 1px solid;
}
/*复选框和其对应标签样式*/
#subtitle-setting-panel input[type="checkbox"]{display:none;}
#subtitle-setting-panel input ~ label {cursor:pointer;}
#subtitle-setting-panel input:checked ~ label:before {content: '\\2714';}
#subtitle-setting-panel input ~ label:before{
    width: 12px;
    height:12px;
    line-height: 14px;
    vertical-align: text-bottom;
    border-radius: 3px;
    border:1px solid #d3d3d3;
    display: inline-block;
    text-align: center;
    content: ' ';
}
/*悬停显示下拉框样式*/
#subtitle-setting-panel .bpui-selectmenu:hover .bpui-selectmenu-list{display:block;}
/*滚动条样式*/
#subtitle-setting-panel ::-webkit-scrollbar{width: 7px;}
#subtitle-setting-panel ::-webkit-scrollbar-track{border-radius: 4px;background-color: #EEE;}
#subtitle-setting-panel ::-webkit-scrollbar-thumb{border-radius: 4px;background-color: #999;}`;
    modules["commandDm.css"] = `.commandDm-popup {
  border-radius: 1rem;
  background-color: #f5f5f5;
  position: absolute;
  cursor: default;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.8rem 1rem;
}

.commandDm-popup.on {
  opacity: 1;
}

.vote-dialog {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.vote-panel {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.vote-title,
.grade-title {
  font-weight: bolder;
  margin-bottom: 0.5rem;
}

.vote-option {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.vote-button {
  text-align: center;
  min-width: 85px;
  display: inline-block;
  padding: 0.3rem 2rem;
  border: 1px solid #00a1d6;
  border-radius: 5px;
  margin: 0.2rem 0;
  background-color: #fff;
  cursor: pointer;
}

.vote-button:hover {
  background-color: #1baada;
  color: #f5f5f5;
  transition: all 0.15s ease-out;
}

.vote-button::before {
  position: absolute;
  padding: 0 1.8rem;
  left: 0;
  content: attr(idx);
}

.vote-progress-bg {
  border-radius: 5px;
  min-width: 85px;
  margin: 0.2rem 0;
  border: 1px solid #1a1a1a6b;
  background-color: white;
  position: relative;
}

.vote-progress {
  transition: width 0.3s, background-color 0.2s;
  animation: opacity-animation 0.5s;
  overflow: hidden;
  display: inline-block;
  border-radius: 4px;
  background-color: #d3d3d3;
  text-align: left;
  overflow: visible;
  position: relative;
}

.vote-progress-blue {
  background-color: #9fdef3;
}

.vote-progress-desc {
  display: inline-block;
  margin: 0.3rem 0.8rem;
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
  display: inline-block;
  position: absolute;
  right: 0.8rem;
  top: 0.3rem;
}

.vote-count::after {
  content: "票";
}

.bilibili-player-video-popup {
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.bilibili-player-video-popup > * {
  pointer-events: all;
}

.link-button {
  animation: opacity-animation 0.2s;
  position: absolute;
  left: 40%;
  top: 20%;
  background-color: #f5f5f5;
  padding: 0.4rem 1rem;
  border-radius: 0.6rem;
  font-size: large;
  box-shadow: #888888c7 0px 0px 6px;
}

.link-button:hover {
  color: #00a1d6;
  cursor: pointer;
}

.link-button > * {
  vertical-align: middle;
}

.link-button > img {
  transform: scale(0.7) translateY(-1px);
}

.danmaku-up-icon::before {
  content: "UP主";
  background-color: #00a1d6;
  border-radius: 5px;
  font-size: 0.8em;
  padding: 0.1em;
  transform: translateY(-0.1em);
  display: inline-block;
  box-shadow: #888888c7 0px 0px 6px;
}

.grade-score-area > div {
  display: inline-block;
  position: relative;
  width: 41px;
  transition: width 0.3s;
}

.grade-score-area.pointer {
  cursor: pointer;
}

.grade-score-area > div:last-child {
  width: 20px;
}

.grade-score-area .score-button {
  filter: grayscale(1);
}

.grade-score-area .highlight .score-button {
  filter: none;
}

.grade-score-area .bg {
  position: absolute;
  left: 0;
  filter: blur(9px);
  visibility: hidden;
}

.grade-score-area .highlight .bg {
  visibility: visible;
}

.grade-score-info {
  position: absolute;
  right: 1rem;
  bottom: 0.6rem;
  opacity: 0;
}

@keyframes grade-score-showup {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  100% {
    opacity: 1;
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
}
`;
    modules["danmakuHashId.css"] = `/* 反查弹幕发送者相关样式 */
.bb-comment, .comment-bilibili-fold {
    font-family: Microsoft YaHei,Arial,Helvetica,sans-serif;
    font-size: 0;
    zoom: 1;
    min-height: 100px;
    background: #fff;
}.bb-comment .comment-list, .comment-bilibili-fold .comment-list {
    padding-top: 20px;
}.bb-comment *, .comment-bilibili-fold * {
    box-sizing: content-box;
}.bb-comment .comment-list .list-item .reply-box .reply-item .reply-face, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-face {
    display: inline-block;
    position: relative;
    margin-right: 10px;
    vertical-align: top;
}.bb-comment .comment-list .list-item .reply-box .reply-item .reply-face img, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-face img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con {
    display: inline-block;
    width: calc(100% - 34px);
}.bb-comment .comment-list .list-item .user, .comment-bilibili-fold .comment-list .list-item .user {
    font-size: 12px;
    font-weight: 700;
    line-height: 18px;
    padding-bottom: 4px;
    display: block;
    word-wrap: break-word;
    position: relative;
}.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con .user .name, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con .user .name {
    position: relative;
    top: -1px;
}.bb-comment .comment-list .list-item .reply-box .reply-item .level, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .level {
    margin: 0 15px 0 8px;
}.bb-comment .comment-list .list-item .user .level.l0,.comment-bilibili-fold .comment-list .list-item .user .level.l0 {
    background-position: -23px -28px
}.bb-comment .comment-list .list-item .user .level.l1,.comment-bilibili-fold .comment-list .list-item .user .level.l1 {
    background-position: -23px -92px
}.bb-comment .comment-list .list-item .user .level.l2,.comment-bilibili-fold .comment-list .list-item .user .level.l2 {
    background-position: -23px -156px
}.bb-comment .comment-list .list-item .user .level.l3,.comment-bilibili-fold .comment-list .list-item .user .level.l3 {
    background-position: -23px -220px
}.bb-comment .comment-list .list-item .user .level.l4,.comment-bilibili-fold .comment-list .list-item .user .level.l4 {
    background-position: -23px -284px
}.bb-comment .comment-list .list-item .user .level.l5,.comment-bilibili-fold .comment-list .list-item .user .level.l5 {
    background-position: -23px -348px
}.bb-comment .comment-list .list-item .user .level.l6,.comment-bilibili-fold .comment-list .list-item .user .level.l6 {
    background-position: -23px -412px
}.bb-comment .comment-list .list-item .user .level.l7,.comment-bilibili-fold .comment-list .list-item .user .level.l7 {
    background-position: -23px -476px
}.bb-comment .comment-list .list-item .user .level.l8,.comment-bilibili-fold .comment-list .list-item .user .level.l8 {
    background-position: -23px -540px
}.bb-comment .comment-list .list-item .user .level.l9,.comment-bilibili-fold .comment-list .list-item .user .level.l9 {
    background-position: -23px -604px
}.bb-comment .comment-list .list-item .user .level, .comment-bilibili-fold .comment-list .list-item .user .level {
    display: inline-block;
    width: 19px;
    height: 9px;
    vertical-align: middle;
    margin: 0 8px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAPoCAMAAAB6fSTWAAAA51BMVEUAAACYoKhwd3yboqni5emDjJL7+/yZoqoAodbnix8AodYAodaZoqoAodYAodaln5jnix8Aodbnix8AodaZoqoAodbnix8Aodbnix/yXY6ZoqoAodYAodYAodaZoqoAodaZoqryXY7yXY4AodbyXY6ZoqryXY6ZoqoAodaZoqoAodaZoqryXY7nix8AodYAodbnix+ZoqqZoqrnix8AodYAodbnix+Zoqr////19vfM0NcAoda/v7/l6e9MyP//u1PlL+z/s3yS0eWV3bL/bAAVFRX/AACEHPnnix+M2fn/1pbyXY4iIiIkv4BgAAAAOHRSTlMA9fUreZKu4eI+EfDtgtwP7AkexYcv2WfIsP3refnX0mcmGUPyxsScjXkXF++zoZpMMyn+Ppl8Q6/LsKoAAA3QSURBVHja7NvdbtowGIfxP7UsaEqbfkGj0bWVpqofiK0f2nZALyD3f0V7E4KsbULCjpRA9fykQDjw4SOb2BEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG2cF4X64vzAeJc+/sDYeGDH3Q0e1MrV1x9q4eW0LNUTP2j4xPEHDS9gp70O50O1MRk9j5Tu13tZhX4+LdS5ejJvpnUlqCfzZloXsMPym99qFfrZ7Telh54vyop1Xk7VNevbqeas+KT5fD2eOR3b+FhR1/L84dJaz42SZNnPR2UnWZadKV7+Mi1rss7P1THXdB7u47iq83DP/3RsijtQpevQ78bjL/fS29CMHxTvana0vDjT5MTMviuSVb6movvO5Qe+Wr2vLvsRP6H7avW+ujxTOjaErrrw+mq+1K1hrqHWxoo3yjTS2kyRTssQeh9sEg+hO/uIZJN4CN3xLx07G7pC6G/3KaErhD65UKQyUGEfhbplaYfQlRK6Quja29CPj4W/febQn55ahn59vY+hO9VcWuhh/P6GfrxcUvq/PnHo965l6BcTRZruwNLdexnv05buYfzeLt2tc0qPkBi6qb77D31+o3ahP58o1mERQl8U/TyMc3bZjUt9GOfsshvHwzhsDt00jdf3fYZ+d9ky9KtHxcsPe99ec746NJO+veZ8dWiG7TVs9PGfzkOfr0PPb16TQn9eh57dTtoemCm0NQ7MAHH76OOVJylxH/2oNrtufQR2oa1xBBbYN/ZSy7ui8VILsF94TRUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAH3buoMVNIAzA8BxESA5ldyHkUui1p/Y6YrJ71v//g/rFmFoKaaMBdZPngTWzh+/4MqKTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwIMqyirnqizungfWqihzryzum5c6rFVkWrUfoa0i1Unzx+Y9NMfTPKzZvv6ZnlJ02n702ih1wnzz3muUzrrt6rpOS3kbFrMrzp0PpRdj57vOh9LdvbNer/WCob+9bFJn8zJ/6eWl87Y9l16OnW/6xpvuakvnvw5naW7bbX2y3W5f0xI2UXr/MbciV33nffBVLsbNH/vO++CPtnSuxT3o/k/z2td/+JGWEIkv0vmwobf596KcsqE3ORa2dK46nNLuLsNiXpF3/F2kRUTkC3QeqnzpPBadXI2bv3Qei07Mg9CvlR6dLyDnc+ehqqou9Dxu/tJ5zB+70HOCtYf+Nd3sgUKvcqedGno/3widTxL6Lt3skW7do+/ofPKtezh17tadf4YeTp8rCP1Lup2HcR7GMSL00BfeNb5o6N/TzR7r9Vobnd/zeq2Jzr1e47rD35YM/dsujfMwB2bauE4/MNMdl7Ghs2r7+o5HcY7AOgILn4AvtcAz8DVVeAZ+eAKegp+SAgAAAAAAAAAAAAAAAAAAAH6xczctbQRxAIf/RmHDGgyiQWisCkV8gxaF0nZDTjkF+v0/T4dNrIFe6g5JnOR5srksDHP6wTCzDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlKhZdXRY3HjgPzS/Vkybd5fW/FyRxmfOr3RorS/0ZHqUEXqSxufODyRrDD1pckJPmuz5gQihQxc3g8GnwcJDdHAxPp4ct8aXUR6hsx+qp6iiNbx6jvfrP0Y/WvX1KIojdDZtthCbVbVP6+a8S+jt07q4j+IsQjvIDH2eGfpU6Dtutioi2WLoT1d5oT+eRHEWof0+yAt9Ms8LvZkKfbfNoi28/be2GXrcHmaFHmflrd2XoafSs0KfzPNCb6ZC32kfK/SHh7zQL8vbjluGnkrPC30yzwu9mQp9l62Evv2le7zc5oU+OovS/A29J3Q66BT6Vjbjhm+hx6BD6PVb6DGO0ryG3rN0Z41e406/jNBzz9FvI16qZHDX7Rz97DRGJ8n4a5RmGXrPZhzr1Gb92vjyzaYNh3fnMbwaJtFFXX+/j/qkruvTKM4itJ7jNdZq9q/YuFT5j6iiu9PrL9GPIvlghj3yXD1VkWHUfxS60Pnwbg7uIsfF529RJKHDHhA67AEXT8AecJUU7IHG5ZAAAAAAAAAAAAAAAMAfdu6etUEgDuDwNcnkUMgQshS6dmrXeOKSLdDv/3kqlxeELCVXk9T/84Aogtz0w+OUAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAmVqu8ti/ex74RWe5b8dueH43Vj0+8PdWfVsV2mrofOyG8YUOU8ttXWh5Vxd6boUOV4QOt9h2F28pHqETwxD4cBTvmxSO0Lm3/VGqUBd695HCuYT2Uhn6oTL0Xuhzth8rdx4Z+msKJ587/64L/dDVhd5noc/ZPpXCy1E8LPQi3tw9nzuvC/3Q1YXeZ6HP2pOFHm85Lp86rwv90NWF3mehz9so9CeYug+X0Rz7WgidKzN+o0cN3dSdaZ36LufHhL7tRj5TNLk9WliMY0Il69J3xap7paYpkTdNs07h5PZk4fMa09lfS/e3Djlr98MM0WyELnQC2HZfKSShQwBChwBsPAEB2EoKIljaHBIAAAAAAAAAAPhhzw5WGwSiMIzekCGbkF1Wgb5HhzIL3/+lClaCEixCCMl4zwER3H/8OgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADtX2gYlgJ617w1aAD0TOiQgdEhA6JCA0CEBoUMCQocEhA4JCB0SEDokIHRIQOiQgNBJ6nq4xlMu50t0Q+gkdbsd4ilfP+fohtB5o+FPbGTRhU4vhrkYr+CB0OnbEPfChb5O6PTtU0L36i505l4Z+vRkI4dxQqcXi9AHi75C6PRt6nu6+0ZfIXT6NmY99i30/widrg0z/qOvEjo4jBM6WHShQ0ZChwSEDgkIHRIQOiQgdEhA6JDAQ+i1tSp02Je2rLy2cjyWVqvQYUfaYsxPJUbl1KrQYTfaYszjbpx1of+yZ8c4DINAFAW3QJwpFO64/5kiMAUU6eP1jGS5oH76loEcajvGfDlnvdUAnqxc7dOuY8yPWZ/HJYBHK3WN+e9jnQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPyNfgsgmb6LQeiQTo9Z+P2ERYeUhA4vsIXu0x2y2kOfhA75rL7HW+iQ1cx69O2vO+TVN+7RAQAAAAAAAAAAvuzZwQnAIBBE0a1u+i8pqBch15wm74FawWdFAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvpFjgDK5zSJ0qJPZhZ81JjpUEjr8wBW6qzu0ek10oUOfTJZ1Ch1aZW/JeHWHXrn4RwcAAAAAAHjYs2MbgIEQCIKURv9VWY8dfAGOjhkJUcFGBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8I9+FRCmb3UIHeJ0TeFzQ+iQR+iwgNBhAaHDAl/f5wsdUk3W07fQIVZf7OgAAAAPe3ZQA0AIQ1Gw7r5/Rxu6lwrgVGYSqIIXCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANyRXwHLZKpD6LBOqgvv1UPosI/Q4QEjdFd32MqJDg9I5ThT6LBVekvKqzvslcE/+sduHZ0AAIIAFHQ5918pMggH6MvuQJzgoQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/kEcAw2cUmdBgnowqvqSV0mEfo8IEWutcdprqh17joiz07tgEQhgEgmBoEUuQaZZDU3n8lCBUbIFl3hT3BNzaUlC2XtYUOVeU7MpurO9SVH/7oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL+L+YgGVBZzaUBp2xA6FNaP8zqPmEPoUFaPueyxCf1mz45NIIaBIAAqdCKBcOTAgZBDh86uhO+/n9fzTZhjJtgOloNbSKtGm322qGX3jIOsWjwrn2gFSOuMvrLHWYC0WkwXHbKrsc0+t6gFSKvv8bP3AuT139H1HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4OXGcV3HKEBi4/4st6Z/2bODG4BhEAaArJFnoyjLeP99WnUMuHuwgQXC0NnK2vsbBfR1sqt2TgF9CToM4HSHATzjYIJnJeo16O3mdwvoS9BhhqSA7q51DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAve3AgAAAAAADk/9oIqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrCHhwIAAAAAAD5vzaCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqwBwcCAAAAAED+r42gqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqirtwQEJAAAAgKD/r9sRqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8BfEgGFMI1IvvAAAAABJRU5ErkJggg==) no-repeat;
}`;
    modules["download.css"] = `.table {
    position: fixed;
    z-index: 11113;
    bottom: 0;
    width: 100%;
    min-height: 50px;
    display: flex;
    box-sizing: border-box;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 22%);
    transition: transform 0.3s ease-in;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
}
.cell {
    background-color: #fff;
    color: #000 !important;
    border: #ccc 1px solid;
    border-radius: 3px;
    display: flex;
    margin: 3px;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    flex-direction: row;
}
.type {
    color: #000 !important;
    display: table-cell;
    min-width: 1.5em;
    text-align: center;
    vertical-align: middle;
    padding: 10px 3px;
}
.item {
    display: table-cell;
    text-decoration: none;
    padding: 3px;
    cursor: pointer;
    color: #1184B4;
}
.item:hover {
    color:#FE3676;
}
.up {
    color: #fff !important;
    text-align: center;
    padding: 1px 3px;
    background-color: #777;
}
.down {
    font-size: 90%;
    margin-top: 2px;
    text-align: center;
    padding: 1px 3px;
}`;
    modules["hr.css"] = `.hr {
    display: flex;
    align-items: center;
    grid-gap: 0;
    gap: 0;
    justify-content: space-between;
    flex-shrink: 0;
    height: 1px;
    background-color: rgba(136,136,136,0.1);
    width: 100%;
    margin-bottom: 12px;
}`;
    modules["icon.css"] = `.icon {
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 20px;
  justify-content: center;
  position: relative;
  width: 20px;
  box-sizing: content-box;
  background: none;
  cursor: pointer;
}
`;
    modules["imroot.css"] = `/* 修复顶栏样式 */
.im-root,.im-root .im-list-box * {
    font-size:12px;
    line-height:42px;
}
.im-root .im-list-box {
    width:100%;
    overflow:visible;
}
.im-root .im-list-box .im-list {
    line-height:42px;
    height:42px;
}
.im-root .im-list-box .im-notify.im-number {
    height: 14px;
    line-height: 13px;
    border-radius: 10px;
    padding: 1px 3px;
    font-size: 12px;
    min-width: 20px;
    text-align: center;
    color: #fff;
}
.im-root .im-list-box .im-notify.im-number.im-center {
    top: 14px;
    left: 80px;
}
.im-root .im-list-box .im-notify.im-dot {
    top: 11px;
    right: -10px;
    width: 8px;
    height: 8px;
    border-radius: 100%;
}
.im-root .im-list-box .im-notify.im-dot.im-center {
    top: 16px;
    right: 20px;
}`;
    modules["input.css"] = `/* 输入框 */
.input {
  align-items: center;
  display: flex;
  justify-content: space-between;
  position: relative;
  background-color: transparent;
  box-sizing: border-box;
  padding: 0;
  flex: 1;
  flex-basis: 0.000000001px;
  padding-block-end: 12px;
  padding-block-start: 12px;
}
.input input {
  background-color: transparent;
  box-sizing: border-box;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  min-height: auto;
  outline: none;
  padding-bottom: 6px;
  padding-inline-end: 8px;
  padding-inline-start: 8px;
  padding-top: 6px;
  text-align: inherit;
  text-overflow: ellipsis;
  width: 100%;
  border-radius: 4px;
  border: 1px solid rgba(136, 136, 136, 0.13333);
  box-shadow: 0 4px 12px 0 rgb(0, 0, 0, 5%);
  transition: box-shadow 120ms ease 180ms;
}
.input input:focus {
  box-shadow: inset 0 0 1px 1px rgba(26, 115, 232, 80%);
}
.input .icon {
  cursor: pointer;
  outline: none;
  padding: 0;
  pointer-events: auto;
  position: absolute;
  right: 12px;
  background-color: white;
}
.input .icon:hover {
  background-color: rgba(0, 0, 0, 10%);
  box-shadow: 0 1 12px 12px rgb(0, 0, 0, 10%);
}`;
    modules["message.css"] = `/* 修复消息页样式 */
.container[data-v-6969394c] { 
    height: calc(100vh - 42px) !important;
} 
.container[data-v-1c9150a9] { 
    height: calc(100vh - 42px) !important;
}`;
    modules["mini-bofqi.css"] = `/* 修正稍后再看迷你播放器样式 */
.bilibili-player .bilibili-player-area .bilibili-player-video-wrap.mini-player .bilibili-player-video-danmaku {
    top: 30px;
    height: 240px;
}`;
    modules["progress.css"] = `.progress{
    --paper-progress-active-color: rgb(26,115,232);
    --paper-progress-container-color: rgb(223, 222, 223);
    width: auto;
}
.progressContainer{
    background: rgb(223, 222, 223);
    height: 4px;
    position: relative;
}
.secondaryProgress,.primaryProgress{
    
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform-origin: left center;
    transform: scaleX(0);
    will-change: transform;
}
.secondaryProgress{
    background: rgb(183, 225, 205);
}
.primaryProgress{
    background: rgb(26,115,232);
}
.progressTag{
    width: 100%;
    padding-top: 6px;
    display: inline-flex;
    justify-content: space-between;
}`;
    modules["select.css"] = `/* 下拉列表 */
.select {
  align-items: center;
  display: inline-flex;
}
select {
  background-color: rgb(241, 243, 244);
  background-size: 10px;
  border: none;
  border-radius: 4px;
  color: rgb(32, 33, 36);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  max-width: 100%;
  outline: none;
  padding-bottom: 6px;
  padding-inline-end: 21px;
  padding-inline-start: 8px;
  padding-top: 6px;
  width: 200px;
}
option {
  background-color: #fff;
}`;
    modules["switch.css"] = `/* 滑块开关 */
.switch {
  cursor: pointer;
  display: block;
  min-width: 34px;
  outline: none;
  position: relative;
  width: 34px;
}
.bar {
  background-color: rgb(189, 193, 198);
  border-radius: 8px;
  height: 12px;
  left: 3px;
  position: absolute;
  top: 2px;
  transition: background-color linear 80ms;
  width: 28px;
  z-index: 0;
}
.bar[checked] {
  background-color: rgb(26, 115, 232);
  opacity: 0.5;
}
.bar:active {
  box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);
}
.knob {
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 40%);
  display: block;
  height: 16px;
  position: relative;
  transition: transform linear 80ms, background-color linear 80ms;
  width: 16px;
  z-index: 1;
}
.knob[checked] {
  background-color: rgb(26, 115, 232);
  transform: translate3d(18px, 0, 0);
}
.knob:active {
  box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);
}
.knob i {
  color: rgba(128, 134, 139, 15%);
  height: 40px;
  left: -12px;
  pointer-events: none;
  top: -12px;
  transition: color linear 80ms;
  width: 40px;
  border-radius: 50%;
  bottom: 0;
  display: block;
  overflow: hidden;
  position: absolute;
  right: 0;
  transform: translate3d(0, 0, 0);
}
.knob i[checked] {
  color: rgb(26, 115, 232);
}
.knob i:active {
  box-shadow: 0 0 1px 1px rgba(26, 115, 232, 80%);
}`;
    modules["ui-action.css"] = `.contain {
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 6%);
  display: flex;
  min-height: 24px;
  padding: 0 20px;
  flex-wrap: wrap;
  justify-content: flex-end;
  background-color: transparent !important;
}
.label {
  flex: 1;
  flex-basis: 0.000000001px;
  padding-block-end: 12px;
  padding-block-start: 12px;
  padding-inline-start: 12px;
}
.sub {
  color: rgb(95, 99, 104);
  font-weight: 400;
}
.button,
.action {
  line-height: 154%;
  align-items: center;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-weight: 500;
  height: 32px;
  justify-content: center;
  min-width: 5.14em;
  outline-width: 0;
  overflow: hidden;
  padding: 8px 16px;
  position: relative;
  user-select: none;
}
.action {
  border: none;
  background-color: rgb(26, 115, 232);
  color: #fff;
}
.button {
  background-color: #fff;
  color: rgb(26, 115, 232);
  border: 1px solid rgba(0, 0, 0, 6%);
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
  pointer-events: none;
  background-color: rgba(19, 1, 1, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: white;
}
`;
    modules["ui-contain.css"] = `.contain {
  margin-bottom: 3px;
  padding-inline-start: 20px;
  padding-inline-end: 20px;
  display: flex;
  flex-direction: column;
  outline: none;
  position: relative;
}
.header .title {
  color: #000;
  font-size: 108%;
  font-weight: 400;
  letter-spacing: 0.25px;
  margin-bottom: 12px;
  margin-top: 21px;
  outline: none;
  padding-bottom: 4px;
  padding-top: 8px;
}
.card {
  border-radius: 4px;
  box-shadow: 0px 0px 1px 1px rgba(60, 64, 67, 30%);
  flex: 1;
  color: #000;
  line-height: 154%;
  user-select: text;
}
`;
    modules["ui-file.css"] = `.contain {
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 6%);
  display: flex;
  min-height: 24px;
  padding: 0 20px;
  flex-wrap: wrap;
  justify-content: flex-end;
  background-color: transparent !important;
}
.label {
  flex: 1;
  flex-basis: 0.000000001px;
  padding-block-end: 12px;
  padding-block-start: 12px;
  padding-inline-start: 12px;
}
.sub {
  color: rgb(95, 99, 104);
  font-weight: 400;
}
.button,
.action {
  line-height: 154%;
  align-items: center;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-weight: 500;
  height: 32px;
  justify-content: center;
  min-width: 5.14em;
  outline-width: 0;
  overflow: hidden;
  padding: 8px 16px;
  position: relative;
  user-select: none;
}
.action {
  border: none;
  background-color: rgb(26, 115, 232);
  color: #fff;
}
.button {
  background-color: #fff;
  color: rgb(26, 115, 232);
  border: 1px solid rgba(0, 0, 0, 6%);
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
  pointer-events: none;
  background-color: rgba(19, 1, 1, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: white;
}
`;
    modules["ui-float.css"] = `.float {
  top: 0;
  right: 0;
  position: fixed;
  z-index: 11111;
  min-width: 40px;
  min-height: 30px;
  display: block;
  padding: 8px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #e9eaec;
  border-radius: 8px;
  box-shadow: 0 6px 12px 0 rgb(106, 115, 133, 22%);
  user-select: text;
  pointer-events: none;
}
.arrow {
  left: 16%;
  top: 100%;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 8px solid #fff;
  position: absolute;
  user-select: text;
}
.message {
  margin-top: -4px;
  box-sizing: border-box;
  height: 100%;
  position: relative;
  user-select: text;
  word-wrap: break-word;
  word-break: break-all;
  font-size: 12px;
  line-height: 1.15;
}
`;
    modules["ui-input.css"] = `.contain {
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 6%);
  display: flex;
  min-height: 24px;
  padding: 0 20px;
  flex-wrap: wrap;
  justify-content: flex-end;
  background-color: transparent !important;
}
.label {
  flex: 1;
  flex-basis: 0.000000001px;
  padding-block-end: 12px;
  padding-block-start: 12px;
  padding-inline-start: 12px;
}
.sub {
  color: rgb(95, 99, 104);
  font-weight: 400;
}
.textbox {
  align-items: center;
  display: flex;
  justify-content: space-between;
  position: relative;
  background-color: transparent;
  box-sizing: border-box;
  padding: 0;
  flex: 1;
  flex-basis: 0.000000001px;
  padding-block-end: 12px;
  padding-block-start: 12px;
}
.textbox input {
  background-color: transparent;
  box-sizing: border-box;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  min-height: auto;
  outline: none;
  padding-bottom: 6px;
  padding-inline-end: 8px;
  padding-inline-start: 8px;
  padding-top: 6px;
  text-align: inherit;
  text-overflow: ellipsis;
  width: 100%;
  border-radius: 4px;
  border: 1px solid rgba(136, 136, 136, 0.13333);
  box-shadow: 0 4px 12px 0 rgb(0, 0, 0, 5%);
  transition: box-shadow 120ms ease 180ms;
}
.textbox input:focus {
  box-shadow: inset 0 0 1px 1px rgba(26, 115, 232, 80%);
}
.textbox .icon {
  cursor: pointer;
  outline: none;
  padding: 0;
  pointer-events: auto;
  position: absolute;
  right: 12px;
  background-color: white;
}
.textbox .icon:hover {
  background-color: rgba(0, 0, 0, 10%);
  box-shadow: 0 1 12px 12px rgb(0, 0, 0, 10%);
}
.button,
.action {
  line-height: 154%;
  align-items: center;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  font-weight: 500;
  height: 32px;
  justify-content: center;
  min-width: 5.14em;
  outline-width: 0;
  overflow: hidden;
  padding: 8px 16px;
  position: relative;
  user-select: none;
}
.action {
  border: none;
  background-color: rgb(26, 115, 232);
  color: #fff;
}
.button {
  background-color: #fff;
  color: rgb(26, 115, 232);
  border: 1px solid rgba(0, 0, 0, 6%);
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
  pointer-events: none;
  background-color: rgba(19, 1, 1, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: white;
}
`;
    modules["ui-item.css"] = `/* 菜单项容器 */
.contain {
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 6%);
  display: flex;
  min-height: 24px;
  padding: 0 20px;
  flex-wrap: wrap;
  justify-content: flex-end;
  background-color: transparent !important;
}
.label {
  flex: 1;
  flex-basis: 0.000000001px;
  padding-block-end: 12px;
  padding-block-start: 12px;
  padding-inline-start: 12px;
}
.sub {
  color: rgb(95, 99, 104);
  font-weight: 400;
}
`;
    modules["ui-menu.css"] = `.menuitem {
  align-items: center;
  display: flex;
  font-weight: 500;
  margin-inline-end: 2px;
  margin-inline-start: 1px;
  min-height: 20px;
  padding-bottom: 10px;
  padding-inline-start: 23px;
  padding-top: 10px;
  cursor: pointer;
}
.menuitem:hover {
  background-color: rgb(0, 0, 0, 6%);
}
.menuitem > div {
  padding-inline-end: 12px;
}
`;
    modules["ui-picture.css"] = `.contain {
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 6%);
  display: flex;
  min-height: 24px;
  padding: 0 20px;
  flex-wrap: wrap;
  justify-content: center;
  background-color: transparent !important;
  line-height: 0;
  max-height: 62px;
}
.contain img {
  border-radius: 4px;
  width: 100%;
  max-height: 62px;
}
`;
    modules["ui-popup-box.css"] = `.box{
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    transition: 0.3s cubic-bezier(0.22, 0.61, 0.36, 1);
    padding: 12px;
    background-color: #fff;
    color: black;
    border-radius: 8px;
    box-shadow: 0 4px 12px 0 rgb(0 0 0 / 5%);
    border: 1px solid rgba(136,136,136,0.13333);
    box-sizing: border-box;
    position: fixed;
    font-size: 13px;
    z-index: 11115;
    line-height: 14px;
}
.contain{
    display: flex;
    flex-direction: column;
    height: 100%;
}
*::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}`;
    modules["ui-sort-body.css"] = `contain {
  display: block;
  padding-block-end: 0;
  padding-block-start: 0;
  padding-inline-end: 20px;
  padding-inline-start: 20px;
  border-top: 1px solid rgba(0, 0, 0, 6%);
}
`;
    modules["ui-sort-head.css"] = `.contain {
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 6%);
  display: flex;
  min-height: 24px;
  padding: 0 20px;
  flex-wrap: wrap;
  justify-content: flex-end;
  background-color: transparent !important;
}
.label {
  flex: 1;
  flex-basis: 0.000000001px;
  padding-block-end: 12px;
  padding-block-start: 12px;
  padding-inline-start: 12px;
}
.sub {
  color: rgb(95, 99, 104);
  font-weight: 400;
}
.anchor {
  cursor: pointer;
  transition: transform 120ms ease 180ms, box-shadow 120ms ease 180ms;
}
.anchor[checked] {
  transform: rotateX(180deg);
}
.anchor:hover {
  box-shadow: 0 0 4px 4px rgba(241, 243, 244, 80%);
}
`;
    modules["ui-stage.css"] = `.stage {
  position: fixed;
  right: 40px;
  bottom: 60px;
  height: 20px;
  width: 20px;
  border: 1px solid #e9eaec;
  border-radius: 50%;
  box-shadow: 0 0 12px 4px rgb(106, 115, 133, 22%);
  padding: 10px;
  cursor: pointer;
  animation: roll 1s ease-out;
  transition: opacity 0.3s ease-out;
  background: none;
  z-index: 11110;
}
.classical{
  box-sizing: content-box;
  color: #fff;
  background-color: #fff;
  border-radius: 5px;
  position: fixed;
  bottom: 65px;
  width: 56px;
  height: 40px;
  transition: right 0.7s;
  -moz-transition: right 0.7s;
  -webkit-transition: right 0.7s;
  -o-transition: right 0.7s;
  z-index: 11110;
  padding: 4px;
  right : -54px;
}
.classical:hover{
  right : 0px;
  box-shadow : rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;
  border : 1px solid rgb(233, 234, 236);
}
.classical i{
  background-position: -471px -982px;
  display: block;
  width: 20px;
  height: 20px;
  transition: 0.2s;
  background-image: url(//static.hdslb.com/images/base/icons.png);
  margin: auto;
}
.classical span{
  font-size: 14px;
  display: block;
  width: 50%;
  transition: 0.2s;
  color: #000;
  margin: auto;
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
}
`;
    modules["ui.css"] = `.box {
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  min-width: 600px;
  min-height: 400px;
  padding: 0;
  border: 0;
  position: fixed;
  z-index: 11110;
  display: block;
  box-sizing: border-box;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 12px 0 rgba(106, 115, 133, 22%);
  transition: transform 0.3s ease-in;
  line-height: 14px;
  font: 12px Helvetica Neue, Helvetica, Arial, Microsoft Yahei, Hiragino Sans GB,
    Heiti SC, WenQuanYi Micro Hei, sans-serif;
}
.tool {
  position: absolute;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
  width: 100%;
  display: inline-flex;
  z-index: 1;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
}
.tool div {
  border-radius: 50%;
  padding: 10px;
  transform: scale(0.8);
  pointer-events: visible;
}
.tool div:hover {
  background-color: rgba(0, 0, 0, 10%);
}
.content {
  position: relative;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
  background-color: #fff;
}
.contain {
  padding-bottom: 15px;
  background-position: top center;
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  align-items: flex-start;
  flex: 1;
  height: 385px;
}
.menu::-webkit-scrollbar,
.item::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}
.menu {
  flex: 1 1 0;
  flex-basis: calc(480px * 0.2);
  height: 100%;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  min-width: fit-content;
  overflow: auto;
}
.item {
  flex: 4 4 0;
  flex-basis: calc(480px * 0.8);
  height: 100%;
  box-sizing: border-box;
  display: block;
  margin: 0 auto;
  position: relative;
  overflow: auto;
}
.selected {
  color: rgb(51, 103, 214) !important;
}
.selected > .icon {
  fill: rgb(51, 103, 214) !important;
}
`;
    modules["upList.css"] = `.up-info-m .up-card-box {
  white-space: nowrap;
  overflow: auto;
}

.up-info-m .up-card {
  display: inline-block;
  margin-top: 10px;
}

.up-info-m .avatar img {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.up-info-m .avatar {
  position: relative;
}

.up-info-m .avatar .info-tag {
  position: absolute;
  background: #fff;
  border: 1px solid #fb7299;
  border-radius: 2px;
  display: inline-block;
  font-size: 12px;
  color: #fb7299;
  padding: 0 3px;
  top: -10px;
  right: -10px;
  white-space: nowrap;
}

.up-info-m .avatar {
  width: 60px;
  height: 30px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: start;
  align-items: flex-start;
}

.up-info-m .avatar .name-text {
  font-family: PingFangSC-Regular, sans-serif;
  line-height: 30px;
  color: #222;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: nowrap;
}

.up-info-m .avatar .name-text.is-vip, .up-info-m .avatar .name-text:hover {
  color: #fb7299;
}

.up-info-m .title {
  display: block;
  font-size: 14px;
  margin-right: 80px;
  color: #525659;
  overflow: hidden;
  height: 24px;
  font-weight: 400;
  padding: 8px 0;
}`;
    modules["av.html"] = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta charset="utf-8" />
  <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
  <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
  <meta name="keywords"
    content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />
  <meta name="renderer" content="webkit" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
    title="哔哩哔哩" />
  <link rel="stylesheet"
    href="//s1.hdslb.com/bfs/static/jinkela/videoplay/css/video.0.406cee7878545872b8dfbe73071d665dfb287c67.css" />
  <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
</head>

<body>
  <div class="z-top-container has-menu"></div>
  <div id="video-page-app"></div>
  <div id="app" data-server-rendered="true"></div>
  <div class="bili-wrapper" id="bofqi"></div>
  <div class="footer bili-footer report-wrap-module"></div>
  <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script>
  <script type="text/javascript">
    function getQueryString(e) { var r = new RegExp("(^|&)" + e + "=([^&]*)(&|\$)"), i = window.location.search.substr(1).match(r); return null != i ? unescape(i[2]) : null } window.getInternetExplorerVersion = function () { var e = -1; if ("Microsoft Internet Explorer" == navigator.appName) { var r = navigator.userAgent; null != new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(r) && (e = parseFloat(RegExp.\$1)) } return e }; var vd = window.__INITIAL_STATE__ && window.__INITIAL_STATE__.videoData; if (vd && vd.aid && 9 !== getInternetExplorerVersion()) { if (\$("#__bofqi").innerHTML = '<div class="bili-wrapper" id="bofqi"><div id="player_placeholder"></div></div>', vd.embedPlayer) { var p = getQueryString("p") ? getQueryString("p") - 1 : 0, player = { aid: vd.aid, cid: vd.pages[p] && vd.pages[p].cid || vd.pages[0].cid }; EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=" + player.cid + "&aid=" + player.aid + "&pre_ad=") } vd.embed && \$("#bofqi").html(vd.embed) } else \$("#bofqi").remove()
  </script>
  <script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/manifest.b1b7706abd590dd295794f540f7669a5d8d978b3.js"
    crossorigin="" defer="defer"></script>
  <script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/vendor.b1b7706abd590dd295794f540f7669a5d8d978b3.js"
    crossorigin="" defer="defer"></script>
  <script src="//s1.hdslb.com/bfs/static/jinkela/videoplay/video.b1b7706abd590dd295794f540f7669a5d8d978b3.js"
    crossorigin="" defer="defer"></script>
  <script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
  <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" />
  <script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script>
  <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script>
</body>

</html>`;
    modules["bangumi-special.html"] = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="utf-8" />
    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <meta name="keywords"
        content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />
    <meta name="renderer" content="webkit" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
        title="哔哩哔哩" />
    <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" />
    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
    <script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script>
    <script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script>
    <script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script>
    <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
    <link rel="stylesheet"
        href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.css" />
</head>

<body>
    <div class="z-top-container" style="height:42px"></div>
    <div id="app" data-server-rendered="true" class="main-container special"></div>
    <script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"
        crossorigin="" defer="defer"></script>
    <script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"
        crossorigin="" defer="defer"></script>
    <script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
    <div class="footer bili-footer report-wrap-module" id="home_footer"></div>
    <script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script>
    <script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script>
</body>

</html>`;
    modules["bangumi.html"] = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta charset="utf-8" />
  <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
  <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
  <meta name="keywords"
    content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />
  <meta name="renderer" content="webkit" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
    title="哔哩哔哩" />
  <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" />
  <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/vip/dist/js/vipPlugin.v2.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/js/promise.auto.min.js"></script>
  <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
  <link rel="stylesheet"
    href="//s1.hdslb.com/bfs/static/bangumi/play/css/bangumi-play.0.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.css" />
</head>

<body>
  <div class="z-top-container has-menu"></div>
  <div id="app" data-server-rendered="true" class="main-container"></div>
  <script src="//s1.hdslb.com/bfs/static/bangumi/play/1.bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"
    crossorigin="" defer="defer"></script>
  <script src="//s1.hdslb.com/bfs/static/bangumi/play/bangumi-play.809bd6f6d1fba866255d2e6c5dc06dabba9ce8b4.js"
    crossorigin="" defer="defer"></script>
  <script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
  <div class="footer bili-footer report-wrap-module" id="home_footer"></div>
  <script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script>
  <script src="//s1.hdslb.com/bfs/static/plugin/vip/BilAccountThaw.js"></script>
</body>

</html>`;
    modules["index.html"] = `<!DOCTYPE html>
<html lang="zh-Hans" xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-Hans">

<head>
  <meta charset="utf-8" />
  <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
  <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
  <meta name="keywords"
    content="Bilibili,哔哩哔哩,哔哩哔哩动画,哔哩哔哩弹幕网,弹幕视频,B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,二次元,游戏视频,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid,日本动漫,国产动漫,手机游戏,网络游戏,电子竞技,ACG燃曲,ACG神曲,追新番,新番动漫,新番吐槽,巡音,镜音双子,千本樱,初音MIKU,舞蹈MMD,MIKUMIKUDANCE,洛天依原创曲,洛天依翻唱曲,洛天依投食歌,洛天依MMD,vocaloid家族,OST,BGM,动漫歌曲,日本动漫音乐,宫崎骏动漫音乐,动漫音乐推荐,燃系mad,治愈系mad,MAD MOVIE,MAD高燃" />
  <meta name="renderer" content="webkit" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link rel="search" type="application/opensearchdescription+xml" href="//static.hdslb.com/opensearch.xml"
    title="哔哩哔哩" />
  <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
  <link rel="stylesheet"
    href="//s1.hdslb.com/bfs/static/jinkela/home/css/home.0.4eadf4209b1762230047120e0a9945a9f3b56fd1.css" />
</head>

<body>
  <div id="home-app"></div>
  <div id="app" data-server-rendered="true"></div>
  <script src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
  <script src="//s1.hdslb.com/bfs/static/jinkela/home/1.home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"
    defer="defer"></script>
  <script src="//s1.hdslb.com/bfs/static/jinkela/home/home.4eadf4209b1762230047120e0a9945a9f3b56fd1.js"
    defer="defer"></script>
  <div class="footer bili-footer report-wrap-module"></div>
  <script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin=""></script>
  <script type="text/javascript" defer="defer" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script>
  <link rel="prefetch" as="script" href="//static.hdslb.com/js/video.min.js" />
</body>

</html>`;
    modules["player.html"] = `<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport"
        content="target-densitydpi=device-dpi,width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,minimal-ui">
    <title>player - bilibili.com</title>
    <script type="text/javascript">
        if (!!navigator.userAgent.match(/AppleWebKit.*Mobile.*/)) {
            window.location.href = '//www.bilibili.com/blackboard/html5mobileplayer.html' + window.location.search;
        }
    </script>
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
    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
    <script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script>
    <script type="text/javascript" src="//static.hdslb.com/player/js/whitelist.js"></script>
    <script type="text/javascript">
        /* == jquery mousewheel plugin == Version: 3.1.13, License: MIT License (MIT) */
        !function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery) }(function (a) { function b(b) { var g = b || window.event, h = i.call(arguments, 1), j = 0, l = 0, m = 0, n = 0, o = 0, p = 0; if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) { if (1 === g.deltaMode) { var q = a.data(this, "mousewheel-line-height"); j *= q, m *= q, l *= q } else if (2 === g.deltaMode) { var r = a.data(this, "mousewheel-page-height"); j *= r, m *= r, l *= r } if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) { var s = this.getBoundingClientRect(); o = b.clientX - s.left, p = b.clientY - s.top } return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h) } } function c() { f = null } function d(a, b) { return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0 } var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], i = Array.prototype.slice; if (a.event.fixHooks) for (var j = g.length; j;)a.event.fixHooks[g[--j]] = a.event.mouseHooks; var k = a.event.special.mousewheel = { version: "3.1.12", setup: function () { if (this.addEventListener) for (var c = h.length; c;)this.addEventListener(h[--c], b, !1); else this.onmousewheel = b; a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this)) }, teardown: function () { if (this.removeEventListener) for (var c = h.length; c;)this.removeEventListener(h[--c], b, !1); else this.onmousewheel = null; a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height") }, getLineHeight: function (b) { var c = a(b), d = c["offsetParent" in a.fn ? "offsetParent" : "parent"](); return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16 }, getPageHeight: function (b) { return a(b).height() }, settings: { adjustOldDeltas: !0, normalizeOffset: !0 } }; a.fn.extend({ mousewheel: function (a) { return a ? this.bind("mousewheel", a) : this.trigger("mousewheel") }, unmousewheel: function (a) { return this.unbind("mousewheel", a) } }) }); !function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery) }(function (a) { function b(b) { var g = b || window.event, h = i.call(arguments, 1), j = 0, l = 0, m = 0, n = 0, o = 0, p = 0; if (b = a.event.fix(g), b.type = "mousewheel", "detail" in g && (m = -1 * g.detail), "wheelDelta" in g && (m = g.wheelDelta), "wheelDeltaY" in g && (m = g.wheelDeltaY), "wheelDeltaX" in g && (l = -1 * g.wheelDeltaX), "axis" in g && g.axis === g.HORIZONTAL_AXIS && (l = -1 * m, m = 0), j = 0 === m ? l : m, "deltaY" in g && (m = -1 * g.deltaY, j = m), "deltaX" in g && (l = g.deltaX, 0 === m && (j = -1 * l)), 0 !== m || 0 !== l) { if (1 === g.deltaMode) { var q = a.data(this, "mousewheel-line-height"); j *= q, m *= q, l *= q } else if (2 === g.deltaMode) { var r = a.data(this, "mousewheel-page-height"); j *= r, m *= r, l *= r } if (n = Math.max(Math.abs(m), Math.abs(l)), (!f || f > n) && (f = n, d(g, n) && (f /= 40)), d(g, n) && (j /= 40, l /= 40, m /= 40), j = Math[j >= 1 ? "floor" : "ceil"](j / f), l = Math[l >= 1 ? "floor" : "ceil"](l / f), m = Math[m >= 1 ? "floor" : "ceil"](m / f), k.settings.normalizeOffset && this.getBoundingClientRect) { var s = this.getBoundingClientRect(); o = b.clientX - s.left, p = b.clientY - s.top } return b.deltaX = l, b.deltaY = m, b.deltaFactor = f, b.offsetX = o, b.offsetY = p, b.deltaMode = 0, h.unshift(b, j, l, m), e && clearTimeout(e), e = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, h) } } function c() { f = null } function d(a, b) { return k.settings.adjustOldDeltas && "mousewheel" === a.type && b % 120 === 0 } var e, f, g = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], h = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"], i = Array.prototype.slice; if (a.event.fixHooks) for (var j = g.length; j;)a.event.fixHooks[g[--j]] = a.event.mouseHooks; var k = a.event.special.mousewheel = { version: "3.1.12", setup: function () { if (this.addEventListener) for (var c = h.length; c;)this.addEventListener(h[--c], b, !1); else this.onmousewheel = b; a.data(this, "mousewheel-line-height", k.getLineHeight(this)), a.data(this, "mousewheel-page-height", k.getPageHeight(this)) }, teardown: function () { if (this.removeEventListener) for (var c = h.length; c;)this.removeEventListener(h[--c], b, !1); else this.onmousewheel = null; a.removeData(this, "mousewheel-line-height"), a.removeData(this, "mousewheel-page-height") }, getLineHeight: function (b) { var c = a(b), d = c["offsetParent" in a.fn ? "offsetParent" : "parent"](); return d.length || (d = a("body")), parseInt(d.css("fontSize"), 10) || parseInt(c.css("fontSize"), 10) || 16 }, getPageHeight: function (b) { return a(b).height() }, settings: { adjustOldDeltas: !0, normalizeOffset: !0 } }; a.fn.extend({ mousewheel: function (a) { return a ? this.bind("mousewheel", a) : this.trigger("mousewheel") }, unmousewheel: function (a) { return this.unbind("mousewheel", a) } }) });
        /* == malihu jquery custom scrollbar plugin == Version: 3.1.5, License: MIT License (MIT) */
        !function (e) { "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof module && module.exports ? module.exports = e : e(jQuery, window, document) }(function (e) {
            !function (t) { var o = "function" == typeof define && define.amd, a = "undefined" != typeof module && module.exports, n = "https:" == document.location.protocol ? "https:" : "http:", i = "cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js"; o || (a ? require("jquery-mousewheel")(e) : e.event.special.mousewheel || e("head").append(decodeURI("%3Cscript src=" + n + "//" + i + "%3E%3C/script%3E"))), t() }(function () {
                var t, o = "mCustomScrollbar", a = "mCS", n = ".mCustomScrollbar", i = { setTop: 0, setLeft: 0, axis: "y", scrollbarPosition: "inside", scrollInertia: 950, autoDraggerLength: !0, alwaysShowScrollbar: 0, snapOffset: 0, mouseWheel: { enable: !0, scrollAmount: "auto", axis: "y", deltaFactor: "auto", disableOver: ["select", "option", "keygen", "datalist", "textarea"] }, scrollButtons: { scrollType: "stepless", scrollAmount: "auto" }, keyboard: { enable: !0, scrollType: "stepless", scrollAmount: "auto" }, contentTouchScroll: 25, documentTouchScroll: !0, advanced: { autoScrollOnFocus: "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']", updateOnContentResize: !0, updateOnImageLoad: "auto", autoUpdateTimeout: 60 }, theme: "light", callbacks: { onTotalScrollOffset: 0, onTotalScrollBackOffset: 0, alwaysTriggerOffsets: !0 } }, r = 0, l = {}, s = window.attachEvent && !window.addEventListener ? 1 : 0, c = !1, d = ["mCSB_dragger_onDrag", "mCSB_scrollTools_onDrag", "mCS_img_loaded", "mCS_disabled", "mCS_destroyed", "mCS_no_scrollbar", "mCS-autoHide", "mCS-dir-rtl", "mCS_no_scrollbar_y", "mCS_no_scrollbar_x", "mCS_y_hidden", "mCS_x_hidden", "mCSB_draggerContainer", "mCSB_buttonUp", "mCSB_buttonDown", "mCSB_buttonLeft", "mCSB_buttonRight"], u = { init: function (t) { var t = e.extend(!0, {}, i, t), o = f.call(this); if (t.live) { var s = t.liveSelector || this.selector || n, c = e(s); if ("off" === t.live) return void m(s); l[s] = setTimeout(function () { c.mCustomScrollbar(t), "once" === t.live && c.length && m(s) }, 500) } else m(s); return t.setWidth = t.set_width ? t.set_width : t.setWidth, t.setHeight = t.set_height ? t.set_height : t.setHeight, t.axis = t.horizontalScroll ? "x" : p(t.axis), t.scrollInertia = t.scrollInertia > 0 && t.scrollInertia < 17 ? 17 : t.scrollInertia, "object" != typeof t.mouseWheel && 1 == t.mouseWheel && (t.mouseWheel = { enable: !0, scrollAmount: "auto", axis: "y", preventDefault: !1, deltaFactor: "auto", normalizeDelta: !1, invert: !1 }), t.mouseWheel.scrollAmount = t.mouseWheelPixels ? t.mouseWheelPixels : t.mouseWheel.scrollAmount, t.mouseWheel.normalizeDelta = t.advanced.normalizeMouseWheelDelta ? t.advanced.normalizeMouseWheelDelta : t.mouseWheel.normalizeDelta, t.scrollButtons.scrollType = g(t.scrollButtons.scrollType), h(t), e(o).each(function () { var o = e(this); if (!o.data(a)) { o.data(a, { idx: ++r, opt: t, scrollRatio: { y: null, x: null }, overflowed: null, contentReset: { y: null, x: null }, bindEvents: !1, tweenRunning: !1, sequential: {}, langDir: o.css("direction"), cbOffsets: null, trigger: null, poll: { size: { o: 0, n: 0 }, img: { o: 0, n: 0 }, change: { o: 0, n: 0 } } }); var n = o.data(a), i = n.opt, l = o.data("mcs-axis"), s = o.data("mcs-scrollbar-position"), c = o.data("mcs-theme"); l && (i.axis = l), s && (i.scrollbarPosition = s), c && (i.theme = c, h(i)), v.call(this), n && i.callbacks.onCreate && "function" == typeof i.callbacks.onCreate && i.callbacks.onCreate.call(this), e("#mCSB_" + n.idx + "_container img:not(." + d[2] + ")").addClass(d[2]), u.update.call(null, o) } }) }, update: function (t, o) { var n = t || f.call(this); return e(n).each(function () { var t = e(this); if (t.data(a)) { var n = t.data(a), i = n.opt, r = e("#mCSB_" + n.idx + "_container"), l = e("#mCSB_" + n.idx), s = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")]; if (!r.length) return; n.tweenRunning && Q(t), o && n && i.callbacks.onBeforeUpdate && "function" == typeof i.callbacks.onBeforeUpdate && i.callbacks.onBeforeUpdate.call(this), t.hasClass(d[3]) && t.removeClass(d[3]), t.hasClass(d[4]) && t.removeClass(d[4]), l.css("max-height", "none"), l.height() !== t.height() && l.css("max-height", t.height()), _.call(this), "y" === i.axis || i.advanced.autoExpandHorizontalScroll || r.css("width", x(r)), n.overflowed = y.call(this), M.call(this), i.autoDraggerLength && S.call(this), b.call(this), T.call(this); var c = [Math.abs(r[0].offsetTop), Math.abs(r[0].offsetLeft)]; "x" !== i.axis && (n.overflowed[0] ? s[0].height() > s[0].parent().height() ? B.call(this) : (G(t, c[0].toString(), { dir: "y", dur: 0, overwrite: "none" }), n.contentReset.y = null) : (B.call(this), "y" === i.axis ? k.call(this) : "yx" === i.axis && n.overflowed[1] && G(t, c[1].toString(), { dir: "x", dur: 0, overwrite: "none" }))), "y" !== i.axis && (n.overflowed[1] ? s[1].width() > s[1].parent().width() ? B.call(this) : (G(t, c[1].toString(), { dir: "x", dur: 0, overwrite: "none" }), n.contentReset.x = null) : (B.call(this), "x" === i.axis ? k.call(this) : "yx" === i.axis && n.overflowed[0] && G(t, c[0].toString(), { dir: "y", dur: 0, overwrite: "none" }))), o && n && (2 === o && i.callbacks.onImageLoad && "function" == typeof i.callbacks.onImageLoad ? i.callbacks.onImageLoad.call(this) : 3 === o && i.callbacks.onSelectorChange && "function" == typeof i.callbacks.onSelectorChange ? i.callbacks.onSelectorChange.call(this) : i.callbacks.onUpdate && "function" == typeof i.callbacks.onUpdate && i.callbacks.onUpdate.call(this)), N.call(this) } }) }, scrollTo: function (t, o) { if ("undefined" != typeof t && null != t) { var n = f.call(this); return e(n).each(function () { var n = e(this); if (n.data(a)) { var i = n.data(a), r = i.opt, l = { trigger: "external", scrollInertia: r.scrollInertia, scrollEasing: "mcsEaseInOut", moveDragger: !1, timeout: 60, callbacks: !0, onStart: !0, onUpdate: !0, onComplete: !0 }, s = e.extend(!0, {}, l, o), c = Y.call(this, t), d = s.scrollInertia > 0 && s.scrollInertia < 17 ? 17 : s.scrollInertia; c[0] = X.call(this, c[0], "y"), c[1] = X.call(this, c[1], "x"), s.moveDragger && (c[0] *= i.scrollRatio.y, c[1] *= i.scrollRatio.x), s.dur = ne() ? 0 : d, setTimeout(function () { null !== c[0] && "undefined" != typeof c[0] && "x" !== r.axis && i.overflowed[0] && (s.dir = "y", s.overwrite = "all", G(n, c[0].toString(), s)), null !== c[1] && "undefined" != typeof c[1] && "y" !== r.axis && i.overflowed[1] && (s.dir = "x", s.overwrite = "none", G(n, c[1].toString(), s)) }, s.timeout) } }) } }, stop: function () { var t = f.call(this); return e(t).each(function () { var t = e(this); t.data(a) && Q(t) }) }, disable: function (t) { var o = f.call(this); return e(o).each(function () { var o = e(this); if (o.data(a)) { o.data(a); N.call(this, "remove"), k.call(this), t && B.call(this), M.call(this, !0), o.addClass(d[3]) } }) }, destroy: function () { var t = f.call(this); return e(t).each(function () { var n = e(this); if (n.data(a)) { var i = n.data(a), r = i.opt, l = e("#mCSB_" + i.idx), s = e("#mCSB_" + i.idx + "_container"), c = e(".mCSB_" + i.idx + "_scrollbar"); r.live && m(r.liveSelector || e(t).selector), N.call(this, "remove"), k.call(this), B.call(this), n.removeData(a), \$(this, "mcs"), c.remove(), s.find("img." + d[2]).removeClass(d[2]), l.replaceWith(s.contents()), n.removeClass(o + " _" + a + "_" + i.idx + " " + d[6] + " " + d[7] + " " + d[5] + " " + d[3]).addClass(d[4]) } }) } }, f = function () { return "object" != typeof e(this) || e(this).length < 1 ? n : this }, h = function (t) { var o = ["rounded", "rounded-dark", "rounded-dots", "rounded-dots-dark"], a = ["rounded-dots", "rounded-dots-dark", "3d", "3d-dark", "3d-thick", "3d-thick-dark", "inset", "inset-dark", "inset-2", "inset-2-dark", "inset-3", "inset-3-dark"], n = ["minimal", "minimal-dark"], i = ["minimal", "minimal-dark"], r = ["minimal", "minimal-dark"]; t.autoDraggerLength = e.inArray(t.theme, o) > -1 ? !1 : t.autoDraggerLength, t.autoExpandScrollbar = e.inArray(t.theme, a) > -1 ? !1 : t.autoExpandScrollbar, t.scrollButtons.enable = e.inArray(t.theme, n) > -1 ? !1 : t.scrollButtons.enable, t.autoHideScrollbar = e.inArray(t.theme, i) > -1 ? !0 : t.autoHideScrollbar, t.scrollbarPosition = e.inArray(t.theme, r) > -1 ? "outside" : t.scrollbarPosition }, m = function (e) { l[e] && (clearTimeout(l[e]), \$(l, e)) }, p = function (e) { return "yx" === e || "xy" === e || "auto" === e ? "yx" : "x" === e || "horizontal" === e ? "x" : "y" }, g = function (e) { return "stepped" === e || "pixels" === e || "step" === e || "click" === e ? "stepped" : "stepless" }, v = function () { var t = e(this), n = t.data(a), i = n.opt, r = i.autoExpandScrollbar ? " " + d[1] + "_expand" : "", l = ["<div id='mCSB_" + n.idx + "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" + n.idx + "_scrollbar mCS-" + i.theme + " mCSB_scrollTools_vertical" + r + "'><div class='" + d[12] + "'><div id='mCSB_" + n.idx + "_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>", "<div id='mCSB_" + n.idx + "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" + n.idx + "_scrollbar mCS-" + i.theme + " mCSB_scrollTools_horizontal" + r + "'><div class='" + d[12] + "'><div id='mCSB_" + n.idx + "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"], s = "yx" === i.axis ? "mCSB_vertical_horizontal" : "x" === i.axis ? "mCSB_horizontal" : "mCSB_vertical", c = "yx" === i.axis ? l[0] + l[1] : "x" === i.axis ? l[1] : l[0], u = "yx" === i.axis ? "<div id='mCSB_" + n.idx + "_container_wrapper' class='mCSB_container_wrapper' />" : "", f = i.autoHideScrollbar ? " " + d[6] : "", h = "x" !== i.axis && "rtl" === n.langDir ? " " + d[7] : ""; i.setWidth && t.css("width", i.setWidth), i.setHeight && t.css("height", i.setHeight), i.setLeft = "y" !== i.axis && "rtl" === n.langDir ? "989999px" : i.setLeft, t.addClass(o + " _" + a + "_" + n.idx + f + h).wrapInner("<div id='mCSB_" + n.idx + "' class='mCustomScrollBox mCS-" + i.theme + " " + s + "'><div id='mCSB_" + n.idx + "_container' class='mCSB_container' style='position:relative; top:" + i.setTop + "; left:" + i.setLeft + ";' dir='" + n.langDir + "' /></div>"); var m = e("#mCSB_" + n.idx), p = e("#mCSB_" + n.idx + "_container"); "y" === i.axis || i.advanced.autoExpandHorizontalScroll || p.css("width", x(p)), "outside" === i.scrollbarPosition ? ("static" === t.css("position") && t.css("position", "relative"), t.css("overflow", "visible"), m.addClass("mCSB_outside").after(c)) : (m.addClass("mCSB_inside").append(c), p.wrap(u)), w.call(this); var g = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")]; g[0].css("min-height", g[0].height()), g[1].css("min-width", g[1].width()) }, x = function (t) { var o = [t[0].scrollWidth, Math.max.apply(Math, t.children().map(function () { return e(this).outerWidth(!0) }).get())], a = t.parent().width(); return o[0] > a ? o[0] : o[1] > a ? o[1] : "100%" }, _ = function () { var t = e(this), o = t.data(a), n = o.opt, i = e("#mCSB_" + o.idx + "_container"); if (n.advanced.autoExpandHorizontalScroll && "y" !== n.axis) { i.css({ width: "auto", "min-width": 0, "overflow-x": "scroll" }); var r = Math.ceil(i[0].scrollWidth); 3 === n.advanced.autoExpandHorizontalScroll || 2 !== n.advanced.autoExpandHorizontalScroll && r > i.parent().width() ? i.css({ width: r, "min-width": "100%", "overflow-x": "inherit" }) : i.css({ "overflow-x": "inherit", position: "absolute" }).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({ width: Math.ceil(i[0].getBoundingClientRect().right + .4) - Math.floor(i[0].getBoundingClientRect().left), "min-width": "100%", position: "relative" }).unwrap() } }, w = function () { var t = e(this), o = t.data(a), n = o.opt, i = e(".mCSB_" + o.idx + "_scrollbar:first"), r = oe(n.scrollButtons.tabindex) ? "tabindex='" + n.scrollButtons.tabindex + "'" : "", l = ["<a href='#' class='" + d[13] + "' " + r + " />", "<a href='#' class='" + d[14] + "' " + r + " />", "<a href='#' class='" + d[15] + "' " + r + " />", "<a href='#' class='" + d[16] + "' " + r + " />"], s = ["x" === n.axis ? l[2] : l[0], "x" === n.axis ? l[3] : l[1], l[2], l[3]]; n.scrollButtons.enable && i.prepend(s[0]).append(s[1]).next(".mCSB_scrollTools").prepend(s[2]).append(s[3]) }, S = function () { var t = e(this), o = t.data(a), n = e("#mCSB_" + o.idx), i = e("#mCSB_" + o.idx + "_container"), r = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")], l = [n.height() / i.outerHeight(!1), n.width() / i.outerWidth(!1)], c = [parseInt(r[0].css("min-height")), Math.round(l[0] * r[0].parent().height()), parseInt(r[1].css("min-width")), Math.round(l[1] * r[1].parent().width())], d = s && c[1] < c[0] ? c[0] : c[1], u = s && c[3] < c[2] ? c[2] : c[3]; r[0].css({ height: d, "max-height": r[0].parent().height() - 10 }).find(".mCSB_dragger_bar").css({ "line-height": c[0] + "px" }), r[1].css({ width: u, "max-width": r[1].parent().width() - 10 }) }, b = function () { var t = e(this), o = t.data(a), n = e("#mCSB_" + o.idx), i = e("#mCSB_" + o.idx + "_container"), r = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")], l = [i.outerHeight(!1) - n.height(), i.outerWidth(!1) - n.width()], s = [l[0] / (r[0].parent().height() - r[0].height()), l[1] / (r[1].parent().width() - r[1].width())]; o.scrollRatio = { y: s[0], x: s[1] } }, C = function (e, t, o) { var a = o ? d[0] + "_expanded" : "", n = e.closest(".mCSB_scrollTools"); "active" === t ? (e.toggleClass(d[0] + " " + a), n.toggleClass(d[1]), e[0]._draggable = e[0]._draggable ? 0 : 1) : e[0]._draggable || ("hide" === t ? (e.removeClass(d[0]), n.removeClass(d[1])) : (e.addClass(d[0]), n.addClass(d[1]))) }, y = function () { var t = e(this), o = t.data(a), n = e("#mCSB_" + o.idx), i = e("#mCSB_" + o.idx + "_container"), r = null == o.overflowed ? i.height() : i.outerHeight(!1), l = null == o.overflowed ? i.width() : i.outerWidth(!1), s = i[0].scrollHeight, c = i[0].scrollWidth; return s > r && (r = s), c > l && (l = c), [r > n.height(), l > n.width()] }, B = function () { var t = e(this), o = t.data(a), n = o.opt, i = e("#mCSB_" + o.idx), r = e("#mCSB_" + o.idx + "_container"), l = [e("#mCSB_" + o.idx + "_dragger_vertical"), e("#mCSB_" + o.idx + "_dragger_horizontal")]; if (Q(t), ("x" !== n.axis && !o.overflowed[0] || "y" === n.axis && o.overflowed[0]) && (l[0].add(r).css("top", 0), G(t, "_resetY")), "y" !== n.axis && !o.overflowed[1] || "x" === n.axis && o.overflowed[1]) { var s = dx = 0; "rtl" === o.langDir && (s = i.width() - r.outerWidth(!1), dx = Math.abs(s / o.scrollRatio.x)), r.css("left", s), l[1].css("left", dx), G(t, "_resetX") } }, T = function () { function t() { r = setTimeout(function () { e.event.special.mousewheel ? (clearTimeout(r), W.call(o[0])) : t() }, 100) } var o = e(this), n = o.data(a), i = n.opt; if (!n.bindEvents) { if (I.call(this), i.contentTouchScroll && D.call(this), E.call(this), i.mouseWheel.enable) { var r; t() } P.call(this), U.call(this), i.advanced.autoScrollOnFocus && H.call(this), i.scrollButtons.enable && F.call(this), i.keyboard.enable && q.call(this), n.bindEvents = !0 } }, k = function () { var t = e(this), o = t.data(a), n = o.opt, i = a + "_" + o.idx, r = ".mCSB_" + o.idx + "_scrollbar", l = e("#mCSB_" + o.idx + ",#mCSB_" + o.idx + "_container,#mCSB_" + o.idx + "_container_wrapper," + r + " ." + d[12] + ",#mCSB_" + o.idx + "_dragger_vertical,#mCSB_" + o.idx + "_dragger_horizontal," + r + ">a"), s = e("#mCSB_" + o.idx + "_container"); n.advanced.releaseDraggableSelectors && l.add(e(n.advanced.releaseDraggableSelectors)), n.advanced.extraDraggableSelectors && l.add(e(n.advanced.extraDraggableSelectors)), o.bindEvents && (e(document).add(e(!A() || top.document)).unbind("." + i), l.each(function () { e(this).unbind("." + i) }), clearTimeout(t[0]._focusTimeout), \$(t[0], "_focusTimeout"), clearTimeout(o.sequential.step), \$(o.sequential, "step"), clearTimeout(s[0].onCompleteTimeout), \$(s[0], "onCompleteTimeout"), o.bindEvents = !1) }, M = function (t) { var o = e(this), n = o.data(a), i = n.opt, r = e("#mCSB_" + n.idx + "_container_wrapper"), l = r.length ? r : e("#mCSB_" + n.idx + "_container"), s = [e("#mCSB_" + n.idx + "_scrollbar_vertical"), e("#mCSB_" + n.idx + "_scrollbar_horizontal")], c = [s[0].find(".mCSB_dragger"), s[1].find(".mCSB_dragger")]; "x" !== i.axis && (n.overflowed[0] && !t ? (s[0].add(c[0]).add(s[0].children("a")).css("display", "block"), l.removeClass(d[8] + " " + d[10])) : (i.alwaysShowScrollbar ? (2 !== i.alwaysShowScrollbar && c[0].css("display", "none"), l.removeClass(d[10])) : (s[0].css("display", "none"), l.addClass(d[10])), l.addClass(d[8]))), "y" !== i.axis && (n.overflowed[1] && !t ? (s[1].add(c[1]).add(s[1].children("a")).css("display", "block"), l.removeClass(d[9] + " " + d[11])) : (i.alwaysShowScrollbar ? (2 !== i.alwaysShowScrollbar && c[1].css("display", "none"), l.removeClass(d[11])) : (s[1].css("display", "none"), l.addClass(d[11])), l.addClass(d[9]))), n.overflowed[0] || n.overflowed[1] ? o.removeClass(d[5]) : o.addClass(d[5]) }, O = function (t) { var o = t.type, a = t.target.ownerDocument !== document && null !== frameElement ? [e(frameElement).offset().top, e(frameElement).offset().left] : null, n = A() && t.target.ownerDocument !== top.document && null !== frameElement ? [e(t.view.frameElement).offset().top, e(t.view.frameElement).offset().left] : [0, 0]; switch (o) { case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp": return a ? [t.originalEvent.pageY - a[0] + n[0], t.originalEvent.pageX - a[1] + n[1], !1] : [t.originalEvent.pageY, t.originalEvent.pageX, !1]; case "touchstart": case "touchmove": case "touchend": var i = t.originalEvent.touches[0] || t.originalEvent.changedTouches[0], r = t.originalEvent.touches.length || t.originalEvent.changedTouches.length; return t.target.ownerDocument !== document ? [i.screenY, i.screenX, r > 1] : [i.pageY, i.pageX, r > 1]; default: return a ? [t.pageY - a[0] + n[0], t.pageX - a[1] + n[1], !1] : [t.pageY, t.pageX, !1] } }, I = function () { function t(e, t, a, n) { if (h[0].idleTimer = d.scrollInertia < 233 ? 250 : 0, o.attr("id") === f[1]) var i = "x", s = (o[0].offsetLeft - t + n) * l.scrollRatio.x; else var i = "y", s = (o[0].offsetTop - e + a) * l.scrollRatio.y; G(r, s.toString(), { dir: i, drag: !0 }) } var o, n, i, r = e(this), l = r.data(a), d = l.opt, u = a + "_" + l.idx, f = ["mCSB_" + l.idx + "_dragger_vertical", "mCSB_" + l.idx + "_dragger_horizontal"], h = e("#mCSB_" + l.idx + "_container"), m = e("#" + f[0] + ",#" + f[1]), p = d.advanced.releaseDraggableSelectors ? m.add(e(d.advanced.releaseDraggableSelectors)) : m, g = d.advanced.extraDraggableSelectors ? e(!A() || top.document).add(e(d.advanced.extraDraggableSelectors)) : e(!A() || top.document); m.bind("contextmenu." + u, function (e) { e.preventDefault() }).bind("mousedown." + u + " touchstart." + u + " pointerdown." + u + " MSPointerDown." + u, function (t) { if (t.stopImmediatePropagation(), t.preventDefault(), ee(t)) { c = !0, s && (document.onselectstart = function () { return !1 }), L.call(h, !1), Q(r), o = e(this); var a = o.offset(), l = O(t)[0] - a.top, u = O(t)[1] - a.left, f = o.height() + a.top, m = o.width() + a.left; f > l && l > 0 && m > u && u > 0 && (n = l, i = u), C(o, "active", d.autoExpandScrollbar) } }).bind("touchmove." + u, function (e) { e.stopImmediatePropagation(), e.preventDefault(); var a = o.offset(), r = O(e)[0] - a.top, l = O(e)[1] - a.left; t(n, i, r, l) }), e(document).add(g).bind("mousemove." + u + " pointermove." + u + " MSPointerMove." + u, function (e) { if (o) { var a = o.offset(), r = O(e)[0] - a.top, l = O(e)[1] - a.left; if (n === r && i === l) return; t(n, i, r, l) } }).add(p).bind("mouseup." + u + " touchend." + u + " pointerup." + u + " MSPointerUp." + u, function () { o && (C(o, "active", d.autoExpandScrollbar), o = null), c = !1, s && (document.onselectstart = null), L.call(h, !0) }) }, D = function () { function o(e) { if (!te(e) || c || O(e)[2]) return void (t = 0); t = 1, b = 0, C = 0, d = 1, y.removeClass("mCS_touch_action"); var o = I.offset(); u = O(e)[0] - o.top, f = O(e)[1] - o.left, z = [O(e)[0], O(e)[1]] } function n(e) { if (te(e) && !c && !O(e)[2] && (T.documentTouchScroll || e.preventDefault(), e.stopImmediatePropagation(), (!C || b) && d)) { g = K(); var t = M.offset(), o = O(e)[0] - t.top, a = O(e)[1] - t.left, n = "mcsLinearOut"; if (E.push(o), W.push(a), z[2] = Math.abs(O(e)[0] - z[0]), z[3] = Math.abs(O(e)[1] - z[1]), B.overflowed[0]) var i = D[0].parent().height() - D[0].height(), r = u - o > 0 && o - u > -(i * B.scrollRatio.y) && (2 * z[3] < z[2] || "yx" === T.axis); if (B.overflowed[1]) var l = D[1].parent().width() - D[1].width(), h = f - a > 0 && a - f > -(l * B.scrollRatio.x) && (2 * z[2] < z[3] || "yx" === T.axis); r || h ? (U || e.preventDefault(), b = 1) : (C = 1, y.addClass("mCS_touch_action")), U && e.preventDefault(), w = "yx" === T.axis ? [u - o, f - a] : "x" === T.axis ? [null, f - a] : [u - o, null], I[0].idleTimer = 250, B.overflowed[0] && s(w[0], R, n, "y", "all", !0), B.overflowed[1] && s(w[1], R, n, "x", L, !0) } } function i(e) { if (!te(e) || c || O(e)[2]) return void (t = 0); t = 1, e.stopImmediatePropagation(), Q(y), p = K(); var o = M.offset(); h = O(e)[0] - o.top, m = O(e)[1] - o.left, E = [], W = [] } function r(e) { if (te(e) && !c && !O(e)[2]) { d = 0, e.stopImmediatePropagation(), b = 0, C = 0, v = K(); var t = M.offset(), o = O(e)[0] - t.top, a = O(e)[1] - t.left; if (!(v - g > 30)) { _ = 1e3 / (v - p); var n = "mcsEaseOut", i = 2.5 > _, r = i ? [E[E.length - 2], W[W.length - 2]] : [0, 0]; x = i ? [o - r[0], a - r[1]] : [o - h, a - m]; var u = [Math.abs(x[0]), Math.abs(x[1])]; _ = i ? [Math.abs(x[0] / 4), Math.abs(x[1] / 4)] : [_, _]; var f = [Math.abs(I[0].offsetTop) - x[0] * l(u[0] / _[0], _[0]), Math.abs(I[0].offsetLeft) - x[1] * l(u[1] / _[1], _[1])]; w = "yx" === T.axis ? [f[0], f[1]] : "x" === T.axis ? [null, f[1]] : [f[0], null], S = [4 * u[0] + T.scrollInertia, 4 * u[1] + T.scrollInertia]; var y = parseInt(T.contentTouchScroll) || 0; w[0] = u[0] > y ? w[0] : 0, w[1] = u[1] > y ? w[1] : 0, B.overflowed[0] && s(w[0], S[0], n, "y", L, !1), B.overflowed[1] && s(w[1], S[1], n, "x", L, !1) } } } function l(e, t) { var o = [1.5 * t, 2 * t, t / 1.5, t / 2]; return e > 90 ? t > 4 ? o[0] : o[3] : e > 60 ? t > 3 ? o[3] : o[2] : e > 30 ? t > 8 ? o[1] : t > 6 ? o[0] : t > 4 ? t : o[2] : t > 8 ? t : o[3] } function s(e, t, o, a, n, i) { e && G(y, e.toString(), { dur: t, scrollEasing: o, dir: a, overwrite: n, drag: i }) } var d, u, f, h, m, p, g, v, x, _, w, S, b, C, y = e(this), B = y.data(a), T = B.opt, k = a + "_" + B.idx, M = e("#mCSB_" + B.idx), I = e("#mCSB_" + B.idx + "_container"), D = [e("#mCSB_" + B.idx + "_dragger_vertical"), e("#mCSB_" + B.idx + "_dragger_horizontal")], E = [], W = [], R = 0, L = "yx" === T.axis ? "none" : "all", z = [], P = I.find("iframe"), H = ["touchstart." + k + " pointerdown." + k + " MSPointerDown." + k, "touchmove." + k + " pointermove." + k + " MSPointerMove." + k, "touchend." + k + " pointerup." + k + " MSPointerUp." + k], U = void 0 !== document.body.style.touchAction && "" !== document.body.style.touchAction; I.bind(H[0], function (e) { o(e) }).bind(H[1], function (e) { n(e) }), M.bind(H[0], function (e) { i(e) }).bind(H[2], function (e) { r(e) }), P.length && P.each(function () { e(this).bind("load", function () { A(this) && e(this.contentDocument || this.contentWindow.document).bind(H[0], function (e) { o(e), i(e) }).bind(H[1], function (e) { n(e) }).bind(H[2], function (e) { r(e) }) }) }) }, E = function () { function o() { return window.getSelection ? window.getSelection().toString() : document.selection && "Control" != document.selection.type ? document.selection.createRange().text : 0 } function n(e, t, o) { d.type = o && i ? "stepped" : "stepless", d.scrollAmount = 10, j(r, e, t, "mcsLinearOut", o ? 60 : null) } var i, r = e(this), l = r.data(a), s = l.opt, d = l.sequential, u = a + "_" + l.idx, f = e("#mCSB_" + l.idx + "_container"), h = f.parent(); f.bind("mousedown." + u, function () { t || i || (i = 1, c = !0) }).add(document).bind("mousemove." + u, function (e) { if (!t && i && o()) { var a = f.offset(), r = O(e)[0] - a.top + f[0].offsetTop, c = O(e)[1] - a.left + f[0].offsetLeft; r > 0 && r < h.height() && c > 0 && c < h.width() ? d.step && n("off", null, "stepped") : ("x" !== s.axis && l.overflowed[0] && (0 > r ? n("on", 38) : r > h.height() && n("on", 40)), "y" !== s.axis && l.overflowed[1] && (0 > c ? n("on", 37) : c > h.width() && n("on", 39))) } }).bind("mouseup." + u + " dragend." + u, function () { t || (i && (i = 0, n("off", null)), c = !1) }) }, W = function () { function t(t, a) { if (Q(o), !z(o, t.target)) { var r = "auto" !== i.mouseWheel.deltaFactor ? parseInt(i.mouseWheel.deltaFactor) : s && t.deltaFactor < 100 ? 100 : t.deltaFactor || 100, d = i.scrollInertia; if ("x" === i.axis || "x" === i.mouseWheel.axis) var u = "x", f = [Math.round(r * n.scrollRatio.x), parseInt(i.mouseWheel.scrollAmount)], h = "auto" !== i.mouseWheel.scrollAmount ? f[1] : f[0] >= l.width() ? .9 * l.width() : f[0], m = Math.abs(e("#mCSB_" + n.idx + "_container")[0].offsetLeft), p = c[1][0].offsetLeft, g = c[1].parent().width() - c[1].width(), v = "y" === i.mouseWheel.axis ? t.deltaY || a : t.deltaX; else var u = "y", f = [Math.round(r * n.scrollRatio.y), parseInt(i.mouseWheel.scrollAmount)], h = "auto" !== i.mouseWheel.scrollAmount ? f[1] : f[0] >= l.height() ? .9 * l.height() : f[0], m = Math.abs(e("#mCSB_" + n.idx + "_container")[0].offsetTop), p = c[0][0].offsetTop, g = c[0].parent().height() - c[0].height(), v = t.deltaY || a; "y" === u && !n.overflowed[0] || "x" === u && !n.overflowed[1] || ((i.mouseWheel.invert || t.webkitDirectionInvertedFromDevice) && (v = -v), i.mouseWheel.normalizeDelta && (v = 0 > v ? -1 : 1), (v > 0 && 0 !== p || 0 > v && p !== g || i.mouseWheel.preventDefault) && (t.stopImmediatePropagation(), t.preventDefault()), t.deltaFactor < 5 && !i.mouseWheel.normalizeDelta && (h = t.deltaFactor, d = 17), G(o, (m - v * h).toString(), { dir: u, dur: d })) } } if (e(this).data(a)) { var o = e(this), n = o.data(a), i = n.opt, r = a + "_" + n.idx, l = e("#mCSB_" + n.idx), c = [e("#mCSB_" + n.idx + "_dragger_vertical"), e("#mCSB_" + n.idx + "_dragger_horizontal")], d = e("#mCSB_" + n.idx + "_container").find("iframe"); d.length && d.each(function () { e(this).bind("load", function () { A(this) && e(this.contentDocument || this.contentWindow.document).bind("mousewheel." + r, function (e, o) { t(e, o) }) }) }), l.bind("mousewheel." + r, function (e, o) { t(e, o) }) } }, R = new Object, A = function (t) { var o = !1, a = !1, n = null; if (void 0 === t ? a = "#empty" : void 0 !== e(t).attr("id") && (a = e(t).attr("id")), a !== !1 && void 0 !== R[a]) return R[a]; if (t) { try { var i = t.contentDocument || t.contentWindow.document; n = i.body.innerHTML } catch (r) { } o = null !== n } else { try { var i = top.document; n = i.body.innerHTML } catch (r) { } o = null !== n } return a !== !1 && (R[a] = o), o }, L = function (e) { var t = this.find("iframe"); if (t.length) { var o = e ? "auto" : "none"; t.css("pointer-events", o) } }, z = function (t, o) { var n = o.nodeName.toLowerCase(), i = t.data(a).opt.mouseWheel.disableOver, r = ["select", "textarea"]; return e.inArray(n, i) > -1 && !(e.inArray(n, r) > -1 && !e(o).is(":focus")) }, P = function () { var t, o = e(this), n = o.data(a), i = a + "_" + n.idx, r = e("#mCSB_" + n.idx + "_container"), l = r.parent(), s = e(".mCSB_" + n.idx + "_scrollbar ." + d[12]); s.bind("mousedown." + i + " touchstart." + i + " pointerdown." + i + " MSPointerDown." + i, function (o) { c = !0, e(o.target).hasClass("mCSB_dragger") || (t = 1) }).bind("touchend." + i + " pointerup." + i + " MSPointerUp." + i, function () { c = !1 }).bind("click." + i, function (a) { if (t && (t = 0, e(a.target).hasClass(d[12]) || e(a.target).hasClass("mCSB_draggerRail"))) { Q(o); var i = e(this), s = i.find(".mCSB_dragger"); if (i.parent(".mCSB_scrollTools_horizontal").length > 0) { if (!n.overflowed[1]) return; var c = "x", u = a.pageX > s.offset().left ? -1 : 1, f = Math.abs(r[0].offsetLeft) - u * (.9 * l.width()) } else { if (!n.overflowed[0]) return; var c = "y", u = a.pageY > s.offset().top ? -1 : 1, f = Math.abs(r[0].offsetTop) - u * (.9 * l.height()) } G(o, f.toString(), { dir: c, scrollEasing: "mcsEaseInOut" }) } }) }, H = function () { var t = e(this), o = t.data(a), n = o.opt, i = a + "_" + o.idx, r = e("#mCSB_" + o.idx + "_container"), l = r.parent(); r.bind("focusin." + i, function () { var o = e(document.activeElement), a = r.find(".mCustomScrollBox").length, i = 0; o.is(n.advanced.autoScrollOnFocus) && (Q(t), clearTimeout(t[0]._focusTimeout), t[0]._focusTimer = a ? (i + 17) * a : 0, t[0]._focusTimeout = setTimeout(function () { var e = [ae(o)[0], ae(o)[1]], a = [r[0].offsetTop, r[0].offsetLeft], s = [a[0] + e[0] >= 0 && a[0] + e[0] < l.height() - o.outerHeight(!1), a[1] + e[1] >= 0 && a[0] + e[1] < l.width() - o.outerWidth(!1)], c = "yx" !== n.axis || s[0] || s[1] ? "all" : "none"; "x" === n.axis || s[0] || G(t, e[0].toString(), { dir: "y", scrollEasing: "mcsEaseInOut", overwrite: c, dur: i }), "y" === n.axis || s[1] || G(t, e[1].toString(), { dir: "x", scrollEasing: "mcsEaseInOut", overwrite: c, dur: i }) }, t[0]._focusTimer)) }) }, U = function () { var t = e(this), o = t.data(a), n = a + "_" + o.idx, i = e("#mCSB_" + o.idx + "_container").parent(); i.bind("scroll." + n, function () { 0 === i.scrollTop() && 0 === i.scrollLeft() || e(".mCSB_" + o.idx + "_scrollbar").css("visibility", "hidden") }) }, F = function () { var t = e(this), o = t.data(a), n = o.opt, i = o.sequential, r = a + "_" + o.idx, l = ".mCSB_" + o.idx + "_scrollbar", s = e(l + ">a"); s.bind("contextmenu." + r, function (e) { e.preventDefault() }).bind("mousedown." + r + " touchstart." + r + " pointerdown." + r + " MSPointerDown." + r + " mouseup." + r + " touchend." + r + " pointerup." + r + " MSPointerUp." + r + " mouseout." + r + " pointerout." + r + " MSPointerOut." + r + " click." + r, function (a) { function r(e, o) { i.scrollAmount = n.scrollButtons.scrollAmount, j(t, e, o) } if (a.preventDefault(), ee(a)) { var l = e(this).attr("class"); switch (i.type = n.scrollButtons.scrollType, a.type) { case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown": if ("stepped" === i.type) return; c = !0, o.tweenRunning = !1, r("on", l); break; case "mouseup": case "touchend": case "pointerup": case "MSPointerUp": case "mouseout": case "pointerout": case "MSPointerOut": if ("stepped" === i.type) return; c = !1, i.dir && r("off", l); break; case "click": if ("stepped" !== i.type || o.tweenRunning) return; r("on", l) } } }) }, q = function () { function t(t) { function a(e, t) { r.type = i.keyboard.scrollType, r.scrollAmount = i.keyboard.scrollAmount, "stepped" === r.type && n.tweenRunning || j(o, e, t) } switch (t.type) { case "blur": n.tweenRunning && r.dir && a("off", null); break; case "keydown": case "keyup": var l = t.keyCode ? t.keyCode : t.which, s = "on"; if ("x" !== i.axis && (38 === l || 40 === l) || "y" !== i.axis && (37 === l || 39 === l)) { if ((38 === l || 40 === l) && !n.overflowed[0] || (37 === l || 39 === l) && !n.overflowed[1]) return; "keyup" === t.type && (s = "off"), e(document.activeElement).is(u) || (t.preventDefault(), t.stopImmediatePropagation(), a(s, l)) } else if (33 === l || 34 === l) { if ((n.overflowed[0] || n.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type) { Q(o); var f = 34 === l ? -1 : 1; if ("x" === i.axis || "yx" === i.axis && n.overflowed[1] && !n.overflowed[0]) var h = "x", m = Math.abs(c[0].offsetLeft) - f * (.9 * d.width()); else var h = "y", m = Math.abs(c[0].offsetTop) - f * (.9 * d.height()); G(o, m.toString(), { dir: h, scrollEasing: "mcsEaseInOut" }) } } else if ((35 === l || 36 === l) && !e(document.activeElement).is(u) && ((n.overflowed[0] || n.overflowed[1]) && (t.preventDefault(), t.stopImmediatePropagation()), "keyup" === t.type)) { if ("x" === i.axis || "yx" === i.axis && n.overflowed[1] && !n.overflowed[0]) var h = "x", m = 35 === l ? Math.abs(d.width() - c.outerWidth(!1)) : 0; else var h = "y", m = 35 === l ? Math.abs(d.height() - c.outerHeight(!1)) : 0; G(o, m.toString(), { dir: h, scrollEasing: "mcsEaseInOut" }) } } } var o = e(this), n = o.data(a), i = n.opt, r = n.sequential, l = a + "_" + n.idx, s = e("#mCSB_" + n.idx), c = e("#mCSB_" + n.idx + "_container"), d = c.parent(), u = "input,textarea,select,datalist,keygen,[contenteditable='true']", f = c.find("iframe"), h = ["blur." + l + " keydown." + l + " keyup." + l]; f.length && f.each(function () { e(this).bind("load", function () { A(this) && e(this.contentDocument || this.contentWindow.document).bind(h[0], function (e) { t(e) }) }) }), s.attr("tabindex", "0").bind(h[0], function (e) { t(e) }) }, j = function (t, o, n, i, r) { function l(e) { u.snapAmount && (f.scrollAmount = u.snapAmount instanceof Array ? "x" === f.dir[0] ? u.snapAmount[1] : u.snapAmount[0] : u.snapAmount); var o = "stepped" !== f.type, a = r ? r : e ? o ? p / 1.5 : g : 1e3 / 60, n = e ? o ? 7.5 : 40 : 2.5, s = [Math.abs(h[0].offsetTop), Math.abs(h[0].offsetLeft)], d = [c.scrollRatio.y > 10 ? 10 : c.scrollRatio.y, c.scrollRatio.x > 10 ? 10 : c.scrollRatio.x], m = "x" === f.dir[0] ? s[1] + f.dir[1] * (d[1] * n) : s[0] + f.dir[1] * (d[0] * n), v = "x" === f.dir[0] ? s[1] + f.dir[1] * parseInt(f.scrollAmount) : s[0] + f.dir[1] * parseInt(f.scrollAmount), x = "auto" !== f.scrollAmount ? v : m, _ = i ? i : e ? o ? "mcsLinearOut" : "mcsEaseInOut" : "mcsLinear", w = !!e; return e && 17 > a && (x = "x" === f.dir[0] ? s[1] : s[0]), G(t, x.toString(), { dir: f.dir[0], scrollEasing: _, dur: a, onComplete: w }), e ? void (f.dir = !1) : (clearTimeout(f.step), void (f.step = setTimeout(function () { l() }, a))) } function s() { clearTimeout(f.step), \$(f, "step"), Q(t) } var c = t.data(a), u = c.opt, f = c.sequential, h = e("#mCSB_" + c.idx + "_container"), m = "stepped" === f.type, p = u.scrollInertia < 26 ? 26 : u.scrollInertia, g = u.scrollInertia < 1 ? 17 : u.scrollInertia; switch (o) { case "on": if (f.dir = [n === d[16] || n === d[15] || 39 === n || 37 === n ? "x" : "y", n === d[13] || n === d[15] || 38 === n || 37 === n ? -1 : 1], Q(t), oe(n) && "stepped" === f.type) return; l(m); break; case "off": s(), (m || c.tweenRunning && f.dir) && l(!0) } }, Y = function (t) { var o = e(this).data(a).opt, n = []; return "function" == typeof t && (t = t()), t instanceof Array ? n = t.length > 1 ? [t[0], t[1]] : "x" === o.axis ? [null, t[0]] : [t[0], null] : (n[0] = t.y ? t.y : t.x || "x" === o.axis ? null : t, n[1] = t.x ? t.x : t.y || "y" === o.axis ? null : t), "function" == typeof n[0] && (n[0] = n[0]()), "function" == typeof n[1] && (n[1] = n[1]()), n }, X = function (t, o) { if (null != t && "undefined" != typeof t) { var n = e(this), i = n.data(a), r = i.opt, l = e("#mCSB_" + i.idx + "_container"), s = l.parent(), c = typeof t; o || (o = "x" === r.axis ? "x" : "y"); var d = "x" === o ? l.outerWidth(!1) - s.width() : l.outerHeight(!1) - s.height(), f = "x" === o ? l[0].offsetLeft : l[0].offsetTop, h = "x" === o ? "left" : "top"; switch (c) { case "function": return t(); case "object": var m = t.jquery ? t : e(t); if (!m.length) return; return "x" === o ? ae(m)[1] : ae(m)[0]; case "string": case "number": if (oe(t)) return Math.abs(t); if (-1 !== t.indexOf("%")) return Math.abs(d * parseInt(t) / 100); if (-1 !== t.indexOf("-=")) return Math.abs(f - parseInt(t.split("-=")[1])); if (-1 !== t.indexOf("+=")) { var p = f + parseInt(t.split("+=")[1]); return p >= 0 ? 0 : Math.abs(p) } if (-1 !== t.indexOf("px") && oe(t.split("px")[0])) return Math.abs(t.split("px")[0]); if ("top" === t || "left" === t) return 0; if ("bottom" === t) return Math.abs(s.height() - l.outerHeight(!1)); if ("right" === t) return Math.abs(s.width() - l.outerWidth(!1)); if ("first" === t || "last" === t) { var m = l.find(":" + t); return "x" === o ? ae(m)[1] : ae(m)[0] } return e(t).length ? "x" === o ? ae(e(t))[1] : ae(e(t))[0] : (l.css(h, t), void u.update.call(null, n[0])) } } }, N = function (t) {
                    function o() { return clearTimeout(f[0].autoUpdate), 0 === l.parents("html").length ? void (l = null) : void (f[0].autoUpdate = setTimeout(function () { return c.advanced.updateOnSelectorChange && (s.poll.change.n = i(), s.poll.change.n !== s.poll.change.o) ? (s.poll.change.o = s.poll.change.n, void r(3)) : c.advanced.updateOnContentResize && (s.poll.size.n = l[0].scrollHeight + l[0].scrollWidth + f[0].offsetHeight + l[0].offsetHeight + l[0].offsetWidth, s.poll.size.n !== s.poll.size.o) ? (s.poll.size.o = s.poll.size.n, void r(1)) : !c.advanced.updateOnImageLoad || "auto" === c.advanced.updateOnImageLoad && "y" === c.axis || (s.poll.img.n = f.find("img").length, s.poll.img.n === s.poll.img.o) ? void ((c.advanced.updateOnSelectorChange || c.advanced.updateOnContentResize || c.advanced.updateOnImageLoad) && o()) : (s.poll.img.o = s.poll.img.n, void f.find("img").each(function () { n(this) })) }, c.advanced.autoUpdateTimeout)) } function n(t) {
                        function o(e, t) {
                            return function () {
                                return t.apply(e, arguments)
                            }
                        } function a() { this.onload = null, e(t).addClass(d[2]), r(2) } if (e(t).hasClass(d[2])) return void r(); var n = new Image; n.onload = o(n, a), n.src = t.src
                    } function i() { c.advanced.updateOnSelectorChange === !0 && (c.advanced.updateOnSelectorChange = "*"); var e = 0, t = f.find(c.advanced.updateOnSelectorChange); return c.advanced.updateOnSelectorChange && t.length > 0 && t.each(function () { e += this.offsetHeight + this.offsetWidth }), e } function r(e) { clearTimeout(f[0].autoUpdate), u.update.call(null, l[0], e) } var l = e(this), s = l.data(a), c = s.opt, f = e("#mCSB_" + s.idx + "_container"); return t ? (clearTimeout(f[0].autoUpdate), void \$(f[0], "autoUpdate")) : void o()
                }, V = function (e, t, o) { return Math.round(e / t) * t - o }, Q = function (t) { var o = t.data(a), n = e("#mCSB_" + o.idx + "_container,#mCSB_" + o.idx + "_container_wrapper,#mCSB_" + o.idx + "_dragger_vertical,#mCSB_" + o.idx + "_dragger_horizontal"); n.each(function () { Z.call(this) }) }, G = function (t, o, n) { function i(e) { return s && c.callbacks[e] && "function" == typeof c.callbacks[e] } function r() { return [c.callbacks.alwaysTriggerOffsets || w >= S[0] + y, c.callbacks.alwaysTriggerOffsets || -B >= w] } function l() { var e = [h[0].offsetTop, h[0].offsetLeft], o = [x[0].offsetTop, x[0].offsetLeft], a = [h.outerHeight(!1), h.outerWidth(!1)], i = [f.height(), f.width()]; t[0].mcs = { content: h, top: e[0], left: e[1], draggerTop: o[0], draggerLeft: o[1], topPct: Math.round(100 * Math.abs(e[0]) / (Math.abs(a[0]) - i[0])), leftPct: Math.round(100 * Math.abs(e[1]) / (Math.abs(a[1]) - i[1])), direction: n.dir } } var s = t.data(a), c = s.opt, d = { trigger: "internal", dir: "y", scrollEasing: "mcsEaseOut", drag: !1, dur: c.scrollInertia, overwrite: "all", callbacks: !0, onStart: !0, onUpdate: !0, onComplete: !0 }, n = e.extend(d, n), u = [n.dur, n.drag ? 0 : n.dur], f = e("#mCSB_" + s.idx), h = e("#mCSB_" + s.idx + "_container"), m = h.parent(), p = c.callbacks.onTotalScrollOffset ? Y.call(t, c.callbacks.onTotalScrollOffset) : [0, 0], g = c.callbacks.onTotalScrollBackOffset ? Y.call(t, c.callbacks.onTotalScrollBackOffset) : [0, 0]; if (s.trigger = n.trigger, 0 === m.scrollTop() && 0 === m.scrollLeft() || (e(".mCSB_" + s.idx + "_scrollbar").css("visibility", "visible"), m.scrollTop(0).scrollLeft(0)), "_resetY" !== o || s.contentReset.y || (i("onOverflowYNone") && c.callbacks.onOverflowYNone.call(t[0]), s.contentReset.y = 1), "_resetX" !== o || s.contentReset.x || (i("onOverflowXNone") && c.callbacks.onOverflowXNone.call(t[0]), s.contentReset.x = 1), "_resetY" !== o && "_resetX" !== o) { if (!s.contentReset.y && t[0].mcs || !s.overflowed[0] || (i("onOverflowY") && c.callbacks.onOverflowY.call(t[0]), s.contentReset.x = null), !s.contentReset.x && t[0].mcs || !s.overflowed[1] || (i("onOverflowX") && c.callbacks.onOverflowX.call(t[0]), s.contentReset.x = null), c.snapAmount) { var v = c.snapAmount instanceof Array ? "x" === n.dir ? c.snapAmount[1] : c.snapAmount[0] : c.snapAmount; o = V(o, v, c.snapOffset) } switch (n.dir) { case "x": var x = e("#mCSB_" + s.idx + "_dragger_horizontal"), _ = "left", w = h[0].offsetLeft, S = [f.width() - h.outerWidth(!1), x.parent().width() - x.width()], b = [o, 0 === o ? 0 : o / s.scrollRatio.x], y = p[1], B = g[1], T = y > 0 ? y / s.scrollRatio.x : 0, k = B > 0 ? B / s.scrollRatio.x : 0; break; case "y": var x = e("#mCSB_" + s.idx + "_dragger_vertical"), _ = "top", w = h[0].offsetTop, S = [f.height() - h.outerHeight(!1), x.parent().height() - x.height()], b = [o, 0 === o ? 0 : o / s.scrollRatio.y], y = p[0], B = g[0], T = y > 0 ? y / s.scrollRatio.y : 0, k = B > 0 ? B / s.scrollRatio.y : 0 }b[1] < 0 || 0 === b[0] && 0 === b[1] ? b = [0, 0] : b[1] >= S[1] ? b = [S[0], S[1]] : b[0] = -b[0], t[0].mcs || (l(), i("onInit") && c.callbacks.onInit.call(t[0])), clearTimeout(h[0].onCompleteTimeout), J(x[0], _, Math.round(b[1]), u[1], n.scrollEasing), !s.tweenRunning && (0 === w && b[0] >= 0 || w === S[0] && b[0] <= S[0]) || J(h[0], _, Math.round(b[0]), u[0], n.scrollEasing, n.overwrite, { onStart: function () { n.callbacks && n.onStart && !s.tweenRunning && (i("onScrollStart") && (l(), c.callbacks.onScrollStart.call(t[0])), s.tweenRunning = !0, C(x), s.cbOffsets = r()) }, onUpdate: function () { n.callbacks && n.onUpdate && i("whileScrolling") && (l(), c.callbacks.whileScrolling.call(t[0])) }, onComplete: function () { if (n.callbacks && n.onComplete) { "yx" === c.axis && clearTimeout(h[0].onCompleteTimeout); var e = h[0].idleTimer || 0; h[0].onCompleteTimeout = setTimeout(function () { i("onScroll") && (l(), c.callbacks.onScroll.call(t[0])), i("onTotalScroll") && b[1] >= S[1] - T && s.cbOffsets[0] && (l(), c.callbacks.onTotalScroll.call(t[0])), i("onTotalScrollBack") && b[1] <= k && s.cbOffsets[1] && (l(), c.callbacks.onTotalScrollBack.call(t[0])), s.tweenRunning = !1, h[0].idleTimer = 0, C(x, "hide") }, e) } } }) } }, J = function (e, t, o, a, n, i, r) { function l() { S.stop || (x || m.call(), x = K() - v, s(), x >= S.time && (S.time = x > S.time ? x + f - (x - S.time) : x + f - 1, S.time < x + 1 && (S.time = x + 1)), S.time < a ? S.id = h(l) : g.call()) } function s() { a > 0 ? (S.currVal = u(S.time, _, b, a, n), w[t] = Math.round(S.currVal) + "px") : w[t] = o + "px", p.call() } function c() { f = 1e3 / 60, S.time = x + f, h = window.requestAnimationFrame ? window.requestAnimationFrame : function (e) { return s(), setTimeout(e, .01) }, S.id = h(l) } function d() { null != S.id && (window.requestAnimationFrame ? window.cancelAnimationFrame(S.id) : clearTimeout(S.id), S.id = null) } function u(e, t, o, a, n) { switch (n) { case "linear": case "mcsLinear": return o * e / a + t; case "mcsLinearOut": return e /= a, e--, o * Math.sqrt(1 - e * e) + t; case "easeInOutSmooth": return e /= a / 2, 1 > e ? o / 2 * e * e + t : (e--, -o / 2 * (e * (e - 2) - 1) + t); case "easeInOutStrong": return e /= a / 2, 1 > e ? o / 2 * Math.pow(2, 10 * (e - 1)) + t : (e--, o / 2 * (-Math.pow(2, -10 * e) + 2) + t); case "easeInOut": case "mcsEaseInOut": return e /= a / 2, 1 > e ? o / 2 * e * e * e + t : (e -= 2, o / 2 * (e * e * e + 2) + t); case "easeOutSmooth": return e /= a, e--, -o * (e * e * e * e - 1) + t; case "easeOutStrong": return o * (-Math.pow(2, -10 * e / a) + 1) + t; case "easeOut": case "mcsEaseOut": default: var i = (e /= a) * e, r = i * e; return t + o * (.499999999999997 * r * i + -2.5 * i * i + 5.5 * r + -6.5 * i + 4 * e) } } e._mTween || (e._mTween = { top: {}, left: {} }); var f, h, r = r || {}, m = r.onStart || function () { }, p = r.onUpdate || function () { }, g = r.onComplete || function () { }, v = K(), x = 0, _ = e.offsetTop, w = e.style, S = e._mTween[t]; "left" === t && (_ = e.offsetLeft); var b = o - _; S.stop = 0, "none" !== i && d(), c() }, K = function () { return window.performance && window.performance.now ? window.performance.now() : window.performance && window.performance.webkitNow ? window.performance.webkitNow() : Date.now ? Date.now() : (new Date).getTime() }, Z = function () { var e = this; e._mTween || (e._mTween = { top: {}, left: {} }); for (var t = ["top", "left"], o = 0; o < t.length; o++) { var a = t[o]; e._mTween[a].id && (window.requestAnimationFrame ? window.cancelAnimationFrame(e._mTween[a].id) : clearTimeout(e._mTween[a].id), e._mTween[a].id = null, e._mTween[a].stop = 1) } }, \$ = function (e, t) { try { delete e[t] } catch (o) { e[t] = null } }, ee = function (e) { return !(e.which && 1 !== e.which) }, te = function (e) { var t = e.originalEvent.pointerType; return !(t && "touch" !== t && 2 !== t) }, oe = function (e) { return !isNaN(parseFloat(e)) && isFinite(e) }, ae = function (e) { var t = e.parents(".mCSB_container"); return [e.offset().top - t.offset().top, e.offset().left - t.offset().left] }, ne = function () { function e() { var e = ["webkit", "moz", "ms", "o"]; if ("hidden" in document) return "hidden"; for (var t = 0; t < e.length; t++)if (e[t] + "Hidden" in document) return e[t] + "Hidden"; return null } var t = e(); return t ? document[t] : !1 }; e.fn[o] = function (t) { return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments) }, e[o] = function (t) { return u[t] ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof t && t ? void e.error("Method " + t + " does not exist") : u.init.apply(this, arguments) }, e[o].defaults = i, window[o] = !0, e(window).bind("load", function () { e(n)[o](), e.extend(e.expr[":"], { mcsInView: e.expr[":"].mcsInView || function (t) { var o, a, n = e(t), i = n.parents(".mCSB_container"); if (i.length) return o = i.parent(), a = [i[0].offsetTop, i[0].offsetLeft], a[0] + ae(n)[0] >= 0 && a[0] + ae(n)[0] < o.height() - n.outerHeight(!1) && a[1] + ae(n)[1] >= 0 && a[1] + ae(n)[1] < o.width() - n.outerWidth(!1) }, mcsInSight: e.expr[":"].mcsInSight || function (t, o, a) { var n, i, r, l, s = e(t), c = s.parents(".mCSB_container"), d = "exact" === a[3] ? [[1, 0], [1, 0]] : [[.9, .1], [.6, .4]]; if (c.length) return n = [s.outerHeight(!1), s.outerWidth(!1)], r = [c[0].offsetTop + ae(s)[0], c[0].offsetLeft + ae(s)[1]], i = [c.parent()[0].offsetHeight, c.parent()[0].offsetWidth], l = [n[0] < i[0] ? d[0] : d[1], n[1] < i[1] ? d[0] : d[1]], r[0] - i[0] * l[0][0] < 0 && r[0] + n[0] - i[0] * l[0][1] >= 0 && r[1] - i[1] * l[1][0] < 0 && r[1] + n[1] - i[1] * l[1][1] >= 0 }, mcsOverflow: e.expr[":"].mcsOverflow || function (t) { var o = e(t).data(a); if (o) return o.overflowed[0] || o.overflowed[1] } }) })
            })
        });

        function __GetUrlValue(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|\$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]); return null;
        };

        function __GetCookie(cookieName) {
            var theCookie = "" + document.cookie;
            var ind = theCookie.indexOf(cookieName + "=");
            if (ind == -1 || cookieName == "")
                return "";
            var ind1 = theCookie.indexOf(';', ind);
            if (ind1 == -1)
                ind1 = theCookie.length;
            return unescape(theCookie.substring(ind + cookieName.length + 1, ind1));
        }

        function __SetCookie(name, value, days) {
            var Days = days || 365;
            var exp = new Date(); //new Date('December 31, 9998');
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + '; path=/; domain=.bilibili.com';
        }

        function ChatGetSettings(key) {
            if (typeof (localStorage) != 'undefined' && localStorage && localStorage.getItem) {
                return localStorage.getItem(key);
            } else {
                return __GetCookie(key);
            }
        }

        function ChatSaveSettings(key, val) {
            if (typeof (localStorage) != 'undefined' && localStorage && localStorage.setItem) {
                try {
                    return localStorage.setItem(key, val);
                } catch (e) {
                    console.warn(e);
                }
            } else {
                return __SetCookie(key, val);
            }
        }

        var allow = true;
        if (window.top != window.self && window.REFERRER_LIST) {
            try {
                var h = window.document.referrer.match(/^http(s)?:\\/\\/(.*?)\\//);
                if (h && h[2] && !(new RegExp(window.REFERRER_LIST.join('|').replace(/\\./g, '\\\\.').replace(/\\*/g, '\\.\\*'))).test(h[2])) {
                    allow = false;
                } else if (!window.document.referrer && window.navigator.userAgent.indexOf('MicroMessenger') === -1 && window.navigator.userAgent.indexOf('IqiyiApp') === -1) {
                    allow = false;
                }
            } catch (e) {

            }
        }

        //from page.arc.js
        function flashChecker() {
            var hasFlash = false;
            var flashVersion = 0;
            if (navigator.plugins && navigator.plugins.length > 0) {
                var swf = navigator.plugins["Shockwave Flash"];
                if (swf) {
                    hasFlash = true;
                    var words = swf.description.split(" ");
                    for (var i = 0; i < words.length; ++i) {
                        if (isNaN(parseInt(words[i]))) continue;
                        flashVersion = parseInt(words[i]);
                    }
                }
            }
            return { hasFlash: hasFlash, flashVersion: flashVersion };
        };

        if (__GetUrlValue('crossDomain')) {
            document.domain = 'bilibili.com';
        }

        window.browser = { version: function () { var b = navigator.userAgent; return { trident: /Trident/i.test(b), presto: /Presto/i.test(b), webKit: /AppleWebKit/i.test(b), gecko: /Gecko/i.test(b) && !/KHTML/i.test(b), mobile: /AppleWebKit.*Mobile.*/i.test(b), ios: /\\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(b), android: /Android/i.test(b) || /Linux/i.test(b), windowsphone: /Windows Phone/i.test(b), iPhone: /iPhone/i.test(b), iPad: /iPad/i.test(b), MicroMessenger: /MicroMessenger/i.test(b), webApp: !/Safari/i.test(b) } }(), language: (navigator.browserLanguage || navigator.language).toLowerCase() };

        function videoLoader() {
            this.config = {
                'player': \$("#bofqi"),
                'aid': __GetUrlValue('aid'),
                'page': __GetUrlValue('page') || 1,
                'roomid': __GetUrlValue('roomid'),
                'autoplay': __GetUrlValue('autoplay'),
                'sendbar': __GetUrlValue('sendbar'),
                'as_wide': 1, // 默认以宽屏模式载入
                'cid': __GetUrlValue('cid'),
                'bnj': __GetUrlValue('bnj'),
                "player_type": __GetUrlValue('player_type'),
                "season_type": __GetUrlValue('season_type')
            };
            this.flashAddEvents = [];
            this.flashRemoveEvents = [];
            this.hasFlash = flashChecker().hasFlash;
            this.gray_html5 = true;

            //不支持IE10及以下浏览器 不支持Win7 IE11
            if (/msie [\\w.]+/.exec(navigator.userAgent.toLowerCase()) || /edge/i.exec(navigator.userAgent) || ((/Trident/i).test(navigator.userAgent) && (/Windows NT 6/.test(navigator.userAgent)))) {
                this.gray_html5 = false;
            }

            if (((/linux/i).test(navigator.userAgent.toLowerCase()) || (/Mac OS X[\\s\\_\\-\\/](\\d+[\\.\\-\\_]\\d+[\\.\\-\\_]?\\d*)/i).test(navigator.userAgent)) || !flashChecker().hasFlash) {
                if (ChatGetSettings('defaulth5') == null) {
                    ChatSaveSettings("defaulth5", 1);
                }
            }

            if (!this.config['cid']) {
                this.getCid();
            } else {
                this.init();
            }
        }
        videoLoader.prototype.getCid = function () {
            var self = this;
            \$.ajax({
                url: '//api.bilibili.com/view?type=json&appkey=8e9fc618fbd41e28&id=' + this.config['aid'] + '&page=' + this.config['page'],
                type: 'get',
                data: {
                    'type': 'jsonp'
                },
                dataType: 'jsonp',
                success: function (data) {
                    if (data) {
                        self.config['cid'] = data.cid;
                    }
                    self.init();
                },
                error: function () {
                    self.init();
                }
            });
        };

        videoLoader.prototype.init = function () {
            if (!(ChatGetSettings('defaulth5') == 1 && this.gray_html5)) {
                if (this.config.aid) {
                    this.loadFlashPlayer();
                } else if (this.config.roomid) {
                    this.loadFlashLivePlayer();
                }
            } else {
                var self = this;

                if (this.config.roomid) {
                    \$('<link rel="stylesheet" type="text/css" href="//static.hdslb.com/css/simple.v2.min.css" />').appendTo('body');
                    \$.getScript("//static.hdslb.com/js/simple.v2.min.js", function () {
                        self.config.player.addClass('html5');
                        if (self.config.sendbar) {
                            self.config.player.after('<div id="dm_send_bar"><input type="text" id="dm_send_input" maxlength="200" disabled placeholder="输入弹幕╮(￣▽￣)╭" value="" /><button id="dm_send_btn" class="disabled">发送</button></div>');
                            self.config.player.hide().height(\$(window).height() - \$("#dm_send_bar").height()).show();
                            \$(window).resize(function () {
                                self.config.player.hide().height(\$(window).height() - \$("#dm_send_bar").height()).show();
                            });
                        }
                        self.h5player = new BiliH5Player();
                        self.loadHtml5LivePlayer();
                    });
                } else {
                    self.loadHtml5Player();
                }
            }
        };

        videoLoader.prototype.loadHtml5Player = function () {
            var self = this;
            this.videoType = 'html5';
            ChatSaveSettings("defaulth5", 1);
            if (!window.bilibiliPlayer) {
                \$('<link rel="stylesheet" type="text/css" href="//static.hdslb.com/plugins/mCustomScrollbar/jquery.mCustomScrollbar.min.css" />').appendTo('body');

                \$.ajax({
                    url: '//static.hdslb.com/player/js/bilibiliPlayer.min.js',
                    cache: true,
                    type: 'get',
                    dataType: 'script',
                    success: function () {
                        \$('#bofqi').html('<div class="player"><div id="bilibiliPlayer"></div></div><iframe style="display: none"></iframe><div id="player_placeholder"></div>');
                        window.player = new bilibiliPlayer({
                            aid: self.config.aid,
                            cid: self.config.cid,
                            p: self.config.page,
                            autoplay: (self.config.autoplay == true),
                            as_wide: self.config.as_wide,
                            bnj: self.config.bnj,
                            player_type: self.config.player_type,
                            season_type: self.config.season_type
                        });
                        //compatible
                        self.gray_html5_compatible();
                    }
                });
            } else {
                \$('#bofqi').html('<div class="player"><div id="bilibiliPlayer"></div></div><iframe style="display: none"></iframe><div id="player_placeholder"></div>');
                window.player = new bilibiliPlayer({
                    aid: self.config.aid,
                    cid: self.config.cid,
                    p: self.config.page,
                    autoplay: (self.config.autoplay == true),
                    as_wide: self.config.as_wide,
                    bnj: self.config.bnj
                });
                //compatible
                self.gray_html5_compatible();
            }
        }

        videoLoader.prototype.gray_html5_compatible = function () {
            var eventMaps = {
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
            var apiMaps = {
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
            var c_head, c_element;
            try {
                c_head = \$(window.parent.document.body);
                c_element = \$(window.parent.document.body).find('#player_placeholder');
            } catch (e) {
                c_head = \$('#bofqi');
                c_element = \$('#bofqi').find('#player_placeholder');
            }
            if (c_element.length === 0) {
                c_element = \$('<div id="player_placeholder" style="display: none;"></div>').appendTo(c_head);
            }
            c_element = c_element[0];

            for (var i in apiMaps) {
                (function (flashName, html5Name) {
                    c_element[flashName] = function () {
                        if (window.player && typeof window.player[html5Name] === 'function') {
                            return window.player[html5Name].apply(window.player, arguments);
                        }
                    }
                })(i, apiMaps[i]);
            }

            c_element.jwAddEventListener = function (type, callback) {
                try {
                    if (typeof callback !== 'function') {
                        callback = eval('(' + callback + ')');
                    }
                } catch (e) {
                    callback = function () { };
                }
                if (eventMaps[type]) {
                    window.player && window.player.addEventListener && window.player.addEventListener(eventMaps[type], callback);
                }
            };

            c_element.jwRemoveEventListener = function (type) {
                if (eventMaps[type]) {
                    window.player && window.player.removeEventListener && window.player.removeEventListener(eventMaps[type]);
                }
            }

            try {
                window.parent.player = window.player;
            } catch (e) { }

        };

        videoLoader.prototype.gray_flash_compatible = function () {
            var self = this;
            var eventMaps = {
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
            var apiMaps = {
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
            var c_head, c_element;
            try {
                c_head = \$(window.parent.document.body);
                c_element = \$(window.parent.document.body).find('#player_placeholder');
            } catch (e) {
                return false;
            }
            if (c_element.length === 0) {
                c_element = \$('<div id="player_placeholder" style="display: none;"></div>').appendTo(c_head);
            }
            c_element = c_element[0];

            for (var i in apiMaps) {
                (function (flashName, html5Name) {
                    c_element[flashName] = function () {
                        try {
                            \$('#player_placeholder')[0][flashName].apply(this, arguments);
                        } catch (e) {
                            console.log(e);
                        }
                    };
                })(i, apiMaps[i]);
            }

            c_element.jwAddEventListener = function () {
                try {
                    \$('#player_placeholder')[0]['jwAddEventListener'].apply(this, arguments);
                } catch (e) {
                    console.log(e);
                }
            }
            c_element.jwRemoveEventListener = function () {
                try {
                    \$('#player_placeholder')[0]['jwRemoveEventListener'].apply(this, arguments);
                } catch (e) {
                    console.log(e);
                }
            }

            // 统一的播放器对外方法
            window.player = {};

            var eventMaps = {
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
            var apiMaps = {
                'reloadAccess': 'mukio_reloadAccess',
                'play': 'jwPlay',
                'pause': 'jwPause',
                'stop': 'jwStop',
                'seek': 'jwSeek',
                'prev': 'jwPlaylistPrev',
                'next': 'jwPlaylistNext',
                'getBufferRate': 'jwGetBuffer',
                'getDuration': 'jwGetDuration',
                'isFullScreen': 'jwGetFullscreen',
                'getWidth': 'jwGetWidth',
                'getHeight': 'jwGetHeight',
                'isMute': 'jwGetMute',
                'setMute': 'jwSetMute',
                'getPlaylist': 'jwGetPlaylist',
                'getPlaylistIndex': 'jwGetPlaylistIndex',
                'getCurrentTime': 'jwGetPosition',
                'getState': 'jwGetState',
                'getVersion': 'jwGetVersion',
                'volume': 'jwGetVolume|jwSetVolume' // special
            };

            for (var i in apiMaps) {
                (function (html5Name, flashName) {
                    window.player[html5Name] = function () {
                        var flashBox = document.getElementById('player_placeholder');
                        if (flashBox) {
                            if (typeof flashBox[flashName] === 'function') {
                                return flashBox[flashName].apply(flashBox, arguments);
                            } else if (html5Name === 'volume' && typeof flashBox['volume'] === 'function') {
                                if (arguments.length === 0) {
                                    return flashBox['jwGetVolume'].apply(flashBox, arguments);
                                } else {
                                    return flashBox['jwSetVolume'].apply(flashBox, arguments);
                                }
                            }
                        }
                    }
                })(i, apiMaps[i]);
            }

            window.player['addEventListener'] = function (type, callback) {
                try {
                    if (typeof callback !== 'function') {
                        callback = eval('(' + callback + ')');
                    }
                } catch (e) {
                    callback = function () { };
                }

                if (eventMaps[type]) {
                    self.flashAddEvents.push([type, callback]);
                }
            };

            window.player['removeEventListener'] = function (type) {
                if (eventMaps[type]) {
                    for (var i = self.flashAddEvents.length - 1; i > 0; i--) {
                        if (self.flashAddEvents[i][0] == type) {
                            self.flashAddEvents.splice(i, 1);
                        }
                    }
                }
            }

            try {
                window.parent.player = window.player;
            } catch (e) { }
        };

        videoLoader.prototype.loadFlashTimer = function () {
            var eventMaps = {
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
            var stime = +new Date();
            var self = this;
            var ftimer = setInterval(function () {
                if (+new Date() - stime > 10000) {
                    clearTimeout(ftimer);
                }
                var flashBox = document.getElementById('player_placeholder'),
                    func;
                if (flashBox && flashBox.jwAddEventListener) {
                    flashBox.jwAddEventListener('jwplayerMediaBuffer', 'function(){loader.callFunction("video_media_buffer")}');
                    flashBox.jwAddEventListener('jwplayerMediaBufferFull', 'function(){loader.callFunction("video_media_buffer_full")}');
                    flashBox.jwAddEventListener('jwplayerMediaComplete', 'function(){loader.callFunction("video_media_ended")}');
                    flashBox.jwAddEventListener('jwplayerMediaError', 'function(){loader.callFunction("video_media_error")}');
                    flashBox.jwAddEventListener('jwplayerMediaLoaded', 'function(){loader.callFunction("video_media_loaded")}');
                    flashBox.jwAddEventListener('jwplayerMediaMute', 'function(){loader.callFunction("video_media_mute")}');
                    flashBox.jwAddEventListener('jwplayerMediaSeek', 'function(){loader.callFunction("video_media_seek")}');
                    flashBox.jwAddEventListener('jwplayerMediaTime', 'function(){loader.callFunction("video_media_time")}');
                    flashBox.jwAddEventListener('jwplayerMediaVolume', 'function(){loader.callFunction("video_media_volume")}');
                    clearTimeout(ftimer);
                }
            }, 1);
        };

        videoLoader.prototype.callFunction = function (type) {
            var eventMaps = {
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
        };

        videoLoader.prototype.loadFlashPlayer = function () {
            var self = this;
            this.flashAddEvents = [];
            this.videoType = 'flash';
            ChatSaveSettings("defaulth5", 0);
            self.config.player.html('<object type="application/x-shockwave-flash" class="player" data="//static.hdslb.com/play.swf" id="player_placeholder" style="visibility: visible;">'
                + '<param name="allowfullscreeninteractive" value="true"><param name="allowfullscreen" value="true"><param name="quality" value="high">'
                + '<param name="allowscriptaccess" value="always"><param name="wmode" value="' + (__GetUrlValue('wmode') || 'direct') + '">'
                + '<param name="flashvars" value="cid=' + self.config.cid + '&aid=' + self.config.aid + '&as_wide=' + (self.config.as_wide ? 1 : 0) + (self.config.autoplay ? '&autoplay=1' : '') + '">'
                + '<param name="movie" value="//static.hdslb.com/play.swf"/>'
                + '</object>');
            self.gray_flash_compatible();
            self.loadFlashTimer();
        };

        videoLoader.prototype.loadFlashLivePlayer = function () {
            this.config.player.html('<object type="application/x-shockwave-flash" data="//static.hdslb.com/live-static/swf/LivePlayerEx_1.swf" width="100%" height="100%" id="player_object" style="visibility: visible;">'
                + '<param name="allowfullscreeninteractive" value="true"><param name="allowfullscreen" value="true"><param name="quality" value="high">'
                + '<param name="allowscriptaccess" value="always"><param name="wmode" value="transparent"><param name="autostart" value="0">'
                + '<param name="flashvars" value="onready=playerOnReady&autostart=0&room_id=' + this.config.roomid + '&cid=' + this.config.roomid + '&cover=//i2.hdslb.com/u_user/activities/201507chinajoy/images/cover_reverse.png&state=LIVE">'
                + '</object>');
        }

        videoLoader.prototype.loadHtml5LivePlayer = function () {
            var self = this;
            var source = {
                'image': "//i2.hdslb.com/u_user/activities/201507chinajoy/images/cover_reverse.png"
            };
            \$.ajax({
                url: "//live.bilibili.com/api/h5playurl?roomid=" + self.config.roomid,
                dataType: "jsonp",
                success: function (result) {
                    if (result && result.durl && result.durl[0]) {
                        source.comment = (location.protocol === 'https:' ? "wss:" : "ws:") + "//livecmt.bilibili.com:88/" + self.config.roomid;
                        source.video_url = result.durl[0].url;
                    }
                    self.h5player.create({
                        "live": true,
                        "autoplay": self.config.autoplay,
                        "on_state_change": function (a, b) {
                            self.loadHtml5Callback(a, b);
                        },
                        "get_from_local": true,
                        "comment": source.comment,
                        "image": source.image,
                        "video_url": source.video_url
                    });
                },
                error: function () { }
            });
        };

        videoLoader.prototype.loadHtml5Callback = function (now_status, origin_status) {
            var self = this;
            if (now_status == 1 && origin_status == 0 && self.config.sendbar) {
                self.config.sendbar = false;
                \$('#bofqi').after('<div id="dm_send_bar"><input type="text" id="dm_send_input" maxlength="200" placeholder="点击此处开始吐槽！" value="" /><button id="dm_send_btn">发送</button></div>');
                \$("#bofqi").height(\$(window).height() - \$("#dm_send_bar").height());
                \$(window).resize(function () {
                    \$("#bofqi").height(\$(window).height() - \$("#dm_send_bar").height());
                });
                \$("#dm_send_bar").addClass('float').appendTo('.display');
                var send_btn = \$("#dm_send_btn");
                var send_input = \$("#dm_send_input");
                send_btn.removeClass("disabled");
                send_input.removeAttr("disabled");

                send_btn.bind('click', function () {
                    if (send_btn.hasClass("disabled") || \$.trim(send_input.val()) == "") {
                        return false;
                    } else {
                        send_input.attr("disabled");
                        send_btn.addClass("disabled");
                        var sendTimeout = setTimeout(function () {
                            send_input.val("");
                            send_btn.removeClass("disabled");
                            send_input.removeAttr("disabled");
                        }, 3000);
                    }
                    splayer.sendComment({
                        "msg": \$.trim(send_input.val()),
                        "color": 0xffffff
                    }, function (data) {
                        clearTimeout(sendTimeout);
                        send_input.val("");
                        send_input.removeAttr("disabled");
                        send_btn.removeClass("disabled");
                    }, function (data) {
                        clearTimeout(sendTimeout);
                        send_input.val("");
                        send_input.removeAttr("disabled");
                        send_btn.removeClass("disabled");
                    }
                    );
                });
            }
        };

        videoLoader.prototype.loadExtraMenuConfig = function (type) {
            var v = null;
            var exconfig = [];
            if (type === 'flash' || type === 'flash_gray') {
                if (this.gray_html5) {
                    exconfig.push({ label: "HTML5播放器", id: "change_h5" });
                    exconfig.push({ label: "Flash播放器", id: "change_flash", active: true });
                }
            } else {
                exconfig.push({ label: "HTML5播放器", id: "change_h5", active: true });
                exconfig.push({ label: "Flash播放器", id: "change_flash" });
            }
            v = '20161115';
            return { 'ver': v, 'menuItems': exconfig };
        };

        videoLoader.prototype.clickMenu = function (id) {
            // console.debug('click event: ' + id);
            var self = this;
            setTimeout(function () {
                if (id === 'change_h5') {
                    self.search_new_cid(function () {
                        self.loadHtml5Player();
                    });
                } else if (id === 'change_flash') {
                    self.search_new_cid(function () {
                        window.player && window.player.destroy && window.player.destroy();
                        self.loadFlashPlayer();
                    });
                }
            }, 0);

            return true;
        };

        videoLoader.prototype.search_new_cid = function (callback) {
            if (typeof callback === 'function') {
                callback();
            }
            // var self = this;
            // if(this.videoType == 'html5') {
            //     this.config['page'] = player.getPlaylistIndex() + 1;
            // }
            // \$.ajax({
            //     url: '//www.bilibili.com/widget/getPageList?aid=' + this.config['aid'],
            //     cache: true,
            //     type: 'get',
            //     xhrFields: {
            //         withCredentials: true
            //     },
            //     dataType: 'json',
            //     success: function(data) {
            //         if(data) {
            //             for(var i in data) {
            //                 if(data[i]['page'] == self.config['page']) {
            //                     self.config['cid'] = data[i]['cid'];
            //                 }
            //             }
            //         }
            //         callback();
            //     },
            //     error: function() {
            //         callback();
            //     }
            // });
        };

        if (allow) {
            var loader = new videoLoader();
        }

        window.callNextPart = function () {
            try {
                loader.config['page']++;
                if (typeof window.parent.callNextPart === 'function') {
                    window.parent.callNextPart.apply(this, arguments);
                }
            } catch (e) {
            }
        };

        window.PlayerSetOnline = function () {
            try {
                if (typeof window.parent.PlayerSetOnline === 'function') {
                    window.parent.PlayerSetOnline.apply(this, arguments);
                }
            } catch (e) {
            }
        };

        window.showHideVideo = function () {
            try {
                if (typeof window.parent.showHideVideo === 'function') {
                    window.parent.showHideVideo.apply(this, arguments);
                }
            } catch (e) {
            }
        };

        window.heimu = function () {
            try {
                if (typeof window.parent.heimu === 'function') {
                    window.parent.heimu.apply(this, arguments);
                }
            } catch (e) {
            }
        };

        window.UserStatus = {
            quickLogin: function () {
                try {
                    if (window.parent.UserStatus && typeof window.parent.UserStatus.quickLogin === 'function') {
                        window.parent.UserStatus.quickLogin.apply(this, arguments);
                    } else if (window.parent.biliQuickLogin) {
                        window.parent.biliQuickLogin.apply(this, arguments);
                    }
                } catch (e) {
                }
            }
        };

        window.player_fullwin = function () {
            try {
                if (typeof window.parent.player_fullwin === 'function') {
                    window.parent.player_fullwin.apply(this, arguments);
                }
            } catch (e) {
            }
        };

        window.callAppointPart = function () {
            try {
                if (typeof window.parent.callAppointPart === 'function') {
                    window.parent.callAppointPart.apply(this, arguments);
                }
            } catch (e) {
            }
        };

        window.playerCallSendCoin = function () {
            try {
                if (typeof window.parent.playerCallSendCoin === 'function') {
                    window.parent.playerCallSendCoin.apply(this, arguments);
                }
            } catch (e) {
            }
        };

        try {
            window.GrayManager = {
                loadExtraMenuConfig: function (type) {
                    return loader.loadExtraMenuConfig(type);
                },
                clickMenu: function (id) {
                    return loader.clickMenu(id);
                }
            };
            window.parent.GrayManager = window.GrayManager;
            \$(window.parent.document).find('iframe#bofqi_embed').addClass('bilibiliHtml5Player');
            var h = \$(window.parent.document).find('head');
            if (!h.find('style.bilibiliHtml5PlayerClass').length) {
                \$('<style class="bilibiliHtml5PlayerClass">.player-fullscreen-fix {position: fixed;top: 0;left: 0;margin: 0;padding: 0;width: 100%;height: 100%;}'
                    + '.player-fullscreen-fix iframe#bofqi_embed {position: fixed!important;border-radius: 0;z-index: 100000!important;left: 0;top: 0;width: 100%!important;height: 100%!important;}</style>').appendTo(h);
            }
        } catch (e) {

        }

        \$(window).on('unload', function () {
            try {
                player && player.destroy();
            } catch (e) {

            }
        });
    </script>
</body>

</html>`;
    modules["playlist-detail.html"] = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="renderer" content="webkit" />
    <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
    <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" />
    <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
    <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
    <link rel="preload"
        href="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/manifest.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js"
        as="script" />
    <link rel="preload"
        href="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/vendor.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js"
        as="script" />
    <link rel="preload"
        href="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/playlist_detail.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js"
        as="script" />
    <link rel="preload"
        href="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/css/playlist_detail.1.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.css"
        as="style" />
    <link rel="stylesheet"
        href="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/css/playlist_detail.1.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.css" />
</head>

<body>
    <div id="playlist-detail-app"></div>
    <div id="app" data-server-rendered="true" class="pl-app"></div>
    <script src="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/manifest.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js"
        defer="defer"></script>
    <script src="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/vendor.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js"
        defer="defer"></script>
    <script
        src="//s1.hdslb.com/bfs/static/jinkela/playlist-detail/playlist_detail.dc2f20722afb93b15bbf7a30436f70ff31fb0a05.js"
        defer="defer"></script>
    <div class="footer bili-footer report-wrap-module"></div>
    <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script>
    <script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
</body>

</html>`;
    modules["playlist.html"] = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <title>哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="renderer" content="webkit" />
  <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
  <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
  <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" />
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="renderer" content="webkit" />
  <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
  <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
  <link
    href="//s1.hdslb.com/bfs/static/jinkela/playlist-video/css/playlist_video.0.87292febba67b03f65d05c15d03e325d9db4f56a.css"
    rel="stylesheet" />
  <script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"></script>
</head>

<body>
  <div id="playlist-video-app"></div>
  <div class="footer bili-footer report-wrap-module"></div>
  <script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script>
  <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
  <script type="text/javascript"
    src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/1.playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"></script>
  <script type="text/javascript"
    src="//s1.hdslb.com/bfs/static/jinkela/playlist-video/playlist_video.87292febba67b03f65d05c15d03e325d9db4f56a.js"></script>
</body>

</html>`;
    modules["ranking.html"] = `<!DOCTYPE html>
<html lang="zh-Hans" xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-Hans">

<head>
  <title>热门视频排行榜 - 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili</title>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="renderer" content="webkit" />
  <meta name="description" content="bilibili是国内知名的视频弹幕网站，这里有最及时的动漫新番，最棒的ACG氛围，最有创意的Up主。大家可以在这里找到许多欢乐。" />
  <meta name="keywords" content="B站,弹幕,字幕,AMV,MAD,MTV,ANIME,动漫,动漫音乐,游戏,游戏解说,ACG,galgame,动画,番组,新番,初音,洛天依,vocaloid" />
  <link rel="stylesheet"
    href="//s1.hdslb.com/bfs/static/jinkela/rank/css/rank.0.ba58f8684a87651e0e1c576df8f918bfa10c1a90.css" />
  <script type="text/javascript" src="//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js"></script>
</head>

<body>
  <div class="z-top-container has-menu"></div>
  <div id="rank-app"></div>
  <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js" defer="defer"></script>
  <script type="text/javascript" src="//s1.hdslb.com/bfs/cm/st/bundle.js" crossorigin=""></script>
  <div id="app" data-server-rendered="true"></div>
  <script src="//s1.hdslb.com/bfs/static/jinkela/rank/1.rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js"
    defer="defer"></script>
  <script src="//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js"
    defer="defer"></script>
  <div class="footer bili-footer report-wrap-module"></div>
  <script type="text/javascript" src="//static.hdslb.com/common/js/footer.js" defer="defer"></script>
</body>

</html>`;
    modules["read.html"] = `<!DOCTYPE html>
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
    <link href="//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.css"
        rel="stylesheet" />
</head>

<body>
    <div class="z-top-container report-wrap-module"></div>
    <div class="page-container"></div>
    <div class="footer bili-footer report-wrap-module" id="home_footer"></div>
    <script src="//static.hdslb.com/public/intersection-observer.js"></script>
    <script src="//static.hdslb.com/public/timing.min.js"></script>
    <script>
        window.performanceLog.setSource('article');
        window.reportMsgObj = {};
    </script>
    <script src="//static.hdslb.com/js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
    <script type="text/javascript" charset="utf-8" src="//static.hdslb.com/common/js/footer.js"></script>
    <link rel="stylesheet" type="text/css" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" />
    <script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
    <script src="//s1.hdslb.com/bfs/static/biliapp/biliapp.js"></script>
    <script type="text/javascript"
        src="//s1.hdslb.com/bfs/static/jinkela/article/manifest.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"></script>
    <script type="text/javascript"
        src="//s1.hdslb.com/bfs/static/jinkela/article/vendor.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"></script>
    <script type="text/javascript"
        src="//s1.hdslb.com/bfs/static/jinkela/article/pcDetail.e5d43b1ea4f5a12408d8cd222049b34cfacd107c.js"></script>
</body>

</html>`;
    modules["watchlater.html"] = `<!DOCTYPE html>
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
  <link rel="stylesheet" href="//static.hdslb.com/phoenix/dist/css/comment.min.css" type="text/css" />
  <link rel="stylesheet" href="//static.hdslb.com/elec_2/dist/css/later_elec.css" type="text/css" />
  <link rel="stylesheet" href="//static.hdslb.com/tag/css/tag-index2.0.css" type="text/css" />
  <link href="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/css/main.d9641d2f4dc42228ea8c2650e1b98b0b.css"
    rel="stylesheet" />
  <script type="text/javascript" src="//static.hdslb.com/js/jquery.min.js"></script>
</head>

<body>
  <div class="z-top-container has-menu"></div>
  <div id="viewlater-app">
    <app></app>
  </div>
  <div class="footer bili-footer"></div>
  <script type="text/javascript" src="//static.hdslb.com/js/jquery.qrcode.min.js"></script>
  <script type="text/javascript" src="//s1.hdslb.com/bfs/seed/jinkela/header/header.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/common/js/footer.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/js/swfobject.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/js/video.min.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/account/bili_quick_login.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/phoenix/dist/js/comment.min.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/moxie.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/mstation/js/upload/plupload.js"></script>
  <script type="text/javascript" src="//static.hdslb.com/elec_2/dist/js/later_elec.js"></script>
  <script type="text/javascript"
    src="//s1.hdslb.com/bfs/static/phoenix/viewlater/static/js/main.2111469a1bbc20e2e885.js"></script>
</body>

</html>`;
    modules["apply.json"] = {
    "timeFormat": "format.js",
    "sizeFormat": "format.js",
    "unitFormat": "format.js",
    "bubbleSort": "format.js",
    "randomArray": "format.js",
    "objUrl": "format.js",
    "urlObj": "format.js",
    "addCss": "extend.js",
    "addElement": "extend.js",
    "localModule": "manage.js",
    "readFile": "manage.js",
    "getCookies": "extend.js",
    "loginExit": "extend.js",
    "jsonCheck": "extend.js",
    "restorePlayerSetting": "extend.js",
    "biliQuickLogin": "extend.js",
    "getTotalTop": "extend.js",
    "abv": "abv.js",
    "jsonphook": "Node.js",
    "removeJsonphook": "jsonp.js",
    "scriptIntercept": "Node.js",
    "xhrhook": "open.js",
    "removeXhrhook": "open.js",
    "getSegDanmaku": "danmaku.js",
    "specialEffects": "danmaku.js",
    "sortDmById": "danmaku.js",
    "toXml": "danmaku.js",
    "getHistoryDanmaku": "danmaku.js",
    "loadLocalDm": "danmaku.js",
    "segDmDecode": "danmaku.js",
    "danmakuFormat": "danmaku.js",
    "onlineDanmaku": "danmaku.js",
    "loadCommandDm": "commandDm.js",
    "urlInputCheck": "urlInputCheck.js",
    "midcrc": "crc32.js",
    "crc32": "crc32.js",
    "md5": "md5.js",
    "RebuildPlayerurl": "rebuildPlayerurl.js",
    "urlsign": "sign.js",
    "observerAddedNodes": "nodeObserver.js",
    "removeObserver": "nodeObserver.js",
    "switchVideo": "switchVideo.js",
    "closedCaption": "closedCaption.js",
    "segProgress": "segProgress.js",
    "localMedia": "localMedia.js",
    "allDanmaku": "allDanmaku.js",
    "bezier": "cubicBezier",
    "element": "element.js",
    "getCss": "element.js",
    "saveAs": "extend.js",
    "readAs": "extend.js",
    "Base64": "Base64.js",
    "getAidInfo": "extend.js",
    "downloadThis": "download.js",
    "getJson": "url.js",
    "aria2": "aria2.js",
    "ef2": "ef2.js",
    "getUrlValue": "extend.js",
    "showAccesskey": "accesskey.js",
    "strSize": "extend.js",
    "intervalFormat": "extend.js",
    "runWhile": "extend.js",
    "bofqiMessage": "extend.js",
    "alertMessage": "extend.js"
};
    modules["bug.json"] = [
    "__PGC_USERSTATE__",
    "__BILI_CONFIG__",
    "__mobxGlobals",
    "__mobxInstanceCount",
    "_babelPolyfill",
    "BilibiliPlayer",
    "BiliJsBridge",
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
    "webpackJsonpwebpackLogReporter",
    "webpackLogReporter"
];
    modules["protobuf.json"] = {
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
};
    modules["videoSort.json"] = {
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
};
    modules["aria2.js"] = `/**
 * 本模块负责与aria2通信并构造下载数据
 */
(function () {
    try {
        class Aria2 {
            constructor() {
                this.setting = {};
                config.useragent && (this.setting.userAgent = config.useragent);
                config.referer && (this.setting.referer = config.referer);
                config.filepath && (this.setting.directory = config.filepath);
                config.rpcToken && (this.setting.token = config.rpcToken);
            }
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
            postMessage(method, id, params = []) {
                const url = \`\${config.rpcServer}:\${config.rpcPort}/jsonrpc\`;
                config.rpcToken && params.unshift(\`token:\${config.rpcToken}\`);
                return new Promise((r, j) => {
                    xhr({
                        url: url,
                        method: "POST",
                        responseType: "json",
                        data: JSON.stringify({ method, id, params })
                    }).then(d => {
                        d.error && j(d.error);
                        d.result && r(d.result);
                    }).catch(e => {
                        xhr({
                            url: API.objUrl(url, { method, id, params: API.Base64.encode(JSON.stringify(params)) }),
                            method: "GET",
                            responseType: "json"
                        }).then(d => {
                            d.error && j(d.error);
                            d.result && r(d.result);
                        }).catch(() => j(e));
                    });
                });
            }
            getVersion() {
                return this.postMessage("aria2.getVersion", new Date().getTime());
            }
        }
        API.aria2 = {
            shell: (obj) => new Aria2().shell(obj),
            rpcTest: () => new Aria2().getVersion(),
            rpc: (obj) => new Aria2().rpc(obj)
        };
    }
    catch (e) {
        toast.error("aria2.js", e);
    }
})();
`;
    modules["contentMenu.js"] = `/**
 * 添加下载右键菜单
 */
(function () {
    API.switchVideo(() => {
        var _a, _b;
        try {
            const li = document.createElement("li");
            li.innerHTML = '<a id="BLOD-dl-content" class="context-menu-a js-action" href="javascript:void(0);">下载视频</a>';
            li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onmouseover = () => li.setAttribute("class", "context-line context-menu-function bili-old-download hover");
            li.onmouseout = () => li.setAttribute("class", "context-line context-menu-function bili-old-download");
            li.onclick = () => API.downloadThis();
            let flag = 0;
            (_a = document.querySelector("#bilibiliPlayer")) === null || _a === void 0 ? void 0 : _a.addEventListener("DOMNodeInserted", e => {
                if (!flag && e.target.className && /context-line context-menu-function/.test(e.target.className)) {
                    const node = document.querySelector(".bilibili-player-context-menu-container.black");
                    flag = setTimeout(() => {
                        if (node.querySelector(".context-menu-danmaku"))
                            return;
                        if (node.contains(li))
                            return;
                        node.firstChild.appendChild(li);
                    }, 100);
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
            toast.error("dlContentMenu.js", e);
        }
    });
})();
`;
    modules["download.js"] = `/**
 * 本模块负责下载功能，主要是视频下载功能
 */
(function () {
    try {
        class Download {
            constructor() {
                /**
                 * 已获取类型列表
                 */
                this.type = [];
                /**
                 * 整理出的链接列表
                 */
                this.links = [];
                /**
                 * url序号对应的质量信息
                 * 暂缺杜比视界/杜比全景声部分
                 */
                this.quality = {
                    30280: "320Kbps",
                    30250: "ATMOS",
                    30232: "128Kbps",
                    30216: "64Kbps",
                    30126: "Dolby",
                    30125: "HDR",
                    30121: "4K",
                    30120: "4K",
                    30116: '1080P60',
                    30112: '1080P+',
                    30106: '1080P+',
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
                    208: "1080P",
                    192: "720P",
                    160: "480P",
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
                /**
                 * 颜色表
                 */
                this.color = {
                    "Dolby": "background-color: #ffe42b;background-image: linear-gradient(to right, #ffe42b, #dfb200);",
                    "ATMOS": "background-color: #ffe42b;background-image: linear-gradient(to right, #ffe42b, #dfb200);",
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
                    "avc": "background-color: #07e;",
                    "hev": "background-color: #7ba;",
                    "aac": "background-color: #07e;",
                    "flv": "background-color: #0dd;",
                    "320Kbps": "background-color: #f00;background-image: linear-gradient(to right, #f00, #c00);",
                    "128Kbps": "background-color: #f90;background-image: linear-gradient(to right, #f90, #d70);",
                    "64Kbps": "background-color: #0d0;"
                };
                // 切P后清除下载数据并移除下载面板
                API.switchVideo(() => { this.type = []; this.links = []; this.table && this.table.remove(); });
            }
            /**
             * 整理playurl返回值并提取其中的媒体链接记录到links
             * @param playinfo ajax返回的JSON数据
             */
            decodePlayinfo(playinfo) {
                playinfo.data && this.decodePlayinfo(playinfo.data);
                playinfo.result && this.decodePlayinfo(playinfo.result);
                playinfo.durl && this.durl(playinfo.durl);
                playinfo.dash && this.dash(playinfo.dash);
            }
            /**
             * 根据url确定画质/音质信息
             * 需要维护quality表
             * @param url 多媒体url
             * @returns 画质/音质信息
             */
            getQuality(url) {
                return this.quality[url.match(/[0-9]+\\.((flv)|(mp4)|(m4s))/)[0].split(".")[0]] || "N/A";
            }
            /**
             * 整理dash部分
             * @param dash dash信息
             */
            dash(dash) {
                dash.video && this.dashVideo(dash.video, dash.duration);
                dash.audio && this.dashAudio(dash.audio, dash.duration);
                dash.dolby && dash.dolby.audio && Array.isArray(dash.dolby.audio) && this.dashATMOS(dash.dolby.audio, dash.duration);
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
                    switch (d.codecs.includes("avc")) {
                        case true:
                            type = "avc";
                            break;
                        case false:
                            type = "hev";
                            break;
                    }
                    !this.type.includes("dash") && this.type.push("dash");
                    this.links.push({
                        type: type,
                        url: url,
                        quality: this.getQuality(url),
                        size: API.sizeFormat(d.bandwidth * duration / 8),
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
                        quality: this.getQuality(url),
                        size: API.sizeFormat(d.bandwidth * duration / 8),
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
                        quality: this.getQuality(url),
                        size: API.sizeFormat(d.bandwidth * duration / 8),
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
                        quality: this.getQuality(d.url),
                        size: API.sizeFormat(d.size),
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
                        API.__playinfo__ && this.decodePlayinfo(API.__playinfo__);
                        const result = await Promise.all(config.downloadList.reduce((s, d) => {
                            !this.type.includes(d) && s.push(this.getContent(d));
                            return s;
                        }, []));
                        result.forEach(d => d && this.decodePlayinfo(d));
                        await this.getOther();
                    }
                    const title = this.getTitle();
                    this.links.forEach(d => {
                        !d.filename && (d.filename = title);
                    });
                    this.showTable();
                }
            }
            async getOther() {
                var _a;
                if (!config.ifDlDmCC)
                    return;
                if (API.danmaku) {
                    const url = config.dlDmType == "json" ? JSON.stringify(API.danmaku, undefined, "\\t") : API.toXml(API.danmaku);
                    this.links.push({
                        url: url,
                        type: "其他",
                        quality: "弹幕",
                        size: API.sizeFormat(API.strSize(url)),
                        filename: \`\${this.getTitle()}-\${API.cid}.\${config.dlDmType}\`
                    });
                }
                if (API.subtitle) {
                    API.subtitle.forEach(d => {
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
                                await API.getJson("api.bilibili.com/pgc/player/web/playurl", { avid: API.aid, cid: API.cid, fnver: 0, fnval: 976 }, true) :
                                await API.getJson("api.bilibili.com/x/player/playurl", { avid: API.aid, cid: API.cid, fnver: 0, fnval: 976 }, true);
                            break;
                        case "flv":
                            result = API.pgc ?
                                await API.getJson("api.bilibili.com/pgc/player/web/playurl", { avid: API.aid, cid: API.cid }, true) :
                                await API.getJson("api.bilibili.com/x/player/playurl", { avid: API.aid, cid: API.cid }, true);
                            break;
                        case "mp4":
                            result = API.pgc ?
                                await API.getJson("api.bilibili.com/pgc/player/api/playurlproj", { cid: API.cid }) :
                                await API.getJson("app.bilibili.com/v2/playurlproj", { cid: API.cid });
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
                    return toast.warning("未获取到任何下载数据！");
                this.table && this.table.remove();
                this.table = API.addElement("div");
                const real = this.table.attachShadow({ mode: "closed" });
                const root = API.addElement("div", { class: "table" }, real);
                const cells = {};
                API.element.clickRemove(this.table);
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
                            API.saveAs(d.url, d.filename || \`download \${API.timeFormat(undefined, true)}.txt\`, d.contentType || "text/plain");
                    });
                });
            }
            postData(data) {
                !Reflect.has(data, "_name") && (data.filename = this.setFinalName(data));
                switch (config.downloadMethod) {
                    case "ef2":
                        API.ef2({ url: data.url, out: data.filename });
                        break;
                    case "aria2":
                        API.aria2.shell({ urls: [data.url], out: data.filename })
                            .then(() => toast.success(\`已复制aria2命令行到剪切板，在cmd等shell中使用即可下载~\`))
                            .catch(e => toast.error(\`复制aria2命令行失败！\`, e));
                        break;
                    case "aira2 RPC":
                        API.aria2.rpc({ urls: [data.url], out: data.filename })
                            .then(GID => toast.success(\`已添加下载任务到aria2 RPC主机，任务GID：\${GID}\`))
                            .catch(e => toast.error(\`添加下载任务到aria2 RPC主机出错！\`, e));
                        break;
                    default: this.rightKey(data);
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
                const root = API.element.popupbox({ width: "300px" });
                API.addElement("div", { style: "text-align: center;font-weight: bold;padding-block-end: 10px;" }, root, data.filename);
                API.addElement("div", { style: "padding-block-end: 10px;" }, root, \`<a href=\${data.url} target="_blank" download="\${data.filename}">请在此处右键“另存为”以保存文件，IDM的话也可以右键“使用 IDM下载链接”。</a>\`);
                API.addElement("div", { style: "font-size: 10px; padding-block-end: 10px;" }, root, '本方式下载不太稳定，不嫌麻烦的话可在设置中更换下载方式。');
            }
        }
        const download = new Download();
        API.downloadThis = () => download.contentMenu();
    }
    catch (e) {
        toast.error(e, "download.js");
    }
})();
`;
    modules["ef2.js"] = `/**
 * 本模块负责使用ef2自定义协议调用IDM进行下载
 * 使用本下载方式需要先安装IDM{@see Internet Download Manager (IDM) {@link http://www.internetdownloadmanager.com/}}
 * 然后安装ef2工具{@see ef2 {@link https://github.com/MotooriKashin/ef2/releases/latest}}
 */
(function () {
    class Ef2 {
        constructor() {
            this.setting = {};
            config.useragent && (this.setting.userAgent = config.useragent);
            config.referer && (this.setting.referer = config.referer);
            config.filepath && (this.setting.directory = config.filepath);
            config.IDMLater && (this.setting.sendToList = config.IDMLater);
            config.IDMToast && (this.setting.toastDisabled = config.IDMToast);
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
            Object.keys(data).forEach((d) => {
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
    // @ts-ignore EF2同时作为对象和方法
    API.ef2 = (data) => new Ef2().sendLinkToIDM(data);
    API.ef2.encode = (data) => new Ef2().encode(data);
    API.ef2.decode = (ef2ptl) => new Ef2().decode(ef2ptl);
})();
`;
    modules["abv.js"] = `/**
 * 本模块负责负责提供av/BV互转函数
 * 感谢知乎mcfx的回答，在其python代码基础上翻译为JavaScript，源链接如下
 * @see mcfx {@link https://www.zhihu.com/question/381784377/answer/1099438784}
 * */
(function () {
    try {
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
        let abv = new Abv();
        API.abv = (input) => abv.check(input);
    }
    catch (e) {
        toast.error("abv.js", e);
    }
})();
`;
    modules["Base64.js"] = `/**
 * 本模块负责提供Base64<=>字符串的互转函数
 * 本模块核心代码直接来源如下
 * @see MDN Web Docs {@link https://developer.mozilla.org/en-US/docs/Glossary/Base64}
 */
(function () {
    try {
        class Base64 {
            static encode(str) {
                return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                    return String.fromCharCode(('0x' + p1));
                }));
            }
            static decode(str) {
                return decodeURIComponent(atob(str).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            }
        }
        API.Base64 = {
            encode: (str) => Base64.encode(str),
            decode: (str) => Base64.decode(str)
        };
    }
    catch (e) {
        toast.error("base64.js", e);
    }
})();
`;
    modules["crc32.js"] = `/**
 * 本模块提供CRC32散列算法及逆向工具，是将\`BiliBili_crc2mid\`修改为符合本项目模块规范的版本
 * 感谢\`MoePus\`提出的CRC32逆向算法，论坛原帖见
 * @see MoePus {@link https://moepus.oicp.net/2016/11/27/crccrack}
 * 感谢\`esterTion\`开源的该逆向算法的JavaScript版本，源项目信息如下
 * @see esterTion {@link https://github.com/esterTion/BiliBili_crc2mid}
 * @license GFUL
 */
(function () {
    try {
        class Midcrc {
            constructor() {
                this.CRCPOLYNOMIAL = 0xEDB88320;
                this.crctable = new Array(256);
                this.index = new Array(4);
                this.create_table();
                API.midcrc = input => this.run(input);
                API.crc32 = input => (((this.crc32(input) + 1) * -1) >>> 0).toString(16);
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
        new Midcrc();
    }
    catch (e) {
        toast.error("crc32.js", e);
    }
})();
`;
    modules["cubicBezier.js"] = `/**
 * 本模块提供贝塞尔曲线工具
 * 源码来自B站原生header.js工程，具体来源不明
 * 稍作修改以符合本项目需求
 */
(function () {
    try {
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
        API.bezier = function (mX1, mY1, mX2, mY2) {
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
        };
    }
    catch (e) {
        toast.error("cubicBezier.js", e);
    }
})();
`;
    modules["md5.js"] = `/**
 * 本模块提供md5加密工具，是将\`js-md5\`修改为符合本项目模块规范的版本
 * 本模块同时可作为普通js文件执行，该模式下将暴露方法对象到顶层变量\`window\`
 * 感谢开源项目\`js-md5\`，源项目信息如下
 * @see js-md5 {@link https://github.com/emn178/js-md5}
 * @license MIT
 */
(function () {
    try {
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
        API.md5 = createMethod();
    }
    catch (e) {
        toast.error("md5.js", e);
    }
})();
`;
    modules["sign.js"] = `/**
 * 本模块提供B站URL签名工具
 */
(function () {
    try {
        /**
         * appkey and salt
         * 注释后是带掩码版 appkey
         * 强烈建议还是专事专用
         */
        const keySecret = [
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
        class Sign {
            /**
             * 签名URL
             * @param url 原URL
             * @param obj 添加到URL上的查询参数对象，可选
             * @param id appkey在\`keySecret\`中的索引
             * @returns 签名后的URL
             */
            static sign(url, obj = {}, id = 0) {
                let table = {};
                this.keySecret = this.decode(id);
                obj = { ...API.urlObj(url), ...obj };
                url = url.split("#")[0].split("?")[0];
                delete obj.sign;
                obj.appkey = this.keySecret[0];
                Object.keys(obj).sort().map(key => { table[key] = obj[key]; });
                table.sign = id === 3 && table.api ? (API.md5(API.objUrl("", { api: decodeURIComponent(table.api) }) + this.keySecret[1])) : (API.md5(API.objUrl("", table) + this.keySecret[1]));
                return API.objUrl(url, table);
            }
            /**
             * 提取appkey和盐
             * @param id appkey在\`keySecret\`中的索引
             * @returns [appkey, sort]
             */
            static decode(id) {
                if (typeof id === "number") {
                    id = id < keySecret.length ? id : 0;
                    return keySecret[id].split("").reverse().reduce((s, d) => {
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
                return keySecret.reduce((s, d, i) => {
                    let keySecret = this.decode(i);
                    s[keySecret[0]] = keySecret[1];
                    return s;
                }, {});
            }
        }
        const urlsign = (url, obj = {}, id = 0) => Sign.sign(url, obj, id);
        urlsign.getKeyById = (id) => Sign.decode(id);
        urlsign.encode = (key, secret) => Sign.encode(key, secret);
        urlsign.list = () => Sign.list();
        API.urlsign = urlsign;
    }
    catch (e) {
        toast.error("sign.js", e);
    }
})();
`;
    modules["Node.js"] = `/**
 * 本模块负责实现原生脚本拦截模块
 * 这里指的原生脚本是那些非直接写入原生HTML，而是后续由JavaScript添加进DOM的脚本
 * 本模块导入优先级极高
 */
(function () {
    try {
        class NodeHook {
            constructor() {
                this.jsonphook = (url, callback) => NodeHook.jsonp.push([url, callback]);
                this.removeJsonphook = (id) => NodeHook.jsonp.splice(id - 1, 1);
                this.appendChild();
                this.insertBefore();
            }
            intercept(rule, replaceURL) {
                NodeHook.rules.push([rule, replaceURL]);
            }
            appendChild() {
                Node.prototype.appendChild = function (newChild) {
                    newChild.nodeName == 'SCRIPT' && newChild.src && (NodeHook.rules.forEach(d => {
                        d[0].every(d => newChild.src.includes(d)) && (d[1] ?
                            (newChild.src = d[1]) :
                            newChild.removeAttribute("src"));
                    }), NodeHook.jsonp.forEach(d => {
                        d[0].every(d => newChild.src.includes(d)) && d[1](new Proxy(new Object(), {
                            set: (t, p, v) => {
                                p == "url" && (newChild.src = v);
                                return true;
                            },
                            get: (t, p) => {
                                return p == "url" ? newChild.src : undefined;
                            }
                        }));
                    }));
                    return NodeHook.appendChild.call(this, newChild);
                };
            }
            insertBefore() {
                Node.prototype.insertBefore = function (newChild, refChild) {
                    newChild.nodeName == 'SCRIPT' && newChild.src && (NodeHook.rules.forEach(d => {
                        d[0].every(d => newChild.src.includes(d)) && (d[1] ?
                            (newChild.src = d[1]) :
                            newChild.removeAttribute("src"));
                    }), NodeHook.jsonp.forEach(d => {
                        d[0].every(d => newChild.src.includes(d)) && d[1](new Proxy(new Object(), {
                            set: (t, p, v) => {
                                p == "url" && (newChild.src = v);
                                return true;
                            },
                            get: (t, p) => {
                                return p == "url" ? newChild.src : undefined;
                            }
                        }));
                    }));
                    return NodeHook.insertBefore.call(this, newChild, refChild);
                };
            }
        }
        NodeHook.appendChild = Node.prototype.appendChild;
        NodeHook.insertBefore = Node.prototype.insertBefore;
        NodeHook.rules = [];
        NodeHook.jsonp = [];
        const nodeHook = new NodeHook();
        API.scriptIntercept = (rule, replaceURL) => nodeHook.intercept(rule, replaceURL);
        API.jsonphook = (url, callback) => nodeHook.jsonphook(url, callback);
        API.removeJsonphook = (id) => nodeHook.removeJsonphook(id);
    }
    catch (e) {
        toast.error("Node.js", e);
    }
})();
`;
    modules["open.js"] = `/**
 * 本模块负责提供\`XMLHttpRequest\`的hook工具
 * 拦截\`open\`参数组并传入\`XMLHttpRequest\`对象本身给回调函数
 */
(function () {
    try {
        const rules = [];
        const open = XMLHttpRequest.prototype.open;
        API.xhrhook = (url, callback) => rules.push([url, callback]);
        API.removeXhrhook = (id) => rules.splice(id - 1, 1);
        XMLHttpRequest.prototype.open = function (...rest) {
            let args = [...rest];
            args[1] && rules.forEach(d => {
                d[0].every(d => args[1].includes(d)) && d[1].call(this, args);
            });
            return open.call(this, ...args);
        };
    }
    catch (e) {
        toast.error("open.js", e);
    }
})();
`;
    modules["sendBeacon.js"] = `/**
 * 本模块负责拦截B站日志上报
 */
(function () {
    try {
        let sendBeacon = Navigator.prototype.sendBeacon;
        Navigator.prototype.sendBeacon = function (url, data) {
            if (url.includes("data.bilibili.com"))
                return true;
            else
                return sendBeacon.call(this, url, data);
        };
        // xhrhook的部分
        API.xhrhook(["data.bilibili.com"], function (args) { this.send = () => true; });
        API.xhrhook(["data.bilivideo.com"], function (args) { this.send = () => true; });
    }
    catch (e) {
        toast.error("sendBeacon.js", e);
    }
})();
`;
    modules["webSocket.js"] = `/**
 * 本模块hook了WebSocket以修复旧版播放器的实时弹幕
 * 告知：本模块由js强行any为ts版本，可能需要进一步优化
 */
(function () {
    try {
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
    }
    catch (e) {
        toast.error("webSocket.js", e);
    }
})();
`;
    modules["worker.js"] = `/**
 * 本模块hook了Worker以使旧版播放器支持新版proto弹幕
 */
(function () {
    try {
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
                let loadDanmaku = (loadTime) => API.getSegDanmaku().then((Segments) => {
                    // 旧播放器需要得到耗时数据(网络请求，数据处理)
                    loadTime = new Date() - loadTime;
                    let parseTime = new Date();
                    let danmaku = API.danmakuFormat(Segments);
                    parseTime = new Date() - parseTime;
                    triggerOnMsg(danmaku, loadTime, parseTime);
                    API.danmaku = danmaku;
                });
                if (XMLHttpRequest.prototype.pakku_send === undefined) {
                    loadDanmaku(new Date());
                }
                else {
                    // 让pakku.js载入弹幕
                    let url = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + API.cid + "&pid=" + API.aid + "&segment_index=1";
                    xhr({ url: url, responseType: "arraybuffer", credentials: true }).then((response) => {
                        let Segments = API.segDmDecode(response);
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
                            triggerOnMsg(API.danmaku = API.danmakuFormat(Segments), "(pakku.js)", "(pakku.js)");
                        }
                    });
                }
            }
            else {
                workerPostMsg.call(this, aMessage, transferList);
            }
        };
    }
    catch (e) {
        toast.error("worker.js", e);
    }
})();
`;
    modules["bnj2021.js"] = `/**
 * 本模块负责替换拜年祭2021专题页面使用旧版嵌入播放器
 */
(function () {
    API.runWhile(() => window.__INITIAL_STATE__, () => {
        try {
            const titles = window.__INITIAL_STATE__.videoSections.reduce((s, d) => {
                d.episodes.forEach(d => s.push(d));
                return s;
            }, []);
            // 替换播放器节点
            const node = document.querySelector("#bilibili-player");
            const iframe = document.createElement('iframe');
            iframe.src = \`https://www.bilibili.com/blackboard/html5player.html?aid=\${window.__INITIAL_STATE__.videoInfo.aid}&cid=\${window.__INITIAL_STATE__.videoInfo.cid}&enable_ssl=1&crossDomain=1&as_wide=1\`;
            iframe.setAttribute("style", "width: 906px; height: 556px;border:none;");
            iframe.setAttribute("id", "bofqi");
            node.replaceWith(iframe);
            // 添加时间戳监听
            const episodes = document.querySelectorAll('.video-episode-card__info-title');
            episodes.forEach((d, i, e) => {
                const episode = titles.find(t => t.title == d.innerText);
                e[i].parentNode.parentNode.onclick = () => {
                    toast(episode.title, \`av\${Reflect.get(episode, "aid")}\`, \`UP主：\${Reflect.get(episode, "author").name}\`);
                    iframe.contentWindow.postMessage({ aid: Reflect.get(episode, "aid"), cid: Reflect.get(episode, "cid") });
                };
            });
        }
        catch (e) {
            toast.error("bnj2021.js", e);
        }
    });
})();
`;
    modules["history.js"] = `/**
 * 本模块负责处理历史记录页面
 */
(function () {
    try {
        config.history && API.xhrhook(["api.bilibili.com/x/web-interface/history/cursor", "business"], function (args) {
            let obj = API.urlObj(args[1]), max = obj.max || "", view_at = obj.view_at || "";
            args[1] = API.objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: "20" });
        });
        config.searchHistory && API.runWhile(() => document.querySelector(".b-head-search"), () => { var _a; return (_a = document.querySelector(".b-head-search")) === null || _a === void 0 ? void 0 : _a.remove(); });
    }
    catch (e) {
        debug.error("history.js", e);
    }
})();
`;
    modules["player.js"] = `/**
 * 本模块负责重写旧版嵌入播放器
 */
(function () {
    try {
        API.path.name = "player";
        const obj = API.urlObj(location.href);
        obj.avid && (Number(obj.avid) ? Reflect.set(window, "aid", obj.avid) : Reflect.set(window, "aid", API.abv(obj.avid)));
        !Reflect.has(window, "aid") && obj.bvid && Reflect.set(window, "aid", API.abv(obj.bvid));
        obj.cid && Number(obj.cid) && Reflect.set(window, "cid", obj.cid);
        API.restorePlayerSetting(); // 备份还原旧版播放器设置数据
        API.rewriteHTML(API.getModule("player.html"));
        API.runWhile(() => document.body, () => {
            window.addEventListener('message', e => {
                if (e.data.cid) {
                    window.__playinfo__ = undefined;
                    e.data.as_wide = 1;
                    e.data.dashSymbol = true;
                    e.data.p = 1;
                    e.data.pre_ad = "";
                    history.replaceState(undefined, undefined, API.objUrl("https://www.bilibili.com/blackboard/html5player.html", { aid: e.data.aid, cid: e.data.cid }));
                    window.player = new window.BilibiliPlayer(e.data);
                }
            });
        });
    }
    catch (e) {
        toast.error("player.js", e);
    }
})();
`;
    modules["ranking.js"] = `/**
 * 本模块负责重写全站排行榜页面
 */
(function () {
    try {
        class Ranking {
            constructor() {
                this.refer = document.referrer.split("/");
                this.obj = { rid: "0", day: "3", type: "1", arc_type: "0" };
                API.path.name = "ranking";
                (this.refer && this.refer[4] && this.refer[4] == "all") && Reflect.set(this.obj, "rid", this.refer[5]);
                config.rewriteMethod == "异步" ? this.prepareA() : this.prepareB();
            }
            prepareA() {
                xhr({
                    url: API.objUrl("https://api.bilibili.com/x/web-interface/ranking", this.obj),
                    responseType: "json",
                    credentials: true
                }).then(d => { this.write(d); });
            }
            prepareB() {
                let data = xhr({
                    url: API.objUrl("https://api.bilibili.com/x/web-interface/ranking", this.obj),
                    async: false
                });
                this.write(data);
            }
            write(d) {
                const data = API.jsonCheck(d);
                const result = { loading: false, rankRouteParams: { arc_type: 0, day: 3, rankTab: "all", rid: Number(this.refer[5]) || 0, season_type: 1 }, showTypes: true, times: [{ name: "日排行", value: 1 }, { name: "三日排行", value: 3 }, { name: "周排行", value: 7 }, { name: "月排行", value: 30 }], typeList: [{ name: "全部投稿", value: 0 }, { name: "近期投稿", value: 1 }] };
                result.channels = [{ name: "全站", tid: 0 }, { name: "动画", tid: 1 }, { name: "国创相关", tid: 168 }, { name: "音乐", tid: 3 }, { name: "舞蹈", tid: 129 }, { name: "游戏", tid: 4 }, { name: "知识", tid: 36 }, { name: "数码", tid: 188 }, { name: "生活", tid: 160 }, { name: "美食", tid: 211 }, { name: "鬼畜", tid: 119 }, { name: "时尚", tid: 155 }, { name: "娱乐", tid: 5 }, { name: "影视", tid: 181 }];
                result.rankList = data.data.list;
                result.note = data.data.note;
                window.__INITIAL_STATE__ = result;
                API.rewriteHTML(API.getModule("ranking.html"));
                API.addCss("@media screen and (min-width: 1400px){.main-inner {width: 1160px !important;}}");
            }
        }
        new Ranking();
    }
    catch (e) {
        toast.error("ranking.js", e);
    }
})();
`;
    modules["read.js"] = `/**
 * 本模块负责重新旧版专栏页面
 */
(function () {
    try {
        class Read {
            constructor() {
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
                this.data = "";
                this.temp = "";
                API.path.name = "read";
                config.rewriteMethod == "异步" ? this.prepareA() : this.prepareB();
            }
            prepareA() {
                xhr({ url: location.href, credentials: true }).then(d => { this.build(d); });
            }
            prepareB() {
                let data = xhr({ url: location.href, async: false });
                this.build(data);
            }
            build(d) {
                this.data = d.includes("__INITIAL_STATE__=") ? JSON.parse(d.match(/INITIAL_STATE__=.+?\\;\\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\\(function/, "")) : "";
                if (!this.data)
                    throw "获取专栏数据失败！";
                this.bars();
                this.upinfo();
                this.head();
                this.body();
                this.tag();
                this.write();
            }
            bars() {
                this.temp += this.bar.reduce((o, d) => {
                    o = o + \`<a href="//www.bilibili.com/read/\${d[2]}?from=articleDetail" target="_self" class="tab-item\${this.data.readInfo.category.parent_id == d[0] ? " on" : ""}" data-tab-id="\${d[0]}"><span>\${d[1]}</span></a>\`;
                    return o;
                }, \`<div class="nav-tab-bar"><a href="https://www.bilibili.com/read/home?from=articleDetail" target="_self" class="logo"></a>\`) + "</div>";
            }
            upinfo() {
                this.temp += \`<div class="up-info-holder"><div class="fixed-box"><div class="up-info-block">
            <a class="up-face-holder" href="//space.bilibili.com/\${this.data.readInfo.author.mid}" target="_blank"><img class="up-face-image" data-face-src="\${this.data.readInfo.author.face.replace("http:", "")}" src="//static.hdslb.com/images/member/noface.gif" /></a><div class="up-info-right-block"><div class="row">
            <a class="up-name" href="//space.bilibili.com/\${this.data.readInfo.author.mid}" target="_blank">\${this.data.readInfo.author.name}</a> <span class="level"></span><div class="nameplate-holder"><i class="nameplate"></i></div></div><div class="row-2">粉丝: <span class="fans-num"></span> <span class="view">阅读:</span> <span class="view-num"></span></div></div></div><div class="follow-btn-holder"><span class="follow-btn">关注</span></div><div class="up-article-list-block hidden"><div class="block-title">推荐文章</div><ul class="article-list"></ul></div><div class="more"><div class="top-bar"><label>更多</label></div><a class="ac-link" href="//www.bilibili.com/read/apply/" target="_blank"><div class="link"><span class="icon"></span><p class="title">成为创作者</p><p class="info">申请成为专栏UP主</p></div></a> <a href="//www.bilibili.com/blackboard/help.html#%C3%A4%C2%B8%C2%93%C3%A6%C2%A0%C2%8F%C3%A7%C2%9B%C2%B8%C3%A5%C2%85%C2%B3" target="_blank"><div class="help"><span class="icon"></span><p class="title">专栏帮助</p><p class="info">查看专栏使用说明</p></div></a></div></div>
            </div><div class="right-side-bar"><div class="to-comment"><div class="comment-num-holder"><span class="comment-num"></span></div></div><div class="to-top"></div></div>\`;
            }
            head() {
                this.temp += \`<div class="head-container"><div class="banner-img-holder"></div><div class="bangumi-rating-container"></div><div class="argue-flag hidden"></div><div class="title-container">
            <h1 class="title">\${this.data.readInfo.title}</h1><div class="info">
            <a class="category-link" href="//www.bilibili.com/read/\${this.bar.find(d => {
                    if (d[0] == this.data.readInfo.category.parent_id)
                        return d;
                })[2]}#rid=\${this.data.readInfo.category.id}" target="_blank"><span>\${this.data.readInfo.category.name}</span></a> <span class="create-time" data-ts="\${this.data.readInfo.ctime}"></span><div class="article-data"></div>
            </div></div><div style="display:none" class="author-container">
            <a class="author-face" href="//space.bilibili.com/\${this.data.readInfo.author.mid}" target="_blank"><img data-face-src="\${this.data.readInfo.author.face.replace("http:", "")}" src="\${this.data.readInfo.author.face.replace("http:", "")}" class="author-face-img" /></a> <a class="author-name" href="//space.bilibili.com/\${this.data.readInfo.author.mid}" target="_blank">\${this.data.readInfo.author.name}</a><div class="attention-btn slim-border">关注</div></div></div>\`;
            }
            body() {
                this.temp += \`<div class="article-holder">\${this.data.readInfo.content}</div><p class="original">本文为我原创</p>\`;
            }
            tag() {
                this.temp += (this.data.readInfo.tags || []).reduce((o, d) => {
                    o = o + \`<li data-tag-id="\${d.tid}" class="tag-item"><span class="tag-border"><span class="tag-border-inner"></span></span> <span class="tag-content">\${d.name}</span></li>\`;
                    return o;
                }, \`<ul class="tag-container">\`) + \`</ul><div class="article-action"><div class="ops"><span class="like-btn"><i class="icon-video-details_like"></i> <span>--</span></span> <span class="coin-btn"><i class="icon-video-details_throw-coin"></i> <span>--</span></span> <span class="fav-btn"><i class="icon-video-details_collection"></i> <span>--</span></span> <span class="share-container share-btn">分享到：<span></span></span></div><div class="more"><!-- <i class="icon-general_more-actions"></i> --><div class="more-ops-list"><ul><li value="0">投诉或建议</li></ul></div></div></div><div class="article-list-holder-block"></div><div class="draft-holder-block"></div><div class="b-head comment-title-block"><span class="b-head-t comment-results" style="display: inline;"></span> <span class="b-head-t">评论</span></div><div class="comment-holder"></div>\`;
            }
            write() {
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
                this.data = \`<div class="page-container">\${this.temp}</div>\`;
                API.rewriteHTML(API.getModule("read.html").replace(\`<div class="page-container"></div>\`, this.data));
                API.runWhile(() => document.body, () => API.importModule("user-select.js"));
            }
        }
        new Read();
    }
    catch (e) {
        toast.error("read.js", e);
    }
})();
`;
    modules["watchlater.js"] = `/**
 * 本模块负责重写稍后再看页面
 */
(function () {
    try {
        if (!API.uid)
            toast.warning("未登录，无法启用稍后再看！");
        else {
            API.path.name = "watchlater";
            // 备份还原旧版播放器设置数据
            API.restorePlayerSetting();
            API.scriptIntercept(["video-nano"]); // 新版播放器拦截
            API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
            API.rewriteHTML(API.getModule("watchlater.html").replace("static.hdslb.com/js/video.min.js", "cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/video.min.js"));
            API.addCss(API.getModule("bofqi.css"));
            // 修复评论跳转
            window.commentAgent = { seek: (t) => window.player && window.player.seek(t) };
            // 添加点赞功能
            config.enlike && API.importModule("enLike.js");
            API.addCss(API.getModule("mini-bofqi.css"));
            // 修正分区信息
            API.importModule("videoSort.js");
            API.path.forEach(d => { d.includes("av") && (API.aid = Number(/[0-9]+/.exec(d)[0])); });
        }
    }
    catch (e) {
        toast.error("watchlater.js", e);
    }
})();
`;
    modules["av.js"] = `/**
 * 本模块负责重写av/BV页，由\`rewrite.js\`按需引导
 * 其他只在重写过的旧版页面生效的功能可添加在本模块中，但更推荐编写在单独的模块中然后将引导代码写在本模块中。
 */
(function () {
    try {
        class Av {
            constructor() {
                // __INITIAL_STATE__类型保护
                this.isAV__INITIAL_STATE__ = (pet) => true;
                // 重定向SEO页面
                if (/\\/s\\//.test(location.href))
                    location.replace(location.href.replace("s/video", "video"));
                API.path.name = "av";
                // 备份还原旧版播放器设置数据
                API.restorePlayerSetting();
                API.scriptIntercept(["video-nano"]); // 新版播放器拦截
                API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
                // 获取aid
                if (API.path[4].toLowerCase().startsWith('bv'))
                    API.aid = API.abv(API.path[4].split("#")[0].split("?")[0]);
                API.aid = API.aid || Number(/[0-9]+/.exec(String(API.path[4]))[0]);
                config.rewriteMethod == "异步" ? this.prepareA() : this.prepareB();
            }
            /**
             * 异步构造__INITIAL_STATE__前置
             */
            async prepareA() {
                await new Promise(r => {
                    xhr({
                        url: API.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: API.aid }),
                        responseType: "json",
                        credentials: true
                    }).then(d => {
                        API.importModule("av-detail.js", { __INITIAL_STATE__: d });
                        r(true);
                    }).catch(e => {
                        toast.error("获取av号信息出错，尝试访问第三方接口~", e);
                        xhr({
                            url: API.objUrl("https://www.biliplus.com/api/view", { id: API.aid }),
                            responseType: "json"
                        }).then(d => {
                            API.importModule("av-biliplus.js", { __INITIAL_STATE__: d });
                            r(true);
                        }).catch(e => {
                            toast.error("第三方接口也出错，", e);
                            API.importModule("vector.js");
                        });
                    });
                });
                this.write();
            }
            /**
             * 同步构造__INITIAL_STATE__前置
             */
            prepareB() {
                let d = xhr({
                    url: API.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: API.aid }),
                    async: false
                });
                try {
                    API.importModule("av-detail.js", { __INITIAL_STATE__: d });
                }
                catch (e) {
                    toast.error("获取av号信息出错，尝试访问第三方接口~", e);
                    d = xhr({
                        url: API.objUrl("https://www.biliplus.com/api/view", { id: API.aid }),
                        async: false
                    });
                    API.importModule("av-biliplus.js", { __INITIAL_STATE__: d });
                }
                this.write();
            }
            /**
             * 实际重写页面过程，依赖__INITIAL_STATE__前置
             */
            write() {
                if (this.isAV__INITIAL_STATE__(API.__INITIAL_STATE__)) {
                    if (!API.__INITIAL_STATE__)
                        throw "无法重写av页 ಥ_ಥ";
                    if (API.__INITIAL_STATE__.videoData.redirect_url)
                        return toast.warning("番剧重定向...", API.__INITIAL_STATE__.videoData.redirect_url);
                    if (API.__INITIAL_STATE__.videoData.stein_guide_cid)
                        return toast.warning("这似乎是个互动视频！", "抱歉！旧版播放器无法支持 ಥ_ಥ");
                    API.aid = API.__INITIAL_STATE__.aid;
                    API.tid = API.__INITIAL_STATE__.videoData.tid;
                    window.__INITIAL_STATE__ = API.__INITIAL_STATE__;
                    config.noVideo && delete window.__playinfo__;
                    API.rewriteHTML(API.getModule("av.html").replace("static.hdslb.com/js/video.min.js", "cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/video.min.js"));
                    document.title = API.__INITIAL_STATE__.videoData.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
                    API.addCss(API.getModule("bofqi.css"));
                    // 移除失效顶栏
                    API.runWhile(() => document.getElementsByClassName("bili-header-m report-wrap-module")[1], () => document.getElementsByClassName("bili-header-m report-wrap-module")[1].remove());
                    // 修复评论跳转
                    window.commentAgent = { seek: (t) => window.player && window.player.seek(t) };
                    // 添加点赞功能
                    config.enlike && API.importModule("enLike.js");
                    // 构造媒体页
                    GM.getValue("medialist", 0) && API.importModule("mediaList.js");
                    // 和作UP主
                    config.upList && API.__INITIAL_STATE__.videoData.staff && API.importModule("upList.js", { staff: API.__INITIAL_STATE__.videoData.staff });
                    // 视频简介中的bv转超链接
                    API.importModule("descBV.js");
                    // 修复原生代码错误
                    API.importModule("hookWebpackJsonp.js");
                    // 互动弹幕
                    config.commandDm && API.importModule("commandDm.js");
                    // 修正分区信息
                    API.importModule("videoSort.js");
                    // 添加媒体控制
                    API.importModule("mediaControl.js", {
                        title: API.__INITIAL_STATE__.videoData.title,
                        artist: API.__INITIAL_STATE__.videoData.owner.name,
                        chapterName: (pid, playList) => playList[pid].part,
                        coverUrl: () => [{ src: API.__INITIAL_STATE__.videoData.pic, sizes: "320x180" }],
                        getPlaylistIndex: () => window.player.getPlaylistIndex()
                    });
                    // 跳过充电鸣谢
                    API.jsonphook(["api.bilibili.com/x/web-interface/elec/show"], function (xhr) { xhr.url = API.objUrl(xhr.url.split("?")[0], Object.assign(API.urlObj(xhr.url), { aid: 1, mid: 1 })); });
                }
            }
        }
        new Av();
    }
    catch (e) {
        debug.error("av.js", e);
        API.importModule("vector.js");
    }
})();
`;
    modules["commandDm.js"] = `/**
 * 本模块负责实现互动弹幕
 * 告知：本模块由js强行any为ts版本，可能需要进一步优化
 */
(function () {
    API.addCss(API.getModule("commandDm.css"));
    var player, widgetContainer;
    var playing = false;
    var visible = true;
    var commandDm = {
        visible: [],
        hidden: [] // 未显示的互动弹幕
    };
    /**
     * 初始化互动弹幕功能
     */
    function init() {
        if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.videoData && window.player) {
            if (widgetContainer === undefined)
                widgetContainer = initCountainer();
            player = window.player;
            bindEvents();
        }
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
    function initCountainer() {
        let videoWrap = document.getElementsByClassName("bilibili-player-video-wrap")[0];
        if (!videoWrap)
            return;
        let widgetContainer = document.createElement("div");
        widgetContainer.className = "bilibili-player-video-popup";
        videoWrap.appendChild(widgetContainer);
        return widgetContainer;
    }
    /**
     * 绑定播放器事件，使用window.player.addEventListener
     */
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
                    break;
                case "#ACTORFOLLOW#":
                case "#MANAGERFOLLOW#":
                    break;
                case "#VOTE#": // 投票弹窗
                    popupWindow.push(new Vote(cdm, extra, from));
                    break;
                case "#GRADE#": // 评分弹窗
                    popupWindow.push(new Grade(cdm, extra, from));
                    break;
                // 滚动弹幕(见原生代码appendDmImg())，它们的渲染也许需要去修改原生弹幕渲染器
                case "#RESERVE#":
                    break;
                case "#LINK#":
                    popupWindow.push(new Link(cdm, extra, from));
                    break;
                case "#ACTOR#":
                    break;
                case "#ACTIVITYCOMBO#":
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
    /**
     * 播放器大小更改时触发
     */
    function resize() {
        // 获得当前播放器显示分辨率与最小分辨率(680x504)时的缩放比，用于UI缩放
        let scaleX = widgetContainer.clientWidth / 680;
        let scaleY = widgetContainer.clientHeight / 504;
        for (let i = 0; i < commandDm.visible.length; i++) {
            commandDm.visible[i].resize(scaleX, scaleY);
        }
        for (let i = 0; i < commandDm.hidden.length; i++) {
            commandDm.hidden[i].resize(scaleX, scaleY);
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
        toast.warning("请先登录");
        API.biliQuickLogin();
    }
    function post(url, data, contentType = "application/x-www-form-urlencoded") {
        data.csrf = API.getCookies().bili_jct;
        return xhr({
            url: url,
            data: API.objUrl("", data),
            headers: { "Content-type": contentType },
            method: "POST",
            credentials: true
        });
    }
    /**
     * 弹窗组件
     */
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
        resize(scaleX, scaleY) {
            this.popup.style.left = (this.pos_x * scaleX) + "px";
            this.popup.style.top = (this.pos_y * scaleY) + "px";
            this.popup.style.transform = "translateX(-50%) translateY(-50%) scale(" + Math.min((scaleX + scaleY) / 2, 1.5) + ")";
        }
    }
    /**
     * 投票互动UI
     */
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
        /**
         * 投票结果的动画
         */
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
    /**
     * 用于获取收藏列表有关信息
     */
    class favList {
        static get() {
            if (this.list.length > 0)
                return Promise.resolve(this.list);
            return xhr({
                url: API.objUrl("//api.bilibili.com/x/v3/fav/folder/created/list-all", {
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
    /**
     * @see https://github.com/SocialSisterYi/bilibili-API-collect
     */
    class biliAPI {
        static verify(resp, msg) {
            if (resp.code !== 0) {
                toast.error(msg + "失败", resp.code, resp.message);
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
                var d = resp.data;
                if (d.coin && d.like && d.fav)
                    return;
                if (!d.coin)
                    toast.error("投币失败");
                if (!d.like)
                    toast.error("点赞失败");
                if (!d.fav)
                    toast.error("收藏失败");
                return d;
            });
        }
    }
    /**
     * 关联视频跳转按钮
     */
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
        /**
         * 根据视频区域大小缩放，放大倍数限制在最大1.5倍
         */
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
    API.loadCommandDm = async (cdm, aid, cid) => {
        try {
            if (aid != API.aid || cid != API.cid || widgetContainer !== undefined) {
                // 正在“载入其他视频弹幕”，不必处理互动弹幕
                return;
            }
            init(); // 由于切P后整个播放器会被销毁重建，每次载入互动弹幕都需要重新绑定事件
            load(cdm);
        }
        catch (e) {
            toast.error("commandDm.js", e);
        }
    };
})();
`;
    modules["descBV.js"] = `/**
 * 本模块负责转化av页简介中BV号为超链接
 */
(function () {
    try {
        API.switchVideo(() => {
            let desc = document.getElementsByClassName("info");
            if (desc[1] && desc[1].parentNode && desc[1].parentNode.id == "v_desc") {
                if (desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i)) {
                    const text = desc[1].innerText.replace(/BV[A-Za-z0-9]+/gi, (str) => {
                        const av = API.abv(str);
                        return \`<a target="_blank" href="//www.bilibili.com/video/av\${av}">av\${av}</a>\`;
                    });
                    desc[1].innerHTML = text;
                }
            }
        });
    }
    catch (e) {
        debug.error("descBV.js", e);
    }
})();
`;
    modules["enLike.js"] = `/**
 * 本模块负责为旧版av/BV、稍后再看添加点赞功能
 */
(function () {
    API.runWhile(() => document.querySelector(".v.play"), async () => {
        try {
            let span = document.createElement("span");
            let like = \`background-image: url(//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/image/like.png);\`;
            let dislike = \`background-image: url(//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/image/dislike.png);\`;
            let text = document.createTextNode("点赞 --");
            let arg = text;
            let islike = false;
            let i = API.addElement("i", { class: "l-icon-move", style: 'width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;' + dislike }, span);
            let b = API.addElement("b", { class: "l-icon-moved", style: "width : 22px;height : 22px;display : none;" }, span);
            span.setAttribute("class", "u like");
            span.setAttribute("style", "margin-left : 24px;margin-right : 10px;");
            span.appendChild(text);
            document.querySelector(".number").insertBefore(span, document.querySelector(".coin"));
            span.onclick = async () => {
                if (islike) {
                    // 取消点赞
                    let data = await xhr({
                        url: "https://api.bilibili.com/x/web-interface/archive/like",
                        method: "POST",
                        data: \`aid=\${API.aid}&like=2&csrf=\${API.getCookies().bili_jct}\`,
                        credentials: true
                    });
                    data = API.jsonCheck(data).ttl;
                    toast.warning("取消点赞！");
                    islike = false;
                    i.setAttribute("style", "width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;" + dislike);
                    b.setAttribute("style", "width : 22px;height : 22px;display : none;");
                    if (arg.nodeValue.match("万"))
                        return;
                    let number = 1 * arg.nodeValue.match(/[0-9]+/) - 1;
                    text = document.createTextNode(" 点赞 " + number);
                    arg.replaceWith(text);
                    arg = text;
                }
                else {
                    if (!API.uid)
                        return API.biliQuickLogin(); // 登录判断
                    // 点赞
                    let data = await xhr({
                        url: "https://api.bilibili.com/x/web-interface/archive/like",
                        method: "POST",
                        data: \`aid=\${API.aid}&like=1&csrf=\${API.getCookies().bili_jct}\`,
                        credentials: true
                    });
                    data = API.jsonCheck(data).ttl;
                    toast.success("点赞成功！");
                    islike = true;
                    i.setAttribute("style", "width : 22px;height : 22px;display : none;");
                    b.setAttribute("style", "width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;" + like);
                    if (arg.nodeValue.match("万"))
                        return;
                    let number = 1 * arg.nodeValue.match(/[0-9]+/) + 1;
                    text = document.createTextNode(" 点赞 " + number);
                    arg.replaceWith(text);
                    arg = text;
                }
            };
            // 初始化按钮
            let data = await xhr({
                url: API.objUrl("https://api.bilibili.com/x/web-interface/view", { aid: API.aid }),
                credentials: true
            });
            data = API.jsonCheck(data).data.stat.like;
            document.querySelector(".like").setAttribute("title", "点赞人数" + data);
            text = document.createTextNode(" 点赞 " + API.unitFormat(data));
            arg.replaceWith(text);
            arg = text;
            if (!API.uid)
                return;
            data = API.jsonCheck(await xhr({
                url: API.objUrl("https://api.bilibili.com/x/web-interface/archive/has/like", { "aid": API.aid }),
                credentials: true
            })).data;
            if (data == 1) {
                // 点赞过点亮图标
                i.setAttribute("style", "width : 22px;height : 22px;display : none;");
                b.setAttribute("style", "width : 22px;height : 22px;display: inline-block;vertical-align: middle;margin-top: -3px;margin-right: 3px;" + like);
                islike = true;
            }
        }
        catch (e) {
            toast.error("enLike.js", e);
        }
    });
})();
`;
    modules["hookWebpackJsonp.js"] = `/**
 * 本模块负责修复av页原生脚本中的错误代码
 */
(function () {
    try {
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
    }
    catch (e) {
        toast.error("webpackJsonpFunction.js", e);
    }
})();
`;
    modules["loadByDmid.js"] = `/**
 * 本模块负责处理dmid跳转
 */
(function () {
    try {
        const dmid = API.urlObj(location.href).dmid;
        let progress = Number(API.urlObj(location.href).dm_progress);
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
                progress = await xhr({
                    url: \`https://api.bilibili.com/x/v2/dm/thumbup/detail?oid=\${API.cid}&dmid=\${dmid}\`,
                    credentials: true
                });
                progress = API.jsonCheck(progress).data.progress; // 检查xhr返回值并转化为json
                progress && window.player.seek(progress / 1000 - .2);
            }
        });
    }
    catch (e) {
        debug.error("loadByDmid.js", e);
    }
})();
`;
    modules["mediaControl.js"] = `/**
 * 本模块负责为旧版播放器添加媒体控制键
 * 请以\`title\`、\`artist\`、\`chapterName\`、\`coverUrl\`、\`getPlaylistIndex\`的名义传入数据
 * 告知：本模块由js强行any为ts版本，可能需要进一步优化
 */
(async function () {
    try {
        if (document.visibilityState !== "visible") {
            await new Promise(r => window.addEventListener('load', r));
        }
        if ("mediaSession" in navigator) {
            function trial(fn) {
                let limit = 7;
                function task() { if (!fn() && --limit > 0)
                    setTimeout(task, 1000); }
                task();
            }
            trial(() => {
                if (window.player != undefined && window.player.getPlaylist && window.player.getPlaylist() != null) {
                    let playList = window.player.getPlaylist();
                    // @ts-ignore：该变量由主模块传入
                    let partIndex = getPlaylistIndex();
                    // @ts-ignore：这是一项试验性特性
                    navigator.mediaSession.metadata = new MediaMetadata({
                        // @ts-ignore：该变量由主模块传入
                        title: title,
                        // @ts-ignore：该变量由主模块传入
                        artist: artist,
                        // @ts-ignore：该变量由主模块传入
                        album: chapterName(partIndex, playList),
                        // @ts-ignore：该变量由主模块传入
                        artwork: coverUrl(partIndex, playList)
                    });
                    navigator.mediaSession.setActionHandler('play', () => window.player.play());
                    navigator.mediaSession.setActionHandler('pause', () => window.player.pause());
                    navigator.mediaSession.setActionHandler('seekbackward', () => window.player.seek(window.player.getCurrentTime() - 10));
                    navigator.mediaSession.setActionHandler('seekforward', () => window.player.seek(window.player.getCurrentTime() + 10));
                    navigator.mediaSession.setActionHandler('previoustrack', () => window.player.prev());
                    navigator.mediaSession.setActionHandler('nexttrack', () => window.player.next());
                    API.switchVideo(() => {
                        // 要等到新的分p载入完成，getPlaylistIndex()的值才会更新
                        trial(() => {
                            // @ts-ignore：该变量由主模块传入
                            let pid = getPlaylistIndex();
                            if (pid != partIndex) {
                                partIndex = pid;
                                // @ts-ignore：该变量由主模块传入
                                navigator.mediaSession.metadata.album = chapterName(partIndex, playList);
                                // @ts-ignore：该变量由主模块传入
                                navigator.mediaSession.metadata.artwork = coverUrl(partIndex, playList);
                                return true;
                            }
                        });
                    });
                    return true;
                }
            });
        }
    }
    catch (e) {
        toast.error("mediaControl.js", e);
    }
})();
`;
    modules["mediaList.js"] = `/**
 * 本模块负责基于av页重构为媒体页
 */
(function () {
    if (API.path[5].startsWith("ml")) {
        const ml = Number(API.path[5].match(/[0-9]+/)[0]);
        // 保存收藏号并调用av跳转
        if (!config.medialist)
            return;
        GM.setValue("medialist", ml);
        return API.runWhile(() => window.aid, () => location.replace(\`https://www.bilibili.com/video/\${window.aid}\`));
    }
    // 新版稍后再看跳转到旧版稍后再看
    if (API.path[5].startsWith("watchlater") && config.watchlater)
        location.replace("https://www.bilibili.com/watchlater/#/");
    if (!/\\/video\\/[AaBb][Vv]/.test(location.href))
        return;
    let mid = GM.getValue("medialist", 0);
    GM.deleteValue("medialist");
    try {
        toast("重构媒体页信息中...");
        let avs = [], value = [], promises = [], ids = [];
        xhr({
            url: \`https://api.bilibili.com/x/v1/medialist/resource/ids4Player?media_id=\${mid}\`,
            credentials: true
        }).then(async (d) => {
            let data = API.jsonCheck(d).data;
            for (let i = 0; i < data.medias.length; i++) {
                ids[i] = data.medias[i].id;
                avs[i] = "av" + data.medias[i].id;
            }
            // 同时获取所有aid对应的数据，使用Promise.all对齐，该api会直接忽略失效视频
            while (avs.length) {
                let i = avs.length > 20 ? 20 : avs.length;
                value = avs.splice(0, i);
                promises.push(xhr({
                    url: API.objUrl("https://api.bilibili.com/x/article/cards", { "ids": value.join("%2C") }),
                    credentials: true
                }));
            }
            value = [];
            data = await Promise.all(promises);
            // 格式化数据并排序
            for (let i = 0; i < data.length; i++) {
                data[i] = API.jsonCheck(data[i]);
                for (let key in data[i].data)
                    avs.push(data[i].data[key]);
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
            API.runWhile(() => window.BilibiliPlayer, () => {
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
                let oid = ids[0].aid; // 保存当前aid以判断切p
                debug("收藏列表", toview);
                toast.success("重构成功！刷新播放器...");
                window.BilibiliPlayer({ "aid": ids[0].aid, "cid": ids[0].cid, "watchlater": encodeURIComponent(JSON.stringify(toview)) });
                API.runWhile(() => document.getElementsByClassName("bpui-button-text")[1], () => document.getElementsByClassName("bpui-button-text")[1].firstChild.innerText = "收藏列表");
                API.switchVideo(() => {
                    if (!API.aid)
                        API.aid = window.aid || API.aid;
                    if (oid && oid != window.aid) {
                        API.aid = window.aid || API.aid;
                        toast("刷新页面信息...");
                        history.replaceState(null, "", "https://www.bilibili.com/video/av" + API.aid + location.search + location.hash);
                        for (let i = 0; i < ids.length; i++)
                            if (ids[i].aid == API.aid)
                                data = ids[i];
                        let video_info = document.getElementById("viewbox_report");
                        let up_info = document.getElementById("v_upinfo");
                        let arc_toolbar_report = document.getElementById("arc_toolbar_report");
                        document.title = data.title;
                        video_info.innerHTML = '<h1 title="' + data.title + '"><!----><span>' + data.title + '</span></h1>' +
                            '<div class="tm-info tminfo"><span class="crumb"><a href="//www.bilibili.com">主页</a> &gt;</span> <span class="crumb"><a href="//www.bilibili.com/v/douga/">动画</a> &gt;</span> <span class="crumb"><a href="//www.bilibili.com/v/douga/mad/">MAD·AMV</a></span><time>' + API.timeFormat(data.pubdate * 1000, true) + '</time><a class="btn-appeal">稿件投诉</a></div>' +
                            '<div class="number"><span title="总播放数' + data.stat.view + '" class="v play">' + API.unitFormat(data.stat.view) + '</span><span title="总弹幕数' + data.stat.danmaku + '" class="v dm">' + API.unitFormat(data.stat.danmaku) + '</span><span title="本日日排行数据过期后，再纳入本稿件的历史排行数据进行对比得出" class="v rank">最高全站日排行' + data.stat.like + '名</span><span class="line"></span><span class="u like" style="margin-right : 5px;" title="点赞人数' + data.stat.his_rank + '"><i class="l-icon-move" style="width : 22px;height : 22px;background-position : -660px -2068px;"></i><b class="l-icon-moved" style="width : 22px;height : 22px;background-position : -725px -2068px;display : none;"></b> 点赞 ' + API.unitFormat(data.stat.like) + '</span><span report-id="coinbtn1" title="投硬币枚数' + data.stat.coin + '" class="u coin"><i class="c-icon-move"></i><b class="c-icon-moved" style="background-position: -2340px -60px; display: none;"></b> 硬币 ' + API.unitFormat(data.stat.coin) + '</span> <span report-id="collect1" title="收藏人数' + data.stat.favorite + '" class="u fav"><i class="f-icon-move" style="background-position: 0px 0px;"></i><b class="f-icon-moved" style="background-position: -1740px -60px; display: none;"></b> 收藏 ' + API.unitFormat(data.stat.favorite) + '</span></div>';
                        up_info.innerHTML = '<div class="u-face fl"><!----><a href="//space.bilibili.com/' + data.owner.mid + '" target="_blank" report-id="head" class="a"><img src="' + data.owner.face + '@68w_68h.webp" width="68" height="68" class="up-face" /><!----><!----><i title="企业/团体认证" class="auth o-auth"></i></a></div>' +
                            '<div class="info"><div class="user clearfix"><a href="//space.bilibili.com/' + data.owner.mid + '" target="_blank" report-id="name" class="name is-vip">' + data.owner.name + '</a><a href="//message.bilibili.com/#whisper/mid' + data.owner.mid + '" target="_blank" report-id="message" class="message icon">发消息</a></div><div class="sign static"><span>up主简介</span><!----></div><div class="number clearfix"><span title="投稿数--">投稿：--</span><span title="粉丝数--">粉丝：--</span></div><div class="btn followe"><a report-id="follow1" class="bi-btn b-gz"><span class="gz">+ 关注</span><span class="ygz">已关注</span><span class="qxgz">取消关注</span></a><a report-id="charge" class="bi-btn b-cd elecrank-btn"><span class="cd">充电</span><span class="wtcd">为TA充电</span></a></div></div>';
                        arc_toolbar_report.children[0].children[0].title = "分享人数" + data.stat.share;
                        arc_toolbar_report.children[0].children[0].innerHTML = '<span class="t">分享</span><span class="num">' + API.unitFormat(data.stat.share) + '</span><i class="icon"></i>';
                        arc_toolbar_report.children[2].title = "收藏人数" + data.stat.favorite;
                        arc_toolbar_report.children[2].innerHTML = '<div class="btn-item"><i class="icon-move f-icon-moved" style="display: none;"></i><b class="icon-move f-icon-move"></b><span class="t">收藏</span><span class="num">' + API.unitFormat(data.stat.favorite) + '</span></div>';
                        arc_toolbar_report.children[3].title = "投硬币枚数" + data.stat.coin;
                        arc_toolbar_report.children[3].innerHTML = '<div class="btn-item"><i class="icon-move c-icon-moved" style="display: none;"></i><b class="icon-move c-icon-move"></b><span class="t">硬币</span><span class="num">' + API.unitFormat(data.stat.coin) + '</span></div>';
                        document.getElementById("v_tag").children[0].setAttribute("hidden", "hidden");
                        document.getElementById("v_desc").children[1].innerText = data.desc;
                        new window.bbComment(".comment", window.aid, 1, window.UserStatus.userInfo, "");
                        data.stat.like ? video_info.children[2].children[2].setAttribute("style", "display: inline-block;") : video_info.children[2].children[2].setAttribute("style", "display: none;");
                        API.runWhile(() => document.getElementsByClassName("bpui-button-text")[1], () => document.getElementsByClassName("bpui-button-text")[1].firstChild.innerText = "收藏列表");
                    }
                });
            });
        });
    }
    catch (e) {
        toast.error("mediaList.js", e);
    }
})();
`;
    modules["upList.js"] = `/**
 * 本模块负责生成和作视频的UP列表
 * 请以\`staff\`的名义传入UP主列表
 */
(function () {
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
            toast.error("upList.js", e);
        }
    });
})();
`;
    modules["videoSort.js"] = `/**
 * 本模块负责视频标题下失效的分区信息
 * 分区信息表videoSort.json可能需要长期维护
 */
(function () {
    API.runWhile(() => document.querySelector(".tm-info"), () => {
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
                    xhr({
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
            debug.error("videoSort.js", e);
        }
    });
})();
`;
    modules["bangumi.js"] = `/**
 * 本模块负责重写旧版bangumi页面
 */
(function () {
    try {
        class Bangumi {
            constructor() {
                this.epid = API.path[5].startsWith('ep') ? location.href.match(/[0-9]+/)[0] : null;
                this.obj = {};
                this.isBANGUMI__INITIAL_STATE__ = (pet) => true;
                API.path.name = "bangumi";
                // 备份还原旧版播放器设置数据
                API.restorePlayerSetting();
                API.scriptIntercept(["video-nano"]); // 新版播放器拦截
                API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
                API.path[5].startsWith('ss') && Reflect.set(this.obj, "season_id", location.href.match(/[0-9]+/)[0]);
                API.path[5].startsWith('ep') && Reflect.set(this.obj, "ep_id", location.href.match(/[0-9]+/)[0]);
                config.rewriteMethod == "异步" ? this.prepareA() : this.prepareB();
            }
            async prepareA() {
                if (API.uid && !this.epid) {
                    const data = await xhr({ url: location.href });
                    const arr = data.match(/last_ep_id\\"\\:[0-9]+/) || [];
                    this.epid = (arr[0] && arr[0].split(":")[1]) || null;
                }
                await new Promise(r => {
                    // 准备__INITIAL_STATE__
                    if (Reflect.has(this.obj, "season_id") || Reflect.has(this.obj, "ep_id")) {
                        xhr({
                            url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", this.obj),
                            responseType: "json",
                            credentials: true
                        }).then(d => {
                            API.importModule("bangumi-season.js", { __INITIAL_STATE__: d, epid: this.epid });
                            r(true);
                        }).catch(e => {
                            toast.error("获取bangumi数据出错！", e);
                            config.videoLimit && xhr({
                                url: API.objUrl(\`\${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season\`, this.obj),
                                responseType: "json",
                                credentials: true
                            }).then(d => {
                                API.importModule("bangumi-global.js", { __INITIAL_STATE__: d, epid: this.epid });
                                r(true);
                                API.limit = true;
                                API.globalLimit = true;
                            }).catch(e => { debug.error(e); API.importModule("vector.js"); });
                        });
                    }
                });
                this.write();
            }
            prepareB() {
                if (API.uid && !this.epid) {
                    const data = xhr({ url: location.href, async: false });
                    const arr = data.match(/last_ep_id\\"\\:[0-9]+/) || [];
                    this.epid = (arr[0] && arr[0].split(":")[1]) || null;
                }
                let d = xhr({
                    url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", this.obj),
                    async: false
                });
                try {
                    API.importModule("bangumi-season.js", { __INITIAL_STATE__: d, epid: this.epid });
                }
                catch (e) {
                    toast.error("获取bangumi数据出错！", e);
                    if (!config.videoLimit)
                        return;
                    d = xhr({
                        url: API.objUrl(\`\${config.limitServer || "https://api.global.bilibili.com"}/intl/gateway/v2/ogv/view/app/season\`, this.obj),
                        async: false
                    });
                    API.importModule("bangumi-global.js", { __INITIAL_STATE__: d, epid: this.epid });
                    API.limit = true;
                    API.globalLimit = true;
                }
                this.write();
            }
            write() {
                var _a, _b, _c;
                if (this.isBANGUMI__INITIAL_STATE__(API.__INITIAL_STATE__)) {
                    if (((_b = (_a = API.__INITIAL_STATE__) === null || _a === void 0 ? void 0 : _a.epInfo) === null || _b === void 0 ? void 0 : _b.badge) === "互动")
                        return toast.warning("这似乎是个互动番剧！", "什么！番剧也能互动？", "可惜旧版播放器不支持 ಥ_ಥ");
                    config.bangumiEplist && ((_c = API.__INITIAL_STATE__) === null || _c === void 0 ? void 0 : _c.epList[1]) && (API.__INITIAL_STATE__.special = false, API.__INITIAL_STATE__.mediaInfo.bkg_cover = undefined);
                    window.__INITIAL_STATE__ = API.__INITIAL_STATE__;
                    API.__INITIAL_STATE__.special ? API.rewriteHTML(API.getModule("bangumi-special.html").replace("static.hdslb.com/js/video.min.js", "cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/video.min.js")) : API.rewriteHTML(API.getModule("bangumi.html").replace("static.hdslb.com/js/video.min.js", "cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/video.min.js"));
                    document.title = API.__INITIAL_STATE__.mediaInfo.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
                    // 分集数据
                    config.episodeData && API.importModule("episodeData.js");
                    // 移除过期节点
                    API.runWhile(() => document.querySelector(".new-entry"), () => { var _a; return (_a = document.querySelector(".new-entry")) === null || _a === void 0 ? void 0 : _a.remove(); });
                    // 修复数据
                    API.importModule("restoreData.js");
                    // 媒体控制
                    API.importModule("mediaControl.js", {
                        title: API.__INITIAL_STATE__.mediaInfo.title,
                        artist: API.__INITIAL_STATE__.mediaInfo.jp_title,
                        chapterName: (pid) => API.__INITIAL_STATE__.epList[pid].index_title,
                        coverUrl: (pid) => [{ src: API.__INITIAL_STATE__.epList[pid].cover, sizes: "960x600" }],
                        getPlaylistIndex: () => API.__INITIAL_STATE__.epList.reduce((s, d, i) => { s[d.cid] = i; return s; }, {})[API.cid]
                    });
                }
            }
        }
        new Bangumi();
    }
    catch (e) {
        toast.error("bangumi.js", e);
        API.importModule("vector.js");
    }
})();
`;
    modules["episodeData.js"] = `/**
 * 本模块负责添加bangumi分集数据
 */
(function () {
    try {
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
                    debug.debug("总播放数", views.innerText, " 总弹幕数", danmakus.innerText);
                }
                let data = await xhr({
                    url: API.objUrl("https://api.bilibili.com/x/web-interface/archive/stat", { "aid": String(API.aid) }),
                    credentials: true
                }); // 获取分集数据
                data = API.jsonCheck(data).data;
                let view = data.view;
                let danmaku = data.danmaku;
                view = API.unitFormat(view);
                danmaku = API.unitFormat(danmaku);
                views.innerText = view;
                danmakus.innerText = danmaku;
                debug.debug("播放", view + " 弹幕", danmaku);
            }
            catch (e) {
                debug.error("episodeData.js", e);
            }
        });
    }
    catch (e) {
        debug.error("episodeData.js", e);
    }
})();
`;
    modules["restoreData.js"] = `/**
 * 本模块负责修复Bangumi页面数据错误
 */
(function () {
    try {
        // 修复追番数
        API.xhrhook(["bangumi.bilibili.com/ext/web_api/season_count?"], function (args) {
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4) {
                    try {
                        let response = API.jsonCheck(this.responseText);
                        response.result.favorites = response.result.follow;
                        Object.defineProperty(this, 'response', { writable: true });
                        Object.defineProperty(this, 'responseText', { writable: true });
                        this.response = this.responseText = JSON.stringify(response);
                    }
                    catch (e) {
                        debug.error("restoreData.js", e);
                    }
                }
            });
            args[1] = args[1].replace('bangumi.bilibili.com/ext/web_api/season_count', 'api.bilibili.com/pgc/web/season/stat');
        });
        // 修复片尾番剧推荐
        API.xhrhook(["api.bilibili.com/pgc/web/recommend/related/recommend"], function (args) {
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4) {
                    try {
                        let response = API.jsonCheck(this.responseText);
                        if (response.result && response.result.season)
                            response.result = response.result.season;
                        Object.defineProperty(this, 'response', { writable: true });
                        Object.defineProperty(this, 'responseText', { writable: true });
                        this.response = this.responseText = JSON.stringify(response);
                    }
                    catch (e) {
                        debug.error("restoreData.js", e);
                    }
                }
            });
        });
        // 修复番剧推荐
        API.xhrhook(["comment.bilibili.com/playtag"], function (args) {
            args[1] = "https://comment.bilibili.com/playtag,2-2?html5=1";
            restoreBangumiRecommand();
        });
        API.addCss(\`#bangumi_recommend_vertial .recom-list{
            height: 960px;
            overflow: auto;
        } .recom-list::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
        }\`, "recom-list");
        async function restoreBangumiRecommand() {
            let data = API.jsonCheck(await xhr({ url: API.objUrl("https://api.bilibili.com/pgc/web/recommend/related/recommend", { season_id: String(API.__INITIAL_STATE__.ssId) }) })).result;
            let result = API.jsonCheck(await xhr({ url: API.objUrl("https://api.bilibili.com/x/tag/info", { tag_name: API.__INITIAL_STATE__.mediaInfo.title }) }));
            result = API.jsonCheck(await xhr({ url: API.objUrl("https://api.bilibili.com/x/web-interface/tag/top", { tid: result.data.tag_id }) })).data;
            if (!document.querySelector(".bilibili-player-recommend")) {
                await new Promise(r => {
                    API.runWhile(() => document.querySelector(".bilibili-player-recommend"), r);
                });
            }
            result = result.reduce((s, d) => {
                s = s + \`<li class="recom-item">
                <a href="https://www.bilibili.com/video/av\${d.aid}" target="_blank" title="\${d.title}">
                <div class="recom-img"><div class="common-lazy-img">
                <img alt="\${d.title}" src="\${d.pic.replace("http:", "")}@224w_140h.webp" lazy="loaded">
                </div></div>
                <div class="recom-info">
                <div class="info-title">\${d.title}</div>
                <div class="info-count">
                <div class="play-count"><i></i><span>\${API.unitFormat(d.stat.view)}</span></div>
                <div class="danmu-count"><i></i><span>\${API.unitFormat(d.stat.danmaku)}</span></div>
                </div></div></a></li>\`;
                return s;
            }, "");
            // @ts-ignore：节点肯定存在
            document.querySelector(".recom-list.clearfix").innerHTML = result;
            data = data.reduce((s, d) => {
                s = s + \`<a class="bilibili-player-recommend-video" href="\${d.url}" target="_blank">
                <div class="bilibili-player-recommend-left">
                <img src="\${d.new_ep.cover || d.cover}@160w_100h.webp" alt="\${d.title}" class="mCS_img_loaded" />
                <span class="player-tooltips-trigger"><i class="bilibili-player-iconfont icon-22wait-normal"></i></span>
                </div>
                <div class="bilibili-player-recommend-right">
                <div class="bilibili-player-recommend-title" title="\${d.title}">\${d.title}</div>
                <div class="bilibili-player-recommend-click"><i class="bilibili-player-iconfont icon-12iconplayed"></i>\${API.unitFormat(d.stat.view)}</div>
                <div class="bilibili-player-recommend-danmaku"><i class="bilibili-player-iconfont icon-12icondanmu"></i>\${API.unitFormat(d.stat.danmaku)}</div>
                </div></a>\`;
                return s;
            }, '');
            let item = document.querySelector(".bilibili-player-recommend");
            if (!item.querySelector(".mCSB_container")) {
                await new Promise(r => {
                    API.runWhile(() => item.querySelector(".mCSB_container"), r, 500, 0);
                });
            }
            // @ts-ignorei：前面判定了存在节点
            item.querySelector(".mCSB_container").innerHTML = data;
        }
    }
    catch (e) {
        toast.error("restoreData.js", e);
    }
})();
`;
    modules["ad2info.js"] = `/**
 * 本模块负责将主页失效的广告区转化为资讯区
 */
(function () {
    try {
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
    }
    catch (e) {
        toast.error("ad2info.js", e);
    }
})();
`;
    modules["biliIndexRec.js"] = `/**
 * 本模块负责修复主页直播分区数据
 */
(function () {
    try {
        API.xhrhook(["api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRec"], function (args) {
            args[1] = args[1].includes("List") ? args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web') : args[1].replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web');
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4) {
                    try {
                        let response = this.responseText.replace(/preview_banner_list/, "preview").replace(/ranking_list/, "ranking").replace(/recommend_room_list/, "recommend");
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
                        Object.defineProperty(this, 'response', { writable: true });
                        Object.defineProperty(this, 'responseText', { writable: true });
                        this.response = this.responseText = JSON.stringify(response);
                    }
                    catch (e) {
                        debug.error("roomRecommend.js", e);
                    }
                }
            });
        });
    }
    catch (e) {
        toast.error("biliIndexRec.js", e);
    }
})();
`;
    modules["index.js"] = `/**
 * 本模块负责重写B站旧版主页
 */
(function () {
    try {
        class Index {
            constructor() {
                API.path.name = "index";
                config.rewriteMethod == "异步" ? this.prepareA() : this.prepareB();
            }
            async prepareA() {
                const data = (await xhr({
                    url: "https://api.bilibili.com/x/web-show/res/locs?pf=0&ids=4694,34,31",
                    responseType: "json"
                })).data;
                let result = { locsData: { 23: data[4694], 34: data[34], 31: data[31] } };
                config.indexLoc && this.reAD(result);
                window.__INITIAL_STATE__ = result;
                this.write();
            }
            prepareB() {
                const data = API.jsonCheck(xhr({
                    url: "https://api.bilibili.com/x/web-show/res/locs?pf=0&ids=4694,34,31",
                    async: false
                })).data;
                let result = { locsData: { 23: data[4694], 34: data[34], 31: data[31] } };
                config.indexLoc && this.reAD(result);
                window.__INITIAL_STATE__ = result;
                this.write();
            }
            reAD(data) {
                for (let key in data.locsData) {
                    if (Array.isArray(data.locsData[key])) {
                        data.locsData[key] = data.locsData[key].filter((d) => {
                            return d.is_ad ? (debug.debug("移除广告", key, d), false) : true;
                        });
                    }
                }
            }
            write() {
                window.__INITIAL_STATE__ = API.__INITIAL_STATE__;
                API.rewriteHTML(API.getModule("index.html"));
                // 移除无效节点
                API.runWhile(() => document.querySelector(".ver"), () => { var _a; return (_a = document.querySelector(".ver")) === null || _a === void 0 ? void 0 : _a.remove(); });
                API.runWhile(() => document.querySelector("#fixed_app_download"), () => { var _a; return (_a = document.querySelector("#fixed_app_download")) === null || _a === void 0 ? void 0 : _a.remove(); });
                // 修复失效分区
                API.importModule("indexSort.js");
            }
        }
        new Index();
    }
    catch (e) {
        toast.error("index.js", e);
        API.importModule("vector.js");
    }
})();
`;
    modules["indexRecommend.js"] = `/**
 * 本模块负责取消主页个性化推荐
 */
(function () {
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
                indexRecommend = indexRecommend && indexRecommend.length > 20 ? indexRecommend : API.jsonCheck(await xhr({
                    url: "https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3",
                    credentials: !config.privateRecommend
                })).data.item; // 请求推荐数据，分情况，个性化推荐每次都请求，全站推荐只请求一次
                indexFlag = indexRecommend.length < 20 ? 10 : indexFlag || ((API.uid && config.privateRecommend) ? 10 : 20); // 设置遍历起始点，个性化推荐固定为10
                wait.remove(); // 移除loading节点
                for (let i = indexFlag - 1; i >= indexFlag - 10; i--) {
                    // 依次创建推荐数据，长度固定为10
                    API.addElement("div", { class: "groom-module home-card" }, node, undefined, true).innerHTML = \`<a href="//www.bilibili.com/video/av\${indexRecommend[i].aid || indexRecommend[i].id}" target="_blank" title="\${indexRecommend[i].title}">
                        <img src="\${indexRecommend[i].pic.replace("http:", "")}@160w_100h.webp" alt="\${indexRecommend[i].title}" width="160" height="100" class="pic">
                        "><!----><div class="card-mark"><p class="title">\${indexRecommend[i].title}</p><p class="author">up主：\${indexRecommend[i].owner.name}</p><p class="play">播放：\${API.unitFormat(indexRecommend[i].stat.view)}</p></div></a><div class="watch-later-trigger w-later"></div></div>\`;
                }
                indexFlag = indexRecommend.length < 20 ? 10 : indexFlag < 30 ? indexFlag + 10 : 10; // 对于全站推荐，刷新遍历起始点
            };
            prev.click(); // 移除个性化推荐
        }
        catch (e) {
            debug.error("indexRecommend.js", e);
        }
    });
})();
`;
    modules["indexSort.js"] = `/**
 * 本模块负责修复主页失效分区
 */
(function () {
    try {
        API.importModule("biliIndexRec.js");
        API.importModule("ad2info.js");
        API.importModule("mediaRank.js");
        API.importModule("indexRecommend.js");
        // 广告取转资讯区
        API.jsonphook(["region", "rid=165"], function (xhr) {
            xhr.url = xhr.url.replace("rid=165", "rid=202");
        });
        // 用户热点最新投稿修复资讯区最新投稿
        API.jsonphook(["newlist", "rid=165"], function (xhr) {
            xhr.url = xhr.url.replace("rid=165", "rid=203");
        });
        // 取消原创排行榜
        API.jsonphook(["region", "original=1"], function (xhr) {
            xhr.url = xhr.url.replace("original=1", "original=0");
        });
        // 修复置顶推荐
        API.jsonphook(["api.bilibili.com/x/web-interface/ranking/index"], function (xhr) {
            xhr.url = xhr.url.replace("ranking/index", "index/top");
        });
    }
    catch (e) {
        toast.error("indexSort.js", e);
    }
})();
`;
    modules["mediaRank.js"] = `/**
 * 本模块负责将主页电影、电视剧、纪录片排行转化为番剧样式
 */
(function () {
    try {
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
                let data = await xhr({ url: API.objUrl("https://api.bilibili.com/pgc/season/rank/web/list", { season_type: sort[1], day: '3' }) });
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
                        fw.innerHTML = '<div class="v-preview clearfix"><div class="lazy-img cover"><img alt="' + data.list[i].title + '" src="' + data.list[i].cover + '" /></div><div><p class="title">' + data.list[i].title + '</p><p class="desc">' + data.list[i].new_ep.index_show + '</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>' + API.unitFormat(data.list[i].stat.view) + '</span><span class="danmu"><i class="icon"></i>' + API.unitFormat(data.list[i].stat.danmaku) + '</span><span class="fav"><i class="icon"></i>' + API.unitFormat(data.list[i].stat.follow) + '</span></div>';
                        document.body.appendChild(fw);
                    };
                    li.onmouseout = () => fw.remove();
                    div.appendChild(li);
                }
            }
            catch (e) {
                debug.error("indexSort.js", e);
            }
        }
        API.runWhile(() => document.querySelector("#bili_movie"), () => fixRank(document.querySelector("#bili_movie")));
        API.runWhile(() => document.querySelector("#bili_teleplay"), () => fixRank(document.querySelector("#bili_teleplay")));
        API.runWhile(() => document.querySelector("#bili_documentary"), () => fixRank(document.querySelector("#bili_documentary")));
    }
    catch (e) {
        toast.error("mediaRank.js", e);
    }
})();
`;
    modules["live.js"] = `/**
 * 本模块负责引导直播相关模块
 */
(function () {
    try {
        config.liveStream && API.importModule("liveStream.js");
        config.liveP2p && API.importModule("WebRTC.js");
        config.sleepCheck && API.importModule("sleepCheck.js");
        config.anchor && API.runWhile(() => document.querySelector("anchor-guest-box-id"), () => { var _a; return (_a = document.querySelector("anchor-guest-box-id")) === null || _a === void 0 ? void 0 : _a.remove(); }, 500, 0);
        config.pkvm && API.runWhile(() => document.querySelector("chaos-pk-vm"), () => { var _a; return (_a = document.querySelector("chaos-pk-vm")) === null || _a === void 0 ? void 0 : _a.remove(); }, 500, 0);
        API.runWhile(() => document.querySelector(".web-player-icon-roomStatus"), () => { var _a; return (_a = document.querySelector(".web-player-icon-roomStatus")) === null || _a === void 0 ? void 0 : _a.remove(); });
    }
    catch (e) {
        toast.error("live.js", e);
    }
})();
`;
    modules["liveStream.js"] = `/**
 * 本模块负责拦截直播间流媒体
 */
(function () {
    try {
        Object.defineProperty(window, "__NEPTUNE_IS_MY_WAIFU__", { get: () => undefined, set: () => true });
        API.xhrhook(["api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo"], function (args) {
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4) {
                    try {
                        let response = API.jsonCheck(this.responseText);
                        response.data.live_time = -1;
                        response.data.playurl_info = null;
                        if (response.data) {
                            response.data.live_status = 0;
                        }
                        toast.warning("已拦截直播流，可在设置中解除限制！");
                        Object.defineProperty(this, 'response', { writable: true });
                        Object.defineProperty(this, 'responseText', { writable: true });
                        this.response = this.responseText = JSON.stringify(response);
                    }
                    catch (e) {
                        debug.error("liveStream.js", e);
                    }
                }
            });
        });
    }
    catch (e) {
        toast.error("liveStream.js", e);
    }
})();
`;
    modules["sleepCheck.js"] = `/**
 * 本模块负责禁用直播间挂机检测
 */
(function () {
    try {
        const fun = setInterval;
        let flag = 0;
        window.setInterval = (...args) => {
            if (args[1] && args[1] == 300000 && args[0] && args[0].toString() == "function(){e.triggerSleepCallback()}") {
                if (!flag) {
                    toast.warning("成功阻止直播间挂机检测！");
                    flag++;
                }
                return Number.MIN_VALUE;
            }
            return fun.call(window, ...args);
        };
    }
    catch (e) {
        toast.error("sleepCheck.js", e);
    }
})();
`;
    modules["WebRTC.js"] = `/**
 * 本模块负责禁用WebRTC以禁止直播间p2p共享
 * 代码参看了WebRTC Control的源码，非常感谢！
 * @see WebRTC-Control {@link https://mybrowseraddon.com/webrtc-control.html}
 */
// @ts-nocheck
try {
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
    toast.warning("禁用直播间P2P上传！");
}
catch (e) {
    API.trace(e, "WebRTC.js", true);
}
`;
    modules["11783021.js"] = `/**
 * 本模块负责修复对于番剧出差(uid=11783021)空间的访问
 */
(function () {
    try {
        /**
         * 备份的uid信息，可能需要偶尔更新一下？
         */
        const response = {
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
                "rank": "10000",
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
        };
        API.xhrhook(["api.bilibili.com/x/space/acc/info"], function (args) {
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4) {
                    if (this.responseText && this.responseText.includes("-404")) {
                        Object.defineProperty(this, 'response', { writable: true });
                        Object.defineProperty(this, 'responseText', { writable: true });
                        this.response = this.responseText = JSON.stringify(response);
                        toast.warning("该用户被404，已使用缓存数据恢复访问！");
                    }
                }
            });
        });
    }
    catch (e) {
        toast.error("11783021.js", e);
    }
})();
`;
    modules["album.js"] = `/**
 * 本模块负责将空间中相簿的链接从动态重定向回去
 */
(function () {
    try {
        API.xhrhook(["api.bilibili.com/x/dynamic/feed/draw/doc_list"], function (args) {
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4) {
                    let response = JSON.parse(this.responseText);
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
                }
            });
        });
    }
    catch (e) {
        debug.error("album.js", e);
    }
})();
`;
    modules["jointime.js"] = `/**
 * 本模块负责添加空间账号注册时间信息
 */
(async function () {
    try {
        if (!document.querySelector(".user-info-title")) {
            await new Promise(r => {
                API.runWhile(() => document.querySelector(".user-info-title"), r);
            });
        }
        let data = API.jsonCheck(await xhr.GM({ url: API.objUrl("https://account.bilibili.com/api/member/getCardByMid", { "mid": API.mid }) }));
        let jointime = API.timeFormat(data.card.regtime * 1000, true);
        let node = document.querySelector(".user-info-title");
        API.addElement("span", { class: "info-jointime" }, node, jointime);
    }
    catch (e) {
        toast.error("jsontime.js", e);
    }
})();
`;
    modules["lostVideo.js"] = `/**
 * 本模块负责获取收藏、频道中的失效视频信息
 */
(function () {
    try {
        async function getLostVideo(aid) {
            let result = []; // 失效视频信息缓存
            try { // 尝试访问Biliplus
                let data = await xhr.GM({ url: \`https://www.biliplus.com/video/av\${aid}\` });
                if (data.match(/\\<title\\>.+?\\ \\-\\ AV/)) {
                    result[0] = data.match(/\\<title\\>.+?\\ \\-\\ AV/)[0].replace(/<title>/, "").replace(/ - AV/, "");
                    result[1] = data.match(/\\<img style=\\"display:none\\"\\ src=\\".+?\\"\\ alt/)[0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
                }
            }
            catch (e) {
                debug.error("lostVideo.js", e);
            }
            if (!result[0] || !result[1]) {
                try { // 标题或封面无效，尝试访问Biliplus CID缓存库
                    let data = await xhr.GM({ url: \`https://www.biliplus.com/all/video/av\${aid}/\` });
                    if (data.match('/api/view_all?')) {
                        data = data.match(/\\/api\\/view_all\\?.+?\\',cloudmoe/)[0].replace(/\\',cloudmoe/, "");
                        data = await xhr.GM({ url: \`//www.biliplus.com\${data}\` });
                        data = API.jsonCheck(data).data;
                        result[0] = result[0] || data.info.title;
                        result[1] = result[1] || data.info.pic;
                    }
                }
                catch (e) {
                    debug.error("lostVideo.js", e);
                }
            }
            if (!result[0] || !result[1]) {
                try { // 标题或封面依旧无效，尝试访问jijidown
                    let data = await xhr.GM({ url: \`https://www.jijidown.com/video/\${aid}\` });
                    if (data.match('window._INIT')) {
                        result[0] = result[0] || data.match(/\\<title\\>.+?\\-哔哩哔哩唧唧/)[0].replace(/<title>/, "").replace(/-哔哩哔哩唧唧/, "");
                        result[1] = result[1] || data.match(/\\"img\\":\\ \\".+?\\",/)[0].match(/http.+?\\",/)[0].replace(/",/, "");
                    }
                }
                catch (e) {
                    debug.error("lostVideo.js", e);
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
    }
    catch (e) {
        toast.error("lostVideo.js", e);
    }
})();
`;
    modules["space.js"] = `/**
 * 本模块负责引导个人空间相关的模块
 */
(function () {
    try {
        API.mid = (API.path[3] && API.path[3].split("?")[0]) || API.mid;
        config.errands && API.mid == 11783021 && API.importModule("11783021.js");
        config.album && API.importModule("album.js");
        config.jointime && API.importModule("jointime.js");
        config.lostVideo && API.importModule("lostVideo.js");
    }
    catch (e) {
        toast.error("space.js", e);
    }
})();
`;
    modules["accesskey.js"] = `/**
 * 本模块负责获取账户授权的高级操作
 * 用于提供给代理服务器以获取区域/APP限制视频源，实际上不进行授权也行，以游客身份一般一样能获取最高1080P的视频源，而限制视频一般也不要求大会员
 * **账户授权意味着第三方拥有您B站账号的访问权限，如非必要请不要进行操作！**
 */
(function () {
    class Accesskey {
        constructor() {
            this.access_key = GM.getValue("access_key", "");
            this.access_date = GM.getValue("access_date", 0);
            this.num = 0;
            this.box = API.element.popupbox({ maxWidth: "360px", maxHeight: "300px" });
            API.addElement("div", { style: 'text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;' }, this.box, \`<span>账户授权<span>\`);
            API.addElement("div", { style: 'margin-bottom: 10px;' }, this.box, \`<div>授权代理服务器使用您的账户权限，以在限制视频等操作中继承您的大会员权益。
            <strong>这意味着第三方拥有您的账户访问权限，请充分考虑其中干系后谨慎操作！</strong>
            如果只是为了解除视频限制，以“游客”身份也一样可以获取到最高1080P的视频源，而且一般不会有大会员专享限制。
            </br>※ 鉴权有效期一般在一个月左右，若是失效需要手动重新授权，脚本不会代为检查。</div>\`);
            this.box.appendChild(API.element.hr());
            const body = API.addElement("div", { style: "display: flex;align-items: center;justify-content: space-around;margin-bottom: 10px;" }, this.box);
            this.enable = body.appendChild(API.element.button(() => { this.access(); }, "开始授权", 3));
            this.disable = body.appendChild(API.element.button(() => { this.abort(); }, "取消授权", 10));
            this.box.appendChild(API.element.hr());
            this.foot = API.addElement("div", { style: "display: flex;align-items: center;justify-content: space-around;" }, this.box);
            this.flesh();
        }
        flesh() {
            if (this.access_key) {
                const temp = API.element.button(() => { this.access(); }, "重新授权", 3);
                this.enable.replaceWith(temp);
                this.disable.style.display = "block";
                this.enable = temp;
                this.foot.innerHTML = \`<div>授权状态：已授权</div><div>授权日期：\${API.timeFormat(this.access_date, true)}</div>\`;
            }
            else {
                const temp = API.element.button(() => { this.access(); }, "开始授权", 3);
                this.enable.replaceWith(temp);
                this.enable = temp;
                this.disable.style.display = "none";
                this.foot.innerHTML = \`<div>授权状态：未授权</div><div> </div>\`;
            }
        }
        async access() {
            if (!API.uid)
                return (toast.warning("请先登录！"), API.biliQuickLogin());
            toast("您正在进行账户授权操作，请稍候~");
            let data = await xhr.GM({
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
            data = API.urlObj(data);
            await new Promise((resolve, reject) => { this.pluslogin(data, resolve, reject); });
            this.access_key = data.access_key;
            this.access_date = new Date().getTime();
            GM.setValue("access_key", this.access_key);
            GM.setValue("access_date", this.access_date);
            toast.success("账户授权成功！");
            this.flesh();
        }
        async abort() {
            toast("正在取消账户授权，请稍候~");
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
            toast.success("已取消账户授权并销毁痕迹！");
            this.flesh();
        }
        pluslogin(data, resolve, reject) {
            this.num++;
            const iframe = document.createElement("iframe");
            iframe.setAttribute("style", "width: 0px;height: 0px;");
            iframe.src = API.objUrl("https://www.biliplus.com/login", data);
            iframe.onload = () => {
                iframe.remove();
                resolve();
            };
            iframe.onerror = ev => {
                if (this.num < 4) {
                    toast.error("授权出错！将在3秒后重试~", ev);
                    setTimeout(() => this.pluslogin(data, resolve, reject), 3e3);
                }
                else {
                    toast.error("重试终止！请参考控制台报错信息~");
                    reject(ev);
                }
            };
            document.body.appendChild(iframe);
        }
    }
    API.showAccesskey = () => {
        try {
            new Accesskey();
        }
        catch (e) {
            toast.error("accesskey.js", e);
        }
    };
})();
`;
    modules["allDanmaku.js"] = `/**
 * 本模块负责提供全弹幕装填工具
 */
(function () {
    class AllDanmaku {
        constructor(callback) {
            this.danmaku = [];
            this.callback = callback;
            toast("正在尝试获取全部弹幕请耐心等待。。。", "冷却延时请尽量调大，以免短时间内大量请求被临时封端口！");
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
            this.pubdate = API.timeFormat(this.pubdate, true).split(" ")[0]; // 视频上传日期
            this.today = API.timeFormat(undefined, true).split(" ")[0]; // 当天日期
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
                return toast.warning("本功能需要登录！");
            if (!this.pubdate)
                return toast.warning("投稿日期获取失败！无法获取全部弹幕！");
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
                toast("正在获取 " + this.time + " 日的弹幕。。。");
                let danmaku = await API.getHistoryDanmaku(this.time);
                API.sortDmById(danmaku, "idStr");
                danmaku.reverse();
                // 取最早一条弹幕的时间
                this.time = API.timeFormat(danmaku[danmaku.length - 1].ctime * 1000, true).split(" ")[0];
                this.danmaku = this.danmaku.concat(danmaku);
                toast("数据返回！已获取弹幕数：" + API.unitFormat(this.danmaku.length));
                this.arrT = this.time.split("-");
                // 如果当天不是投稿日，转入日期检查
                if (this.pubdate != this.today)
                    return this.check();
                // 否则结束弹幕获取，当前弹幕就是能获取到的全弹幕
                this.done(1);
            }
            catch (e) {
                e = Array.isArray(e) ? e : [e];
                toast.error("全弹幕装填", ...e);
                // 弹幕获取出错，载入已获取的弹幕
                if (this.danmaku[0]) {
                    toast.warning("弹幕获取出错！", "保留并载入已获取的弹幕");
                    this.done();
                }
                else {
                    this.callback && this.callback();
                    toast.error("弹幕获取出错！", "已退出！");
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
                let data = await xhr({
                    url: API.objUrl("https://api.bilibili.com/x/v2/dm/history/index", {
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
                        toast(\`技能冷却中。。。请稍待 \${config.allDanmakuDelay} 秒钟\`);
                        return setTimeout(() => this.init(), config.allDanmakuDelay * 1000);
                    }
                    else {
                        // 当月有弹幕但都不在已请求日之前，月份 -1 重载
                        if (this.arrT[1] > 1) {
                            this.arrT[1]--;
                            this.arrT[1] = (Array(2).join('0') + this.arrT[1]).slice(-2);
                        }
                        else
                            this.arrT = [this.arrT[0] - 1, 12, 31];
                        toast(\`获取前一个月数据 \${this.arrT.slice(0, 2).join("-")} 请稍待 \${config.allDanmakuDelay} 秒钟\`);
                        return setTimeout(() => this.check(), config.allDanmakuDelay * 1000);
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
                    toast(\`获取前一个月数据 \${this.arrT.slice(0, 2).join("-")} 请稍待 \${config.allDanmakuDelay} 秒钟\`);
                    return setTimeout(() => this.check(), config.allDanmakuDelay * 1000);
                }
            }
            catch (e) {
                e = Array.isArray(e) ? e : [e];
                toast.error("全弹幕装填", ...e);
                // 弹幕获取出错，载入已获取的弹幕
                if (this.danmaku[0]) {
                    toast.warning("弹幕获取出错！", "保留并载入已获取的弹幕");
                    this.done();
                }
                else {
                    this.callback && this.callback();
                    toast.error("弹幕获取出错！", "已退出！");
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
                toast("正在获取BAS/代码弹幕专包。。。");
                this.danmaku = this.danmaku.concat(await API.getSegDanmaku(undefined, undefined, true));
                toast("数据返回！正在整合。。。");
            }
            catch (e) { }
            let danmaku = API.danmakuFormat(this.danmaku, API.aid);
            if (boolean)
                toast.success("全弹幕获取成功，正在装填。。。", "总弹幕量：" + API.unitFormat(this.danmaku.length), "同时推送至下载面板，可右键保存 π_π");
            (_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku(danmaku);
            API.danmaku = danmaku;
            this.callback && this.callback();
        }
    }
    API.allDanmaku = (callback) => {
        try {
            new AllDanmaku(callback);
        }
        catch (e) {
            toast.error("allDanmaku.js", e);
        }
    };
})();
`;
    modules["autoFix.js"] = `/**
 * 本模块负责一些自动化处理
 */
(function () {
    try {
        function bofqiToView() {
            let str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
            let node = str.reduce((s, d) => {
                s = s || document.querySelector(d);
                return s;
            }, document.querySelector("#__bofqi"));
            node && node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        API.switchVideo(() => {
            config.danmakuFirst && document.querySelectorAll(".bilibili-player-filter-btn")[1].click();
            setTimeout(() => {
                config.showBofqi && bofqiToView();
                config.screenWide && document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-widescreen.icon-24wideoff") && document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").click();
                if (config.noDanmaku && !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off")) {
                    if (document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku")) {
                        document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku").click(); // 自动关闭弹幕
                    }
                }
            }, 500);
            config.autoPlay && setTimeout(() => { window.player && window.player.play && window.player.play(); }, 1000);
        });
        API.path.name && API.observerAddedNodes(e => {
            if (e.className && /bilibili-player-danmaku-setting-lite-panel/.test(e.className)) {
                API.runWhile(() => document.querySelector(".bilibili-player-setting-dmask-wrap"), () => {
                    const node = document.querySelector(".bilibili-player-setting-dmask-wrap").parentElement;
                    const lebel = API.addElement("label", { class: "bpui-checkbox-text", style: "cursor: pointer;display: inline-table;" }, node, "本地文件");
                    const input = API.addElement("input", { type: "file", accept: ".mp4,.xml,.json", multiple: "multiple", style: "width: 0;" }, lebel);
                    input.onchange = () => {
                        var _a;
                        (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku)) && toast.warning("内部组件丢失，无法载入弹幕文件！");
                        API.localMedia(input.files);
                    };
                });
            }
        });
    }
    catch (e) {
        debug.error("autoFix.js", e);
    }
})();
`;
    modules["banner.js"] = `/**
 * 本模块负责替换顶栏动图接口
 * 本模块动态banner相关代码移植自B站header.js
 */
(function () {
    var _a;
    try {
        class Animate {
            constructor(v) {
                /**
                 * 有在启用了动画banner的配置，且浏览器支持css filter时才加载动画banner的图片资源
                 * safari浏览器在mac屏幕上模糊效果有性能问题，不开启
                 */
                this.animatedBannerSupport = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('filter: blur(1px)')
                    && !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                this.resources = [];
                /**
                 * container 元素上有其他元素，需使用全局事件判断鼠标位置
                 */
                this.entered = false;
                this.extensions = [];
                if (this.animatedBannerSupport)
                    this.mounted(v);
                API.addCss(API.getModule("animated-banner.css"), "animated-banner");
                if (v.is_split_layer !== 0) {
                    let timer = setInterval(() => {
                        const blur = document.querySelector(".blur-bg");
                        blur && blur.remove();
                    }, 100);
                    setTimeout(() => clearTimeout(timer), 60 * 1000);
                }
                else
                    API.addCss(".blur-bg {background:none !important;-webkit-backdrop-filter: blur(4px);backdrop-filter: blur(4px)}");
            }
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
                this.layerConfig = JSON.parse(v.split_layer);
                if (!this.layerConfig.layers)
                    return;
                try {
                    await Promise.all(this.layerConfig.layers.map(async (v, index) => {
                        return Promise.all(v.resources.map(async (i) => {
                            if (/\\.(webm|mp4)\$/.test(i.src)) {
                                const res = await xhr({ url: i.src, responseType: "blob" });
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
                    debug.error('load animated banner images error', e);
                    return;
                }
                let container = document.querySelector("#banner_link");
                if (!container) {
                    container = document.querySelector(".h-center");
                    if (!container)
                        return;
                    container.parentElement.removeAttribute("style");
                    container.style.width = "100%";
                    container.style.top = "-42px";
                    container.style.marginBottom = "-42px";
                    container.innerHTML = "";
                    document.querySelector(".b-header-mask-wrp").remove();
                }
                ;
                container.classList.add("animated-banner");
                let containerHeight = container.clientHeight;
                let containerWidth = container.clientWidth;
                let containerScale = containerHeight / 155;
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
                    return v => v > 0 ? o(v) : -o(-v);
                };
                let lastDisplace = NaN;
                // 根据鼠标位置改变状态
                const af = t => {
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
                                const itp = v.scale.offsetCurve ? curveParameterToFunc(v.scale.offsetCurve) : (x => x);
                                const offset = x * itp(displace);
                                transform.scale = v._initState.scale + offset;
                            }
                            if (v.rotate) {
                                const x = v.rotate.offset || 0;
                                const itp = v.rotate.offsetCurve ? curveParameterToFunc(v.rotate.offsetCurve) : (x => x);
                                const offset = x * itp(displace);
                                transform.rotate = v._initState.rotate + offset;
                            }
                            if (v.translate) {
                                const x = v.translate.offset || [0, 0];
                                const itp = v.translate.offsetCurve ? curveParameterToFunc(v.translate.offsetCurve) : (x => x);
                                const offset = x.map(v => itp(displace) * v);
                                const translate = v._initState.translate.map((x, i) => { var _b; return (x + offset[i]) * containerScale * (((_b = v.scale) === null || _b === void 0 ? void 0 : _b.initial) || 1); });
                                transform.translate = translate;
                            }
                            a.style.transform = \`scale(\${transform.scale})\` +
                                \`translate(\${transform.translate[0]}px, \${transform.translate[1]}px)\` +
                                \`rotate(\${transform.rotate}deg)\`;
                            if (v.blur) {
                                const x = v.blur.offset || 0;
                                const itp = v.blur.offsetCurve ? curveParameterToFunc(v.blur.offsetCurve) : (x => x);
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
                                const itp = v.opacity.offsetCurve ? curveParameterToFunc(v.opacity.offsetCurve) : (x => x);
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
                        debug.error(e);
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
                    const leaveAF = t => {
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
                    containerScale = containerHeight / 155;
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
        Animate.rid = _a.resourceId();
        Animate.locs = [1576, 1612, 1580, 1920, 1584, 1588, 1592, 3129, 1600, 1608, 1604, 1596, 2210, 1634, 142];
        config.bannerGif && API.jsonphook(["api.bilibili.com/x/web-interface/index/icon"], function (xhr) {
            const obj = API.urlObj(xhr.url);
            let callback = obj.callback;
            let call = window[callback];
            if (call) {
                window[callback] = function (v) {
                    v.data = API.randomArray(JSON.parse(GM.getResourceText("index-icon.json")).fix, 1)[0];
                    return call(v);
                };
            }
        });
        let tag = false; // 防止二度请求
        API.jsonphook(["api.bilibili.com/x/web-show/res/loc"], function (jsonp) {
            const obj = API.urlObj(jsonp.url);
            let callback = obj.callback;
            let call = window[callback];
            if (call) {
                window[callback] = function (v) {
                    const data = GM.getValue("banner");
                    Animate.locs.forEach(d => {
                        v.data[d] && (v.data[d][0].pic = (data && data.pic) || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png",
                            v.data[d][0].litpic = (data && data.litpic),
                            v.data[d][0].url = (data && data.url) || "",
                            v.data[d][0].title = (data && data.name) || "");
                        if (jsonp.url.includes("loc?") && obj.id == String(d)) {
                            v.data[0].pic = (data && data.pic) || "//i0.hdslb.com/bfs/activity-plat/static/20171220/68a052f664e8414bb594f9b00b176599/images/90w1lpp6ry.png";
                            v.data[0].litpic = (data && data.litpic) || "";
                            v.data[0].url = (data && data.url) || "";
                            v.data[0].title = (data && data.name) || "";
                        }
                    });
                    return call(v);
                };
            }
            if (tag)
                return;
            tag = true;
            xhr({
                url: \`https://api.bilibili.com/x/web-show/page/header?resource_id=\${Animate.rid}\`,
                responseType: "json",
                credentials: true
            }).then((d) => {
                GM.setValue("banner", d.data);
                new Animate(d.data);
            });
        });
    }
    catch (e) {
        toast.error("banner.js", e);
    }
})();
`;
    modules["closedCaption.js"] = `/**
 * 本模块负责处理CC字幕
 * 代码移植自 Bilibili CC 字幕工具，源项目信息如下
 * @see indefined {@link https://github.com/indefined/UserScripts/tree/master/bilibiliCCHelper}
 */
(function () {
    class ClosedCaption {
        constructor() {
            this.element = {}; // 节点集合
            this.data = {}; // 字幕缓存
            this.resizeRate = 100; // 字幕大小倍率
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
        /**
         * 绘制字幕面板
         */
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
        /**
         * 切换字幕样式
         */
        changeStyle() {
            var _a;
            (_a = document.querySelector("#caption-style")) === null || _a === void 0 ? void 0 : _a.remove();
            API.addCss(\`span.subtitle-item-background{opacity: \${this.setting.backgroundopacity};}
            span.subtitle-item-text {color:#\${("000000" + this.setting.color.toString(16)).slice(-6)};}
            span.subtitle-item {font-size: \${this.setting.fontsize * this.resizeRate}%;line-height: 110%;}
            span.subtitle-item {\${this.shadow[this.setting.shadow].style}}\`, "caption-style");
            GM.setValue("subtitle", this.setting);
        }
        /**
         * 切换字幕大小
         */
        changeResize() {
            this.resizeRate = this.setting.scale ? window.player.getWidth() / 1280 * 100 : 100;
            this.changeStyle();
        }
        /**
         * 切换字幕位置
         */
        changePosition() {
            this.contain = document.querySelector(".bilibili-player-video-subtitle>div");
            this.contain.className = 'subtitle-position subtitle-position-'
                + (this.setting.position || 'bc');
            this.contain.style = '';
            GM.setValue("subtitle", this.setting);
        }
        /**
         * 字幕图标切换
         * @param caption
         */
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
        /**
         * 字幕选择
         */
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
            //     API.importModule("download");
            //     API.config.reset.dlother = 1; // 开启其他下载
            //     API.download(); // 拉起下载面板
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
        /**
         * 字幕大小
         */
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
        /**
         * 字幕颜色
         */
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
        /**
         * 字幕阴影
         */
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
        /**
         * 字幕位置
         */
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
        /**
         * 字幕透明度
         */
        fontopacrity() {
            this.element.fontopacrity = API.addElement("div", {}, this.element.table);
            this.element.fontopacrity.innerHTML = \`<div>背景不透明度</div><input type="range" style="width: 100%;">\`;
            this.element.fontopacrity.children[1].value = this.setting.backgroundopacity * 100;
            this.element.fontopacrity.children[1].oninput = (e) => {
                this.changeStyle(this.setting.backgroundopacity = e.target.value / 100);
            };
        }
        /**
         * 获取CC字幕信息
         */
        async getCaption(data) {
            try {
                API.subtitle = this.captions = data.data.subtitle.subtitles || [];
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
                debug.error("closedCaption.js", e);
            }
        }
        /**
         * 设置CC字幕
         * @param caption CC字幕对象
         */
        async setCaption(caption) {
            let data = { body: [] }; // 空字幕
            if (caption && caption.subtitle_url) {
                this.data[caption.subtitle_url] = this.data[caption.subtitle_url] || await xhr({
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
    API.closedCaption = (data) => {
        try {
            new ClosedCaption().getCaption(data);
        }
        catch (e) {
            toast.error("closedCaption.js", e);
        }
    };
})();
`;
    modules["commentLinkDetail.js"] = `/**
 * 本模块负责将评论区超链接还原为av号
 */
(function () {
    let timer;
    API.observerAddedNodes((node) => {
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
})();
`;
    modules["danmakuHashId.js"] = `/**
 * 本模块负责实现反查弹幕发送者功能
 */
(function () {
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
                DanmakuHashId.catch[this.mid] = DanmakuHashId.catch[this.mid] || API.jsonCheck(await xhr({ url: API.objUrl("https://api.bilibili.com/x/web-interface/card", { mid: this.mid }) }));
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
                toast.error("danmakuHashId.js", e);
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
            toast.error("danmakuHashId.js", e);
        }
    };
})();
`;
    modules["heartbeat.js"] = `/**
 * 本模块负责处理可能被广告屏蔽拓展误伤的视频心跳
 */
(function () {
    try {
        API.xhrhook(['api.bilibili.com/x/report/web/heartbeat'], function (args) {
            args[1] = args[1].replace('api.bilibili.com/x/report/web/heartbeat', 'api.bilibili.com/x/click-interface/web/heartbeat');
        });
    }
    catch (e) {
        toast.error("replyList.js", e);
    }
})();
`;
    modules["infoNewNumber.js"] = `/**
 * 本模块负责修复资讯区新动态数目
 */
(function () {
    try {
        API.jsonphook(['api.bilibili.com/x/web-interface/online'], function (xhr) {
            const obj = API.urlObj(xhr.url);
            let callback = obj.callback;
            let call = window[callback];
            if (call) {
                window[callback] = function (v) {
                    v.data && (v.data.region_count[165] = v.data.region_count[202]);
                    return call(v);
                };
            }
        });
    }
    catch (e) {
        debug.error("replyList.js", e);
    }
})();
`;
    modules["localMedia.js"] = `/**
 * 本模块负责实现旧版播放器载入本地视频及弹幕功能
 */
(function () {
    class LocalMedia {
        constructor() {
            this.data = { xml: [], json: [], mp4: [] };
            this.offset = 0; // 弹幕当前偏移
            this.keyboard = false; // 是否已绑定键盘事件
        }
        /**
         * 读取文件地址
         */
        change(files) {
            const file = files;
            if (file.length === 0) {
                return toast.warning("请选择本地视频或弹幕文件！", "视频：.mp4（且符合浏览器支持的编码）", "弹幕：.xml, .json");
            }
            this.data = { xml: [], json: [], mp4: [] };
            this.data = Array.from(file).reduce((d, i) => {
                /\\.xml\$/.test(i.name) && d.xml.push(i); // xml弹幕
                /\\.json\$/.test(i.name) && d.json.push(i); // json弹幕
                /\\.mp4\$/.test(i.name) && d.mp4.push(i); // mp4视频
                return d;
            }, this.data);
            if (!this.data.xml[0] && !this.data.json[0] && !this.data.mp4[0]) {
                return toast.warning("未能识别到任何有效文件信息 →_→");
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
                    reject(toast.error('无效文件路径！'));
                const reader = new FileReader();
                reader.readAsText(file, 'utf-8');
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(toast.error('读取文件出错，请重试！'));
                };
            });
        }
        /**
         * 载入弹幕
         */
        async danmaku() {
            var _a;
            if (!API.loadLocalDm) {
                return toast.error("载入本地弹幕失败：本地弹幕组件丢失！");
            }
            if (!this.data.xml[0] && !this.data.json[0])
                return;
            this.data.xml.forEach(async (d, i) => {
                // 读取xml弹幕
                let data = await this.readFile(d);
                toast("本地弹幕：" + d.name, "载入模式：" + ((i || config.concatDanmaku) ? "与当前弹幕合并" : "替换当前弹幕"));
                API.loadLocalDm(data, Boolean(i) || config.concatDanmaku);
            });
            this.data.json.forEach(async (d, i) => {
                var _a;
                // 读取json弹幕
                let data = JSON.parse(await this.readFile(d)) || [];
                toast("本地弹幕：" + d.name, "载入模式：" + ((this.data.xml[0] || i || config.concatDanmaku) ? "与当前弹幕合并" : "替换当前弹幕"));
                (_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku(data, this.data.xml[0] || Boolean(i) || config.concatDanmaku);
            });
            API.bofqiMessage();
            this.offset = 0; // 记录或重置弹幕偏移时间
            if (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.offsetDanmaku))
                return toast.error("绑定键盘事件失败：弹幕偏移组件丢失！");
            else {
                toast("已绑定键盘事件", "可以通过键盘 , 和 . 两个键（即上标为 < 和 > 的两个键）提前或延后弹幕偏移，频度1秒/次");
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
        /**
         * 载入视频
         */
        video() {
            if (this.data.mp4[0]) {
                toast.warning("载入本地视频中...", "请无视控制台大量报错！");
                let video = document.querySelector("video");
                video.src = URL.createObjectURL(this.data.mp4[0]);
                toast.success("本地视频：" + this.data.mp4[0].name);
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
    const localMedia = new LocalMedia();
    API.localMedia = (files) => {
        try {
            localMedia.change(files);
        }
        catch (e) {
            toast.error("localMedia.js", e);
        }
    };
})();
`;
    modules["noVideo.js"] = `/**
 * 本模块负责强制拦截视频载入
 */
(function () {
    try {
        API.xhrhook(["/playurl?"], function (args) {
            let obj = API.urlObj(args[1]);
            obj.aid = 1, obj.cid = 1, obj.ep_id = 1;
            args[1] = API.objUrl(args[1].split("?")[0], obj);
        });
        API.switchVideo(() => {
            API.bofqiMessage(["拦截视频页媒体载入用于呼出下载面板", "取消拦截"], 3, () => {
                config.noVideo = false;
                window.BilibiliPlayer({ aid: API.aid, cid: API.cid });
            }, true);
        });
    }
    catch (e) {
        debug.error("noVideo.js", e);
    }
})();
`;
    modules["parameterTrim.js"] = `/**
 * 本模块负责处理URL，包括地址栏和a标签
 */
(function () {
    try {
        class ParameterTrim {
            constructor() {
                /**
                 * 过滤参数
                 */
                this.param = {
                    "spm_id_from": null,
                    "from_source": null,
                    "msource": null,
                    "bsource": null,
                    "seid": null,
                    "source": null,
                    "session_id": null,
                    "visit_id": null,
                    "sourceFrom": null,
                    "from_spmid": null
                };
                /**
                 * 地址变动参考
                 */
                this.url = [];
            }
            /**
             * 地址栏
             */
            location() {
                this.url[1] = location.href; // 暂存URL，以便比较URL变化
                if (this.url[0] != this.url[1]) {
                    let href = this.triming(location.href); // 处理链接
                    if (!href.includes("#") && location.href.includes("#"))
                        href = href + location.hash; // 还原锚
                    window.history.replaceState(null, "", href); // 推送到地址栏
                    this.url[0] = location.href; // 刷新暂存
                }
            }
            /**
             * 处理a标签
             * @param list a标签集
             */
            anchor(list) {
                list.forEach((d) => {
                    if (!d.href)
                        return;
                    let hash = (d.href.includes("?") && d.href.split("#")[1]) || "";
                    d.href.includes("bilibili.tv") && (d.href = d.href.replace("bilibili.tv", "bilibili.com"));
                    d.href.includes("www.bilibili.com/tag") && (d.href = d.href.replace("tag", "topic"));
                    d.href.includes("account.bilibili.com/login?act=exit") && (d.href = "javascript:void(0);", d.onclick = () => API.loginExit());
                    d.href = this.triming(d.href) + (hash ? "#" + hash : "");
                });
            }
            /**
             * 处理引导
             * @param url 源URL
             * @returns URL
             */
            triming(url) {
                let obj = this.search(url);
                url = this.hash(url);
                return API.objUrl(url, obj);
            }
            /**
             * 处理查询参数部分
             * @param url 源URL
             * @returns 参数对象
             */
            search(url) {
                let obj = API.urlObj(url);
                obj.bvid && (obj.aid = API.abv(obj.bvid)); // 存在bvid，添加aid
                obj.aid && !Number(obj.aid) && (obj.aid = API.abv(obj.aid)); // aid误为bvid，转化
                (obj.from && obj.from == "search") && (obj.from = null);
                obj = { ...obj, ...this.param };
                return obj;
            }
            /**
             * 处理非查询部分
             * @param url 源URL
             * @returns URL
             */
            hash(url) {
                let arr = url.split("?")[0].split("/"); // 分割URL
                arr.forEach((d, i, e) => {
                    d.includes("#") && (d = d.split("#")[0]);
                    (d.toLowerCase().startsWith('bv')) && (e[i] = "av" + API.abv(d));
                });
                return arr.join("/");
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
        // @ts-ignore 重写标记
        if (Before)
            return parameterTrim.location();
        API.switchVideo(() => { parameterTrim.location(); });
        API.observerAddedNodes(async (node) => {
            node.querySelectorAll && parameterTrim.anchor(node.querySelectorAll("a"));
            node.tagName == "A" && parameterTrim.anchor([node]);
        });
        document.addEventListener("click", e => parameterTrim.click(e), !1);
    }
    catch (e) {
        debug.error("parameterTrim.js", e);
    }
})();
`;
    modules["player-v2.js"] = `/**
 * 本模块负责获取视频信息以提供给CC字幕等模块
 * 视频信息接口\`https://api.bilibili.com/x/player/v2\`
 * 备用移动端接口\`https://api.bilibili.com/x/v2/dm/view\`
 */
(function () {
    try {
        API.switchVideo(() => {
            let ready = false; // 载入时机标记
            API.xhrhook(["api.bilibili.com/x/player/carousel.so"], function (args) { ready = true; });
            xhr({
                url: API.objUrl("https://api.bilibili.com/x/player/v2", { cid: API.cid, aid: API.aid }),
                responseType: "json",
                credentials: true
            }).catch((e) => {
                debug.error("autoFix.js", e);
                return xhr({
                    url: API.objUrl("https://api.bilibili.com/x/v2/dm/view", { oid: API.cid, aid: API.aid, type: 1 }),
                    responseType: "json",
                    credentials: true
                });
            }).then((data) => {
                API.runWhile(() => ready, () => {
                    var _a, _b, _c;
                    // CC字幕
                    ((_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.subtitle) === null || _b === void 0 ? void 0 : _b.subtitles) && API.closedCaption(data);
                    // 分段进度条
                    config.segProgress && ((_c = data === null || data === void 0 ? void 0 : data.data) === null || _c === void 0 ? void 0 : _c.view_points[1]) && API.segProgress(data);
                });
            });
        });
    }
    catch (e) {
        toast.error("player-v2.js", e);
    }
})();
`;
    modules["playinfoRecord.js"] = `/**
 * 本模块负责处理并记录playinfo信息
 */
(function () {
    API.xhrhook(["/playurl?"], function (args) {
        let obj = API.urlObj(args[1]);
        !obj.sign && (obj.fourk = 1, obj.fnval && (obj.fnval = 976)); // 杜比视界支持
        obj.avid && Number(obj.avid) && Reflect.set(API, "aid", obj.avid);
        !API.aid && obj.bvid && Reflect.set(API, "aid", API.abv(obj.bvid));
        obj.cid && Number(obj.cid) && Reflect.set(API, "cid", obj.cid);
        args[1] = API.objUrl(args[1].split("?")[0], obj); // 还原URL
        args[1].includes("84956560bc028eb7") && (args[1] = API.urlsign(args[1], {}, 8)); // 过滤无效key
        args[1].includes("pgc") && (API.pgc = true);
        this.addEventListener("readystatechange", async () => record.call(this));
    });
    function record() {
        try {
            if (this.readyState === 4) {
                if (!this.response)
                    throw this;
                API.__playinfo__ = typeof this.response == "object" ? this.response : API.jsonCheck(this.response);
            }
        }
        catch (e) {
            debug.error("playinfoRecord.js", e);
        }
    }
})();
`;
    modules["protoDm.js"] = `/**
 * 本模块负责使旧版播放器支持新版弹幕
 */
(function () {
    try {
        // 修复一般弹幕
        API.importModule("worker.js");
        // 修复历史弹幕
        let id = API.xhrhook(["history?type="], function (args) {
            var _a;
            if (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku)) {
                API.removeXhrhook(id);
                return toast.warning("内部组件丢失！");
            }
            let param = API.urlObj(args[1]);
            if (param.date) {
                Object.defineProperty(this, "response", { writable: true });
                Object.defineProperty(this, "readyState", { writable: true });
                Object.defineProperty(this, "status", { writable: true });
                Object.defineProperty(this, "send", { writable: true });
                this.readyState = 4;
                this.status = 200;
                this.send = () => { };
                let history = "https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=" + API.cid + "&date=" + param.date;
                xhr({
                    url: history,
                    responseType: "arraybuffer",
                    credentials: true
                }).then((seg) => {
                    var _a;
                    let segDm = API.segDmDecode(seg);
                    (_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku(API.danmaku = API.danmakuFormat(segDm));
                }).catch((e) => {
                    toast.error("载入历史弹幕失败", "请尝试刷新页面");
                    toast.error(e);
                });
            }
        });
    }
    catch (e) {
        toast.error("protoDm.js", e);
    }
})();
`;
    modules["rebuildPlayerurl.js"] = `/**
 * 本模块负责重建playurl为网页端类型
 */
(function () {
    try {
        const OBJ = {};
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
                return xhr({
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
                toast("重构DASH数据中...");
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
                        OBJ["sidx" + String(API.cid)] = OBJ["sidx" + String(API.cid)] || {};
                        let id = d.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
                        if (d.SegmentBase)
                            OBJ["sidx" + String(API.cid)][id] = [d.SegmentBase.Initialization, d.SegmentBase.indexRange];
                        if (!OBJ["sidx" + String(API.cid)][id]) {
                            let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                            let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                            // 首个“sidx”出现4字节之前的部分为索引起始点
                            let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                            // 首个“mooc”出现前5字节结束索引
                            let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                            // 挂载到BLOD下，切换清晰度直接继承使用（以cid为切p标记）
                            OBJ["sidx" + String(API.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                            debug("DASH-video：", id, OBJ["sidx" + String(API.cid)][id]);
                        }
                        d.segment_base = {
                            initialization: OBJ["sidx" + String(API.cid)][id][0],
                            index_range: OBJ["sidx" + String(API.cid)][id][1]
                        };
                        d.SegmentBase = {
                            Initialization: OBJ["sidx" + String(API.cid)][id][0],
                            indexRange: OBJ["sidx" + String(API.cid)][id][1]
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
                        OBJ["sidx" + String(API.cid)] = OBJ["sidx" + String(API.cid)] || {};
                        let id = d.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
                        if (d.SegmentBase)
                            OBJ["sidx" + String(API.cid)][id] = [d.SegmentBase.Initialization, d.SegmentBase.indexRange];
                        if (!OBJ["sidx" + String(API.cid)][id]) {
                            let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                            let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                            let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                            let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                            OBJ["sidx" + String(API.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                            debug("DASH-audio：", id, OBJ["sidx" + String(API.cid)][id]);
                        }
                        d.segment_base = {
                            initialization: OBJ["sidx" + String(API.cid)][id][0],
                            index_range: OBJ["sidx" + String(API.cid)][id][1]
                        };
                        d.SegmentBase = {
                            Initialization: OBJ["sidx" + String(API.cid)][id][0],
                            indexRange: OBJ["sidx" + String(API.cid)][id][1]
                        };
                        d.backupUrl = d.backup_url = d.backupUrl || d.backup_url || [];
                        d.baseUrl = d.base_url;
                        d.codecs = d.codecs || this.codecs.app[id] || this.codecs.default[id] || "mp4a.40.2";
                        d.mimeType = d.mime_type = d.mimeType || d.mime_type || 'audio/mp4';
                    })(e[i]));
                });
                toast("等待数据回传...");
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
                toast.success("DASH数据重构成功！", "正在投喂给播放器...");
                debug.log(this.playurl);
                return this.playurl;
            }
            /**
             * 重构Thailand数据
             * @param ogv 原始数据
             */
            async ogvPlayurl(ogv) {
                toast("重构DASH数据中...");
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
                            OBJ["sidx" + String(API.cid)] = OBJ["sidx" + String(API.cid)] || {};
                            let id = d.dash_video.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
                            if (!OBJ["sidx" + String(API.cid)][id]) {
                                let data = new Uint8Array(await this.getIdxs(d.dash_video.base_url, this.playurl.dash.duration));
                                let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                                let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                                let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                                OBJ["sidx" + String(API.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                                debug("DASH-video：", id, OBJ["sidx" + String(API.cid)][id]);
                            }
                            this.playurl.dash.video.push({
                                SegmentBase: {
                                    Initialization: OBJ["sidx" + String(API.cid)][id][0],
                                    indexRange: OBJ["sidx" + String(API.cid)][id][1]
                                },
                                segment_base: {
                                    initialization: OBJ["sidx" + String(API.cid)][id][0],
                                    index_range: OBJ["sidx" + String(API.cid)][id][1]
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
                        OBJ["sidx" + String(API.cid)] = OBJ["sidx" + String(API.cid)] || {};
                        let id = d.base_url.match(/[0-9]+\\.m4s/)[0].split(".")[0];
                        if (!OBJ["sidx" + String(API.cid)][id]) {
                            let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                            let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                            let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                            let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                            OBJ["sidx" + String(API.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                            debug("DASH-audio：", id, OBJ["sidx" + String(API.cid)][id]);
                        }
                        this.playurl.dash.audio.push({
                            SegmentBase: {
                                Initialization: OBJ["sidx" + String(API.cid)][id][0],
                                indexRange: OBJ["sidx" + String(API.cid)][id][1]
                            },
                            segment_base: {
                                initialization: OBJ["sidx" + String(API.cid)][id][0],
                                index_range: OBJ["sidx" + String(API.cid)][id][1]
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
                toast("等待数据回传...");
                await Promise.all(arr);
                toast.success("DASH数据重构成功！", "正在投喂给播放器...");
                debug.log(this.playurl);
                return this.playurl;
            }
        }
        API.RebuildPlayerurl = RebuildPlayerurl;
    }
    catch (e) {
        toast.error("rebuildPlayerurl.js", e);
    }
})();
`;
    modules["replyList.js"] = `/**
 * 本模块负责恢复翻页评论区
 */
(function () {
    try {
        API.scriptIntercept(["comment.min.js"], "https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/comment.min.js");
        class ReplyList {
            init() {
                // 拦截评论脚本
                if (window.bbComment)
                    return this.cover(); // 评论已载入直接覆盖
                // 监听评论脚本载入并覆盖
                Object.defineProperty(window, "bbComment", {
                    set: () => { this.cover(); },
                    get: () => undefined,
                    configurable: true
                });
            }
            cover() {
                delete window.bbComment; // 取消拦截
                new Function(GM.getResourceText("comment.js"))(); // 载入旧版脚本
                API.addElement("link", { href: "//static.hdslb.com/phoenix/dist/css/comment.min.css", rel: "stylesheet" }, document.head);
                API.addCss(\`
                .bb-comment .comment-header .header-page, .comment-bilibili-fold .comment-header .header-page {
                    float: right;line-height: 36px;
                }.bb-comment .comment-list .list-item .user .text-con, .comment-bilibili-fold .comment-list .list-item .user .text-con {
                    margin-left: initial;
                }.bb-comment .comment-list .list-item .reply-box .reply-item .reply-con .user>a, .comment-bilibili-fold .comment-list .list-item .reply-box .reply-item .reply-con .user>a {
                    margin-left: initial;
                }\`);
            }
        }
        new ReplyList().init();
        API.jsonphook(["api.bilibili.com/x/v2/reply?"], (xhr) => {
            !xhr.url.includes("mobi_app") && (xhr.url += \`&mobi_app=android\`);
        });
        config.commentLinkDetail && API.importModule("commentLinkDetail.js");
    }
    catch (e) {
        toast.error("replyList.js", e);
    }
})();
`;
    modules["section.js"] = `/**
 * 本模块负责替换全局顶栏和底栏
 */
(function () {
    try {
        API.runWhile(() => document.querySelector("#internationalHeader"), () => {
            var _a;
            if (API.path.name)
                return;
            document.querySelector("#internationalHeader").setAttribute("style", "visibility:hidden;");
            (!((_a = window.\$) === null || _a === void 0 ? void 0 : _a.ajax)) && API.addElement("script", { type: "text/javascript", src: "//static.hdslb.com/js/jquery.min.js" }, undefined, undefined, true);
            (document.querySelector(".mini-type") && !location.href.includes("blackboard/topic_list") && !location.href.includes("blackboard/x/act_list")) ? API.addElement("div", { class: "z-top-container" }, undefined, undefined, true) : API.addElement("div", { class: "z-top-container has-menu" }, undefined, undefined, true);
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
    }
    catch (e) {
        debug.error("section.js", e);
    }
})();
`;
    modules["sectionTypo.js"] = `/**
 * 本模块负责修正旧版顶栏分区
 */
(function () {
    API.runWhile(() => document.querySelector("#bili-header-m"), () => {
        try {
            let node = document.querySelector("#bili-header-m").getElementsByClassName('nav-name');
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
            debug.error("sectionTypo.js", e);
        }
    });
})();
`;
    modules["segProgress.js"] = `/**
 * 本模块负责添加分段进度条
 */
(function () {
    class SegProgress {
        constructor(resp) {
            if (!resp.data.view_points || resp.data.view_points.length == 0)
                return;
            this.init(resp.data.view_points);
        }
        async init(view_points) {
            if (!SegProgress.cssInited) {
                SegProgress.cssInited = true;
                API.addCss(\`.bilibili-progress-segmentation{height:29px;position:absolute;top:-12px}
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
            let duration = view_points[view_points.length - 1].to;
            let ratio = window.player.getDuration() / duration / duration;
            let sliderTracker = document.querySelector(".bilibili-player-video-progress .bpui-slider-tracker"); // 播放器进度条的div  // 播放器进度条的div
            let chptName = document.createElement("div"); // 显示在视频预览缩略图上方的看点标题
            chptName.className = "bilibili-progress-detail-chapter";
            document.querySelector(".bilibili-player-video-progress-detail").appendChild(chptName);
            // 添加分段进度条
            for (let v of view_points) {
                let seg = document.createElement("div");
                seg.className = "bilibili-progress-segmentation";
                seg.style.width = (v.to - v.from) * ratio * 100 + "%";
                seg.style.left = v.from * ratio * 100 + "%";
                seg.innerHTML = '<div><div></div></div>';
                seg.onmouseenter = (content => () => chptName.innerHTML = content)(v.content);
                sliderTracker.appendChild(seg);
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
                        let div = document.createElement("div");
                        div.className = "bilibili-player-chapter-info";
                        div.innerHTML = \`<img width="112" height="63" src="\${v.imgUrl}"/>
                                        <p class="chapter-name">\${v.content}</p>
                                        <span style="margin-left: 138px">\${timeFormat(Math.floor(v.from / 60))}:\${timeFormat(v.from % 60)}</span>
                                        <span style="margin-right: 5px; float: right;">\${(v.to - v.from) >= 60 ? \`\${Math.floor((v.to - v.from) / 60)}分\` : ""}\${(v.to - v.from) % 60}秒</span>\`;
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
    API.segProgress = (data) => {
        try {
            new SegProgress(data);
        }
        catch (e) {
            toast.error("segProgress.js", e);
        }
    };
})();
`;
    modules["unloginPopover.js"] = `/**
 * 移除未登录弹窗
 */
(function () {
    try {
        API.runWhile(() => document.querySelector(".lt-row"), () => document.querySelector(".lt-row").remove());
        API.runWhile(() => document.querySelector(".unlogin-popover"), () => document.querySelector(".unlogin-popover").remove());
    }
    catch (e) {
        debug.error("unloginPopover.js", e);
    }
})();
`;
    modules["unread.js"] = `/**
 * 本模块负责处理远古顶栏的动态残留问题
 */
(function () {
    try {
        API.jsonphook(["api.bilibili.com/x/web-feed/feed/unread"], function (xhr) {
            xhr.url = xhr.url.replace("feed/unread", "article/unread");
        });
    }
    catch (e) {
        debug.error("unread.js", e);
    }
})();
`;
    modules["user-select.js"] = `/**
 * 本模块负责截除页面复制限制及右键锁
 * 本模块代码参考自{@see Absolute Enable Right Click & Copy {@link https://chrome.google.com/webstore/detail/jdocbkpgdakpekjlhemmfcncgdjeiika}}
 */
(function () {
    try {
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
    }
    catch (e) {
        debug.error("user-select.js", e);
    }
})();
`;
    modules["videoLimit.js"] = `/**
 * 本模块负责解除区域、APP等播放限制
 */
(function () {
    try {
        class HookTimeOut {
            constructor() {
                this.hook = setTimeout;
                window.setTimeout = (...args) => {
                    if (args[1] && args[1] == 1500 && args[0] && args[0].toString() == "function(){f.cz()}") {
                        toast.warning("禁用播放器强制初始化！", ...args);
                        return Number.MIN_VALUE;
                    }
                    return this.hook.call(window, ...args);
                };
            }
            relese() {
                window.setTimeout = this.hook;
            }
        }
        API.xhrhook(['season/user/status?'], function (args) {
            args[1] = args[1].replace('bangumi.bilibili.com/view/web_api/season/user/status', 'api.bilibili.com/pgc/view/web/season/user/status');
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4) {
                    try {
                        let response = API.jsonCheck(this.responseText);
                        if (response) {
                            if (response.result.area_limit) {
                                response.result.area_limit = 0;
                                response.ban_area_show = 1;
                                API.limit = true;
                            }
                            if (response.result.progress)
                                response.result.watch_progress = response.result.progress;
                            if (response.result.vip_info)
                                response.result.vipInfo = response.result.vip_info;
                            Object.defineProperty(this, 'response', { writable: true });
                            Object.defineProperty(this, 'responseText', { writable: true });
                            this.response = this.responseText = JSON.stringify(response);
                        }
                    }
                    catch (e) {
                        debug.error("videoLimit.js", e);
                    }
                }
            });
        });
        API.xhrhook(["/playurl?"], function (args) {
            var _a, _b;
            // APP限制
            !API.limit && API.pgc && ((_b = (_a = API.__INITIAL_STATE__) === null || _a === void 0 ? void 0 : _a.rightsInfo) === null || _b === void 0 ? void 0 : _b.watch_platform) && (this.send = async () => appLimit.call(this, args));
            // 区域限制
            API.limit && (this.send = async () => areaLimit.call(this, args));
        });
        async function appLimit(args) {
            const hookTimeout = new HookTimeOut();
            const progress = setInterval(() => { this.dispatchEvent(new ProgressEvent("progress")); }, 50);
            const accesskey = GM.getValue("access_key", "") || undefined;
            let response;
            let obj = API.urlObj(args[1]);
            obj = { ...obj, ...{ access_key: accesskey, fnval: null, fnver: null, platform: "android_i" } };
            this.dispatchEvent(new ProgressEvent("loadstart"));
            Object.defineProperty(this, "response", { writable: true });
            Object.defineProperty(this, "responseText", { writable: true });
            Object.defineProperty(this, "responseURL", { writable: true });
            Object.defineProperty(this, "readyState", { writable: true });
            Object.defineProperty(this, "status", { writable: true });
            this.status = 200;
            this.readyState = 2;
            this.dispatchEvent(new ProgressEvent("readystatechange"));
            try {
                toast.info("尝试解除APP限制... 使用移动端flv接口");
                response = API.jsonCheck(await xhr.GM({
                    url: API.urlsign("https://api.bilibili.com/pgc/player/api/playurl", obj, 1)
                }));
                response = { "code": 0, "message": "success", "result": response };
                API.__playinfo__ = response;
                toast.success(\`解除APP限制！aid=\${API.aid}, cid=\${API.cid}\`);
            }
            catch (e) {
                toast.error("videoLimit.js", e);
                response = { "code": -404, "message": e, "data": null };
            }
            clearInterval(progress);
            this.responseURL = args[1];
            this.response = this.responseText = JSON.stringify(response);
            this.readyState = 4;
            this.dispatchEvent(new ProgressEvent("readystatechange"));
            this.dispatchEvent(new ProgressEvent("load"));
            this.dispatchEvent(new ProgressEvent("loadend"));
            hookTimeout.relese();
        }
        async function areaLimit(args) {
            if (API.globalLimit)
                return globalLimit.call(this, args);
            const hookTimeout = new HookTimeOut();
            const progress = setInterval(() => { this.dispatchEvent(new ProgressEvent("progress")); }, 50);
            const accesskey = GM.getValue("access_key", "") || undefined;
            let response;
            let obj = API.urlObj(args[1]);
            obj = { ...obj, ...{ access_key: accesskey, module: "bangumi" } };
            obj.fnval && (obj.fnval = 16);
            this.dispatchEvent(new ProgressEvent("loadstart"));
            Object.defineProperty(this, "response", { writable: true });
            Object.defineProperty(this, "responseText", { writable: true });
            Object.defineProperty(this, "responseURL", { writable: true });
            Object.defineProperty(this, "readyState", { writable: true });
            Object.defineProperty(this, "status", { writable: true });
            this.status = 200;
            this.readyState = 2;
            this.dispatchEvent(new ProgressEvent("readystatechange"));
            try {
                toast.info("尝试解除区域限制... 访问代理服务器");
                response = API.jsonCheck(await xhr.GM({
                    url: API.objUrl("https://www.biliplus.com/BPplayurl.php", obj)
                }));
                response = await new API.RebuildPlayerurl().appPlayurl(response);
                response = { "code": 0, "message": "success", "result": response };
                API.__playinfo__ = response;
                toast.success(\`解除区域限制！aid=\${API.aid}, cid=\${API.cid}\`);
            }
            catch (e) {
                toast.error("videoLimit.js", e);
                response = { "code": -404, "message": e, "data": null };
            }
            clearInterval(progress);
            this.responseURL = args[1];
            this.response = this.responseText = JSON.stringify(response);
            this.readyState = 4;
            this.dispatchEvent(new ProgressEvent("readystatechange"));
            this.dispatchEvent(new ProgressEvent("load"));
            this.dispatchEvent(new ProgressEvent("loadend"));
            hookTimeout.relese();
        }
        async function globalLimit(args) {
            const hookTimeout = new HookTimeOut();
            const progress = setInterval(() => { this.dispatchEvent(new ProgressEvent("progress")); }, 50);
            const server = config.limitServer || "https://api.global.bilibili.com";
            let response;
            let obj = API.urlObj(args[1]);
            this.dispatchEvent(new ProgressEvent("loadstart"));
            Object.defineProperty(this, "response", { writable: true });
            Object.defineProperty(this, "responseText", { writable: true });
            Object.defineProperty(this, "responseURL", { writable: true });
            Object.defineProperty(this, "readyState", { writable: true });
            Object.defineProperty(this, "status", { writable: true });
            this.status = 200;
            this.readyState = 2;
            this.dispatchEvent(new ProgressEvent("readystatechange"));
            try {
                toast.info("尝试解除泰区限制... 访问代理服务器");
                response = API.jsonCheck(await xhr.GM({
                    url: API.objUrl(\`\${server}/intl/gateway/v2/ogv/playurl\`, { aid: obj.avid || API.aid, ep_id: obj.ep_id, download: "1" })
                }));
                response = await new API.RebuildPlayerurl().ogvPlayurl(response);
                response = { "code": 0, "message": "success", "result": response };
                API.__playinfo__ = response;
                toast.success(\`解除泰区限制！aid=\${API.aid}, cid=\${API.cid}\`);
            }
            catch (e) {
                toast.error("videoLimit.js", e);
                response = { "code": -404, "message": e, "data": null };
            }
            clearInterval(progress);
            this.responseURL = args[1];
            this.response = this.responseText = JSON.stringify(response);
            this.readyState = 4;
            this.dispatchEvent(new ProgressEvent("readystatechange"));
            this.dispatchEvent(new ProgressEvent("load"));
            this.dispatchEvent(new ProgressEvent("loadend"));
            hookTimeout.relese();
        }
    }
    catch (e) {
        toast.error("videoLimit.js", e);
    }
})();
`;
    modules["danmaku.js"] = `/**
 * 本模块提供各种弹幕相关工具，负责获取、转化等弹幕处理功能
 * \`本模块按需加载，使用相关函数前请务必先载入本模块\`
 * 新版弹幕相关功能调用了开源项目\`protobufjs\`，非常感谢，相关信息如下
 * @see protobufjs {@link https://github.com/protobufjs/protobuf.js}
 * @license BSD 3-Clause
 */
(function () {
    try {
        class Danmaku {
            constructor() {
                new Function(GM.getResourceText("protobuf.min.js"))(); // protobufjs引擎
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
                    s += \`<d p="\${d.stime},\${d.mode},\${d.size},\${d.color},\${d.date},\${d.class},\${d.uid},\${d.dmid}">\${d.text.replace(/[<">'&]/g, (a) => { return { '<': '&lt;', '"': '&quot;', '>': '&gt;', "'": '&#39;', '&': '&amp;' }[a]; })}</d>\\r\\n\`;
                    return s;
                }, '<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.com</chatserver><chatid>' + API.cid + '</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source>\\r\\n');
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
                    let config = await xhr({
                        url: API.objUrl("https://api.bilibili.com/x/v2/dm/web/view", {
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
                    if (API.aid && (aid != API.aid))
                        total = config.dmSge.total;
                    if (!bas) {
                        // 特殊情况下只需要BAS/高级弹幕时 bas为真
                        for (let index = 1; index <= total; index++) {
                            allrequset.push(xhr({
                                url: API.objUrl("https://api.bilibili.com/x/v2/dm/web/seg.so", {
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
                            allrequset.push(xhr({
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
                    toast.error("danmaku.js", e);
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
                cid = cid || API.cid;
                let dm = await xhr({
                    url: API.objUrl("https://api.bilibili.com/x/v2/dm/web/history/seg.so", {
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
                    toast.warning("从弹幕文件中没有获取到任何弹幕！");
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
                    return toast.error("刷新弹幕列表失败：播放器内部调用丢失！");
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
                aid = aid || API.aid;
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
                        API.getSegDanmaku(obj.aid, obj.cid).then(d => {
                            var _a;
                            d = API.danmakuFormat(d, obj.aid);
                            (_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku(d, config.concatDanmaku);
                            API.danmaku = d;
                        });
                    }
                }
                catch (e) {
                    debug.error("onlineDanmaku.js", e);
                }
            }
        }
        const DM = new Danmaku();
        API.getSegDanmaku = (aid = API.aid, cid = API.cid, bas = false) => DM.getSegDanmaku(aid, cid, bas);
        API.specialEffects = (dm) => DM.specialEffects(dm);
        API.sortDmById = (danmaku, key) => DM.sortDmById(danmaku, key);
        API.toXml = (danmaku) => DM.toXml(danmaku);
        API.getHistoryDanmaku = (date, cid) => DM.getHistoryDanmaku(date, cid);
        API.loadLocalDm = (xml, append) => DM.loadLocalDm(xml, append);
        API.segDmDecode = (response) => DM.segDmDecode(response);
        API.danmakuFormat = (dm, aid) => DM.danmakuFormat(dm, aid);
        API.onlineDanmaku = (url) => DM.onlineDanmaku(url);
    }
    catch (e) {
        toast.error("danmaku.js", e);
    }
})();
`;
    modules["debug.js"] = `(function () {
    class Debug {
        static log(...data) { console.log(\`%c[\${API.timeFormat()}]\`, "color: blue;", ...data); }
        static info(...data) { console.info(\`%c[\${API.timeFormat()}]\`, "color: green;", ...data); }
        static debug(...data) { console.debug(\`[\${API.timeFormat()}]\`, ...data); }
        static warn(...data) { console.warn(\`[\${API.timeFormat()}]\`, ...data); }
        static error(...data) { console.error(\`[\${API.timeFormat()}]\`, ...data); }
    }
    // @ts-ignore
    API.debug = (...data) => Debug.log(...data);
    Reflect.ownKeys(Debug).forEach(d => typeof Debug[d] == "function" && Reflect.set(Reflect.get(API, "debug"), d, Debug[d]));
})();
`;
    modules["element.js"] = `/**
 * 本模块负责提供一些内置的可复用的HTMLEliment组件
 */
(function () {
    try {
        class ClickRemove {
            /**
             * 对一个节点添加监听，点击该节点之外的地方移除该节点
             * @param ele 目标节点
             */
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
        class Element {
            /**
             * 弹出一个空白浮动窗口，点击该窗口外的节点该窗口会自动关闭
             * 浮动窗口上的内容请通过返回的节点进行后续添加
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
                Object.keys(style).forEach(d => popup.style[d] = style[d]);
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
             * 获取并整合内置Css模块
             * @param svg Css模块名序列
             * @returns 整合好的Css模块
             */
            static getCss(...svg) {
                return svg.reduce((s, d) => {
                    s += \`\\r\\n\${API.getModule(d)}\`;
                    return s;
                }, "");
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
                API.addCss(this.getCss("select.css"), undefined, real);
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
                API.addCss(this.getCss("button.css"), undefined, real);
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
                API.addCss(this.getCss("input.css"), undefined, real);
                attribute && Object.entries(attribute).forEach(d => { input.setAttribute(d[0], d[1]); });
                text && (input.value = text);
                button ? div.appendChild(this.button(function () {
                    if (pattern && !pattern.test(input.value))
                        return toast.warning(\`值 \${input.value} 不符合要求！\`, \`正则表达式：\${pattern.toString()}\`);
                    callback.call(input, input.value);
                }, button, disabled)) : input.onchange = () => {
                    if (pattern && !pattern.test(input.value))
                        return toast.warning(\`值 \${input.value} 不符合要求！\`, \`正则表达式：\${pattern.toString()}\`);
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
                API.addCss(this.getCss("checkbox.css"), undefined, real);
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
        API.element = {
            popupbox: (style, hold) => Element.popupbox(style, hold),
            hr: () => Element.hr(),
            svg: (svg) => Element.svg(svg),
            switch: (callback, value) => Element.switch(callback, value),
            select: (list, callback, value) => Element.select(list, callback, value),
            button: (callback, text, disabled) => Element.button(callback, text, disabled),
            input: (callback, text, attribute, pattern, button, disabled) => Element.input(callback, text, attribute, pattern, button, disabled),
            file: (callback, multiple, text, accept) => Element.file(callback, multiple, text, accept),
            checkbox: (list, callback, value) => Element.checkbox(list, callback, value),
            clickRemove: (ele) => new ClickRemove(ele),
            progress: (detail) => Element.progress(detail)
        };
        API.getCss = (...svg) => Element.getCss(...svg);
    }
    catch (e) {
        toast.error("element.js", e);
    }
})();
`;
    modules["extend.js"] = `/**
 * 本模块负责拓展一些小工具，这些工具不便写在主模块中
 */
(function () {
    try {
        function getCookies() {
            return document.cookie.split('; ').reduce((s, d) => {
                let key = d.split('=')[0];
                let val = d.split('=')[1];
                s[key] = val;
                return s;
            }, {});
        }
        API.getCookies = () => getCookies();
        async function loginExit(referer) {
            if (!API.uid)
                return toast.warning("本就未登录，无法退出登录！");
            toast.warning("正在退出登录...");
            let data = API.jsonCheck(await xhr({
                url: "https://passport.bilibili.com/login/exit/v2",
                data: \`biliCSRF=\${API.getCookies().bili_jct}&gourl=\${encodeURIComponent(location.href)}\`,
                method: "POST",
                credentials: true
            }));
            if (data.status) {
                toast.success("退出登录！");
                if (referer)
                    return location.replace(referer);
                setTimeout(() => location.reload(), 1000);
            }
        }
        API.loginExit = (referer) => loginExit(referer);
        function jsonCheck(data) {
            let result = typeof data === "string" ? JSON.parse(data) : data;
            if ("code" in result && result.code !== 0) {
                let msg = result.msg || result.message || "";
                throw [result.code, msg];
            }
            return result;
        }
        API.jsonCheck = (data) => jsonCheck(data);
        function restorePlayerSetting() {
            var _a;
            let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
            let settings_copy = GM.getValue("bilibili_player_settings", {});
            if (bilibili_player_settings) {
                let settings = JSON.parse(bilibili_player_settings);
                if (((_a = settings === null || settings === void 0 ? void 0 : settings.video_status) === null || _a === void 0 ? void 0 : _a.autopart) !== "")
                    GM.setValue("bilibili_player_settings", settings);
                else if (settings_copy)
                    localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
            }
            else if (settings_copy) {
                localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
            }
        }
        API.restorePlayerSetting = () => restorePlayerSetting();
        function biliQuickLogin() {
            window.biliQuickLogin ? window.biliQuickLogin() : window.\$ ? window.\$.getScript("//static.hdslb.com/account/bili_quick_login.js", () => window.biliQuickLogin()) : false;
        }
        API.biliQuickLogin = () => biliQuickLogin();
        function getTotalTop(node) {
            var sum = 0;
            do {
                sum += node.offsetTop;
                node = node.offsetParent;
            } while (node);
            return sum;
        }
        API.getTotalTop = (node) => getTotalTop(node);
        async function saveAs(content, fileName, contentType = "text/plain") {
            const a = document.createElement("a");
            const file = new Blob([content], { type: contentType });
            a.href = URL.createObjectURL(file);
            a.download = fileName;
            a.click();
        }
        function getUrlValue(name) {
            const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|\$)", "i");
            const r = window.location.search.substr(1).match(reg);
            if (r != null)
                return decodeURIComponent(r[2]);
            return null;
        }
        API.getUrlValue = (name) => getUrlValue(name);
        API.saveAs = (content, fileName, contentType) => saveAs(content, fileName, contentType);
        function readAs(file, type = "string", encoding) {
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
                        reader.readAsText(file, encoding || 'utf-8');
                        break;
                }
                reader.onload = () => resolve(reader.result);
                reader.onerror = e => reject(e);
            });
        }
        API.readAs = (file, type, encoding) => readAs(file, type, encoding);
        const aids = {};
        async function getAidInfo(aid) {
            if (!aids[aid]) {
                const data = await xhr({
                    url: \`https://api.bilibili.com/x/web-interface/view/detail?aid=\${aid}\`,
                    responseType: "json",
                    credentials: true
                });
                aids[aid] = data.data;
            }
            return aids[aid];
        }
        API.getAidInfo = (aid) => getAidInfo(aid);
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
        API.strSize = (str) => strSize(str);
        function intervalFormat(time) {
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
            return API.timeFormat(time * 1e3, true);
        }
        API.intervalFormat = (time) => intervalFormat(time);
        async function addCss(txt, id, parrent) {
            if (!parrent && !document.head) {
                await new Promise(r => this.runWhile(() => document.body, r));
            }
            parrent = parrent || document.head;
            const style = document.createElement("style");
            style.setAttribute("type", "text/css");
            id && !parrent.querySelector(\`#\${id}\`) && style.setAttribute("id", id);
            style.appendChild(document.createTextNode(txt));
            parrent.appendChild(style);
        }
        API.addCss = (txt, id, parrent) => addCss(txt, id, parrent);
        function addElement(tag, attribute, parrent, innerHTML, top, replaced) {
            let element = document.createElement(tag);
            attribute && (Object.entries(attribute).forEach(d => element.setAttribute(d[0], d[1])));
            parrent = parrent || document.body;
            innerHTML && (element.innerHTML = innerHTML);
            replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
            return element;
        }
        API.addElement = (tag, attribute, parrent, innerHTML, top, replaced) => addElement(tag, attribute, parrent, innerHTML, top, replaced);
        function runWhile(check, callback, delay = 100, stop = 180) {
            let timer = setInterval(() => {
                if (check()) {
                    clearInterval(timer);
                    callback();
                }
            }, delay);
            stop && setTimeout(() => clearInterval(timer), stop * 1000);
        }
        API.runWhile = (check, callback, delay = 100, stop = 180) => runWhile(check, callback, delay, stop);
        function bofqiMessage(msg, time = 3, callback, replace = true) {
            let node = document.querySelector(".bilibili-player-video-toast-bottom");
            if (!node) {
                if (msg) {
                    if (Array.isArray(msg))
                        return debug.log(...msg);
                    return debug.log(msg);
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
        API.bofqiMessage = (msg, time, callback, replace) => bofqiMessage(msg, time, callback, replace);
        async function alertMessage(text, title = API.Name) {
            return new Promise((r) => {
                const root = API.addElement("div");
                const div = root.attachShadow({ mode: "closed" });
                const table = API.addElement("div", { class: "table" }, div, \`
            <div class="title">\${title}</div>
            <div class="text">\${text}</div>
            <div class="act">
                <div class="button">确认</div>
                <div class="button">取消</div>
                </div>
            \`);
                API.addCss(API.getCss("alert.css", "button.css"), '', div);
                table.querySelectorAll(".button").forEach((d, i) => {
                    i ? (d.onclick = () => { root.remove(), r(false); }) : (d.onclick = () => (root.remove(), r(true)));
                });
            });
        }
        API.alertMessage = (text, title) => alertMessage(text, title);
    }
    catch (e) {
        toast.error("extend.js", e);
    }
})();
`;
    modules["format.js"] = `(function () {
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
         * @param arr 母数组
         * @param num 子数组大小
         * @returns 子数组
         */
        static randomArray(arr, num) {
            let out = [];
            num = num || 1;
            num = num < arr.length ? num : arr.length;
            while (out.length < num) {
                var temp = (Math.random() * arr.length) >> 0;
                out.push(arr.splice(temp, 1)[0]);
            }
            return out;
        }
        /**
         * search参数对象拼合回URL
         * @param url URL主体，可含search参数
         * @param obj search参数对象
         * @returns 拼合的URL
         */
        static objUrl(url, obj) {
            let data = this.urlObj(url);
            obj = typeof obj === "object" ? obj : {};
            data = Object.assign(data, obj);
            let arr = [], i = 0;
            for (let key in data) {
                if (data[key] !== undefined && data[key] !== null) {
                    arr[i] = key + "=" + data[key];
                    i++;
                }
            }
            if (url)
                url = url + "?" + arr.join("&");
            else
                url = arr.join("&");
            if (url.charAt(url.length - 1) == "?")
                url = url.split("?")[0];
            return url;
        }
        /**
         * 提取URL search参数对象
         * @param url 原URL
         * @returns search参数对象
         */
        static urlObj(url = "") {
            let arr = url.split('?')[1] ? url.split('?')[1].split('&') : [];
            return arr.reduce((o, d) => {
                if (d.includes("#"))
                    d = d.split("#")[0];
                if (d)
                    o[d.split('=')[0]] = d.split('=')[1] || "";
                return o;
            }, {});
        }
    }
    Reflect.ownKeys(Format).forEach(d => typeof Format[d] == "function" && Reflect.set(API, d, Format[d]));
})();
`;
    modules["manage.js"] = `/**
 * 本模块负责维护脚本数据存储
 */
(function () {
    class Config {
        constructor() {
            this.box = API.element.popupbox({ maxWidth: "360px", maxHeight: "300px" });
            API.addElement("div", { style: 'text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;' }, this.box, \`<span>设置数据<span>\`);
            API.addElement("div", { style: 'margin-bottom: 10px;' }, this.box, \`<div>设置数据包含您个人对于设置的自定义调整，不包括内置的模块、安装的第三方模块以及各种功能缓存的数据。您可以选择恢复默认数据、导出为本地文件或者从本地文件中恢复。</div>\`);
            this.box.appendChild(API.element.hr());
            const body = API.addElement("div", { style: "display: flex;align-items: center;justify-content: space-around;" }, this.box);
            body.appendChild(API.element.button(() => { this.restore(); }, "默认", 0));
            body.appendChild(API.element.button(() => { this.output(); }, "导出", 0));
            body.appendChild(API.element.file((v) => { this.input(v); }, false, "导入", [".json"]));
        }
        restore() {
            GM.deleteValue("config");
            toast.warning("已恢复默认数据，请及时刷新页面避免数据紊乱！");
            API.alertMessage(\`已恢复默认数据，请及时<strong>刷新</strong>页面避免数据紊乱！\`, "恢复默认设置").then(d => { d && location.reload(); });
        }
        output() {
            API.saveAs(JSON.stringify(config, undefined, "\\t"), \`config \${API.timeFormat(undefined, true)}.json\`, "application/json");
        }
        input(v) {
            v && v[0] && API.readAs(v[0]).then(d => {
                const data = JSON.parse(d);
                Object.keys(data).forEach(d => Reflect.has(config, d) && Reflect.set(config, d, data[d]));
                toast.success("已导入本地设置数据，请刷新页面生效！");
            });
        }
    }
    new Config();
})();
`;
    modules["nodeObserver.js"] = `/**
 * 本模块负责DOM节点变动监听
 * **监听节点变动开销极大，如非必要请改用其他方法并且用后立即销毁！**
 */
(function () {
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
            toast.error("nodeObserver.js", e);
        }
    }
    API.observerAddedNodes = (callback) => observerAddedNodes(callback);
    /**
     * 销毁\`observerAddedNodes\`监听
     * @param id 注册\`observerAddedNodes\`监听是返回的编号
     */
    function removeObserver(id) {
        nodelist.splice(id, 1);
    }
    API.removeObserver = (id) => removeObserver(id);
    (new MutationObserver(d => d.forEach(d => {
        d.addedNodes[0] && nodelist.forEach(async (f) => f(d.addedNodes[0]));
    }))).observe(document, { childList: true, subtree: true });
})();
`;
    modules["rewrite.js"] = `/**
 * 重写引导，重写操作是非常底层的操作，必须在正常引导之前。
 */
(function () {
    try {
        API.uid = Number(API.getCookies().DedeUserID);
        API.path = location.href.split("/");
        if (API.uid) {
            // 代理旧版退出登录页面
            if (location.href.includes("bilibili.com/login?act=exit"))
                API.loginExit(document.referrer);
            // 修复动态时间线
            let offset = API.getCookies()["bp_video_offset_" + API.uid];
            offset && (document.cookie = "bp_t_offset_" + API.uid + "=" + offset + "; domain=bilibili.com; expires=Aug, 18 Dec 2038 18:00:00 GMT; BLOD.path=/");
        }
        API.importModule("parameterTrim.js", { Before: true }); // 网址清理，重写前处理
        /**
         * 分离页面进入重写判定
         */
        if (config.av && /\\/video\\/[AaBb][Vv]/.test(location.href))
            API.importModule("av.js");
        if (config.bangumi && /\\/bangumi\\/play\\/(ss|ep)/.test(location.href))
            API.importModule("bangumi.js");
        if (config.watchlater && /\\/watchlater\\//.test(location.href))
            API.importModule("watchlater.js");
        if (config.player && /player\\./.test(location.href))
            API.importModule("player.js");
        if (/space\\.bilibili\\.com/.test(location.href))
            API.importModule("space.js");
        if (config.index && API.path[2] == 'www.bilibili.com' && (!API.path[3] || (API.path[3].startsWith('\\?') || API.path[3].startsWith('\\#') || API.path[3].startsWith('index.'))))
            API.importModule("index.js");
        if (config.ranking && /\\/v\\/popular\\//.test(location.href))
            API.importModule("ranking.js");
        if (/live\\.bilibili\\.com/.test(location.href))
            API.importModule("live.js");
        if (/\\/medialist\\/play\\//.test(location.href))
            API.importModule("mediaList.js");
        if (API.path[2] == "message.bilibili.com")
            API.addCss(API.getModule("message.css"));
        if (window.self == window.top && API.path[2] == 'www.bilibili.com')
            document.domain = "bilibili.com";
        if (location.href.includes("message.bilibili.com/pages/nav/index_new_sync"))
            API.addCss(API.getModule("imroot.css"));
        if (location.href.includes("www.bilibili.com/account/history"))
            API.importModule("history.js");
        if (/dmid/.test(location.href) && /dm_progress/.test(location.href))
            API.importModule("loadByDmid.js");
        if (config.read && /\\/read\\/[Cc][Vv]/.test(location.href))
            API.importModule("read.js");
        if (config.player && /festival\\/2021bnj/.test(location.href))
            API.importModule("bnj2021.js");
        API.scriptIntercept(["bilibiliPlayer.min.js"], "https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/dist/bilibiliPlayer.min.js"); // 播放器脚本拦截
        API.path.name && API.scriptIntercept(["stardust-video"]); // 新版播放器拦截
        config.logReport && API.scriptIntercept(["log-reporter"]); // 日志拦截
        /**
         * 若页面不需要重写，直接进入正常引导
         */
        (!API.path.name || config.rewriteMethod == "同步") && API.importModule("vector.js");
    }
    catch (e) {
        toast.error("rewrite.js", e);
    }
})();
`;
    modules["setting.js"] = `/**
 * 本模块负责集中注册相关设置项
 */
(function () {
    try {
        // 注册设置菜单
        API.registerMenu({ key: "common", name: "通用", svg: '<svg viewBox="0 0 24 24"><g><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></g></svg>' });
        API.registerMenu({ key: "rewrite", name: "重写", svg: \`<svg viewBox="0 0 24 24"><g><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></g></svg>\` });
        API.registerMenu({ key: "restore", name: "修复", svg: \`<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>\` });
        API.registerMenu({ key: "style", name: "样式", svg: \`<svg viewBox="0 0 24 24"><g><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g></svg>\` });
        API.registerMenu({ key: "danmaku", name: "弹幕", svg: \`<svg viewBox="0 0 22 22"><path d="M16.5 8c1.289 0 2.49.375 3.5 1.022V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h7.022A6.5 6.5 0 0116.5 8zM7 13H5a1 1 0 010-2h2a1 1 0 010 2zm2-4H5a1 1 0 010-2h4a1 1 0 010 2z"></path><path d="M20.587 13.696l-.787-.131a3.503 3.503 0 00-.593-1.051l.301-.804a.46.46 0 00-.21-.56l-1.005-.581a.52.52 0 00-.656.113l-.499.607a3.53 3.53 0 00-1.276 0l-.499-.607a.52.52 0 00-.656-.113l-1.005.581a.46.46 0 00-.21.56l.301.804c-.254.31-.456.665-.593 1.051l-.787.131a.48.48 0 00-.413.465v1.209a.48.48 0 00.413.465l.811.135c.144.382.353.733.614 1.038l-.292.78a.46.46 0 00.21.56l1.005.581a.52.52 0 00.656-.113l.515-.626a3.549 3.549 0 001.136 0l.515.626a.52.52 0 00.656.113l1.005-.581a.46.46 0 00.21-.56l-.292-.78c.261-.305.47-.656.614-1.038l.811-.135A.48.48 0 0021 15.37v-1.209a.48.48 0 00-.413-.465zM16.5 16.057a1.29 1.29 0 11.002-2.582 1.29 1.29 0 01-.002 2.582z"></path></svg>\` });
        API.registerMenu({ key: "player", name: "播放", svg: \`<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v5.117a.25.25 0 00.379.214l4.264-2.559a.25.25 0 000-.428L6.379 5.227z"></path></svg>\` });
        API.registerMenu({ key: "live", name: "直播", svg: \`<svg viewBox="0 0 1024 1024"><path d="M392.448 275.911111a92.416 92.416 0 1 1-184.832 0 92.416 92.416 0 0 1 184.832 0"></path><path d="M826.624 464.583111l-63.744 36.864v-48.64a72.206222 72.206222 0 0 0-71.68-71.936H190.72a72.192 72.192 0 0 0-71.936 71.936V748.231111a71.936 71.936 0 0 0 71.936 71.936H691.2a71.936 71.936 0 0 0 71.936-71.936v-23.808l63.488 37.888a51.2 51.2 0 0 0 76.8-44.544V508.871111a51.2 51.2 0 0 0-76.8-44.288M572.928 369.351111c79.459556 0.142222 143.985778-64.156444 144.128-143.616 0.142222-79.459556-64.156444-143.985778-143.616-144.128-79.260444-0.142222-143.701333 63.857778-144.128 143.104-0.426667 79.459556 63.644444 144.213333 143.104 144.64h0.512"></path><path d="M425.216 512.967111l124.16 71.936a25.6 25.6 0 0 1 0 42.496l-124.16 71.68a25.6 25.6 0 0 1-37.12-21.248V534.471111a25.6 25.6 0 0 1 37.12-21.504"></path></svg>\` });
        API.registerMenu({ key: "download", name: "下载", svg: \`<svg viewBox="0 0 24 24"><g><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g></svg>\` });
        // 注册设置项
        API.registerSetting({
            key: "developer",
            sort: "common",
            label: "开发者模式",
            svg: '<svg viewBox="0 0 24 24"><g><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></g></svg>',
            type: "switch",
            value: false,
            float: '开发者模式将暴露核心变量 <b>API</b> 到页面顶级对象 window，可以借此在控制台调试部分功能。',
            sub: '暴露 API 到 window',
            action: (value) => {
                value ? (!window.API && (window.API = API)) : (window.API && delete window.API);
            }
        });
        config.developer && (window.API = API);
        API.registerSetting({
            key: "rewriteMethod",
            sort: "rewrite",
            label: "重写模式",
            sub: "兼容性选项",
            type: "row",
            value: "同步",
            list: ["同步", "异步"],
            float: '同步模式能够更有效阻断原生脚本执行，减少原生脚本对于页面的破坏，<strong>缺点是与其他脚本或拓展兼容性不佳</strong>。</br>异步模式尝试提高兼容性，相对应的阻断效果下降，新版页面一闪而过现象加剧且受网络延时影响更大。'
        });
        API.registerSetting({
            key: "av",
            sort: "rewrite",
            label: "av/BV",
            type: "switch",
            value: true,
            float: '重写以恢复旧版av视频播放页。'
        });
        API.registerSetting({
            key: "upList",
            sort: "style",
            label: "UP主列表",
            sub: "展示视频合作者",
            type: "switch",
            value: false
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
            key: "enlike",
            sort: "player",
            label: "添加点赞功能",
            sub: "自制、简陋",
            type: "switch",
            value: false,
            float: "旧版播放器的时代点赞功能还未存在，本脚本代为设计了个丑丑的点赞功能。"
        });
        API.registerSetting({
            key: "medialist",
            sort: "rewrite",
            label: "medialist",
            type: "switch",
            value: false,
            float: "用旧版av页重构medialist页面。"
        });
        API.registerSetting({
            type: "switch",
            key: "index",
            label: "主页",
            value: true,
            sort: "rewrite",
            float: '重写以恢复旧版主页'
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
            key: "protoDm",
            sort: "danmaku",
            label: "启用新版弹幕",
            sub: "proto弹幕",
            type: "switch",
            value: true,
            float: \`添加旧版播放器新版proto弹幕支持。由于旧版xml弹幕已获取不到90分钟后的弹幕，本功能不建议禁用。</br>”\`
        });
        API.registerSetting({
            key: "liveDm",
            sort: "danmaku",
            label: "修复实时弹幕",
            sub: "及时接收别人新发的弹幕",
            type: "switch",
            value: true,
            float: \`修复旧版播放器实时弹幕。\`
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
            key: "heartbeat",
            sort: "restore",
            label: "修复视频心跳",
            sub: "出现不记录播放历史症状时的选择",
            float: "尝试修复可能被广告拦截扩展误伤的视频心跳。",
            type: "switch",
            value: false
        });
        API.registerSetting({
            key: "noVideo",
            sort: "player",
            label: "拦截视频载入",
            sub: "用于临时不加载视频进入视频页面",
            float: "拦截播放器载入视频，强行使视频失效。",
            type: "switch",
            value: false
        });
        API.registerSetting({
            key: "bannerGif",
            sort: "style",
            label: "丰富顶栏动图",
            sub: '搜索框下gif',
            float: "替换顶栏动图接口，避免单调。",
            type: "switch",
            value: true
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
                    value: false
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
                }]
        });
        API.registerSetting({
            key: "segProgress",
            sort: "player",
            label: "分段进度条",
            sub: "仅限看点视频",
            type: "switch",
            value: false
        });
        API.registerSetting({
            key: "replyList",
            sort: "style",
            label: "恢复评论翻页",
            sub: "可以选择跳转而不必一直下拉",
            type: "switch",
            value: true,
            float: '恢复旧版翻页评论区。</br>重写过的页面除外，那些默认就是翻页评论区。'
        });
        API.registerSetting({
            key: "section",
            sort: "style",
            label: "统一换回旧版顶栏",
            sub: "针对未重写的页面",
            type: "switch",
            value: true,
            float: '非重写页面顶栏底栏也替换为旧版。'
        });
        API.registerSetting({
            key: "concatDanmaku",
            sort: "danmaku",
            label: "合并载入弹幕",
            sub: "本地弹幕/在线弹幕",
            type: "switch",
            value: false,
            float: '载入本地弹幕文件或者在线弹幕时是否与播放器当前弹幕合并。'
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
            type: "switch",
            key: "errands",
            label: '恢复对于<a href="//space.bilibili.com/11783021" target="_blank">番剧出差</a>的访问',
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
            key: "bangumi",
            sort: "rewrite",
            label: "bangumi",
            sub: "ss/ep",
            type: "switch",
            value: true,
            float: '重写以恢复旧版bangumi播放页。'
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
                    action: () => { API.showAccesskey(); }
                }, {
                    key: "limitServer",
                    sort: "player",
                    label: "泰区代理",
                    type: "input",
                    value: "https://api.global.bilibili.com",
                    float: "泰区番剧限制需要自备相应的代理服务器（无需末尾的斜杠！）。</br>本功能由于缺乏调试条件维护不善请多担待！",
                    input: { type: "url", placeholder: "URL" },
                    pattern: /(\\w+):\\/\\/([^/:]+)(:\\d*)?([^# ]*)/
                }
            ]
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
            key: "watchlater",
            label: "稍后再看",
            value: true,
            sort: "rewrite",
            float: '重写以恢复旧版稍后再看。'
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
            key: "liveStream",
            label: "拦截直播流/轮播流",
            sub: "那我为什么点开直播？",
            value: false,
            sort: "live",
            float: "将直播间设为未开播状态，不加载直播流或者轮播视频，适用于想打开直播间但不想浪费带宽或流量的情况。</br>※ 脚本注入不够快时可能拦截失败，硬刷新\`Ctrl+Shift+R\`/\`Shift + F5\`可解。"
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
            key: "anchor",
            label: "禁用天选时刻",
            sub: "反正中不了的，哼！",
            value: false,
            sort: "live"
        });
        API.registerSetting({
            type: "switch",
            key: "pkvm",
            label: "禁用大乱斗",
            sub: "挡着我欣赏主播了",
            value: false,
            sort: "live"
        });
        API.registerSetting({
            type: "switch",
            key: "player",
            label: "嵌入",
            value: true,
            sort: "rewrite",
            float: '重写以恢复旧版嵌入播放器。'
        });
        API.registerSetting({
            type: "switch",
            key: "ranking",
            label: "排行榜",
            value: true,
            sort: "rewrite",
            float: "重写以恢复旧版全站排行榜。"
        });
        API.registerSetting({
            type: "switch",
            key: "read",
            label: "专栏",
            value: true,
            sort: "rewrite",
            float: "重写以启用旧版专栏。"
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
            key: "downloadPicture",
            type: "picture",
            sort: "download",
            src: '//s2.hdslb.com/bfs/static/blive/blfe-album-detail/static/img/empty-hint.7b606b9.jpg',
            hidden: !API.aid,
            callback: function () {
                API.aid && API.getAidInfo(API.aid).then(d => {
                    this.innerHTML = \`<picture><img src="\${d.View.pic.replace("http:", "")}"></picture>\`;
                });
            }
        });
        API.runWhile(() => API.aid, () => { API.changeSettingMode({ downloadPicture: false }); });
        API.registerSetting({
            type: "switch",
            sort: "download",
            key: "downloadContentmenu",
            label: "右键菜单",
            sub: "播放画面上右键添加下载菜单",
            value: false
        });
        API.registerSetting({
            type: "mutlti",
            sort: "download",
            key: "downloadList",
            label: "视频类型",
            sub: "右键呼出下载时请求的类型",
            value: ["mp4", "dash"],
            list: ["mp4", "dash", "flv"],
            float: '下载功能会自动读取播放器已载入的视频源并呈现在下载面板上，即使未勾选对应的视频类型。</br>勾选了也不一定能获取到该类型的视频源。'
        });
        API.registerSetting({
            type: "row",
            sort: "download",
            key: "downloadQn",
            label: "默认画质",
            sub: "针对flv格式",
            value: 125,
            list: ["0", 15, 16, 32, 48, 64, 74, 80, 112, 116, 120, 125],
            float: '画质qn参数，数值越大画质越高，0表示自动。64（720P）以上需要登录，112（1080P+）以上需要大会员。一般只需设置为最大即可，会自动获取到能获取的最高画质。'
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
                                (config.downloadMethod = "右键保存", API.changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
                            API.displaySetting("downloadMethod");
                        });
                        break;
                    case "aria2":
                        API.alertMessage(\`aria2是一款著名的命令行下载工具，使用本方式将在您点击下载面板中的链接时将命令行复制到您的剪切板中，您可以粘贴到cmd等终端中回车进行下载。<strong>您必须先下载aria2工具并添加系统环境变量或者在终端在打开aria2二进制文件所在目录！</strong>\`).then(d => {
                            d ? API.changeSettingMode({ referer: false, useragent: false, filepath: false, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }) :
                                (config.downloadMethod = "右键保存", API.changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLate: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
                            API.displaySetting("downloadMethod");
                        });
                        break;
                    case "aira2 RPC":
                        API.alertMessage(\`aria2支持RPC方式接收下载数据，您需要在aria2配置开启RPC功能并保持后台运行，并在本脚本设置中配置好aria2主机及端口。</br>点击确定将刷新设置面板并呈现相关设置。\`).then(d => {
                            d ? API.changeSettingMode({ referer: false, useragent: false, filepath: false, IDMLater: true, IDMToast: true, rpcServer: false, rpcPort: false, rpcToken: false, rpcTest: false }) :
                                (config.downloadMethod = "右键保存", API.changeSettingMode({ referer: true, useragent: true, filepath: true, IDMLater: true, IDMToast: true, rpcServer: true, rpcPort: true, rpcToken: true, rpcTest: true }));
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
            type: "input",
            sort: "download",
            key: "useragent",
            label: "User-Agent",
            value: navigator.userAgent,
            input: { type: "text" },
            float: \`用户代理，此值一般填非空的任意值皆可。\`,
            hidden: config.downloadMethod == "右键保存"
        });
        API.registerSetting({
            type: "input",
            sort: "download",
            key: "referer",
            label: "referer",
            value: location.origin,
            input: { type: "text" },
            float: \`一般为B站主域名(origin)，此值不可为空，除非是APP/TV等视频源。\`,
            hidden: config.downloadMethod == "右键保存"
        });
        API.registerSetting({
            type: "input",
            sort: "download",
            key: "filepath",
            label: "保存目录",
            value: "",
            input: { type: "text", placeholder: "如：D\\\\下载" },
            float: 'windows端请注意反斜杠！',
            hidden: config.downloadMethod == "右键保存"
        });
        API.registerSetting({
            key: "IDMLater",
            sort: "download",
            label: "稍后下载",
            sub: "添加到IDM列表而不立即下载",
            type: "switch",
            value: false,
            float: "把下载链接添加到下载列表但是不立即开始下载，需要下载时再手动到IDM里开始。<strong>B站下载链接一般都有时效，太久不下载的话链接可能失效！</strong>",
            hidden: config.downloadMethod != "ef2"
        });
        API.registerSetting({
            key: "IDMToast",
            sort: "download",
            label: "静默下载",
            sub: "不用IDM确认框",
            type: "switch",
            value: false,
            float: "禁用IDM下载前的询问弹窗，其中可以选择修改文件名及保存目录等信息。",
            hidden: config.downloadMethod != "ef2"
        });
        API.registerSetting({
            key: "rpcServer",
            sort: "download",
            label: "RPC主机",
            type: "input",
            input: { type: "url", placeholder: "如：http(s)://localhost" },
            value: "http://localhost",
            hidden: config.downloadMethod != "aira2 RPC"
        });
        API.registerSetting({
            key: "rpcPort",
            sort: "download",
            label: "RPC端口",
            type: "input",
            input: { type: "number", placeholder: "如：6800" },
            value: 6800,
            hidden: config.downloadMethod != "aira2 RPC"
        });
        API.registerSetting({
            key: "rpcToken",
            sort: "download",
            label: "RPC令牌（可选）",
            type: "input",
            input: { type: "password" },
            value: "",
            hidden: config.downloadMethod != "aira2 RPC"
        });
        API.registerSetting({
            key: "rpcTest",
            sort: "download",
            label: "RPC调试",
            type: "action",
            title: "测试",
            hidden: config.downloadMethod != "aira2 RPC",
            action: () => {
                API.aria2.rpcTest()
                    .then(d => toast.success(\`RPC设置正常！aria2版本：\${d.version}\`))
                    .catch(e => toast.error("RPC链接异常！请检查各项设置以及RPC主机的状况！", e));
            }
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
        // 旧版播放器专属设置
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
                    return toast.warning("内部组件丢失，已停止！");
                API.onlineDanmaku(url);
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
                            return toast.warning("内部组件丢失，已停止！");
                        API.allDanmaku();
                    },
                    disabled: 0
                }]
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
                (!((_a = window.player) === null || _a === void 0 ? void 0 : _a.setDanmaku)) && toast.warning("内部组件丢失，无法载入弹幕文件！");
                API.localMedia(files);
            }
        });
        API.path && API.path.name && API.runWhile(() => API.path.name && window.player, () => {
            API.changeSettingMode({ onlineDanmaku: false, allDanmaku: false, localMedia: false });
        });
        API.registerSetting({
            key: "commentLinkDetail",
            sort: "style",
            label: "还原评论中的超链接",
            sub: "av、ss或ep",
            type: "switch",
            value: false
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
    }
    catch (e) {
        toast.error("setting.js", e);
    }
})();
`;
    modules["switchVideo.js"] = `/**
 * 本模块负责执行切P调用监听
 */
(function () {
    const switchlist = [];
    /**
     * 注册切P回调
     * @param callback 切P时的回调函数
     */
    function switchVideo(callback) {
        try {
            if (typeof callback === "function")
                switchlist.push(callback);
        }
        catch (e) {
            toast.error("switchVideo.js", e);
        }
    }
    API.switchVideo = (callback) => switchVideo(callback);
    API.observerAddedNodes((node) => {
        if (/bilibili-player-area video-state-pause/.test(node.className)) {
            switchlist.forEach(d => d());
        }
    });
})();
`;
    modules["toast.js"] = `(function () {
    API.registerSetting({
        type: "sort",
        key: "toast",
        label: "浮动通知",
        sub: '<a href="https://github.com/CodeSeven/toastr">toastr</a>',
        svg: '<svg viewBox="0 0 16 16"><path d="M8 16a2 2 0 001.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 008 16z"></path><path fill-rule="evenodd" d="M8 1.5A3.5 3.5 0 004.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 00-.003.01l.001.006c0 .002.002.004.004.006a.017.017 0 00.006.004l.007.001h10.964l.007-.001a.016.016 0 00.006-.004.016.016 0 00.004-.006l.001-.007a.017.017 0 00-.003-.01l-1.703-2.554a1.75 1.75 0 01-.294-.97V5A3.5 3.5 0 008 1.5zM3 5a5 5 0 0110 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.518 1.518 0 0113.482 13H2.518a1.518 1.518 0 01-1.263-2.36l1.703-2.554A.25.25 0 003 7.947V5z"></path></svg>',
        sort: "common",
        list: [{
                type: "switch",
                key: "toastcheck",
                label: "通知开关",
                sort: "common",
                value: true,
            }, {
                type: "input",
                key: "toasttimeout",
                label: "通知时长：/s",
                sort: "common",
                value: "4",
                input: { type: "number", min: 1, max: 30 },
                pattern: /^\\d+\$/
            }, {
                type: "input",
                key: "toaststep",
                label: "通知延时：/ms",
                sort: "common",
                value: "250",
                input: { type: "number", min: 100, max: 1000 },
                pattern: /^\\d+\$/
            }]
    });
    class Toast {
        static init() {
            this.container = document.createElement("div");
            this.style = document.createElement("link");
            this.container.setAttribute("id", "toast-container");
            this.container.setAttribute("class", "toast-top-right");
            this.style.setAttribute("rel", "stylesheet");
            this.style.setAttribute("id", "toastr-style");
            this.style.setAttribute("href", "https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css");
        }
        static show(type, ...msg) {
            if (!config.toastcheck)
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
                setTimeout(() => this.quit(item), (Number(config.toasttimeout) || 4) * 1000);
            }, this.count * (Number(config.toaststep) || 250));
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
    /**
     * 未呈现通知计数
     */
    Toast.count = 0;
    /**
     * 动画呈现帧数
     */
    Toast.sence = 60;
    Toast.init();
    // @ts-ignore
    API.toast = (...msg) => { debug.debug(...msg); Toast.show("info", ...msg); };
    Reflect.set(Reflect.get(API, "toast"), "info", (...msg) => { debug.debug(...msg); Toast.show("info", ...msg); });
    Reflect.set(Reflect.get(API, "toast"), "success", (...msg) => { debug.log(...msg); Toast.show("success", ...msg); });
    Reflect.set(Reflect.get(API, "toast"), "warning", (...msg) => { debug.warn(...msg); Toast.show("warning", ...msg); });
    Reflect.set(Reflect.get(API, "toast"), "error", (...msg) => { debug.error(...msg); Toast.show("error", ...msg); });
})();
`;
    modules["ui.js"] = `/**
 * 本模块负责绘制设置UI
 */
(function () {
    try {
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
                if (document.readyState !== 'complete') {
                    await new Promise(r => window.addEventListener('load', r));
                }
                if (config.settingEntryType)
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
                const classical = API.addElement("div", { class: "classical", style: "style" }, div, \`<i></i><span>设置</span>\`);
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
            }
            /**
             * 设置分类
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static index(obj, node) {
                let result;
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
                        case "custom": result = this.custom(obj);
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
                obj.callback && new Promise(r => obj.callback.call(real));
                return div;
            }
            /**
             * 添加开关设置
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static switch(obj, node) {
                node = node || this.itemContain(obj.sort);
                const div = document.createElement("div");
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "contain" }, root);
                API.addCss(API.getCss("ui-item.css"), "", root);
                Reflect.set(this.list, obj.key, real);
                obj.svg && real.appendChild(this.icon(obj.svg));
                const label = API.addElement("div", { class: "label" }, real, obj.label);
                real.appendChild(API.element.switch(function (v) {
                    config[obj.key] = v;
                    obj.action && obj.action.call(this, config[obj.key]);
                }, config[obj.key]));
                obj.sub && (label.innerHTML = \`\${obj.label}<div class="sub">\${obj.sub}</div>\`);
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
                return div;
            }
            /**
             * 添加下拉设置
             * @param obj 设置内容
             * @param node 父节点
             * @returns 设置节点
             */
            static row(obj, node) {
                node = node || this.itemContain(obj.sort);
                let div = document.createElement("div");
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "contain" }, root);
                Reflect.set(this.list, obj.key, real);
                API.addCss(API.getCss("ui-item.css"), "", root);
                obj.svg && real.appendChild(this.icon(obj.svg));
                const label = API.addElement("div", { class: "label" }, real, obj.label);
                real.appendChild(API.element.select(obj.list, function (v) {
                    config[obj.key] = v;
                    config[obj.key] = v;
                    obj.action && obj.action.call(this, v);
                }, config[obj.key]));
                obj.sub && API.addElement("div", { class: "sub" }, label, obj.sub);
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
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
                obj.callback && new Promise(r => obj.callback.call(real));
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
                real.appendChild(API.element.button(function () {
                    obj.action.call(this);
                }, obj.title, disabled));
                obj.sub && (label.innerHTML = \`\${obj.label}<div class="sub">\${obj.sub}</div>\`);
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
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
                obj.callback && new Promise(r => obj.callback.call(real));
                let input = value.children[0];
                let clear = value.children[2];
                obj.hasOwnProperty("value") && (input.value = config[obj.key]);
                Object.entries(obj.input).forEach(d => { input.setAttribute(d[0], d[1]); });
                value.onmouseover = () => history.length > 0 && (clear && (clear.style.display = "block"));
                value.onmouseout = () => { clear && (clear.style.display = "none"); };
                clear && (clear.onclick = () => {
                    history = this.history[obj.key] = [];
                    real.querySelectorAll("option").forEach(d => d.remove());
                    clear.style.display = "none";
                });
                obj.title ? (real.querySelector(".button").onclick = () => {
                    if (!input.value || (config[obj.key] == input.value))
                        return;
                    if (obj.pattern && !obj.pattern.test(input.value))
                        return toast.warning("非法输入！", \`正则限制：\${obj.pattern.toString()}\`);
                    real.querySelector(".button").setAttribute("disabled", "disabled");
                    disabled && setTimeout(() => real.querySelector(".button").removeAttribute("disabled"), disabled * 1000);
                    obj.hasOwnProperty("value") && (config[obj.key] = input.value, config[obj.key] = input.value);
                    !history.includes(input.value) && history.push(input.value) && (this.history[obj.key] = history);
                    obj.action && obj.action.call(real, input.value);
                }) : (input.onchange = () => {
                    if (obj.pattern && !obj.pattern.test(input.value))
                        return toast.warning("非法输入！", \`正则限制：\${obj.pattern.toString()}\`);
                    obj.hasOwnProperty("value") && (config[obj.key] = input.value, config[obj.key] = input.value);
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
                obj.callback && new Promise(r => obj.callback.call(real));
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
                node = node || this.itemContain(obj.sort);
                let div = document.createElement("div");
                const root = div.attachShadow({ mode: "closed" });
                const real = API.addElement("div", { class: "contain" }, root);
                Reflect.set(this.list, obj.key, real);
                API.addCss(API.getModule("ui-item.css"), "", root);
                obj.svg && real.appendChild(this.icon(obj.svg));
                const label = API.addElement("div", { class: "label" }, real, obj.label);
                real.appendChild(API.element.checkbox(obj.list, function (v) {
                    config[obj.key] = v;
                    obj.action && obj.action.call(this, v);
                }, config[obj.key]));
                obj.sub && (label.innerHTML = \`\${obj.label}<div class="sub">\${obj.sub}</div>\`);
                obj.float && this.float(real, obj.float);
                node && node.appendChild(div);
                obj.callback && new Promise(r => obj.callback.call(real));
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
                obj.callback && new Promise(r => obj.callback.call(real));
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
        /**
         * 设置项表
         */
        Ui.list = {};
        API.importModule("setting.js");
        const ui = new Ui();
        Reflect.set(API, "displaySetting", (key) => ui.display(key));
        GM.getValue("modules") && API.alertMessage(\`脚本更新残留后残留了大量废弃数据在您本地存储中，造成了额外的性能消耗！</br>是否立即执行清洁安装？</br><strong>将删除本脚本所有存储痕迹，您可以先备份设置再执行本操作！</strong>\`).then(d => {
            if (d) {
                const arr = GM.listValues();
                arr.forEach(d => GM.deleteValue(d));
                toast.success("清洁完成！");
            }
            else
                toast.warning("取消操作，将在下次刷新时重新提示！");
        });
    }
    catch (e) {
        toast.error("ui.js", e);
    }
})();
`;
    modules["url.js"] = `/**
 * 本模块封装了urlAPI请求以便于访问
 */
(function () {
    class Url {
        constructor() {
            /**
             * url的默认参数，即UrlDetail未列出或可选的部分
             */
            this.jsonUrlDefault = {
                "api.bilibili.com/pgc/player/web/playurl": { qn: 125, otype: 'json', fourk: 1 },
                "api.bilibili.com/x/player/playurl": { qn: 125, otype: 'json', fourk: 1 },
                "interface.bilibili.com/v2/playurl": { otype: 'json', qn: 125, quality: 125, type: '' },
                "api.bilibili.com/pgc/player/api/playurlproj": { appkey: 0, otype: 'json', platform: 'android_i', qn: 208 },
                "app.bilibili.com/v2/playurlproj": { appkey: 0, otype: 'json', platform: 'android_i', qn: 208 },
                "api.bilibili.com/pgc/player/api/playurltv": { appkey: 1, qn: 125, fourk: 1, otype: 'json', fnver: 0, fnval: 80, platform: "android", mobi_app: "android_tv_yst", build: 102801 },
                "api.bilibili.com/x/tv/ugc/playurl": { appkey: 1, qn: 125, fourk: 1, otype: 'json', fnver: 0, fnval: 80, platform: "android", mobi_app: "android_tv_yst", build: 102801 }
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
            Reflect.has(obj, "appkey") && (obj = this.sign(obj));
            return GM ? xhr.GM({
                url: API.objUrl(\`//\${url}\`, obj),
                responseType: "json"
            }) : xhr({
                url: API.objUrl(\`//\${url}\`, obj),
                responseType: "json",
                credentials: true
            });
        }
        sign(obj) {
            return API.urlObj(\`?\${API.urlsign("", obj, obj.appkey)}\`);
        }
    }
    const exports = new Url();
    API.getJson = (url, detail, GM) => {
        try {
            return exports.getJson(url, detail, GM);
        }
        catch (e) {
            toast.error("url.js", e);
        }
    };
})();
`;
    modules["urlInputCheck.js"] = `/**
 * 本模块负责检查url输入并返回对应aid/cid等值
 */
(function () {
    /**
     * 将数据缓存起来，以免重复查询
     */
    const catchs = { aid: {}, ssid: {}, epid: {} };
    API.urlInputCheck = async function (input) {
        let aid, cid, ssid, epid, p, pgc = false;
        toast("正在解析链接：" + input);
        if (input && !input.includes("?"))
            input = "?" + input; // 重整化输入便于提取参数
        let obj = API.urlObj(input); // 获取参数对象
        aid = input.match(/[aA][vV][0-9]+/) ? input.match(/[aA][vV][0-9]+/)[0].match(/\\d+/)[0] : undefined;
        aid = aid || obj.aid || undefined;
        aid = aid || (/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/.test(input) ? API.abv(input.match(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/)[0]) : undefined);
        aid = aid || (obj.bvid ? API.abv(obj.bvid) : undefined);
        p = obj.p || 1;
        try {
            if (aid) {
                if (aid == API.aid)
                    cid = API.cid;
                // 有缓存数据的情况
                cid = catchs.aid[aid] && catchs.aid[aid][p - 1].cid;
                // 直接获取到cid的情况
                cid = cid || obj.cid || undefined;
                if (!cid) {
                    try {
                        // 尝试访问B站服务器获取信息
                        catchs.aid[aid] = API.jsonCheck(await xhr({ url: API.objUrl("https://api.bilibili.com/x/player/pagelist", { "aid": aid }) })).data;
                        cid = catchs.aid[aid][p - 1].cid;
                        toast("正在请求av视频数据", "分P名称：" + catchs.aid[aid][p - 1].part);
                    }
                    catch (e) {
                        e = Array.isArray(e) ? e : [e];
                        debug.error("获取视频信息出错：aid：" + aid, "HOST：https://api.bilibili.com/x/player/pagelist", ...e);
                        try {
                            // 尝试访问BiliPlus获取信息
                            let data = API.jsonCheck(await xhr({ url: API.objUrl("https://www.biliplus.com/api/view", { "id": aid }) }));
                            catchs.aid[aid] = data.list || (data.v2_app_api && data.v2_app_api.pages);
                            cid = catchs.aid[aid][p - 1].cid;
                            toast("正在请求av视频数据", "分P名称：" + catchs.aid[aid][p - 1].part);
                        }
                        catch (e) {
                            e = Array.isArray(e) ? e : [e];
                            debug.error("获取视频信息出错：aid：" + aid, "HOST：https://www.biliplus.com/api/view", ...e);
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
                    if (ssid)
                        data = JSON.stringify(catchs.ssid[ssid]) || await xhr({ url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", { season_id: ssid }) });
                    else if (epid)
                        data = JSON.stringify(catchs.epid[epid]) || await xhr({ url: API.objUrl("https://bangumi.bilibili.com/view/web_api/season", { ep_id: epid }) });
                    if (data) {
                        data = API.importModule("bangumi-season.js", { __INITIAL_STATE__: data, epid: epid });
                        ssid && (catchs.ssid[ssid] = data);
                        epid && (catchs.epid[epid] = data);
                        aid = data.epInfo.aid;
                        cid = data.epInfo.cid;
                        pgc = true;
                        toast("正在请求Bangumi数据", "系列名称：" + data.mediaInfo.title, "分p名称：" + data.epInfo.index_title);
                    }
                }
                catch (e) {
                    e = Array.isArray(e) ? e : [e];
                    let data;
                    if (epid)
                        debug.error("获取视频信息出错：epid：" + epid, "HOST：https://bangumi.bilibili.com/view/web_api/season", ...e);
                    else if (ssid)
                        debug.error("获取视频信息出错：ssid：" + ssid, "HOST：https://bangumi.bilibili.com/view/web_api/season", ...e);
                    try {
                        if (epid) {
                            data = await xhr({ url: API.objUrl(\`\${config.limitServer}/intl/gateway/v2/ogv/view/app/season\`, { ep_id: epid }) });
                        }
                        else if (ssid) {
                            data = await xhr({ url: API.objUrl(\`\${config.limitServer}/intl/gateway/v2/ogv/view/app/season\`, { season_id: ssid }) });
                        }
                        data = API.importModule("bangumi-global.js", { __INITIAL_STATE__: data, epid: epid });
                        aid = data.epInfo.aid;
                        cid = data.epInfo.cid;
                        pgc = true;
                        toast("正在请求Bangumi数据", "系列名称：" + data.mediaInfo.title, "分p名称：" + data.epInfo.index_title);
                    }
                    catch (e) { }
                }
            }
        }
        catch (e) {
            toast.error("urlInputCheck.js", e);
        }
        return { aid, cid, ssid, epid, p, pgc };
    };
})();
`;
    modules["vector.js"] = `/**
 * 本页面负责引导全局模块运行，一般全局生效运行的模块请将导入命令写在这里
 */
(function () {
    try {
        API.initUi(); // 设置ui
        API.importModule("parameterTrim.js", { Before: false }); // 网址清理，重写后处理
        API.importModule("infoNewNumber.js"); // 旧版顶栏资讯数
        config.protoDm && API.importModule("protoDm.js"); // 新版弹幕
        config.liveDm && API.importModule("webSocket.js"); // 实时弹幕
        config.logReport && API.importModule("sendBeacon.js"); // 日志拦截
        API.importModule("playinfoRecord.js"); // playinfo记录
        API.importModule("unread.js"); // 远古动态
        API.importModule("autoFix.js"); // 自动化处理
        API.importModule("player-v2.js"); // 视频信息
        API.importModule("sectionTypo.js"); // 顶栏文字
        config.heartbeat && API.importModule("heartbeat.js"); // 视频心跳
        config.videoLimit && API.importModule("videoLimit.js"); // 播放限制
        API.importModule("banner.js"); // 顶栏动图
        config.noVideo && API.importModule("noVideo.js"); // 视频拦截
        config.replyList && API.importModule("replyList.js"); // 翻页评论
        config.section && API.importModule("section.js"); // 顶栏底栏
        config.danmakuHashId && API.path.name && API.importModule("danmakuHashId.js"); // 弹幕反查
        config.unloginPopover && !API.uid && API.importModule("unloginPopover.js"); // 未登录弹窗
        config.downloadContentmenu && API.importModule("contentMenu.js"); // 下载右键菜单
        // 自运行模块，通常是插件
        API.importModule().forEach(d => { d.includes("[run]") && API.importModule(d); });
    }
    catch (e) {
        toast.error("vector.js", e);
    }
})();
`;
    modules["xhr.js"] = `(function () {
    class Xhr {
        /**
         * \`XMLHttpRequest\`的\`Promise\`封装
         * @param details 以对象形式传递的参数，注意\`onload\`回调会覆盖Promise结果
         * @returns \`Promise\`托管的请求结果或者报错信息，\`async = false\` 时除外，直接返回结果
         */
        static xhr(details) {
            details.method == "POST" && (details.headers = details.headers || {}, !details.headers["Content-Type"] && Reflect.set(details.headers, "Content-Type", "application/x-www-form-urlencoded"));
            if (details.hasOwnProperty("async") && Boolean(details.async) === false) {
                let xhr = new XMLHttpRequest();
                xhr.open(details.method || 'GET', details.url, false);
                details.responseType && (xhr.responseType = details.responseType);
                details.credentials && (xhr.withCredentials = true);
                details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
                details.timeout && (xhr.timeout = details.timeout);
                xhr.send(details.data);
                return xhr.response;
            }
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
        /**
         * \`GM_xmlhttpRequest\`的\`Promise\`封装，用于跨域\`XMLHttpRequest\`请求
         * @param details 以对象形式传递的参数，注意\`onload\`回调会覆盖Promise结果
         * @returns \`Promise\`托管的请求结果或者报错信息
         */
        static GM(details) {
            return new Promise((resolve, reject) => {
                details.method = details.method || 'GET';
                details.onload = details.onload || ((xhr) => resolve(xhr.response));
                details.onerror = details.onerror || ((xhr) => reject(xhr.response));
                GM.xmlHttpRequest(details);
            });
        }
    }
    // @ts-ignore
    API.xhr = (details) => Xhr.xhr(details), API.xhr.GM = (details) => Xhr.GM(details);
})();
`;
    modules["av-biliplus.js"] = `/**
 * 本模块负责重构av/BV页__INITIAL_STATE__
 * 请以\`__INITIAL_STATE__\`名义传入原始数据，重构结果以API对象的同名属性的形式返回
 * 原始数据对应来源\`//www.biliplus.com/api/view?aid\`
 * 重构__INITIAL_STATE__是非常精细的工具，请务必耐心细致
 */
(function () {
    const result = {
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
            tid: 0,
            title: 0,
            tname: 0,
            videos: 1,
            embedPlayer: 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=0&aid=0&pre_ad=")'
        }
    };
    // @ts-ignore：传递参数
    let data = API.jsonCheck(__INITIAL_STATE__);
    // 处理重定向
    data.v2_app_api && data.v2_app_api.redirect_url && (location.href = data.v2_app_api.redirect_url);
    data.bangumi && data.bangumi.ogv_play_url && (location.href = data.bangumi.ogv_play_url);
    result.aid = data.aid || API.aid;
    result.upData.name = data.author;
    result.upData.mid = data.mid;
    result.videoData.aid = data.aid || API.aid;
    result.videoData.cid = data.list[0].cid;
    result.videoData.ctime = data.created;
    result.videoData.pubdate = data.created;
    result.videoData.desc = data.description;
    result.videoData.pages[0].cid = data.list[0].cid;
    result.videoData.stat.aid = data.aid;
    result.videoData.stat.coin = data.coins;
    result.videoData.stat.danmaku = data.video_review;
    result.videoData.stat.favorite = data.favorites;
    result.videoData.stat.reply = data.review;
    result.videoData.stat.view = data.play;
    result.videoData.tid = data.tid;
    result.videoData.title = data.title;
    result.videoData.tname = data.typename;
    data.v2_app_api && (result.tags = data.v2_app_api.tag, result.videoData = data.v2_app_api);
    result.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + data.list[0].cid + '&aid=' + data.aid + '&pre_ad=")';
    //API.switchVideo(()=>API.debug.msg(300,"视频已失效","加载弹幕","缓存信息仅供参考",true,()=>API.importModule("")))
    API.__INITIAL_STATE__ = result;
})();
`;
    modules["av-detail.js"] = `/**
 * 本模块负责重构av/BV页__INITIAL_STATE__
 * 请以\`__INITIAL_STATE__\`名义传入原始数据，重构结果以API对象的同名属性的形式返回
 * 原始数据对应来源\`//api.bilibili.com/x/web-interface/view/detail?aid\`
 * 重构__INITIAL_STATE__是非常精细的工具，请务必耐心细致
 */
(function () {
    const result = {
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
            tid: 0,
            title: 0,
            tname: 0,
            videos: 1,
            embedPlayer: 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=0&aid=0&pre_ad=")'
        }
    };
    // @ts-ignore：传递的参数
    let data = API.jsonCheck(__INITIAL_STATE__).data;
    if (!data.View.cid && data.View.forward) {
        toast.warning("视频撞车了！正在跳转至原视频~");
        location.href = \`https://www.bilibili.com/video/av\${data.View.forward}\`;
    }
    result.aid = data.View.aid;
    result.related = data.Related || [];
    result.tags = data.Tags || [];
    result.upData = data.Card.card || {};
    result.upData.archiveCount = data.Card.archive_count;
    result.videoData = data.View || {};
    result.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + data.View.cid + '&aid=' + data.View.aid + '&pre_ad=")';
    API.__INITIAL_STATE__ = result;
})();
`;
    modules["bangumi-global.js"] = `/**
 * 本模块负责重构bangumi页__INITIAL_STATE__
 * 请以\`__INITIAL_STATE__\`名义传入原始数据，重构结果以API对象的同名属性的形式返回
 * 同时传入的还有以\`epid\`的名义指定回目，默认值为0即第一回
 * 原始数据对应来源\`//api.global.bilibili.com/view/web_api/season?season_id/ep_id\`
 * 重构__INITIAL_STATE__是非常精细的工具，请务必耐心细致
 */
(function () {
    const result = {
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
        pubInfo: {},
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
    // @ts-expect-error：传递参数
    let epId = Number(epid) || null, data = API.jsonCheck(__INITIAL_STATE__).result;
    let ids = [], epList = [];
    data.modules.forEach((d) => {
        d.data.episodes.forEach((d) => {
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
    result.activity = data.activity_dialog || {};
    result.epId = epId || ids[0];
    result.epInfo = epId ? epList[ids.indexOf(epId)] : epList[0];
    result.epList = epList;
    result.mediaInfo.actors = data.actor.info;
    result.mediaInfo.alias = data.alias;
    result.mediaInfo.areas = data.areas;
    result.mediaInfo.cover = data.cover;
    result.mediaInfo.evaluate = data.evaluate;
    result.mediaInfo.link = data.link;
    result.mediaInfo.mode = data.mode;
    result.mediaInfo.season_id = data.season_id;
    result.mediaInfo.season_status = data.season_status;
    result.mediaInfo.season_title = data.season_title;
    result.mediaInfo.staff = data.staff;
    result.mediaInfo.style = data.styles;
    result.mediaInfo.title = data.title;
    result.mediaInfo.total_ep = ids.length;
    result.newestEp = data.new_ep;
    result.pubInfo = data.publish;
    result.pubInfo.is_started = 1;
    result.rightsInfo = data.right;
    result.seasonStat = data.stat;
    result.ssId = data.season_id;
    API.__INITIAL_STATE__ = result;
})();
`;
    modules["bangumi-season.js"] = `/**
 * 本模块负责重构bangumi页__INITIAL_STATE__
 * 请以\`__INITIAL_STATE__\`名义传入原始数据，重构结果以API对象的同名属性的形式返回
 * 同时传入的还有以\`epid\`的名义指定回目，默认值为0即第一回
 * 原始数据对应来源\`//bangumi.bilibili.com/view/web_api/season?season_id/ep_id\`
 * 重构__INITIAL_STATE__是非常精细的工具，请务必耐心细致
 */
(function () {
    const result = {
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
        pubInfo: {},
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
    // @ts-expect-error：传递参数
    let epId = Number(epid) || null, data = API.jsonCheck(__INITIAL_STATE__).result;
    API.vipCid = [];
    let ids = data.episodes.reduce((s, d) => {
        s.push(d.ep_id);
        (d.badge == "会员" || d.badge_type) && API.vipCid.push(d.cid);
        return s;
    }, []);
    result.activity = data.activity || {};
    result.epId = epId || ids[0];
    result.epInfo = data.episodes[ids.indexOf(epId)] || data.episodes[0];
    result.epList = data.episodes;
    result.mdId = data.media_id;
    result.mediaInfo.actors = data.actors;
    result.mediaInfo.alias = data.alias;
    result.mediaInfo.areas = data.areas;
    result.mediaInfo.bkg_cover = data.bkg_cover;
    result.mediaInfo.cover = data.cover;
    result.mediaInfo.evaluate = data.evaluate;
    result.mediaInfo.is_paster_ads = data.is_paster_ads;
    result.mediaInfo.jp_title = data.jp_title;
    result.mediaInfo.link = data.link;
    result.mediaInfo.media_id = data.media_id;
    result.mediaInfo.mode = data.mode;
    result.mediaInfo.paster_text = data.paster_text;
    result.mediaInfo.season_id = data.season_id;
    result.mediaInfo.season_status = data.season_status;
    result.mediaInfo.season_title = data.season_title;
    result.mediaInfo.season_type = data.season_type;
    result.mediaInfo.square_cover = data.square_cover;
    result.mediaInfo.staff = data.staff;
    result.mediaInfo.style = data.style;
    result.mediaInfo.title = data.title;
    result.mediaInfo.total_ep = data.total_ep;
    result.mediaRating = data.rating || {};
    result.newestEp = data.newest_ep;
    result.payMent = data.payment || {};
    result.pubInfo = data.publish;
    result.seasonList = data.seasons || [];
    result.seasonStat = data.stat;
    result.special = data.bkg_cover ? true : false;
    result.ssId = data.season_id;
    result.upInfo = data.up_info;
    API.__INITIAL_STATE__ = result;
})();
`;
    /**
     * 出事话脚本设置数据
     */
    const CONFIG = {};
    const config = new Proxy(CONFIG, {
        set: (_target, p, value) => {
            CONFIG[p] = value;
            GM.setValue("config", CONFIG);
            return true;
        },
        get: (_target, p) => CONFIG[p]
    });
    Object.entries(GM.getValue("config", {})).forEach(k => Reflect.set(config, k[0], k[1]));
    class API {
        constructor() {
            this.GM = GM;
            this.Name = GM.info.script.name;
            this.Virsion = GM.info.script.version;
            this.Handler = [GM.info.scriptHandler, GM.info.version].join(" ");
            this.config = config;
            /**
             * 获取模块内容
             * @param name 模块名字
             * @returns json直接返回格式化对象，其他返回字符串
             */
            this.getModule = (name) => Reflect.get(modules, name);
            /**
             * 载入模块
             * @param name 模块名字
             * @param args 传递给对方的全局变量：格式{变量名：变量值}
             */
            this.importModule = (name, args = {}) => {
                if (!name)
                    return Object.keys(modules);
                if (Reflect.has(modules, name)) {
                    new Function("API", "GM", "debug", "toast", "xhr", "config", "importModule", ...Object.keys(args), Reflect.get(modules, name))(API.API, GM, Reflect.get(this, "debug"), Reflect.get(this, "toast"), Reflect.get(this, "xhr"), config, this.importModule, ...Object.keys(args).reduce((s, d) => {
                        s.push(args[d]);
                        return s;
                    }, []));
                }
            };
            API.API = new Proxy(this, {
                get: (t, p) => {
                    return Reflect.get(t, p) || Reflect.get(root, p) || (Reflect.has(modules["apply.json"], p) ? (t.importModule(modules["apply.json"][p], {}),
                        Reflect.get(t, p)) : undefined);
                },
                set: (t, p, value) => {
                    Reflect.set(t, p, value);
                    return true;
                }
            });
            new Function("API", Reflect.get(modules, "debug.js"))(API.API);
            new Function("API", "debug", "config", Reflect.get(modules, "toast.js"))(API.API, Reflect.get(this, "debug"), config);
            new Function("API", "GM", Reflect.get(modules, "xhr.js"))(API.API, GM);
            this.importModule("rewrite.js");
        }
        static modifyConfig(obj) {
            Reflect.has(obj, "value") && !Reflect.has(config, Reflect.get(obj, "key")) && Reflect.set(config, Reflect.get(obj, "key"), Reflect.get(obj, "value"));
            Reflect.get(obj, "type") == "sort" && Reflect.has(obj, "list") && Reflect.get(obj, "list").forEach((d) => this.modifyConfig(d));
        }
        registerSetting(obj) {
            API.SETTING.push(obj);
            API.modifyConfig(obj);
        }
        registerMenu(obj) {
            Reflect.set(API.MENU, Reflect.get(obj, "key"), obj);
        }
        changeSettingMode(mode) {
            const keys = Object.keys(mode);
            API.SETTING.forEach(d => {
                Reflect.has(d, "key") && keys.includes(Reflect.get(d, "key")) && Reflect.set(d, "hidden", Reflect.get(mode, Reflect.get(d, "key")));
            });
        }
        rewriteHTML(html) {
            this.getModule("bug.json").forEach((d) => { root[d] && Reflect.set(root, d, undefined); });
            document.open();
            document.write(html);
            document.close();
            config.rewriteMethod == "异步" && this.importModule("vector.js"); // 重写后页面正常引导
        }
        initUi() {
            root.self === root.top && this.runWhile(() => document.body, () => {
                this.importModule("ui.js", { MENU: API.MENU, SETTING: API.SETTING });
            });
            new Promise(r => delete this.initUi);
        }
    }
    API.SETTING = [];
    API.MENU = {};
    new API();
})();
