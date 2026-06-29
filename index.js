const {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("اختبار سرعة البوت")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("عرض جميع الأوامر")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("مسح الرسائل")
    .addIntegerOption(option =>
      option
        .setName("amount")
        .setDescription("عدد الرسائل")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .toJSON()
];

client.once(Events.ClientReady, async (c) => {
  console.log(`${c.user.tag} is online!`);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(c.user.id),
      { body: commands }
    );

    console.log("Slash commands registered!");
  } catch (error) {
    console.error(error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    return interaction.reply("🏓 Pong!");
  }

  if (interaction.commandName === "help") {
    return interaction.reply({
      embeds: [{
        color: 0xFFD700,
        title: "🤖 HZ BOT",
        description: "قائمة الأوامر",
        fields: [
          {
            name: "/ping",
            value: "اختبار سرعة البوت"
          },
          {
            name: "/help",
            value: "عرض جميع الأوامر"
          },
          {
            name: "/clear",
            value: "مسح الرسائل"
          }
        ],
        footer: {
          text: "HZ BOT"
        }
      }]
    });
  }

  if (interaction.commandName === "clear") {
    const amount = interaction.options.getInteger("amount");

    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: "❌ اختر عددًا من 1 إلى 100",
        ephemeral: true
      });
    }

    await interaction.channel.bulkDelete(amount, true);

    return interaction.reply({
      content: `✅ تم حذف ${amount} رسالة`,
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);
