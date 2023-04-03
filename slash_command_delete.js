import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const rest = new REST({ version: '10' }).setToken(token);

// for guild-based commands
// rest.delete(Routes.applicationGuildCommand(process.env.AppId, process.env.TestGuildId, 'commandId'))
// 	.then(() => console.log('Successfully deleted guild command'))
// 	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(process.env.AppId, ''))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);