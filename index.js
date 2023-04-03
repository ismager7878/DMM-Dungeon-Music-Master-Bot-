import { Collection, Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';
import {command_table} from './Tools/command_table.js';
import {BotTool} from './Tools/bottool.js';

dotenv.config();


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
const bottools = [];

for (const command of command_table){
    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command); 
    }else {
		console.log(`The command is missing a required "data" or "execute" property.`);
	}

}

client.once("ready", () => {
    console.log("Ready!");
});

client.login(process.env.BotToken);

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.member.voice.channel == null){
        interaction.reply("You need to be in a voice channel to use me:)");
        return;
    }

    if(!bottools.some((e) => e.guild == interaction.guild)){
        bottools.push(new BotTool(interaction.guild));
    }
    
    const command = client.commands.get(interaction.commandName);

    if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
    try {
		await command.execute(interaction, bottools.filter((e) => e.guild == interaction.guild)[0]);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
})

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


