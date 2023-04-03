
import {Song} from "../Tools/song.js";
import {joinVoiceChannel} from '@discordjs/voice';
import { ytsearch } from "../Tools/search.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";
import { add_playlist, play_playlist } from "./playlist.js";

export const ping = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping!')
        .addStringOption(option => 
            option.setName('url')
            .setDescription('Url of the song'))
        .addStringOption(option =>
            option.setName('songname')
            .setDescription('Name of the song'))
        .addStringOption(option =>
            option.setName('queue')
            .setDescription('Play from queue')),
    execute: async (interaction, bottool) => {

        const input = interaction.options.getString('input');
        const songname = interaction.options.getString('songname');
        const queue = interaction.options.getString('queue');

        const playlist = bottool.playlist;
        interaction.reply(`${playlist.length} songs in queue, input is:${input}, songname is:${songname}, queue is:${queue}`);
    }
}

export const pause = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause song'),
    execute: async (message) => {
        message.reply('Pong!');
    },
}
export const unpause = {
    data: new SlashCommandBuilder()
        .setName('unpause')
        .setDescription('Unpause song'),
    execute: async (message, bottools) => {
        bottools.player.unpause();
        message.reply('Song unpause');
    }
}
export const stop = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop song'),
    execute: async (message, bottools) => {
        await bottools.player.stop();
        bottools.connection.destroy();
    }
}
export const play = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from link, search or queue')
        .addSubcommand(subcommand =>
            subcommand.setName('link')
            .setDescription('Play a song from link')
            .addStringOption(option =>
                option.setName('url')
                .setDescription('Url of the song')
                .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('search')
            .setDescription('Play a song from search')
            .addStringOption(option =>
                option.setName('song_name')
                .setDescription('Name of the song')
                .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('queue')
            .setDescription('Play from queue'))
        .addSubcommand(subcommand =>
            subcommand.setName('playlist')
            .setDescription('Play from playlist')
            .addStringOption(option =>
                option.setName('playlist_url')
                .setDescription('Url of the playlist')
                .setRequired(true))),
    execute: async (message, bottools) => {
        const voiceChannel = message.member.voice.channel;

        bottools.connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        bottools.connection.subscribe(bottools.player);
        switch(message.options.getSubcommand()){
            case 'link':
                urlPlay(message.options.getString('url'), message, bottools);
            break;
            case 'search':
                searchPlay(message.options.getString('songname'), message, bottools);
            break;
            case 'queue':
                await message.deferReply({ ephemeral: true});
                queuePlay(message, bottools);
            break;
            case 'playlist':
                play_playlist(message, bottools ,message.options.getString('playlist_url'));
            break;
        } 
    }
};

const searchPlay = async (args, message, bottools) => {
    await message.reply("Searching for song...",{ ephemeral: true});
    const url = await ytsearch(args).catch(async (err) => {
        console.log(err);
        await message.reply("Song not found");
        return;
    })
    startSong(message, bottools, url);
};

const urlPlay = async (url, message, bottools) => {
    await message.deferReply({ ephemeral: true});
    startSong(message, bottools, url);
}

export const queuePlay = async (message, bottools) => {
    if(bottools.playlist.length == 0){
        await message.editReply("Your queue is empty, add a song with /add");
        return;
    }
    if(AudioPlayerStatus.Playing == bottools.player.state.status){
        await message.editReply("Already playing a song, add a song with /add,");
        return;
    }
    await message.editReply(`Now playing: ${bottools.playlist[0].title}`);
    bottools.player.play(bottools.playlist.shift().resource);
}

export const startSong = async (message, bottools, url) => {
    const song = new Song(url);
    await song.initSong().then(async () => {
        bottools.player.play(song.resource);
        await message.editReply(`Now playing: ${song.title}`);
    }).catch(async(err) => {
        await message.editReply("Song not found");
    });
}
