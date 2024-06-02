const { SlashCommandBuilder } = require('discord.js');
const { MEMBERNAME, MEMBERROLES, ROLENAME, ROLEPOINTS, MEMBERID, ETHWALLETADDRESS, SOLWALLETADDRESS, TWITTERADDRESS } = require('../constLists');
/**
 * this slash command execute current usernamee and each rolepoints.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mystatus')
        .setDescription('Information about me'),
    async execute(interaction, membersList, moniterRoles) {
        let currentUserName = interaction.user.username;
        let userIndex;
        if (!membersList.length) {
            interaction.reply("There is no members in your sever");
            return;
        }
        if (!moniterRoles.length) {
            interaction.reply("You must input monitor roles");
            return;
        }
        for (let i = 0; i < membersList.length; i++) {
            if (membersList[i][MEMBERNAME] === currentUserName) {
                userIndex = i;
                break;
            }
        }
        let reply = "";
        let isWalletSet = membersList[userIndex][ETHWALLETADDRESS] || membersList[userIndex][SOLWALLETADDRESS] ? true : false;
        if (!isWalletSet) {
            interaction.reply("Wallet address must be added to you");
            return;
        }
        for (let i = 0; i < membersList[userIndex][MEMBERROLES].length; i++) {
            if (moniterRoles.indexOf(membersList[userIndex][MEMBERROLES][i][ROLENAME]) >= 0) {
                reply += `ROLE NAME ${membersList[userIndex][MEMBERROLES][i][ROLENAME]}`;
                reply += "\n";
                reply += "\n";
                reply += `${currentUserName}${membersList[userIndex][MEMBERID]}, ${membersList[userIndex][MEMBERROLES][i][ROLEPOINTS]}`;
                reply += "\n";
                reply += "\n";
            }
        }
        if (!reply.length) {
            reply += "You have no any monitor role\n";
        }
        if (membersList[userIndex][ETHWALLETADDRESS]) {
            reply += `ETHWALLETADDRESS ${membersList[userIndex][ETHWALLETADDRESS]}\n`;
            reply += "\n";
        }
        if (membersList[userIndex][SOLWALLETADDRESS]) {
            reply += `SOLWALLETADDRESS ${membersList[userIndex][SOLWALLETADDRESS]}\n`;
            reply += "\n";
        }
        if (membersList[userIndex][TWITTERADDRESS]) {
            reply += `TWITTERADDRESS ${membersList[userIndex][TWITTERADDRESS]}\n`;
            reply += "\n";
        }
        await interaction.reply({
            content: reply
        });
    },
};