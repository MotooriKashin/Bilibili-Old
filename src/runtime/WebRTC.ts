// @ts-nocheck
/** 禁用WebRTC */
export function disableWebRTC() {
    if (typeof navigator.getUserMedia !== "undefined") navigator.getUserMedia = undefined;
    if (typeof window.MediaStreamTrack !== "undefined") window.MediaStreamTrack = undefined;
    if (typeof window.RTCPeerConnection !== "undefined") window.RTCPeerConnection = undefined;
    if (typeof window.RTCSessionDescription !== "undefined") window.RTCSessionDescription = undefined;
    if (typeof navigator.mozGetUserMedia !== "undefined") navigator.mozGetUserMedia = undefined;
    if (typeof window.mozMediaStreamTrack !== "undefined") window.mozMediaStreamTrack = undefined;
    if (typeof window.mozRTCPeerConnection !== "undefined") window.mozRTCPeerConnection = undefined;
    if (typeof window.mozRTCSessionDescription !== "undefined") window.mozRTCSessionDescription = undefined;
    if (typeof navigator.webkitGetUserMedia !== "undefined") navigator.webkitGetUserMedia = undefined;
    if (typeof window.webkitMediaStreamTrack !== "undefined") window.webkitMediaStreamTrack = undefined;
    if (typeof window.webkitRTCPeerConnection !== "undefined") window.webkitRTCPeerConnection = undefined;
    if (typeof window.webkitRTCSessionDescription !== "undefined") window.webkitRTCSessionDescription = undefined;
}