import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { command_table } from './Tools/command_table.js';

dotenv.config();
const commands = [];

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const command of command_table) {
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.BotToken);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.AppId),
			{ body: commands },
		);
        // rest.delete(Routes.applicationGuildCommand(process.env.AppId, process.env.TestGuidId, 'commandId'))
	    //     .then(() => console.log('Successfully deleted guild command'))
	    //     .catch(console.error);

        // for global commands
        rest.delete(Routes.applicationCommand(process.env.AppId, '1092215687830847586'))
	        .then(() => console.log('Successfully deleted application command'))
	        .catch(console.error);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();