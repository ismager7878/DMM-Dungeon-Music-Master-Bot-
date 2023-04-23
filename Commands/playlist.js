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
    execute: async (message, bottools) => {
        const subcommand = message.options.getSubcommand();
        switch (subcommand) {
            case 'url':
                await message.deferReply({ ephemeral: true });
                addSong(message, bottools, message.options.getString('url'));
                break;
            case 'song_name':
                await message.deferReply({ ephemeral: true });
                const url = await ytsearch(message.options.getString('songname'), message).catch(async (err) => {
                    message.editReply("Song not found");
                    return;
                });
                addSong(message, bottools, url);
                break;
            case 'playlist':
                await message.deferReply({ ephemeral: true });
                add_playlist(message, bottools, message.options.getString('playlist_url'));;
                break;
        }
    }
}
export const queue = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the queue'),
    execute: async (message, bottools) => {
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
    execute: async (message, bottools) => {
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

    if(!validate(args, message)) return;

    if(args.startsWith("https://open.spotify.com")){
        const songlist = await fetchSpotifyTrack(args, message);
        const playlist = await formatToPlaylist(songlist, message);
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
        const playlist = await formatToPlaylist(songlist, message);
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
    execute: async (message, bottools) => {
        bottools.playlist = [];
        message.reply("Cleared the queue");
    }
}


export const shuffle = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue'),
    execute: async (message, bottools,) => {
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

const formatToPlaylist = async(songlist, message)=>{
    console.log(songlist)
    let index = 0
    const playlist = await Promise.all(songlist.map(async(track)=>{
        index++;
        message.editReply(`${index} of ${songlist.length} songs loaded`)
        console.log(track + 'track');
        const url = await ytsearch(track, message);
        const song = new Song(url);
        await song.initSong();
        return song;
    }));
    return playlist;
}

const addSong = async (message, bottools, url) => {
    const song = new Song(url);
        await song.initSong().then(() => {
            bottools.playlist.push(song);
            message.editReply(`${song.title} is added to the queue`);
        }).catch((err) => {
            message.editReply("Song not found");
        });
}