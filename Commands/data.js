import { SlashCommandBuilder } from '@discordjs/builders';
import { Database } from '../database.js';

export const check = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('Check if server is online'),
    execute: async (message, bottools) => {
        Database.connection.con
    }
};