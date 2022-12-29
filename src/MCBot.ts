import { Channel, Client, TextChannel } from 'discord.js'
import mineflayer from 'mineflayer'
import { BotDespawned, SendWebhook, WebhookStarted, WebhookUserJoined } from './EmbedTemplates.js'

export class MCBot {
  public bot: mineflayer.Bot
  public queue: string[] = []
  public userInParty = ""
  public inParty = false

  private lastRequest = 0
  constructor(discordBot: Client | undefined, username: string, password: string, username_ign: string, setQueue: (username: string) => void) {
    this.bot = mineflayer.createBot({
      host: 'mc.hypixel.net',
      username: username,
      
      password: password,
      version: "1.8.9",
      auth: "microsoft",
    })
    let fragbotchannel: TextChannel | undefined
    if (discordBot)
      discordBot.channels.fetch(process.env.FRAG_BOT_CHANNEL!).then(channel => {
        fragbotchannel = channel as TextChannel
      })

    this.bot.on("message", (JSONMsg) => {
      const msg = JSONMsg.toString()
      if (msg.includes("has invited you to join their party!") && !msg.includes(":")) {
        let username = msg.split(" ")[1]
        if (username === "has") {
          username = msg.split(" ")[0].split("\n")[1]
        }
        const queuePlacement = this.queue.length + 1
        this.queue.push(username)
    
        const estimatedTime = queuePlacement * 2 + "s"
        
        if (fragbotchannel) fragbotchannel!.send({ embeds: [ WebhookUserJoined(this.bot.username, username, queuePlacement, estimatedTime) ]})
        this.lastRequest = Math.round(Date.now() / 1000)
        console.log("❗ Added " + username + " to queue.")
      }
    
      if (!msg.includes(':') && (msg.includes('You cannot join this Dungeon!') || msg.includes('Your active Potion Effects have been paused'))) {
        this.LeaveParty()
      }
    })

    const queueInt = setInterval(async () => {
      if (this.inParty) await (async () => new Promise(resolve => setTimeout(() => {
        resolve(undefined)
      }, 1000)))()
      
      if (this.queue.length === 0 || this.inParty) return
      const user = this.queue[0]
      this.userInParty = user
      this.JoinParty(user)
      this.queue.splice(0, 1)
    }, 1000) 
    
    const queueLeave = setInterval(() => {
      if (this.inParty) {
        this.inParty = false
        setTimeout(() => {
          this.LeaveParty()
        }, 3000);  
      }

    }, 1000)

    const checkQueue = setInterval(() => {
      if (Math.round(Date.now() / 1000) - this.lastRequest > 600) {
        console.log("🗑️ Despawned Bot")
        if (fragbotchannel) fragbotchannel!.send({ embeds: [ BotDespawned(this.bot.username) ] })
        this.bot._client.end()
        setQueue(username)
        clearInterval(queueInt)
        clearInterval(queueLeave)
        clearInterval(checkQueue)
      }
    }, 2 * 60 * 1000)

    setTimeout(() => {
      if (fragbotchannel) fragbotchannel!.send({ embeds: [ WebhookStarted(username_ign) ]})
    }, 4000)
  }
  public LeaveParty() {
    this.bot.chat("/p leave")
    this.bot.chat("/hub")
    console.log("✅ Completed Queue for " + this.userInParty)
    this.inParty = false
  }

  public JoinParty(username: string) {
    this.bot.chat("/p accept " + username)
    console.log("❗ User has 6 seconds before leaving party.")
    this.inParty = true
  }
  

}