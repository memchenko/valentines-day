const http = require('http');
const { DEVICE_ENDPOINT } = require('../../../../constants/constants');

const TelegramBot = require('node-telegram-bot-api');

const token = '633707259:AAH7KSjTnRAUJtly1EXGwPDDwyRIHxQ6W0U';

const bot = new TelegramBot(token, { polling: true });

const states = {
    STARTED: 0,
    IDLE: 1,
    WAIT_WISH: 2,
    WAIT_PREDICTION: 3,
    WAIT_JOKE: 4,
    WAIT_HOROSCOPE: 5,
    GET_PREDICTION: 6,
    GET_WISH: 7,
    GET_HOROSCOPE: 8,
    GET_ZODIAC: 9,
};

const chatIds = {};

const commands = {
    RECORD_WISH: '/recwish',
    RECORD_PREDICTION: '/recpred',
    RECORD_JOKE: '/recjoke',
    GET_PREDICTION: '/pred',
    GET_WISH: '/wish',
    GET_HOROSCOPE: '/horoscope',
    GET_JOKE: '/joke',
    HELP: '/help',

    ZODIAC: {
        AQUARIUS: '/aqua',
        PISCES: '/pisc',
        ARIES: '/aries',
        TAURUS: '/taurus',
        GEMINI: '/gemini',
        CANCER: '/rak',
        LEO: '/leo',
        VIRGO: '/virgo',
        LIBRA: '/libra',
        SCORPIO: '/scorp',
        SAGITTARIUS: '/sagit',
        CAPRICORN: '/capri'
    },

    EXIT: '/выйти'
};

const getRandomText = (arr) => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const commandsText = `
  Список возможных свинокоманд:
  Записать пожелание: ${commands.RECORD_WISH}
  Записать предсказание: ${commands.RECORD_PREDICTION}
  Записать шутку: ${commands.RECORD_JOKE}
  Прослушать предсказание: ${commands.GET_PREDICTION}
  Прослушать пожелание: ${commands.GET_WISH}
  Прослушать гороскоп: ${commands.GET_HOROSCOPE}
  Прослушать шутку: ${commands.GET_JOKE}
  Список всех команд: ${commands.HELP}
`;

const greetingTexts = ['Здравствуй, дуруг!', 'Хрюветики!'];
const startText = `
  ${getRandomText(greetingTexts)} 🐷

  С моей помощью ты сможешь давать команды
  Санта Свину ☝

  ${commandsText}

  P.S. Команды типа "Прослушать ..." играют дорожку не сразу,
  а кладут в очередь. Если в очереди не будет дорожек, то
  твоя дорожка проиграется сразу 😉
`;

const commandNotFoundTexts = [
    'Не понимаю, что ты имеешь ввиду 😐',
    'Давай по сценарию. Меня такому не учили 🙈',
    'Ну ты чё...нормально же общались'
];

const commandSentTexts = [
  'Принял, жди последствий',
  'Слушаю и повинуюсь 👍',
  'Будет исполнено',
  'Опять работать... 😔'
];

const noCommandText = [
  'Не шути со мной. Я слежу за тобой 👀',
  'Ай-яй-яй ты отклоняешься от темы',
  'Тебе меня не провести',
  'Каков шалун 🐷 Я ожидал другого',
  'Это несмешная шутка 😑'
];

const waitingPhrases = [
  'Ок, отправь мне текст и я добавлю запись в очередь'
];
const getWaitingPhrase = () => `
  ${getRandomText(waitingPhrases)}

  Для отмены команды: ${commands.EXIT}
`;

// bot.on('audio', (msg) => {
//
// });

bot.on('text', (msg) => {
  const chatId = msg.chat.id;

  switch (chatIds[chatId]) {
      case states.WAIT_WISH: { break; }
      case states.WAIT_PREDICTION: { break; }
      case states.WAIT_JOKE: { break; }
      case states.WAIT_HOROSCOPE: { break; }
      default: {}
  }

 // process.send({ from, to, message, label, speaker });
});

const text = text => new RegExp(text);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (chatId in chatIds) {
    chatIds[chatId] = states.STARTED;
    bot.sendMessage(chatId, commandsText);
  } else {
    bot.sendMessage(chatId, startText)
  }
});

bot.onText(text(commands.RECORD_WISH), (msg) => {
  const chatId = msg.chat.id;

  if (chatIds[chatId] === states.IDLE) {
      chatIds[chatId] = states.WAIT_WISH;
      bot.sendMessage(chatId, getWaitingPhrase());
  } else {
      bot.sendMessage(chatId, getRandomText(noCommandText));
  }
});

bot.onText(text(commands.RECORD_PREDICTION), (msg) => {
    const chatId = msg.chat.id;

    if (chatIds[chatId] === states.IDLE) {
        chatIds[chatId] = states.WAIT_PREDICTION;
        bot.sendMessage(chatId, getWaitingPhrase());
    } else {
        bot.sendMessage(chatId, getRandomText(noCommandText));
    }
});

bot.onText(text(commands.RECORD_JOKE), (msg) => {
    const chatId = msg.chat.id;

    if (chatIds[chatId] === states.IDLE) {
        chatIds[chatId] = states.WAIT_PREDICTION;
        bot.sendMessage(chatId, getWaitingPhrase());
    } else {
        bot.sendMessage(chatId, getRandomText(noCommandText));
    }
});

bot.onText(text(commands.HELP), (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, commandsText);
});

bot.onText(text(commands.GET_HOROSCOPE), (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Сейчас получишь гороскоп, нигга');
});
