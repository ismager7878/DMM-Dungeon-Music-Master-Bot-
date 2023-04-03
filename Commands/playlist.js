import {Song} from "../Tools/song.js";
import { ytsearch } from "../Tools/search.js";
import ytpl from 'ytpl';
import { queuePlay } from "./basic_controlls.js";
import { fetchSpotifyTrack } from "../Tools/spotify_handler.cjs";
import { SlashCommandBuilder } from "discord.js";

export const add = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add a song to the queue')
        .addSubcommand(subcommand =>
            subcommand.setName('url')
            .setDescription('Add a song with a url').addStringOption(
                option => option.setName('url').setDescription('Url of the song').setRequired(true)
        ))
        .addSubcommand(subcommand =>
            subcommand.setName('song_name')
            .setDescription('Add a song with a songname').addStringOption(
                option => option.setName('songname').setDescription('Name of the song').setRequired(true)
        ))
        .addSubcommand(subcommand =>
            subcommand.setName('playlist')
            .setDescription('Add a playlist').addStringOption(
                option => option.setName('playlist_url').setDescription('Url of the playlist').setRequired(true)
        )),
    execute: async (bottools, message, args) => {

        
        if(!args[0]){
            message.reply("Please tell me what you want to add with, !add <url> or !add <song name>");
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
            message.reply("Please only song at the time");
            return;
        }
    
        const song = new Song(url);
        await song.initSong().then(() => {
            bottools.playlist.push(song);
            message.reply(`${song.title} is added to the queue`);
        }).catch((err) => {
            message.reply("Song not found");
        });
    }
}
export const queue = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the queue'),
    execute: async (bottools, message) => {
        if(bottools.playlist.length == 0){
            message.reply("No songs in queue, add some with !add <url> or !add <song name>");
            return;
        }
        message.reply(bottools.playlist.map((song, index) => `${index + 1}: ${song.title}`).join('\n'));
    }
}
export const skip = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current song'),
    execute: async (bottools, message) => {
        if(bottools.playlist.length == 0){
            message.reply("No songs in queue, add some with !add <url> or !add <song name>");
            return;
        }
        bottools.player.stop();
        message.reply(`Now playing: ${bottools.playlist[0].title}`);
        bottools.player.play(bottools.playlist.shift().resource);
    }
}
export const add_playlist = async (message, bottools, args) => {
    await message.deferReply({ ephemeral: true});

    if(!validate(args, message)) return;

    if(args.startsWith("https://open.spotify.com")){
        const songlist = await fetchSpotifyTrack(args);
        const playlist = await formatToPlaylist(songlist);
        bottools.playlist.push(...playlist);
        await message.editReply(`Added ${playlist.length} songs to the queue`);
    }else{
        const playlist = await createPlaylist(args, message);
        bottools.playlist.push(...playlist);
        await message.editReply(`Added ${playlist.length} songs to the queue`);
    }
}
export const play_playlist = async (message, bottools, args) => {
    await message.deferReply({ ephemeral: true});

    if(!validate(args, message)) return;

    if(args.startsWith("https://open.spotify.com")){
        const songlist = await fetchSpotifyTrack(args, message);
        const playlist = await formatToPlaylist(songlist);
        bottools.playlist.unshift(...playlist);
    }else{
        const playlist = await createPlaylist(args, message)
        console.log(playlist);
        bottools.playlist.unshift(...playlist);
    }
    queuePlay(message, bottools);
}

export const clear = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the queue'),
    execute: async (bottools, message) => {
        bottools.playlist = [];
        message.reply("Cleared the queue");
    }
}


export const shuffle = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue'),
    execute: async (bottools, message) => {
        bottools.playlist = bottools.playlist.sort(() => Math.random() - 0.5);
        message.reply("Shuffled the queue");
    }
}

const validate = (args, message) => {
    if(!args.startsWith("http")){
        message.editReply("Please use a url to the playlist(or a song in it), it's not possible to search for a playlist");
        return false;
    };
    if(args.includes("track")){
        message.editReply("Please use a playlist, not a song");
        return false;
    }
    return true;
}

const createPlaylist = async (args, message) => {
    const id = args.split("list=")[1];
    const playlist = await ytpl(id);
    message.editReply(`Loading ${playlist.items.length} songs from ${playlist.title}`);
    let songs = playlist.items.map(async (item) => {
        const song = new Song(item.url);
        await song.initSong();
        return song;
    });
    songs = await Promise.all(songs);
    return songs;
}

const formatToPlaylist = async(songlist)=>{
    const playlist = await Promise.all(songlist.map(async(track)=>{
        const url = await ytsearch(track);
        const song = new Song(url);
        await song.initSong();
        return song;
    }));
    return playlist;
}