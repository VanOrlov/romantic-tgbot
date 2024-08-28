const TelegramBot = require('node-telegram-bot-api');

const mainBotToken = '7423935404:AAF7lOvxevKqb3PjrokqN0XnY8fCJUydQaI';
const adminBotToken = '7234297018:AAHnjgljqeBlzqIt8QuR9LGmE3c-41wtuTY';
const adminId = '1385423620';
const mainBot = new TelegramBot(mainBotToken, { polling: true });
const adminBot = new TelegramBot(adminBotToken, { polling: true });

const knownUsers = new Set();

mainBot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username || msg.chat.first_name;

  if (!knownUsers.has(chatId)) {
    knownUsers.add(chatId);
    adminBot.sendMessage(adminId, `<b>Новый пользователь:</b>\n@${username}\n<b>ID:</b> ${chatId}`, { parse_mode: 'HTML' });
  }

  mainBot.sendMessage(chatId, 'Добрый день! Что вас интересует?', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Записаться на примерку', callback_data: 'Записаться на примерку' },
        ],
        [
          { text: 'Узнать по размерам', callback_data: 'Узнать по размерам' },
        ],
        [
          { text: 'Подобрать платье', callback_data: 'Подобрать платье' }
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    },
  });
});

mainBot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const username = callbackQuery.message.chat.username || callbackQuery.message.chat.first_name;
  const data = callbackQuery.data;

  let response;

  switch (data) {
    case 'Записаться на примерку':
      response = 'Записаться на примерку';
      break;
    case 'Узнать по размерам':
      response = 'Узнать по размерам';
      break;
    case 'Подобрать платье':
      response = 'Подобрать платье';
      break;
    default:
      response = `Неизвестный выбор: ${data}`;
      break;
  }

  if(data == 'Записаться на примерку'){
    mainBot.sendMessage(chatId, `Вы можете записаться на примерку по <a href="https://b931104.yclients.com/company/866183/personal/select-time?o=m-1s13005649">ссылке</a>`, { parse_mode: 'HTML'}); //TODO: Вписать ссылку для YClients
    adminBot.sendMessage(adminId, `Пользователь @${username} выбрал: \n${response}`);
  }else{
    mainBot.sendMessage(chatId, `Спасибо за выбор, с вами в ближайшее время свяжется менеджер.`);
    adminBot.sendMessage(adminId, `Пользователь @${username} выбрал: \n${response}`);
  }
});

mainBot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username || msg.chat.first_name;
  const text = msg.text;

  if (text === '/start') {
    return;
  }
  mainBot.sendMessage(chatId, `Спасибо за выбор, с вами в близжайшее время свяжется менеджер.`);
  adminBot.sendMessage(adminId, `Пользователь @${username} отправил сообщение: \n<i>${text}</i>`, { parse_mode: 'HTML' });
});