import { Client, Collection ,GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';
import {command_table} from './Tools/command_table.js';
import {BotTool} from './Tools/bottool.js';
import fs from 'node:fs';
import path from 'node:path';
import {dirname} from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'))


for (const file of command_table){
    const filePath = path.join(commandsPath, file)
    console.log(filePath);
    const command = await import(filePath);
    command.default();
    console.log(command);
    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command); 
    }else {
		console.log(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}

}

client.once("ready", () => {
    console.log("Ready!");
});

client.login(process.env.BotToken);

client.on(Events.InteractionCreate, interaction => {
    if(!interaction.isChatInputCommand()) return;

    console.log(interaction);
})

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

    const currentBot = bottools.filter((e) => e.guild == oldState.guild)[0];// Gets the bottools to for the relavant guild

    if(oldState.channelId == newState.channelId) return; //Checks if still in voicechannel 
    if(oldState.channelId == null) return; //Checks in it even attached to a voicechannel
    if(currentBot.connection == null) return; //Check if it has a connection assigned
    if(currentBot.connection._state.status == 'destroyed') return; //Checks if the connection is already destroyed(Happens when you use !stop)
    if(oldState.channel.members.size == 1){//Check if there was only one left
        currentBot.player.stop();
        currentBot.connection.destroy();
    };
});


