const {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder
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
    .setDescription("عرض جميع أوامر البوت")
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
    await interaction.reply("🏓 Pong!");
  }

  if (interaction.commandName === "help") {
    await interaction.reply({
      embeds: [
        {
          color: 0xFFD700,
          title: "🤖 HZ BOT",
          description: "قائمة الأوامر المتاحة",
          fields: [
            {
              name: "/ping",
              value: "اختبار سرعة البوت"
            },
            {
              name: "/help",
              value: "عرض جميع الأوامر"
            }
          ],
          footer: {
            text: "HZ BOT"
          }
        }
      ]
    });
  }
});

client.login(process.env.TOKEN);
