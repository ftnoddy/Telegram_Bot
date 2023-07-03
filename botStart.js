const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const bot = require("./bot"); // Import the bot module

const token = process.env.API_TOKEN;

const telegramBot = new TelegramBot(token, { polling: true });

telegramBot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  telegramBot.sendMessage(chatId, "Welcome to NODDY STORE 👽👽", {
    reply_markup: {
      inline_keyboard: [[{ text: "Add Info", callback_data: "add_info" }]],
    },
  });
});

// Add other event listeners if needed

console.log("Bot is running...");
