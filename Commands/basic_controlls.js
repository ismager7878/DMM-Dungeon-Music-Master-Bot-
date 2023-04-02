
import {Song} from '../Tools/song.js';
import {joinVoiceChannel} from '@discordjs/voice';
import { ytsearch } from '../Tools/search.js';
import { AudioPlayerStatus } from "@discordjs/voice";

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

export const play = async (bottools, message, args) => {
    const voiceChannel = message.member.voice.channel;

    bottools.connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    bottools.connection.subscribe(bottools.player);

    if(!args[0]) {
        if(bottools.playlist.length == 0){
            message.reply("No song to play, play a song with !play <url>/<song name>, or add a song to the queue with !add <url>/<song name>");
            return;
        }
        if(AudioPlayerStatus.Playing == bottools.player.state.status){
            message.reply("Already playing a song, if you want to overwrite the current song add a link or song name after the command");
            return;
        }
        bottools.player.play(bottools.playlist.shift().resource);
        return;
    }
    let url = args[0];

    if(!url.startsWith("http")){
        message.reply("Searching for song");
        url = await ytsearch(args.join(" ")).catch((err) => {
            message.reply("Song not found");
            return;
        });
    }else if(args.length > 1){
        message.reply("Please only one song at the time");
        return;
    }

    const song = new Song(url);
    await song.initSong().then(() => {
        bottools.player.play(song.resource);
        message.reply(`Now playing: ${song.title}`);
    }).catch((err) => {
        message.reply("Song not found");
    });    
};

