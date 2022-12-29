import mineflayer from 'mineflayer'
import dotenv from 'dotenv'
import { SendWebhook, WebhookStarted, WebhookUserJoined } from './EmbedTemplates.js'
import { MCBot } from './MCBot.js'
import accounts from '../accounts.json' assert { type: "json" }

dotenv.config()

const bot = new MCBot(undefined, accounts.accounts[0].email, accounts.accounts[0].password, accounts.accounts[0].username, () => {})
console.log("connected!")