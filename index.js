const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios')


const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "سلام\nبه بات ایزیپیپس خوش آمدید\nبرای ثبت تحلیل /a را وارد کنید");

});

bot.on('photo', (msg) => {
    const chatId = msg.chat.id
    const file_id = msg.photo[0].file_id
    console.log(msg)
    // console.log(msg.photo[0].file_id)
    // bot.sendPhoto(chatId , msg.photo[0].file_id)
    // bot.sendMediaGroup(chatId , [ب
    //     {
    //         type: 'photo',
    //         media: `https://hackernoon.com/hn-images/0*xMaFF2hSXpf_kIfG.jpg`,
    //     },
    //     {
    //         type: 'photo',
    //         media: `https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/4b1d6da4-a748-4b2e-b39a-d98d842aa976/user-testing-usability-test-circle.png`,
    //         caption : `asdfasdf
    //         adsfasdfasd
    //         adsfasdfasdf
    //         dasfasdfa
    //         adsfasdf
    //         afdssadfsadf
    //         dsafsadfasdf
    //         asdfsafdas`
    //     }
    // ])
    // bot.getFile(msg.photo[0].file_id).then(({ file_path }) => {


    //     // const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`
    //     // bot.sendDocument(chatId , file_path)
        
    // })

});

bot.onText(/\/a/, (msg, match) => {
    bot.sendMessage(msg.chat.id, `جفت ارز مورد نظر خود را انتخاب کنید`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'EURUSD', callback_data: 'EURUSD' }, { text: 'GBPUSD', callback_data: 'GBPUSD' }],
                [{ text: 'بازگشت', callback_data: 'EURUSD' }]
            ],
            force_reply: true
        }
    })
})

bot.onText(/\/b/, (msg, match) => {
    bot.sendMessage(msg.chat.id, `جفت ارز مورد نظر خود را انتخاب کنید`).then((sentMessage) => {
        bot.onReplyToMessage(
            sentMessage.chat.id,
            sentMessage.message_id,
            reply => {
                console.log(123)
            }
        )
    })
})




// bot.command('a', (ctx) => {
//     var ctx2 = ctx.telegram.sendMessage(ctx.chat.id, `جفت ارز مورد نظر خود را انتخاب کنید`, {
//         reply_markup: {
//             inline_keyboard: [
//                 [{ text: 'EURUSD', callback_data: 'EURUSD' }, { text: 'GBPUSD', callback_data: 'GBPUSD' }],
//                 [{ text: 'بازگشت', callback_data: 'EURUSD' }]
//             ],
//             force_reply:true
//         }
//     }).then((teeee) =>{
//         // bot.answerCbQuery((cxt)=>{
//         //     console.log(answerCallbackQuery)
//         // })
//     }).catch((err)=>console.log(err))
// });

// bot.sendMessage(message.chat.id, `echo: ${text}`, {
//       reply_markup: JSON.stringify({ force_reply: true }),
//     })
//     .then(sentMessage => {
//       this.client.onReplyToMessage(
//         sentMessage.chat.id,
//         sentMessage.message_id,
//         reply => {
//           if (reply.text === 'stop') {
//             this.client.sendMessage(message.chat.id, 'Stopping')
//           } else {
//             this.respondToMessage(reply)
//           }
//         }
//       )
//     })

// const Telegraf = require('telegraf')

// const bot = new Telegraf('1185751578:AAHrhYYsGkYhob14hnZS9toJJJOdntn1yz8');

// let state;

// bot.start((ctx) => {
//     ctx.reply(`خوش آمدید. \nبرای وارد کردن تحلیل، a/ را وارد کنید`)
// });

// bot.command('a', (ctx) => {
//     var ctx2 = ctx.telegram.sendMessage(ctx.chat.id, `جفت ارز مورد نظر خود را انتخاب کنید`, {
//         reply_markup: {
//             inline_keyboard: [
//                 [{ text: 'EURUSD', callback_data: 'EURUSD' }, { text: 'GBPUSD', callback_data: 'GBPUSD' }],
//                 [{ text: 'بازگشت', callback_data: 'EURUSD' }]
//             ],
//             force_reply:true
//         }
//     }).then((teeee) =>{
//         // bot.answerCbQuery((cxt)=>{
//         //     console.log(answerCallbackQuery)
//         // })
//     }).catch((err)=>console.log(err))
// });

// bot.on('callback_query', (ctx) => {
//     const currency = ctx.update.callback_query.data
//     // ctx.deleteMessage()
//     ctx.reply('نقطه ورود را وارد کنید').then(()=> bot.onReplyToMessage('text' , ctx2 =>{
//         ctx2.reply('حد سود را وارد کنید').then(()=>{
//             console.log(34545)
//             bot.on('text' , ctx3 =>{
//                 console.log(123)
//                 ctx3.reply('حد ضرر را وارد کنید')
//             })
//         })

//     } ))

//   });

// // bot.action('EURUSD', (ctx) => {
// //     currencyClickAction('EURUSD', ctx)
// // })

// // bot.action('GBPUSD', (ctx) => {
// //     currencyClickAction('GBPUSD', ctx)
// // })

// // bot.on('text', (ctx) => {
// //     console.clear()
// //     const text = ctx.update.message.text;
// //         console.log(ctx.update.message.from)
// //         console.log(ctx.update.message.chat)

// // })

// bot.launch();

// function currencyClickAction(currency, ctx, options) {
//     deleteMessage(ctx)
//     sendMessage(`نقطه ورود (Entry Point) را وارد کنید`, ctx)
// }

// function sendMessage(text, ctx, options) {
//     ctx.telegram.sendMessage(ctx.chat.id, text, options)
// }

// function deleteMessage(ctx) {
//     ctx.deleteMessage()
// }
