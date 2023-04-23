import { SlashCommandBuilder } from '@discordjs/builders';
import { Database } from '../database.js';

export const help = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('How to use the bot'),
    execute: async (message, bottools) => {
        message.reply('help');
    }}

export const check = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('Check if server is online'),
    execute: async (message, bottools) => {
        Database.query();
    }
};