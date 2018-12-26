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

const getUser = () => ({
    isAdmin: false,
    state: states.STARTED
});

const chatIds = {};

const commands = {
    RECORD_WISH: '/rwish',
    RECORD_PREDICTION: '/rpred',
    RECORD_JOKE: '/rjoke',
    GET_PREDICTION: '/pred',
    GET_WISH: '/wish',
    GET_HOROSCOPE: '/horos',
    GET_JOKE: '/joke',

    ZODIAC: {
        AQUARIUS: '/aquar',
        PISCES: '/pisce',
        ARIES: '/aries',
        TAURUS: '/tauru',
        GEMINI: '/gemin',
        CANCER: '/rak',
        LEO: '/leo',
        VIRGO: '/virgo',
        LIBRA: '/libra',
        SCORPIO: '/scorp',
        SAGITTARIUS: '/sagit',
        CAPRICORN: '/capri'
    },

    SERVICE: {
        HELP: '/help',
        EXIT: '/exit',
    }
};

const getRandomText = (arr) => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const commandsText = `
Список возможных свинокоманд:
Записать пожелание: ${commands.RECORD_WISH}
Записать предсказание: ${commands.RECORD_PREDICTION}
Прослушать предсказание: ${commands.GET_PREDICTION}
Прослушать пожелание: ${commands.GET_WISH}
Прослушать гороскоп: ${commands.GET_HOROSCOPE}
Список всех команд: ${commands.SERVICE.HELP}
`;

const horoscopeCommands = `
Выбери знак зодиака:
♈ Овен: ${commands.ZODIAC.ARIES}
♉ Телец: ${commands.ZODIAC.TAURUS}
♊ Близнецы: ${commands.ZODIAC.GEMINI}
♋ Рак: ${commands.ZODIAC.CANCER}
♌ Лев: ${commands.ZODIAC.LEO}
♍ Дева: ${commands.ZODIAC.VIRGO}
♎ Весы: ${commands.ZODIAC.LIBRA}
♏ Скорпион: ${commands.ZODIAC.SCORPIO}
♐ Стрелец: ${commands.ZODIAC.SAGITTARIUS}
♑ Козерог: ${commands.ZODIAC.CAPRICORN}
♒ Водолей: ${commands.ZODIAC.AQUARIUS}
♓ Рыбы: ${commands.ZODIAC.PISCES}
`;

const greetingTexts = ['Здравствуй, дуруг!', 'Хрюветики!'];
const startText = `
${getRandomText(greetingTexts)} 🐷

С моей помощью ты сможешь давать команды Санта Свину ☝

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
  'Опять работать... Ладно, сделаю 🐷'
];

const noCommandText = [
  'Не шути со мной. Я слежу за тобой 👀',
  'Ай-яй-яй ты отклоняешься от темы',
  'Тебе меня не провести',
  'Каков шалун 🐷 Я ожидал другого',
  'Это несмешная шутка 😑',
  'Хорош заигрывать со мной. Давай по делу 😑'
];

const deviceUnavailTexts = [
  'Упс, что-то пошло не так. Свиньюшка молчит 😶',
  'Давай в другой раз. Свинье сейчас плохо 🤢',
  'Твою команду не могу отправить сейчас я. Ошибка это',
  'Хмхмхм не могу исполнить сейчас',
  'Сорян, сейчас не получится'
];

const waitingPhrases = [
  'Отправь мне текст и я добавлю запись в очередь'
];

const requestPhrases = [
  'Это займет некоторое время, так что не паникуй, скоро вернусь с вестями 😉',
  'Сейчас сбегаю до свиньи - посмотрю, здорова ли, а пото сразу вернусь к тебе 😌',
  'Понял тебя! Подожди, надо проверить свиньюшку 🐖'
];

const exitPhrases = [
  'Ок',
  'Действие успешно отменено',
  'Как скажешь 👌',
  'Хорошо'
];

const getWaitingPhrase = () => `
${getRandomText(waitingPhrases)}

Для отмены команды: ${commands.SERVICE.EXIT}
`;

// bot.on('audio', (msg) => {
//
// });

const text = text => new RegExp(text);

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (chatId in chatIds) {
    bot.sendMessage(chatId, commandsText);
  } else {
    chatIds[chatId] = getUser();
    bot.sendMessage(chatId, startText)
  }
});

bot.onText(text(commands.SERVICE.HELP), (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, commandsText);
});

bot.onText(/\/toggledmin/, (msg) => {
    const chatId = msg.chat.id;

    chatIds[chatId].isAdmin = !chatIds[chatId].isAdmin;

    bot.sendMessage(chatId, 'admin');
});

bot.onText(/\/calibrate steps=(\d+?) dir=(0|1)/, (msg, matches) => {
    const chatId = msg.chat.id;
    const steps = matches[1];
    const dir = matches[2];

    if (!chatIds[chatId].isAdmin) {
        bot.sendMessage(chatId, 'Нет прав');
        return;
    }

    http.get(`${DEVICE_ENDPOINT}/cacalibrate/head?steps=${steps}&dir=${dir}`, (res) => {
        if (res.statusCode !== 200) throw new Error('Device is unavail');
        bot.sendMessage(chatId, 'Ок');
    }).on('error', (err) => {
        bot.sendMessage(chatId, 'Не доступна');
        console.error(err);
    });
});

bot.onText(/\/config .+/, (msg) => {
    const chatId = msg.chat.id;

    if (!chatIds[chatId].isAdmin) {
        bot.sendMessage(chatId, 'Нет прав');
        return;
    }

    const text = msg.text;
    const stepAmpl = text.match(/stepAm=(\d+)?/);
    const stepSpeed = text.match(/stepSpeed=(\d+)?/);
    const stepSwAmpl = text.match(/stepSwAmpl=(\d+)?/);
    const stepSwSpeed = text.match(/stepSwSpeed=(\d+)?/);
    const lMinAngle = text.match(/lMinAngle=(\d+)?/);
    const rMinAngle = text.match(/rMinAngle=(\d+)?/);
    const lMaxAngle = text.match(/lMaxAngle=(\d+)?/);
    const rMaxAngle = text.match(/rMaxAngle=(\d+)?/);
    const armSpeed = text.match(/armSpeed=(\d+)?/);
    const armInterval = text.match(/armInterval=(\d+)?/);

    const params = stepAmpl === null ? '' : 'stepAmpl=' + stepAmpl +
      stepSpeed === null ? '' : '&stepSpeed=' + stepSpeed +
      stepSwAmpl === null ? '' : '&stepSwAmpl=' + stepSwAmpl +
      stepSwSpeed === null ? '' : '&stepSwSpeed=' + stepSwSpeed +
      lMinAngle === null ? '' : '&lMinAngle=' + lMinAngle +
      rMinAngle === null ? '' : '&rMinAngle=' + rMinAngle +
      lMaxAngle === null ? '' : '&lMaxAngle=' + lMaxAngle +
      rMaxAngle === null ? '' : '&rMaxAngle=' + rMaxAngle +
      armSpeed === null ? '' : '&armSpeed=' + armSpeed +
      armInterval === null ? '' : '&armInterval=' + armInterval;

    http.get(`${DEVICE_ENDPOINT}/coconfig?${params}`, (res) => {
        if (res.statusCode !== 200) throw new Error('Device is unavail');
        bot.sendMessage(chatId, 'Ок');
    }).on('error', (err) => {
        bot.sendMessage(chatId, 'Не доступна');
        console.error(err);
    });
});

bot.onText(text(commands.RECORD_WISH), (msg) => {
  const chatId = msg.chat.id;

  if (chatIds[chatId] === states.IDLE || chatIds[chatId] === states.STARTED) {
      chatIds[chatId].state = states.WAIT_WISH;
      bot.sendMessage(chatId, getWaitingPhrase());
  } else {
      bot.sendMessage(chatId, getRandomText(noCommandText));
  }
});

bot.onText(text(commands.RECORD_PREDICTION), (msg) => {
    const chatId = msg.chat.id;

    if (chatIds[chatId] === states.IDLE || chatIds[chatId] === states.STARTED) {
        chatIds[chatId].state = states.WAIT_PREDICTION;
        bot.sendMessage(chatId, getWaitingPhrase());
    } else {
        bot.sendMessage(chatId, getRandomText(noCommandText));
    }
});

bot.onText(text(commands.GET_WISH), (msg) => {
  const chatId = msg.chat.id;
  const state = chatIds[chatId].state;

  if (state === states.IDLE || state === states.STARTED) {
    bot.sendMessage(chatId, getRandomText(requestPhrases));
    http.get(DEVICE_ENDPOINT + '/play/wish', (res) => {
      if (res.statusCode !== 200) throw new Error('Device is unavail');
      bot.sendMessage(chatId, getRandomText(commandSentTexts));
    }).on('error', (err) => {
      bot.sendMessage(chatId, getRandomText(deviceUnavailTexts));
      console.error(err);
    });
  } else {
    bot.sendMessage(chatId, getRandomText(noCommandText));
  }
});

bot.onText(text(commands.GET_PREDICTION), (msg) => {
  const chatId = msg.chat.id;
  const state = chatIds[chatId].state;

  if (state === states.IDLE || state === states.STARTED) {
    bot.sendMessage(chatId, getRandomText(requestPhrases));
    http.get(DEVICE_ENDPOINT + '/play/prediction', (res) => {
      if (res.statusCode !== 200) throw new Error('Device is unavail');
      bot.sendMessage(chatId, getRandomText(commandSentTexts));
    }).on('error', (err) => {
      bot.sendMessage(chatId, getRandomText(deviceUnavailTexts));
      console.error(err);
    });
  } else {
    bot.sendMessage(chatId, getRandomText(noCommandText));
  }
});

bot.onText(text(commands.GET_HOROSCOPE), (msg) => {
  const chatId = msg.chat.id;
  const state = chatIds[chatId].state;

  if (state === states.IDLE || state === states.STARTED) {
    chatIds[chatId].state = states.WAIT_HOROSCOPE;
    bot.sendMessage(chatId, horoscopeCommands);
  } else {
    bot.sendMessage(chatId, getRandomText(noCommandText));
  }
});

bot.on('text', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!(chatId in chatIds) && text !== '/start') {
        chatIds[chatId] = getUser();
        bot.sendMessage(
          chatId,
`Это, конечно, очень по-свински, но я забыл тебя. Что, говоришь, хочешь?

${commandsText}
`
        );
        return;
    }

    if (chatIds[chatId].isAdmin) {
        return;
    }

    if ((new RegExp('^' + commands.SERVICE.EXIT + '$')).test(text)) {
        chatIds[chatId].state = states.SERVICE.EXIT;
        bot.sendMessage(chatId, getRandomText(exitPhrases));
        return;
    }

    if ((new RegExp('^' + commands.SERVICE.HELP + '$')).test(text)) {
        return;
    }

    if (Object.values(commands).some((command) => {
          const isObj = typeof command === 'object';
          if (isObj && (command === commands.ZODIAC)) return false;
          if (isObj && (command === commands.SERVICE)) return false;
          return (new RegExp(command)).test(text);
      })) {
        return;
    }

    const state = chatIds[chatId].state;
    const label = (state === states.WAIT_WISH && 'Пожелание') ||
      (state === states.WAIT_PREDICTION && 'Предсказание') ||
      (state === states.WAIT_JOKE && 'Шутка') || '';

    switch (state) {
        case states.WAIT_WISH:
        case states.WAIT_PREDICTION:
        case states.WAIT_JOKE: {
            process.send({ message: text, label });
            chatIds[chatId].state = states.IDLE;
            bot.sendMessage(chatId, getRandomText(commandSentTexts));
            break;
        }
        case states.WAIT_HOROSCOPE: {
            const reText = '^(' + Object.values(commands.ZODIAC).join(')$|^(') + ')$';
            const regex = new RegExp(reText);
            if (regex.test(text)) {
                bot.sendMessage(chatId, getRandomText(requestPhrases));
                http.get(DEVICE_ENDPOINT + '?zodiac=' + text.slice(1), (res) => {
                    if (res.statusCode !== 200) throw new Error('Device is unavail');
                    bot.sendMessage(chatId, getRandomText(commandSentTexts));
                })
                  .on('error', (err) => {
                      bot.sendMessage(chatId, getRandomText(deviceUnavailTexts));
                      console.error(err);
                  });
                chatIds[chatId].state = states.IDLE;
            } else {
                bot.sendMessage(chatId, getRandomText(noCommandText));
            }
            break;
        }
        default: {
            bot.sendMessage(chatId, getRandomText(commandNotFoundTexts));
        }
    }
});
