import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with a pong to the user'),
    async execute(interaction){
        await interaction.reply('pong!');
    }
}