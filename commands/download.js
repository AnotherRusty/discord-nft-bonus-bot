const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createObjectCsvWriter } = require('csv-writer');
const serviceRolePoints = require('../service/serviceRolePoints');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('download')
        .setDescription('download the informatio'),
    async execute(interaction, membersList, monitorRoles) {
        if (!membersList.length) {
            interaction.reply("There is no members in your sever");
            return;
        }
        if (!monitorRoles.length) {
            interaction.reply("You must input monitor roles");
            return;
        }
        let [headers, datas] = serviceRolePoints(membersList, monitorRoles);
        const csvWriter = createObjectCsvWriter({ path: 'data.csv', header: headers });
        await csvWriter.writeRecords(datas);
        const file = new AttachmentBuilder('./data.csv');
        await interaction.reply({
            files: [file]
        });

    },
};