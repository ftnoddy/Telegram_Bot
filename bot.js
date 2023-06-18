const TelegramBot = require('node-telegram-bot-api');
const token = process.env.API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

//   if (msg.chat.type === 'private'){
//     bot.sendMessage(chatId, 'Welcome to CP Office!')
//   }
  if (msg.chat.type === 'private') {
    if (messageText.toLowerCase().includes('movie')) {
      bot.sendMessage(chatId, 'Which language do you prefer?', {
        reply_markup: {
          inline_keyboard: [
            [
                { text: 'English', callback_data: 'movie_english' },
                { text: 'Hindi', callback_data: 'movie_hindi' },
                { text: 'Bengali', callback_data: 'movie_bengali' },
                {text: 'Telugu', callback_data: 'movie_telugu'}
              ],
          ]
        }
      });
    } else if (messageText === 'image') {
      bot.sendPhoto(chatId, 'https://example.com/image.jpg', { caption: 'Here is your image!' });
    } else if (messageText === 'music') {
      bot.sendAudio(chatId, 'Here is some information about music...');
    } else if (messageText === 'reels') {
      bot.sendMessage(chatId, 'Here is some information about reels...');
    } else {
      bot.sendMessage(chatId, 'Please select a valid category: image, music, movie, reels');
    }
  }
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const language = query.data;
    
    const languageOptions = {
      'movie_english': 'You selected English language for movie category.',
      'movie_hindi': 'You selected Hindi language for movie category.',
      'movie_bengali': 'You selected Bengali language for movie category.',
      'movie_telugu': 'You selected Telugu language for movie category.'
    };
    
    const message = languageOptions[language] || 'Invalid selection.';
    
    bot.sendMessage(chatId, message);
  });
  