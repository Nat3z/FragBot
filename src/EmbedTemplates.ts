import { EmbedBuilder } from "discord.js"

export const WebhookUserJoined = (botname: string, username: string, queue: number, est: string) => {
  let embed = new EmbedBuilder()
    .setTitle(`${username} has joined the queue.`)
    .setAuthor({ "name": `${botname} - User Joined!`, iconURL: `https://mc-heads.net/head/${botname}`})
    .setThumbnail(`https://mc-heads.net/head/${username}`)
    .setDescription(`Queue Placement: **${queue}**\nEstimated Time: \`${est}\``)
  return embed
}

export const BotDespawned = (username: string) => {
  let embed = new EmbedBuilder()
    .setAuthor({ "name": `${username} - Shutdown`, iconURL: `https://mc-heads.net/head/${username}`})
    .setThumbnail(`https://mc-heads.net/head/${username}`)
    .setDescription(`This Frag Bot has been automatically shutdown for inactivity. Please run </deploy:1057734695128928276> to reinitalize a frag bot.`)
  return embed
}


export const WebhookStarted = (username: string) => {
  let embed = new EmbedBuilder()
    .setAuthor({ "name": `${username} - Started`, iconURL: `https://mc-heads.net/head/${username}`})
    .setThumbnail(`https://mc-heads.net/head/${username}`)
    .setDescription(`Now available for queue. Run ingame,\n\`/p ${username}\` to join the queue.`)
  return embed
}

export async function SendWebhook(webhookData: string) {
  const res = await fetch(process.env.DISCORD_WEBHOOK!, {
    method: "POST",
    headers: {
        'Content-type': 'application/json'
    },
    body: webhookData
  })

  return [ res.ok, await res.text() ]
}