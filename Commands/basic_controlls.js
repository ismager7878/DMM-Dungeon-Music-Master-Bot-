
import {Song} from "../song.js";
import {joinVoiceChannel} from '@discordjs/voice';

export const pause = (bottools, message) => {
    bottools.player.pause();
}

export const unpause = (bottools, message) => {
    bottools.player.unpause();
}

export const stop = (bottools, message) => {
    bottools.player.stop();
    bottools.connection.destroy();
}

export const play = (bottools, message, args) => {
    const voiceChannel = message.member.voice.channel;
    if(!message.member.voice.channel){
       message.reply("You need to be in a voice channel to play music!");
       return;
    }
    bottools.connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    //playSpotifyTrack(connection, audio);
    const song = new Song(args[0]);
    bottools.player.play(song.resource);
    bottools.connection.subscribe(bottools.player);
};

