import type { IPlayer, Player } from "./index.js";

export class NaivePlayer implements IPlayer {
    constructor(
        private player: Player,
        url: string,
    ) {
        player.video.src = url;
        player.statistic('Mime Type:', 'video/mp4');
        player.statistic('playerType:', 'NaivePlayer');
    }
    async onQnChange(qn: number) {
        if (qn > 0) {
            const { currentTime } = this.player.video;
            this.player.content.dispatchEvent(new CustomEvent('--playurl', {
                detail: (v: boolean) => {
                    if (v) {
                        if (this.player.player instanceof NaivePlayer) {
                            this.player.video.currentTime = currentTime;
                            this.player.video.play().catch(() => { });
                        }
                    }
                }
            }));
        }

    }
    identify() {
        this.player.video.removeAttribute('src');
        this.player.video.load();
    }
}