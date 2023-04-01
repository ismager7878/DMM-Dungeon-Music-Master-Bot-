import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import {command_table} from './command_table.js';
import { createAudioPlayer, AudioPlayerStatus} from '@discordjs/voice';

dotenv.config();


let bottools = {
    player: createAudioPlayer(),
    connection: null,
    playlist: [],
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
    ]});

client.once("ready", () => {
    console.log("Ready!");
});

client.login(process.env.BotToken);

client.on("messageCreate", async (message) => {  

    if(!message.content.startsWith("!")) return;
    const command = message.content.split(' ')[0].substring(1);
    const args = message.content.split(' ').slice(1);

    command_table[command]?.(bottools, message, args);
});

bottools.player.on(AudioPlayerStatus.Idle, () => {
    if (bottools.playlist.length > 0) {
        bottools.player.play(bottools.playlist.shift().resource);
    }
});
