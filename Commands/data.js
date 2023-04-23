import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { Database } from '../database.js';
import { command_table } from '../Tools/command_table.js';

export const help = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('How to use the bot'),
    execute: async (message, bottools) => {
        const embed = new EmbedBuilder()
            .setTitle('What am i?')
            .setAuthor({ name: 'Dungeon Music Master', iconURL: 'https://i.imgur.com/g8lAO6t.png'})
            .setDescription('Hi, im a bot that plays music, like all the other bots. BUT i also got special features, to make running an online D&D session a breze. Under here i will list all the commands you can use.')
            .addFields(
                command_table.map((e) => {
                    return {name: `/${e.data.name}`, value: e.data.description, inline: false}
                })
            )
        message.reply({ embeds: [embed] });
    }}
        

export const check = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('Check if server is online'),
    execute: async (message, bottools) => {
        Database.query();
    }
};