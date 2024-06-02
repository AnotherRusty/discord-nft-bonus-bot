const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('set you ether, solana wallet address and twitter address'),
    async execute(interaction) {
        const modal = new ModalBuilder()
			.setCustomId('ether')
			.setTitle('Add your wallet and twitter information');

		// Add components to modal

		// Create the text input components
		const etherWalletAddress = new TextInputBuilder()
			.setCustomId('etherWalletAddress')
		    // The label is the prompt the user sees for this input
			.setLabel("input eth wallet address")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);
		// An action row only holds one text input,
		// so you need one action row per text input.
		const solWalletAddress = new TextInputBuilder()
			.setCustomId('solWalletAddress')
		    // The label is the prompt the user sees for this input
			.setLabel("input sol wallet address")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);
		// so you need one action row per text input.
		const twitterAddress = new TextInputBuilder()
			.setCustomId('twitterAddress')
			.setLabel("input twitter address")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);
		const etherRolw = new ActionRowBuilder().addComponents(etherWalletAddress);
		const solRow = new ActionRowBuilder().addComponents(solWalletAddress);
		const twitterRow = new ActionRowBuilder().addComponents(twitterAddress);

		// Add inputs to the modal
		modal.addComponents(etherRolw);
		modal.addComponents(solRow);
		modal.addComponents(twitterRow);

		// Show the modal to the user
		await interaction.showModal(modal);
    },
};