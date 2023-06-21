const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token =  process.env.API_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const userInputs = {}; // Object to store user inputs

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (msg.chat.type === 'private') {
    if (messageText === '/start') {
      bot.sendMessage(chatId, 'Welcome to NODDY STORE 👽👽', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Add Info', callback_data: 'add_info' }]]
        }
      });
    }
  }
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'add_info') {
    bot.sendMessage(chatId, 'Please enter your name:');
    userInputs[chatId] = {}; // Initialize user inputs object for the chat
    userInputs[chatId].step = 'name'; // Set the current step to name input
  }
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (msg.chat.type === 'private') {
    const step = userInputs[chatId]?.step;

    switch (step) {
      case 'name':
        userInputs[chatId].name = messageText;
        bot.sendMessage(chatId, 'Please enter your email:');
        userInputs[chatId].step = 'email';
        break;
      case 'email':
        userInputs[chatId].email = messageText;
        bot.sendMessage(chatId, 'Please enter your phone number:');
        userInputs[chatId].step = 'phone';
        break;
      case 'phone':
        userInputs[chatId].phone = messageText;

        // Display the collected information
        const name = userInputs[chatId].name;
        const email = userInputs[chatId].email;
        const phone = userInputs[chatId].phone;

        bot.sendMessage(chatId, `Thank you for providing your information:
Name: ${name}
Email: ${email}
Phone: ${phone}`);

        // Clear user inputs
        delete userInputs[chatId];
        break;
      default:
        // Handle other messages or inputs
    }
  }
});
