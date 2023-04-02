import { createAudioPlayer, AudioPlayerStatus } from "@discordjs/voice";

export class BotTool{
    constructor(guild){
        this.playlist = [];
        this.connection = null;
        this.guild = guild;
        this.player = createAudioPlayer().on(AudioPlayerStatus.Idle, () => {
            if (this.playlist.length > 0) {
                this.player.play(this.playlist.shift().resource);
            }
        });
    }
}
