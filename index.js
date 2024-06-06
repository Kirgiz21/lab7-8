import process from 'node:process';
import TelegramBot from 'node-telegram-bot-api';
import {logger} from './logger.js';
import {messageCounter} from './metrics.js';


const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const content = {username: msg.from.username, logged_message: msg.text};
    await logger.emit('log', content);
    messageCounter.inc();
    bot.sendMessage(chatId, `'${msg.text}' was logged`);
});
