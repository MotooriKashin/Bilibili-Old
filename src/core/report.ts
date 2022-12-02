import { propertyHook } from "../utils/hook/method";

class Cache {
    fpriskMsg = {};
}
class EventTracker {
    extMsgs = {};
    legalContainer = 'report-wrap-module';
    bindEvent() { }
    bindHeatMapEvent() { }
    checkContainer() { }
    eventCB() { }
    handleSelfDefReport() { }
    todo() { }
}
class LoadTracker {
    msg = {};
    showRawPerformance() { };
    todo() { };
}
class PvTracker {
    extMsgs = {};
    _uuid = '';
    sendPV() { }
    todo() { }
}
class ScrollTracker {
    extMsgs = {};
    ignoreHidden = true;
    reportedIds = [];
    scrollDivClass = '';
    scrollLintenerFns = [];
    scrollMsg = {};
    scrollReportOffset = 200;
    scrollSubDivClass = '';
    addScrollListenNode() { }
    checkScroll() { }
    customReport() { }
    getOffset() { }
    inView() { }
    judgeAppear() { }
    judgeCustom() { }
    judgeHidden() { }
    judgeSubAppear() { }
    removeScrollListenNode() { }
    subInView() { }
    todo() { }
    todoCustom() { }
}
const reportConfig = { msgObjects: 'spmReportData', sample: -1, scrollTracker: false };
const reportMsgObj = {};
export class ReportObserver {
    constructor() {
        propertyHook(window, 'reportObserver', this);
        propertyHook(window, 'reportConfig', reportConfig);
    }
    cache = new Cache();
    eventTracker = new EventTracker();
    loadTracker = new LoadTracker();
    pvTracker = new PvTracker();
    scrollTracker = new ScrollTracker();
    forceCommit() { }
    importTracker() { }
    init() { }
    initBsource() { }
    initTracker() { }
    reportCustomData() { }
    reportWithAdditionalParam() { }
    reportWithSpmPrefix() { }
    sendPV() { }
    sendPerformance() { }
    setSPM_id() { }
    setSpeicalMsg() { }
    updateConfig() { }
}
const statisObserverConfig = {
    blackEvents: [],
    clickConfig: { logId: '', isDoubleWrite: false },
    loadPerform: false,
    loadSpecial: false,
    performConfig: { isWrite: false },
    pvConfig: { isDoubleWrite: false, logId: '', selfDefMsg: {} },
    selfConfig: { logId: '', isDoubleWrite: false, isSelfDefWrite: false, isDefaultWrite: false },
    spmId: ''
};
export class StatisObserver {
    __bufferFuns = [];
    __initConfig = {};
    __loadedFlag = { baidu: false, error: false, event: false, perform: false, pv: false, special: false };
    __visitId = '';
    constructor() {
        propertyHook(window, '__statisObserver', this);
        propertyHook(window, 'reportMsgObj', reportMsgObj);
        propertyHook(window, '__statisObserverConfig', statisObserverConfig);
    }
    addClickTracker() { }
    addLegalContainer() { }
    addSelfDefineMsg() { }
    forceCommit() { }
    getPvid() { }
    removeLegalContainer() { }
    removeSelfDefineMsg() { }
    sendBaidu() { }
    sendClickEvent() { }
    sendCustomMetrics() { }
    sendError() { }
    sendPV() { }
    sendPerform() { }
    sendSpecial() { }
    setAttrName() { }
    setBaseUrl() { }
    setErrorInterval() { }
    setErrorLogId() { }
    setEventLogId() { }
    setEventSendStatus() { }
    setPVLogId() { }
    setPVSendStatus() { }
    setPerformLogId() { }
    setPvid() { }
    setSpecialFirstLoop() { }
    setSpecialInterval() { }
    setSpecialLogId() { }
    setSpmId() { }
    startPoolListen() { }
    startSpecialLoop() { }
    stopPoolListen() { }
    stopSpecialLoop() { }
}