const TelegramBot = require('node-telegram-bot-api');

const token = '633707259:AAH7KSjTnRAUJtly1EXGwPDDwyRIHxQ6W0U';

const bot = new TelegramBot(token, { polling: true });

const commands = [
  '/записать_пожелание',
  '/записать_предсказание',
  '/прослушать_предсказание',
  '/прослушать_пожелание',
  '/просмотреть_гороскоп ',
];
var wishes = [];

bot.on('audio', (msg) => {

});

//bot.on('text', (msg) => {
//  process.send({ from, to, message, label, speaker });
//});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
});

bot.onText(/\/wish/, (msg, matches) => {
  console.log('Start server');

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Желаю тебе всего наилучшего');
});

bot.onText(/\/гороскоп/, (msg, match) => {
  console.log('Запрос гороскопа')

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Сейчас получишь гороскоп, нигга');
});
