const TelegramBot = require('node-telegram-bot-api');

const token = '';

const bot = new TelegramBot(token, { polling: true });

bot.on('audio', (msg) => {

});

bot.on('text', (msg) => {

});
