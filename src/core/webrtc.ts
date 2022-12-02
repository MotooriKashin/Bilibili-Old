// @ts-nocheck
export class WebTRC {
    static disable() {
        navigator.getUserMedia = undefined;
        window.MediaStreamTrack = undefined;
        window.RTCPeerConnection = undefined;
        window.RTCSessionDescription = undefined;
        navigator.mozGetUserMedia = undefined;
        window.mozMediaStreamTrack = undefined;
        window.mozRTCPeerConnection = undefined;
        window.mozRTCSessionDescription = undefined;
        navigator.webkitGetUserMedia = undefined;
        window.webkitMediaStreamTrack = undefined;
        window.webkitRTCPeerConnection = undefined;
        window.webkitRTCSessionDescription = undefined;
    }
}