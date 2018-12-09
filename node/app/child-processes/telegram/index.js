const TelegramBot = require('node-telegram-bot-api');

const token = '633707259:AAH7KSjTnRAUJtly1EXGwPDDwyRIHxQ6W0U';

const bot = new TelegramBot(token, { polling: true });

bot.on('audio', (msg) => {

});

//bot.on('text', (msg) => {
//  process.send({ from, to, message, label, speaker });
//});

bot.onText(/\/wish/, (msg, matches) => {
  console.log('Got message');

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Желаю тебе всего наилучшего');
});
