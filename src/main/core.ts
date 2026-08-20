(() => {
    import('../utils/debug').then(({ log }) => {
        log('s1.hdslb.com/bfs/seed/jinkela/short/player/js/core.js')
    });
    enum GroupKind {
        Ugc,
        Pgc,
        Pugv,
        Stein,
        Oneself,
        Manager,
    }
    enum ChannelKind {
        Default,
        Manager,
        Creator,
        Oneself,
        Homepage,
        Homepage_Topic,
        Embedded,
        PC_APP,
        Playlist,
        Embedded_White,
        Embedded_Other,
        Gamecenter,
        Mini_Site,
    }
    enum EventType {
        Media_Autoplay_Not_Allowed = 'Media_Autoplay_Not_Allowed',
        Media_Element_Resize = 'Media_Element_Resize',
        Player_Abort = 'Player_Abort',
        Player_Access_Changed = 'Player_Access_Changed',
        Player_Ai_Animation_Triggered = 'Player_Ai_Animation_Triggered',
        Player_AspectRatioChange = 'Player_AspectRatioChange',
        Player_Aspect_Switch_Change = 'Player_Aspect_Switch_Change',
        Player_AutoplayChange = 'Player_AutoplayChange',
        Player_BlackGapChange = 'Player_BlackGapChange',
        Player_CANT_PLAY_DRM = 'Player_Cant_Play_Drm',
        Player_Canplay = 'Player_Canplay',
        Player_Committed = 'Player_Committed',
        Player_Connected = 'Player_Connected',
        Player_Container_Resize = 'Player_Container_Resize',
        Player_Danmaku_Change = 'Player_Danmaku_Change',
        Player_Disconnect = 'Player_Disconnect',
        Player_Dispose = 'Player_Dispose',
        Player_DurationChange = 'Player_DurationChange',
        Player_Emptied = 'Player_Emptied',
        Player_Ended = 'Player_Ended',
        Player_Enter_Loading = 'Player_Enter_Loading',
        Player_Error = 'Player_Error',
        Player_HandoffChange = 'Player_HandoffChange',
        Player_Handoff_Signal = 'Player_Handoff_Signal',
        Player_Hide_Controls = 'Player_Hide_Controls',
        Player_Hide_EndPanel = 'Player_Hide_EndPanel',
        Player_Hotspot_Change = 'Player_Hotspot_Change',
        Player_Idle_Frame = 'Player_Idle_Frame',
        Player_Initialized = 'Player_Initialized',
        Player_Leave_Loading = 'Player_Leave_Loading',
        Player_LightOffChange = 'Player_LightOffChange',
        Player_LoadStart = 'Player_LoadStart',
        Player_LoadedData = 'Player_LoadedData',
        Player_LoadedMetadata = 'Player_LoadedMetadata',
        Player_LoopChange = 'Player_LoopChange',
        Player_Loop_Signal = 'Player_Loop_Signal',
        Player_LoudnessChange = 'Player_LoudnessChange',
        Player_MirrorChange = 'Player_MirrorChange',
        Player_Navigate = 'Player_Navigate',
        Player_OpEdChange = 'Player_OpEdChange',
        Player_PatchSwitch = 'Player_PatchSwitch',
        Player_Patch_Adv_Report = 'Player_Patch_Adv_Report',
        Player_Pause = 'Player_Pause',
        Player_Perch_Click = 'Player_Perch_Click',
        Player_Play = 'Player_Play',
        Player_PlayUrl_Done = 'Player_PlayUrl_Done',
        Player_Playing = 'Player_Playing',
        Player_Polar_Report = 'Player_Polar_Report',
        Player_PreferCodecChange = 'Player_PreferCodecChange',
        Player_Prepared = 'Player_Prepared',
        Player_Progress = 'Player_Progress',
        Player_ProgressBar_Change = 'Player_ProgressBar_Change',
        Player_Quality_Changed = 'Player_Quality_Changed',
        Player_Quality_Rendered = 'Player_Quality_Rendered',
        Player_Quality_Requested = 'Player_Quality_Requested',
        Player_RateChange = 'Player_RateChange',
        Player_Sand_Animation_Running = 'Player_Sand_Animation_Running',
        Player_Seeked = 'Player_Seeked',
        Player_Seeking = 'Player_Seeking',
        Player_SharePanel_Change = 'Player_SharePanel_Change',
        Player_Show_Controls = 'Player_Show_Controls',
        Player_Show_EndPanel = 'Player_Show_EndPanel',
        Player_Stalled = 'Player_Stalled',
        Player_Statue_Changed = 'Player_Statue_Changed',
        Player_Submit_Feedback = 'Player_Submit_Feedback',
        Player_Subtitle_Change = 'Player_Subtitle_Change',
        Player_Summary_Change = 'Player_Summary_Change',
        Player_Suspend = 'Player_Suspend',
        Player_TimeUpdate = 'Player_TimeUpdate',
        Player_Vip_Qulaity_Trial = 'Player_Vip_Qulaity_Trial',
        Player_Vip_Qulaity_Trial_End = 'Player_Vip_Qulaity_Trial_End',
        Player_Vip_Trial_Prompt_Toast = 'Player_Vip_Trial_Prompt_Toast',
        Player_Vip_Trial_Toast_Envoked = 'Player_Vip_Trial_Toast_Envoked',
        Player_Virtual_Action = 'Player_Virtual_Action',
        Player_VolumeChange = 'Player_VolumeChange',
        Player_Waiting = 'Player_Waiting',
    }
    enum FetcherKind {
        I_PlayUrl,
        I_UserInfo,
        I_ViewInfo,
        I_VideoShot,
        P_Title,
        M_Lottie,
    }
    enum HandoffKind {
        Auto,
        Delay,
        Abort,
    }
    enum InternalKind {
        Like,
        Coin,
        Triple,
        Follow,
        Collect,
        Electric,
        UpInfo,
        Manuscript,
        Interaction_Guide,
        Realname_Certified,
        Super_Quality_Guide,
        DM_Cross,
        Report_Observer,
        Music,
        Premiere,
        Creator_Attention_Pos_Update,
        ThreeBody,
        Redirect,
        Eplist_Pgc_Direct,
        Prev_Next_Pgc_Direct,
        GetVideoData,
        OpenUrl,
        First_Playtime,
        Vip_Vision_Question_Wall,
        Interactive_Panel,
        SetCookie,
    }
    enum ScreenKind {
        Normal,
        Wide,
        Web,
        Mini,
        Full,
        Pip,
    }
    Reflect.set(globalThis, 'nano', Object.assign(Object.create(null), {
        GroupKind,
        ChannelKind,
        EventType,
        FetcherKind,
        HandoffKind,
        InternalKind,
        ScreenKind,
        DolbyVisionSupportStatus: true,
        HDRSupportStatus: true,
        createPlayer: (config: INanoConfig) => {
            const nano = import('./nano').then(({ Nano }) => new Nano(config));
            return Object.assign(Object.create(null), {
                connect: () => {
                    return nano;
                },
                on: async (key: EventType, callback: () => void) => {
                    (await nano).on(key, callback);
                },
                once: async (key: EventType, callback: () => void) => {
                    (await nano).once(key, callback);
                },
                off: async (key: EventType, callback: () => void) => {
                    (await nano).off(key, callback);
                },
                emit: () => ({}),
                getStates: () => ({}),
                isInitialized: () => true,
                seek: async (t: number) => {
                    (await nano).seek(t);
                },
                play: async () => {
                    (await nano).play();
                },
                pause: async () => {
                    (await nano).pause();
                },
                getManifest: () => config,
                reload: async (config: INanoConfig) => {
                    (await nano).reload(config)
                },
                setState: () => { },
                toggleFeature: () => { },
                getElements: () => config.element,
                danmaku: Object.assign(Object.create(null), {
                    isOpen: () => true,
                }),
                isPaused: () => false,
                isEnded: () => false,
                getQuality: () => 0,
                hasValidAdv: () => true,
                requestStatue: async () => { },
                getCurrentTime: () => 0,
                getHandoff: () => { },
                setHandoff: () => { },
                setLoop: async (v: boolean) => {
                    (await nano).setLoop(v)
                },
                toast: {
                    create: () => { },
                },
                fetch: async () => { },
                mediaElement: () => config.element,
                disconnect: async () => {
                    (await nano).disconnect();
                }
            })
        },
        aspectRatio: ({ width, height }: { width: number; height: number; }) => (width ? { aspectRatio: '16:9', width, height: width / 16 * 9 } : { aspectRatio: '16:9', width: height / 9 * 16, height }),
        cookies: Object.assign(Object.create(null), {
            defaults: { domain: '.bilibili.com', expires: 365, path: '/' },
            set: () => { },
            erase: () => { },
            all: () => Object.fromEntries(document.cookie.split('; ').map(d => d.split('='))),
            get: (key: string) => Object.fromEntries(document.cookie.split('; ').map(d => d.split('=')))[key],
        }),
        guid: 3,
        injector: 'nano',
        metadata: { lastCompiled: Temporal.Now.instant().toZonedDateTimeISO(Temporal.Now.timeZoneId()).toJSON(), mode: 'production', name: 'nano', revision: crypto.randomUUID(), version: '4.9.91' },
        prefetch: () => { },
        searchParams: () => Object.entries(new URLSearchParams(location.search).entries()),
    }));

    interface INanoConfig {
        aid: number;
        cid: number;
        bvid: string;
        seasonId: number;
        episodeId: number;
        element: HTMLElement;
        kind: GroupKind;
        channelKind: ChannelKind;
        t: number;
        p: number;
    }
})();
