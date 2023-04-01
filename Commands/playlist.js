import {Song} from "../Tools/song.js";
import { ytsearch } from "../Tools/search.js";
import ytpl from 'ytpl';
import { play } from "./basic_controlls.js";
import { fetchSpotifyTrack } from "../Tools/spotify_handler.cjs";

export const add = async (bottools, message, args) => {
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

export const queue = (bottools, message) => {
    if(bottools.playlist.length == 0){
        message.reply("No songs in queue, add some with !add <url> or !add <song name>");
        return;
    }
    message.reply(bottools.playlist.map((song, index) => `${index + 1}: ${song.title}`).join('\n'));
}

export const skip = (bottools, message) => {
    if(bottools.playlist.length == 0){
        message.reply("No songs in queue, add some with !add <url> or !add <song name>");
        return;
    }
    bottools.player.stop();
    message.reply(`Now playing: ${bottools.playlist[0].title}`);
    bottools.player.play(bottools.playlist.shift().resource);
}

export const addPlaylist = async (bottools, message, args) => {

    if(!validate(args, message)) return;

    if(args[0].startsWith("https://open.spotify.com")){
        const songlist = await fetchSpotifyTrack(args[0]);
        const playlist = await formatToPlaylist(songlist);
        bottools.playlist.push(...playlist);
        message.reply(`Added ${playlist.length} songs to the queue`);
    }else{
        const playlist = await createPlaylist(args, message);
        bottools.playlist.push(...playlist);
        message.reply(`Added ${playlist.length} songs to the queue`);
    }
    
}

export const playPlaylist = async (bottools, message, args) => {

    if(!validate(args, message)) return;

    if(args[0].startsWith("https://open.spotify.com")){
        const songlist = await fetchSpotifyTrack(args[0]);
        const playlist = await formatToPlaylist(songlist);
        bottools.playlist.unshift(...playlist);
    }else{
        const playlist = await createPlaylist(args, message)
        bottools.playlist.unshift(...playlist);
    }

    play(bottools, message, [bottools.playlist.shift().url]);

}

export const clear = (bottools, message) => {
    bottools.playlist = [];
    message.reply("Cleared the queue");
}

export const shuffle = (bottools, message) => {
    bottools.playlist = bottools.playlist.sort(() => Math.random() - 0.5);
    message.reply("Shuffled the queue");
}

const validate = (args, message) => {
    if(!args[0]){
        message.reply("Please link the playlist(or a song in the playlist) you want to add, with !addPlaylist <url> or !playPlaylist <url>");
        return false;
    }
    if(!args[0].startsWith("http")){
        message.reply("Please use a url to the playlist(or a song in it), it's not possible to search for a playlist");
        return false;
    };
    if(args.length > 1){
        message.reply("Please only one playlist at the time");
        return false;
    };
    if(args[0].includes("track")){
        message.reply("Please use a playlist, not a song");
        return false;
    }
    return true;
}

const createPlaylist = async (args, message) => {
    console.log(args);
    const id = args[0].split("list=")[1];
    const playlist = await ytpl(id);
    message.reply(`Loading ${playlist.items.length} songs from ${playlist.title}`);
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