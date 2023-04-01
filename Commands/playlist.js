import {Song} from "../song.js";

export const add = (bottools, message, args) => {
    const song = new Song(args[0]);
    bottools.playlist.push(song);
    message.reply("Added to queue");
}

export const queue = (bottools, message) => {
    if(bottools.playlist.length == 0){
        message.reply("No songs in queue");
        return;
    }
    message.reply(bottools.playlist.map((song, index) => `${index + 1}: ${song.title} \n`).join());
}