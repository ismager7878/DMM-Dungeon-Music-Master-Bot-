const { SlashCommandBuilder } = require("discord.js");

const test = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with a pong to the user'),
    async execute(interaction){
        await interaction.reply('pong!');
    }
}

module.exports = {test}