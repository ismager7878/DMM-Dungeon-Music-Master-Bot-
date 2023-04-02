
const {Song} = require('../Tools/song.js')
const {joinVoiceChannel} = require('@discordjs/voice')
const { ytsearch } = require('../Tools/search.js')
const { AudioPlayerStatus } = require("@discordjs/voice")
const { SlashCommandBuilder } = require('discord.js')

const pause = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause song'),
    execute: async (bottools, message) => {
        bottools.player.pause();
    },
}
const unpause = {
    data: new SlashCommandBuilder()
        .setName('unpause')
        .setDescription('Unpause song'),
    execute: async (bottools, message) => {
        bottools.player.unpause();
    }
}
const stop = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop song'),
    execute: async (bottools, message) => {
        bottools.player.stop();
        bottools.connection.destroy();
    }
}
const play = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('/play, /play <link>, /play <song name> play a song from link, search or queue'),
    execute: async (bottools, message, args) => {
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
        }
}
module.exports = {play, stop, unpause, pause};
