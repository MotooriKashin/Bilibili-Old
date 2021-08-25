/**
 * 本模块负责备份还原旧版播放器设置数据
 * 因为新旧版播放器设置数据存放方式相同但会相互覆盖
 * */
let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
let settings_copy = GM.getValue<{ [name: string]: any }>("bilibili_player_settings", {});
if (bilibili_player_settings) {
    let settings = <{ [name: string]: any }>JSON.parse(bilibili_player_settings);
    if (settings?.video_status?.autopart !== "") GM.setValue<{ [name: string]: any }>("bilibili_player_settings", settings);
    else if (settings_copy) localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
} else if (settings_copy) {
    localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
}