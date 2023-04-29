import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders';
import { Database } from '../database.js';
import { command_table } from '../Tools/command_table.js';

const command_descriptions_full = [
    'To check database status',
    'If you want to pause the music',
    "Use this commands to play a music. Subcommads:\n- '/play link <Song URL>' Play song from URL,\n- '/play search <Song name> plays song from song name,\n- '/play playlist <Playlist URL>' Adds the playlist to the top of the queue and starts playing,\n- '/play queue' Starts playing the queue",
    'Unpauses the music, if paused',
    'Stops the music, and disconnects the bot',
    "Adds songs to queue. Subcommands:\n- '/add url <URL>' adds a song from a URL,\n- '/add search <Song name>' Add a song to from song name,\n- '/add playlist <Playlist URL>' Add a playlist from a URL to the bottom of the queue",
    'Shows the queue',
    'Skips the current song',
    'Clears the queue',
    'Shuffels the queue',
    'Shows and explains all commands',
]

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
                    return {name: `/${e.data.name}`, value: command_descriptions_full[command_table.indexOf(e)], inline: false}
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