const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
// const { MEMBERNAME, MEMBERROLES, ROLENAME, ROLEPOINTS } = require('../constLists');
/**
 * slash command for set monitor role
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('monitor')
        .setDescription('select roles for monitor'),
    async execute(interaction, period) {
        // if (interaction.guild.ownerId !== interaction.member.user.id) {
        //     interaction.reply("You dont have admin permission");
        //     return;
        // }
        if (!period) {
            interaction.reply("You must set the rule to arcue points");
            return;
        }
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('monitor')
                    .setPlaceholder('Selecte the monitoring roles')
                    .setMinValues(1)
                    .setMaxValues(4)
                    .addOptions([
                        {
                            label: 'Primay Role',
                            value: 'primary',
                        },
                        {
                            label: 'Junior Role',
                            value: 'junior',
                        },
                        {
                            label: 'Senior Role',
                            value: 'senior',
                        },
                        {
                            label: 'Top Role',
                            value: 'top',
                        },
                    ]),
            );

        await interaction.reply({ content: 'Select the Roles you want to monitor!', components: [row] });
    }
};