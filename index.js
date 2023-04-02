import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import {command_table} from './Tools/command_table.js';
import {BotTool} from './Tools/bottool.js';

dotenv.config();


let bottools = [];


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.GuildMembers,
    ]});

client.once("ready", () => {
    console.log("Ready!");
});

client.login(process.env.BotToken);

client.on("messageCreate", async (message) => {  
    if(!message.content.startsWith("!")) return;

    if(!message.member.voice.channel){
        message.reply("You need to be in a voice channel to use me:)");
        return;
    }

    if(!bottools.some((e) => e.guild == message.guild)){
        bottools.push(new BotTool(message.guild));
    }

    const command = message.content.split(' ')[0].substring(1);
    const args = message.content.split(' ').slice(1);

    command_table[command]?.(bottools.filter((e) => e.guild == message.guild)[0], message, args);
});

client.on("voiceStateUpdate", (oldState, newState) => {
    if(oldState.channelId == newState.channelId) return;
    if(oldState.channelId == null) return;
    if(bottools.filter((e) => e.guild == oldState.guild)[0].connection == null) return;
    console.log(oldState.channel.members.size);
    if(oldState.channel.members.size == 1){
        bottools.filter((e) => e.guild == newState.guild)[0].player.stop();
        bottools.filter((e) => e.guild == newState.guild)[0].connection.destroy();
    };
});


