require('dotenv').config() // це ми отримуэм доступ до глобальной змінной яка зараз в нас це токен, ми для цього використовуємо бібліотеку dotenv
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy') // це ми пыдключили вже самого бота точныше быблыотеку для нього і використовуємо я так розумію її базовий клас


const bot = new Bot(process.env.BOT_API_KEY); // це ми створили екземпляр класа ы передали йому в якосты параметра токе бота


bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Show help text" },
  { command: "settings", description: "Open settings" },
  { command: "mood", description: "Open keyboard test1" },
  { command: "opinion", description: "Open keyboard test2" },
  { command: "share", description: "Open keyboard test3" },
  { command: "inline_keyboard", description: "Open keyboard test4" },
]);

bot.command(['start', 'syperStart', 'megaStart'], async (ctx) => { // прописуєм обробник подій на команду старт, перший аргумент це команда інший це асинхронна функція, а в якосьі аргумента отримує ctx = context
    await ctx.reply(" привіт, шо ти? <a href='google.com'>тут в нас гугул</a>", {
        parse_mode: 'HTML',
        reply_parameters: {message_id: ctx.message.message_id}
    }); // відповідь
}) 
bot.command("help", async (ctx) => {
  await ctx.reply("відповідь на твою команду");
});
bot.command("mood", async (ctx) => {
    const moodKeyboard = new Keyboard().text("топ").row().text("норм").row().text('фигня').resized().oneTime();
    await ctx.reply("як ти?", {
      reply_markup: moodKeyboard
  });
});

bot.command("opinion", async (ctx) => {
    const opinionLabels = ["топ", "норм", "фигня"];
    const rows = opinionLabels.map((label) => {
        return [
            Keyboard.text(label)
        ]
    })
    const opinionKeyboard = Keyboard.from(rows).resized().oneTime();
    await ctx.reply("як тобі я?", {
      reply_markup: opinionKeyboard
    });
});

bot.command('share', async (ctx) => {
    const shareKeyboard = new Keyboard().requestLocation("Локація").row().requestContact("Контакт").row().requestPoll("Опитування").resized().oneTime();
    await ctx.reply("Чим хочеш поділитись?", {
        reply_markup: shareKeyboard
    })
})
bot.command('inline_keyboard', async(ctx) => {
    const inlineKeyboard = new InlineKeyboard()
      .text("label1", "anserLabel1")
      .text("label2", "anserLabel2")
      .text("label3", "anserLabel3")
      .text("label4", "anserLabel4")
      .text("label5", "anserLabel5")
    await ctx.reply(
      "Вибери варіант який відповідає твоїм внутрішнім принципам",
      {
        reply_markup: inlineKeyboard,
      }
    );
})
bot.callbackQuery(
  ["anserLabel1", "anserLabel2", "anserLabel3", "anserLabel4", "anserLabel5"],
    async (ctx) => {
        await ctx.answerCallbackQuery();
    await console.log(ctx.match);
      await ctx.reply(
        `дякую що обрав варіант це дуже важливий вибір кнопки ${ctx.match} і він вплине тупо на все все все....`
      );
  }
);


// :contact = message:contact
bot.on(':contact', async (ctx) => {
  await ctx.reply(
    "дякую за контакт"
  );
});
bot.on(":location", async (ctx) => {
  await ctx.reply("дякую, по тебе вже виїхали");
});
bot.on(":poll", async (ctx) => {
  await ctx.reply("да да попитай мене ще всяке я ж такий умний шо піпец");
});

bot.on('message:voice', async (ctx) => {
    await ctx.reply("а може ти не будеш мені голосові записувати, я ж все таки бот");
});
bot.on('message').filter((ctx) => {
    return ctx.message.text.toLocaleLowerCase().includes('рома');
}, async (ctx) => {
    await ctx.reply("<span class='tg-spoiler'> ну ти і мудак Рома </span>", {
      parse_mode: "HTML",
    });
})
bot.hears([/мразь/, /мудак/, /кончак/], async (ctx) => {
    ctx.reply('Сам такий, поняв?!')
})

bot.on('message', async (ctx) => {
    await ctx.reply('ага ага');
    await ctx.react('🐳');
})

 
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling apdate ${ctx.update.update_id}`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error('Could not contact to Telegram', e);
    } else {
        console.error('Unknown error', e);
    }
});

bot.start(); // запуск бота