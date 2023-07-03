const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const token = process.env.API_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const userInputs = {}; // Object to store user inputs

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (msg.chat.type === "private") {
    if (messageText === "/start") {
      bot.sendMessage(chatId, "Welcome to NODDY STORE 👽👽", {
        reply_markup: {
          inline_keyboard: [[{ text: "Add Info", callback_data: "add_info" }]],
        },
      });
    }
  }
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "add_info") {
    bot.sendMessage(chatId, "Please enter your name:");
    userInputs[chatId] = {}; // Initialize user inputs object for the chat
    userInputs[chatId].step = "name"; // Set the current step to name input
  } else if (data === "shoes") {
    bot.sendMessage(chatId, "You selected Shoes 👟👞! Please choose a brand:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "RODESTAR", callback_data: "brand_rodestar" }],
          [{ text: "H&M", callback_data: "brand_hm" }],
          [{ text: "NIKE", callback_data: "brand_nike" }],
        ],
      },
    });
  } else if (data === "shirt") {
    userInputs[chatId].product = "Shirt";
    bot.sendMessage(chatId, "You selected Shirt! Please choose a brand:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "RODESTAR", callback_data: "brand_rodestar" }],
          [{ text: "H&M", callback_data: "brand_hm" }],
          [{ text: "NIKE", callback_data: "brand_nike" }],
        ],
      },
    });
  } else if (data.startsWith("brand_")) {
    const brand = data.replace("brand_", "");
    userInputs[chatId].brand = brand;
    const product = userInputs[chatId].product;
    const selectedBrand = userInputs[chatId].brand;

    bot.sendMessage(
      chatId,
      `You selected ${product} from ${selectedBrand}. Here are some options:`
    );

    const imagesWithPrices = getImagesWithPrices(selectedBrand);
    const inlineKeyboard = imagesWithPrices.map(({ image, price }) => (
      [{ text: price, callback_data: `select_${selectedBrand}_${image}` }]
    ));

    bot.sendMessage(chatId, 'Please select an image:', {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    });
}
else if (data.startsWith('brand_')) {
  const brand = data.replace('brand_', '');
  userInputs[chatId].brand = brand;
  const product = userInputs[chatId].product;
  const selectedBrand = userInputs[chatId].brand;

  bot.sendMessage(
    chatId,
    `You selected ${product} from ${selectedBrand}. Here are some options:`
  );

  const imagesWithPrices = getImagesWithPrices(selectedBrand);
  const inlineKeyboard = imagesWithPrices.map(({ image, price }) => (
    [{ text: price, callback_data: `select_${selectedBrand}_${image}` }]
  ));

  bot.sendMediaGroup(chatId, imagesWithPrices.map(({ image, price }) => (
    {
      type: 'photo',
      media: image,
      caption: `Price: ${price}`
    }
  )), {
    reply_markup: {
      inline_keyboard: inlineKeyboard
    }
  });
}
else if (data.startsWith('select_')) {
  const [_, selectedBrand, image] = data.split('_');
  userInputs[chatId].selectedBrand = selectedBrand;
  userInputs[chatId].image = image;

  const selectedProduct = userInputs[chatId].product;
  const selectedBrandImage = userInputs[chatId].selectedBrand;
  const selectedImage = userInputs[chatId].image;

  bot.sendMessage(chatId, `You selected ${selectedProduct} from ${selectedBrandImage}.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Confirm', callback_data: 'confirm' }],
        [{ text: 'Cancel', callback_data: 'cancel' }],
      ]
    }
  });
}
else if (data === 'confirm') {
    const selectedProduct = userInputs[chatId].product;
    const selectedBrand = userInputs[chatId].selectedBrand;
    const selectedImage = userInputs[chatId].image;

    bot.sendMessage(chatId, `Confirmed! You purchased ${selectedProduct} from ${selectedBrand} with image ${selectedImage}.`);

    // Clear user inputs
    delete userInputs[chatId];
  } else if (data === 'cancel') {
    bot.sendMessage(chatId, `Purchase canceled.`);
    
    // Clear user inputs
    delete userInputs[chatId];
  }
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (msg.chat.type === "private") {
    const step = userInputs[chatId]?.step;

    switch (step) {
      case "name":
        userInputs[chatId].name = messageText;
        bot.sendMessage(chatId, "Please enter your email:");
        userInputs[chatId].step = "email";
        break;
      case "email":
        userInputs[chatId].email = messageText;
        bot.sendMessage(chatId, "Please enter your phone number:");
        userInputs[chatId].step = "phone";
        break;
      case "phone":
        userInputs[chatId].phone = messageText;

        // Display the collected information
        const name = userInputs[chatId].name;
        const email = userInputs[chatId].email;
        const phone = userInputs[chatId].phone;

        bot.sendMessage(
          chatId,
          `Thank you for providing your information:
Name: ${name}
Email: ${email}
Phone: ${phone}`
        );

        // Offer product choices
        bot.sendMessage(
          chatId,
          `Information:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nPlease select a product:`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: "Shoes", callback_data: "shoes" }],
                [{ text: "Shirt", callback_data: "shirt" }],
              ],
            },
          }
        );

        userInputs[chatId].step = ""; // Reset the step
        break;
    }
  }
});

function getImagesWithPrices(brand) {
  // Replace with your logic to fetch images with prices for the given brand
  // Return an array of objects with properties `image` and `price`
  // Example:
  if (brand === "RODESTAR") {
    return [
      {
        image:
          "Images/noddy_pic.jpg",
        price: "$50",
      },
      {
        image:
          "https://tripends.com/image.php?image=/files/product_detail_image/image/527/roadster-men-shirts-1.jpg",
        price: "$60",
      },
      {
        image:
          "https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/1364628/2016/8/31/11472636737718-Roadster-Men-Blue-Regular-Fit-Printed-Casual-Shirt-6121472636737160-1.jpg",
        price: "$70",
      },
    ];
  } else if (brand === "H&M") {
    return [
      { image: "https://example.com/hm1.jpg", price: "$45" },
      { image: "https://example.com/hm2.jpg", price: "$55" },
      { image: "https://example.com/hm3.jpg", price: "$65" },
    ];
  } else if (brand === "NIKE") {
    return [
      { image: "https://example.com/nike1.jpg", price: "$80" },
      { image: "https://example.com/nike2.jpg", price: "$90" },
      { image: "https://example.com/nike3.jpg", price: "$100" },
    ];
  } else {
    return [];
  }
}
