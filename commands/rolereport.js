const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

const { MEMBERNAME, MEMBERROLES, MEMBERID, ROLEPOINTS, ROLENAME } = require('../constLists');

/**
 * rolereport slash command for each user and role poitns for monitor role.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolereport')
        .setDescription('look up everyone'),
    async execute(interaction, membersList, monitorRoles) {
        if (!membersList.length) {
            interaction.reply("There is no members in your sever");
            return;
        }
        if (!monitorRoles.length) {
            interaction.reply("You must input monitor roles");
            return;
        }
        let reply = "";
        //sort members accroding to their name
        let noMember = true;
        for (let i = 0; i < monitorRoles.length; i++) {
            reply += `\nROLE NAME ${monitorRoles[i]}\n\n`;
            for (let j = 0; j < membersList.length; j++) {
                for (let k = 0; k < membersList[j][MEMBERROLES].length; k++) {
                    if (membersList[j][MEMBERROLES][k][ROLENAME] == monitorRoles[i]) {
                        reply += `${membersList[j][MEMBERNAME]}${membersList[j][MEMBERID]}, ${membersList[j][MEMBERROLES][k][ROLEPOINTS]}\n`;
                        noMember = false;
                        break;
                    }

                }
            }
            if (noMember) {
                reply += `There is no user who has ${monitorRoles[i]} role.\n`;
            }
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('download')
                    .setLabel('downLoad!')
                    .setStyle(ButtonStyle.Primary),
            );

        await interaction.reply({
            content: reply,
        });
    },
};