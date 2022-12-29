import Discord, { EmbedBuilder, Events, REST, Routes, SlashCommandBuilder } from 'discord.js'
import { MCBot } from './MCBot.js'
import accounts from '../accounts.json' assert { type: "json" }
import dotenv from 'dotenv'
dotenv.config()

const bot = new Discord.Client({ intents: [ "GuildMembers", "MessageContent", "GuildMessages", "Guilds" ]})
const SpawnedBots = new Map<string, MCBot>()

let fragbots: { password: string, email: string, username: string }[] = accounts.accounts

const removeQueue = (name: string) => {
  SpawnedBots.delete(name)
}
function SpawnBot(): [ boolean, MCBot? ] {
  let success = false
  let botCreated: MCBot | undefined = undefined
  for (const account of fragbots) {
    if (!SpawnedBots.has(account.email)) {
      const mcbot = new MCBot(bot, account.email, account.password, account.username, removeQueue)
      botCreated = mcbot
      SpawnedBots.set(account.email, mcbot)
      console.log("🏝️ Spawned new bot!")
      success = true
      break
    }
  }

  return [ success, botCreated ]
}


const startBotCommand = new SlashCommandBuilder()
  .setName("deploy")
  .setDescription("Deploy a FragBot to Hypixel")

const listBots = new SlashCommandBuilder()
  .setName("list")
  .setDescription("Get a list of Frag Bots")
  
bot.on(Events.InteractionCreate, interaction => {
  if (!interaction.isChatInputCommand()) return

  // start command 
  if (interaction.commandName === startBotCommand.name) {
    let [success, bot] = SpawnBot()
    if (!success) {
      interaction.reply("❌ Failed to deploy a bot. No bots are available.")
    } else {
      interaction.reply("✅ Successfully deployed bot!")
    }
  }

  // list command
  if (interaction.commandName === listBots.name) {

    let embed = new EmbedBuilder()
      .setAuthor({ iconURL: "https://cdn.discordapp.com/avatars/1056006961583374447/b3c6cc909260d408ad55d7b07fb37dd1.webp?size=100", name: "List of FragBots" })
 
    fragbots.map((bot) => {
      embed = embed.addFields({ name: bot.username, value: SpawnedBots.has(bot.email) ? "`⚡ Active`" : "`✅ Available`", inline: true })
    })

    interaction.reply({ embeds: [ embed ] })
  }
})


const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

try {
  const data = await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
    { body: [ startBotCommand.toJSON(), listBots.toJSON() ] },
  );

  console.log(`Successfully reloaded application (/) commands.`);
} catch (error) {
  console.error(`❌ Failed to register Slash Commands`)
  console.error(error)
}

bot.login(process.env.DISCORD_TOKEN)

console.log("Logged into bot!")