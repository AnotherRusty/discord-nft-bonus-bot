//set env variable
require('dotenv').config();
// const csv = require("fast-csv");
const path = require('node:path');
const fs = require('fs');


const {
    Client,
    GatewayIntentBits,
    Partials,
    Events,
    Collection,
} = require('discord.js');

const {
    MEMBERNAME,
    MEMBERROLES,
    MEMBERPOINTS,
    MEMBERID,
    ROLENAME,
    ROLECREATEDAT,
    ROLEPOINTS,
    ROLESTATUS,
    DISABLED,
    ABLED,
    MYSTATUS,
    ROLEREPORT,
    MONITOR,
    ETHWALLETADDRESS,
    TWITTERADDRESS,
    SOLWALLETADDRESS,
    DOWNLOAD
} = require("./constLists");

const servicePoint = require('./service/servicePoints.js');

const client = new Client({
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    partials: [
        Partials.User,
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
});
let membersList = new Array();
let monitorRoles = new Array();
let period, intervalID;

client.login(process.env.BOT_TOKEN);

client.on('ready', () => console.log('The Bot is ready!'));
// event handler when a bot received a msg
client.on('messageCreate', (msg) => {
    if (msg.content === "ping") {
        msg.reply("pong");
    }
});
//event handler when add or remove role
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    console.log("role updated");
    let date = new Date().getTime();
    let status;
    let initPoints = 0;
    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        status = "addRole";
    } else {
        status = "deleteRole";
    }
    const fetchedLogs = await oldMember.guild.fetchAuditLogs({});

    const roleAddLog = fetchedLogs.entries.first();
    if (!roleAddLog) return;
    const { executor, target, changes } = roleAddLog;
    let isUpdate = false;
    for (let i = 0; i < membersList.length; i++) {
        if (membersList[i][MEMBERNAME] === oldMember.user.username) {
            if (status === "addRole") {
                for (let j = 0; j < membersList[i][MEMBERROLES].length; j++) {
                    if (membersList[i][MEMBERROLES][j][ROLENAME] === changes[0].new[0].name) {
                        membersList[i][MEMBERROLES][j][ROLESTATUS] = ABLED;
                        membersList[i][MEMBERROLES][j][ROLECREATEDAT] = new Date().getTime();
                        isUpdate = true;
                        return;
                    }
                }
                if (!isUpdate) {
                    let newRole = new Object();
                    newRole[ROLENAME] = changes[0].new[0].name;
                    newRole[ROLECREATEDAT] = date;
                    newRole[ROLEPOINTS] = initPoints;
                    newRole[ROLESTATUS] = ABLED;
                    membersList[i][MEMBERROLES].push(newRole);
                    isUpdate = false;
                }


            }
            if (status === "deleteRole") {
                for (let j = 0; j < membersList[i][MEMBERROLES].length; j++) {
                    if (membersList[i][MEMBERROLES][j][ROLENAME] === changes[0].new[0].name) {
                        membersList[i][MEMBERROLES][j][ROLESTATUS] = DISABLED;
                        return;
                    }
                }
            }
            return;
        }
    }
});
//event handler when bot is reay to receive event
client.on(Events.ClientReady, async (client) => {
    let date = new Date().getTime();
    const guild = client.guilds.cache.get(process.env.GUILDID);
    let role = guild.roles.cache.find(role => role.name === "member");
    if (!role) return console.log("Role doesen't exist.");
    let res = await guild.members.fetch();
    // console.log(guild.ownerId)
    res.forEach((member) => {
        let memberlist = new Object();
        memberlist[MEMBERROLES] = new Array();
        let memberlist_role = new Object();
        memberlist[MEMBERID] = `#${member.user.discriminator}`;
        memberlist[MEMBERNAME] = member.user.username;
        memberlist_role[ROLENAME] = "member";
        memberlist_role[ROLECREATEDAT] = date;
        memberlist_role[ROLEPOINTS] = 0;
        memberlist_role[ROLESTATUS] = DISABLED;
        memberlist[MEMBERROLES].push(memberlist_role);
        memberlist[MEMBERPOINTS] = 0;
        membersList.push(memberlist);
    });
});
//event when new user join
client.on('guildMemberAdd', (member) => {
    console.log("new user joined");
    const joinResponse = `Hello **${member.user.username}**, welcome to: **${member.guild.name}**!`
    const guild = client.guilds.cache.get(process.env.GUILDID);
    let role = guild.roles.cache.find(role => role.name === "Member");
    if (!role) return console.log("Role doesen't exist.");
    member.roles.add(role);
    let channel = client.channels.cache.get("1084122444614348851");
    channel.send(joinResponse);
});

//interaction handler
client.on(Events.InteractionCreate, async interaction => {
    console.log("command inputed");
    // validate command
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    // execute command
    try {
        membersList.sort(function (member1, member2) {
            let x = member1[MEMBERNAME].toLowerCase();
            let y = member2[MEMBERNAME].toLowerCase();

            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });
        switch (interaction.commandName) {
            case MYSTATUS:
            case ROLEREPORT:
            case DOWNLOAD:
                await command.execute(interaction, membersList, monitorRoles);
                break;
            case MONITOR:
                await command.execute(interaction, period);
                break;
            default:
                await command.execute(interaction);
                break;
        }

    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.on(Events.InteractionCreate, async interaction => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    if (!interaction.isStringSelectMenu()) return;
    console.log(interaction.customId)
    if (interaction.customId == "monitor") {
        const selected = interaction.values;
        monitorRoles = selected.slice();
        let reply = "";
        if (monitorRoles.length) {
            reply += "YOU ARE NOW MONITORING THESE ROLES\n";
            for (let i = 0; i < monitorRoles.length; i++) {
                reply += `${monitorRoles[i]}\n`
            }
        } else {
            reply += "NO MONITORING ROLES SELECTED";
        }
        interaction.reply(reply);
    }
    if (interaction.customId == "points") {
        console.log("intervalID", intervalID);
        if (intervalID) {
            console.log("clear the timeinterval");
            clearInterval(intervalID);
        }
        period = parseInt(interaction.values[0]);
        intervalID = setInterval(() => {
            let present = new Date().getTime();
            servicePoint(membersList, present, period);
            console.log("====================================");
            console.log(`points role runs per ${period} time`);
        }, period)
        console.log("period", period);
        interaction.reply("acruing points started");
    }

});

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isModalSubmit()) return;
    let userIndex;
    for (let i = 0; i < membersList.length; i++) {
        if (membersList[i][MEMBERNAME] == interaction.user.username) {
            userIndex = i;
            break;
        }
    }
    // Get the data entered by the user
    const etherWalletAddress = interaction.fields.getTextInputValue('etherWalletAddress');
    const solWalletAddress = interaction.fields.getTextInputValue('solWalletAddress');
    const twitterAddress = interaction.fields.getTextInputValue('twitterAddress');
    membersList[userIndex][ETHWALLETADDRESS] = etherWalletAddress;
    membersList[userIndex][SOLWALLETADDRESS] = solWalletAddress;
    membersList[userIndex][TWITTERADDRESS] = twitterAddress;
    interaction.reply("Setup is finished");
});
//the following below connect the bot with commands
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}
