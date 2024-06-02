const { SlashCommandBuilder } = require('discord.js');
let help = 
    "/monitor: select the roles to monitor\n" +
    "/arcuerule: select the rule to arcue points\n" + 
    "/mystatus: shows my rolepoints according to monitor roles\n" + 
    "/rolereport: shows every one's rolepoints according to monitor roles\n" +
    "/setup: add user's ethereum wallet address, solana wallet address and twitter address\n" +
    "/download: download all user's information";
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('help about commands'),
    async execute(interaction) {
        interaction.reply(help);
    },
};