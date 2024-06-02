const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
/**
 * slash command for select the arcuing points logic.
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('arcuerule')
        .setDescription('Select Acrue Rule'),
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('points')
                    .setPlaceholder('Nothing selected')
                    .addOptions(
                        {
                            label: '1 pt per day',
                            value: '86400000',
                        },
                        {
                            label: '1 pt per houre',
                            value: '3600000',
                        },
                        {
                            label: '1 pt per minute',
                            value: '60000',
                        },
                    ),
            );

        await interaction.reply({ content: 'Selecte the monitoring rules!', components: [row] });
    }
};